"use client"

import { useState, useRef } from "react"
import complaintsMockData from "../data/Complaints"
import ComplaintCard from "../components/ComplaintCard"
import ComplaintDetails from "../components/ComplaintDetail"
import AdminNavbar from "../components/AdminNavbar"
import Footer from "../components/Footer"
import doyLogo from "../assets/doylogo.jpeg"
import { useNavigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import Toast from "../components/Toast"

export default function AdminComplaintsPage({ darkMode, setDarkMode }) {
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const navigate = useNavigate()
  const detailRef = useRef(null)
  const [searchText, setSearchText] = useState("")
  const [dateSort, setDateSort] = useState("newest")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false)
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(4)
  const [toastMessages, setToastMessages] = useState([])

  const handleComplaintClick = (complaint) => {
    if (selectedComplaint && selectedComplaint.id === complaint.id) {
      setSelectedComplaint(null)
    } else {
      setSelectedComplaint(complaint)
      setTimeout(() => {
        if (detailRef.current) {
          detailRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }, 300)
    }
  }

  const addToast = (newMessage) => {
    setToastMessages((prev) => [...prev, newMessage])
    setTimeout(() => {
      setToastMessages((prev) => prev.slice(1))
    }, 2500)
  }

  const filteredComplaints = complaintsMockData
    .filter(
      (c) =>
        c.customer.toLowerCase().includes(searchText.toLowerCase()) ||
        c.restaurant.toLowerCase().includes(searchText.toLowerCase()) ||
        c.description.toLowerCase().includes(searchText.toLowerCase()),
    )
    .filter((c) => statusFilter === "all" || c.status.toLowerCase() === statusFilter)
    .sort((a, b) => {
      if (dateSort === "newest") {
        return new Date(b.filedDate) - new Date(a.filedDate)
      } else if (dateSort === "oldest") {
        return new Date(a.filedDate) - new Date(b.filedDate)
      } else {
        return 0
      }
    })

  return (
    <div
      style={{
        backgroundColor: darkMode ? "#1c1c1c" : "#F2E8D6",
        color: darkMode ? "#e0e0e0" : "#000",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease-in-out",
      }}
    >
      <AdminNavbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <div
        style={{
          backgroundColor: darkMode ? "#2a2a2a" : "#E7DECB",
          padding: "1.5rem 3rem",
          display: "flex",
          alignItems: "center",
          gap: "2rem",
          transition: "all 0.3s ease-in-out",
          borderBottom: darkMode ? "1px solid #333" : "1px solid #d0c0a0",
        }}
      >
        <img
          src={doyLogo || "/placeholder.svg"}
          alt="logo"
          style={{
            height: "120px",
            width: "120px",
            borderRadius: "50%",
            objectFit: "cover",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            flexGrow: 1,
          }}
        >
          <h1
            style={{
              fontWeight: "800",
              fontSize: "1.8rem",
              color: darkMode ? "#e8c886" : "#47300A",
              marginBottom: "0.5rem",
              letterSpacing: "0.5px",
            }}
          >
            Complaints & Disputes Dashboard
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: darkMode ? "#aaa" : "#6b4b10",
              margin: 0,
            }}
          >
            Manage and resolve customer complaints efficiently
          </p>
        </div>
      </div>

      <div
        style={{
          padding: "2rem",
          flex: 1,
          maxWidth: "75%",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* Search and Dropdown Filters */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            marginBottom: "2rem",
            flexWrap: "wrap",
            width: "100%",
            margin: "0 auto 2rem auto",
          }}
        >
          <input
            type="text"
            placeholder="Filter complaints"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              fontSize: "1rem",
              borderRadius: "12px",
              border: darkMode ? "1px solid #444" : "1px solid #ccc",
              backgroundColor: darkMode ? "rgba(30, 30, 30, 0.7)" : "#fff",
              color: darkMode ? "#e0e0e0" : "#000",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              transition: "all 0.3s ease",
            }}
          />

          <div
            style={{
              display: "flex",
              gap: "1rem",
              width: "100%",
              justifyContent: "center",
            }}
          >
            {/* Date Sort Dropdown */}
            <div style={{ position: "relative", flex: 1 }}>
              <button
                onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
                style={{
                  width: "100%",
                  padding: "0.6rem 1rem",
                  borderRadius: "12px",
                  border: darkMode ? "1px solid #444" : "1px solid #ccc",
                  backgroundColor: darkMode ? "rgba(40, 40, 40, 0.7)" : "#fff",
                  color: darkMode ? "#e0e0e0" : "#000",
                  fontWeight: "bold",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "all 0.3s ease",
                }}
              >
                <span>
                  📅 {dateSort === "normal" ? "Normal Order" : dateSort === "newest" ? "Newest First" : "Oldest First"}
                </span>
                <span>{isDateDropdownOpen ? "▲" : "▼"}</span>
              </button>

              {isDateDropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "110%",
                    left: "0",
                    right: "0",
                    backgroundColor: darkMode ? "rgba(50, 50, 50, 0.95)" : "#fff",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    overflow: "hidden",
                    zIndex: 10,
                    animation: "fadeIn 0.2s ease-out",
                  }}
                >
                  <div
                    onClick={() => {
                      setDateSort("normal")
                      setIsDateDropdownOpen(false)
                    }}
                    style={{
                      padding: "0.8rem 1rem",
                      cursor: "pointer",
                      borderBottom: darkMode ? "1px solid #444" : "1px solid #eee",
                      backgroundColor: darkMode ? "rgba(60, 60, 60, 0.7)" : "#fff",
                      textAlign: "center",
                      transition: "background 0.2s",
                      color: darkMode ? "#e0e0e0" : "#000",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = darkMode ? "rgba(70, 70, 70, 0.7)" : "#f5f5f5")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = darkMode ? "rgba(60, 60, 60, 0.7)" : "#fff")
                    }
                  >
                    Normal Order
                  </div>
                  <div
                    onClick={() => {
                      setDateSort("newest")
                      setIsDateDropdownOpen(false)
                    }}
                    style={{
                      padding: "0.8rem 1rem",
                      cursor: "pointer",
                      borderBottom: darkMode ? "1px solid #444" : "1px solid #eee",
                      backgroundColor: darkMode ? "rgba(60, 60, 60, 0.7)" : "#fff",
                      textAlign: "center",
                      transition: "background 0.2s",
                      color: darkMode ? "#e0e0e0" : "#000",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = darkMode ? "rgba(70, 70, 70, 0.7)" : "#f5f5f5")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = darkMode ? "rgba(60, 60, 60, 0.7)" : "#fff")
                    }
                  >
                    Newest First
                  </div>
                  <div
                    onClick={() => {
                      setDateSort("oldest")
                      setIsDateDropdownOpen(false)
                    }}
                    style={{
                      padding: "0.8rem 1rem",
                      cursor: "pointer",
                      backgroundColor: darkMode ? "rgba(60, 60, 60, 0.7)" : "#fff",
                      textAlign: "center",
                      transition: "background 0.2s",
                      color: darkMode ? "#e0e0e0" : "#000",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = darkMode ? "rgba(70, 70, 70, 0.7)" : "#f5f5f5")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = darkMode ? "rgba(60, 60, 60, 0.7)" : "#fff")
                    }
                  >
                    Oldest First
                  </div>
                </div>
              )}
            </div>

            {/* Status Sort Dropdown */}
            <div style={{ position: "relative", flex: 1 }}>
              <button
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                style={{
                  width: "100%",
                  padding: "0.6rem 1rem",
                  borderRadius: "12px",
                  border: darkMode ? "1px solid #444" : "1px solid #ccc",
                  backgroundColor: darkMode ? "rgba(40, 40, 40, 0.7)" : "#fff",
                  color: darkMode ? "#e0e0e0" : "#000",
                  fontWeight: "bold",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "all 0.3s ease",
                }}
              >
                <span>
                  {statusFilter === "open" ? "🔴" : statusFilter === "resolved" ? "🟢" : "🔵"}
                  {" " + statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                </span>
                <span>{isStatusDropdownOpen ? "▲" : "▼"}</span>
              </button>

              {isStatusDropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "110%",
                    left: "0",
                    right: "0",
                    backgroundColor: darkMode ? "rgba(50, 50, 50, 0.95)" : "#fff",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    overflow: "hidden",
                    zIndex: 10,
                    animation: "fadeIn 0.2s ease-out",
                  }}
                >
                  <div
                    onClick={() => {
                      setStatusFilter("all")
                      setIsStatusDropdownOpen(false)
                    }}
                    style={{
                      padding: "0.8rem 1rem",
                      cursor: "pointer",
                      borderBottom: darkMode ? "1px solid #444" : "1px solid #eee",
                      backgroundColor: darkMode ? "rgba(60, 60, 60, 0.7)" : "#fff",
                      textAlign: "center",
                      transition: "background 0.2s",
                      color: darkMode ? "#e0e0e0" : "#000",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = darkMode ? "rgba(70, 70, 70, 0.7)" : "#f5f5f5")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = darkMode ? "rgba(60, 60, 60, 0.7)" : "#fff")
                    }
                  >
                    🔵 All
                  </div>
                  <div
                    onClick={() => {
                      setStatusFilter("open")
                      setIsStatusDropdownOpen(false)
                    }}
                    style={{
                      padding: "0.8rem 1rem",
                      cursor: "pointer",
                      borderBottom: darkMode ? "1px solid #444" : "1px solid #eee",
                      backgroundColor: darkMode ? "rgba(60, 60, 60, 0.7)" : "#fff",
                      textAlign: "center",
                      transition: "background 0.2s",
                      color: darkMode ? "#e0e0e0" : "#000",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = darkMode ? "rgba(70, 70, 70, 0.7)" : "#f5f5f5")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = darkMode ? "rgba(60, 60, 60, 0.7)" : "#fff")
                    }
                  >
                    🔴 Open
                  </div>
                  <div
                    onClick={() => {
                      setStatusFilter("resolved")
                      setIsStatusDropdownOpen(false)
                    }}
                    style={{
                      padding: "0.8rem 1rem",
                      cursor: "pointer",
                      backgroundColor: darkMode ? "rgba(60, 60, 60, 0.7)" : "#fff",
                      textAlign: "center",
                      transition: "background 0.2s",
                      color: darkMode ? "#e0e0e0" : "#000",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = darkMode ? "rgba(70, 70, 70, 0.7)" : "#f5f5f5")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = darkMode ? "rgba(60, 60, 60, 0.7)" : "#fff")
                    }
                  >
                    🟢 Resolved
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Complaint Cards */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            alignItems: "center",
            width: "100%",
            margin: "0 auto",
          }}
        >
          {filteredComplaints.length === 0 ? (
            <div
              style={{
                padding: "2rem",
                backgroundColor: darkMode ? "rgba(40, 40, 40, 0.7)" : "#f5f5f5",
                borderRadius: "12px",
                textAlign: "center",
                width: "100%",
                color: darkMode ? "#aaa" : "#666",
              }}
            >
              No complaints found matching your filters.
            </div>
          ) : (
            filteredComplaints
              .slice(0, visibleCount)
              .map((c) => (
                <ComplaintCard
                  key={c.id}
                  complaint={c}
                  onClick={handleComplaintClick}
                  darkMode={darkMode}
                  isSelected={selectedComplaint && selectedComplaint.id === c.id}
                />
              ))
          )}

          {filteredComplaints.length > visibleCount && (
            <button
              onClick={() => setVisibleCount((prev) => prev + 4)}
              style={{
                marginTop: "1.5rem",
                padding: "0.8rem 2rem",
                backgroundColor: darkMode ? "rgba(85, 85, 85, 0.7)" : "#7A0000",
                color: "#fff",
                border: darkMode ? "1px solid rgba(255,255,255,0.1)" : "none",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "1rem",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                transform: "translateY(0)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = darkMode ? "rgba(100, 100, 100, 0.7)" : "#990000"
                e.currentTarget.style.transform = "translateY(-2px)"
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.15)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = darkMode ? "rgba(85, 85, 85, 0.7)" : "#7A0000"
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)"
              }}
            >
              Load More
            </button>
          )}
        </div>

        {/* Complaint Details */}
        <div ref={detailRef} style={{ marginTop: "2rem" }}>
          <AnimatePresence mode="wait">
            {selectedComplaint && <ComplaintDetails data={selectedComplaint} darkMode={darkMode} addToast={addToast} />}
          </AnimatePresence>
        </div>
      </div>

      <Footer darkMode={darkMode} />

      {/* Toasts */}
      {toastMessages.length > 0 && <Toast messages={toastMessages} darkMode={darkMode} />}
    </div>
  )
}
