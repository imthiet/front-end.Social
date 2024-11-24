import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Manage_web.css';

const Manage_web = () => {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate('/Newsfeed');  // Quay lại trang trước đó
    };
    const handleBack1Click = () => {
        navigate(-1);
    };

    return (
        <div className="container-mng d-flex">
            {/* Sidebar */}
            <div className="sidebar">
                <h2 className="text-center mb-4">ADMIN DASHBOARD</h2>
                <div className="list-group">
                    <Link to="/manage_user" className="list-group-item list-group-item-action">
                        Manage User
                    </Link>
                    <Link to="/manage_post" className="list-group-item list-group-item-action">
                        Manage Post
                    </Link>
                    <Link to="/progress" className="list-group-item list-group-item-action">
                        Chart
                    </Link>
                    <button className="btn btn-secondary mb-3" onClick={handleBack1Click}>
                    Back
                </button>
                    <button className="btn btn-warning mb-3" onClick={handleBackClick}>
                    Exit 
                </button>
               
                   
                </div>
            </div>
            <div className="content">
           
          
                <Outlet />
            </div>
        </div>
    );
};

export default Manage_web;
