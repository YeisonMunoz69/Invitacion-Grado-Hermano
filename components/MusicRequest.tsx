
import React, { useState, useEffect } from 'react';
import { Music, Plus, Disc, Loader2, Radio } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import SectionWrapper from './SectionWrapper';
import { supabase } from '../services/supabaseClient';
import { SongRequest } from '../types';

const AudioVisualizer = () => (
  <div className="flex gap-[2px] items-end h-3 mb-1">
    <motion.div 
      animate={{ height: [4, 12, 6, 12, 4] }} 
      transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }} 
      className="w-[2px] bg-gold-500 rounded-t-sm" 
    />
    <motion.div 
      animate={{ height: [8, 4, 12, 6, 8] }} 
      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} 
      className="w-[2px] bg-gold-400 rounded-t-sm" 
    />
    <motion.div 
      animate={{ height: [4, 10, 4, 12, 6] }} 
      transition={{ repeat: Infinity, duration: 1.1, ease: "linear" }} 
      className="w-[2px] bg-gold-600 rounded-t-sm" 
    />
    <motion.div 
      animate={{ height: [6, 12, 8, 4, 10] }} 
      transition={{ repeat: Infinity, duration: 1.3, ease: "linear" }} 
      className="w-[2px] bg-gold-500 rounded-t-sm" 
    />
  </div>
);

const MusicRequest: React.FC = () => {
  const [song, setSong] = useState('');
  const [requests, setRequests] = useState<SongRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSongs();
    
    const subscription = supabase
      .channel('public:playlist')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'playlist' }, payload => {
        setRequests(prev => [payload.new as SongRequest, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchSongs = async () => {
    try {
      const { data, error } = await supabase
        .from('playlist')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      if (data) setRequests(data);
    } catch (error) {
      console.error('Error fetching songs:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkSpam = () => {
    const lastSongTime = localStorage.getItem('lastSongTime');
    if (lastSongTime) {
      const timeDiff = Date.now() - parseInt(lastSongTime);
      if (timeDiff < 30000) return false;
    }
    return true;
  };

  const addSong = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!song.trim()) return;
    if (!checkSpam()) {
      setError('Espera unos segundos antes de pedir otra canción.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('playlist').insert([{ song: song.trim() }]);
      if (error) throw error;
      
      localStorage.setItem('lastSongTime', Date.now().toString());
      setSong('');
    } catch (error) {
      console.error('Error adding song:', error);
      setError('Error al agregar canción.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SectionWrapper className="bg-navy-900 border-t border-navy-800 py-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold-600/5 rounded-full blur-3xl"></div>

      <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
        <div className="inline-block relative mb-6">
          <div className="absolute inset-0 bg-gold-500/20 rounded-full blur-xl animate-pulse"></div>
          <Music className="w-12 h-12 text-gold-500 relative z-10" />
        </div>
        
        <h3 className="font-display text-3xl text-white mb-2">La Playlist de la Noche</h3>
        <p className="text-gray-400 font-sans mb-10 max-w-lg mx-auto">
          Queremos que bailes hasta que te duelan los pies. ¡Añade esa canción que no puede faltar!
        </p>

        <form onSubmit={addSong} className="flex flex-col md:flex-row gap-2 mb-4 max-w-lg mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-gold-600/20 to-navy-600/20 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
          <div className="relative flex-1">
            <Disc className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 ${submitting ? 'animate-spin' : ''}`} />
            <input 
              type="text" 
              value={song}
              maxLength={100}
              onChange={(e) => setSong(e.target.value)}
              placeholder="Nombre de la canción + Artista"
              className="w-full bg-navy-800 border border-navy-600 text-white px-4 py-4 rounded-lg md:rounded-r-none pl-12 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all placeholder-gray-500 shadow-xl"
            />
          </div>
          <button 
            type="submit"
            disabled={submitting || !song.trim()}
            className="relative bg-gold-600 text-navy-900 font-bold px-8 py-4 rounded-lg md:rounded-l-none hover:bg-gold-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 min-w-[140px] shadow-lg shadow-gold-500/10"
          >
            {submitting ? <Loader2 className="animate-spin" size={20}/> : (
              <>
                <span>AGREGAR</span>
                <Plus size={18} strokeWidth={3} />
              </>
            )}
          </button>
        </form>
        
        {error && <p className="text-red-400 text-sm mb-8 animate-pulse">{error}</p>}

        <div className="mt-12">
          <div className="flex items-center justify-center gap-2 mb-6 text-gold-500/80 text-xs font-bold uppercase tracking-widest">
            <Radio size={14} className="animate-pulse" />
            <span>DJ YJMG - Solicitado en Tiempo Real</span>
          </div>

          <div className="bg-navy-900/50 rounded-3xl p-8 border border-white/5 min-h-[150px] shadow-inner shadow-black/40">
            {loading ? (
               <div className="flex justify-center py-8">
                  <Loader2 className="text-gold-500 animate-spin w-8 h-8" />
               </div>
            ) : requests.length > 0 ? (
              <motion.div layout className="flex flex-wrap justify-center gap-4">
                <AnimatePresence>
                  {requests.map((req, index) => (
                    <motion.div 
                      key={req.id || index} 
                      layout
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="group relative bg-navy-800/90 backdrop-blur-md text-gray-200 text-sm pl-4 pr-6 py-3 rounded-xl border border-navy-600 hover:border-gold-500/50 hover:bg-navy-700 flex items-center gap-3 shadow-lg cursor-default"
                    >
                      <div className="bg-navy-900 p-2 rounded-lg group-hover:bg-black/50 transition-colors">
                        <AudioVisualizer />
                      </div>
                      <div className="text-left">
                         <span className="block font-medium truncate max-w-[180px] text-white">{req.song}</span>
                         <span className="text-[10px] text-gold-500/70 uppercase tracking-wider">En cola</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-gray-500 text-sm italic">La pista de baile está silenciosa...</p>
                <p className="text-gold-500/60 text-sm mt-1">¡Sé el primero en poner el ambiente!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default MusicRequest;
