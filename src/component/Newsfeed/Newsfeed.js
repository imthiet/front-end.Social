import React, { useState, useEffect } from 'react';
import Post from './post';
import './Newsfeed.css';
import Navbar from '../Navbar/Navbar';

function Newsfeed() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Loading state

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
            } finally {
                setIsLoading(false); // Stop loading spinner after data is fetched
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className='main-container'>
           <Navbar></Navbar>
       
        <div className="newsfeed-container">
            {isLoading ? (
                <div className="loader">
                   
                </div>
            ) : (
                posts.map(post => (
                    <Post 
                        key={post.id}
                        id={post.id}
                        content={post.content}
                        image={post.image}
                        createdBy={post.createdBy}
                        createdAt={post.createdAt}
                        likesCount={post.likesCount}
                        comments={post.comments}
                        liked={post.liked} // Pass 'isLiked' here
                    />
                ))
            )}
        </div>
        </div>
    );
}

export default Newsfeed;
