import React, { useState, useEffect } from 'react';
import './Edit_profile.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
const Edit_profile = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    address: ''
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  useEffect(() => {
    fetch('http://localhost:8080/api/user/profile', {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        setUserData({
          username: data.username,
          email: data.email,
          address: data.address,
        });
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    if (name === 'currentPassword') {
      setCurrentPassword(value);
    } else if (name === 'newPassword') {
      setNewPassword(value);
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        setSuccessMessage('Profile updated successfully!');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('An error occurred while updating the profile.');
    }
  };
  const handleLogout = (e) => {
   

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

const handleChangePassword = async (e) => {
  e.preventDefault();

  if (newPassword !== confirmPassword) {
      setError('Passwords do not match!');
      return;
  }

  try {
      const response = await fetch('http://localhost:8080/api/user/change-password', {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          credentials: 'include', // Đảm bảo thông tin xác thực được gửi
          body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      if (response.ok) {
          // Hiển thị thông báo thành công
          setSuccessMessage('Password changed successfully!');

          // Xóa dữ liệu trong các input fields
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          setError('');

          // Sau 3 giây (3000ms) sẽ gọi handleLogout
          setTimeout(() => {
              handleLogout(e);
          }, 3000);

      } else if (response.status === 401) {
          setError('You are not authorized to perform this action. Please log in again.');
      } else {
          try {
              const data = await response.json();
              setError(data.message || 'Failed to change password.');
          } catch {
              setError('An unexpected error occurred.');
          }
      }
  } catch (error) {
      console.error('Error changing password:', error);
      setError('An error occurred while changing the password.');
  }
};

  const togglePasswordVisibility = (field) => {
    setPasswordVisible((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  return (
    <div>
      <Navbar/>
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      {successMessage && <p className="success">{successMessage}</p>}
      {error && <p className="error">{error}</p>}

      <div className="profile-section">
        <h3>Profile Information</h3>
        <form onSubmit={handleUpdateProfile}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={userData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={userData.address}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="submit-btn">Update Profile</button>
        </form>
      </div>

      <div className="password-section">
        <h3>Change Password</h3>
        <form onSubmit={handleChangePassword}>
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <div className="password-input-container">
              <input
                type={passwordVisible.currentPassword ? 'text' : 'password'}
                id="currentPassword"
                name="currentPassword"
                value={currentPassword}
                onChange={handlePasswordChange}
                required
              />
              <span
                className="password-toggle"
                onClick={() => togglePasswordVisibility('currentPassword')}
              >
                {passwordVisible.currentPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <div className="password-input-container">
              <input
                type={passwordVisible.newPassword ? 'text' : 'password'}
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={handlePasswordChange}
                required
              />
              <span
                className="password-toggle"
                onClick={() => togglePasswordVisibility('newPassword')}
              >
                {passwordVisible.newPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <div className="password-input-container">
              <input
                type={passwordVisible.confirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handlePasswordChange}
                required
              />
              <span
                className="password-toggle"
                onClick={() => togglePasswordVisibility('confirmPassword')}
              >
                {passwordVisible.confirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <button type="submit" className="submit-btn">Change Password</button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default Edit_profile;
