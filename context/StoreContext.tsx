import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, User, ShippingDetails, MembershipTier, DistributorApplication, Order, Ticket, Appointment } from '../types';

interface StoreContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
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
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Updated with Nail Art / Manicure Images
const INITIAL_PRODUCTS: Product[] = [
  { 
    id: 'p1', 
    name: 'Esmalte Gel Red Velvet', 
    price: 25000, 
    description: 'Esmalte de larga duración con acabado brillante. Ideal para uso profesional.',
    category: 'esmaltes', 
    subcategory: 'lisos',
    images: ['https://images.unsplash.com/photo-1632516643720-e7f5d7d6ecc9?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=800&auto=format&fit=crop'],
    colors: ['#FF0000', '#8B0000', '#DC143C', '#B22222'],
    stock: 100
  },
  { 
    id: 'p2', 
    name: 'Lámpara UV LED Pro 48W', 
    price: 150000, 
    description: 'Secado rápido para todo tipo de geles. Sensor automático y temporizador.',
    category: 'equipos', 
    subcategory: 'lamparas',
    images: ['https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800&auto=format&fit=crop'],
    colors: ['#FFFFFF'],
    stock: 3 // Set to low stock for demo purposes
  },
  { 
    id: 'p3', 
    name: 'Kit Pinceles Nail Art', 
    price: 45000, 
    description: 'Set de 5 pinceles de precisión para mano alzada y detalles finos.',
    category: 'pinceles', 
    subcategory: 'arte',
    images: ['https://images.unsplash.com/photo-1599693918340-02543d3b7338?q=80&w=800&auto=format&fit=crop'],
    colors: [],
    stock: 15
  },
  { 
    id: 'p4', 
    name: 'Aceite de Cutícula Orgánico', 
    price: 12000, 
    description: 'Hidratación profunda con vitamina E y aroma a almendras.',
    category: 'spa', 
    subcategory: 'cuidados',
    images: ['https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=800&auto=format&fit=crop'],
    colors: [],
    stock: 50
  }
];

const VALID_COUPONS: Record<string, number> = {
  'WELCOME10': 0.10,
  'QUEEN20': 0.20,
  'GOLDMEMBER': 0.25,
  'DISTRIBUIDOR': 0.40 // 40% discount for distributors
};

// Mock Orders
const INITIAL_ORDERS: Order[] = [
    { id: 'QT-1001', userId: 'distro1@test.com', date: '2026-10-25', total: 2500000, status: 'shipped', shippingMethod: 'Servientrega', estimatedArrival: '2026-10-28', items: [] },
    { id: 'QT-1002', userId: 'distro2@test.com', date: '2026-10-26', total: 5000000, status: 'processing', items: [] }
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [distributorApplications, setDistributorApplications] = useState<DistributorApplication[]>([]);
  const [discount, setDiscount] = useState(0);
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    fullName: '', address: '', city: '', zip: '', phone: ''
  });

  // Operational State
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Simulating Persistent Admin if previously logged in (mock)
  useEffect(() => {
    const storedUser = localStorage.getItem('qt_user');
    if (storedUser) setUser(JSON.parse(storedUser));
    
    // Load mock applications
    const storedApps = localStorage.getItem('qt_apps');
    if (storedApps) setDistributorApplications(JSON.parse(storedApps));
  }, []);

  const login = (email: string) => {
    let role: User['role'] = 'member';
    let tier: MembershipTier | undefined = undefined;
    let isAdmin = false;

    // Hardcoded Users for Testing
    if (email === 'admin@queentouch.com') {
      isAdmin = true;
      role = 'admin';
    } else if (email === 'bronze@queentouch.com') {
      tier = 'bronze';
    } else if (email === 'silver@queentouch.com') {
      tier = 'silver';
    } else if (email === 'gold@queentouch.com') {
      tier = 'gold';
    } else if (email.startsWith('distro')) {
      // Create specific logic for test distributors
      role = 'distributor';
    } else {
      // Default new user (No tier)
      tier = undefined; 
      role = 'user';
    }
    
    // Check if user has an approved application in local storage to restore role
    const apps = JSON.parse(localStorage.getItem('qt_apps') || '[]');
    const myApp = apps.find((a: any) => a.userId === email && a.status === 'approved');
    if (myApp && !isAdmin) {
        role = 'distributor';
    }

    const newUser: User = {
      email,
      name: email.split('@')[0],
      isAdmin,
      role,
      tier,
      points: tier ? 500 : 0
    };
    setUser(newUser);
    localStorage.setItem('qt_user', JSON.stringify(newUser));
    
    // Auto apply distributor discount if role is distributor
    if (role === 'distributor') {
        setDiscount(0.40);
    }
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    setWishlist([]);
    setDiscount(0);
    localStorage.removeItem('qt_user');
  };

  const updateUserTier = (tier: MembershipTier) => {
    if (user) {
      const updated = { ...user, tier, role: 'member' as const };
      setUser(updated);
      localStorage.setItem('qt_user', JSON.stringify(updated));
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

  const addProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // --- Distributor Logic ---

  const submitDistributorApplication = (appData: Omit<DistributorApplication, 'id' | 'status' | 'date'>) => {
    const newApp: DistributorApplication = {
        id: `app-${Date.now()}`,
        status: 'pending',
        date: new Date().toISOString(),
        ...appData
    };
    const updatedApps = [...distributorApplications, newApp];
    setDistributorApplications(updatedApps);
    localStorage.setItem('qt_apps', JSON.stringify(updatedApps));
  };

  const reviewDistributorApplication = (id: string, status: 'approved' | 'rejected') => {
    const updatedApps = distributorApplications.map(app => 
        app.id === id ? { ...app, status } : app
    );
    setDistributorApplications(updatedApps);
    localStorage.setItem('qt_apps', JSON.stringify(updatedApps));

    if (status === 'approved') {
        const app = updatedApps.find(a => a.id === id);
        // Simulate real-time update if logged in as that user (unlikely in admin view but good for consisteny)
        if (app && user && app.userId === user.email) {
            const updatedUser = { ...user, role: 'distributor' as const };
            setUser(updatedUser);
            localStorage.setItem('qt_user', JSON.stringify(updatedUser));
            setDiscount(0.40);
        }
    }
  };

  const getUserApplicationStatus = (email: string) => {
    const app = distributorApplications.find(a => a.userId === email);
    if (!app) return 'none';
    return app.status;
  };

  const resignDistributor = (reason: string) => {
    if (!user) return;
    
    // 1. Remove distributor application
    const updatedApps = distributorApplications.filter(a => a.userId !== user.email);
    setDistributorApplications(updatedApps);
    localStorage.setItem('qt_apps', JSON.stringify(updatedApps));

    // 2. Downgrade user role
    const updatedUser = { ...user, role: 'user' as const };
    setUser(updatedUser);
    localStorage.setItem('qt_user', JSON.stringify(updatedUser));
    setDiscount(0); // Remove distributor discount
  };

  // --- Admin & Operations Logic ---

  const updateOrderShipping = (orderId: string, status: 'processing' | 'shipped' | 'delivered', method?: string, eta?: string) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { 
          ...o, 
          status, 
          shippingMethod: method || o.shippingMethod, 
          estimatedArrival: eta || o.estimatedArrival 
      } : o
    ));
  };

  const deleteOrder = (orderId: string) => {
      setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  const createTicket = (subject: string, message: string) => {
    if (!user) return;
    const newTicket: Ticket = {
      id: `T-${Date.now()}`,
      userId: user.email,
      subject,
      message,
      status: 'open',
      date: new Date().toISOString()
    };
    setTickets(prev => [...prev, newTicket]);
  };

  const respondTicket = (ticketId: string, response: string) => {
    setTickets(prev => prev.map(t => 
      t.id === ticketId ? { ...t, response, status: 'closed' } : t
    ));
  };

  const scheduleAppointment = (distributorId: string, date: string, time: string, topic: string) => {
    const newAppt: Appointment = {
      id: `appt-${Date.now()}`,
      distributorId,
      date,
      time,
      topic,
      status: 'scheduled'
    };
    setAppointments(prev => [...prev, newAppt]);
  };

  const updateAppointment = (id: string, status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed', date?: string, time?: string) => {
      setAppointments(prev => prev.map(a => 
        a.id === id ? { ...a, status, date: date || a.date, time: time || a.time } : a
      ));
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <StoreContext.Provider value={{
      user, login, logout, updateUserTier,
      cart, addToCart, removeFromCart, clearCart, cartTotal,
      wishlist, toggleWishlist, isInWishlist, isWishlistOpen, setIsWishlistOpen,
      discount, applyCoupon,
      isCartOpen, setIsCartOpen,
      products, addProduct, deleteProduct,
      shippingDetails, setShippingDetails,
      distributorApplications, submitDistributorApplication, reviewDistributorApplication, getUserApplicationStatus, resignDistributor,
      orders, updateOrderShipping, deleteOrder,
      tickets, createTicket, respondTicket,
      appointments, scheduleAppointment, updateAppointment
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
