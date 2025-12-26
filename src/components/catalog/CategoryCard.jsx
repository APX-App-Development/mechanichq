import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function CategoryCard({ category, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group relative bg-[#1a1a1a] border border-[#333] rounded-xl overflow-hidden hover:border-orange-500 transition-all duration-300 hover:scale-[1.02]"
    >
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden bg-[#222]">
        <img 
          src={category.image} 
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex items-center justify-between">
          <div className="text-left">
            <div className="flex items-center gap-2 mb-1">
              <category.icon className="w-5 h-5 text-orange-500" />
              <h3 className="text-white font-bold text-lg">{category.name}</h3>
            </div>
            <p className="text-gray-400 text-sm">{category.count} products</p>
          </div>
          <ChevronRight className="w-5 h-5 text-orange-500 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </button>
  );
}