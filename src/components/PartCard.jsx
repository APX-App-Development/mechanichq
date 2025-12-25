import React, { useState } from 'react';
import { BookmarkPlus, Check, ChevronDown, ChevronUp, Wrench, DollarSign, Hash, ExternalLink, RefreshCw, ShoppingCart, AlertTriangle, Clock, Play, Lightbulb, Plus, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

// Difficulty wrench icons
const DifficultyWrenches = ({ level }) => {
  const numWrenches = level === 'Easy' ? 1 : level === 'Medium' ? 3 : 5;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Wrench 
          key={i} 
          className={`w-3.5 h-3.5 ${i <= numWrenches ? 'text-[#e31e24]' : 'text-gray-600'}`} 
        />
      ))}
    </div>
  );
};

export default function PartCard({ part, vehicleInfo, onAddToJob, onAddToCart, delay = 0 }) {
  const [saved, setSaved] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newTip, setNewTip] = useState('');
  const [tips, setTips] = useState(part.pro_tips || []);
  const [submittingTip, setSubmittingTip] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.entities.SavedPart.create({
        part_name: part.part_name,
        oem_part_number: part.oem_part_number,
        msrp_price: part.msrp_price,
        vehicle_info: vehicleInfo,
        manufacturer: part.manufacturer,
        category: part.category,
        purchase_links: part.purchase_links,
        notes: ''
      });
      setSaved(true);
      toast.success('Part saved!');
    } catch (error) {
      toast.error('Failed to save part');
    }
    setSaving(false);
  };

  const copyPartNumber = () => {
    navigator.clipboard.writeText(part.oem_part_number);
    toast.success('Part number copied!');
  };

  const findVideo = () => {
    const searchQuery = encodeURIComponent(`${part.part_name} ${vehicleInfo} replacement how to`);
    window.open(`https://www.youtube.com/results?search_query=${searchQuery}`, '_blank');
  };

  const handleSubmitTip = async () => {
    if (!newTip.trim()) return;
    setSubmittingTip(true);
    try {
      const user = await base44.auth.me();
      const tip = {
        text: newTip,
        author: user?.full_name || 'Anonymous',
        date: new Date().toISOString()
      };
      setTips([...tips, tip]);
      setNewTip('');
      toast.success('Tip added! Thanks for sharing.');
    } catch (err) {
      toast.error('Please log in to add tips');
    }
    setSubmittingTip(false);
  };

  // Find lowest price
  const lowestPrice = part.purchase_links?.reduce((min, link) => 
    link.price && link.price < min ? link.price : min, 
    part.msrp_price || Infinity
  );

  return (
    <Card className="bg-[#1a1a1a] border-[#333] overflow-hidden card-hover rounded-2xl">
      <CardContent className="p-0">
        {/* Main Part Info Card */}
        <div className="p-5">
          {/* Category & OEM Badge */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge className="bg-orange-500/20 text-orange-500 border-0 text-xs font-semibold">
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

          {/* Part Name & Number - BIG BOLD */}
          <h2 className="text-white font-bold text-xl md:text-2xl leading-tight mb-1">
            {part.part_name}
          </h2>
          <button 
            onClick={copyPartNumber}
            className="text-gray-400 font-mono text-lg hover:text-orange-500 transition-all duration-200 mb-4 animate-fade-in"
            style={{ animationDelay: '100ms', animationFillMode: 'both' }}
          >
            #{part.oem_part_number}
          </button>

          {/* MSRP Price - Red & Bold */}
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-orange-500 font-bold text-3xl">
              ${part.msrp_price?.toFixed(2) || 'N/A'}
            </span>
            <span className="text-gray-500 text-sm">MSRP</span>
            {lowestPrice && lowestPrice < part.msrp_price && (
              <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">
                Save ${(part.msrp_price - lowestPrice).toFixed(2)}
              </Badge>
            )}
          </div>

          <p className="text-gray-400 text-sm mb-5">{part.description}</p>

          {/* Supersession Warning */}
          {part.supersession && part.supersession.new_part_number && (
            <div className="flex items-start gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-4">
              <RefreshCw className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-amber-400 font-medium">Part Updated</p>
                <p className="text-amber-200/70 text-sm">
                  New #: <span className="font-mono font-semibold">{part.supersession.new_part_number}</span>
                </p>
              </div>
            </div>
          )}

          {/* Buy Now Buttons - Price Comparison */}
          {part.purchase_links && part.purchase_links.length > 0 && (
            <div className="space-y-2 mb-4">
              <p className="text-gray-500 text-xs uppercase tracking-wide flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Buy Now - Price Comparison
              </p>
              <div className="grid gap-2">
                {part.purchase_links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                      link.price === lowestPrice 
                        ? 'bg-green-500/10 border-green-500/30 hover:border-green-500/50' 
                        : 'bg-[#222] border-[#444] hover:border-[#555]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-white font-medium">{link.store}</span>
                      {link.price === lowestPrice && (
                        <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">
                          Lowest
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-lg ${link.price === lowestPrice ? 'text-green-400' : 'text-white'}`}>
                        ${link.price?.toFixed(2) || 'Check'}
                      </span>
                      <ExternalLink className="w-4 h-4 text-gray-500" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              disabled={saved || saving}
              variant="outline"
              className={`flex-1 h-12 tap-target rounded-xl font-semibold transition-all duration-200 ${saved ? 'border-green-500 text-green-500' : 'border-[#444] text-white hover:bg-[#222] active:scale-[0.98]'}`}
            >
              {saved ? <Check className="w-4 h-4 mr-2" /> : <BookmarkPlus className="w-4 h-4 mr-2" />}
              {saved ? 'Saved' : 'Save Part'}
            </Button>
            {onAddToCart && (
              <Button
                onClick={() => onAddToCart(part)}
                className="flex-1 h-12 tap-target rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-all duration-200 active:scale-[0.98]"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to List
              </Button>
            )}
          </div>
        </div>

        {/* Installation Instructions Section */}
        {part.installation_steps && part.installation_steps.length > 0 && (
          <div className="border-t border-[#333]">
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="w-full px-5 py-4 flex items-center justify-between text-white hover:bg-[#222] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-orange-500" />
                </div>
                <div className="text-left">
                  <span className="font-semibold block">Installation Instructions</span>
                  <span className="text-gray-400 text-sm">{part.installation_steps.length} steps</span>
                </div>
              </div>
              {showInstructions ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            
            {showInstructions && (
              <div className="px-5 pb-5 space-y-5">
                {/* Quick Stats Row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[#222] rounded-xl p-3 text-center">
                    <Clock className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                    <p className="text-white font-medium text-sm">{part.estimated_time || '1-2 hrs'}</p>
                    <p className="text-gray-500 text-xs">Time</p>
                  </div>
                  <div className="bg-[#222] rounded-xl p-3 text-center">
                    <div className="flex justify-center mb-1">
                      <DifficultyWrenches level={part.difficulty} />
                    </div>
                    <p className="text-white font-medium text-sm">{part.difficulty || 'Medium'}</p>
                    <p className="text-gray-500 text-xs">Difficulty</p>
                  </div>
                  <div className="bg-[#222] rounded-xl p-3 text-center">
                    <Wrench className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                    <p className="text-white font-medium text-sm">{part.tools_needed?.length || 3}+</p>
                    <p className="text-gray-500 text-xs">Tools</p>
                  </div>
                </div>

                {/* Tools Required */}
                {part.tools_needed && part.tools_needed.length > 0 && (
                  <div className="bg-[#222] rounded-xl p-4">
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-2 flex items-center gap-2">
                      <Wrench className="w-3.5 h-3.5" />
                      Tools Required
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {part.tools_needed.map((tool, idx) => (
                        <Badge key={idx} variant="outline" className="border-[#444] text-gray-300 text-xs">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Numbered Steps */}
                <div className="space-y-3">
                  {part.installation_steps.map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="shrink-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-gray-200 text-sm leading-relaxed">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Torque Specs */}
                {part.torque_specs && part.torque_specs.length > 0 && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                    <p className="text-blue-400 font-medium text-sm mb-2">⚡ Torque Specifications</p>
                    <div className="space-y-1">
                      {part.torque_specs.map((spec, idx) => (
                        <p key={idx} className="text-blue-200/80 text-sm font-mono">
                          {spec.component}: <span className="text-blue-300 font-semibold">{spec.ft_lbs} ft-lbs</span> ({spec.nm} Nm)
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Watch Video Button */}
                <Button
                  onClick={findVideo}
                  variant="outline"
                  className="w-full border-[#444] text-white hover:bg-[#222] h-12"
                >
                  <Play className="w-5 h-5 mr-2 text-red-500" />
                  Watch Installation Video
                </Button>

                {/* Diagram Placeholder */}
                {part.diagram_url && (
                  <div className="bg-[#222] rounded-xl p-4 text-center">
                    <img 
                      src={part.diagram_url} 
                      alt="Exploded diagram" 
                      className="max-w-full mx-auto rounded-lg"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Pro Tips Community Section */}
        <div className="border-t border-[#333]">
          <button
            onClick={() => setShowTips(!showTips)}
            className="w-full px-5 py-4 flex items-center justify-between text-white hover:bg-[#222] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-left">
                <span className="font-semibold block">Pro Tips</span>
                <span className="text-gray-400 text-sm">{tips.length} tips from the community</span>
              </div>
            </div>
            {showTips ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          {showTips && (
            <div className="px-5 pb-5 space-y-4">
              {tips.length > 0 ? (
                <div className="space-y-3">
                  {tips.map((tip, idx) => (
                    <div key={idx} className="bg-[#222] rounded-xl p-4">
                      <p className="text-gray-200 text-sm mb-2">{tip.text}</p>
                      <p className="text-gray-500 text-xs">— {tip.author}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">No tips yet. Be the first to share!</p>
              )}

              {/* Add Tip Form */}
              <div className="space-y-2">
                <Textarea
                  value={newTip}
                  onChange={(e) => setNewTip(e.target.value)}
                  placeholder="Share a helpful tip for this repair..."
                  className="bg-[#222] border-[#444] text-white resize-none"
                  rows={2}
                />
                <Button
                  onClick={handleSubmitTip}
                  disabled={!newTip.trim() || submittingTip}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black font-medium"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Share Tip
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}