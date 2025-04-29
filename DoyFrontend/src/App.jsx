import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AuthProvider } from './hooks/use-auth';

// Pages
import HomePage from './pages/home-page';
import AuthPage from './pages/auth-page';
import Home from './pages/Home.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import PaymentResult from './pages/PaymentResult.jsx';
import OrderConfirmation from './pages/OrderConfirmation.jsx';
import RestaurantRegisterPage from './pages/restaurant-register-page';
import CourierRegisterPage from './pages/courier-register-page';
import NotFound from './pages/not-found';
import CustomerProfilePage from './pages/customer-profile-page';
import RestaurantProfilePage from './pages/restaurant-profile-page';
import CourierProfilePage from './pages/courier-profile-page';
import ProfileTestPageFixed from './pages/profile-test-page-fixed';
import RestaurantDetail from './pages/RestaurantDetail.jsx';
import RestaurantManagePage from './pages/edit-restaurant-page';
import ForgotPassword from './pages/forgot-password';
import UpdateItemPage from './pages/update-item-page';
import AddItemPage from './pages/add-item-page';

// Loading spinner for Suspense fallback
const LoadingSpinner = () => (
  <div className="flex flex-col min-h-screen items-center justify-center bg-amber-50">
    <div className="w-12 h-12 border-4 border-amber-400 border-t-amber-600 rounded-full animate-spin"></div>
    <p className="mt-4 text-amber-800">Yükleniyor...</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/customer/profile/:id?" element={<CustomerProfilePage />} />
              <Route path="/restaurants/browse" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment-result" element={<PaymentResult />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/restaurants/register" element={<RestaurantRegisterPage />} />
              <Route path="/restaurant/profile/:id?" element={<RestaurantProfilePage />} />
              <Route path="/couriers/register" element={<CourierRegisterPage />} />
              <Route path="/courier/profile/:id?" element={<CourierProfilePage />} />
              <Route path="/restaurants/manage/:id?" element={<RestaurantManagePage />} />
              <Route path="/restaurant/:id" element={<RestaurantDetail />} />
              <Route path="/restaurants/manage/:id/edit-item/:categoryId/:itemId" element={<UpdateItemPage />} />
              <Route path="/restaurants/manage/:id/add-item/:categoryId" element={<AddItemPage />} />
              <Route path="/profile-test" element={<ProfileTestPageFixed />} />              
              {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;