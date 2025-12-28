import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Search, Scan, TrendingUp, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Home() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadGarage();
    loadRecentSearches();
  }, []);

  const loadGarage = async () => {
    try {
      const data = await base44.entities.Vehicle.list('-created_date', 5);
      setVehicles(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadRecentSearches = async () => {
    try {
      const data = await base44.entities.PartSearch.list('-created_date', 5);
      setRecentSearches(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(createPageUrl('SearchResults') + `?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleVehicleClick = (vehicle) => {
    const query = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
    navigate(createPageUrl('SearchResults') + `?q=${encodeURIComponent(query)}&year=${vehicle.year}&make=${vehicle.make}&model=${vehicle.model}`);
  };

  const handleRecentSearchClick = (search) => {
    navigate(createPageUrl('SearchResults') + `?q=${encodeURIComponent(search.query)}`);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <h1 className="text-[#FF6B35] font-bold text-xl mb-8">MechanicHQ</h1>

        {/* Main Heading */}
        <div className="mb-6">
          <h2 className="text-white font-bold text-2xl mb-2">Find OEM Parts Instantly</h2>
          <p className="text-gray-500 text-sm">AI-powered search for genuine parts with pricing & guides</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Describe the part you need..."
              className="bg-[#1a1a1a] border-[#2a2a2a] text-white pl-12 pr-14 h-14 rounded-2xl text-base"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#FF6B35] hover:bg-[#E85D2A] rounded-xl flex items-center justify-center transition-colors"
            >
              <TrendingUp className="w-5 h-5 text-white" />
            </button>
          </div>
        </form>

        {/* Scan VIN Button */}
        <Button 
          variant="outline"
          className="w-full bg-transparent border-2 border-[#FF6B35] text-white hover:bg-[#FF6B35]/10 h-14 rounded-2xl font-medium mb-6"
        >
          <Scan className="w-5 h-5 mr-2" />
          Scan VIN
        </Button>

        {/* Saved Vehicles */}
        {vehicles.length > 0 && (
          <div className="mb-6">
            <h3 className="text-white font-medium mb-3">Search for:</h3>
            <div className="flex flex-wrap gap-2">
              {vehicles.slice(0, 2).map((vehicle) => (
                <button
                  key={vehicle.id}
                  onClick={() => handleVehicleClick(vehicle)}
                  className="px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-white text-sm font-medium hover:border-[#FF6B35] transition-all"
                >
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="mb-6">
            <h3 className="text-white font-medium mb-3">Recent Searches</h3>
            <div className="space-y-2">
              {recentSearches.slice(0, 3).map((search) => (
                <button
                  key={search.id}
                  onClick={() => handleRecentSearchClick(search)}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 flex items-center gap-3 hover:border-[#FF6B35] transition-all group text-left"
                >
                  <TrendingUp className="w-4 h-4 text-gray-500 group-hover:text-[#FF6B35] transition-colors" />
                  <span className="text-white text-sm">{search.query}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Why MechanicHQ Section */}
        <div className="mt-12">
          <h3 className="text-white font-medium mb-4">Why MechanicHQ?</h3>
          <div className="space-y-3">
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4">
              <h4 className="text-white font-medium mb-1">Real-Time OEM Lookup</h4>
              <p className="text-gray-500 text-sm">Search 20+ retailers instantly with live pricing & availability</p>
            </div>
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4">
              <h4 className="text-white font-medium mb-1">Installation Guides</h4>
              <p className="text-gray-500 text-sm">Step-by-step instructions with torque specs & tools needed</p>
            </div>
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4">
              <h4 className="text-white font-medium mb-1">Price Comparison</h4>
              <p className="text-gray-500 text-sm">Find the best deals across Amazon, AutoZone, RockAuto & more</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}