import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { BookmarkCheck, Trash2, Loader2, ExternalLink, Copy, Hash, DollarSign, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function SavedParts() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadParts();
  }, []);

  const loadParts = async () => {
    try {
      const data = await base44.entities.SavedPart.list('-created_date');
      setParts(data);
    } catch (err) {
      console.error('Error loading parts:', err);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await base44.entities.SavedPart.delete(id);
      toast.success('Part removed from saved list');
      loadParts();
    } catch (err) {
      toast.error('Failed to remove part');
    }
  };

  const copyPartNumber = (partNumber) => {
    navigator.clipboard.writeText(partNumber);
    toast.success('Part number copied to clipboard!');
  };

  const searchOnline = (part) => {
    const query = encodeURIComponent(`${part.oem_part_number} ${part.part_name}`);
    window.open(`https://www.google.com/search?q=${query}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#111] px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <BookmarkCheck className="w-7 h-7 text-[#e31e24]" />
            Saved Parts
          </h1>
          <p className="text-gray-400 mt-1">Your saved OEM parts for quick reference</p>
        </div>

        {/* Parts List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#e31e24] animate-spin" />
          </div>
        ) : parts.length === 0 ? (
          <div className="text-center py-20">
            <BookmarkCheck className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white font-medium text-lg mb-2">No saved parts yet</h3>
            <p className="text-gray-400 text-sm">Parts you save from search results will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {parts.map((part) => (
              <Card key={part.id} className="bg-[#1a1a1a] border-[#333] overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg">{part.part_name}</h3>
                        {part.vehicle_info && (
                          <div className="flex items-center gap-2 mt-1">
                            <Car className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-400 text-sm">{part.vehicle_info}</span>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(part.id)}
                        className="text-gray-500 hover:text-red-500 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
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

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyPartNumber(part.oem_part_number)}
                        className="bg-transparent border-[#444] text-gray-300 hover:bg-[#222] hover:text-white"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Part #
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => searchOnline(part)}
                        className="bg-transparent border-[#444] text-gray-300 hover:bg-[#222] hover:text-white"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Find Online
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}