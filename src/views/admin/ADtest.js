import React, { useState, useEffect, useRef } from 'react';
import "../../styles/admin/ADTest.scss";

const ADtest = () => {
    const [isCartVisible, setIsCartVisible] = useState(false);
    const cartRef = useRef(null);
    const cartIconRef = useRef(null);

    const [listCart, setListCart] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const test = [{
            id: 1,
            ten: "Bình hoa trang trí",
            trangThai: true,
            hinh: "https://firebasestorage.googleapis.com/v0/b/seabugdb-5f6f8.appspot.com/o/files%2Ff2485735-3994-407e-8b71-c6d1de5214b3?alt=media&token=e2511e1f-25dc-4638-8d52-b3ffff8c169f",
            gia: 150000,
            loaiGiam: true,
            menhGia: 10,
            size: "S",
            quantity: 10
        },
        {
            id: 2,
            ten: "Bình hoa trang trí",
            trangThai: true,
            hinh: "https://firebasestorage.googleapis.com/v0/b/seabugdb-5f6f8.appspot.com/o/files%2Ff2485735-3994-407e-8b71-c6d1de5214b3?alt=media&token=e2511e1f-25dc-4638-8d52-b3ffff8c169f",
            gia: 150000,
            loaiGiam: true,
            menhGia: 10,
            size: "S",
            quantity: 10
        }];
        localStorage.setItem('cart', JSON.stringify(test));
        const loadCart = localStorage.getItem('cart');
        if (loadCart && loadCart !== 'undefined') {
            setListCart(JSON.parse(loadCart));
        }
    }, []);

    const calculateTotal = () => {
        return listCart.reduce((total, item) => {
            const subTotal = item.loaiGiam
                ? item.quantity * (item.gia - (item.gia * item.menhGia / 100))
                : item.quantity * (item.gia - item.menhGia);
            return total + subTotal;
        }, 0);
    };

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(listCart));
        setTotal(calculateTotal());
    }, [listCart]);

    const toggleCart = (e) => {
        e.stopPropagation();
        setIsCartVisible((prev) => !prev);
    };

    const handleClickOutside = (e) => {
        if (isCartVisible && cartRef.current && !cartRef.current.contains(e.target) && !cartIconRef.current.contains(e.target)) {
            setIsCartVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isCartVisible]);

    return (
        <>
            <nav>
                <div className="container">
                    <ul className="navbar-left">
                        <li><a href="#">Trang chủ</a></li>
                        <li><a href="#about">Giới thiệu</a></li>
                    </ul>

                    <ul className="navbar-right">
                        <li>
                            <a href="#" id="cart" onClick={toggleCart} ref={cartIconRef}>
                                <i className="fa fa-shopping-cart"></i> Giỏ hàng {listCart.length > 0 && <span className="badge">{listCart.length}</span>}
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>

            {isCartVisible && (
                <div className="container" ref={cartRef}>
                    <div className="shopping-cart">
                        <ul className="shopping-cart-items">
                            {listCart && listCart.length > 0 ?
                                listCart.map((item, index) => {
                                    return (
                                        <React.Fragment key={item.id}>
                                            <li className="product-mini-cart">
                                                <div className="col img-mini-cart">
                                                    <img className="img-fluid" src={item.hinh} alt={"img product " + index} />
                                                </div>
                                                <div className="col content-mini-cart">
                                                    <div className="item-name">{item.ten}</div>
                                                    <div className="item-number d-flex justify-content-between">
                                                        <span className="item-quantity">{item.quantity}</span>
                                                        <span className="item-price">{item.loaiGiam ? (item.gia - ((item.gia * item.menhGia) / 100)).toLocaleString('vi-VN') + " đ" : (item.gia - item.menhGia).toLocaleString('vi-VN') + " đ"}</span>
                                                    </div>
                                                </div>
                                            </li>
                                        </React.Fragment>
                                    )
                                }) :
                                <p>Chưa có sản phẩm</p>
                            }
                            <li className="shopping-cart-footer d-flex justify-content-between">
                                <div className="lighter-text">Tổng cộng: </div>
                                <div className="main-color-text">{total.toLocaleString('vi-VN')} đ</div>
                            </li>
                        </ul>
                        <div className="cart-btn">
                            <a href="#" className="button">Xem giỏ hàng</a>
                            <a href="#" className="button">Thanh toán</a>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ADtest;