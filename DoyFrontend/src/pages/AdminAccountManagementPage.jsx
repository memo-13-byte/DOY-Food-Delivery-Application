"use client"

import { useState } from "react"
import AdminNavbar from "../components/AdminNavbar"
import Footer from "../components/Footer"
import UserList from "../components/UserList"
import RestaurantList from "../components/RestaurantList"
import SelectedItem from "../components/SelectedItem"
import ActionButtons from "../components/ActionButtons"
import Toast from "../components/Toast" // 📌 Toast'ı import ettik
import axios from "axios"

const initialUsers = [
  { id: 1, name: "Customer A", type: "Customer Account", banned: false, suspended: false, suspendUntil: null },
  { id: 2, name: "Customer B", type: "Customer Account", banned: false, suspended: false, suspendUntil: null },
  { id: 3, name: "Courier A", type: "Courier Account", banned: false, suspended: false, suspendUntil: null },
  {
    id: 4,
    name: "Restaurant Owner A",
    type: "Restaurant Owner Account",
    banned: false,
    suspended: false,
    suspendUntil: null,
  },
  { id: 5, name: "Customer C", type: "Customer Account", banned: false, suspended: false, suspendUntil: null },
  { id: 6, name: "Customer D", type: "Customer Account", banned: false, suspended: false, suspendUntil: null },
]

const initialRestaurants = [
  { id: 1, name: "Restaurant A", type: "Restaurant", banned: false, suspended: false, suspendUntil: null },
  { id: 2, name: "Restaurant B", type: "Restaurant", banned: false, suspended: false, suspendUntil: null },
  { id: 3, name: "Restaurant C", type: "Restaurant", banned: false, suspended: false, suspendUntil: null },
  { id: 4, name: "Restaurant D", type: "Restaurant", banned: false, suspended: false, suspendUntil: null },
  { id: 5, name: "Restaurant E", type: "Restaurant", banned: true, suspended: false, suspendUntil: null }, // ✨ Banlı
  { id: 6, name: "Restaurant F", type: "Restaurant", banned: false, suspended: true, suspendUntil: null }, // ✨ Suspendli
]

export default function AdminAccountManagementPage({ darkMode, setDarkMode }) {
  const [users, setUsers] = useState([]) // ✨ User datası artık state'te
  const [restaurants, setRestaurants] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [toasts, setToasts] = useState([]) // 📌 Multiple toasts

  const suspendUser = async (_id, desc, amount) => {
    const banRequest = {
      id: _id,
      banDuration: amount,
      description: desc,
    }

    try {
      console.log(banRequest)
      const response = await axios.put(`http://localhost:8080/api/users/suspend`, banRequest)
    } catch (error) {
      console.log(error)
      addToast(error?.response?.data?.errors || error.message || "An unexpected error occurred.")
    }
  }

  // 📌 Kullanıcı güncelleme fonksiyonu
  const updateUserOrRestaurant = async (id, field, value, type) => {
    if (type === "user") {
      console.log("lalalala412421")
      console.log(id + " " + field + " " + value + " " + type)
      if (field === "banned") {
        console.log("zzzzzzzz")
        await suspendUser(id, "you were banned", -1)
      } else if (field === "suspended") {
        console.log("lalalalala56565656")
        await suspendUser(id, "you were suspended", value)
      } else if (field === "unban" || field === "unsuspended") {
        await suspendUser(id, "you were unsuspended", -2)
      }

      /*
            setUsers(prevUsers => {
                const updatedUsers = prevUsers.map(user =>
                    user.id === id ? { ...user, [field]: value } : user
                );

                if (selectedUser?.id === id) {
                    setSelectedUser(updatedUsers.find(user => user.id === id));
                }
                
                return updatedUsers;
            });*/
    } else if (type === "restaurant") {
      setRestaurants((prevRestaurants) => {
        const updatedRestaurants = prevRestaurants.map((restaurant) =>
          restaurant.id === id ? { ...restaurant, [field]: value } : restaurant,
        )

        if (selectedRestaurant?.id === id) {
          setSelectedRestaurant(updatedRestaurants.find((r) => r.id === id))
        }

        return updatedRestaurants
      })
    }
  }

  // 📌 Toast ekleme fonksiyonu
  const addToast = (message) => {
    setToasts((prev) => [...prev, message])
    setTimeout(() => {
      setToasts((prev) => prev.slice(1))
    }, 2500)
  }

  return (
    <div
      style={{
        backgroundColor: darkMode ? "#1c1c1c" : "#F2E8D6",
        color: darkMode ? "#e0e0e0" : "#000",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        transition: "all 0.3s ease-in-out",
      }}
    >
      {/* Navbar */}
      <AdminNavbar darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Main Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "2rem",
          gap: "4rem",
          flex: 1,
          maxWidth: "1400px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* Manage Users */}
        <div>
          <h2
            style={{
              marginBottom: "2rem",
              color: darkMode ? "#e8c886" : "#6b4b10",
              fontSize: "1.8rem",
              fontWeight: "bold",
              letterSpacing: "0.5px",
              borderBottom: darkMode ? "1px solid #333" : "1px solid #d0c0a0",
              paddingBottom: "0.5rem",
            }}
          >
            Manage Users
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr 1fr",
              gap: "2rem",
              alignItems: "flex-start",
            }}
          >
            <UserList
              users={users} // ✨ users arrayini veriyoruz
              setUsers={setUsers}
              setSelectedUser={setSelectedUser}
              selectedUser={selectedUser}
              darkMode={darkMode}
              updateUserOrRestaurant={updateUserOrRestaurant} // ✨ Kullanıcıyı update edebilmek için veriyoruz
            />
            <SelectedItem selected={selectedUser} type="user" darkMode={darkMode} />
            <ActionButtons
              selected={selectedUser}
              type="user"
              darkMode={darkMode}
              setToast={addToast}
              updateUserOrRestaurant={updateUserOrRestaurant} // ✨ Kullanıcı update butonlarından yapılacak
            />
          </div>
        </div>

        {/* Manage Restaurants */}
        <div>
          <h2
            style={{
              marginBottom: "2rem",
              color: darkMode ? "#e8c886" : "#6b4b10",
              fontSize: "1.8rem",
              fontWeight: "bold",
              letterSpacing: "0.5px",
              borderBottom: darkMode ? "1px solid #333" : "1px solid #d0c0a0",
              paddingBottom: "0.5rem",
            }}
          >
            Manage Restaurants
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr 1fr",
              gap: "2rem",
              alignItems: "flex-start",
            }}
          >
            <RestaurantList
              restaurants={restaurants}
              setRestaurants={setRestaurants}
              setSelectedRestaurant={setSelectedRestaurant}
              selectedRestaurant={selectedRestaurant}
              darkMode={darkMode}
            />
            <SelectedItem selected={selectedRestaurant} type="restaurant" darkMode={darkMode} />
            <ActionButtons
              selected={selectedRestaurant}
              type="restaurant"
              darkMode={darkMode}
              setToast={addToast}
              updateUserOrRestaurant={updateUserOrRestaurant}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer darkMode={darkMode} />

      {/* Toasts */}
      {toasts.length > 0 && <Toast messages={toasts} darkMode={darkMode} />}
    </div>
  )
}
