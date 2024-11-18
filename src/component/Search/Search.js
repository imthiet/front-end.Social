import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import "./Search.css"; // Đảm bảo đã có CSS cho giao diện

const SearchPage = () => {
  const [keyword, setKeyword] = useState(""); // Từ khóa tìm kiếm
  const [results, setResults] = useState([]); // Kết quả tìm kiếm
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [page, setPage] = useState(0); // Trang hiện tại
  const [size, setSize] = useState(10); // Số lượng kết quả mỗi trang

  // Hàm gọi API tìm kiếm
  const fetchResults = async (keyword, page, size) => {
    try {
      setLoading(true); // Bắt đầu loading

      const response = await fetch(
        `http://localhost:8080/api/search?keyword=${encodeURIComponent(
          keyword
        )}&page=${page}&size=${size}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Gửi cookie cho phiên làm việc
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
      setLoading(false); // Kết thúc loading
    }
  };

  // Gọi API khi từ khóa thay đổi
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchResults(keyword, page, size); // Thêm page và size vào API call
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [keyword, page, size]);

  // Hàm gửi yêu cầu kết bạn
  const handleAddFriend = async (friendUsername) => {
    try {
        const response = await fetch(
            `http://localhost:8080/add_friend?username=${encodeURIComponent(friendUsername)}`,
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
            // Cập nhật giao diện sau khi gửi yêu cầu thành công
            alert(data.message);
            setResults((prevResults) =>
                prevResults.map((user) =>
                    user.username === friendUsername
                        ? { ...user, friendPending: data.friendPending, friendRequestReceiver: data.friendRequestReceiver }
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


  return (
    <div className="Search-container container mt-40">
      <Navbar />

      <div>
        <h2>Search Friend</h2>
        <input
          type="text"
          placeholder="Enter keyword..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "20px" }}
        />
        {loading ? (
          <div className="loader"></div> // Hiển thị loader khi đang tải
        ) : (
          <>
           <ul className="list-group">
                {results.map((user) => (
                  <li
                    key={user.username}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <span>
                      {user.username} - {user.email}
                    </span>
                    {/* Check if the user has received a friend request */}
                    {user.friendRequestReceiver ? (
                      <button className="btn btn-success">Accept</button>
                    ) 
                    // Check if the user has a pending request from the current user
                    : user.friendPending ? (
                      <button className="btn btn-secondary" disabled>
                        Pending
                      </button>
                    ) 
                    // If the user is already a friend
                    : user.friend ? (
                      <button className="btn btn-primary" disabled>
                        Friend
                      </button>
                    ) 
                    // Otherwise, show the "Add Friend" button
                    : (
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => handleAddFriend(user.username)}
                      >
                        Add Friend
                      </button>
                    )}
                  </li>
                ))}
              </ul>


            {/* Phân trang */}
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
