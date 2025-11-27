
import React, { useState } from 'react';
import { Send, BookOpen, Heart, Sparkles } from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import { supabase } from '../services/supabaseClient';

interface Props {
  onOpenWall: () => void;
}

const RSVP: React.FC<Props> = ({ onOpenWall }) => {
  const [formData, setFormData] = useState({
    name: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const checkSpam = () => {
    const lastWishTime = localStorage.getItem('lastWishTime');
    if (lastWishTime) {
      const timeDiff = Date.now() - parseInt(lastWishTime);
      // 1 minuto de espera entre mensajes
      if (timeDiff < 60000) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.message.trim()) {
      setError('Por favor completa todos los campos.');
      return;
    }

    if (!checkSpam()) {
      setError('Por favor espera un momento antes de enviar otro mensaje.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: supabaseError } = await supabase
        .from('wishes')
        .insert([{ 
          name: formData.name.trim(), 
          message: formData.message.trim() 
        }]);

      if (supabaseError) throw supabaseError;

      // Guardar timestamp para evitar spam
      localStorage.setItem('lastWishTime', Date.now().toString());

      setIsSubmitted(true);
      setFormData({ name: '', message: '' });
    } catch (err) {
      console.error(err);
      setError('Hubo un error al guardar tu mensaje. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SectionWrapper id="wishes" className="bg-navy-800 relative py-24 overflow-visible">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gold-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-navy-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-navy-900 border border-gold-500/30 rounded-full mb-6 shadow-lg shadow-gold-500/10">
            <Heart className="w-8 h-8 text-gold-500" fill="currentColor" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-white mb-6">Libro de Buenos Deseos</h2>
          <p className="font-serif text-gold-400 italic text-xl max-w-2xl mx-auto">
            "Las palabras amables son el regalo que perdura para siempre en el corazón."
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* Action Side */}
          <div className="order-2 lg:order-1 text-center lg:text-left space-y-8">
            <div className="bg-navy-900/50 p-8 rounded-3xl border border-gold-500/10 backdrop-blur-sm">
              <Sparkles className="text-gold-400 w-8 h-8 mb-4 mx-auto lg:mx-0" />
              <h3 className="font-display text-2xl text-white mb-4">
                Comparte tu Alegría
              </h3>
              <p className="text-gray-400 font-sans mb-8 leading-relaxed">
                Hemos creado este espacio digital para recopilar todo el cariño de nuestros seres queridos. 
                Cada mensaje es un tesoro que guardaremos con mucho amor en esta nueva etapa.
              </p>
              
              {/* Botón Neumorfismo Animado */}
              <button 
                onClick={onOpenWall}
                className="
                  group relative w-full lg:w-auto inline-flex items-center justify-center gap-4
                  px-10 py-5 rounded-full
                  bg-navy-800 text-gold-400
                  font-display text-lg tracking-widest uppercase font-bold
                  border border-gold-500/10
                  shadow-[-8px_-8px_20px_rgba(255,255,255,0.05),8px_8px_20px_rgba(0,0,0,0.5)]
                  active:shadow-[inset_4px_4px_10px_rgba(0,0,0,0.5),inset_-4px_-4px_10px_rgba(255,255,255,0.02)]
                  hover:text-gold-300 transition-all duration-300 ease-out
                  hover:scale-[1.02] active:scale-[0.98]
                "
              >
                <span className="relative z-10">Leer los Deseos</span>
                <BookOpen className="group-hover:rotate-12 transition-transform duration-300 relative z-10" size={22} />
                
                {/* Brillo sutil al hover */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-gold-500/0 via-gold-500/5 to-gold-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </button>
            </div>
          </div>

          {/* Form Side */}
          <div className="order-1 lg:order-2 bg-navy-900 p-8 md:p-10 rounded-3xl border border-gold-500/20 shadow-2xl relative">
            {/* Decorative corner */}
            <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-gold-500/30 rounded-tr-3xl"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-gold-500/30 rounded-bl-3xl"></div>

            {isSubmitted ? (
              <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                   <Heart className="text-green-500 w-10 h-10 animate-bounce" fill="currentColor" />
                </div>
                <h3 className="font-display text-2xl text-white mb-3">¡Mensaje Recibido!</h3>
                <p className="text-gray-400 font-sans mb-8 px-4">
                  Gracias por tus hermosas palabras. Significan el mundo para nosotros.
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="text-gold-500 underline text-sm hover:text-gold-300 font-sans tracking-wide"
                >
                  Escribir otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative z-10">
                <div className="mb-6">
                  <label className="block text-gold-500 text-xs uppercase tracking-widest mb-2 font-bold ml-1">
                    Tu Nombre <span className="text-red-400">*</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    maxLength={50}
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-navy-800 border border-navy-600 text-white p-4 rounded-xl focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all placeholder-gray-600"
                    placeholder="Ejemplo: Tío Olivo"
                  />
                </div>

                <div className="mb-8">
                  <label className="block text-gold-500 text-xs uppercase tracking-widest mb-2 font-bold ml-1">
                    Tus Buenos Deseos <span className="text-red-400">*</span>
                  </label>
                  <textarea 
                    rows={5}
                    required
                    maxLength={500}
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-navy-800 border border-navy-600 text-white p-4 rounded-xl focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all placeholder-gray-600 resize-none"
                    placeholder="Escribe aquí tus mejores deseos para Cristian y Salome..."
                  ></textarea>
                  <p className="text-right text-xs text-gray-600 mt-2">Máx 500 caracteres</p>
                </div>

                {error && (
                  <div className="bg-red-900/20 border border-red-500/20 text-red-200 p-3 rounded mb-6 text-sm text-center">
                    {error}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-gold-600 to-gold-500 text-navy-900 font-bold py-4 rounded-xl uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-gold-500/20 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
                >
                  <span>{isSubmitting ? 'Enviando...' : 'Enviar Mis Deseos'}</span>
                  {!isSubmitting && <Send size={18} />}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </SectionWrapper>
  );
};

export default RSVP;
