import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import SearchBar from '@/components/SearchBar';
import VehicleSelector from '@/components/VehicleSelector';
import CommonJobs from '@/components/CommonJobs';
import { Zap, Shield, Clock, Wrench, ChevronRight, Car, Bookmark, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);

  useEffect(() => {
    loadGarage();
  }, []);

  const loadGarage = async () => {
    try {
      const data = await base44.entities.Vehicle.list('-created_date', 5);
      setVehicles(data);
    } catch (err) {
      console.error(err);
    }
    setLoadingVehicles(false);
  };

  const handleSearch = (query) => {
    navigate(createPageUrl('SearchResults') + `?q=${encodeURIComponent(query)}`);
  };

  const handleVehicleSelect = (vehicle) => {
    const query = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.engine || ''}`.trim();
    navigate(createPageUrl('SearchResults') + `?q=${encodeURIComponent(query)}&year=${vehicle.year}&make=${vehicle.make}&model=${vehicle.model}&engine=${encodeURIComponent(vehicle.engine || '')}`);
  };

  const handleGarageVehicleSearch = (vehicle) => {
    const query = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
    navigate(createPageUrl('SearchResults') + `?q=${encodeURIComponent(query)}&year=${vehicle.year}&make=${vehicle.make}&model=${vehicle.model}`);
  };

  const features = [
    {
      icon: Zap,
      title: 'Real-Time OEM Lookup',
      description: 'Searches ACDelco, Mopar, Toyota, Honda, Ford catalogs instantly'
    },
    {
      icon: Shield,
      title: 'Genuine Part Numbers',
      description: 'Factory OEM numbers with supersession tracking'
    },
    {
      icon: Clock,
      title: 'Installation Guides',
      description: 'Step-by-step instructions with difficulty ratings'
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex flex-col justify-center overflow-hidden">
        {/* Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1920&q=80)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#111]/98 via-[#111]/90 to-[#111]" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-8">
          {/* Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-[#e31e24]/10 border border-[#e31e24]/30 rounded-full px-4 py-1.5 mb-5">
              <Zap className="w-4 h-4 text-[#e31e24]" />
              <span className="text-[#e31e24] text-sm font-medium">Power For The DIY Mechanic</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Find OEM Parts <span className="text-[#e31e24]">Instantly</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
              Get exact OEM part numbers, MSRP prices, supersession info, purchase links and install instructions — all in one search.
            </p>
          </div>

          {/* Main Search */}
          <div className="mb-8">
            <SearchBar onSearch={handleSearch} large />
          </div>

          {/* Vehicle Selector */}
          <div className="mb-8">
            <VehicleSelector onSelect={handleVehicleSelect} />
          </div>

          {/* Common Jobs Shortcuts */}
          <div className="mb-8 max-w-4xl mx-auto">
            <p className="text-gray-400 text-sm mb-3 text-center">Quick Jobs</p>
            <CommonJobs savedVehicles={vehicles} />
          </div>

          {/* My Garage Quick Access */}
          {vehicles.length > 0 && (
            <div className="bg-[#1a1a1a]/80 backdrop-blur border border-[#333] rounded-2xl p-5 max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Car className="w-5 h-5 text-[#e31e24]" />
                  <span className="text-white font-semibold">My Garage</span>
                  <Badge className="bg-[#222] text-gray-400 border-0 text-xs ml-1">
                    {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
                <Link 
                  to={createPageUrl('MyGarage')}
                  className="text-[#e31e24] text-sm font-medium flex items-center gap-1 hover:underline"
                >
                  Manage Garage
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {vehicles.map((vehicle) => (
                  <button
                    key={vehicle.id}
                    onClick={() => handleGarageVehicleSearch(vehicle)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#222] hover:bg-[#333] border border-[#444] rounded-xl text-left transition-all group"
                  >
                    <div className="w-8 h-8 bg-[#e31e24]/20 rounded-lg flex items-center justify-center">
                      <Car className="w-4 h-4 text-[#e31e24]" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium group-hover:text-[#e31e24] transition-colors">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </p>
                      {vehicle.nickname && (
                        <p className="text-gray-500 text-xs">{vehicle.nickname}</p>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-[#e31e24] ml-2" />
                  </button>
                ))}
                <Link
                  to={createPageUrl('MyGarage')}
                  className="flex items-center gap-2 px-4 py-2.5 bg-transparent hover:bg-[#222] border border-dashed border-[#444] rounded-xl transition-all"
                >
                  <span className="text-gray-400 text-sm">+ Add Vehicle</span>
                </Link>
              </div>
            </div>
          )}

          {/* No Garage CTA */}
          {!loadingVehicles && vehicles.length === 0 && (
            <div className="text-center">
              <Link to={createPageUrl('MyGarage')}>
                <Button variant="outline" className="bg-transparent border-[#444] text-gray-300 hover:bg-[#222] hover:text-white">
                  <Car className="w-4 h-4 mr-2" />
                  Save Your Vehicle to My Garage
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-[#111] to-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              How It Works
            </h2>
            <p className="text-gray-400">
              Our AI searches official OEM catalogs in real-time
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-[#1a1a1a] border border-[#333] rounded-2xl p-6 hover:border-[#e31e24]/50 transition-all duration-300 group"
              >
                <div className="bg-[#e31e24]/10 w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#e31e24]/20 transition-all">
                  <feature.icon className="w-7 h-7 text-[#e31e24]" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Supported OEMs */}
          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm mb-4">Searches parts from</p>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
              {['Toyota', 'Honda', 'Ford', 'Chevrolet', 'Mopar', 'ACDelco', 'Nissan', 'BMW'].map((brand) => (
                <span key={brand} className="text-gray-400 font-medium text-sm md:text-base opacity-60 hover:opacity-100 transition-opacity">
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}