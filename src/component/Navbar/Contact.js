import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Navbar';
const Contact = () => {
    return (
        <div>
            <Navbar/>
       
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="text-center p-4 bg-white shadow rounded">
                <h1 className="mb-4">Nowfeed SocialNetwork</h1>
                <p className="mb-2"><strong>Creator:</strong> Thiet Quang</p>
                <p className="mb-2"><strong>Date of Release:</strong> 12/12/2024</p>

                <h2 className="mt-4 mb-3">Contact:</h2>
                <ul className="list-unstyled">
                    <li className="mb-2"><strong>Email:</strong> Nowfeed@social.com</li>
                    <li className="mb-2"><strong>Phone Number:</strong> 0812073693</li>
                    <li className="mb-2"><strong>Tax Number:</strong> 0316351903-001</li>
                    <li className="mb-2"><strong>Address:</strong> Thanh Xuan, Ha Noi</li>
                </ul>

                <p className="mt-4">Hope you have a great experience with our product!!!!</p>
            </div>
        </div>
        </div>
    );
};

export default Contact;
