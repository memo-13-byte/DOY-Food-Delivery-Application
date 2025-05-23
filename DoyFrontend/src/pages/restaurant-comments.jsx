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
import { CommentSection } from "../components/CommentSection";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DoyLogo from "../components/DoyLogo";



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



export default function RestaurantCommentPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [restaurantId, setRestaurantId] = useState(0);
  const [restaurantEmail, setRestaurantEmail] = useState(localStorage.getItem("email"));

  const [rating, setRating] = useState(0)
  const [ratingCount, setRatingCount] = useState(0)

  const [restaurantComments, setRestaurantComments] = useState([{
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
  }]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const getComments = async () => {
        const userResponse = (await AuthorizedRequest.getRequest(`http://localhost:8080/api/users/restaurant-owners/get-by-email/${restaurantEmail}`)).data;
        setRestaurantId(userResponse.id);

        const ratingResponse = await AuthorizedRequest.getRequest(`http://localhost:8080/api/restaurant/get/${userResponse.id}`);

        setRating(ratingResponse.data.rating)
        setRatingCount(ratingResponse.data.ratingCount)


        const reviewResponse = await AuthorizedRequest.getRequest(`http://localhost:8080/api/comment/get/for-restaurant/${userResponse.id}`);
        const comments = reviewResponse.data;
        let commentsData = await Promise.all( comments.map(async (element) => {
            const replies = await AuthorizedRequest.getRequest(`http://localhost:8080/api/comment/get-replies/${element.id}`);
            return {
                    id: element.id,
                    author: element.user.firstname + " " + element.user.lastname,
                    content: element.content,
                    timestamp: element.createdAt,
                    replies: replies.data.map((value) => {return {
                        id: value.id,
                        author: value.user.firstname + " " + value.user.lastname,
                        content: value.content,
                        timestamp: value.createdAt
                    }})
                };
        }));
    
        
        setRestaurantComments(commentsData)
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
      userId: restaurantId
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
          <div className="space-y-8">
            <CommentSection
              title={"Your Reviews ( " +  ratingCount + " )" + " Average: " + rating}
              comments={restaurantComments}
              darkMode={darkMode}
              onReply={handleReply}
              _rating={rating}
              activeReplyId={activeReplyId}
              onSubmitReply={handleSubmitReply}
              onCancelReply={handleCancelReply}
            />
          </div>
        </div>
      </div>

      <Footer darkMode={darkMode}></Footer>
    </div>
  );
}