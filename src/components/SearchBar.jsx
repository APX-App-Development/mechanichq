import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Search, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SearchBar({ onSearch, isLoading, large = false, showPartTypeToggle = false }) {
  const [query, setQuery] = useState('');
  const [partType, setPartType] = useState('oem');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    const searchQuery = showPartTypeToggle ? `${query} ${partType}` : query;
    
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      navigate(createPageUrl('SearchResults') + `?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`relative ${large ? 'max-w-4xl' : 'max-w-2xl'} mx-auto`}>
        {/* AI Badge */}
        {large && (
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-orange-600 to-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
              <Sparkles className="w-3 h-3" />
              AI-Powered Search
            </div>

            {showPartTypeToggle && (
              <div className="flex items-center bg-[#1a1a1a] border border-[#333] rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setPartType('oem')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    partType === 'oem'
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  OEM
                </button>
                <button
                  type="button"
                  onClick={() => setPartType('aftermarket')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    partType === 'aftermarket'
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Aftermarket
                </button>
              </div>
            )}
          </div>
        )}
        
        <div className="relative">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder={large 
              ? `Describe what you need...\n\nExamples:\n• "Front brake pads for 2019 Ford F-150"\n• "Spark plugs for 2021 Toyota Camry 2.5L"\n• "Water pump for 2018 Honda Accord"`
              : 'Search for parts...'
            }
            className={`w-full bg-[#1a1a1a] text-white placeholder-gray-500 border-2 border-[#333] rounded-2xl focus:ring-4 focus:ring-orange-500/30 focus:border-orange-500 resize-none transition-all duration-200 ${
              large 
                ? 'min-h-[110px] pt-4 pb-16 px-4 text-sm leading-snug placeholder:text-xs' 
                : 'h-12 py-3 pl-12 pr-4'
            }`}
          />
          
          {!large && (
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          )}
          
          <div className={`absolute ${large ? 'top-4 right-4' : 'right-2 top-1/2 -translate-y-1/2'}`}>

            <Button
              type="submit"
              disabled={isLoading || !query.trim()}
              className={`bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg shadow-orange-500/25 transition-all duration-200 active:scale-[0.97] ${
                large ? 'h-14 px-8 text-base rounded-xl tap-target' : 'h-10 px-4 rounded-lg tap-target'
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Search Parts
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}