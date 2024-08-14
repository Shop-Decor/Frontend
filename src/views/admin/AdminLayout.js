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
        //console.log(user.iss);
        const userId = user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
       // console.log(user);
       // console.log(user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]);
        const userName = user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
        const userRole = user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        if (userRole !== "Admin") {
            window.location.href = '/';
        }
        return (
            <div className="web-body">
                <div className="container-fluid admin-board">
                    <div className="row">
                        <div className="col-sm-2 menu-bar p-0">
                            <div className="logo mb-3">
                                <img src={logo} className="img-fluid" alt="Logo" />
                            </div>
                            <ul className="menu">
                                <li className="menu-item active">
                                    <Link to="/admin/ADStatistics" className="admin-management">
                                        Thống kê
                                    </Link>
                                </li>
                                <li className="menu-item">
                                    <Link className="admin-management" to="/admin/ADCategory">
                                        Danh mục
                                    </Link>
                                </li>
                                <li className="menu-item">
                                    <Link to="/admin/ADOrder" className="admin-management">
                                        Đơn hàng
                                    </Link>
                                </li>
                                <li className="menu-item">
                                    <Link to="/admin/product" className="admin-management">
                                        Sản phẩm
                                    </Link>
                                </li>
                                <li className="menu-item">
                                    <Link to="/admin/ADAccount" className="admin-management">
                                        Người Dùng
                                    </Link>
                                </li>
                                <li className="menu-item">
                                    <Link to="/admin/discount" className="admin-management">
                                        khuyến mãi
                                    </Link>
                                </li>
                                <li className="menu-item">
                                    <Link to="/SignIn" className="admin-management">
                                        Đăng xuất
                                    </Link>
                                </li>

                                <Link className="menu-item" to="/admin/test">test</Link>

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