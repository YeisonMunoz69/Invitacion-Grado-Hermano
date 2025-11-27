
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Quote, Calendar, Star } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { Wish } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const WishesWall: React.FC<Props> = ({ isOpen, onClose }) => {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let subscription: any;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      fetchWishes();

      subscription = supabase
        .channel('public:wishes')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'wishes' }, payload => {
          setWishes(prev => [payload.new as Wish, ...prev]);
        })
        .subscribe();
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => { 
      document.body.style.overflow = 'unset'; 
      if (subscription) supabase.removeChannel(subscription);
    }
  }, [isOpen]);

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

  // Duplicar items para el efecto infinito si hay pocos, o para asegurar el loop
  const marqueeItems = wishes.length > 0 ? [...wishes, ...wishes, ...wishes] : [];

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
              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center text-white transition-all shadow-lg backdrop-blur-sm group"
            >
              <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          {/* Marquee Container */}
          <div className="flex-1 flex items-center w-full overflow-hidden relative">
            {/* Gradient Masks for smooth edges */}
            <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-r from-navy-900/95 to-transparent z-20 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-l from-navy-900/95 to-transparent z-20 pointer-events-none"></div>

            {loading ? (
               <div className="w-full text-center">
                  <div className="inline-block animate-spin text-gold-500 mb-4"><Star size={32} /></div>
                  <p className="text-gold-500 tracking-widest text-sm uppercase">Recopilando deseos...</p>
               </div>
            ) : wishes.length > 0 ? (
              <motion.div 
                className="flex gap-8 px-8"
                // El ancho negativo depende de la cantidad de items. Estimación segura o cálculo dinámico.
                // Usamos un porcentaje alto negativo para asegurar que recorra todo el duplicado
                animate={{ x: ["0%", "-50%"] }} 
                transition={{ 
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: Math.max(40, wishes.length * 5), // Duración dinámica basada en cantidad
                    ease: "linear",
                  }
                }}
                // Pausar animación al hacer hover para leer
                whileHover={{ animationPlayState: "paused" }}
                style={{ width: "max-content" }}
              >
                {marqueeItems.map((wish, i) => (
                  <div 
                    key={`${wish.id}-${i}`}
                    className="
                      flex-none w-[85vw] md:w-[450px] h-[55vh] md:h-[50vh]
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
             <p className="text-white/20 text-xs uppercase tracking-[0.3em] animate-pulse">
                {wishes.length > 0 ? "Pausa al tocar" : ""}
             </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WishesWall;
