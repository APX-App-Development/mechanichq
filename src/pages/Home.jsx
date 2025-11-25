import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import SearchBar from '@/components/SearchBar';
import VehicleSelector from '@/components/VehicleSelector';
import { Zap, Shield, Clock, Wrench, ChevronRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const navigate = useNavigate();
  const [searchMode, setSearchMode] = useState('text');

  const handleSearch = (query) => {
    navigate(createPageUrl('SearchResults') + `?q=${encodeURIComponent(query)}`);
  };

  const handleVehicleSelect = (vehicle) => {
    const query = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.engine || ''}`.trim();
    navigate(createPageUrl('SearchResults') + `?q=${encodeURIComponent(query)}&year=${vehicle.year}&make=${vehicle.make}&model=${vehicle.model}`);
  };

  const features = [
    {
      icon: Zap,
      title: 'AI-Powered Search',
      description: 'Instantly find the exact OEM part number for any vehicle 2010+'
    },
    {
      icon: Shield,
      title: 'Genuine OEM Parts',
      description: 'Factory-spec part numbers direct from manufacturer databases'
    },
    {
      icon: Clock,
      title: 'Installation Guides',
      description: 'Step-by-step instructions for every part replacement'
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1920&q=80)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#111]/95 via-[#111]/85 to-[#111]" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-12 text-center">
          <div className="inline-flex items-center gap-2 bg-[#e31e24]/10 border border-[#e31e24]/30 rounded-full px-4 py-1.5 mb-6">
            <Zap className="w-4 h-4 text-[#e31e24]" />
            <span className="text-[#e31e24] text-sm font-medium">Powered by Claude AI</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Find OEM Parts <span className="text-[#e31e24]">Instantly</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Get genuine OEM part numbers, MSRP prices, and installation instructions for any vehicle 2010 and newer.
          </p>

          {/* Search Tabs */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <Button
              variant={searchMode === 'text' ? 'default' : 'ghost'}
              onClick={() => setSearchMode('text')}
              className={searchMode === 'text' 
                ? 'bg-[#e31e24] hover:bg-[#c91a1f]' 
                : 'text-gray-400 hover:text-white hover:bg-[#222]'
              }
            >
              <Search className="w-4 h-4 mr-2" />
              Quick Search
            </Button>
            <Button
              variant={searchMode === 'vehicle' ? 'default' : 'ghost'}
              onClick={() => setSearchMode('vehicle')}
              className={searchMode === 'vehicle' 
                ? 'bg-[#e31e24] hover:bg-[#c91a1f]' 
                : 'text-gray-400 hover:text-white hover:bg-[#222]'
              }
            >
              <Wrench className="w-4 h-4 mr-2" />
              Shop By Vehicle
            </Button>
          </div>

          {/* Search Component */}
          <div className="max-w-4xl mx-auto">
            {searchMode === 'text' ? (
              <SearchBar onSearch={handleSearch} large />
            ) : (
              <VehicleSelector onSelect={handleVehicleSelect} />
            )}
          </div>

          {/* Quick Examples */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-gray-500 text-sm">Popular searches:</span>
            {['Brake pads F-150', 'Oil filter Camry', 'Spark plugs Civic'].map((term) => (
              <button
                key={term}
                onClick={() => handleSearch(term)}
                className="text-sm text-gray-400 hover:text-white bg-[#1a1a1a] hover:bg-[#222] px-3 py-1 rounded-full transition-all"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-[#111] to-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6 hover:border-[#e31e24]/50 transition-all duration-300 group"
              >
                <div className="bg-[#e31e24]/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#e31e24]/20 transition-all">
                  <feature.icon className="w-6 h-6 text-[#e31e24]" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to find your parts?
          </h2>
          <p className="text-gray-400 mb-6">
            Save time and money with accurate OEM part numbers and installation guides.
          </p>
          <Button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-[#e31e24] hover:bg-[#c91a1f] text-white font-semibold h-12 px-8"
          >
            Start Searching
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
}