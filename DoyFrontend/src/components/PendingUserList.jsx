"use client"

import { useState } from "react"

const PendingUserList = ({
  pendingUsers,
  setSelectedPendingUser,
  selectedPendingUser,
  filterStatus,
  setFilterStatus,
  darkMode,
}) => {
  const [search, setSearch] = useState("")
  const [visibleCount, setVisibleCount] = useState(3) // ✨ Başlangıçta sadece 3 kullanıcı gösterelim

  const filteredUsers = pendingUsers
    .filter((user) => filterStatus === "all" || user.status === filterStatus)
    .filter((user) => user.name.toLowerCase().includes(search.toLowerCase()))

  const usersToShow = filteredUsers.slice(0, visibleCount) // ✨ Şu an görünmesi gerekenler

  return (
    <div
      style={{
        backgroundColor: darkMode ? "rgba(42, 42, 42, 0.7)" : "#E7DECB",
        padding: "1.2rem",
        borderRadius: "20px",
        minHeight: "300px",
        boxShadow: darkMode
          ? "0 8px 20px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.05) inset"
          : "0 4px 15px rgba(0,0,0,0.1)",
        border: darkMode ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)",
        transition: "all 0.3s ease-in-out",
        backdropFilter: darkMode ? "blur(10px)" : "none",
      }}
    >
      {/* Search Kutusu */}
      <input
        type="text"
        placeholder="Search Pending Users"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          setVisibleCount(3) // ✨ Arama yapınca yine baştan başlasın
        }}
        style={{
          width: "95%",
          padding: "0.7rem",
          marginBottom: "1rem",
          borderRadius: "10px",
          border: darkMode ? "1px solid rgba(255,255,255,0.1)" : "1px solid #ccc",
          textAlign: "center",
          backgroundColor: darkMode ? "rgba(51, 51, 51, 0.5)" : "#fff",
          color: darkMode ? "#e0e0e0" : "#000",
          transition: "all 0.2s ease",
          outline: "none",
          boxShadow: darkMode ? "0 2px 6px rgba(0,0,0,0.2)" : "0 1px 3px rgba(0,0,0,0.05)",
          backdropFilter: darkMode ? "blur(5px)" : "none",
        }}
        onFocus={(e) => {
          e.target.style.boxShadow = darkMode
            ? "0 0 0 2px rgba(240, 200, 134, 0.3), 0 2px 6px rgba(0,0,0,0.2)"
            : "0 0 0 2px rgba(107, 75, 16, 0.2), 0 1px 3px rgba(0,0,0,0.05)"
        }}
        onBlur={(e) => {
          e.target.style.boxShadow = darkMode ? "0 2px 6px rgba(0,0,0,0.2)" : "0 1px 3px rgba(0,0,0,0.05)"
        }}
      />

      {/* Filter Dropdown */}
      <select
        value={filterStatus}
        onChange={(e) => {
          setFilterStatus(e.target.value)
          setVisibleCount(3) // ✨ Filtre değişince baştan göster
        }}
        style={{
          width: "100%",
          padding: "0.7rem",
          marginBottom: "1.2rem",
          borderRadius: "10px",
          border: darkMode ? "1px solid rgba(255,255,255,0.1)" : "1px solid #ccc",
          textAlign: "center",
          backgroundColor: darkMode ? "rgba(51, 51, 51, 0.5)" : "#fff",
          color: darkMode ? "#e0e0e0" : "#000",
          fontWeight: "bold",
          cursor: "pointer",
          transition: "all 0.2s ease",
          outline: "none",
          boxShadow: darkMode ? "0 2px 6px rgba(0,0,0,0.2)" : "0 1px 3px rgba(0,0,0,0.05)",
          backdropFilter: darkMode ? "blur(5px)" : "none",
          appearance: "none", // Standart dropdown okunu kaldırır
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='${darkMode ? "%23aaa" : "%23666"}' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 10px center",
          paddingRight: "30px",
        }}
      >
        <option value="pending">Pending Users</option>
        <option value="approved">Approved Users</option>
        <option value="declined">Declined Users</option>
        <option value="all">All Users</option>
      </select>

      {/* Kullanıcı Listesi */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.8rem",
          maxHeight: "350px",
          overflowY: "auto",
          padding: "0.2rem",
          scrollbarWidth: "thin",
          scrollbarColor: darkMode ? "#555 #333" : "#ccc #f5f5f5",
        }}
      >
        {usersToShow.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              marginTop: "1rem",
              color: darkMode ? "#aaa" : "#888",
              padding: "1.5rem",
              backgroundColor: darkMode ? "rgba(51, 51, 51, 0.3)" : "rgba(0,0,0,0.03)",
              borderRadius: "12px",
              border: darkMode ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)",
            }}
          >
            No users found
          </div>
        ) : (
          usersToShow.map((user) => (
            <div
              key={user.id}
              onClick={() => {
                if (selectedPendingUser?.id === user.id) {
                  setSelectedPendingUser(null)
                } else {
                  setSelectedPendingUser(user)
                }
              }}
              style={{
                padding: "1rem",
                backgroundColor:
                  selectedPendingUser?.id === user.id
                    ? darkMode
                      ? "rgba(85, 85, 85, 0.7)"
                      : "#D4BFAA"
                    : darkMode
                      ? "rgba(58, 58, 58, 0.7)"
                      : "#eee",
                borderRadius: "12px",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.3s ease",
                boxShadow:
                  selectedPendingUser?.id === user.id
                    ? darkMode
                      ? "0 4px 12px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)"
                      : "0 4px 12px rgba(0,0,0,0.1)"
                    : darkMode
                      ? "0 2px 6px rgba(0,0,0,0.2)"
                      : "0 1px 3px rgba(0,0,0,0.05)",
                border: darkMode ? "1px solid rgba(255,255,255,0.05)" : "none",
                backdropFilter: darkMode ? "blur(5px)" : "none",
                transform: selectedPendingUser?.id === user.id ? "translateY(-2px)" : "translateY(0)",
              }}
              onMouseEnter={(e) => {
                if (selectedPendingUser?.id !== user.id) {
                  e.currentTarget.style.backgroundColor = darkMode ? "rgba(65, 65, 65, 0.7)" : "#e5e5e5"
                  e.currentTarget.style.transform = "translateY(-2px)"
                  e.currentTarget.style.boxShadow = darkMode
                    ? "0 6px 14px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.07)"
                    : "0 6px 14px rgba(0,0,0,0.1)"
                }
              }}
              onMouseLeave={(e) => {
                if (selectedPendingUser?.id !== user.id) {
                  e.currentTarget.style.backgroundColor = darkMode ? "rgba(58, 58, 58, 0.7)" : "#eee"
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = darkMode
                    ? "0 2px 6px rgba(0,0,0,0.2)"
                    : "0 1px 3px rgba(0,0,0,0.05)"
                }
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  color: darkMode ? "#e0e0e0" : "inherit",
                  marginBottom: "0.3rem",
                }}
              >
                {user.name}
              </div>
              <small
                style={{
                  color: darkMode ? "#bbb" : "inherit",
                  display: "inline-block",
                  backgroundColor: darkMode
                    ? user.role === "Customer"
                      ? "rgba(44, 62, 80, 0.7)"
                      : user.role === "Courier"
                        ? "rgba(44, 62, 80, 0.7)"
                        : "rgba(74, 63, 53, 0.7)"
                    : user.role === "Customer"
                      ? "rgba(227, 242, 253, 0.7)"
                      : user.role === "Courier"
                        ? "rgba(232, 245, 233, 0.7)"
                        : "rgba(255, 243, 224, 0.7)",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontSize: "0.8rem",
                  color:
                    user.role === "Customer"
                      ? darkMode
                        ? "#90caf9"
                        : "#1565c0"
                      : user.role === "Courier"
                        ? darkMode
                          ? "#a5d6a7"
                          : "#2e7d32"
                        : darkMode
                          ? "#ffcc80"
                          : "#e65100",
                  border: darkMode ? "1px solid rgba(255,255,255,0.05)" : "none",
                }}
              >
                {user.role}
              </small>
            </div>
          ))
        )}
      </div>

      {/* Load More Butonu */}
      {visibleCount < filteredUsers.length && (
        <button
          onClick={() => setVisibleCount((prev) => prev + 3)}
          style={{
            marginTop: "1.2rem",
            width: "100%",
            padding: "0.7rem",
            borderRadius: "20px",
            backgroundColor: darkMode ? "rgba(85, 85, 85, 0.7)" : "#7A0000",
            color: "#fff",
            border: darkMode ? "1px solid rgba(255,255,255,0.1)" : "none",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: darkMode
              ? "0 4px 12px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.05)"
              : "0 4px 12px rgba(122, 0, 0, 0.2)",
            backdropFilter: darkMode ? "blur(5px)" : "none",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = darkMode ? "rgba(95, 95, 95, 0.8)" : "#8A1111"
            e.currentTarget.style.transform = "translateY(-2px)"
            e.currentTarget.style.boxShadow = darkMode
              ? "0 6px 14px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)"
              : "0 6px 14px rgba(122, 0, 0, 0.3)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = darkMode ? "rgba(85, 85, 85, 0.7)" : "#7A0000"
            e.currentTarget.style.transform = "translateY(0)"
            e.currentTarget.style.boxShadow = darkMode
              ? "0 4px 12px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.05)"
              : "0 4px 12px rgba(122, 0, 0, 0.2)"
          }}
        >
          Load More
        </button>
      )}
    </div>
  )
}

export default PendingUserList
