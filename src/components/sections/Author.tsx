import { motion } from 'framer-motion';
import { InstagramLogo, GraduationCap, Brain, Certificate, Envelope } from '@phosphor-icons/react';

export const Author = () => {
  return (
    <section id="author" className="py-24 px-6 relative bg-brand-primary overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-brand-accent/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Image Column */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-5/12 flex justify-center relative"
          >
            <div className="relative group perspective-1000">
              {/* Animated glow behind image */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-brand-accent/40 to-transparent blur-xl rounded-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <img 
                src="/camilla_sleep_ofc.jpeg" 
                alt="Camilla Torres - Especialista em Sono" 
                className="relative z-10 w-full max-w-[400px] rounded-[2rem] object-cover shadow-[0_20px_40px_rgba(0,0,0,0.8)] border border-brand-secondary/10 group-hover:rotate-y-2 group-hover:-translate-y-2 transition-all duration-700 ease-out"
              />

              {/* Floating Badge */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute -bottom-6 -right-6 lg:-right-10 bg-card-bg border border-brand-accent/30 p-4 rounded-2xl shadow-xl z-20 backdrop-blur-md flex items-center gap-3 group-hover:-translate-y-3 transition-transform duration-500"
              >
                <div className="bg-brand-accent/20 p-2 rounded-full text-brand-accent">
                  <Certificate size={24} weight="duotone" />
                </div>
                <div>
                  <p className="text-brand-secondary font-bold text-sm">Sleep Coach</p>
                  <p className="text-brand-secondary/60 text-xs">Certificada</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Text Column */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-7/12"
          >
            <h4 className="text-brand-accent uppercase tracking-widest text-xs font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-brand-accent"></span>
              Conoce a tu Guía
            </h4>
            <h2 className="text-4xl md:text-5xl font-heading text-brand-secondary mb-6 leading-tight">
              De Insomne Crónica a <br/><span className="text-brand-accent italic font-light">Especialista del Sueño</span>
            </h2>
            
            <div className="space-y-6 text-brand-secondary/80 font-sans text-lg leading-relaxed mb-8">
              <p>
                Hola, soy <strong>Camilla Torres</strong>. Durante años, fui prisionera de mi propia mente. Conozco perfectamente la desesperación de ver el reloj marcar las 3:00 a.m. sabiendo que al día siguiente tendría que funcionar como si nada.
              </p>
              <p>
                Probé de todo: meditaciones, tés, higiene del sueño e incluso pastillas que me dejaban como zombie. Nada funcionaba a largo plazo. Frustrada, decidí sumergirme en la ciencia. Estudié neurociencia y me certifiqué como <strong>Sleep Coach</strong>.
              </p>
              <p>
                Descubrí que el problema no era mi cama, era mi <strong className="text-brand-secondary">neurología condicionada</strong>. Así nació este protocolo: apliqué la Terapia Cognitivo-Conductual (TCC-I) en mí misma y condensé meses de investigación clínica en un método práctico de 7 noches que ahora comparto contigo.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-6 pt-6 border-t border-brand-secondary/10">
              <a 
                href="https://instagram.com/camillatorres.co" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-brand-secondary hover:text-brand-accent transition-colors group"
              >
                <div className="bg-brand-secondary/5 p-3 rounded-xl group-hover:bg-brand-accent/10 transition-colors">
                  <InstagramLogo size={24} weight="duotone" />
                </div>
                <div>
                  <p className="text-xs text-brand-secondary/50 uppercase tracking-wider mb-1">Instagram</p>
                  <p className="font-bold">@camillatorres.co</p>
                </div>
              </a>
              
              <a 
                href="mailto:camillasleepcoach@gmail.com" 
                className="flex items-center gap-3 text-brand-secondary hover:text-brand-accent transition-colors group"
              >
                <div className="bg-brand-secondary/5 p-3 rounded-xl group-hover:bg-brand-accent/10 transition-colors">
                  <Envelope size={24} weight="duotone" />
                </div>
                <div>
                  <p className="text-xs text-brand-secondary/50 uppercase tracking-wider mb-1">Contacto Directo</p>
                  <p className="font-bold">camillasleepcoach@gmail.com</p>
                </div>
              </a>
              
              <div className="flex items-center gap-3 text-brand-secondary">
                <div className="bg-brand-secondary/5 p-3 rounded-xl">
                  <Brain size={24} className="text-brand-secondary/60" weight="duotone" />
                </div>
                <div>
                  <p className="text-xs text-brand-secondary/50 uppercase tracking-wider mb-1">Especialidad</p>
                  <p className="font-bold text-sm">Neurociencia y TCC-I</p>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
};
