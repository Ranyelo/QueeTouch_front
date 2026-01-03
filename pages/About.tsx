import React from 'react';

export const About = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Strip */}
      <div className="w-full h-64 md:h-96 overflow-hidden relative">
        <img src="https://images.unsplash.com/photo-1600056166415-38e55e5b321c?q=80&w=1920&auto=format&fit=crop" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <h1 className="text-3xl md:text-5xl text-white font-bold uppercase tracking-widest text-center px-4">Conócenos</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl py-12 md:py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold uppercase mb-6">¿Quiénes Somos?</h2>
        <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-12">
          Queen Touch nace de la pasión por la belleza y la perfección. Somos una marca dedicada a empoderar a artistas de las uñas con productos de la más alta calidad y tecnología de punta. Nuestra misión es transformar cada manicura en una obra de arte.
        </p>

        <div className="h-px w-24 bg-black mx-auto mb-12"></div>

        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 text-left mb-16">
          <div className="w-full md:w-1/2 aspect-square relative">
             <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover shadow-xl grayscale" />
          </div>
          <div className="w-full md:w-1/2">
             <span className="text-gray-400 uppercase text-sm tracking-widest">Nuestra Fundadora</span>
             <h2 className="text-2xl md:text-3xl font-bold uppercase mb-4">Maria Gonzalez</h2>
             <p className="text-gray-600">
               Con más de 15 años de experiencia en la industria cosmética, Maria fundó Queen Touch con una visión clara: calidad sin compromisos. Su dedicación a la innovación ha posicionado a la marca como líder en el sector.
             </p>
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold uppercase mb-8">Testimonios</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Laura V.", img: "photo-1580489944761-15a19d654956", text: "Los mejores productos que he usado en mi salón. Mis clientas aman la duración." },
            { name: "Sofia M.", img: "photo-1494790108377-be9c29b29330", text: "La academia online cambió mi carrera. Aprendí técnicas que triplicaron mis ingresos." },
            { name: "Ana P.", img: "photo-1438761681033-6461ffad8d80", text: "Ser embajadora de Queen Touch es un orgullo. La calidad es insuperable." }
          ].map((t, i) => (
            <div key={i} className="aspect-square bg-zinc-100 p-8 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full bg-gray-300 mb-4 overflow-hidden border-2 border-white shadow">
                <img src={`https://images.unsplash.com/${t.img}?q=80&w=200&auto=format&fit=crop`} className="w-full h-full object-cover" />
              </div>
              <p className="italic text-gray-600 mb-4 text-sm">"{t.text}"</p>
              <h4 className="font-bold uppercase text-sm">{t.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};