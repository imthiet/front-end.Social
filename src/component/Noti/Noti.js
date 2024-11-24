import React, { useEffect, useState } from "react";
import Navbar from '../Navbar/Navbar';
function Noti() {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch all notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/notifications", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include", // Include cookies for authentication
                });

                if (response.ok) {
                    const data = await response.json();
                    setNotifications(data);
                } else {
                    console.error("Failed to fetch notifications");
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    if (isLoading) {
        return <div className="loader"></div>;
    }

    if (notifications.length === 0) {
        return <div>No notifications found.</div>;
    }

    return (
        <div>
            <Navbar/>
      
        <div className="noti-container" style={{ padding: "20px", fontFamily: "Arial, sans-serif", paddingTop: "65px",width: "85%", margin: "0 auto" }}>
           
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
                        }}
                    >
                        <p style={{ margin: "5px 0", fontWeight: "bold" }}>
                            {notification.contentnoti}
                        </p>
                        <p style={{ margin: "5px 0", color: "#555" }}>
                            <strong>From:</strong> {notification.sender_username}
                        </p>
                        <p style={{ margin: "5px 0", color: "#888", fontSize: "0.9em" }}>
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
                            {notification.type || "General"}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
        </div>
    );
}

export default Noti;
