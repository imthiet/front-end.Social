import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    const [showDropdown, setShowDropdown] = useState(false);
    const [hasNewNotification, setHasNewNotification] = useState(false);
    const [username, setUsername] = useState('');
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    const navigate = useNavigate(); // Use navigate at the top level

    useEffect(() => {
        // Get username from localStorage
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }

        const checkForNotifications = () => {
            // Uncomment when API is available
            // fetch('/api/notifications/unread')
            //     .then((response) => response.json())
            //     .then((notifications) => {
            //         setHasNewNotification(notifications.length > 0);
            //     })
            //     .catch((error) => console.error('Error fetching notifications:', error));
        };

        const intervalId = setInterval(checkForNotifications, 3000);

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);

    const toggleDropdown = (e) => {
        e.stopPropagation();
        setShowDropdown(!showDropdown);
    };

    const handleLogout = (e) => {
        if (!window.confirm("Are you sure you want to logout?")) {
            e.preventDefault();
            return;
        }

        fetch('/users/logout', { method: 'GET' }) // API call to logout
            .then((response) => {
                if (response.ok) {
                    localStorage.removeItem('username'); // Clear username
                    localStorage.removeItem('auth'); // Clear auth
                    localStorage.removeItem('isAdmin');
                    navigate('/'); // Redirect to login
                } else {
                    console.error('Failed to logout:', response.status);
                }
            })
            .catch((error) => console.error('Error during logout:', error));
    };

    const handleClickOutside = (e) => {
        if (!e.target.closest('.header-username')) {
            setShowDropdown(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <header className="header-container">
            <div className="header-icons">
                <Link to="/newsfeed" className="icon">
                    <img src={require('../../assets/images/home.png')} alt="Home" />
                </Link>
                <Link to="/messages" className="icon">
                    <img src={require('../../assets/images/message.png')} alt="Messages" />
                </Link>
                <Link to="/noti" className="icon">
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

                <Link to="/newfeed" className="logo">
                    <img src={require('../../assets/images/logo.png')} alt="Search" />
                </Link>
               
            </div>
            <div className="header-username" onClick={toggleDropdown}>
                <img src={require('../../assets/images/card.png')} alt="User Avatar" className="avatar-img" />
                <span>{username}</span>
                <div className={`dropdown-content ${showDropdown ? 'show' : ''}`}>
                    <Link to="/profile">Profile</Link>
                    <Link to="/Edit_profile">Edit Profile</Link>
                    {isAdmin && <Link to="/Manage_web">Manage Web</Link>} {/* Hiển thị nếu là Admin */}
                    <a onClick={handleLogout}>Logout</a>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
