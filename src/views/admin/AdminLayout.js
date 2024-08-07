import React from "react";
import '../../styles/admin/ADhome.scss';
import logo from '../../assets/images/shopdecor.png';
import { Link, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
class AdminLayout extends React.Component {
    render() {
        if (localStorage.getItem('token') === null) {
            window.location.href = '/SignIn';
        }
        let token = localStorage.getItem('token');
        const user = jwtDecode(token);
        console.log(user.iss);
        const userId = user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        console.log(userId);
        console.log(user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]);
        const userName = user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
        return (
            <div className="web-body">
                <div className="container-fluid admin-board">
                    <div className="row">
                        <div className="col-sm-2 menu-bar p-0">
                            <div className="logo mb-3">
                                <img src={logo} className="img-fluid" alt="Logo" />
                            </div>
                            <ul className="menu">
                                <li className="menu-item active">Trang chủ</li>

                                <Link className="menu-item" to="/admin/ADCategory">Danh mục</Link>

                                <Link  to="/admin/ADStatistics">
                                    <li className="menu-item">Thống kê</li>   
                                </Link>
                                <Link to="/admin/ADOrder">
                                  <li className="menu-item">Đơn hàng</li>
                                </Link>                                
                                <Link to="/admin/product">
                                    <li className="menu-item">Sản phẩm</li>
                                </Link>
                                
                                <li className="menu-item">
                                  <Link to="/admin/ADAccount">Người Dùng</Link>
                                </li>
                                <Link className="menu-item" to="/admin/test">test</Link>
                                <Link to="/admin/discount">
                                  <li className="menu-item">khuyến mãi</li>
                                </Link>
                                <Link to="/SignIn">
                                  <li className="menu-item">Đăng xuất</li>
                                </Link>
                               
                            </ul>
                        </div>
                        <div className="col-sm-10 ad-display p-0">
                            <div className="ad-header">
                                <ul className="nav-menu">
                                    <li>
                                        {userName}
                                    </li>
                                    <li className="nav-menu-item dropdown">
                                        <div className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        </div>
                                        <ul className="dropdown-menu">
                                            <li><Link to="/admin/ADDetailAccount" className="dropdown-item-ed" asp-area="">Tài Khoản</Link></li>
                                            <li><Link to="/SignIn" className="dropdown-item-ed" asp-area="">Đăng xuất</Link></li>
                                        </ul>
                                      
                                    </li>
                                </ul>
                            </div>
                            <div className="ad-content">
                                <Outlet />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default AdminLayout;