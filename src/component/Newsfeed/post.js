import React, { useState, useEffect } from 'react';
import './post.css';
import timeAgo from '../../Ago';

function Post({ id, content, image, createdBy, createdAt, likesCount, comments, liked }) {
    const [isLiked, setIsLiked] = useState(liked);
    const [likeCount, setLikeCount] = useState(likesCount);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState(""); // State for new comment
    const [error, setError] = useState(null);
    const [commentsList, setCommentsList] = useState(comments ? comments.content : []); // State for comments list
    
    const [showDropdown, setShowDropdown] = useState(false);
    const [showReportForm, setShowReportForm] = useState(false); // Hiển thị form báo cáo
    const [reportReason, setReportReason] = useState(""); // Lý do báo cáo
    const [reportError, setReportError] = useState(null); // Lỗi khi gửi báo cáo

    useEffect(() => {
        setIsLiked(liked);
        const handleClickOutside = (event) => {
            if (!event.target.closest(".dropdown-container")) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [liked]);

    const toggleLike = async () => {
        try {
            const response = await fetch(`http://localhost:8080/post/like?postId=${id}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setIsLiked(data.isLiked);
                setLikeCount(data.likeCounts);
            } else {
                console.error('Error updating like status');
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const toggleComments = () => {
        setShowComments(!showComments);
    };
    const toggleDropdown = () => {
        setShowDropdown((prev) => !prev);
    };

    const toggleReportForm = () => {
        setShowReportForm(true); // Hiển thị form báo cáo
        setShowDropdown(false); // Đóng dropdown
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) {
            setError("Comment cannot be empty");
            return;
        }
        try {
            const response = await fetch(`http://localhost:8080/comments/add`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    postId: id,
                    content: newComment,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const newCommentData = { username: "YourUsername", content: newComment }; // Adjust with your user's username or get it from response

                // Add the new comment to commentsList
                setCommentsList([newCommentData, ...commentsList]);
                setNewComment(""); // Clear input
                setError(null); // Clear error if any
            } else {
                const data = await response.json();
                setError(data.error || "Failed to add comment");
            }
        } catch (error) {
            const newCommentData = { username: "You", content: newComment }; // Adjust with your user's username or get it from response
            setError("Adding comment done!");
            setCommentsList([newCommentData, ...commentsList]);
            setNewComment(""); // Clear input
        }
    };
    const handleReportSubmit = async () => {
        if (!reportReason.trim()) {
            setReportError("Reason cannot be empty.");
            return;
        }
        console.log(reportReason, id, localStorage.getItem('userId'));
        try {
            const userId = localStorage.getItem('userId'); // Lấy userId từ localStorage
            const response = await fetch(`http://localhost:8080/api/reports/report`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    postId: id,
                    reason: reportReason,
                    reportedBy: userId,
                }),
            });
    
            if (response.ok) {
                alert("Report submitted successfully.");
                setShowReportForm(false); // Ẩn form
                setReportReason(""); // Reset lý do
                setReportError(null);
            } else {
                const data = await response.json();
                setReportError(data.error || "Failed to submit report.");
            }
        } catch (error) {
            setReportError("Error submitting the report.");
        }
    };
    

    return (
        <div className="post-container">
            <p className='post-content'>{content}</p>
            <div className="dropdown-container">
                <button className="dropdown-toggle" onClick={toggleDropdown}>
                    ⋮
                </button>
                <ul className={`dropdown-menu ${showDropdown ? "show" : ""}`}>
                <li onClick={toggleReportForm}>Report</li>
                </ul>
            </div>
            {image && <img src={`data:image/png;base64,${image}`} alt="Post" className="post-image" />}
            <p className="author">{createdBy} - {timeAgo(createdAt)}</p>
    
            <div className="post-icons">
                <div className="like-section" onClick={toggleLike}>
                    <img 
                        src={require(`../../assets/images/${isLiked ? 'heart.png' : 'like.png'}`)} 
                        alt="Like Icon" 
                        className="icon" 
                    />
                    <span>{likeCount}</span>
                </div>
                <img 
                    src={require('../../assets/images/cmt.png')} 
                    alt="Comment Icon" 
                    className="icon" 
                    style={{ marginLeft: 8 }} 
                    onClick={() => toggleComments()} 
                />
            </div>
    
            {/* Show comments */}
            {showComments && (
                <div className="comments-section">
                    {commentsList.length > 0 ? (
                        commentsList.map((comment, index) => (
                            <div key={index} className="comment">
                                <p><strong>{comment.username}</strong>: {comment.content}</p>
                                {comment.image && (
                                    <img src={`data:image/png;base64,${comment.image}`} alt="Comment" className="comment-image" />
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No comments available</p>
                    )}
                    
                    {/* Add comment section */}
                    <div className="add-comment">
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="comment-input"
                        />
                        <button onClick={handleAddComment} className="submit-comment">
                            Submit
                        </button>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                </div>
            )}

                {showReportForm && (
                                <div className="report-form">
                                    <textarea
                                        placeholder="Enter reason for reporting this post"
                                        value={reportReason}
                                        onChange={(e) => setReportReason(e.target.value)}
                                        className="report-textarea"
                                    ></textarea>
                                    <button  onClick={handleReportSubmit} className="submit-report">
                                        Submit Report
                                    </button>
                                    {reportError && <p className="error-message">{reportError}</p>}
                                </div>
                            )}
        </div>
    );
    
}

export default Post;