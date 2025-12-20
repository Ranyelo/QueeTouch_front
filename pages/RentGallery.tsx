import React from 'react';
import { MessageCircle, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RentSpaces = () => {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center">
      <h1 className="text-3xl md:text-4xl font-bold uppercase mb-8 text-center">Alquiler de Espacios</h1>
      <p className="max-w-2xl text-center text-gray-600 mb-12 text-base md:text-lg">
        Contamos con estaciones de trabajo completamente equipadas para profesionales independientes. Alquila por horas o por días.
      </p>
      
      <div className="w-full max-w-4xl aspect-video bg-black mb-12 relative rounded-xl overflow-hidden shadow-2xl">
         <img src="https://images.unsplash.com/photo-1600056166415-38e55e5b321c?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover opacity-80" />
         <div className="absolute inset-0 flex items-center justify-center">
           <span className="text-white border border-white px-4 py-2 uppercase tracking-widest bg-black/30 backdrop-blur-sm text-sm md:text-base">Video Tour del Salón</span>
         </div>
      </div>

      <a href="#" className="flex items-center gap-3 bg-green-500 text-white px-8 md:px-10 py-4 md:py-5 rounded-full text-lg md:text-xl font-bold hover:bg-green-600 transition shadow-lg animate-pulse">
        <MessageCircle size={28} />
        Reservar por WhatsApp
      </a>
    </div>
  );
};

export const Gallery = () => {
  return (
    <div className="container mx-auto px-4 py-12 space-y-16">
      
      {/* Section 1: Brand Moments */}
      <section>
        <h2 className="text-2xl md:text-3xl font-bold uppercase mb-6 border-l-4 border-black pl-4">Momentos de Marca</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            'photo-1596462502278-27bfdd403cc2',
            'photo-1519014816548-bf5fe059e98b',
            'photo-1604654894610-df63bc536371',
            'photo-1522337660859-02fbefca4702'
          ].map((id, i) => (
             <div key={i} className="aspect-square bg-gray-200 overflow-hidden hover:opacity-90 transition">
               <img src={`https://images.unsplash.com/${id}?q=80&w=500&auto=format&fit=crop`} className="w-full h-full object-cover" />
             </div>
          ))}
        </div>
      </section>

      {/* Section 2: Tutorials */}
      <section>
        <h2 className="text-2xl md:text-3xl font-bold uppercase mb-6 border-l-4 border-black pl-4">Tutoriales</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            'photo-1632516643720-e7f5d7d6ecc9',
            'photo-1599693918340-02543d3b7338',
            'photo-1516975080664-ed2fc6a32937'
          ].map((id, i) => (
             <div key={i} className="aspect-square bg-black relative group overflow-hidden cursor-pointer">
               <img src={`https://images.unsplash.com/${id}?q=80&w=500&auto=format&fit=crop`} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition" />
               <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <Instagram size={32} className="mb-2" />
                  <span className="text-sm font-bold uppercase">Ver en IG</span>
               </div>
             </div>
          ))}
        </div>
      </section>

      {/* Section 3: Products */}
      <section>
        <div className="flex justify-between items-end mb-6 border-l-4 border-black pl-4">
           <h2 className="text-2xl md:text-3xl font-bold uppercase">Productos</h2>
           <Link to="/shop" className="text-sm font-bold border-b border-black uppercase hover:text-gray-600">Ver todo</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            'photo-1616683693504-3ea7e9ad6fec',
            'photo-1544161515-4ab6ce6db874',
            'photo-1513373319109-eb154073eb0b',
            'photo-1604654894610-df63bc536371',
            'photo-1632516643720-e7f5d7d6ecc9'
          ].map((id, i) => (
             <div key={i} className="aspect-square bg-gray-100 overflow-hidden">
               <img src={`https://images.unsplash.com/${id}?q=80&w=500&auto=format&fit=crop`} className="w-full h-full object-cover" />
             </div>
          ))}
        </div>
      </section>

    </div>
  );
};