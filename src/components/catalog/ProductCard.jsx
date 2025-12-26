import React from 'react';
import { ShoppingCart, Heart, ExternalLink, CheckCircle, AlertCircle, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { retailerData } from './RetailerInfo';

export default function ProductCard({ product, onViewDetails, onSave, viewMode = 'grid' }) {
  const handleSave = () => {
    onSave(product);
    toast.success('Saved to your parts list!');
  };

  const lowestPrice = product.priceComparison && product.priceComparison.length > 0
    ? Math.min(...product.priceComparison.map(p => p.price))
    : product.price;
  
  const priceOptions = product.priceComparison?.length || 1;
  const hasBetterPrice = product.priceComparison && product.priceComparison.some(p => p.price < product.price);

  if (viewMode === 'list') {
    return (
      <div className="bg-[#1a1a1a] border border-[#333] rounded-xl overflow-hidden hover:border-orange-500 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 group">
        <div className="flex gap-4 p-4">
          {/* Image */}
          <div className="w-48 h-48 flex-shrink-0 bg-[#222] relative overflow-hidden rounded-lg">
            <img 
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <button
              onClick={handleSave}
              className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-orange-500 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
            >
              <Heart className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col">
            <p className="text-orange-500 text-sm font-semibold mb-1">{product.brand}</p>
            <h3 className="text-white font-semibold text-lg mb-2">{product.name}</h3>
            
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              {product.fitment === 'exact' && (
                <Badge className="bg-green-500 text-white border-0">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Exact Fit
                </Badge>
              )}
              {product.isOEM && (
                <Badge className="bg-blue-500 text-white border-0">OEM</Badge>
              )}
            </div>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-1 mb-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.floor(product.rating) ? 'text-orange-500' : 'text-gray-600'}>★</span>
                  ))}
                </div>
                <span className="text-gray-400 text-sm">({product.reviews || 0})</span>
              </div>
            )}

            <div className="mt-auto flex items-center justify-between">
              <div>
                <p className="text-white font-bold text-2xl">${lowestPrice.toFixed(2)}</p>
                <p className="text-gray-400 text-xs">{priceOptions} price options</p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => onViewDetails(product)}
                  variant="outline"
                  className="border-[#444] text-white hover:bg-[#222]"
                >
                  View Details
                </Button>
                <Button
                  onClick={() => window.open(product.buyUrl, '_blank')}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 group relative">
      {/* Image */}
      <div className="aspect-square bg-gray-50 relative overflow-hidden">
        <img 
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Discount Badge */}
        {product.originalPrice && product.originalPrice > product.price && (
          <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">
            {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="absolute top-2 right-2 w-9 h-9 bg-white hover:bg-orange-500 rounded-full flex items-center justify-center shadow-md transition-colors group/btn"
        >
          <Heart className="w-4 h-4 text-gray-600 group-hover/btn:text-white" />
        </button>

        {/* Fitment Badge */}
        {product.fitment === 'exact' && (
          <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Universal Fit
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
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

        {/* Price & Retailers */}
        <div className="mb-3">
          <div className="flex items-baseline gap-2 mb-1">
            <p className="text-white font-bold text-xl">${lowestPrice.toFixed(2)}</p>
            {hasBetterPrice && (
              <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">
                <TrendingDown className="w-3 h-3 mr-1" />
                Best Price
              </Badge>
            )}
          </div>
          <p className="text-gray-400 text-xs">
            {priceOptions} price option{priceOptions !== 1 ? 's' : ''} available
          </p>
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