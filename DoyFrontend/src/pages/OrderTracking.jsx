"use client"

// OrderTrackingPage.js

import { useState, useEffect, useRef } from "react"
import axios from "axios"
// Import useParams to access URL parameters
import { useParams } from "react-router-dom"

// Assuming these components exist in the specified paths
import RestaurantNavbar from "../components/RestaurantNavbar"
import Footer from "../components/Footer"
import { Button } from "../components/Button"
import CourierAssignModal from "../components/CourierAssignModal" // Make sure this path is correct

// Define the OrderStatus enum values matching your backend
const OrderStatus = {
  PLACED: "PLACED",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  ON_PREPARATION: "ON_PREPARATION",
  PREPARED: "PREPARED",
}

// --- Order Detail Modal Component ---
// (Defined directly within OrderTrackingPage.js as requested earlier)
function OrderDetailModal({ orderDetails, onClose, isLoading, error, darkMode }) {
  if (!orderDetails && !isLoading && !error) return null // Don't render if nothing to show

  const contentBgColor = darkMode ? "#20203a" : "#fff"
  const textColor = darkMode ? "#eee" : "#333"
  const borderColor = darkMode ? "#555" : "#ddd"

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
    >
      <div
        style={{
          backgroundColor: contentBgColor,
          color: textColor,
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: darkMode ? "0 8px 20px rgba(0,0,0,0.4)" : "0 5px 15px rgba(0,0,0,0.2)",
          maxWidth: "600px",
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
          transition: "all 0.3s ease-in-out",
        }}
      >
        {/* Close Button ('X') */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "15px",
            background: "none",
            border: "none",
            fontSize: "1.8rem",
            cursor: "pointer",
            color: darkMode ? "#aaa" : "#888",
            lineHeight: "1",
          }}
          aria-label="Close modal"
        >
          &times;
        </button>

        {/* Modal Title */}
        <h3
          style={{
            textAlign: "center",
            marginBottom: "1.5rem",
            borderBottom: `1px solid ${borderColor}`,
            paddingBottom: "0.5rem",
          }}
        >
          Sipariş Detayları (ID: {orderDetails?.orderId || "..."})
        </h3>

        {/* Loading/Error States */}
        {isLoading && <p style={{ textAlign: "center" }}>Detaylar yükleniyor...</p>}
        {error && <p style={{ textAlign: "center", color: "red" }}>Hata: {error}</p>}

        {/* Order Details Content */}
        {orderDetails && !isLoading && !error && (
          <div>
            {/* Customer Info */}
            <div style={{ marginBottom: "1.5rem", borderBottom: `1px solid ${borderColor}`, paddingBottom: "1rem" }}>
              <h4 style={{ marginBottom: "0.75rem", color: darkMode ? "#bbb" : "#555" }}>Müşteri Bilgileri</h4>
              <p>
                <strong>İsim:</strong> {orderDetails.customerName || "N/A"}
              </p>
              <p>
                <strong>Telefon:</strong> {orderDetails.customerPhone || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {orderDetails.customerEmail || "N/A"}
              </p>
              <p>
                <strong>Adres:</strong>{" "}
                {orderDetails.customerAddress
                  ? [
                      orderDetails.customerAddress.street,
                      orderDetails.customerAddress.buildingNumber,
                      `Daire ${orderDetails.customerAddress.apartmentNumber}`,
                      orderDetails.customerAddress.avenue,
                      orderDetails.customerAddress.neighborhood,
                      orderDetails.customerAddress.district,
                      orderDetails.customerAddress.city,
                    ]
                      .filter(Boolean)
                      .join(", ")
                  : "N/A"}
              </p>
              <p>
                <strong>Not:</strong> {orderDetails.note || "Yok"}
              </p>
            </div>

            {/* Restaurant Info */}
            <div
              style={{
                marginBottom: "1.5rem",
                borderBottom: `1px solid ${borderColor}`,
                paddingBottom: "1rem",
              }}
            >
              <h4 style={{ marginBottom: "0.75rem", color: darkMode ? "#bbb" : "#555" }}>Restoran</h4>
              <p>
                <strong>Adı:</strong> {orderDetails.restaurantName || "N/A"}
              </p>
            </div>

            {/* Menu Items */}
            <div>
              <h4 style={{ marginBottom: "0.75rem", color: darkMode ? "#bbb" : "#555" }}>Sipariş İçeriği</h4>
              {orderDetails.menuItems && orderDetails.menuItems.length > 0 ? (
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {orderDetails.menuItems.map((item) => (
                    <li
                      key={item.id}
                      style={{
                        border: `1px solid ${borderColor}`,
                        borderRadius: "8px",
                        padding: "0.75rem",
                        marginBottom: "0.75rem",
                        backgroundColor: darkMode ? "#353550" : "#f9f9f9",
                      }}
                    >
                      <div style={{ fontWeight: "bold" }}>
                        {item.name} ({item.menuItemType})
                      </div>
                      <div style={{ fontSize: "0.9em", color: darkMode ? "#ccc" : "#666", margin: "0.25rem 0" }}>
                        {item.description}
                      </div>
                      <div style={{ fontWeight: "bold", textAlign: "right" }}>{item.price?.toFixed(2)} TL</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Siparişte ürün bulunmamaktadır.</p>
              )}
            </div>
          </div>
        )}

        {/* Close Button (Bottom) */}
        <Button
          onClick={onClose}
          style={{ marginTop: "1.5rem", display: "block", marginLeft: "auto", marginRight: "auto" }}
        >
          Kapat
        </Button>
      </div>
    </div>
  )
}

// --- Main Order Tracking Page Component ---
export default function OrderTrackingPage() {
  // --- State Variables ---
  const [darkMode, setDarkMode] = useState(false)
  const [showCourierModal, setShowCourierModal] = useState(false)
  const [selectedOrderForCourier, setSelectedOrderForCourier] = useState(null)
  const [courierRequests, setCourierRequests] = useState({}) // Keyed by courierId
  const [allOrders, setAllOrders] = useState([])
  const [loading, setLoading] = useState(true) // Start loading true initially
  const [error, setError] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState(null)
  const [availableCouriers, setAvailableCouriers] = useState([])
  const [courierLoading, setCourierLoading] = useState(false)
  const [courierError, setCourierError] = useState(null)
  const courierPollIntervalRef = useRef(null)
  // --- Get Restaurant ID from URL ---
  const { id: restaurantId } = useParams()
  console.log("OrderTrackingPage rendered. Restaurant ID from URL:", restaurantId)

  // --- Column Definitions ---
  const initialStatuses = [
    {
      title: "Onay Bekleyenler",
      color: "#EECED0",
      status: OrderStatus.PLACED,
      buttons: ["Sipariş Detay", "Sipariş Alındı"],
      canReject: true,
    },
    {
      title: "Onaylanmış",
      color: "#E7D3C6",
      status: OrderStatus.ACCEPTED,
      buttons: ["Sipariş Detay", "Hazırlanıyor"],
      canReject: false,
    },
    {
      title: "Hazırlanıyor",
      color: "#E7F0D8",
      status: OrderStatus.ON_PREPARATION,
      buttons: ["Sipariş Detay", "Hazır"],
      canReject: false,
    },
    {
      title: "Hazır Siparişler",
      color: "#D1E8D4",
      status: OrderStatus.PREPARED,
      buttons: ["Sipariş Detay", "Kurye Ata"],
      canReject: false,
    },
  ]

  // --- API Calls ---

  // Fetch orders for the specific restaurant
  const fetchOrders = async () => {
    if (!restaurantId) {
      console.error("fetchOrders called with no restaurantId!")
      setError("Restoran ID URL'de bulunamadı veya geçerli değil.")
      setLoading(false)
      setAllOrders([])
      return
    }
    console.log(`WorkspaceOrders: Fetching for restaurant ID: ${restaurantId}`) // Kept existing log prefix
    setLoading(true)
    setError(null)
    const url = `http://localhost:8080/order/restaurant/${restaurantId}/order`
    try {
      const response = await axios.get(url)
      console.log("fetchOrders: API Response (Orders):", response.data)
      if (response.data && Array.isArray(response.data.orderInfoList)) {
        // Filter out orders that shouldn't be displayed (e.g., REJECTED, or AWAITING_PICKUP if handled by backend status change)
        const displayableStatuses = [
          OrderStatus.PLACED,
          OrderStatus.ACCEPTED,
          OrderStatus.ON_PREPARATION,
          OrderStatus.PREPARED,
        ]
        const activeOrders = response.data.orderInfoList.filter((order) => displayableStatuses.includes(order.status))
        setAllOrders(activeOrders)
      } else {
        console.error("fetchOrders: Unexpected response format:", response.data)
        setAllOrders([])
        setError("Siparişler yüklenirken beklenmedik bir formatla karşılaşıldı.")
      }
    } catch (err) {
      console.error(
        `WorkspaceOrders: Error fetching orders for restaurant ${restaurantId}:`,
        err.response || err.message || err,
      )
      console.log(err)
      if (err.response.data.errors) {
        setError(err.response.data.errors)
      } else if (err.response && err.response.status === 404) {
        setError(`Restoran ID ${restaurantId} için sipariş bulunamadı.`)
      } else {
        setError(`Siparişler yüklenirken bir hata oluştu (${err.message || "Bilinmeyen Hata"}).`)
      }
      setAllOrders([])
    } finally {
      setLoading(false)
    }
  }

  // Update order status (Using Re-fetch logic)
  const updateOrderStatus = async (orderId, newStatus, accept = true) => {
    setError(null)
    console.log(
      `updateOrderStatus: Attempting update for Order ID: ${orderId}, New Status: ${newStatus}, Accept: ${accept}`,
    )
    const url = `http://localhost:8080/order/${orderId}/state`
    const payload = { status: newStatus, accept: accept }
    console.log(`updateOrderStatus: Sending PATCH to ${url} with payload:`, payload)

    try {
      const patchResponse = await axios.patch(url, payload)
      console.log(`updateOrderStatus: PATCH successful for Order ID: ${orderId}. Status: ${patchResponse.status}`)

      // Re-fetch orders to reflect the change accurately
      console.log(`updateOrderStatus: Re-fetching orders after successful update for Order ID: ${orderId}...`)
      await fetchOrders()
      console.log(`updateOrderStatus: Re-fetch complete after update for Order ID: ${orderId}.`)
    } catch (err) {
      console.error(
        `updateOrderStatus: Error during PATCH for Order ID ${orderId}:`,
        err.response || err.message || err,
      )
      setError(
        `Sipariş durumu güncellenirken bir hata oluştu (ID: ${orderId}). Sunucu yanıtı: ${err.response?.data?.message || err.message || "Bilinmeyen hata"}`,
      )
    }
  }

  // Fetch order details
  const fetchOrderDetails = async (orderId) => {
    if (!orderId) return
    console.log(`WorkspaceOrderDetails: Fetching details for order ID: ${orderId}`) // Kept existing log prefix
    setDetailLoading(true)
    setDetailError(null)
    setSelectedOrderDetail(null)
    setShowDetailModal(true)
    const url = `http://localhost:8080/order/details/${orderId}`
    try {
      const response = await axios.get(url)
      console.log("fetchOrderDetails: API Response (Details):", response.data)
      if (response.data) {
        setSelectedOrderDetail(response.data)
      } else {
        console.error("fetchOrderDetails: No data received for order details:", orderId)
        setDetailError("Sipariş detayları bulunamadı.")
        setSelectedOrderDetail({ orderId })
      }
    } catch (err) {
      console.error(
        `WorkspaceOrderDetails: Error fetching order details for ${orderId}:`,
        err.response || err.message || err,
      ) // Kept existing log prefix
      setDetailError(`Sipariş detayları yüklenirken bir hata oluştu (${err.message || "Bilinmeyen Hata"}).`)
      setSelectedOrderDetail({ orderId })
    } finally {
      setDetailLoading(false)
    }
  }

  // Fetch Available Couriers
  // Fetch Available Couriers - Modified for polling context
  const fetchAvailableCouriers = async (isPolling = false) => {
    if (!restaurantId) {
      if (!isPolling) setCourierError("Restoran ID bulunamadı, kuryeler yüklenemiyor.")
      console.error("fetchAvailableCouriers: No restaurantId available.") // Keep your logs if different
      // setAvailableCouriers([]); // Decide if you want to clear list on critical error
      return false
    }
    // Keep any existing console logs you have here if they differ
    console.log(`WorkspaceAvailableCouriers: Fetching (Polling: ${isPolling}) for restaurant ID: ${restaurantId}`) // Using your log prefix

    // Only set loading/clear error on initial fetch
    if (!isPolling) {
      setCourierLoading(true)
      setCourierError(null)
      // setAvailableCouriers([]); // Decide if you want to clear list on initial fetch
    }

    const url = `http://localhost:8080/order/restaurant/${restaurantId}/couriers`
    try {
      const response = await axios.get(url)
      // Keep any existing success logs you have
      console.log("fetchAvailableCouriers: API Response (Couriers):", response.data)
      if (response.data && Array.isArray(response.data)) {
        setAvailableCouriers(response.data) // Update the list
        setCourierError(null) // Clear error on success
        return true
      } else {
        console.error("fetchAvailableCouriers: Unexpected response format:", response.data)
        if (!isPolling) setCourierError("Kuryeler yüklenirken beklenmedik bir formatla karşılaşıldı.")
        return true // Allow modal open
      }
    } catch (err) {
      // Keep any existing error logs you have
      console.error(
        `WorkspaceAvailableCouriers: Error fetching couriers for restaurant ${restaurantId}:`,
        err.response || err.message || err,
      )
      const errorMsg = `Kuryeler yüklenirken bir hata oluştu: ${err.response?.data?.message || err.message || "Bilinmeyen hata"}`
      setCourierError(errorMsg) // Update error state
      return false // Indicate failure
    } finally {
      // Only stop loading indicator for initial fetch
      if (!isPolling) setCourierLoading(false)
    }
  }

  // --- Effects ---
  useEffect(() => {
    console.log(`useEffect[restaurantId]: Running effect. Current restaurantId: ${restaurantId}`)
    if (restaurantId) {
      fetchOrders()
    } else {
      console.warn("useEffect[restaurantId]: restaurantId is missing, skipping initial fetch.")
      setError("Restoran ID URL'de bulunamadı.")
      setLoading(false)
    }
    // Cleanup function (optional)
    // return () => { console.log("Cleanup effect"); };
  }, [restaurantId]) // Dependency array
  // --- ADDED: Effect for Courier Polling ---
  useEffect(() => {
    // Log added - adjust if needed
    console.log(
      `Courier Polling useEffect: Running. showCourierModal=<span class="math-inline">\{showCourierModal\}, restaurantId\=</span>{restaurantId}`,
    )
    // Only run if modal is shown AND we have a restaurant ID
    if (showCourierModal && restaurantId) {
      console.log("Courier Polling Effect: Starting interval.")
      // Set interval to call fetchAvailableCouriers every 3 seconds
      // Pass true to indicate this is a polling call (affects loading/error state handling)
      courierPollIntervalRef.current = setInterval(() => {
        fetchAvailableCouriers(true)
      }, 3000) // 3000 ms = 3 seconds

      // Cleanup function: This is crucial to stop the interval
      return () => {
        console.log("Courier Polling Effect: Clearing interval.")
        clearInterval(courierPollIntervalRef.current)
      }
    } else {
      // If the modal is not shown, ensure any existing interval is cleared
      clearInterval(courierPollIntervalRef.current)
    }
  }, [showCourierModal, restaurantId]) // Dependencies: effect re-runs if modal visibility or restaurantId changes

  // --- Event Handlers ---
  const handleShowDetailsClick = (order) => {
    console.log("handleShowDetailsClick: Clicked for Order ID:", order.orderId)
    fetchOrderDetails(order.orderId)
  }

  const closeDetailModal = () => {
    console.log("closeDetailModal: Closing detail modal.")
    setShowDetailModal(false)
    setSelectedOrderDetail(null)
    setDetailLoading(false)
    setDetailError(null)
  }

  const handleMoveOrder = (order) => {
    console.log("handleMoveOrder: Clicked for Order ID:", order.orderId, "Current Status:", order.status)
    const currentStatusIndex = initialStatuses.findIndex((s) => s.status === order.status)
    if (currentStatusIndex >= 0 && currentStatusIndex < initialStatuses.length - 1) {
      const nextStatus = initialStatuses[currentStatusIndex + 1].status
      console.log("handleMoveOrder: Determined Next Status:", nextStatus)
      updateOrderStatus(order.orderId, nextStatus, true)
    } else if (currentStatusIndex === initialStatuses.length - 1) {
      // Last status ("Hazır Siparişler"), open courier modal after fetching couriers
      console.log("handleMoveOrder: Triggering courier modal opening process for Order ID:", order.orderId)
      handleOpenCourierModal(order) // This function now fetches couriers
    } else {
      console.warn(
        `handleMoveOrder: Could not find status index or order is in unexpected state. Index: ${currentStatusIndex}, Status: ${order.status}`,
      )
    }
  }

  const handleRejectOrder = (order) => {
    console.log("handleRejectOrder: Clicked for Order ID:", order.orderId, "Current Status:", order.status)
    updateOrderStatus(order.orderId, order.status, false) // Using accept: false logic
  }

  // Fetch couriers before opening modal
  const handleOpenCourierModal = async (order) => {
    console.log("handleOpenCourierModal: Opening process initiated for Order ID:", order.orderId)
    setSelectedOrderForCourier(order)
    setCourierRequests({}) // Reset requests

    const couriersFetchedSuccessfully = await fetchAvailableCouriers(false) // Ensure 'false' is passed

    if (couriersFetchedSuccessfully !== false) {
      console.log("handleOpenCourierModal: Couriers fetched (or fetch completed), opening modal.")
      setShowCourierModal(true)
    } else {
      console.error("handleOpenCourierModal: Critical failure fetching couriers, not opening modal.")
    }
  }

  const closeCourierModal = () => {
    console.log("closeCourierModal: Closing courier modal.")
    setShowCourierModal(false)
    setSelectedOrderForCourier(null)
    setAvailableCouriers([]) // Clear courier data
    setCourierLoading(false)
    setCourierError(null)
  }

  // --- MODIFIED handleCourierAssign ---
  // Sends the POST request to request a courier
  const handleCourierAssign = async (courier) => {
    if (!selectedOrderForCourier || !courier) {
      console.warn("handleCourierAssign: No order or courier selected.")
      return
    }
    const orderId = selectedOrderForCourier.orderId
    const courierId = courier.courierId

    // Prevent duplicate requests if already pending
    if (courierRequests[courierId] === "pending") {
      console.log(`handleCourierAssign: Request already pending for Courier ID: ${courierId}`)
      return
    }

    console.log(
      `handleCourierAssign: Sending assign request for Courier ID: ${courierId} (${courier.firstName}) to Order ID: ${orderId}`,
    )

    // Set UI state to pending immediately
    setCourierRequests((prev) => ({ ...prev, [courierId]: "pending" }))
    setError(null) // Clear previous general errors

    const requestUrl = `http://localhost:8080/order/restaurant/request/${orderId}/${courierId}`
    console.log("handleCourierAssign: Sending POST to:", requestUrl)

    try {
      // Make the actual API call
      const response = await axios.post(requestUrl)
      console.log(
        `handleCourierAssign: POST request successful for Courier ID: ${courierId}, Order ID: ${orderId}. Status: ${response.status}`,
      )
      // Success! The UI already shows "pending". No further action needed here.
      // The order card will automatically disappear from this view if the backend
      // updates the order status to AWAITING_PICKUP upon courier acceptance.
    } catch (err) {
      // Handle API call error
      console.error(
        `handleCourierAssign: Error sending POST request for Courier ID ${courierId}, Order ID ${orderId}:`,
        err.response || err.message || err,
      )
      // Update UI to show failure for this specific courier
      setCourierRequests((prev) => ({ ...prev, [courierId]: "failed" }))
      // Display a general error message to the user
      setError(
        `Kurye ${courier.firstName} için istek gönderilirken hata oluştu: ${err.response?.data?.message || err.message || "Bilinmeyen sunucu hatası"}`,
      )
    }
  }
  // --- End of MODIFIED handleCourierAssign ---

  // --- Rendering ---
  return (
    <div
      style={{
        backgroundColor: darkMode ? "#1a1a2e" : "#F2E8D6",
        color: darkMode ? "#f0f0f0" : "#333",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease-in-out",
      }}
    >
      {/* Navbar */}
      <RestaurantNavbar darkMode={darkMode} setDarkMode={setDarkMode} />
      {/* Main Content Area */}
      <div style={{ padding: "1rem 2rem 2rem 2rem", flexGrow: 1 }}>
        {/* Page Title and Restaurant ID */}
        <h2 style={{ textAlign: "center", marginBottom: "0.5rem" }}>Sipariş Yönetimi</h2>
        <p
          style={{ textAlign: "center", marginBottom: "1.5rem", color: darkMode ? "#ccc" : "#555", fontSize: "0.9em" }}
        >
          Restoran ID: {restaurantId || "Yükleniyor..."}
        </p>

        {/* Loading State Display */}
        {loading && <p style={{ textAlign: "center", padding: "2rem 0" }}>Siparişler yükleniyor...</p>}

        {/* Error Message Display */}
        {error && !loading && (
          <p
            style={{
              textAlign: "center",
              color: "white",
              fontWeight: "bold",
              backgroundColor: "#dc3545",
              padding: "0.75rem",
              borderRadius: "8px",
              margin: "1rem auto",
              maxWidth: "800px",
            }}
          >
            Hata: {error}
          </p>
        )}

        {/* No Orders Message */}
        {!loading && !error && restaurantId && allOrders.length === 0 && (
          <p style={{ textAlign: "center", marginTop: "2rem", color: darkMode ? "#aaa" : "#666" }}>
            Bu restoran için gösterilecek aktif sipariş bulunmamaktadır.
          </p>
        )}

        {/* Order Columns Grid */}
        {!loading && !error && restaurantId && allOrders.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
              alignItems: "start",
            }}
          >
            {/* Map through status columns */}
            {initialStatuses.map((statusInfo) => (
              <div
                key={statusInfo.status}
                style={{
                  backgroundColor: statusInfo.color,
                  borderRadius: "20px",
                  padding: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  alignItems: "center",
                  minHeight: "150px",
                }}
              >
                {/* Column Title */}
                <h4
                  style={{
                    marginTop: "0.5rem",
                    marginBottom: "0.5rem",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  {statusInfo.title}
                </h4>

                {/* Filter and Map Orders for this column */}
                {allOrders
                  .filter((order) => order.status === statusInfo.status)
                  .map((order) => (
                    // Order Card
                    <div
                      key={order.orderId}
                      style={{
                        backgroundColor: darkMode ? "#2d2d42" : "#fff",
                        color: darkMode ? "#f0f0f0" : "#333",
                        borderRadius: "12px",
                        padding: "1.25rem",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.75rem",
                        boxShadow: darkMode ? "0 4px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.1)",
                        transition: "all 0.3s ease-in-out",
                      }}
                    >
                      {/* Card Content */}
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
                        alt=""
                        style={{ width: "45px", height: "45px", objectFit: "contain" }}
                      />
                      <div style={{ fontWeight: "bold", fontSize: "0.9em" }}>ID: {order.orderId}</div>
                      <div
                        style={{
                          fontSize: "0.85em",
                          textAlign: "center",
                          color: darkMode ? "#ccc" : "#555",
                          wordBreak: "break-word",
                        }}
                      >
                        {order.customerName}
                      </div>
                      <div style={{ fontSize: "0.9em", fontWeight: "bold" }}>{order.price?.toFixed(2)} TL</div>

                      {/* Card Buttons */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "90%",
                          gap: "0.5rem",
                          marginTop: "0.5rem",
                        }}
                      >
                        <Button onClick={() => handleShowDetailsClick(order)} size="small">
                          {statusInfo.buttons[0]}
                        </Button>
                        {statusInfo.buttons[1] && (
                          <Button onClick={() => handleMoveOrder(order)} size="small">
                            {statusInfo.buttons[1]}
                          </Button>
                        )}
                        {statusInfo.canReject && (
                          <Button
                            onClick={() => handleRejectOrder(order)}
                            style={{ backgroundColor: "#dc3545", color: "white", border: "none" }}
                            className="hover:bg-red-700"
                            size="small"
                          >
                            Siparişi Reddet
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}

                {/* Message if Column is Empty */}
                {allOrders.filter((order) => order.status === statusInfo.status).length === 0 && (
                  <p
                    style={{
                      fontSize: "0.85em",
                      color: darkMode ? "#aaa" : "#666",
                      marginTop: "1rem",
                      textAlign: "center",
                    }}
                  >
                    Bu durumda sipariş yok.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>{" "}
      {/* End Main Content Area */}
      {/* Footer */}
      <Footer darkMode={darkMode} />
      {/* Modals */}
      {/* Courier Assign Modal */}
      {showCourierModal && selectedOrderForCourier && (
        <CourierAssignModal
          isOpen={showCourierModal}
          orderName={`Sipariş ID: ${selectedOrderForCourier.orderId} (${selectedOrderForCourier.customerName})`}
          onClose={closeCourierModal}
          onAssign={handleCourierAssign} // Expects courier object, sends POST
          requests={courierRequests} // Keyed by courierId
          darkMode={darkMode}
          availableCouriers={availableCouriers}
          isLoadingCouriers={courierLoading}
          courierError={courierError}
        />
      )}
      {/* Order Detail Modal */}
      <OrderDetailModal
        orderDetails={selectedOrderDetail}
        onClose={closeDetailModal}
        isLoading={detailLoading}
        error={detailError}
        darkMode={darkMode}
      />
    </div> // End Outer Div
  )
}
