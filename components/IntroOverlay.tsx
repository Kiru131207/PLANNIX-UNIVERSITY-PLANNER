import React, { useEffect, useState } from 'react';

const IntroOverlay: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);
  const title = "PLANNIX";

  useEffect(() => {
    // Show for 2.2 seconds (allow animation to finish), then fade out
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 1000); // Wait for fade-out transition to finish
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      className={`
        fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center
        transition-opacity duration-1000 ease-in-out
        ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
    >
      <div className="flex gap-1 md:gap-3 overflow-hidden">
        {title.split('').map((char, index) => (
          <span 
            key={index}
            className="text-6xl md:text-9xl font-extrabold tracking-tighter text-white opacity-0 animate-reveal"
            style={{ 
              animationDelay: `${index * 100}ms`,
              textShadow: '0 0 30px rgba(255, 255, 255, 0.2)'
            }}
          >
            {char}
          </span>
        ))}
      </div>
      <p 
        className="mt-6 text-brand-gold text-xs md:text-sm font-mono tracking-[0.5em] uppercase opacity-0 animate-fade-in"
        style={{ animationDelay: '1000ms' }}
      >
        University Workspace
      </p>
    </div>
  );
};

export default IntroOverlay;