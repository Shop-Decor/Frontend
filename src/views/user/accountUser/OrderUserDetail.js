import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import moment from 'moment';
import { jwtDecode } from "jwt-decode";
import {
    faMoneyCheckDollar,
    faTruckFast,
    faBox,
    faAngleLeft
} from "@fortawesome/free-solid-svg-icons";
import { useParams, Link, useOutletContext } from "react-router-dom";
import Loading from "../../loading/Loading";
import "../../../styles/user/layoutAccountManagement/OrderUserDetail.scss";

const OrderUserDetail = (props) => {

    const { handleBuy } = useOutletContext();
    const { id } = useParams();
    const [order, setOrder] = useState();

    const fetchOrder = async () => {
        try {
            let token = localStorage.getItem('token');
            const user = jwtDecode(token);
            const userId = user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
            let res = await axios.get(`https://localhost:7078/api/Order/user/detail?accountId=${userId}&orderId=${id}`);
            setOrder(res.data || []);
        } catch (error) {
            console.error(`Lỗi lấy dữ liệu api:`, error);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const formatDate = (dateString) => {
        return moment(dateString).format('DD/MM/YYYY HH:mm:ss');
    };

    if (!order) {
        return <Loading />
    }

    return (
        <>
            <div className="order-detail">
                <div className="h-order-detail">
                    <Link to='/user/order' className="btn-back"><FontAwesomeIcon icon={faAngleLeft} />Quay lại</Link>
                    <p className="order-id">
                        Mã đơn hàng: {order.id}
                    </p>
                </div>
                <div className="m-order-detail">
                    {order.ngayHuy ?
                        <div className="order-cancel">
                            <h3 className="cancel-content">Đã hủy đơn hàng</h3>
                            <p className="cancel-date">Vào {formatDate(order.ngayHuy)}</p>
                        </div>
                        :
                        <div className="order-status">
                            <div className="order-status-icon active">
                                <FontAwesomeIcon className="icon" icon={faMoneyCheckDollar} />
                                <p className="status-content">
                                    Chờ xác nhận
                                </p>
                            </div>
                            <div className={`order-status-line ${order.ttDonHang === 1 || order.ttDonHang === 2 ? "active" : ""}`}></div>
                            <div className={`order-status-icon ${order.ttDonHang === 1 || order.ttDonHang === 2 ? "active" : ""}`}>
                                <FontAwesomeIcon className="icon" icon={faTruckFast} />
                                <p className="status-content">
                                    Đang giao
                                </p>
                            </div>
                            <div className={`order-status-line ${order.ttDonHang === 2 ? "active" : ""}`}></div>
                            <div className={`order-status-icon ${order.ttDonHang === 2 ? "active" : ""}`}>
                                <FontAwesomeIcon className="icon" icon={faBox} />
                                <p className="status-content">
                                    Đã giao
                                </p>
                            </div>
                        </div>
                    }
                    {order.ttDonHang === 2 || order.ttDonHang === 3 ? (
                        <div className="cart-btn">
                            <a href="#" className="grow_skew_forward" onClick={() => handleBuy(order.detail)}>Mua lại</a>
                        </div>)
                        : (
                            <div className="cart-btn"></div>
                        )
                    }
                </div>
                <div className="f-order-detail">
                    <div className="order">
                        <div className="h-order"></div>
                        {order.detail && order.detail.length > 0 &&
                            order.detail.map((item, index) => (
                                <div className="m-order" key={item.id}>
                                    <div className="order-img">
                                        <img src={item.product.hinh} className="img-fluid" alt={`img-product-${index}`} />
                                    </div>
                                    <div className="order-content">
                                        <div className="content">
                                            <p className="name">
                                                {item.product.ten}
                                            </p>
                                            <div className="size-color">
                                                <p className="size">
                                                    {`Kích thước: ${item.kichThuoc}`}
                                                </p>
                                                <p className="color">
                                                    {`Màu: ${item.mauSac}`}
                                                </p>
                                            </div>
                                            <p className="quantity">
                                                {`X${item.soLuong}`}
                                            </p>
                                        </div>
                                        <div className="order-price">
                                            <span className="price">{`${item.giaSP} đ`}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                        <div className="f-order">
                            <div className="contact">
                                <h4 className="title">
                                    Địa chỉ nhận hàng
                                </h4>
                                <p className="name">
                                    {order.hoTen}
                                </p>
                                <p className="sdt">
                                    {order.sdt}
                                </p>
                                <p className="email">
                                    {order.email}
                                </p>
                                <p className="address">
                                    {order.diaChi}
                                </p>
                            </div>
                            <div className="total">
                                <table className="table table-money">
                                    <tbody>
                                        <tr>
                                            <td>Tiền hàng</td>
                                            <td>{`${(order.thanhTien) + (order.discount ? (order.discount.loaiGiam ? (order.thanhTien * order.discount.menhGia) / 100 : order.discount.menhGia) : 0)} đ`}</td>
                                        </tr>
                                        <tr>
                                            <td>Giảm giá</td>
                                            <td>{`${order.discount ? (order.discount.loaiGiam ? (order.thanhTien * order.discount.menhGia) / 100 : order.discount.menhGia) : 0} đ`}</td>
                                        </tr>
                                        <tr>
                                            <td>Thành tiền</td>
                                            <td className="money">{`${order.thanhTien}  đ`}</td>
                                        </tr>
                                        <tr>
                                            <td>Phương thức thanh thoán</td>
                                            <td>{order.ptThanhToan ? "Chuyển khoản ngân hàng" : "Thanh toán khi nhận hàng"}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OrderUserDetail;