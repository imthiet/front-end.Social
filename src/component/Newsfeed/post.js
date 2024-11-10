import React from 'react';
import './post.css';

function Post({ id, title, content, image, createdBy, createdAt }) {
    return (
        <div className="post-container">
       
        <h4>{content}</h4>
        {image && <img src={`data:image/png;base64,${image}`} alt="Post Image"  className="post-image"/>}
        <p className='author'>By: {createdBy} on {new Date(createdAt).toLocaleString()}</p>
    </div>
    );
}

export default Post;
