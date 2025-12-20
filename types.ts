
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  colors: string[];
  category: string;
  subcategory: string;
  stock?: number;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  image: string;
}

export interface Distributor {
  city: string;
  name: string;
  phone: string;
  email: string;
}

export interface Ambassador {
  id: string;
  name: string;
  image: string;
}

export interface DistributorApplication {
  id: string;
  userId: string; // Email of the applicant
  fullName: string;
  businessName: string;
  address: string;
  city: string;
  phone: string;
  experience: string; // Description of experience
  capital: string; // Investment capacity
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export type MembershipTier = 'bronze' | 'silver' | 'gold';

export interface User {
  email: string;
  name: string;
  isAdmin: boolean;
  role: 'user' | 'member' | 'ambassador' | 'admin' | 'distributor';
  tier?: MembershipTier;
  points?: number;
}

export interface CartItem extends Product {
  quantity: number;
  selectedColor?: string;
}

export interface ShippingDetails {
  fullName: string;
  address: string;
  city: string;
  zip: string;
  phone: string;
}

export interface Order {
  id: string;
  userId: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'processing' | 'shipped' | 'delivered';
  shippingMethod?: string;
  trackingNumber?: string;
  estimatedArrival?: string;
}

export interface Ticket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  response?: string;
  status: 'open' | 'closed';
  date: string;
}

export interface Appointment {
  id: string;
  distributorId: string; // User email
  date: string;
  time: string;
  topic: string;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
}
