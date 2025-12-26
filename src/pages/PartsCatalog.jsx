import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { 
  Search, 
  ChevronRight,
  Loader2,
  ShoppingCart,
  Heart,
  TrendingUp,
  Package,
  CheckCircle,
  Star
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ProductCard from '@/components/catalog/ProductCard';
import ProductDetail from '@/components/catalog/ProductDetail';
import { vehicleYears, vehicleMakes, vehicleModels, vehicleEngines } from '@/components/catalog/VehicleData';
import { toast } from 'sonner';

export default function PartsCatalog() {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [savedVehicles, setSavedVehicles] = useState([]);
  const [year, setYear] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [engine, setEngine] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const availableModels = make ? (vehicleModels[make] || []) : [];
  const availableEngines = model ? (vehicleEngines[model] || vehicleEngines['default']) : [];

  useEffect(() => {
    loadVehicles();
    loadFeaturedProducts();
  }, []);

  const loadVehicles = async () => {
    try {
      const vehicles = await base44.entities.Vehicle.list('-created_date', 5);
      setSavedVehicles(vehicles);
    } catch (err) {
      console.error(err);
    }
  };

  const loadFeaturedProducts = async () => {
    setLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate 8 featured automotive products for an e-commerce store. Mix of popular items like brake pads, air filters, spark plugs, LED headlights, floor mats, etc. Return realistic products with multiple retailer pricing.`,
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
                  rating: { type: "number" },
                  reviews: { type: "number" },
                  inStock: { type: "boolean" },
                  buyUrl: { type: "string" }
                }
              }
            }
          }
        },
        add_context_from_internet: true
      });
      setFeaturedProducts(response.products || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleVehicleGo = () => {
    if (year && make && model) {
      const vehicle = { year, make, model, engine };
      setSelectedVehicle(vehicle);
      toast.success(`Vehicle set: ${year} ${make} ${model}`);
    }
  };

  const categoryIcons = [
    { name: 'Wheels & Tires', icon: '🛞', id: 'wheels' },
    { name: 'Brakes', icon: '🔴', id: 'brakes' },
    { name: 'Engine Parts', icon: '⚙️', id: 'engine' },
    { name: 'Suspension', icon: '🔧', id: 'suspension' },
    { name: 'Exhaust', icon: '💨', id: 'exhaust' },
    { name: 'Lighting', icon: '💡', id: 'lighting' },
    { name: 'Interior', icon: '🪑', id: 'interior' },
    { name: 'Body Parts', icon: '🚗', id: 'body' }
  ];

  const manufacturerLogos = [
    { name: 'Ford', logo: 'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=100&h=60&fit=crop' },
    { name: 'Chevrolet', logo: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=100&h=60&fit=crop' },
    { name: 'Toyota', logo: 'https://images.unsplash.com/photo-1629897048514-3dd7414fe72a?w=100&h=60&fit=crop' },
    { name: 'Honda', logo: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=100&h=60&fit=crop' },
    { name: 'BMW', logo: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=100&h=60&fit=crop' },
    { name: 'Mercedes', logo: 'https://images.unsplash.com/photo-1618843479619-f3d0d3e8e729?w=100&h=60&fit=crop' },
    { name: 'Audi', logo: 'https://images.unsplash.com/photo-1610768764270-790fbec18178?w=100&h=60&fit=crop' },
    { name: 'Nissan', logo: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=100&h=60&fit=crop' }
  ];

  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    setLoading(true);
    
    try {
      const vehicleInfo = selectedVehicle 
        ? `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`
        : 'universal';

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Find 16 ${category.name} products for ${vehicleInfo}. Include multiple retailer prices for each product (RockAuto, AutoZone, Amazon, etc). Mark exact fit when applicable.`,
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
                  inStock: { type: "boolean" },
                  buyUrl: { type: "string" },
                  priceComparison: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        retailer: { type: "string" },
                        price: { type: "number" },
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
        category: selectedCategory?.id || 'general'
      });
      toast.success('Saved to your parts list!');
    } catch (err) {
      console.error(err);
    }
  };

  if (selectedCategory && products.length > 0) {
    return (
      <div className="min-h-screen bg-white">
        {/* Sticky Vehicle Bar */}
        <div className="bg-[#1a1f2e] text-white py-3 px-4 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">YOUR VEHICLE:</span>
              {selectedVehicle ? (
                <div className="flex items-center gap-2">
                  <span className="text-orange-500 font-semibold">
                    {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
                  </span>
                  <button className="text-red-500 text-sm" onClick={() => setSelectedVehicle(null)}>✕</button>
                </div>
              ) : (
                <span className="text-gray-400 text-sm">No vehicle selected</span>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="text-white hover:text-orange-500"
            >
              ← Back to Home
            </Button>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="bg-gray-50 border-b py-3 px-4">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm">
            <button onClick={() => setSelectedCategory(null)} className="text-blue-600 hover:underline">Home</button>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-700">{selectedCategory.name}</span>
          </div>
        </div>

        {/* Products Grid */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedCategory.name}</h1>
          <p className="text-gray-600 mb-6">{products.length} products</p>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={setSelectedProduct}
                  onSave={handleSaveProduct}
                  viewMode="grid"
                />
              ))}
            </div>
          )}
        </div>

        <ProductDetail
          product={selectedProduct}
          open={!!selectedProduct}
          onOpenChange={(open) => !open && setSelectedProduct(null)}
          onSave={handleSaveProduct}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Vehicle Selector Bar */}
      <div className="bg-[#1a1f2e] text-white py-3 px-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <span className="text-sm font-medium">SELECT YOUR VEHICLE</span>
            <div className="flex items-center gap-2 flex-1 max-w-4xl">
              <Select value={make} onValueChange={(val) => { setMake(val); setModel(''); setEngine(''); }}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white h-9">
                  <SelectValue placeholder="Make" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleMakes.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={model} onValueChange={(val) => { setModel(val); setEngine(''); }} disabled={!make}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white h-9">
                  <SelectValue placeholder="Model" />
                </SelectTrigger>
                <SelectContent>
                  {availableModels.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white h-9">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleYears.map((y) => (
                    <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={engine} onValueChange={setEngine} disabled={!model}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white h-9">
                  <SelectValue placeholder="Submodel" />
                </SelectTrigger>
                <SelectContent>
                  {availableEngines.map((e) => (
                    <SelectItem key={e} value={e}>{e}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                onClick={handleVehicleGo}
                disabled={!year || !make || !model}
                className="bg-orange-600 hover:bg-orange-700 text-white h-9 px-8"
              >
                GO
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative h-[500px] bg-gradient-to-r from-gray-900 to-gray-800">
        <img 
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&h=500&fit=crop" 
          alt="Hero"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              CUSTOMIZE, UPGRADE, REPLACE
            </h1>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-6 text-lg">
              Shop Now
            </Button>
          </div>
        </div>
      </div>

      {/* Category Icons */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-4 md:grid-cols-8 gap-6">
          {categoryIcons.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat)}
              className="flex flex-col items-center gap-3 group"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-4xl group-hover:bg-orange-50 transition-colors">
                {cat.icon}
              </div>
              <span className="text-sm font-medium text-gray-700 text-center group-hover:text-orange-600">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Shop By Make */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Shop By Make</h2>
            <button className="text-blue-600 hover:underline text-sm font-medium">View all</button>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-6">
            {manufacturerLogos.map((mfg) => (
              <button
                key={mfg.name}
                className="bg-white p-4 rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center"
              >
                <img src={mfg.logo} alt={mfg.name} className="w-full h-12 object-contain opacity-70 hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Products</h2>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={setSelectedProduct}
                onSave={handleSaveProduct}
                viewMode="grid"
              />
            ))}
          </div>
        )}
      </div>

      <ProductDetail
        product={selectedProduct}
        open={!!selectedProduct}
        onOpenChange={(open) => !open && setSelectedProduct(null)}
        onSave={handleSaveProduct}
      />
    </div>
  );
}