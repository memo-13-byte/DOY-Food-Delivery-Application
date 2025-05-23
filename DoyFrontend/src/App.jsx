import React, { lazy, Suspense, useState } from 'react';
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
import RestaurantDetail from './pages/RestaurantDetail.jsx';
import RestaurantManagePage from './pages/edit-restaurant-page';
import ForgotPassword from './pages/forgot-password';
import UpdateItemPage from './pages/update-item-page';
import AddItemPage from './pages/add-item-page';
import CourierOrdersPage from "./pages/courier-orders-page";
import AdminComplaintsPage from './pages/AdminComplaintsPage.jsx';
import AdminAccountManagementPage from './pages/AdminAccountManagementPage.jsx';
import PendingRegistrationsPage from './pages/PendingRegistrationsPage.jsx';
import PlatformConfigurationsPage from './pages/PlatformConfigurationsPage.jsx';
import OrderTrackingPage from './pages/OrderTracking.jsx';
import OrderStatusRestaurant from "./pages/restaurant-track-orders";
import OrderStatusCourier from "./pages/courier-order-tracking";
import OrderReviewPage from './pages/order-review-form.jsx';
import CommentPage from './pages/order-review-view.jsx';
import CourierCommentPage from './pages/courier-comments.jsx';
import RestaurantCommentPage from './pages/restaurant-comments.jsx';
import PastOrdersPage from './pages/past-orders-page.jsx';
import CustomerComplaintsPage from './pages/customer-complaints.jsx';

// Loading spinner for Suspense fallback
const LoadingSpinner = () => (
  <div className="flex flex-col min-h-screen items-center justify-center bg-amber-50">
    <div className="w-12 h-12 border-4 border-amber-400 border-t-amber-600 rounded-full animate-spin"></div>
    <p className="mt-4 text-amber-800">Yükleniyor...</p>
  </div>
);

function App() {
  const [darkMode, setDarkMode] = useState(false);
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/forgot-password/:type" element={<ForgotPassword />} />
              <Route path="/customer/profile" element={<CustomerProfilePage />} />
              <Route path="/restaurants/browse" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment-result" element={<PaymentResult />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/restaurants/register" element={<RestaurantRegisterPage />} />
              <Route path="/restaurant/profile/:id?" element={<RestaurantProfilePage />} />
              <Route path="/courier/requests" element={<CourierOrdersPage/>} />
              <Route path="/couriers/register" element={<CourierRegisterPage />} />
              <Route path="/courier/profile/:id?" element={<CourierProfilePage />} />
              <Route path="/restaurants/manage/:id?" element={<RestaurantManagePage />} />
              <Route path="/restaurant/:id" element={<RestaurantDetail />} />
              <Route path="/restaurants/manage/edit-item/:categoryId/:itemId" element={<UpdateItemPage />} />
              <Route path="/restaurants/manage/add-item/:categoryId" element={<AddItemPage />} />
              <Route path="/admin/complaints" element={<AdminComplaintsPage darkMode={darkMode} setDarkMode={setDarkMode} />} />
              <Route path="/admin/account-management" element={<AdminAccountManagementPage darkMode={darkMode} setDarkMode={setDarkMode} />} />
              <Route path="/admin/pending-registrations" element={<PendingRegistrationsPage darkMode={darkMode} setDarkMode={setDarkMode} />} />
              <Route path="/admin/platform-configurations" element={<PlatformConfigurationsPage darkMode={darkMode} setDarkMode={setDarkMode} />} />         
              <Route path="/restaurant/profile/orders" element={<OrderTrackingPage />} />
              <Route path="/restaurant/profile/orders-status" element={<OrderStatusRestaurant />} />
              <Route path="/courier/profile/:id/orders" element={<OrderStatusCourier />} />
              <Route path="/order/:id/review" element={<OrderReviewPage />} />
              <Route path="/order/:id/comment" element={<CommentPage />} />
              <Route path="/courier/profile/comments" element={<CourierCommentPage />} />
              <Route path="/restaurant/profile/comments" element={<RestaurantCommentPage />} />
              <Route path="/customer/past-orders" element={<PastOrdersPage />} />
              <Route path="/customer/complaints" element={<CustomerComplaintsPage />} />
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