import React from "react";
import slide1 from '../../../assets/images/sliders/slideshow_1.png';
import slide2 from '../../../assets/images/sliders/slideshow_2.png';
import slide3 from '../../../assets/images/sliders/slideshow_3.png';
import slide4 from '../../../assets/images/sliders/slideshow_4.png';

class Slider extends React.Component {
    render() {
        return (
            <>
                <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="true">
                    <div className="carousel-indicators">
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="3" aria-label="Slide 4"></button>
                    </div>
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img src={slide1} className="d-block w-100" alt="slide1" />
                        </div>
                        <div className="carousel-item">
                            <img src={slide2} className="d-block w-100" alt="slide2" />
                        </div>
                        <div className="carousel-item">
                            <img src={slide3} className="d-block w-100" alt="slide3" />
                        </div>
                        <div className="carousel-item">
                            <img src={slide4} className="d-block w-100" alt="slide4" />
                        </div>
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </>
        )
    }
}

export default Slider;