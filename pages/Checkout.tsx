import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Trash2, CreditCard, Check, ShieldCheck, MessageCircle, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';

const Steps = ({ current }: { current: number }) => (
  <div className="flex justify-center mb-8">
    <div className="flex items-center">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${current >= 1 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
      <div className={`w-16 h-1 ${current >= 2 ? 'bg-black' : 'bg-gray-200'}`}></div>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${current >= 2 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
      <div className={`w-16 h-1 ${current >= 3 ? 'bg-black' : 'bg-gray-200'}`}></div>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${current >= 3 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
    </div>
  </div>
);

export const Checkout = () => {
  const { cart, removeFromCart, cartTotal, discount, applyCoupon, clearCart, shippingDetails, setShippingDetails, user, getWholesalePrice } = useStore();
  const { showNotification } = useNotification();
  const [step, setStep] = useState(1);
  const [couponInput, setCouponInput] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const navigate = useNavigate();

  const isDistributor = user?.role === 'distributor';

  // Pricing Logic
  let subtotal = 0;
  if (isDistributor) {
    // Recalculate using wholesale prices
    subtotal = cart.reduce((total, item) => total + (getWholesalePrice(item.price) * item.quantity), 0);
  } else {
    subtotal = cartTotal;
  }

  const discountAmount = isDistributor ? 0 : subtotal * discount; // No extra discounts for distributors, price is already discounted
  const shippingCost = subtotal > 100000 ? 0 : 15000;
  const finalTotal = subtotal - discountAmount + shippingCost;

  const handleApplyCoupon = () => {
    if (isDistributor) return showNotification("Los cupones no aplican sobre precios mayoristas.", 'info');
    const success = applyCoupon(couponInput);
    if (success) showNotification('Cupón aplicado con éxito', 'success');
    else showNotification('Cupón inválido', 'error');
  };

  const handlePayment = () => {
    setPaymentLoading(true);
    // Simulate API call to Mercado Pago
    setTimeout(() => {
      setPaymentLoading(false);
      clearCart();
      setStep(3); // Success
    }, 2000);
  };

  const handleWhatsAppOrder = () => {
    let message = `*Hola, soy el distribuidor ${user?.name || 'Invitado'}.*\n`;
    message += `Quiero realizar el siguiente pedido:\n\n`;
    cart.forEach(item => {
      message += `- ${item.name} (x${item.quantity}) - $${(getWholesalePrice(item.price) * item.quantity).toLocaleString()}\n`;
      if (item.selectedColor) message += `  Color: ${item.selectedColor}\n`;
    });
    message += `\n*Total Estimado: $${finalTotal.toLocaleString()}*\n`;
    message += `\nMis datos de envío:\n${shippingDetails.fullName || 'Pendiente'}\n${shippingDetails.address || ''}, ${shippingDetails.city || ''}\nTel: ${shippingDetails.phone || ''}`;

    const url = `https://wa.me/573001234567?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    clearCart();
    navigate('/');
  };

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold uppercase mb-4">Tu carrito está vacío</h1>
        <button onClick={() => navigate('/shop')} className="bg-black text-white px-8 py-3 uppercase font-bold">Volver a la tienda</button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold uppercase text-center mb-8 tracking-widest">
        {isDistributor ? 'Pedido Mayorista' : 'Finalizar Compra'}
      </h1>

      {!isDistributor && <Steps current={step} />}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Main Process Column */}
        <div className="md:col-span-2 space-y-8">

          {/* STEP 1: RESUME & SHIPPING */}
          {(step === 1 || isDistributor) && (
            <div className="bg-white p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold uppercase mb-4 border-b pb-2">1. Detalles de Envío</h2>
              <form className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Nombre Completo</label>
                  <input
                    type="text" className="w-full border p-3 bg-gray-50" placeholder="Ej: Maria Gonzalez"
                    value={shippingDetails.fullName} onChange={e => setShippingDetails({ ...shippingDetails, fullName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Dirección de Entrega</label>
                  <input
                    type="text" className="w-full border p-3 bg-gray-50" placeholder="Calle 123 # 45-67"
                    value={shippingDetails.address} onChange={e => setShippingDetails({ ...shippingDetails, address: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Ciudad</label>
                    <input
                      type="text" className="w-full border p-3 bg-gray-50"
                      value={shippingDetails.city} onChange={e => setShippingDetails({ ...shippingDetails, city: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Código Postal</label>
                    <input
                      type="text" className="w-full border p-3 bg-gray-50"
                      value={shippingDetails.zip} onChange={e => setShippingDetails({ ...shippingDetails, zip: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Teléfono</label>
                  <input
                    type="text" className="w-full border p-3 bg-gray-50"
                    value={shippingDetails.phone} onChange={e => setShippingDetails({ ...shippingDetails, phone: e.target.value })}
                  />
                </div>

                {!isDistributor && (
                  <button
                    type="button"
                    onClick={() => {
                      if (!shippingDetails.address) return showNotification('Por favor llena la dirección', 'error');
                      setStep(2);
                    }}
                    className="w-full bg-black text-white py-4 mt-4 uppercase font-bold tracking-widest hover:bg-zinc-800"
                  >
                    Continuar al Pago
                  </button>
                )}
              </form>
            </div>
          )}

          {/* STEP 2: PAYMENT (NORMAL USERS) */}
          {step === 2 && !isDistributor && (
            <div className="bg-white p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold uppercase mb-4 border-b pb-2">2. Método de Pago</h2>
              <div className="mb-6">
                <p className="mb-2 text-sm text-gray-600">Dirección de envío: <strong>{shippingDetails.address}, {shippingDetails.city}</strong></p>
                <button onClick={() => setStep(1)} className="text-xs underline text-gray-500">Cambiar dirección</button>
              </div>

              <div className="space-y-4">
                <button onClick={handlePayment} disabled={paymentLoading} className="w-full flex items-center justify-center gap-3 bg-blue-500 text-white py-4 rounded shadow hover:bg-blue-600 transition">
                  {paymentLoading ? 'Procesando...' : (
                    <>
                      <CreditCard size={20} /> Pagar con Mercado Pago
                    </>
                  )}
                </button>
                <div className="text-center text-xs text-gray-400 flex items-center justify-center gap-2">
                  <ShieldCheck size={16} className="text-green-500" /> Transacción 100% Segura y Encriptada
                </div>
              </div>
            </div>
          )}

          {/* DISTRIBUTOR ACTION: WHATSAPP */}
          {isDistributor && (
            <div className="bg-purple-50 p-6 shadow-lg border border-purple-100">
              <h2 className="text-xl font-bold uppercase mb-4 border-b border-purple-200 pb-2 text-purple-900">2. Confirmación con Asesor</h2>
              <p className="text-sm text-gray-700 mb-6">
                Como distribuidor, tu pedido será gestionado personalmente por un asesor comercial para validar stock mayorista y coordinar la logística de envío masivo.
              </p>
              <button
                onClick={handleWhatsAppOrder}
                className="w-full bg-green-600 text-white py-4 uppercase font-bold tracking-widest hover:bg-green-700 flex items-center justify-center gap-2 shadow-lg"
              >
                <MessageCircle size={24} /> Finalizar Pedido por WhatsApp
              </button>
            </div>
          )}

          {/* STEP 3: SUCCESS (NORMAL USERS) */}
          {step === 3 && (
            <div className="bg-white p-12 shadow-lg border border-green-100 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={40} className="text-green-600" />
              </div>
              <h2 className="text-3xl font-bold uppercase mb-2">¡Pedido Confirmado!</h2>
              <p className="text-gray-600 mb-8">Gracias por tu compra. Hemos enviado los detalles a tu correo electrónico.</p>
              <button onClick={() => navigate('/shop')} className="bg-black text-white px-8 py-3 uppercase font-bold tracking-widest">
                Seguir Comprando
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Summary */}
        {step !== 3 && (
          <div className="md:col-span-1">
            <div className="bg-gray-50 p-6 sticky top-24">
              <h3 className="font-bold uppercase mb-4 border-b border-gray-200 pb-2">Resumen de Orden</h3>
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
                {cart.map(item => {
                  const priceToUse = isDistributor ? getWholesalePrice(item.price) : item.price;
                  return (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name} x {item.quantity}</span>
                      <span>${(priceToUse * item.quantity).toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-2 border-t border-gray-200 pt-4 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                {!isDistributor && discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento ({(discount * 100)}%)</span>
                    <span>-${discountAmount.toLocaleString()}</span>
                  </div>
                )}
                {isDistributor && (
                  <div className="flex justify-between text-purple-600 font-bold">
                    <span>Ahorro Mayorista (40%)</span>
                    <span>Aplicado en precios</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span>{shippingCost === 0 ? 'GRATIS' : `$${shippingCost.toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 mt-2">
                  <span>Total</span>
                  <span>${finalTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Coupons (Only for normal users) */}
              {!isDistributor && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <label className="text-xs font-bold uppercase block mb-2">¿Tienes un cupón?</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="flex-1 border p-2 text-sm uppercase"
                      placeholder="CÓDIGO"
                    />
                    <button onClick={handleApplyCoupon} className="bg-black text-white px-4 py-2 text-xs font-bold uppercase">Aplicar</button>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-2">Prueba: WELCOME10, QUEEN20, GOLDMEMBER</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};