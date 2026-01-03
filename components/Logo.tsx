
import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-12 h-12" }) => {
  return (
    <div className={`relative ${className} flex items-center justify-center`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Magnifying Glass Frame */}
        <circle cx="58" cy="42" r="35" fill="white" fillOpacity="0.1" stroke="#749DB8" strokeWidth="8" />
        {/* Magnifying Glass Handle */}
        <line x1="8" y1="92" x2="35" y2="65" stroke="#749DB8" strokeWidth="14" strokeLinecap="round" />
        
        {/* Text "FIND" */}
        <text 
          x="58" 
          y="42" 
          textAnchor="middle" 
          fontFamily="Inter, sans-serif" 
          fontWeight="900" 
          fontSize="22" 
          fill="#002C4D"
          transform="rotate(-5, 58, 42)"
        >
          FIND
        </text>
        
        {/* Blue Box for "IT" */}
        <rect 
          x="44" 
          y="48" 
          width="28" 
          height="20" 
          fill="#004E89" 
          rx="2" 
          transform="rotate(-5, 58, 58)"
        />
        
        {/* Text "IT" */}
        <text 
          x="58" 
          y="64" 
          textAnchor="middle" 
          fontFamily="Inter, sans-serif" 
          fontWeight="900" 
          fontSize="16" 
          fill="white"
          transform="rotate(-5, 58, 58)"
        >
          IT
        </text>
      </svg>
    </div>
  );
};

export default Logo;
