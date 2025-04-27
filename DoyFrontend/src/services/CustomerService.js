// CustomerService.js - Müşteri verilerini yönetmek için kullanılacak servis
// Bu servis şu anda mock veriler kullanıyor, ancak gerçek API entegrasyonu için hazır bir başlangıç noktası

import { customers, getCustomerById } from './profileData';
import axios from 'axios';

export default class CustomerService {

  static async RegisterCustomer(registrationInfo) {
    const response = await axios.post('http://localhost:8080/api/registration',
      registrationInfo);
  }



  // Tüm müşterileri getir
  static getAllCustomers() {
    return customers;
  }

  // ID'ye göre müşteri getir
  static getCustomerById(id) {
    return getCustomerById(id);
  }

  // Email'e göre müşteri ara
  static getCustomerByEmail(email) {
    return customers.find(customer => customer.email === email) || null;
  }

  // Müşteri profil bilgilerini güncelle (demo amaçlı - gerçek dünyada API kullanılacak)
  static updateCustomerProfile(id, profileData) {
    // Bu bir mock fonksiyondur - gerçek implementasyonda API isteği yapılacak
    console.log(`ID: ${id} olan müşteri profilini güncelleme isteği:`, profileData);
    return {
      success: true,
      message: "Profil bilgileri başarıyla güncellendi"
    };
  }

  // Müşteri alerjenlerini güncelle
  static updateCustomerAllergens(id, allergens) {
    // Bu bir mock fonksiyondur - gerçek implementasyonda API isteği yapılacak
    console.log(`ID: ${id} olan müşterinin alerjenlerini güncelleme isteği:`, allergens);
    return {
      success: true,
      message: "Alerjen bilgileri başarıyla güncellendi"
    };
  }

  // Müşteri şifresini değiştir
  static changePassword(id, currentPassword, newPassword) {
    // Bu bir mock fonksiyondur - gerçek implementasyonda API isteği yapılacak
    console.log(`ID: ${id} olan müşterinin şifre değiştirme isteği`);
    return {
      success: true,
      message: "Şifre başarıyla değiştirildi"
    };
  }

  // Müşteri sipariş geçmişini getir
  static getCustomerOrderHistory(id) {
    const customer = getCustomerById(id);
    return customer ? customer.orders : [];
  }

  // API entegrasyonu için örnek metod
  static async fetchCustomersFromAPI() {
    try {
      // Gerçek implementasyonda API'dan veri çekilecek
      // const response = await fetch('https://api.example.com/customers');
      // return await response.json();
      
      // Şimdilik mock veri dönüyoruz
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(customers);
        }, 300); // Simüle edilmiş ağ gecikmesi
      });
    } catch (error) {
      console.error("Müşterileri getirirken hata oluştu:", error);
      throw error;
    }
  }
}