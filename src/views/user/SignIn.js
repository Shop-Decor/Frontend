// Login.js
import React, { useState, useEffect } from 'react';
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap/dist/css/bootstrap.min.css";
import '../../styles/user/SignIn.scss'; // Nhập file SCSS
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { jwtDecode } from "jwt-decode"; // Import jwt-decode
import Swal from 'sweetalert2';
const SignIn = () => {
    const [userName, setItem] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Hook để chuyển hướng

    useEffect(() => {
        // Clear any existing token when the component mounts
        localStorage.removeItem('token');
    }, []);
    let token;
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('https://localhost:7078/api/Account/SignIn', {
                userName,
                password,
            });

            token = response.data; // Giả sử API trả về token dưới dạng chuỗi
            // console.log('Token:', token); // Log token // object {token: "abceldkfsdk"}
            // Lưu token vào localStorage
            localStorage.setItem('token', token.token); // string "abcedkfsdk"
            localStorage.setItem('user', JSON.stringify(token));
        
            
            // console.log('Token:', token.token);
            // Lấy thông tin user từ token
            const user = jwtDecode(token.token);
            let userU = user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
            let userRole = user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
            console.log('Role',userRole);
            console.log('User:', userU);
            localStorage.setItem('userU', userName);
            // console.log("Time", user.exp);
            // console.log((Date.now() - user.exp )< 0 );
            // console.log(Date.now());
            if (userRole === "Admin") {
                navigate('/admin');
            }
            else {
                navigate('/');
            }

            // Chuyển hướng đến trang Home

        } catch (err) {
           
            if (err.response) {
                // console.error('Response error:', err.response);
                setError('Đăng nhập thất bại, Vui lòng kiểm trả tài khoản và mật khẩu');
            } else if (err.request) {
                // console.error('Request error:', err.request);
                setError('không có phản hồi từ máy chủ, vui lòng thử lại sau.');
            } else {
                if (token.token === "1001") {
                    setError('Tài khoản không đúng');
                }
                else if (token.token === "1002") {
                    setError('Mật khẩu không đúng');
                }
                else if (token.token === "1003") {

                    Swal.fire({
                        icon: 'warning',
                        title: 'Ôi Không',
                        text: 'Tai khoản đã bị khóa',
                    });
                    setError('Tài khoản đã bị khóa');
                }
                else {
                    setError('Có lỗi xảy ra, vui lòng thử lại sau.');
                }

            }
        }
    };


    return (
        <div className="login-container">
            <div className="col-8 login-form">
                <div className='col-6 login-content'>
                    <form>
                        <h2>Đăng Nhập</h2>
                        <p>Nhập Email và Mật Khẩu để đăng nhập</p>
                    </form>
                    <form className="SignInGG">
                        <button type="button">
                            <FontAwesomeIcon icon={faGoogle} />
                            <label>Đăng nhập bằng Google</label>
                        </button>
                    </form>
                    <form onSubmit={handleSubmit}>
                        {error && <p className='text-'>{error}</p>}
                        <label>User Name:</label>
                        <input
                            type="userName"
                            value={userName}
                            onChange={(e) => setItem(e.target.value)}
                            required
                        />
                        <label>Mật khẩu*:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit">Đăng Nhập</button>
                    </form>
                    <form>
                        <p>Bạn chưa có tài khoản? <a href="/SignUp">Đăng Kí</a></p>
                    </form>
                </div>
                <div className='col-6 image-container'>
                    <img src="https://bizweb.dktcdn.net/thumb/1024x1024/100/351/312/products/set-9-tranh-treo-tuong-6797ccb4-6792-46dd-8ee2-6d4eb5775aa9.jpg?v=1627074882773" alt="hình ảnh" />
                </div>
            </div>

        </div>
    );


}

export default SignIn;