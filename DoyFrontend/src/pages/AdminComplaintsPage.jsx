import React, { useState, useEffect } from 'react';
import AdminNavbar from "../components/AdminNavbar";
import Footer from "../components/Footer";
import AuthorizedRequest from '../services/AuthorizedRequest';
import { CommentSection } from '../components/CommentSection';

export default function AdminCommentsPage({ darkMode, setDarkMode }) {
    const [activeReplyId, setActiveReplyId] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getComments = async () => {
            setLoading(true);
            const complaintsResponse = await AuthorizedRequest.getRequest(`http://localhost:8080/api/comment/get/complaints`);
                let commentsData = await Promise.all(complaintsResponse.data.map(async (element) => {

                    const repliesResponse = await AuthorizedRequest.getRequest(`http://localhost:8080/api/comment/get-replies/${element.id}`);
                    return {
                        id: element.id,
                    author: element.user.firstname + " " + element.user.lastname,
                    content: element.content,
                    timestamp: element.createdAt,
                    replies: repliesResponse.data.map((value) => {return {
                        id: value.id,
                        author: value.user.firstname + " " + value.user.lastname,
                        content: value.content,
                        timestamp: value.createdAt
                    }})
                    };
                }));

                setComments(commentsData);
                setLoading(false);
        };
        getComments();
    }, [activeReplyId]); 

    const handleReply = (commentId) => {
        setActiveReplyId(commentId);
    };

    const handleSubmitReply = async (commentId, replyText) => {

        const payload = {
                replyTo: commentId,
                content: replyText,
                userId: 1 //admin id
            };
            await AuthorizedRequest.postRequest("http://localhost:8080/api/comment/post-reply", payload);
            setActiveReplyId(null);
    };

    const handleCancelReply = () => {
        setActiveReplyId(null);
    };

    return (
        <div style={{
            backgroundColor: darkMode ? "#1c1c1c" : "#F8F5DE",
            color: darkMode ? "#fff" : "#000",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column"
        }}>
            <AdminNavbar darkMode={darkMode} setDarkMode={setDarkMode} />

            <div style={{ padding: "2rem 1rem" }}>
                <div className="flex-grow flex justify-center items-start px-4 pb-12">
                    <div
                        className={`w-full max-w-2xl ${
                            darkMode ? "bg-gray-800" : "bg-white"
                        } rounded-lg p-8 shadow-lg`}
                    >
                        {loading ? (
                            <div>Loading comments...</div>
                        ) : comments.length === 0 ? (
                            <div>No comments found</div>
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