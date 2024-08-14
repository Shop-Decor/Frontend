import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from 'sweetalert2';
import axios from "axios";
import { useOutletContext, useNavigate, Link } from 'react-router-dom';
import {
    faRotateLeft
} from "@fortawesome/free-solid-svg-icons";
import "../../styles/user/Cart.scss";


const Cart = (props) => {
    const { listCart, setListCart, total } = useOutletContext();
    const navigate = useNavigate();
    const [product, setProduct] = useState([]);
    const fetchProducts = async () => {
        try {
            let res = await axios.get("https://localhost:7078/api/ProductDetails/details");
            setProduct(res.data || []);
        } catch (error) {
            console.error('Lỗi lấy dữ liệu api:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleCheckout = () => {
        const invalidItem = listCart.find((cartItem, index) => {
            const matchingProduct = product.find(productItem =>
                productItem.productId === cartItem.id
            );

            if (matchingProduct) {
                const matchingDetail = matchingProduct.chiTietSanPham.find(detail =>
                    detail.color === cartItem.color && detail.size === cartItem.size
                );
                const currentQuantity = +cartItem.quantity;
                return matchingDetail && currentQuantity > matchingDetail.quantity;
            }

            return false;
        });

        if (invalidItem) {
            Swal.fire({
                title: 'Cảnh báo',
                text: `Số lượng của sản phẩm vượt quá số lượng tồn kho`,
                icon: 'warning',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false
            });
        } else {
            navigate('/Payment', { state: { listCart, total } });
        }
    };


    const handleChangeQuantity = (event, index) => {
        setListCart(cart => {
            const list = [...cart];
            if (Number.isFinite(+event.target.value) && event.target.value > 0) {
                list[index].quantity = event.target.value;
            }
            else {
                list[index].quantity = 1;
            }
            return list;
        });
    };

    const handleDecreaseQuantity = (index) => {
        setListCart(cart => {
            const list = [...cart];
            if (list[index].quantity > 1) {
                list[index].quantity -= 1;
            }
            return list;
        });
    };

    const handleIncreaseQuantity = (index) => {
        setListCart(cart => {
            const list = [...cart];
            list[index].quantity += 1;
            return list;
        });
    };

    useEffect(() => {
        console.log(window.location.search);
        const checkPaymentStatus = async () => {
            try {
                const response = await axios.get('https://localhost:7078/api/Payment/vnpay-return' + window.location.search);
                if (response.data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: response.data.message,
                        timer: 2000,
                        timerProgressBar: true,
                        showConfirmButton: false,
                    });
                } else {
                    Swal.fire({
                        icon: 'warning',
                        title: response.data.message,
                        timer: 2000,
                        timerProgressBar: true,
                        showConfirmButton: false,
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
        };

        // Kiểm tra xem có các tham số truy vấn cần thiết không
        if (window.location.search) {
            checkPaymentStatus();
        } else {
            console.log('Không có dữ liệu thanh toán.');
        }
    }, []);

    return (
        <>
            <div className="containercart">
                <div className="contai-cart">
                    <div className="row rowlinks">
                        <div className="col-md-1 rowlines">
                            <div className="vertical-thick-line"></div>
                        </div>
                        <div className="col-md-11 links">
                            <div className="linkcarts">Trang chủ / Giỏ hàng</div>
                        </div>
                    </div>
                </div>
                <div className="mycart">
                    Giỏ hàng của bạn
                </div>
                <div className="short-thick-line"></div>
                <div className="row cart-main">
                    <div className="col-md-8 row-cart">
                        {listCart && listCart.length > 0 ?
                            listCart.map((item, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <div className="row row-cart-item">
                                            <div className="col-md-2 cart-item">
                                                <div className="image-product-cart">
                                                    <img src={item.hinh} alt={"img product " + index} className="image-product" />
                                                </div>
                                            </div>
                                            <div className="col-md-10">
                                                <div className="cart-product-item">
                                                    <span className="nameproduct">{item.ten}</span>
                                                    <br />
                                                    <span className="price">{item.loaiGiam ? (item.gia - ((item.gia * item.menhGia) / 100)).toLocaleString('vi-VN') + " đ" : (item.gia - item.menhGia).toLocaleString('vi-VN') + " đ"}</span>
                                                    <span className="priced">{item.maGiamGia === null ? "" : item.gia.toLocaleString('vi-VN') + " đ"} </span>
                                                    <br />
                                                    <span className="size"> Kích thước: {item.size} </span>
                                                    <span className="ms-2">Màu: {item.color}</span>
                                                    <br />
                                                    <div className="quantity">
                                                        <button className="apart-from" onClick={() => handleDecreaseQuantity(index)}>
                                                            -
                                                        </button>
                                                        <input className="value-quantity" value={item.quantity} onChange={(event) => handleChangeQuantity(event, index)} />
                                                        <button className="add" onClick={() => handleIncreaseQuantity(index)}>
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <hr />
                                    </React.Fragment>
                                )
                            }) :
                            <p>Giỏ hàng của bạn hiện tại không có sản phẩm nào.</p>
                        }
                    </div>
                    <div className="col-md-4 infomationtocart">
                        <div className="infomation-cart">
                            <br />
                            <span className="infomation">Thông tin đơn hàng</span>
                            <br />
                            <div className="cracked-line"></div>
                            <span className="total-amount-name">Tổng tiền: </span> <span className="total-amount">{total.toLocaleString('vi-VN')} đ</span>
                            <br />
                            <div className="cracked-line"></div>
                            <button className="btn-pay" onClick={handleCheckout}>
                                <span className="pay-name">THANH TOÁN</span>
                            </button>
                            <br />
                            <span className="icon"><FontAwesomeIcon icon={faRotateLeft} className="icon-repurchase" /></span>
                            <Link to={"/ProductUser"}><span className="repurchase">Tiếp tục mua hàng</span></Link>
                        </div>
                    </div>
                </div>
                <div className="note-cart">
                    <span className="note-name">Ghi chú đơn hàng</span>
                    <br />
                    <textarea className="note-write"></textarea>
                </div>
            </div>
        </>
    );
}

export default Cart;