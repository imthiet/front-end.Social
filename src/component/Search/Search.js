import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Navbar from "../Navbar/Navbar";
import "./Search.css";

const SearchPage = () => {
  const [keyword, setKeyword] = useState(""); // Từ khóa tìm kiếm
  const [results, setResults] = useState([]); // Kết quả tìm kiếm
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [page, setPage] = useState(0); // Trang hiện tại
  const [size, setSize] = useState(7); // Số lượng kết quả mỗi trang

  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

  // Hàm gọi API tìm kiếm
  const fetchResults = async (keyword, page, size) => {
    try {
      setLoading(true);

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
      setResults(data); // Lưu kết quả tìm kiếm
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchResults(keyword, page, size);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [keyword, page, size]);

  // Hàm chuyển hướng đến profile
  const handleUserClick = (username) => {
    navigate(`/profile_view/${username}`); // Điều hướng đến trang profile và truyền username
  };

  // Hàm gửi yêu cầu kết bạn
  const handleAddFriend = async (friendUsername) => {
    try {
      const response = await fetch(
        `http://localhost:8080/add_friend?username=${encodeURIComponent(
          friendUsername
        )}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        setResults((prevResults) =>
          prevResults.map((user) =>
            user.username === friendUsername
              ? {
                  ...user,
                  friendPending: false,
                  friendRequestReceiver: true,
                }
              : user
          )
        );
      } else {
        alert(`Failed to send friend request: ${data.message}`);
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
      alert("An error occurred while sending the friend request.");
    }
  };
  const handleAcceptFriend = async (friendUsername) => {
    try {
      const response = await fetch(
        `http://localhost:8080/accept_friends?username=${encodeURIComponent(friendUsername)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
  
      const data = await response.json();
  
      if (response.ok) {
        alert(data.message);
        setResults((prevResults) =>
          prevResults.map((user) =>
            user.username === friendUsername
              ? {
                  ...user,
                  friendPending: false,
                  friend: true,
                }
              : user
          )
        );
      } else {
        alert(`Failed to accept friend request: ${data.error}`);
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
      alert("An error occurred while accepting the friend request.");
    }
  };
  

  return (
    <div className="Search-container container mt-80 ">
      <Navbar />

      <div className="inner-search container mt-80">
        <h4>Search Friend</h4>
        <input
        className="search-input"
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
            <ul className="list-group">
              {results.map((user) => (
                <li
                  key={user.username}
                  className="list-group-item d-flex justify-content-between align-items-center"
                  onClick={() => handleUserClick(user.username)} // Thêm sự kiện click
                  style={{ cursor: "pointer" }} // Thay đổi con trỏ để người dùng biết có thể click
                >
                  <span>
                    {user.username} - {user.email}
                  </span>
                  {user.friendPending && !user.friendRequestReceiver ? (
                    <button
                    className="btn btn-success"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAcceptFriend(user.username);
                    }}
                  >
                    Accept
                  </button>
                  
                  ) : user.friendRequestReceiver ? (
                    <button className="btn btn-warning">Pending</button>
                  ) : user.friend ? (
                    <button className="btn btn-primary" disabled>
                      Friend
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-primary"
                      onClick={(e) => {
                        e.stopPropagation(); // Ngăn sự kiện click lan đến li
                        handleAddFriend(user.username);
                      }}
                    >
                      Add Friend
                    </button>
                  )}

                </li>
              ))}
            </ul>

            <div className="pagination mt-3">
              <button
                onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 0))}
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
  );
};

export default SearchPage;
