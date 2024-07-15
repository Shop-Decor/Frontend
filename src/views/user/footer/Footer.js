import React from "react";
import '../../../styles/user/footer/Footer.scss';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareFacebook, faYoutube, faInstagram } from '@fortawesome/free-brands-svg-icons';
import fanpage from "../../../assets/images/fanpage.png";

class Footer extends React.Component {
    render() {
        return (
            <>
                <footer>
                    <div className="content">
                        <div className="footer-content">
                            <h5>Follow us:</h5>
                            <div className="social">
                                <Link to="/facebook" className="social-icon"><FontAwesomeIcon icon={faSquareFacebook} /></Link>
                                <Link to="/youtube" className="social-icon"><FontAwesomeIcon icon={faYoutube} /></Link>
                                <Link to="/intagram" className="social-icon"><FontAwesomeIcon icon={faInstagram} /></Link>
                            </div>
                        </div>
                        <div className="footer-content">
                            <h5 className="title">Về SeaBug</h5>
                            <ul>
                                <li>
                                    <Link className="link-content" to="/gioithieu">Giới thiệu</Link>
                                </li>
                                <li>
                                    <Link className="link-content" to="/tuyendung">Tuyển dụng</Link>
                                </li>
                            </ul>
                        </div>
                        <div className="footer-content">
                            <h5 className="title">Liên kết</h5>
                            <ul>
                                <li>
                                    <Link className="link-content" to="/trangchu">Trang chủ</Link>
                                </li>
                                <li>
                                    <Link className="link-content" to="/tuyendung">Tuyển dụng</Link>
                                </li>
                                <li>
                                    <Link className="link-content" to="/vechungtoi">Về chúng tôi</Link>
                                </li>
                                <li>
                                    <Link className="link-content" to="/tintuc">Tin tức</Link>
                                </li>
                            </ul>
                        </div>
                        <div className="footer-content">
                            <h5 className="title">Liên kết</h5>
                            <ul>
                                <li>
                                    <Link className="link-content" to="/trangchu">Trang chủ</Link>
                                </li>
                                <li>
                                    <Link className="link-content" to="/tuyendung">Tuyển dụng</Link>
                                </li>
                                <li>
                                    <Link className="link-content" to="/vechungtoi">Về chúng tôi</Link>
                                </li>
                                <li>
                                    <Link className="link-content" to="/tintuc">Tin tức</Link>
                                </li>
                            </ul>
                        </div>
                        <div className="footer-content">
                            <h5>Fanpage</h5>
                            <img className="img-fluid" src={fanpage} alt="fanpage" />
                        </div>
                    </div>
                    <div className="license">
                        Copyright &copy; 2024 By Dũng Hồ. Powered by Dũng Hồ Group.
                    </div>
                </footer>
            </>
        )
    }
}

export default Footer;