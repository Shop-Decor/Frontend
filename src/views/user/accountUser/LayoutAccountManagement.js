import React from "react";
import '../../../styles/user/layoutAccountManagement/LayoutAccountManagement.scss';
import logo from '../../../assets/images/sp1.png';
import { Link, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const LayoutAccountManagement = (props) => {
    if (localStorage.getItem('token') === null) {
        window.location.href = '/SignIn';
    }
    let token = localStorage.getItem('token');
    const user = jwtDecode(token);
    const userName = user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
    return (
        <div className="board">
            <div className="menu-bar">
                <div className="acc-content mb-3">
                    <img src={logo} alt="img account" />
                    <div className="account-name">
                       {userName}
                    </div>
                </div>
                <ul className="menu">
                    <li className="menu-item active">
                        <Link to="/UserDetail" className="user-management">
                            Tài khoản của tôi
                        </Link>
                    </li>
                    <li className="menu-item">
                        <Link to="/user/order" className="user-management">
                            Đơn mua
                        </Link>
                    </li>
                    <li className="menu-item">
                        <Link to="/SignIn" className="user-management">
                            Đăng xuất
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="display">
                <Outlet />
            </div>
        </div>
    );
}

export default LayoutAccountManagement;