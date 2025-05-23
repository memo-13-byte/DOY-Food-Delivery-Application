"use client";

import { useState, useEffect } from "react";

import AuthorizedRequest from "../services/AuthorizedRequest";
import { CommentSection } from "../components/CommentSection";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DoyLogo from "../components/DoyLogo";




export default function CourierCommentPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [courierId, setCourierId] = useState(0);
  const [courierEmail, setCourierEmial] = useState(localStorage.getItem("email"));
  const [rating, setRating] = useState(0)
  const [ratingCount, setRatingCount] = useState(0)

  const [courierComments, setCourierComments] = useState([{
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
        const ratingResponse = (await AuthorizedRequest.getRequest(`http://localhost:8080/api/users/couriers/get-by-email/${courierEmail}`)).data;
        setRating(ratingResponse.rating)
        setRatingCount(ratingResponse.ratingCount)
        setCourierId(ratingResponse.id)

        const reviewResponse = await AuthorizedRequest.getRequest(`http://localhost:8080/api/comment/get/for-courier/${ratingResponse.id}`);
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
    
        
        setCourierComments(commentsData)
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
      userId: courierId
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
              comments={courierComments}
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