// menuMapperApi.js
// Restoran menü öğelerini kategorilere göre düzenleyen yardımcı API servisi

// API'daki kategorileri UI kategorilerine eşleştiren nesne
const categoryMapping = {
    // Menüler kategorisi
    "Öne Çıkanlar": "Menüler",
    "Menüler": "Menüler",
    "Combo Menüler": "Menüler",
    "Özel Menüler": "Menüler",
    "Aile Menüsü": "Menüler",
    "Set Menüler": "Menüler",
    
    // Yiyecekler kategorisi
    "Pizza": "Yiyecekler",
    "Burger": "Yiyecekler",
    "Kebap": "Yiyecekler",
    "Döner": "Yiyecekler",
    "Pide": "Yiyecekler",
    "Lahmacun": "Yiyecekler",
    "Köfte": "Yiyecekler",
    "Makarna": "Yiyecekler", 
    "Risotto": "Yiyecekler",
    "Lazanya": "Yiyecekler",
    "Sushi": "Yiyecekler",
    "Tavuk": "Yiyecekler",
    "Hot Dog": "Yiyecekler",
    "Sandwich": "Yiyecekler",
    "Balık": "Yiyecekler",
    "Karides": "Yiyecekler",
    "Kalamar": "Yiyecekler",
    "Midye": "Yiyecekler",
    "Serpme Kahvaltı": "Yiyecekler",
    "Açma & Poğaça": "Yiyecekler",
    "Omlet": "Yiyecekler",
    "Menemen": "Yiyecekler",
    "Sebze Yemekleri": "Yiyecekler",
    "Vegan": "Yiyecekler",
    "Salatalar": "Yiyecekler",
    "Türk Mutfağı": "Yiyecekler",
    "Dünya Mutfağı": "Yiyecekler",
    "Çiğ Köfte": "Yiyecekler",
    "Gözleme": "Yiyecekler",
    "Mantı": "Yiyecekler",
    "Ev Yemekleri": "Yiyecekler",
    "Güveç": "Yiyecekler",
    "Dolma": "Yiyecekler",
    "Kuru Fasulye": "Yiyecekler",
    "Pilav": "Yiyecekler",
    
    // İçecekler kategorisi
    "İçecekler": "İçecekler",
    "Soğuk İçecekler": "İçecekler",
    "Sıcak İçecekler": "İçecekler",
    "Çay": "İçecekler",
    "Kahve": "İçecekler",
    "Meyve Suyu": "İçecekler",
    "Soda": "İçecekler",
    "Ayran": "İçecekler",
    "Kola": "İçecekler",
    "Su": "İçecekler",
    "Meşrubatlar": "İçecekler",
    "Milkshake": "İçecekler",
    "Smoothie": "İçecekler",
    "Türk Kahvesi": "İçecekler",
    "Espresso Bazlı": "İçecekler",
    "Filtre Kahve": "İçecekler",
    "Frappe": "İçecekler",
    "Çay Çeşitleri": "İçecekler",
    "Bitki Çayları": "İçecekler",
    
    // Ekstralar kategorisi
    "Ekstralar": "Ekstralar",
    "Tatlılar": "Ekstralar",
    "Yan Ürünler": "Ekstralar",
    "Baklava": "Ekstralar",
    "Sütlü Tatlılar": "Ekstralar",
    "Pasta": "Ekstralar",
    "Dondurma": "Ekstralar",
    "Börek": "Ekstralar",
    "Patates": "Ekstralar",
    "Patates Kızartması": "Ekstralar",
    "Çıtır Patates": "Ekstralar",
    "Soslar": "Ekstralar",
    "Tatlı & Pasta": "Ekstralar",
    "Ekmek": "Ekstralar",
    "Çorbalar": "Ekstralar",
    "Mezeler": "Ekstralar",
    "Atıştırmalıklar": "Ekstralar",
    "Aperatifler": "Ekstralar"
  };
  
  // Menü ögelerini görüntüleme için UI kategorilerine göre düzenle
  const organizeMenuByCategories = (menuItems) => {
    if (!menuItems || !Array.isArray(menuItems)) {
      return {
        Menüler: [],
        Yiyecekler: [],
        İçecekler: [],
        Ekstralar: []
      };
    }
    
    // Kategorilere göre gruplandırma yapalım
    const categoryMap = {
      Menüler: [],
      Yiyecekler: [],
      İçecekler: [],
      Ekstralar: []
    };
    
    // Her menü öğesi için doğru kategoriye ekle
    menuItems.forEach(item => {
      // Kategoriyi belirle
      let mappedCategory = categoryMapping[item.category] || "Ekstralar";
      
      // Özel durum: Fiyatı yüksek olan yiyecekleri Menüler kategorisine taşı
      if (item.price >= 200 && mappedCategory === "Yiyecekler") {
        mappedCategory = "Menüler";
      }
      
      // Öğeyi kategoriye ekle
      categoryMap[mappedCategory].push({
        id: item.id,
        name: item.name,
        description: item.description || "",
        price: item.price,
        image: item.image || item.imageUrl || null
      });
    });
    
    return categoryMap;
  };
  
  // Ana API nesnesi
  const MenuMapperAPI = {
    // Menü öğelerini kategorilere göre düzenler
    mapMenuItems: (menuItems) => {
      return organizeMenuByCategories(menuItems);
    },
    
    // API'dan gelen restoran verisini düzenler ve menü öğelerini kategorilere ayırır
    processRestaurantData: (restaurant) => {
      if (!restaurant) return null;
      
      // Restoran menü öğeleri varsa düzenle
      let processedMenuItems = null;
      
      if (restaurant.menuItems && Array.isArray(restaurant.menuItems)) {
        processedMenuItems = organizeMenuByCategories(restaurant.menuItems);
      }
      
      // Statik menu öğeleri gönderilmişse, bunları kategorilere ayır
      else if (
        restaurant.menus || 
        restaurant.foods || 
        restaurant.drinks || 
        restaurant.extras
      ) {
        processedMenuItems = {
          Menüler: restaurant.menus || [],
          Yiyecekler: restaurant.foods || [],
          İçecekler: restaurant.drinks || [],
          Ekstralar: restaurant.extras || []
        };
      }
      
      // Düzenlenmiş restoran verisini döndür
      return {
        ...restaurant,
        processedMenu: processedMenuItems
      };
    }
  };
  
  export default MenuMapperAPI;