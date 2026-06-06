import React from 'react';

interface AzoresLogoProps {
  className?: string;
  size?: number;
  style?: React.CSSProperties;
  color?: string;
}

const AzoresLogo: React.FC<AzoresLogoProps> = ({ className = "", size = 40, style, color }) => {
  const isLarge = size > 100;
  // Decrease size slightly (diminuis uma nica)
  const baseSize = size * 0.9;
  
  const birdSize = isLarge ? baseSize * 0.45 : baseSize;
  const textWidth = isLarge ? baseSize * 0.42 : baseSize * 0.85;

  return (
    <div className={`flex flex-col items-center justify-center ${className}`} style={{ gap: isLarge ? '0.5rem' : '0.1rem', ...style }}>
      <img 
        src="/finallogo.png" 
        alt="Azores4you Logo Bird" 
        className="max-w-full object-contain"
        style={{ 
          width: birdSize, 
          height: 'auto',
        }}
      />
      <img 
        src="/pngletras2.png" 
        alt="Azores4you Logo Text" 
        className="max-w-full object-contain"
        style={{ 
          width: textWidth, 
          height: 'auto',
        }}
      />
    </div>
  );
};

export default AzoresLogo;
