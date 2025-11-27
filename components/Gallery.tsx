
import React, { useState, useEffect } from 'react';
import SectionWrapper from './SectionWrapper';
import { motion, AnimatePresence } from 'framer-motion';

const PHOTO_DELAY = 6000; // 6 seconds per slide

// URLs de imágenes desde Supabase Storage
// Estrategia de cache:
// - Headers configurados en Supabase: Cache-Control: public, max-age=31536000, immutable
// - Service Worker cachea las imágenes localmente usando Cache API
// - Las imágenes se sirven desde cache en recargas posteriores
const cristianPhotos = [
  "https://eceokylztrtzfdjsyikh.supabase.co/storage/v1/object/public/fotos/1.webp",
  "https://eceokylztrtzfdjsyikh.supabase.co/storage/v1/object/public/fotos/2.webp",
  "https://eceokylztrtzfdjsyikh.supabase.co/storage/v1/object/public/fotos/3.webp",
  "https://eceokylztrtzfdjsyikh.supabase.co/storage/v1/object/public/fotos/4.webp",
  "https://eceokylztrtzfdjsyikh.supabase.co/storage/v1/object/public/fotos/5.webp"
];

const salomePhotos = [
  "https://eceokylztrtzfdjsyikh.supabase.co/storage/v1/object/public/fotos/6.webp",
  "https://eceokylztrtzfdjsyikh.supabase.co/storage/v1/object/public/fotos/7.webp",
  "https://eceokylztrtzfdjsyikh.supabase.co/storage/v1/object/public/fotos/8.webp",
  "https://eceokylztrtzfdjsyikh.supabase.co/storage/v1/object/public/fotos/9.webp",
  "https://eceokylztrtzfdjsyikh.supabase.co/storage/v1/object/public/fotos/10.webp"
];

const SlideshowCard = ({ photos, name, quote, delay = 0 }: { photos: string[], name: string, quote: string, delay?: number }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Offset the start time if needed
    const timeout = setTimeout(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % photos.length);
        }, PHOTO_DELAY);
        return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [photos.length, delay]);

  return (
    <div className="relative group">
      <div className="absolute -inset-2 bg-gradient-to-r from-gold-600 to-amber-800 rounded-xl opacity-30 group-hover:opacity-60 blur transition duration-500"></div>
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl border-2 border-navy-800 bg-navy-900">
        
        <AnimatePresence mode='wait'>
          <motion.img
            key={index}
            src={photos[index]}
            alt={name}
            loading="lazy"
            decoding="async"
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1.1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }} // Fade in/out duration
            // The scaling happens over the full duration of the slide to create Ken Burns effect
            // Optimizaciones de carga:
            // - loading="lazy": carga diferida de imágenes fuera del viewport
            // - decoding="async": decodificación asíncrona para no bloquear el render
            // - Service Worker cachea automáticamente las imágenes descargadas
            style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover' 
            }}
          />
        </AnimatePresence>

        {/* Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 text-center z-10">
          <h3 className="font-display text-2xl text-white mb-1 drop-shadow-md">{name}</h3>
          <p className="font-serif text-gold-400 italic text-sm md:text-base drop-shadow-md">{quote}</p>
        </div>
      </div>
    </div>
  );
};

const Gallery: React.FC = () => {
  return (
    <SectionWrapper className="bg-navy-900 py-24">
      <div className="max-w-6xl mx-auto px-4">
         <div className="text-center mb-16">
          <span className="h-[1px] w-20 bg-gold-500 inline-block align-middle mr-4"></span>
          <h2 className="inline-block font-display text-2xl md:text-3xl text-white">Nuestros Momentos</h2>
          <span className="h-[1px] w-20 bg-gold-500 inline-block align-middle ml-4"></span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-24 items-center max-w-4xl mx-auto">
          {/* Cristian Slideshow */}
          <SlideshowCard 
            photos={cristianPhotos} 
            name="Cristian Muñoz" 
            quote='"El futuro pertenece a quienes creen en la belleza de sus sueños."'
            delay={0}
          />

          {/* Salome Slideshow*/}
          <SlideshowCard 
            photos={salomePhotos} 
            name="Salome Quelal" 
            quote='"Cada final es un nuevo comienzo. Lista para brillar."'
            delay={0}
          />
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Gallery;
