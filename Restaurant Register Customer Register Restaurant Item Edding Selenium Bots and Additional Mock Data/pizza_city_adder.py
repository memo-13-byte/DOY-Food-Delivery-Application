from selenium import webdriver
from selenium.webdriver.edge.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, ElementClickInterceptedException, NoSuchElementException
import time

# Pizza City menü verileri
menu_items = [
    # Menüler (menuItemType: 1)
    {
        "name": "Aile Menüsü",
        "description": "1 büyük boy pizza (4 malzemeli), 6 adet tavuk kanat, patates kızartması, 2 adet içecek ve 1 adet tatlı içerir.",
        "price": 350,
        "menuItemType": "1"
    },
    {
        "name": "Öğrenci Menüsü",
        "description": "1 orta boy pizza (2 malzemeli), patates kızartması ve 1 adet içecek içerir.",
        "price": 175,
        "menuItemType": "1"
    },
    {
        "name": "İş Yemeği Menüsü",
        "description": "2 orta boy pizza, 4 adet içecek, salata ve tatlı içerir. 4-5 kişilik.",
        "price": 420,
        "menuItemType": "1"
    },

    # Yiyecek Seçenekleri (menuItemType: 2)
    {
        "name": "Margarita Pizza",
        "description": "Özel domates sosu, mozzarella peyniri ve taze fesleğen ile hazırlanan İtalyan klasiği.",
        "price": 120,
        "menuItemType": "2"
    },
    {
        "name": "Karışık Pizza",
        "description": "Sucuk, sosis, mantar, yeşil biber, mısır ve bol peynir ile zengin lezzet.",
        "price": 155,
        "menuItemType": "2"
    },
    {
        "name": "Vejeteryan Pizza",
        "description": "Taze domates, mantar, mısır, zeytin, yeşil biber ve özel baharat karışımı.",
        "price": 140,
        "menuItemType": "2"
    },
    {
        "name": "Tavuklu Pizza",
        "description": "Izgara tavuk parçaları, mantar, kırmızı biber ve özel pizza sosu.",
        "price": 150,
        "menuItemType": "2"
    },
    {
        "name": "Çıtır Kanat",
        "description": "8 adet baharatlı, çıtır tavuk kanadı, ranch sos eşliğinde.",
        "price": 95,
        "menuItemType": "2"
    },
    {
        "name": "Patates Kızartması",
        "description": "Altın sarısı, çıtır patates kızartması.",
        "price": 45,
        "menuItemType": "2"
    },

    # İçecek Seçenekleri (menuItemType: 3)
    {
        "name": "Kola",
        "description": "330 ml kutu.",
        "price": 20,
        "menuItemType": "3"
    },
    {
        "name": "Ayran",
        "description": "300 ml taze ayran.",
        "price": 15,
        "menuItemType": "3"
    },
    {
        "name": "Meyve Suyu",
        "description": "330 ml kutu, çeşitli meyve aromalı.",
        "price": 18,
        "menuItemType": "3"
    },
    {
        "name": "Su",
        "description": "500 ml pet şişe su.",
        "price": 10,
        "menuItemType": "3"
    },

    # Ek Seçenekleri (menuItemType: 4)
    {
        "name": "Ekstra Peynir",
        "description": "Pizzanıza ekstra mozzarella peyniri ekleyin.",
        "price": 30,
        "menuItemType": "4"
    },
    {
        "name": "Sarımsaklı Ekmek",
        "description": "Tereyağlı sarımsaklı özel ekmek.",
        "price": 55,
        "menuItemType": "4"
    },
    {
        "name": "Ranch Sos",
        "description": "50 gr özel ranch sos.",
        "price": 15,
        "menuItemType": "4"
    },
    {
        "name": "Acı Sos",
        "description": "50 gr özel acı biber sosu.",
        "price": 15,
        "menuItemType": "4"
    },
]


def login_and_add_menu_items():
    # Edge driver ayarları
    options = webdriver.EdgeOptions()
    options.add_experimental_option('excludeSwitches', ['enable-logging'])

    # Edge sürücüsünü başlat
    driver = webdriver.Edge(options=options)

    # Pencereyi büyüt
    driver.maximize_window()

    try:
        # Restaurant giriş sayfasına git
        driver.get("http://localhost:3000/auth?tab=login&type=restaurant")
        print("Login sayfası açıldı.")

        # Sayfanın yüklenmesini bekle
        wait = WebDriverWait(driver, 10)

        # Email alanını bekle ve doldur
        email_input = wait.until(EC.visibility_of_element_located((By.ID, "login-email")))
        email_input.clear()
        email_input.send_keys("ahmet@gmail.com")
        print("Email girildi.")

        # Şifre alanını doldur
        password_input = wait.until(EC.visibility_of_element_located((By.ID, "login-password")))
        password_input.clear()
        password_input.send_keys("Piz.1234!")
        print("Şifre girildi.")

        # Giriş Yap butonuna tıkla
        time.sleep(1)
        login_button = wait.until(EC.element_to_be_clickable(
            (By.XPATH, "//button[contains(., 'Giriş Yap') and @type='submit']")))
        login_button.click()
        print("Giriş Yap butonuna tıklandı.")

        # Profil sayfasının yüklenmesini bekle
        wait.until(EC.url_contains("/restaurant/profile"))
        print("Profil sayfası yüklendi.")

        # "Menüyü Yönet" butonunu bul ve tıkla
        menu_manage_button = wait.until(EC.element_to_be_clickable(
            (By.XPATH, "//button[contains(text(), 'Menüyü Yönet')]")))
        menu_manage_button.click()
        print("Menüyü Yönet butonuna tıklandı.")

        # Menü yönetim sayfasının yüklenmesini bekle
        wait.until(EC.url_contains("/restaurants/manage"))
        print("Menü yönetim sayfası yüklendi.")

        # Kategorileri ve "+" butonlarının eşleşmesi için sözlük oluştur
        category_mapping = {
            "1": "Menüler",
            "2": "Yiyecek Seçenekleri",
            "3": "İçecek Seçenekleri",
            "4": "Ek Seçenekleri"
        }

        # Her bir menü öğesini ekle
        for item in menu_items:
            menu_type = item["menuItemType"]
            category_name = category_mapping[menu_type]
            print(f"Ekleniyor: {item['name']} (Kategori: {category_name})")

            # İlgili kategori için "+" butonunu bul
            try:
                # Kategori butonunu bul
                add_button = wait.until(EC.element_to_be_clickable(
                    (By.XPATH, f"//div[text()='{category_name}']/following-sibling::div//button")))
                time.sleep(1)
                add_button.click()
                print(f"{category_name} kategorisi için ekleme butonu tıklandı.")
            except Exception as e:
                print(f"Kategori butonu bulunamadı, doğrudan URL'e gidiliyor: {e}")
                # Doğrudan URL ile ürün ekleme sayfasına git
                driver.get(f"http://localhost:3000/restaurants/manage/2/add-item/{menu_type}")
                print(f"Doğrudan URL ile ekleme sayfasına gidildi: menuItemType={menu_type}")

            # Ürün ekleme sayfasının yüklenmesini bekle
            wait.until(EC.url_contains(f"/restaurants/manage/2/add-item/{menu_type}"))
            wait.until(EC.presence_of_element_located((By.XPATH, "//input[@id='name']")))
            print("Ürün ekleme formu yüklendi.")

            # Kategori seçimini kontrol et - gerekirse değiştir
            try:
                # Kategori doğru mu kontrol et
                dropdown_text = wait.until(EC.visibility_of_element_located(
                    (By.XPATH, "//div[contains(@class, 'SelectTrigger')]/span"))).text
                if dropdown_text != category_name:
                    # Kategori dropdown'ını aç
                    dropdown = wait.until(EC.element_to_be_clickable(
                        (By.XPATH, "//div[contains(@class, 'SelectTrigger')]")))
                    dropdown.click()
                    # Doğru kategoriyi seç
                    option = wait.until(EC.element_to_be_clickable(
                        (By.XPATH, f"//div[contains(@class, 'SelectItem') and contains(text(), '{category_name}')]")))
                    option.click()
                    print(f"Kategori seçildi: {category_name}")
            except Exception as e:
                print(f"Kategori seçimi yapılamadı: {e}")

            # Ürün adını gir
            name_input = wait.until(EC.visibility_of_element_located((By.ID, "name")))
            name_input.clear()
            name_input.send_keys(item["name"])
            print(f"Ürün adı girildi: {item['name']}")

            # Açıklama gir
            try:
                description_input = wait.until(EC.visibility_of_element_located((By.ID, "description")))
                description_input.clear()
                description_input.send_keys(item["description"])
                print("Açıklama girildi.")
            except Exception as e:
                print(f"Açıklama alanı bulunamadı: {e}")
                # Alan bulunamadıysa alternatif olarak textarea kullan
                try:
                    description_input = wait.until(
                        EC.visibility_of_element_located((By.XPATH, "//textarea[@id='description']")))
                    description_input.clear()
                    description_input.send_keys(item["description"])
                    print("Açıklama girildi (textarea).")
                except Exception as inner_e:
                    print(f"Açıklama textarea da bulunamadı: {inner_e}")

            # Fiyat gir
            try:
                price_input = wait.until(EC.visibility_of_element_located((By.ID, "price")))
                price_input.clear()
                price_input.send_keys(str(item["price"]))
                print(f"Fiyat girildi: {item['price']}")
            except Exception as e:
                print(f"Fiyat alanı bulunamadı: {e}")
                # Fiyat alanı bulunamadıysa, farklı bir ID ile tekrar dene
                try:
                    price_input = wait.until(EC.visibility_of_element_located(
                        (By.XPATH, "//input[contains(@id, 'price') or contains(@id, 'fiyat')]")))
                    price_input.clear()
                    price_input.send_keys(str(item["price"]))
                    print(f"Alternatif fiyat alanı ile fiyat girildi: {item['price']}")
                except Exception as inner_e:
                    print(f"Alternatif fiyat alanı da bulunamadı: {inner_e}")

            # Kaydet butonuna tıkla
            try:
                save_button = wait.until(EC.element_to_be_clickable(
                    (By.XPATH, "//button[contains(., 'Kaydet') or contains(., 'kaydet')]")))
                driver.execute_script("arguments[0].scrollIntoView(true);", save_button)
                time.sleep(0.5)
                save_button.click()
                print("Kaydet butonuna tıklandı.")
            except Exception as e:
                print(f"Kaydet butonu bulunamadı: {e}")
                # Alternatif olarak SVG veya özel bir simge içeren butonu ara
                try:
                    save_button = wait.until(EC.element_to_be_clickable(
                        (By.XPATH,
                         "//button[contains(@class, 'save') or descendant::*[name()='svg' and contains(@class, 'save')]]")))
                    driver.execute_script("arguments[0].scrollIntoView(true);", save_button)
                    time.sleep(0.5)
                    save_button.click()
                    print("Alternatif kaydet butonuna tıklandı.")
                except Exception as inner_e:
                    print(f"Alternatif kaydet butonu da bulunamadı: {inner_e}")

            # Başarılı mesajının görünmesini bekle veya sayfanın yeniden yönlendirilmesini bekle
            try:
                # Başarılı mesajını bekle
                success_element = wait.until(EC.any_of(
                    EC.visibility_of_element_located((By.XPATH, "//h2[contains(text(), 'Ürün Eklendi')]")),
                    EC.visibility_of_element_located(
                        (By.XPATH, "//div[contains(text(), 'başarı') or contains(text(), 'Başarı')]")),
                    EC.url_contains("/restaurants/manage/2")
                ))
                print(f"✅ Başarıyla eklendi: {item['name']}")
            except TimeoutException:
                print(f"⚠️ Başarı mesajı görülmedi veya yönlendirme olmadı: {item['name']}")

            # Menü yönetim sayfasına geri dön veya zaten orada olduğunu kontrol et
            if not driver.current_url.endswith("/restaurants/manage/2"):
                driver.get("http://localhost:3000/restaurants/manage/2")
                wait.until(EC.url_contains("/restaurants/manage/2"))
                print("Menü yönetim sayfasına döndü, sıradaki ürün ekleniyor...")

            # İşlem arası bekleme süresi
            time.sleep(1.5)

    except Exception as e:
        print(f"Hata oluştu: {e}")

    finally:
        # İşlem bittikten sonra tarayıcıyı kapat
        print("Tüm ürünler eklendi. Tarayıcı kapatılıyor...")
        time.sleep(3)
        driver.quit()


if __name__ == "__main__":
    # Login olup ürün ekleme işlemini başlat
    login_and_add_menu_items()