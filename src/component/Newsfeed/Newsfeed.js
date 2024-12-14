import React, { useState, useEffect } from 'react';
import Post from './post';
import './Newsfeed.css';
import Navbar from '../Navbar/Navbar';
import {  useNavigate } from 'react-router-dom';
// Import hàm showAlert từ notice.js
import '../notice/notice.css';  
import { showAlert } from '../notice/notice.js';  

function Newsfeed() {
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null); 
    const navigate = useNavigate();
    const [showCreatePost, setShowCreatePost] = useState(false); // Hiển thị form tạo post

    const fetchPosts = async (page) => {
        setIsLoading(true);
        try {
            let url = `http://localhost:8080/post/postByFriend?page=${page}&size=4`;
    
            // Kiểm tra nếu không còn dữ liệu từ bạn bè, chuyển sang API all
            if (!hasMore) {
                url = `http://localhost:8080/post/all?page=${page}&size=4`;
            }
    
            let response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
                credentials: 'include',
            });
            let data = await response.json();
    
            // Nếu fetch từ postByFriend mà không có dữ liệu, chuyển sang all
            if (data.length === 0 && hasMore) {
                url = `http://localhost:8080/post/all?page=${page}&size=4`;
                response = await fetch(url, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    method: 'GET',
                    credentials: 'include',
                });
                data = await response.json();
            }
    
            // Lọc bài viết chưa được like
            const filteredPosts = data.filter((post) => !post.liked);
    
            // Xử lý dữ liệu trả về
            if (filteredPosts.length > 0) {
                setPosts((prev) => {
                    const combinedPosts = [...prev, ...filteredPosts];
                    const uniquePosts = combinedPosts.reduce((acc, post) => {
                        if (!acc.find(p => p.id === post.id)) {
                            acc.push(post);
                        }
                        return acc;
                    }, []);
                    return uniquePosts;
                });
            } else {
                setHasMore(false); 
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setIsLoading(false);
        }
    };
    
    
    
    

    // Api call when page change
    useEffect(() => {
        if (hasMore) {
            fetchPosts(page);
        }
    }, [page]);

    // scrolldown event
    const handleScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop + 1 >=
            document.documentElement.scrollHeight
        ) {
            if (!isLoading && hasMore) {
                setPage((prevPage) => prevPage + 1); // Load thêm khi có bài
            } else if (!isLoading && !hasMore) {
                // end of friend p
                fetchPosts(page);
            }
        }
    };
    

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [isLoading, hasMore]);

    const handleCreatePost = async (content, file) => {
        try {
            const formData = new FormData();
            formData.append('content', content);
            formData.append('file', file);

            const response = await fetch('http://localhost:8080/post/create', {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            const data = await response.json();
            if (data.success) {
                showAlert(data.message, () => navigate('/profile'));
             
                setShowCreatePost(false); 
            } else {
                showAlert(data.message);
            }
        } catch (error) {
            console.error('Error creating post:', error);
            showAlert('An error occurred while creating the post.'); // Thay vì alert
        }
    };
    
  
    return (
        <div className='main-container'>
            <Navbar />
            
            {/* Thêm thẻ thông báo */}
            <div id="notification" className="notification hidden" >
                <span id="notification-message"></span>
            </div>

            <div className="createPost-container">
                <button className='open-btn' onClick={() => setShowCreatePost((prev) => !prev)}>
                    {showCreatePost ? 'Close' : 'Share your post'}
                </button>
                {showCreatePost && (
                    <CreatePost onCreatePost={handleCreatePost} />
                )}
            </div>
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
                        comments={post.comments}
                        liked={post.liked}
                    />
                ))}
                {isLoading && <div className="loader"></div>} {/* Loading spinner */}
                {!hasMore && <div className="no-more-posts">No more posts</div>}
            </div>
        </div>
    );
}

function CreatePost({ onCreatePost }) {
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null); 

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile) {
            setPreview(URL.createObjectURL(selectedFile)); // Tạo URL xem trước
        } else {
            setPreview(null);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!content.trim()) {
            showAlert('Content cannot be null!'); // Thay vì alert
            return;
        }
        onCreatePost(content, file);
    };

    const handleClear = () => {
        setContent('');
        setFile(null);
        setPreview(null); // Xóa URL xem trước
    };

    return (
        <form className="createPost-box" onSubmit={handleSubmit}>
            <textarea
                placeholder="What's in your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="4"
            ></textarea>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange} // Thay đổi sự kiện onChange
            />
            {preview && (
                <div className="image-preview">
                    <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                </div>
            )}
            <div className="button-group">
                <button type="submit">Post It!!</button>
                <button type="button" onClick={handleClear}>Clear All</button>
            </div>
        </form>
    );
}


export default Newsfeed;
