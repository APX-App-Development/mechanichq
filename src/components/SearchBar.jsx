import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
      <div className={`relative flex items-center ${large ? 'max-w-3xl' : 'max-w-2xl'} mx-auto`}>
        <div className="relative flex-1">
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 ${large ? 'w-6 h-6' : 'w-5 h-5'}`} />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='ex: front brakes 2017 Ford F-150 or "spark plugs 2022 Toyota Camry 2.5L"'
            className={`w-full bg-white text-gray-900 border-0 rounded-l-xl rounded-r-none focus-visible:ring-2 focus-visible:ring-[#e31e24] ${
              large ? 'h-16 pl-14 pr-4 text-lg' : 'h-12 pl-12 pr-4'
            }`}
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading || !query.trim()}
          className={`bg-[#e31e24] hover:bg-[#c91a1f] text-white font-semibold rounded-l-none rounded-r-xl transition-all duration-200 ${
            large ? 'h-16 px-8 text-lg' : 'h-12 px-6'
          }`}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Search className="w-5 h-5 mr-2" />
              Search
            </>
          )}
        </Button>
      </div>
    </form>
  );
}