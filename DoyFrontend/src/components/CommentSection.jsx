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
import { useState } from "react";

const Button = ({ className, children, type = "button", disabled = false, ...props }) => {
    return (
      <button
        type={type}
        disabled={disabled}
        className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  };

const Textarea = ({ className, ...props }) => {
  return (
    <textarea
      className={`flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-input ${className}`}
      {...props}
    />
  );
};

const StarRating = ({ rating, darkMode }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating
                ? darkMode
                  ? "text-amber-400 fill-amber-400"
                  : "text-amber-500 fill-amber-500"
                : darkMode
                ? "text-gray-600"
                : "text-gray-300"
            }`}
            aria-label={`${star} yıldız`}
          />
        ))}
      </div>
    );
  };

const CommentSection = ({ title, comments, darkMode, onReply, _rating, activeReplyId, onSubmitReply, onCancelReply }) => {
  return (
    <div className="space-y-4">
      <h2
        className={`text-lg font-semibold border-b pb-2 mb-4 ${
          darkMode ? "border-gray-700 text-amber-400" : "border-gray-300 text-amber-700"
        }`}
      >
        {title}
      </h2>
      <div className="mt-1">
        <StarRating rating={_rating} darkMode={darkMode} />
      </div>
      {comments.map((comment) => (
        <div key={comment.id}>
          <Comment comment={comment} darkMode={darkMode} onReply={onReply} />
          
          {comment.replies && (
            <div className="mt-2 space-y-2">
              {comment.replies.map((reply) => (
                <Comment key={reply.id} comment={reply} isReply={true} darkMode={darkMode} onReply={onReply} />
              ))}
            </div>
          )}
          {activeReplyId === comment.id && (
            <ReplyBox
              commentId={comment.id}
              onSubmit={onSubmitReply}
              onCancel={onCancelReply}
              darkMode={darkMode}
            />
          )}
        </div>
      ))}
    </div>
  );
};

const Comment = ({ comment, isReply = false, darkMode, onReply }) => {
    return (
      <div
        className={`flex gap-4 p-4 rounded-md ${
          isReply
            ? darkMode
              ? "bg-gray-700"
              : "bg-amber-50"
            : darkMode
            ? "bg-gray-600"
            : "bg-white"
        } ${isReply ? "ml-8 border-l-2 border-amber-300" : "shadow-sm"} transition-colors duration-200`}
      >
        <div className="flex-shrink-0">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              darkMode ? "bg-gray-500 text-gray-200" : "bg-amber-200 text-amber-800"
            }`}
          >
            {comment.author[0]?.toUpperCase()}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className={`font-semibold ${darkMode ? "text-amber-300" : "text-amber-800"}`}>
              {comment.author}
            </div>
            <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              {comment.timestamp}
            </div>
          </div>
          <p className={`mt-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>{comment.content}</p>
          {!isReply && (
            <div className="mt-2">
              <Button
                onClick={() => onReply(comment.id)}
                className={`text-sm ${
                  darkMode
                    ? "text-amber-400 hover:text-amber-300"
                    : "text-amber-600 hover:text-amber-700"
                }`}
              >
                <MessageSquare className="w-4 h-4 mr-1" /> Reply
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  const ReplyBox = ({ commentId, onSubmit, onCancel, darkMode }) => {
    const [replyText, setReplyText] = useState("");
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (replyText.trim()) {
        onSubmit(commentId, replyText);
        setReplyText("");
      }
    };
  
    const getInputClassName = (darkMode) =>
      `${
        darkMode
          ? "bg-gray-700 border-gray-600 focus:border-amber-400 text-white"
          : "bg-amber-50 border-amber-100 focus:border-amber-300"
      } focus:ring-amber-200 transition-all duration-200`;
  
    return (
      <div className="mt-2 ml-8 p-4 rounded-md bg-transparent">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write your reply..."
            className={getInputClassName(darkMode)}
            rows={3}
          />
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={!replyText.trim()}
              className={`${
                darkMode
                  ? "bg-amber-500 hover:bg-amber-600 text-gray-900"
                  : "bg-amber-300 hover:bg-amber-400 text-amber-800"
              } px-4 py-2 text-sm font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:bg-opacity-70 disabled:scale-100 flex items-center gap-1`}
            >
              <Send className="w-4 h-4" /> Submit
            </Button>
            <Button
              type="button"
              onClick={onCancel}
              className={`${
                darkMode
                  ? "bg-gray-600 hover:bg-gray-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              } px-4 py-2 text-sm font-medium transition-all duration-200 transform hover:scale-[1.02]`}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    );
  };

export {CommentSection}