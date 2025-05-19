// profileData.js - Farklı kullanıcı tipleri için mock profil verilerini içerir
// Backend entegrasyonu tamamlandığında bu dosya gerçek API çağrılarıyla değiştirilecektir

// Müşteri verileri
import axios from "axios";
export const customers = [
  {
    id: 1,
    name: "Ahmet Yılmaz",
    email: "ahmet@ornek.com",
    phone: "+90 532 123 4567",
    address: "Ataşehir, İstanbul",
    profileImage: null,
    allergens: {
      1: true, // Süt
      2: false, // Yumurta
      3: true, // Fıstık
      4: false, // Kabuklu Deniz Ürünleri
      5: false, // Buğday
      6: false, // Soya
      7: false, // Balık
      8: false, // Kereviz
      9: true, // Kuruyemiş
    },
    orders: [
      {
        id: 1001,
        restaurantName: "Kebapçı Selim",
        date: "12 Nisan 2025",
        status: "delivered",
        amount: 120.50
      },
      {
        id: 1002,
        restaurantName: "Pizza House",
        date: "10 Nisan 2025",
        status: "delivered",
        amount: 89.90
      },
      {
        id: 1003,
        restaurantName: "Sushi Express",
        date: "5 Nisan 2025",
        status: "delivered",
        amount: 245.00
      }
    ]
  },
  {
    id: 2,
    name: "Zeynep Kaya",
    email: "zeynep@ornek.com",
    phone: "+90 533 987 6543",
    address: "Kadıköy, İstanbul",
    profileImage: null,
    allergens: {
      1: false, // Süt
      2: true, // Yumurta
      3: false, // Fıstık
      4: true, // Kabuklu Deniz Ürünleri
      5: false, // Buğday
      6: false, // Soya
      7: true, // Balık
      8: false, // Kereviz
      9: false, // Kuruyemiş
    },
    orders: [
      {
        id: 2001,
        restaurantName: "Burger Palace",
        date: "11 Nisan 2025",
        status: "delivered",
        amount: 75.50
      },
      {
        id: 2002,
        restaurantName: "Çin Lokantası",
        date: "7 Nisan 2025",
        status: "delivered",
        amount: 110.00
      }
    ]
  },
  {
    id: 3,
    name: "Mehmet Demir",
    email: "mehmet@ornek.com",
    phone: "+90 541 456 7890",
    address: "Beyoğlu, İstanbul",
    profileImage: null,
    allergens: {
      1: false, // Süt
      2: false, // Yumurta
      3: false, // Fıstık
      4: false, // Kabuklu Deniz Ürünleri
      5: true, // Buğday (Gluten)
      6: false, // Soya
      7: false, // Balık
      8: false, // Kereviz
      9: false, // Kuruyemiş
    },
    orders: [
      {
        id: 3001,
        restaurantName: "Lahmacun Dünyası",
        date: "12 Nisan 2025",
        status: "processing",
        amount: 65.00
      }
    ]
  }
];

// Restoran verileri
export const restaurants = [
  {
    id: 1,
    name: "Kebapçı Selim",
    email: "info@kebapciselim.com",
    phone: "+90 212 345 6789",
    address: "Beşiktaş, İstanbul",
    cuisineTypes: ["Kebap", "Türk Mutfağı", "Izgara"],
    profileImage: null,
    coverImage: null,
    description: "1978'den beri hizmet veren otantik bir kebapçı.",
    workingHours: {
      "Pazartesi": { open: "10:00", close: "22:00" },
      "Salı": { open: "10:00", close: "22:00" },
      "Çarşamba": { open: "10:00", close: "22:00" },
      "Perşembe": { open: "10:00", close: "22:00" },
      "Cuma": { open: "10:00", close: "23:00" },
      "Cumartesi": { open: "10:00", close: "23:00" },
      "Pazar": { open: "11:00", close: "22:00" }
    },
    stats: {
      monthlyOrders: 1250,
      onTimeDelivery: "98%",
      avgPrepTime: "15 dk"
    }
  },
  {
    id: 2,
    name: "Pizza House",
    email: "info@pizzahouse.com",
    phone: "+90 212 876 5432",
    address: "Şişli, İstanbul",
    cuisineTypes: ["Pizza", "İtalyan", "Fast Food"],
    profileImage: null,
    coverImage: null,
    description: "İtalyan şeflerimizin özel tarifleriyle hazırlanan lezzetli pizzalar.",
    workingHours: {
      "Pazartesi": { open: "11:00", close: "23:00" },
      "Salı": { open: "11:00", close: "23:00" },
      "Çarşamba": { open: "11:00", close: "23:00" },
      "Perşembe": { open: "11:00", close: "23:00" },
      "Cuma": { open: "11:00", close: "00:00" },
      "Cumartesi": { open: "11:00", close: "00:00" },
      "Pazar": { open: "12:00", close: "23:00" }
    },
    stats: {
      monthlyOrders: 980,
      onTimeDelivery: "95%",
      avgPrepTime: "20 dk"
    }
  },
  {
    id: 3,
    name: "Sushi Express",
    email: "info@sushiexpress.com",
    phone: "+90 212 234 5678",
    address: "Levent, İstanbul",
    cuisineTypes: ["Japon", "Sushi", "Asya Mutfağı"],
    profileImage: null,
    coverImage: null,
    description: "Taze deniz ürünleri ile hazırlanan otantik Japon lezzetleri.",
    workingHours: {
      "Pazartesi": { open: "12:00", close: "22:00" },
      "Salı": { open: "12:00", close: "22:00" },
      "Çarşamba": { open: "12:00", close: "22:00" },
      "Perşembe": { open: "12:00", close: "22:00" },
      "Cuma": { open: "12:00", close: "23:00" },
      "Cumartesi": { open: "12:00", close: "23:00" },
      "Pazar": { open: "12:00", close: "21:00" }
    },
    stats: {
      monthlyOrders: 750,
      onTimeDelivery: "97%",
      avgPrepTime: "25 dk"
    }
  }
];

// Kurye verileri
export const couriers = [
  {
    id: 1,
    firstName: "Ali",
    lastName: "Öztürk",
    fullName: "Ali Öztürk",
    email: "ali.ozturk@ornek.com",
    phone: "+90 542 123 4567",
    idNumber: "12345678901",
    address: "Üsküdar, İstanbul",
    profileImage: null,
    vehicleType: "Motorsiklet",
    licensePlate: "34 ABC 123",
    workSchedule: "Tam Zamanlı", // Tam Zamanlı, Yarı Zamanlı, Serbest Zamanlı
    workingHours: {
      start: "09:00",
      end: "18:00"
    },
    workingDays: {
      "Pazartesi": true,
      "Salı": true,
      "Çarşamba": true,
      "Perşembe": true,
      "Cuma": true,
      "Cumartesi": false,
      "Pazar": false
    },
    stats: {
      customerRating: 4.8,
      onTimeDelivery: "96%",
      weeklyOrders: 65,
      avgDeliveryTime: "28 dk"
    }
  },
  {
    id: 2,
    firstName: "Ayşe",
    lastName: "Çelik",
    fullName: "Ayşe Çelik",
    email: "ayse.celik@ornek.com",
    phone: "+90 543 765 4321",
    idNumber: "23456789012",
    address: "Kartal, İstanbul",
    profileImage: null,
    vehicleType: "Elektrikli Bisiklet",
    licensePlate: "-",
    workSchedule: "Yarı Zamanlı",
    workingHours: {
      start: "14:00",
      end: "20:00"
    },
    workingDays: {
      "Pazartesi": true,
      "Salı": false,
      "Çarşamba": true,
      "Perşembe": false,
      "Cuma": true,
      "Cumartesi": true,
      "Pazar": false
    },
    stats: {
      customerRating: 4.9,
      onTimeDelivery: "98%",
      weeklyOrders: 35,
      avgDeliveryTime: "32 dk"
    }
  },
  {
    id: 3,
    firstName: "Emre",
    lastName: "Şahin",
    fullName: "Emre Şahin",
    email: "emre.sahin@ornek.com",
    phone: "+90 544 987 6543",
    idNumber: "34567890123",
    address: "Beykoz, İstanbul",
    profileImage: null,
    vehicleType: "Otomobil",
    licensePlate: "34 DEF 456",
    workSchedule: "Serbest Zamanlı",
    workingHours: {
      start: "16:00",
      end: "23:00"
    },
    workingDays: {
      "Pazartesi": false,
      "Salı": true,
      "Çarşamba": true,
      "Perşembe": false,
      "Cuma": true,
      "Cumartesi": true,
      "Pazar": true
    },
    stats: {
      customerRating: 4.7,
      onTimeDelivery: "94%",
      weeklyOrders: 42,
      avgDeliveryTime: "35 dk"
    }
  }
];

// ID'ye göre müşteri alma fonksiyonu
export const getCustomerById = (id) => {
  // ID string olarak gelebileceği için parseInt kullanıyoruz
  const numericId = parseInt(id, 10);
  // ID geçerli değilse veya veri yoksa, ilk müşteriyi döndürüyoruz (varsayılan)
  if (isNaN(numericId) || numericId < 1 || numericId > customers.length) {
    return customers[0];
  }
  // 1-tabanlı indeksleme için dizide 0-tabanlı indekslemeye çeviriyoruz
  return customers[numericId - 1];
};

// ID'ye göre restoran alma fonksiyonu
export const getRestaurantById = (id) => {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId) || numericId < 1 || numericId > restaurants.length) {
    return restaurants[0];
  }
  return restaurants[numericId - 1];
};

// ID'ye göre kurye alma fonksiyonu
export const getCourierById = (id) => {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId) || numericId < 1 || numericId > couriers.length) {
    return couriers[0];
  }
  return couriers[numericId - 1];
};

export const getUserById = async(id) => {
  
  let user = null

  try {
    const token = localStorage.getItem("token")
    const userResponse = await axios.get(`http://localhost:8080/api/users/get-by-id/${id}`, 
      { headers: { Authorization: `Bearer ${token}` } })
    

      const userData = userResponse.data
      let url
    switch (userData.role) {
      case "CUSTOMER":
        url = `http://localhost:8080/api/users/customers/get-by-email/${userData.email}`
        break;
      case "COURIER":
        url = `http://localhost:8080/api/users/couriers/get-by-email/${userData.email}`
        break;
      case "RESTAURANT_OWNER":
        url = `http://localhost:8080/api/users/restaurant-owners/get-by-email/${userData.email}`
        break;
      case "ADMIN":
        url = null
        break;
      default:
        url = null
        break;
    }
    

    const userTypeResponse = await axios.get(url, 
      { headers: { Authorization: `Bearer ${token}` } })
    console.log(userTypeResponse)
    user = userTypeResponse.data 

  } catch (error) {
    console.error("Error " + error)
  }
  
  return user
};

