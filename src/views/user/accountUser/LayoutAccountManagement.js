import React, { useEffect, useState } from "react";
import '../../../styles/user/layoutAccountManagement/LayoutAccountManagement.scss';
import { Link, Outlet, useLocation, useOutletContext } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const LayoutAccountManagement = (props) => {
    const { handleAddCart } = useOutletContext();
    const location = useLocation();
    const [accountName, setAccountName] = useState("");
    const [linkPhoto, setLinkPhoto] = useState("");

    useEffect(() => {
        let token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/SignIn';
        }
        const user = jwtDecode(token);
        const userName = user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
        setLinkPhoto(user.Link);
        setAccountName(userName);
    });

    const handleBuy = (list) => {
        const cart = {};
        if (list) {
            list.map((item, index) => {
                cart.color = item.mauSac;
                cart.hinh = item.product.hinh;
                cart.id = item.product.id;
                cart.loaiGiam = item.product.discount.loaiGiam;
                cart.menhGia = item.product.discount.menhGia;
                cart.quantity = item.soLuong;
                cart.size = item.kichThuoc;
                cart.ten = item.product.ten;
                let arr = item.product.prDetail;
                if (arr) {
                    for (let i = 0; i < arr.length; i++) {
                        if (arr[i].color.tenMauSac === item.mauSac && arr[i].size.tenKichThuoc) {
                            cart.gia = arr[i].gia;
                            break;
                        }
                    }
                }
                handleAddCart(cart)
            })
        }
    }

    return (
        <div className="board">
            <div className="menu-bar">
                <div className="acc-content mb-3">
                    <img src={linkPhoto} alt="img account" />
                    <div className="account-name">
                        {accountName}
                    </div>
                </div>
                <ul className="menu">
                    <li className={`menu-item ${location.pathname.toLowerCase() === '/user' ? 'active' : ''}`}>
                        <Link to="/user" className="user-management">
                            Tài khoản của tôi
                        </Link>
                    </li>
                    <li className={`menu-item ${location.pathname.toLowerCase().includes('/user/order') ? 'active' : ''}`}>
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
                <Outlet
                    context={{
                        handleAddCart,
                        handleBuy
                    }}
                />
            </div>
        </div>
    );
}

export default LayoutAccountManagement;