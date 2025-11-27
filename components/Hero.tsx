
import React from 'react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://eceokylztrtzfdjsyikh.supabase.co/storage/v1/object/public/fotos/SAP.webp" 
          alt="Background" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900/80 via-navy-900/50 to-navy-900"></div>
      </div>

      {/* Decorative Border */}
      <div className="absolute top-4 left-4 right-4 bottom-4 border border-gold-500/30 z-10 hidden md:block pointer-events-none"></div>
      <div className="absolute top-6 left-6 right-6 bottom-6 border border-gold-500/10 z-10 hidden md:block pointer-events-none"></div>

      <div className="relative z-20 px-4">
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-gold-400 font-display tracking-[0.3em] uppercase text-sm md:text-lg mb-4"
        >
          Invitación de Grado
        </motion.p>

        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="font-script text-6xl md:text-9xl text-white mb-2"
        >
          Cristian
          <span className="text-gold-500 mx-4 md:mx-6">&</span>
          Salome
        </motion.h1>

        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "100px" }}
          transition={{ delay: 1, duration: 1 }}
          className="h-[1px] bg-gold-500 mx-auto my-6"
        ></motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="font-serif text-xl md:text-3xl text-gray-300 tracking-wide"
        >
          Promoción #50 Colegio San Antonio de Padua, 2025
        </motion.p>
      </div>
    </div>
  );
};

export default Hero;
