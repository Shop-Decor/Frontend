import React, { useState, useEffect } from "react";
import '../../../styles/user/layoutAccountManagement/OrderUser.scss';
import '../../../styles/user/btn/btn.scss';
import logo from '../../../assets/images/sp1.png';

const OrderUser = (props) => {
    return (
        <>
            <ul className="nav nav-pills" role="tablist">
                <li className="nav-item">
                    <a className="nav-link active" data-bs-toggle="pill" href="#all">Tất cả</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" data-bs-toggle="pill" href="#status0">Chờ xác nhận</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" data-bs-toggle="pill" href="#status1">Đang giao</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" data-bs-toggle="pill" href="#status2">Đã giao</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" data-bs-toggle="pill" href="#status3">Đã hủy</a>
                </li>
            </ul>
            <div className="tab-content">
                <div id="all" className="container tab-pane active">
                    <div className="order">
                        <div className="h-order">
                            <div className="order-status">
                                Giao thành công
                            </div>
                        </div>
                        <div className="m-order">
                            <div className="order-img">
                                <img src={logo} className="img-fluid" alt="order" />
                            </div>
                            <div className="order-content">
                                <div className="content">
                                    <p className="name">
                                        Kem chống nắng Anjo Hàn Quốc dưỡng ẩm, dịu nhẹ và bảo vệ da Professional SPF 50+PA+++ 365 Sun Cream 70g NPP Shoptido
                                    </p>
                                    <div className="size-color">
                                        <p className="size">
                                            Kích thước: S
                                        </p>
                                        <p className="color">
                                            Màu: Đỏ
                                        </p>
                                    </div>
                                    <p className="quantity">
                                        x1
                                    </p>
                                </div>
                                <div className="order-price">
                                    <span className="price">79000 đ</span>
                                </div>
                            </div>
                        </div>
                        <div className="f-order">
                            <div className="total">
                                <p>Thành tiền: <span>1000000 đ</span></p>
                            </div>
                            <div className="cart-btn">
                                <a href="#" className="grow_skew_forward">Hủy đơn</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="status0" className="container tab-pane fade">
                    <h3>Menu 0</h3>
                    <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                </div>
                <div id="status1" className="container tab-pane fade">
                    <h3>Menu 1</h3>
                    <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.</p>
                </div>
                <div id="status2" className="container tab-pane fade">
                    <h3>Menu 2</h3>
                    <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.</p>
                </div>
                <div id="status3" className="container tab-pane fade">
                    <h3>Menu 2</h3>
                    <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.</p>
                </div>
            </div>
        </>
    )
}

export default OrderUser;