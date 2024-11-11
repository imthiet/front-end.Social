import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    const [showDropdown, setShowDropdown] = useState(false);
    const [hasNewNotification, setHasNewNotification] = useState(false);
    const [username, setUsername] = useState(''); // Thêm state để lưu tên người dùng

    useEffect(() => {
        // Lấy tên người dùng từ localStorage
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }

        const checkForNotifications = () => {
            // fetch('/api/notifications/unread')
            //     .then((response) => response.json())
            //     .then((notifications) => {
            //         setHasNewNotification(notifications.length > 0);
            //     })
            //     .catch((error) => console.error('Error fetching notifications:', error));
        };
        const intervalId = setInterval(checkForNotifications, 3000);

        return () => clearInterval(intervalId);
    }, []); // Chạy chỉ một lần khi component mount

    const toggleDropdown = (e) => {
        e.stopPropagation();
        setShowDropdown(!showDropdown);
    };

    const handleLogout = (e) => {
        if (!window.confirm("Are you sure you want to logout?")) {
            e.preventDefault();
        } else {
            localStorage.removeItem('username');  // Xóa tên người dùng khi đăng xuất
            localStorage.removeItem('auth');      // Xóa thông tin xác thực
        }
    };

    return (
        <header className="header-container">
            <div className="header-icons">
                <Link to="/newsfeed" className="icon">
                <img src={require('../../assets/images/home.png')} alt="Home" />
                </Link>
                <Link to="/messages" className="icon">
                <img src={require('../../assets/images/message.png')} alt="Search" />
                </Link>
                <Link to="/noti_list" className="icon">
                    <img
                        src={hasNewNotification ? require('../../assets/images/noti_new.png') : require('../../assets/images/noti.png')}
                        alt="Notifications"
                    />
                </Link>
                <Link to="/users" className="icon">
                <img src={require('../../assets/images/setting.png')} alt="Settings" />
                </Link>
                <Link to="/search_page" className="icon">
                <img src={require('../../assets/images/transparency.png')} alt="Search" />
                </Link>
            </div>

            <div className="header-username" onClick={toggleDropdown}>
                <img src="/Image/profile.png" alt="User Avatar" className="avatar-img" />
                <span>{username}</span> {/* Hiển thị tên người dùng */}
                {showDropdown && (
                    <div className="dropdown-content">
                        <Link to="/profile">Profile</Link>
                        <a href="/users/logout" onClick={handleLogout}>Logout</a>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Navbar;
