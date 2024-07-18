import React from "react";
import "../../styles/user/Home.scss";
import Image from "../../assets/images/sp1.png";
import Image2 from "../../assets/images/sp2.png";
import axios from "axios";

class Home extends React.Component {
  async componentDidMount() {
    let res = await axios.get('https://localhost:7078/api/Product');
  }
  render() {
    return (
      <>
        <div className="container">
          <h1 className="dung text-center pb-3">Sản phẩm mới</h1>
          <div className="row">
            <div className="col-md-2 product">
              <img src={Image} />
              <p>
                Tượng hy lạp phong cách cổ đại bla bla bla
                <br></br>
                2.900.000đ
              </p>
            </div>
            <div className="col-md-2 product">
              <img src={Image2} />
              <p>
                Tượng hy lạp phong cách cổ đại bla bla bla
                <br></br>
                2.900.000đ
              </p>
            </div>
            <div className="col-md-2 product">
              <img src={Image2} />
              <p>
                Tượng hy lạp phong cách cổ đại bla bla bla
                <br></br>
                2.900.000đ
              </p>
            </div>
            <div className="col-md-2 product">
              <img src="https://jobsgo.vn/blog/wp-content/uploads/2024/03/Decor-la-gi-7-nguyen-tac-decor-trong-trang-tri-noi-that-1.png" />
              <p>
                Tượng hy lạp phong cách cổ đại bla bla bla
                <br></br>
                2.900.000đ
              </p>
            </div>
            <div className="col-md-2 product">
              <img src={Image2} />
              <p>
                Tượng hy lạp phong cách cổ đại bla bla bla
                <br></br>
                2.900.000đ
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-2 product">
              <img src={Image2} />
              <p>
                Tượng hy lạp phong cách cổ đại bla bla bla
                <br></br>
                2.900.000đ
              </p>
            </div>
            <div className="col-md-2 product">
              <img src={Image2} />
              <p>
                Tượng hy lạp phong cách cổ đại bla bla bla
                <br></br>
                2.900.000đ
              </p>
            </div>
            <div className="col-md-2 product">
              <img src={Image2} />
              <p>
                Tượng hy lạp phong cách cổ đại bla bla bla
                <br></br>
                2.900.000đ
              </p>
            </div>
            <div className="col-md-2 product">
              <img src={Image2} />
              <p>
                Tượng hy lạp phong cách cổ đại bla bla bla
                <br></br>
                2.900.000đ
              </p>
            </div>
            <div className="col-md-2 product">
              <img src={Image2} />
              <p>
                Tượng hy lạp phong cách cổ đại bla bla bla
                <br></br>
                2.900.000đ
              </p>
            </div>
          </div>
          <div className="botton-xem">
            <button className="align-item-center">Xem thêm</button>
          </div>
          <br></br>
          <h1 className="dung text-center pb-3">Sản phẩm nổi bật</h1>
          <div className="row">
            <div className="col-md-2 product">
              <img src={Image} />
              <p>
                Tượng hy lạp phong cách cổ đại bla bla bla
                <br></br>
                2.900.000đ
              </p>
            </div>
            <div className="col-md-2 product">
              <img src={Image2} />
              <p>
                Tượng hy lạp phong cách cổ đại bla bla bla
                <br></br>
                2.900.000đ
              </p>
            </div>
            <div className="col-md-2 product">
              <img src={Image2} />
              <p>
                Tượng hy lạp phong cách cổ đại bla bla bla
                <br></br>
                2.900.000đ
              </p>
            </div>
            <div className="col-md-2 product">
              <img src={Image2} />
              <p>
                Tượng hy lạp phong cách cổ đại bla bla bla
                <br></br>
                2.900.000đ
              </p>
            </div>
            <div className="col-md-2 product">
              <img src={Image2} />
              <p>
                Tượng hy lạp phong cách cổ đại bla bla bla
                <br></br>
                2.900.000đ
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-2 product">
              <img src={Image2} />
              <p>
                Tượng hy lạp phong cách cổ đại bla bla bla
                <br></br>
                2.900.000đ
              </p>
            </div>
            <div className="col-md-2 product">
              <img src={Image2} />
              <p>
                Tượng hy lạp phong cách cổ đại bla bla bla
                <br></br>
                2.900.000đ
              </p>
            </div>
            <div className="col-md-2 product">
              <img src={Image2} />
              <p>
                Tượng hy lạp phong cách cổ đại bla bla bla
                <br></br>
                2.900.000đ
              </p>
            </div>
            <div className="col-md-2 product">
              <img src={Image2} />
              <p>
                Tượng hy lạp phong cách cổ đại bla bla bla
                <br></br>
                2.900.000đ
              </p>
            </div>
            <div className="col-md-2 product">
              <img src={Image2} />
              <p>
                Tượng hy lạp phong cách cổ đại bla bla bla
                <br></br>
                2.900.000đ
              </p>
            </div>
          </div>
          <div className="botton-xem">
            <button className="align-item-center">Xem thêm</button>
          </div>
        </div>
      </>
    );
  }
}
//export {} MyComponent tra ra nhieu cai cung 1 luc
export default Home;
