import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { History, Trash2, Loader2, Search, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function SearchHistory() {
  const [searches, setSearches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSearches();
  }, []);

  const loadSearches = async () => {
    try {
      const data = await base44.entities.PartSearch.list('-created_date', 50);
      setSearches(data);
    } catch (err) {
      console.error('Error loading searches:', err);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await base44.entities.PartSearch.delete(id);
      toast.success('Search removed from history');
      loadSearches();
    } catch (err) {
      toast.error('Failed to remove search');
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear all search history?')) return;
    
    try {
      await Promise.all(searches.map(s => base44.entities.PartSearch.delete(s.id)));
      toast.success('Search history cleared');
      setSearches([]);
    } catch (err) {
      toast.error('Failed to clear history');
    }
  };

  return (
    <div className="min-h-screen bg-[#111] px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <History className="w-7 h-7 text-orange-500" />
              Search History
            </h1>
            <p className="text-gray-400 mt-1">Your recent part searches</p>
          </div>
          
          {searches.length > 0 && (
            <Button
              variant="outline"
              onClick={handleClearAll}
              className="bg-transparent border-[#444] text-gray-300 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {/* Search List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        ) : searches.length === 0 ? (
          <div className="text-center py-20">
            <History className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white font-medium text-lg mb-2">No search history</h3>
            <p className="text-gray-400 text-sm mb-6">Your part searches will be saved here</p>
            <Link to={createPageUrl('Home')}>
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Search className="w-4 h-4 mr-2" />
                Start Searching
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {searches.map((search) => (
              <Card key={search.id} className="bg-[#1a1a1a] border-[#333] hover:border-orange-500/50 transition-all group">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <Link 
                      to={createPageUrl('SearchResults') + `?q=${encodeURIComponent(search.query)}`}
                      className="flex-1 flex items-center gap-4"
                    >
                      <div className="bg-[#222] p-2.5 rounded-lg">
                        <Search className="w-5 h-5 text-orange-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{search.query}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-gray-500 text-sm flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {format(new Date(search.created_date), 'MMM d, yyyy h:mm a')}
                          </span>
                          {search.results?.length > 0 && (
                            <Badge className="bg-[#222] text-gray-400 border-0 text-xs">
                              {search.results.length} results
                            </Badge>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-orange-500 transition-colors" />
                    </Link>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete(search.id);
                      }}
                      className="text-gray-500 hover:text-red-500 hover:bg-red-500/10 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}