import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Check, X, Crown, Star, Diamond, ArrowRight, ShieldCheck, CreditCard, Play } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { MembershipTier } from '../types';

// --- COMPONENTS ---

const SubscriptionModal = ({ tier, onClose }: { tier: MembershipTier, onClose: () => void }) => {
    const { user, updateUserTier, login } = useStore();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        cardName: '',
        cardNumber: '',
        exp: '',
        cvc: ''
    });

    const price = tier === 'bronze' ? 'Gratis' : tier === 'silver' ? '$10.00' : '$25.00';

    const handleRegisterAndPay = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API Processing
        setTimeout(() => {
            // If not logged in, simulate creation/login
            if (!user) {
                login(formData.email);
            }
            // Update Tier
            updateUserTier(tier);
            setLoading(false);
            setStep(2); // Success
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-4xl h-auto max-h-[90vh] overflow-y-auto rounded-xl flex flex-col md:flex-row relative shadow-2xl">
                <button onClick={onClose} className="absolute top-4 right-4 z-10 text-gray-400 hover:text-black bg-white rounded-full p-1"><X size={20}/></button>
                
                {/* Left: Plan Summary (Visual) */}
                <div className={`w-full md:w-1/3 p-6 md:p-8 text-white flex flex-col justify-between relative overflow-hidden ${tier === 'gold' ? 'bg-yellow-600' : tier === 'silver' ? 'bg-gray-400' : 'bg-orange-800'}`}>
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="relative z-10">
                        <span className="text-xs font-bold uppercase tracking-widest border border-white/30 px-2 py-1 inline-block mb-4">Plan Seleccionado</span>
                        <h2 className="text-3xl md:text-4xl font-bold uppercase mb-2">{tier}</h2>
                        <p className="text-4xl md:text-5xl font-bold mb-1">{price} <span className="text-sm font-normal align-middle">/ mes</span></p>
                    </div>
                    
                    <div className="relative z-10 mt-8">
                        <h4 className="font-bold uppercase text-xs mb-4 border-b border-white/30 pb-2">Incluye:</h4>
                        <ul className="space-y-2 text-sm">
                            <li className="flex gap-2"><Check size={16}/> Acceso a Comunidad</li>
                            {tier !== 'bronze' && <li className="flex gap-2"><Check size={16}/> Descuentos en Tienda</li>}
                            {tier === 'gold' && <li className="flex gap-2"><Check size={16}/> Eventos VIP & Mentoría</li>}
                        </ul>
                    </div>
                </div>

                {/* Right: Form */}
                <div className="w-full md:w-2/3 p-6 md:p-12 bg-white">
                    {step === 1 ? (
                        <form onSubmit={handleRegisterAndPay}>
                            <h3 className="text-xl md:text-2xl font-bold uppercase mb-6 text-black">Finalizar Suscripción</h3>
                            
                            {/* Personal Info */}
                            <div className="mb-8">
                                <h4 className="text-xs font-bold uppercase text-gray-500 mb-4 flex items-center gap-2"><div className="w-4 h-4 bg-black text-white rounded-full flex items-center justify-center text-[10px]">1</div> Tus Datos</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase mb-1">Nombre Completo</label>
                                        <input 
                                            type="text" required className="w-full border-b border-gray-300 p-2 focus:border-black outline-none bg-transparent" 
                                            placeholder="Tu nombre"
                                            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase mb-1">Email</label>
                                        <input 
                                            type="email" required className="w-full border-b border-gray-300 p-2 focus:border-black outline-none bg-transparent" 
                                            placeholder="correo@ejemplo.com"
                                            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                                            disabled={!!user} // Disable if already logged in
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Info (Only for Silver/Gold) */}
                            {tier !== 'bronze' && (
                                <div className="mb-8 animate-in fade-in slide-in-from-bottom-4">
                                    <h4 className="text-xs font-bold uppercase text-gray-500 mb-4 flex items-center gap-2"><div className="w-4 h-4 bg-black text-white rounded-full flex items-center justify-center text-[10px]">2</div> Pago Seguro</h4>
                                    <div className="bg-gray-50 p-6 rounded border border-gray-200">
                                        <div className="mb-4">
                                            <label className="block text-xs font-bold uppercase mb-1">Número de Tarjeta</label>
                                            <div className="relative">
                                                <input type="text" className="w-full border p-3 rounded bg-white pl-10" placeholder="0000 0000 0000 0000" />
                                                <CreditCard className="absolute left-3 top-3 text-gray-400" size={20} />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold uppercase mb-1">Expira</label>
                                                <input type="text" className="w-full border p-3 rounded bg-white" placeholder="MM/YY" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold uppercase mb-1">CVC</label>
                                                <input type="text" className="w-full border p-3 rounded bg-white" placeholder="123" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col md:flex-row items-center justify-between pt-4 border-t border-gray-100 gap-4">
                                <div className="text-xs text-gray-400 flex items-center gap-1 order-2 md:order-1">
                                    <ShieldCheck size={14}/> Datos Encriptados SSL
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full md:w-auto bg-black text-white px-10 py-4 uppercase font-bold tracking-widest hover:bg-zinc-800 disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-2 transition-all order-1 md:order-2"
                                >
                                    {loading ? 'Procesando...' : (tier === 'bronze' ? 'Unirme Gratis' : `Pagar ${price}`)} <ArrowRight size={18}/>
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center py-12">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                                <Crown size={40} className="text-green-600" />
                            </div>
                            <h3 className="text-3xl font-bold uppercase mb-2">¡Bienvenida al Club!</h3>
                            <p className="text-gray-600 mb-8 max-w-md">Tu membresía <strong>{tier}</strong> está activa. Hemos enviado los detalles de acceso a tu correo.</p>
                            <div className="flex gap-4">
                                <Link to="/membership" className="bg-black text-white px-8 py-3 uppercase font-bold hover:bg-zinc-800">Ir a mi Panel</Link>
                                <button onClick={onClose} className="text-gray-500 uppercase font-bold text-xs hover:text-black">Cerrar</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ClubLanding = () => (
  <div className="flex flex-col md:flex-row min-h-[80vh]">
    <Link to="/club/member" className="flex-1 relative group overflow-hidden h-[40vh] md:h-auto">
      <img src="https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex flex-col items-center justify-center text-white transition-colors">
        <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-widest mb-4">Hazte Miembro</h2>
        <span className="border border-white px-6 py-2 uppercase text-sm hover:bg-white hover:text-black transition">Ver más</span>
      </div>
    </Link>
    <Link to="/club/ambassador" className="flex-1 relative group overflow-hidden h-[40vh] md:h-auto border-t md:border-t-0 md:border-l border-white">
      <img src="https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex flex-col items-center justify-center text-white transition-colors">
        <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-widest mb-4">Embajadores</h2>
        <span className="border border-white px-6 py-2 uppercase text-sm hover:bg-white hover:text-black transition">Ver más</span>
      </div>
    </Link>
  </div>
);

const BecomeMember = () => {
  const [selectedTier, setSelectedTier] = useState<MembershipTier | null>(null);

  return (
    <div className="flex flex-col">
      {/* Modal Integration */}
      {selectedTier && <SubscriptionModal tier={selectedTier} onClose={() => setSelectedTier(null)} />}

      {/* Hero Section */}
      <div className="relative w-full h-[60vh] md:h-[70vh] bg-black overflow-hidden flex items-center justify-center">
         <img src="https://images.unsplash.com/photo-1596462502278-27bfdd403cc2?q=80&w=1920&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-50" />
         <div className="relative z-10 text-center text-white p-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <span className="text-yellow-400 uppercase tracking-[0.3em] text-xs font-bold mb-4 block">Exclusividad & Prestigio</span>
            <h1 className="text-4xl md:text-7xl font-bold uppercase tracking-widest mb-6">Queen Touch<br/>Club</h1>
            <p className="max-w-2xl mx-auto text-gray-200 text-sm md:text-lg font-light tracking-wide mb-8">
               Únete a la comunidad de artistas de uñas más selecta de Latinoamérica. Accede a formación continua, descuentos exclusivos y eventos VIP.
            </p>
            <button onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })} className="bg-white text-black px-8 py-3 uppercase font-bold tracking-widest hover:bg-gray-200 transition">
               Ver Planes
            </button>
         </div>
      </div>

      {/* Intro / Visual Section */}
      <div className="bg-white py-12 md:py-20">
         <div className="container mx-auto px-4">
             <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
                 <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
                     <img src="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=600&auto=format&fit=crop" className="w-full aspect-[3/4] object-cover rounded-lg shadow-xl translate-y-8" />
                     <img src="https://images.unsplash.com/photo-1629362838965-6b3a04294025?q=80&w=600&auto=format&fit=crop" className="w-full aspect-[3/4] object-cover rounded-lg shadow-xl" />
                 </div>
                 <div className="w-full md:w-1/2">
                     <h2 className="text-3xl md:text-4xl font-bold uppercase mb-6 md:mb-8 leading-tight">Más que una<br/>Suscripción</h2>
                     <p className="text-gray-600 mb-6 text-sm md:text-lg leading-relaxed">
                        Ser miembro de Queen Touch es sinónimo de excelencia. Diseñamos nuestros niveles pensando en cada etapa de tu carrera profesional, desde que inicias hasta que te conviertes en Master.
                     </p>
                     <ul className="space-y-4">
                         {[
                             { title: "Formación Continua", desc: "Recursos educativos actualizados mensualmente." },
                             { title: "Descuentos Reales", desc: "Ahorra hasta un 20% en todos tus productos." },
                             { title: "Comunidad Global", desc: "Conecta con artistas de todo el mundo." }
                         ].map((item, i) => (
                             <li key={i} className="flex gap-4 items-start">
                                 <div className="bg-black text-white p-2 rounded-full mt-1"><Check size={14}/></div>
                                 <div>
                                     <h4 className="font-bold uppercase text-sm">{item.title}</h4>
                                     <p className="text-gray-500 text-sm">{item.desc}</p>
                                 </div>
                             </li>
                         ))}
                     </ul>
                 </div>
             </div>
         </div>
      </div>

      {/* Pricing Section */}
      <div id="plans" className="bg-zinc-50 py-16 md:py-24 border-t border-gray-200">
          <div className="container mx-auto px-4">
              <div className="text-center mb-12 md:mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-widest mb-4">Elige tu Nivel</h2>
                  <p className="text-gray-500">Cancela en cualquier momento. Sin cláusulas de permanencia.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  {/* BRONZE */}
                  <div className="bg-white border border-gray-200 p-6 md:p-8 rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300 relative group">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                          <ShieldCheck size={32} className="text-orange-700" />
                      </div>
                      <h3 className="text-center text-2xl font-bold uppercase text-gray-800 mt-6 mb-2">Bronze</h3>
                      <div className="text-center mb-8">
                          <span className="text-4xl font-bold">Gratis</span>
                      </div>
                      <ul className="space-y-4 mb-8 text-sm text-gray-600 px-4">
                          <li className="flex items-center gap-3"><Check size={16} className="text-orange-700"/> Acceso a Comunidad</li>
                          <li className="flex items-center gap-3"><Check size={16} className="text-orange-700"/> 5% Descuento en Tienda</li>
                          <li className="flex items-center gap-3"><Check size={16} className="text-orange-700"/> Newsletter Semanal</li>
                          <li className="flex items-center gap-3 text-gray-300"><X size={16}/> Envíos Prioritarios</li>
                          <li className="flex items-center gap-3 text-gray-300"><X size={16}/> Mentoría 1 a 1</li>
                      </ul>
                      <button onClick={() => setSelectedTier('bronze')} className="w-full py-4 border-2 border-black font-bold uppercase tracking-widest hover:bg-black hover:text-white transition">
                          Unirme Gratis
                      </button>
                  </div>

                  {/* SILVER */}
                  <div className="bg-zinc-900 text-white p-6 md:p-8 rounded-xl shadow-2xl relative transform md:-translate-y-4 border border-zinc-700 mt-8 md:mt-0">
                       <div className="absolute top-0 right-0 bg-yellow-500 text-black text-xs font-bold px-3 py-1 uppercase rounded-bl-lg rounded-tr-lg">Más Popular</div>
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-zinc-700 rounded-full flex items-center justify-center border-4 border-zinc-900 shadow-sm">
                          <Star size={32} className="text-white" />
                      </div>
                      <h3 className="text-center text-2xl font-bold uppercase text-gray-100 mt-6 mb-2">Silver</h3>
                      <div className="text-center mb-8">
                          <span className="text-4xl font-bold">$10.00</span>
                          <span className="text-sm text-gray-400">/ mes</span>
                      </div>
                      <ul className="space-y-4 mb-8 text-sm text-gray-300 px-4">
                          <li className="flex items-center gap-3"><Check size={16} className="text-white"/> Todo lo de Bronze</li>
                          <li className="flex items-center gap-3"><Check size={16} className="text-white"/> <strong className="text-white">10% Descuento</strong></li>
                          <li className="flex items-center gap-3"><Check size={16} className="text-white"/> Webinars Mensuales</li>
                          <li className="flex items-center gap-3"><Check size={16} className="text-white"/> Envíos Prioritarios</li>
                          <li className="flex items-center gap-3 text-zinc-600"><X size={16}/> Mentoría 1 a 1</li>
                      </ul>
                      <button onClick={() => setSelectedTier('silver')} className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-gray-200 transition">
                          Seleccionar Plan
                      </button>
                  </div>

                  {/* GOLD */}
                  <div className="bg-white border border-yellow-200 p-6 md:p-8 rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300 relative mt-8 md:mt-0">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                          <Crown size={32} className="text-yellow-600" />
                      </div>
                      <h3 className="text-center text-2xl font-bold uppercase text-yellow-600 mt-6 mb-2">Gold</h3>
                      <div className="text-center mb-8">
                          <span className="text-4xl font-bold">$25.00</span>
                          <span className="text-sm text-gray-500">/ mes</span>
                      </div>
                      <ul className="space-y-4 mb-8 text-sm text-gray-600 px-4">
                          <li className="flex items-center gap-3"><Check size={16} className="text-yellow-600"/> Todo lo de Silver</li>
                          <li className="flex items-center gap-3"><Check size={16} className="text-yellow-600"/> <strong className="text-black">20% Descuento</strong></li>
                          <li className="flex items-center gap-3"><Check size={16} className="text-yellow-600"/> Mentoría 1 a 1</li>
                          <li className="flex items-center gap-3"><Check size={16} className="text-yellow-600"/> Eventos Presenciales VIP</li>
                          <li className="flex items-center gap-3"><Check size={16} className="text-yellow-600"/> Acceso Anticipado</li>
                      </ul>
                      <button onClick={() => setSelectedTier('gold')} className="w-full py-4 border-2 border-yellow-500 text-yellow-800 font-bold uppercase tracking-widest hover:bg-yellow-500 hover:text-white transition">
                          Ser Miembro VIP
                      </button>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

const AmbassadorForm = ({ onClose }: { onClose: () => void }) => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        // Simulate API call
    };

    if (submitted) {
        return (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 max-w-md w-full rounded text-center">
                    <Check size={48} className="text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold uppercase mb-2">¡Solicitud Enviada!</h3>
                    <p className="text-gray-600 mb-6">Gracias por tu interés en ser parte de la familia Queen Touch. Nuestro equipo revisará tu perfil y te contactará en los próximos 3-5 días hábiles.</p>
                    <button onClick={onClose} className="bg-black text-white px-8 py-3 uppercase font-bold">Cerrar</button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white p-6 md:p-8 max-w-lg w-full rounded relative my-8">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black"><X /></button>
                <h2 className="text-xl md:text-2xl font-bold uppercase mb-2">Solicitud de Embajador</h2>
                <p className="text-xs text-gray-500 mb-6">Completa el formulario para aplicar.</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">Nombre Completo</label>
                        <input type="text" required className="w-full border p-3 bg-gray-50" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Email</label>
                            <input type="email" required className="w-full border p-3 bg-gray-50" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Teléfono</label>
                            <input type="tel" required className="w-full border p-3 bg-gray-50" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">Instagram Handle</label>
                        <input type="text" required placeholder="@tuusuario" className="w-full border p-3 bg-gray-50" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">Experiencia en Nail Art (Años)</label>
                        <input type="number" required className="w-full border p-3 bg-gray-50" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">¿Por qué quieres ser embajador?</label>
                        <textarea required rows={3} className="w-full border p-3 bg-gray-50"></textarea>
                    </div>
                    <div className="text-xs text-gray-500">
                        <label className="flex items-start gap-2 cursor-pointer">
                            <input type="checkbox" required className="mt-1" />
                            <span>Acepto los términos y condiciones. Entiendo que ser embajador requiere un mínimo de 3 publicaciones mensuales y mantener una imagen profesional alineada con Queen Touch.</span>
                        </label>
                    </div>
                    <button type="submit" className="w-full bg-black text-white py-4 uppercase font-bold tracking-widest hover:bg-zinc-800">Enviar Solicitud</button>
                </form>
            </div>
        </div>
    );
};

const Ambassadors = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="flex flex-col">
      {showForm && <AmbassadorForm onClose={() => setShowForm(false)} />}
      
      {/* Top Split */}
      <div className="flex flex-col md:flex-row h-auto md:h-[60vh]">
         <div className="w-full md:w-1/2 p-8 md:p-10 bg-zinc-900 text-white flex flex-col justify-center">
           <h2 className="text-2xl md:text-3xl font-bold uppercase mb-6">Beneficios y Condiciones</h2>
           <p className="mb-4 text-gray-300">Representa a Queen Touch y lleva tu carrera al siguiente nivel.</p>
           <ul className="space-y-4 text-sm text-gray-400 list-disc ml-4">
             <li><strong className="text-white">Comisiones:</strong> Gana hasta un 15% por ventas referidas con tu código único.</li>
             <li><strong className="text-white">Kit de Inicio:</strong> Recibe una caja PR trimestral con nuestros lanzamientos valorada en $200 USD.</li>
             <li><strong className="text-white">Visibilidad:</strong> Reposteo en nuestras redes (+500k seguidores).</li>
             <li><strong className="text-white">Capacitación:</strong> Acceso gratuito a nuestra Academia Online.</li>
           </ul>
           
           <div className="mt-8 border-t border-gray-700 pt-4">
                <h4 className="font-bold uppercase text-xs mb-2 text-white">Requisitos Mínimos</h4>
                <p className="text-xs text-gray-500">Tener perfil público en RRSS, mínimo 5k seguidores reales, estética cuidada y pasión por el Nail Art.</p>
           </div>
         </div>
         <div className="w-full md:w-1/2 p-12 md:p-10 bg-gray-100 flex flex-col justify-center items-center relative overflow-hidden">
             {/* Background Pattern effect */}
             <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
            
            <h2 className="text-2xl md:text-3xl font-bold uppercase mb-6 text-center z-10">¿Tienes lo que se necesita?</h2>
            <p className="text-center text-gray-600 mb-8 max-w-md z-10">Estamos buscando artistas apasionados que quieran crecer con nosotros.</p>
            <button 
                onClick={() => setShowForm(true)}
                className="px-8 md:px-10 py-5 bg-black text-white uppercase font-bold tracking-widest hover:scale-105 transition-transform z-10 shadow-xl text-sm md:text-base"
            >
              Trabaja con nosotros
            </button>
            <p className="mt-4 text-xs text-gray-400 z-10">O contáctanos en ambassadors@queentouch.com</p>
         </div>
      </div>
  
      {/* Bottom Grid: Current Ambassadors */}
      <div className="container mx-auto px-4 py-12">
        <h3 className="text-2xl font-bold uppercase text-center mb-8">Nuestros Embajadores</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="aspect-square bg-gray-200 relative group overflow-hidden">
              <img src={`https://images.unsplash.com/photo-${[
                  '1544005313-94ddf0286df2', '1494790108377-be9c29b29330', '1534528741775-53994a69daeb', '1531123897727-8f129e1688ce', 
                  '1507003211169-0a1dd7228f2d', '1517841905240-472988babdf9', '1524504388940-b1c1722653e1', '1488426862026-3ee34a7d66df'
              ][i-1]}?q=80&w=400&auto=format&fit=crop`} className="w-full h-full object-cover transition duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0" />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-4 pt-12">
                <p className="text-white font-bold uppercase text-sm">Artista {i}</p>
                <p className="text-white/60 text-[10px] uppercase">@artista_{i}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Club = () => {
  const location = useLocation();
  if (location.pathname.includes('/member')) return <BecomeMember />;
  if (location.pathname.includes('/ambassador')) return <Ambassadors />;
  return <ClubLanding />;
};