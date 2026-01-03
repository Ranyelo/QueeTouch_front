import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';

export const Login = () => {
  const [viewState, setViewState] = useState<'login' | 'register' | 'forgot' | 'verification'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const { login, verifyEmail, requestPasswordReset, confirmPasswordReset } = useStore();
  const navigate = useNavigate();

  // Reset Password State
  const [resetStep, setResetStep] = useState<1 | 2>(1);
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (viewState === 'forgot') {
      if (resetStep === 1) {
        // Step 1: Request Code
        const success = await requestPasswordReset(email);
        if (success) setResetStep(2);
      } else {
        // Step 2: Confirm Reset
        if (!verificationCode || !newPassword) return;
        const success = await confirmPasswordReset(email, verificationCode, newPassword);
        if (success) {
          setViewState('login');
          setResetStep(1);
          setVerificationCode('');
          setNewPassword('');
          setPassword('');
        }
      }
      return;
    }

    if (viewState === 'verification') {
      if (!verificationCode) return;
      const success = await verifyEmail(email, verificationCode);
      if (success) {
        // Redirect
        if (email === 'admin@queentouch.com') {
          navigate('/admin');
        } else {
          navigate('/membership');
        }
      }
      return;
    }

    if (!password) return;
    if (viewState === 'register' && !name) return;

    // Attempt Login or Registration
    const result = await login(email, password, viewState === 'register' ? name : undefined);

    if (result === 'needs_verification') {
      setViewState('verification');
      return;
    }

    if (result === true) {
      if (email === 'admin@queentouch.com') {
        navigate('/admin');
      } else if (email === 'demo@distribuidor.com') {
        navigate('/distributors');
      } else {
        navigate('/membership');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <img src="https://images.unsplash.com/photo-1632516643720-e7f5d7d6ecc9?q=80&w=1920&auto=format&fit=crop" className="w-full h-full object-cover grayscale" />
      </div>

      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-2xl z-10 animate-in fade-in zoom-in duration-300">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-black uppercase tracking-widest mb-2">
            Queen Touch
          </h2>
          <p className="text-sm text-gray-500 uppercase tracking-wide">
            {viewState === 'register' ? 'Crear Nueva Cuenta' : viewState === 'forgot' ? (resetStep === 1 ? 'Recuperar Contraseña' : 'Nueva Contraseña') : viewState === 'verification' ? 'Verificar Cuenta' : 'Bienvenido de nuevo'}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">

            {viewState === 'register' && (
              <div className="relative">
                <label className="text-xs font-bold uppercase text-gray-700 mb-1 block">Nombre Completo</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-black focus:border-black sm:text-sm bg-gray-50"
                    placeholder="Tu Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <User className="absolute left-3 top-3 text-gray-400" size={18} />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold uppercase text-gray-700 mb-1 block">Correo Electrónico</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  className={`appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-black focus:border-black sm:text-sm bg-gray-50 ${viewState !== 'login' && viewState !== 'register' && viewState !== 'forgot' ? 'bg-gray-200 cursor-not-allowed opacity-75' : ''}`}
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  readOnly={viewState === 'verification' || (viewState === 'forgot' && resetStep === 2)}
                />
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              </div>
            </div>

            {/* Standard Password Input (Login/Register) */}
            {viewState !== 'forgot' && viewState !== 'verification' && (
              <div>
                <label className="text-xs font-bold uppercase text-gray-700 mb-1 block">Contraseña</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-black focus:border-black sm:text-sm bg-gray-50"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                </div>
              </div>
            )}

            {/* Verification Code Input (Email Verify OR Reset Password Step 2) */}
            {(viewState === 'verification' || (viewState === 'forgot' && resetStep === 2)) && (
              <div>
                <label className="text-xs font-bold uppercase text-gray-700 mb-1 block">Código de Verificación</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-black focus:border-black sm:text-sm bg-gray-50 tracking-[0.5em] text-center font-mono"
                    placeholder="000000"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                  />
                  <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                </div>
                <p className="text-xs text-gray-500 mt-2">Hemos enviado un código a {email}</p>
              </div>
            )}

            {/* New Password Input (Reset Step 2) */}
            {viewState === 'forgot' && resetStep === 2 && (
              <div>
                <label className="text-xs font-bold uppercase text-gray-700 mb-1 block">Nueva Contraseña</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-black focus:border-black sm:text-sm bg-gray-50"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                </div>
              </div>
            )}
          </div>

          {viewState === 'login' && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Recordarme
                </label>
              </div>

              <div className="text-sm">
                <button type="button" onClick={() => { setViewState('forgot'); setResetStep(1); }} className="font-medium text-gray-600 hover:text-black hover:underline">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </div>
          )}

          {/* Test Users Hint - Hidden in Forgot/Verify to reduce clutter */}
          {viewState === 'login' && (
            <div className="text-[10px] text-gray-500 bg-gray-100 p-4 rounded border border-gray-200">
              <p className="font-bold mb-1 uppercase">Usuarios de Prueba (Pass: cualquiera):</p>
              <ul className="grid grid-cols-2 gap-x-2 gap-y-1">
                <li>• admin@queentouch.com</li>
                <li className="text-purple-700 font-bold">• demo@distribuidor.com</li>
                <li>• gold@queentouch.com</li>
                <li>• silver@queentouch.com</li>
                <li>• bronze@queentouch.com</li>
                <li>(O regístrate con tu email)</li>
              </ul>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-black hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black uppercase tracking-widest shadow-lg transform transition hover:scale-[1.02]"
            >
              {viewState === 'register' ? 'Registrarse' : viewState === 'forgot' ? (resetStep === 1 ? 'Enviar Código' : 'Cambiar Contraseña') : viewState === 'verification' ? 'Verificar' : 'Entrar'} <ArrowRight size={16} className="ml-2" />
            </button>

            {viewState !== 'login' && (
              <button
                type="button"
                onClick={() => setViewState('login')}
                className="flex items-center justify-center text-xs font-bold uppercase text-gray-500 hover:text-black mt-2"
              >
                <ArrowLeft size={12} className="mr-1" /> Volver al Login
              </button>
            )}
          </div>
        </form>

        {viewState === 'login' && (
          <div className="text-center mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              ¿Aún no eres miembro?
            </p>
            <button
              onClick={() => setViewState('register')}
              className="text-black font-bold uppercase text-sm mt-1 hover:underline tracking-wide"
            >
              Regístrate Gratis
            </button>
          </div>
        )}
      </div>
    </div>
  );
};