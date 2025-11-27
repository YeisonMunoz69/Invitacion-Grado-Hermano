import React, { useState, useEffect } from 'react';
import { TimeLeft } from '../types';
import SectionWrapper from './SectionWrapper';

const Countdown: React.FC = () => {
  const calculateTimeLeft = (): TimeLeft => {
    // Lógica para detectar el próximo 6 de Diciembre automáticamente
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // Intentamos configurar la fecha para el 6 de Dic del año actual a las 7:00 PM
    // ISO format: YYYY-MM-DDTHH:mm:ss
    // Usamos UTC-5 (Colombia)
    let eventDate = new Date(`${currentYear}-12-06T18:00:00-05:00`);

    // Si la fecha ya pasó (difference < 0), apuntamos al siguiente año
    if (+eventDate - +now <= 0) {
        eventDate = new Date(`${currentYear + 1}-12-06T19:00:00-05:00`);
    }

    const difference = +eventDate - +now;
    let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const tl = calculateTimeLeft();
      setTimeLeft(tl);
      if (tl.days === 0 && tl.hours === 0 && tl.minutes === 0 && tl.seconds === 0) {
        setHasStarted(true);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center mx-3 md:mx-8">
      <div className="relative group">
        <div className="absolute inset-0 bg-gold-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
        <div className="w-16 h-16 md:w-28 md:h-28 flex items-center justify-center border border-gold-500/40 rounded-full bg-navy-900/80 backdrop-blur-md shadow-2xl relative z-10">
          <span className="font-display text-2xl md:text-5xl text-white tabular-nums">
            {value.toString().padStart(2, '0')}
          </span>
        </div>
      </div>
      <span className="text-gold-500 font-sans text-[10px] md:text-sm tracking-[0.2em] uppercase mt-4 font-medium">{label}</span>
    </div>
  );

  return (
    <SectionWrapper className="bg-navy-900 py-16 md:py-24 relative overflow-hidden">
       {/* Fondo decorativo sutil */}
       {/* <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-gold-600 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-navy-600 rounded-full blur-[100px]"></div>
       </div> */}

       {/* Separador ornamental superior */}
       <div className="w-full flex justify-center mb-12 opacity-60">
          <svg width="240" height="24" viewBox="0 0 200 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 20C130 20 150 0 200 10V10.5C150 0.5 130 20.5 100 20.5C70 20.5 50 0.5 0 10.5V10C50 0 70 20 100 20Z" fill="#d97706"/>
          </svg>
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <h2 className="font-serif text-3xl md:text-5xl text-white mb-4 italic">
          {hasStarted ? "¡El Gran Momento ha Llegado!" : "La Cuenta Regresiva"}
        </h2>
        <p className="text-gray-400 font-sans text-sm tracking-widest uppercase mb-12">
          {hasStarted ? "Disfruta de la celebración" : "6 de Diciembre • 6:00 PM"}
        </p>

        <div className="flex justify-center flex-wrap gap-y-8">
          <TimeUnit value={timeLeft.days} label="Días" />
          <TimeUnit value={timeLeft.hours} label="Horas" />
          <TimeUnit value={timeLeft.minutes} label="Min" />
          <TimeUnit value={timeLeft.seconds} label="Seg" />
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Countdown;