import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../../styles/user/ProductDetail.scss";
import Image from "../../assets/images/sp1.png";
import Image2 from "../../assets/images/sp2.png";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [product2, setProduct2] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedDetail, setSelectedDetail] = useState(null);

  const allSizes = [...new Set(product.map(detail => detail.size))];

  const handleSizeClick = (detail) => {
    setSelectedDetail(detail);
  };


  useEffect(() => {
    axios.get(`https://localhost:7078/api/Product/getproductdetail?spid=${id}`)
      .then(response => {
        setProduct(response.data);
        setSelectedDetail(response.data[0]);
        setIsLoading(false);
      })
      .catch(error => {
        setError(error);
        setIsLoading(false);
      });
    axios.get(`https://localhost:7078/api/Product/${id}`)
      .then(response => {
        setProduct2(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        setError(error);
        setIsLoading(false);
      });
  }, [id]);


  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container">
      <br />
      <div className="link">
        <div className="border-line"></div>
        <p className="pt-3 ms-4">Trang chủ / Sản phẩm / sản phẩm chi tiết</p>
        <br />
      </div>
      <br />


      <div className="row">
        {product2.hinhs.map((item, index) => {
          return (
            <React.Fragment key={index}>
              <div className="col-md-6 ProductImg">
                <img className="img-fluid" src={item} alt={"img_Product_" + index} />
              </div>
            </React.Fragment>
          )
        })}
        {selectedDetail && (
          <div className="col-md-6 ProductDetail">
            <p className="ProductName">{product2.ten}</p>
            <hr />
            <div className="row saleBlock">
              <div className="sale">
                <p>-15%</p>
              </div>
              <div className="MoneyRed">{selectedDetail.price}đ</div>
              <div className="Moneygach">2.500.000đ</div>
            </div>
            <hr />
            <div className="row Size">
              {allSizes.map((size, index) => (
                <button
                  key={index}
                  className={selectedDetail && selectedDetail.size === size ? 'stocking me-5' : 'nostocking'}
                  onClick={() => handleSizeClick(
                    product.find(detail => detail.size === size)
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
            <hr />
            <div className="row quantityblock">
              <div className="add">-</div>
              <div className="quantity">1</div>
              <div className="minus">+</div>
            </div>
            <br />
            <div className="button-them">
              <button className="align-item-center">Thêm vào giỏ hàng</button>
            </div>
            <br />
            <p className="MoTa">Mô tả</p>
            <p className="TenMoTa">{product2.moTa}</p>
          </div>
        )}

      </div>

      <br />
      <h1 className="dung text-center pb-3">Sản phẩm liên quan</h1>
      <div className="row">
        <div className="col-md-2 product">
          <img src={Image} alt="related product 1" />
          <p>
            Tượng hy lạp phong cách cổ đại bla bla bla
            <br />
            2.900.000đ
          </p>
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;
