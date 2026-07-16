export const HeroBackground3D = () => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden bg-[var(--cosmic-bg)] transition-colors duration-1000">
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--center-glow)] rounded-full blur-[120px] opacity-30"></div>
    </div>
  );
};
