import React, { useState, useEffect } from 'react';
import './Profile.css';
import Navbar from '../Navbar/Navbar';
import Post from './User_post';

function Profile() {
    const [userProfile, setUserProfile] = useState(null);
    const [friends, setFriends] = useState([]);
    const [posts, setPosts] = useState([]); 
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(3); // Số lượng bạn bè trên mỗi trang
    
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadMessage, setUploadMessage] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const [userResponse, friendsResponse, postsResponse] = await Promise.all([
                    fetch('http://localhost:8080/api/profile/main', {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                    }),
                    fetch('http://localhost:8080/api/profile/fr', {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                    }),
                    fetch('http://localhost:8080/api/profile/post', {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                    }),
                ]);
    
                const userData = await userResponse.json();
                const friendsData = await friendsResponse.json();
                const postsData = await postsResponse.json();
    
                setUserProfile(userData);
                setFriends(friendsData);
                setPosts(Array.isArray(postsData) ? postsData : []);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };
  
        
        fetchUserData();
    }, []);
    const previousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    
    const nextPage = () => {
        if (currentPage < Math.ceil(friends.length / pageSize)) {
            setCurrentPage(currentPage + 1);
        }
    };
    
    const paginatedFriends = friends.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleAvatarUpload = async () => {
        if (!selectedFile) {
            setUploadMessage("Please select a file");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await fetch(`http://localhost:8080/api/profile/avatar`, {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            if (response.ok) {
                setUploadMessage("Avatar updated successfully!");
                // Re-fetch user data to update avatar
                const updatedUserResponse = await fetch('http://localhost:8080/api/profile/main', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                const updatedUserData = await updatedUserResponse.json();
                setUserProfile(updatedUserData);
            } else {
                const errorData = await response.text();
                setUploadMessage(`Error: ${errorData}`);
            }
        } catch (error) {
            console.error("Error uploading avatar:", error);
            setUploadMessage("Failed to upload avatar");
        }
    };

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

                    <div className="profile-avatar-upload">
                        <label htmlFor="file-upload">Choose Avatar</label>
                        <input 
                            id="file-upload" 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                        />
                        <button className = "add-friend" onClick={handleAvatarUpload}>Submit</button>
                        {uploadMessage && <p>{uploadMessage}</p>}
                    </div>

                </div>


                <div className="friends-list">
    <h3>Your Friends</h3>
    {friends.length === 0 ? (
        <p>No friends yet</p>
    ) : (
        <>
            <ul>
                {paginatedFriends.map((friend) => (
                    <li key={friend.id}>
                        <span>{friend.username}</span> - <span>{friend.email}</span>
                    </li>
                ))}
            </ul>
            <div className="pagination">
                <button
                    onClick={previousPage}
                    disabled={currentPage === 1}
                >
                    &lt; Previous
                </button>
                <span> Page {currentPage} of {Math.ceil(friends.length / pageSize)} </span>
                <button
                    onClick={nextPage}
                    disabled={currentPage === Math.ceil(friends.length / pageSize)}
                >
                    Next &gt;
                </button>
            </div>
        </>
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
