import React, { useState, useEffect } from "react";
import "../../styles/user/Home.scss";
import axios from "axios";
import Image from "../../assets/images/sp1.png";
import { useOutletContext, Link } from 'react-router-dom';
import "../../styles/user/hover/hover.scss";
import {
  faCartPlus,
  faEye
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Home = () => {
  const { handleAddCart } = useOutletContext();
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("https://localhost:7078/api/Product/User")
      .then(response => {
        const sortedProducts = response.data
          .sort((a, b) => new Date(b.ngayTao) - new Date(a.ngayTao));
        const top5Products = sortedProducts.slice(0, 5);

        setProducts(sortedProducts);
        setFeaturedProducts(top5Products);
        setIsLoading(false);
      })
      .catch(error => {
        setError(error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div>Lỗi: {error.message}</div>;
  }


  return (
    <div className="container">
      <h1 className="dung text-center pb-3">Sản phẩm mới</h1>
      <div className="row">
        {products && products.length > 0 ? (
          products.map((product, index) => (
            <div className="col-md-2 product" key={index}>
              <Link to={`/ProductDetail/${product.id}`} className="link_to">
                <div className="product-main">
                  <div className="hovereffect">
                    <img className="img-fluid" src={product.hinh || Image} alt={"img product " + index} />
                    <div className="overlay">
                      <div className="btn-product">
                        <Link to={"/ProductDetail/" + product.id} className="info"><FontAwesomeIcon className="icon" icon={faEye} /></Link>
                        <Link className="info" onClick={() => handleAddCart(product)}><FontAwesomeIcon className="icon" icon={faCartPlus} /></Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="product-content">
                  <h5 className="card-title">{product.ten}</h5>
                  <div className="product-price">
                    <span className="price">
                      {product.loaiGiam
                        ? (product.gia - ((product.gia * product.menhGia) / 100)).toLocaleString('vi-VN') + " đ"
                        : (product.gia - product.menhGia).toLocaleString('vi-VN') + " đ"}
                    </span>
                    <span className="priced">{product.gia.toLocaleString('vi-VN') + "đ"} </span>
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p>Không có sản phẩm nào</p>
        )}
      </div>
      <div className="botton-xem">
        <Link to="/ProductUser"><button className="align-item-center">Xem thêm</button></Link>
      </div>
      <br />
      <h1 className="dung text-center pb-3">Sản phẩm nổi bật</h1>
      <div className="row">
        {featuredProducts && featuredProducts.length > 0 ? (
          featuredProducts.map((product, index) => (
            <div className="col-md-2 product" key={product.id}>
              <div className="product-main">
                <div className="hovereffect">
                  <img className="img-fluid" src={product.hinh || Image} alt={"img product " + index} />
                  <div className="overlay">
                    <div className="btn-product">
                      <Link to={"/ProductDetail/" + product.id} className="info"><FontAwesomeIcon className="icon" icon={faEye} /></Link>
                      <Link className="info" onClick={() => handleAddCart(product)}><FontAwesomeIcon className="icon" icon={faCartPlus} /></Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="product-content">
                <h5 className="card-title">{product.ten}</h5>
                <div className="product-price">
                  <span className="price">
                    {product.loaiGiam
                      ? (product.gia - ((product.gia * product.menhGia) / 100)).toLocaleString('vi-VN') + " đ"
                      : (product.gia - product.menhGia).toLocaleString('vi-VN') + " đ"}
                  </span>
                  <span className="priced">{product.gia.toLocaleString('vi-VN') + "đ"} </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Không có sản phẩm nào</p>
        )}
      </div>
      <div className="botton-xem">
        <Link to="/ProductUser"><button className="align-item-center">Xem thêm</button></Link>
      </div>
      <br />
    </div>
  );
};

export default Home;
