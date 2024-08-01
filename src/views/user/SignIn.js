// Login.js
import React, { useState } from 'react';
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap/dist/css/bootstrap.min.css";
import '../../styles/user/SignIn.scss'; // Nhập file SCSS
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { jwtDecode } from "jwt-decode"; // Import jwt-decode
const SignIn = () => {
    const [userName, setItem] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Hook để chuyển hướng

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
            // console.log('Token:', token.token);
            // Lấy thông tin user từ token
            const user = jwtDecode(token.token);
            // console.log("Time", user.exp);
            // console.log((Date.now() - user.exp )< 0 );
            // console.log(Date.now());
            if(user.aud === "Admin"){
                navigate('/admin');
            }
            else{
                navigate('/');
            }
            
            // Chuyển hướng đến trang Home
            
        } catch (err) {
        //    console.log(token.token);
            if (err.response) {
                // console.error('Response error:', err.response);
                setError('Đăng nhập thất bại, Vui lòng kiểm trả tài khoản và mật khẩu');
            } else if (err.request) {
                // console.error('Request error:', err.request);
                setError('không có phản hồi từ máy chủ, vui lòng thử lại sau.');
            } else {
                if(token.token === "1001"){
                    setError('Tài khoản không đúng');
                }
                else if(token.token === "1002"){
                    setError('Mật khẩu không đúng');
                }
                else{
                    setError('Có lỗi xảy ra, vui lòng thử lại sau.');
                }
                
            }
        }
    };


    return (
        <div className="login-container">
            <div className="col-6">
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
                    {error && <p>{error}</p>}
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
                    <p>Bạn chưa có tài khoản? <a href="/register">Đăng Kí</a></p>
                </form>
            </div>
        </div>
    );


}

export default SignIn;