import React, { useState } from 'react';
import { BookmarkPlus, Check, ChevronDown, ChevronUp, Wrench, DollarSign, Hash, ExternalLink, RefreshCw, ShoppingCart, AlertTriangle } from 'lucide-react';
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

  const copyPartNumber = () => {
    navigator.clipboard.writeText(part.oem_part_number);
    toast.success('Part number copied!');
  };

  return (
    <Card className="bg-[#1a1a1a] border-[#333] overflow-hidden hover:border-[#e31e24]/50 transition-all duration-300">
      <CardContent className="p-0">
        {/* Header */}
        <div className="p-5 border-b border-[#333]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge className="bg-[#e31e24]/20 text-[#e31e24] border-0 text-xs font-semibold">
                  {part.category || 'OEM Part'}
                </Badge>
                {part.manufacturer && (
                  <Badge variant="outline" className="border-[#444] text-gray-300 text-xs">
                    {part.manufacturer}
                  </Badge>
                )}
                {part.is_genuine_oem && (
                  <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">
                    ✓ Genuine OEM
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
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={copyPartNumber}
            >
              <div className="bg-[#222] p-2.5 rounded-lg group-hover:bg-[#e31e24]/20 transition-colors">
                <Hash className="w-4 h-4 text-[#e31e24]" />
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide">OEM Part #</p>
                <p className="text-white font-mono font-semibold group-hover:text-[#e31e24] transition-colors">
                  {part.oem_part_number}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-[#222] p-2.5 rounded-lg">
                <DollarSign className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide">MSRP</p>
                <p className="text-white font-semibold text-lg">
                  ${part.msrp_price?.toFixed(2) || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Supersession Info */}
          {part.supersession && (
            <div className="flex items-start gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <RefreshCw className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-amber-400 text-sm font-medium">Part Updated</p>
                <p className="text-amber-200/70 text-xs mt-0.5">
                  Superseded by: <span className="font-mono font-semibold">{part.supersession.new_part_number}</span>
                </p>
                {part.supersession.reason && (
                  <p className="text-amber-200/50 text-xs mt-1">{part.supersession.reason}</p>
                )}
              </div>
            </div>
          )}

          {/* Fitment Note */}
          {part.fitment_note && (
            <div className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
              <p className="text-blue-200/80 text-sm">{part.fitment_note}</p>
            </div>
          )}

          {/* Purchase Links */}
          {part.purchase_links && part.purchase_links.length > 0 && (
            <div className="space-y-2">
              <p className="text-gray-500 text-xs uppercase tracking-wide flex items-center gap-2">
                <ShoppingCart className="w-3.5 h-3.5" />
                Where to Buy
              </p>
              <div className="flex flex-wrap gap-2">
                {part.purchase_links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#222] hover:bg-[#333] border border-[#444] rounded-lg text-sm text-gray-300 hover:text-white transition-all"
                  >
                    {link.store}
                    {link.price && (
                      <span className="text-green-400 font-medium">${link.price}</span>
                    )}
                    <ExternalLink className="w-3 h-3 opacity-50" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Installation Instructions Toggle */}
        {part.installation_steps && part.installation_steps.length > 0 && (
          <div className="border-t border-[#333]">
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="w-full px-5 py-4 flex items-center justify-between text-gray-300 hover:text-white hover:bg-[#222] transition-all"
            >
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#e31e24]" />
                <span className="text-sm font-medium">Installation Instructions</span>
                <Badge variant="outline" className="border-[#444] text-gray-500 text-xs ml-1">
                  {part.installation_steps.length} steps
                </Badge>
              </div>
              {showInstructions ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
            
            {showInstructions && (
              <div className="px-5 pb-5 space-y-3">
                {part.difficulty && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-gray-500 text-sm">Difficulty:</span>
                    <Badge className={`border-0 ${
                      part.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                      part.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {part.difficulty}
                    </Badge>
                    {part.estimated_time && (
                      <span className="text-gray-400 text-sm">• {part.estimated_time}</span>
                    )}
                  </div>
                )}
                {part.installation_steps.map((step, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="shrink-0 w-7 h-7 bg-[#e31e24] rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {index + 1}
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed pt-0.5">{step}</p>
                  </div>
                ))}
                {part.tools_needed && (
                  <div className="mt-4 p-3 bg-[#222] rounded-lg">
                    <p className="text-gray-500 text-xs uppercase tracking-wide mb-2">Tools Needed</p>
                    <p className="text-gray-300 text-sm">{part.tools_needed.join(', ')}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}