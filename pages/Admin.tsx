import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Image as ImageIcon, CheckCircle, XCircle, Briefcase, Package, Users, MessageSquare, Calendar, Home, Box, Truck, LogOut, ArrowLeft, Save, Edit2, X } from 'lucide-react';
import { Product } from '../types';

export const AdminDashboard = () => {
  const { 
    user, products, addProduct, deleteProduct, 
    distributorApplications, reviewDistributorApplication,
    orders, updateOrderShipping, deleteOrder,
    tickets, respondTicket,
    appointments, scheduleAppointment, updateAppointment
  } = useStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Specific State for Sub-features
  const [responseMsg, setResponseMsg] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  
  // Order State
  const [shippingMethod, setShippingMethod] = useState('');
  const [shippingEta, setShippingEta] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  // Appointment State
  const [apptDate, setApptDate] = useState('');
  const [apptTime, setApptTime] = useState('');
  const [apptTopic, setApptTopic] = useState('');
  const [selectedDistributor, setSelectedDistributor] = useState('');
  const [editingAppt, setEditingAppt] = useState<string | null>(null);

  // Form State for New Product
  const [formData, setFormData] = useState<Partial<Product> & { imageUrl: string }>({
    name: '',
    price: 0,
    description: '',
    category: 'esmaltes',
    subcategory: '',
    imageUrl: '', 
    colors: []
  });

  const CATEGORY_OPTIONS = [
      { id: 'esmaltes', name: 'Esmaltes' },
      { id: 'pinceles', name: 'Pinceles' },
      { id: 'geles', name: 'Geles' },
      { id: 'decoracion', name: 'Decoración' },
      { id: 'combos', name: 'Combos' },
      { id: 'equipos', name: 'Equipos' },
      { id: 'sistema_aplicacion', name: 'Sistema de Aplicación' },
      { id: 'spa', name: 'Spa' },
      { id: 'herramientas', name: 'Herramientas' },
      { id: 'implementos', name: 'Implementos' },
      { id: 'accesorios', name: 'Accesorios' },
  ];

  // Protect Route
  if (!user || !user.isAdmin) {
    return (
      <div className="h-screen flex items-center justify-center flex-col">
        <h1 className="text-2xl font-bold mb-4">Acceso Denegado</h1>
        <button onClick={() => navigate('/')} className="text-blue-600 underline">Volver al inicio</button>
      </div>
    );
  }

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.imageUrl) {
        alert("Por favor completa nombre, precio e imagen");
        return;
    }
    
    const newProduct: Product = {
      id: `p-${Date.now()}`,
      name: formData.name!,
      price: Number(formData.price),
      description: formData.description || '',
      category: formData.category || 'esmaltes',
      subcategory: formData.subcategory || 'general',
      images: [formData.imageUrl], 
      colors: formData.colors || [],
      stock: 10 // Default stock
    };

    addProduct(newProduct);
    setActiveTab('inventory');
    setFormData({ name: '', price: 0, description: '', category: 'esmaltes', subcategory: '', imageUrl: '', colors: [] }); 
    alert('Producto agregado exitosamente al inventario.');
  };

  const handleUpdateAppointment = (id: string) => {
      updateAppointment(id, 'scheduled', apptDate, apptTime);
      setEditingAppt(null);
      setApptDate('');
      setApptTime('');
      alert('Cita reprogramada');
  };

  // --- Sub-Component Renders ---

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
         <div className="flex items-center gap-4">
           <div className="bg-blue-100 p-3 rounded-full text-blue-600"><Users size={24}/></div>
           <div>
             <p className="text-gray-500 text-xs uppercase font-bold">Solicitudes Pendientes</p>
             <h3 className="text-2xl font-bold">{distributorApplications.filter(a => a.status === 'pending').length}</h3>
           </div>
         </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
         <div className="flex items-center gap-4">
           <div className="bg-green-100 p-3 rounded-full text-green-600"><Package size={24}/></div>
           <div>
             <p className="text-gray-500 text-xs uppercase font-bold">Pedidos Activos</p>
             <h3 className="text-2xl font-bold">{orders.filter(o => o.status === 'processing' || o.status === 'shipped').length}</h3>
           </div>
         </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
         <div className="flex items-center gap-4">
           <div className="bg-purple-100 p-3 rounded-full text-purple-600"><MessageSquare size={24}/></div>
           <div>
             <p className="text-gray-500 text-xs uppercase font-bold">Tickets Abiertos</p>
             <h3 className="text-2xl font-bold">{tickets.filter(t => t.status === 'open').length}</h3>
           </div>
         </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
         <div className="flex items-center gap-4">
           <div className="bg-yellow-100 p-3 rounded-full text-yellow-600"><Box size={24}/></div>
           <div>
             <p className="text-gray-500 text-xs uppercase font-bold">Productos en Stock</p>
             <h3 className="text-2xl font-bold">{products.length}</h3>
           </div>
         </div>
      </div>
    </div>
  );

  const renderDistributors = () => (
    <div className="space-y-8">
       {/* Applications */}
       <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-bold uppercase text-lg mb-4 flex items-center gap-2"><Briefcase size={20}/> Solicitudes de Distribución</h3>
          {distributorApplications.filter(a => a.status === 'pending').length === 0 ? (
             <p className="text-gray-400 text-sm">No hay solicitudes pendientes.</p>
          ) : (
             <div className="space-y-4">
               {distributorApplications.filter(a => a.status === 'pending').map(app => (
                 <div key={app.id} className="border p-4 rounded bg-gray-50 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-black">{app.businessName} <span className="text-xs font-normal text-gray-500">({app.city})</span></h4>
                      <p className="text-xs text-gray-500">Inversión: {app.capital} | Tel: {app.phone}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => reviewDistributorApplication(app.id, 'approved')} className="bg-green-500 text-white p-2 rounded hover:bg-green-600"><CheckCircle size={16}/></button>
                      <button onClick={() => reviewDistributorApplication(app.id, 'rejected')} className="bg-red-500 text-white p-2 rounded hover:bg-red-600"><XCircle size={16}/></button>
                    </div>
                 </div>
               ))}
             </div>
          )}
       </div>

       {/* Appointment Scheduler */}
       <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-bold uppercase text-lg mb-4 flex items-center gap-2"><Calendar size={20}/> Gestión de Citas</h3>
          
          {/* Create New Appointment Form */}
          <div className="bg-gray-50 p-4 rounded mb-6 border border-gray-200">
              <h4 className="text-xs font-bold uppercase mb-2">Agendar Nueva Cita</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <select className="border p-2 rounded bg-white text-black" value={selectedDistributor} onChange={e => setSelectedDistributor(e.target.value)}>
                    <option value="">Seleccionar Distribuidor</option>
                    {distributorApplications.filter(a => a.status === 'approved').map(d => (
                    <option key={d.id} value={d.userId}>{d.businessName} ({d.userId})</option>
                    ))}
                </select>
                <input type="date" className="border p-2 rounded bg-white text-black" value={apptDate} onChange={e => setApptDate(e.target.value)}/>
                <input type="time" className="border p-2 rounded bg-white text-black" value={apptTime} onChange={e => setApptTime(e.target.value)}/>
                <button 
                    onClick={() => {
                    if(!selectedDistributor || !apptDate) return;
                    scheduleAppointment(selectedDistributor, apptDate, apptTime, apptTopic || 'Reunión General');
                    setApptTopic('');
                    alert('Cita Agendada');
                    }}
                    className="bg-black text-white font-bold uppercase rounded hover:bg-zinc-800"
                >Agendar</button>
              </div>
              <input 
                type="text" 
                placeholder="Tema de la reunión (opcional)" 
                className="w-full border p-2 rounded bg-white text-black"
                value={apptTopic}
                onChange={e => setApptTopic(e.target.value)}
              />
          </div>

          <div className="mt-6">
            <h4 className="font-bold text-xs uppercase mb-2 text-gray-500">Citas Programadas</h4>
            {appointments.length === 0 ? <p className="text-sm text-gray-400">No hay citas.</p> : appointments.map(appt => (
              <div key={appt.id} className="text-sm border p-4 rounded mb-2 bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                 <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2 h-2 rounded-full ${appt.status === 'confirmed' ? 'bg-green-500' : appt.status === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                        <span className="font-bold text-black uppercase">{appt.status === 'scheduled' ? 'Programada' : appt.status === 'confirmed' ? 'Confirmada' : 'Cancelada'}</span>
                    </div>
                    {editingAppt === appt.id ? (
                        <div className="flex gap-2 my-2">
                            <input type="date" className="border p-1 text-xs bg-white text-black" value={apptDate} onChange={e => setApptDate(e.target.value)} />
                            <input type="time" className="border p-1 text-xs bg-white text-black" value={apptTime} onChange={e => setApptTime(e.target.value)} />
                        </div>
                    ) : (
                        <p className="text-black">{appt.date} a las {appt.time}</p>
                    )}
                    <p className="text-gray-500 text-xs">Con: {appt.distributorId}</p>
                    <p className="text-gray-500 text-xs">Tema: {appt.topic}</p>
                 </div>
                 
                 <div className="flex gap-2">
                    {editingAppt === appt.id ? (
                        <>
                            <button onClick={() => handleUpdateAppointment(appt.id)} className="bg-green-600 text-white px-3 py-1 rounded text-xs uppercase font-bold">Guardar</button>
                            <button onClick={() => setEditingAppt(null)} className="bg-gray-300 text-black px-3 py-1 rounded text-xs uppercase font-bold">Cancelar</button>
                        </>
                    ) : (
                        <>
                            {appt.status !== 'cancelled' && (
                                <button 
                                    onClick={() => { setEditingAppt(appt.id); setApptDate(appt.date); setApptTime(appt.time); }} 
                                    className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-3 py-1 rounded text-xs uppercase font-bold flex items-center gap-1"
                                >
                                    <Edit2 size={12}/> Reprogramar
                                </button>
                            )}
                            {appt.status !== 'cancelled' && (
                                <button 
                                    onClick={() => updateAppointment(appt.id, 'cancelled')} 
                                    className="border border-red-600 text-red-600 hover:bg-red-50 px-3 py-1 rounded text-xs uppercase font-bold flex items-center gap-1"
                                >
                                    <X size={12}/> Cancelar
                                </button>
                            )}
                        </>
                    )}
                 </div>
              </div>
            ))}
          </div>
       </div>
    </div>
  );

  const renderOrders = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm">
       <h3 className="font-bold uppercase text-lg mb-6 flex items-center gap-2"><Package size={20}/> Gestión de Pedidos</h3>
       <div className="overflow-x-auto">
         <table className="w-full text-sm text-left">
           <thead className="bg-gray-100 uppercase font-bold text-xs">
             <tr>
               <th className="p-3">ID Pedido</th>
               <th className="p-3">Usuario</th>
               <th className="p-3">Total</th>
               <th className="p-3">Estado</th>
               <th className="p-3">Acción</th>
               <th className="p-3">Eliminar</th>
             </tr>
           </thead>
           <tbody>
             {orders.map(order => (
               <tr key={order.id} className="border-b">
                 <td className="p-3 font-bold text-black">{order.id}</td>
                 <td className="p-3 text-black">{order.userId}</td>
                 <td className="p-3 text-black">${order.total.toLocaleString()}</td>
                 <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs uppercase font-bold ${
                        order.status === 'delivered' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'shipped' ? 'bg-green-100 text-green-800' : 
                        'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status === 'processing' ? 'Procesando' : order.status === 'shipped' ? 'En Camino' : 'Entregado'}
                    </span>
                 </td>
                 <td className="p-3">
                    {selectedOrder === order.id ? (
                      <div className="flex flex-col gap-2 min-w-[150px]">
                        <select 
                            className="border p-1 text-xs bg-white text-black" 
                            onChange={(e) => {
                                const newStatus = e.target.value as any;
                                updateOrderShipping(order.id, newStatus, shippingMethod, shippingEta);
                                setSelectedOrder(null);
                            }}
                        >
                            <option value="">Cambiar estado...</option>
                            <option value="processing">Procesando</option>
                            <option value="shipped">En Camino</option>
                            <option value="delivered">Entregado</option>
                        </select>
                        <input type="text" placeholder="Transportadora" className="border p-1 text-xs bg-white text-black" value={shippingMethod} onChange={e => setShippingMethod(e.target.value)} />
                        <input type="date" className="border p-1 text-xs bg-white text-black" value={shippingEta} onChange={e => setShippingEta(e.target.value)} />
                        <button onClick={() => setSelectedOrder(null)} className="text-xs text-red-500 underline">Cancelar</button>
                      </div>
                    ) : (
                      <button onClick={() => setSelectedOrder(order.id)} className="text-blue-600 underline text-xs font-bold uppercase">Actualizar Estado</button>
                    )}
                 </td>
                 <td className="p-3">
                     <button onClick={() => { if(confirm('¿Eliminar este pedido?')) deleteOrder(order.id) }} className="text-red-500 hover:bg-red-50 p-2 rounded">
                         <Trash2 size={16}/>
                     </button>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
    </div>
  );

  const renderTickets = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="font-bold uppercase text-lg mb-6 flex items-center gap-2"><MessageSquare size={20}/> Soporte y PQRS</h3>
      <div className="space-y-4">
        {tickets.map(ticket => (
          <div key={ticket.id} className="border rounded p-4">
             <div className="flex justify-between mb-2">
               <h4 className="font-bold text-sm uppercase text-black">{ticket.subject} <span className="text-gray-400 normal-case font-normal">de {ticket.userId}</span></h4>
               <span className={`text-xs px-2 py-1 rounded uppercase ${ticket.status === 'open' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>{ticket.status}</span>
             </div>
             <p className="text-gray-700 text-sm mb-4 bg-gray-50 p-2 rounded">{ticket.message}</p>
             
             {ticket.response ? (
               <div className="bg-green-50 p-2 rounded text-sm border-l-4 border-green-500">
                 <p className="font-bold text-green-800 text-xs uppercase mb-1">Respuesta Admin:</p>
                 <p className="text-gray-700">{ticket.response}</p>
               </div>
             ) : (
               <div className="mt-2">
                 {selectedTicket === ticket.id ? (
                    <div>
                      <textarea 
                        className="w-full border p-2 text-sm mb-2 bg-white text-black" 
                        rows={3}
                        value={responseMsg}
                        onChange={e => setResponseMsg(e.target.value)}
                        placeholder="Escribe tu respuesta..."
                      ></textarea>
                      <button 
                        onClick={() => {
                          respondTicket(ticket.id, responseMsg);
                          setSelectedTicket(null);
                          setResponseMsg('');
                        }}
                        className="bg-black text-white px-4 py-2 text-xs font-bold uppercase rounded"
                      >Enviar Respuesta</button>
                    </div>
                 ) : (
                    <button onClick={() => setSelectedTicket(ticket.id)} className="text-blue-600 font-bold text-xs uppercase hover:underline">Responder</button>
                 )}
               </div>
             )}
          </div>
        ))}
        {tickets.length === 0 && <p className="text-gray-400 text-sm">No hay tickets de soporte.</p>}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      {/* Sidebar */}
      <div className="w-64 bg-black text-white flex flex-col fixed h-full z-10">
         <div className="p-8">
            <h1 className="text-2xl font-bold uppercase tracking-widest">Queen<br/>Touch</h1>
            <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Admin Panel</p>
         </div>
         <nav className="flex-1 px-4 space-y-2">
            {[
              { id: 'overview', icon: <Home size={18}/>, label: 'Resumen' },
              { id: 'orders', icon: <Package size={18}/>, label: 'Pedidos' },
              { id: 'distributors', icon: <Briefcase size={18}/>, label: 'Distribuidores' },
              { id: 'tickets', icon: <MessageSquare size={18}/>, label: 'Soporte PQRS' },
              { id: 'inventory', icon: <Box size={18}/>, label: 'Inventario' },
            ].map(item => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 text-sm font-bold uppercase rounded transition ${activeTab === item.id ? 'bg-white text-black' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
              >
                {item.icon} {item.label}
              </button>
            ))}
         </nav>
         <div className="p-4 border-t border-gray-800">
            <button onClick={() => navigate('/')} className="text-gray-500 text-xs uppercase hover:text-white flex items-center gap-2">
               <LogOut size={14}/> Volver a la Tienda
            </button>
         </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">
         <header className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold uppercase tracking-wide text-gray-800">
              {activeTab === 'overview' && 'Panel General'}
              {activeTab === 'orders' && 'Control de Pedidos'}
              {activeTab === 'distributors' && 'Gestión Comercial'}
              {activeTab === 'tickets' && 'Centro de Ayuda'}
              {activeTab === 'inventory' && 'Inventario de Productos'}
              {activeTab === 'add_product' && 'Agregar Nuevo Producto'}
            </h2>
            <div className="flex items-center gap-3">
               <div className="text-right">
                 <p className="font-bold text-sm text-black">{user.name}</p>
                 <p className="text-xs text-gray-500 uppercase">Administrador</p>
               </div>
               <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                  {user.name.charAt(0)}
               </div>
            </div>
         </header>

         <main>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'distributors' && renderDistributors()}
            {activeTab === 'orders' && renderOrders()}
            {activeTab === 'tickets' && renderTickets()}
            
            {activeTab === 'inventory' && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                 <div className="flex justify-between mb-6">
                    <h3 className="font-bold uppercase text-black">Lista de Productos</h3>
                    <button 
                        onClick={() => setActiveTab('add_product')} 
                        className="bg-black text-white px-4 py-2 text-xs font-bold uppercase rounded flex items-center gap-2 hover:bg-zinc-800"
                    >
                        <Plus size={16}/> Agregar Nuevo
                    </button>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map(p => (
                       <div key={p.id} className="border p-4 rounded flex gap-4 items-center">
                          <img src={p.images[0]} className="w-16 h-16 object-cover bg-gray-100 rounded" />
                          <div className="flex-1">
                             <h4 className="font-bold text-sm text-black">{p.name}</h4>
                             <p className="text-xs text-gray-500 uppercase">{p.category}</p>
                             <p className="text-xs text-gray-500">Stock: {p.stock}</p>
                          </div>
                          <button onClick={() => deleteProduct(p.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={16}/></button>
                       </div>
                    ))}
                 </div>
              </div>
            )}

            {activeTab === 'add_product' && (
                <div className="max-w-2xl bg-white p-8 shadow-lg rounded-lg mx-auto">
                    <button onClick={() => setActiveTab('inventory')} className="text-gray-500 text-sm mb-6 flex items-center gap-2 hover:text-black">
                        <ArrowLeft size={16}/> Volver al Inventario
                    </button>
                    <form onSubmit={handleAddProduct} className="space-y-6">
                        
                        {/* Image Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Imagen del Producto (URL)</label>
                            <div className="flex gap-4 items-start">
                                <div className="flex-1">
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <ImageIcon size={16} className="text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            className="focus:ring-black focus:border-black block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-3 border bg-white text-black"
                                            placeholder="https://ejemplo.com/imagen.jpg"
                                            value={formData.imageUrl}
                                            onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">Pega un enlace directo a una imagen.</p>
                                </div>
                                <div className="w-20 h-20 bg-gray-100 border rounded flex items-center justify-center overflow-hidden">
                                    {formData.imageUrl ? (
                                        <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Preview" onError={(e) => (e.currentTarget.src = '')} />
                                    ) : (
                                        <span className="text-xs text-gray-400">Vista</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
                            <input type="text" className="mt-1 block w-full border border-gray-300 p-2 rounded bg-white text-black" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Precio</label>
                                <input type="number" className="mt-1 block w-full border border-gray-300 p-2 rounded bg-white text-black" required value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Categoría</label>
                                <select 
                                    className="mt-1 block w-full border border-gray-300 p-2 rounded capitalize bg-white text-black" 
                                    value={formData.category} 
                                    onChange={e => setFormData({...formData, category: e.target.value})}
                                >
                                    {CATEGORY_OPTIONS.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Subcategoría</label>
                            <input type="text" className="mt-1 block w-full border border-gray-300 p-2 rounded bg-white text-black" placeholder="ej. Lisos, Herramientas (opcional)" value={formData.subcategory} onChange={e => setFormData({...formData, subcategory: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Descripción</label>
                            <textarea className="mt-1 block w-full border border-gray-300 p-2 rounded bg-white text-black" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                        </div>
                        <button type="submit" className="w-full bg-black text-white py-3 font-bold uppercase tracking-widest hover:bg-zinc-800 flex items-center justify-center gap-2">
                            <Save size={18} /> Guardar Producto
                        </button>
                    </form>
                </div>
            )}
         </main>
      </div>
    </div>
  );
};