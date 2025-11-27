import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black py-12 text-center border-t border-navy-800">
      <h2 className="font-script text-3xl text-gold-500 mb-4">Cristian & Salome</h2>
      <p className="text-gray-600 text-xs font-sans tracking-widest uppercase">
        Gracias por ser parte de nuestra Celebración
      </p>
      <div className="mt-8 text-navy-800 text-[10px]">
        Desarrollado por Yeison Muñoz
      </div>
    </footer>
  );
};

export default Footer;
