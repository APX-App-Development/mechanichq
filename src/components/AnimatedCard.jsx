import React from 'react';
import { Card } from '@/components/ui/card';

export default function AnimatedCard({ children, className = '', delay = 0, ...props }) {
  return (
    <Card 
      className={`animate-fade-in-up ${className}`}
      style={{ 
        animationDelay: `${delay}ms`,
        animationFillMode: 'both'
      }}
      {...props}
    >
      {children}
    </Card>
  );
}