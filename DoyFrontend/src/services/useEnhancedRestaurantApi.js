// useEnhancedRestaurantApi.js
// Restoran detay sayfası için geliştirilmiş API hook'u - Fiyat düzeltmeleri ile

import { useState, useEffect, useCallback } from 'react';
import API from './restaurantApi';
import RestaurantDetailAPI from './restaurantDetailApi';
import MenuMapperAPI from './menuMapperApi';

// Fiyat değerlerinin doğruluğunu kontrol eden yardımcı fonksiyon
const ensureValidPrice = (price, defaultPrice = 0) => {
  // Eğer price zaten geçerli bir sayıysa, olduğu gibi döndür
  if (typeof price === 'number' && !isNaN(price)) {
    return price;
  }
  
  // Eğer string ise, sayıya dönüştürmeyi dene
  if (typeof price === 'string') {
    // TL, ₺ gibi karakterleri temizle
    const cleanedPrice = price.replace(/[^\d.,]/g, '').replace(',', '.');
    const parsedPrice = parseFloat(cleanedPrice);
    
    if (!isNaN(parsedPrice)) {
      return parsedPrice;
    }
  }
  
  // Hiçbir şekilde dönüştürülemezse, varsayılan değeri döndür
  return defaultPrice;
};

// Restoran detay sayfası için geliştirilmiş API hook'u
export const useEnhancedRestaurantApi = () => {
  const [currentRestaurant, setCurrentRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState(() => RestaurantDetailAPI.getCart());

  // Sepet işlemleri
  useEffect(() => {
    // Sepet değiştiğinde localStorage'a kaydet
    RestaurantDetailAPI.saveCart(cart);
  }, [cart]);

  // Ürün sepete ekle
  const addToCart = useCallback((item) => {
    // Fiyat değerini sayısal hale getir
    const fixedItem = {
      ...item,
      price: ensureValidPrice(item.price)
    };
    
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === fixedItem.id);
      
      if (existingItem) {
        return prevCart.map(cartItem => 
          cartItem.id === fixedItem.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 } 
            : cartItem
        );
      } else {
        return [...prevCart, { ...fixedItem, quantity: 1 }];
      }
    });
  }, []);

  // Ürünü sepetten çıkar
  const removeFromCart = useCallback((itemId) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === itemId);
      
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(cartItem => 
          cartItem.id === itemId 
            ? { ...cartItem, quantity: cartItem.quantity - 1 } 
            : cartItem
        );
      } else {
        return prevCart.filter(cartItem => cartItem.id !== itemId);
      }
    });
  }, []);

  // Sepeti temizle
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Sepet toplamını hesapla
  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => {
      // Fiyatın sayısal olduğundan emin ol
      const price = ensureValidPrice(item.price);
      return total + (price * item.quantity);
    }, 0);
  }, [cart]);

  // ID'ye göre restoran getir (detaylı)
  const fetchRestaurantById = useCallback(async (id) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // RestaurantDetailAPI kullanarak detaylı bilgi getir
      const data = await RestaurantDetailAPI.getRestaurantDetails(id);
      
      // Restoran verisi kontrol et
      if (!data) {
        throw new Error("Restoran bilgisi alınamadı");
      }
      
      // Fiyat kontrolü
      if (data.menuItems && Array.isArray(data.menuItems)) {
        data.menuItems = data.menuItems.map(item => ({
          ...item,
          price: ensureValidPrice(item.price, 
            // Kategori bazlı varsayılan fiyatlar
            item.category === "Menüler" ? 250 : 
            item.category === "İçecekler" ? 35 : 
            item.category === "Ekstralar" ? 80 : 150)
        }));
      }
      
      setCurrentRestaurant(data);
      
      // Menü öğelerini kategorilere ayır
      if (data) {
        setMenuItems(data.processedMenu);
      }
      
      return data;
    } catch (err) {
      console.error("Restoran getirme hatası:", err);
      setError(err.message || 'Restoran bilgileri yüklenirken bir hata oluştu');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sipariş oluştur
  const submitOrder = useCallback(async (restaurantId, deliveryAddress, paymentMethod) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Sepet boşsa hata fırlat
      if (cart.length === 0) {
        throw new Error("Sepetiniz boş. Lütfen ürün ekleyin.");
      }
      
      // Fiyatları düzeltilmiş sepet
      const fixedCart = cart.map(item => ({
        ...item,
        price: ensureValidPrice(item.price)
      }));
      
      // API'ı çağır ve sipariş oluştur
      const orderResult = await RestaurantDetailAPI.submitOrder(
        restaurantId, 
        fixedCart, 
        deliveryAddress || "Default address",
        paymentMethod || "Kapıda ödeme"
      );
      
      // Başarılı ise sepeti temizle
      if (orderResult) {
        clearCart();
      }
      
      return orderResult;
    } catch (err) {
      setError(err.message || 'Sipariş oluşturulurken bir hata oluştu');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [cart, clearCart]);

  // Kullanılabilir kategorileri getir
  const getCategories = useCallback(() => {
    return ["Menüler", "Yiyecekler", "İçecekler", "Ekstralar"];
  }, []);

  // Kategori bazlı menü öğelerini getir
  const getMenuItemsByCategory = useCallback((category) => {
    if (!menuItems) return [];
    
    // Kategori için menü öğeleri
    const items = menuItems[category] || [];
    
    // Fiyatları düzelt
    return items.map(item => ({
      ...item,
      price: ensureValidPrice(item.price, 
        // Kategori bazlı varsayılan fiyatlar
        category === "Menüler" ? 250 : 
        category === "İçecekler" ? 35 : 
        category === "Ekstralar" ? 80 : 150)
    }));
  }, [menuItems]);

  return {
    // State
    currentRestaurant,
    menuItems,
    cart,
    isLoading,
    error,
    
    // Cart işlemleri
    addToCart,
    removeFromCart,
    clearCart,
    getCartTotal,
    
    // Restoran işlemleri
    fetchRestaurantById,
    getCategories,
    getMenuItemsByCategory,
    
    // Sipariş işlemleri
    submitOrder
  };
};

export default useEnhancedRestaurantApi;