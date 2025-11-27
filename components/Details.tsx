
import React from 'react';
import { MapPin, Calendar, Clock, Shirt, Gift } from 'lucide-react';
import SectionWrapper from './SectionWrapper';

const DetailCard = ({ icon: Icon, title, desc, subDesc, className = "" }: any) => (
  <div className={`bg-navy-800 border border-gold-500/20 p-8 rounded-2xl text-center hover:border-gold-500/50 transition-all duration-300 group ${className}`}>
    <div className="w-12 h-12 mx-auto bg-navy-900 rounded-full flex items-center justify-center mb-4 group-hover:bg-gold-600 transition-colors shadow-lg shadow-black/20">
      <Icon className="text-gold-400 group-hover:text-white" size={24} />
    </div>
    <h3 className="font-display text-xl text-white mb-2">{title}</h3>
    <p className="font-sans text-gray-300">{desc}</p>
    {subDesc && <p className="font-sans text-gold-500/80 text-sm mt-2 italic">{subDesc}</p>}
  </div>
);

const Details: React.FC = () => {
  const mapUrl = "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3986.195029497576!2d-76.693111!3d2.344889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMsKwMjAnNDEuNiJOIDc2wrQ0MSczNS4yIlc!5e0!3m2!1sen!2sco!4v1709230000000!5m2!1sen!2sco";

  return (
    <SectionWrapper id="details" className="bg-navy-900 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-gold-400 tracking-widest uppercase text-sm mb-2">Detalles del Evento</h2>
          <h3 className="font-script text-5xl text-white">Cuándo & Dónde...</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Main Info Cards */}
          <DetailCard 
            icon={Calendar} 
            title="La Fecha" 
            desc="Sabado, 6 de Diciembre" 
            subDesc="2025" 
          />
          <DetailCard 
            icon={Clock} 
            title="La Hora" 
            desc="Recepción: 6:00 PM" 
            subDesc="Sientete libre de llegar Puntual o Tarde" 
          />
          <DetailCard 
            icon={Shirt} 
            title="Código de Vestimenta" 
            desc="Normal, Casual y Elegante" 
            subDesc='"Viste normal o elegante"' 
          />
          <DetailCard 
            icon={Gift} 
            title="Lluvia de Sobres" 
            desc="Tu presencia es nuestro mejor regalo" 
            subDesc="Sientete libre de regalar lo que quieras" 
          />

          {/* Location & Map - Spans full width */}
          <div className="col-span-1 md:col-span-2 lg:col-span-4 mt-4 bg-navy-800 border border-gold-500/20 rounded-2xl overflow-hidden shadow-2xl group hover:border-gold-500/40 transition-all">
             <div className="flex flex-col md:flex-row h-full">
                <div className="p-8 md:p-12 md:w-1/3 flex flex-col justify-center items-center text-center bg-navy-900/50">
                   <div className="w-16 h-16 bg-navy-800 rounded-full flex items-center justify-center mb-6 border border-gold-500/30">
                      <MapPin className="text-gold-500 w-8 h-8 animate-bounce" />
                   </div>
                   <h3 className="font-display text-2xl text-white mb-2">Casa de Familia Muñoz</h3>
                   <p className="font-sans text-gray-300 mb-4">Vereda Las Huacas<br/>Timbio, Cauca</p>
                   <a 
                      href="https://www.google.com/maps/search/?api=1&query=2.344889,-76.693111"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2 border border-gold-500 text-gold-500 text-xs uppercase tracking-widest hover:bg-gold-500 hover:text-navy-900 transition-colors rounded-sm"
                   >
                      Abrir en GPS
                   </a>
                </div>
                <div className="h-64 md:h-auto md:w-2/3 relative grayscale group-hover:grayscale-0 transition-all duration-1000">
                  <iframe 
                    src={mapUrl}
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={true} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 w-full h-full"
                  ></iframe>
                </div>
             </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Details;
