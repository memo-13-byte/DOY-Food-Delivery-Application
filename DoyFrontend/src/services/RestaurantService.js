// RestaurantService.js - Restoran verilerini yönetmek için kullanılacak servis
// Bu servis şu anda mock veriler kullanıyor, ancak gerçek API entegrasyonu için hazır bir başlangıç noktası

import { restaurants, getRestaurantById } from './profileData';

export default class RestaurantService {
  // Tüm restoranları getir
  static getAllRestaurants() {
    return restaurants;
  }

  // ID'ye göre restoran getir
  static getRestaurantById(id) {
    return getRestaurantById(id);
  }

  // Mutfak tipine göre restoranları filtrele
  static getRestaurantsByCuisineType(cuisineType) {
    return restaurants.filter(restaurant => 
      restaurant.cuisineTypes.includes(cuisineType)
    );
  }

  // Yeni restoran ekle (demo amaçlı - gerçek dünyada API kullanılacak)
  static addRestaurant(restaurantData) {
    // Bu bir mock fonksiyondur - gerçek implementasyonda API isteği yapılacak
    console.log("Restoran ekleme isteği:", restaurantData);
    return {
      success: true,
      message: "Restoran başarıyla eklendi",
      id: Date.now() // Demo için geçici ID
    };
  }

  // Restoran bilgilerini güncelle (demo amaçlı - gerçek dünyada API kullanılacak)
  static updateRestaurant(id, restaurantData) {
    // Bu bir mock fonksiyondur - gerçek implementasyonda API isteği yapılacak
    console.log(`ID: ${id} olan restoranı güncelleme isteği:`, restaurantData);
    return {
      success: true,
      message: "Restoran bilgileri başarıyla güncellendi"
    };
  }

  // Restoran sil (demo amaçlı - gerçek dünyada API kullanılacak)
  static deleteRestaurant(id) {
    // Bu bir mock fonksiyondur - gerçek implementasyonda API isteği yapılacak
    console.log(`ID: ${id} olan restoranı silme isteği`);
    return {
      success: true,
      message: "Restoran başarıyla silindi"
    };
  }

  // API entegrasyonu için örnek metod
  static async fetchRestaurantsFromAPI() {
    try {
      // Gerçek implementasyonda API'dan veri çekilecek
      // const response = await fetch('https://api.example.com/restaurants');
      // return await response.json();
      
      // Şimdilik mock veri dönüyoruz
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(restaurants);
        }, 300); // Simüle edilmiş ağ gecikmesi
      });
    } catch (error) {
      console.error("Restoranları getirirken hata oluştu:", error);
      throw error;
    }
  }
}