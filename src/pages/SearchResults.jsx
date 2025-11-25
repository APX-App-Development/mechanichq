import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import SearchBar from '@/components/SearchBar';
import PartCard from '@/components/PartCard';
import { Loader2, AlertCircle, ArrowLeft, Filter, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function SearchResults() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get('q') || '';
  const year = urlParams.get('year');
  const make = urlParams.get('make');
  const model = urlParams.get('model');

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const vehicleInfo = year && make && model ? `${year} ${make} ${model}` : query;

  const searchParts = async (searchQuery) => {
    setLoading(true);
    setError(null);
    setQuery(searchQuery);
    
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an expert automotive parts specialist. Find genuine OEM parts for: "${searchQuery}"

For vehicles 2010 and newer, provide accurate OEM part information.

Return a JSON object with this exact structure:
{
  "parts": [
    {
      "part_name": "Full part name",
      "oem_part_number": "Genuine OEM part number",
      "msrp_price": 0.00,
      "description": "Brief description",
      "category": "Category (Brakes, Engine, Suspension, etc.)",
      "brand": "OEM Brand name",
      "installation_steps": [
        "Step 1 description",
        "Step 2 description",
        "Step 3 description"
      ]
    }
  ]
}

Provide 3-6 relevant parts. Include realistic MSRP prices and genuine OEM part numbers when possible.
If the query is too vague, provide common parts for that category.`,
        response_json_schema: {
          type: "object",
          properties: {
            parts: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  part_name: { type: "string" },
                  oem_part_number: { type: "string" },
                  msrp_price: { type: "number" },
                  description: { type: "string" },
                  category: { type: "string" },
                  brand: { type: "string" },
                  installation_steps: { type: "array", items: { type: "string" } }
                }
              }
            }
          }
        },
        add_context_from_internet: true
      });

      setResults(response.parts || []);
      
      // Save search history
      await base44.entities.PartSearch.create({
        query: searchQuery,
        vehicle_year: year ? parseInt(year) : null,
        vehicle_make: make,
        vehicle_model: model,
        results: response.parts || []
      });
      
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search for parts. Please try again.');
    }
    
    setLoading(false);
  };

  useEffect(() => {
    if (initialQuery) {
      searchParts(initialQuery);
    }
  }, []);

  const handleNewSearch = (newQuery) => {
    window.history.pushState({}, '', createPageUrl('SearchResults') + `?q=${encodeURIComponent(newQuery)}`);
    searchParts(newQuery);
  };

  return (
    <div className="min-h-screen bg-[#111]">
      {/* Search Header */}
      <div className="bg-[#0a0a0a] border-b border-[#222] py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <Link 
            to={createPageUrl('Home')}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Home</span>
          </Link>
          
          <SearchBar onSearch={handleNewSearch} isLoading={loading} />
          
          {vehicleInfo && (
            <div className="flex items-center gap-2 mt-4">
              <Car className="w-4 h-4 text-[#e31e24]" />
              <span className="text-gray-400 text-sm">Showing results for:</span>
              <Badge className="bg-[#1a1a1a] text-white border border-[#333]">
                {vehicleInfo}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-[#e31e24] animate-spin mb-4" />
            <p className="text-gray-400">Searching for parts...</p>
            <p className="text-gray-500 text-sm mt-1">Using AI to find genuine OEM parts</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-white font-medium mb-2">Search Error</p>
            <p className="text-gray-400 text-sm mb-4">{error}</p>
            <Button onClick={() => searchParts(query)} className="bg-[#e31e24] hover:bg-[#c91a1f]">
              Try Again
            </Button>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Filter className="w-12 h-12 text-gray-600 mb-4" />
            <p className="text-white font-medium mb-2">No parts found</p>
            <p className="text-gray-400 text-sm">Try a different search term or be more specific</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-semibold text-lg">
                {results.length} {results.length === 1 ? 'Part' : 'Parts'} Found
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {results.map((part, index) => (
                <PartCard key={index} part={part} vehicleInfo={vehicleInfo} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}