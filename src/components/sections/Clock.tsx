import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export const Clock = () => {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(textRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1, 
        y: 0, 
        duration: 2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
        }
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full min-h-[50vh] bg-brand-primary flex flex-col items-center justify-center py-24 px-6 border-t border-brand-secondary/10">
      <div ref={textRef} className="max-w-3xl mx-auto text-center">
        <h3 className="text-3xl md:text-5xl font-heading text-brand-secondary font-light mb-8">
          El Engranaje del Sueño
        </h3>
        <p className="text-base md:text-lg font-sans text-brand-secondary/80 leading-relaxed">
          Piensa en tu ciclo circadiano como un maestro riguroso. Cuando intentas forzar el sueño en un horario en el que el maestro dirige "alerta máxima", toda la orquesta desafina. El Protocolo Mente Apagada calibra este reloj.
        </p>
      </div>
    </section>
  );
};
