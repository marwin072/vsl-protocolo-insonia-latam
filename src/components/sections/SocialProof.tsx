import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';

const socialProofs = [
  "/alexia_depocomp.png",
  "/depoimentovalentina-att.jpg",
  "/sofia_ramirezdepoimnentt.jpg",
  "/carlosherrera_depoim.png"
];

export const SocialProof = () => {
  const [emblaRef] = useEmblaCarousel({ loop: true, dragFree: true }, [
    AutoScroll({ 
      playOnInit: true, 
      stopOnInteraction: true, // Only stops on drag interaction
      stopOnMouseEnter: false, // Keeps playing on hover
      speed: 1.5 // Ajuste de velocidade
    })
  ]);

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

      {/* Carrossel Drag & AutoScroll Premium - Embla */}
      <div className="max-w-[100vw] mx-auto">
        <div 
          className="overflow-hidden cursor-grab active:cursor-grabbing w-full pb-16 pt-8 px-6 lg:px-0" 
          ref={emblaRef}
        >
          <div className="flex gap-6 md:gap-8 touch-pan-y">
            {socialProofs.map((img, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex-[0_0_80vw] max-w-[320px] md:max-w-[400px] min-w-0 relative group"
              >
                {/* Glow Effect on Hover */}
                <div className="absolute -inset-1 bg-gradient-to-tr from-brand-accent/30 to-transparent blur-xl rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                
                <img 
                  src={img} 
                  alt={`Testimonio ${index + 1}`} 
                  className="w-full h-auto object-cover rounded-[2rem] shadow-[0_15px_40px_rgba(0,0,0,0.6)] border border-brand-secondary/10 relative z-10 pointer-events-none select-none" 
                />
              </motion.div>
            ))}
          </div>
        </div>
        
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
