import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useNotification } from '../context/NotificationContext';
import { Check, Shield, TrendingUp, DollarSign, ArrowRight, User as UserIcon, Building, MapPin, DollarSign as MoneyIcon, Send, Clock, Package, MessageCircle, FileText, Download, LogOut, PlusCircle, Truck, Calendar, AlertTriangle, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const distributors = [
    { city: "Bogotá", list: ["Queen Center Norte", "Distribuidora Bella", "Nails Supply"] },
    { city: "Medellín", list: ["Punto Nails Poblado", "Centro Estético Sur", "Laureles Beauty"] },
    { city: "Cali", list: ["Valle Belleza", "Cali Norte"] },
    { city: "Barranquilla", list: ["Costa Nails", "Insumos Caribe"] },
];

// --- COMPONENTS FOR APPLICATION WIZARD ---

const ApplicationForm = ({ onCancel }: { onCancel: () => void }) => {
    const { user, submitDistributorApplication } = useStore();
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user?.name || '',
        businessName: '',
        address: '',
        city: '',
        phone: '',
        experience: '',
        capital: ''
    });

    if (!user) {
        return (
            <div className="bg-black text-white p-8 md:p-12 text-center rounded-lg m-4">
                <h3 className="text-2xl font-bold uppercase mb-4">Inicia Sesión</h3>
                <p className="mb-6">Para aplicar como distribuidor, necesitas una cuenta en Queen Touch.</p>
                <button onClick={() => navigate('/login')} className="bg-white text-black px-8 py-3 font-bold uppercase">Ir al Login</button>
            </div>
        );
    }

    const handleSubmit = () => {
        submitDistributorApplication({
            ...formData,
            userId: user.email
        });
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className="bg-white p-8 md:p-12 shadow-2xl rounded-lg border border-gray-100 max-w-2xl mx-auto my-12 text-center m-4">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check size={48} className="text-green-600" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold uppercase mb-4 text-gray-900">¡Solicitud Recibida!</h2>
                <p className="text-gray-600 mb-8 text-lg">
                    Gracias por tu interés en ser parte de la familia Queen Touch. Hemos recibido tu información exitosamente.
                </p>
                <div className="bg-gray-50 p-6 rounded mb-8 text-sm text-gray-500">
                    <p>Nuestro equipo revisará tu perfil y la disponibilidad de zona.</p>
                    <p>Te contactaremos al correo <strong>{user.email}</strong> o al teléfono <strong>{formData.phone}</strong> en las próximas 48 horas.</p>
                </div>
                <button onClick={onCancel} className="bg-black text-white px-8 py-3 font-bold uppercase hover:bg-zinc-800">
                    Volver al Inicio
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 md:p-12 shadow-2xl rounded-lg border border-gray-100 max-w-4xl mx-auto my-8 md:my-12 relative m-4">
            {/* Steps Indicator */}
            <div className="flex justify-center mb-8 md:mb-12">
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center">
                        <div className={`w-8 h-8 md:w-10 md:h-10 text-xs md:text-base rounded-full flex items-center justify-center font-bold transition-colors duration-500 ${step >= i ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
                            {i}
                        </div>
                        {i < 3 && <div className={`w-8 md:w-16 h-1 mx-2 ${step > i ? 'bg-black' : 'bg-gray-100'}`}></div>}
                    </div>
                ))}
            </div>

            {/* STEP 1: BENEFITS & INFO */}
            {step === 1 && (
                <div className="animate-in fade-in slide-in-from-right duration-500">
                    <h2 className="text-2xl md:text-3xl font-bold uppercase mb-6 text-center text-black">Modelo de Negocio</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="bg-gray-50 p-6 rounded border border-gray-200">
                            <h4 className="font-bold uppercase mb-4 flex items-center gap-2 text-black"><DollarSign size={20} /> Rentabilidad</h4>
                            <p className="text-sm text-gray-700 mb-2">Obtén márgenes de ganancia del <strong>40% al 60%</strong> sobre el PVP.</p>
                            <p className="text-sm text-gray-700">Acceso a precios mayoristas desde la primera unidad tras el kit inicial.</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded border border-gray-200">
                            <h4 className="font-bold uppercase mb-4 flex items-center gap-2 text-black"><TrendingUp size={20} /> Crecimiento</h4>
                            <p className="text-sm text-gray-700 mb-2">Publicidad geolocalizada gratuita en nuestra web y redes sociales.</p>
                            <p className="text-sm text-gray-700">Prioridad en lanzamientos de nuevas colecciones.</p>
                        </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 p-6 rounded mb-8">
                        <h4 className="font-bold uppercase text-yellow-800 text-sm mb-2">Inversión Inicial Requerida</h4>
                        <p className="text-2xl font-bold text-black mb-1">$5,000,000 COP</p>
                        <p className="text-xs text-gray-600">Incluye stock inicial surtido, material P.O.P. (exhibidores) y capacitación.</p>
                    </div>

                    <div className="flex flex-col md:flex-row justify-end gap-4">
                        <button onClick={onCancel} className="px-6 py-3 text-sm font-bold uppercase hover:bg-gray-100 rounded text-black order-2 md:order-1">Cancelar</button>
                        <button onClick={() => setStep(2)} className="bg-black text-white px-8 py-3 font-bold uppercase hover:bg-zinc-800 flex items-center justify-center gap-2 order-1 md:order-2">
                            Comenzar Solicitud <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 2: BUSINESS DATA */}
            {step === 2 && (
                <div className="animate-in fade-in slide-in-from-right duration-500">
                    <h2 className="text-2xl md:text-3xl font-bold uppercase mb-6 text-center text-black">Datos del Negocio</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-black">
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1 flex items-center gap-1"><UserIcon size={12} /> Nombre Completo</label>
                            <input type="text" className="w-full border border-gray-300 p-3 bg-white rounded text-black" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1 flex items-center gap-1"><Building size={12} /> Nombre del Negocio / Local</label>
                            <input type="text" className="w-full border border-gray-300 p-3 bg-white rounded text-black" placeholder="Ej: Nails Spa Center" value={formData.businessName} onChange={e => setFormData({ ...formData, businessName: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1 flex items-center gap-1"><MapPin size={12} /> Dirección del Local</label>
                            <input type="text" className="w-full border border-gray-300 p-3 bg-white rounded text-black" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Ciudad</label>
                            <input type="text" className="w-full border border-gray-300 p-3 bg-white rounded text-black" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Teléfono / WhatsApp</label>
                            <input type="text" className="w-full border border-gray-300 p-3 bg-white rounded text-black" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1 flex items-center gap-1"><MoneyIcon size={12} /> Capacidad de Inversión</label>
                            <select className="w-full border border-gray-300 p-3 bg-white rounded text-black" value={formData.capital} onChange={e => setFormData({ ...formData, capital: e.target.value })}>
                                <option value="">Selecciona un rango</option>
                                <option value="5m-10m">5 a 10 Millones</option>
                                <option value="10m-20m">10 a 20 Millones</option>
                                <option value="20m+">Más de 20 Millones</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold uppercase mb-1">Experiencia en el Rubro</label>
                            <textarea
                                className="w-full border border-gray-300 p-3 bg-white rounded text-black"
                                rows={3}
                                placeholder="Cuéntanos brevemente sobre tu experiencia vendiendo productos de belleza..."
                                value={formData.experience}
                                onChange={e => setFormData({ ...formData, experience: e.target.value })}
                            ></textarea>
                        </div>
                    </div>

                    <div className="flex justify-between gap-4">
                        <button onClick={() => setStep(1)} className="px-6 py-3 text-sm font-bold uppercase hover:bg-gray-100 rounded text-black">Atrás</button>
                        <button
                            onClick={() => {
                                if (!formData.businessName || !formData.phone) return showNotification('Por favor completa los campos requeridos', 'error');
                                setStep(3);
                            }}
                            className="bg-black text-white px-8 py-3 font-bold uppercase hover:bg-zinc-800 flex items-center gap-2"
                        >
                            Siguiente <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 3: CONFIRMATION */}
            {step === 3 && (
                <div className="text-center animate-in fade-in slide-in-from-right duration-500 py-12">
                    <Shield size={64} className="mx-auto mb-6 text-black" />
                    <h2 className="text-3xl font-bold uppercase mb-4 text-black">Confirmar Solicitud</h2>
                    <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                        Al enviar esta solicitud, confirmas que la información proporcionada es real. Nuestro equipo evaluará tu propuesta y la ubicación de tu local para garantizar la exclusividad de zona.
                    </p>

                    <button
                        onClick={handleSubmit}
                        className="bg-black text-white px-12 py-4 text-xl font-bold uppercase hover:scale-105 transition-transform shadow-xl flex items-center justify-center gap-3 mx-auto w-full md:w-auto"
                    >
                        <Send size={24} /> Enviar Propuesta
                    </button>
                    <button onClick={() => setStep(2)} className="mt-6 text-sm underline text-gray-500 hover:text-black">Volver a editar</button>
                </div>
            )}
        </div>
    );
};

// --- DISTRIBUTOR DASHBOARD (WORK AREA) ---

const DistributorDashboard = () => {
    const { user, products, addToCart, orders, tickets, createTicket, resignDistributor, appointments, updateAppointment } = useStore();
    const { showNotification } = useNotification();
    const [activeTab, setActiveTab] = useState('orders');
    const [quickQuantities, setQuickQuantities] = useState<Record<string, number>>({});
    const navigate = useNavigate();

    // Features
    const [pqrsSubject, setPqrsSubject] = useState('');
    const [pqrsMsg, setPqrsMsg] = useState('');
    const [showResignModal, setShowResignModal] = useState(false);
    const [resignReason, setResignReason] = useState('');

    const userOrders = orders.filter(o => o.userId === user?.email);
    const userAppointments = appointments.filter(a => a.distributorId === user?.email);

    const handleQuickAdd = (product: any) => {
        const qty = quickQuantities[product.id] || 0;
        if (qty > 0) {
            for (let i = 0; i < qty; i++) addToCart(product);
            showNotification(`Añadido ${qty} unidades de ${product.name} al carrito`, 'success');
            setQuickQuantities({ ...quickQuantities, [product.id]: 0 });
        }
    };

    const handleResign = (e: React.FormEvent) => {
        e.preventDefault();
        if (confirm('¿Estás seguro de renunciar? Perderás tus descuentos inmediatamente.')) {
            resignDistributor(resignReason);
            showNotification('Has renunciado a tu distribución. Volverás al inicio.', 'info');
            navigate('/');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
            <div className="bg-black text-white p-6 md:p-8 rounded-lg mb-8 flex flex-col md:flex-row justify-between items-center shadow-2xl gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-widest mb-2">Panel de Distribuidor</h1>
                    <p className="text-gray-400">Bienvenido, <span className="text-white font-bold">{user?.name}</span>. Gestiona tu negocio desde aquí.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white/10 px-6 py-3 rounded backdrop-blur-md border border-white/20">
                        <p className="text-xs uppercase font-bold text-gray-300">Descuento Activo</p>
                        <p className="text-2xl font-bold text-green-400">40% OFF</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-64 flex flex-col gap-2 shrink-0">
                    <button onClick={() => navigate('/shop')} className="p-4 text-left font-bold uppercase rounded flex items-center gap-3 bg-purple-600 text-white hover:bg-purple-700 shadow-md mb-2">
                        <ShoppingBag size={20} /> Tienda Mayorista
                    </button>
                    <button onClick={() => setActiveTab('orders')} className={`p-4 text-left font-bold uppercase rounded flex items-center gap-3 ${activeTab === 'orders' ? 'bg-black text-white' : 'bg-white hover:bg-gray-200 border border-gray-200 text-black'}`}>
                        <Package size={20} /> Pedido Rápido
                    </button>
                    <button onClick={() => setActiveTab('history')} className={`p-4 text-left font-bold uppercase rounded flex items-center gap-3 ${activeTab === 'history' ? 'bg-black text-white' : 'bg-white hover:bg-gray-200 border border-gray-200 text-black'}`}>
                        <Truck size={20} /> Mis Pedidos
                    </button>
                    <button onClick={() => setActiveTab('appointments')} className={`p-4 text-left font-bold uppercase rounded flex items-center gap-3 ${activeTab === 'appointments' ? 'bg-black text-white' : 'bg-white hover:bg-gray-200 border border-gray-200 text-black'}`}>
                        <Calendar size={20} /> Mis Citas
                    </button>
                    <button onClick={() => setActiveTab('marketing')} className={`p-4 text-left font-bold uppercase rounded flex items-center gap-3 ${activeTab === 'marketing' ? 'bg-black text-white' : 'bg-white hover:bg-gray-200 border border-gray-200 text-black'}`}>
                        <Download size={20} /> Material y Medios
                    </button>
                    <button onClick={() => setActiveTab('support')} className={`p-4 text-left font-bold uppercase rounded flex items-center gap-3 ${activeTab === 'support' ? 'bg-black text-white' : 'bg-white hover:bg-gray-200 border border-gray-200 text-black'}`}>
                        <MessageCircle size={20} /> Soporte / PQRS
                    </button>
                    <button onClick={() => setActiveTab('settings')} className={`p-4 text-left font-bold uppercase rounded flex items-center gap-3 ${activeTab === 'settings' ? 'bg-black text-white' : 'bg-white hover:bg-gray-200 border border-gray-200 text-black'}`}>
                        <AlertTriangle size={20} /> Configuración
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4 md:p-8 min-h-[500px] shadow-sm">

                    {/* QUICK ORDER */}
                    {activeTab === 'orders' && (
                        <div>
                            <h2 className="text-2xl font-bold uppercase mb-6 border-b pb-4 text-black">Realizar Pedido de Reposición</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-100 uppercase text-xs font-bold text-gray-700">
                                        <tr>
                                            <th className="p-3">Producto</th>
                                            <th className="p-3">Precio Mayorista</th>
                                            <th className="p-3 w-32">Cantidad</th>
                                            <th className="p-3">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {products.map(p => (
                                            <tr key={p.id} className="hover:bg-gray-50 text-gray-800">
                                                <td className="p-3 font-bold">{p.name} <span className="text-xs font-normal text-gray-500 block">{p.stock} unid. disponibles</span></td>
                                                <td className="p-3 text-black font-bold">${(p.price * 0.6).toLocaleString()}</td>
                                                <td className="p-3">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        className="border border-gray-300 p-2 w-20 rounded bg-white text-black"
                                                        value={quickQuantities[p.id] || ''}
                                                        onChange={(e) => setQuickQuantities({ ...quickQuantities, [p.id]: parseInt(e.target.value) })}
                                                    />
                                                </td>
                                                <td className="p-3">
                                                    <button
                                                        onClick={() => handleQuickAdd(p)}
                                                        className="bg-black text-white p-2 rounded hover:bg-gray-800 disabled:bg-gray-300"
                                                        disabled={!quickQuantities[p.id]}
                                                    >
                                                        <PlusCircle size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* HISTORY with Tracking */}
                    {activeTab === 'history' && (
                        <div>
                            <h2 className="text-2xl font-bold uppercase mb-6 border-b pb-4 text-black">Estado de Pedidos</h2>
                            {userOrders.length === 0 ? <p className="text-gray-500">No tienes pedidos recientes.</p> : (
                                <div className="space-y-4">
                                    {userOrders.map(order => (
                                        <div key={order.id} className="border border-gray-200 p-6 rounded bg-gray-50 flex flex-col md:flex-row justify-between gap-4">
                                            <div>
                                                <h4 className="font-bold text-lg text-black">Pedido #{order.id}</h4>
                                                <p className="text-sm text-gray-600">Fecha: {order.date} | Total: <span className="font-bold">${order.total.toLocaleString()}</span></p>

                                                {/* Shipping Info Box */}
                                                <div className="mt-4 bg-white p-3 rounded border border-gray-200">
                                                    {order.shippingMethod ? (
                                                        <>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <Truck size={16} className="text-blue-600" />
                                                                <span className="font-bold text-sm text-blue-800">En Camino vía {order.shippingMethod}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                                <Calendar size={14} />
                                                                <span>Entrega Estimada: {order.estimatedArrival}</span>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="flex items-center gap-2 text-yellow-600 text-sm">
                                                            <Package size={16} />
                                                            <span>Procesando envío...</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`inline-block px-3 py-1 rounded uppercase font-bold text-xs ${order.status === 'shipped' ? 'bg-green-200 text-green-900' : order.status === 'delivered' ? 'bg-blue-200 text-blue-900' : 'bg-yellow-200 text-yellow-900'}`}>
                                                    {order.status === 'shipped' ? 'Enviado' : order.status === 'delivered' ? 'Entregado' : 'En Proceso'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* APPOINTMENTS */}
                    {activeTab === 'appointments' && (
                        <div>
                            <h2 className="text-2xl font-bold uppercase mb-6 border-b pb-4 text-black">Mis Citas con Queen Touch</h2>
                            {userAppointments.length === 0 ? <p className="text-gray-500">No tienes citas programadas.</p> : (
                                <div className="space-y-4">
                                    {userAppointments.map(appt => (
                                        <div key={appt.id} className={`border p-4 rounded flex justify-between items-center ${appt.status === 'cancelled' ? 'bg-red-50 border-red-100' : 'bg-white border-gray-200'}`}>
                                            <div>
                                                <h4 className="font-bold text-black uppercase mb-1">Reunión: {appt.topic}</h4>
                                                <p className="text-sm text-gray-600 flex items-center gap-2"><Calendar size={14} /> {appt.date} - <Clock size={14} /> {appt.time}</p>
                                                <p className="text-xs font-bold mt-2 uppercase text-gray-500">Estado: {appt.status}</p>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                {appt.status === 'scheduled' && (
                                                    <>
                                                        <button onClick={() => updateAppointment(appt.id, 'confirmed')} className="bg-green-500 text-white px-4 py-2 rounded text-xs font-bold uppercase">Confirmar</button>
                                                        <button onClick={() => updateAppointment(appt.id, 'cancelled')} className="bg-red-500 text-white px-4 py-2 rounded text-xs font-bold uppercase">Cancelar</button>
                                                    </>
                                                )}
                                                {appt.status === 'confirmed' && (
                                                    <span className="text-green-600 font-bold uppercase text-xs flex items-center gap-1"><Check size={14} /> Confirmada</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* SUPPORT */}
                    {activeTab === 'support' && (
                        <div>
                            <h2 className="text-2xl font-bold uppercase mb-6 border-b pb-4 text-black">Centro de Ayuda y PQRS</h2>
                            <form className="max-w-lg mb-8" onSubmit={(e) => { e.preventDefault(); createTicket(pqrsSubject, pqrsMsg); showNotification('Ticket creado', 'success'); setPqrsMsg(''); }}>
                                <div className="mb-4">
                                    <label className="block text-xs font-bold uppercase mb-2 text-gray-700">Asunto</label>
                                    <select className="w-full border border-gray-300 p-3 bg-white rounded text-black" value={pqrsSubject} onChange={e => setPqrsSubject(e.target.value)}>
                                        <option value="">Selecciona un motivo</option>
                                        <option>Reportar producto dañado</option>
                                        <option>Solicitud de garantía</option>
                                        <option>Problemas de facturación</option>
                                        <option>Sugerencia</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-xs font-bold uppercase mb-2 text-gray-700">Mensaje</label>
                                    <textarea className="w-full border border-gray-300 p-3 bg-white rounded text-black" rows={5} required value={pqrsMsg} onChange={e => setPqrsMsg(e.target.value)}></textarea>
                                </div>
                                <button className="bg-black text-white px-8 py-3 font-bold uppercase rounded hover:bg-gray-800">Enviar Solicitud</button>
                            </form>

                            <h3 className="font-bold uppercase text-sm mb-4">Mis Tickets</h3>
                            <div className="space-y-2">
                                {tickets.filter(t => t.userId === user?.email).map(t => (
                                    <div key={t.id} className="border p-4 rounded bg-gray-50 text-sm">
                                        <div className="flex justify-between font-bold">
                                            <span>{t.subject}</span>
                                            <span className={t.status === 'open' ? 'text-red-500' : 'text-green-500'}>{t.status}</span>
                                        </div>
                                        <p className="text-gray-600 mt-1">{t.message}</p>
                                        {t.response && (
                                            <div className="mt-2 pl-4 border-l-2 border-green-500">
                                                <p className="text-xs font-bold text-green-700">Respuesta:</p>
                                                <p className="text-gray-700">{t.response}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SETTINGS / RESIGN */}
                    {activeTab === 'settings' && (
                        <div>
                            <h2 className="text-2xl font-bold uppercase mb-6 border-b pb-4 text-black">Configuración de Cuenta</h2>

                            <div className="bg-red-50 border border-red-200 p-6 rounded">
                                <h3 className="font-bold text-red-700 uppercase mb-2">Zona de Peligro</h3>
                                <p className="text-sm text-red-900 mb-4">Si deseas dejar de ser distribuidor de Queen Touch, puedes renunciar aquí. Perderás acceso a precios mayoristas y tu historial de distribuidor.</p>

                                {!showResignModal ? (
                                    <button onClick={() => setShowResignModal(true)} className="bg-red-600 text-white px-4 py-2 font-bold uppercase rounded text-xs hover:bg-red-700">
                                        Renunciar a la Distribución
                                    </button>
                                ) : (
                                    <form onSubmit={handleResign} className="bg-white p-4 rounded border border-red-200">
                                        <label className="block text-xs font-bold uppercase mb-2">Por favor cuéntanos por qué te vas:</label>
                                        <textarea
                                            className="w-full border p-2 text-sm mb-4 rounded"
                                            rows={3}
                                            required
                                            value={resignReason}
                                            onChange={e => setResignReason(e.target.value)}
                                        ></textarea>
                                        <div className="flex gap-2">
                                            <button type="button" onClick={() => setShowResignModal(false)} className="bg-gray-200 text-black px-4 py-2 text-xs font-bold uppercase rounded">Cancelar</button>
                                            <button type="submit" className="bg-red-600 text-white px-4 py-2 text-xs font-bold uppercase rounded">Confirmar Renuncia</button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const Distributors = () => {
    const { user, getUserApplicationStatus } = useStore();
    const [showApplication, setShowApplication] = useState(false);
    const navigate = useNavigate();

    // If user is a distributor, show dashboard immediately
    if (user?.role === 'distributor') {
        return <DistributorDashboard />;
    }

    // If user is applying, show form
    if (showApplication) {
        return <ApplicationForm onCancel={() => setShowApplication(false)} />;
    }

    // Determine application status to show appropriate UI message
    const appStatus = user ? getUserApplicationStatus(user.email) : 'none';

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <div className="relative w-full h-[50vh] bg-black overflow-hidden flex items-center justify-center text-center">
                <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1920&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                <div className="relative z-10 p-4 max-w-4xl mx-auto text-white animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-widest mb-4">Red de Distribuidores</h1>
                    <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto font-light">
                        Lleva la experiencia Queen Touch a tu ciudad. Únete a nuestra red exclusiva de partners y haz crecer tu negocio con productos de alta demanda.
                    </p>

                    {appStatus === 'pending' ? (
                        <div className="bg-yellow-500/20 border border-yellow-500 p-4 rounded inline-block backdrop-blur-sm">
                            <p className="font-bold uppercase flex items-center gap-2 text-yellow-300"><Clock size={20} /> Tu solicitud está en revisión</p>
                            <p className="text-xs text-yellow-200 mt-1">Te contactaremos pronto.</p>
                        </div>
                    ) : appStatus === 'rejected' ? (
                        <div className="bg-red-500/20 border border-red-500 p-4 rounded inline-block backdrop-blur-sm">
                            <p className="font-bold uppercase text-red-300">Solicitud no aprobada</p>
                            <p className="text-xs text-red-200 mt-1">Contacta soporte para más info.</p>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowApplication(true)}
                            className="bg-white text-black px-8 py-4 uppercase font-bold tracking-widest hover:bg-gray-200 transition transform hover:scale-105 shadow-xl flex items-center gap-2 mx-auto"
                        >
                            Convertirme en Distribuidor <ArrowRight size={20} />
                        </button>
                    )}
                </div>
            </div>

            {/* Distributors List */}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold uppercase mb-4 tracking-widest">Puntos de Venta Autorizados</h2>
                    <div className="w-24 h-1 bg-black mx-auto mb-4"></div>
                    <p className="text-gray-500">Encuentra los productos originales Queen Touch cerca de ti.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {distributors.map((d, idx) => (
                        <div key={idx} className="bg-gray-50 p-8 rounded-lg border border-gray-100 text-center hover:shadow-lg transition group relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                                <MapPin size={24} />
                            </div>
                            <h3 className="text-xl font-bold uppercase mb-4">{d.city}</h3>
                            <ul className="space-y-3 text-gray-600 text-sm">
                                {d.list.map((item, i) => (
                                    <li key={i} className="flex items-center justify-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Benefits Section for potential distributors */}
            {!user || user.role !== 'distributor' ? (
                <div className="bg-zinc-900 text-white py-16 md:py-24">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row items-center gap-12">
                            <div className="md:w-1/2">
                                <h2 className="text-3xl md:text-4xl font-bold uppercase mb-6 leading-tight">¿Por qué distribuir<br />Queen Touch?</h2>
                                <p className="text-gray-400 mb-8 leading-relaxed">
                                    Más que productos, ofrecemos un modelo de negocio probado. Al unirte a nuestra red, accedes a un ecosistema diseñado para tu éxito.
                                </p>
                                <ul className="space-y-4">
                                    <li className="flex gap-4">
                                        <div className="bg-white/10 p-2 rounded text-yellow-500"><DollarSign size={20} /></div>
                                        <div>
                                            <h4 className="font-bold uppercase">Márgenes Superiores</h4>
                                            <p className="text-sm text-gray-500">Rentabilidad desde el 40% al 60%.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="bg-white/10 p-2 rounded text-blue-500"><TrendingUp size={20} /></div>
                                        <div>
                                            <h4 className="font-bold uppercase">Alta Rotación</h4>
                                            <p className="text-sm text-gray-500">Productos virales en redes sociales.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="bg-white/10 p-2 rounded text-purple-500"><Shield size={20} /></div>
                                        <div>
                                            <h4 className="font-bold uppercase">Exclusividad de Zona</h4>
                                            <p className="text-sm text-gray-500">Protegemos tu área de influencia.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="md:w-1/2 relative">
                                <div className="aspect-square bg-white/5 rounded-full absolute -top-10 -right-10 w-64 h-64 blur-3xl"></div>
                                <div className="relative z-10 bg-white text-black p-8 md:p-12 rounded-lg shadow-2xl">
                                    <h3 className="text-2xl font-bold uppercase mb-4 text-center">Inicia tu Solicitud</h3>
                                    <p className="text-center text-gray-600 mb-8 text-sm">
                                        Completa el formulario y uno de nuestros asesores comerciales evaluará tu perfil en menos de 48 horas.
                                    </p>
                                    <button
                                        onClick={() => setShowApplication(true)}
                                        className="w-full bg-black text-white py-4 uppercase font-bold tracking-widest hover:bg-zinc-800 transition shadow-lg flex items-center justify-center gap-2"
                                    >
                                        Aplicar Ahora <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};
