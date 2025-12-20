import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    // Simulate Login
    login(email);
    
    // If admin
    if (email === 'admin@queentouch.com') {
      navigate('/admin');
    } else {
      navigate('/membership');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 uppercase tracking-widest">
            Queen Touch
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Inicia sesión para acceder a tu cuenta o suscripción.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Correo Electrónico</label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                placeholder="Correo Electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="text-xs text-gray-500 bg-gray-100 p-4 rounded">
            <p className="font-bold mb-1">Usuarios de Prueba (Cualquier contraseña):</p>
            <ul className="space-y-1">
                <li>• admin@queentouch.com (Administrador)</li>
                <li>• bronze@queentouch.com (Miembro Bronce)</li>
                <li>• silver@queentouch.com (Miembro Plata)</li>
                <li>• gold@queentouch.com (Miembro Oro)</li>
                <li>• user@test.com (Nuevo Usuario)</li>
            </ul>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-black hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black uppercase tracking-widest"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
