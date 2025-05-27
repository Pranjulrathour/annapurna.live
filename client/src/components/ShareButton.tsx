import React from 'react';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { useLocation } from 'wouter';

interface ShareButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  label?: string;
}

/**
 * A button component that navigates to the Share Impact page
 */
export function ShareButton({
  className = '',
  variant = 'default',
  size = 'default',
  label = 'Share Your Impact'
}: ShareButtonProps) {
  const [, setLocation] = useLocation();

  return (
    <Button
      className={`${className}`}
      variant={variant}
      size={size}
      onClick={() => setLocation('/share')}
    >
      <Share2 className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}
