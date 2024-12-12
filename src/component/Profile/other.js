import React, { useState, useEffect } from "react";
import "./User_post.css";
import '../notice/notice.css';  // Đảm bảo rằng đường dẫn đúng
import { showAlert } from '../notice/notice.js';  // Đảm bảo rằng đường dẫn đúng

function Post({ id, content, image, createdBy, createdAt, likesCount, comments, liked, onDelete, onEdit }) {
    const [isLiked, setIsLiked] = useState(liked);
    const [likeCount, setLikeCount] = useState(likesCount);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [error, setError] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [commentsList, setCommentsList] = useState(comments ? comments.content : []);
    const [showEditModal, setShowEditModal] = useState(false);
    const [updatedContent, setUpdatedContent] = useState(content);

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

    const toggleEditModal = () => {
        setShowEditModal(!showEditModal);
    };

    // Hàm xử lý xóa bài viết
    const handleDeletePost = async () => {
        try {
            const response = await fetch(`http://localhost:8080/post/delete/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                showAlert(data.message);

                // Gọi callback onDelete để cập nhật danh sách
                if (typeof onDelete === "function") {
                    onDelete(id);
                }
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Failed to delete post");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            showAlert("Done!");
            onDelete(id);
        }
    };

    const toggleDropdown = () => {
        setShowDropdown((prev) => !prev);
    };

    const toggleLike = async () => {
        try {
            const response = await fetch(`http://localhost:8080/post/like?postId=${id}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                setIsLiked(data.isLiked);
                setLikeCount(data.likeCounts);
            } else {
                console.error("Error updating like status");
            }
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    const toggleComments = () => {
        setShowComments(!showComments);
    };
    const handleEditPost = async () => {
        try {
            const response = await fetch(`http://localhost:8080/post/update/${id}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content: updatedContent }),
            });
    
            if (response.ok) {
                const updatedPost = await response.json();
                showAlert("Post updated successfully!");
    
                // Gọi callback để cập nhật danh sách bài viết
                if (typeof onEdit === "function") {
                    onEdit(id, updatedPost);
                }
    
                toggleEditModal(); // Đóng modal chỉnh sửa
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Failed to update post");
            }
        } catch (error) {
            console.error("Error updating post:", error);
            alert("Done!");
            toggleEditModal();
           
        }
    };
    
    
    const handleAddComment = async () => {
        if (!newComment.trim()) {
            setError("Comment cannot be empty");
            return;
        }
        try {
            const response = await fetch(`http://localhost:8080/comments/add`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    postId: id,
                    content: newComment,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const newCommentData = { username: "YourUsername", content: newComment };

                setCommentsList([newCommentData, ...commentsList]);
                setNewComment("");
                setError(null);
            } else {
                const data = await response.json();
                setError(data.error || "Failed to add comment");
            }
        } catch (error) {
            console.error("Error adding comment:", error);
            setError("An error occurred while adding the comment");
        }
    };

    return (
        <div className="post-container">
            <p className="post-content">{content}</p>
            <div className="dropdown-container">
                <button className="dropdown-toggle" onClick={toggleDropdown}>
                    ⋮
                </button>
                <ul className={`dropdown-menu ${showDropdown ? "show" : ""}`}>
                    <li>Report</li>
                    
                </ul>
            </div>

            {image && <img src={`data:image/png;base64,${image}`} alt="Post" className="post-image" />}
            <p className="author">
                on {new Date(createdAt).toLocaleString()}
            </p>

            <div className="post-icons">
                <div className="like-section" onClick={toggleLike}>
                    <img
                        src={require(`../../assets/images/${isLiked ? "heart.png" : "like.png"}`)}
                        alt="Like Icon"
                        className="icon"
                    />
                    <span>{likeCount}</span>
                </div>
                <img
                    src={require("../../assets/images/cmt.png")}
                    alt="Comment Icon"
                    className="icon"
                    style={{ marginLeft: 8 }}
                    onClick={toggleComments}
                />
            </div>

            {showComments && (
                <div className="comments-section">
                    {commentsList.length > 0 ? (
                        commentsList.map((comment, index) => (
                            <div key={index} className="comment">
                                <p>
                                    <strong>{comment.username}</strong>: {comment.content}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p>No comments available</p>
                    )}

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

       

        </div>
    );
}

export default Post;
