import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock, AlertCircle } from 'lucide-react';
import { useDevMode } from '@/components/DevModeProvider';
import { toast } from 'sonner';

export default function DevSecretDialog({ open, onOpenChange }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const { enableDevMode } = useDevMode();

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = enableDevMode(code);
    
    if (success) {
      toast.success('Developer mode activated! 🚀');
      onOpenChange(false);
      setCode('');
      setError(false);
    } else {
      setError(true);
      toast.error('Invalid code');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a1a1a] border-[#333] text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-orange-500" />
            Developer Portal Access
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Enter Secret Code</label>
            <Input
              type="password"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError(false);
              }}
              placeholder="••••••••"
              className="bg-[#222] border-[#444] text-white"
              autoFocus
            />
            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm mt-2">
                <AlertCircle className="w-4 h-4" />
                <span>Invalid code. Try again.</span>
              </div>
            )}
          </div>
          
          <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600"
          >
            Unlock Developer Mode
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}