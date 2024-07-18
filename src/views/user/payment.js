import React from "react";
import '../../styles/user/payment.scss';

class Payment extends React.Component {
    render() {
        return (
            <div className="payment-container">
                <div className="left-side">
                    <h2>Thông tin giao hàng</h2>

                    <form>
                        {/* <label htmlFor="name">Họ và tên:</label> */}
                        <input type="text" id="name" name="name" placeholder="Nhập họ và tên" />

                        <div class="inline-fields">
                            {/* <label htmlFor="email">Email:</label> */}
                            <input type="email" id="email" name="email"  placeholder="Nhập email" />

                            {/* <label htmlFor="phone">SĐT:</label> */}
                            <input type="tel" id="phone" name="phone"  placeholder="Nhập số điện thoại" />
                        </div>
                    </form>
                    <br></br>

                    <div className="form-container">
                        <form>
                        <input type="text" id="address" name="address" placeholder="Nhập địa chỉ" />

                            <div className="form-row">

                                <select id="province" name="province">
                                    <option value="">Chọn tỉnh/thành </option>
                                    <option value="hcm">Hồ Chí Minh</option>
                                    <option value="hn">Hà Nội</option>
                                </select>
                            </div>

                            <div className="form-row">

                                <select id="district" name="district">
                                    <option value="">Chọn quận/huyện</option>
                                </select>
                            </div>

                            <div claclassNamess="form-row">

                                <select id="ward" name="ward">
                                    <option value="">Chọn xã/phường</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <br></br>
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
                    <br></br>


                    <button type="submit">Thanh toán</button>

                </div>

                <div className="right-side">
                    <h2>Thông tin đơn hàng</h2>

                    <div className="order-summary">
                        <div className="product">
                        img
                            <span>Tên sản phẩm 1</span>
                            <span>Giá: 100,000 VNĐ</span>
                            <span>Size</span>
                        </div>
                        <div className="discount-input">

                            <input type="text" placeholder="Nhập mã giảm giá" />
                            <button1>Áp dụng</button1>
                        </div>

                        <div className="total">
                        <span>Tổng tiền: 300,000 VNĐ</span>
                    </div>
                    </div>


                   


                </div>
            </div>
        );
    }
}

export default Payment;
