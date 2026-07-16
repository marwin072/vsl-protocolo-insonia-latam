import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { CosmicParallaxBg } from '../ui/parallax-cosmic-background';
import { MathematicalOrbitRing } from '../ui/MathematicalOrbitRing';
import { MOTION_CONFIG } from '../../lib/motion.config';

gsap.registerPlugin(ScrollTrigger);

const nightsData = [
  { id: 1, title: "El Vaciado Mental + Respiración 4-7-8", text: "Libera tu mente de pensamientos rumiantes y usa técnicas de respiración consciente para un relajamiento profundo." },
  { id: 2, title: "La Regla de los 20 Minutos", text: "Rompe la asociación \"cama = preocupación\" programando tu cerebro para descansar." },
  { id: 3, title: "El Apagón de Pantallas", text: "La ventana de 60 min del protocolo que libera tu melatonina natural." },
  { id: 4, title: "El Ancla de la Mañana", text: "Regula el reloj biológico para que Mente Apagada haga efecto por la noche." },
  { id: 5, title: "El Ritual 3-2-1", text: "Cuenta regresiva propietaria que desacelera cuerpo y mente." },
  { id: 6, title: "Los 3 Saboteadores Invisibles", text: "Cómo el protocolo neutraliza la cafeína, el alcohol y las siestas en los horarios correctos." },
  { id: 7, title: "Tu Ritual Definitivo", text: "El sistema personal activado. El sueño profundo e ininterrumpido se convierte en tu nueva realidad." }
];

const moonAssets = [
  "/Ref_model/noite_1_crescente_fina-removebg-preview.png",
  "/Ref_model/noite_2_quarto_crescente-removebg-preview.png",
  "/Ref_model/noite_3_crescente_gibosa-removebg-preview.png",
  "/Ref_model/noite_4_gibosa-removebg-preview.png",
  "/Ref_model/noite_5_gibosa_avancada-removebg-preview.png",
  "/Ref_model/noite_6_quase_cheia-removebg-preview.png",
  "/Ref_model/noite_7_lua_cheia-removebg-preview.png"
];

export const Orbit = () => {
  const containerRef = useRef<HTMLElement>(null);
  const orbitRingRef = useRef<HTMLDivElement>(null);
  const earthRef = useRef<HTMLImageElement>(null);
  const moonsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardsRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Fonte de Verdade Única para a noite ativa (0 a 6)
  const [activeNight, setActiveNight] = useState<number>(0);

  const numMoons = 7;
  const angleStep = 360 / numMoons;

  // ---------------------------------------------------------
  // LÓGICA DE ÓRBITA E CONTRA-ROTAÇÃO (GSAP Nativo - Alta Performance)
  // ---------------------------------------------------------
  useGSAP(() => {
    // Rotação infinita e constante! Sem pausas, e sem bloqueio de reduced-motion 
    // para garantir que sempre acompanhe o cometa do SVG de fundo.
    gsap.to(orbitRingRef.current, {
      rotation: 360,
      duration: 60,
      repeat: -1,
      ease: "none"
    });

    gsap.to(earthRef.current, {
      rotation: 180,
      duration: 60,
      repeat: -1,
      ease: "none"
    });

    const validMoons = moonsRefs.current.filter(Boolean);
    gsap.to(validMoons, {
      rotation: -360, // Contra-rotação para manter as luas em pé
      duration: 60,
      repeat: -1,
      ease: "none"
    });
  }, { scope: containerRef });

  // ---------------------------------------------------------
  // CROSSFADE REAL DO CARD (GSAP)
  // ---------------------------------------------------------
  useGSAP(() => {
    cardsRefs.current.forEach((card, i) => {
      if (!card) return;

      if (i === activeNight) {
        // Elemento que está entrando (com delay leve para criar o sobreposto)
        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: MOTION_CONFIG.duration.micro,
          ease: MOTION_CONFIG.ease.micro,
          pointerEvents: 'auto',
          delay: 0.1 // O segredo da sobreposição (Crossfade)
        });
      } else {
        // Elemento que está saindo
        if (Number(gsap.getProperty(card, "opacity")) > 0) {
          gsap.to(card, {
            opacity: 0,
            y: -16,
            duration: MOTION_CONFIG.duration.micro,
            ease: MOTION_CONFIG.ease.micro,
            pointerEvents: 'none'
          });
        }
      }
    });
  }, { dependencies: [activeNight], scope: containerRef });

  // ---------------------------------------------------------
  // ANIMAÇÕES DE ENTRADA CONSOLIDADAS
  // ---------------------------------------------------------
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const texts = gsap.utils.toArray<HTMLElement>('[data-anima="reveal"]');

      // Única timeline para gerenciar tudo na seção Orbit
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
          once: true
        }
      });

      masterTl
        .fromTo(texts,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: MOTION_CONFIG.duration.reveal,
            stagger: 0.15,
            ease: MOTION_CONFIG.ease.reveal,
          }
        )
        .fromTo(earthRef.current,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: MOTION_CONFIG.duration.orbitInit,
            ease: MOTION_CONFIG.ease.reveal
          },
          "-=1"
        )
        .fromTo('.moon-wrapper',
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            stagger: 0.15,
            duration: MOTION_CONFIG.duration.moonInit,
            ease: MOTION_CONFIG.ease.reveal
          },
          "-=2"
        );
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set([earthRef.current, '.moon-wrapper', '[data-anima="reveal"]'], {
        opacity: 1, scale: 1, y: 0
      });
    });

  }, { scope: containerRef });

  // ---------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------
  const handleMoonHover = (index: number) => {
    setActiveNight(index);
  };

  const handleMoonLeave = () => {
    // Nenhuma ação necessária, a órbita é contínua e ininterrupta
  };

  const handleNavClick = (index: number) => {
    setActiveNight(index);
  };

  return (
    <section id="mente-desligada" ref={containerRef} className="relative w-full">

      <CosmicParallaxBg
        loop={true}
        head="Mente Apagada"
        text="SUEÑO PROFUNDO, RECUPERACIÓN, ENERGÍA, CLARIDAD"
      >
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-24 px-6 mt-32 md:mt-24">

          {/* LADO ESQUERDO: Órbita e Luas */}
          <div className="relative w-[300px] h-[300px] md:w-[600px] md:h-[600px] flex-shrink-0">

            {/* Terra Central */}
            <img
              ref={earthRef}
              src="/Ref_model/planeta_indiv-removebg-preview.png"
              alt="Tierra Dorada"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] md:w-[320px] drop-shadow-[0_0_40px_rgba(255,200,80,0.5)] z-30 will-change-transform opacity-0"
            />

            {/* Grupo Dinâmico: Anel SVG e Luas */}
            <div ref={orbitRingRef} className="absolute inset-0 w-full h-full will-change-transform">
              <div className="absolute inset-0 w-full h-full pointer-events-none">
                <MathematicalOrbitRing />
              </div>

              <div className="absolute inset-0 w-full h-full rounded-full z-40">
                {moonAssets.map((asset, i) => {
                  const angleDeg = (i * angleStep) - 90;
                  const angleRad = (angleDeg * Math.PI) / 180;
                  const x = 50 + 50 * Math.cos(angleRad);
                  const y = 50 + 50 * Math.sin(angleRad);
                  const isActive = activeNight === i;

                  return (
                    <button
                      key={i}
                      onMouseEnter={() => handleMoonHover(i)}
                      onMouseLeave={handleMoonLeave}
                      onFocus={() => handleMoonHover(i)}
                      onBlur={handleMoonLeave}
                      onClick={() => handleNavClick(i)}
                      className="moon-wrapper absolute w-12 h-12 md:w-20 md:h-20 -ml-6 -mt-6 md:-ml-10 md:-mt-10 rounded-full focus:outline-none focus:ring-4 focus:ring-[#ebd494]/50 z-50 cursor-pointer will-change-transform"
                      style={{ left: `${x}%`, top: `${y}%` }}
                      aria-label={`Noche ${i + 1} — ${nightsData[i].title}`}
                    >
                      {/* O divisor físico da lógica matemática e CSS */}
                      <div
                        ref={el => { moonsRefs.current[i] = el; }}
                        className="w-full h-full flex items-center justify-center will-change-transform"
                      >
                        {/* Camada livre para CSS (Scale e Glow) */}
                        <div className={`w-full h-full transition-all duration-500 flex items-center justify-center
                          ${isActive ? 'scale-[1.35] drop-shadow-[0_0_20px_rgba(255,200,80,0.8)] z-50' : 'scale-100 opacity-80 hover:opacity-100'}
                        `}>
                          <img src={asset} alt="" className="w-full h-full object-contain pointer-events-none" />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* LADO DIREITO: Card Flutuante "Mente Desligada" */}
          <div className="relative z-50 flex flex-col w-full md:max-w-md pt-8 md:pt-0">

            {/* Card Glassmorphism (Responsivo ao Tema) */}
            <div data-anima="reveal" className="relative bg-card-bg/40 backdrop-blur-md border border-card-border p-8 md:p-10 w-full rounded-[2rem] shadow-xl opacity-0 overflow-hidden transition-colors duration-500">

              {/* Grade de Crossfade */}
              <div className="grid grid-cols-1 grid-rows-1 relative min-h-[180px]">
                {nightsData.map((night, i) => (
                  <div
                    key={night.id}
                    ref={el => { cardsRefs.current[i] = el; }}
                    className="col-start-1 row-start-1 flex flex-col justify-start opacity-0"
                    style={{
                      opacity: i === 0 ? 1 : 0,
                      transform: i === 0 ? 'translateY(0)' : 'translateY(16px)',
                      pointerEvents: i === 0 ? 'auto' : 'none'
                    }}
                  >
                    {/* Header do Card (Icone + Tag) */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="px-3 py-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/30 text-brand-accent text-xs font-bold tracking-[0.15em] uppercase transition-colors duration-500">
                        NOCHE {night.id}
                      </div>
                    </div>

                    {/* Título */}
                    <h4 className="text-2xl md:text-3xl font-serif font-bold mb-4 text-card-text transition-colors duration-500">
                      {night.title}
                    </h4>

                    {/* Descrição */}
                    <p className="font-sans text-[15px] md:text-base text-card-text-muted leading-relaxed transition-colors duration-500">
                      {night.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Navegação Numérica (Footer do Card) */}
              <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-card-border pt-6 transition-colors duration-500">
                <div className="flex gap-2">
                  {nightsData.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handleNavClick(i)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-sans text-sm font-medium transition-all duration-300 border focus:outline-none focus:ring-2 focus:ring-brand-accent
                        ${activeNight === i
                          ? 'bg-brand-accent text-brand-primary border-brand-accent shadow-md'
                          : 'bg-card-text-muted/5 text-card-text-muted border-transparent hover:border-brand-accent/50'
                        }
                      `}
                      aria-label={`Seleccionar Noche ${i + 1}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-brand-accent text-sm font-sans font-medium ml-2 transition-colors duration-500">
                  <span className="text-lg">✦</span> 7 noches
                </div>
              </div>

            </div>

          </div>

        </div>
      </CosmicParallaxBg>

    </section>
  );
};
