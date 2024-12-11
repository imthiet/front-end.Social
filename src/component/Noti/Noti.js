import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import './Noti.css';
import { useNavigate } from "react-router-dom";
import newimg from '../../assets/images/new.png';

function Noti() {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const navigate = useNavigate();
    const username_main = localStorage.getItem('username');

    const fetchNotifications = async (currentPage) => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `http://localhost:8080/api/notifications?page=${currentPage}&size=5`, // Gửi page và size lên server
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                }
            );

            if (response.ok) {
                const data = await response.json();
                if (data.length > 0) {
                    setNotifications((prev) => [...prev, ...data]); // Thêm thông báo mới vào danh sách
                } else {
                    setHasMore(false); // Không còn thông báo nào để tải thêm
                }
            } else {
                console.error("Failed to fetch notifications");
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Gọi API để lấy thông báo khi page thay đổi
    useEffect(() => {
        if (hasMore) {
            fetchNotifications(page);
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

    const handleNotiClick = (username) => {
        navigate(`/profile_view/${username}`);
    };

    const handleNotiMsgClick = () => {
        navigate(`/messages`);
    };

    return (
        <div>
            <Navbar />

            <div
                className="noti-container"
                style={{
                    padding: "20px",
                    fontFamily: "Arial, sans-serif",
                    paddingTop: "65px",
                    width: "85%",
                    margin: "0 auto",
                }}
            >
                <ul style={{ listStyleType: "none", padding: "0" }}>
                    {notifications.map((notification, index) => (
                        <li
                            key={index}
                            style={{
                                backgroundColor: notification.status === "unread" ? "#f9f9f9" : "#ffffff",
                                border: "1px solid #ddd",
                                borderRadius: "5px",
                                marginBottom: "10px",
                                padding: "10px",
                                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                                cursor: "pointer",
                            }}
                            onClick={() => {
                                if (notification.type === "ADD_FRIEND") {
                                    handleNotiClick(notification.sender_username);
                                } else if (notification.type === "LIKE_COMMENT_SHARE") {
                                    handleNotiClick(username_main);
                                } else {
                                    handleNotiMsgClick();
                                }
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center' }}> <p style={{ margin: "5px 0", fontWeight: "bold" }}> {notification.contentnoti} </p> {notification.status === "unread" && ( <img src={newimg} alt="Unread newimg" style={{ marginLeft: '10px', width: '20px', height: '20px' }} /> )} </div>
                            <p style={{ margin: "5px 0", color: "#555" }}>
                                <strong>From:</strong> {notification.sender_username}
                            </p>
                            <p
                                style={{
                                    margin: "5px 0",
                                    color: "#888",
                                    fontSize: "0.9em",
                                }}
                            >
                                {new Date(notification.timestamp).toLocaleString()}
                            </p>
                            <span
                                style={{
                                    display: "inline-block",
                                    marginTop: "5px",
                                    padding: "5px 10px",
                                    fontSize: "0.8em",
                                    backgroundColor:
                                        notification.type === "LIKE_COMMENT_SHARE"
                                            ? "#e1f5fe"
                                            : notification.type === "ADD_FRIEND"
                                            ? "#e8f5e9"
                                            : "#f3e5f5",
                                    color: "#555",
                                    borderRadius: "5px",
                                }}
                            >
                                {notification.type || "Message"}
                            </span>
                        </li>
                    ))}
                </ul>

                {isLoading && <div className="loader"></div>}
                {!hasMore && <p style={{ textAlign: "center", color: "#888" }}>No more notifications</p>}
            </div>
        </div>
    );
}

export default Noti;
