import { motion } from 'framer-motion';
import { Check, ShieldCheck, ClockUser } from '@phosphor-icons/react';
import { Button } from '../ui/Button';
import { Countdown } from '../ui/Countdown';

export const Offer = () => {
  const handleCheckoutClick = () => {
    window.location.href = "https://pay.hotmart.com/M106824063R?off=tlobacid&checkoutMode=10&offDiscount=PLUSEDITIONHOY";
  };

  return (
    <section id="offer" className="py-32 px-6 relative bg-brand-primary text-brand-secondary transition-colors duration-400 z-10">

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-heading text-brand-secondary mb-4 transition-colors duration-400"
          >
            Tu última noche de insomnio fue <span className="text-brand-accent italic">ayer</span>
          </motion.h2>
        </div>

        <div className="flex justify-center items-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-lg mx-auto bg-card-bg text-card-text border border-card-border rounded-[2rem] p-8 sm:p-10 md:p-12 shadow-2xl relative overflow-hidden transition-colors duration-400 group"
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-accent z-20"></div>

            {/* Efecto de Brillo Dinámico (Reutilizado del Footer) */}
            <div className="absolute inset-0 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-brand-secondary/20 to-transparent skew-x-[-20deg] z-10 pointer-events-none"></div>

            {/* Urgency Badge */}
            <div className="absolute top-5 right-5 bg-red-600/20 border border-red-500/50 text-red-500 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest animate-pulse backdrop-blur-sm shadow-[0_0_15px_rgba(220,38,38,0.4)] z-20">
              Solo Hoy
            </div>

            <div className="text-center mb-8">
              <h3 className="text-3xl font-heading mb-2">Protocolo Completo</h3>
              <p className="text-card-text-muted font-sans text-sm mb-8 transition-colors duration-400">Acceso de por vida + Actualizaciones</p>

              {/* Imagem Mockup Tablet INSIDE THE CARD */}
              <div className="flex justify-center mb-8 relative">
                <div className="absolute inset-0 bg-brand-accent/20 blur-[50px] rounded-full scale-75"></div>
                <img
                  src="/mockup_latam_nobg.png"
                  className="w-48 sm:w-56 object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.7)] hover:-translate-y-2 transition-transform duration-700 ease-out relative z-10"
                  alt="Tablet Protocolo Mente Apagada"
                />
              </div>

              {/* Caixa de Urgência Dinâmica */}
              <Countdown className="mb-6 inline-flex" />

              <div className="flex justify-center items-end gap-1 mb-2">
                <span className="text-card-text-muted text-xl font-sans line-through mb-2 mr-2 transition-colors duration-400">US$ 16.90</span>
                <span className="text-brand-accent mb-2 font-bold text-lg">US$</span>
                <span className="text-6xl font-heading font-bold text-brand-accent">6</span>
                <span className="text-2xl font-bold text-brand-accent">.80</span>
              </div>
              <p className="text-brand-accent/80 font-sans text-sm font-bold tracking-wide uppercase transition-colors duration-400 mt-2">Pago Único</p>
            </div>

            <ul className="space-y-5 mb-12 text-card-text font-sans transition-colors duration-400">
              {[
                'Guía Paso a Paso del Protocolo',
                'Audio Binaural de Desaceleración',
                'Rastreador del Ciclo Circadiano',
                'Módulo Extra: Volver a dormir',
                'Técnica 4-7-8 de Respiración Guiada',
                'Diario de Sueño Terapéutico'
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-4">
                  <Check size={20} className="text-brand-accent shrink-0" weight="bold" />
                  <span className="text-lg">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mb-8 hidden md:block">
              <Button variant="cta" size="lg" className="w-full text-base font-bold h-14" onClick={handleCheckoutClick}>
                Acceder al Protocolo
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 border-t border-brand-secondary/10 pt-8">
              <div className="flex items-center gap-2 text-brand-secondary/60 text-sm">
                <ShieldCheck size={20} className="text-primary" />
                <span>Garantía de 7 días</span>
              </div>
              <div className="flex items-center gap-2 text-brand-secondary/60 text-sm">
                <ClockUser size={20} className="text-primary" />
                <span>Acceso Inmediato</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
