import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { CosmicParallaxBg } from '../ui/parallax-cosmic-background';
import { MOTION_CONFIG } from '../../lib/motion.config';

gsap.registerPlugin(ScrollToPlugin);

export const Hero = () => {
  const containerRef = useRef<HTMLElement>(null);

  // Refs for animation
  const bgRef = useRef<HTMLDivElement>(null);
  const mountainFrontRef = useRef<HTMLDivElement>(null);
  const mountainBackRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLButtonElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const reveals = gsap.utils.toArray<HTMLElement>('[data-anima="reveal"]');
      const titleChars = gsap.utils.toArray<HTMLElement>('[data-anima="title-char"]');
      
      const tl = gsap.timeline();
      
      tl
        // 1. 0.0s - Atmosfera fade-in (inclui parallax e dunas)
        .fromTo(bgRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1.5, ease: 'power2.out' },
          0.0
        )
        // Opcional: Dunas subindo suavemente no fundo junto com a atmosfera
        .fromTo([mountainBackRef.current, mountainFrontRef.current],
          { y: 100 },
          { y: 0, duration: 2.5, stagger: 0.2, ease: 'power3.out' },
          0.0
        )
        
        // 2. 0.3s - Eyebrow revela
        .fromTo(reveals[0], 
          { opacity: 0, y: 15 }, 
          { opacity: 1, y: 0, duration: MOTION_CONFIG.duration.reveal, ease: MOTION_CONFIG.ease.reveal }, 
          0.3
        )
        
        // 3. 0.6s - MENTE DESLIGADA title stagger
        .fromTo(titleChars, {
          opacity: 0,
          y: 30
        }, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: 'power3.out'
        }, 0.6)

        // 4. 1.2s - Subtitle fade
        .fromTo(reveals[1], {
          opacity: 0,
          y: 10
        }, {
          opacity: 1,
          y: 0,
          duration: MOTION_CONFIG.duration.reveal,
          ease: MOTION_CONFIG.ease.reveal
        }, 1.2)

        // 5. 1.5s - Mockup emerge do fundo
        .fromTo(mockupRef.current,
          { opacity: 0, scale: 0.72, y: 24, filter: 'blur(14px)' },
          { 
            opacity: 1, 
            scale: 1, 
            y: 0, 
            filter: 'blur(0px)', 
            duration: MOTION_CONFIG.duration.heroCard, 
            ease: MOTION_CONFIG.ease.heroCard 
          },
          1.5
        )

        // 6. 1.9s - Scroll indicator
        .fromTo(scrollIndicatorRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1.5, ease: 'power2.inOut' },
          1.9
        );

      // Parallax sutil no scroll para as montanhas
      gsap.to(mountainBackRef.current, {
        y: 100,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: MOTION_CONFIG.scrub.base
        }
      });

      gsap.to(mountainFrontRef.current, {
        y: 150,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: MOTION_CONFIG.scrub.base
        }
      });
      
      // Animação de flutuação sutil do mockup (opcional, sem tirar do fluxo)
      gsap.to(mockupRef.current, {
        y: -6,
        duration: MOTION_CONFIG.duration.heroCardFloat,
        repeat: -1,
        yoyo: true,
        ease: MOTION_CONFIG.ease.heroCardFloat,
        delay: 1.5 + MOTION_CONFIG.duration.heroCard // Inicia depois da animação de entrada
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set([
        bgRef.current,
        '[data-anima="reveal"]', 
        '[data-anima="title-char"]',
        mountainBackRef.current, 
        mountainFrontRef.current, 
        scrollIndicatorRef.current
      ], { 
        opacity: 1, y: 0, scale: 1 
      });
      
      gsap.set(mockupRef.current, {
        opacity: 1, y: 0, scale: 1, filter: 'blur(0px)'
      });
    });

  }, { scope: containerRef });

  // GSAP Interaction Handlers (Idênticos aos da Flecha)
  const handleMockupHover = () => {
    gsap.to(mockupRef.current, { scale: 1.15, duration: 0.3, ease: "back.out(2)" });
  };

  const handleMockupLeave = () => {
    gsap.to(mockupRef.current, { scale: 1, duration: 0.3, ease: "power2.out" });
  };

  const handleMockupClick = () => {
    // ScrollToPlugin garante um enquadramento perfeito matemático
    gsap.to(window, {
      duration: 1.2,
      scrollTo: { y: "#mente-desligada", offsetY: 0 },
      ease: "power3.inOut"
    });
  };

  return (
    <section ref={containerRef} className="hero relative w-full overflow-hidden bg-[var(--cosmic-bg)]">
      
      {/* Camada 1: Atmosfera como camada de fundo (Absolute SÓ nela) */}
      <div ref={bgRef} className="absolute inset-0 z-0 pointer-events-none opacity-0">
        <CosmicParallaxBg loop={true}>
          <div className="absolute bottom-0 left-0 w-full h-[50vh] flex items-end">
            <div className="absolute bottom-0 w-full h-[60%] bg-brand-accent/10 blur-[100px] rounded-t-full"></div>
            
            <div ref={mountainBackRef} className="absolute bottom-0 w-full h-full will-change-transform">
              <svg viewBox="0 0 1440 600" fill="none" preserveAspectRatio="none" className="w-full h-full object-cover object-bottom text-brand-secondary">
                <path d="M0 400C300 200 600 500 1440 200V600H0V400Z" fill="currentColor" opacity="0.4" />
              </svg>
            </div>

            <div ref={mountainFrontRef} className="absolute bottom-0 w-full h-full will-change-transform">
              <svg viewBox="0 0 1440 600" fill="none" preserveAspectRatio="none" className="w-full h-full object-cover object-bottom text-brand-secondary">
                <path d="M-100 600C100 300 400 400 600 600H-100Z" fill="currentColor" opacity="1" />
                <path d="M800 600C1000 400 1300 350 1500 600H800Z" fill="currentColor" opacity="0.85" />
              </svg>
            </div>
          </div>
        </CosmicParallaxBg>
      </div>

      {/* Camada 2: Hero Content - ÚNICO CONTAINER FLEX-COLUMN NO FLUXO NORMAL */}
      <div className="hero-content relative z-20 flex flex-col items-center justify-center min-h-[100svh] w-full max-w-7xl mx-auto"
           style={{ gap: 'clamp(24px, 4vh, 48px)', padding: 'clamp(24px, 6vh, 64px) 20px' }}>
        
        {/* Eyebrow */}
        <div data-anima="reveal" className="eyebrow flex items-center gap-3 md:gap-4 text-brand-secondary text-[9px] md:text-xs tracking-[0.2em] uppercase font-bold opacity-0">
          <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-brand-secondary rounded-full"></span>
          BASADO EN TÉCNICAS DE TCC-I · 10 MINUTOS AL DÍA
          <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-brand-secondary rounded-full"></span>
        </div>

        {/* Título - Forçando quebra e controle de font-size */}
        <h1 className="hero-title text-center font-heading text-brand-secondary tracking-[0.2em] font-light uppercase leading-tight"
            style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)', whiteSpace: 'normal' }}>
          <span className="inline-block whitespace-nowrap">
            {"MENTE".split('').map((char, i) => (
              <span key={`m-${i}`} data-anima="title-char" className="inline-block opacity-0 translate-y-8">{char}</span>
            ))}
          </span>
          <br/>
          <span className="inline-block whitespace-nowrap mt-1 md:mt-3">
            {"APAGADA".split('').map((char, i) => (
              <span key={`d-${i}`} data-anima="title-char" className="inline-block opacity-0 translate-y-8">{char}</span>
            ))}
          </span>
        </h1>

        {/* Subtitle */}
        <p data-anima="reveal" className="hero-sub text-base md:text-xl font-sans text-brand-secondary/80 font-light text-center max-w-xl mx-auto opacity-0">
          Quédate dormido en 20 minutos — incluso con la cabeza a mil, sin medicamentos.
        </p>

        {/* Mockup do Livro - EM FLUXO NORMAL DO DOCUMENTO (Agora clicável) */}
        <button 
             className="hero-book w-full flex justify-center opacity-0 focus:outline-none cursor-pointer group" 
             ref={mockupRef}
             style={{ maxWidth: 'clamp(240px, 30vw, 320px)' }}
             onClick={handleMockupClick}
             onMouseEnter={handleMockupHover}
             onMouseLeave={handleMockupLeave}
             aria-label="Conoce el sistema Mente Apagada"
        >
          <img src="/mockup_latam_nobg.png" 
               alt="Mockup Ebook Protocolo Mente Apagada" 
               className="w-full h-auto object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.6)] group-hover:drop-shadow-[0_30px_50px_rgba(235,212,148,0.35)] transition-shadow duration-500" />
        </button>

        {/* Scroll Indicator */}
        <div data-anima="scroll-indicator" ref={scrollIndicatorRef} className="scroll-indicator flex items-center gap-3 text-brand-primary drop-shadow-md font-sans text-xs md:text-sm font-bold uppercase tracking-[0.2em] opacity-0 mt-auto md:mt-0">
          <div className="w-5 h-8 border-2 border-brand-primary rounded-full flex justify-center p-1">
            <div className="w-1 h-1.5 bg-brand-primary rounded-full animate-bounce"></div>
          </div>
          Desliza para explorar
        </div>

      </div>
    </section>
  );
};
