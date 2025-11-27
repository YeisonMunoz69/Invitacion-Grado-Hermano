
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const ScrollIndicator: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Calcular si el usuario ha llegado al fondo de la página
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      // Margen de 100px antes del final para ocultarlo
      if (scrollTop + windowHeight >= fullHeight - 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-6 left-0 right-0 z-40 flex justify-center pointer-events-none"
        >
          <div className="flex flex-col items-center gap-1 bg-navy-900/40 backdrop-blur-sm px-4 py-2 rounded-full border border-gold-500/20 shadow-lg">
            <span className="text-[10px] uppercase tracking-[0.2em] text-gold-400 font-sans font-medium">
              Baja, Hay más...
            </span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="text-white w-5 h-5" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollIndicator;
