import React, { useState, useEffect } from 'react';
import './Profile.css';
import Navbar from '../Navbar/Navbar';
import Post from './User_post';

function Profile() {
    const [userProfile, setUserProfile] = useState(null);
    const [friends, setFriends] = useState([]);
    const [posts, setPosts] = useState([]); // Initialize posts as an empty array
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Fetch thông tin người dùng
                const userResponse = await fetch('http://localhost:8080/api/profile/main', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                const userData = await userResponse.json();
                setUserProfile(userData);

                // Fetch danh sách bạn bè
                const friendsResponse = await fetch('http://localhost:8080/api/profile/fr', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                const friendsData = await friendsResponse.json();
                setFriends(friendsData);

                // Fetch posts
                const postsResponse = await fetch('http://localhost:8080/api/profile/post', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                const postsData = await postsResponse.json();
                setPosts(Array.isArray(postsData) ? postsData : []); // Ensure posts is always an array
            } catch (error) {
                console.error('Lỗi khi tải dữ liệu:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (isLoading) {
        return <div className="loader">Loading...</div>;
    }

    if (!userProfile) {
        return <div>Không thể tải dữ liệu người dùng.</div>;
    }

    return (
        <div className='profile_main-container'>
             <Navbar />
        <div className="profile-container">
           
            <div className="profile-header">
                <h1>{userProfile.username}</h1>
                <p>{userProfile.email}</p>
                {userProfile.image ? (
                    <img
                        src={`data:image/jpeg;base64,${userProfile.image}`}
                        alt="User Avatar"
                        className="profile-image"
                    />
                ) : (
                    <div className="default-avatar">No Image</div>
                )}
            </div>

            <div className="friend-status">
                <h3>Friend Status</h3>
                <p>
                    {userProfile.friend
                        ? 'Friend'
                        : userProfile.friendPending
                        ? 'Friend Request Sent'
                        : 'Not Friends'}
                </p>
            </div>

            <div className="friends-list">
                <h3>Your Friends</h3>
                {friends.length === 0 ? (
                    <p>No friends yet</p>
                ) : (
                    <ul>
                        {friends.map((friend) => (
                            <li key={friend.id}>
                                <span>{friend.username}</span> - <span>{friend.email}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>

        <div className="posts-list">
                <h3>Your Posts</h3>
                {posts.length === 0 ? (
                    <p>No posts yet</p>
                ) : (
                    posts.map((post) => (
                        <Post
                            key={post.id}
                            id={post.id}
                            content={post.content}
                            image={post.image}
                            createdBy={post.createdBy}
                            createdAt={post.createdAt}
                            likesCount={post.likesCount}
                            comments={post.comments}
                            liked={post.liked}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default Profile;
