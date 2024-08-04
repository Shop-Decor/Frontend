import React, { useState } from 'react';
import '../../styles/user/payment.scss';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Payment = () => {
    const location = useLocation();
    const { listCart, total } = location.state || { listCart: [], total: 0 };
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        paymentMethod: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const orderDetails = listCart.map(item => ({
            sanPhamId: item.id,
            soLuong: item.quantity,
            giaSP: item.loaiGiam ? item.gia - (item.gia * item.menhGia) / 100 : item.gia - item.menhGia,
            mauSac: item.color,
            kichThuoc: item.size,
        }));

        const orderData = {
            hoTen: formData.name,
            diaChi: formData.address,
            sdt: formData.phone,
            email: formData.email,
            orderDetails: orderDetails,
        };

        try {
            const response = await axios.post('https://localhost:7078/api/Order/CreateOrders', orderData);
            if (response.status === 200) {
                alert('Order created successfully');
            } else {
                alert('Failed to create order');
            }
        } catch (error) {
            console.error('Error creating order:', error);
            alert('An error occurred while creating the order');
        }
        console.log(listCart)
    };

    return (
        <div className="payment-container">
            <div className="left-side">
                <h2>Thông tin giao hàng</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Nhập họ và tên"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                    <div className="inline-fields">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Nhập email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            placeholder="Nhập số điện thoại"
                            value={formData.phone}
                            onChange={handleInputChange}
                        />
                    </div>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        placeholder="Nhập địa chỉ"
                        value={formData.address}
                        onChange={handleInputChange}
                    />
                    <h4>Phương thức thanh toán</h4>
                    <div className="payment-methods">
                        <label>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="cashOnDelivery"
                                checked={formData.paymentMethod === true}
                                onChange={handleInputChange}
                            />
                            Thanh toán khi nhận hàng
                        </label>
                        <br />
                        <label>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="bankTransfer"
                                checked={formData.paymentMethod === false}
                                onChange={handleInputChange}
                            />
                            Chuyển khoản ngân hàng
                        </label>
                    </div>
                    <button type="submit">Thanh toán</button>
                </form>
            </div>
            <div className="right-side">
                <h2>Thông tin đơn hàng</h2>
                <div className="order-summary">
                    {listCart.map((item, index) => (
                        <div className="row product" key={index}>
                            <div className="col-md-4">
                                <img src={item.hinh} alt={`img product ${index}`} className="img-fluid image-product" />
                            </div>
                            <div className="col-md-8">
                                <span>Tên sản phẩm: {item.ten}</span>
                                <span>
                                    Giá: {item.loaiGiam ? (item.gia - ((item.gia * item.menhGia) / 100)).toLocaleString('vi-VN') + "đ" : (item.gia - item.menhGia).toLocaleString('vi-VN') + " đ"}
                                    Số lượng: {item.quantity}
                                </span>
                                <span>Kích thước: {item.size} Màu sắc: {item.color}</span>
                            </div>
                        </div>
                    ))}
                    <div className="discount-input">
                        <input type="text" placeholder="Nhập mã giảm giá" />
                        <button className="text-center">
                            <p>Áp dụng</p>
                        </button>
                    </div>
                    <div className="total">
                        <span>Tổng tiền: {total.toLocaleString('vi-VN')} đ</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;
