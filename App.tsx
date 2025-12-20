import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { Layout } from './components/Layout';
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
    <StoreProvider>
      <HashRouter>
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
            <Route path="membership" element={<Membership />} />
            
            {/* Academy Routes */}
            <Route path="academy" element={<Academy />} />
            <Route path="academy/online" element={<Academy />} />
            <Route path="academy/presencial" element={<Academy />} />
            
            {/* Other Routes */}
            <Route path="distributors" element={<Distributors />} />
            <Route path="about" element={<About />} />
            <Route path="rent" element={<RentSpaces />} />
            <Route path="gallery" element={<Gallery />} />
            
            {/* Functional Routes */}
            <Route path="login" element={<Login />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="legal/:section" element={<Legal />} />
          </Route>
        </Routes>
      </HashRouter>
    </StoreProvider>
  );
};

export default App;