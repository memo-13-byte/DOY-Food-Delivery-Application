import json
import os
import time
import sys
import random
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import TimeoutException, NoSuchElementException


# Create customer_data.json file with the provided user data
def create_customer_data():
    customers = [
        {
            "firstName": "Burak",
            "lastName": "Özdemir",
            "email": "burak.ozdemir@example.com",
            "phoneNumber": "0532 654 8791",
            "password": "Burak34!O",
            "addressInfo": {
                "city": "ISTANBUL",
                "district": "Ataşehir",
                "neighborhood": "Barbaros",
                "avenue": "Atatürk",
                "street": "Zambak",
                "buildingNumber": 23,
                "apartmentNumber": 14
            }
        },
        {
            "firstName": "Elif",
            "lastName": "Yalçın",
            "email": "elif.yalcin@example.com",
            "phoneNumber": "0505 369 7452",
            "password": "Elif!2024Y",
            "addressInfo": {
                "city": "ISTANBUL",
                "district": "Üsküdar",
                "neighborhood": "Acıbadem",
                "avenue": "Tekin",
                "street": "Menekşe",
                "buildingNumber": 42,
                "apartmentNumber": 5
            }
        },
        {
            "firstName": "Canan",
            "lastName": "Korkmaz",
            "email": "canan.k@example.com",
            "phoneNumber": "0542 789 1453",
            "password": "CananK06$",
            "addressInfo": {
                "city": "ANKARA",
                "district": "Keçiören",
                "neighborhood": "Etlik",
                "avenue": "Ayvaz",
                "street": "Fatih",
                "buildingNumber": 17,
                "apartmentNumber": 8
            }
        },
        {
            "firstName": "Serkan",
            "lastName": "Acar",
            "email": "serkan.acar@example.com",
            "phoneNumber": "0555 741 2369",
            "password": "SAcar35@!",
            "addressInfo": {
                "city": "IZMIR",
                "district": "Bornova",
                "neighborhood": "Erzene",
                "avenue": "İnönü",
                "street": "Çınar",
                "buildingNumber": 9,
                "apartmentNumber": 11
            }
        },
        {
            "firstName": "Gizem",
            "lastName": "Tuncer",
            "email": "gizem.t@example.com",
            "phoneNumber": "0533 852 7496",
            "password": "GizemT16!",
            "addressInfo": {
                "city": "BURSA",
                "district": "Osmangazi",
                "neighborhood": "Demirtaş",
                "avenue": "Cumhuriyet",
                "street": "Orkide",
                "buildingNumber": 31,
                "apartmentNumber": 2
            }
        },
        {
            "firstName": "Oğuzhan",
            "lastName": "Güneş",
            "email": "oguzhan.gunes@example.com",
            "phoneNumber": "0539 632 1478",
            "password": "Oguz07&Gunes",
            "addressInfo": {
                "city": "ANTALYA",
                "district": "Muratpaşa",
                "neighborhood": "Lara",
                "avenue": "Akdeniz",
                "street": "Manolya",
                "buildingNumber": 12,
                "apartmentNumber": 6
            }
        },
        {
            "firstName": "Melisa",
            "lastName": "Erdem",
            "email": "melisa.erdem@example.com",
            "phoneNumber": "0549 753 1246",
            "password": "M3Lisa!26E",
            "addressInfo": {
                "city": "ESKISEHIR",
                "district": "Tepebaşı",
                "neighborhood": "Batıkent",
                "avenue": "Yunus Emre",
                "street": "Lale",
                "buildingNumber": 27,
                "apartmentNumber": 10
            }
        }
    ]

    with open('customer_data.json', 'w', encoding='utf-8') as f:
        json.dump(customers, f, ensure_ascii=False, indent=2)

    print(f"Created customer_data.json with {len(customers)} customer profiles")
    return customers


# Set up the webdriver (Chrome by default)
def setup_webdriver(browser_type='chrome'):
    if browser_type.lower() == 'edge':
        from selenium.webdriver.edge.options import Options
        options = Options()
        options.add_experimental_option("detach", True)
        driver = webdriver.Edge(options=options)
    elif browser_type.lower() == 'firefox':
        from selenium.webdriver.firefox.options import Options
        options = Options()
        driver = webdriver.Firefox(options=options)
    else:  # default to Chrome
        from selenium.webdriver.chrome.options import Options
        options = Options()
        options.add_experimental_option("detach", True)
        driver = webdriver.Chrome(options=options)

    driver.maximize_window()
    return driver


# Fill the form for a customer
def fill_registration_form(driver, customer_data):
    print(f"Filling form for {customer_data['firstName']} {customer_data['lastName']}...")

    # Wait for the registration form to load
    try:
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "firstName"))
        )
    except TimeoutException:
        print("Registration form did not load properly")
        return False

    try:
        # Personal Information
        driver.find_element(By.ID, "firstName").send_keys(customer_data["firstName"])
        driver.find_element(By.ID, "lastName").send_keys(customer_data["lastName"])
        driver.find_element(By.ID, "email").send_keys(customer_data["email"])
        driver.find_element(By.ID, "phone").send_keys(customer_data["phoneNumber"])

        # Address Information
        # Select City
        city_dropdown = Select(driver.find_element(By.ID, "dropdown"))
        city_dropdown.select_by_value(customer_data["addressInfo"]["city"])
        time.sleep(1)  # Wait for district dropdown to update

        # Select District
        district_dropdown = Select(driver.find_element(By.ID, "dropdown2"))
        # First try selecting by exact text
        try:
            district_dropdown.select_by_visible_text(customer_data["addressInfo"]["district"])
        except:
            # If exact match fails, try to find a close match
            district_options = [option.text for option in district_dropdown.options]
            # Remove the first option if it's a placeholder
            if district_options and "Seçiniz" in district_options[0]:
                district_options = district_options[1:]

            if district_options:
                print(f"Could not find exact district match, selecting first available: {district_options[0]}")
                district_dropdown.select_by_visible_text(district_options[0])
            else:
                print("No district options available")
                return False

        # Rest of Address
        driver.find_element(By.ID, "neighborhood").send_keys(customer_data["addressInfo"]["neighborhood"])
        driver.find_element(By.ID, "avenue").send_keys(customer_data["addressInfo"]["avenue"])
        driver.find_element(By.ID, "street").send_keys(customer_data["addressInfo"]["street"])
        driver.find_element(By.ID, "buildingNumber").send_keys(str(customer_data["addressInfo"]["buildingNumber"]))
        driver.find_element(By.ID, "apartmentNumber").send_keys(str(customer_data["addressInfo"]["apartmentNumber"]))

        # Password
        driver.find_element(By.ID, "password").send_keys(customer_data["password"])
        driver.find_element(By.ID, "confirmPassword").send_keys(customer_data["password"])

        # Accept Terms
        terms_checkbox = driver.find_element(By.ID, "terms")
        driver.execute_script("arguments[0].click();", terms_checkbox)

        print("Form filled successfully, ready to submit")
        return True
    except Exception as e:
        print(f"Error filling form: {str(e)}")
        return False


# Submit the form and handle result
def submit_form(driver):
    try:
        submit_button = driver.find_element(By.XPATH, "//button[@type='submit']")
        print("Submitting form...")

        # Scroll to the button if needed
        driver.execute_script("arguments[0].scrollIntoView(true);", submit_button)
        time.sleep(0.5)  # Allow time for scroll

        driver.execute_script("arguments[0].click();", submit_button)

        # Wait for either success message or redirection
        try:
            WebDriverWait(driver, 10).until(
                EC.any_of(
                    EC.presence_of_element_located((By.CLASS_NAME, "animate-slideIn")),
                    EC.url_contains("localhost:3000/")
                )
            )

            # Check if we see success message
            try:
                success_message = driver.find_element(By.CLASS_NAME, "animate-slideIn")
                print(f"Registration result: {success_message.text}")
                return True
            except NoSuchElementException:
                # If no message but URL changed, likely successful
                if "auth" not in driver.current_url:
                    print("Redirected to another page, registration likely successful")
                    return True
                else:
                    print("No success confirmation detected")
                    return False
        except TimeoutException:
            print("No confirmation or redirection detected after submission")
            return False
    except Exception as e:
        print(f"Error submitting form: {str(e)}")
        return False


# Main registration process
def register_customer(driver, customer):
    try:
        # Navigate to registration page
        driver.get("http://localhost:3000/auth?tab=register")
        time.sleep(2)  # Allow page to fully load

        # Check if we're on the right page
        if "register" not in driver.current_url:
            print("Not on registration page. Current URL:", driver.current_url)
            return False

        # Fill the form
        if fill_registration_form(driver, customer):
            # Submit the form
            result = submit_form(driver)
            if result:
                print(f"Successfully registered {customer['firstName']} {customer['lastName']}")
            else:
                print(f"Registration may have failed for {customer['firstName']} {customer['lastName']}")
            return result
        else:
            print(f"Failed to fill form for {customer['firstName']} {customer['lastName']}")
            return False
    except Exception as e:
        print(f"Unexpected error during registration: {str(e)}")
        return False


# Main function
def main():
    print("DOY! Customer Registration Bot")
    print("=" * 40)

    # Create or load customer data
    if not os.path.exists('customer_data.json'):
        customers = create_customer_data()
    else:
        try:
            with open('customer_data.json', 'r', encoding='utf-8') as f:
                customers = json.load(f)
            print(f"Loaded {len(customers)} customers from customer_data.json")
        except Exception as e:
            print(f"Error loading customer data: {str(e)}")
            print("Creating new customer data file...")
            customers = create_customer_data()

    # Get browser preference
    browser_options = ['chrome', 'edge', 'firefox']
    print("\nSelect browser:")
    for i, browser in enumerate(browser_options, 1):
        print(f"{i}. {browser.capitalize()}")

    try:
        browser_choice = int(input("Enter choice (default is 1): ") or "1")
        if browser_choice < 1 or browser_choice > len(browser_options):
            print("Invalid choice, using Chrome")
            browser_type = 'chrome'
        else:
            browser_type = browser_options[browser_choice - 1]
    except ValueError:
        print("Invalid input, using Chrome")
        browser_type = 'chrome'

    # Set up webdriver
    driver = setup_webdriver(browser_type)

    try:
        # Display customer list
        print("\nAvailable customers:")
        for i, customer in enumerate(customers, 1):
            print(f"{i}. {customer['firstName']} {customer['lastName']} ({customer['email']})")

        # Get user selection
        print("\nOptions:")
        print("1. Register all customers")
        print("2. Register a specific customer")

        choice = input("Enter your choice (default is 1): ") or "1"

        if choice == "1":
            # Register all customers
            success_count = 0
            for i, customer in enumerate(customers, 1):
                print(f"\n[{i}/{len(customers)}] Registering {customer['firstName']} {customer['lastName']}...")
                if register_customer(driver, customer):
                    success_count += 1

                # Wait between registrations unless it's the last one
                if i < len(customers):
                    wait_time = random.randint(3, 7)
                    print(f"Waiting {wait_time} seconds before next registration...")
                    time.sleep(wait_time)

            print(f"\nRegistration completed: {success_count}/{len(customers)} successful")

        elif choice == "2":
            # Register specific customer
            try:
                customer_idx = int(input(f"Enter customer number (1-{len(customers)}): ")) - 1
                if 0 <= customer_idx < len(customers):
                    customer = customers[customer_idx]
                    print(f"\nRegistering {customer['firstName']} {customer['lastName']}...")
                    result = register_customer(driver, customer)
                    print(f"Registration {'successful' if result else 'failed'}")
                else:
                    print("Invalid customer number")
            except ValueError:
                print("Invalid input")
        else:
            print("Invalid choice")

    except KeyboardInterrupt:
        print("\nOperation interrupted by user")
    except Exception as e:
        print(f"\nUnexpected error: {str(e)}")
    finally:
        print("\nRegistration process completed")
        input("Press Enter to close the browser...")
        driver.quit()


if __name__ == "__main__":
    main()