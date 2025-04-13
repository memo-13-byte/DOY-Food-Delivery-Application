// turkishLocations.js
// Contains Turkish location data for the restaurant API

// Major cities in Turkey
export const cities = [
    "İstanbul",
    "Ankara",
    "İzmir",
    "Bursa",
    "Antalya",
    "Adana",
    "Konya",
    "Gaziantep",
    "Mersin",
    "Kayseri"
  ];
  
  // Neighborhoods in Istanbul
  export const istanbulNeighborhoods = [
    "Kadıköy",
    "Beşiktaş",
    "Şişli",
    "Beyoğlu",
    "Etiler",
    "Nişantaşı",
    "Ataşehir",
    "Ümraniye",
    "Levent",
    "Mecidiyeköy",
    "Üsküdar",
    "Bakırköy",
    "Bebek",
    "Florya",
    "Kartal",
    "Maltepe",
    "Bağcılar",
    "Başakşehir",
    "Beylikdüzü",
    "Fatih",
    "Pendik",
    "Sarıyer",
    "Tuzla",
    "Zeytinburnu"
  ];
  
  // Neighborhoods in Ankara
  export const ankaraNeighborhoods = [
    "Çankaya",
    "Kızılay",
    "Bahçelievler",
    "Tunalı Hilmi",
    "Ulus",
    "Keçiören",
    "Altındağ",
    "Etimesgut",
    "Mamak",
    "Sincan",
    "Yenimahalle"
  ];
  
  // Neighborhoods in Izmir
  export const izmirNeighborhoods = [
    "Alsancak",
    "Bornova",
    "Karşıyaka",
    "Konak",
    "Buca",
    "Balçova",
    "Gaziemir",
    "Çeşme",
    "Göztepe",
    "Narlıdere"
  ];
  
  // Popular streets in Turkish cities
  export const popularStreets = [
    "Bağdat Caddesi",
    "İstiklal Caddesi",
    "Tunalı Hilmi Caddesi",
    "Atatürk Bulvarı",
    "Cumhuriyet Caddesi",
    "Nispetiye Caddesi",
    "Abdi İpekçi Caddesi",
    "Halaskargazi Caddesi",
    "Mimar Sinan Caddesi",
    "Fevzi Çakmak Caddesi",
    "Mustafa Kemal Caddesi",
    "Barbaros Bulvarı",
    "Alemdar Caddesi",
    "Vatan Caddesi",
    "Mithatpaşa Caddesi"
  ];
  
  // Building/apartment naming patterns
  export const buildingPatterns = [
    "Apartmanı",
    "Sitesi",
    "Residence",
    "Plaza",
    "İş Merkezi",
    "Konakları",
    "Evleri"
  ];
  
  // Random building names
  export const buildingNames = [
    "Çınar",
    "Yıldız",
    "Aydın",
    "Çağdaş",
    "Güneş",
    "Mehtap",
    "Lale",
    "Deniz",
    "Kelebek",
    "Mavi",
    "Yeşil",
    "Bahar",
    "Palmiye",
    "Zümrüt",
    "Yakut",
    "Safir",
    "Elmas",
    "Akasya",
    "Manolya",
    "İnci"
  ];
  
  // Generate a random Turkish address
  export const generateAddress = () => {
    const city = cities[Math.floor(Math.random() * cities.length)];
    let neighborhood;
    
    // Select neighborhood based on city
    if (city === "İstanbul") {
      neighborhood = istanbulNeighborhoods[Math.floor(Math.random() * istanbulNeighborhoods.length)];
    } else if (city === "Ankara") {
      neighborhood = ankaraNeighborhoods[Math.floor(Math.random() * ankaraNeighborhoods.length)];
    } else if (city === "İzmir") {
      neighborhood = izmirNeighborhoods[Math.floor(Math.random() * izmirNeighborhoods.length)];
    } else {
      // Generate a generic neighborhood for other cities
      neighborhood = `${buildingNames[Math.floor(Math.random() * buildingNames.length)]} Mahallesi`;
    }
    
    const street = popularStreets[Math.floor(Math.random() * popularStreets.length)];
    const buildingName = buildingNames[Math.floor(Math.random() * buildingNames.length)];
    const buildingPattern = buildingPatterns[Math.floor(Math.random() * buildingPatterns.length)];
    const buildingNumber = Math.floor(Math.random() * 150) + 1;
    const aptNumber = Math.floor(Math.random() * 30) + 1;
    
    return {
      full: `${street} No:${buildingNumber}, ${buildingName} ${buildingPattern}, Daire:${aptNumber}, ${neighborhood}, ${city}`,
      street,
      buildingName: `${buildingName} ${buildingPattern}`,
      buildingNumber,
      aptNumber,
      neighborhood,
      city
    };
  };
  
  export default {
    cities,
    istanbulNeighborhoods,
    ankaraNeighborhoods,
    izmirNeighborhoods,
    popularStreets,
    buildingPatterns,
    buildingNames,
    generateAddress
  };