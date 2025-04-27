// restaurantDetailApi.js
// Restoran detay sayfası için özel API servisi - Fiyat düzeltmeleri ile

import API from './restaurantApi';
import MenuMapperAPI from './menuMapperApi';

// Güvenli sayı dönüşümü için yardımcı fonksiyon
const ensureValidNumber = (value, defaultValue = 0) => {
  // Eğer value zaten bir sayıysa, doğrudan döndür
  if (typeof value === 'number' && !isNaN(value)) {
    return value;
  }
  
  // String ise, sayıya dönüştürmeyi dene
  if (typeof value === 'string') {
    // Sayısal olmayan karakterleri temizle (TL, ₺, vb.)
    const cleanedValue = value.replace(/[^\d.,]/g, '').replace(',', '.');
    const parsedValue = parseFloat(cleanedValue);
    
    // Dönüşüm başarılıysa, sayıyı döndür
    if (!isNaN(parsedValue)) {
      return parsedValue;
    }
  }
  
  // Hiçbir şekilde dönüştürülemezse, varsayılan değeri döndür
  return defaultValue;
};

// Rastgele ürün açıklamaları üretmek için yardımcı fonksiyon
const generateDescription = (itemName, category) => {
  const descriptions = {
    burger: [
      "Ev yapımı burger ekmeğiyle, 120 gr. ev yapımı burger köftesi, marul, burger sos, mayonez",
      "Özel soslarla marine edilmiş 150 gr dana köfte, cheddar peyniri, karamelize soğan, domates, marul ve özel burger sosu ile",
      "Taze hamburger ekmeği arasında 130 gr. dana köfte, cheddar peyniri, karamelize soğan ve özel soslar",
      "Brioche ekmeği arasında 140 gr. etli köfte, kaşar peyniri, domates, kornişon turşu ve özel sos"
    ],
    pizza: [
      "İtalyan hamuru üzerinde domates sos, mozarella, zeytinyağı ve taze fesleğen yaprakları",
      "Özel pizza hamuru üzerinde domates sos, mozarella peyniri ve İtalyan baharatları",
      "Taş fırında pişirilmiş ince hamur üzerinde domates sosu, mozzarella peyniri ve taze baharatlar",
      "El açması hamur üzerinde özel domates sos, kaşar peyniri ve seçtiğiniz malzemeler"
    ],
    kebap: [
      "Özel baharatlarla marine edilmiş kuzu eti, közde pişirilmiş sebzeler ve özel soslar eşliğinde",
      "Taze baharatlarla hazırlanmış et, közlenmiş domates ve biber, soğan ve sumaklı soğan salatası ile",
      "Özel baharat karışımı ile marine edilmiş dana eti, taze sebzeler ve lavash ekmeği ile",
      "Odun ateşinde pişirilmiş kuzu eti, köz biber, domates ve özel soslarla"
    ],
    icecek: [
      "Cam şişede sade soda",
      "Soğuk servis edilir",
      "Ferahlatıcı içecek",
      "Buzlu servis edilir"
    ],
    tatlı: [
      "Taze mevsim meyveleri ile",
      "Özel şerbeti ve fındık ile",
      "Ev yapımı özel tarif",
      "Kaymak ile servis edilir"
    ],
    patates: [
      "Parmak dilim patates kızartması",
      "Çıtır patates kızartması, özel baharatlarla",
      "Taze patateslerden hazırlanmış kızartma",
      "Ev yapımı soslarla servis edilen patates kızartması"
    ],
    default: [
      "Şefin özel tarifi",
      "Taze malzemelerle hazırlanmış",
      "Özenle seçilmiş malzemelerle",
      "Özel baharat karışımı ile"
    ]
  };

  let type = 'default';
  
  // Ürün adına göre açıklama türünü belirle
  const nameLower = itemName.toLowerCase();
  if (nameLower.includes('burger') || nameLower.includes('hamburger')) type = 'burger';
  else if (nameLower.includes('pizza')) type = 'pizza';
  else if (nameLower.includes('kebap') || nameLower.includes('kebab') || nameLower.includes('döner')) type = 'kebap';
  else if (nameLower.includes('soda') || nameLower.includes('çay') || nameLower.includes('kahve') || nameLower.includes('su')) type = 'icecek';
  else if (nameLower.includes('tatlı') || nameLower.includes('baklava') || nameLower.includes('pasta')) type = 'tatlı';
  else if (nameLower.includes('patates')) type = 'patates';
  
  // Kategori bilgisine göre düzeltme yap
  if (category === 'İçecekler') type = 'icecek';
  else if (category === 'Ekstralar' && nameLower.includes('patates')) type = 'patates';
  else if (category === 'Ekstralar' && (nameLower.includes('tatlı') || nameLower.includes('baklava'))) type = 'tatlı';
  
  // Rastgele bir açıklama seç
  const descriptionsForType = descriptions[type];
  return descriptionsForType[Math.floor(Math.random() * descriptionsForType.length)];
};

// API'dan gelen menü öğelerini RestaurantDetailPage'e uygun formata dönüştür
const transformMenuItems = (restaurant) => {
  if (!restaurant) return null;
  
  // Menü öğelerini kontrol et ve fiyatları düzelt
  if (restaurant.menuItems && restaurant.menuItems.length > 0) {
    restaurant.menuItems = restaurant.menuItems.map(item => ({
      ...item,
      // Fiyatı sayısal değere dönüştür
      price: ensureValidNumber(item.price, 
        // Kategori bazlı varsayılan fiyatlar
        item.category === "Menüler" ? 250 : 
        item.category === "İçecekler" ? 35 : 
        item.category === "Ekstralar" ? 80 : 150)
    }));
  }
  // Menü öğeleri eklenmemişse, rastgele menü öğeleri oluştur
  else {
    const menuItems = [];
    const cuisineType = restaurant.cuisine || "Türk Mutfağı";
    
    // Menüler kategorisi için 2-4 öğe
    for (let i = 1; i <= 2 + Math.floor(Math.random() * 3); i++) {
      menuItems.push({
        id: `menu-${i}`,
        name: `${cuisineType} Menü ${i}`,
        category: "Menüler",
        description: generateDescription(`${cuisineType} Menü`, "Menüler"),
        price: 200 + Math.floor(Math.random() * 150), // 200-350 TL
        isPopular: Math.random() < 0.3
      });
    }
    
    // Yiyecekler kategorisi için 6-10 öğe
    for (let i = 1; i <= 6 + Math.floor(Math.random() * 5); i++) {
      const foodName = cuisineType.includes("Burger") ? `${cuisineType} ${i}` :
                       cuisineType.includes("Pizza") ? `${cuisineType} ${i}` :
                       cuisineType.includes("Kebap") ? `${cuisineType} ${i}` :
                       `${cuisineType} Yemek ${i}`;
      
      menuItems.push({
        id: `food-${i}`,
        name: foodName,
        category: "Yiyecekler",
        description: generateDescription(foodName, "Yiyecekler"),
        price: 100 + Math.floor(Math.random() * 150), // 100-250 TL
        isPopular: Math.random() < 0.2
      });
    }
    
    // İçecekler kategorisi için 4-8 öğe
    const drinkTypes = ["Cola", "Ayran", "Su", "Soda", "Meyve Suyu", "Çay", "Kahve", "Türk Kahvesi"];
    for (let i = 1; i <= 4 + Math.floor(Math.random() * 5); i++) {
      const drinkName = drinkTypes[Math.floor(Math.random() * drinkTypes.length)];
      menuItems.push({
        id: `drink-${i}`,
        name: drinkName,
        category: "İçecekler",
        description: generateDescription(drinkName, "İçecekler"),
        price: 15 + Math.floor(Math.random() * 40), // 15-55 TL
        isPopular: Math.random() < 0.1
      });
    }
    
    // Ekstralar kategorisi için 4-6 öğe
    const extraTypes = ["Patates Kızartması", "Soğan Halkası", "Çıtır Tavuk", "Yoğurt", "Salata", "Pilav", "Ekmek", "Meze Tabağı"];
    for (let i = 1; i <= 4 + Math.floor(Math.random() * 3); i++) {
      const extraName = extraTypes[Math.floor(Math.random() * extraTypes.length)];
      menuItems.push({
        id: `extra-${i}`,
        name: extraName,
        category: "Ekstralar",
        description: generateDescription(extraName, "Ekstralar"),
        price: 40 + Math.floor(Math.random() * 80), // 40-120 TL
        isPopular: Math.random() < 0.15
      });
    }
    
    // Tatlılar da Ekstralar kategorisine ekle
    const dessertTypes = ["Baklava", "Sütlaç", "Künefe", "Dondurma", "Profiterol", "Çikolatalı Pasta"];
    for (let i = 1; i <= 2 + Math.floor(Math.random() * 3); i++) {
      const dessertName = dessertTypes[Math.floor(Math.random() * dessertTypes.length)];
      menuItems.push({
        id: `dessert-${i}`,
        name: dessertName,
        category: "Ekstralar",
        description: generateDescription(dessertName, "Ekstralar"),
        price: 60 + Math.floor(Math.random() * 80), // 60-140 TL
        isPopular: Math.random() < 0.25
      });
    }
    
    // Menü öğelerini ekle
    restaurant.menuItems = menuItems;
  }
  
  // MenuMapperAPI ile menü öğelerini düzenle
  return MenuMapperAPI.processRestaurantData(restaurant);
};

// Ana API nesnesi
const RestaurantDetailAPI = {
  // Restoran detaylarını getir
  getRestaurantDetails: async (id) => {
    try {
      // Ana API'dan veri al
      const restaurant = await API.getRestaurantById(id);
      
      // Menü öğelerini düzenle
      return transformMenuItems(restaurant);
    } catch (error) {
      console.error("Restoran detayları alınırken hata:", error);
      throw error;
    }
  },
  
  // Sepeti kaydet
  saveCart: (cart) => {
    try {
      // Fiyatları sayısal hale getirip kaydet
      const fixedCart = cart.map(item => ({
        ...item,
        price: ensureValidNumber(item.price)
      }));
      
      localStorage.setItem('doyCart', JSON.stringify(fixedCart));
      return true;
    } catch (error) {
      console.error("Sepet kaydedilirken hata:", error);
      return false;
    }
  },
  
  // Sepeti getir
  getCart: () => {
    try {
      const savedCart = localStorage.getItem('doyCart');
      
      if (!savedCart) return [];
      
      // Fiyatları sayısal hale getir
      const cart = JSON.parse(savedCart);
      return cart.map(item => ({
        ...item,
        price: ensureValidNumber(item.price)
      }));
    } catch (error) {
      console.error("Sepet alınırken hata:", error);
      return [];
    }
  },
  
  // Sipariş oluştur
  submitOrder: async (restaurantId, cartItems, deliveryAddress, paymentMethod) => {
    try {
      // Cart itemların fiyatlarını düzelt
      const fixedCartItems = cartItems.map(item => ({
        ...item,
        price: ensureValidNumber(item.price)
      }));
      
      // Mock bir API çağrısı simüle ediyoruz
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            orderId: `ORD-${Date.now()}`,
            status: "Sipariş Alındı",
            estimatedDeliveryTime: `${20 + Math.floor(Math.random() * 20)} dakika`,
            restaurant: {
              id: restaurantId
            },
            orderItems: fixedCartItems,
            totalAmount: fixedCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            deliveryAddress,
            paymentMethod,
            orderDate: new Date().toISOString()
          });
        }, 800);
      });
    } catch (error) {
      console.error("Sipariş oluşturulurken hata:", error);
      throw error;
    }
  }
};

export default RestaurantDetailAPI;