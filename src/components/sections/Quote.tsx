import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export const Quote = () => {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Text scrub animation
    if (textRef.current) {
      const chars = textRef.current.querySelectorAll('.char');

      gsap.fromTo(chars,
        { opacity: 0.1 },
        {
          opacity: 1,
          stagger: 0.05,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top center",
            end: "bottom center",
            scrub: 1.5
          }
        }
      );
    }
  }, { scope: containerRef });

  // Split text into spans for character animation
  const quoteText = "Sin este descanso nocturno genuino, toda tu creatividad, energía y capacidad de concentración permanecen dormidas.";

  return (
    <section ref={containerRef} className="relative w-full min-h-[80vh] bg-brand-primary flex flex-col items-center justify-center py-32 px-6">
      <div className="max-w-4xl mx-auto text-center" ref={textRef}>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading text-brand-secondary font-light leading-snug">
          {quoteText.split(/(\s+)/).map((segment, index) => {
            if (segment.match(/\s+/)) {
              return <span key={index}>{segment}</span>;
            }
            return (
              <span key={index} className="inline-block whitespace-nowrap">
                {segment.split('').map((char, cIndex) => (
                  <span key={cIndex} className="char inline-block">{char}</span>
                ))}
              </span>
            );
          })}
        </h2>
        <div className="mt-12 flex justify-center">
          <div className="w-16 h-[1px] bg-brand-secondary"></div>
        </div>
      </div>
    </section>
  );
};
