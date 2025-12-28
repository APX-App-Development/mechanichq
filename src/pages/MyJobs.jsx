import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Briefcase, Trash2, Loader2, Car, CheckCircle, Clock, Play, ChevronRight, DollarSign, Sparkles, Plus, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function MyJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState({});
  const [loadingRecs, setLoadingRecs] = useState({});

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await base44.entities.Job.list('-created_date');
      setJobs(data);
    } catch (err) {
      console.error('Error loading jobs:', err);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await base44.entities.Job.delete(id);
      toast.success('Job deleted');
      loadJobs();
    } catch (err) {
      toast.error('Failed to delete job');
    }
  };

  const handleStatusChange = async (job, newStatus) => {
    try {
      await base44.entities.Job.update(job.id, { status: newStatus });
      toast.success(`Job marked as ${newStatus.replace('_', ' ')}`);
      loadJobs();
    } catch (err) {
      toast.error('Failed to update job');
    }
  };

  const getRecommendations = async (job) => {
    if (recommendations[job.id] || loadingRecs[job.id]) return;
    
    setLoadingRecs(prev => ({ ...prev, [job.id]: true }));
    
    try {
      const partsList = job.parts?.map(p => p.part_name).join(', ') || '';
      
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Based on this automotive repair job: "${job.name}" with these parts: ${partsList}
        
Recommend 3-5 related or commonly needed parts to complete this repair. Think about:
- Tools that would be needed
- Consumables like fluids, grease, cleaners
- Complementary parts often replaced together
- Safety items

Return recommendations as a JSON array of parts with reasoning.`,
        response_json_schema: {
          type: "object",
          properties: {
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  part_name: { type: "string" },
                  reason: { type: "string" },
                  priority: { type: "string", enum: ["essential", "recommended", "optional"] }
                }
              }
            }
          }
        }
      });

      setRecommendations(prev => ({ ...prev, [job.id]: result.recommendations || [] }));
    } catch (err) {
      console.error('Failed to get recommendations:', err);
    }
    
    setLoadingRecs(prev => ({ ...prev, [job.id]: false }));
  };

  const handleSearchRecommendation = (partName) => {
    navigate(createPageUrl('SearchResults') + `?q=${encodeURIComponent(partName)}`);
  };

  const statusColors = {
    planned: 'bg-blue-500/20 text-blue-400',
    in_progress: 'bg-amber-500/20 text-amber-400',
    completed: 'bg-green-500/20 text-green-400'
  };

  const statusIcons = {
    planned: Clock,
    in_progress: Play,
    completed: CheckCircle
  };

  return (
    <div className="min-h-screen bg-black px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-[#FF6B35] text-lg font-semibold mb-4">My Jobs</h1>
          <div className="mb-6">
            <h2 className="text-white text-xl font-bold mb-1">Repair Jobs</h2>
            <p className="text-gray-500 text-sm">Track parts and organize your repairs</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#FF6B35] animate-spin" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-white font-bold text-xl mb-3">No Jobs Yet</h3>
            <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto">
              Create your first job to organize parts and track repair progress
            </p>
            <Button className="bg-[#FF6B35] hover:bg-[#E85D2A] text-white rounded-xl px-6">
              <Plus className="w-4 h-4 mr-2" />
              Create Job
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => {
              const StatusIcon = statusIcons[job.status];
              const priorityColors = {
                'Easy': 'bg-green-500 text-white',
                'Medium': 'bg-[#FF6B35] text-white',
                'Hard': 'bg-red-500 text-white'
              };
              return (
                <div key={job.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-[#FF6B35] rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Wrench className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-bold text-base mb-1">{job.name}</h3>
                      <p className="text-gray-500 text-xs">{job.vehicle_info || 'Replace engine oil and oil filter'}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1 text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>30-45 min</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <DollarSign className="w-3 h-3" />
                      <span>${job.estimated_cost?.toFixed(0) || '30'}-50</span>
                    </div>
                    <Badge className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-md">
                      Easy
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(job.id)}
                    className="absolute top-4 right-4 text-gray-600 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>


              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}