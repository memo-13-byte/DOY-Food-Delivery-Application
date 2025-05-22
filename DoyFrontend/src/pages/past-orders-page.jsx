"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Utensils,
  Moon,
  Sun,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Package,
  X,
} from "lucide-react";
import AuthorizedRequest from "../services/AuthorizedRequest";

const Button = ({ className, children, type = "button", disabled = false, ...props }) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Switch = ({ checked, onCheckedChange, className }) => {
  return (
    <button
      role="switch"
      aria-checked={checked}
      data-state={checked ? "checked" : "unchecked"}
      onClick={() => onCheckedChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? "bg-amber-400" : "bg-gray-300"
      } ${className}`}
    >
      <span
        data-state={checked ? "checked" : "unchecked"}
        className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
};




const OrderCard = ({ order, darkMode }) => {
    const navigate = useNavigate();
  return (
    <div
      className={`flex gap-4 p-4 rounded-md ${
        darkMode ? "bg-gray-600" : "bg-white"
      } shadow-sm transition-colors duration-200`}
    >
      <div className="flex-shrink-0">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            darkMode ? "bg-gray-500 text-gray-200" : "bg-amber-200 text-amber-800"
          }`}
        >
          <Package className="w-6 h-6" />
        </div>
      </div>
      
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className={`font-semibold ${darkMode ? "text-amber-300" : "text-amber-800"}`}>
            Order #{order.orderId} - {order.restaurantName}
          </div>
          <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            {order.deliveryDate}
          </div>
        </div>

        <div className="mt-2">
          <Button
            onClick={() => {
                if (order.reviewed) {
                    navigate(`/order/${order.orderId}/comment`)
                }else {
                    navigate(`/order/${order.orderId}/review`)
                }
                
            }}
            className={`text-sm ${
              darkMode
                ? "text-amber-400 hover:text-amber-300"
                : "text-amber-600 hover:text-amber-700"
            }`}
          >
            {order.reviewed? "View Review": "Review"}
          </Button>
        </div>
      </div>
    </div>
  );
};

const OrderSection = ({ title, orders, darkMode, onViewDetails }) => {
  return (
    <div className="space-y-4">
        {/* --- Order Detail Modal --- */}
      <h2
        className={`text-lg font-semibold border-b pb-2 mb-4 ${
          darkMode ? "border-gray-700 text-amber-400" : "border-gray-300 text-amber-700"
        }`}
      >
        {title}
      </h2>
      {orders.length === 0 ? (
        <p
          className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
        >
          No orders found.
        </p>
      ) : (
        orders.map((order) => (
          <OrderCard
            key={order.orderId}
            order={order}
            darkMode={darkMode}
          />
        ))
      )}
    </div>
  );
};

export default function PastOrdersPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const customerEmail = localStorage.getItem("email");
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const getOrders = async () => {
        const response = await AuthorizedRequest.getRequest(`http://localhost:8080/order/details/get-orders-of/${customerEmail}`);
        setOrders(response.data)
    }
    getOrders();
  }, []);


  const handleViewDetails = (orderId) => {
    setSelectedOrderId(orderId);
  };

  const handleCloseModal = () => {
    setSelectedOrderId(null);
  };

  const selectedOrder = orders.find((order) => order.id === selectedOrderId);

  return (
    <div
      className={`flex flex-col min-h-screen ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gradient-to-b from-amber-50 to-amber-100"
      } transition-colors duration-300`}
    >
      {/* Header */}
      <header
        className={`${
          darkMode ? "bg-gray-800" : "bg-[#47300A]"
        } text-white py-3 px-6 flex justify-between items-center sticky top-0 z-10 shadow-md transition-colors duration-300`}
      >
        <div className="flex items-center">
          <a
            href="/"
            className="font-bold text-xl hover:text-amber-200 transition-colors duration-200 flex items-center gap-2"
          >
            <Utensils className="w-5 h-5" />
            <span>Doy!</span>
          </a>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
              className={`${
                darkMode ? "data-[state=checked]:bg-gray-600" : "data-[state=checked]:bg-amber-200"
              } transition-colors duration-300`}
            />
            {darkMode ? (
              <Sun className="w-4 h-4 text-yellow-300" />
            ) : (
              <Moon className="w-4 h-4 text-amber-200" />
            )}
          </div>
          <a
            href="/register"
            className={`${
              darkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-amber-200 text-amber-800 hover:bg-amber-300"
            } rounded-full px-5 py-1.5 text-sm font-medium transition-all duration-200 transform hover:scale-105`}
          >
            KAYIT
          </a>
          <a
            href="/login"
            className={`${
              darkMode ? "bg-gray-600 text-white hover:bg-gray-500" : "bg-white text-amber-800 hover:bg-amber-50"
            } rounded-full px-5 py-1.5 text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-sm`}
          >
            GİRİŞ
          </a>
        </div>
      </header>

      {/* Logo */}
      <div className={`flex justify-center py-8 ${mounted ? "animate-fadeIn" : "opacity-0"}`}>
        <div
          className={`rounded-full ${
            darkMode ? "bg-gray-800" : "bg-white"
          } p-6 w-36 h-36 flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-105`}
        >
          <div className="relative w-28 h-28">
            <img src="/image1.png" alt="DOY Logo" width={112} height={112} className="w-full h-full" />
            <div
              className={`text-center text-[10px] font-bold mt-1 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              FOOD DELIVERY
            </div>
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <div className="flex-grow flex justify-center items-start px-4 pb-12">
        <div
          className={`w-full max-w-2xl ${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-lg p-8 shadow-lg transition-all duration-300 ${
            mounted ? "animate-slideUp" : "opacity-0 translate-y-10"
          }`}
        >
          <h1
            className={`text-2xl font-bold ${darkMode ? "text-amber-300" : "text-amber-800"} text-center mb-6`}
          >
            Past Orders
          </h1>
          <div className="space-y-8">
            <OrderSection
              title="Your Orders"
              orders={orders}
              darkMode={darkMode}
              onViewDetails={handleViewDetails}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        className={`${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-amber-50 border-amber-200"
        } p-8 border-t transition-colors duration-300 mt-auto`}
      >
        <div className="flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto">
          <div className="mb-6 md:mb-0">
            <div
              className={`rounded-full ${
                darkMode ? "bg-gray-800" : "bg-white"
              } p-4 w-24 h-24 flex items-center justify-center shadow-md transition-all duration-300 hover:shadow-lg transform hover:scale-105`}
            >
              <div className="relative w-16 h-16">
                <img src="/image1.png" alt="DOY Logo" width={64} height={64} className="w-full h-full" />
                <div
                  className={`text-center text-[8px] font-bold mt-1 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  FOOD DELIVERY
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-8">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`${
                darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-amber-800"
              } transition-all duration-200 transform hover:scale-110`}
              aria-label="Twitter"
            >
              <Twitter className="w-6 h-6" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`${
                darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-amber-800"
              } transition-all duration-200 transform hover:scale-110`}
              aria-label="Instagram"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`${
                darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-amber-800"
              } transition-all duration-200 transform hover:scale-110`}
              aria-label="YouTube"
            >
              <Youtube className="w-6 h-6" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`${
                darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-amber-800"
              } transition-all duration-200 transform hover:scale-110`}
              aria-label="LinkedIn"
            >
              <Linkedin className="w-6 h-6" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}