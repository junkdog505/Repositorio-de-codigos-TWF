import React, { useEffect, useState } from 'react';

export default function ProgressBar() {
  const [width, setWidth] = useState(0);

  const handleScroll = () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPosition = window.scrollY;
    const percent = Math.min((scrollPosition / totalHeight) * 100, 100);
    setWidth(percent);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1.5 z-[60] pointer-events-none">
      <div 
        className="h-full bg-[#ff3344] shadow-[0px_2px_4px_rgba(255,51,68,0.3)] transition-all duration-200 ease-out" 
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
