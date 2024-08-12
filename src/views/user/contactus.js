import React from 'react';
import "../../styles/user/contactus.scss";
import decor1 from '../../assets/images/sp1.png';
import decor2 from '../../assets/images/sp2.png';
import decor3 from '../../assets/images/sp3.png';

class ContactUs extends React.Component {
    render() {
        return (

            <div className="about-us-container">
                <br />
                <div className="hero-section">
                    <h1>Về Cửa Hàng Decor Của Chúng Tôi</h1>
                    <p>Điểm đến hoàn hảo cho trang trí nhà cửa thanh lịch.</p>
                </div>
                <div className="content-section">
                    <div className="intro">
                        <h2>Sứ Mệnh Của Chúng Tôi</h2>
                        <p>Chúng tôi cam kết mang đến cho bạn những sản phẩm decor chất lượng cao và phong cách nhất, giúp biến ngôi nhà của bạn thành một nơi thật sự đặc biệt.</p>
                    </div>
                    <div className="story">
                        <h2>Câu Chuyện Của Chúng Tôi</h2>
                        <p>Được thành lập với niềm đam mê dành cho nghệ thuật trang trí nội thất, chúng tôi đã không ngừng tìm kiếm những sản phẩm độc đáo và đẹp mắt từ khắp nơi trên thế giới.</p>
                    </div>
                    <div className="gallery">
                        <h2>Bộ Sưu Tập Của Chúng Tôi</h2>
                        <div className="image-grid">
                            <div className="image-item">
                                <img src={decor1} alt="Decor 1" />
                            </div>
                            <div className="image-item">
                                <img src={decor2} alt="Decor 2" />
                            </div>
                            <div className="image-item">
                                <img src={decor3} alt="Decor 3" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ContactUs;