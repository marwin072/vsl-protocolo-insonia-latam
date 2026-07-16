import { useRef, useEffect } from 'react';

export const MathematicalOrbitRing = () => {
  const cometRef = useRef<SVGCircleElement>(null);
  const comet2Ref = useRef<SVGCircleElement>(null);
  
  useEffect(() => {
    let animationFrameId: number;
    let time = 0;

    const draw = () => {
      // Velocidade do fluxo contínuo do rastro de luz
      time -= 1.5; 
      
      // Aplicar o offset via DOM direto (bypass do React) -> 60fps cravado no mobile
      if (cometRef.current) {
        cometRef.current.style.strokeDashoffset = time.toString();
      }
      if (comet2Ref.current) {
        comet2Ref.current.style.strokeDashoffset = (time + 600).toString(); // Segundo cometa do lado oposto
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none will-change-transform" viewBox="0 0 600 600" overflow="visible">
      {/* Camada Base Fina e Opaca (Sempre Visível, Trilho Matemático) */}
      <circle 
        cx="300" 
        cy="300" 
        r="298" 
        fill="none" 
        stroke="var(--brand-accent)" 
        strokeWidth="1" 
        className="opacity-20"
      />
      {/* Camada Neon (A luz contínua fluindo pelo anel) */}
      <circle 
        ref={cometRef}
        cx="300" 
        cy="300" 
        r="298" 
        fill="none" 
        stroke="#ffffff" 
        strokeWidth="2" 
        strokeDasharray="200 1684" // 1684 é o perímetro aprox (2 * PI * 298), 200 é o tamanho do rastro
        className="drop-shadow-[0_0_12px_rgba(92,138,230,1)] mix-blend-screen will-change-transform"
      />
      {/* Segundo rastro Neon para manter a órbita viva de ambos os lados */}
      <circle 
        ref={comet2Ref}
        cx="300" 
        cy="300" 
        r="298" 
        fill="none" 
        stroke="#ffffff" 
        strokeWidth="2" 
        strokeDasharray="100 1784" 
        className="drop-shadow-[0_0_15px_rgba(255,200,80,0.8)] mix-blend-screen will-change-transform opacity-70"
      />
    </svg>
  );
};
