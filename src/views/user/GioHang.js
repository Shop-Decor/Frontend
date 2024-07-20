import React from "react";
import '../../styles/user/GioHang.scss';
import image1 from '../../assets/images/sp2.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {

    faRotateLeft
} from "@fortawesome/free-solid-svg-icons";
import {

    faFacebook
} from "@fortawesome/free-brands-svg-icons";
class GioHang extends React.Component {
    render() {
        return (

            <>
                <div className="container">
                    <div className='contai'>
                        <div className="row qe">
                            <div className="col-md-1 qq">
                                <div className="vertical-thick-line"></div>
                            </div>
                            <div className="col-md-11 ee">
                                <div className="linkgh">Trang chủ / Giỏ hàng</div>
                            </div>
                        </div>


                    </div>
                    <div className="App">
                        Giỏ hàng của bạn
                    </div>
                    <div className="short-thick-line"></div>
                    <div className="row aa">
                        <div className="col-md-8 a1">
                            <div className='row bb'>
                                <div className='col-md-2 b1'>
                                    <div className='anh'>
                                        <img src={image1} alt="anhsp" className="anhsp" />
                                    </div>

                                </div>
                                <div className='col-md-10 cc'>
                                    <div className='bao'>
                                        <span className='tensp'>Cặp Đôi mèo Nhật Bản cát tường</span>
                                        <br />
                                        <span className='gia'>2.100.000đ </span> <span className='giagoc'>2.500.000</span>
                                        <br />
                                        <span className='size'> Size: 40x40 </span>
                                        <br />

                                        <div className='sl'>
                                            <button className='tru'>
                                                -
                                            </button>
                                            <input className='valuesl' />
                                            <button className='cong'>
                                                +
                                            </button>
                                        </div>
                                    </div>


                                </div>
                            </div>
                            <hr />
                            <br />
                            <div className='row bb'>
                                <div className='col-md-2 b1'>
                                    <div className='anh'>
                                        <img src={image1} alt="anhsp" className="anhsp" />
                                    </div>

                                </div>
                                <div className='col-md-10 cc'>
                                    <div className='bao'>
                                        <span className='tensp'>Cặp Đôi mèo Nhật Bản cát tường</span>
                                        <br />
                                        <span className='gia'>2.100.000đ </span> <span className='giagoc'>2.500.000</span>
                                        <br />
                                        <span className='size'> Size: 40x40 </span>
                                        <br />

                                        <div className='sl'>
                                            <button className='tru'>
                                                -
                                            </button>
                                            <input className='valuesl' />
                                            <button className='cong'>
                                                +
                                            </button>
                                        </div>
                                    </div>


                                </div>
                            </div>
                            <hr />
                            <br />
                            <div className='row bb'>
                                <div className='col-md-2 b1'>
                                    <div className='anh'>
                                        <img src={image1} alt="anhsp" className="anhsp" />
                                    </div>

                                </div>
                                <div className='col-md-10 cc'>
                                    <div className='bao'>
                                        <span className='tensp'>Cặp Đôi mèo Nhật Bản cát tường</span>
                                        <br />
                                        <span className='gia'>2.100.000đ </span> <span className='giagoc'>2.500.000</span>
                                        <br />
                                        <span className='size'> Size: 40x40 </span>
                                        <br />

                                        <div className='sl'>
                                            <button className='tru'>
                                                -
                                            </button>
                                            <input className='valuesl' />
                                            <button className='cong'>
                                                +
                                            </button>
                                        </div>
                                    </div>


                                </div>
                            </div>
                            <hr />
                        </div>
                        <div className="col-md-4 d1">
                            <div className='ttin'>
                                <br />
                                <span className='ttdh'>Thông tin đơn hàng</span>
                                <br />
                                <div className="cracked-line"></div>
                                <span className='tongt'>Tổng tiền: </span> <span className='tongtien'>2.100.000đ</span>
                                <br />
                                <div className="cracked-line"></div>

                                <button className='btn-tt'>
                                    <span className='thanhtoan'>THANH TOÁN</span>
                                </button>
                                <br />
                                <span className="icon"><FontAwesomeIcon icon={faRotateLeft} className="iconmualai" /></span>
                                <span className='muatiep'>Tiếp tục mua hàng</span>
                            </div>
                        </div>
                    </div>
                    <div className='e1'>
                        <span className='gh'>Ghi chú đơn hàng</span>
                        <br />
                        <textarea className='gcct'></textarea>
                    </div>

                </div>






                {/* <div>
                    
                    <FontAwesomeIcon icon={faFacebook} />
                </div> */}



            </>
        )
    }
}

export default GioHang;