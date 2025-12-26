import React from 'react';
import { ShoppingCart, Heart, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ProductCard({ product, onViewDetails, onSave, viewMode = 'grid' }) {
  const handleSave = () => {
    onSave(product);
    toast.success('Saved to your parts list!');
  };

  const lowestPrice = product.priceComparison && product.priceComparison.length > 0 ?
  Math.min(...product.priceComparison.map((p) => p.price)) :
  product.price;

  const priceOptions = product.priceComparison?.length || 1;

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 group relative">
      {/* Image */}
      <div className="aspect-square bg-gray-50 relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name} className="bg-transparent w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"

          loading="lazy" />

        
        {/* Discount Badge */}
        {product.originalPrice && product.originalPrice > product.price &&
        <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">
            {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
          </div>
        }

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="absolute top-2 right-2 w-9 h-9 bg-white hover:bg-orange-500 rounded-full flex items-center justify-center shadow-md transition-colors group/btn">

          <Heart className="w-4 h-4 text-gray-600 group-hover/btn:text-white" />
        </button>

        {/* Fitment Badge */}
        {product.fitment === 'exact' &&
        <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Universal Fit
          </div>
        }
      </div>

      {/* Content */}
      <div className="bg-slate-700 p-3">
        {/* Name */}
        <h3 className="text-slate-50 mb-2 text-sm font-medium line-clamp-2 min-h-[2.5rem] hover:text-blue-600 cursor-pointer" onClick={() => onViewDetails(product)}>
          {product.name}
        </h3>

        {/* Brand */}
        <p className="text-slate-50 mb-2 text-xs">{product.brand}</p>

        {/* Rating */}
        {product.rating &&
        <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) =>
            <span key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400 text-sm' : 'text-gray-300 text-sm'}>
                  ★
                </span>
            )}
            </div>
            <span className="text-gray-500 text-xs">({product.reviews || 0})</span>
          </div>
        }

        {/* Price */}
        <div className="mb-3">
          <div className="flex items-baseline gap-2">
            <p className="text-zinc-50 text-lg font-bold">${lowestPrice.toFixed(2)}</p>
            {product.originalPrice && product.originalPrice > lowestPrice &&
            <p className="text-gray-400 line-through text-sm">${product.originalPrice.toFixed(2)}</p>
            }
          </div>
          {priceOptions > 1 &&
          <p className="text-blue-600 text-xs mt-1">
              {priceOptions} stores available
            </p>
          }
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={() => window.open(product.buyUrl, '_blank')} className="bg-orange-500 text-slate-950 px-4 py-2 text-sm font-medium rounded-md inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow w-full hover:bg-purple-700 h-9">


          Add to cart
        </Button>
      </div>
    </div>);

}