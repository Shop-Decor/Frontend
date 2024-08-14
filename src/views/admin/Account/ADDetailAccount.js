import React, { useState, useEffect } from 'react';
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap/dist/css/bootstrap.min.css";
import '../../../styles/admin/ADDetailAccount.scss';
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';

const ADDetailAccount = () => {
    const [newUser, setNewUser] = useState({
        fullName: '',
        userName: '',
        password: '',
        confirmPassword: '',
        email: '',
        phoneNumber: '',
        address: '',
    });

    const [editUser, setEditUser] = useState({
        fullName: '',
        userName: '',
        email: '',
        phoneNumber: '',
        address: '',
    });
    const [passwordData, setPasswordData] = useState({

        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [error, setError] = useState(null);
    const [errorMessage, setErrorMessage] = useState({
        fullName: '',
        userName: '',
        password: '',
        confirmPassword: '',
        email: '',
        phoneNumber: '',
        address: '',

    });
    const [showModal, setShowModal] = useState(false); // Add state for modal visibility
    const navigate = useNavigate();

    const fetchAccounts = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            const user = jwtDecode(token);
            if (((Date.now() / 1000) - user.exp) > 0) {
                navigate('/SignIn');
            } else {
                try {
                    const response = await axios.get('https://localhost:7078/api/Account/GetUser', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.status === 200) {
                        const accounts = response.data || {};
                        setNewUser(accounts);
                        setEditUser({
                            fullName: accounts.fullName || '',
                            userName: accounts.userName || '',
                            email: accounts.email || '',
                            phoneNumber: accounts.phoneNumber || '',
                            address: accounts.address || '',
                        });
                    } else if (response.status === 401) {
                        navigate('/SignIn');
                    }
                } catch (error) {
                    console.error('Error fetching accounts:', error);
                    if (error.response && error.response.status === 401) {
                        navigate('/SignIn');
                    }
                }
            }
        } else {
            navigate('/SignIn');
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, [showModal]);

    const handleEditChange = (event) => {
        const { name, value } = event.target;
        setEditUser((prevEditUser) => ({
            ...prevEditUser,
            [name]: value,
        }));
    };

    const handlePasswordChange = (e) => {
        const { id, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleEditSubmit = async (event) => {
        event.preventDefault();
        const updatedUser = { ...editUser };
        let errors = {};



        // kiểm tra tên người dùng chỉ chứa kí tự chữ

        if (/\d/.test(updatedUser.fullName) || /[!@#$&*]/.test(updatedUser.fullName)) {
            errors.fullName = 'Tên người dùng chỉ chứa kí tự chữ';
        }
        // kiểm tra tên người dùng ít nhất 6 kí tự
        if (updatedUser.fullName.length < 6) {
            errors.fullName = 'Tên người dùng phải ít nhất 6 kí tự';
        }

        else if (updatedUser.fullName.length > 30) {
            errors.fullName = 'Tên người dùng tối đa 30 kí tự';
        }

        // Check phone number có dữ liệu và chỉ chứa 10 kí tự 
        if (!/^\d{10}$/.test(updatedUser.phoneNumber) && updatedUser.phoneNumber !== '') {
            errors.phoneNumber = 'Số điện thoại không hợp lệ. Vui lòng nhập 10 chữ số.';
        }


        if (Object.keys(errors).length > 0) {
            setErrorMessage(errors);
            return false;
        } else {
            setErrorMessage({}); // Clear error messages if validation passes
        }

        editUser.id = localStorage.getItem('userID');
        try {
            const response = await axios.put(`https://localhost:7078/api/Account/${editUser.id}`, updatedUser);
            setShowModal(!showModal); // Close the modal
            console.log(response.data);
            if (response.data === true) {
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Cập nhật người dùng thành công',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                });
            }
            if (response.data === 2002) {

                Swal.fire({
                    icon: 'warning',
                    title: 'Ôi Không',
                    text: 'Email đã tồn tại',
                });
            }
            if (response.data === 2003) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Ôi Không',
                    text: 'Số điện thoại đã tồn tại',
                });
            }
            //reload form bởi useeffect
            fetchAccounts();
        } catch (error) {
            console.log(error);
            setError('Error updating user');
        }
    };

    const handlePasswordSubmit = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Mật khẩu không khớp',
            });
            return;
        }

        const user = jwtDecode(localStorage.getItem('token'));
        let userId = user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

        const token = localStorage.getItem('token');
        try {
            const response = await axios.put(`https://localhost:7078/api/Account/ChangePass/${userId}`, passwordData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Thảnh công',
                    text: 'Đổi mật khẩu không thành công',
                });
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Đổi mật khẩu thất bại.',
            });
        }
    };
    return (
        <>
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="form-container">
                        <div className="row form-group">
                            <div className="col-sm-3">
                                <label htmlFor="fullName">Tên người dùng</label>
                            </div>
                            <div className="col-sm-9">
                                <input type="text" className="form-control" id="fullName" value={newUser.fullName || ''} readOnly />
                            </div>
                        </div>
                        <div className="row form-group mt-3">
                            <div className="col-sm-3">
                                <label htmlFor="userName">Tên tài khoản</label>
                            </div>
                            <div className="col-sm-9">
                                <input type="text" className="form-control" id="userName" value={newUser.userName || ''} readOnly />
                            </div>
                        </div>
                        <div className="row form-group mt-3">
                            <div className="col-sm-3">
                                <label htmlFor="email">Email</label>
                            </div>
                            <div className="col-sm-9">
                                <input type="email" className="form-control" id="email" value={newUser.email || ''} readOnly />
                            </div>
                        </div>
                        <div className="row form-group mt-3">
                            <div className="col-sm-3">
                                <label htmlFor="phoneNumber">Số điện thoại</label>
                            </div>
                            <div className="col-sm-9">
                                <input type="text" className="form-control" id="phoneNumber" value={newUser.phoneNumber || ''} readOnly />
                            </div>
                        </div>
                        <div className="row form-group mt-3">
                            <div className="col-sm-3">
                                <label htmlFor="address">Địa chỉ</label>
                            </div>
                            <div className="col-sm-9">
                                <input type="text" className="form-control" id="address" value={newUser.address || ''} readOnly />
                            </div>
                        </div>
                        <div className='buton-center'>
                            <button
                                className="btn btn-primary mt-3"
                                data-bs-toggle="modal"
                                data-bs-target="#editUserModal"
                            >
                                Sửa thông tin
                            </button>
                            <button
                                className="btn btn-secondary mt-3"
                                data-bs-toggle="modal"
                                data-bs-target="#changePasswordModal"
                            >
                                Đổi mật khẩu
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* sửa ng dùng */}
            <div className="modal fade" id="editUserModal" aria-labelledby="editUserModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="editUserModalLabel">Sửa thông tin tài khoản</h1>
                            <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleEditSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="editUserName" className="form-label">Tên tài khoản</label>
                                    <input type="text" className="form-control" id="editUserName" disabled name="userName" value={editUser.userName} onChange={handleEditChange} />
                                    <div className="text-danger">{errorMessage.userName}</div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="editFullName" className="form-label">Tên người dùng</label>
                                    <input type="text" className="form-control" id="editFullName" name="fullName" value={editUser.fullName} onChange={handleEditChange} />
                                    <div className="text-danger">{errorMessage.fullName}</div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="editEmail" className="form-label">Email</label>
                                    <input type="email" className="form-control" id="editEmail" name="email" value={editUser.email} onChange={handleEditChange} />
                                    <div className="text-danger">{errorMessage.email}</div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="editPhoneNumber" className="form-label">Số điện thoại</label>
                                    <input type="text" className="form-control" id="editPhoneNumber" name="phoneNumber" value={editUser.phoneNumber} onChange={handleEditChange} />
                                    <div className="text-danger">{errorMessage.phoneNumber}</div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="editAddress" className="form-label">Địa chỉ</label>
                                    <input type="text" className="form-control" id="editAddress" name="address" value={editUser.address} onChange={handleEditChange} />
                                    <div className="text-danger">{errorMessage.address}</div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                    <button type="submit" className="btn btn-primary">Lưu </button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Change Password Modal */}
            <div className="modal fade" id="changePasswordModal" tabIndex="-1" aria-labelledby="changePasswordModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="changePasswordModalLabel">Đổi mật khẩu</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="currentPassword" className="form-label">Mật khẩu cũ</label>
                                <input type="password" className="form-control" id="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="newPassword" className="form-label">Mật khẩu mới</label>
                                <input type="password" className="form-control" id="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="confirmPassword" className="form-label">Nhập lại mật khẩu mới</label>
                                <input type="password" className="form-control" id="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                            <button type="button" className="btn btn-primary" onClick={handlePasswordSubmit}>Đổi mật khẩu</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ADDetailAccount;
