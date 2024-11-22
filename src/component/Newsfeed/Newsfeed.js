import React, { useState, useEffect } from 'react';
import Post from './post';
import './Newsfeed.css';
import Navbar from '../Navbar/Navbar';

function Newsfeed() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null);
    const [showCreatePost, setShowCreatePost] = useState(false); // Hiển thị form tạo post

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
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, []);

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
                alert(data.message);
                // Cập nhật danh sách bài viết
                setPosts((prevPosts) => [
                    {
                        id: Math.random(), // Tạo ID tạm thời
                        content,
                        image: URL.createObjectURL(file), // Hiển thị ảnh ngay lập tức
                        createdBy: 'Bạn', // Giả định người tạo là chính mình
                        createdAt: new Date().toISOString(),
                        likesCount: 0,
                        comments: [],
                    },
                    ...prevPosts,
                ]);
                setShowCreatePost(false); // Ẩn form sau khi tạo xong
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error creating post:', error);
            alert('An error occurred while creating the post.');
        }
    };
    
  


    return (
        <div className='main-container'>
            <Navbar />
            <div className="createPost-container">
                <button className = 'open-btn' onClick={() => setShowCreatePost((prev) => !prev)}>
                    {showCreatePost ? 'Đóng' : 'Thêm bài viết mới'}
                </button>
                {showCreatePost && (
                    <CreatePost onCreatePost={handleCreatePost} />
                )}
            </div>
            <div className="newsfeed-container">
                {isLoading ? (
                    <div className="loader"></div>
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
                            liked={post.liked}
                        />
                    ))
                )}
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
            alert('Nội dung không được để trống.');
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
