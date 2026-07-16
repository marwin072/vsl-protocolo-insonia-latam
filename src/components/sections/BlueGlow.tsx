import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

export const BlueGlow = () => {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLButtonElement>(null);

  useGSAP(() => {
    // Glow parallax
    gsap.to(glowRef.current, {
      y: 200,
      scale: 1.2,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5
      }
    });

    // Text fade in
    gsap.fromTo(textRef.current,
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1, 
        scale: 1,
        duration: 1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
        }
      }
    );

    // Animação de entrada da Seta
    gsap.fromTo(arrowRef.current,
      { opacity: 0, y: -20 },
      {
        opacity: 1, 
        y: 0,
        duration: 1,
        delay: 0.8, // Aparece logo após o texto
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
        },
        onComplete: () => {
          // Loop de flutuação após entrar
          gsap.to(arrowRef.current, {
            y: 15,
            yoyo: true,
            repeat: -1,
            duration: 1.5,
            ease: "sine.inOut"
          });
        }
      }
    );
  }, { scope: containerRef });

  // GSAP Interaction Handlers
  const handleArrowHover = () => {
    gsap.to(arrowRef.current, { scale: 1.15, duration: 0.3, ease: "back.out(2)" });
  };

  const handleArrowLeave = () => {
    gsap.to(arrowRef.current, { scale: 1, duration: 0.3, ease: "power2.out" });
  };

  const handleArrowClick = () => {
    // ScrollToPlugin garante um enquadramento perfeito matemático
    gsap.to(window, {
      duration: 1.2,
      scrollTo: { y: "#mente-desligada", offsetY: 0 },
      ease: "power3.inOut"
    });
  };

  return (
    <section ref={containerRef} className="relative w-full h-[60vh] bg-brand-primary flex flex-col items-center justify-center overflow-hidden">
      <div ref={glowRef} className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] bg-brand-accent/30 rounded-full blur-[120px]"></div>
      </div>
      
      <div ref={textRef} className="relative z-10 text-center px-6">
        <h2 className="text-4xl md:text-6xl font-heading text-brand-secondary font-light">
          El Método
        </h2>
        <div className="mt-6 text-brand-secondary/70 text-sm tracking-[0.2em] uppercase font-bold">
          Paso a paso para una mente silenciosa
        </div>
      </div>

      <button
        ref={arrowRef}
        onClick={handleArrowClick}
        onMouseEnter={handleArrowHover}
        onMouseLeave={handleArrowLeave}
        className="relative z-20 mt-16 text-brand-accent hover:text-[#ebd494] transition-colors cursor-pointer focus:outline-none opacity-0 drop-shadow-[0_0_15px_rgba(255,200,80,0.3)]"
        aria-label="Ir a la sección Mente Apagada"
      >
        <svg 
          width="48" 
          height="48" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M12 4v16M19 13l-7 7-7-7"/>
        </svg>
      </button>
    </section>
  );
};
