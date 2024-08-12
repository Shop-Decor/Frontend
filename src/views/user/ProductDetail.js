import React, { useState, useEffect } from "react";
import { useParams, useOutletContext, Link } from "react-router-dom";
import axios from "axios";
import "../../styles/user/ProductDetail.scss";
import Image from "../../assets/images/sp1.png";
import {
  faCartPlus,
  faEye
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const ProductDetail = (props) => {
  const { listCart, setListCart, handleAddCart } = useOutletContext();
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [product2, setProduct2] = useState({});
  const [relateproduct, setRelateProduct] = useState([]);
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

  const fetchRelateProducts = async () => {
    try {
      let res = await axios.get(`https://localhost:7078/api/Product/GetProductsByTypeId/${id}`);
      setRelateProduct(res.data || []);
    } catch (error) {
      console.error('Lỗi lấy dữ liệu api:', error);
    }
  };

  useEffect(() => {
    fetchRelateProducts();
  }, [id]);

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


  const handleAddToCart = () => {
    setListCart((cart) => {
      // Tìm chỉ số của sản phẩm trong giỏ hàng với cùng ID, kích thước, và màu sắc
      const cartExistingIndex = cart.findIndex(
        (item) =>
          item.id === id &&
          item.size === selectedSizes[0] &&
          item.color === selectedColors[0]
      );

      // Nếu sản phẩm đã tồn tại trong giỏ hàng
      if (cartExistingIndex !== -1) {
        // Cập nhật số lượng của sản phẩm đã tồn tại
        const updatedCart = cart.map((item, index) =>
          index === cartExistingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        return updatedCart;
      } else {
        // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
        const cartItem = {
          id: id,
          ten: product2.ten,
          hinh: product2.hinhs[0],
          gia: originalPrice,
          loaiGiam: selectedDetail.discountType,
          menhGia: selectedDetail.discountAmount,
          size: selectedSizes[0], // Sửa để lấy kích thước đầu tiên
          quantity: quantity,
          color: selectedColors[0] // Sửa để lấy màu sắc đầu tiên
        };
        return [...cart, cartItem];
      }
    });
  };


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
                <p>{selectedDetail.discountAmount}{selectedDetail.discountType === true ? '%' : 'đ'}</p>
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
              <button className="align-item-center" onClick={handleAddToCart}>Thêm vào giỏ hàng</button>
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
        {relateproduct && relateproduct.length > 0 ? (
          relateproduct.map((product, index) => (
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
    </div>
  );
};
export default ProductDetail;
