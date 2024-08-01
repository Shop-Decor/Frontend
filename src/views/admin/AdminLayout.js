import React from "react";
import '../../styles/admin/ADhome.scss';
import logo from '../../assets/images/shopdecor.png';
import { Link, Outlet } from "react-router-dom";

class AdminLayout extends React.Component {
    render() {
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
                                <li className="menu-item"><Link  to="/admin/ADCategory">Danh mục</Link></li>
                                <li className="menu-item">Thống kê</li>
                                <li className="menu-item"><Link  to="/admin/ADOrder">Đơn hàng</Link></li>
                                <li className="menu-item">  <Link to="/admin/product">SAN PHAM</Link></li>
                                <li className="menu-item">Người dùng</li>
                                <Link className="menu-item" to="/admin/test">test</Link>
                                <li className="menu-item"> <Link to="/admin/discount">khuyến mãi</Link></li>
                                <li className="menu-item">Đăng xuất</li>
                            </ul>
                        </div>
                        <div className="col-sm-10 ad-display p-0">
                            <div className="ad-header">
                                <ul className="nav-menu">
                                    <li className="nav-menu-item dropdown">
                                        <div className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        </div>
                                        <ul className="dropdown-menu">
                                            <li><Link to="#" className="dropdown-item-ed" asp-area="">Đăng xuất</Link></li>
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