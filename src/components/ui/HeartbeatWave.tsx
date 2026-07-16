import { useRef, useEffect } from 'react';

export const HeartbeatWave = () => {
  const basePathRef = useRef<SVGPathElement>(null);
  const solidPathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    let time = 0;

    const draw = () => {
      // time determina a velocidade do fluxo contínuo da onda para a esquerda
      time += 0.08; 
      
      let d = "M 0 200 ";
      const width = 1000;
      const height = 400;
      const centerY = height / 2;
      const points = 250; // Otimizado para Mobile (menos pontos, mesma fluidez)
      const slice = width / points;

      for (let i = 0; i <= points; i++) {
        const x = i * slice;
        const nx = (x / width) * 2 - 1; // Range: -1 a 1
        
        // Envelope Gaussiano mantendo o design idêntico à imagem (pontas achatadas, centro alto)
        const envelope = Math.exp(-nx * nx * 15);
        
        // A matemática da onda com o "- time" que cria a animação de fluxo constante
        const y = centerY + Math.sin((x * 0.12) - time) * (160 * envelope);
        
        d += `L ${x} ${y} `;
      }

      // Bypass do React (DOM Direto) -> Garante 60 FPS no Mobile sem forçar re-renders no React
      if (basePathRef.current) basePathRef.current.setAttribute('d', d);
      if (solidPathRef.current) solidPathRef.current.setAttribute('d', d);

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <svg className="w-full h-full will-change-transform" viewBox="0 0 1000 400" preserveAspectRatio="none">
      {/* Camada Base Fina e Opaca (Sempre Visível) */}
      <path 
        ref={basePathRef}
        fill="none" 
        stroke="var(--brand-accent)" 
        strokeWidth="1" 
        className="opacity-20 will-change-transform"
        vectorEffect="non-scaling-stroke"
      />
      {/* Camada Neon (Animada via GSAP com o Scroll, fluindo em tempo real) */}
      <path 
        ref={solidPathRef}
        className="solid-path drop-shadow-[0_0_12px_rgba(92,138,230,1)] mix-blend-screen will-change-transform"
        fill="none" 
        stroke="#ffffff" 
        strokeWidth="3" 
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};
