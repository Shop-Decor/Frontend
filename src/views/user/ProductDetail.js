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
  const [availableColors, setAvailableColors] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const allSizes = [...new Set(product.map(detail => detail.size))];
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
    setSelectedSizes([size]); // Only allow one size to be selected at a time
    const filteredColors = product.filter(detail => detail.size === size).map(detail => detail.color);
    setAvailableColors(filteredColors);
    if (filteredColors.length > 0) {
      setSelectedColors([filteredColors[0]]); // Automatically check the first available color
    } else {
      setSelectedColors([]); // Reset selected colors if no colors are available
    }
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
          setSelectedSizes([firstDetail.size]);
          const filteredColors = response.data.filter(detail => detail.size === firstDetail.size).map(detail => detail.color);
          setAvailableColors(filteredColors);
          if (filteredColors.length > 0) {
            setSelectedColors([filteredColors[0]]);
          }
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

  const calculatePrice = () => {
    return selectedColors.reduce((total, color) => {
      const detailsByColor = product.filter(detail => detail.color === color);
      const priceBySize = detailsByColor.filter(detail => selectedSizes.includes(detail.size))
        .reduce((sum, detail) => {
          const discountedPrice = detail.discountType
            ? detail.price * (1 - detail.discountAmount / 100)
            : detail.price - detail.discountAmount;
          return sum + discountedPrice;
        }, 0);
      return total + priceBySize;
    }, 0) * quantity;
  };

  const totalPrice = calculatePrice();

  const calculateOriginalPrice = () => {
    return selectedColors.reduce((total, color) => {
      const detailsByColor = product.filter(detail => detail.color === color);
      const priceBySize = detailsByColor.filter(detail => selectedSizes.includes(detail.size))
        .reduce((sum, detail) => sum + detail.price, 0);
      return total + priceBySize;
    }, 0) * quantity;
  };

  const originalPrice = calculateOriginalPrice();

  const handleIncrement = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const handleDecrement = () => {
    setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const handleQuantityChange = (event) => {
    const value = Math.max(1, Number(event.target.value)); // Ensure quantity is at least 1
    setQuantity(value);
  };

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
        {product2.hinhs && product2.hinhs.length > 0 ? (
          <div className="col-md-6 ProductImg">
            <div className="carousel slide slider" id="carouselDemo" data-bs-wrap="true" data-bs-ride="carousel">
              <div className="carousel-inner">
                {product2.hinhs.map((item, index) => (
                  <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
                    <img className="img-fluid" src={item} alt={"img_Product_" + index} />
                  </div>
                ))}
              </div>
              <button className="carousel-control-prev" type="button" data-bs-target="#carouselDemo" data-bs-slide="prev">
                <span className="carousel-control-prev-icon"></span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#carouselDemo" data-bs-slide="next">
                <span className="carousel-control-next-icon"></span>
              </button>
              <div className="carousel-indicators">
                {product2.hinhs.map((item, index) => (
                  <img className={index === 0 ? "active img-fluid btn-img" : "img-fluid btn-img"}
                    data-bs-target="#carouselDemo"
                    data-bs-slide-to={index}
                    key={index} src={item} alt={"img_Product_" + index} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p>Không có hình ảnh nào</p>
        )}
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
              {availableColors.map((color, index) => (
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
              <button className="add" onClick={handleDecrement}>-</button>
              <input
                className="quantity"
                value={quantity}
                min={1}
                type="number"
                onChange={handleQuantityChange}
                style={{ textAlign: 'center', MozAppearance: 'textfield' }} // Center align the text
              />
              <button className="minus" onClick={handleIncrement}>+</button>
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
