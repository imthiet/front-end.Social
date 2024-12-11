import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import SideBar from "../Manage_web";
import './Edit_user.css';
import '../../notice/notice.css';  // Đi lên 2 cấp và vào thư mục notice
import { showAlert } from '../../notice/notice';  // Đi lên 2 cấp và vào thư mục notice


const Edit_user = () => {
  const { username } = useParams(); // Lấy username từ URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Lấy thông tin người dùng từ API khi trang được tải
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/manage/user/${username}`,
          {
            withCredentials: true,
          }
        );
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch user data.");
        setLoading(false);
      }
    };

    fetchUser();
  }, [username]); // Chỉ gọi lại khi username thay đổi

  // Xử lý submit chỉnh sửa thông tin người dùng
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Gửi PUT request để cập nhật thông tin người dùng
      await axios.put(
        `http://localhost:8080/manage/update/${username}`,
        user,
        { withCredentials: true } 
      );
      // Hiển thị thông báo thành công
      alert("User updated successfully!");
    } catch (err) {
      setError("Failed to update user.");
    }
  };

  // Xử lý thay đổi thông tin người dùng
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser({
      ...user,
      [name]: type === "checkbox" ? checked : value, // Nếu là checkbox thì gán `checked`, ngược lại gán `value`
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="ma-container">
      <div className="sidebar-container">
        <SideBar />
      </div>
      <h2>Edit User</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={user.username}
            onChange={handleChange}
           
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="verificationCode">Verification Code</label>
          <input
            type="text"
            id="verificationCode"
            name="verificationCode"
            value={user.verificationCode}
            onChange={handleChange}
            className="form-control"
            disabled
          />
        </div>
        <div className="check">
          <label className="form-check-label" htmlFor="enabled">
            <input
              type="checkbox"
              id="enabled"
              name="enabled"
              checked={user.enabled}
              onChange={handleChange}
              className="form-check-input"
            />
            Enabled
          </label>
        </div>
        <div className="check">
          <label className="form-check-label" htmlFor="isAdmin">
            <input
              type="checkbox"
              id="isAdmin"
              name="isAdmin"
              checked={user.isAdmin}
              onChange={handleChange}
              className="form-check-input"
            />
            Admin?
          </label>
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Edit_user;
