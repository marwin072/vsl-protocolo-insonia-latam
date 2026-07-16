import React, { useEffect, useState, type ReactNode } from 'react';

interface CosmicParallaxBgProps {
  /** Texto principal em destaque */
  head?: string;
  /** Subtítulo descritivo */
  text?: string;
  /** Se as animações das estrelas devem entrar em loop */
  loop?: boolean;
  /** Classes customizadas do Tailwind */
  className?: string;
  /** Elementos filhos (aqui você vai injetar sua órbita e suas luas para ficarem centralizadas) */
  children?: ReactNode;
}

export const CosmicParallaxBg: React.FC<CosmicParallaxBgProps> = ({
  head,
  text,
  loop = true,
  className = '',
  children,
}) => {
  const [smallStars, setSmallStars] = useState<string>('');
  const [mediumStars, setMediumStars] = useState<string>('');
  const [bigStars, setBigStars] = useState<string>('');

  const textParts = text ? text.split(',').map(part => part.trim()) : [];

  const generateStarBoxShadow = (count: number): string => {
    let shadows = [];
    for (let i = 0; i < count; i++) {
      const x = Math.floor(Math.random() * 2400);
      const y = Math.floor(Math.random() * 2400);
      shadows.push(`${x}px ${y}px rgba(255, 255, 255, 0.8)`);
    }
    return shadows.join(', ');
  };

  useEffect(() => {
    setSmallStars(generateStarBoxShadow(600));
    setMediumStars(generateStarBoxShadow(150));
    setBigStars(generateStarBoxShadow(60));

    document.documentElement.style.setProperty(
      '--animation-iteration',
      loop ? 'infinite' : '1'
    );
  }, [loop]);

  return (
    <div className={`relative w-full min-h-screen overflow-hidden transition-colors duration-700 bg-[var(--cosmic-bg)] ${className}`}>
      
      {/* Camadas de Estrelas em Parallax CSS com Cintilação (Twinkle) */}
      <div className="absolute inset-0 w-full h-full animate-[cosmicTwinkle_4s_ease-in-out_infinite]">
        <div 
          style={{ boxShadow: smallStars }}
          className="absolute w-[1px] h-[1px] bg-transparent animate-[animStar_150s_linear_infinite] after:content-[''] after:absolute after:top-[2000px] after:w-[1px] after:h-[1px] after:bg-transparent"
        ></div>
      </div>
      <div className="absolute inset-0 w-full h-full animate-[cosmicTwinkle_7s_ease-in-out_infinite_1s]">
        <div 
          style={{ boxShadow: mediumStars }}
          className="absolute w-[2px] h-[2px] bg-transparent animate-[animStar_100s_linear_infinite] after:content-[''] after:absolute after:top-[2000px] after:w-[2px] after:h-[2px] after:bg-transparent"
        ></div>
      </div>
      <div className="absolute inset-0 w-full h-full animate-[cosmicTwinkle_10s_ease-in-out_infinite_2s]">
        <div 
          style={{ boxShadow: bigStars }}
          className="absolute w-[3px] h-[3px] bg-transparent animate-[animStar_70s_linear_infinite] after:content-[''] after:absolute after:top-[2000px] after:w-[3px] after:h-[3px] after:bg-transparent"
        ></div>
      </div>
      
      {/* Luz/Glow Centralizador que se adapta aos Modos Light/Dark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-[var(--center-glow)] opacity-40 blur-[140px] transition-all duration-700"></div>
      </div>

      {/* Conteúdo Dinâmico Central (Injeção da Órbita/Planeta) */}
      <div className="relative z-10 w-full h-full min-h-screen flex items-center justify-center layout-container">
        {children}
      </div>
      
      {/* Blocos de texto originais (Opcionais - Renderizam apenas se passados via Props) */}
      {(head || text) && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 text-center z-20 pointer-events-none w-full px-4">
          {head && <h1 className="text-5xl md:text-8xl font-sans tracking-[0.3em] text-[var(--text-main)] mb-6 font-light drop-shadow-lg">{head.toUpperCase()}</h1>}
          {text && (
            <div className="text-xs md:text-sm tracking-[0.2em] font-semibold text-[var(--text-sub)] flex gap-4 md:gap-8 justify-center flex-wrap">
              {textParts.map((part, index) => (
                <span key={index} className={`animate-[animDont_4s_ease_infinite]`} style={{ animationDelay: `${index * 0.2}s` }}>
                  {part.toUpperCase()}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
