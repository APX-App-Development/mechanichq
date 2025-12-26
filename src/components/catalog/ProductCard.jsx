import React from 'react';
import { ShoppingCart, Heart, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function ProductCard({ product, onViewDetails, onSave }) {
  const handleSave = () => {
    onSave(product);
    toast.success('Saved to your parts list!');
  };

  const retailerLogos = {
    'AmericanMuscle': 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=100&h=50&fit=crop',
    'AutoZone': 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=100&h=50&fit=crop',
    'Amazon': 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=100&h=50&fit=crop',
    'eBay': 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100&h=50&fit=crop',
  };

  return (
    <div className="bg-[#1a1a1a] border border-[#333] rounded-xl overflow-hidden hover:border-orange-500 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 group">
      {/* Image */}
      <div className="aspect-square bg-[#222] relative overflow-hidden">
        <img 
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.fitment === 'exact' && (
            <Badge className="bg-green-500 text-white border-0">
              <CheckCircle className="w-3 h-3 mr-1" />
              Exact Fit
            </Badge>
          )}
          {product.fitment === 'verify' && (
            <Badge className="bg-amber-500 text-white border-0">
              <AlertCircle className="w-3 h-3 mr-1" />
              Verify Fit
            </Badge>
          )}
          {product.isOEM && (
            <Badge className="bg-blue-500 text-white border-0">
              OEM
            </Badge>
          )}
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="absolute top-3 right-3 w-10 h-10 bg-black/50 hover:bg-orange-500 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
        >
          <Heart className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Brand */}
        <p className="text-orange-500 text-sm font-semibold mb-1">{product.brand}</p>
        
        {/* Name */}
        <h3 className="text-white font-medium text-sm mb-2 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(product.rating) ? 'text-orange-500' : 'text-gray-600'}>
                  ★
                </span>
              ))}
            </div>
            <span className="text-gray-400 text-xs">({product.reviews || 0})</span>
          </div>
        )}

        {/* Price & Retailer */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-white font-bold text-xl">${product.price.toFixed(2)}</p>
            {product.originalPrice && (
              <p className="text-gray-500 text-sm line-through">${product.originalPrice.toFixed(2)}</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-xs mb-1">from</p>
            <div className="flex items-center gap-1">
              <img 
                src={retailerLogos[product.retailer] || retailerLogos['Amazon']}
                alt={product.retailer}
                className="h-4 w-auto opacity-60"
              />
              <p className="text-gray-300 text-xs font-medium">{product.retailer}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={() => onViewDetails(product)}
            variant="outline"
            className="flex-1 border-[#444] text-white hover:bg-[#222] text-sm"
          >
            Details
          </Button>
          <Button
            onClick={() => window.open(product.buyUrl, '_blank')}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-sm"
          >
            <ShoppingCart className="w-4 h-4 mr-1" />
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
}