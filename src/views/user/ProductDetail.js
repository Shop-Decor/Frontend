import React, { useState } from "react";
import "../../styles/user/ProductDetail.scss";
import Image from "../../assets/images/sp1.png";
import Image2 from "../../assets/images/sp2.png";

const ProductDetail = (props) => {
  const [isShowHiseUser, setShowHideUser] = useState();
  return (
    <>
      <div className="container">
        <br></br>
        <div className="link">
          <div className="border-line"></div>
          <p className="pt-3 ms-4">Trang chủ / Sản phẩm / sản phẩm chi tiết</p>
          <br></br>
        </div>
        <br></br>
        <div className="row">
          <div className="col-md-6 ProductImg">
            <img className="img-fluid" src={Image}></img>
          </div>
          <div className="col-md-6 ProductDetail">
            <p className="ProductName">Tượng hy lạp phong cách cổ đại</p>
            <hr></hr>
            <div className="row saleBlock">
              <div className="sale">
                <p>-15%</p>
              </div>
              <div className="MoneyRed">2.100.000đ</div>
              <div className="Moneygach">2.500.000đ</div>
            </div>
            <hr></hr>
            <div className="row Size">
              <div className="stocking me-5">40x40</div>
              <div className="nostocking">80x80</div>
            </div>
            <hr></hr>
            <div className="row quantityblock">
              <div className="add">-</div>
              <div className="quantity">1</div>
              <div className="minus">+</div>
            </div>
            <br></br>
            <div className="button-them">
              <button className="align-item-center">Thêm vào giỏ hàng</button>
            </div>
            <br></br>
            <p className="MoTa">Mô tả</p>
            <p className="TenMoTa">
              GIỚI THIỆU CẶP ĐÔI MÈO NHẬT BẢN CÁT TƯỜNG
            </p>
          </div>
        </div>
        <br></br>
        <h1 className="dung text-center pb-3">Sản phẩm liên quan</h1>
        <div className="row">
          <div className="col-md-2 product">
            <img src={Image}></img>
            <p>
              Tượng hy lạp phong cách cổ đại bla bla bla
              <br></br>
              2.900.000đ
            </p>
          </div>
          <div className="col-md-2 product">
            <img src={Image2}></img>
            <p>
              Tượng hy lạp phong cách cổ đại bla bla bla
              <br></br>
              2.900.000đ
            </p>
          </div>
          <div className="col-md-2 product">
            <img src={Image2}></img>
            <p>
              Tượng hy lạp phong cách cổ đại bla bla bla
              <br></br>
              2.900.000đ
            </p>
          </div>
          <div className="col-md-2 product">
            <img src={Image2}></img>
            <p>
              Tượng hy lạp phong cách cổ đại bla bla bla
              <br></br>
              2.900.000đ
            </p>
          </div>
          <div className="col-md-2 product">
            <img src={Image2}></img>
            <p>
              Tượng hy lạp phong cách cổ đại bla bla bla
              <br></br>
              2.900.000đ
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-md-2 product">
            <img src={Image2}></img>
            <p>
              Tượng hy lạp phong cách cổ đại bla bla bla
              <br></br>
              2.900.000đ
            </p>
          </div>
          <div className="col-md-2 product">
            <img src={Image2}></img>
            <p>
              Tượng hy lạp phong cách cổ đại bla bla bla
              <br></br>
              2.900.000đ
            </p>
          </div>
          <div className="col-md-2 product">
            <img src={Image2}></img>
            <p>
              Tượng hy lạp phong cách cổ đại bla bla bla
              <br></br>
              2.900.000đ
            </p>
          </div>
          <div className="col-md-2 product">
            <img src={Image2}></img>
            <p>
              Tượng hy lạp phong cách cổ đại bla bla bla
              <br></br>
              2.900.000đ
            </p>
          </div>
          <div className="col-md-2 product">
            <img src={Image2}></img>
            <p>
              Tượng hy lạp phong cách cổ đại bla bla bla
              <br></br>
              2.900.000đ
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
export default ProductDetail;
