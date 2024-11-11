import React, { useState, useEffect } from 'react';
import Post from './post';
import './Newsfeed.css';

function Newsfeed() {
    const [posts, setPosts] = useState([]);
    

   
    

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://localhost:8080/post/all', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="newsfeed-container">
            {posts.map(post => (
                <Post 
                    key={post.id}
                    id={post.id}
                    content={post.content}
                    image={post.image}
                    createdBy={post.createdBy}
                    createdAt={post.createdAt}
                    likesCount={post.likesCount}
                    comments={post.comments} // Convert createdAt to relative time
                />
            ))}
        </div>
    );
}

export default Newsfeed;
