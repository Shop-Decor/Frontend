import React, { Component } from 'react';
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { jwtDecode } from 'jwt-decode'; // Fix the import statement
import { useNavigate } from 'react-router-dom';
import SignIn from '../../user/SignIn'; // Import SignIn component
import { useState, useEffect } from 'react';

const ADAccount = () => {
    const [newUser, setNewUser] = useState({
        fullName: '',
        userName: '',
        password: '',
        confirmPassword: '',
        email: '',
        phoneNumber: '',
        address: '',

    });
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAccounts = async () => {
            console.log("running");
            const token = localStorage.getItem('token');
            if (token) {
                //check time
                const user = jwtDecode(token);
                if (((Date.now()/1000) -user.exp ) > 0) {
                    navigate('/SignIn');
                }
                else{
                    try {
                        const response = await axios.get('https://localhost:7078/api/Account/Get', {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });
    
                        if (response.status === 200) {
                            const accounts = response.data || [];
                            setAccounts(accounts);
                        } else if (response.status === 401) {
                            // Handle unauthorized status
                        }
                    } catch (error) {
                         console.error('Error fetching accounts:', error);
                        if (error.response && error.response.status === 401) {
                            return;
                        }
                    }
                }
               
            } else {
                return;
            }
        };

        fetchAccounts();
    }, [showModal]);


    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewUser((prevNewUser) => ({
            ...prevNewUser,
            [name]: value
        }));
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        const newU = { ...newUser };

        // console.log('Submitting data:', newUser); // Log dữ liệu

        try {
            await axios.post('https://localhost:7078/api/Account/Create', newU);
            setShowModal(!showModal); // Close the modal
        } catch (error) {
            // console.error('Error adding user:', error.response ? error.response.data : error.message);
            setError(
                'Error adding user'
            );
        }
    };
    return (
        <>
            <div className="account-list container">
                <h1>Người Dùng <FontAwesomeIcon icon={faUser} /></h1>
                <button
                    type="button"
                    className="btn btn-primary mb-3"
                    data-bs-toggle="modal"
                    data-bs-target="#addUserModal"
                >
                    Thêm Người Dùng
                </button>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                <table className="table">
                    <thead>
                        <tr>
                            <th>Tên tài khoản</th>
                            <th>Tên người dùng</th>
                            <th>Email</th>
                            <th>Số điện thoại</th>
                            <th>Địa chỉ</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.map(account => (
                            <tr key={account.id}>
                                <td>{account.userName}</td>
                                <td>{account.fullName}</td>
                                <td>{account.email}</td>
                                <td>{account.phoneNumber}</td>
                                <td>{account.address}</td>
                                <td>
                                    <button className='btn btn-sm m-2 btn-primary'>Sửa</button>
                                    <button className='btn btn-sm btn-danger'>Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Modal thêm người dùng */}
                <div className="modal fade" id="addUserModal" aria-labelledby="addUserModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="addUserModalLabel">Thêm Người Dùng Mới</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row mb-3">
                                        <label className="col-sm-3 col-form-label">Tên Tài Khoản:</label>
                                        <div className="col-sm-9">
                                            <input
                                                type="text"
                                                value={newUser.userName}
                                                onChange={handleChange}
                                                className="form-control"
                                                name="userName"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-3 col-form-label">Mật khẩu:</label>
                                        <div className="col-sm-9">
                                            <input
                                                type="password"
                                                value={newUser.password}
                                                onChange={handleChange}
                                                className="form-control"
                                                name="password"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-3 col-form-label">Xác nhận Mật khẩu:</label>
                                        <div className="col-sm-9">
                                            <input
                                                type="password"
                                                value={newUser.confirmPassword}
                                                onChange={handleChange}
                                                className="form-control"
                                                name="confirmPassword"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-3 col-form-label">Tên Người Dùng:</label>
                                        <div className="col-sm-9">
                                            <input
                                                type="text"
                                                value={newUser.fullName}
                                                onChange={handleChange}
                                                className="form-control"
                                                name="fullName"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-3 col-form-label">Email:</label>
                                        <div className="col-sm-9">
                                            <input
                                                type="email"
                                                value={newUser.email}
                                                onChange={handleChange}
                                                className="form-control"
                                                name="email"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-3 col-form-label">Số Điện Thoại:</label>
                                        <div className="col-sm-9">
                                            <input
                                                type="tel"
                                                value={newUser.phoneNumber}
                                                onChange={handleChange}
                                                className="form-control"
                                                name="phoneNumber"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-3 col-form-label">Địa Chỉ:</label>
                                        <div className="col-sm-9">
                                            <input
                                                type="text"
                                                value={newUser.address}
                                                onChange={handleChange}
                                                className="form-control"
                                                name="address"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                                        <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Lưu</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};



export default ADAccount;
