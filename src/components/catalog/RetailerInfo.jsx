import React from 'react';
import { Shield, Truck, RotateCcw, Clock, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const retailerData = {
  'RockAuto': {
    logo: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=100&h=50&fit=crop',
    shipping: 'Economy shipping from $5.99, Free on orders $99+',
    returns: '30-day return policy, core charges may apply',
    warranty: '1-2 year manufacturer warranty on most parts',
    processingTime: '1-2 business days',
    rating: 4.6,
    website: 'https://www.rockauto.com'
  },
  'FCP Euro': {
    logo: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=100&h=50&fit=crop',
    shipping: 'Free shipping on orders $49+, 2-day delivery available',
    returns: 'Lifetime return policy on all parts',
    warranty: 'Lifetime replacement guarantee',
    processingTime: 'Same-day if ordered before 3pm EST',
    rating: 4.8,
    website: 'https://www.fcpeuro.com'
  },
  'Summit Racing': {
    logo: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=100&h=50&fit=crop',
    shipping: 'Free shipping on orders $99+, Flat $9.99 otherwise',
    returns: '90-day return policy',
    warranty: '1 year Summit Racing warranty',
    processingTime: '1-2 business days',
    rating: 4.7,
    website: 'https://www.summitracing.com'
  },
  'AutoZone': {
    logo: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=100&h=50&fit=crop',
    shipping: 'Free next-day delivery on orders $35+',
    returns: '90-day return policy with receipt',
    warranty: 'Limited lifetime warranty on select parts',
    processingTime: 'Same-day in-store pickup available',
    rating: 4.3,
    website: 'https://www.autozone.com'
  },
  'AdvanceAutoParts': {
    logo: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=100&h=50&fit=crop',
    shipping: 'Free shipping on orders $25+',
    returns: '45-day return policy',
    warranty: 'Limited lifetime warranty available',
    processingTime: 'Same-day store pickup',
    rating: 4.2,
    website: 'https://www.advanceautoparts.com'
  },
  'CarParts': {
    logo: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=100&h=50&fit=crop',
    shipping: '1-2 day free shipping on orders $50+',
    returns: '90-day return policy',
    warranty: '1 year warranty on most parts',
    processingTime: '1-2 business days',
    rating: 4.4,
    website: 'https://www.carparts.com'
  },
  'CARiD': {
    logo: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=100&h=50&fit=crop',
    shipping: 'Free shipping on orders $50+',
    returns: '60-day return policy',
    warranty: 'Manufacturer warranty included',
    processingTime: '1-3 business days',
    rating: 4.5,
    website: 'https://www.carid.com'
  },
  'Amazon': {
    logo: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=100&h=50&fit=crop',
    shipping: 'Free shipping for Prime members',
    returns: '30-day return policy',
    warranty: 'Varies by seller',
    processingTime: '1-2 days with Prime',
    rating: 4.5,
    website: 'https://www.amazon.com'
  },
  'eBay': {
    logo: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100&h=50&fit=crop',
    shipping: 'Varies by seller',
    returns: '30-day return policy (most sellers)',
    warranty: 'Varies by seller',
    processingTime: 'Varies by seller',
    rating: 4.1,
    website: 'https://www.ebay.com'
  },
  'AmericanMuscle': {
    logo: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=100&h=50&fit=crop',
    shipping: 'Free shipping on orders $75+',
    returns: '30-day return policy',
    warranty: 'Manufacturer warranty',
    processingTime: '1-2 business days',
    rating: 4.7,
    website: 'https://www.americanmuscle.com'
  },
  'AmericanTrucks': {
    logo: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=100&h=50&fit=crop',
    shipping: 'Free shipping on orders $75+',
    returns: '30-day return policy',
    warranty: 'Manufacturer warranty',
    processingTime: '1-2 business days',
    rating: 4.6,
    website: 'https://www.americantrucks.com'
  }
};

export default function RetailerInfo({ retailerName }) {
  const info = retailerData[retailerName];
  
  if (!info) return null;

  return (
    <div className="bg-[#222] border border-[#333] rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img src={info.logo} alt={retailerName} className="h-8 w-auto opacity-80" />
          <div>
            <h4 className="text-white font-semibold">{retailerName}</h4>
            <div className="flex items-center gap-1 mt-0.5">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-xs ${i < Math.floor(info.rating) ? 'text-orange-500' : 'text-gray-600'}`}>
                  ★
                </span>
              ))}
              <span className="text-gray-400 text-xs ml-1">{info.rating}</span>
            </div>
          </div>
        </div>
        <a 
          href={info.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange-500 hover:text-orange-400"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <Truck className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-gray-400 text-xs font-medium mb-0.5">Shipping</p>
            <p className="text-white text-sm">{info.shipping}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Clock className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-gray-400 text-xs font-medium mb-0.5">Processing</p>
            <p className="text-white text-sm">{info.processingTime}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <RotateCcw className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-gray-400 text-xs font-medium mb-0.5">Returns</p>
            <p className="text-white text-sm">{info.returns}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Shield className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-gray-400 text-xs font-medium mb-0.5">Warranty</p>
            <p className="text-white text-sm">{info.warranty}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export { retailerData };