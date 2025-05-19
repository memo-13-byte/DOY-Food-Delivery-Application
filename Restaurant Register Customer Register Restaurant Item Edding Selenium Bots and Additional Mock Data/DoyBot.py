from selenium import webdriver
from selenium.webdriver.edge.service import Service as EdgeService
from selenium.webdriver.edge.options import Options as EdgeOptions
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
import time
import json
import os


# Tüm restoran verilerini yükle
def load_restaurant_data():
    restaurants = []
    restaurant_files = [
        "Pizza City.txt", "BurgerX.txt", "Sweet Heaven.txt", "Sushi World.txt",
        "Taco Fiesta.txt", "Pasta Palace.txt", "Grill Master.txt", "Vegan Vibes.txt", "Aspava.txt"
    ]

    for file_name in restaurant_files:
        try:
            with open(file_name, 'r', encoding='utf-8') as file:
                content = file.read()
                # JSON kısmını çıkart
                json_str = content.split('Sending payload: ')[1].strip()
                data = json.loads(json_str)
                restaurants.append((file_name.replace('.txt', ''), data))
        except Exception as e:
            print(f"{file_name} yüklenirken hata: {e}")

    return restaurants


# Restoranı kaydet
def register_restaurant(data):
    # Edge driver başlat
    options = EdgeOptions()
    options.add_experimental_option("detach", True)
    driver = webdriver.Edge(options=options)

    # Sayfayı aç
    driver.get("http://localhost:3000/restaurants/register")
    time.sleep(2)

    # Form alanlarını doldur
    driver.find_element(By.ID, "ownerName").send_keys(data["userInfo"]["firstName"])
    driver.find_element(By.ID, "ownerSurname").send_keys(data["userInfo"]["lastName"])
    driver.find_element(By.ID, "email").send_keys(data["userInfo"]["email"])
    driver.find_element(By.ID, "ownerPhone").send_keys(data["userInfo"]["phoneNumber"])
    driver.find_element(By.ID, "idNumber").send_keys(data["userInfo"]["governmentId"])
    driver.find_element(By.ID, "password").send_keys(data["userInfo"]["password"])
    driver.find_element(By.ID, "confirmPassword").send_keys(data["userInfo"]["password"])

    driver.find_element(By.ID, "restaurantName").send_keys(data["restaurantInfo"]["restaurantName"])
    driver.find_element(By.ID, "restaurantPhone").send_keys(data["restaurantInfo"]["restaurantPhone"])
    Select(driver.find_element(By.ID, "restaurantCategory")).select_by_value(
        data["restaurantInfo"]["restaurantCategory"])
    driver.find_element(By.ID, "minOrderPrice").send_keys(str(data["restaurantInfo"]["minOrderPrice"]))

    Select(driver.find_element(By.ID, "city")).select_by_value(data["addressInfo"]["city"])
    time.sleep(1)
    Select(driver.find_element(By.ID, "district")).select_by_visible_text(data["addressInfo"]["district"])
    driver.find_element(By.ID, "neighborhood").send_keys(data["addressInfo"]["neighborhood"])
    driver.find_element(By.ID, "avenue").send_keys(data["addressInfo"]["avenue"])
    driver.find_element(By.ID, "street").send_keys(data["addressInfo"]["street"])
    driver.find_element(By.ID, "buildingNumber").send_keys(str(data["addressInfo"]["buildingNumber"]))
    driver.find_element(By.ID, "apartmentNumber").send_keys(str(data["addressInfo"]["apartmentNumber"]))

    checkbox = driver.find_element(By.ID, "acceptTerms")
    driver.execute_script("arguments[0].click();", checkbox)

    submit_btn = driver.find_element(By.XPATH, "//button[@type='submit']")
    submit_btn.click()

    time.sleep(5)


# Ana fonksiyon
def main():
    # Tüm restoran verilerini yükle
    restaurants = load_restaurant_data()

    # Kaydedilebilecek restoranları göster
    print("Kaydedilebilecek restoranlar:")
    for i, (name, _) in enumerate(restaurants, 1):
        print(f"{i}. {name}")

    # Kullanıcı seçimini al
    choice = int(input("Kaydetmek istediğiniz restoranın numarasını girin: ")) - 1

    # Seçilen restoranı kaydet
    if 0 <= choice < len(restaurants):
        _, restaurant_data = restaurants[choice]
        register_restaurant(restaurant_data)
    else:
        print("Geçersiz seçim.")


if __name__ == "__main__":
    main()