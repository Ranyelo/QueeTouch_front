import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, User, ShippingDetails, MembershipTier, DistributorApplication, Order, Ticket, Appointment, Comment } from '../types';

interface StoreContextType {
  user: User | null;
  login: (email: string, password?: string, name?: string) => Promise<boolean | 'needs_verification'>;
  verifyEmail: (email: string, code: string) => Promise<boolean>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<boolean>;
  confirmPasswordReset: (email: string, code: string, newPass: string) => Promise<boolean>;
  updateUserTier: (tier: MembershipTier) => void;
  cart: CartItem[];
  addToCart: (product: Product, color?: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  discount: number;
  applyCoupon: (code: string) => boolean;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  // Wishlist Types
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (isOpen: boolean) => void;
  // Products & Shipping
  products: Product[];
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  getWholesalePrice: (price: number) => number;
  shippingDetails: ShippingDetails;
  setShippingDetails: (details: ShippingDetails) => void;
  // Distributors Logic
  distributorApplications: DistributorApplication[];
  submitDistributorApplication: (app: Omit<DistributorApplication, 'id' | 'status' | 'date'>) => void;
  reviewDistributorApplication: (id: string, status: 'approved' | 'rejected') => void;
  getUserApplicationStatus: (email: string) => 'none' | 'pending' | 'approved' | 'rejected';
  resignDistributor: (reason: string) => void;
  // Admin & Operations
  orders: Order[];
  updateOrderShipping: (orderId: string, status: 'processing' | 'shipped' | 'delivered', method?: string, eta?: string) => void;
  deleteOrder: (orderId: string) => void;
  tickets: Ticket[];
  createTicket: (subject: string, message: string) => void;
  respondTicket: (ticketId: string, response: string) => void;
  appointments: Appointment[];
  scheduleAppointment: (distributorId: string, date: string, time: string, topic: string) => void;
  updateAppointment: (id: string, status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed', date?: string, time?: string) => void;
  // Comments
  fetchComments: (targetId: string) => Promise<Comment[]>;
  addComment: (targetId: string, content: string, parentId?: string) => Promise<Comment | null>;
  toggleLike: (commentId: string) => Promise<{ liked: boolean } | null>;
  deleteComment: (commentId: string) => Promise<boolean>;
}

import { useNotification } from './NotificationContext';

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const API_URL = 'http://localhost:3001/api';

const VALID_COUPONS: Record<string, number> = {
  'WELCOME10': 0.10,
  'QUEEN20': 0.20,
  'GOLDMEMBER': 0.25,
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showNotification } = useNotification();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  // usersDb mock removed
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [distributorApplications, setDistributorApplications] = useState<DistributorApplication[]>([]);
  const [discount, setDiscount] = useState(0);
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    fullName: '', address: '', city: '', zip: '', phone: ''
  });

  // Operational State
  const [orders, setOrders] = useState<Order[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]); // To be implemented in backend if needed
  const [appointments, setAppointments] = useState<Appointment[]>([]); // To be implemented in backend if needed

  // Initialize
  useEffect(() => {
    // 1. Restore Current Session
    const storedUser = localStorage.getItem('qt_user');
    const storedToken = localStorage.getItem('qt_token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }

    // 2. Fetch Products
    fetchProducts();

  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      const json = await res.json();
      if (json.data) setProducts(json.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const verifyEmail = async (email: string, code: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });
      const data = await res.json();

      if (!res.ok) {
        showNotification(data.message || 'Error validando código', 'error');
        return false;
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('qt_user', JSON.stringify(data.user));
      localStorage.setItem('qt_token', data.token);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const login = async (email: string, password?: string, name?: string): Promise<boolean | 'needs_verification'> => {
    if (name && password) {
      // --- REGISTRATION FLOW ---
      try {
        const res = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name, password })
        });

        const data = await res.json();

        if (!res.ok) {
          showNotification(data.message || (data.errors ? data.errors[0].msg : 'Error registrando usuario'), 'error');
          return false;
        }

        if (data.needsVerification) {
          return 'needs_verification';
        }

        // Only if verified immediately (not current flow)
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('qt_user', JSON.stringify(data.user));
        localStorage.setItem('qt_token', data.token);
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }

    } else if (password) {
      // --- LOGIN FLOW ---
      try {
        const res = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (!res.ok) {
          if (res.status === 403 && data.needsVerification) {
            return 'needs_verification';
          }
          showNotification(data.message || 'Error iniciando sesión', 'error');
          return false;
        }

        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('qt_user', JSON.stringify(data.user));
        localStorage.setItem('qt_token', data.token);

        // If admin, fetch orders
        if (data.user.isAdmin) {
          fetchOrders(data.token);
        }

        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setCart([]);
    setWishlist([]);
    setDiscount(0);
    localStorage.removeItem('qt_user');
    localStorage.removeItem('qt_token');
  };

  const requestPasswordReset = async (email: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        showNotification(data.message, 'success');
        return true;
      } else {
        showNotification(data.message || 'Error al solicitar código', 'error');
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const confirmPasswordReset = async (email: string, code: string, newPass: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword: newPass })
      });
      const data = await res.json();
      if (res.ok) {
        showNotification(data.message, 'success');
        return true;
      } else {
        showNotification(data.message || 'Error al restablecer contraseña', 'error');
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const updateUserTier = async (tier: MembershipTier) => {
    if (!user || !token) return;
    try {
      // Determine role based on tier (if upgrading to paid, maybe set 'member'?)
      // Logic: If tier is 'bronze', role is 'user' (or 'member'?). Let's keep 'member' for simplicity or 'user' for free.
      // Current logic in frontend was: role: 'member'.

      const res = await fetch(`${API_URL}/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ tier, role: 'member' })
      });

      const json = await res.json();
      if (res.ok) {
        setUser(json.user);
        localStorage.setItem('qt_user', JSON.stringify(json.user));
        showNotification(`Membresía actualizada a ${tier}`, 'success');
      } else {
        showNotification(json.message || 'Error actualizando membresía', 'error');
      }
    } catch (e) {
      console.error(e);
      showNotification('Error de conexión', 'error');
    }
  };

  const addToCart = (product: Product, selectedColor?: string) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id && p.selectedColor === selectedColor);
      if (existing) {
        return prev.map(p => p.id === product.id && p.selectedColor === selectedColor
          ? { ...p, quantity: p.quantity + 1 }
          : p
        );
      }
      return [...prev, { ...product, quantity: 1, selectedColor }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  // Wishlist Logic
  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(p => p.id === productId);
  };

  const applyCoupon = (code: string): boolean => {
    if (VALID_COUPONS[code]) {
      setDiscount(VALID_COUPONS[code]);
      return true;
    }
    setDiscount(0);
    return false;
  };

  const addProduct = async (product: Product) => {
    try {
      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(product)
      });
      if (res.ok) {
        fetchProducts(); // Refresh
      }
    } catch (e) { console.error(e); }
  };

  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
      }
    } catch (e) { console.error(e); }
  };

  // --- Distributor Logic ---
  const getWholesalePrice = (price: number) => {
    return price * 0.6;
  };

  const submitDistributorApplication = async (appData: Omit<DistributorApplication, 'id' | 'status' | 'date'>) => {
    if (!user || !token) return;

    const res = await fetch(`${API_URL}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ ...appData, id: `app-${Date.now()}` })
    });

    if (res.ok) {
      showNotification("Aplicación enviada con éxito", 'success');
    }
  };

  const reviewDistributorApplication = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`${API_URL}/applications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        // Refresh applications or update local state
        setDistributorApplications(prev => prev.map(app =>
          app.id === id ? { ...app, status } : app
        ));
      }
    } catch (e) { console.error(e); }
  };

  const getUserApplicationStatus = (email: string) => {
    // Currently relying on local state which is not synced for all users unless admin
    // Ideally fetch specific status.
    const app = distributorApplications.find(a => a.userId === email);
    if (!app) return 'none';
    return app.status;
  };

  const resignDistributor = (reason: string) => {
    // TODO: Implement endpoint if needed
  };

  // --- Admin & Operations Logic ---
  const fetchOrders = async (authToken: string) => {
    try {
      const res = await fetch(`${API_URL}/orders`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const json = await res.json();
      if (json.data) setOrders(json.data);
    } catch (e) { console.error(e); }
  };

  const updateOrderShipping = async (orderId: string, status: 'processing' | 'shipped' | 'delivered', method?: string, eta?: string) => {
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status, shippingMethod: method, estimatedArrival: eta })
      });
      if (res.ok) {
        // Update local
        setOrders(prev => prev.map(o =>
          o.id === orderId ? {
            ...o,
            status,
            shippingMethod: method || o.shippingMethod,
            estimatedArrival: eta || o.estimatedArrival
          } : o
        ));
      }
    } catch (e) { console.error(e); }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setOrders(prev => prev.filter(o => o.id !== orderId));
      }
    } catch (e) { console.error(e); }
  };

  const createTicket = async (subject: string, message: string) => {
    if (!user) return;
    const newTicket = {
      id: `T-${Date.now()}`,
      userId: user.email,
      subject,
      message,
    };

    try {
      const res = await fetch(`${API_URL}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newTicket)
      });
      if (res.ok) {
        setTickets(token!);
      }
    } catch (e) { console.error(e); }
  };

  const respondTicket = async (ticketId: string, response: string) => {
    try {
      await fetch(`${API_URL}/tickets/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ response, status: 'closed' })
      });
      setTickets(token!);
    } catch (e) { console.error(e); }
  };

  // Helper to fetch appointments
  const fetchAppointments = async (authToken: string) => {
    try {
      const res = await fetch(`${API_URL}/appointments`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const json = await res.json();
      if (json.data) setAppointments(json.data);
    } catch (e) { console.error(e); }
  };

  const scheduleAppointment = async (distributorId: string, date: string, time: string, topic: string) => {
    if (!token) return;
    const newAppt = {
      id: `appt-${Date.now()}`,
      distributorId,
      date,
      time,
      topic
    };

    try {
      await fetch(`${API_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newAppt)
      });
      fetchAppointments(token);
    } catch (e) { console.error(e); }
  };

  const updateAppointment = async (id: string, status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed', date?: string, time?: string) => {
    try {
      const current = appointments.find(a => a.id === id);
      await fetch(`${API_URL}/appointments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status,
          date: date || current?.date,
          time: time || current?.time
        })
      });
      if (token) fetchAppointments(token);
    } catch (e) { console.error(e); }

  };

  // --- Comments Logic ---
  const fetchComments = async (targetId: string): Promise<Comment[]> => {
    try {
      const res = await fetch(`${API_URL}/comments/${targetId}`, {
        headers: user ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const json = await res.json();
      return json.data || [];
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  const addComment = async (targetId: string, content: string, parentId?: string): Promise<Comment | null> => {
    if (!token) return null;
    try {
      const res = await fetch(`${API_URL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ targetId, content, parentId })
      });
      const json = await res.json();
      if (res.ok) return json.comment;
      showNotification(json.error || 'Error posting comment', 'error');
      return null;
    } catch (e) { console.error(e); return null; }
  };

  const toggleLike = async (commentId: string): Promise<{ liked: boolean } | null> => {
    if (!token) return null;
    try {
      const res = await fetch(`${API_URL}/comments/${commentId}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (res.ok) return json;
      return null;
    } catch (e) { console.error(e); return null; }
  };

  const deleteComment = async (commentId: string): Promise<boolean> => {
    if (!token) return false;
    try {
      const res = await fetch(`${API_URL}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        showNotification('Comentario eliminado', 'success');
        return true;
      } else {
        const json = await res.json();
        showNotification(json.message || 'Error eliminando comentario', 'error');
        return false;
      }
    } catch (e) {
      console.error(e);
      showNotification('Error de conexión', 'error');
      return false;
    }
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <StoreContext.Provider value={{
      user, login, logout, requestPasswordReset, confirmPasswordReset, updateUserTier, verifyEmail,
      cart, addToCart, removeFromCart, clearCart, cartTotal,
      wishlist, toggleWishlist, isInWishlist, isWishlistOpen, setIsWishlistOpen,
      discount, applyCoupon,
      isCartOpen, setIsCartOpen,
      products, addProduct, deleteProduct, getWholesalePrice,
      shippingDetails, setShippingDetails,
      distributorApplications, submitDistributorApplication, reviewDistributorApplication, getUserApplicationStatus, resignDistributor,
      orders, updateOrderShipping, deleteOrder,
      tickets, createTicket, respondTicket,
      appointments, scheduleAppointment, updateAppointment,
      fetchComments, addComment, toggleLike, deleteComment
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};