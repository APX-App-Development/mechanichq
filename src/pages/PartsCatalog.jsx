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
    id: 'wheels-tires',
    name: 'Wheels & Tires',
    icon: Disc,
    color: 'orange',
    description: 'Wheels, tires, packages, and accessories',
    subcategories: [
      { id: 'wheels', name: 'Wheels', parts: ['Alloy Wheels', 'Steel Wheels', 'Forged Wheels', 'Cast Wheels', 'Chrome Wheels'] },
      { id: 'wheel-tire-packages', name: 'Wheel & Tire Packages', parts: ['Complete Packages', 'Performance Packages', 'Off-Road Packages'] },
      { id: 'tires', name: 'Tires', parts: ['All-Season Tires', 'Performance Tires', 'Winter Tires', 'Off-Road Tires', 'Run-Flat Tires'] },
      { id: 'caliper-covers', name: 'Caliper Covers', parts: ['Brake Caliper Covers', 'MGP Caliper Covers', 'Custom Caliper Covers'] },
      { id: 'wheel-accessories', name: 'Wheel Accessories', parts: ['Lug Nuts', 'Center Caps', 'Valve Stems', 'Wheel Locks', 'Hub Rings'] },
      { id: 'tire-covers', name: 'Tire Covers', parts: ['Spare Tire Covers', 'Custom Tire Covers', 'Weather Protection Covers'] },
      { id: 'spacers-adapters', name: 'Spacers & Adapters', parts: ['Wheel Spacers', 'Wheel Adapters', 'Hub Centric Rings'] }
    ]
  },
  {
    id: 'suspension',
    name: 'Performance Suspension',
    icon: Gauge,
    color: 'purple',
    description: 'Springs, shocks, struts, and suspension kits',
    subcategories: [
      { id: 'springs', name: 'Springs', parts: ['Lowering Springs', 'Performance Springs', 'Progressive Springs', 'Linear Springs'] },
      { id: 'steering-components', name: 'Steering Components', parts: ['Tie Rods', 'Rack & Pinion', 'Power Steering Pump', 'Steering Rack'] },
      { id: 'strut-shock-braces', name: 'Strut & Shock Tower Braces', parts: ['Front Strut Braces', 'Rear Shock Braces', 'Tower Braces'] },
      { id: 'sway-bars', name: 'Sway Bars & Anti-Roll Kits', parts: ['Front Sway Bars', 'Rear Sway Bars', 'Adjustable Sway Bars', 'End Links'] },
      { id: 'shocks-struts', name: 'Shocks & Struts', parts: ['Performance Shocks', 'Adjustable Struts', 'Gas Shocks', 'Coilovers'] },
      { id: 'coilover-kits', name: 'Coil-Over Kits', parts: ['Adjustable Coilovers', 'Performance Coilovers', 'Track Coilovers'] },
      { id: 'ball-joints', name: 'Ball Joint & Bumpsteer Kits', parts: ['Upper Ball Joints', 'Lower Ball Joints', 'Bumpsteer Kits'] },
      { id: 'air-suspension', name: 'Air Suspension', parts: ['Air Bags', 'Air Compressors', 'Air Management', 'Complete Air Ride Kits'] },
      { id: 'control-arms', name: 'Control Arms', parts: ['Upper Control Arms', 'Lower Control Arms', 'Tubular Control Arms'] },
      { id: 'k-members', name: 'K-Members & Subframe Connectors', parts: ['K-Members', 'Subframe Connectors', 'Chassis Braces'] },
      { id: 'roll-bars', name: 'Roll Bars & Roll Cages', parts: ['Roll Bars', 'Roll Cages', 'Harness Bars', 'Safety Cages'] },
      { id: 'panhard-bars', name: 'Panhard Bars', parts: ['Adjustable Panhard Bars', 'Fixed Panhard Bars'] },
      { id: 'suspension-bushings', name: 'Suspension Bushings', parts: ['Polyurethane Bushings', 'Rubber Bushings', 'Bushing Kits'] },
      { id: 'lowering-kits', name: 'Lowering Kits', parts: ['Drop Kits', 'Coil Spring Lowering', 'Complete Lowering Systems'] },
      { id: 'suspension-kits', name: 'Complete Suspension Kits', parts: ['Full Suspension Kits', 'Lift Kits', 'Performance Kits'] }
    ]
  },
  {
    id: 'brakes',
    name: 'Performance Brakes',
    icon: Disc,
    color: 'red',
    description: 'Brake kits, rotors, pads, and accessories',
    subcategories: [
      { id: 'big-brake-kits', name: 'Big Brake Kits', parts: ['6-Piston Brake Kits', '4-Piston Brake Kits', 'Complete BBK Systems'] },
      { id: 'brake-rotors', name: 'Brake Rotors', parts: ['Drilled Rotors', 'Slotted Rotors', 'Drilled & Slotted', 'OE Replacement Rotors'] },
      { id: 'brake-pads', name: 'Brake Pads', parts: ['Ceramic Pads', 'Semi-Metallic Pads', 'Performance Pads', 'Track Pads'] },
      { id: 'rotor-pad-kits', name: 'Brake Rotor & Pad Kits', parts: ['Complete Brake Kits', 'Front Brake Kits', 'Rear Brake Kits'] },
      { id: 'brake-lines', name: 'Brake Lines & Hoses', parts: ['Stainless Steel Lines', 'Braided Brake Lines', 'Brake Hoses'] },
      { id: 'brake-accessories', name: 'Brake Accessories', parts: ['Brake Fluid', 'Brake Bleeder Kits', 'Brake Hardware', 'Master Cylinders'] }
    ]
  },
  {
    id: 'engine-performance',
    name: 'Engine Performance & Tuning',
    icon: Settings,
    color: 'blue',
    description: 'Tuners, intakes, superchargers, and engine mods',
    subcategories: [
      { id: 'tuners', name: 'Performance Tuners', parts: ['Custom Tuners', 'Preloaded Tuners', 'Custom Tune Files', 'Handheld Tuners'] },
      { id: 'cold-air-intakes', name: 'Cold Air Intakes', parts: ['Short Ram Intakes', 'Cold Air Intake Systems', 'Performance Filters'] },
      { id: 'throttle-enhancement', name: 'Throttle Enhancement', parts: ['Throttle Controllers', 'Electronic Throttle', 'Pedal Boosters'] },
      { id: 'chips', name: 'Performance Chips', parts: ['ECU Chips', 'Performance Modules', 'Power Programmers'] },
      { id: 'intake-manifolds', name: 'Intake Manifolds & Plenums', parts: ['Performance Manifolds', 'Ported Manifolds', 'Intake Plenums'] },
      { id: 'supercharger-kits', name: 'Supercharger Kits', parts: ['Centrifugal Superchargers', 'Roots Superchargers', 'Twin-Screw Superchargers'] },
      { id: 'throttle-bodies', name: 'Throttle Bodies & Spacers', parts: ['Big Bore Throttle Bodies', 'Throttle Spacers', 'Performance TB'] },
      { id: 'turbo-kits', name: 'Turbocharger Kits', parts: ['Single Turbo Kits', 'Twin Turbo Kits', 'Turbo Accessories'] },
      { id: 'nitrous-kits', name: 'Nitrous Kits', parts: ['Wet Nitrous Kits', 'Dry Nitrous Kits', 'Nitrous Bottles', 'NOS Systems'] },
      { id: 'camshafts', name: 'Camshafts', parts: ['Performance Camshafts', 'Stage 1 Cams', 'Stage 2 Cams', 'Cam Accessories'] },
      { id: 'filters', name: 'Oil & Fuel Filters', parts: ['Oil Filters', 'Fuel Filters', 'Air Filters', 'Performance Filters'] },
      { id: 'cooling-system', name: 'Cooling System Parts', parts: ['Radiators', 'Water Pumps', 'Thermostats', 'Coolant Hoses'] },
      { id: 'ignition-parts', name: 'Ignition Parts', parts: ['Spark Plugs', 'Ignition Coils', 'Spark Plug Wires', 'Distributors'] },
      { id: 'maf-sensors', name: 'MAF Meters & Sensors', parts: ['Mass Air Flow Sensors', 'O2 Sensors', 'MAP Sensors'] },
      { id: 'pulleys', name: 'Underdrive Pulleys', parts: ['Lightweight Pulleys', 'Performance Pulleys', 'Pulley Kits'] },
      { id: 'ecu-management', name: 'ECU & Engine Management', parts: ['Standalone ECUs', 'Piggyback Systems', 'Engine Computers'] },
      { id: 'fuel-delivery', name: 'Fuel Delivery & Injectors', parts: ['Fuel Injectors', 'Fuel Pumps', 'Fuel Rails', 'Fuel Pressure Regulators'] },
      { id: 'crate-engines', name: 'Crate Engines & Blocks', parts: ['Complete Crate Engines', 'Short Blocks', 'Long Blocks'] },
      { id: 'gaskets-seals', name: 'Gaskets & Seals', parts: ['Head Gaskets', 'Valve Cover Gaskets', 'Oil Seals', 'Engine Seals'] }
    ]
  },
  {
    id: 'exhaust',
    name: 'Performance Exhaust',
    icon: Wind,
    color: 'gray',
    description: 'Exhaust systems, headers, and mufflers',
    subcategories: [
      { id: 'axle-back', name: 'Axle-Back Exhaust', parts: ['Axle-Back Systems', 'Sport Exhaust', 'Performance Mufflers'] },
      { id: 'cat-back', name: 'Cat-Back Exhaust', parts: ['Complete Cat-Back Systems', 'Stainless Cat-Back', 'Performance Exhaust'] },
      { id: 'mid-pipes', name: 'Mid-Pipes', parts: ['H-Pipes', 'X-Pipes', 'High-Flow Mid-Pipes'] },
      { id: 'headers', name: 'Headers', parts: ['Long Tube Headers', 'Shorty Headers', 'Performance Headers'] },
      { id: 'exhaust-combos', name: 'Exhaust Combos', parts: ['Header & Exhaust Combos', 'Complete Exhaust Systems'] },
      { id: 'exhaust-accessories', name: 'Exhaust Accessories', parts: ['Exhaust Hangers', 'Exhaust Clamps', 'Gaskets'] },
      { id: 'downpipes', name: 'Downpipes', parts: ['High-Flow Downpipes', 'Catted Downpipes', 'Catless Downpipes'] },
      { id: 'o2-sensors', name: 'O2 Sensors', parts: ['Oxygen Sensors', 'Wideband O2', 'O2 Sensor Extensions'] },
      { id: 'mufflers', name: 'Mufflers', parts: ['Performance Mufflers', 'Chambered Mufflers', 'Straight-Through Mufflers'] },
      { id: 'exhaust-tips', name: 'Exhaust Tips', parts: ['Stainless Tips', 'Carbon Fiber Tips', 'Polished Tips'] }
    ]
  },
  {
    id: 'exterior',
    name: 'Exterior Mods & Accessories',
    icon: Car,
    color: 'cyan',
    description: 'Body kits, spoilers, grilles, and styling',
    subcategories: [
      { id: 'spoilers', name: 'Rear Spoilers & Wings', parts: ['Trunk Spoilers', 'Wing Spoilers', 'Lip Spoilers'] },
      { id: 'grilles', name: 'Grilles', parts: ['Mesh Grilles', 'Billet Grilles', 'LED Grilles', 'Custom Grilles'] },
      { id: 'hood-scoops', name: 'Hood Scoops', parts: ['Functional Hood Scoops', 'Decorative Scoops', 'Ram Air Hoods'] },
      { id: 'body-kits', name: 'Body Kits', parts: ['Complete Body Kits', 'Front Bumpers', 'Rear Bumpers', 'Side Skirts'] },
      { id: 'pre-painted', name: 'Pre-Painted Parts', parts: ['Painted Bumpers', 'Painted Spoilers', 'Painted Body Kits'] },
      { id: 'decals-stripes', name: 'Decals, Stickers & Stripes', parts: ['Racing Stripes', 'Vinyl Decals', 'Custom Graphics'] },
      { id: 'light-trim', name: 'Light Trim & Bezels', parts: ['Headlight Bezels', 'Taillight Covers', 'Light Trim'] },
      { id: 'mirrors', name: 'Mirrors & Mirror Covers', parts: ['Side Mirrors', 'Mirror Covers', 'Heated Mirrors'] },
      { id: 'mud-flaps', name: 'Mud Flaps', parts: ['Splash Guards', 'Rally Mud Flaps', 'Custom Mud Flaps'] },
      { id: 'fender-liners', name: 'Fender Liners', parts: ['Wheel Well Liners', 'Fender Protection', 'Splash Shields'] },
      { id: 'racks-carriers', name: 'Racks & Carriers', parts: ['Roof Racks', 'Bike Racks', 'Cargo Carriers'] },
      { id: 'towing', name: 'Towing & Hitch Accessories', parts: ['Trailer Hitches', 'Tow Hooks', 'Hitch Accessories'] },
      { id: 'vinyl-wrap', name: 'Vinyl Wrap & PPF', parts: ['Vinyl Wraps', 'Paint Protection Film', 'Clear Bra'] },
      { id: 'convertible-tops', name: 'Convertible Top Parts', parts: ['Soft Tops', 'Hard Tops', 'Top Accessories'] },
      { id: 'headlight-splitters', name: 'Headlight Splitters', parts: ['Front Splitters', 'Chin Spoilers'] },
      { id: 'bumpers', name: 'Bumpers & Chin Spoilers', parts: ['Front Bumpers', 'Rear Bumpers', 'Chin Spoilers'] }
    ]
  },
  {
    id: 'interior-lighting',
    name: 'Interior & Lighting',
    icon: Zap,
    color: 'yellow',
    description: 'Interior upgrades and lighting systems',
    subcategories: [
      { id: 'floor-mats', name: 'Floor Mats & Carpets', parts: ['All-Weather Mats', 'Carpet Mats', 'Custom Floor Mats'] },
      { id: 'seats', name: 'Seats & Seat Covers', parts: ['Racing Seats', 'Seat Covers', 'Seat Brackets'] },
      { id: 'doors', name: 'Door & Door Accessories', parts: ['Door Panels', 'Door Handles', 'Door Sills'] },
      { id: 'steering-wheels', name: 'Steering Wheels', parts: ['Performance Steering Wheels', 'Racing Wheels', 'Quick Release Hubs'] },
      { id: 'pedals', name: 'Pedals', parts: ['Performance Pedals', 'Dead Pedals', 'Pedal Covers'] },
      { id: 'shift-knobs', name: 'Shift Knobs', parts: ['Manual Shift Knobs', 'Automatic Shift Knobs', 'Custom Shifters'] },
      { id: 'gauges', name: 'Gauge Pods & Navigation', parts: ['Gauge Pods', 'Digital Gauges', 'GPS Navigation'] },
      { id: 'interior-lighting', name: 'Interior Lighting', parts: ['LED Interior Lights', 'Footwell Lights', 'Ambient Lighting'] },
      { id: 'trim', name: 'Dash & Carbon Fiber Trim', parts: ['Carbon Fiber Dash', 'Interior Trim Kits', 'Center Console Trim'] },
      { id: 'headlights', name: 'Headlights', parts: ['LED Headlights', 'HID Headlights', 'Projector Headlights', 'Halo Headlights'] },
      { id: 'turn-signals', name: 'Turn Signals', parts: ['LED Turn Signals', 'Side Markers', 'Corner Lights'] },
      { id: 'tail-lights', name: 'Tail Lights', parts: ['LED Tail Lights', 'Smoked Tail Lights', 'Euro Tail Lights'] },
      { id: 'sequential-tails', name: 'Sequential Tail Lights', parts: ['Sequential LED Tails', 'Dynamic Turn Signals'] },
      { id: 'fog-lights', name: 'Fog Lights', parts: ['LED Fog Lights', 'HID Fog Lights', 'Fog Light Kits'] },
      { id: 'led-strips', name: 'LED Strips & Bulbs', parts: ['Underglow LED', 'Interior LED Strips', 'LED Bulbs'] }
    ]
  },
  {
    id: 'maintenance-tools',
    name: 'Tools, Maintenance & Care',
    icon: Wrench,
    color: 'green',
    description: 'Tools, car care, and maintenance products',
    subcategories: [
      { id: 'tools', name: 'Tools & Equipment', parts: ['Hand Tools', 'Power Tools', 'Diagnostic Tools', 'Torque Wrenches'] },
      { id: 'car-care', name: 'Car & Wheel Care', parts: ['Car Wash Soap', 'Wax & Polish', 'Tire Shine', 'Detailing Kits'] },
      { id: 'safety-gear', name: 'Safety Gear & Equipment', parts: ['Fire Extinguishers', 'First Aid Kits', 'Safety Harnesses'] },
      { id: 'car-covers', name: 'Car Covers & Protection', parts: ['Indoor Car Covers', 'Outdoor Car Covers', 'Custom Covers'] }
    ]
  },
  {
    id: 'lifestyle',
    name: 'Apparel & Lifestyle',
    icon: ShoppingCart,
    color: 'pink',
    description: 'Clothing, accessories, and merchandise',
    subcategories: [
      { id: 'apparel', name: 'Apparel', parts: ['T-Shirts', 'Hoodies', 'Hats', 'Jackets'] },
      { id: 'decals-glow', name: 'Decals & Glow Accessories', parts: ['Glow Kits', 'Neon Signs', 'Light-Up Decals'] }
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
  gray: 'bg-gray-500/10 border-gray-500/30 text-gray-500'
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
                    className="bg-[#1a1a1a] border-2 border-[#333] rounded-xl overflow-hidden text-left hover:border-orange-500 transition-all duration-200 group"
                  >
                    {/* Icon/Image Section */}
                    <div className={`h-32 md:h-40 flex items-center justify-center bg-gradient-to-br ${colorClasses[category.color].replace('border-', 'from-')} to-[#1a1a1a] relative`}>
                      <Icon className="w-12 h-12 md:w-16 md:h-16 opacity-90 group-hover:scale-110 transition-transform" />
                      <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                        <span className="text-white text-xs font-medium">{category.subcategories?.length || 0}</span>
                      </div>
                    </div>
                    
                    {/* Text Section */}
                    <div className="p-3 md:p-4">
                      <h3 className="text-white font-bold text-sm md:text-base mb-1 group-hover:text-orange-500 transition-colors line-clamp-2">
                        {category.name}
                      </h3>
                      <p className="text-gray-500 text-xs mb-2 line-clamp-2">
                        {category.description}
                      </p>
                      <div className="flex items-center justify-between text-gray-400 text-xs">
                        <span>{itemCount} parts</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 group-hover:text-orange-500 transition-all" />
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

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {selectedCategory.subcategories?.map((subcategory) => (
                    <button
                      key={subcategory.id}
                      onClick={() => handleSubcategoryClick(subcategory)}
                      className="bg-[#1a1a1a] border-2 border-[#333] rounded-lg p-4 text-left hover:border-orange-500 hover:bg-[#222] transition-all group"
                    >
                      <h3 className="text-white font-bold mb-1 group-hover:text-orange-500 transition-colors text-sm md:text-base">
                        {subcategory.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <p className="text-gray-500 text-xs">{subcategory.parts.length} parts</p>
                        <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
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

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {selectedSubcategory.parts.map((part, index) => (
                  <button
                    key={index}
                    onClick={() => handlePartSearch(part)}
                    disabled={loading}
                    className="bg-[#1a1a1a] border-2 border-[#333] rounded-lg p-4 text-left hover:border-orange-500 hover:bg-[#222] transition-all group disabled:opacity-50"
                  >
                    <h3 className="text-white font-semibold mb-1 group-hover:text-orange-500 transition-colors text-sm">
                      {part}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-500 text-xs">View options</p>
                      {loading ? (
                        <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                      )}
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