
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Quote, Calendar, Star, Pause, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { Wish } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const WishesWall: React.FC<Props> = ({ isOpen, onClose }) => {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detectar tamaño de ventana
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let subscription: any;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      fetchWishes();
      setIsPaused(false);
      setCurrentIndex(0);

      subscription = supabase
        .channel('public:wishes')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'wishes' }, payload => {
          setWishes(prev => [payload.new as Wish, ...prev]);
        })
        .subscribe();
    } else {
      document.body.style.overflow = 'unset';
      setIsPaused(false);
      setCurrentIndex(0);
    }

    return () => { 
      document.body.style.overflow = 'unset'; 
      if (subscription) supabase.removeChannel(subscription);
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
    }
  }, [isOpen]);

  // Auto-play cuando no está pausado
  useEffect(() => {
    if (!isOpen || wishes.length === 0) return;

    if (!isPaused) {
      autoPlayIntervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          // Si llegamos al final del primer set, volvemos al inicio para el loop infinito
          if (prev >= wishes.length - 1) {
            return 0;
          }
          return prev + 1;
        });
      }, 3000); // Cambia cada 3 segundos
    } else {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
    }

    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
    };
  }, [isPaused, wishes.length, isOpen]);

  const handlePauseToggle = () => {
    setIsPaused(!isPaused);
  };

  const handlePrevious = () => {
    setIsPaused(true); // Pausar automáticamente al navegar manualmente
    setCurrentIndex((prev) => {
      if (prev <= 0) {
        return wishes.length - 1;
      }
      return prev - 1;
    });
  };

  const handleNext = () => {
    setIsPaused(true); // Pausar automáticamente al navegar manualmente
    setCurrentIndex((prev) => {
      if (prev >= wishes.length - 1) {
        return 0;
      }
      return prev + 1;
    });
  };

  const fetchWishes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('wishes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data) setWishes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-CO', {
      day: 'numeric', month: 'short'
    });
  };

  // Calcular el desplazamiento basado en el índice actual
  const isMobile = windowWidth > 0 && windowWidth < 768;
  const cardWidth = windowWidth > 0 
    ? (isMobile ? windowWidth * 0.92 : 450) 
    : 450; // 85vw en móvil, 450px en desktop
  const gap = 32; // gap-8 = 32px
  const padding = 32; // px-8 = 32px
  // En móvil, calcular el espacio sobrante para centrar correctamente
  // En desktop, usar el padding fijo
  const offset = windowWidth > 0 
    ? isMobile
      ? -(currentIndex * (cardWidth + gap) + ((windowWidth - cardWidth) / 2))
      : -(currentIndex * (cardWidth + gap) + padding)
    : 0;

  return (
    
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col bg-navy-900/95 backdrop-blur-xl overflow-hidden"
        >
          
          {/* Header */}
          <div className="flex-none p-6 md:p-8 flex justify-between items-center z-10 bg-gradient-to-b from-navy-900 via-navy-900/90 to-transparent">
            <div>
              <h2 className="font-display text-3xl md:text-4xl text-white drop-shadow-lg">Muro de Deseos</h2>
              <p className="font-sans text-sm text-gold-400 uppercase tracking-widest mt-1">
                {wishes.length} Mensajes de Amor
              </p>
            </div>
            <button 
              onClick={onClose}
              className="
                w-12 h-12 rounded-full
                bg-gradient-to-br from-gold-600/20 via-gold-500/15 to-gold-600/20
                border border-white/20
                shadow-[inset_-3px_-3px_8px_rgba(255,255,255,0.1),inset_3px_3px_8px_rgba(0,0,0,0.3),0_4px_12px_rgba(0,0,0,0.2)]
                active:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.4),inset_-2px_-2px_6px_rgba(255,255,255,0.05)]
                hover:shadow-[inset_-4px_-4px_10px_rgba(255,255,255,0.15),inset_4px_4px_10px_rgba(0,0,0,0.4),0_6px_16px_rgba(0,0,0,0.3)]
                flex items-center justify-center text-white
                transition-all duration-300 ease-out
                hover:scale-[1.05] active:scale-[0.95]
                backdrop-blur-sm group
                animate-pulse hover:animate-none
              "
            >
              <X size={24} className="group-hover:rotate-90 transition-transform duration-300 relative z-10" />
              
              {/* Brillo sutil al hover */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Resplandor exterior pulsante */}
              <div className="absolute -inset-1 rounded-full bg-white/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 animate-ping"></div>
            </button>
          </div>

          {/* Marquee Container */}
          <div className="flex-1 flex items-center w-full overflow-hidden relative pb-20">
            {/* Gradient Masks for smooth edges */}
            <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-r from-navy-900/95 to-transparent z-20 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-l from-navy-900/95 to-transparent z-20 pointer-events-none"></div>

            {loading ? (
               <div className="w-full text-center">
                  <div className="inline-block animate-spin text-gold-500 mb-4"><Star size={32} /></div>
                  <p className="text-gold-500 tracking-widest text-sm uppercase">Recopilando deseos...</p>
               </div>
            ) : wishes.length > 0 ? (
              <>
                <motion.div 
                  ref={containerRef}
                  className="flex gap-8 px-8"
                  animate={{ x: offset }} 
                  transition={{ 
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    duration: 0.6
                  }}
                  style={{ width: "max-content" }}
                >
                  {wishes.map((wish, i) => (
                    <div 
                      key={`${wish.id}-${i}`}
                      className="
                        flex-none w-[92vw] md:w-[450px] h-[55vh] md:h-[50vh]
                        bg-navy-800/40 backdrop-blur-md
                        border border-gold-500/20
                        rounded-[2rem] p-8 md:p-10
                        relative flex flex-col justify-between
                        shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]
                        hover:bg-navy-800/60 hover:border-gold-500/40 hover:scale-[1.02]
                        transition-all duration-300 group
                      "
                    >
                      {/* Glass sheen effect */}
                      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none"></div>
                      
                      <Quote className="text-gold-500 w-12 h-12 opacity-20 absolute top-8 right-8 group-hover:opacity-40 transition-opacity" />
                      
                      <div className="overflow-y-auto pr-2 custom-scrollbar relative z-10 mt-6">
                        <p className="font-serif text-xl md:text-2xl text-gray-200 leading-relaxed italic">
                          "{wish.message}"
                        </p>
                      </div>

                      <div className="mt-8 border-t border-white/5 pt-6 flex items-center gap-4 relative z-10">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-b from-gold-400 to-gold-700 p-[2px] shadow-lg">
                          <div className="w-full h-full rounded-full bg-navy-900 flex items-center justify-center">
                             <span className="font-display text-gold-500 text-xl font-bold">
                               {wish.name.charAt(0).toUpperCase()}
                             </span>
                          </div>
                        </div>
                        
                        <div>
                          <span className="block font-display text-lg text-gold-100 tracking-wide group-hover:text-gold-400 transition-colors">
                            {wish.name}
                          </span>
                          <span className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-wider mt-1 font-sans">
                            <Calendar size={10} />
                            {formatDate(wish.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>

                {/* Controles del carrusel */}
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-4">
                  {/* Botón Anterior */}
                  <button
                    onClick={handlePrevious}
                    className="
                      w-14 h-14 md:w-16 md:h-16 rounded-full
                      bg-gradient-to-br from-gold-600/30 via-gold-500/20 to-gold-600/30
                      border border-white/30
                      shadow-[inset_-3px_-3px_8px_rgba(255,255,255,0.1),inset_3px_3px_8px_rgba(0,0,0,0.3),0_4px_12px_rgba(0,0,0,0.2)]
                      active:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.4),inset_-2px_-2px_6px_rgba(255,255,255,0.05)]
                      hover:shadow-[inset_-4px_-4px_10px_rgba(255,255,255,0.15),inset_4px_4px_10px_rgba(0,0,0,0.4),0_6px_16px_rgba(0,0,0,0.3)]
                      flex items-center justify-center text-white
                      transition-all duration-300 ease-out
                      hover:scale-[1.1] active:scale-[0.95]
                      backdrop-blur-sm group
                      touch-manipulation
                    "
                    aria-label="Tarjeta anterior"
                  >
                    <ChevronLeft size={28} className="group-hover:translate-x-[-2px] transition-transform duration-300" />
                  </button>

                  {/* Botón Pausa/Play */}
                  <button
                    onClick={handlePauseToggle}
                    className="
                      w-14 h-14 md:w-16 md:h-16 rounded-full
                      bg-gradient-to-br from-gold-600/30 via-gold-500/20 to-gold-600/30
                      border border-white/30
                      shadow-[inset_-3px_-3px_8px_rgba(255,255,255,0.1),inset_3px_3px_8px_rgba(0,0,0,0.3),0_4px_12px_rgba(0,0,0,0.2)]
                      active:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.4),inset_-2px_-2px_6px_rgba(255,255,255,0.05)]
                      hover:shadow-[inset_-4px_-4px_10px_rgba(255,255,255,0.15),inset_4px_4px_10px_rgba(0,0,0,0.4),0_6px_16px_rgba(0,0,0,0.3)]
                      flex items-center justify-center text-white
                      transition-all duration-300 ease-out
                      hover:scale-[1.1] active:scale-[0.95]
                      backdrop-blur-sm group
                      touch-manipulation
                    "
                    aria-label={isPaused ? "Reanudar carrusel" : "Pausar carrusel"}
                  >
                    {isPaused ? (
                      <Play size={28} className="group-hover:scale-110 transition-transform duration-300 ml-1" />
                    ) : (
                      <Pause size={28} className="group-hover:scale-110 transition-transform duration-300" />
                    )}
                  </button>

                  {/* Botón Siguiente */}
                  <button
                    onClick={handleNext}
                    className="
                      w-14 h-14 md:w-16 md:h-16 rounded-full
                      bg-gradient-to-br from-gold-600/30 via-gold-500/20 to-gold-600/30
                      border border-white/30
                      shadow-[inset_-3px_-3px_8px_rgba(255,255,255,0.1),inset_3px_3px_8px_rgba(0,0,0,0.3),0_4px_12px_rgba(0,0,0,0.2)]
                      active:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.4),inset_-2px_-2px_6px_rgba(255,255,255,0.05)]
                      hover:shadow-[inset_-4px_-4px_10px_rgba(255,255,255,0.15),inset_4px_4px_10px_rgba(0,0,0,0.4),0_6px_16px_rgba(0,0,0,0.3)]
                      flex items-center justify-center text-white
                      transition-all duration-300 ease-out
                      hover:scale-[1.1] active:scale-[0.95]
                      backdrop-blur-sm group
                      touch-manipulation
                    "
                    aria-label="Tarjeta siguiente"
                  >
                    <ChevronRight size={28} className="group-hover:translate-x-[2px] transition-transform duration-300" />
                  </button>
                </div>

                {/* Indicador de posición */}
                {/* <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-2">
                  {wishes.map((_, index) => (
                    <div
                      key={index}
                      className={`
                        w-2 h-2 rounded-full transition-all duration-300
                        ${index === currentIndex 
                          ? 'bg-gold-500 w-8 shadow-lg shadow-gold-500/50' 
                          : 'bg-white/30 hover:bg-white/50'
                        }
                      `}
                    />
                  ))}
                </div> */}
              </>
            ) : (
              <div className="w-full flex items-center justify-center">
                <motion.div 
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="max-w-md text-center p-12 bg-navy-800/30 rounded-full border border-dashed border-gold-500/30 backdrop-blur-sm"
                >
                  <div className="w-20 h-20 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Star className="text-gold-500 w-10 h-10 animate-[spin_10s_linear_infinite]" />
                  </div>
                  <h3 className="font-display text-2xl text-white mb-2">¡Sé el primero!</h3>
                  <p className="text-gray-400 mb-6">
                    Aún no hay mensajes en este muro. Tu cariño será el primero en brillar aquí.
                  </p>
                  <button onClick={onClose} className="text-gold-400 underline hover:text-white transition-colors">
                    Escribir un deseo ahora
                  </button>
                </motion.div>
              </div>
            )}
          </div>
          
          {/* Footer instruction */}
          <div className="pb-8 text-center z-10">
             <p className="text-white/60 text-xs uppercase tracking-[0.5em] animate-pulse">
                {wishes.length > 0 ? "Mensajes de Personas Especiales" : ""}
             </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WishesWall;
