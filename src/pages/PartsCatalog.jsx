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
  Sparkles,
  Home,
  Car,
  ShoppingCart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const oemCategories = [
  {
    id: 'oem-engine',
    name: 'OEM Engine Parts',
    icon: Settings,
    color: 'blue',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80',
    description: 'Genuine factory engine components',
    subcategories: [
      { id: 'engine-sensors', name: 'Engine Sensors', parts: ['MAF Sensors', 'O2 Sensors', 'Knock Sensors', 'Crankshaft Position Sensors', 'Camshaft Position Sensors'] },
      { id: 'spark-plugs', name: 'Spark Plugs & Ignition', parts: ['OEM Spark Plugs', 'Ignition Coils', 'Spark Plug Wires', 'Ignition Modules'] },
      { id: 'filters', name: 'Oil & Air Filters', parts: ['OEM Oil Filters', 'OEM Air Filters', 'Cabin Air Filters', 'Fuel Filters'] },
      { id: 'belts-hoses', name: 'Belts & Hoses', parts: ['Serpentine Belts', 'Timing Belts', 'Coolant Hoses', 'Vacuum Hoses'] },
      { id: 'gaskets', name: 'Gaskets & Seals', parts: ['Head Gaskets', 'Valve Cover Gaskets', 'Oil Pan Gaskets', 'Timing Cover Gaskets'] },
      { id: 'water-pumps', name: 'Water Pumps', parts: ['OEM Water Pumps', 'Coolant Pumps', 'Auxiliary Water Pumps'] }
    ]
  },
  {
    id: 'oem-brakes',
    name: 'OEM Brake System',
    icon: Disc,
    color: 'red',
    image: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800&q=80',
    description: 'Factory brake pads, rotors, and components',
    subcategories: [
      { id: 'brake-pads', name: 'Brake Pads', parts: ['Front Brake Pads', 'Rear Brake Pads', 'Ceramic Brake Pads'] },
      { id: 'brake-rotors', name: 'Brake Rotors', parts: ['Front Rotors', 'Rear Rotors', 'Vented Rotors'] },
      { id: 'calipers', name: 'Brake Calipers', parts: ['Front Calipers', 'Rear Calipers', 'Caliper Hardware'] },
      { id: 'brake-hardware', name: 'Brake Hardware', parts: ['Brake Hardware Kits', 'Caliper Pins', 'Brake Clips', 'Anti-Rattle Springs'] }
    ]
  },
  {
    id: 'oem-suspension',
    name: 'OEM Suspension',
    icon: Gauge,
    color: 'purple',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80',
    description: 'Factory suspension and steering components',
    subcategories: [
      { id: 'shocks-struts', name: 'Shocks & Struts', parts: ['Front Shocks', 'Rear Shocks', 'Front Struts', 'Strut Assemblies'] },
      { id: 'control-arms', name: 'Control Arms', parts: ['Upper Control Arms', 'Lower Control Arms', 'Bushings'] },
      { id: 'ball-joints', name: 'Ball Joints', parts: ['Upper Ball Joints', 'Lower Ball Joints'] },
      { id: 'tie-rods', name: 'Tie Rods & Ends', parts: ['Inner Tie Rods', 'Outer Tie Rods', 'Tie Rod Assemblies'] },
      { id: 'sway-bars', name: 'Sway Bar Links', parts: ['Front Sway Bar Links', 'Rear Sway Bar Links', 'Stabilizer Links'] }
    ]
  },
  {
    id: 'oem-electrical',
    name: 'OEM Electrical',
    icon: Battery,
    color: 'yellow',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    description: 'Factory electrical components and sensors',
    subcategories: [
      { id: 'batteries', name: 'Batteries', parts: ['OEM Batteries', 'Battery Cables', 'Battery Terminals'] },
      { id: 'alternators', name: 'Alternators & Starters', parts: ['Alternators', 'Starters', 'Starter Solenoids'] },
      { id: 'switches', name: 'Switches & Relays', parts: ['Ignition Switches', 'Window Switches', 'Door Lock Switches', 'Relays'] },
      { id: 'lighting', name: 'Lighting Components', parts: ['Headlight Bulbs', 'Tail Light Bulbs', 'Turn Signal Bulbs', 'Interior Lights'] }
    ]
  },
  {
    id: 'oem-exhaust',
    name: 'OEM Exhaust System',
    icon: Wind,
    color: 'gray',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80',
    description: 'Factory exhaust parts and catalytic converters',
    subcategories: [
      { id: 'mufflers', name: 'Mufflers', parts: ['OEM Mufflers', 'Exhaust Muffler Assemblies'] },
      { id: 'catalytic-converters', name: 'Catalytic Converters', parts: ['Direct Fit Cats', 'Manifold Converters'] },
      { id: 'exhaust-pipes', name: 'Exhaust Pipes', parts: ['Exhaust Pipe Sections', 'Tailpipes', 'Connector Pipes'] },
      { id: 'exhaust-hardware', name: 'Exhaust Hardware', parts: ['Exhaust Hangers', 'Exhaust Gaskets', 'Exhaust Clamps', 'Flange Bolts'] }
    ]
  },
  {
    id: 'oem-body',
    name: 'OEM Body Parts',
    icon: Car,
    color: 'cyan',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
    description: 'Factory body panels and exterior trim',
    subcategories: [
      { id: 'bumpers', name: 'Bumpers', parts: ['Front Bumpers', 'Rear Bumpers', 'Bumper Covers'] },
      { id: 'fenders', name: 'Fenders', parts: ['Front Fenders', 'Rear Quarter Panels', 'Fender Liners'] },
      { id: 'mirrors', name: 'Side Mirrors', parts: ['Power Mirrors', 'Manual Mirrors', 'Mirror Glass', 'Mirror Covers'] },
      { id: 'grilles', name: 'Grilles', parts: ['Front Grilles', 'Lower Grilles', 'Grille Inserts'] },
      { id: 'trim', name: 'Exterior Trim', parts: ['Door Moldings', 'Rocker Panels', 'Wheel Well Trim', 'Window Trim'] }
    ]
  }
];

const aftermarketCategories = [
  {
    id: 'am-wheels-tires',
    name: 'Wheels & Tires',
    icon: Disc,
    color: 'orange',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    description: 'Aftermarket wheels, tires, and packages',
    subcategories: [
      { id: 'wheels', name: 'Aftermarket Wheels', parts: ['Alloy Wheels', 'Forged Wheels', 'Chrome Wheels', 'Matte Black Wheels', 'Bronze Wheels'] },
      { id: 'wheel-tire-packages', name: 'Wheel & Tire Packages', parts: ['Complete Packages', 'Performance Packages', 'Off-Road Packages', 'Street Packages'] },
      { id: 'performance-tires', name: 'Performance Tires', parts: ['Summer Performance Tires', 'Track Tires', 'Drag Radials', 'High-Performance All-Season'] },
      { id: 'off-road-tires', name: 'Off-Road Tires', parts: ['All-Terrain Tires', 'Mud-Terrain Tires', 'Rock Crawling Tires'] },
      { id: 'wheel-spacers', name: 'Wheel Spacers & Adapters', parts: ['Hub-Centric Spacers', 'Bolt-On Spacers', 'Wheel Adapters'] },
      { id: 'lug-nuts', name: 'Lug Nuts & Accessories', parts: ['Spline Lug Nuts', 'Locking Lug Nuts', 'Titanium Lug Nuts', 'Wheel Locks'] }
    ]
  },
  {
    id: 'am-suspension',
    name: 'Performance Suspension',
    icon: Gauge,
    color: 'purple',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80',
    description: 'Coilovers, lowering springs, and suspension upgrades',
    subcategories: [
      { id: 'coilovers', name: 'Coilover Kits', parts: ['Adjustable Coilovers', 'Track Coilovers', 'Street Coilovers', 'Air Suspension'] },
      { id: 'lowering-springs', name: 'Lowering Springs', parts: ['Progressive Springs', 'Linear Springs', 'Sport Springs'] },
      { id: 'shocks-struts', name: 'Performance Shocks', parts: ['Adjustable Shocks', 'Gas Shocks', 'Monotube Shocks'] },
      { id: 'sway-bars', name: 'Sway Bars', parts: ['Front Sway Bars', 'Rear Sway Bars', 'Adjustable Sway Bars', 'End Links'] },
      { id: 'control-arms', name: 'Control Arms', parts: ['Tubular Control Arms', 'Adjustable Control Arms', 'Reinforced Control Arms'] },
      { id: 'strut-braces', name: 'Strut Tower Braces', parts: ['Front Strut Braces', 'Rear Strut Braces', 'Three-Point Braces'] }
    ]
  },
  {
    id: 'am-brakes',
    name: 'Performance Brakes',
    icon: Disc,
    color: 'red',
    image: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800&q=80',
    description: 'Big brake kits, performance rotors, and racing pads',
    subcategories: [
      { id: 'big-brake-kits', name: 'Big Brake Kits', parts: ['6-Piston BBK', '4-Piston BBK', 'Brembo Kits', 'Wilwood Kits'] },
      { id: 'performance-rotors', name: 'Performance Rotors', parts: ['Drilled Rotors', 'Slotted Rotors', 'Drilled & Slotted', '2-Piece Rotors'] },
      { id: 'performance-pads', name: 'Performance Brake Pads', parts: ['Ceramic Pads', 'Semi-Metallic Pads', 'Track Pads', 'Street Pads'] },
      { id: 'brake-lines', name: 'Stainless Brake Lines', parts: ['Braided Brake Lines', 'DOT Approved Lines', 'Custom Brake Lines'] },
      { id: 'brake-fluid', name: 'Performance Brake Fluid', parts: ['DOT 4 Fluid', 'DOT 5.1 Fluid', 'Racing Brake Fluid'] }
    ]
  },
  {
    id: 'am-exhaust',
    name: 'Performance Exhaust',
    icon: Wind,
    color: 'gray',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80',
    description: 'Cat-back systems, headers, and performance mufflers',
    subcategories: [
      { id: 'cat-back', name: 'Cat-Back Exhaust', parts: ['Complete Cat-Back Systems', 'Stainless Cat-Back', 'Titanium Exhaust'] },
      { id: 'axle-back', name: 'Axle-Back Exhaust', parts: ['Axle-Back Systems', 'Sport Muffler Delete', 'Performance Mufflers'] },
      { id: 'headers', name: 'Performance Headers', parts: ['Long Tube Headers', 'Shorty Headers', 'Ceramic Coated Headers'] },
      { id: 'downpipes', name: 'Downpipes', parts: ['High-Flow Downpipes', 'Catted Downpipes', 'Catless Downpipes'] },
      { id: 'mid-pipes', name: 'Mid-Pipes', parts: ['X-Pipes', 'H-Pipes', 'Resonated Mid-Pipes', 'Non-Resonated'] },
      { id: 'exhaust-tips', name: 'Exhaust Tips', parts: ['Carbon Fiber Tips', 'Stainless Tips', 'Black Tips', 'Quad Tips'] }
    ]
  },
  {
    id: 'am-intakes',
    name: 'Cold Air Intakes',
    icon: Wind,
    color: 'blue',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80',
    description: 'Performance air intakes and filters',
    subcategories: [
      { id: 'cold-air-intakes', name: 'Cold Air Intakes', parts: ['Short Ram Intakes', 'Long Tube Cold Air', 'Sealed Box Intakes'] },
      { id: 'performance-filters', name: 'Performance Air Filters', parts: ['Oiled Cotton Filters', 'Dry Flow Filters', 'Foam Filters'] },
      { id: 'intake-accessories', name: 'Intake Accessories', parts: ['Heat Shields', 'Intake Pipes', 'Couplers', 'Clamps'] }
    ]
  },
  {
    id: 'am-exterior',
    name: 'Exterior Styling',
    icon: Car,
    color: 'cyan',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
    description: 'Body kits, spoilers, and aerodynamic mods',
    subcategories: [
      { id: 'body-kits', name: 'Body Kits', parts: ['Complete Body Kits', 'Front Bumpers', 'Rear Bumpers', 'Side Skirts', 'Diffusers'] },
      { id: 'spoilers', name: 'Spoilers & Wings', parts: ['Trunk Spoilers', 'Roof Spoilers', 'GT Wings', 'Lip Spoilers'] },
      { id: 'splitters', name: 'Front Splitters', parts: ['Carbon Fiber Splitters', 'ABS Splitters', 'Track Splitters'] },
      { id: 'diffusers', name: 'Rear Diffusers', parts: ['Carbon Fiber Diffusers', 'ABS Diffusers', 'Sport Diffusers'] },
      { id: 'hood-scoops', name: 'Hoods & Scoops', parts: ['Carbon Fiber Hoods', 'Vented Hoods', 'Hood Scoops'] },
      { id: 'fender-flares', name: 'Fender Flares', parts: ['Wide Body Kits', 'Bolt-On Flares', 'Rivet Flares'] }
    ]
  },
  {
    id: 'am-lighting',
    name: 'Performance Lighting',
    icon: Zap,
    color: 'yellow',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80',
    description: 'LED headlights, tail lights, and interior lighting',
    subcategories: [
      { id: 'headlights', name: 'LED Headlights', parts: ['LED Headlights', 'HID Headlights', 'Projector Headlights', 'Halo Headlights'] },
      { id: 'tail-lights', name: 'LED Tail Lights', parts: ['LED Tail Lights', 'Sequential Tails', 'Smoked Tail Lights'] },
      { id: 'fog-lights', name: 'Fog Lights', parts: ['LED Fog Lights', 'HID Fog Lights', 'Yellow Fog Lights'] },
      { id: 'light-bars', name: 'LED Light Bars', parts: ['Roof Light Bars', 'Bumper Light Bars', 'Rock Lights'] },
      { id: 'interior-lights', name: 'Interior LED', parts: ['LED Interior Kits', 'Footwell Lights', 'Ambient Lighting', 'LED Strips'] }
    ]
  },
  {
    id: 'am-tuning',
    name: 'Engine Tuning',
    icon: Settings,
    color: 'green',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80',
    description: 'Tuners, chips, and performance upgrades',
    subcategories: [
      { id: 'tuners', name: 'Performance Tuners', parts: ['Handheld Tuners', 'Custom Tune Files', 'Flash Tuners', 'Piggyback Systems'] },
      { id: 'turbo-kits', name: 'Turbo Kits', parts: ['Single Turbo Kits', 'Twin Turbo Kits', 'Turbo Upgrades'] },
      { id: 'superchargers', name: 'Supercharger Kits', parts: ['Centrifugal Superchargers', 'Roots Superchargers', 'Twin-Screw Superchargers'] },
      { id: 'intercoolers', name: 'Intercoolers', parts: ['Front Mount Intercoolers', 'Top Mount Intercoolers', 'Air-to-Water Intercoolers'] },
      { id: 'blow-off-valves', name: 'Blow Off Valves', parts: ['Atmospheric BOVs', 'Recirculating BOVs', 'Hybrid BOVs'] }
    ]
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
  gray: 'bg-gray-500/10 border-gray-500/30 text-gray-500',
  pink: 'bg-pink-500/10 border-pink-500/30 text-pink-500'
};

export default function PartsCatalog() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [partType, setPartType] = useState('oem'); // 'oem' or 'aftermarket'

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
  };

  const handleSubcategoryClick = (subcategory) => {
    setSelectedSubcategory(subcategory);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  };

  const handleBackToSubcategories = () => {
    setSelectedSubcategory(null);
  };

  const handlePartSearch = async (partName) => {
    setLoading(true);
    navigate(createPageUrl('SearchResults') + `?q=${encodeURIComponent(partName + (partType === 'aftermarket' ? ' aftermarket' : ' OEM'))}`);
  };

  const handleQuickSearch = () => {
    if (!searchQuery.trim()) return;
    navigate(createPageUrl('SearchResults') + `?q=${encodeURIComponent(searchQuery)}`);
  };

  const categories = partType === 'oem' ? oemCategories : aftermarketCategories;

  const filteredCategories = searchQuery 
    ? categories.filter(cat => 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cat.subcategories && cat.subcategories.some(sub => 
          sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sub.parts.some(part => part.toLowerCase().includes(searchQuery.toLowerCase()))
        ))
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
              <span className="text-orange-500 text-sm font-medium">{partType === 'oem' ? 'OEM' : 'Aftermarket'} Parts Catalog</span>
            </div>
            
            {/* OEM/Aftermarket Toggle */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="flex items-center bg-[#1a1a1a] border border-[#333] rounded-lg p-1">
                <button
                  onClick={() => setPartType('oem')}
                  className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${
                    partType === 'oem'
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  OEM Parts
                </button>
                <button
                  onClick={() => setPartType('aftermarket')}
                  className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${
                    partType === 'aftermarket'
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Aftermarket Parts
                </button>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Browse {partType === 'oem' ? 'OEM' : 'Aftermarket'} Parts by Category
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {partType === 'oem' 
                ? 'Explore genuine OEM parts organized by system. Find exactly what you need for your vehicle.'
                : 'Browse quality aftermarket parts from trusted brands. Great value with reliable performance.'}
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
            {/* Main Categories */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-white font-semibold text-xl">
                {filteredCategories.length} {filteredCategories.length === 1 ? 'Category' : 'Categories'}
              </h2>
              <Badge className="bg-green-500/20 text-green-400 border-0">
                ✓ All {partType === 'oem' ? 'OEM' : 'Aftermarket'} Parts
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {filteredCategories.map((category) => {
                const Icon = category.icon;
                const itemCount = category.subcategories 
                  ? category.subcategories.reduce((acc, sub) => acc + sub.parts.length, 0)
                  : 0;
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category)}
                    className="bg-[#1a1a1a] border-2 border-[#333] rounded-xl overflow-hidden text-left hover:border-orange-500 transition-all duration-200 group hover:shadow-xl hover:shadow-orange-500/20"
                  >
                    {/* Product Image Section */}
                    <div className="h-40 md:h-48 relative overflow-hidden bg-[#0a0a0a]">
                      <img 
                        src={category.image} 
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute top-3 right-3 bg-orange-500 backdrop-blur-sm rounded-full px-3 py-1.5">
                        <span className="text-white text-xs font-bold">{category.subcategories?.length || 0} Categories</span>
                      </div>
                      <div className={`absolute bottom-3 left-3 w-10 h-10 rounded-lg ${colorClasses[category.color]} flex items-center justify-center backdrop-blur-md`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    
                    {/* Product Info Section */}
                    <div className="p-4 md:p-5 bg-[#1a1a1a]">
                      <h3 className="text-white font-bold text-base md:text-lg mb-2 group-hover:text-orange-500 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-gray-400 text-xs md:text-sm mb-3 line-clamp-2">
                        {category.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 text-xs md:text-sm font-medium">{itemCount} parts available</span>
                        <div className="flex items-center gap-1 text-orange-500 text-sm font-semibold">
                          <span>Shop Now</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        ) : !selectedSubcategory ? (
          <>
            {/* Subcategories View with Sidebar */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Sidebar Navigation */}
              <div className="lg:w-64 flex-shrink-0">
                <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-4 sticky top-24">
                  {/* Breadcrumbs */}
                  <div className="flex items-center gap-2 text-sm mb-4 pb-4 border-b border-[#333]">
                    <button onClick={handleBackToCategories} className="text-gray-400 hover:text-orange-500 transition-colors">
                      <Home className="w-4 h-4" />
                    </button>
                    <ChevronRight className="w-3 h-3 text-gray-600" />
                    <span className="text-white font-medium truncate">{selectedCategory.name}</span>
                  </div>

                  {/* Category Info */}
                  <div className="mb-4">
                    <div className={`w-12 h-12 rounded-lg border ${colorClasses[selectedCategory.color]} flex items-center justify-center mb-3`}>
                      {React.createElement(selectedCategory.icon, { className: 'w-6 h-6' })}
                    </div>
                    <h2 className="text-white font-bold text-lg mb-1">{selectedCategory.name}</h2>
                    <p className="text-gray-400 text-sm">{selectedCategory.description}</p>
                  </div>

                  {/* Quick Links */}
                  <div className="space-y-1">
                    <p className="text-gray-500 text-xs font-semibold uppercase mb-2">Quick Jump</p>
                    {selectedCategory.subcategories?.slice(0, 8).map((subcategory) => (
                      <button
                        key={subcategory.id}
                        onClick={() => handleSubcategoryClick(subcategory)}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-[#222] hover:text-orange-500 transition-all"
                      >
                        {subcategory.name}
                      </button>
                    ))}
                    {selectedCategory.subcategories?.length > 8 && (
                      <p className="text-gray-600 text-xs px-3 py-2">
                        +{selectedCategory.subcategories.length - 8} more below
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1">
                <div className="mb-6">
                  <h3 className="text-white font-semibold text-xl mb-2">
                    Browse {selectedCategory.subcategories?.length} Subcategories
                  </h3>
                  <p className="text-gray-400 text-sm">Select a subcategory to view available parts</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedCategory.subcategories?.map((subcategory) => (
                    <button
                      key={subcategory.id}
                      onClick={() => handleSubcategoryClick(subcategory)}
                      className="bg-[#1a1a1a] border-2 border-[#333] rounded-xl p-5 text-left hover:border-orange-500 hover:bg-[#222] transition-all group hover:shadow-lg"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-white font-bold group-hover:text-orange-500 transition-colors text-base md:text-lg">
                          {subcategory.name}
                        </h3>
                        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-orange-500/10 text-orange-500 border-0 text-xs">
                          {subcategory.parts.length} items
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Parts List View with Breadcrumbs */}
            <div>
              {/* Breadcrumb Navigation */}
              <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 text-sm flex-wrap">
                  <button onClick={handleBackToCategories} className="text-gray-400 hover:text-orange-500 transition-colors flex items-center gap-1">
                    <Home className="w-4 h-4" />
                    <span>All Categories</span>
                  </button>
                  <ChevronRight className="w-3 h-3 text-gray-600" />
                  <button onClick={handleBackToSubcategories} className="text-gray-400 hover:text-orange-500 transition-colors">
                    {selectedCategory.name}
                  </button>
                  <ChevronRight className="w-3 h-3 text-gray-600" />
                  <span className="text-white font-medium">{selectedSubcategory.name}</span>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-white font-bold text-2xl mb-2">{selectedSubcategory.name}</h2>
                <p className="text-gray-400">{selectedSubcategory.parts.length} parts available • Click any part to search</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                {selectedSubcategory.parts.map((part, index) => (
                  <button
                    key={index}
                    onClick={() => handlePartSearch(part)}
                    disabled={loading}
                    className="bg-[#1a1a1a] border-2 border-[#333] rounded-xl overflow-hidden text-left hover:border-orange-500 hover:shadow-lg transition-all group disabled:opacity-50"
                  >
                    <div className="aspect-square bg-gradient-to-br from-orange-500/5 to-orange-500/20 flex items-center justify-center relative">
                      <Settings className="w-12 h-12 text-orange-500/40 group-hover:text-orange-500 group-hover:scale-110 transition-all" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                    <div className="p-3">
                      <h3 className="text-white font-semibold mb-1 group-hover:text-orange-500 transition-colors text-xs md:text-sm line-clamp-2">
                        {part}
                      </h3>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-orange-500 font-semibold">Search</span>
                        {loading ? (
                          <Loader2 className="w-3 h-3 text-gray-500 animate-spin" />
                        ) : (
                          <ChevronRight className="w-3 h-3 text-gray-500 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}