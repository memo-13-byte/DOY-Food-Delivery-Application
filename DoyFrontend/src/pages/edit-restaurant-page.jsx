"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useParams, useNavigate, useLocation } from "react-router-dom"
import {
  Sun,
  Moon,
  X,
  Plus,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  ChevronLeft,
  Edit,
  ImageIcon,
  Upload,
  Axis3D,
} from "lucide-react"
import { motion } from "framer-motion"
import AuthorizedRequest from "../services/AuthorizedRequest"
import { getResponseErrors } from "../services/exceptionUtils"

export default function RestaurantManagePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()
  const {id:restaurantIdFromAdmin} = params;
  const [restaurantEmail, setRestaurantEmail] = useState("")
  const [restaurantId, setRestaurantId] = useState(-1)
  const [darkMode, setDarkMode] = useState(false)
  const categoryMap = new Map()
  categoryMap.set("COMBO", 0)
  categoryMap.set("MAIN_DISH", 1)
  categoryMap.set("DRINK", 2)
  categoryMap.set("EXTRA", 3)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [nameInput, setNameInput] = useState("")
  const [restaurantImage, setRestaurantImage] = useState("/placeholder.svg?height=128&width=128")
  const fileInputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState({ show: false, fileName: "" })
  // 1. Yeni state ekleyelim - useState tanımlamalarının olduğu bölüme ekleyin
  const [draggingItemId, setDraggingItemId] = useState(null)
  const [itemImageSuccess, setItemImageSuccess] = useState({ show: false, itemName: "" })
  const [errorMessages, setErrorMessages] = useState([])



  // Restoran verilerini ID'ye göre getir
  const [restaurant, setRestaurant] = useState({
    restaurantName: "Restoran A",
    description: "Restoran Hakkında kısım",
    restaurantPhone: "",
    restaurantCategory: "",
    rating: "",
    minOrderPrice: ""
  })

  const [isEditingPhoneNumber, setIsEditingPhoneNumber] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
const [phoneNumberInput, setPhoneNumberInput] = useState(restaurant.restaurantPhone || '');

const [isEditingMinOrderPrice, setIsEditingMinOrderPrice] = useState(false);
const [minOrderPriceInput, setMinOrderPriceInput] = useState(restaurant.minOrderPrice || '');

const handleEditPhoneNumberClick = () => setIsEditingPhoneNumber(true);
const handleCancelPhoneNumberEdit = () => {
  setIsEditingPhoneNumber(false);
  setPhoneNumberInput(restaurant.restaurantPhone || '');
};

const handleEditMinOrderPriceClick = () => setIsEditingMinOrderPrice(true);
const handleCancelMinOrderPriceEdit = () => {
  setIsEditingMinOrderPrice(false);
  setMinOrderPriceInput(restaurant.minOrderPrice || '');
};
  useEffect(() => {
    const getRestaurantId = async () => {
      let loadedEmail = "";
            if (restaurantIdFromAdmin !== undefined) {
            const response = await AuthorizedRequest.getRequest(`http://localhost:8080/api/users/get-by-id/${restaurantIdFromAdmin}`)
            setRestaurantEmail(response.data.email);
            loadedEmail = response.data.email;
          }else{
            setRestaurantEmail(localStorage.getItem("email"));
            loadedEmail = localStorage.getItem("email");
          }

      const response = await AuthorizedRequest.
      getRequest(`http://localhost:8080/api/users/restaurant-owners/get-by-email/${loadedEmail}`)
      setRestaurantId(response.data.restaurantId)
    }
    getRestaurantId()
  }, [])


  useEffect(() => {
    const getRestaurantInformation = async () => {
      if (restaurantId === -1) return;
      try {
        
        const response = await AuthorizedRequest.getRequest(`http://localhost:8080/api/restaurant/get/${restaurantId}`)
        console.log(response.data)
        setRestaurant(response.data)
        setPhoneNumberInput(response.data.restaurantPhone)
        setMinOrderPriceInput(response.data.minOrderPrice)
        
        if(response.data.imageId != null) {
          const imageResponse = await AuthorizedRequest.getRequest(`http://localhost:8080/api/upload/image/${response.data.imageId}`, {
            responseType: 'blob',
          });
          
          const reader = new FileReader();
          reader.onloadend = () => {
            setRestaurantImage(reader.result); // base64 string to display in <img src=...>
          };
          reader.readAsDataURL(imageResponse.data);
        
        }
        
      } catch (error) {
        alert("Error fetching restaurant information:", error)
      }
    }

    getRestaurantInformation().then(() => {
      getRestaurantItems()
    })

    if (darkMode) {
      document.body.classList.add("dark-mode")
    } else {
      document.body.classList.remove("dark-mode")
    }
  }, [restaurantId, darkMode])

  // 2. menuCategories state'ini güncelleyelim - her öğeye image alanı ekleyelim
  // Mevcut menuCategories state tanımlamasını aşağıdakiyle değiştirin
  const [menuCategories, setMenuCategories] = useState([
    {
      id: 1,
      name: "Menüler",
      items: [],
    },
    {
      id: 2,
      name: "Yiyecek Seçenekleri",
      items: [],
    },
    {
      id: 3,
      name: "İçecek Seçenekleri",
      items: [],
    },
    {
      id: 4,
      name: "Ek Seçenekleri",
      items: [],
    },
  ])

  // Function to delete a menu item
  const deleteMenuItem = (categoryId, itemId) => {
    AuthorizedRequest.deleteRequest(`http://localhost:8080/api/item/delete/${itemId}`).then(
      setMenuCategories(
        menuCategories.map((category) => {
          if (category.id === categoryId) {
            return {
              ...category,
              items: category.items.filter((item) => item.id !== itemId),
            }
          }
          return category
        }),
      ),
    )
  }

  const handleAddItemClick = (categoryId) => {
    // Ensure restaurantId is passed in the URL
    navigate(`/restaurants/manage/add-item/${categoryId}`)
  }

  const handleEditItemClick = (categoryId, itemId) => {
    // Ensure restaurantId is passed in the URL
    navigate(`/restaurants/manage/edit-item/${categoryId}/${itemId}`)
  }

  const handleBackClick = () => {
    // Updated to match App.js routing structure
    navigate(`/restaurant/profile`)
  }

  // 3. Menü öğesi resim yükleme fonksiyonlarını ekleyelim - handleFileChange fonksiyonundan sonra ekleyin
  const handleItemImageClick = (categoryId, itemId) => {
    // Geçici bir input oluştur ve tıkla
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = (e) => handleItemImageChange(e, categoryId, itemId)
    input.click()
  }

  const handleItemImageChange = (e, categoryId, itemId) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (event) => {
        updateItemImage(categoryId, itemId, event.target.result, file.name)
      }
      reader.readAsDataURL(file)
    } else if (file) {
      alert("Lütfen sadece resim dosyaları yükleyin (JPG, PNG, GIF, vb.)")
    }
  }

  const handleItemDragOver = (e, itemId) => {
    e.preventDefault()
    e.stopPropagation()
    setDraggingItemId(itemId)
  }

  const handleItemDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDraggingItemId(null)
  }

  const handleItemDrop = (e, categoryId, itemId) => {
    e.preventDefault()
    e.stopPropagation()
    setDraggingItemId(null)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (event) => {
          updateItemImage(categoryId, itemId, event.target.result, file.name)
        }
        reader.readAsDataURL(file)
      } else {
        alert("Lütfen sadece resim dosyaları yükleyin (JPG, PNG, GIF, vb.)")
      }
    }
  }

  const updateItemImage = (categoryId, itemId, imageUrl, fileName) => {
    // Menü kategorilerini güncelle
    setMenuCategories((prevCategories) =>
      prevCategories.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            items: category.items.map((item) => {
              if (item.id === itemId) {
                // Başarılı yükleme bildirimi göster
                showItemImageSuccess(item.name)
                return { ...item, image: imageUrl }
              }
              return item
            }),
          }
        }
        return category
      }),
    )
  }

  const showItemImageSuccess = (itemName) => {
    setItemImageSuccess({ show: true, itemName })
    setTimeout(() => {
      setItemImageSuccess({ show: false, itemName: "" })
    }, 3000)
  }

  // 4. getRestaurantItems fonksiyonunu güncelleyelim - mevcut fonksiyonu aşağıdakiyle değiştirin
  const getRestaurantItems = async () => {
    if (restaurantId === -1) return;
    setErrorMessages([])

    try {
      const response = await AuthorizedRequest.getRequest(`http://localhost:8080/api/item/get-items/${restaurantId}`)
      const itemData = [
        {
          id: 1,
          name: "Menüler",
          items: [],
        },
        {
          id: 2,
          name: "Yiyecek Seçenekleri",
          items: [],
        },
        {
          id: 3,
          name: "İçecek Seçenekleri",
          items: [],
        },
        {
          id: 4,
          name: "Ek Seçenekleri",
          items: [],
        },
      ]

      const responseItems = response.data
      console.log("Response Items:", responseItems)

      for (let i = 0; i < responseItems.length; i++) {
        // Her öğe için uygun bir placeholder resmi belirle
        let placeholderQuery = "food"
        if (responseItems[i].menuItemType === "DRINK") placeholderQuery = "beverage"
        else if (responseItems[i].menuItemType === "MAIN_DISH") placeholderQuery = responseItems[i].name
        else if (responseItems[i].menuItemType === "MENU") placeholderQuery = "meal"
        else if (responseItems[i].menuItemType === "COMBO") placeholderQuery = "combo meal"
        
        itemData[categoryMap.get(responseItems[i].menuItemType)].items.push({
          id: responseItems[i].id,
          name: responseItems[i].name,
          description: responseItems[i].description,
          price: responseItems[i].price,
          image: responseItems[i].imageId 
            ? `http://localhost:8080/api/upload/image/${responseItems[i].imageId}`
            : `https://source.unsplash.com/400x300/?${placeholderQuery}`,
        })
        console.log("asasda")
      }
      
      setMenuCategories(itemData)
    } catch (error) {
      setErrorMessages(getResponseErrors(error));
    }
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const [isEditing, setIsEditing] = useState(false)
  const [descriptionInput, setDescriptionInput] = useState("")

  const handleEditProfileClick = () => {
    setIsEditing(true)
    setDescriptionInput(restaurant.description)
  }

  const handleSaveDescription = async() => {
    if (descriptionInput.trim()) {
      let data = {
        ...restaurant,
        desription: descriptionInput
      }
      

      try {
        console.log(restaurant)
        await AuthorizedRequest.putRequest(`http://localhost:8080/api/restaurant/update/${restaurantId}`, data)
        restaurant.description = descriptionInput
      } catch (error) {
        console.log(error)
        setErrorMessages(getResponseErrors(error))
      }
    }
    console.log("Saving new description:", descriptionInput)
    setIsEditing(false)
    
  }

  const handleSavePhoneNumber = async () => {
    if (phoneNumberInput.trim()) {
      let data = {
        ...restaurant,
        restaurantPhone: phoneNumberInput
      }
      restaurant.restaurantPhone = phoneNumberInput;
  
      try {
        console.log(restaurant);
        await AuthorizedRequest.putRequest(`http://localhost:8080/api/restaurant/update/${restaurantId}`, data);
      } catch (error) {
        setErrorMessages(getResponseErrors(error));
      }
    }
    setIsEditingPhoneNumber(false)
  }
  
  const handleSaveMinOrderPrice = async() => {
    if (minOrderPriceInput !== '' && !isNaN(minOrderPriceInput)) {
      let data = {
        ...restaurant,
        minOrderPrice: minOrderPriceInput
      }
  
      try {
        console.log(restaurant);
        await AuthorizedRequest.putRequest(`http://localhost:8080/api/restaurant/update/${restaurantId}`, data);
        restaurant.minOrderPrice = minOrderPriceInput;
      } catch (error) {
        console.log(error);
        setErrorMessages(getResponseErrors(error));
      }
    }
    console.log("Saving new minimum order price:", minOrderPriceInput);
    setIsEditingMinOrderPrice(false)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  const handleSaveChangesClick = () => {
    setShowConfirmation(true)
  }

  const handleConfirmSave = () => {
    // Here you would typically make an API call to save all changes
    console.log("All changes saved successfully")
    setShowConfirmation(false)
    // You could add a success notification here
  }

  const handleCancelSave = () => {
    setShowConfirmation(false)
  }

  const handleEditNameClick = () => {
    setIsEditingName(true)
    setNameInput(restaurant.restaurantName)
  }

  const handleSaveName = async() => {
    if (nameInput.trim()) {
      let data = {
        ...restaurant,
        restaurantName: nameInput
      }
      

      try {
        console.log(restaurant)
        await AuthorizedRequest.putRequest(`http://localhost:8080/api/restaurant/update/${restaurantId}`, data)
        restaurant.restaurantName = nameInput
      } catch (error) {
        console.log(error)
        setErrorMessages(getResponseErrors(error))
      }
    }
    setIsEditingName(false)
  }

  const handleCancelNameEdit = () => {
    setIsEditingName(false)
  }

  // Add a function to handle the image icon click
  const handleImageIconClick = () => {
    fileInputRef.current.click()
  }

  // Add a function to handle the file upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const formData = new FormData();
      formData.append("file", file);
  
      try {
        const response = await AuthorizedRequest.postRequest(
          `http://localhost:8080/api/upload/image/restaurant/${restaurantId}`,
          formData 
        );
  
        const reader = new FileReader();
        reader.onload = (event) => {
          setRestaurantImage(event.target.result);
          showUploadSuccess(file.name);
          console.log("File selected:", file.name);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Upload failed:", error);
      }
    } else {
      alert("Lütfen sadece resim dosyaları yükleyin (JPG, PNG, GIF, vb.)");
    }
  };
  

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
      // Sadece resim dosyalarını kabul et
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (event) => {
          setRestaurantImage(event.target.result)
          // Başarılı yükleme bildirimi
          showUploadSuccess(file.name)
          // Burada gerçek bir uygulamada dosyayı sunucuya yüklerdiniz
          console.log("Dosya sürükle-bırak ile yüklendi:", file.name)
        }
        reader.readAsDataURL(file)
      } else {
        // Resim olmayan dosyalar için uyarı
        alert("Lütfen sadece resim dosyaları yükleyin (JPG, PNG, GIF, vb.)")
      }
    }
  }

  const showUploadSuccess = (fileName) => {
    setUploadSuccess({ show: true, fileName })
    setTimeout(() => {
      setUploadSuccess({ show: false, fileName: "" })
    }, 3000)
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-[#1c1c1c] text-white" : "bg-[#F2E8D6]"}`}
    >
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className={`sticky top-0 z-10 flex items-center justify-between px-6 py-5 shadow-lg ${darkMode ? "bg-[#333]" : "bg-[#47300A]"}`}
      >
        <motion.div whileHover={{ scale: 1.05 }} className="text-2xl font-bold text-white">
          <Link to="/">
            <span className="flex items-center gap-2">
              <img src="/image1.png" alt="Doy Logo" className="h-10 w-10 rounded-full bg-white p-1" />
              Doy!
            </span>
          </Link>
        </motion.div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <motion.button
              onClick={toggleDarkMode}
              className="relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
              style={{
                backgroundColor: darkMode ? "#6c4c9c" : "#e2e8f0",
                transition: "background-color 0.3s",
              }}
            >
              <span className="sr-only">Toggle dark mode</span>
              <motion.span
                className="inline-block h-5 w-5 rounded-full bg-white shadow-lg"
                animate={{
                  x: darkMode ? 24 : 3,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
              />
            </motion.button>
            {darkMode ? <Moon className="h-4 w-4 text-amber-200" /> : <Sun className="h-4 w-4 text-amber-600" />}
          </div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <button
              className={`rounded-full px-4 py-2 font-medium text-lg ${darkMode ? "text-white hover:bg-gray-700" : "text-white hover:bg-amber-600"}`}
            >
              {restaurant.restaurantName}
            </button>
          </motion.div>
        </div>
      </motion.header>

      {errorMessages.map((message, i) => (
                        
                        <motion.div key={i}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-sm dark:bg-red-900/30 dark:text-red-400"
                        >
                          <div className="flex">
                            <div className="py-1">
                              <svg 
                                className="h-6 w-6 text-red-500 dark:text-red-400 mr-4"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium">{message}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}

      {/* Main Content */}
      <main className="container mx-auto max-w-7xl px-6 py-8">
        {/* Restaurant Info */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`mb-10 rounded-2xl p-8 shadow-xl ${darkMode ? "bg-[#2c2c2c]" : "bg-white"}`}
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
            {/* Restaurant Image */}
            <div
              className={`relative h-40 w-40 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                isDragging
                  ? darkMode
                    ? "border-[#6c4c9c] bg-[#6c4c9c]/20"
                    : "border-[#6c4c9c] bg-[#6c4c9c]/10"
                  : "border-transparent"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {isDragging && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`text-white text-center p-2`}
                  >
                    <Upload className="h-8 w-8 mx-auto mb-1" />
                    <span className="text-sm font-medium">Bırak</span>
                  </motion.div>
                </div>
              )}
              <>
                <img
                  src={restaurantImage || "/placeholder.svg"}
                  alt="Restaurant Icon"
                  className="h-full w-full object-cover transition-all duration-300"
                />
                {!isDragging && (restaurantImage === "/placeholder.svg?height=128&width=128" || !restaurantImage) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <div className={`text-white text-center p-2`}>
                      <Upload className="h-6 w-6 mx-auto mb-1" />
                      <span className="text-xs font-medium">Resim Ekle</span>
                    </div>
                  </div>
                )}
              </>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleImageIconClick}
                className={`absolute bottom-3 right-3 rounded-full p-3 shadow-lg ${darkMode ? "bg-[#6c4c9c] text-white" : "bg-[#6c4c9c] text-white"}`}
              >
                <ImageIcon className="h-5 w-5" />
              </motion.button>
              <div className="absolute -bottom-2 left-0 right-0 text-center">
                <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Resmi Sürükle veya Tıkla
                </span>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </div>

            <div className="flex flex-1 flex-col gap-4">
              <div className="flex items-center justify-between">
                {isEditingName ? (
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className={`rounded-xl border px-5 py-4 text-2xl font-bold w-full ${
                        darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-800"
                      }`}
                    />
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSaveName}
                        className={`rounded-full p-2 ${
                          darkMode ? "bg-green-600 text-white" : "bg-green-500 text-white"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCancelNameEdit}
                        className={`rounded-full p-2 ${
                          darkMode ? "bg-gray-600 text-white" : "bg-gray-300 text-gray-700"
                        }`}
                      >
                        <X className="h-5 w-5" />
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <h1 className="text-3xl font-bold">{restaurant.restaurantName}</h1>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEditNameClick}
                  className={`rounded-full p-3 ml-4 ${darkMode ? "bg-[#6c4c9c] text-white" : "bg-[#6c4c9c] text-white"}`}
                >
                  <Edit className="h-5 w-5" />
                </motion.button>
              </div>

              {/* PHONE NUMBER */}
<div className="flex items-center justify-between mt-6">
  {isEditingPhoneNumber ? (
    <div className="flex items-center gap-3 flex-1">
      <input
        type="text"
        value={phoneNumberInput}
        onChange={(e) => setPhoneNumberInput(e.target.value)}
        className={`rounded-xl border px-5 py-4 text-2xl font-bold w-full ${
          darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-800"
        }`}
      />
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSavePhoneNumber}
          className={`rounded-full p-2 ${
            darkMode ? "bg-green-600 text-white" : "bg-green-500 text-white"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCancelPhoneNumberEdit}
          className={`rounded-full p-2 ${
            darkMode ? "bg-gray-600 text-white" : "bg-gray-300 text-gray-700"
          }`}
        >
          <X className="h-5 w-5" />
        </motion.button>
      </div>
    </div>
  ) : (<div className="flex items-center">
  <p className={`text-xl ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{"Telefon Numarası: " + restaurant.restaurantPhone}</p>
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={handleEditPhoneNumberClick}
    className={`rounded-full p-3 ml-4 ${darkMode ? "bg-[#6c4c9c] text-white" : "bg-[#6c4c9c] text-white"}`}
  >
    <Edit className="h-5 w-5" />
  </motion.button>
</div>)}
</div>

{/* MINIMUM ORDER PRICE */}
<div className="flex items-center justify-between mt-6">
  {isEditingMinOrderPrice ? (
    <div className="flex items-center gap-3 flex-1">
      <input
        type="number"
        value={minOrderPriceInput}
        onChange={(e) => setMinOrderPriceInput(e.target.value)}
        className={`rounded-xl border px-5 py-4 text-2xl font-bold w-full ${
          darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-800"
        }`}
      />
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSaveMinOrderPrice}
          className={`rounded-full p-2 ${
            darkMode ? "bg-green-600 text-white" : "bg-green-500 text-white"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCancelMinOrderPriceEdit}
          className={`rounded-full p-2 ${
            darkMode ? "bg-gray-600 text-white" : "bg-gray-300 text-gray-700"
          }`}
        >
          <X className="h-5 w-5" />
        </motion.button>
      </div>
    </div>
  ) : (
    
    <div className="flex items-center">
                  <p className={`text-xl ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{"Minimum Sipariş Tutarı: " + restaurant.minOrderPrice}</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleEditMinOrderPriceClick}
                    className={`rounded-full p-3 ml-4 ${darkMode ? "bg-[#6c4c9c] text-white" : "bg-[#6c4c9c] text-white"}`}
                  >
                    <Edit className="h-5 w-5" />
                  </motion.button>
                </div>)}
</div>

              {isEditing ? (
                <div className="flex flex-col gap-3">
                  <textarea
                    value={descriptionInput}
                    onChange={(e) => setDescriptionInput(e.target.value)}
                    className={`w-full rounded-xl border p-5 text-lg ${
                      darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-800"
                    }`}
                    rows={3}
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveDescription}
                      className={`rounded-xl px-6 py-3 text-lg font-medium ${
                        darkMode
                          ? "bg-[#6c4c9c] text-white hover:bg-[#5d3d8d]"
                          : "bg-[#6c4c9c] text-white hover:bg-[#5d3d8d]"
                      } transition-colors duration-300 shadow-md hover:shadow-lg`}
                    >
                      Kaydet
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className={`rounded-xl px-6 py-3 text-lg font-medium ${
                        darkMode
                          ? "bg-gray-600 text-white hover:bg-gray-500"
                          : "bg-[#7A0000] text-white hover:bg-[#6A0000]"
                      } transition-colors duration-300 shadow-md hover:shadow-lg`}
                    >
                      İptal
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center">
                  <p className={`text-xl ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{"Açıklama: " + restaurant.description}</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleEditProfileClick}
                    className={`rounded-full p-3 ml-4 ${darkMode ? "bg-[#6c4c9c] text-white" : "bg-[#6c4c9c] text-white"}`}
                  >
                    <Edit className="h-5 w-5" />
                  </motion.button>
                </div>
              )}
            </div>
            
          </div>

          <div className="flex items-center">
                  <p className={`text-xl ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{
                    "İl: " + restaurant.address?.cityEnum
                    }</p>
                </div>

                <div className="flex items-center">
                  <p className={`text-xl ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{
                    "İlçe: " + restaurant.address?.district.name
                    }</p>
                </div>

                <div className="flex items-center">
                  <p className={`text-xl ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{
                    "Mahalle: " + restaurant.address?.neighborhood
                    }</p>
                </div>

                <div className="flex items-center">
                  <p className={`text-xl ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{
                    "Cadde: " + restaurant.address?.avenue
                    }</p>
                </div>

                <div className="flex items-center">
                  <p className={`text-xl ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{
                    "Sokak: " + restaurant.address?.street
                    }</p>
                </div>

                <div className="flex items-center">
                  <p className={`text-xl ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{
                    "Bina No: " + restaurant.address?.buildingNumber
                    }</p>
                </div>

                <div className="flex items-center">
                  <p className={`text-xl ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{
                    "Apartman No: " + restaurant.address?.apartment_number
                    }</p>
                </div>

                  
        </motion.div>



        {/* Menu Sections - All categories displayed vertically */}
        <div className="space-y-12">
          {menuCategories.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-10">
                {/* Category Header - Updated styling to match PDF */}
                <div className="mb-6 flex items-center">
                  <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-black"} mr-2`}>
                    {category.name}
                  </h2>
                  {
                    !restaurantIdFromAdmin && <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleAddItemClick(category.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-full shadow-lg bg-[#6c4c9c] text-white hover:bg-[#5d3d8d] transition-colors duration-300"
                  >
                    <Plus className="h-5 w-5" />
                  </motion.button>
                  }
                  
                </div>

                {/* Menu Items - 2-column grid layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {category.items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <motion.div
                        whileHover={{ y: -5 }}
                        className={`relative overflow-hidden rounded-2xl ${darkMode ? "bg-[#2c2c2c]" : "bg-white"} p-6 shadow-xl transition-shadow hover:shadow-2xl h-full`}
                      >
                        {
                          !restaurantIdFromAdmin && <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => deleteMenuItem(category.id, item.id)}
                          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#7A0000] text-white shadow-lg"
                        >
                          <X className="h-5 w-5" />
                        </motion.button>
                        }
                        

                        <div className="flex flex-col h-full">
                          {/* Item Content */}
                          <div className="flex gap-6 mb-4">
                            {/* Image */}
                            <div
                              className={`relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                                draggingItemId === item.id
                                  ? darkMode
                                    ? "border-[#6c4c9c] bg-[#6c4c9c]/20"
                                    : "border-[#6c4c9c] bg-[#6c4c9c]/10"
                                  : "border-transparent"
                              }`}
                              onDragOver={(e) => handleItemDragOver(e, item.id)}
                              onDragLeave={handleItemDragLeave}
                              onDrop={(e) => handleItemDrop(e, category.id, item.id)}
                              onClick={() => handleItemImageClick(category.id, item.id)}
                            >
                              {draggingItemId === item.id && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
                                  <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className={`text-white text-center p-2`}
                                  >
                                    <Upload className="h-6 w-6 mx-auto mb-1" />
                                    <span className="text-xs font-medium">Bırak</span>
                                  </motion.div>
                                </div>
                              )}
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300">
                                <div className={`text-white text-center p-2`}>
                                  <ImageIcon className="h-5 w-5 mx-auto mb-1" />
                                  <span className="text-xs font-medium">Resim Değiştir</span>
                                </div>
                              </div>
                            </div>

                            {/* Item Details */}
                            <div className="flex-1">
                              <h3 className="mb-2 text-xl font-bold">{item.name}</h3>
                              <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                {item.description}
                              </p>
                            </div>
                          </div>

                          {/* Price and Edit Button */}
                          <div className="flex items-center justify-between mt-auto">
                            <div
                              className={`rounded-full px-5 py-2 text-lg font-medium ${
                                darkMode ? "bg-gray-700 text-white" : "bg-gray-500 text-white"
                              } shadow-md`}
                            >
                              {item.price} TL
                            </div>
                            {
                              !restaurantIdFromAdmin && <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleEditItemClick(category.id, item.id)}
                              className={`rounded-full px-6 py-2 text-lg font-medium shadow-lg ${
                                darkMode
                                  ? "bg-[#6c4c9c] text-white hover:bg-[#5d3d8d]"
                                  : "bg-[#6c4c9c] text-white hover:bg-[#5d3d8d]"
                              } transition-colors duration-300`}
                            >
                              Düzenle
                            </motion.button>
                            }
                            
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {
      !restaurantIdFromAdmin && <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBackClick}
            className={`flex w-full items-center justify-center gap-3 rounded-xl py-5 text-xl font-medium shadow-xl transition-colors duration-300 ${darkMode ? "bg-[#6c4c9c] text-white hover:bg-[#5d3d8d]" : "bg-[#6c4c9c] text-white hover:bg-[#5d3d8d]"}`}
          >
            <ChevronLeft className="h-6 w-6" />
            Profil Sayfasına Dön
          </motion.button>
        </motion.div>
      }
        

        {showConfirmation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`rounded-2xl p-8 max-w-md w-full mx-4 ${darkMode ? "bg-[#2c2c2c]" : "bg-white"} shadow-2xl`}
            >
              <h3 className="text-2xl font-bold mb-4">Değişiklikleri Kaydetmek İstiyor musunuz?</h3>
              <p className={`mb-6 text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                Yaptığınız tüm değişiklikler kaydedilecektir. Bu işlem geri alınamaz.
              </p>
              <div className="flex gap-4 justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancelSave}
                  className={`px-6 py-4 rounded-xl text-lg font-medium ${
                    darkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-[#7A0000] hover:bg-[#6A0000] text-white"
                  } transition-colors duration-300 shadow-md`}
                >
                  İptal
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleConfirmSave}
                  className="px-6 py-4 rounded-xl text-lg font-medium bg-[#6c4c9c] hover:bg-[#5d3d8d] text-white transition-colors duration-300 shadow-md"
                >
                  Onayla
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Başarılı Yükleme Bildirimi */}
        {uploadSuccess.show && (
          <div className="fixed bottom-4 right-4 z-50">
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              className={`rounded-lg p-4 shadow-lg flex items-center gap-3 ${
                darkMode ? "bg-green-600 text-white" : "bg-green-500 text-white"
              }`}
            >
              <div className="rounded-full bg-white/20 p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div>
                <p className="font-medium">Resim başarıyla yüklendi!</p>
                <p className="text-sm text-white/80">{uploadSuccess.fileName}</p>
              </div>
            </motion.div>
          </div>
        )}

        {/* Menü Öğesi Resim Yükleme Bildirimi */}
        {itemImageSuccess.show && (
          <div className="fixed bottom-4 right-4 z-50">
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              className={`rounded-lg p-4 shadow-lg flex items-center gap-3 ${
                darkMode ? "bg-green-600 text-white" : "bg-green-500 text-white"
              }`}
            >
              <div className="rounded-full bg-white/20 p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div>
                <p className="font-medium">Ürün resmi güncellendi!</p>
                <p className="text-sm text-white/80">{itemImageSuccess.itemName}</p>
              </div>
            </motion.div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          marginTop: "2rem",
          padding: "2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: darkMode ? "#1a1a1a" : "#ffffff",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <img
          src="/image1.png"
          alt="Logo alt"
          style={{
            height: "50px",
            width: "50px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />

        <div style={{ display: "flex", gap: "1.5rem" }}>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "inherit",
              textDecoration: "none",
              padding: "0.4rem",
              borderRadius: "50%",
              transition: "background-color 0.3s",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="icon-link"
          >
            <Twitter size={24} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "inherit",
              textDecoration: "none",
              padding: "0.4rem",
              borderRadius: "50%",
              transition: "background-color 0.3s",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="icon-link"
          >
            <Instagram size={24} />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "inherit",
              textDecoration: "none",
              padding: "0.4rem",
              borderRadius: "50%",
              transition: "background-color 0.3s",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="icon-link"
          >
            <Youtube size={24} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "inherit",
              textDecoration: "none",
              padding: "0.4rem",
              borderRadius: "50%",
              transition: "background-color 0.3s",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="icon-link"
          >
            <Linkedin size={24} />
          </a>
        </div>
      </footer>
    </div>
  )
}
