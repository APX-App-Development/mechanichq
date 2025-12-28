import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Menu, X, Car, Wrench, BookmarkCheck, History, Home, ShoppingCart, Briefcase, BookOpen, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import DevSecretDialog from '@/components/DevSecretDialog';
import ComingSoonDialog from '@/components/ComingSoonDialog';
import { useDevMode } from '@/components/DevModeProvider';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [showDevDialog, setShowDevDialog] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [comingSoonFeature, setComingSoonFeature] = useState('');
  const [devClickCount, setDevClickCount] = useState(0);
  const { isDevMode, disableDevMode } = useDevMode();

  const getFeatureFlags = () => {
    const stored = localStorage.getItem('featureFlags');
    return stored ? JSON.parse(stored) : {
      catalog: false,
      myGarage: true,
      myJobs: true,
      partsList: true,
      searchHistory: true,
      home: true
    };
  };

  const featureFlags = getFeatureFlags();

  const navItems = [
    { name: 'Home', icon: Home, page: 'Home', protected: !featureFlags.home },
    { name: 'Catalog', icon: BookOpen, page: 'PartsCatalog', protected: !featureFlags.catalog },
    { name: 'My Garage', icon: Car, page: 'MyGarage', protected: !featureFlags.myGarage },
    { name: 'My Jobs', icon: Briefcase, page: 'MyJobs', protected: !featureFlags.myJobs },
    { name: 'Parts List', icon: ShoppingCart, page: 'PartsList', protected: !featureFlags.partsList },
    { name: 'History', icon: History, page: 'SearchHistory', protected: !featureFlags.searchHistory },
  ];

  // Add Dev Panel to nav when in dev mode
  if (isDevMode) {
    navItems.push({ name: 'Dev Panel', icon: Code, page: 'DevPanel', protected: false });
  }

  const handleLogoClick = () => {
    setDevClickCount(prev => prev + 1);
    if (devClickCount >= 4) {
      setShowDevDialog(true);
      setDevClickCount(0);
    }
    setTimeout(() => setDevClickCount(0), 3000);
  };

  const handleNavClick = (e, item) => {
    if (item.protected && !isDevMode) {
      e.preventDefault();
      setComingSoonFeature(item.name);
      setShowComingSoon(true);
    }
  };

  return (
    <header className="bg-black border-b border-[#1a1a1a] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={handleLogoClick} className="flex items-center gap-3">
            <div className="flex items-baseline gap-1">
              <span className="text-[#FF6B35] font-bold text-xl tracking-tight">MechanicHQ</span>
              {isDevMode && (
                <Badge className="bg-[#FF6B35] text-white text-xs ml-2">
                  <Code className="w-3 h-3 mr-1" />
                  DEV
                </Badge>
              )}
            </div>
          </button>
          <span className="hidden sm:block text-gray-600 text-xs ml-3">OEM Parts + Pro Instructions in Seconds</span>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={createPageUrl(item.page)}
                onClick={(e) => handleNavClick(e, item)}
                className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-all duration-200"
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Dev Mode */}
          {isDevMode && (
            <div className="hidden md:flex items-center gap-2">
              <Button
                onClick={disableDevMode}
                variant="outline"
                size="sm"
                className="border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white"
              >
                Exit Dev
              </Button>
            </div>
          )}

          {/* Mobile bottom nav spacer */}
          <div className="md:hidden w-10" />
        </div>
      </div>



      <DevSecretDialog open={showDevDialog} onOpenChange={setShowDevDialog} />
      <ComingSoonDialog 
        open={showComingSoon} 
        onOpenChange={setShowComingSoon}
        featureName={comingSoonFeature}
      />

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-[#1a1a1a] z-50 pb-safe">
        <div className="flex items-center justify-around py-2">
          {navItems.slice(0, 5).map((item) => {
            const isActive = window.location.pathname.includes(item.page);
            return (
              <Link
                key={item.name}
                to={createPageUrl(item.page)}
                onClick={(e) => handleNavClick(e, item)}
                className={`flex flex-col items-center gap-1 px-2 transition-colors min-w-[60px] ${
                  isActive ? 'text-[#FF6B35]' : 'text-gray-600'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}