import React from "react";
import '../../../styles/user/layoutAccountManagement/LayoutAccountManagement.scss';
import logo from '../../../assets/images/sp1.png';
import { Link, Outlet } from "react-router-dom";

const LayoutAccountManagement = (props) => {
    return (
        <div className="board">
            <div className="menu-bar">
                <div className="acc-content mb-3">
                    <img src={logo} alt="img account" />
                    <div className="account-name">
                        dungho2209
                    </div>
                </div>
                <ul className="menu">
                    <li className="menu-item active">
                        <Link to="/user/account" className="user-management">
                            Tài khoản của tôi
                        </Link>
                    </li>
                    <li className="menu-item">
                        <Link to="/user/order" className="user-management">
                            Đơn mua
                        </Link>
                    </li>
                    <li className="menu-item">
                        <Link to="/" className="user-management">
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