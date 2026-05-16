
import React from 'react';

interface AzoresLogoProps {
  className?: string;
  size?: number;
}

const AzoresLogo: React.FC<AzoresLogoProps> = ({ className = "", size = 40 }) => {
  return (
    <img 
      src="/logofinal2.png" 
      alt="Azores4you Logo" 
      className={className}
      style={{ 
        width: size, 
        height: size, 
        objectFit: 'contain',
        borderRadius: size > 40 ? '1rem' : '0.5rem' // Adiciona um pouco de arredondamento se for grande
      }}
    />
  );
};

export default AzoresLogo;
