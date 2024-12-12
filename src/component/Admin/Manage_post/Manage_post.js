import React, { useState, useEffect } from 'react';
import SideBar from "../Manage_web";
import './Manage_post.css';
import Modal from 'react-modal';
import '../../notice/notice.css';  
import { showAlert } from '../../notice/notice';



function Manage_post() {
    const [reports, setReports] = useState([]);
    const [page, setPage] = useState(0); // Trang hiện tại
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchReports = async () => {
            const response = await fetch(`http://localhost:8080/api/reports?page=${page}&size=5`, {
                method: 'GET',
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                setReports(data.content);  // content chứa các phần tử báo cáo
                setTotalPages(data.totalPages);  // Số trang tổng cộng
            }
        };

        fetchReports();
    }, [page]);

    const handleNextPage = () => {
        if (page < totalPages - 1) {
            setPage(page + 1);
        }
    };

    const handlePrevPage = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };

    const handleDelete = async (postId) => {
      // Hiển thị cửa sổ xác nhận
      const isConfirmed = window.confirm("Are you sure you want to delete this post?");
      
      if (isConfirmed) {
          try {
              const response = await fetch(`http://localhost:8080/api/reports/delete/${postId}`, {
                  method: 'DELETE',
                  credentials: 'include', // Đảm bảo gửi thông tin đăng nhập nếu cần
              });
  
              if (response.ok) {
                showAlert('Post deleted successfully!');
                  // Cập nhật lại giao diện (xóa bài viết khỏi danh sách)
                  setReports(reports.filter(report => report.postId !== postId));
              } else {
                  alert('Error deleting post');
              }
          } catch (error) {
              console.error("Error deleting post:", error);
              alert('Error deleting post');
          }
      } else {
          console.log("Delete action canceled");
      }
  };
  
  const handleIgnore = async (reportId) => {
    const isConfirmed = window.confirm("Are you sure you want to ignore this post?");
    if (isConfirmed) {
        try {
            const response = await fetch(`http://localhost:8080/api/reports/ignore/${reportId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                showAlert('Post ignored!');
                setReports(reports.filter(report => report.reportId !== reportId));
            } else if (response.status === 404) {
                alert('Post not found in the reported list.');
            } else {
                alert(`Server error: ${response.statusText}`);
            }
        } catch (error) {
            console.error("Error ignoring post:", error);
            alert('Error ignoring post. Please try again later.');
        }
    }
};

    return (
        <div className="container">
             <div id="notification" className="notification hidden" >
                <span id="notification-message"></span>
            </div>
           <div className="sidebar-container">
        <SideBar />
      </div>
            <h1>Reported Posts</h1>
            <table className="report-table">
                <thead>
                    <tr>
                        <th>Reported ID</th>
                        <th>Post ID</th>
                        <th>Reason</th>
                        <th>Reported By</th>
                        <th>Post Content</th>
                        <th>Post Image</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.map((report) => (
                        <tr key={report.reportId}>
                            <td>{report.reportId}</td>
                            <td>{report.postId}</td>
                            <td>{report.reason}</td>
                            <td>{report.reportedBy}</td>
                            <td>{report.postContent}</td>  {/* Hiển thị nội dung bài viết */}
                            <td>
                                {report.postImage && (
                                    <img
                                        src={`data:image/png;base64,${report.postImage}`}
                                        alt="Post Image"
                                        className="post-image"
                                    />
                                )}
                            </td>
                            <td>
                                <button
                                    className="delete-btn"
                                    onClick={() => handleDelete(report.postId)}
                                >
                                    Delete
                                </button>

                                <button
                                    className="delete-btn"
                                    onClick={() => handleIgnore(report.reportId)}
                                >
                                    Ignore
                                </button>


                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination">
                <button onClick={handlePrevPage} disabled={page === 0}>Previous</button>
                <span>Page {page + 1} of {totalPages}</span>
                <button onClick={handleNextPage} disabled={page === totalPages - 1}>Next</button>
            </div>
        </div>
    );
}

export default Manage_post;
