import React, { useState } from 'react';
import './post.css';

function Post({ id, content, image, createdBy, createdAt, likesCount, comments }) {
    const [showComments, setShowComments] = useState(false);

    const toggleComments = () => {
        setShowComments(!showComments);
    };

    return (
        <div className="post-container">
            <h4>{content}</h4>
            {image && <img src={`data:image/png;base64,${image}`} alt="Post Image" className="post-image" />}
            <p className='author'>By: {createdBy} on {new Date(createdAt).toLocaleString()}</p>

            <div className="post-icons">
                <div className="like-section">
                    <img src={require('../../assets/images/like.png')} alt="Like" className="icon" />
                    <span>{likesCount}</span>
                </div>
                <img 
                    src={require('../../assets/images/cmt.png')} 
                    alt="Comment" 
                    className="icon" 
                    style={{ marginLeft: 8 }} 
                    onClick={toggleComments} 
                />
            </div>

            {/* Phần hiển thị bình luận */}
            {showComments && (
                <div className="comments-section">
                    {comments.map((comment, index) => (
                        <div key={index} className="comment">
                            <p><strong>{comment.username}</strong>: {comment.content}</p>
                            {comment.image && (
                                <img src={`data:image/png;base64,${comment.image}`} alt="Comment" className="comment-image" />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Post;
