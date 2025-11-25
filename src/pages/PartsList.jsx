import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { ShoppingCart, Trash2, Loader2, Download, Share2, ExternalLink, Copy, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

export default function PartsList() {
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
      toast.success('Part removed');
      loadParts();
    } catch (err) {
      toast.error('Failed to remove part');
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Remove all parts from your list?')) return;
    try {
      await Promise.all(parts.map(p => base44.entities.SavedPart.delete(p.id)));
      toast.success('List cleared');
      setParts([]);
    } catch (err) {
      toast.error('Failed to clear list');
    }
  };

  const totalCost = parts.reduce((sum, p) => sum + (p.msrp_price || 0), 0);

  const exportToPDF = () => {
    // Generate printable HTML
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>PartPilot Parts List</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #e31e24; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background: #f5f5f5; }
          .total { font-weight: bold; font-size: 18px; margin-top: 20px; }
          .mono { font-family: monospace; }
        </style>
      </head>
      <body>
        <h1>PartPilot AI - Parts List</h1>
        <p>Generated: ${new Date().toLocaleDateString()}</p>
        <table>
          <thead>
            <tr>
              <th>Part Name</th>
              <th>OEM Part #</th>
              <th>Vehicle</th>
              <th>MSRP</th>
            </tr>
          </thead>
          <tbody>
            ${parts.map(p => `
              <tr>
                <td>${p.part_name}</td>
                <td class="mono">${p.oem_part_number}</td>
                <td>${p.vehicle_info || '-'}</td>
                <td>$${p.msrp_price?.toFixed(2) || 'N/A'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <p class="total">Estimated Total: $${totalCost.toFixed(2)}</p>
      </body>
      </html>
    `;
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    win.onload = () => win.print();
  };

  const handleShare = async () => {
    const text = parts.map(p => `${p.part_name} - #${p.oem_part_number} - $${p.msrp_price?.toFixed(2) || 'N/A'}`).join('\n');
    const shareText = `My PartPilot Parts List:\n\n${text}\n\nTotal: $${totalCost.toFixed(2)}`;
    
    if (navigator.share) {
      await navigator.share({ title: 'PartPilot Parts List', text: shareText });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('List copied to clipboard!');
    }
  };

  const copyPartNumber = (num) => {
    navigator.clipboard.writeText(num);
    toast.success('Part number copied!');
  };

  return (
    <div className="min-h-screen bg-[#111] px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <ShoppingCart className="w-7 h-7 text-[#e31e24]" />
              My Parts List
            </h1>
            <p className="text-gray-400 mt-1">{parts.length} parts saved</p>
          </div>
          
          {parts.length > 0 && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportToPDF} className="border-[#444] text-white hover:bg-[#222]">
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" onClick={handleShare} className="border-[#444] text-white hover:bg-[#222]">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#e31e24] animate-spin" />
          </div>
        ) : parts.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white font-medium text-lg mb-2">Your parts list is empty</h3>
            <p className="text-gray-400 text-sm">Save parts from search results to build your list</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {parts.map((part, idx) => (
                <Card 
                  key={part.id} 
                  className="bg-[#1a1a1a] border-[#333] rounded-2xl card-hover animate-fade-in-up"
                  style={{ animationDelay: `${idx * 60}ms`, animationFillMode: 'both' }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold truncate">{part.part_name}</h3>
                        <button 
                          onClick={() => copyPartNumber(part.oem_part_number)}
                          className="text-gray-400 font-mono text-sm hover:text-[#e31e24] flex items-center gap-1"
                        >
                          #{part.oem_part_number}
                          <Copy className="w-3 h-3" />
                        </button>
                        {part.vehicle_info && (
                          <p className="text-gray-500 text-xs mt-1">{part.vehicle_info}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[#e31e24] font-bold text-lg">
                          ${part.msrp_price?.toFixed(2) || 'N/A'}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(part.id)}
                          className="text-gray-500 hover:text-red-500 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {part.purchase_links && part.purchase_links.length > 0 && (
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {part.purchase_links.slice(0, 3).map((link, idx) => (
                          <a
                            key={idx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs px-2 py-1 bg-[#222] hover:bg-[#333] border border-[#444] rounded text-gray-300 flex items-center gap-1"
                          >
                            {link.store}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Total & Actions */}
            <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Estimated Total
                </span>
                <span className="text-white font-bold text-2xl">${totalCost.toFixed(2)}</span>
              </div>
              <Button
                variant="outline"
                onClick={handleClearAll}
                className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Parts
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}