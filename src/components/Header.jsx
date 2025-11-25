import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Menu, X, Car, Wrench, BookmarkCheck, History, Home, ShoppingCart, Moon, Sun, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function Header() {
  const [open, setOpen] = useState(false);
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
    { name: 'Home', icon: Home, page: 'Home' },
    { name: 'My Garage', icon: Car, page: 'MyGarage' },
    { name: 'My Jobs', icon: Briefcase, page: 'MyJobs' },
    { name: 'Parts List', icon: ShoppingCart, page: 'PartsList' },
    { name: 'History', icon: History, page: 'SearchHistory' },
  ];

  return (
    <header className="bg-[#111] border-b border-[#333] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={createPageUrl('Home')} className="flex items-center gap-2">
            <div className="bg-[#e31e24] p-2 rounded-lg">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-xl tracking-tight">PartPilot</span>
              <span className="text-[#e31e24] text-xs font-semibold -mt-1">AI</span>
              </div>
              </Link>
              <span className="hidden sm:block text-gray-500 text-xs ml-2">OEM Parts + Pro Instructions in Seconds</span>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={createPageUrl(item.page)}
                className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-[#222] rounded-lg transition-all duration-200"
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDarkMode(!darkMode)}
            className="text-gray-400 hover:text-white hover:bg-[#222] hidden md:flex"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

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
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-[#222] rounded-lg transition-all duration-200"
                  >
                    <item.icon className="w-5 h-5 text-[#e31e24]" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
                
                {/* Theme Toggle Mobile */}
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-[#222] rounded-lg transition-all duration-200 mt-4 border-t border-[#333] pt-6"
                >
                  {darkMode ? <Sun className="w-5 h-5 text-[#e31e24]" /> : <Moon className="w-5 h-5 text-[#e31e24]" />}
                  <span className="font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Red accent line */}
      <div className="h-1 bg-gradient-to-r from-[#e31e24] via-[#ff4444] to-[#e31e24]" />
    </header>
  );
}