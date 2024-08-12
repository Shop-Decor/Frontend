import React, { useState, useRef, useEffect } from 'react';
import '../../styles/user/payment.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { jwtDecode } from "jwt-decode";


const CopyButton = ({ discountCode }) => {
    const copyInputRef = useRef(null);
    const [buttonText, setButtonText] = useState("COPIE");

    const copyToClipboard = () => {
        if (copyInputRef.current) {
            navigator.clipboard.writeText(copyInputRef.current.value)
                .then(() => {
                    setButtonText("COPIED");
                })
                .catch((err) => {
                    console.error("Sao chép thất bại: ", err);
                });
        }
    };

    return (
        <div className="copy-button">
            <input
                id="copyvalue"
                type="text"
                readOnly
                value={discountCode}
                ref={copyInputRef}
            />
            <button onClick={copyToClipboard} className="copybtn">
                {buttonText}
            </button>
        </div>
    );
};

const Payment = () => {
    const navigate = useNavigate();
    const location = useLocation();



    const { listCart, total } = location.state || { listCart: [], total: 0 };
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        paymentMethod: null,
        totalmoney: ''
    });

    const [appliedDiscountCode, setAppliedDiscountCode] = useState('');
    const [enteredDiscountCode, setEnteredDiscountCode] = useState('');
    const [finalTotal, setFinalTotal] = useState(total);


    const handleDiscountChange = (e) => {
        setEnteredDiscountCode(e.target.value);
    };

    const applyDiscount = () => {
        if (appliedDiscountCode === enteredDiscountCode) {
            alert('Mã giảm giá đã được áp dụng rồi');
            return;
        }

        const discount = discountData.find(d => d.maGiamGia === enteredDiscountCode);

        if (discount) {
            let newTotal = total;
            if (discount.loaiGiam) {
                newTotal = total - (total * discount.menhGia / 100);
            } else {
                newTotal = total - discount.menhGia;
            }
            setFinalTotal(newTotal);
            setAppliedDiscountCode(enteredDiscountCode);
            alert('Mã giảm giá đã được áp dụng');
        } else {
            alert('Mã khuyến mãi không khả dụng');
        }
    };

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    }

    const [discountData, setDiscountData] = useState([]);


    useEffect(() => {
        const fetchDiscountData = async () => {
            try {
                const response = await axios.get('https://localhost:7078/api/discount');
                setDiscountData(response.data);
            } catch (error) {
                console.error('Truyền thông tin khuyến mãi thất bại:', error);
            }
        };

        fetchDiscountData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'paymentMethod') {
            setFormData({ ...formData, paymentMethod: value === 'COD' });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        let token = localStorage.getItem('token');
        if (!token || typeof token !== 'string') {
            Swal.fire({
                title: 'Đăng nhập',
                text: 'Bạn phải đăng nhập để thanh toán',
                icon: 'warning',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false
            });
            navigate('/SignIn')
            return;

        }

        const user = jwtDecode(token);
        const userId = user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        console.log(userId)



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
            TTThanhToan: formData.paymentMethod,
            orderDetails: orderDetails,
            ThanhTien: finalTotal,
            userId: userId
        };

        try {
            if (formData.paymentMethod === true) { // COD
                const response = await axios.post('https://localhost:7078/api/Order/CreateOrders', orderData);
                if (response.status === 200) {
                    alert('Order created successfully');
                } else {
                    alert('Failed to create order');
                }
            } else { // VnPay

                const response = await axios.post('https://localhost:7078/api/Order/CreateOrders', orderData);
                console.log(response)

                const vnpay = await axios.post('https://localhost:7078/api/Payment/create-order', {

                    Amount: finalTotal,
                    Id: response.data
                });
                if (vnpay.status === 200) {
                    window.location.href = vnpay.data.url; // Redirect to VnPay payment URL
                } else {
                    Swal.fire({
                        title: 'Chưa thanh toán',
                        text: 'Thanh toán thất bại',
                        icon: 'error',
                        timer: 2000,
                        timerProgressBar: true,
                        showConfirmButton: false
                    });
                    navigate('/payment')
                    if (response.status === 200) {
                        localStorage.removeItem('cart')
                    }
                    else {
                        localStorage.removeItem('cart')
                    }
                }


            }
        } catch (error) {
            console.error('Error creating order:', error);
            alert('An error occurred while creating the order');
        }
    };
    return (
        <>
            <div className="payment-container my-4">
                <div className="modal" id="myModal">
                    <div className="modal-dialog modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Mã khuyến mãi</h4>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body">
                                {discountData.filter(x => !x.loaiKM).map((item, index) => {
                                    return (
                                        <React.Fragment key={index}>
                                            <div className="card">
                                                <div className="main">
                                                    <div className="co-img">
                                                        <img src="https://i.pinimg.com/originals/c7/84/67/c78467db9ff497393cb548a48f02d451.png" alt="" />
                                                    </div>
                                                    <div className="content">
                                                        <h2>{item.moTa}</h2>
                                                        <h1>{item.menhGia}{item.loaiGiam === true ? '%' : 'vnđ'}<span> Giảm</span></h1>
                                                        <p>HSD: {formatDate(item.hsd)}</p>
                                                    </div>
                                                </div>
                                                <CopyButton discountCode={item.maGiamGia} />
                                            </div>
                                            <br />
                                        </React.Fragment>
                                    )
                                })}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Hủy</button>
                            </div>
                        </div>
                    </div>
                </div>
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
                            required
                        />
                        <div className="inline-fields">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Nhập email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                placeholder="Nhập số điện thoại"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            placeholder="Nhập địa chỉ"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                        />
                        <h4>Phương thức thanh toán</h4>
                        <div className="payment-methods">
                            <div className='input_payment'>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="COD"
                                    checked={formData.paymentMethod === true}
                                    onChange={handleInputChange}
                                />
                                <p>Thanh toán khi nhận hàng</p>
                            </div>
                            <br />
                            <div className='input_payment'>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="VNPAY"
                                    checked={formData.paymentMethod === false}
                                    onChange={handleInputChange}
                                />
                                <p>Chuyển khoản ngân hàng</p>
                            </div>
                        </div>
                        <button className='submit-form' type="submit">Thanh toán</button>
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
                            <input type="text" placeholder="Nhập mã giảm giá" value={enteredDiscountCode} onChange={handleDiscountChange} />
                            <button className="text-center" onClick={applyDiscount}>
                                <p className='discount-text'>Áp dụng</p>
                            </button>
                        </div>
                        <br></br>
                        <div className='get-discount'>
                            <button type='button' className='getdiscountText' data-bs-toggle="modal" data-bs-target="#myModal">Bấm vào để lấy mã khuyến mãi</button>
                        </div>
                        <div className="total">
                            <span>Tổng tiền: {finalTotal.toLocaleString('vi-VN')}  đ</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Payment;
