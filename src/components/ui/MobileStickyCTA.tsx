import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from './Button';

export const MobileStickyCTA = () => {
  const { scrollY } = useScroll();
  
  // O CTA aparece sutilmente após o usuário passar da primeira dobra (Hero)
  const opacity = useTransform(scrollY, [300, 500], [0, 1]);
  const y = useTransform(scrollY, [300, 500], [100, 0]);

  return (
    <motion.div 
      style={{ opacity, y }}
      className="fixed bottom-0 left-0 w-full z-50 p-4 bg-brand-primary/80 backdrop-blur-md border-t border-brand-secondary/10 md:hidden flex justify-center items-center pb-6"
    >
      <Button variant="cta" className="w-full h-14 text-base font-bold shadow-[0_0_20px_rgba(255,244,210,0.2)]">
        Acessar Protocolo
      </Button>
    </motion.div>
  );
};
