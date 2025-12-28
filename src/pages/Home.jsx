import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Search, ScanLine, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [vehiclesData, searchesData] = await Promise.all([
        base44.entities.Vehicle.list('-created_date', 5),
        base44.entities.PartSearch.list('-created_date', 3)
      ]);
      setVehicles(vehiclesData);
      setRecentSearches(searchesData);
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

  const handleRecentSearch = (search) => {
    navigate(createPageUrl('SearchResults') + `?q=${encodeURIComponent(search.query)}`);
  };

  return (
    <div className="min-h-screen bg-black px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-white font-bold text-2xl mb-2">Find OEM Parts Instantly</h1>
          <p className="text-gray-500 text-sm">AI-powered search for genuine parts with pricing & guides</p>
        </div>

        {/* Search Box */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Describe the part you need..."
              className="bg-[#1a1a1a] border-[#2a2a2a] text-white pl-12 h-14 rounded-xl"
            />
            <Button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#FF6B35] hover:bg-[#FF6B35]/90 h-10 w-10 p-0"
            >
              <ScanLine className="w-5 h-5" />
            </Button>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full bg-transparent border-[#FF6B35] text-white hover:bg-[#FF6B35]/10 h-12 rounded-xl"
          >
            <ScanLine className="w-5 h-5 mr-2" />
            Scan VIN
          </Button>
        </form>

        {/* Search For Vehicles */}
        {vehicles.length > 0 && (
          <div className="mb-8">
            <h2 className="text-white font-semibold mb-3">Search for:</h2>
            <div className="flex flex-wrap gap-2">
              {vehicles.map((vehicle) => (
                <button
                  key={vehicle.id}
                  onClick={() => handleVehicleClick(vehicle)}
                  className="px-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-white text-sm hover:border-[#FF6B35] transition-all"
                >
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="mb-8">
            <h2 className="text-white font-semibold mb-3">Recent Searches</h2>
            <div className="space-y-2">
              {recentSearches.map((search, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRecentSearch(search)}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 flex items-center gap-3 hover:border-[#FF6B35] transition-all group"
                >
                  <TrendingUp className="w-5 h-5 text-gray-500 group-hover:text-[#FF6B35]" />
                  <span className="text-white text-sm">{search.query}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Why MechanicHQ */}
        <div className="mt-12">
          <h2 className="text-white font-semibold text-lg mb-4">Why MechanicHQ?</h2>
          <div className="space-y-4">
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
              <h3 className="text-white font-medium mb-1">Real OEM Parts</h3>
              <p className="text-gray-500 text-sm">Genuine manufacturer parts with exact part numbers</p>
            </div>
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
              <h3 className="text-white font-medium mb-1">Live Pricing</h3>
              <p className="text-gray-500 text-sm">Compare prices across 20+ retailers instantly</p>
            </div>
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
              <h3 className="text-white font-medium mb-1">Install Guides</h3>
              <p className="text-gray-500 text-sm">Step-by-step instructions with difficulty ratings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}