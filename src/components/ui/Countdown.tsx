import { useState, useEffect } from 'react';

interface CountdownProps {
  initialMinutes?: number;
  className?: string;
  isMobileSticky?: boolean;
}

export const Countdown = ({ initialMinutes = 15, className = "", isMobileSticky = false }: CountdownProps) => {
  // Check if we have a saved end time in localStorage to persist across reloads
  const [timeLeft, setTimeLeft] = useState<number>(initialMinutes * 60);
  
  useEffect(() => {
    const savedEndTime = localStorage.getItem('protocolo_timer_end');
    const now = new Date().getTime();
    
    let targetTime;
    
    if (savedEndTime) {
      targetTime = parseInt(savedEndTime, 10);
      // If timer expired, reset it
      if (targetTime < now) {
        targetTime = now + initialMinutes * 60 * 1000;
        localStorage.setItem('protocolo_timer_end', targetTime.toString());
      }
    } else {
      targetTime = now + initialMinutes * 60 * 1000;
      localStorage.setItem('protocolo_timer_end', targetTime.toString());
    }
    
    const updateTimer = () => {
      const currentTime = new Date().getTime();
      const difference = targetTime - currentTime;
      
      if (difference <= 0) {
        setTimeLeft(0);
        // Optional: Reset timer loop if needed, but stopping at 0 creates more urgency
      } else {
        setTimeLeft(Math.floor(difference / 1000));
      }
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    
    return () => clearInterval(interval);
  }, [initialMinutes]);

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isMobileSticky) {
    return (
      <div className={`flex items-center justify-center gap-2 bg-red-600/90 text-white text-xs font-bold py-1.5 px-3 rounded-t-lg mx-auto w-max mb-[-1px] relative z-10 animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.5)] ${className}`}>
        <span className="uppercase tracking-widest">Expira en:</span>
        <span className="font-mono text-sm">{formatTime(timeLeft)}</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center gap-3 bg-red-500/10 border border-red-500/30 text-red-500 font-bold py-2 px-4 rounded-xl shadow-[0_0_15px_rgba(220,38,38,0.2)] ${className}`}>
      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
      <span className="uppercase tracking-[0.15em] text-xs sm:text-sm">Oferta expira en:</span>
      <span className="font-mono text-lg tracking-widest">{formatTime(timeLeft)}</span>
    </div>
  );
};
