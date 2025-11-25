import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Menu, X, Car, Wrench, BookmarkCheck, History, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function Header() {
  const [open, setOpen] = useState(false);

  const navItems = [
    { name: 'Home', icon: Home, page: 'Home' },
    { name: 'My Garage', icon: Car, page: 'MyGarage' },
    { name: 'Saved Parts', icon: BookmarkCheck, page: 'SavedParts' },
    { name: 'Search History', icon: History, page: 'SearchHistory' },
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