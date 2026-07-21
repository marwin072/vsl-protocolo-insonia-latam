import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from './Button';
import { Countdown } from './Countdown';

export const MobileStickyCTA = () => {
  const { scrollY } = useScroll();
  
  const handleCheckoutClick = () => {
    window.location.href = "https://pay.hotmart.com/M106824063R?off=tlobacid&checkoutMode=10&offDiscount=PLUSEDITIONHOY";
  };

  // O CTA aparece sutilmente após o usuário passar da primeira dobra (Hero)
  const opacity = useTransform(scrollY, [300, 500], [0, 1]);
  const y = useTransform(scrollY, [300, 500], [100, 0]);

  return (
    <motion.div 
      style={{ opacity, y }}
      className="fixed bottom-0 left-0 w-full z-50 px-4 pb-6 pt-0 bg-gradient-to-t from-brand-primary via-brand-primary/90 to-transparent md:hidden flex flex-col justify-center items-center pointer-events-none"
    >
      <div className="w-full max-w-sm mx-auto pointer-events-auto">
        <Countdown isMobileSticky={true} />
        <Button variant="cta" className="w-full h-14 text-base font-bold shadow-[0_0_25px_rgba(255,244,210,0.25)] border-t border-brand-secondary/20" onClick={handleCheckoutClick}>
          Acceder al Protocolo
        </Button>
      </div>
    </motion.div>
  );
};
