import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clock, Sparkles } from 'lucide-react';

export default function ComingSoonDialog({ open, onOpenChange, featureName = 'This feature' }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a1a1a] border-[#333] text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-500" />
            Coming Soon!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="flex items-center justify-center py-6">
            <Clock className="w-16 h-16 text-orange-500" />
          </div>
          
          <div className="text-center">
            <h3 className="text-white font-semibold text-lg mb-2">
              {featureName} is Under Development
            </h3>
            <p className="text-gray-400 text-sm">
              We're working hard to bring you this feature. Stay tuned for updates!
            </p>
          </div>
          
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full bg-orange-500 hover:bg-orange-600"
          >
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}