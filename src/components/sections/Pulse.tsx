import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { HeartbeatWave } from '../ui/HeartbeatWave';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export const Pulse = () => {
  const containerRef = useRef<HTMLElement>(null);
  const leftTextRef = useRef<HTMLDivElement>(null);
  const rightTextRef = useRef<HTMLDivElement>(null);
  const painImageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      
      // 1. Reveal de Textos (Linear Mask)
      const reveals = gsap.utils.toArray<HTMLElement>('[data-anima="reveal"]');
      gsap.fromTo(reveals, 
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.5,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
            once: true
          }
        }
      );

      // 2. Animação de Parallax do Layout
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          end: "bottom top",
          scrub: 1.5
        }
      });

      tl.fromTo(leftTextRef.current, 
        { y: 150, opacity: 0 }, 
        { y: 0, opacity: 1, ease: 'power2.out', duration: 1 }, 0
      );
      tl.fromTo(rightTextRef.current, 
        { y: 200, opacity: 0 }, 
        { y: 50, opacity: 1, ease: 'power2.out', duration: 1 }, 0
      );

      tl.to([leftTextRef.current, rightTextRef.current], { 
        opacity: 0, 
        y: -100,
        duration: 0.8,
        ease: 'power2.inOut'
      }, ">");

      // 3. Animação da Linha de Pulso (SVG Draw)
      const path = document.querySelector('.solid-path') as SVGPathElement;
      if (path) {
        const length = path.getTotalLength();
        // Esconde a linha brilhante inteira inicialmente
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        
        // Desenha a linha brilhante por cima da linha base conforme o scroll
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
            end: "bottom 30%",
            scrub: 1.5
          }
        });
      }

      // Zoom-in na imagem de dor (Pain Image) no início da seção
      if (painImageRef.current) {
        gsap.fromTo(painImageRef.current,
          { scale: 0.95, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            ease: "sine.out",
            scrollTrigger: {
              trigger: painImageRef.current,
              start: "top 90%",
              end: "top 30%",
              scrub: 2.5
            }
          }
        );
      }

    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set([leftTextRef.current, rightTextRef.current, '[data-anima="reveal"]'], { 
        y: 0, opacity: 1 
      });
      const path = document.querySelector('.solid-path') as SVGPathElement;
      if (path) {
        gsap.set(path, { strokeDashoffset: 0 });
      }
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full min-h-[150vh] bg-[var(--cosmic-bg)] flex flex-col justify-between py-24 px-6 overflow-hidden transition-colors duration-1000">
      
      {/* Pain Image Section com Zoom via Scroll e CTA via Click (Posicionada exatamente onde o retângulo vermelho estava) */}
      <div className="w-full flex justify-center mb-16 relative z-30" ref={painImageRef}>
        <button 
          onClick={() => {
            gsap.to(window, {
              duration: 1.5,
              scrollTo: { y: "#offer", offsetY: 0 },
              ease: "power3.inOut"
            });
          }}
          className="group relative w-full max-w-2xl rounded-3xl overflow-hidden focus:outline-none cursor-pointer border border-brand-secondary/10 shadow-2xl"
          aria-label="Ir para a oferta"
        >
          {/* Imagem salva pelo usuário na raiz do projeto */}
          <img 
            src="/dor-insonia.jpeg" 
            alt="Dor da Insônia - Sobrecarga Mental" 
            className="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-[1.5s] ease-out"
          />
          {/* Overlay sutil ao passar o mouse indicando clicabilidade */}
          <div className="absolute inset-0 bg-brand-accent/0 group-hover:bg-brand-accent/10 transition-colors duration-500"></div>
          {/* CTA Hint Text no hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <span className="bg-brand-primary/80 backdrop-blur-md text-brand-secondary font-bold uppercase tracking-widest text-xs px-6 py-3 rounded-full border border-brand-secondary/20 shadow-xl">
              Descargar Protocolo
            </span>
          </div>
        </button>
      </div>

      {/* Marcador de Numeração */}
      <div data-anima="reveal" className="sticky top-24 left-12 w-12 h-12 rounded-full border border-brand-accent/30 flex items-center justify-center text-[var(--text-main)] font-serif z-20 opacity-0 mask-linear-reveal">
        02
      </div>

      {/* Título */}
      <div className="w-full flex justify-end px-4 md:px-12 z-20 sticky top-24 pointer-events-none mt-[-48px]">
         <h2 data-anima="reveal" className="text-4xl md:text-6xl font-heading text-[var(--text-main)] text-right font-light leading-tight drop-shadow-xl opacity-0 mask-linear-reveal">
            La importancia <br/>
            del Ritmo Correcto.
         </h2>
      </div>

      {/* Onda SVG Fiel à Referência */}
      <div className="sticky top-1/2 left-0 w-full -translate-y-1/2 flex items-center justify-center pointer-events-none z-10 opacity-90 h-[400px]">
         <HeartbeatWave />
      </div>

      {/* Textos de Conteúdo */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 px-4 md:px-12 z-30 sticky top-[65vh]">
        
        <div ref={leftTextRef} className="pt-12 md:pt-24 will-change-transform">
             <div className="flex items-center gap-4 mb-4 text-[var(--text-main)] text-[10px] tracking-[0.2em] uppercase font-bold">
                <span className="w-1.5 h-1.5 bg-brand-accent rounded-full shadow-[0_0_8px_rgba(92,138,230,0.8)]"></span>
                EL PULSO INTERNO
             </div>
             <p className="text-sm md:text-base font-sans text-[var(--text-sub)] leading-relaxed max-w-sm">
               Tu corazón define el ritmo de cada sistema de tu cuerpo. Cuando el estrés ataca, tu pulso se acelera. Cuando vuelve la calma, se desacelera — señalizando seguridad. Por la noche, tus latidos deben disminuir suavemente, guiando al cuerpo hacia la restauración. Es este gatillo natural el que induce el sueño.
             </p>
        </div>

        <div ref={rightTextRef} className="md:text-right flex flex-col md:items-end pt-12 md:pt-48 will-change-transform">
             <div className="flex items-center gap-4 mb-4 text-[var(--text-main)] text-[10px] tracking-[0.2em] uppercase font-bold">
                <span className="w-1.5 h-1.5 bg-brand-accent rounded-full shadow-[0_0_8px_rgba(92,138,230,0.8)]"></span>
                ALTA FRECUENCIA = BAJO DESCANSO
             </div>
             <p className="text-sm md:text-base font-sans text-[var(--text-sub)] leading-relaxed max-w-sm">
               Un ritmo constante no es solo salud — es armonía. La ansiedad constante, las notificaciones del celular y la mente agitada mantienen tu corazón acelerado, engañando a tu cerebro para entrar en modo <span className="italic text-brand-accent">lucha o huida</span> incluso en la oscuridad de tu habitación.
             </p>
        </div>

      </div>
      
      <div className="h-[50vh]"></div>
    </section>
  );
};
