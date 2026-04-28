
import React from 'react';

interface AzoresLogoProps {
  className?: string;
  size?: number;
}

const AzoresLogo: React.FC<AzoresLogoProps> = ({ className = "", size = 40 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Montanhas ao Fundo (Verde AzoresToyou) */}
      <path 
        d="M5 75L30 30L50 60L70 20L95 75H5Z" 
        fill="#2C7A2E" 
        opacity="0.9"
      />
      
      {/* Mar / Ondas (Azul AzoresToyou) */}
      <path 
        d="M0 75C15 65 30 85 45 75C60 65 75 85 90 75C95 72 100 75 100 75V100H0V75Z" 
        fill="#1A75BB" 
      />
      
      {/* Baleia Melhorada (Corpo mais fluido e cauda detalhada) */}
      {/* Corpo da Baleia */}
      <path 
        d="M15 80C15 60 45 50 75 65C85 70 92 65 95 60" 
        stroke="white" 
        strokeWidth="5" 
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Cauda da Baleia (Mais orgânica) */}
      <path 
        d="M95 60C95 60 92 48 82 45C88 45 92 50 95 60ZM95 60C95 60 98 48 108 45C102 45 98 50 95 60Z" 
        fill="white" 
      />
      
      {/* Detalhes de movimento na água */}
      <path d="M25 85H40" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      <path d="M55 88H65" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
      
      {/* Olho da Baleia (Pequeno detalhe) */}
      <circle cx="30" cy="68" r="1.2" fill="white" opacity="0.8" />
    </svg>
  );
};

export default AzoresLogo;
