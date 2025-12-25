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
    <div className="min-h-screen bg-[#111] px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Briefcase className="w-7 h-7 text-orange-500" />
            My Jobs
          </h1>
          <p className="text-gray-400 mt-1">Track your repair projects and parts lists</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white font-medium text-lg mb-2">No jobs yet</h3>
            <p className="text-gray-400 text-sm">Save parts from search results to create a job</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => {
              const StatusIcon = statusIcons[job.status];
              return (
                <Card key={job.id} className="bg-[#1a1a1a] border-[#333] overflow-hidden">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={statusColors[job.status]}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {job.status?.replace('_', ' ')}
                          </Badge>
                        </div>
                        <h3 className="text-white font-semibold text-lg">{job.name}</h3>
                        {job.vehicle_info && (
                          <div className="flex items-center gap-2 mt-1">
                            <Car className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-400 text-sm">{job.vehicle_info}</span>
                          </div>
                        )}
                        <p className="text-gray-500 text-xs mt-2">
                          Created {format(new Date(job.created_date), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(job.id)}
                        className="text-gray-500 hover:text-red-500 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Parts List */}
                    {job.parts && job.parts.length > 0 && (
                      <div className="bg-[#222] rounded-xl p-4 mb-4">
                        <p className="text-gray-400 text-xs uppercase tracking-wide mb-3">
                          Parts ({job.parts.length})
                        </p>
                        <div className="space-y-2">
                          {job.parts.map((part, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <p className="text-white text-sm truncate">{part.part_name}</p>
                                <p className="text-gray-500 text-xs font-mono">#{part.oem_part_number}</p>
                              </div>
                              <span className="text-orange-500 font-medium">
                                ${part.msrp_price?.toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#333]">
                          <span className="text-gray-400 text-sm flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            Estimated Total
                          </span>
                          <span className="text-white font-bold text-lg">
                            ${job.estimated_cost?.toFixed(2) || '0.00'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* AI Recommendations */}
                    {job.parts && job.parts.length > 0 && (
                      <div className="mb-4">
                        {!recommendations[job.id] && !loadingRecs[job.id] ? (
                          <Button
                            onClick={() => getRecommendations(job)}
                            variant="outline"
                            className="w-full border-[#444] text-white hover:bg-[#222] hover:border-orange-500"
                          >
                            <Sparkles className="w-4 h-4 mr-2 text-orange-500" />
                            Get AI Part Recommendations
                          </Button>
                        ) : loadingRecs[job.id] ? (
                          <div className="bg-[#222] rounded-xl p-4 flex items-center justify-center">
                            <Loader2 className="w-5 h-5 text-orange-500 animate-spin mr-2" />
                            <span className="text-gray-400 text-sm">Analyzing parts list...</span>
                          </div>
                        ) : recommendations[job.id]?.length > 0 ? (
                          <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/30 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <Sparkles className="w-4 h-4 text-orange-500" />
                              <span className="text-white font-medium text-sm">AI Recommended Parts</span>
                            </div>
                            <div className="space-y-2">
                              {recommendations[job.id].map((rec, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => handleSearchRecommendation(rec.part_name)}
                                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg p-3 text-left hover:border-orange-500 transition-all group"
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <p className="text-white text-sm font-medium group-hover:text-orange-500 transition-colors">
                                          {rec.part_name}
                                        </p>
                                        <Badge className={`text-xs ${
                                          rec.priority === 'essential' ? 'bg-red-500/20 text-red-400' :
                                          rec.priority === 'recommended' ? 'bg-orange-500/20 text-orange-400' :
                                          'bg-blue-500/20 text-blue-400'
                                        }`}>
                                          {rec.priority}
                                        </Badge>
                                      </div>
                                      <p className="text-gray-400 text-xs">{rec.reason}</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-orange-500 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    )}

                    {/* Status Actions */}
                    <div className="flex gap-2 flex-wrap">
                      {job.status === 'planned' && (
                        <Button
                          onClick={() => handleStatusChange(job, 'in_progress')}
                          className="bg-amber-500 hover:bg-amber-600 text-black"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Start Job
                        </Button>
                      )}
                      {job.status === 'in_progress' && (
                        <Button
                          onClick={() => handleStatusChange(job, 'completed')}
                          className="bg-green-500 hover:bg-green-600 text-black"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}