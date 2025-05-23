import React, { useState, useEffect } from 'react';
import AdminNavbar from "../components/AdminNavbar";
import Footer from "../components/Footer";
import AuthorizedRequest from '../services/AuthorizedRequest';
import { CommentSection } from '../components/CommentSection';
import Header from '../components/Header';

export default function CustomerComplaintsPage({ darkMode, setDarkMode }) {
    const [activeReplyId, setActiveReplyId] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showComplaintForm, setShowComplaintForm] = useState(false);
    const [complaintText, setComplaintText] = useState("");

    useEffect(() => {
        const getComments = async () => {
            setLoading(true);
            try {
                const complaintsResponse = await AuthorizedRequest.getRequest(`http://localhost:8080/api/comment/get/complaints/${localStorage.getItem("email")}`);

                let commentsData = await Promise.all(complaintsResponse.data.map(async (element) => {

                    const repliesResponse = await AuthorizedRequest.getRequest(`http://localhost:8080/api/comment/get-replies/${element.id}`);

                    return {
                        id: element.id,
                        author: `${element.user.firstname} ${element.user.lastname}`,
                        content: element.content || "",
                        timestamp: element.createdAt || new Date().toISOString(),
                        replies: repliesResponse.data.map((value) => {return{
                            id: value.id,
                            author: value.user.firstname + " " + value.user.lastname,
                            content: value.content || "",
                            timestamp: value.createdAt || new Date().toISOString()
                        }})
                    };
                }));

                setComments(commentsData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching complaints:", error);
                setLoading(false);
            }
        };
        getComments();
    }, [activeReplyId]); // Removed activeReplyId dependency to avoid unnecessary fetches

    const handleReply = (commentId) => {
        setActiveReplyId(commentId === activeReplyId ? null : commentId); // Toggle reply form
    };

    const handleSubmitReply = async (commentId, replyText) => {
        try {
            const currentUser = await AuthorizedRequest.getRequest(`http://localhost:8080/api/users/customers/get-by-email/${localStorage.getItem("email")}`);
            const payload = {
                replyTo: commentId,
                content: replyText,
                userId: currentUser.data.id // TODO: Replace with dynamic user ID from auth context
            };
            await AuthorizedRequest.postRequest("http://localhost:8080/api/comment/post-reply", payload);
            setActiveReplyId(null);
          

            // Refresh comments after successful complaint submission
            try {
                const complaintsResponse = await AuthorizedRequest.getRequest(`http://localhost:8080/api/comment/get/complaints/${localStorage.getItem("email")}`);
                if (!complaintsResponse?.data || !Array.isArray(complaintsResponse.data)) {
                    throw new Error("Invalid or empty response from complaints API");
                }

                const commentsData = await Promise.all(complaintsResponse.data.map(async (element) => {
                    if (!element?.user || !element.user.firstname || !element.user.lastname) {
                        console.warn(`Skipping comment ${element.id}: Missing user data`);
                        return null;
                    }

                    const repliesResponse = await AuthorizedRequest.getRequest(`http://localhost:8080/api/comment/get-replies/${element.id}`);
                    const replies = Array.isArray(repliesResponse?.data) ? repliesResponse.data : [];

                    return {
                        id: element.id,
                        author: `${element.user.firstname} ${element.user.lastname}`,
                        content: element.content || "",
                        timestamp: element.createdAt || new Date().toISOString(),
                        replies: replies.map((value) => ({
                            id: value.id,
                            author: value.user?.firstname && value.user?.lastname 
                                ? `${value.user.firstname} ${value.user.lastname}`
                                : "Unknown User",
                            content: value.content || "",
                            timestamp: value.createdAt || new Date().toISOString()
                        }))
                    };
                }));

                setComments(commentsData);
            } catch (error) {
                console.error("Error refreshing complaints:", error);
            }
        } catch (error) {
            console.error("Error submitting complaint:", error);
        }
         

    };

    const handleCancelReply = () => {
        setActiveReplyId(null);
    };

    const handleSubmitComplaint = async (e) => {
        e.preventDefault();
        if (!complaintText.trim()) {
            return;
        }

        try {
            const currentUser = await AuthorizedRequest.getRequest(`http://localhost:8080/api/users/customers/get-by-email/${localStorage.getItem("email")}`);

            const payload = {
                content: complaintText,
                userId: currentUser.data.id // TODO: Replace with dynamic user ID from auth context
            };
            await AuthorizedRequest.postRequest("http://localhost:8080/api/comment/post/complaint", payload);

            setComplaintText("");
            setShowComplaintForm(false);

            // Refresh comments after successful complaint submission
            try {
                const complaintsResponse = await AuthorizedRequest.getRequest(`http://localhost:8080/api/comment/get/complaints/${localStorage.getItem("email")}`);
                if (!complaintsResponse?.data || !Array.isArray(complaintsResponse.data)) {
                    throw new Error("Invalid or empty response from complaints API");
                }

                const commentsData = await Promise.all(complaintsResponse.data.map(async (element) => {
                    if (!element?.user || !element.user.firstname || !element.user.lastname) {
                        console.warn(`Skipping comment ${element.id}: Missing user data`);
                        return null;
                    }

                    const repliesResponse = await AuthorizedRequest.getRequest(`http://localhost:8080/api/comment/get-replies/${element.id}`);
                    const replies = Array.isArray(repliesResponse?.data) ? repliesResponse.data : [];

                    return {
                        id: element.id,
                        author: `${element.user.firstname} ${element.user.lastname}`,
                        content: element.content || "",
                        timestamp: element.createdAt || new Date().toISOString(),
                        replies: replies.map((value) => ({
                            id: value.id,
                            author: value.user?.firstname && value.user?.lastname 
                                ? `${value.user.firstname} ${value.user.lastname}`
                                : "Unknown User",
                            content: value.content || "",
                            timestamp: value.createdAt || new Date().toISOString()
                        }))
                    };
                }));

                setComments(commentsData);
            } catch (error) {

                console.error("Error refreshing complaints:", error);
            }
        } catch (error) {
            
            console.error("Error submitting complaint:", error);
        }
    };


    return (
        <div style={{
            backgroundColor: darkMode ? "#1c1c1c" : "#F8F5DE",
            color: darkMode ? "#fff" : "#000",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column"
        }}>
            <Header darkMode={darkMode} setDarkMode={setDarkMode} />

            <div style={{ padding: "2rem 1rem" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
                    <button
                        onClick={() => setShowComplaintForm(!showComplaintForm)}
                        style={{
                            padding: "0.8rem 2rem",
                            backgroundColor: darkMode ? "#333" : "#7A0000",
                            color: "#fff",
                            border: "none",
                            borderRadius: "20px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            fontSize: "1rem",
                            transition: "background 0.3s",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = darkMode ? "#555" : "#990000"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = darkMode ? "#333" : "#7A0000"}
                    >
                        {showComplaintForm ? "Cancel" : "Write a Complaint"}
                    </button>
                </div>

                {showComplaintForm && (
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
                        <form onSubmit={handleSubmitComplaint} style={{ width: "100%", maxWidth: "600px" }}>
                            <textarea
                                value={complaintText}
                                onChange={(e) => setComplaintText(e.target.value)}
                                placeholder="Enter your complaint here"
                                style={{
                                    width: "100%",
                                    minHeight: "100px",
                                    padding: "0.75rem",
                                    fontSize: "1rem",
                                    borderRadius: "8px",
                                    border: "1px solid #ccc",
                                    backgroundColor: darkMode ? "#444" : "#fff",
                                    color: darkMode ? "#fff" : "#000",
                                    marginBottom: "1rem",
                                }}
                            />
                            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                                <button
                                    type="submit"
                                    style={{
                                        padding: "0.6rem 1.5rem",
                                        backgroundColor: darkMode ? "#333" : "#7A0000",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "20px",
                                        cursor: "pointer",
                                        fontWeight: "bold",
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = darkMode ? "#555" : "#990000"}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = darkMode ? "#333" : "#7A0000"}
                                >
                                    Submit Complaint
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowComplaintForm(false);
                                        setComplaintText("");
                                    }}
                                    style={{
                                        padding: "0.6rem 1.5rem",
                                        backgroundColor: darkMode ? "#555" : "#ccc",
                                        color: darkMode ? "#fff" : "#000",
                                        border: "none",
                                        borderRadius: "20px",
                                        cursor: "pointer",
                                        fontWeight: "bold",
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = darkMode ? "#777" : "#bbb"}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = darkMode ? "#555" : "#ccc"}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="flex-grow flex justify-center items-start px-4 pb-12">
                    <div
                        className={`w-full max-w-2xl ${
                            darkMode ? "bg-gray-800" : "bg-white"
                        } rounded-lg p-8 shadow-lg`}
                    >
                        {loading ? (
                            <div>Loading complaints...</div>
                        ) : comments.length === 0 ? (
                            <div>No complaints found</div>
                        ) : (
                            <div className="space-y-8">
                                <CommentSection
                                    comments={comments}
                                    darkMode={darkMode}
                                    onReply={handleReply}
                                    activeReplyId={activeReplyId}
                                    onSubmitReply={handleSubmitReply}
                                    onCancelReply={handleCancelReply}
                                    noStar={true}
                                    title={"Complaints From Customers"}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer darkMode={darkMode} />
        </div>
    );
}