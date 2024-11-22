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
     const handleFriendRequest = async (friendUsername) => {
        try {
          // Gửi yêu cầu API
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
            // Cập nhật trạng thái để nút thay đổi ngay lập tức
            setFriendStatus((prevStatus) => ({
              ...prevStatus,
              friendPending: true,
              friendRequestReceiver: true // Hiển thị "Friend Request Sent"
            }));
            alert(data.message); // Hiển thị thông báo
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
      
          if (response.ok) {
            // Cập nhật trạng thái ngay lập tức sau khi chấp nhận kết bạn thành công
            setFriendStatus((prevStatus) => ({
              ...prevStatus,
              friend: true, // Cập nhật trạng thái bạn bè thành true
              friendPending: false, // Xóa trạng thái đang chờ (nếu có)
              friendRequestReceiver: false, // Xóa trạng thái nhận yêu cầu kết bạn (nếu có)
            }));
          } else {
            console.error("Failed to accept friend request.");
          }
        } catch (error) {
          console.error("Error accepting friend request:", error);
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
            setFriendStatus({
                friend: userData.friend,
                friendPending: userData.friendPending,
                friendRequestReceiver: userData.friendRequestReceiver,
            });
            setUserProfile(userData);
    
          
    
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
                    {friendStatus.friend ? 

                    ( <button className="btn-friend">Friends</button>) 

                    :friendStatus.friendPending && !friendStatus.friendRequestReceiver ?

                    (<button className='btn-accept' onClick={() => handleAcceptFriend(userProfile.username)}> Accept </button>)        

                    : friendStatus.friendPending ?

                     (<button className="btn-pending">Friend Request Sent</button>) 

                  

                     :
                     (
                        <button
                            className="add-friend"
                            onClick={() => handleFriendRequest(userProfile.username)}
                        >
                            Add Friend
                        </button>
                    )}
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
