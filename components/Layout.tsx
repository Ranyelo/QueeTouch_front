import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, ShoppingCart, MessageCircle, ChevronUp, MapPin, Phone, Mail, Instagram, Facebook, Youtube, Linkedin, X, User as UserIcon, LogOut, Trash2, Search, Heart, ArrowRight, Globe, Box, GraduationCap, Shield } from 'lucide-react';
import { useStore } from '../context/StoreContext';

// Site Map for Global Search
const SITE_PAGES = [
  { name: 'Inicio', path: '/', type: 'Página' },
  { name: 'Shop', path: '/shop', type: 'Sección' },
  { name: 'Academia Online', path: '/academy/online', type: 'Servicio' },
  { name: 'Academia Presencial', path: '/academy/presencial', type: 'Servicio' },
  { name: 'Club de Miembros', path: '/club', type: 'Comunidad' },
  { name: 'Embajadores', path: '/club/ambassador', type: 'Comunidad' },
  { name: 'Distribuidores', path: '/distributors', type: 'Información' },
  { name: 'Alquiler de Espacios', path: '/rent', type: 'Servicio' },
  { name: 'Conócenos', path: '/about', type: 'Empresa' },
  { name: 'Galería', path: '/gallery', type: 'Multimedia' },
  { name: 'Suscripciones', path: '/membership', type: 'Servicio' },
];

const RoleBadge = ({ role, tier }: { role: string, tier?: string }) => {
  if (role === 'admin') {
    return <span className="bg-black text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase border border-gray-600 flex items-center gap-1"><Shield size={8} /> Admin</span>;
  }
  if (role === 'distributor') {
    return <span className="bg-purple-600 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1">Distri</span>;
  }
  if (tier === 'gold') return <span className="bg-yellow-400 text-black text-[9px] font-bold px-2 py-0.5 rounded uppercase">Oro</span>;
  if (tier === 'silver') return <span className="bg-gray-300 text-black text-[9px] font-bold px-2 py-0.5 rounded uppercase">Plata</span>;
  if (tier === 'bronze') return <span className="bg-orange-300 text-black text-[9px] font-bold px-2 py-0.5 rounded uppercase">Bronce</span>;

  return null;
};

export const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    user, cart, isCartOpen, setIsCartOpen, removeFromCart, cartTotal, logout, products,
    wishlist, setIsWishlistOpen, isWishlistOpen, toggleWishlist
  } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll Reveal Observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.reveal');
    elements.forEach(el => observer.observe(el));

    return () => elements.forEach(el => observer.unobserve(el));
  }, [location.pathname]); // Re-run when route changes

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Global Search Logic
  const getSearchResults = () => {
    if (!searchQuery) return { products: [], pages: [] };
    const lowerQuery = searchQuery.toLowerCase();

    const filteredProducts = products.filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery)
    );

    const filteredPages = SITE_PAGES.filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.type.toLowerCase().includes(lowerQuery)
    );

    return { products: filteredProducts, pages: filteredPages };
  };

  const { products: resultProducts, pages: resultPages } = getSearchResults();
  const hasResults = resultProducts.length > 0 || resultPages.length > 0;

  const handleSearchNavigate = (path: string) => {
    navigate(path);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-white">

      {/* Search Overlay (Global) */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex flex-col items-center pt-24 px-4 animate-in fade-in duration-200">
          <button onClick={() => setIsSearchOpen(false)} className="absolute top-8 right-8 text-white hover:text-gray-300">
            <X size={32} />
          </button>

          <div className="w-full max-w-4xl h-full flex flex-col">
            <div className="border-b-2 border-white/20 pb-4 mb-8 flex items-center shrink-0">
              <Search size={32} className="text-white/50 mr-4" />
              <input
                autoFocus
                type="text"
                placeholder="BUSCAR EN QUEEN TOUCH..."
                className="w-full bg-transparent text-2xl md:text-3xl font-bold uppercase text-white placeholder-white/30 outline-none tracking-widest"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex-grow overflow-y-auto pb-20">
              {searchQuery && !hasResults && (
                <p className="text-white/50 text-center mt-12 text-xl">No encontramos resultados para "{searchQuery}"</p>
              )}

              {/* Sections / Pages Results */}
              {resultPages.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-white/40 uppercase text-xs font-bold tracking-[0.2em] mb-4">Secciones y Servicios</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {resultPages.map((page, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSearchNavigate(page.path)}
                        className="flex items-center gap-4 bg-white/5 p-4 hover:bg-white/10 cursor-pointer transition rounded border border-white/10"
                      >
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                          {page.type === 'Producto' ? <Box size={18} /> : page.type === 'Servicio' ? <GraduationCap size={18} /> : <Globe size={18} />}
                        </div>
                        <div>
                          <h4 className="text-white font-bold uppercase text-sm">{page.name}</h4>
                          <p className="text-gray-400 text-[10px] uppercase tracking-wider">{page.type}</p>
                        </div>
                        <ArrowRight className="ml-auto text-white/30" size={16} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Products Results */}
              {resultProducts.length > 0 && (
                <div>
                  <h3 className="text-white/40 uppercase text-xs font-bold tracking-[0.2em] mb-4">Productos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resultProducts.map(product => (
                      <div
                        key={product.id}
                        onClick={() => handleSearchNavigate(`/product/${product.id}`)}
                        className="flex items-center gap-4 bg-white/5 p-4 hover:bg-white/10 cursor-pointer transition rounded border border-white/10"
                      >
                        <img src={product.images[0]} className="w-16 h-16 object-cover bg-white rounded-sm" />
                        <div>
                          <h4 className="text-white font-bold uppercase text-sm">{product.name}</h4>
                          <p className="text-gray-400 text-xs">${product.price.toLocaleString()}</p>
                        </div>
                        <ArrowRight className="ml-auto text-white/30" size={16} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* High-End Header: Chanel Style - Tall, Spacious, Centered */}
      <header className="bg-black text-white sticky top-0 z-50 transition-all duration-300">

        {/* Top Row: Utility Icons & Logo */}
        <div className="container mx-auto px-4 md:px-8 pt-4 md:pt-8 pb-4 flex items-center justify-between relative">

          {/* Mobile Toggle */}
          <div className="flex items-center lg:hidden z-20 w-1/4">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Left Icons (Search - Desktop) */}
          <div className="hidden lg:flex items-center gap-6 w-1/3">
            <button onClick={() => setIsSearchOpen(true)} className="hover:text-gray-300 transition" aria-label="Buscar"><Search size={20} strokeWidth={1.5} /></button>
          </div>

          {/* Logo Centered */}
          <div className="w-1/2 lg:w-1/3 flex justify-center">
            <Link to="/" className="text-2xl md:text-6xl font-bold tracking-[0.25em] uppercase whitespace-nowrap font-sans text-center">
              Queen Touch
            </Link>
          </div>

          {/* Right Icons (User & Cart) */}
          <div className="flex items-center justify-end gap-4 md:gap-6 w-1/4 lg:w-1/3">
            {/* Search Icon Mobile */}
            <button onClick={() => setIsSearchOpen(true)} className="lg:hidden hover:text-gray-300 transition"><Search size={20} strokeWidth={1.5} /></button>

            {user ? (
              <div className="relative group hidden lg:block">
                <button className="hover:text-gray-300 flex items-center gap-2 uppercase text-[10px] tracking-widest py-2">
                  <UserIcon size={20} strokeWidth={1.5} />
                  <RoleBadge role={user.role} tier={user.tier} />
                </button>
                {/* Fixed User Menu Dropdown: Increased top padding (pt-6) to make it easier to reach */}
                <div className="absolute right-0 top-full pt-8 w-56 hidden group-hover:block z-50">
                  <div className="bg-white text-black shadow-xl border border-gray-100 py-4 rounded-sm relative">
                    {/* Little triangle pointer */}
                    <div className="absolute -top-2 right-4 w-4 h-4 bg-white transform rotate-45 border-l border-t border-gray-100"></div>

                    <div className="px-6 py-2 border-b border-gray-100 text-[10px] font-bold uppercase tracking-widest">
                      Hola, {user.name}
                    </div>
                    {user.role !== 'admin' && <Link to="/membership" className="block px-6 py-3 hover:bg-gray-50 text-[10px] uppercase tracking-widest">Mi Membresía</Link>}
                    {!!user.isAdmin && <Link to="/admin" className="block px-6 py-3 hover:bg-gray-50 text-[10px] uppercase tracking-widest">Panel Admin</Link>}
                    {user.role === 'distributor' && <Link to="/distributors" className="block px-6 py-3 hover:bg-gray-50 text-[10px] uppercase tracking-widest">Panel Distribuidor</Link>}
                    <button onClick={handleLogout} className="w-full text-left px-6 py-3 hover:bg-gray-50 text-[10px] uppercase tracking-widest text-red-600">Cerrar Sesión</button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="hidden lg:block hover:text-gray-300 transition"><UserIcon size={20} strokeWidth={1.5} /></Link>
            )}

            {/* Wishlist Button */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="hidden lg:block hover:text-gray-300 transition relative"
              title="Lista de Deseos"
            >
              <Heart size={20} strokeWidth={1.5} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-bold w-3 h-3 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button onClick={() => setIsCartOpen(true)} className="hover:text-gray-300 relative transition">
              <ShoppingCart size={20} strokeWidth={1.5} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-black text-[9px] font-bold w-3 h-3 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Bottom Row: Wide Navigation */}
        <nav className="hidden lg:flex w-full justify-center pb-8 pt-4 px-4 overflow-x-auto no-scrollbar">
          {/* Responsive gap and layout */}
          <div className="flex gap-6 lg:gap-8 xl:gap-12 text-[10px] lg:text-[11px] uppercase tracking-[0.2em] font-medium text-gray-300 items-center whitespace-nowrap mx-auto">
            {[
              { path: '/', label: 'Inicio' },
              { path: '/shop', label: 'Shop' },
              { path: '/academy/online', label: 'Academia Online' },
              { path: '/academy/presencial', label: 'Academia Presencial' },
              { path: '/distributors', label: 'Distribuidores' },
              { path: '/membership', label: 'Suscripciones', isGold: true },
              { path: '/club', label: 'Club' },
              { path: '/rent', label: 'Espacios' },
              { path: '/about', label: 'Conócenos' },
            ].map(link => {
              const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));

              // Base classes
              let classes = "hover:text-white transition-all duration-300 relative group py-2 ";

              // Active state
              if (isActive) {
                classes += "text-white font-bold ";
              } else if (link.isGold) {
                classes += "text-orange-100 font-bold hover:text-white ";
              } else {
                classes += "text-gray-400 ";
              }

              return (
                <Link key={link.path} to={link.path} className={classes}>
                  {link.label}
                  {/* Animated underline */}
                  <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-white transform origin-left transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="lg:hidden bg-zinc-900 absolute w-full top-full left-0 flex flex-col shadow-xl border-t border-gray-800 z-50 h-[calc(100vh-80px)] overflow-y-auto">
            <div className="p-8 flex flex-col space-y-6 text-sm uppercase tracking-[0.2em]">
              {[
                { path: '/', label: 'Inicio' },
                { path: '/shop', label: 'Shop' },
                { path: '/academy/online', label: 'Academia Online' },
                { path: '/academy/presencial', label: 'Academia Presencial' },
                { path: '/membership', label: 'Suscripciones', isGold: true },
                { path: '/club', label: 'Club' },
                { path: '/rent', label: 'Espacios' },
                { path: '/distributors', label: 'Distribuidores' },
                { path: '/about', label: 'Conócenos' },
              ].map(link => {
                const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
                let classes = "py-2 border-b border-gray-800 transition-colors ";
                if (isActive) {
                  classes += "text-white font-bold border-white";
                } else if (link.isGold) {
                  classes += "text-orange-100 font-bold";
                } else {
                  classes += "text-gray-400 hover:text-white";
                }

                return (
                  <Link key={link.path} to={link.path} onClick={() => setIsMenuOpen(false)} className={classes}>
                    {link.label}
                  </Link>
                );
              })}

              {!user ? (
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="py-4 font-bold text-white mt-4 border-b border-transparent">Iniciar Sesión</Link>
              ) : (
                <div className="flex flex-col gap-4 mt-4">
                  <span className="text-xs text-gray-500 tracking-widest flex items-center gap-2">
                    Hola, {user.name}
                    <RoleBadge role={user.role} tier={user.tier} />
                  </span>
                  {!!user.isAdmin && <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="text-left font-bold text-white">Panel Admin</Link>}
                  <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="text-left py-2 font-bold text-red-500">Cerrar Sesión</button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Cart Drawer (Slide-over) */}
      {isCartOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50 transition-opacity backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-full md:w-96 bg-white z-[60] shadow-2xl transform transition-transform duration-300 flex flex-col">
            <div className="p-6 flex items-center justify-between border-b bg-black text-white">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em]">Tu Bolsa</h2>
              <button onClick={() => setIsCartOpen(false)}><X size={24} /></button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <ShoppingCart size={48} strokeWidth={1} className="mb-4 opacity-50" />
                  <p className="text-xs uppercase tracking-widest">Tu bolsa está vacía.</p>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="flex gap-4 border-b border-gray-100 pb-4">
                    <img src={item.images[0]} alt={item.name} className="w-20 h-20 object-cover bg-gray-100" />
                    <div className="flex-1">
                      <h3 className="text-xs font-bold uppercase tracking-wide">{item.name}</h3>
                      {item.selectedColor && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] uppercase text-gray-500">Color:</span>
                          <div className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: item.selectedColor }}></div>
                        </div>
                      )}
                      <div className="flex justify-between items-center mt-4">
                        <p className="text-xs">{item.quantity} x ${item.price.toLocaleString()}</p>
                        <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t bg-gray-50">
              <div className="flex justify-between mb-6 text-sm font-bold uppercase tracking-widest">
                <span>Subtotal</span>
                <span>${cartTotal.toLocaleString()}</span>
              </div>
              <button
                onClick={() => { setIsCartOpen(false); navigate('/checkout'); }}
                className="w-full bg-black text-white py-4 text-xs uppercase font-bold tracking-[0.2em] hover:bg-zinc-800 transition disabled:opacity-50"
                disabled={cart.length === 0}
              >
                Finalizar Compra
              </button>
            </div>
          </div>
        </>
      )}

      {/* Wishlist Drawer (Right Side) */}
      {isWishlistOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50 transition-opacity backdrop-blur-sm" onClick={() => setIsWishlistOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-full md:w-96 bg-white z-[60] shadow-2xl transform transition-transform duration-300 flex flex-col border-l border-gray-100">
            <div className="p-6 flex items-center justify-between border-b bg-black text-white">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                <Heart size={16} fill="white" /> Lista de Deseos
              </h2>
              <button onClick={() => setIsWishlistOpen(false)}><X size={24} /></button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {wishlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Heart size={48} strokeWidth={1} className="mb-4 opacity-50" />
                  <p className="text-xs uppercase tracking-widest">Tu lista está vacía.</p>
                  <p className="text-[10px] text-gray-400 mt-2 text-center px-8">Guarda tus productos favoritos aquí para comprarlos después.</p>
                </div>
              ) : (
                wishlist.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-4">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-20 h-20 object-cover bg-gray-100 cursor-pointer"
                      onClick={() => { setIsWishlistOpen(false); navigate(`/product/${item.id}`); }}
                    />
                    <div className="flex-1">
                      <h3 className="text-xs font-bold uppercase tracking-wide cursor-pointer hover:underline" onClick={() => { setIsWishlistOpen(false); navigate(`/product/${item.id}`); }}>
                        {item.name}
                      </h3>
                      <p className="text-gray-600 text-xs mt-1 mb-3">${item.price.toLocaleString()}</p>

                      <div className="flex justify-between items-center">
                        <button
                          onClick={() => { setIsWishlistOpen(false); navigate(`/product/${item.id}`); }}
                          className="text-[10px] uppercase font-bold text-black border-b border-black pb-0.5 hover:text-gray-600"
                        >
                          Ver Producto
                        </button>
                        <button onClick={() => toggleWishlist(item)} className="text-gray-400 hover:text-red-500">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-12 md:py-20 border-t border-gray-900 reveal">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col items-center mb-16">
            <button onClick={scrollToTop} className="mb-10 animate-bounce bg-white text-black p-3 rounded-full hover:scale-110 transition">
              <ChevronUp size={20} />
            </button>
            <h3 className="text-2xl md:text-4xl font-bold mb-4 tracking-[0.25em] uppercase">Queen Touch</h3>
            <div className="w-12 h-0.5 bg-white/20 mb-4"></div>
            <p className="text-gray-500 text-[10px] tracking-[0.3em] uppercase">Excelencia en cada detalle</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 text-sm text-gray-400 text-center md:text-left">
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-[0.2em] text-[10px]">Ubicaciones</h4>
              <p className="mb-3 hover:text-white transition cursor-pointer text-xs uppercase tracking-wider">Medellín, Colombia</p>
              <p className="mb-3 hover:text-white transition cursor-pointer text-xs uppercase tracking-wider">Bogotá, Colombia</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-[0.2em] text-[10px]">Contacto</h4>
              <p className="mb-3 hover:text-white transition cursor-pointer text-xs uppercase tracking-wider">+57 300 123 4567</p>
              <p className="mb-3 hover:text-white transition cursor-pointer text-xs uppercase tracking-wider">contacto@queentouch.com</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-[0.2em] text-[10px]">Legal</h4>
              <ul className="space-y-3 text-xs uppercase tracking-wider">
                <li><Link to="/legal/terms" className="hover:text-white transition">Términos y condiciones</Link></li>
                <li><Link to="/legal/privacy" className="hover:text-white transition">Política de privacidad</Link></li>
                <li><Link to="/legal/shipping" className="hover:text-white transition">Envíos y devoluciones</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-[0.2em] text-[10px]">Social</h4>
              <div className="flex justify-center md:justify-start space-x-8 mt-2">
                <a href="#" className="hover:text-white transition transform hover:scale-110"><Facebook size={18} /></a>
                <a href="#" className="hover:text-white transition transform hover:scale-110"><Instagram size={18} /></a>
                <a href="#" className="hover:text-white transition transform hover:scale-110"><Youtube size={18} /></a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Buttons */}
      {!location.pathname.startsWith('/admin') && (
        <div className="fixed bottom-8 right-8 flex flex-col space-y-4 z-40">
          <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-2xl transition-transform hover:scale-110 flex items-center justify-center">
            <MessageCircle size={28} />
          </a>
        </div>
      )}
    </div>
  );
};