export const SleepCycle = () => {
  return (
    <section className="relative w-full py-24 bg-[var(--cosmic-bg)] flex items-center justify-center overflow-hidden transition-colors duration-1000">
      <div className="relative z-10 text-center flex flex-col items-center">
        <div className="w-32 h-32 rounded-full border border-[var(--text-main)] opacity-20 mb-8 animate-[spin_60s_linear_infinite] flex items-center justify-center">
          <div className="w-24 h-24 rounded-full border border-brand-accent/50 shadow-[0_0_20px_rgba(92,138,230,0.4)]"></div>
        </div>
        <h2 className="text-sm tracking-[0.3em] font-bold text-brand-accent mb-4 uppercase">Ciclos Otimizados</h2>
        <p className="text-[var(--text-main)] max-w-md font-sans text-lg opacity-80">
          Reconstruído 5x mais rápido em CSS Puro, sem peso de processamento 3D.
        </p>
      </div>
    </section>
  );
};
