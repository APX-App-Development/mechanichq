import React, { useState } from 'react';
import { BookmarkPlus, Check, ChevronDown, ChevronUp, Wrench, DollarSign, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function PartCard({ part, vehicleInfo }) {
  const [saved, setSaved] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.entities.SavedPart.create({
        part_name: part.part_name,
        oem_part_number: part.oem_part_number,
        msrp_price: part.msrp_price,
        vehicle_info: vehicleInfo,
        notes: ''
      });
      setSaved(true);
      toast.success('Part saved to your collection!');
    } catch (error) {
      toast.error('Failed to save part');
    }
    setSaving(false);
  };

  return (
    <Card className="bg-[#1a1a1a] border-[#333] overflow-hidden hover:border-[#e31e24] transition-all duration-300">
      <CardContent className="p-0">
        {/* Header */}
        <div className="p-5 border-b border-[#333]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-[#e31e24]/20 text-[#e31e24] border-0 text-xs">
                  {part.category || 'Auto Part'}
                </Badge>
                {part.brand && (
                  <Badge variant="outline" className="border-[#444] text-gray-400 text-xs">
                    {part.brand}
                  </Badge>
                )}
              </div>
              <h3 className="text-white font-semibold text-lg leading-tight">{part.part_name}</h3>
              <p className="text-gray-400 text-sm mt-1 line-clamp-2">{part.description}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSave}
              disabled={saved || saving}
              className={`shrink-0 ${saved ? 'text-green-500' : 'text-gray-400 hover:text-[#e31e24]'}`}
            >
              {saved ? <Check className="w-5 h-5" /> : <BookmarkPlus className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Part Details */}
        <div className="p-5 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#222] p-2 rounded-lg">
              <Hash className="w-4 h-4 text-[#e31e24]" />
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wide">OEM Part #</p>
              <p className="text-white font-mono font-medium">{part.oem_part_number}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-[#222] p-2 rounded-lg">
              <DollarSign className="w-4 h-4 text-green-500" />
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wide">MSRP Price</p>
              <p className="text-white font-semibold">${part.msrp_price?.toFixed(2) || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Installation Instructions Toggle */}
        {part.installation_steps && (
          <div className="border-t border-[#333]">
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="w-full px-5 py-3 flex items-center justify-between text-gray-300 hover:text-white hover:bg-[#222] transition-all"
            >
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#e31e24]" />
                <span className="text-sm font-medium">Installation Instructions</span>
              </div>
              {showInstructions ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
            
            {showInstructions && (
              <div className="px-5 pb-5 space-y-3">
                {part.installation_steps.map((step, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="shrink-0 w-6 h-6 bg-[#e31e24] rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {index + 1}
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}