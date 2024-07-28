import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../../styles/user/ProductDetail.scss";
import Image from "../../assets/images/sp1.png";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [product2, setProduct2] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  const allSizes = [...new Set(product.map(detail => detail.size))];
  const allColors = [...new Set(product.map(detail => detail.color))];

  const colorClassMap = {
    'Đỏ': 'red',
    'Xanh dương': 'blue',
    'Cam': 'orange',
    'Lục': 'green',
    'Vàng': 'yellow',
    'Tím': 'purple',
    'Hồng': 'pink',
    'Nâu': 'brown',
    'Đen': 'black',
    'Trắng': 'white'
  };

  const handleSizeChange = (size) => {
    setSelectedSizes(prevSelectedSizes => {
      if (prevSelectedSizes.includes(size)) {
        if (prevSelectedSizes.length === 1) {
          return prevSelectedSizes; // Ngăn chặn bỏ chọn kích thước cuối cùng
        }
        return prevSelectedSizes.filter(selectedSize => selectedSize !== size);
      } else {
        return [...prevSelectedSizes, size];
      }
    });
  };


  const handleColorChange = (color) => {
    setSelectedColors([color]);
  };

  useEffect(() => {
    axios.get(`https://localhost:7078/api/Product/getproductdetail?spid=${id}`)
      .then(response => {
        setProduct(response.data);
        if (response.data.length > 0) {
          const firstDetail = response.data[0];
          setSelectedDetail(firstDetail);
          setSelectedColors([firstDetail.color]);
          setSelectedSizes([firstDetail.size]);
          setIsLoading(false);
        }
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

  const totalPrice = selectedColors.reduce((total, color) => {
    const detailsByColor = product.filter(detail => detail.color === color);
    const priceBySize = detailsByColor.filter(detail => selectedSizes.includes(detail.size))
      .reduce((sum, detail) => {
        const discountedPrice = detail.discountType
          ? detail.price * (1 - detail.discountAmount / 100)
          : detail.price - detail.discountAmount;
        return sum + discountedPrice;
      }, 0);
    return total + priceBySize;
  }, 0);

  const originalPrice = selectedColors.reduce((total, color) => {
    const detailsByColor = product.filter(detail => detail.color === color);
    const priceBySize = detailsByColor.filter(detail => selectedSizes.includes(detail.size))
      .reduce((sum, detail) => sum + detail.price, 0);
    return total + priceBySize;
  }, 0);


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
        {product2.hinhs.map((item, index) => (
          <div className="col-md-6 ProductImg" key={index}>
            <img className="img-fluid" src={item} alt={"img_Product_" + index} />
          </div>
        ))}
        {selectedDetail && (
          <div className="col-md-6 ProductDetail">
            <p className="ProductName">{product2.ten}</p>
            <hr />
            <div className="row saleBlock">
              <div className="sale">
                <p>{selectedDetail.discountAmount}{selectedDetail.discountType === true ? '%' : 'vnđ'}</p>
              </div>
              <div className="MoneyRed">{totalPrice.toLocaleString()}đ</div>
              <div className="Moneygach">{originalPrice.toLocaleString()}đ</div>
            </div>
            <hr />
            <div className="row Size">
              {allSizes.map((size, index) => (
                <div className="form-check" key={index}>
                  <input
                    name={size}
                    checked={selectedSizes.includes(size)}
                    className="form-check-input"
                    type="checkbox"
                    onChange={() => handleSizeChange(size)}
                    id={`size-checkbox-${index}`}
                    style={{ display: 'none' }}
                  />
                  <label
                    htmlFor={`size-checkbox-${index}`}
                    className={`size-checkbox-label ${selectedSizes.includes(size) ? 'checked' : ''}`}
                  >
                    {size}
                  </label>
                </div>
              ))}
            </div>

            <hr />
            <div className="row colorLine">
              {allColors.map((color, index) => (
                <div className="form-check" key={index}>
                  <input
                    name={color}
                    checked={selectedColors.includes(color)}
                    className={`form-check-input ${colorClassMap[color] || ''}`}
                    type="checkbox"
                    onChange={() => handleColorChange(color)}
                  />
                </div>
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
