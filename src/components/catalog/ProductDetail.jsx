import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  ShoppingCart, 
  Heart, 
  CheckCircle, 
  AlertCircle, 
  Package,
  Truck,
  Shield,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

export default function ProductDetail({ product, open, onOpenChange, onSave }) {
  const [currentImage, setCurrentImage] = useState(0);
  
  if (!product) return null;

  const images = product.images || [product.image];

  const handleSave = () => {
    onSave(product);
    toast.success('Saved to your parts list!');
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a1a1a] border-[#333] text-white max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Image Gallery */}
          <div>
            <div className="aspect-square bg-[#222] rounded-xl overflow-hidden relative mb-3">
              <img 
                src={images[currentImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-orange-500 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-orange-500 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
                  {currentImage + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImage(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                      currentImage === idx ? 'border-orange-500' : 'border-[#333]'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {/* Brand & Name */}
            <div className="mb-4">
              <p className="text-orange-500 font-semibold mb-1">{product.brand}</p>
              <h2 className="text-white font-bold text-2xl mb-2">{product.name}</h2>
              
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {product.fitment === 'exact' && (
                  <Badge className="bg-green-500 text-white border-0">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Exact Fit Guaranteed
                  </Badge>
                )}
                {product.fitment === 'verify' && (
                  <Badge className="bg-amber-500 text-white border-0">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Fitment Verification Required
                  </Badge>
                )}
                {product.isOEM && (
                  <Badge className="bg-blue-500 text-white border-0">
                    OEM Part
                  </Badge>
                )}
              </div>
            </div>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-lg ${i < Math.floor(product.rating) ? 'text-orange-500' : 'text-gray-600'}`}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-gray-400 text-sm">
                  {product.rating.toFixed(1)} ({product.reviews || 0} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="mb-4 pb-4 border-b border-[#333]">
              <div className="flex items-baseline gap-2">
                <p className="text-white font-bold text-3xl">${product.price.toFixed(2)}</p>
                {product.originalPrice && (
                  <p className="text-gray-500 text-lg line-through">${product.originalPrice.toFixed(2)}</p>
                )}
              </div>
              <p className="text-gray-400 text-sm mt-1">Available from {product.retailer}</p>
            </div>

            {/* Description */}
            <div className="mb-4">
              <h3 className="text-white font-semibold mb-2">Description</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {product.description || 'High-quality automotive part designed for precise fitment and reliable performance.'}
              </p>
            </div>

            {/* Specs */}
            {product.specs && (
              <div className="mb-4">
                <h3 className="text-white font-semibold mb-2">Specifications</h3>
                <div className="space-y-1">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-gray-400">{key}:</span>
                      <span className="text-white">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Compatible Vehicles */}
            {product.compatibility && (
              <div className="mb-4">
                <h3 className="text-white font-semibold mb-2">Compatible Vehicles</h3>
                <p className="text-gray-400 text-sm">{product.compatibility}</p>
              </div>
            )}

            {/* Features */}
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Package className="w-4 h-4 text-orange-500" />
                  <span>Free Shipping Available</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Shield className="w-4 h-4 text-orange-500" />
                  <span>Warranty Included</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-auto flex gap-2">
              <Button
                onClick={handleSave}
                variant="outline"
                className="border-[#444] text-white hover:bg-[#222]"
              >
                <Heart className="w-4 h-4 mr-2" />
                Save Part
              </Button>
              <Button
                onClick={() => window.open(product.buyUrl, '_blank')}
                className="flex-1 bg-orange-500 hover:bg-orange-600"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Buy Now at {product.retailer}
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Legal */}
            <p className="text-gray-500 text-xs mt-3">
              Clicking "Buy Now" will redirect you to {product.retailer}. MechanicHQ is not responsible for pricing, availability, or transactions.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}