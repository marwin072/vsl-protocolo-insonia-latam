import { motion } from 'framer-motion';

export const Solution = () => {
  return (
    <section className="py-32 px-6 relative bg-brand-primary overflow-hidden">
      {/* Subtle backdrop glow behind text to separate it from the deep background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-secondary/5 via-brand-primary to-brand-primary opacity-80"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-20 items-center">
          <div className="md:w-1/2 w-full order-2 md:order-1">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl"
              onMouseMove={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                const { currentTarget, clientX, clientY } = e;
                const { left, top } = currentTarget.getBoundingClientRect();
                const x = clientX - left;
                const y = clientY - top;
                currentTarget.style.setProperty('--x', `${x}px`);
                currentTarget.style.setProperty('--y', `${y}px`);
              }}
            >
              {/* Interactive Cursor Light (Flashlight effect) */}
              <div 
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 group-hover:opacity-100 z-20 mix-blend-soft-light"
                style={{
                  background: `radial-gradient(500px circle at var(--x, 50%) var(--y, 50%), rgba(255, 255, 255, 0.8), transparent 40%)`
                }}
              />
              
              <img 
                src="/ebook-v3-standing.jpg" 
                alt="Protocolo de 7 Noites" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              
              {/* Subtle inner border */}
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[2rem] pointer-events-none z-30 transition-colors duration-500 group-hover:ring-white/20"></div>
            </motion.div>
          </div>

          <div className="md:w-1/2 space-y-10 order-1 md:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading text-brand-secondary leading-tight mb-8">
                El Protocolo de <br /><span className="text-primary italic">7 Noches</span>
              </h2>
              <p className="text-lg text-brand-secondary/80 font-sans leading-relaxed max-w-lg">
                Un método validado basado en <strong>TCC-I</strong> que requiere solo <strong>10 minutos al día</strong>. Actúa directamente en la regulación del cortisol nocturno para que te quedes dormido en 20 minutos, sin pastillas fuertes.
              </p>
            </motion.div>
            
            <motion.ul 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              {[
                {
                  title: 'Desaceleración Neuromotora',
                  desc: 'La ventana de 30 minutos esenciales antes de acostarse.'
                },
                {
                  title: 'Bloqueo de Luz y Estímulos',
                  desc: 'El secreto de la producción de melatonina natural en alta dosis.'
                },
                {
                  title: 'Respiración Parasimpática',
                  desc: 'La técnica de emergencia para quienes se despiertan de madrugada.'
                }
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <span className="text-primary text-2xl font-bold font-heading shrink-0 pt-1">0{i+1}</span>
                  <div>
                    <h4 className="font-heading text-xl text-brand-secondary mb-1">{item.title}</h4>
                    <p className="font-sans text-brand-secondary/60 leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </motion.ul>
          </div>
        </div>
      </div>
    </section>
  );
};
