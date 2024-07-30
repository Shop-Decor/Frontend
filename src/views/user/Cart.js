import React, { useEffect, useState } from "react";
import "../../styles/user/Cart.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faRotateLeft
} from "@fortawesome/free-solid-svg-icons";
import { useOutletContext } from 'react-router-dom';

const Cart = (props) => {

    const { listCart, setListCart, total } = useOutletContext();

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
                                    <React.Fragment key={item.id}>
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
                                                    <span className="price">{item.loaiGiam ? (item.gia - ((item.gia * item.menhGia) / 100)).toLocaleString('vi-VN') + " đ" : (item.gia - item.menhGia).toLocaleString('vi-VN') + " đ"}</span> <span className="priced">{item.gia.toLocaleString('vi-VN') + "đ"} </span>
                                                    <br />
                                                    <span className="size"> Size: {item.size} </span>
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
                            <button className="btn-pay">
                                <span className="pay-name">THANH TOÁN</span>
                            </button>
                            <br />
                            <span className="icon"><FontAwesomeIcon icon={faRotateLeft} className="icon-repurchase" /></span>
                            <span className="repurchase">Tiếp tục mua hàng</span>
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