import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export const Balance = () => {
  const containerRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(leftRef.current,
      { opacity: 0, x: -50 },
      {
        opacity: 1, 
        x: 0, 
        duration: 1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
        }
      }
    );
    
    gsap.fromTo(rightRef.current,
      { opacity: 0, x: 50 },
      {
        opacity: 1, 
        x: 0, 
        duration: 1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
        }
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full bg-brand-primary py-24 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32">
        <div ref={leftRef} className="flex flex-col border-l border-brand-secondary/20 pl-8">
          <h4 className="text-xl font-heading text-brand-secondary mb-4 uppercase tracking-wider">La Sobrecarga de Cortisol</h4>
          <p className="text-sm font-sans text-brand-secondary/80 leading-relaxed">
            La hormona del estrés, vital por la mañana para despertarnos, se convierte en un veneno por la noche. Pantallas emitiendo luz azul, discusiones de trabajo a las 22h y consumo de información pesada mantienen el cortisol por las nubes, bloqueando la puerta de entrada al sueño.
          </p>
        </div>
        <div ref={rightRef} className="flex flex-col border-l border-brand-secondary/20 pl-8">
          <h4 className="text-xl font-heading text-brand-secondary mb-4 uppercase tracking-wider">El Poder de la Melatonina</h4>
          <p className="text-sm font-sans text-brand-secondary/80 leading-relaxed">
            Es la llave maestra del descanso. La melatonina solo se produce en ausencia de luz y al disminuir el ritmo mental. El Protocolo Mente Apagada utiliza gatillos naturales específicos (como temperatura y frecuencias sonoras) para forzar al cuerpo a liberar melatonina, apagando tu mente acelerada.
          </p>
        </div>
      </div>
    </section>
  );
};
