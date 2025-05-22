"use client";

import { useState, useEffect } from "react";
import {
  Utensils,
  Moon,
  Sun,
  MessageSquare,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Star,
  Send,
  ChevronRight,
  Loader2,
} from "lucide-react";

import AuthorizedRequest from "../services/AuthorizedRequest";
import { useParams } from "react-router-dom";
import { CommentSection } from "../components/CommentSection";
import { OrderDetailModal } from "./courier-order-tracking";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DoyLogo from "../components/DoyLogo";

const Button = ({ className, children, type = "button", disabled = false, ...props }) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

const Switch = ({ checked, onCheckedChange, className }) => {
  return (
    <button
      role="switch"
      aria-checked={checked}
      data-state={checked ? "checked" : "unchecked"}
      onClick={() => onCheckedChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? "bg-amber-400" : "bg-gray-300"
      } ${className}`}
    >
      <span
        data-state={checked ? "checked" : "unchecked"}
        className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
};



export default function CommentPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [restaurantComment, setRestaurantComment] = useState({
    id: 0,
    author: "",
    content: "",
    timestamp: "",
    replies: [
      {
        id: 0,
    author: "",
    content: "",
    timestamp: "",
      },
    ],
  });
  const [courierComment, setCourierComment] = useState({
    id: 0,
    author: "",
    content: "",
    timestamp: "",
    replies: [
      {
        id: 0,
    author: "",
    content: "",
    timestamp: "",
      },
    ],
  });
  const { id: orderId } = useParams()
  const [customerId, setCustomerId] = useState(0)

    const [selectedOrderDetail, setSelectedOrderDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [orderIdInformation, setOrderIdInformation] = useState(null)

  const handleShowDetailsClick = () => {
    console.log(orderId)
    if (orderId) {
      fetchOrderDetails(orderId)
    } else {
      setDetailError("Sipariş ID URL'de bulunamadı.")
    }
  }

   const fetchOrderDetails = async (orderId) => {
      
      if (!orderId) {
        setDetailError("Sipariş ID sağlanmadı.")
        setDetailLoading(false)
        return
      }
      
      setDetailLoading(true)
      setDetailError(null)
      setSelectedOrderDetail(null)
      
      const url = `http://localhost:8080/order/details/${orderId}`
      console.log(selectedOrderDetail)
      try {
        
        const response = await AuthorizedRequest.getRequest(url)
        if (response.data) {
          setSelectedOrderDetail(response.data)
          
          setShowModal(true) // Show modal after fetching
          
        } else {
          setDetailError("Sipariş detayları bulunamadı.")
          setSelectedOrderDetail({ orderId })
        }
      } catch (err) {
        setDetailError(
          `Sipariş detayları yüklenirken hata: ${
            err.response?.data?.message || err.message || "Bilinmeyen Hata"
          }`
        )
        setSelectedOrderDetail({ orderId })
      } finally {
        setDetailLoading(false)
        
      }
    }

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handler to close modal
  const closeDetailModal = () => {
    setShowModal(false)
    setSelectedOrderDetail(null)
    setDetailLoading(false)
    setDetailError(null)
  }

  useEffect(() => {
    const getComments = async () => {
        const reviewResponse = await AuthorizedRequest.getRequest(`http://localhost:8080/api/order-review/get/${orderId}`);
        let element = reviewResponse.data.courierComment;
        setCustomerId(element.user.id)
        let replyResponse = await AuthorizedRequest.getRequest(`http://localhost:8080/api/comment/get-replies/${element.id}`);

        const _courierComment = {
            id: element.id,
            author: element.user.firstname + " " + element.user.lastname,
            content: element.content,
            timestamp: element.createdAt,
            replies: replyResponse.data.map((value) => {return {
                id: value.id,
                author: value.user.firstname + " " + value.user.lastname,
                content: value.content,
                timestamp: value.createdAt
            }})
        }
        setCourierComment(_courierComment)

        element = reviewResponse.data.restaurantComment
        replyResponse = await AuthorizedRequest.getRequest(`http://localhost:8080/api/comment/get-replies/${element.id}`);

        const _restaurantComment = {
            id: element.id,
            author: element.user.firstname + " " + element.user.lastname,
            content: element.content,
            timestamp: element.createdAt,
            replies: replyResponse.data.map((value) => {return {
                id: value.id,
                author: value.user.firstname + " " + value.user.lastname,
                content: value.content,
                timestamp: value.createdAt
            }})
        }
        setRestaurantComment(_restaurantComment)
    }

    getComments()
  }, [activeReplyId])


  const handleReply = (commentId) => {
    setActiveReplyId(commentId);
  };

  const handleSubmitReply = async(commentId, replyText) => {
    const payload = {
      replyTo: commentId,
      content: replyText,
      userId: customerId
    }
    const response = await AuthorizedRequest.postRequest("http://localhost:8080/api/comment/post-reply", payload)

    alert(`Reply to comment ID: ${commentId} with text: ${replyText}`);
    setActiveReplyId(null);
  };

  const handleCancelReply = () => {
    setActiveReplyId(null);
  };

  return (
    <div
      className={`flex flex-col min-h-screen ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gradient-to-b from-amber-50 to-amber-100"
      } transition-colors duration-300`}
    >
     <Header darkMode={darkMode} setDarkMode={setDarkMode} ></Header>

      <DoyLogo></DoyLogo>

     

      {/* Comment Sections */}
      <div className="flex-grow flex justify-center items-start px-4 pb-12">
         
        <div
          className={`w-full max-w-2xl ${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-lg p-8 shadow-lg transition-all duration-300 ${
            mounted ? "animate-slideUp" : "opacity-0 translate-y-10"
          }`}
        >
          <h1
            className={`text-2xl font-bold ${darkMode ? "text-amber-300" : "text-amber-800"} text-center mb-6`}
          >
            Order Review
          </h1>
          <div className="space-y-8">
            <Button
                  onClick={handleShowDetailsClick}
                  disabled={detailLoading}
                  className={`w-full mb-6 ${darkMode ? "bg-amber-500 hover:bg-amber-600 text-gray-900" : "bg-amber-300 hover:bg-amber-400 text-amber-800"} font-medium transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 h-11 px-4 py-2`}
                >
                  {detailLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Yükleniyor...
                    </>
                  ) : (
                    <>
                      Sipariş Detaylarını Görüntüle
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
            <CommentSection
              title="Restaurant Review"
              comments={[restaurantComment]}
              darkMode={darkMode}
              onReply={handleReply}
              _rating={3}
              activeReplyId={activeReplyId}
              onSubmitReply={handleSubmitReply}
              onCancelReply={handleCancelReply}
            />
            <CommentSection
              title="Courier Review"
              comments={[courierComment]}
              darkMode={darkMode}
              onReply={handleReply}
              _rating={2}
              activeReplyId={activeReplyId}
              onSubmitReply={handleSubmitReply}
              onCancelReply={handleCancelReply}
            />
          </div>
        </div>
      </div>

      {/* --- Order Detail Modal --- */}
            {showModal && (
              <OrderDetailModal
                orderDetails={selectedOrderDetail}
                onClose={closeDetailModal}
                isLoading={detailLoading}
                error={detailError}
                darkMode={darkMode}
              />
            )}

      <Footer darkMode={darkMode}></Footer>
    </div>
  );
}