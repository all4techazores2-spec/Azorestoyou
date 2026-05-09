
import React from 'react';

interface AzoresLogoProps {
  className?: string;
  size?: number;
}

const AzoresLogo: React.FC<AzoresLogoProps> = ({ className = "", size = 40 }) => {
  return (
    <img 
      src="/logo.png" 
      alt="AzoresToyou Logo" 
      width={size} 
      height={size} 
      className={`object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
};

export default AzoresLogo;
