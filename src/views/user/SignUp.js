import React, { useState, useEffect } from 'react';
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap/dist/css/bootstrap.min.css";
import '../../styles/user/SignUp.scss'; // Import SCSS file

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const SignIn = () => {
    const [newUser, setNewUser] = useState({
        fullName: '',
        userName: '',
        password: '',
        confirmPassword: '',
        email: ''
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState({
        fullName: '',
        userName: '',
        password: '',
        confirmPassword: '',
        email: ''
    });

    useEffect(() => {
        localStorage.removeItem('token');
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewUser((prevNewUser) => ({
            ...prevNewUser,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newU = { ...newUser };
        let errors = {};

        // Validate fullName (only letters and spaces)
       
        if (/\d/.test(newU.fullName)) {
            errors.fullName = 'Tên người dùng không được chứa số hoặc ký tự đặc biệt';
        }

        // Validate password (at least 1 digit, 1 lowercase, 1 uppercase, and 1 special character)
        if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/.test(newU.password)) {
            errors.password = 'Mật khẩu chứa 1 chữ số, 1 chữ cái thường, 1 chữ cái hoa và 1 kí tự đặc biệt';
        }

        // Validate confirmPassword (must match password)
        if (newU.password !== newU.confirmPassword) {
            errors.confirmPassword = 'Mật khẩu không khớp';
        }

        // If there are validation errors, set the error messages and return
        if (Object.keys(errors).length > 0) {
            setErrorMessage(errors);
            return;
        } else {
            setErrorMessage({}); // Clear error messages if validation passes
        }

        try {
            const response = await axios.post('https://localhost:7078/api/Account/SignUp', newU);
            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Đăng ký thành công',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                });
                navigate('/SignIn'); // Redirect to sign in page after successful sign up
            }
        } catch (error) {
            setError('Lỗi khi đăng ký người dùng');
        }
    };

    return (
        <div className="SignUp-container">
            <div className="col-8 SignUp-Form">
                
                    <div className='col-6 content'>
                        <h2>Đăng Ký</h2>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <label className="col col-form-label">Tên Người Dùng:</label>
                            <div className="row mb-3">
                                <div className="col">
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
                            <label className="col col-form-label">Tên Tài Khoản:</label>
                            <div className="row mb-3">
                                <div className="col">
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
                            <label className="col col-form-label">Mật khẩu:</label>
                            <div className="row mb-3">
                                <div className="col">
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
                            <label className="col col-form-label">Xác nhận Mật khẩu:</label>
                            <div className="row mb-3">
                                <div className="col">
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
                            <label className="col col-form-label">Email:</label>
                            <div className="row mb-3">
                                <div className="col">
                                    <input
                                        type="email"
                                        value={newUser.email}
                                        onChange={handleChange}
                                        className={`form-control ${errorMessage.email ? 'is-invalid' : ''}`}
                                        name="email"
                                        required
                                    />
                                    {errorMessage.email && (
                                        <div className="invalid-feedback">
                                            {errorMessage.email}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary">Đăng Ký</button>
                        </form>
                        <form>
                            <p>Bạn Đã có tài khoản? <a href="/SignIn">Đăng Nhập</a></p>
                        </form>
                    </div>
                    <div className='col-6 image-container'>
                        <img src="https://tiki.vn/blog/wp-content/uploads/2023/10/bo-tri-phong-gon-gang-696x928.jpg" alt="SignUp" />
                    </div>


            </div>
        </div>
    );
};

export default SignIn;
