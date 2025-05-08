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

import axios from "axios";
import { useParams } from "react-router-dom";
import { CommentSection } from "../components/CommentSection";



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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const getComments = async () => {
        const reviewResponse = await axios.get(`http://localhost:8080/api/order-review/get/${orderId}`);
        let element = reviewResponse.data.courierComment;
        setCustomerId(element.user.id)
        let replyResponse = await axios.get(`http://localhost:8080/api/comment/get-replies/${element.id}`);

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
        replyResponse = await axios.get(`http://localhost:8080/api/comment/get-replies/${element.id}`);

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
    const response = await axios.post("http://localhost:8080/api/comment/post-reply", payload)

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
      {/* Header */}
      <header
        className={`${
          darkMode ? "bg-gray-800" : "bg-[#47300A]"
        } text-white py-3 px-6 flex justify-between items-center sticky top-0 z-10 shadow-md transition-colors duration-300`}
      >
        <div className="flex items-center">
          <a
            href="/"
            className="font-bold text-xl hover:text-amber-200 transition-colors duration-200 flex items-center gap-2"
          >
            <Utensils className="w-5 h-5" />
            <span>Doy!</span>
          </a>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
              className={`${
                darkMode ? "data-[state=checked]:bg-gray-600" : "data-[state=checked]:bg-amber-200"
              } transition-colors duration-300`}
            />
            {darkMode ? (
              <Sun className="w-4 h-4 text-yellow-300" />
            ) : (
              <Moon className="w-4 h-4 text-amber-200" />
            )}
          </div>
          <a
            href="/register"
            className={`${
              darkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-amber-200 text-amber-800 hover:bg-amber-300"
            } rounded-full px-5 py-1.5 text-sm font-medium transition-all duration-200 transform hover:scale-105`}
          >
            KAYIT
          </a>
          <a
            href="/login"
            className={`${
              darkMode ? "bg-gray-600 text-white hover:bg-gray-500" : "bg-white text-amber-800 hover:bg-amber-50"
            } rounded-full px-5 py-1.5 text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-sm`}
          >
            GİRİŞ
          </a>
        </div>
      </header>

      {/* Logo */}
      <div className={`flex justify-center py-8 ${mounted ? "animate-fadeIn" : "opacity-0"}`}>
        <div
          className={`rounded-full ${
            darkMode ? "bg-gray-800" : "bg-white"
          } p-6 w-36 h-36 flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-105`}
        >
          <div className="relative w-28 h-28">
            <img src="/image1.png" alt="DOY Logo" width={112} height={112} className="w-full h-full" />
            <div
              className={`text-center text-[10px] font-bold mt-1 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              FOOD DELIVERY
            </div>
          </div>
        </div>
      </div>

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

      {/* Footer */}
      <footer
        className={`${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-amber-50 border-amber-200"
        } p-8 border-t transition-colors duration-300 mt-auto`}
      >
        <div className="flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto">
          <div className="mb-6 md:mb-0">
            <div
              className={`rounded-full ${
                darkMode ? "bg-gray-800" : "bg-white"
              } p-4 w-24 h-24 flex items-center justify-center shadow-md transition-all duration-300 hover:shadow-lg transform hover:scale-105`}
            >
              <div className="relative w-16 h-16">
                <img src="/image1.png" alt="DOY Logo" width={64} height={64} className="w-full h-full" />
                <div
                  className={`text-center text-[8px] font-bold mt-1 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  FOOD DELIVERY
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-8">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`${
                darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-amber-800"
              } transition-all duration-200 transform hover:scale-110`}
              aria-label="Twitter"
            >
              <Twitter className="w-6 h-6" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`${
                darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-amber-800"
              } transition-all duration-200 transform hover:scale-110`}
              aria-label="Instagram"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`${
                darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-amber-800"
              } transition-all duration-200 transform hover:scale-110`}
              aria-label="YouTube"
            >
              <Youtube className="w-6 h-6" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`${
                darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-amber-800"
              } transition-all duration-200 transform hover:scale-110`}
              aria-label="LinkedIn"
            >
              <Linkedin className="w-6 h-6" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}