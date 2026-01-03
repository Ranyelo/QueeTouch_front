import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useNotification } from '../context/NotificationContext';
import { Star, Crown, Shield, Lock, X, CreditCard, CheckCircle, Settings, Gift, BookOpen, Download, FileText, Play, Send, MessageSquare, ThumbsUp, User as UserIcon, LayoutDashboard } from 'lucide-react';
import { MembershipTier } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import { CommentsSection } from '../components/CommentsSection';

// --- MOCK DATA FOR CONTENT ---

const EXPERT_TIPS = {
  bronze: [
    { author: "Sara Nails (Master Educator)", role: "Aliada Queen Touch", title: "El secreto del Sellado", text: "Nunca olvides sellar el borde libre dos veces: una con la base y otra con el top coat. Esto aumenta la duración un 30%." },
    { author: "Dr. Carlos (Químico)", role: "Laboratorio Queen", title: "Cuidado con la humedad", text: "Asegúrate de usar el deshidratador al menos 10 segundos antes del primer paso para evitar levantamientos prematuros." }
  ],
  silver: [
    { author: "Juan Stylist (Embajador Global)", role: "Especialista en Estructura", title: "Limado Europeo", text: "Para la forma almendra rusa, inclina la lima 45 grados desde el punto de estrés. No limes los laterales bajos en exceso." },
    { author: "Ana Marketing", role: "Consultora de Negocios", title: "Fidelización", text: "Ofrece un 'retoque express' gratuito a los 7 días. Te costará 5 minutos pero ganarás una cliente de por vida." }
  ],
  gold: [
    { author: "Maria Gonzalez", role: "CEO Queen Touch", title: "Escalando a High-Ticket", text: "Deja de cobrar por hora y empieza a cobrar por transformación. Tus servicios VIP deben incluir experiencia, bebida y seguimiento post-cita." },
    { author: "Legal Team", role: "Asesores", title: "Protección de Marca", text: "Si vas a contratar personal, asegúrate de que firmen el acuerdo de confidencialidad sobre tus técnicas propietarias." }
  ]
};

const RESOURCES = {
  bronze: [
    { type: "PDF", name: "Checklist de Higiene y Bioseguridad", size: "1.2 MB" },
    { type: "PDF", name: "Guía de Combinación de Colores 2026", size: "3.5 MB" }
  ],
  silver: [
    { type: "XLS", name: "Calculadora de Costos por Servicio", size: "0.5 MB" },
    { type: "PDF", name: "Manual de Estructuras Avanzadas", size: "12 MB" }
  ],
  gold: [
    { type: "DOC", name: "Contrato Legal para Empleados", size: "0.1 MB" },
    { type: "VIDEO", name: "Masterclass: Finanzas para Salones", size: "Stream" },
    { type: "PDF", name: "Blueprint: Tu Primer Millón en Uñas", size: "15 MB" }
  ]
};



// --- SUB-COMPONENTS ---

const TierExclusiveContent = ({ tier }: { tier: MembershipTier }) => {
  const tips = EXPERT_TIPS[tier];
  const resources = RESOURCES[tier];

  return (
    <div className="space-y-8 mb-12">

      <div className="bg-zinc-900 text-white p-8 rounded-lg shadow-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="flex items-center gap-3 mb-2 relative z-10">
          <Crown size={24} className="text-yellow-500" />
          <h3 className="text-2xl font-bold uppercase tracking-widest text-yellow-500">Zona Privada {tier}</h3>
        </div>
        <p className="text-gray-400 relative z-10 max-w-2xl">
          Bienvenida a tu espacio exclusivo. Aquí encontrarás herramientas diseñadas para potenciar tu carrera profesional.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
          <h4 className="font-bold uppercase mb-6 flex items-center gap-2 border-b pb-4">
            <Star className="text-black" size={20} /> Tips de Expertos Aliados
          </h4>
          <div className="space-y-6">
            {tips.map((tip, idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded border-l-4 border-black">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{tip.role}</p>
                <h5 className="font-bold text-sm mb-2">{tip.title}</h5>
                <p className="text-sm text-gray-700 italic">"{tip.text}"</p>
                <p className="text-xs font-bold mt-2 text-right">- {tip.author}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
          <h4 className="font-bold uppercase mb-6 flex items-center gap-2 border-b pb-4">
            <Download className="text-black" size={20} /> Recursos Descargables
          </h4>
          <div className="space-y-4">
            {resources.map((res, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border border-gray-100 rounded hover:shadow-md transition group bg-white">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-zinc-100 flex items-center justify-center rounded text-gray-600 group-hover:bg-black group-hover:text-white transition">
                    {res.type === 'VIDEO' ? <Play size={20} /> : <FileText size={20} />}
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-gray-800">{res.name}</h5>
                    <span className="text-xs text-gray-400 uppercase">{res.type} • {res.size}</span>
                  </div>
                </div>
                <button className="text-xs font-bold uppercase border border-black px-3 py-1 rounded hover:bg-black hover:text-white transition">
                  {res.type === 'VIDEO' ? 'Ver' : 'Bajar'}
                </button>
              </div>
            ))}

            <div className="bg-blue-50 p-4 rounded mt-4 flex gap-3 items-start">
              <BookOpen size={20} className="text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-sm text-blue-800">¿Necesitas más recursos?</h5>
                <p className="text-xs text-blue-600">Actualizamos esta lista el día 1 de cada mes. Si buscas algo específico, pídelo en la comunidad.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GlobalCommunity = ({ userTier, userName }: { userTier: string, userName: string }) => {
  return (
    <div className="max-w-4xl mx-auto mb-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold uppercase flex items-center gap-3">
          <MessageSquare size={32} /> Comunidad VIP Global
        </h2>
        <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full animate-pulse">
          ● En línea
        </span>
      </div>

      {/* Reusing the robust CommentsSection for the Community Feed */}
      <CommentsSection targetId="membership-community" />
    </div>
  );
};

const SubscriptionManagement = ({ tier, onCancel }: { tier: MembershipTier, onCancel: () => void }) => {
  const [autoRenew, setAutoRenew] = useState(true);

  return (
    <div className="mt-12 border-t pt-8">
      <h3 className="text-xl font-bold uppercase mb-6 flex items-center gap-2"><Settings size={20} /> Administración de Suscripción</h3>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="font-bold uppercase text-sm">Renovación Automática</p>
            <p className="text-xs text-gray-500">Tu suscripción se renovará el 1 de cada mes.</p>
          </div>
          <button
            onClick={() => setAutoRenew(!autoRenew)}
            className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${autoRenew ? 'bg-green-500' : 'bg-gray-300'}`}
          >
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${autoRenew ? 'translate-x-6' : ''}`}></div>
          </button>
        </div>

        <div className="flex justify-between items-center border-t border-gray-100 pt-6">
          <div>
            <p className="font-bold uppercase text-sm text-red-600">Cancelar Suscripción</p>
            <p className="text-xs text-gray-500">Perderás acceso a los beneficios inmediatamente.</p>
          </div>
          <button onClick={onCancel} className="text-xs uppercase font-bold border border-red-200 text-red-600 px-4 py-2 hover:bg-red-50 rounded">Cancelar</button>
        </div>
      </div>
    </div>
  );
};

const BenefitsGuide = () => (
  <div className="mt-8 bg-yellow-50 p-6 rounded-lg border border-yellow-200">
    <h3 className="font-bold uppercase mb-4 flex items-center gap-2 text-yellow-800"><BookOpen size={20} /> Guía de Bienvenida: Cómo reclamar tus beneficios</h3>
    <ul className="space-y-3 text-sm text-yellow-900">
      <li className="flex gap-2"><CheckCircle size={16} className="mt-0.5 shrink-0" /> <strong>Descuentos:</strong> Tu descuento se aplica automáticamente en el Checkout al iniciar sesión.</li>
      <li className="flex gap-2"><CheckCircle size={16} className="mt-0.5 shrink-0" /> <strong>Contenido Exclusivo:</strong> Accede desde el panel superior en "Zona Privada".</li>
      <li className="flex gap-2"><CheckCircle size={16} className="mt-0.5 shrink-0" /> <strong>Eventos:</strong> Recibirás invitaciones VIP a tu correo electrónico.</li>
    </ul>
  </div>
);

// --- MAIN COMPONENT ---

export const Membership = () => {
  const { user, updateUserTier } = useStore();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'selection' | 'form' | 'success'>('selection');
  const [selectedTier, setSelectedTier] = useState<MembershipTier | null>(null);
  const [processing, setProcessing] = useState(false);
  const [feedback, setFeedback] = useState('');

  // Redirect if not logged in
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold uppercase mb-4">Únete al Club Queen Touch</h1>
        <p className="mb-8">Inicia sesión para ver tus beneficios y subir de nivel.</p>
        <Link to="/login" className="bg-black text-white px-8 py-3 uppercase font-bold">Iniciar Sesión</Link>
      </div>
    );
  }

  // Handle Logic
  const initiateUpgrade = (tier: MembershipTier) => {
    setSelectedTier(tier);
    setPaymentStep('form');
  };

  const processPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate Payment API
    setTimeout(() => {
      setProcessing(false);
      if (selectedTier) updateUserTier(selectedTier);
      setPaymentStep('success');
    }, 2000);
  };

  const handleCancel = (e: React.FormEvent) => {
    e.preventDefault();
    showNotification('Gracias por tu retroalimentación. Tu suscripción ha sido cancelada.', 'info');
    setShowCancelModal(false);
    updateUserTier('bronze');
  };

  // --- RENDER STEPS ---

  // 1. SUCCESS VIEW
  if (paymentStep === 'success') {
    return (
      <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Gift size={48} className="text-green-600" />
        </div>
        <h1 className="text-4xl font-bold uppercase mb-4">¡Bienvenido al Nivel {selectedTier?.toUpperCase()}!</h1>
        <p className="text-xl text-gray-600 mb-8">Gracias por suscribirte. Tu pago ha sido procesado exitosamente.</p>

        <BenefitsGuide />

        <button
          onClick={() => setPaymentStep('selection')}
          className="mt-8 bg-black text-white px-8 py-3 uppercase font-bold tracking-widest hover:scale-105 transition-transform"
        >
          Ir a mi Panel
        </button>
      </div>
    );
  }

  // 2. PAYMENT FORM VIEW
  if (paymentStep === 'form' && selectedTier) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-lg">
        <button onClick={() => setPaymentStep('selection')} className="text-sm text-gray-500 mb-6 flex items-center gap-1"><X size={16} /> Cancelar</button>

        <div className="bg-white p-8 shadow-xl rounded-lg border border-gray-200">
          <h2 className="text-2xl font-bold uppercase mb-2">Suscripción {selectedTier}</h2>
          <p className="text-3xl font-bold mb-6">{selectedTier === 'silver' ? '$39.900' : '$89.900'} <span className="text-sm font-normal text-gray-500">/ mes</span></p>

          <form onSubmit={processPayment} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase mb-1">Nombre en la tarjeta</label>
              <input type="text" required className="w-full border p-3 rounded bg-gray-50" placeholder="Como aparece en la tarjeta" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase mb-1">Número de Tarjeta</label>
              <div className="relative">
                <input type="text" required className="w-full border p-3 rounded bg-gray-50 pl-10" placeholder="0000 0000 0000 0000" />
                <CreditCard className="absolute left-3 top-3 text-gray-400" size={20} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Expira</label>
                <input type="text" required className="w-full border p-3 rounded bg-gray-50" placeholder="MM/YY" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1">CVC</label>
                <input type="text" required className="w-full border p-3 rounded bg-gray-50" placeholder="123" />
              </div>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full bg-black text-white py-4 mt-4 uppercase font-bold tracking-widest hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-wait"
            >
              {processing ? 'Procesando...' : 'Pagar y Suscribirse'}
            </button>
            <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1 mt-2">
              <Lock size={12} /> Pago seguro encriptado
            </p>
          </form>
        </div>
      </div>
    );
  }

  // 3. SELECTION VIEW (DEFAULT)
  return (
    <div className="container mx-auto px-4 py-12">
      {/* User Header */}
      <div className="bg-gradient-to-r from-zinc-900 to-black text-white p-8 rounded-xl mb-12 flex flex-col md:flex-row items-center justify-between shadow-2xl">
        <div>
          <h1 className="text-4xl font-bold uppercase tracking-widest mb-2">Hola, {user.name}</h1>
          <p className="text-gray-400 uppercase tracking-widest">Nivel Actual: <span className="text-yellow-500 font-bold text-xl">{user.role === 'admin' ? 'Dueño del Producto' : user.tier?.toUpperCase() || 'MIEMBRO'}</span></p>
        </div>
        <div className="mt-6 md:mt-0 text-right">
          <div className="text-3xl font-bold">{user.points || 0} PTS</div>
          <p className="text-xs text-gray-500 uppercase">Puntos de fidelidad</p>
        </div>
      </div>

      {user.tier && <TierExclusiveContent tier={user.tier} />}

      {/* GLOBAL COMMUNITY SECTION - Visible to all tiers and admin */}
      <GlobalCommunity userTier={user.tier || 'admin'} userName={user.name} />

      {/* If Admin, show shortcut to panel instead of pricing */}
      {user.isAdmin ? (
        <div className="text-center py-12 border-t">
          <h2 className="text-3xl font-bold uppercase mb-4">Panel de Control</h2>
          <p className="text-gray-600 mb-8">Gestiona usuarios, suscripciones y contenido desde el área administrativa.</p>
          <button
            onClick={() => navigate('/admin')}
            className="bg-black text-white px-8 py-3 font-bold uppercase flex items-center gap-2 mx-auto hover:bg-zinc-800"
          >
            <LayoutDashboard /> Ir al Panel Admin
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-3xl font-bold uppercase text-center mb-8">Niveles de Membresía</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* BRONZE */}
            <div className={`border p-8 rounded-lg relative ${user.tier === 'bronze' ? 'border-orange-700 bg-orange-50' : 'border-gray-200'}`}>
              <h3 className="text-2xl font-bold uppercase text-orange-700 mb-4">Bronce</h3>
              <p className="text-3xl font-bold mb-4">Gratis</p>
              <ul className="space-y-2 mb-6 text-sm text-gray-600">
                <li>• Acceso a Comunidad Global</li>
                <li>• 5% OFF en Esmaltes</li>
                <li>• Newsletter de Tendencias</li>
                <li>• Acceso a Tips Básicos</li>
              </ul>
              {user.tier === 'bronze' ? (
                <span className="block text-center py-2 bg-gray-200 text-gray-600 font-bold uppercase">Nivel Actual</span>
              ) : (
                <button onClick={() => updateUserTier('bronze')} className="w-full border border-black py-2 uppercase font-bold hover:bg-black hover:text-white transition">Seleccionar</button>
              )}
            </div>

            {/* SILVER */}
            <div className={`border p-8 rounded-lg relative transform lg:scale-105 shadow-xl ${user.tier === 'silver' ? 'border-gray-400 bg-gray-50' : 'border-gray-200'}`}>
              <div className="absolute top-0 right-0 bg-gray-400 text-white text-xs px-2 py-1 uppercase font-bold">Popular</div>
              <h3 className="text-2xl font-bold uppercase text-gray-500 mb-4">Plata</h3>
              <p className="text-3xl font-bold mb-4">$39.900 <span className="text-sm font-normal">/mes</span></p>
              <ul className="space-y-2 mb-6 text-sm text-gray-600">
                <li>• Todo lo de Bronce</li>
                <li>• <strong>10% OFF</strong> en toda la tienda</li>
                <li>• Envíos Gratis (&gt; $100k)</li>
                <li>• Webinars Mensuales En Vivo</li>
                <li>• Descargables de Práctica</li>
              </ul>
              {user.tier === 'silver' ? (
                <span className="block text-center py-2 bg-gray-200 text-gray-600 font-bold uppercase">Nivel Actual</span>
              ) : (
                <button onClick={() => initiateUpgrade('silver')} className="w-full bg-black text-white py-3 uppercase font-bold hover:bg-zinc-800 transition">Suscribirse</button>
              )}
            </div>

            {/* GOLD */}
            <div className={`border p-8 rounded-lg relative ${user.tier === 'gold' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'}`}>
              <h3 className="text-2xl font-bold uppercase text-yellow-600 mb-4">Oro</h3>
              <p className="text-3xl font-bold mb-4">$89.900 <span className="text-sm font-normal">/mes</span></p>
              <ul className="space-y-2 mb-6 text-sm text-gray-600">
                <li>• Todo lo de Plata</li>
                <li>• <strong>20% OFF</strong> Permanentemente</li>
                <li>• Mentoría Grupal Semanal</li>
                <li>• Acceso Anticipado a Colecciones</li>
                <li>• Certificación Digital Trimestral</li>
                <li>• Eventos Presenciales VIP</li>
              </ul>
              {user.tier === 'gold' ? (
                <span className="block text-center py-2 bg-gray-200 text-gray-600 font-bold uppercase">Nivel Actual</span>
              ) : (
                <button onClick={() => initiateUpgrade('gold')} className="w-full border border-black py-2 uppercase font-bold hover:bg-black hover:text-white transition">Suscribirse</button>
              )}
            </div>
          </div>

          {user.tier && user.tier !== 'bronze' && (
            <SubscriptionManagement tier={user.tier} onCancel={() => setShowCancelModal(true)} />
          )}
        </>
      )}


      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 max-w-md w-full rounded-lg shadow-2xl relative">
            <button onClick={() => setShowCancelModal(false)} className="absolute top-4 right-4"><X /></button>
            <h3 className="text-xl font-bold uppercase mb-4">Lamentamos que te vayas</h3>
            <p className="text-gray-600 mb-4 text-sm">Ayúdanos a mejorar contándonos por qué cancelas tu suscripción:</p>
            <form onSubmit={handleCancel}>
              <textarea
                className="w-full border p-3 rounded mb-4 text-sm"
                rows={4}
                placeholder="Escribe tus comentarios aquí..."
                required
                onChange={(e) => setFeedback(e.target.value)}
              ></textarea>
              <div className="flex gap-4">
                <button type="button" onClick={() => setShowCancelModal(false)} className="flex-1 bg-gray-200 py-3 rounded font-bold uppercase">Volver</button>
                <button type="submit" className="flex-1 bg-red-600 text-white py-3 rounded font-bold uppercase hover:bg-red-700">Cancelar Suscripción</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};