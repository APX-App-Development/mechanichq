import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, MousePointerClick, Store, Calendar } from 'lucide-react';

export default function AffiliateStats() {
  const [stats, setStats] = useState({
    totalClicks: 0,
    byStore: {},
    totalPotentialValue: 0
  });

  useEffect(() => {
    const clicks = JSON.parse(localStorage.getItem('affiliateClicks') || '[]');
    const calculated = {
      totalClicks: clicks.length,
      byStore: {},
      totalPotentialValue: 0
    };
    
    clicks.forEach(click => {
      if (!calculated.byStore[click.store]) {
        calculated.byStore[click.store] = { clicks: 0, value: 0 };
      }
      calculated.byStore[click.store].clicks++;
      calculated.byStore[click.store].value += click.price || 0;
      calculated.totalPotentialValue += click.price || 0;
    });
    
    setStats(calculated);
  }, []);

  // Estimated commission (5-10% average)
  const estimatedCommission = stats.totalPotentialValue * 0.075;

  return (
    <div className="min-h-screen bg-[#111] p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Affiliate Stats Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-[#1a1a1a] border-[#333] p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <MousePointerClick className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Clicks</p>
                <p className="text-white text-2xl font-bold">{stats.totalClicks}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-[#1a1a1a] border-[#333] p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Potential Value</p>
                <p className="text-white text-2xl font-bold">${stats.totalPotentialValue.toFixed(2)}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-[#1a1a1a] border-[#333] p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Est. Commission</p>
                <p className="text-white text-2xl font-bold">${estimatedCommission.toFixed(2)}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* By Store */}
        <Card className="bg-[#1a1a1a] border-[#333] p-6">
          <div className="flex items-center gap-2 mb-6">
            <Store className="w-5 h-5 text-orange-500" />
            <h2 className="text-xl font-semibold text-white">Performance by Store</h2>
          </div>

          <div className="space-y-4">
            {Object.entries(stats.byStore).length === 0 ? (
              <p className="text-gray-500 text-center py-8">No affiliate clicks yet</p>
            ) : (
              Object.entries(stats.byStore)
                .sort((a, b) => b[1].clicks - a[1].clicks)
                .map(([store, data]) => (
                  <div key={store} className="flex items-center justify-between p-4 bg-[#222] rounded-xl">
                    <div className="flex-1">
                      <p className="text-white font-medium">{store}</p>
                      <p className="text-gray-400 text-sm">{data.clicks} clicks</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-bold">${data.value.toFixed(2)}</p>
                      <p className="text-gray-500 text-xs">
                        ~${(data.value * 0.075).toFixed(2)} commission
                      </p>
                    </div>
                  </div>
                ))
            )}
          </div>
        </Card>

        {/* Instructions */}
        <Card className="bg-[#1a1a1a] border-[#333] p-6 mt-6">
          <h3 className="text-white font-semibold mb-3">🚀 Setup Instructions</h3>
          <div className="space-y-2 text-gray-400 text-sm">
            <p>1. Open <code className="bg-[#222] px-2 py-1 rounded text-orange-500">components/AffiliateTracker.jsx</code></p>
            <p>2. Replace placeholder affiliate IDs with your actual credentials:</p>
            <ul className="list-disc list-inside pl-4 space-y-1 text-xs mt-2">
              <li><strong>Amazon Associates:</strong> Get your tag from <a href="https://affiliate-program.amazon.com" target="_blank" className="text-blue-400 hover:underline">Amazon Associates</a></li>
              <li><strong>eBay Partner Network:</strong> Register at <a href="https://partnernetwork.ebay.com" target="_blank" className="text-blue-400 hover:underline">eBay Partner Network</a></li>
              <li><strong>AutoZone, CARiD, etc:</strong> Apply for their individual affiliate programs</li>
            </ul>
            <p className="mt-4">3. All "Buy Part" links automatically include your affiliate tracking</p>
            <p>4. Commission rates typically range from 2-10% depending on retailer</p>
          </div>
        </Card>
      </div>
    </div>
  );
}