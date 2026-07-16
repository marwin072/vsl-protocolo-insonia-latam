import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export const Footer = () => {
  const containerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const checkoutUrl = "{{CHECKOUT_URL}}";

  useGSAP(() => {
    gsap.fromTo(contentRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1, 
        y: 0, 
        duration: 1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        }
      }
    );
  }, { scope: containerRef });

  return (
    <footer ref={containerRef} className="relative w-full bg-brand-primary text-brand-secondary py-32 px-6 flex flex-col items-center overflow-hidden border-t border-brand-secondary/10">
      
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] bg-brand-accent/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div ref={contentRef} className="relative z-10 max-w-4xl w-full flex flex-col items-center text-center">
        
        <h2 className="text-4xl md:text-6xl font-heading mb-6 font-light">
          Amanhã começa esta noite.
        </h2>
        
        <p className="text-sm md:text-base font-sans text-brand-secondary/80 max-w-lg mb-12">
          O <span className="font-bold">Protocolo Mente Desligada</span> não é um remédio mágico. É a ciência da reprogramação do seu próprio corpo.
        </p>

        {/* Pricing / Offer Card */}
        <div className="w-full max-w-md bg-brand-secondary/5 border border-brand-secondary/20 p-8 rounded-[24px] backdrop-blur-sm mb-12 relative overflow-hidden group">
          {/* Shine effect on hover */}
          <div className="absolute inset-0 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-brand-secondary/10 to-transparent skew-x-[-20deg]"></div>
          
          <div className="text-sm tracking-[0.2em] uppercase font-bold mb-4 opacity-70">Acesso Imediato</div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-xl font-medium">12x de</span>
            <span className="text-5xl font-heading font-bold tracking-tighter">R$ 9,90</span>
          </div>
          <div className="text-sm opacity-70 mb-8">ou R$ 97 à vista no Pix/Boleto</div>

          <a 
            href={checkoutUrl}
            className="block w-full py-4 rounded-full bg-brand-secondary text-brand-primary font-bold uppercase tracking-wider text-sm hover:scale-105 transition-transform shadow-[0_10px_30px_rgba(0,0,0,0.1)] relative overflow-hidden"
          >
            Quero Começar Agora
          </a>
          
          <div className="flex items-center justify-center gap-4 mt-6 text-xs opacity-60">
            <span>🔒 Pagamento Seguro</span>
            <span>✓ Acesso Imediato</span>
          </div>
        </div>

        {/* Social Proof Placeholder */}
        <div className="w-full flex flex-col items-center mt-12 pt-12 border-t border-brand-secondary/20">
          <p className="text-xs tracking-widest uppercase mb-6 opacity-60 font-bold">
            Substituir pelas logos / mídia das provas sociais reais
          </p>
          <div className="flex gap-8 opacity-40 grayscale">
            <div className="w-24 h-8 bg-brand-secondary rounded-sm"></div>
            <div className="w-24 h-8 bg-brand-secondary rounded-sm"></div>
            <div className="w-24 h-8 bg-brand-secondary rounded-sm"></div>
          </div>
        </div>

      </div>
    </footer>
  );
};
