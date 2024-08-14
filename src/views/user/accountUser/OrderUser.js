import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useOutletContext } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import '../../../styles/user/layoutAccountManagement/OrderUser.scss';
import { Modal, Button } from "react-bootstrap";
import Swal from 'sweetalert2';

const OrderUser = (props) => {
    const { handleBuy } = useOutletContext();
    const [orderAll, setOrderAll] = useState([]);
    const [order0, setOrder0] = useState([]);
    const [order1, setOrder1] = useState([]);
    const [order2, setOrder2] = useState([]);
    const [order3, setOrder3] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [reason, setReason] = useState("");

    const fetchOrder = async () => {
        try {
            let token = localStorage.getItem('token');
            const user = jwtDecode(token);
            const userId = user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
            let res = await axios.get(`https://localhost:7078/api/Order/user?accountId=${userId}`);
            setOrderAll(res.data || []);
            let res0 = await axios.get(`https://localhost:7078/api/Order/user?accountId=${userId}&status=0`);
            setOrder0(res0.data || []);
            let res1 = await axios.get(`https://localhost:7078/api/Order/user?accountId=${userId}&status=1`);
            setOrder1(res1.data || []);
            let res2 = await axios.get(`https://localhost:7078/api/Order/user?accountId=${userId}&status=2`);
            setOrder2(res2.data || []);
            let res3 = await axios.get(`https://localhost:7078/api/Order/user?accountId=${userId}&status=3`);
            setOrder3(res3.data || []);
        } catch (error) {
            console.error(`Lỗi lấy dữ liệu api orderuser:`, error);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, []);

    const status = (item) => {
        if (item === 0) {
            return "Chờ xác nhận";
        }
        if (item === 1) {
            return "Đang giao";
        }
        if (item === 2) {
            return "Đã giao";
        }
        if (item === 3) {
            return "Đã hủy";
        }
    }

    const fetchCancel = async () => {
        const params = {};
        let token = localStorage.getItem('token');
        const user = jwtDecode(token);
        const userId = user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        if (selectedOrderId) params.OrderId = selectedOrderId;
        if (reason) params.Reason = reason;
        if (userId) params.UserId = userId;

        try {
            let res = await axios.put('https://localhost:7078/api/Order/user/updateorder', params)
            console.log(res);
            if (res.status === 200 || res.status === 201) {
                if (res.data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: res.data.message,
                        timer: 2000,
                        timerProgressBar: true,
                        showConfirmButton: false,
                    });
                }
                else {
                    Swal.fire({
                        icon: 'warning',
                        title: res.data.message,
                        timer: 2000,
                        timerProgressBar: true,
                        showConfirmButton: false,
                    });
                }
            }
            else {
                Swal.fire({
                    title: 'Có lỗi xảy ra',
                    icon: 'error',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
            }

        } catch (error) {
            Swal.fire({
                title: 'Có lỗi xảy ra',
                icon: 'error',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false
            });
        }
    }

    const handleCancelOrder = () => {
        fetchCancel();
        setShowModal(false);
        fetchOrder();
    };

    const btnBuyAndCancel = (order) => {
        if (order.ttDonHang === 3 || order.ttDonHang === 2) {
            return (
                <a
                    href="#"
                    className="grow_skew_forward"
                    onClick={() => handleBuy(order.detail)}
                >
                    Mua lại
                </a>
            );
        }
        if (order.ttDonHang === 0 && order.ptThanhToan === false) {
            return (
                <a
                    href="#"
                    className="grow_skew_forward"
                    onClick={(e) => {
                        e.preventDefault();
                        setSelectedOrderId(order.id);
                        setShowModal(true);
                    }}
                >
                    Hủy đơn
                </a>
            );
        }
    };

    return (
        <>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận hủy đơn hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3 mt-3">
                        <label className="form-label">Lý do:</label>
                        <input type="text" className="form-control" value={reason} onChange={(e) => setReason(e.target.value)} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Đóng
                    </Button>
                    <Button variant="danger" onClick={() => handleCancelOrder()}>
                        Hủy đơn
                    </Button>
                </Modal.Footer>
            </Modal>
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
                    {orderAll && orderAll.length > 0 &&
                        orderAll.map((item, index) => (
                            <div className="order" key={`order${item.id}`}>
                                <div className="h-order">
                                    <div className={item === 2 ? "order-status-success" : "order-status"}>
                                        {status(item.ttDonHang)}
                                    </div>
                                </div>
                                {item.detail && item.detail.length > 0 &&
                                    item.detail.map((x, y) => (
                                        <Link to={`orderdetail/${item.id}`} className="link-detail" key={`orderDetail${x.id}`}>
                                            <div className="m-order">
                                                <div className="order-img">
                                                    <img src={x.product.hinh} className="img-fluid" alt={`img-product${y}`} />
                                                </div>
                                                <div className="order-content">
                                                    <div className="content">
                                                        <p className="name">
                                                            {x.product.ten}
                                                        </p>
                                                        <div className="size-color">
                                                            <p className="size">
                                                                {`Kích thước: ${x.kichThuoc}`}
                                                            </p>
                                                            <p className="color">
                                                                {`Màu: ${x.mauSac}`}
                                                            </p>
                                                        </div>
                                                        <p className="quantity">
                                                            {`X${x.soLuong}`}
                                                        </p>
                                                    </div>
                                                    <div className="order-price">
                                                        <span className="price">{x.giaSP} đ</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                }
                                <div className="f-order">
                                    <div className="total">
                                        <p>Thành tiền: <span>{item.thanhTien} đ</span></p>
                                    </div>
                                    <div className="cart-btn">
                                        {btnBuyAndCancel(item)}
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div id="status0" className="container tab-pane fade">
                    {order0 && order0.length > 0 &&
                        order0.map((item, index) => (
                            <div className="order" key={`order0${item.id}`}>
                                <div className="h-order">
                                    <div className={item === 2 ? "order-status-success" : "order-status"}>
                                        {status(item)}
                                    </div>
                                </div>
                                {item.detail && item.detail.length > 0 &&
                                    item.detail.map((x, y) => (
                                        <Link to={`orderdetail/${item.id}`} className="link-detail" key={`orderDetail0${x.id}`}>
                                            <div className="m-order">
                                                <div className="order-img">
                                                    <img src={x.product.hinh} className="img-fluid" alt={`img-product${y}`} />
                                                </div>
                                                <div className="order-content">
                                                    <div className="content">
                                                        <p className="name">
                                                            {x.product.ten}
                                                        </p>
                                                        <div className="size-color">
                                                            <p className="size">
                                                                {`Kích thước: ${x.kichThuoc}`}
                                                            </p>
                                                            <p className="color">
                                                                {`Màu: ${x.mauSac}`}
                                                            </p>
                                                        </div>
                                                        <p className="quantity">
                                                            {`X${x.soLuong}`}
                                                        </p>
                                                    </div>
                                                    <div className="order-price">
                                                        <span className="price">{x.giaSP} đ</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                }
                                <div className="f-order">
                                    <div className="total">
                                        <p>Thành tiền: <span>{item.thanhTien} đ</span></p>
                                    </div>
                                    <div className="cart-btn">
                                        {btnBuyAndCancel(item)}
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div id="status1" className="container tab-pane fade">
                    {order1 && order1.length > 0 &&
                        order1.map((item, index) => (
                            <div className="order" key={`order1${item.id}`}>
                                <div className="h-order">
                                    <div className={item === 2 ? "order-status-success" : "order-status"}>
                                        {status(item)}
                                    </div>
                                </div>
                                {item.detail && item.detail.length > 0 &&
                                    item.detail.map((x, y) => (
                                        <Link to={`orderdetail/${item.id}`} className="link-detail" key={`orderDetail1${x.id}`}>
                                            <div className="m-order" >
                                                <div className="order-img">
                                                    <img src={x.product.hinh} className="img-fluid" alt={`img-product${y}`} />
                                                </div>
                                                <div className="order-content">
                                                    <div className="content">
                                                        <p className="name">
                                                            {x.product.ten}
                                                        </p>
                                                        <div className="size-color">
                                                            <p className="size">
                                                                {`Kích thước: ${x.kichThuoc}`}
                                                            </p>
                                                            <p className="color">
                                                                {`Màu: ${x.mauSac}`}
                                                            </p>
                                                        </div>
                                                        <p className="quantity">
                                                            {`X${x.soLuong}`}
                                                        </p>
                                                    </div>
                                                    <div className="order-price">
                                                        <span className="price">{x.giaSP} đ</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                }
                                <div className="f-order">
                                    <div className="total">
                                        <p>Thành tiền: <span>{item.thanhTien} đ</span></p>
                                    </div>
                                    <div className="cart-btn">
                                        {btnBuyAndCancel(item)}
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div id="status2" className="container tab-pane fade">
                    {order2 && order2.length > 0 &&
                        order2.map((item, index) => (
                            <div className="order" key={`order2${item.id}`}>
                                <div className="h-order">
                                    <div className={item === 2 ? "order-status-success" : "order-status"}>
                                        {status(item)}
                                    </div>
                                </div>
                                {item.detail && item.detail.length > 0 &&
                                    item.detail.map((x, y) => (
                                        <Link to={`orderdetail/${item.id}`} className="link-detail" key={`orderDetail2${x.id}`}>
                                            <div className="m-order" key={`orderDetail2${x.id}`}>
                                                <div className="order-img">
                                                    <img src={x.product.hinh} className="img-fluid" alt={`img-product${y}`} />
                                                </div>
                                                <div className="order-content">
                                                    <div className="content">
                                                        <p className="name">
                                                            {x.product.ten}
                                                        </p>
                                                        <div className="size-color">
                                                            <p className="size">
                                                                {`Kích thước: ${x.kichThuoc}`}
                                                            </p>
                                                            <p className="color">
                                                                {`Màu: ${x.mauSac}`}
                                                            </p>
                                                        </div>
                                                        <p className="quantity">
                                                            {`X${x.soLuong}`}
                                                        </p>
                                                    </div>
                                                    <div className="order-price">
                                                        <span className="price">{x.giaSP} đ</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                }
                                <div className="f-order">
                                    <div className="total">
                                        <p>Thành tiền: <span>{item.thanhTien} đ</span></p>
                                    </div>
                                    <div className="cart-btn">
                                        {btnBuyAndCancel(item)}
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div id="status3" className="container tab-pane fade">
                    {order3 && order3.length > 0 &&
                        order3.map((item, index) => (
                            <div className="order" key={`order3${item.id}`}>
                                <div className="h-order">
                                    <div className={item === 2 ? "order-status-success" : "order-status"}>
                                        {status(item)}
                                    </div>
                                </div>
                                {item.detail && item.detail.length > 0 &&
                                    item.detail.map((x, y) => (
                                        <Link to={`orderdetail/${item.id}`} className="link-detail" key={`orderDetail3${x.id}`}>
                                            <div className="m-order" >
                                                <div className="order-img">
                                                    <img src={x.product.hinh} className="img-fluid" alt={`img-product${y}`} />
                                                </div>
                                                <div className="order-content">
                                                    <div className="content">
                                                        <p className="name">
                                                            {x.product.ten}
                                                        </p>
                                                        <div className="size-color">
                                                            <p className="size">
                                                                {`Kích thước: ${x.kichThuoc}`}
                                                            </p>
                                                            <p className="color">
                                                                {`Màu: ${x.mauSac}`}
                                                            </p>
                                                        </div>
                                                        <p className="quantity">
                                                            {`X${x.soLuong}`}
                                                        </p>
                                                    </div>
                                                    <div className="order-price">
                                                        <span className="price">{x.giaSP} đ</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                }
                                <div className="f-order">
                                    <div className="total">
                                        <p>Thành tiền: <span>{item.thanhTien} đ</span></p>
                                    </div>
                                    <div className="cart-btn">
                                        {btnBuyAndCancel(item)}
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </>
    )
}

export default OrderUser;