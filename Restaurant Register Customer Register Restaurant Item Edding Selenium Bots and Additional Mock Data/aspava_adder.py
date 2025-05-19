from selenium import webdriver
from selenium.webdriver.edge.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, ElementClickInterceptedException, NoSuchElementException
import time

# Aspava menü verileri
menu_items = [
    # Menüler (menuItemType: 1)
    {
        "name": "Aile Kebap Menüsü",
        "description": "2 porsiyon Adana kebap, 2 porsiyon kuzu şiş, salata, lahmacun, içli köfte, 4 adet içecek ve 2 adet tatlı içerir.",
        "price": 550,
        "menuItemType": "1"
    },
    {
        "name": "Öğrenci Kebap Menüsü",
        "description": "1 porsiyon Adana kebap, pilav, salata ve 1 adet içecek içerir.",
        "price": 180,
        "menuItemType": "1"
    },
    {
        "name": "Çift Kişilik Kebap Menüsü",
        "description": "1 porsiyon Adana kebap, 1 porsiyon kuzu şiş, salata, lavaş ve 2 adet içecek içerir.",
        "price": 320,
        "menuItemType": "1"
    },

    # Yiyecek Seçenekleri (menuItemType: 2)
    {
        "name": "Adana Kebap",
        "description": "Özel baharatlarla hazırlanmış, odun ateşinde pişirilmiş acılı kıyma kebabı. Yanında lavaş, soğan, domates ve biber ile servis edilir.",
        "price": 150,
        "menuItemType": "2"
    },
    {
        "name": "Kuzu Şiş",
        "description": "Marine edilmiş kuzu eti, odun ateşinde pişirilmiş. Yanında lavaş, soğan, domates ve biber ile servis edilir.",
        "price": 180,
        "menuItemType": "2"
    },
    {
        "name": "Tavuk Şiş",
        "description": "Marine edilmiş tavuk göğsü, odun ateşinde pişirilmiş. Yanında lavaş, soğan, domates ve biber ile servis edilir.",
        "price": 130,
        "menuItemType": "2"
    },
    {
        "name": "Karışık Kebap",
        "description": "Adana kebap, kuzu şiş ve tavuk şiş karışımı. Yanında lavaş, soğan, domates ve biber ile servis edilir.",
        "price": 220,
        "menuItemType": "2"
    },
    {
        "name": "Ankara Tava",
        "description": "Özel baharatlarla marine edilmiş kuzu eti, tereyağı ve biberlerle pişirilmiş. Yanında pilav ile servis edilir.",
        "price": 200,
        "menuItemType": "2"
    },
    {
        "name": "İskender",
        "description": "Lavaş üzerine döner et, tereyağlı sos ve yoğurt ile servis edilir.",
        "price": 190,
        "menuItemType": "2"
    },
    {
        "name": "Lahmacun",
        "description": "İnce hamur üzerine kıyma, domates, biber ve baharatlar. Odun fırınında pişirilmiş.",
        "price": 45,
        "menuItemType": "2"
    },
    {
        "name": "İçli Köfte",
        "description": "2 adet, baharatlı kıyma ile doldurulmuş geleneksel içli köfte.",
        "price": 80,
        "menuItemType": "2"
    },
    {
        "name": "Pide",
        "description": "Kaşarlı, kıymalı veya karışık. Odun fırınında pişirilmiş.",
        "price": 100,
        "menuItemType": "2"
    },
    {
        "name": "Pilav",
        "description": "Tereyağlı, baharatlı pirinç pilavı.",
        "price": 50,
        "menuItemType": "2"
    },
    {
        "name": "Karışık Salata",
        "description": "Mevsim yeşillikleri, domates, salatalık, kırmızı soğan ve limon.",
        "price": 60,
        "menuItemType": "2"
    },

    # İçecek Seçenekleri (menuItemType: 3)
    {
        "name": "Ayran",
        "description": "300 ml taze ayran.",
        "price": 20,
        "menuItemType": "3"
    },
    {
        "name": "Şalgam",
        "description": "300 ml acılı veya acısız şalgam suyu.",
        "price": 25,
        "menuItemType": "3"
    },
    {
        "name": "Kola",
        "description": "330 ml kutu.",
        "price": 25,
        "menuItemType": "3"
    },
    {
        "name": "Maden Suyu",
        "description": "200 ml sade veya meyveli maden suyu.",
        "price": 20,
        "menuItemType": "3"
    },
    {
        "name": "Çay",
        "description": "Taze demlenmiş Türk çayı.",
        "price": 15,
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
        "name": "Ekstra Lavaş",
        "description": "2 adet taze lavaş ekmeği.",
        "price": 15,
        "menuItemType": "4"
    },
    {
        "name": "Ekstra Pilav",
        "description": "Yarım porsiyon tereyağlı pirinç pilavı.",
        "price": 30,
        "menuItemType": "4"
    },
    {
        "name": "Acı Sos",
        "description": "50 gr ev yapımı acı biber sosu.",
        "price": 15,
        "menuItemType": "4"
    },
    {
        "name": "Cacık",
        "description": "Yoğurt, salatalık, sarımsak ve nane ile hazırlanmış cacık.",
        "price": 40,
        "menuItemType": "4"
    },
    {
        "name": "Ezme",
        "description": "Acılı domates, biber ve baharat karışımı.",
        "price": 40,
        "menuItemType": "4"
    },
    {
        "name": "Yoğurt",
        "description": "150 gr ev yapımı yoğurt.",
        "price": 30,
        "menuItemType": "4"
    },
    {
        "name": "Künefe",
        "description": "Geleneksel antep fıstıklı künefe, sıcak servis edilir.",
        "price": 80,
        "menuItemType": "4"
    },
    {
        "name": "Baklava",
        "description": "2 dilim taze antep fıstıklı baklava.",
        "price": 75,
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
        email_input.send_keys("umutkorkmaz@gmail.com")
        print("Email girildi.")

        # Şifre alanını doldur
        password_input = wait.until(EC.visibility_of_element_located((By.ID, "login-password")))
        password_input.clear()
        password_input.send_keys("Keb.2024!")
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
                # Restaurant ID'sini doğru al (Aspava için)
                # Burada sayfa URL'inden ID'yi çekmeyi deneyelim
                try:
                    current_url = driver.current_url
                    restaurant_id = current_url.split("/restaurants/manage/")[1].split("/")[0]
                except:
                    # İlk yükleme veya URL analizi başarısız olursa varsayılan 2 olarak ayarla
                    restaurant_id = "2"

                # Doğrudan URL ile ürün ekleme sayfasına git
                driver.get(f"http://localhost:3000/restaurants/manage/{restaurant_id}/add-item/{menu_type}")
                print(f"Doğrudan URL ile ekleme sayfasına gidildi: menuItemType={menu_type}")

            # Ürün ekleme sayfasının yüklenmesini bekle
            try:
                wait.until(EC.url_contains(f"/restaurants/manage/"))
                wait.until(EC.url_contains(f"/add-item/{menu_type}"))
                wait.until(EC.presence_of_element_located((By.XPATH, "//input[@id='name']")))
                print("Ürün ekleme formu yüklendi.")
            except TimeoutException:
                print("Ürün ekleme sayfası yüklenemedi, mevcut URL:", driver.current_url)
                # Sayfayı yeniden yüklemeyi dene
                driver.refresh()
                wait.until(EC.presence_of_element_located((By.XPATH, "//input[@id='name']")))
                print("Sayfa yenilendi ve form yüklendi.")

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
                # Restaurant ID'yi almaya çalış
                try:
                    current_url = driver.current_url
                    restaurant_id = current_url.split("/restaurants/manage/")[1].split("/")[0]
                except:
                    restaurant_id = "2"  # Varsayılan

                # Başarılı mesajını bekle
                success_element = wait.until(EC.any_of(
                    EC.visibility_of_element_located((By.XPATH, "//h2[contains(text(), 'Ürün Eklendi')]")),
                    EC.visibility_of_element_located(
                        (By.XPATH, "//div[contains(text(), 'başarı') or contains(text(), 'Başarı')]")),
                    EC.url_contains(f"/restaurants/manage/{restaurant_id}")
                ))
                print(f"✅ Başarıyla eklendi: {item['name']}")
            except TimeoutException:
                print(f"⚠️ Başarı mesajı görülmedi veya yönlendirme olmadı: {item['name']}")

            # Menü yönetim sayfasına geri dön veya zaten orada olduğunu kontrol et
            try:
                # Restaurant ID'yi almaya çalış
                current_url = driver.current_url
                restaurant_id = current_url.split("/restaurants/manage/")[1].split("/")[0]
            except:
                restaurant_id = "2"  # Varsayılan

            if not driver.current_url.endswith(f"/restaurants/manage/{restaurant_id}"):
                driver.get(f"http://localhost:3000/restaurants/manage/{restaurant_id}")
                wait.until(EC.url_contains(f"/restaurants/manage/{restaurant_id}"))
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