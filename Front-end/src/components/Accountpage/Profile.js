import React, { useState, useEffect } from "react";
import './profile.css';
import orderService from "../../services/OrderService";
import userService from "../../services/UserService";
import Navbar from "../../containers/Navbar/Navbar";
const Profile = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const userId = userService.getLoggedInUser().id;
                const ordersData = await orderService.getOrderByUser(userId);
                
                if (Array.isArray(ordersData)) {
                    setOrders(ordersData);
                } else {
                    console.error('The response is not an array:', ordersData);
                    setOrders([]);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
                setError('Failed to load orders');
                setOrders([]); 
            }
        };

        fetchOrders();
    }, []);

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <>
        <Navbar />
        <div className="profile-main">
            <div className="profile-upper">
                <h1 className="my-acc">My Account</h1>
                <button className="logout-btn"
                onClick={(e) => {
                userService.logout();
                window.location.href = '/';
                }}
                >Log out</button>
            </div>

            <hr />

            <div className="profile-lower">
                <h1 className="my-acc">Order History</h1>
                <div className="order-container">
                    {orders.length > 0 ? (
                        orders.map((order, index) => (
                            <div key={index} className="order">
                                <p>Order ID: {order.timestamp_id}</p>
                                <p>User ID: {order.user_id}</p>
                                <p>Amount: {order.amount}</p>
                            </div>
                        ))
                    ) : (
                        <p>No orders found.</p>
                    )}
                </div>
            </div>
        </div>
        </>
    );
};

export default Profile;
