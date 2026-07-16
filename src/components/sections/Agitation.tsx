
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../lib/gsap';
import { Bed, Clock, Brain, Pill } from '@phosphor-icons/react';

const painPoints = [
  {
    icon: Bed,
    title: 'Insomnio Crónico',
    description: 'Dando vueltas en la cama por horas sin poder pegar ojo, viendo la madrugada pasar.',
    colSpan: 'md:col-span-2',
    theme: 'dark' // Variedade visual no bento
  },
  {
    icon: Clock,
    title: 'Despertar a las 3 a.m.',
    description: 'El reloj biológico roto que te despierta de madrugada con el corazón acelerado.',
    colSpan: 'md:col-span-1',
    theme: 'light'
  },
  {
    icon: Brain,
    title: 'Mente Acelerada',
    description: 'Pensamientos que no se apagan, ansiedad por el día siguiente y listas de tareas infinitas.',
    colSpan: 'md:col-span-1',
    theme: 'light'
  },
  {
    icon: Pill,
    title: 'Dependencia',
    description: 'La terrible sensación de necesitar pastillas cada vez más fuertes solo para tener algunas horas de sueño superficial.',
    colSpan: 'md:col-span-2',
    theme: 'light'
  }
];

export const Agitation = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from('.agitation-heading', {
      opacity: 0,
      y: 24,
      duration: 0.8,
      ease: 'expo.out',
      scrollTrigger: { trigger: '.agitation-heading-group', start: 'top 80%' },
    });

    gsap.from('.agitation-card', {
      opacity: 0,
      y: 24,
      duration: 0.6,
      stagger: 0.12,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.agitation-grid', start: 'top 85%' },
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-brand-primary text-brand-secondary relative z-10 transition-colors duration-400">
      <div className="max-w-5xl mx-auto relative">
        <div className="agitation-heading-group text-center mb-16">
          {/* Eyebrows removidas para evitar saturação e cumprir a regra da taste-skill */}
          <h2 className="agitation-heading text-4xl md:text-5xl lg:text-6xl font-heading text-brand-secondary mb-6 text-balance transition-colors duration-400">
            ¿La noche se ha vuelto tu mayor <span className="text-brand-accent italic">enemigo?</span>
          </h2>
          <p className="agitation-heading text-lg text-brand-secondary/70 max-w-2xl mx-auto font-sans transition-colors duration-400">
            Si te identificas con alguna de estas situaciones, debes saber que no es tu culpa.
            Tu sistema nervioso está atascado en "modo de alerta".
          </p>
        </div>

        <div className="agitation-grid grid grid-cols-1 md:grid-cols-3 gap-6">
          {painPoints.map((point, index) => {
            const isDark = point.theme === 'dark';
            return (
              <div
                key={index}
                className={`agitation-card rounded-3xl p-8 md:p-10 flex flex-col justify-between border shadow-sm transition-colors duration-400 ${point.colSpan} ${isDark
                  ? 'bg-card-bg-highlight text-card-text-highlight border-card-border-highlight'
                  : 'bg-card-bg text-card-text border-card-border'
                  }`}
              >
                <div>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-8 transition-colors duration-400 ${isDark 
                    ? 'bg-brand-secondary/10 text-brand-secondary' 
                    : 'bg-brand-accent/10 text-brand-accent border border-brand-accent/20'
                    }`}>
                    <point.icon size={32} weight="duotone" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-heading mb-4 leading-tight">{point.title}</h3>
                  <p className={`font-sans leading-relaxed text-lg transition-colors duration-400 ${isDark ? 'text-card-text-highlight/80' : 'text-card-text-muted'}`}>
                    {point.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
