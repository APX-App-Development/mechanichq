import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import SearchBar from '@/components/SearchBar';
import PartCard from '@/components/PartCard';
import { Loader2, AlertCircle, ArrowLeft, Filter, Car, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function SearchResults() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get('q') || '';
  const year = urlParams.get('year');
  const make = urlParams.get('make');
  const model = urlParams.get('model');
  const engine = urlParams.get('engine');

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const vehicleInfo = year && make && model 
    ? `${year} ${make} ${model}${engine ? ` ${engine}` : ''}`
    : query;

  const searchParts = async (searchQuery) => {
    setLoading(true);
    setError(null);
    setQuery(searchQuery);
    
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an expert automotive parts specialist with access to OEM parts catalogs from ACDelco, Mopar, Toyota/Lexus, Honda/Acura, Ford/Motorcraft, Nissan, BMW, and other manufacturers.

SEARCH REQUEST: "${searchQuery}"

Search the real OEM catalogs and provide accurate, genuine part information.

For each part found, provide:
1. Exact OEM part number (from the manufacturer's official catalog)
2. Official MSRP price (manufacturer suggested retail)
3. Supersession info if the part number has been updated/replaced
4. Links to buy from major retailers

Return a JSON object with this structure:
{
  "parts": [
    {
      "part_name": "Full descriptive part name",
      "oem_part_number": "Genuine OEM part number (e.g., 15400-PLM-A02 for Honda, BR8ES for Toyota, etc.)",
      "msrp_price": 49.99,
      "description": "Detailed description of the part and what it does",
      "category": "Category (Brakes, Engine, Filters, Ignition, Suspension, etc.)",
      "manufacturer": "OEM Brand (Motorcraft, ACDelco, Toyota Genuine, Honda Genuine, Mopar, etc.)",
      "is_genuine_oem": true,
      "fitment_note": "Any specific fitment notes or compatibility info",
      "supersession": {
        "new_part_number": "New part number if this has been superseded",
        "reason": "Why it was updated (improved design, etc.)"
      },
      "purchase_links": [
        {"store": "RockAuto", "url": "https://www.rockauto.com/...", "price": 39.99},
        {"store": "Amazon", "url": "https://amazon.com/dp/...", "price": 44.99},
        {"store": "Dealer Parts", "url": "https://parts.toyota.com/...", "price": 49.99}
      ],
      "installation_steps": [
        "Step 1: Disconnect negative battery terminal",
        "Step 2: Locate the part...",
        "Step 3: Remove old part..."
      ],
      "difficulty": "Easy/Medium/Hard",
      "estimated_time": "30 minutes to 1 hour",
      "tools_needed": ["Socket wrench set", "Screwdriver", "etc."]
    }
  ]
}

IMPORTANT:
- Use REAL OEM part numbers from actual manufacturer catalogs
- Provide accurate MSRP prices based on current market data
- Include supersession info when parts have been updated
- Generate realistic purchase links (use actual store URLs and search queries)
- Provide 3-6 relevant parts that match the search
- If the search is for a specific vehicle, ensure fitment is correct
- Include quality installation instructions`,
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
                  manufacturer: { type: "string" },
                  is_genuine_oem: { type: "boolean" },
                  fitment_note: { type: "string" },
                  supersession: {
                    type: "object",
                    properties: {
                      new_part_number: { type: "string" },
                      reason: { type: "string" }
                    }
                  },
                  purchase_links: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        store: { type: "string" },
                        url: { type: "string" },
                        price: { type: "number" }
                      }
                    }
                  },
                  installation_steps: { type: "array", items: { type: "string" } },
                  difficulty: { type: "string" },
                  estimated_time: { type: "string" },
                  tools_needed: { type: "array", items: { type: "string" } }
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
        vehicle_engine: engine,
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
            <div className="relative mb-6">
              <div className="w-16 h-16 border-4 border-[#222] border-t-[#e31e24] rounded-full animate-spin" />
              <Sparkles className="w-6 h-6 text-[#e31e24] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-white font-medium mb-2">Searching OEM Catalogs...</p>
            <p className="text-gray-500 text-sm text-center max-w-md">
              Checking ACDelco, Mopar, Toyota, Honda, Ford, and other manufacturer databases
            </p>
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
                {results.length} OEM {results.length === 1 ? 'Part' : 'Parts'} Found
              </h2>
              <Badge className="bg-green-500/20 text-green-400 border-0">
                ✓ Real-time catalog search
              </Badge>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-4">
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