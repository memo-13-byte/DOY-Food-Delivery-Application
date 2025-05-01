const restaurantMenu = {
  1: {
    name: "Pizza City",
    rating: 4.3,
    description: "Taze taş fırında pişmiş pizzalar.",
    categories: [
      {
        title: "Menüler",
        items: [
          {
            id: 1,
            name: "Pepperoni Pizza Menü",
            description: "Büyük boy pepperoni pizza + içecek",
            price: 220,
            image: require("../assets/pepperoni.jpeg")
          },
        ]
      },
      {
        title: "Yiyecek Seçenekleri",
        items: [
          {
            id: 1,
            name: "Margarita Pizza",
            description: "Domates sosu, mozzarella peyniri",
            price: 180,
            image: require("../assets/margarita.jpeg")
          },
        ]
      },
      {
        title: "İçecek Seçenekleri",
        items: [
          {
            id: 1,
            name: "Kola",
            description: "330ml kutu",
            price: 30,
            image: require("../assets/cola.jpeg")
          },
        ]
      },
      {
        title: "Ek Seçenekleri",
        items: [
          {
            id: 1,
            name: "Sarımsaklı Kenar",
            description: "Pizza kenarına sarımsak aroması",
            price: 25,
            image: require("../assets/garlic.jpeg")
          },
        ]
      },
    ]
  },
  2: {
    name: "BurgerX",
    rating: 5.0,
    description: "Sulu ve doyurucu hamburgerler.",
    categories: [
      {
        title: "Menüler",
        items: [
          {
            id: 1,
            name: "Double Cheeseburger Menü",
            description: "Double burger, patates ve kola",
            price: 200,
            image: require("../assets/cheeseburger.jpeg")
          },
        ]
      },
      {
        title: "Yiyecek Seçenekleri",
        items: [
          {
            id: 1,
            name: "Chicken Burger",
            description: "Tavuk burger özel sos ile",
            price: 160,
            image: require("../assets/tavukburger.jpeg")
          },
        ]
      },
      {
        title: "İçecek Seçenekleri",
        items: [
          {
            id: 1,
            name: "Sprite",
            description: "330ml kutu",
            price: 30,
            image: require("../assets/sprite.jpeg")
          },
        ]
      },
      {
        title: "Ek Seçenekleri",
        items: [
          {
            id: 1,
            name: "Patates Kızartması",
            description: "Orta boy",
            price: 35,
            image: require("../assets/patateskizartmasi.jpeg")
          },
        ]
      },
    ]
  },
  3: {
    name: "Sweet Heaven",
    rating: 6.3,
    description: "Tatlı krizlerinize birebir çözümler.",
    categories: [
      {
        title: "Menüler",
        items: [
          {
            id: 1,
            name: "Tatlı Tabağı",
            description: "Karışık tatlı tabağı",
            price: 150,
            image: require("../assets/tatlitabagi.jpeg")
          },
        ]
      },
      {
        title: "Yiyecek Seçenekleri",
        items: [
          {
            id: 1,
            name: "Çikolatalı Sufle",
            description: "Sıcak akışkan çikolatalı sufle",
            price: 90,
            image: require("../assets/sufle.jpeg")
          },
        ]
      },
      {
        title: "İçecek Seçenekleri",
        items: [
          {
            id: 1,
            name: "Latte",
            description: "Sıcak latte",
            price: 40,
            image: require("../assets/latte.jpeg")
          },
        ]
      },
      {
        title: "Ek Seçenekleri",
        items: [
          {
            id: 1,
            name: "Dondurma Topu",
            description: "Vanilyalı dondurma",
            price: 20,
            image: require("../assets/dondurma.jpeg")
          },
        ]
      },
    ]
  },
  4: {
    name: "Sushi Express",
    rating: 7.0,
    description: "Hızlı ve taze suşi seçenekleri.",
    categories: [
      {
        title: "Menüler",
        items: [
          {
            id: 1,
            name: "Sushi Combo",
            description: "Karışık sushi tabağı",
            price: 250,
            image: require("../assets/sushicombo.jpeg")
          },
        ]
      },
      {
        title: "Yiyecek Seçenekleri",
        items: [
          {
            id: 1,
            name: "California Roll",
            description: "Yengeç, avokado ve salatalık",
            price: 100,
            image: require("../assets/california.jpeg")
          },
        ]
      },
      {
        title: "İçecek Seçenekleri",
        items: [
          {
            id: 1,
            name: "Yeşil Çay",
            description: "Japon yeşil çayı",
            price: 35,
            image: require("../assets/greentea.jpeg")
          },
        ]
      },
      {
        title: "Ek Seçenekleri",
        items: [
          {
            id: 1,
            name: "Soya Sosu",
            description: "Ekstra soya sosu",
            price: 10,
            image: require("../assets/soya.jpeg")
          },
        ]
      },
    ]
  },
  5: {
    name: "Taco Fiesta",
    rating: 3.3,
    description: "Baharatlı Meksika lezzetleri.",
    categories: [
      {
        title: "Menüler",
        items: [
          {
            id: 1,
            name: "Taco Menü",
            description: "3 çeşit taco + içecek",
            price: 180,
            image: require("../assets/tacoplate.jpeg")
          },
        ]
      },
      {
        title: "Yiyecek Seçenekleri",
        items: [
          {
            id: 1,
            name: "Beef Taco",
            description: "Kıyma, sos, sebze",
            price: 60,
            image: require("../assets/taco.jpeg")
          },
        ]
      },
      {
        title: "İçecek Seçenekleri",
        items: [
          {
            id: 1,
            name: "Ayran",
            description: "Ev yapımı ayran",
            price: 25,
            image: require("../assets/ayran.jpeg")
          },
        ]
      },
      {
        title: "Ek Seçenekleri",
        items: [
          {
            id: 1,
            name: "Salsa Sos",
            description: "Acı sos",
            price: 15,
            image: require("../assets/salsa.jpeg")
          },
        ]
      },
    ]
  },
  6: {
    name: "Pasta House",
    rating: 4.0,
    description: "İtalyan mutfağının en güzel makarnaları.",
    categories: [
      {
        title: "Menüler",
        items: [
          {
            id: 1,
            name: "Spaghetti Menü",
            description: "Spaghetti + içecek",
            price: 170,
            image: require("../assets/spaghetti.jpeg")
          },
        ]
      },
      {
        title: "Yiyecek Seçenekleri",
        items: [
          {
            id: 1,
            name: "Fettucine Alfredo",
            description: "Kremalı tavuklu makarna",
            price: 130,
            image: require("../assets/fettucine.jpeg")
          },
        ]
      },
      {
        title: "İçecek Seçenekleri",
        items: [
          {
            id: 1,
            name: "Şalgam",
            description: "Acılı şalgam",
            price: 20,
            image: require("../assets/salgam.jpeg")
          },
        ]
      },
      {
        title: "Ek Seçenekleri",
        items: [
          {
            id: 1,
            name: "Rendelenmiş Parmesan",
            description: "Taze parmesan peyniri",
            price: 10,
            image: require("../assets/parmesan.jpeg")
          },
        ]
      },
    ]
  },
  7: {
    name: "Grill Master",
    rating: 5.3,
    description: "Mangal ateşinden tabaklara gelen lezzetler.",
    categories: [
      {
        title: "Menüler",
        items: [
          {
            id: 1,
            name: "Izgara Köfte Menü",
            description: "Köfte, pilav, salata, içecek",
            price: 190,
            image: require("../assets/kofte.jpeg")
          },
        ]
      },
      {
        title: "Yiyecek Seçenekleri",
        items: [
          {
            id: 1,
            name: "Tavuk Şiş",
            description: "Baharatlı ızgara tavuk",
            price: 120,
            image: require("../assets/tavuksis.jpeg")
          },
        ]
      },
      {
        title: "İçecek Seçenekleri",
        items: [
          {
            id: 1,
            name: "Ice Tea",
            description: "Limonlu",
            price: 30,
            image: require("../assets/icetea.jpeg")
          },
        ]
      },
      {
        title: "Ek Seçenekleri",
        items: [
          {
            id: 1,
            name: "Acı Sos",
            description: "Ev yapımı sos",
            price: 10,
            image: require("../assets/hot.jpeg")
          },
        ]
      },
    ]
  },
  8: {
    name: "Vegan Vibes",
    rating: 6.0,
    description: "Bitki bazlı sağlıklı tabaklar.",
    categories: [
      {
        title: "Menüler",
        items: [
          {
            id: 1,
            name: "Vegan Bowl Menü",
            description: "Kinoa, avokado, humus, içecek",
            price: 160,
            image: require("../assets/veganbowl.jpeg")
          },
        ]
      },
      {
        title: "Yiyecek Seçenekleri",
        items: [
          {
            id: 1,
            name: "Falafel",
            description: "Nohut köftesi",
            price: 80,
            image: require("../assets/falafel.jpeg")
          },
        ]
      },
      {
        title: "İçecek Seçenekleri",
        items: [
          {
            id: 1,
            name: "Badem Sütü",
            description: "Tatlı badem sütü",
            price: 40,
            image: require("../assets/bademsutu.jpeg")
          },
        ]
      },
      {
        title: "Ek Seçenekleri",
        items: [
          {
            id: 1,
            name: "Humus",
            description: "Zeytinyağlı humus",
            price: 25,
            image: require("../assets/humus.jpeg")
          },
        ]
      },
    ]
  },
};

export default restaurantMenu;