// export const DISTRICT_DATA = {
//     "ANKARA": ["Çankaya", "Keçiören", "Yenimahalle", "Mamak", "Etimesgut", "Sincan", "Altındağ", "Pursaklar", "Gölbaşı", "Polatlı", "Kahramankazan", "Beypazarı", "Elmadağ", "Nallıhan", "Akyurt", "Şereflikoçhisar", "Haymana", "Çubuk", "Kızılcahamam", "Bala", "Kalecik", "Ayaş", "Güdül", "Çamlıdere", "Evren"],
//     "ISTANBUL": ["Adalar", "Arnavutköy", "Ataşehir", "Avcılar", "Bağcılar", "Bahçelievler", "Bakırköy", "Başakşehir", "Bayrampaşa", "Beşiktaş", "Beykoz", "Beylikdüzü", "Beyoğlu", "Büyükçekmece", "Çatalca", "Çekmeköy", "Esenler", "Esenyurt", "Eyüpsultan", "Fatih", "Gaziosmanpaşa", "Güngören", "Kadıköy", "Kağıthane", "Kartal", "Küçükçekmece", "Maltepe", "Pendik", "Sancaktepe", "Sarıyer", "Silivri", "Sultanbeyli", "Sultangazi", "Şile", "Şişli", "Tuzla", "Ümraniye", "Üsküdar", "Zeytinburnu"],
//     "IZMIR": ["Aliağa", "Balçova", "Bayındır", "Bayraklı", "Bergama", "Beydağ", "Bornova", "Buca", "Çeşme", "Çiğli", "Dikili", "Foça", "Gaziemir", "Güzelbahçe", "Karabağlar", "Karaburun", "Karşıyaka", "Kemalpaşa", "Kınık", "Kiraz", "Konak", "Menderes", "Menemen", "Narlıdere", "Ödemiş", "Seferihisar", "Selçuk", "Tire", "Torbalı", "Urla"],
//     "BURSA": ["Osmangazi", "Nilüfer", "Yıldırım", "Gürsu", "Kestel", /* ... other Bursa districts */],
//     "ANTALYA": ["Muratpaşa", "Kepez", "Konyaaltı", "Aksu", "Döşemealtı", /* ... other Antalya districts */],
//     // ... add other cities and their districts
//   };
//
// export const TURKISH_CITIES = [ /* ...cities */ { value: "", label: "Şehir Seçin" }, { value: "ISTANBUL", label: "İstanbul" }, { value: "ANKARA", label: "Ankara" }, { value: "IZMIR", label: "İzmir" }, { value: "BURSA", label: "Bursa" }, { value: "ANTALYA", label: "Antalya" } ];


import axios from 'axios';

export let DISTRICT_DATA = {};
export let TURKISH_CITIES = [{ value: '', label: 'Şehir Seçin' }];

export const initializeLocationData = async () => {
    let TURKISH_CITIES1 = [{ value: '', label: 'Şehir Seçin' }];
    try {
        const { data: cities } = await axios.get('http://localhost:8080/api/district/cities');

        for (const city of cities) {
            const { data: districts } = await axios.get(`http://localhost:8080/api/district/${city}`);
            DISTRICT_DATA[city.toUpperCase()] = districts;
            TURKISH_CITIES1.push({
                value: city.toUpperCase(),
                label: capitalize(city)
            });
        }
        TURKISH_CITIES = TURKISH_CITIES1;
    } catch (error) {
        console.error('Error initializing location data:', error);
    }
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();