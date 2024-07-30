import React, { useState, useEffect } from "react";
import "../../styles/user/Home.scss";
import axios from "axios";
import Image from "../../assets/images/sp1.png";
import Image2 from "../../assets/images/sp2.png";
import { Link } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("https://localhost:7078/api/Product/User")
      .then(response => {
        setProducts(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        setError(error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container">
      <h1 className="dung text-center pb-3">Sản phẩm mới</h1>
      <div className="row">
        {products && products.length > 0 ? (
          products.map((product, index) => (
            <div className="col-md-2 product" key={index}>
              <Link to={`/ProductDetail/${product.id}`} className="link_to">
                <img src={product.Hinh || Image2} alt={product.Ten} />
                <p>
                  {product.ten}
                  <br />
                  {product.gia.toLocaleString()}đ
                </p>
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
        {products && products.length > 0 ? (
          products.map((product, index) => (
            <div className="col-md-2 product" key={product.id}>
              <img src={product.Hinh || Image} alt={product.Ten} />
              <p>
                {product.ten}
                <br />
                {product.gia.toLocaleString()}đ
              </p>
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
