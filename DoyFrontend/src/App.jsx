import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'wouter';
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

// Sayfa yüklenirken loading spinner gösterebilirsiniz
const LoadingSpinner = () => (
  <div className="flex flex-col min-h-screen items-center justify-center bg-amber-50">
    <div className="w-12 h-12 border-4 border-amber-400 border-t-amber-600 rounded-full animate-spin"></div>
    <p className="mt-4 text-amber-800">Yükleniyor...</p>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/auth" component={AuthPage} />
            {/* Customer profile route güncellendi */}
            <Route path="/forgot-password" component={ForgotPassword} />
            {/* ID bazlı profil sayfaları eklendi */}
            <Route path="/customer/profile/:id?" component={CustomerProfilePage} />
            <Route path="/restaurants/browse" component={Home} />
            <Route path="/cart" component={Cart} />
            <Route path="/checkout" component={Checkout} />
            <Route path="/payment-result" component={PaymentResult} />
            <Route path="/order-confirmation" component={OrderConfirmation} />
            <Route path="/restaurants/register" component={RestaurantRegisterPage} />
            <Route path="/restaurant/profile/:id?" component={RestaurantProfilePage} />
            <Route path="/couriers/register" component={CourierRegisterPage} />
            <Route path="/courier/profile/:id?" component={CourierProfilePage} />
            <Route path="/restaurants/manage/:id?" component={RestaurantManagePage} />
            <Route path="/restaurant/:id" component={RestaurantDetail} />
            <Route path="/restaurants/manage/:id/edit-item/:categoryId/:itemId" component={UpdateItemPage} />
            <Route path="/restaurants/manage/:id/add-item/:categoryId" component={AddItemPage} />
            <Route path="/profile-test" component={ProfileTestPageFixed} />

            
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;