import React from 'react';
import "../../styles/user/about.scss";

class About extends React.Component {
    render() {
        return (
            <>
                <div className="container about-me">
                    <h2 className="font-weight-bold">
                        Contact Us
                    </h2>
                    <div className="row">
                        <div className="col-md-6 mr-auto">
                            <form action="">
                                <div className="contact_form-container">
                                    <div>
                                        <div>
                                            <input type="text" placeholder="Name" />
                                        </div>
                                        <div>
                                            <input type="text" placeholder="Phone Number" />
                                        </div>
                                        <div>
                                            <input type="email" placeholder="Email" />
                                        </div>

                                        <div className="mt-5">
                                            <input type="text" placeholder="Message" />
                                        </div>
                                        <div className="mt-5">
                                            <button type="submit">
                                                send
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Thêm Google Map ở đây */}
                        <div className="col-md-6">
                            <div className="map-container">
                                <iframe
                                    title="Google Map"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3891.910991378519!2d108.08833277465611!3d12.71922942036198!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3171f780be3e515b%3A0xbda0a8b5cac574be!2zNyBOZ3V54buFbiBHaWEgVGhp4buBdSwgVMOibiBI4buZaSwgVGjDoG5oIHBo4buRIEJ1w7RuIE1hIFRodeG7mXQsIMSQ4bqvayBM4bqvayA2MzAwMCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1723519735042!5m2!1svi!2s"
                                    width="100%"
                                    height="450"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default About;
