import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useGSAP } from '@gsap/react';
import { useTheme } from '../ui/ThemeProvider';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export const Reboot = () => {
  const containerRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const { theme } = useTheme();

  useGSAP(() => {
    // Fade in text elements sequentially with a smooth entrance ("surgimento")
    const texts = textRef.current?.children;
    if (texts) {
      gsap.fromTo(texts,
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.15,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 85%",
            end: "top 30%",
            scrub: 1.5
          }
        }
      );
    }

    // Floating animation for BOTH the text block and the brain (animating together)
    gsap.to([textRef.current, imageRef.current], {
      y: -15,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Glow flow animation
    gsap.fromTo('.glowing-path',
      { strokeDasharray: 1200, strokeDashoffset: 1200 },
      {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: leftColRef.current,
          start: "top 80%",
          end: "center 40%",
          scrub: 1
        }
      }
    );

    // Fade out BOTH text and brain to prevent "corte seco"
    gsap.to([textRef.current, rightColRef.current], {
      opacity: 0,
      scale: 0.95,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: leftColRef.current,
        start: "bottom 90%",
        end: "bottom 30%",
        scrub: true
      }
    });

    // Scroll-linked Time Animation AND Parallax Slide Down
    const timeObj = { value: 5 };
    const scrubTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 40%",
        end: "bottom 70%",
        scrub: true,
      }
    });

    scrubTl.to(rightColRef.current, {
      y: 250, // Move the image down to the circled region
      ease: "none"
    }, 0)
    .to(timeObj, {
      value: 8,
      ease: "none",
      onUpdate: () => {
        if (timeRef.current) {
          const h = Math.floor(timeObj.value);
          const m = Math.floor((timeObj.value - h) * 60);
          timeRef.current.innerText = `${h.toString().padStart(2, '0')}h${m.toString().padStart(2, '0')}`;
        }
      }
    }, 0);

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full bg-brand-primary overflow-hidden">

      {/* Top connection lines (Base Opaque) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] pointer-events-none opacity-20 z-0">
         <svg viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <defs>
              <linearGradient id="line-fade-base" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="white" />
                <stop offset="60%" stopColor="white" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
              <mask id="fade-mask-base">
                <rect width="1200" height="800" fill="url(#line-fade-base)" />
              </mask>
            </defs>
            <g mask="url(#fade-mask-base)">
              <path d="M600 0 C600 150, 150 200, 150 400" stroke="var(--brand-secondary)" strokeWidth="1" />
              <path d="M600 0 C600 200, 350 250, 350 450" stroke="var(--brand-secondary)" strokeWidth="1" />
              <path d="M600 0 C600 200, 600 400, 600 600" stroke="var(--brand-secondary)" strokeWidth="1" />
              <path d="M600 0 C600 200, 850 250, 850 450" stroke="var(--brand-secondary)" strokeWidth="1" />
              <path d="M600 0 C600 150, 1050 200, 1050 400" stroke="var(--brand-secondary)" strokeWidth="1" />
            </g>
         </svg>
      </div>

      {/* Top connection lines (Glowing Flow) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] pointer-events-none z-0">
         <svg viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" style={{ filter: 'drop-shadow(0 0 8px var(--brand-accent))' }}>
            <defs>
              <linearGradient id="line-fade-glow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="white" />
                <stop offset="60%" stopColor="white" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
              <mask id="fade-mask-glow">
                <rect width="1200" height="800" fill="url(#line-fade-glow)" />
              </mask>
            </defs>
            <g mask="url(#fade-mask-glow)">
              <path className="glowing-path" d="M600 0 C600 150, 150 200, 150 400" stroke="var(--brand-accent)" strokeWidth="2" strokeLinecap="round" />
              <path className="glowing-path" d="M600 0 C600 200, 350 250, 350 450" stroke="var(--brand-accent)" strokeWidth="2" strokeLinecap="round" />
              <path className="glowing-path" d="M600 0 C600 200, 600 400, 600 600" stroke="var(--brand-accent)" strokeWidth="2" strokeLinecap="round" />
              <path className="glowing-path" d="M600 0 C600 200, 850 250, 850 450" stroke="var(--brand-accent)" strokeWidth="2" strokeLinecap="round" />
              <path className="glowing-path" d="M600 0 C600 150, 1050 200, 1050 400" stroke="var(--brand-accent)" strokeWidth="2" strokeLinecap="round" />
            </g>
         </svg>
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-start relative z-10 pb-32 px-6">
        
        {/* Left Column: Text */}
        <div ref={leftColRef} className="relative z-20 pt-[350px] md:pt-[450px]">
          <div ref={textRef} className="flex flex-col items-start text-brand-secondary space-y-12">
            <div>
              <h2 className="text-5xl md:text-7xl font-heading mb-8 leading-tight font-light drop-shadow-sm">
                Reprogramando <br/>
                El Sistema.
              </h2>
              <p className="text-base md:text-lg max-w-sm font-sans leading-relaxed opacity-80">
                Todas las noches, tu cerebro ejecuta una actualización silenciosa. Limpia el caché emocional, rehace conexiones creativas y reorganiza recuerdos — exactamente como un desarrollador limpiando un código complejo.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-4 opacity-80 text-[10px] tracking-[0.2em] uppercase font-bold">
                  <span className="w-1 h-1 bg-brand-secondary rounded-full"></span>
                  PASTILLAS = LA TRAMPA DEL ATAJO
              </div>
              <p className="text-sm md:text-base max-w-sm font-sans opacity-80 leading-relaxed">
                Las pastillas para dormir prometen paz, pero a menudo roban el ritmo natural que tu cuerpo necesita para sanar. Silencian los síntomas temporalmente, pero no resuelven la causa raíz de tu insomnio.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Higgsfield Brain */}
        <div ref={rightColRef} className="flex justify-center items-center relative w-full pt-[100px] md:pt-[250px]">
          <div className="relative w-[350px] h-[350px] md:w-[500px] md:h-[500px] flex flex-col items-center justify-center">

            {/* Background Glow */}
            <div className="absolute inset-0 bg-brand-accent/20 rounded-full blur-[70px]"></div>

            {/* Higgsfield AI Generated Asset */}
            <div className="relative z-10 w-64 h-64 md:w-96 md:h-96 rounded-full overflow-hidden shadow-2xl border-4 border-brand-primary">
              <img
                ref={imageRef}
                src={theme === 'dark'
                  ? "https://d8j0ntlcm91z4.cloudfront.net/user_3FgQglLY5LI4TfRl0IZcglB62Ur/hf_20260709_041930_53e8c826-20dc-4771-bcc1-741f32352044.png"
                  : "https://d8j0ntlcm91z4.cloudfront.net/user_3FgQglLY5LI4TfRl0IZcglB62Ur/hf_20260709_041947_0356421a-d4a4-4409-8ffb-10417f4a29b4.png"
                }
                alt="Mente Reprogramada"
                className="w-full h-full object-cover transition-opacity duration-500 scale-110"
              />
            </div>

            {/* Center Typography */}
            <div className="text-center z-20 flex flex-col items-center mt-[-30px]">
              <span className="text-xs uppercase tracking-widest text-brand-secondary mb-2 font-sans bg-brand-primary/80 px-4 py-1.5 backdrop-blur-md rounded-full font-bold border border-brand-secondary/20 shadow-lg">Punto Ideal:</span>
              <span ref={timeRef} className="text-6xl md:text-8xl font-heading text-brand-secondary font-light tracking-tight drop-shadow-[0_0_20px_rgba(255,244,210,0.5)] tabular-nums">05h00</span>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
};
