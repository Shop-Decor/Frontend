import React from "react";
import '../../styles/user/Cart.scss';
import image1 from '../../assets/images/sp2.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {

    faRotateLeft
} from "@fortawesome/free-solid-svg-icons";
import {

    faFacebook
} from "@fortawesome/free-brands-svg-icons";
class Cart extends React.Component {
    render() {
        return (

            <>
                <div className="containercart">
                    <div className='contai-cart'>
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
                            <div className='row row-cart-item'>
                                <div className='col-md-2 cart-item'>
                                    <div className='image-product-cart'>
                                        <img src={image1} alt="img" className="image-product" />
                                    </div>

                                </div>
                                <div className='col-md-10'>
                                    <div className='cart-product-item'>
                                        <span className='nameproduct'>Cặp Đôi mèo Nhật Bản cát tường</span>
                                        <br />
                                        <span className='price'>2.100.000đ </span> <span className='priced'>2.500.000</span>
                                        <br />
                                        <span className='size'> Size: 40x40 </span>
                                        <br />

                                        <div className='quantity'>
                                            <button className='apart-from'>
                                                -
                                            </button>
                                            <input className='value-quantity' />
                                            <button className='add'>
                                                +
                                            </button>
                                        </div>
                                    </div>


                                </div>
                            </div>
                            <hr />
                            <br />
                            <div className='row row-cart-item'>
                                <div className='col-md-2 cart-item'>
                                    <div className='image-product-cart'>
                                        <img src={image1} alt="img" className="image-product" />
                                    </div>

                                </div>
                                <div className='col-md-10'>
                                    <div className='cart-product-item'>
                                        <span className='nameproduct'>Cặp Đôi mèo Nhật Bản cát tường</span>
                                        <br />
                                        <span className='price'>2.100.000đ </span> <span className='priced'>2.500.000</span>
                                        <br />
                                        <span className='size'> Size: 40x40 </span>
                                        <br />

                                        <div className='quantity'>
                                            <button className='apart-from'>
                                                -
                                            </button>
                                            <input className='value-quantity' />
                                            <button className='add'>
                                                +
                                            </button>
                                        </div>
                                    </div>


                                </div>
                            </div>
                            <hr />
                            <br />
                            <div className='row row-cart-item'>
                                <div className='col-md-2 cart-item'>
                                    <div className='image-product-cart'>
                                        <img src={image1} alt="img" className="image-product" />
                                    </div>

                                </div>
                                <div className='col-md-10'>
                                    <div className='cart-product-item'>
                                        <span className='nameproduct'>Cặp Đôi mèo Nhật Bản cát tường</span>
                                        <br />
                                        <span className='price'>2.100.000đ </span> <span className='priced'>2.500.000</span>
                                        <br />
                                        <span className='size'> Size: 40x40 </span>
                                        <br />

                                        <div className='quantity'>
                                            <button className='apart-from'>
                                                -
                                            </button>
                                            <input className='value-quantity' />
                                            <button className='add'>
                                                +
                                            </button>
                                        </div>
                                    </div>


                                </div>
                            </div>
                            <hr />
                        </div>
                        <div className="col-md-4 infomationtocart">
                            <div className='infomation-cart'>
                                <br />
                                <span className='infomation'>Thông tin đơn hàng</span>
                                <br />
                                <div className="cracked-line"></div>
                                <span className='total-amount-name'>Tổng tiền: </span> <span className='total-amount'>2.100.000đ</span>
                                <br />
                                <div className="cracked-line"></div>

                                <button className='btn-pay'>
                                    <span className='pay-name'>THANH TOÁN</span>
                                </button>
                                <br />
                                <span className="icon"><FontAwesomeIcon icon={faRotateLeft} className="icon-repurchase" /></span>
                                <span className='repurchase'>Tiếp tục mua hàng</span>
                            </div>
                        </div>
                    </div>
                    <div className='note-cart'>
                        <span className='note-name'>Ghi chú đơn hàng</span>
                        <br />
                        <textarea className='note-write'></textarea>
                    </div>

                </div>


            </>
        )
    }
}

export default Cart;