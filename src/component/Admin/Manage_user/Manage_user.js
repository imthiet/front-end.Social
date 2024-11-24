import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../Manage_web";
import "./Manage_user.css";
import { debounce } from "lodash";

const Manage_user = () => {
  const [keyword, setKeyword] = useState(""); // Từ khóa tìm kiếm
  const [results, setResults] = useState([]); // Kết quả tìm kiếm
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [page, setPage] = useState(0); // Trang hiện tại
  const [size, setSize] = useState(10); // Số lượng kết quả mỗi trang
  const [error, setError] = useState(null); // Thêm lỗi nếu có

  const navigate = useNavigate();

  // Hàm gọi API tìm kiếm
  const fetchResults = async (keyword, page, size) => {
    try {
      setLoading(true);
      setError(null); // Reset lỗi khi gọi lại API

      const response = await fetch(
        `http://localhost:8080/api/search?keyword=${encodeURIComponent(
          keyword
        )}&page=${page}&size=${size}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
      
    } catch (error) {
      setError("Error fetching search results. Please try again later.");
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  // Thực hiện tìm kiếm khi thay đổi từ khóa
  useEffect(() => {
    const fetchResultsDebounced = debounce(fetchResults, 400);
    fetchResultsDebounced(keyword, page, size);
    return () => fetchResultsDebounced.cancel(); // Huỷ bỏ debounce khi component unmount
  }, [keyword, page, size]);

  // Hàm xử lý khi nhấn vào một người dùng
  const handleUserClick = (username) => {
    navigate(`/Edit_user/${username}`); // Điều hướng đến trang profile và truyền username
  };

  return (
    <div>
      <div className="sidebar-container">
        <SideBar />
      </div>
      <div className="mu-container">
        <div>
          <h2>Search User</h2>
          <input
            type="text"
            placeholder="Enter keyword..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "20px" }}
          />
          {loading ? (
            <div className="loader"></div>
          ) : (
            <>
              {error && (
                <div className="alert alert-danger">{error}</div>
              )}{" "}
              {/* Hiển thị lỗi nếu có */}
              <ul className="list-group">
                {results.map((user) => (
                  <li
                    key={user.username}
                    className="list-group-item d-flex justify-content-between align-items-center"
                    style={{ cursor: "pointer" }}
                  >
                    <div
                      onClick={() => handleUserClick(user.username)}
                      style={{ flex: 1 }}
                    >
                      <span>
                        {user.username} - {user.email}
                      </span>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        checked={user.isAdmin}
                        readOnly
                        style={{ marginRight: "10px" }}
                      />
                      <label>Is Admin</label>
                      <input
                        type="checkbox"
                        checked={user.enabled}
                        readOnly
                        style={{ marginLeft: "10px", marginRight: "10px" }}
                      />
                      <label>Enabled</label>
                    
                    </div>
                  </li>
                ))}
              </ul>

              <div className="pagination mt-3">
                <button
                  onClick={() =>
                    setPage((prevPage) => Math.max(prevPage - 1, 0))
                  }
                  disabled={page === 0}
                  className="btn btn-outline-secondary"
                >
                  Prev
                </button>
                <span className="mx-3">Page {page + 1}</span>
                <button
                  onClick={() => setPage((prevPage) => prevPage + 1)}
                  disabled={results.length < size}
                  className="btn btn-outline-secondary"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Manage_user;
