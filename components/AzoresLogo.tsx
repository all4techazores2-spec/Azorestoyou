
import React from 'react';

interface AzoresLogoProps {
  className?: string;
  size?: number;
  style?: React.CSSProperties;
}

const AzoresLogo: React.FC<AzoresLogoProps> = ({ className = "", size = 40, style }) => {
  return (
    <img 
      src="/braga_logofinal.png" 
      alt="Azores4you Logo" 
      className={className}
      style={{ 
        width: size, 
        height: size, 
        objectFit: 'contain',
        ...style
      }}
    />
  );
};

export default AzoresLogo;
