import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingDown, ExternalLink, Bell, Check } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

export default function PriceComparison({ prices, partName, partNumber, onSetAlert }) {
  const [settingAlert, setSettingAlert] = useState(false);

  if (!prices || prices.length === 0) return null;

  const sortedPrices = [...prices].sort((a, b) => a.price - b.price);
  const lowestPrice = sortedPrices[0];
  const savings = sortedPrices.length > 1 
    ? sortedPrices[sortedPrices.length - 1].price - lowestPrice.price 
    : 0;

  const handleSetAlert = async () => {
    setSettingAlert(true);
    try {
      const targetPrice = lowestPrice.price * 0.9; // 10% below current lowest
      await base44.entities.PriceAlert.create({
        part_name: partName,
        part_number: partNumber,
        target_price: targetPrice,
        current_price: lowestPrice.price,
        retailers: sortedPrices.map(p => p.retailer),
        last_checked: new Date().toISOString()
      });
      toast.success(`Price alert set! We'll notify you if price drops below $${targetPrice.toFixed(2)}`);
      if (onSetAlert) onSetAlert();
    } catch (err) {
      toast.error('Failed to set price alert');
    }
    setSettingAlert(false);
  };

  return (
    <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-bold text-lg mb-1">Price Comparison</h3>
          <p className="text-gray-400 text-sm">
            Available from {sortedPrices.length} retailer{sortedPrices.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button
          onClick={handleSetAlert}
          disabled={settingAlert}
          variant="outline"
          size="sm"
          className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
        >
          <Bell className="w-4 h-4 mr-2" />
          Set Alert
        </Button>
      </div>

      {savings > 0 && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-green-500 font-semibold">Save up to ${savings.toFixed(2)}</p>
              <p className="text-gray-400 text-xs">By choosing the lowest price</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {sortedPrices.map((priceInfo, index) => (
          <div
            key={index}
            className={`bg-[#222] border ${
              index === 0 ? 'border-green-500' : 'border-[#333]'
            } rounded-lg p-4 relative`}
          >
            {index === 0 && (
              <Badge className="absolute -top-2 -right-2 bg-green-500 text-white border-0">
                Best Price
              </Badge>
            )}

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-white font-semibold">{priceInfo.retailer}</span>
                  {priceInfo.inStock !== false && (
                    <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">
                      <Check className="w-3 h-3 mr-1" />
                      In Stock
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-baseline gap-2">
                  <p className="text-white font-bold text-2xl">${priceInfo.price.toFixed(2)}</p>
                  {priceInfo.originalPrice && priceInfo.originalPrice > priceInfo.price && (
                    <p className="text-gray-500 line-through text-sm">
                      ${priceInfo.originalPrice.toFixed(2)}
                    </p>
                  )}
                </div>

                {priceInfo.shipping && (
                  <p className="text-gray-400 text-xs mt-1">{priceInfo.shipping}</p>
                )}
              </div>

              <Button
                onClick={() => window.open(priceInfo.buyUrl, '_blank')}
                className={`${
                  index === 0 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-orange-500 hover:bg-orange-600'
                }`}
              >
                Buy Now
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-gray-500 text-xs mt-4 text-center">
        Prices updated in real-time. Click "Buy Now" to purchase from the retailer's website.
      </p>
    </div>
  );
}