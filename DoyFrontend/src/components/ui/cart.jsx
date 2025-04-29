import { useState } from "react"
import { useCart } from "../../hooks/cart-context"
import { 
  X, 
  ShoppingCart, 
  Minus, 
  Plus, 
  Trash2,
  CreditCard,
  ArrowRight
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function Cart() {
  const { 
    cartItems, 
    totalItems, 
    totalPrice, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeItem,
    clearCart
  } = useCart()
  
  const [checkoutStep, setCheckoutStep] = useState("cart") // cart, address, payment, confirmation

  // Format price in Turkish Lira
  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', { 
      style: 'currency', 
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  // Calculate delivery fee (free if total is over 300)
  const deliveryFee = totalPrice > 300 ? 0 : 30
  
  // Calculate final total with delivery fee
  const finalTotal = totalPrice + deliveryFee

  // Variants for animations
  const cartVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      x: '100%', 
      opacity: 0,
      transition: { 
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.2 }
    }
  }

  // Render different content based on checkout step
  const renderContent = () => {
    switch (checkoutStep) {
      case "cart":
        return (
          <>
            <div className="flex-grow overflow-y-auto py-4">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <ShoppingCart className="h-16 w-16 text-amber-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Sepetiniz Boş</h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Sepetinize ürün eklemek için restoran sayfalarını ziyaret edebilirsiniz.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-amber-500 text-white px-6 py-2 rounded-full text-sm font-medium"
                    onClick={() => setIsCartOpen(false)}
                  >
                    Restoranlara Göz At
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-4 px-4">
                  <AnimatePresence>
                    {cartItems.map((item) => (
                      <motion.div
                        key={item.id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        layout
                        className="flex items-center p-3 bg-white rounded-lg shadow-sm"
                      >
                        <div className="h-16 w-16 bg-amber-100 rounded-md overflow-hidden mr-3 flex-shrink-0">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <ShoppingCart className="h-8 w-8 text-amber-400" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-grow min-w-0">
                          <h4 className="font-medium text-sm truncate">{item.name}</h4>
                          {item.description && (
                            <p className="text-xs text-gray-500 line-clamp-1">{item.description}</p>
                          )}
                          <div className="mt-1 flex items-center justify-between">
                            <span className="text-amber-600 font-semibold">
                              {formatPrice(item.price)}
                            </span>
                            
                            <div className="flex items-center">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-1 rounded-full bg-amber-100"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3 text-amber-600" />
                              </motion.button>
                              
                              <span className="mx-2 text-sm font-medium w-5 text-center">
                                {item.quantity}
                              </span>
                              
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-1 rounded-full bg-amber-100"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3 text-amber-600" />
                              </motion.button>
                              
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="ml-2 p-1 rounded-full text-red-500"
                                onClick={() => removeItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
            
            {cartItems.length > 0 && (
              <div className="border-t border-gray-200 p-4">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ara Toplam</span>
                    <span className="font-medium">{formatPrice(totalPrice)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Teslimat Ücreti</span>
                    <span className={deliveryFee === 0 ? "text-green-600 font-medium" : "font-medium"}>
                      {deliveryFee === 0 ? "Ücretsiz" : formatPrice(deliveryFee)}
                    </span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between">
                    <span className="font-medium">Toplam</span>
                    <span className="font-bold text-amber-600">{formatPrice(finalTotal)}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-full font-medium text-sm transition-colors flex items-center justify-center"
                    onClick={() => setCheckoutStep("address")}
                  >
                    Siparişi Tamamla
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full border border-gray-300 text-gray-700 py-2 rounded-full font-medium text-sm transition-colors flex items-center justify-center"
                    onClick={() => {
                      if (window.confirm("Sepetiniz boşaltılsın mı?")) {
                        clearCart()
                      }
                    }}
                  >
                    Sepeti Boşalt
                    <Trash2 className="ml-2 h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            )}
          </>
        )
        
      case "address":
        // In a real app, this would be a form for address entry
        return (
          <div className="flex flex-col h-full">
            <div className="flex-grow p-4">
              <h3 className="text-lg font-medium mb-4">Teslimat Adresi</h3>
              {/* Address form would go here */}
              <div className="space-y-4">
                <div className="bg-amber-100 rounded-lg p-4 text-center">
                  <p>Bu bir demo uygulamasıdır. Adres formu burada yer alacaktır.</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 p-4">
              <div className="flex justify-between mb-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="text-amber-600"
                  onClick={() => setCheckoutStep("cart")}
                >
                  Sepete Dön
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-full font-medium text-sm transition-colors"
                  onClick={() => setCheckoutStep("payment")}
                >
                  Devam Et
                </motion.button>
              </div>
            </div>
          </div>
        )
        
      case "payment":
        // In a real app, this would be a form for payment details
        return (
          <div className="flex flex-col h-full">
            <div className="flex-grow p-4">
              <h3 className="text-lg font-medium mb-4">Ödeme Bilgileri</h3>
              {/* Payment form would go here */}
              <div className="space-y-4">
                <div className="bg-amber-100 rounded-lg p-4 flex items-center justify-center">
                  <CreditCard className="h-8 w-8 text-amber-600 mr-2" />
                  <p>Bu bir demo uygulamasıdır. Ödeme formu burada yer alacaktır.</p>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Toplam</span>
                    <span className="font-bold text-amber-600">{formatPrice(finalTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 p-4">
              <div className="flex justify-between mb-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="text-amber-600"
                  onClick={() => setCheckoutStep("address")}
                >
                  Geri Dön
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-full font-medium text-sm transition-colors"
                  onClick={() => setCheckoutStep("confirmation")}
                >
                  Ödemeyi Tamamla
                </motion.button>
              </div>
            </div>
          </div>
        )
        
      case "confirmation":
        // Order confirmation
        return (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-10 w-10 text-green-600" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
            
            <h3 className="text-xl font-medium mb-2">Siparişiniz Alındı!</h3>
            <p className="text-gray-600 mb-6">
              Siparişiniz başarıyla alındı ve hazırlanıyor. Siparişinizin durumunu profilinizden takip edebilirsiniz.
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-amber-500 text-white px-6 py-2 rounded-full text-sm font-medium"
              onClick={() => {
                clearCart()
                setCheckoutStep("cart")
                setIsCartOpen(false)
              }}
            >
              Alışverişe Devam Et
            </motion.button>
          </div>
        )
        
      default:
        return null
    }
  }
  
  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-30"
            onClick={() => setIsCartOpen(false)}
          />
          
          {/* Cart panel */}
          <motion.div 
            className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-gray-50 shadow-lg z-40 flex flex-col"
            variants={cartVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Cart header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <div className="flex items-center">
                <ShoppingCart className="h-5 w-5 text-amber-500 mr-2" />
                <h2 className="font-medium">
                  {checkoutStep === "cart" && `Sepetim (${totalItems})`}
                  {checkoutStep === "address" && "Teslimat Adresi"}
                  {checkoutStep === "payment" && "Ödeme"}
                  {checkoutStep === "confirmation" && "Sipariş Onayı"}
                </h2>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-1 rounded-full hover:bg-gray-200"
                onClick={() => setIsCartOpen(false)}
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>
            
            {/* Cart content */}
            <div className="flex flex-col h-full">
              {renderContent()}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}