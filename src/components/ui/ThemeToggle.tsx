import { useTheme } from './ThemeProvider';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (toggleRef.current) {
      gsap.to(toggleRef.current, {
        rotate: theme === 'dark' ? 180 : 0,
        duration: 0.5,
        ease: "back.out(1.5)"
      });
    }
  }, [theme]);

  return (
    <button
      ref={toggleRef}
      onClick={toggleTheme}
      className="fixed top-8 right-8 z-50 w-12 h-12 rounded-full border border-brand-secondary bg-brand-primary/80 backdrop-blur-md flex items-center justify-center text-brand-secondary hover:scale-110 transition-transform cursor-pointer shadow-lg"
      aria-label="Alternar tema claro e escuro"
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};
