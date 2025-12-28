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
    <div className="flex flex-col bg-black min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col px-4 py-6">
        {/* Content */}
        <div className="w-full max-w-6xl mx-auto">
          {/* Title */}
          <div className="mb-8">
            <h2 className="text-white text-2xl font-bold mb-2">Find OEM Parts Instantly</h2>
            <p className="text-gray-500 text-sm">
              AI-powered search for genuine parts with pricing & guides
            </p>
          </div>

          {/* Main Search */}
          <div className="mb-6">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Scan VIN Button */}
          <button className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 mb-6 flex items-center justify-center gap-2 active:bg-[#222]">
            <span className="text-2xl">📷</span>
            <span className="text-white font-medium">Scan VIN</span>
          </button>

          {/* Search For */}
          <div className="mb-6">
            <h3 className="text-white text-base font-semibold mb-3">Search for:</h3>
            <div className="flex flex-wrap gap-2">
              {vehicles.slice(0, 2).map((vehicle) => (
                <button
                  key={vehicle.id}
                  onClick={() => handleGarageVehicleSearch(vehicle)}
                  className="px-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full text-white text-sm active:bg-[#222]"
                >
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </button>
              ))}
            </div>
          </div>

          {/* Recent Searches */}
          <div>
            <h3 className="text-white text-base font-semibold mb-3">Recent Searches</h3>
            <div className="space-y-3">
              <button className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 flex items-center gap-3 active:bg-[#222]">
                <Wrench className="w-5 h-5 text-gray-500" />
                <span className="text-white text-sm flex-1 text-left">Toyota Camry brake pads</span>
              </button>
              <button className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 flex items-center gap-3 active:bg-[#222]">
                <Wrench className="w-5 h-5 text-gray-500" />
                <span className="text-white text-sm flex-1 text-left">Honda Civic oil filter</span>
              </button>
              <button className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 flex items-center gap-3 active:bg-[#222]">
                <Wrench className="w-5 h-5 text-gray-500" />
                <span className="text-white text-sm flex-1 text-left">Ford F-150 spark plugs</span>
              </button>
            </div>
          </div>

          {/* Why MechanicHQ */}
          <div className="mt-12">
            <h3 className="text-white text-base font-semibold mb-3">Why MechanicHQ?</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Get instant access to genuine OEM parts with verified pricing across 20+ retailers. 
              Every search includes installation guides, torque specs, and difficulty ratings to help you work confidently.
            </p>
          </div>
        </div>
      </section>


    </div>
  );
}