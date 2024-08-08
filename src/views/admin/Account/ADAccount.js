import React, { useState, useEffect } from 'react';
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap/dist/css/bootstrap.min.css";
import '../../../styles/admin/ADAccount.scss';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import SignIn from '../../user/SignIn';

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

    const [editUser, setEditUser] = useState({
        id: '',
        fullName: '',
        userName: '',
        email: '',
        phoneNumber: '',
        address: '',
    });

    const navigate = useNavigate();
    const [accounts, setAccounts] = useState([]);
    const [showModal, setShowModal] = useState(false);
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
    const [deleteUser, setDeleteUser] = useState(null);


    useEffect(() => {
        const fetchAccounts = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                const user = jwtDecode(token);
                if (((Date.now() / 1000) - user.exp) > 0) {
                    navigate('/SignIn');
                } else {

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
            [name]: value,
        }));
    };

    const handleEditChange = (event) => {
        const { name, value } = event.target;
        setEditUser((prevEditUser) => ({
            ...prevEditUser,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const newU = { ...newUser };
        console.log("asdasd", newU);
        // kiểm tra tên người dùng chỉ chứa kí tự chữ
        let errors = {};
        // kiểm tra tên người dùng ít nhất 6 kí tự
        if (newU.userName.length < 6) {
            errors.userName = 'Tên tài khoản phải ít nhất 6 kí tự';
        }
        else if (newU.userName.length > 20) {
            errors.userName = 'Tên tài khoản tối đa 20 kí tự';
        }
        // kiểm tra tên người dùng chỉ chứa kí tự chữ và dấu cách
        if (/[^a-zA-Z\s]/.test(newU.fullName)) {
            errors.fullName = 'Tên người dùng chỉ chứa kí tự chữ';
        }

        if (newU.fullName.length < 6) {
            errors.fullName = 'Tên người dùng phải ít nhất 6 kí tự';
        }
        else if (newU.fullName.length > 30) {
            errors.fullName = 'Tên người dùng tối đa 30 kí tự';
        }
        // Check phone number 10 kí tự
        if (!/^\d{10}$/.test(newU.phoneNumber) && newU.phoneNumber !== '') {
            errors.phoneNumber = 'Số điện thoại không hợp lệ. Vui lòng nhập 10 chữ số.';
        }
        // Check password chứa 1 in hoa, 1 in thường, 1 số, 1 kí tự đặc biệt
        if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/.test(newU.password)) {
            errors.password = 'Mật khẩu phải chứa ít nhất 1 chữ số, 1 chữ cái viết thường, 1 chữ cái viết hoa và 1 kí tự đặc biệt';
        }
        // Check confirm password
        if (newU.password !== newU.confirmPassword) {
            errors.confirmPassword = 'Mật khẩu không khớp';
        }
        if (Object.keys(errors).length > 0) {
            setErrorMessage(errors);
            return false;
        } else {
            setErrorMessage({}); // Clear error messages if validation passes
        }
        console.log("Sắp thử", newU);
        try {
            console.log("vô nè");
            await axios.post('https://localhost:7078/api/Account/Create', newUser);
            setShowModal(!showModal); // Close the modal
            // Clear the form
            // useEffect();
        } catch (error) {
            setError('Error adding user');
        }
    };

    const handleEditSubmit = async (event) => {
        event.preventDefault();
        const updatedUser = { ...editUser };
        let errors = {};



        // kiểm tra tên người dùng chỉ chứa kí tự chữ
        if (/[^a-zA-Z\s]/.test(updatedUser.fullName)) {
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

        try {
            const response = await axios.put(`https://localhost:7078/api/Account/${editUser.id}`, updatedUser);
            setShowModal(!showModal); // Close the modal
            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Cập nhật người dùng thành công',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                });
            }
        } catch (error) {
            setError('Error updating user');
        }
    };

    const handleEditClick = (account) => {
        setEditUser({ ...account });
    };


    // xóa người dùng
    const handleDeleteClick = (user) => {
        setDeleteUser(user);
        setShowModal(true); // Show the confirmation modal
    };

    // xác nhận xóa người dùng
    const handleDeleteSubmit = async () => {
        try {
            const response = await axios.put(`https://localhost:7078/api/Account/Delete/${deleteUser.id}`);
            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Xóa người dùng thành công',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                });
                setAccounts(accounts.filter(account => account.id !== deleteUser.id));
                setDeleteUser(null); // Clear the selected user
                setShowModal(false); // Close the confirmation modal
            }
        } catch (error) {
            setError('Error deleting user');
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Xóa người dùng thất bại',
            });
        }
    };

    return (
        <>
            <div className="account-list container">
                <div className="content-container">
                    <h2>Người Dùng <FontAwesomeIcon icon={faUser} /></h2>
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
                            {accounts.map((account) => (
                                <tr key={account.id}>
                                    <td>{account.userName}</td>
                                    <td>{account.fullName}</td>
                                    <td>{account.email}</td>
                                    <td>{account.phoneNumber}</td>
                                    <td>{account.address}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm m-2 btn-primary"
                                            type="button"
                                            data-bs-toggle="modal"
                                            data-bs-target="#editUserModal"
                                            onClick={() => handleEditClick(account)}
                                        >
                                            Sửa
                                        </button>
                                        <button className="btn btn-sm btn-danger"
                                            type="button"
                                            data-bs-toggle="modal"
                                            data-bs-target="#deleteUserModal"
                                            onClick={() => handleDeleteClick(account)}

                                        >Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


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
                                        <label className="col-sm-3 col-form-label">Tên Tài Khoản *:</label>
                                        <div className="col-sm-9">
                                            <input
                                                type="text"
                                                value={newUser.userName}
                                                onChange={handleChange}
                                                className={`form-control ${errorMessage.userName ? 'is-invalid' : ''}`}
                                                name="userName"
                                                required
                                            />
                                            {errorMessage.userName && (
                                                <div className="invalid-feedback">
                                                    {errorMessage.userName}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-3 col-form-label">Mật khẩu *:</label>
                                        <div className="col-sm-9">
                                            <input
                                                type="password"
                                                value={newUser.password}
                                                onChange={handleChange}
                                                className={`form-control ${errorMessage.password ? 'is-invalid' : ''}`}
                                                name="password"
                                                required
                                            />
                                            {errorMessage.password && (
                                                <div className="invalid-feedback">
                                                    {errorMessage.password}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-3 col-form-label">Xác nhận Mật khẩu *:</label>
                                        <div className="col-sm-9">
                                            <input
                                                type="password"
                                                value={newUser.confirmPassword}
                                                onChange={handleChange}
                                                className={`form-control ${errorMessage.confirmPassword ? 'is-invalid' : ''}`}
                                                name="confirmPassword"
                                                required
                                            />
                                            {errorMessage.confirmPassword && (
                                                <div className="invalid-feedback">
                                                    {errorMessage.confirmPassword}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-3 col-form-label">Tên Người Dùng *:</label>
                                        <div className="col-sm-9">
                                            <input
                                                type="text"
                                                value={newUser.fullName}
                                                onChange={handleChange}
                                                className={`form-control ${errorMessage.fullName ? 'is-invalid' : ''}`}
                                                name="fullName"
                                                required
                                            />
                                            {errorMessage.fullName && (
                                                <div className="invalid-feedback">
                                                    {errorMessage.fullName}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-3 col-form-label">Email *:</label>
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
                                                className={`form-control ${errorMessage.phoneNumber ? 'is-invalid' : ''}`}
                                                name="phoneNumber"
                                            // required
                                            />
                                            {errorMessage.phoneNumber && (
                                                <div className="invalid-feedback">
                                                    {errorMessage.phoneNumber}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-3 col-form-label">Địa chỉ:</label>
                                        <div className="col-sm-9">
                                            <input
                                                type="text"
                                                value={newUser.address}
                                                onChange={handleChange}
                                                className={`form-control ${errorMessage.address ? 'is-invalid' : ''}`}
                                                name="address"
                                            // required
                                            />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                        <button type="submit" className="btn btn-primary">Thêm</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal sửa người dùng */}
                <div className="modal fade" id="editUserModal" aria-labelledby="editUserModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="editUserModalLabel">Sửa Người Dùng</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleEditSubmit}>
                                    <div className="row mb-3">
                                        <label className="col-sm-3 col-form-label">Tên Tài Khoản:</label>
                                        <div className="col-sm-9">
                                            <input
                                                type="text"
                                                value={editUser.userName}
                                                onChange={handleEditChange}
                                                className="form-control"
                                                name="userName"
                                                required
                                                disabled
                                            />

                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-3 col-form-label">Tên Người Dùng:</label>
                                        <div className="col-sm-9">
                                            <input
                                                type="text"
                                                value={editUser.fullName}
                                                onChange={handleEditChange}
                                                className={`form-control ${errorMessage.fullName ? 'is-invalid' : ''}`}
                                                name="fullName"
                                                required
                                            />
                                            {errorMessage.fullName && (
                                                <div className="invalid-feedback">
                                                    {errorMessage.fullName}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-3 col-form-label">Email:</label>
                                        <div className="col-sm-9">
                                            <input
                                                type="email"
                                                value={editUser.email}
                                                onChange={handleEditChange}
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
                                                value={editUser.phoneNumber}
                                                onChange={handleEditChange}
                                                className={`form-control ${errorMessage.phoneNumber ? 'is-invalid' : ''}`}
                                                name="phoneNumber"
                                            // required
                                            />
                                            {errorMessage.phoneNumber && (
                                                <div className="invalid-feedback">
                                                    {errorMessage.phoneNumber}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-3 col-form-label">Địa chỉ:</label>
                                        <div className="col-sm-9">
                                            <input
                                                type="text"
                                                value={editUser.address}
                                                onChange={handleEditChange}
                                                className="form-control"
                                                name="address"
                                            // required
                                            />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                        <button type="submit" className="btn btn-primary">Cập Nhật</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Modal xóa người dùng */}
                <div className="modal fade" id="deleteUserModal" aria-labelledby="deleteUserModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="deleteUserModalLabel">Xóa Người Dùng</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <p>Bạn có chắc chắn muốn xóa người dùng này không?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                <button type="button" className="btn btn-danger" onClick={handleDeleteSubmit}>Xóa</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ADAccount;
