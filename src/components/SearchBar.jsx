import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Search, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SearchBar({ onSearch, isLoading, large = false }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    if (onSearch) {
      onSearch(query);
    } else {
      navigate(createPageUrl('SearchResults') + `?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`relative ${large ? 'max-w-4xl' : 'max-w-2xl'} mx-auto`}>
        {/* AI Badge */}
        {large && (
          <div className="absolute -top-3 left-4 z-10 flex items-center gap-1.5 bg-gradient-to-r from-[#e31e24] to-[#ff4444] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
            <Sparkles className="w-3 h-3" />
            Powered by Claude AI
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
              ? `Describe what you need in plain English...\n\nExamples:\n• "Front brake pads and rotors for my 2019 Ford F-150 3.5L EcoBoost"\n• "I need spark plugs for a 2021 Toyota Camry 2.5L - what's the OEM part number?"\n• "Water pump replacement parts for 2018 Honda Accord"`
              : 'Search for parts...'
            }
            className={`w-full bg-white text-gray-900 border-0 rounded-2xl focus:ring-4 focus:ring-[#e31e24]/30 resize-none ${
              large 
                ? 'min-h-[160px] pt-6 pb-20 px-5 text-lg leading-relaxed' 
                : 'h-12 py-3 pl-12 pr-4'
            }`}
          />
          
          {!large && (
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          )}
          
          <div className={`absolute ${large ? 'bottom-4 right-4 left-4 flex items-center justify-between' : 'right-2 top-1/2 -translate-y-1/2'}`}>
            {large && (
              <p className="text-gray-400 text-sm">
                Press Enter to search
              </p>
            )}
            <Button
              type="submit"
              disabled={isLoading || !query.trim()}
              className={`bg-[#e31e24] hover:bg-[#c91a1f] text-white font-semibold shadow-lg shadow-[#e31e24]/25 transition-all duration-200 active:scale-[0.97] ${
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