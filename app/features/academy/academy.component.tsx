import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { MapPin, Calendar, Clock, User, CheckCircle, Star, Award, X, ShieldCheck, CreditCard } from 'lucide-react';
import { useStore } from '../../core/services/store.service';

// --- DATA MOCKS ---

const INSTRUCTORS = [
  {
    id: 1,
    name: "Sara 'Master' López",
    role: "Directora Educativa",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
    bio: "Juez internacional de Nailympion con 15 años de experiencia en estructuras extremas."
  },
  {
    id: 2,
    name: "Juan 'Stylist' Pérez",
    role: "Especialista en Nail Art",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop",
    bio: "Reconocido por sus técnicas de mano alzada y micro-realismo. Embajador global."
  },
  {
    id: 3,
    name: "Dra. Ana Torres",
    role: "Bioseguridad y Química",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=600&auto=format&fit=crop",
    bio: "Experta en la salud de la uña natural y química de productos."
  }
];

const OFFLINE_COURSES = [
  { 
    id: 101,
    title: "Master Camp: Estructuras Europeas", 
    image: "https://images.unsplash.com/photo-1632516643720-e7f5d7d6ecc9?q=80&w=1200&auto=format&fit=crop", 
    desc: "Perfeccionamiento intensivo de 3 días. Aprende Almond Rusa, Gothic Almond y Stiletto.",
    date: "15 - 17 Noviembre, 2024",
    time: "9:00 AM - 5:00 PM",
    location: "Queen Center, Bogotá (Zona T)",
    instructor: "Sara 'Master' López",
    price: 1500000,
    spots: 5
  },
  { 
    id: 102,
    title: "Nail Art: Texturas y Relieves", 
    image: "https://images.unsplash.com/photo-1600056166415-38e55e5b321c?q=80&w=1200&auto=format&fit=crop", 
    desc: "Técnicas avanzadas de 3D, plastilina gel y encapsulados de temporada.",
    date: "22 Noviembre, 2024",
    time: "10:00 AM - 4:00 PM",
    location: "Sede El Poblado, Medellín",
    instructor: "Juan 'Stylist' Pérez",
    price: 450000,
    spots: 12
  },
  { 
    id: 103,
    title: "Manicura Rusa & Hardware", 
    image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1200&auto=format&fit=crop", 
    desc: "Uso correcto del torno, fresas y limpieza profunda de cutícula sin daño.",
    date: "05 Diciembre, 2024",
    time: "9:00 AM - 3:00 PM",
    location: "Queen Center, Bogotá (Zona T)",
    instructor: "Dra. Ana Torres",
    price: 600000,
    spots: 8
  },
  { 
    id: 104,
    title: "Business Nails: Finanzas", 
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1200&auto=format&fit=crop", 
    desc: "Aprende a costear tus servicios, manejar agenda y vender más en tu salón.",
    date: "10 Diciembre, 2024",
    time: "2:00 PM - 6:00 PM",
    location: "Hotel Estelar, Cali",
    instructor: "Invitado Especial",
    price: 350000,
    spots: 20
  },
];

// --- COMPONENTS ---

const RegistrationModal = ({ course, onClose }: { course: any, onClose: () => void }) => {
  const { user } = useStore();
  const [step, setStep] = useState(1);

  // Calculate Discount
  let discount = 0;
  let roleName = "Visitante";
  
  if (user) {
    if (user.role === 'admin' || user.role === 'distributor') {
      discount = 0.50; // 50%
      roleName = user.role === 'admin' ? "Administrador" : "Distribuidor";
    } else if (user.tier === 'gold') {
      discount = 0.20; // 20%
      roleName = "Miembro Oro";
    } else if (user.tier === 'silver') {
      discount = 0.10; // 10%
      roleName = "Miembro Plata";
    } else if (user.tier === 'bronze') {
      discount = 0.05; // 5%
      roleName = "Miembro Bronce";
    }
  }

  const finalPrice = course.price * (1 - discount);
  const savings = course.price - finalPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2); // Success state
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-xl overflow-hidden shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black z-10"><X /></button>
        
        {step === 1 ? (
          <div className="flex flex-col md:flex-row h-full">
            {/* Left: Summary */}
            <div className="bg-zinc-900 text-white p-8 md:w-2/5 flex flex-col justify-between">
               <div>
                 <span className="text-yellow-500 text-xs font-bold uppercase tracking-widest mb-2 block">Curso Seleccionado</span>
                 <h3 className="text-xl font-bold uppercase leading-tight mb-4">{course.title}</h3>
                 <div className="space-y-3 text-sm text-gray-400">
                    <p className="flex items-center gap-2"><Calendar size={14}/> {course.date}</p>
                    <p className="flex items-center gap-2"><Clock size={14}/> {course.time}</p>
                    <p className="flex items-center gap-2"><MapPin size={14}/> {course.location}</p>
                 </div>
               </div>
               
               <div className="mt-8 pt-8 border-t border-white/10">
                  <div className="flex justify-between text-sm mb-1 text-gray-400">
                    <span>Precio Público</span>
                    <span className="line-through text-red-400">${course.price.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm mb-2 text-green-400 font-bold">
                      <span>Beneficio {roleName}</span>
                      <span>- ${savings.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-2xl font-bold text-white">
                    <span>Total</span>
                    <span>${finalPrice.toLocaleString()}</span>
                  </div>
                  {!user && (
                    <p className="text-[10px] text-gray-500 mt-2 text-center bg-white/5 p-2 rounded">
                      <Link to="/login" className="text-white underline">Inicia sesión</Link> para obtener descuentos.
                    </p>
                  )}
               </div>
            </div>

            {/* Right: Form */}
            <div className="p-8 md:w-3/5 bg-white">
               <h3 className="text-xl font-bold uppercase mb-6 text-black">Formulario de Inscripción</h3>
               <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Nombre Completo</label>
                    <input type="text" defaultValue={user?.name} required className="w-full border p-3 rounded bg-gray-50 text-sm" placeholder="Tu nombre" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">Teléfono</label>
                      <input type="tel" required className="w-full border p-3 rounded bg-gray-50 text-sm" placeholder="+57..." />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">Email</label>
                      <input type="email" defaultValue={user?.email} required className="w-full border p-3 rounded bg-gray-50 text-sm" placeholder="correo@ejemplo.com" />
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <label className="block text-xs font-bold uppercase mb-3">Método de Pago</label>
                    <div className="grid grid-cols-2 gap-3">
                       <label className="border p-3 rounded flex items-center gap-2 cursor-pointer hover:border-black transition">
                          <input type="radio" name="payment" required />
                          <span className="text-sm font-bold">Tarjeta</span>
                       </label>
                       <label className="border p-3 rounded flex items-center gap-2 cursor-pointer hover:border-black transition">
                          <input type="radio" name="payment" required />
                          <span className="text-sm font-bold">Transferencia</span>
                       </label>
                    </div>
                  </div>

                  <button className="w-full bg-black text-white py-4 mt-2 uppercase font-bold tracking-widest hover:bg-zinc-800 flex items-center justify-center gap-2">
                    <ShieldCheck size={18} /> Confirmar Cupo
                  </button>
               </form>
            </div>
          </div>
        ) : (
          <div className="p-16 text-center">
             <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-green-600" />
             </div>
             <h3 className="text-2xl font-bold uppercase mb-2">¡Inscripción Exitosa!</h3>
             <p className="text-gray-600 mb-6">Hemos enviado los detalles de pago y confirmación a tu correo electrónico. ¡Nos vemos en clase!</p>
             <button onClick={onClose} className="bg-black text-white px-8 py-3 uppercase font-bold rounded">Cerrar</button>
          </div>
        )}
      </div>
    </div>
  );
};

const AcademyPresencial = () => {
  const { user } = useStore();
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);

  return (
    <div className="flex flex-col bg-zinc-50">
      {selectedCourse && <RegistrationModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />}

      {/* Hero Section */}
      <div className="relative w-full h-[60vh] bg-black overflow-hidden flex items-center">
        <img src="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=1920&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <div className="container mx-auto px-4 relative z-10 text-white">
           <span className="bg-yellow-500 text-black px-4 py-1 uppercase text-xs font-bold tracking-widest mb-4 inline-block">Temporada 2024</span>
           <h1 className="text-5xl md:text-7xl font-bold uppercase mb-6 leading-tight">Academia<br/>Presencial</h1>
           <p className="max-w-xl text-lg text-gray-200 mb-8 border-l-4 border-yellow-500 pl-6">
             Formación de élite para artistas que buscan la perfección. Certifícate con los mejores instructores de Latinoamérica en nuestras sedes de alta tecnología.
           </p>
           
           {!user && (
             <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-lg inline-flex max-w-md">
                <Award className="text-yellow-400 shrink-0" size={32} />
                <div className="text-sm">
                   <p className="font-bold uppercase">¿Eres miembro del Club?</p>
                   <p className="text-gray-300">Inicia sesión para obtener hasta un <strong>20% de descuento</strong> en todos nuestros cursos presenciales.</p>
                </div>
             </div>
           )}
        </div>
      </div>

      {/* Instructors Strip */}
      <div className="bg-white py-16 border-b border-gray-200">
         <div className="container mx-auto px-4">
            <h2 className="text-center text-3xl font-bold uppercase mb-12 tracking-widest">Tus Mentores</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {INSTRUCTORS.map(inst => (
                 <div key={inst.id} className="text-center group">
                    <div className="w-48 h-48 mx-auto rounded-full overflow-hidden mb-6 border-4 border-gray-100 group-hover:border-yellow-500 transition-colors duration-300 relative">
                       <img src={inst.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                    </div>
                    <h3 className="text-xl font-bold uppercase">{inst.name}</h3>
                    <p className="text-yellow-600 text-xs font-bold uppercase tracking-widest mb-3">{inst.role}</p>
                    <p className="text-gray-500 text-sm max-w-xs mx-auto">{inst.bio}</p>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* Courses Grid */}
      <div className="container mx-auto px-4 py-20">
         <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold uppercase text-black">Cursos Disponibles</h2>
              <p className="text-gray-500 mt-2">Selecciona tu ciudad y nivel. Cupos limitados.</p>
            </div>
            <div className="hidden md:block">
               <span className="text-xs uppercase font-bold text-gray-400">Filtrar por:</span>
               <div className="flex gap-2 mt-2">
                  <button className="bg-black text-white px-4 py-2 text-xs font-bold uppercase rounded">Todos</button>
                  <button className="bg-white border border-gray-300 hover:border-black px-4 py-2 text-xs font-bold uppercase rounded transition">Bogotá</button>
                  <button className="bg-white border border-gray-300 hover:border-black px-4 py-2 text-xs font-bold uppercase rounded transition">Medellín</button>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {OFFLINE_COURSES.map(course => (
               <div key={course.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group flex flex-col h-full border border-gray-100">
                  <div className="h-48 overflow-hidden relative">
                     <img src={course.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                     <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 text-[10px] font-bold uppercase rounded flex items-center gap-1">
                        <User size={10} /> {course.spots} Cupos
                     </div>
                  </div>
                  
                  <div className="p-6 flex-grow flex flex-col">
                     <div className="mb-4">
                        <h3 className="font-bold text-lg uppercase leading-tight mb-2 group-hover:text-yellow-600 transition-colors">{course.title}</h3>
                        <p className="text-xs text-gray-500 line-clamp-2">{course.desc}</p>
                     </div>
                     
                     <div className="space-y-2 mb-6 text-xs text-gray-600">
                        <div className="flex items-center gap-2">
                           <Calendar size={14} className="text-black" /> <span>{course.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <Clock size={14} className="text-black" /> <span>{course.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <MapPin size={14} className="text-black" /> <span className="font-bold">{course.location}</span>
                        </div>
                        <div className="flex items-center gap-2 pt-2 border-t border-gray-100 mt-2">
                           <Star size={14} className="text-yellow-500 fill-yellow-500" /> <span className="uppercase font-bold text-gray-800">{course.instructor}</span>
                        </div>
                     </div>

                     <div className="mt-auto">
                        <div className="flex justify-between items-center mb-4">
                           <div className="flex flex-col">
                              <span className="text-[10px] uppercase text-gray-400 font-bold">Inversión</span>
                              <span className="text-lg font-bold text-black">${course.price.toLocaleString()}</span>
                           </div>
                           {user && (user.tier || user.role === 'admin' || user.role === 'distributor') && (
                              <div className="flex flex-col items-end">
                                 <span className="text-[10px] uppercase text-green-600 font-bold flex items-center gap-1"><Award size={10}/> Tu Precio</span>
                                 <span className="text-lg font-bold text-green-600">
                                    ${(course.price * (1 - (user.role === 'admin' || user.role === 'distributor' ? 0.5 : user.tier === 'gold' ? 0.2 : user.tier === 'silver' ? 0.1 : 0.05))).toLocaleString()}
                                 </span>
                              </div>
                           )}
                        </div>
                        <button 
                           onClick={() => setSelectedCourse(course)}
                           className="w-full bg-black text-white py-3 uppercase text-xs font-bold tracking-widest hover:bg-yellow-500 hover:text-black transition-colors rounded"
                        >
                           Inscribirse
                        </button>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

const AcademyOnline = () => (
  <div className="flex flex-col">
    <div className="w-full bg-zinc-900 text-white p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="md:w-2/3">
        <h1 className="text-4xl font-bold uppercase mb-4">Academia Online</h1>
        <p className="text-gray-300">Aprende a tu propio ritmo desde cualquier lugar del mundo. Certificación internacional.</p>
      </div>
      <button className="px-8 py-3 bg-white text-black font-bold uppercase hover:bg-gray-200 transition">
        Inscribirse Ahora
      </button>
    </div>

    <div className="container mx-auto px-4 py-12 space-y-2">
      {[
        { id: 1, title: 'Introducción al Manicure', img: 'photo-1604654894610-df63bc536371' },
        { id: 2, title: 'Anatomía de la Uña', img: 'photo-1519014816548-bf5fe059e98b' },
        { id: 3, title: 'Preparación y Limpieza', img: 'photo-1522337660859-02fbefca4702' },
        { id: 4, title: 'Esmaltado Semipermanente', img: 'photo-1632516643720-e7f5d7d6ecc9' },
        { id: 5, title: 'Nail Art Básico', img: 'photo-1599693918340-02543d3b7338' },
        { id: 6, title: 'Acrílico Nivel 1', img: 'photo-1600056166415-38e55e5b321c' },
        { id: 7, title: 'Polygel Avanzado', img: 'photo-1596462502278-27bfdd403cc2' },
        { id: 8, title: 'Decoración 3D', img: 'photo-1516975080664-ed2fc6a32937' },
        { id: 9, title: 'Marketing para Manicuristas', img: 'photo-1560066984-138dadb4c035' }
      ].map((mod) => (
        <div key={mod.id} className="w-full h-32 md:h-40 bg-gray-100 flex overflow-hidden border border-gray-200 hover:shadow-md transition">
          <div className="w-32 md:w-48 bg-gray-300 flex-shrink-0">
             <img src={`https://images.unsplash.com/${mod.img}?q=80&w=300&auto=format&fit=crop`} className="w-full h-full object-cover" />
          </div>
          <div className="flex-grow p-4 md:p-6 flex flex-col justify-center">
            <h3 className="text-xl font-bold uppercase text-gray-800">Módulo {mod.id}: {mod.title}</h3>
            <p className="text-sm text-gray-500">Aprende las técnicas más demandadas del mercado con nuestras expertas.</p>
          </div>
          <div className="w-16 flex items-center justify-center bg-black text-white font-bold">
            {mod.id}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const Academy = () => {
  const location = useLocation();
  if (location.pathname.includes('presencial')) return <AcademyPresencial />;
  return <AcademyOnline />;
};