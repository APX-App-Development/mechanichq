import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { User, Settings, Bell, Shield, HelpCircle, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (err) {
      console.error('Failed to load user:', err);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    base44.auth.logout();
  };

  const settingsSections = [
    {
      title: 'Account Settings',
      items: [
        { icon: Settings, label: 'General Settings', color: 'text-[#FF6B35]', bg: 'bg-[#FF6B35]/10' },
        { icon: Bell, label: 'Notifications', color: 'text-[#FF6B35]', bg: 'bg-[#FF6B35]/10' },
        { icon: Shield, label: 'Privacy & Security', color: 'text-green-500', bg: 'bg-green-500/10' }
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help Center', color: 'text-[#FF6B35]', bg: 'bg-[#FF6B35]/10' }
      ]
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#FF6B35] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[#FF6B35] font-bold text-xl mb-2">Profile</h1>
        </div>

        {/* User Info Card */}
        <Card className="bg-[#1a1a1a] border-[#2a2a2a] rounded-2xl p-6 mb-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-[#FF6B35] rounded-full flex items-center justify-center mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-white font-semibold text-xl mb-1">
              {user?.full_name || 'User'}
            </h2>
            <p className="text-gray-500 text-sm">{user?.email}</p>
          </div>
        </Card>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIdx) => (
          <div key={sectionIdx} className="mb-6">
            <h3 className="text-white font-medium text-sm mb-3 px-2">{section.title}</h3>
            <div className="space-y-2">
              {section.items.map((item, itemIdx) => (
                <button
                  key={itemIdx}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 flex items-center gap-4 hover:border-[#FF6B35] transition-all"
                >
                  <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center`}>
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <span className="text-white font-medium flex-1 text-left">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded-2xl h-14 font-medium"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}