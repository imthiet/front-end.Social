import React, { useState, useEffect } from 'react';
import Post from './post';
import './Newsfeed.css';

function Newsfeed() {
    const [posts, setPosts] = useState([]);

    // Time conversion function
    function timeAgo(timestamp) {
        const currentTime = new Date();
        const notiTime = new Date(timestamp);  // Convert the timestamp string to a Date object
        const diff = currentTime - notiTime;
    
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
    
        if (days > 1) {
            return days + " days ago";
        } else if (days === 1) {
            return "1 day ago";
        } else if (hours > 1) {
            return hours + " hours ago";
        } else if (hours === 1) {
            return "1 hour ago";
        } else if (minutes > 1) {
            return minutes + " minutes ago";
        } else if (minutes === 1) {
            return "1 minute ago";
        } else {
            return "just now";
        }
    }
    

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
                    createdAt={post.createdAt} // Convert createdAt to relative time
                />
            ))}
        </div>
    );
}

export default Newsfeed;
