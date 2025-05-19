"use client"

import { useEffect, useState } from "react"
import AdminNavbar from "../components/AdminNavbar"
import Footer from "../components/Footer"
import PendingUserList from "../components/PendingUserList"
import PendingSelectedUser from "../components/PendingSelectedUser"
import PendingActionButtons from "../components/PendingActionButtons"
import Toast from "../components/Toast"
import axios from "axios"

const initialUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Customer", status: "pending" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Courier", status: "pending" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "Restaurant Owner", status: "pending" },
  { id: 4, name: "Samo Johnson", email: "mike@example.com", role: "Restaurant Owner", status: "pending" },
  { id: 5, name: "Baris Johnson", email: "mike@example.com", role: "Restaurant Owner", status: "pending" },
  { id: 6, name: "Muzo Johnson", email: "mike@example.com", role: "Restaurant Owner", status: "pending" },
  { id: 7, name: "Said Johnson", email: "mike@example.com", role: "Restaurant Owner", status: "pending" },
]

export default function PendingRegistrationsPage({ darkMode, setDarkMode }) {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [filterStatus, setFilterStatus] = useState("pending") // ✨ artık burada
  const [toasts, setToasts] = useState([])

  const getRegistrationRequests = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/users/pendings")
      const data = response.data.pendingUsers
      data.forEach((value) => {
        value.status = "pending"
      })
      setUsers(data)
    } catch (error) {
      alert(error)
    }
  }

  useEffect(() => {
    getRegistrationRequests()
  }, [selectedUser])

  const addToast = (message) => {
    setToasts((prev) => [...prev, message])
    setTimeout(() => setToasts((prev) => prev.slice(1)), 2500)
  }

  const putPendingRequest = async (id, state) => {
    try {
      await axios.put(`http://localhost:8080/api/registration/pending/${id}-${state}`)
      return true
    } catch (error) {
      console.log("Error: " + error)
      return false
    }
  }
  const approveUser = (id) => {
    putPendingRequest(id, true).then((response) => {
      if (response) {
        setSelectedUser(null)
        addToast("✅ User approved successfully!")
      }
    })
  }

  const declineUser = (id) => {
    putPendingRequest(id, false).then((response) => {
      if (response) {
        setSelectedUser(null)
        addToast("❌ User declined.")
      }
    })
  }

  return (
    <div
      style={{
        backgroundColor: darkMode ? "#121212" : "#F2E8D6", // Daha koyu bir arka plan
        color: darkMode ? "#e0e0e0" : "#000", // Daha yumuşak bir metin rengi
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.4s ease-in-out", // Daha yumuşak geçiş
        backgroundImage: darkMode ? "radial-gradient(circle at 50% 50%, #1a1a1a 0%, #121212 100%)" : "none", // Hafif gradyan efekti
      }}
    >
      <AdminNavbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "2rem 4rem",
          gap: "4rem",
          flex: "1", // Ana içeriğin esnek olarak büyümesini sağlar
          position: "relative", // Pozisyon ayarı
          zIndex: 1, // z-index
        }}
      >
        <h2
          style={{
            marginBottom: "2rem",
            color: darkMode ? "#f0c886" : "#6b4b10", // Daha parlak başlık rengi
            fontSize: "1.75rem",
            fontWeight: "600",
            letterSpacing: "0.5px", // Harf aralığı
            textShadow: darkMode ? "0 2px 4px rgba(0,0,0,0.3)" : "none", // Metin gölgesi
          }}
        >
          Pending Registrations
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "2rem",
            alignItems: "flex-start",
          }}
        >
          <PendingUserList
            pendingUsers={users}
            setSelectedPendingUser={setSelectedUser}
            selectedPendingUser={selectedUser}
            filterStatus={filterStatus} // ✨ props geçiyoruz
            setFilterStatus={setFilterStatus} // ✨ dropdownu yönetmesi için veriyoruz
            darkMode={darkMode}
          />

          <PendingSelectedUser selected={selectedUser} darkMode={darkMode} />

          {filterStatus === "pending" ? (
            <PendingActionButtons
              selected={selectedUser}
              approveUser={approveUser}
              declineUser={declineUser}
              addToast={addToast}
              darkMode={darkMode}
            />
          ) : (
            <div
              style={{
                backgroundColor: darkMode ? "rgba(42, 42, 42, 0.8)" : "#f3f3f3", // Yarı saydam arka plan
                padding: "1.5rem",
                borderRadius: "20px",
                minHeight: "300px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: darkMode
                  ? "0 8px 20px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.05) inset"
                  : "0 4px 12px rgba(0,0,0,0.1)", // Gelişmiş gölge
                backdropFilter: "blur(5px)", // Bulanıklık efekti
                border: darkMode ? "1px solid rgba(255,255,255,0.05)" : "none", // İnce kenarlık
                transition: "all 0.3s ease", // Geçiş efekti
              }}
            >
              <span
                style={{
                  color: darkMode ? "#aaa" : "#888",
                  fontStyle: "italic",
                  opacity: 0.8,
                }}
              >
                Actions available only for Pending users
              </span>
            </div>
          )}
        </div>
      </div>

      <Footer darkMode={darkMode} />

      {toasts.length > 0 && <Toast messages={toasts} darkMode={darkMode} />}
    </div>
  )
}
