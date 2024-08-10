import React, { useState, useEffect, useRef } from 'react';
import { Outlet } from "react-router-dom";
import NavHome from "./nav/NavHome";
import Slider from "./slider/Slider";
import Footer from "./footer/Footer";

const LayoutUser = (props) => {
    const [listCart, setListCart] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        // const test = [{
        //     id: 1,
        //     ten: "Bình hoa trang trí",
        //     trangThai: true,
        //     hinh: "https://firebasestorage.googleapis.com/v0/b/seabugdb-5f6f8.appspot.com/o/files%2Ff2485735-3994-407e-8b71-c6d1de5214b3?alt=media&token=e2511e1f-25dc-4638-8d52-b3ffff8c169f",
        //     gia: 150000,
        //     loaiGiam: true,
        //     menhGia: 10,
        //     size: "S",
        //     quantity: 10
        // },
        // {
        //     id: 2,
        //     ten: "Bình hoa trang trí",
        //     trangThai: true,
        //     hinh: "https://firebasestorage.googleapis.com/v0/b/seabugdb-5f6f8.appspot.com/o/files%2Ff2485735-3994-407e-8b71-c6d1de5214b3?alt=media&token=e2511e1f-25dc-4638-8d52-b3ffff8c169f",
        //     gia: 150000,
        //     loaiGiam: true,
        //     menhGia: 10,
        //     size: "S",
        //     quantity: 10
        // },
        // {
        //     id: 6,
        //     ten: "test",
        //     trangThai: true,
        //     hinh: "https://firebasestorage.googleapis.com/v0/b/seabugdb-5f6f8.appspot.com/o/files%2Ff2485735-3994-407e-8b71-c6d1de5214b3?alt=media&token=e2511e1f-25dc-4638-8d52-b3ffff8c169f",
        //     gia: 1000000,
        //     colorName: [],
        //     maGiamGia: null,
        //     loaiGiam: false,
        //     menhGia: 0,
        //     size: "S",
        //     quantity: 10
        // }
        // ];
        // localStorage.setItem('cart', JSON.stringify(test));
        const loadCart = localStorage.getItem('cart');
        if (loadCart && loadCart !== 'undefined') {
            setListCart(JSON.parse(loadCart));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(listCart));
        setTotal(calculateTotal());
    }, [listCart]);

    const calculateTotal = () => {
        return listCart.reduce((total, item) => {
            const subTotal = item.maGiamGia === null
                ? item.quantity * item.gia
                : (item.loaiGiam
                    ? item.quantity * (item.gia - (item.gia * item.menhGia / 100))
                    : item.quantity * (item.gia - item.menhGia));
            return total + subTotal;
        }, 0);
    };

    const handleAddCart = (product) => {
        setListCart(cart => {
            const cartExisting = cart.findIndex(x => x.id === product.id && x.size === product.size && x.color === product.color);
            if (cartExisting === -1) {
                const add = {
                    id: product.id,
                    ten: product.ten,
                    hinh: product.hinh,
                    gia: product.gia,
                    loaiGiam: product.loaiGiam,
                    menhGia: product.menhGia,
                    size: product.size,
                    quantity: product.quantity ? product.quantity : 1,
                    color: product.color
                };
                const list = [...cart, add];
                return list;
            }
            else {
                const listUpdate = cart.map((item, index) =>
                    index === cartExisting
                        ? { ...item, quantity: item.quantity += 1 }
                        : item
                );
                return listUpdate;
            }
        });
    };

    return (
        <>
            <NavHome
                listCart={listCart}
                setListCart={setListCart}
                total={total}
            />
            <Slider />
            <div className="container p-0">
                <Outlet
                    context={{
                        listCart,
                        setListCart,
                        total,
                        handleAddCart
                    }}
                />
            </div>
            <Footer />
        </>
    )
}

export default LayoutUser;