import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const MenuTile = ({ to, title, image }: { to: string, title: string, image: string }) => (
  <Link to={to} className="group relative block aspect-square overflow-hidden bg-gray-100 reveal">
    <img 
      src={image} 
      alt={title} 
      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
    />
    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-colors duration-500 flex items-center justify-center">
      <h3 className="text-white text-lg md:text-2xl font-bold uppercase tracking-[0.25em] border border-white/0 group-hover:border-white p-4 md:p-6 transition-all transform group-hover:-translate-y-2 text-center">
        {title}
      </h3>
    </div>
  </Link>
);

export const Home = () => {
  return (
    <div className="flex flex-col">
      {/* Immersive Video Hero Section - 100vh */}
      <div className="relative w-full h-[calc(100vh-140px)] md:h-screen bg-black overflow-hidden flex items-center justify-center">
        
        {/* VIDEO BACKGROUND */}
        {/* Added 'poster' attribute to prevent black screen while loading */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          poster="https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=1920&auto=format&fit=crop"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        >
          {/* Using a reliable CDN for nail art video */}
          <source 
            src="https://cdn.pixabay.com/video/2020/05/25/40149-423985834_large.mp4" 
            type="video/mp4" 
          />
        </video>

        <div className="z-10 text-center p-8 border-t border-b border-white/30 backdrop-blur-[2px] reveal active">
          <h1 className="text-4xl md:text-8xl text-white font-bold tracking-[0.5em] uppercase mb-4 drop-shadow-2xl">
            Queen Touch
          </h1>
          <p className="text-white/90 text-[10px] md:text-sm tracking-[0.4em] uppercase font-light">Elegancia • Pasión • Arte</p>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-12 animate-bounce text-white/70">
           <ChevronDown size={40} strokeWidth={1} />
        </div>
      </div>

      {/* Launches Strip */}
      <div className="w-full bg-white text-black py-6 overflow-hidden border-b border-gray-100 reveal">
        <div className="container mx-auto px-4">
          <div className="text-center uppercase tracking-[0.2em] text-[10px] md:text-xs flex flex-col md:flex-row justify-center gap-4 md:gap-12 font-medium">
            <span>Nuevos Lanzamientos</span>
            <span className="hidden md:inline text-gray-400">|</span>
            <span>Colección 2026</span>
            <span className="hidden md:inline text-gray-400">|</span>
            <span>Envíos Gratis +$100.000</span>
          </div>
        </div>
      </div>

      {/* Navigation Grid */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <h2 className="text-center text-xl md:text-2xl font-bold uppercase tracking-[0.3em] mb-12 md:mb-16 reveal">Explora Nuestro Mundo</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
          {/* Updated images to relevant Nail/Spa theme URLs */}
          <MenuTile to="/shop" title="Shop" image="https://images.unsplash.com/photo-1632516643720-e7f5d7d6ecc9?q=80&w=800&auto=format&fit=crop" />
          <MenuTile to="/club" title="Club" image="https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=800&auto=format&fit=crop" />
          <MenuTile to="/academy/online" title="Academia Online" image="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=800&auto=format&fit=crop" />
          <MenuTile to="/academy/presencial" title="Academia Presencial" image="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop" />
          <MenuTile to="/distributors" title="Distribuidores" image="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800&auto=format&fit=crop" />
          <MenuTile to="/about" title="Conócenos" image="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop" />
          <MenuTile to="/rent" title="Alquiler Espacios" image="https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800&auto=format&fit=crop" />
          <MenuTile to="/gallery" title="Galería" image="https://images.unsplash.com/photo-1607779097040-26e80aa78e66?q=80&w=800&auto=format&fit=crop" />
        </div>
      </div>
    </div>
  );
};