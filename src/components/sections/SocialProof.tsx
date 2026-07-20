import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from '@phosphor-icons/react';

const socialProofs = [
  "/alexia_depocomp.png",
  "/depoimentovalentina-att.jpg",
  "/sofia_ramirezdepoimnentt.jpg",
  "/depoimento_part.jpeg",
];

export const SocialProof = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (carouselRef.current) {
        setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
      }
    };
    
    updateWidth();
    window.addEventListener("resize", updateWidth);
    
    // Pequeno delay para garantir que as imagens carregaram e o scrollWidth é real
    setTimeout(updateWidth, 500);

    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <section className="py-32 px-0 relative bg-brand-primary z-10 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 mb-16">
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

      {/* Carrossel Drag - Framer Motion */}
      <div className="max-w-[100vw] mx-auto pl-6 md:pl-0 md:max-w-6xl overflow-visible">
        <motion.div ref={carouselRef} className="w-full cursor-grab active:cursor-grabbing overflow-hidden">
          <motion.div 
            drag="x" 
            dragConstraints={{ right: 0, left: -width }}
            dragElastic={0.1}
            dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
            className="flex gap-6 md:gap-8 touch-pan-y w-max pb-16 pt-8 pr-6"
          >
            {socialProofs.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="shrink-0 w-[75vw] max-w-[320px] md:max-w-[400px] relative group"
              >
                {/* Glow Effect on Hover/Drag */}
                <div className="absolute -inset-1 bg-gradient-to-tr from-brand-accent/30 to-transparent blur-xl rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <img 
                  src={img} 
                  alt={`Testimonio ${index + 1}`} 
                  className="w-full h-auto object-cover rounded-[2rem] shadow-[0_15px_40px_rgba(0,0,0,0.6)] border border-brand-secondary/10 relative z-10 pointer-events-none" 
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        
        {/* Indicadores Visuais de Interação */}
        <div className="flex justify-center items-center gap-3 mt-4 text-brand-secondary/40 text-sm tracking-widest uppercase font-bold">
          <span className="w-8 md:w-16 h-[1px] bg-brand-secondary/20"></span>
          <span>Arrastra para explorar</span>
          <span className="w-8 md:w-16 h-[1px] bg-brand-secondary/20"></span>
        </div>
      </div>
    </section>
  );
};
