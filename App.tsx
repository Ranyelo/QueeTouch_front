import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Club } from './pages/Club';
import { Academy } from './pages/Academy';
import { Distributors } from './pages/Distributors';
import { About } from './pages/About';
import { RentSpaces, Gallery } from './pages/RentGallery';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/Admin';
import { Legal } from './pages/Legal';
import { Checkout } from './pages/Checkout';
import { Membership } from './pages/Membership';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />

        {/* Shop Routes */}
        <Route path="shop" element={<Shop />} />
        <Route path="shop/:category" element={<Shop />} />
        <Route path="shop/:category/:subcategory" element={<Shop />} />
        <Route path="product/:id" element={<Shop />} />
        <Route path="checkout" element={<Checkout />} />

        {/* Club & Membership Routes */}
        <Route path="club" element={<Club />} />
        <Route path="club/member" element={<Club />} />
        <Route path="club/ambassador" element={<Club />} />
        {/* Guest Only Routes */}
        <Route element={<PublicRoute />}>
          <Route path="login" element={<Login />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="membership" element={<Membership />} />
          <Route path="checkout" element={<Checkout />} />
        </Route>

        {/* Admin Protected Routes */}
        <Route element={<ProtectedRoute adminOnly />}>
          <Route path="admin" element={<AdminDashboard />} />
        </Route>

        <Route path="legal/:section" element={<Legal />} />
      </Route>
    </Routes>
  );
};

export default App;