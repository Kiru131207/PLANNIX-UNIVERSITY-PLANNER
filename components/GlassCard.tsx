import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  borderGlow?: boolean;
  style?: React.CSSProperties;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hoverEffect = false, borderGlow = false, style }) => {
  return (
    <div 
      style={style}
      className={`
        relative
        bg-black/40
        backdrop-blur-2xl
        rounded-[2rem]
        p-6 
        border border-white/10
        transition-all duration-500 ease-out
        ${hoverEffect ? 'hover:bg-white/5 hover:border-brand-gold/30 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]' : ''}
        ${borderGlow ? 'border-brand-gold/40 shadow-[0_0_40px_rgba(245,158,11,0.1)]' : ''}
        ${className}
      `}
    >
      {/* Subtle Inner Highlight for glass edge */}
      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      
      {children}
    </div>
  );
};

export default GlassCard;