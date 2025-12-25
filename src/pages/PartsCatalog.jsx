import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { 
  Loader2, 
  Search, 
  Filter,
  Disc,
  Wrench,
  Droplet,
  Battery,
  Gauge,
  Wind,
  Zap,
  Settings,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const categories = [
  { 
    id: 'brakes', 
    name: 'Brakes', 
    icon: Disc, 
    color: 'orange',
    description: 'Pads, rotors, calipers, brake fluid',
    parts: ['Brake Pads', 'Brake Rotors', 'Brake Calipers', 'Brake Lines', 'Brake Fluid']
  },
  { 
    id: 'engine', 
    name: 'Engine', 
    icon: Settings, 
    color: 'blue',
    description: 'Spark plugs, filters, belts, gaskets',
    parts: ['Spark Plugs', 'Engine Oil Filter', 'Air Filter', 'Timing Belt', 'Water Pump']
  },
  { 
    id: 'fluids', 
    name: 'Fluids', 
    icon: Droplet, 
    color: 'cyan',
    description: 'Oil, coolant, transmission fluid',
    parts: ['Engine Oil', 'Coolant', 'Transmission Fluid', 'Power Steering Fluid', 'Windshield Washer Fluid']
  },
  { 
    id: 'electrical', 
    name: 'Electrical', 
    icon: Battery, 
    color: 'yellow',
    description: 'Batteries, alternators, starters',
    parts: ['Battery', 'Alternator', 'Starter Motor', 'Ignition Coil', 'Fuses']
  },
  { 
    id: 'suspension', 
    name: 'Suspension', 
    icon: Gauge, 
    color: 'purple',
    description: 'Shocks, struts, control arms',
    parts: ['Shock Absorbers', 'Struts', 'Control Arms', 'Ball Joints', 'Sway Bar Links']
  },
  { 
    id: 'filters', 
    name: 'Filters', 
    icon: Wind, 
    color: 'green',
    description: 'Air, oil, fuel, cabin filters',
    parts: ['Air Filter', 'Oil Filter', 'Fuel Filter', 'Cabin Air Filter', 'Transmission Filter']
  },
  { 
    id: 'ignition', 
    name: 'Ignition', 
    icon: Zap, 
    color: 'red',
    description: 'Coils, plugs, wires',
    parts: ['Spark Plugs', 'Ignition Coils', 'Spark Plug Wires', 'Distributor Cap', 'Ignition Switch']
  },
  { 
    id: 'maintenance', 
    name: 'Maintenance', 
    icon: Wrench, 
    color: 'gray',
    description: 'Wipers, belts, bulbs',
    parts: ['Wiper Blades', 'Serpentine Belt', 'Headlight Bulbs', 'Cabin Filter', 'PCV Valve']
  }
];

const colorClasses = {
  orange: 'bg-orange-500/10 border-orange-500/30 text-orange-500',
  blue: 'bg-blue-500/10 border-blue-500/30 text-blue-500',
  cyan: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-500',
  yellow: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500',
  purple: 'bg-purple-500/10 border-purple-500/30 text-purple-500',
  green: 'bg-green-500/10 border-green-500/30 text-green-500',
  red: 'bg-red-500/10 border-red-500/30 text-red-500',
  gray: 'bg-gray-500/10 border-gray-500/30 text-gray-500'
};

export default function PartsCatalog() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handlePartSearch = async (partName) => {
    setLoading(true);
    navigate(createPageUrl('SearchResults') + `?q=${encodeURIComponent(partName)}`);
  };

  const handleQuickSearch = () => {
    if (!searchQuery.trim()) return;
    navigate(createPageUrl('SearchResults') + `?q=${encodeURIComponent(searchQuery)}`);
  };

  const filteredCategories = searchQuery 
    ? categories.filter(cat => 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.parts.some(part => part.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : categories;

  return (
    <div className="min-h-screen bg-[#111]">
      {/* Header */}
      <div className="bg-[#0a0a0a] border-b border-[#222] py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-4 py-1.5 mb-4">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span className="text-orange-500 text-sm font-medium">OEM Parts Catalog</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Browse Parts by Category
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Explore genuine OEM parts organized by system. Find exactly what you need for your vehicle.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleQuickSearch()}
                placeholder="Search categories or parts..."
                className="bg-[#1a1a1a] border-[#333] text-white pl-12 pr-4 h-12 rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {!selectedCategory ? (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-white font-semibold text-xl">
                {filteredCategories.length} {filteredCategories.length === 1 ? 'Category' : 'Categories'}
              </h2>
              <Badge className="bg-green-500/20 text-green-400 border-0">
                ✓ All OEM Parts
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category)}
                    className="bg-[#1a1a1a] border border-[#333] rounded-2xl p-6 text-left hover:border-orange-500/50 transition-all duration-300 group"
                  >
                    <div className={`w-14 h-14 rounded-xl border ${colorClasses[category.color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-orange-500 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      {category.description}
                    </p>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <span>{category.parts.length} parts</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <>
            {/* Category Detail View */}
            <div className="mb-8">
              <Button
                onClick={() => setSelectedCategory(null)}
                variant="ghost"
                className="text-gray-400 hover:text-white mb-4"
              >
                ← Back to Categories
              </Button>
              
              <div className="flex items-center gap-4 mb-2">
                <div className={`w-16 h-16 rounded-xl border ${colorClasses[selectedCategory.color]} flex items-center justify-center`}>
                  {React.createElement(selectedCategory.icon, { className: 'w-8 h-8' })}
                </div>
                <div>
                  <h2 className="text-white font-bold text-2xl">{selectedCategory.name}</h2>
                  <p className="text-gray-400">{selectedCategory.description}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedCategory.parts.map((part, index) => (
                <button
                  key={index}
                  onClick={() => handlePartSearch(part)}
                  disabled={loading}
                  className="bg-[#1a1a1a] border border-[#333] rounded-xl p-5 text-left hover:border-orange-500 transition-all group disabled:opacity-50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium mb-1 group-hover:text-orange-500 transition-colors">
                        {part}
                      </h3>
                      <p className="text-gray-500 text-sm">View OEM options</p>
                    </div>
                    {loading ? (
                      <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}