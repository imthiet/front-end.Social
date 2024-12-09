import React, { useState, useEffect } from 'react';
import Post from './post';
import './Newsfeed.css';
import Navbar from '../Navbar/Navbar';

// Import hàm showAlert từ notice.js
import '../notice/notice.css';  // Đảm bảo rằng đường dẫn đúng
import { showAlert } from '../notice/notice.js';  // Đảm bảo rằng đường dẫn đúng

function Newsfeed() {
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showCreatePost, setShowCreatePost] = useState(false); // Hiển thị form tạo post

    const fetchPosts = async (page) => {
        setIsLoading(true); // Use the setter function
        try {
            const response = await fetch(`http://localhost:8080/post/postByFriend?page=${page}&size=4`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
                credentials: 'include',
            });
            const data = await response.json();
            if (data.length > 0) {
                setPosts((prev) => {
                    const combinedPosts = [...prev, ...data];
                    const uniquePosts = combinedPosts.reduce((acc, post) => {
                        if (!acc.find(p => p.id === post.id)) {
                            acc.push(post);
                        }
                        return acc;
                    }, []);
                    return uniquePosts;
                }); // Add new posts to the list, filtering out duplicates
            } else {
                setHasMore(false); // No more posts to load
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setIsLoading(false); // Set loading to false when done
        }
    };
    

    // Gọi API để lấy thông báo khi page thay đổi
    useEffect(() => {
        if (hasMore) {
            fetchPosts(page);
        }
    }, [page]);

    // Xử lý sự kiện cuộn xuống
    const handleScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop + 1 >=
            document.documentElement.scrollHeight
        ) {
            if (!isLoading && hasMore) {
                setPage((prevPage) => prevPage + 1); // Tăng số trang để tải thêm
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
                showAlert(data.message); 
                setPosts((prevPosts) => [
                    {
                       
                        content,
                        image: URL.createObjectURL(file),
                        createdBy: 'Bạn', 
                        createdAt: new Date().toISOString(),
                        likesCount: 0,
                        comments: [],
                    },
                    ...prevPosts,
                ]);
                setShowCreatePost(false); 
            } else {
                showAlert(data.message);
            }
        } catch (error) {
            console.error('Error creating post:', error);
            showAlert('An error occurred while creating the post.'); // Thay vì alert
        }
    };
    
   // Các phần còn lại không thay đổi

    return (
        <div className='main-container'>
            <Navbar />
            
            {/* Thêm thẻ thông báo */}
            <div id="notification" className="notification hidden" >
                <span id="notification-message"></span>
            </div>

            <div className="createPost-container">
                <button className='open-btn' onClick={() => setShowCreatePost((prev) => !prev)}>
                    {showCreatePost ? 'Đóng' : 'Thêm bài viết mới'}
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!content.trim()) {
            showAlert('Nội dung không được để trống.'); // Thay vì alert
            return;
        }
        onCreatePost(content, file);
    };

    const handleClear = () => {
        setContent(''); // Xóa nội dung trong textarea
        setFile(null);  // Xóa file đã chọn
    };

    return (
        <form className="createPost-box" onSubmit={handleSubmit}>
            <textarea
                placeholder="Bạn đang nghĩ gì?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="4"
            ></textarea>
            <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
            />
            <div className="button-group">
                <button type="submit">Post It!!</button>
                <button type="button" onClick={handleClear}>Clear All</button>
            </div>
        </form>
    );
}

export default Newsfeed;
