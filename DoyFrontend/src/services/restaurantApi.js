// restaurantApi.js
// Enhanced mock API service for restaurant data with realistic Turkish content

import locations from './turkishLocations';

// Restaurant cuisines in Turkish with subcategories
const cuisines = [
  "Türk Mutfağı",
  "İtalyan",
  "Uzak Doğu",
  "Fast Food",
  "Deniz Ürünleri",
  "Kahvaltı",
  "Tatlı & Pasta",
  "Vejetaryen",
  "Kebap",
  "Pide & Lahmacun",
  "Burger",
  "Pizza",
  "Döner",
  "Ev Yemekleri",
  "Çiğ Köfte"
];

// Cuisine details for better categorization
const cuisineDetails = {
  "Türk Mutfağı": ["Kebap", "Pide", "Lahmacun", "Gözleme", "Mantı", "Köfte"],
  "İtalyan": ["Pizza", "Makarna", "Risotto", "Lazanya"],
  "Uzak Doğu": ["Sushi", "Çin", "Tayland", "Vietnam", "Kore"],
  "Fast Food": ["Burger", "Sandwich", "Tavuk", "Hot Dog"],
  "Deniz Ürünleri": ["Balık", "Karides", "Kalamar", "Midye"],
  "Kahvaltı": ["Serpme Kahvaltı", "Açma & Poğaça", "Omlet", "Menemen"],
  "Tatlı & Pasta": ["Baklava", "Sütlü Tatlılar", "Pasta", "Dondurma", "Börek"],
  "Vejetaryen": ["Sebze Yemekleri", "Vegan", "Salatalar"],
  "Kebap": ["Adana", "Urfa", "Şiş", "İskender", "Çöp Şiş"],
  "Pide & Lahmacun": ["Kaşarlı", "Kıymalı", "Kuşbaşılı", "Karışık", "Açık"],
  "Burger": ["Classic", "Cheeseburger", "Tavuk Burger", "Vegan Burger"],
  "Pizza": ["Margarita", "Karışık", "Sucuklu", "Sebzeli", "Ton Balıklı"],
  "Döner": ["Et Döner", "Tavuk Döner", "İskender", "Dürüm", "Porsiyon"],
  "Ev Yemekleri": ["Güveç", "Dolma", "Kuru Fasulye", "Köfte", "Pilav"],
  "Çiğ Köfte": ["Acılı", "Acısız", "Etsiz", "Dürüm", "Porsiyon"]
};

// Restaurant names with Turkish naming patterns
const restaurantNames = [
  "Anadolu Lezzetleri",
  "Boğaz Manzara",
  "Cevizli Bahçe",
  "Değirmen Lokantası",
  "Eski İstanbul",
  "Fıstık Kebap",
  "Gizli Bahçe",
  "Hatay Sofrası",
  "İncir Cafe",
  "Karadeniz Pide",
  "Lezzet Köşesi",
  "Meşhur Adana",
  "Nefis Mutfak",
  "Otantik Izgara",
  "Pera Bistro",
  "Reyhan Ev Yemekleri",
  "Sardunya Restaurant",
  "Taş Fırın Pizza",
  "Usta Dönerci",
  "Vanilya Pasta",
  "Yeşil Vadi",
  "Zeytin Cafe",
  "Akdeniz Balık",
  "Bereket Döner",
  "Çınar Ocakbaşı",
  "Doyum Noktası",
  "Efendi Restoran",
  "Fasl-ı Bahçe",
  "Güzel İzmir",
  "Huzur Cafe",
  "Ankara Kebap Salonu",
  "Beyaz Fırın",
  "Çıtır Simit Evi",
  "Dürümcü Emmi",
  "Ege Balık",
  "Fesleğen Pasta",
  "Gurme Köfte",
  "Hatır Kahve",
  "İrmik Tatlı Evi",
  "Karaköy Güllüoğlu",
  "Levent Börek",
  "Mahalle Fırını",
  "Nişantaşı Mantı",
  "Osmanlı Mutfağı",
  "Pilav Üstü Döner"
];

// Use neighborhoods from the imported locations file
const neighborhoods = locations.istanbulNeighborhoods;

// Images for restaurants - using more specific Turkish food images
// Note: Using placeholder images that would be replaced with real restaurant images in production
const restaurantImages = [
  "/api/placeholder/400/300?text=Türk+Mutfağı",
  "/api/placeholder/400/300?text=Kebap",
  "/api/placeholder/400/300?text=Pizza",
  "/api/placeholder/400/300?text=Burger",
  "/api/placeholder/400/300?text=Döner",
  "/api/placeholder/400/300?text=Pide",
  "/api/placeholder/400/300?text=Kahvaltı",
  "/api/placeholder/400/300?text=Pasta",
  "/api/placeholder/400/300?text=Balık",
  "/api/placeholder/400/300?text=Lahmacun",
  "/api/placeholder/400/300?text=Köfte",
  "/api/placeholder/400/300?text=Fast+Food",
  null // Some restaurants might not have images
];

// Restaurant chain brands
const restaurantBrands = [
  "Köfteci Yusuf",
  "Burger King",
  "Domino's Pizza",
  "Popeyes",
  "Starbucks",
  "Simit Sarayı",
  "Hatay Medeniyetler Sofrası",
  "HD İskender",
  "Konyalı Etli Ekmek",
  "Günaydın",
  "Midpoint",
  "Big Chefs",
  "Dürümzade",
  "Çiğköfteci Ali Usta",
  "KFC"
];

// Generate random delivery time range
const generateDeliveryTime = () => {
  const minTime = Math.floor(Math.random() * 20) + 15; // 15-35 min
  const maxTime = minTime + Math.floor(Math.random() * 15) + 5; // 5-20 min additional
  return `${minTime}-${maxTime} dk`;
};

// Generate random price range (₺)
const generatePriceRange = () => {
  const minPrice = Math.floor(Math.random() * 3) + 1; // 1-3
  return "₺".repeat(minPrice);
};

// Generate random minimum order amount
const generateMinOrderAmount = () => {
  const amount = (Math.floor(Math.random() * 10) + 5) * 5; // 25-75 TL in increments of 5
  return `${amount} TL`;
};

// Generate random delivery fee
const generateDeliveryFee = () => {
  if (Math.random() < 0.3) return "Ücretsiz"; // 30% chance of free delivery
  const fee = (Math.floor(Math.random() * 6) + 1) * 5; // 5-30 TL in increments of 5
  return `${fee} TL`;
};

// Generate random rating (1-5) with weighted distribution
const generateRating = () => {
  // Weighted towards higher ratings (more 4s and 5s)
  const weights = [0.05, 0.1, 0.15, 0.4, 0.3]; // 5% 1-star, 10% 2-star, etc.
  const random = Math.random();
  let sum = 0;
  for (let i = 0; i < weights.length; i++) {
    sum += weights[i];
    if (random < sum) return i + 1;
  }
  return 5; // Default to 5 if something goes wrong
};

// Generate random number of reviews
const generateReviewCount = () => {
  // Exponential distribution to make some restaurants more popular
  const baseCount = Math.floor(Math.random() * 100) + 10; // 10-110
  const multiplier = Math.random() < 0.2 ? 10 : (Math.random() < 0.5 ? 5 : 1);
  return baseCount * multiplier;
};

// Generate random popular dishes for a restaurant
const generatePopularDishes = (cuisine) => {
  const dishes = [];
  // Get subcategories for this cuisine if available
  const subcategories = cuisineDetails[cuisine] || [];
  
  // Number of dishes to generate (1-4)
  const count = Math.floor(Math.random() * 3) + 1;
  
  for (let i = 0; i < count; i++) {
    // Pick a random subcategory
    if (subcategories.length > 0) {
      const subcategory = subcategories[Math.floor(Math.random() * subcategories.length)];
      dishes.push(subcategory);
    }
  }
  
  return dishes.length > 0 ? dishes : null;
};

// Generate operating hours
const generateOperatingHours = () => {
  // Some restaurants open earlier, some later
  const openingHour = Math.random() < 0.3 ? 8 : (Math.random() < 0.7 ? 10 : 12);
  // Some restaurants close at midnight, some earlier
  const closingHour = Math.random() < 0.4 ? 24 : (Math.random() < 0.7 ? 22 : 20);
  
  return `${openingHour}:00 - ${closingHour === 24 ? "00" : closingHour}:00`;
};

// Generate a random restaurant
const generateRestaurant = (id) => {
  // Decide whether this is a chain restaurant or local
  const isChain = Math.random() < 0.25; // 25% chance to be a chain
  
  // Pick a cuisine type
  const cuisine = cuisines[Math.floor(Math.random() * cuisines.length)];
  
  // Pick a neighborhood
  const neighborhood = neighborhoods[Math.floor(Math.random() * neighborhoods.length)];
  
  // Generate address
  const address = locations.generateAddress();
  
  // Select name based on whether it's a chain
  const name = isChain 
    ? restaurantBrands[Math.floor(Math.random() * restaurantBrands.length)]
    : restaurantNames[Math.floor(Math.random() * restaurantNames.length)];
  
  // For chains, match the cuisine to the restaurant brand (e.g., Domino's is always pizza)
  const finalCuisine = isChain && name.includes("Pizza") ? "Pizza" :
                       isChain && name.includes("Burger") ? "Burger" :
                       isChain && name.includes("Köfte") ? "Türk Mutfağı" :
                       isChain && name.includes("Döner") ? "Döner" :
                       cuisine;
  
  // Find an appropriate image
  let imageIndex = restaurantImages.length - 1; // Default to null (last index)
  for (let i = 0; i < restaurantImages.length - 1; i++) {
    if (restaurantImages[i].includes(finalCuisine.split(" ")[0])) {
      imageIndex = i;
      break;
    }
  }
  
  // Generate popular dishes
  const popularDishes = generatePopularDishes(finalCuisine);
  
  // For chains, higher ratings and more reviews
  const rating = isChain ? Math.min(5, generateRating() + 0.5) : generateRating();
  const reviewCount = isChain ? generateReviewCount() * 3 : generateReviewCount();
  
  // Chains more likely to offer free delivery
  const deliveryFee = isChain && Math.random() < 0.5 ? "Ücretsiz" : generateDeliveryFee();
  
  return {
    id,
    name,
    cuisine: finalCuisine,
    image: Math.random() > 0.1 ? restaurantImages[imageIndex] : null,
    deliveryTime: generateDeliveryTime(),
    rating,
    reviewCount,
    priceRange: generatePriceRange(),
    minOrderAmount: generateMinOrderAmount(),
    deliveryFee,
    neighborhood,
    address: address.full,
    isNew: Math.random() < 0.15, // 15% chance of being new
    hasDiscount: Math.random() < 0.25, // 25% chance of having a discount
    discountPercentage: Math.floor(Math.random() * 3) * 10 + 10, // 10%, 20%, or 30%
    isFavorite: Math.random() < 0.2, // 20% chance of being a favorite
    isChain,
    operatingHours: generateOperatingHours(),
    popularDishes,
    isOpen: Math.random() < 0.9, // 90% chance of being open
    averagePreparationTime: Math.floor(Math.random() * 15) + 10, // 10-25 minutes
    // Payment methods
    acceptsCreditCard: Math.random() < 0.95,
    acceptsCash: true,
    acceptsOnlinePayment: Math.random() < 0.9,
  };
};

// Create a persistent cache for consistent restaurant data
const restaurantCache = {};

// Helper to ensure consistent restaurant data
const getOrCreateRestaurant = (id) => {
  if (!restaurantCache[id]) {
    restaurantCache[id] = generateRestaurant(id);
  }
  return restaurantCache[id];
};

// Mock API endpoints
const API = {
  // Get all restaurants
  getAllRestaurants: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const restaurants = Array.from({ length: 24 }, (_, i) =>
          getOrCreateRestaurant(i + 1)
        );
        resolve(restaurants);
      }, 500); // Simulate network delay
    });
  },

  // Get restaurant by ID
  getRestaurantById: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!id) {
          reject(new Error("Restaurant ID is required"));
          return;
        }
        // Create a detailed version with menu items
        const restaurant = getOrCreateRestaurant(id);
        
        // Add detailed menu items if not already present
        if (!restaurant.menuItems) {
          const menuCategories = cuisineDetails[restaurant.cuisine] || ["Öne Çıkanlar"];
          restaurant.menuItems = menuCategories.map(category => ({
            category,
            items: Array.from({ length: Math.floor(Math.random() * 5) + 3 }, (_, i) => ({
              id: `${id}-${category}-${i}`,
              name: `${category} ${i + 1}`,
              description: `Lezzetli ${category.toLowerCase()} seçeneğimiz`,
              price: (Math.floor(Math.random() * 20) + 5) * 5, // 25-125 TL in increments of 5
              isPopular: Math.random() < 0.3,
              imageUrl: null
            }))
          }));
        }
        
        resolve(restaurant);
      }, 300);
    });
  },

  // Search restaurants by query
  searchRestaurants: (query) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate a set of restaurants if not enough in cache
        if (Object.keys(restaurantCache).length < 30) {
          Array.from({ length: 30 }, (_, i) => 
            getOrCreateRestaurant(i + 1)
          );
        }
        
        const allRestaurants = Object.values(restaurantCache);
        const lowercaseQuery = query.toLowerCase();
        
        const filteredRestaurants = allRestaurants.filter(
          (restaurant) =>
            restaurant.name.toLowerCase().includes(lowercaseQuery) ||
            restaurant.cuisine.toLowerCase().includes(lowercaseQuery) ||
            (restaurant.popularDishes && 
             restaurant.popularDishes.some(dish => 
               dish.toLowerCase().includes(lowercaseQuery)
             ))
        );
        
        resolve(filteredRestaurants);
      }, 400);
    });
  },

  // Get featured restaurants (higher ratings and more reviews)
  getFeaturedRestaurants: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate a set of restaurants if not enough in cache
        if (Object.keys(restaurantCache).length < 30) {
          Array.from({ length: 30 }, (_, i) => 
            getOrCreateRestaurant(i + 1)
          );
        }
        
        const allRestaurants = Object.values(restaurantCache);
        
        // Sort by rating and review count
        const sortedRestaurants = [...allRestaurants].sort((a, b) => {
          const scoreA = a.rating * Math.log10(a.reviewCount + 1);
          const scoreB = b.rating * Math.log10(b.reviewCount + 1);
          return scoreB - scoreA;
        });
        
        // Take the top 8
        resolve(sortedRestaurants.slice(0, 8));
      }, 300);
    });
  },

  // Get nearby restaurants based on neighborhood
  getNearbyRestaurants: (neighborhood) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate restaurants for the requested neighborhood
        const restaurants = Array.from({ length: 16 }, (_, i) => {
          const restaurant = getOrCreateRestaurant(i + 1);
          
          // If neighborhood is specified, make sure some restaurants match it
          if (neighborhood && i < 10) {
            restaurant.neighborhood = neighborhood;
          }
          
          return restaurant;
        });
        
        const nearbyRestaurants = neighborhood
          ? restaurants.filter(
              (restaurant) => restaurant.neighborhood === neighborhood
            )
          : restaurants;
        
        resolve(nearbyRestaurants);
      }, 400);
    });
  },
  
  // Get restaurant categories
  getCategories: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(cuisines);
      }, 200);
    });
  },
  
  // Get neighborhoods for location selection
  getNeighborhoods: (city = "İstanbul") => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (city === "İstanbul") {
          resolve(locations.istanbulNeighborhoods);
        } else if (city === "Ankara") {
          resolve(locations.ankaraNeighborhoods);
        } else if (city === "İzmir") {
          resolve(locations.izmirNeighborhoods);
        } else {
          resolve(locations.istanbulNeighborhoods.slice(0, 5)); // Fallback
        }
      }, 200);
    });
  },
  
  // Get popular cuisine types
  getPopularCuisines: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Return a subset of cuisine types marked as popular
        resolve([
          "Kebap",
          "Pizza",
          "Burger",
          "Döner",
          "Pide & Lahmacun",
          "Fast Food",
          "Ev Yemekleri"
        ]);
      }, 150);
    });
  },
  
  // Submit an order
  submitOrder: (restaurantId, orderItems, address, paymentMethod) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!restaurantId || !orderItems || orderItems.length === 0) {
          reject(new Error("Invalid order details"));
          return;
        }
        
        // Generate an order confirmation
        resolve({
          orderId: `ORD-${Date.now()}`,
          restaurant: getOrCreateRestaurant(restaurantId).name,
          estimatedDeliveryTime: `${Math.floor(Math.random() * 20) + 25} dakika`,
          status: "Sipariş Alındı",
          totalAmount: orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
          orderDate: new Date().toISOString()
        });
      }, 600);
    });
  }
};

export default API;