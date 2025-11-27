
import React, { useState } from 'react';
import Hero from './components/Hero';
import Countdown from './components/Countdown';
import Details from './components/Details';
import Gallery from './components/Gallery';
import RSVP from './components/RSVP';
import MusicRequest from './components/MusicRequest';
import Footer from './components/Footer';
import WishesWall from './components/WishesWall';
import ScrollIndicator from './components/ScrollIndicator';

const App: React.FC = () => {
  const [isWallOpen, setIsWallOpen] = useState(false);

  return (
    <main className="w-full min-h-screen bg-navy-900 text-slate-100 selection:bg-gold-500 selection:text-white">
      <Hero />
      <Countdown />
      <div className="bg-gradient-to-b from-navy-900 via-navy-800 to-navy-900">
        <Details />
        <Gallery />
      </div>
      {/* Map is now inside Details */}
      
      {/* RSVP Component now acts as the 'Leave a Wish' section */}
      <RSVP onOpenWall={() => setIsWallOpen(true)} />
      <MusicRequest />
      <Footer />
      
      {/* Persistent Scroll Indicator */}
      <ScrollIndicator />

      {/* Full screen overlay for reading wishes */}
      <WishesWall isOpen={isWallOpen} onClose={() => setIsWallOpen(false)} />
    </main>
  );
};

export default App;
