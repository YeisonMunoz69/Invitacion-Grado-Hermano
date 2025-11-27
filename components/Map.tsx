import React from 'react';
import SectionWrapper from './SectionWrapper';
import { ExternalLink } from 'lucide-react';

const Map: React.FC = () => {
  // Coords: 2°20'41.6"N 76°41'35.2"W
  // Decimal: 2.344889, -76.693111
  // Google Maps Embed with marker showing exact location
  const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3986.195029497576!2d-76.693111!3d2.344889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMsKwMjAnNDEuNiJOIDc2wrQ0MSczNS4yIlc!5e0!3m2!1sen!2sco!4v1709230000000!5m2!1sen!2sco";
  
  return (
    <SectionWrapper className="bg-navy-900 py-0">
      <style>{`
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(217, 119, 6, 0.7),
                        0 0 20px 5px rgba(217, 119, 6, 0.3);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(217, 119, 6, 0),
                        0 0 30px 10px rgba(217, 119, 6, 0.5);
            transform: scale(1.05);
          }
        }
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .gps-button-animated {
          animation: pulse-glow 2s ease-in-out infinite;
          background: linear-gradient(90deg, 
            rgba(217, 119, 6, 0.1) 0%, 
            rgba(217, 119, 6, 0.3) 50%, 
            rgba(217, 119, 6, 0.1) 100%);
          background-size: 200% 100%;
          animation: pulse-glow 2s ease-in-out infinite,
                     shimmer 3s linear infinite;
        }
        .gps-button-animated:hover {
          animation: none;
          box-shadow: 0 0 25px 8px rgba(217, 119, 6, 0.6);
        }
      `}</style>
      <div className="w-full h-[400px] md:h-[500px] relative">
        <iframe 
          src={mapUrl}
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen={true} 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full"
        ></iframe>
        
        {/* Overlay Card */}
        <div className="absolute bottom-8 left-4 right-4 md:left-12 md:w-80 bg-navy-900/95 p-6 border border-gold-500/30 shadow-2xl backdrop-blur-md rounded-sm">
          <h4 className="font-display text-gold-500 text-lg mb-2">Ubicación Exacta</h4>
          <p className="text-gray-300 font-sans text-sm leading-relaxed mb-4">
            Salón de Eventos<br />
            Popayán, Cauca<br />
            Viernes, 6 de Diciembre<br />
            7:00 PM
          </p>
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=2.344889,-76.693111`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="gps-button-animated inline-flex items-center gap-2 border-2 border-gold-500 text-gold-500 px-6 py-3 text-xs uppercase tracking-widest hover:bg-gold-500 hover:text-navy-900 transition-all duration-300 font-semibold relative overflow-hidden"
          >
            <span className="relative z-10">Ver en Maps</span>
            <ExternalLink size={12} className="relative z-10" />
          </a>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Map;