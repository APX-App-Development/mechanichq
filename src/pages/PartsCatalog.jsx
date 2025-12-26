import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { 
  Search, 
  SlidersHorizontal, 
  Zap,
  Wrench,
  Package,
  Gauge,
  Sparkles,
  Car,
  Lightbulb,
  Cog,
  Radio,
  Droplets,
  Truck,
  Shield,
  Loader2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CategoryCard from '@/components/catalog/CategoryCard';
import ProductCard from '@/components/catalog/ProductCard';
import ProductDetail from '@/components/catalog/ProductDetail';
import VehicleSelector from '@/components/catalog/VehicleSelector';
import { toast } from 'sonner';

export default function PartsCatalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [savedVehicles, setSavedVehicles] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const vehicles = await base44.entities.Vehicle.list('-created_date', 5);
      setSavedVehicles(vehicles);
    } catch (err) {
      console.error(err);
    }
  };

  const categories = [
    {
      id: 'performance',
      name: 'Performance Parts',
      icon: Zap,
      count: '15,000+',
      image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop',
      subcategories: ['Turbochargers', 'Cold Air Intakes', 'Exhaust Systems', 'Tuners & Programmers']
    },
    {
      id: 'exterior',
      name: 'Exterior',
      icon: Car,
      count: '25,000+',
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&h=400&fit=crop',
      subcategories: ['Bumpers', 'Grilles', 'Hoods', 'Fender Flares', 'Body Kits']
    },
    {
      id: 'wheels',
      name: 'Wheels & Tires',
      icon: Cog,
      count: '50,000+',
      image: 'https://images.unsplash.com/photo-1614113489855-66422ad300a4?w=600&h=400&fit=crop',
      subcategories: ['Wheels', 'Tires', 'Wheel Spacers', 'Lug Nuts', 'TPMS']
    },
    {
      id: 'suspension',
      name: 'Suspension',
      icon: Gauge,
      count: '12,000+',
      image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop',
      subcategories: ['Coilovers', 'Lift Kits', 'Lowering Springs', 'Shocks', 'Control Arms']
    },
    {
      id: 'brakes',
      name: 'Brakes',
      icon: Shield,
      count: '18,000+',
      image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&h=400&fit=crop',
      subcategories: ['Brake Pads', 'Rotors', 'Calipers', 'Brake Kits', 'Brake Lines']
    },
    {
      id: 'lighting',
      name: 'Lighting',
      icon: Lightbulb,
      count: '8,000+',
      image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&h=400&fit=crop',
      subcategories: ['LED Headlights', 'Tail Lights', 'Light Bars', 'Interior Lights']
    },
    {
      id: 'interior',
      name: 'Interior',
      icon: Package,
      count: '20,000+',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop',
      subcategories: ['Seat Covers', 'Floor Mats', 'Steering Wheels', 'Shift Knobs']
    },
    {
      id: 'electronics',
      name: 'Electronics & Audio',
      icon: Radio,
      count: '10,000+',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
      subcategories: ['Stereos', 'Speakers', 'Amplifiers', 'Dash Cams']
    },
    {
      id: 'maintenance',
      name: 'Maintenance & Fluids',
      icon: Droplets,
      count: '15,000+',
      image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=600&h=400&fit=crop',
      subcategories: ['Oil', 'Filters', 'Coolant', 'Transmission Fluid', 'Tools']
    },
    {
      id: 'engine',
      name: 'Engine & Drivetrain',
      icon: Wrench,
      count: '22,000+',
      image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop',
      subcategories: ['Engine Parts', 'Transmission', 'Clutches', 'Driveshafts']
    },
    {
      id: 'towing',
      name: 'Towing & Recovery',
      icon: Truck,
      count: '5,000+',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&h=400&fit=crop',
      subcategories: ['Hitches', 'Tow Hooks', 'Winches', 'Tow Straps']
    },
    {
      id: 'oem',
      name: 'OEM Replacement',
      icon: Shield,
      count: '100,000+',
      image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop',
      subcategories: ['OEM Parts', 'Factory Replacements']
    }
  ];

  const searchProducts = async (query, category, vehicle) => {
    setLoading(true);
    
    try {
      const vehicleInfo = vehicle 
        ? `${vehicle.year} ${vehicle.make} ${vehicle.model}`
        : 'universal fitment';

      const categoryName = category ? categories.find(c => c.id === category)?.name : 'automotive parts';
      
      const prompt = `You are an expert automotive parts specialist with access to the following major retailers:
- RockAuto.com (best prices, huge inventory)
- FCP Euro (lifetime warranty, premium parts)
- Summit Racing (performance parts specialist)
- AmericanMuscle.com
- AmericanTrucks.com  
- AdvanceAutoParts.com
- AutoZone.com
- CarParts.com
- CARiD.com
- Amazon.com
- eBay.com

Search for: "${query || categoryName}"
Vehicle: ${vehicleInfo}
Category: ${categoryName}

Find 12 real products. CRITICAL: For EACH product, provide MULTIPLE retailer options with different prices so users can compare. Each product should have 3-5 price options from different retailers.
- Realistic product names
- Accurate pricing ($20-$2000 range)
- Proper brand names (Bosch, Denso, ACDelco, Motorcraft, etc.)
- Real retailer assignment
- Image URLs (use automotive part images from unsplash)
- Fitment verification (exact or verify needed)
- Product descriptions
- Specifications

Return a JSON object with this structure:
{
  "products": [
    {
      "id": "unique-id",
      "name": "Product name",
      "brand": "Brand name",
      "price": 99.99,
      "retailer": "RockAuto",
      "image": "https://images.unsplash.com/photo-...",
      "images": ["url1", "url2", "url3"],
      "rating": 4.5,
      "reviews": 127,
      "fitment": "exact",
      "isOEM": false,
      "description": "Detailed description",
      "specs": {
        "Material": "Steel",
        "Weight": "5 lbs"
      },
      "compatibility": "Fits 2015-2020 Ford F-150",
      "buyUrl": "https://www.rockauto.com/...",
      "priceComparison": [
        {
          "retailer": "RockAuto",
          "price": 89.99,
          "originalPrice": 109.99,
          "shipping": "Free shipping on $99+",
          "inStock": true,
          "buyUrl": "https://www.rockauto.com/..."
        },
        {
          "retailer": "FCP Euro",
          "price": 94.99,
          "shipping": "Free shipping",
          "inStock": true,
          "buyUrl": "https://www.fcpeuro.com/..."
        },
        {
          "retailer": "AutoZone",
          "price": 99.99,
          "originalPrice": 129.99,
          "shipping": "Free next-day on $35+",
          "inStock": true,
          "buyUrl": "https://www.autozone.com/..."
        }
      ]
    }
  ]
}`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            products: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  name: { type: "string" },
                  brand: { type: "string" },
                  price: { type: "number" },
                  originalPrice: { type: "number" },
                  retailer: { type: "string" },
                  image: { type: "string" },
                  images: { type: "array", items: { type: "string" } },
                  rating: { type: "number" },
                  reviews: { type: "number" },
                  fitment: { type: "string" },
                  isOEM: { type: "boolean" },
                  description: { type: "string" },
                  specs: { type: "object" },
                  compatibility: { type: "string" },
                  buyUrl: { type: "string" },
                  priceComparison: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        retailer: { type: "string" },
                        price: { type: "number" },
                        originalPrice: { type: "number" },
                        shipping: { type: "string" },
                        inStock: { type: "boolean" },
                        buyUrl: { type: "string" }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        add_context_from_internet: true
      });

      setProducts(response.products || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load products');
    }
    
    setLoading(false);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category.id);
    setSelectedSubcategory(null);
    searchProducts('', category.id, selectedVehicle);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchProducts(searchQuery, selectedCategory, selectedVehicle);
    }
  };

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    toast.success(`Vehicle set: ${vehicle.year} ${vehicle.make} ${vehicle.model}`);
    if (selectedCategory) {
      searchProducts(searchQuery, selectedCategory, vehicle);
    }
  };

  const handleSaveProduct = async (product) => {
    try {
      await base44.entities.SavedPart.create({
        part_name: product.name,
        oem_part_number: product.id,
        msrp_price: product.price,
        vehicle_info: selectedVehicle 
          ? `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`
          : 'Universal',
        manufacturer: product.brand,
        category: selectedCategory || 'general',
        notes: product.description
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setProducts([]);
  };

  return (
    <div className="min-h-screen bg-[#111]">
      {/* Header */}
      <div className="bg-[#0a0a0a] border-b border-[#333] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-orange-500" />
              <h1 className="text-white font-bold text-2xl">Parts Catalog</h1>
              <Badge className="bg-orange-500/20 text-orange-400 border-0">
                200,000+ Products
              </Badge>
            </div>
            
            {selectedCategory && (
              <Button
                onClick={handleBackToCategories}
                variant="outline"
                className="border-[#444] text-gray-300"
              >
                ← Back to Categories
              </Button>
            )}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by part name, brand, or part number..."
                className="w-full bg-[#1a1a1a] border-[#333] text-white pl-12 pr-4 h-12"
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-500 hover:bg-orange-600"
              >
                Search
              </Button>
            </div>
          </form>

          {/* Vehicle Selector */}
          <VehicleSelector 
            onSelect={handleVehicleSelect}
            savedVehicles={savedVehicles}
          />

          {/* Active Filters */}
          {(selectedVehicle || selectedCategory) && (
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedVehicle && (
                <Badge className="bg-orange-500/20 text-orange-400 border border-orange-500/50">
                  <Car className="w-3 h-3 mr-1" />
                  {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
                </Badge>
              )}
              {selectedCategory && (
                <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/50">
                  {categories.find(c => c.id === selectedCategory)?.name}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {!selectedCategory ? (
          /* Categories Grid */
          <div>
            <h2 className="text-white font-bold text-xl mb-6">Shop by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onClick={() => handleCategoryClick(category)}
                />
              ))}
            </div>
          </div>
        ) : loading ? (
          /* Loading State */
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
            <p className="text-white font-medium mb-2">Searching Products...</p>
            <p className="text-gray-400 text-sm">Checking inventory across 10+ retailers</p>
          </div>
        ) : (
          /* Products Grid */
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-white font-bold text-xl mb-1">
                  {categories.find(c => c.id === selectedCategory)?.name}
                </h2>
                <p className="text-gray-400 text-sm">{products.length} products found</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={setSelectedProduct}
                  onSave={handleSaveProduct}
                />
              ))}
            </div>

            {products.length === 0 && !loading && (
              <div className="text-center py-20">
                <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-white font-medium mb-2">No products found</p>
                <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      <ProductDetail
        product={selectedProduct}
        open={!!selectedProduct}
        onOpenChange={(open) => !open && setSelectedProduct(null)}
        onSave={handleSaveProduct}
      />
    </div>
  );
}