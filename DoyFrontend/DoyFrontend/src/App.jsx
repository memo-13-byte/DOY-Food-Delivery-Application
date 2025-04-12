import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AuthProvider } from './hooks/use-auth';

// Pages
import HomePage from './pages/home-page';
import AuthPage from './pages/auth-page';
import RestaurantsBrowsePage from './pages/restaurants-browse-page';
import RestaurantRegisterPage from './pages/restaurant-register-page';
import CourierRegisterPage from './pages/courier-register-page';
import NotFound from './pages/not-found';
import CustomerProfilePage from './pages/customer-profile-page';
import RestaurantProfilePage from './pages/restaurant-profile-page';
import CourierProfilePage from './pages/courier-profile-page';
import RestaurantDetailPage from './pages/indexed-restaurant-page';
import RestaurantManagePage from './pages/edit-restaurant-page';
import ForgotPassword from './pages/forgot-password';
import AddEditItemPage from './pages/add-edit-item-page';

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
            <Route path="/customer/profile" component={CustomerProfilePage} />
            <Route path="/restaurants/browse" component={RestaurantsBrowsePage} />
            <Route path="/restaurants/register" component={RestaurantRegisterPage} />
            <Route path="/restaurant/profile" component={RestaurantProfilePage} />
            <Route path="/couriers/register" component={CourierRegisterPage} />
            <Route path="/courier/profile" component={CourierProfilePage} />
            <Route path="/restaurants/manage" component={RestaurantManagePage} />
            <Route path="/restaurants/:id" component={RestaurantDetailPage} />
            <Route path="/restaurants/:id/edit-item/:categoryId/:itemId" component={AddEditItemPage} />

            
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;