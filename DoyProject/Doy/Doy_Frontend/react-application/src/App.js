import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RestaurantDetail from "./pages/RestaurantDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PaymentResult from "./pages/PaymentResult";
import OrderConfirmation from "./pages/OrderConfirmation";

// 🛒 Cart context
import { CartProvider } from "./context/CartContext";

// 🔔 React Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    return (
        <CartProvider>
            <Router>
                {/* 🔔 ToastContainer must be inside the provider to show in all pages */}
                <ToastContainer
                    position="top-center"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/restaurant/:id" element={<RestaurantDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/payment-result" element={<PaymentResult />} />
                    <Route path="/order-confirmation" element={<OrderConfirmation />} />
                </Routes>
            </Router>
        </CartProvider>
    );
}

export default App;
