import React from 'react';
import '../../styles/user/payment.scss';
import { useLocation } from 'react-router-dom';

const Payment = () => {
    const location = useLocation();
    const { listCart, total } = location.state || { listCart: [], total: 0 };
    const firstItem = listCart[0] || {};


    return (
        <div className="payment-container">
            <div className="left-side">
                <h2>Thông tin giao hàng</h2>
                <form>
                    <input type="text" id="name" name="name" placeholder="Nhập họ và tên" />
                    <div className="inline-fields">
                        <input type="email" id="email" name="email" placeholder="Nhập email" />
                        <input type="tel" id="phone" name="phone" placeholder="Nhập số điện thoại" />
                    </div>
                </form>
                <br />
                <div className="form-container">
                    <form>
                        <input type="text" id="address" name="address" placeholder="Nhập địa chỉ" />
                        <div className="form-row">
                            <select id="province" name="province">
                                <option value="">Chọn tỉnh/thành</option>
                                <option value="hcm">Hồ Chí Minh</option>
                                <option value="hn">Hà Nội</option>
                            </select>
                        </div>
                        <div className="form-row">
                            <select id="district" name="district">
                                <option value="">Chọn quận/huyện</option>
                            </select>
                        </div>
                        <div className="form-row">
                            <select id="ward" name="ward">
                                <option value="">Chọn xã/phường</option>
                            </select>
                        </div>
                    </form>
                </div>
                <br />
                <h4>Phương thức thanh toán</h4>
                <div className="payment-methods">
                    <label>
                        <input type="radio" name="paymentMethod" value="cashOnDelivery" />
                        Thanh toán khi nhận hàng
                    </label>
                    <br />
                    <label>
                        <input type="radio" name="paymentMethod" value="bankTransfer" />
                        Chuyển khoản ngân hàng
                    </label>
                </div>
                <br />
                <button type="submit">Thanh toán</button>
            </div>
            <div className="right-side">
                <h2>Thông tin đơn hàng</h2>
                <div className="order-summary">
                    {listCart.map((item, index) => (
                        <div className="row product" key={index}>
                            <div className='col-md-4'>
                                <img src={item.hinh} alt={`img product ${index}`} className="img-fluid image-product" />
                            </div>
                            <div className='col-md-8'>
                                <span>Tên sản phẩm: {item.ten}</span>
                                <span>Giá: {item.loaiGiam ? (item.gia - ((item.gia * item.menhGia) / 100)).toLocaleString('vi-VN') + " đ" : (item.gia - item.menhGia).toLocaleString('vi-VN') + " đ"}</span>
                                <span>Size: {item.size}</span>
                            </div>
                        </div>
                    ))}
                    <div className="discount-input">
                        <input type="text" placeholder="Nhập mã giảm giá" />
                        <button className='text-center'><p >Áp dụng</p></button>
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
