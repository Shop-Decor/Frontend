import React, { useState, useEffect } from "react";
import { useParams, useOutletContext, Link } from "react-router-dom";
import axios from "axios";
import "../../styles/user/ProductDetail.scss";
import {
  faCartPlus,
  faEye
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from 'sweetalert2';
import Loading from "../loading/Loading";

const ProductDetail = (props) => {
  const { listCart, handleAddCart } = useOutletContext();
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [product2, setProduct2] = useState({});
  const [relateproduct, setRelateProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
        }
      })
      .catch(error => {
        console.log(error);
      });
    axios.get(`https://localhost:7078/api/Product/${id}`)
      .then(response => {
        setProduct2(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, [id]);


  const handleAddToCart = () => {
    const matchingProduct = product.find(product =>
      selectedColors.includes(product.color) && selectedSizes.includes(product.size)
    );


    const cartProduct = listCart.find(item =>
      item.color === selectedColors[0] &&
      item.size === selectedSizes[0] &&
      item.id === +id
    );
    const cartQuantity = cartProduct ? cartProduct.quantity : 0;

    if (matchingProduct && (quantity + cartQuantity) > matchingProduct.quantity) {
      Swal.fire({
        title: 'Cảnh báo',
        text: 'Số lượng bạn chọn vượt quá số lượng tồn kho',
        icon: 'warning',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      });
    } else {
      const cart = {
        color: selectedColors[0],
        hinh: product2.hinhs[0],
        id: +id,
        loaiGiam: selectedDetail.discountType,
        menhGia: selectedDetail.discountAmount,
        quantity: quantity,
        size: selectedSizes[0],
        ten: product2.ten,
        gia: originalPrice
      };
      console.log(cart);
      handleAddCart(cart);
    }
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
    const matchingProduct = product.find(product =>
      selectedColors.includes(product.color) && selectedSizes.includes(product.size)
    );

    if (matchingProduct) {
      setQuantity(prevQuantity => {
        if (prevQuantity < matchingProduct.quantity) {
          return prevQuantity + 1;
        } else {
          Swal.fire({
            title: 'Cảnh báo',
            text: 'Vượt quá số lượng tồn kho',
            icon: 'warning',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false
          });
          return prevQuantity;
        }
      });
    } else {
      alert('Không tìm thấy sản phẩm phù hợp.');
    }
  };

  const handleDecrement = () => {
    setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const handleQuantityChange = (event) => {
    const value = Math.max(1, Number(event.target.value));
    const matchingProduct = product.find(product =>
      selectedColors.includes(product.color) && selectedSizes.includes(product.size)
    );

    if (matchingProduct) {
      if (value > matchingProduct.quantity) {
        Swal.fire({
          title: 'Cảnh báo',
          text: 'Vượt quá số lượng tồn kho',
          icon: 'warning',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        });
        setQuantity(matchingProduct.quantity);
      } else {
        setQuantity(value);
      }
    } else {
      alert('Không tìm thấy sản phẩm phù hợp.');
    }
  };

  const matchingProduct = product.find(detail =>
    selectedSizes.includes(detail.size) && selectedColors.includes(detail.color)
  );

  const availableQuantity = matchingProduct ? matchingProduct.quantity : 0;

  if (isLoading) {
    return <Loading />;
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
        {availableQuantity > 0 ? (
          <div className="col-md-6 ProductDetail">
            <p className="ProductName">{product2.ten}</p>
            <hr />
            <div className="saleBlock">
              <div className="sale">
                {`${selectedDetail.discountAmount}${selectedDetail.discountType === true ? ' %' : ' đ'}`}
              </div>
              <div className="money">
                <div className="MoneyRed">{`${totalPrice.toLocaleString()} đ`}</div>
                <div className="Moneygach">{`${originalPrice.toLocaleString()} đ`}</div>
              </div>
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
                onChange={(event) => handleQuantityChange(event)}
                style={{ textAlign: 'center', MozAppearance: 'textfield' }} // Center align the text
              />
              <button className="minus" onClick={handleIncrement}>+</button>
            </div>
            <br />
            <div className="button-them">
              <button className="align-item-center add-cart" onClick={handleAddToCart}>Thêm vào giỏ hàng</button>
            </div>
            <br />
            <p className="MoTa">Mô tả:</p>
            <p className="TenMoTa">{product2.moTa}</p>
          </div>
        ) : (
          <div className="col-md-6 ProductDetail">
            <p className="ProductName">{product2.ten}</p>
            <hr />
            <div className="saleBlock">
              <div className="sale">
                {`${selectedDetail.discountAmount}${selectedDetail.discountType === true ? ' %' : ' đ'}`}
              </div>
              <div className="money">
                <div className="MoneyRed">{`${totalPrice.toLocaleString()} đ`}</div>
                <div className="Moneygach">{`${originalPrice.toLocaleString()} đ`}</div>
              </div>
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
              <input
                className="quantity"
                value={quantity}
                min={1}
                type="number"
                onChange={(event) => handleQuantityChange(event)}
                style={{ textAlign: 'center', MozAppearance: 'textfield' }}
                readOnly// Center align the text
              />
            </div>
            <br />
            <div className="button-them">
              <button className="align-item-center add-cart" disabled>Hết hàng</button>
            </div>
            <br />
            <p className="MoTa">Mô tả:</p>
            <p className="TenMoTa">{product2.moTa}</p>
          </div>
        )}
      </div>
      <br />
      <h1 className="dung text-center pb-3">Sản phẩm liên quan</h1>
      <div className="row prodcut-card">
        {relateproduct && relateproduct.length > 0 ? (
          relateproduct.map((product, index) => (
            <div className="col-md-2 product" key={product.id}>
              <div className="product-main">
                <div className="hovereffect">
                  <img className="img-fluid" src={product.hinh} alt={"img product " + index} />
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
                  <span className="price">{product.loaiGiam ? (product.gia - ((product.gia * product.menhGia) / 100)).toLocaleString('vi-VN') + " đ" : (product.gia - product.menhGia).toLocaleString('vi-VN') + " đ"}</span>
                  <span className="priced">{product.maGiamGia === null ? "" : product.gia.toLocaleString('vi-VN') + "đ"} </span>
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
