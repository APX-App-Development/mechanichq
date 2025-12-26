import React, { useState } from 'react';
import { useDevMode } from '@/components/DevModeProvider';
import ComingSoonDialog from '@/components/ComingSoonDialog';

export default function ProtectedFeature({ children, featureName, onClick }) {
  const { isDevMode } = useDevMode();
  const [showComingSoon, setShowComingSoon] = useState(false);

  const handleClick = (e) => {
    if (!isDevMode) {
      e.preventDefault();
      setShowComingSoon(true);
    } else if (onClick) {
      onClick(e);
    }
  };

  return (
    <>
      <div onClick={handleClick} style={{ cursor: 'pointer' }}>
        {children}
      </div>
      <ComingSoonDialog 
        open={showComingSoon} 
        onOpenChange={setShowComingSoon}
        featureName={featureName}
      />
    </>
  );
}