import React, { useState, useEffect } from 'react';
import './post.css';

function Post({ id, content, image, createdBy, createdAt, likesCount, comments, liked }) {
    const [isLiked, setIsLiked] = useState(liked);
    const [likeCount, setLikeCount] = useState(likesCount);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [commentsList, setCommentsList] = useState(comments ? comments.content : []);
    const [error, setError] = useState(null);

    const [showDropdown, setShowDropdown] = useState(false);
    const [showReportForm, setShowReportForm] = useState(false); // Hiển thị form báo cáo
    const [reportReason, setReportReason] = useState(""); // Lý do báo cáo
    const [reportError, setReportError] = useState(null); // Lỗi khi gửi báo cáo

    useEffect(() => {
        setIsLiked(liked);
        const handleClickOutside = (event) => {
            if (!event.target.closest(".dropdown-container")) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [liked]);

    const toggleDropdown = () => {
        setShowDropdown((prev) => !prev);
    };

    const toggleReportForm = () => {
        setShowReportForm(true); // Hiển thị form báo cáo
        setShowDropdown(false); // Đóng dropdown
    };

    const handleReportSubmit = async () => {
        if (!reportReason.trim()) {
            setReportError("Reason cannot be empty.");
            return;
        }
        console.log(reportReason, id, localStorage.getItem('userId'));
        try {
            const userId = localStorage.getItem('userId'); // Lấy userId từ localStorage
            const response = await fetch(`http://localhost:8080/api/reports/report`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    postId: id,
                    reason: reportReason,
                    reportedBy: userId,
                }),
            });
    
            if (response.ok) {
                alert("Report submitted successfully.");
                setShowReportForm(false); // Ẩn form
                setReportReason(""); // Reset lý do
                setReportError(null);
            } else {
                const data = await response.json();
                setReportError(data.error || "Failed to submit report.");
            }
        } catch (error) {
            setReportError("Error submitting the report.");
        }
    };
    
    return (
        <div className="post-container">
            <h4>{content}</h4>
            <div className="dropdown-container">
                <button className="dropdown-toggle" onClick={toggleDropdown}>
                    ⋮
                </button>
                <ul className={`dropdown-menu ${showDropdown ? "show" : ""}`}>
                    <li onClick={toggleReportForm}>Report</li>
                </ul>
            </div>
            {image && <img src={`data:image/png;base64,${image}`} alt="Post" className="post-image" />}
            <p className='author'>By: {createdBy} on {new Date(createdAt).toLocaleString()}</p>

            {/* Form báo cáo */}
            {showReportForm && (
                <div className="report-form">
                    <textarea
                        placeholder="Enter reason for reporting this post"
                        value={reportReason}
                        onChange={(e) => setReportReason(e.target.value)}
                        className="report-textarea"
                    ></textarea>
                    <button onClick={handleReportSubmit} className="submit-report">
                        Submit Report
                    </button>
                    {reportError && <p className="error-message">{reportError}</p>}
                </div>
            )}
        </div>
    );
}

export default Post;
