import React from 'react';
import LogoImage from '../ASSETS/LOGO (1).png';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withText?: boolean;
}

export function Logo({ className = '', size = 'md', withText = false }: LogoProps) {
  const sizeClasses = {
    sm: 'h-12',
    md: 'h-20',
    lg: 'h-28',
    xl: 'h-60'
  };

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={LogoImage} 
        alt="Annapurna Nutrition Logo" 
        className={`${sizeClasses[size]} object-contain`}
        style={{
          filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.2))'
        }}
      />
      {withText && (
        <span className="ml-2 font-bold text-xl text-primary">Annapurna</span>
      )}
    </div>
  );
}
