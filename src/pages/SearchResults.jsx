import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import SearchBar from '@/components/SearchBar';
import PartCard from '@/components/PartCard';
import PullToRefresh from '@/components/PullToRefresh';
import { Loader2, AlertCircle, ArrowLeft, Filter, Car, Sparkles, Briefcase, ShoppingCart, Check, Plus, X, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

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
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showJobDialog, setShowJobDialog] = useState(false);
  const [jobName, setJobName] = useState('');
  const [savingJob, setSavingJob] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Offline mode - cache searches
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const cacheSearch = (query, results) => {
    const cached = JSON.parse(localStorage.getItem('cachedSearches') || '[]');
    const newCache = [{ query, results, timestamp: Date.now() }, ...cached.filter(c => c.query !== query)].slice(0, 10);
    localStorage.setItem('cachedSearches', JSON.stringify(newCache));
  };

  const getCachedSearch = (query) => {
    const cached = JSON.parse(localStorage.getItem('cachedSearches') || '[]');
    return cached.find(c => c.query.toLowerCase() === query.toLowerCase());
  };

  const vehicleInfo = year && make && model 
    ? `${year} ${make} ${model}${engine ? ` ${engine}` : ''}`
    : query;

  const searchParts = async (searchQuery) => {
    setLoading(true);
    setError(null);
    setQuery(searchQuery);

    // Check for cached results if offline
    if (isOffline) {
      const cached = getCachedSearch(searchQuery);
      if (cached) {
        setResults(cached.results);
        setLoading(false);
        toast.info('Showing cached results (offline mode)');
        return;
      } else {
        setError('You are offline. No cached results for this search.');
        setLoading(false);
        return;
      }
    }
    
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an expert automotive parts specialist with access to OEM parts catalogs from ACDelco, Mopar, Toyota/Lexus, Honda/Acura, Ford/Motorcraft, Nissan, BMW, and other manufacturers.

SEARCH REQUEST: "${searchQuery}"

Search the real OEM catalogs and provide accurate, genuine part information.

Return a JSON object with this structure:
{
  "parts": [
    {
      "part_name": "Full descriptive part name",
      "oem_part_number": "Genuine OEM part number",
      "msrp_price": 49.99,
      "description": "Detailed description",
      "category": "Category (Brakes, Engine, Filters, etc.)",
      "manufacturer": "OEM Brand (Motorcraft, ACDelco, Toyota Genuine, etc.)",
      "is_genuine_oem": true,
      "fitment_note": "Any specific fitment notes",
      "supersession": {
        "new_part_number": "New part number if superseded",
        "reason": "Why it was updated"
      },
      "purchase_links": [
        {"store": "RockAuto", "url": "https://www.rockauto.com/en/catalog/...", "price": 39.99},
        {"store": "Amazon", "url": "https://www.amazon.com/s?k=...", "price": 44.99},
        {"store": "AutoZone", "url": "https://www.autozone.com/...", "price": 47.99}
      ],
      "installation_steps": [
        "Safely lift and secure the vehicle on jack stands",
        "Remove the wheel to access the brake components",
        "Remove caliper mounting bolts (typically 14mm or 17mm)",
        "Hang caliper with wire - do not let it hang by the brake line",
        "Remove old brake pads and inspect rotor surface",
        "Compress caliper piston using a C-clamp or brake tool",
        "Install new pads with wear indicator facing inward",
        "Reinstall caliper and torque bolts to spec",
        "Reinstall wheel and torque lug nuts in star pattern",
        "Pump brake pedal several times before driving"
      ],
      "torque_specs": [
        {"component": "Caliper bracket bolts", "ft_lbs": 85, "nm": 115},
        {"component": "Caliper slide pins", "ft_lbs": 25, "nm": 34},
        {"component": "Wheel lug nuts", "ft_lbs": 100, "nm": 135}
      ],
      "difficulty": "Medium",
      "estimated_time": "1-2 hours per axle",
      "tools_needed": ["Floor jack & stands", "Lug wrench", "Socket set (metric)", "C-clamp or brake tool", "Wire or bungee cord", "Brake cleaner", "Torque wrench"]
    }
  ]
}

IMPORTANT:
- Use REAL OEM part numbers
- Include accurate MSRP prices
- Provide detailed installation steps with specific measurements
- Include torque specifications in both ft-lbs and Nm
- List all required tools
- Provide 3-6 relevant parts`,
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
                  torque_specs: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        component: { type: "string" },
                        ft_lbs: { type: "number" },
                        nm: { type: "number" }
                      }
                    }
                  },
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
      
      // Cache the search for offline use
      cacheSearch(searchQuery, response.parts || []);
      
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

  const handleAddToCart = (part) => {
    if (!cartItems.find(p => p.oem_part_number === part.oem_part_number)) {
      setCartItems([...cartItems, part]);
      toast.success(`Added ${part.part_name} to list`);
    }
  };

  const handleRemoveFromCart = (partNumber) => {
    setCartItems(cartItems.filter(p => p.oem_part_number !== partNumber));
  };

  const handleAddAllToCart = () => {
    const newItems = results.filter(p => !cartItems.find(c => c.oem_part_number === p.oem_part_number));
    setCartItems([...cartItems, ...newItems]);
    toast.success(`Added ${newItems.length} parts to list`);
  };

  const handleSaveToJob = async () => {
    if (!jobName.trim()) return;
    setSavingJob(true);
    try {
      const totalCost = cartItems.reduce((sum, p) => sum + (p.msrp_price || 0), 0);
      await base44.entities.Job.create({
        name: jobName,
        vehicle_info: vehicleInfo,
        status: 'planned',
        parts: cartItems.map(p => ({
          part_name: p.part_name,
          oem_part_number: p.oem_part_number,
          msrp_price: p.msrp_price,
          purchased: false
        })),
        estimated_cost: totalCost
      });
      toast.success('Job saved!');
      setShowJobDialog(false);
      setJobName('');
      setCartItems([]);
    } catch (err) {
      toast.error('Failed to save job');
    }
    setSavingJob(false);
  };

  const cartTotal = cartItems.reduce((sum, p) => sum + (p.msrp_price || 0), 0);

  return (
    <div className="min-h-screen bg-[#111]">
      {/* Search Header */}
      <div className="bg-[#0a0a0a] border-b border-[#222] py-6 px-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Link 
              to={createPageUrl('Home')}
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </Link>

            {/* Cart Button */}
            {cartItems.length > 0 && (
              <Button
                onClick={() => setShowCart(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {cartItems.length} Parts (${cartTotal.toFixed(2)})
              </Button>
            )}
          </div>
          
          <SearchBar onSearch={handleNewSearch} isLoading={loading} />
          
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            {isOffline && (
              <Badge className="bg-amber-500/20 text-amber-400 border-0">
                <WifiOff className="w-3 h-3 mr-1" />
                Offline Mode
              </Badge>
            )}
            {vehicleInfo && (
              <>
                <Car className="w-4 h-4 text-orange-500" />
                <span className="text-gray-400 text-sm">Results for:</span>
                <Badge className="bg-[#1a1a1a] text-white border border-[#333]">
                  {vehicleInfo}
                </Badge>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <PullToRefresh onRefresh={() => searchParts(query)}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-6">
              <div className="w-16 h-16 border-4 border-[#222] border-t-orange-500 rounded-full animate-spin" />
              <Sparkles className="w-6 h-6 text-orange-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-white font-medium mb-2">Searching OEM Catalogs...</p>
            <p className="text-gray-500 text-sm text-center max-w-md">
              Checking manufacturer databases for parts & pricing
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-white font-medium mb-2">Search Error</p>
            <p className="text-gray-400 text-sm mb-4">{error}</p>
            <Button onClick={() => searchParts(query)} className="bg-orange-500 hover:bg-orange-600">
              Try Again
            </Button>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Filter className="w-12 h-12 text-gray-600 mb-4" />
            <p className="text-white font-medium mb-2">No parts found</p>
            <p className="text-gray-400 text-sm">Try a different search term</p>
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h2 className="text-white font-semibold text-lg">
                  {results.length} OEM Parts Found
                </h2>
                <Badge className="bg-green-500/20 text-green-400 border-0 mt-1">
                  ✓ Live catalog search
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleAddAllToCart}
                  variant="outline"
                  className="border-[#444] text-white hover:bg-[#222]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add All to List
                </Button>
                {cartItems.length > 0 && (
                  <Button
                    onClick={() => setShowJobDialog(true)}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    <Briefcase className="w-4 h-4 mr-2" />
                    Save to My Jobs
                  </Button>
                )}
              </div>
            </div>
            
            {/* Parts Grid */}
            <div className="space-y-5">
              {results.map((part, index) => (
                <div 
                  key={index}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'both' }}
                >
                  <PartCard 
                    part={part} 
                    vehicleInfo={vehicleInfo}
                    onAddToCart={handleAddToCart}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      </PullToRefresh>

      {/* Cart Sidebar */}
      <Dialog open={showCart} onOpenChange={setShowCart}>
        <DialogContent className="bg-[#1a1a1a] border-[#333] text-white max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-orange-500" />
              Parts List ({cartItems.length})
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3 mt-4">
            {cartItems.map((part) => (
              <div key={part.oem_part_number} className="flex items-start justify-between gap-3 bg-[#222] rounded-xl p-3">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">{part.part_name}</p>
                  <p className="text-gray-400 text-xs font-mono">#{part.oem_part_number}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-orange-500 font-semibold">${part.msrp_price?.toFixed(2)}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveFromCart(part.oem_part_number)}
                    className="h-8 w-8 text-gray-500 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[#333] pt-4 mt-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400">Estimated Total:</span>
              <span className="text-white font-bold text-xl">${cartTotal.toFixed(2)}</span>
            </div>
            <Button
              onClick={() => { setShowCart(false); setShowJobDialog(true); }}
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Save to My Jobs
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Save Job Dialog */}
      <Dialog open={showJobDialog} onOpenChange={setShowJobDialog}>
        <DialogContent className="bg-[#1a1a1a] border-[#333] text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-orange-500" />
              Save to My Jobs
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Job Name</label>
              <Input
                value={jobName}
                onChange={(e) => setJobName(e.target.value)}
                placeholder="e.g., Front Brake Job"
                className="bg-[#222] border-[#444] text-white"
              />
            </div>
            
            <div className="bg-[#222] rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-2">This job includes:</p>
              <p className="text-white font-medium">{cartItems.length} parts</p>
              <p className="text-gray-400 text-sm">{vehicleInfo}</p>
              <p className="text-orange-500 font-semibold mt-2">Est. ${cartTotal.toFixed(2)}</p>
            </div>

            <Button
              onClick={handleSaveToJob}
              disabled={!jobName.trim() || savingJob}
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              {savingJob ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
              Save Job
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}