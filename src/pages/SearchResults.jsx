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
import { addAffiliateTracking, trackAffiliateClick } from '@/components/AffiliateTracker';

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
  const [partType, setPartType] = useState('oem'); // 'oem' or 'aftermarket'

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

  const searchParts = async (searchQuery, type = partType) => {
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
        const prompt = `You are an advanced automotive parts search engine with COMPLETE ACCESS to the entire internet including all retailer product databases and image CDNs.

CRITICAL MISSION: Actively web scrape REAL PRODUCT DATA from actual retailer websites - including their REAL product images hosted on their servers.

SEARCH REQUEST: "${searchQuery}"
${year && make && model ? `VEHICLE: ${year} ${make} ${model}${engine ? ` ${engine}` : ''}` : ''}

RETAILERS TO ACTIVELY SCRAPE:
• AmericanMuscle.com - Extract their actual product photos from their CDN
• AmericanTrucks.com - Get real product images from their image servers
• AdvanceAutoParts.com - Scrape product photos from their listings
• AutoZone.com - Extract images from their product pages
• CarParts.com - Get actual part photos from their site
• CARiD.com - Extract high-quality product images
• Amazon.com - Get actual product photos from Amazon listings
• eBay.com - Extract images from eBay Motors listings
• RockAuto.com - Get real part images
• FCP Euro - Extract product photos
• Summit Racing - Get actual images
• RealTruck.com - Extract photos
• 4WheelParts.com - Get product images

IMAGE EXTRACTION REQUIREMENTS:
1. Extract ACTUAL image URLs from retailer websites (jpg, png, webp)
2. Get multiple angles/views per product (front, side, detail shots)
3. Use high-resolution images from retailer CDNs
4. Format: ["https://retailer-cdn.com/images/product1.jpg", "https://retailer-cdn.com/images/product2.jpg"]
5. DO NOT use placeholders or generic stock photos
6. Each part should have 2-5 real retailer images

DATA EXTRACTION REQUIREMENTS:
1. Get ACTUAL product page URLs (direct links to buy the exact part)
2. Extract LIVE pricing and availability
3. Get complete product specifications from retailer descriptions
4. Include shipping information
5. Mark which retailers have affiliate programs`;

        const response = await base44.integrations.Core.InvokeLLM({
          prompt: prompt + `

Return a JSON object with this structure:
{
  "parts": [
    {
      "part_name": "EXACT part name from retailer listing",
      "oem_part_number": "Real part/SKU number",
      "manufacturer": "Brand name",
      "msrp_price": 49.99,
      "description": "Full product description from retailer (include all specs, materials, features)",
      "category": "Category (Brakes, Engine, Filters, Suspension, etc.)",
      "is_genuine_oem": true/false,
      "fitment_note": "Exact fitment compatibility",
      "images": [
        "https://actual-retailer-image-url-1.jpg",
        "https://actual-retailer-image-url-2.jpg",
        "https://actual-retailer-image-url-3.jpg"
      ],
      "purchase_links": [
        {
          "store": "Store Name",
          "url": "https://exact-product-page-url.com/product/12345",
          "price": 39.99,
          "availability": "In Stock" / "Low Stock" / "Out of Stock",
          "shipping": "Free shipping" / "$9.99" / "Ships in 2-3 days",
          "has_affiliate": true/false
        }
      ],
      "specifications": {
        "weight": "5 lbs",
        "dimensions": "10x8x3 inches",
        "material": "Cast iron",
        "warranty": "Lifetime",
        "country_of_origin": "USA"
      },
      "installation_steps": ["Step 1...", "Step 2..."],
      "torque_specs": [
        {"component": "Part name", "ft_lbs": 85, "nm": 115}
      ],
      "difficulty": "Easy/Medium/Hard",
      "estimated_time": "1-2 hours",
      "tools_needed": ["Tool 1", "Tool 2"]
    }
  ]
}

CRITICAL REQUIREMENTS:
- Return 10-20 parts per search (MAXIMUM coverage)
- ALL purchase_links must be REAL direct product page URLs (not search pages)
- Extract REAL product images from retailer websites
- Include ALL retailers that have the part
- Get LIVE current pricing
- Mark which retailers have affiliate programs (has_affiliate: true)
- Pull complete product specifications from retailer listings
- Include shipping info and availability
- VERIFY fitment accuracy for the vehicle`,
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
                  manufacturer: { type: "string" },
                  msrp_price: { type: "number" },
                  description: { type: "string" },
                  category: { type: "string" },
                  is_genuine_oem: { type: "boolean" },
                  fitment_note: { type: "string" },
                  images: { type: "array", items: { type: "string" } },
                  purchase_links: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        store: { type: "string" },
                        url: { type: "string" },
                        price: { type: "number" },
                        availability: { type: "string" },
                        shipping: { type: "string" },
                        has_affiliate: { type: "boolean" }
                      }
                    }
                  },
                  specifications: {
                    type: "object",
                    properties: {
                      weight: { type: "string" },
                      dimensions: { type: "string" },
                      material: { type: "string" },
                      warranty: { type: "string" },
                      country_of_origin: { type: "string" }
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

      // Process results: add affiliate tracking to URLs
      const processedParts = (response.parts || []).map(part => ({
        ...part,
        purchase_links: (part.purchase_links || []).map(link => ({
          ...link,
          url: addAffiliateTracking(link.url, link.store)
        }))
      }));
      
      setResults(processedParts);
      
      // Cache the search for offline use
      cacheSearch(searchQuery, processedParts);
      
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
      searchParts(initialQuery, partType);
    }
  }, []);

  const handlePartTypeToggle = (newType) => {
    setPartType(newType);
    if (query) {
      searchParts(query, newType);
    }
  };

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
          
          <div className="flex items-center justify-between gap-4 mt-4 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
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

            {/* OEM/Aftermarket Toggle */}
            <div className="flex items-center bg-[#1a1a1a] border border-[#333] rounded-lg p-1">
              <button
                onClick={() => handlePartTypeToggle('oem')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  partType === 'oem'
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                OEM Parts
              </button>
              <button
                onClick={() => handlePartTypeToggle('aftermarket')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  partType === 'aftermarket'
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Aftermarket
              </button>
            </div>
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
            <p className="text-white font-medium mb-2">Scanning All Retailers...</p>
            <p className="text-gray-500 text-sm text-center max-w-md">
              Searching 20+ auto parts stores for live pricing, availability & images
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
                  ✓ {partType === 'oem' ? 'OEM' : 'Aftermarket'} catalog search
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