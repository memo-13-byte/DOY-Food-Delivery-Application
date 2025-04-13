// CourierService.js - Kurye verilerini yönetmek için kullanılacak servis
// Bu servis şu anda mock veriler kullanıyor, ancak gerçek API entegrasyonu için hazır bir başlangıç noktası

import { couriers, getCourierById } from './profileData';

export default class CourierService {
  // Tüm kuryeleri getir
  static getAllCouriers() {
    return couriers;
  }

  // ID'ye göre kurye getir
  static getCourierById(id) {
    return getCourierById(id);
  }

  // Email'e göre kurye ara
  static getCourierByEmail(email) {
    return couriers.find(courier => courier.email === email) || null;
  }

  // Kurye profil bilgilerini güncelle (demo amaçlı - gerçek dünyada API kullanılacak)
  static updateCourierProfile(id, profileData) {
    // Bu bir mock fonksiyondur - gerçek implementasyonda API isteği yapılacak
    console.log(`ID: ${id} olan kurye profilini güncelleme isteği:`, profileData);
    return {
      success: true,
      message: "Profil bilgileri başarıyla güncellendi"
    };
  }

  // Kurye çalışma programını güncelle
  static updateCourierWorkSchedule(id, workScheduleData) {
    // Bu bir mock fonksiyondur - gerçek implementasyonda API isteği yapılacak
    console.log(`ID: ${id} olan kuryenin çalışma programını güncelleme isteği:`, workScheduleData);
    return {
      success: true,
      message: "Çalışma programı başarıyla güncellendi"
    };
  }

  // Kurye çalışma günlerini güncelle
  static updateCourierWorkingDays(id, workingDays) {
    // Bu bir mock fonksiyondur - gerçek implementasyonda API isteği yapılacak
    console.log(`ID: ${id} olan kuryenin çalışma günlerini güncelleme isteği:`, workingDays);
    return {
      success: true,
      message: "Çalışma günleri başarıyla güncellendi"
    };
  }

  // Kurye araç bilgilerini güncelle
  static updateCourierVehicleInfo(id, vehicleData) {
    // Bu bir mock fonksiyondur - gerçek implementasyonda API isteği yapılacak
    console.log(`ID: ${id} olan kuryenin araç bilgilerini güncelleme isteği:`, vehicleData);
    return {
      success: true,
      message: "Araç bilgileri başarıyla güncellendi"
    };
  }

  // Kurye şifresini değiştir
  static changePassword(id, currentPassword, newPassword) {
    // Bu bir mock fonksiyondur - gerçek implementasyonda API isteği yapılacak
    console.log(`ID: ${id} olan kuryenin şifre değiştirme isteği`);
    return {
      success: true,
      message: "Şifre başarıyla değiştirildi"
    };
  }

  // API entegrasyonu için örnek metod
  static async fetchCouriersFromAPI() {
    try {
      // Gerçek implementasyonda API'dan veri çekilecek
      // const response = await fetch('https://api.example.com/couriers');
      // return await response.json();
      
      // Şimdilik mock veri dönüyoruz
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(couriers);
        }, 300); // Simüle edilmiş ağ gecikmesi
      });
    } catch (error) {
      console.error("Kuryeleri getirirken hata oluştu:", error);
      throw error;
    }
  }
}