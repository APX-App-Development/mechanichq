import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Wrench, Clock, DollarSign, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function QuickJobs() {
  const navigate = useNavigate();

  const quickJobs = [
    {
      name: 'Oil Change',
      description: 'Replace engine oil and oil filter',
      time: '30-45 min',
      cost: '$30-50',
      difficulty: 'Easy',
      icon: '🛢️',
      searchQuery: 'engine oil oil filter'
    },
    {
      name: 'Brake Pads',
      description: 'Replace front or rear brake pads',
      time: '1-2 hours',
      cost: '$150-300',
      difficulty: 'Medium',
      icon: '🔴',
      searchQuery: 'brake pads'
    },
    {
      name: 'Spark Plugs',
      description: 'Replace spark plugs for better performance',
      time: '1 hour',
      cost: '$60-150',
      difficulty: 'Easy',
      icon: '⚡',
      searchQuery: 'spark plugs'
    },
    {
      name: 'Battery Replacement',
      description: 'Install new battery',
      time: '15-30 min',
      cost: '$100-200',
      difficulty: 'Easy',
      icon: '🔋',
      searchQuery: 'battery'
    },
    {
      name: 'Air Filter',
      description: 'Replace engine air filter',
      time: '10-15 min',
      cost: '$20-40',
      difficulty: 'Easy',
      icon: '💨',
      searchQuery: 'engine air filter'
    },
    {
      name: 'Cabin Air Filter',
      description: 'Replace cabin air filter',
      time: '10-15 min',
      cost: '$15-30',
      difficulty: 'Easy',
      icon: '🌬️',
      searchQuery: 'cabin air filter'
    },
    {
      name: 'Wiper Blades',
      description: 'Replace windshield wiper blades',
      time: '10-20 min',
      cost: '$20-50',
      difficulty: 'Easy',
      icon: '🧹',
      searchQuery: 'wiper blades'
    },
    {
      name: 'Coolant Flush',
      description: 'Drain and replace engine coolant',
      time: '1-2 hours',
      cost: '$80-150',
      difficulty: 'Medium',
      icon: '❄️',
      searchQuery: 'coolant radiator fluid'
    }
  ];

  const handleJobClick = (job) => {
    navigate(createPageUrl('SearchResults') + `?q=${encodeURIComponent(job.searchQuery)}`);
  };

  const difficultyColors = {
    'Easy': 'bg-green-500/20 text-green-400',
    'Medium': 'bg-orange-500/20 text-orange-400',
    'Hard': 'bg-red-500/20 text-red-400'
  };

  return (
    <div className="min-h-screen bg-black px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[#FF6B35] font-bold text-xl mb-2">Quick Jobs</h1>
          <h2 className="text-white font-semibold text-2xl mb-2">Quick Jobs for Your Vehicle</h2>
          <p className="text-gray-500 text-sm">Common maintenance tasks with OEM parts and guides</p>
        </div>

        {/* Jobs Grid */}
        <div className="space-y-3">
          {quickJobs.map((job, index) => (
            <button
              key={index}
              onClick={() => handleJobClick(job)}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 text-left hover:border-[#FF6B35] transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#2a2a2a] rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:bg-[#FF6B35]/20 transition-colors">
                  {job.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-medium">{job.name}</h3>
                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-[#FF6B35] transition-colors" />
                  </div>
                  <p className="text-gray-500 text-sm mb-2">{job.description}</p>
                  
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 text-gray-400">
                      <Clock className="w-3 h-3" />
                      {job.time}
                    </span>
                    <span className="flex items-center gap-1 text-gray-400">
                      <DollarSign className="w-3 h-3" />
                      {job.cost}
                    </span>
                    <Badge className={`${difficultyColors[job.difficulty]} border-0 text-xs`}>
                      {job.difficulty}
                    </Badge>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}