import React from 'react';
import { useParams } from 'react-router-dom';

export const Legal = () => {
  const { section } = useParams();

  const getTitle = () => {
    switch (section) {
      case 'terms': return 'Términos y Condiciones';
      case 'privacy': return 'Política de Privacidad';
      case 'shipping': return 'Envíos y Devoluciones';
      default: return 'Información Legal';
    }
  };

  const getContent = () => {
    switch (section) {
      case 'terms':
        return (
          <div className="space-y-4 text-gray-600">
            <p>Bienvenido al sitio web de Queen Touch. Al acceder a este sitio, acepta estar sujeto a los siguientes términos y condiciones.</p>
            <h3 className="font-bold text-black uppercase">1. Uso del Sitio</h3>
            <p>Usted se compromete a utilizar este sitio únicamente para fines legales y de una manera que no infrinja los derechos de, ni restrinja o inhiba el uso y disfrute de este sitio por parte de terceros.</p>
            <h3 className="font-bold text-black uppercase">2. Propiedad Intelectual</h3>
            <p>Todo el contenido de este sitio, incluyendo texto, gráficos, logotipos e imágenes, es propiedad de Queen Touch o sus proveedores de contenido y está protegido por las leyes de derechos de autor internacionales.</p>
          </div>
        );
      case 'privacy':
         return (
          <div className="space-y-4 text-gray-600">
            <p>En Queen Touch, nos tomamos muy en serio su privacidad. Esta política describe cómo recopilamos y utilizamos su información personal.</p>
            <h3 className="font-bold text-black uppercase">1. Recopilación de Información</h3>
            <p>Recopilamos información cuando se registra en nuestro sitio, realiza un pedido o se suscribe a nuestro boletín. La información recopilada incluye su nombre, dirección de correo electrónico, dirección postal y número de teléfono.</p>
            <h3 className="font-bold text-black uppercase">2. Uso de la Información</h3>
            <p>Utilizamos la información que recopilamos para procesar transacciones, enviar correos electrónicos periódicos y mejorar su experiencia en nuestro sitio web.</p>
          </div>
         );
      case 'shipping':
         return (
           <div className="space-y-4 text-gray-600">
            <p>Nuestro objetivo es ofrecerle las mejores opciones de envío, sin importar dónde viva.</p>
            <h3 className="font-bold text-black uppercase">1. Tiempos de Envío</h3>
            <p>El tiempo de procesamiento de los pedidos es de 1-2 días hábiles. El envío estándar suele tardar entre 3 y 5 días hábiles en llegar a destinos nacionales.</p>
            <h3 className="font-bold text-black uppercase">2. Devoluciones</h3>
            <p>Aceptamos devoluciones de productos no utilizados y en su embalaje original dentro de los 30 días posteriores a la compra. Por favor, póngase en contacto con nuestro servicio de atención al cliente para iniciar una devolución.</p>
           </div>
         );
      default:
        return <p>Página no encontrada.</p>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-3xl font-bold uppercase mb-8 border-b pb-4">{getTitle()}</h1>
      <div className="leading-relaxed">
        {getContent()}
      </div>
    </div>
  );
};