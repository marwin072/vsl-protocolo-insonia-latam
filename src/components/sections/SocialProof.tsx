import { motion } from 'framer-motion';
import { Star } from '@phosphor-icons/react';

const socialProofs = [
  "/alexia_depocomp.png",
  "/depoimentovalentina-att.jpg",
  "/sofia_ramirezdepoimnentt.jpg",
  "/depoimento_part.jpeg",
];

export const SocialProof = () => {
  return (
    <section className="py-32 px-6 relative bg-brand-primary z-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-heading text-brand-secondary mb-6">
              Quiénes ya lograron <br /><span className="text-primary italic">apagar la mente</span>
            </h2>
            <p className="text-brand-secondary/60 font-sans max-w-xl text-lg">
              Miles de personas retomaron el control de sus noches con el Protocolo.
            </p>
          </motion.div>
        </div>

        <div className="relative w-full max-w-5xl mx-auto -mx-6 px-6 md:mx-auto md:px-0">
          <div className="flex overflow-x-auto gap-6 pb-12 snap-x snap-mandatory hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style>{`
              .hide-scrollbar::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            
            {socialProofs.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="snap-center shrink-0 w-[85vw] max-w-[320px] md:max-w-[350px] relative group"
              >
                {/* Glow Effect on Hover */}
                <div className="absolute -inset-1 bg-gradient-to-tr from-brand-accent/30 to-transparent blur-lg rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <img 
                  src={img} 
                  alt={`Testimonio ${index + 1}`} 
                  className="w-full h-auto object-cover rounded-[2rem] shadow-[0_15px_30px_rgba(0,0,0,0.5)] border border-brand-secondary/10 relative z-10 hover:-translate-y-2 transition-transform duration-500" 
                />
              </motion.div>
            ))}
          </div>
          
          {/* Indicadores Visuais de Scroll */}
          <div className="flex justify-center items-center gap-2 mt-4 text-brand-secondary/40 text-sm">
            <span className="w-10 h-[1px] bg-brand-secondary/20"></span>
            <span>Desliza para ver más</span>
            <span className="w-10 h-[1px] bg-brand-secondary/20"></span>
          </div>
        </div>
      </div>
    </section>
  );
};
