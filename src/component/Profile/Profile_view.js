import React, { useState, useEffect } from 'react';
import './Profile.css';
import Navbar from '../Navbar/Navbar';
import Post from './User_post';

import { useParams } from "react-router-dom";



function Profile_view() {
    const { username } = useParams(); // Lấy username từ URL
    const [userProfile, setUserProfile] = useState(null);
    const [friends, setFriends] = useState([]);
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [friendStatus, setFriendStatus] = useState({
        friend: false,
        friendPending: false,
        friendRequestReceiver: false,
    });
    
     // Hàm gửi yêu cầu kết bạn
  const handleAddFriend = async (friendUsername) => {
    try {
      const response = await fetch(
        `http://localhost:8080/add_friend?username=${encodeURIComponent(
          friendUsername
        )}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        setResults((prevResults) =>
          prevResults.map((user) =>
            user.username === friendUsername
              ? {
                  ...user,
                  friendPending: false,
                  friendRequestReceiver: true,
                }
              : user
          )
        );
      } else {
        alert(`Failed to send friend request: ${data.message}`);
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
      alert("An error occurred while sending the friend request.");
    }
  };
  const handleAcceptFriend = async (friendUsername) => {
    try {
      const response = await fetch(
        `http://localhost:8080/accept_friends?username=${encodeURIComponent(friendUsername)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
  
      const data = await response.json();
  
      if (response.ok) {
        alert(data.message);
        setResults((prevResults) =>
          prevResults.map((user) =>
            user.username === friendUsername
              ? {
                  ...user,
                  friendPending: false,
                  friend: true,
                }
              : user
          )
        );
      } else {
        alert(`Failed to accept friend request: ${data.error}`);
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
      alert("An error occurred while accepting the friend request.");
    }
  };
    useEffect(() => {
        const fetchUserData = async () => {
          try {
            // Fetch user profile
            const userResponse = await fetch(`http://localhost:8080/api/profile/${username}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            });
            const userData = await userResponse.json();
            setUserProfile(userData);
    
            // Fetch friends list
            const friendsResponse = await fetch(`http://localhost:8080/api/profile/${username}/friends`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            });
            const friendsData = await friendsResponse.json();
            setFriends(friendsData);
    
            // Fetch posts
            const postsResponse = await fetch(`http://localhost:8080/api/profile/${username}/posts`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            });
            const postsData = await postsResponse.json();
            setPosts(Array.isArray(postsData) ? postsData : []);
          } catch (error) {
            console.error("Error fetching data:", error);
          } finally {
            setIsLoading(false);
          }
        };
        fetchUserData();
    }, []);

 



    if (isLoading) {
        return <div className="loader"></div>;
    }

    if (!userProfile) {
        return <div>Unable to load user data.</div>;
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
                  
                    <h4>
                        {userProfile.friend
                            ? 'Friend'
                            : userProfile.friendPending
                            ? 'Friend Request Sent'
                            : 'Not Friends'}
                    </h4>
                    
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

export default Profile_view;
