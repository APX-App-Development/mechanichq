import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Menu, X, Car, Wrench, BookmarkCheck, History, Home, ShoppingCart, Moon, Sun, Briefcase, BookOpen, Code } from 'lucide-react';
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
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') !== 'false';
    }
    return true;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#111';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#f5f5f5';
    }
  }, [darkMode]);

  const navItems = [
    { name: 'Home', icon: Home, page: 'Home', protected: false },
    { name: 'Catalog', icon: BookOpen, page: 'PartsCatalog', protected: true },
    { name: 'My Garage', icon: Car, page: 'MyGarage', protected: false },
    { name: 'My Jobs', icon: Briefcase, page: 'MyJobs', protected: false },
    { name: 'Parts List', icon: ShoppingCart, page: 'PartsList', protected: false },
    { name: 'History', icon: History, page: 'SearchHistory', protected: false },
  ];

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
    <header className="bg-[#111] border-b border-[#333] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={handleLogoClick} className="flex items-center gap-3">
            <div className="relative">
              <div className="bg-gradient-to-br from-slate-500 to-slate-600 p-2.5 rounded-xl shadow-lg">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-orange-500 rounded-full border-2 border-[#111]"></div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-slate-200 font-bold text-xl tracking-tight">Mechanic</span>
              <span className="text-orange-500 font-bold text-xl">HQ</span>
              {isDevMode && (
                <Badge className="bg-orange-500 text-white text-xs ml-2">
                  <Code className="w-3 h-3 mr-1" />
                  DEV
                </Badge>
              )}
            </div>
          </button>
          <span className="hidden sm:block text-gray-500 text-xs ml-3">OEM Parts + Pro Instructions in Seconds</span>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={createPageUrl(item.page)}
                onClick={(e) => handleNavClick(e, item)}
                className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-[#222] rounded-lg transition-all duration-200"
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Theme Toggle & Dev Mode */}
          <div className="hidden md:flex items-center gap-2">
            {isDevMode && (
              <Button
                onClick={disableDevMode}
                variant="outline"
                size="sm"
                className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
              >
                Exit Dev
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
              className="text-gray-400 hover:text-white hover:bg-[#222]"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-white hover:bg-[#222]">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#111] border-[#333] w-72">
              <div className="flex flex-col gap-2 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={createPageUrl(item.page)}
                    onClick={(e) => {
                      handleNavClick(e, item);
                      if (!item.protected || isDevMode) {
                        setOpen(false);
                      }
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-[#222] rounded-lg transition-all duration-200"
                  >
                    <item.icon className="w-5 h-5 text-orange-500" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
                
                {/* Theme Toggle Mobile */}
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-[#222] rounded-lg transition-all duration-200 mt-4 border-t border-[#333] pt-6"
                >
                  {darkMode ? <Sun className="w-5 h-5 text-orange-500" /> : <Moon className="w-5 h-5 text-orange-500" />}
                  <span className="font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Orange accent line */}
      <div className="h-1 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600" />

      <DevSecretDialog open={showDevDialog} onOpenChange={setShowDevDialog} />
      <ComingSoonDialog 
        open={showComingSoon} 
        onOpenChange={setShowComingSoon}
        featureName={comingSoonFeature}
      />
    </header>
  );
}