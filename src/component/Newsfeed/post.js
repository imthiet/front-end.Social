import React, { useState, useEffect } from 'react';
import './post.css';

function Post({ id, content, image, createdBy, createdAt, likesCount, comments, liked }) {
    const [isLiked, setIsLiked] = useState(liked);
    const [likeCount, setLikeCount] = useState(likesCount);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState(""); // State for new comment
    const [error, setError] = useState(null);
    const [commentsList, setCommentsList] = useState(comments ? comments.content : []); // State for comments list

    useEffect(() => {
        setIsLiked(liked);
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

    return (
        <div className="post-container">
            <h4>{content}</h4>
            {image && <img src={`data:image/png;base64,${image}`} alt="Post" className="post-image" />}
            <p className='author'>By: {createdBy} on {new Date(createdAt).toLocaleString()}</p>

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
                    onClick={toggleComments} 
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
        </div>
    );
}

export default Post;
