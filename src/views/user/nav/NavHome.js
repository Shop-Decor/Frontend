import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import logo from "../../../assets/images/shopdecor.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faCircleUser,
  faMagnifyingGlass,
  faXmark
} from "@fortawesome/free-solid-svg-icons";
import "../../../styles/user/nav/Nav.scss";
import "../../../styles/user/btn/btn.scss";


const NavHome = (props) => {
  const [isCartVisible, setIsCartVisible] = useState(false);
  const cartRef = useRef(null);
  const cartIconRef = useRef(null);

  const { listCart, setListCart, total } = props;
  const [categories, setCategories] = useState();
  const [isActive, setIsActive] = useState(false);

  const toggleCart = (e) => {
    e.stopPropagation();
    setIsCartVisible((prev) => !prev);
  };

  const handleClickOutside = (e) => {
    if (isCartVisible && cartRef.current && !cartRef.current.contains(e.target) && !cartIconRef.current.contains(e.target)) {
      setIsCartVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isCartVisible]);

  const handleDeleteItem = (index, event) => {
    event.stopPropagation();
    setListCart(cart => cart.filter((_, i) => i !== index));
  }



  const fetchCtegories = async () => {
    try {
      let res = await axios.get('https://localhost:7078/api/Category');
      setCategories(res.data || []);
    } catch (error) {
      console.error('Lỗi lấy dữ liệu api loại sản phẩm:', error);
    }
  }

  useEffect(() => {
    fetchCtegories();
  }, []);

  const handleProductClick = () => {
    setIsActive(!isActive);
  };

  const location = useLocation();

  useEffect(() => {
    if (categories && categories.some(item => location.pathname.includes(`/ProductUser/${item.id}`))) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [location, categories]);


  //get user 
  const userName = localStorage.getItem('userName');
  return (
    <>
      <nav className="navbar navbar-expand-sm">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand">
            <img src={logo} className="img-fluid" alt="Logo" />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapsibleNavbar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="collapsibleNavbar">
            <ul className="navbar-nav main-menu">
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                  to="/"
                >
                  Trang chủ
                </NavLink>
              </li>
              <li className={`menu-item ${isActive ? 'active' : ''}`}>
                <NavLink
                  className={`menu-link ${isActive ? 'active' : ''}`}
                  onClick={handleProductClick}
                  to="/ProductUser"
                >
                  Sản phẩm
                </NavLink>
                <ul className="submenu">
                  {categories && categories.length > 0 &&
                    categories.map((item) => (
                      <li key={`category${item.id}`}>
                        <NavLink className="submenu-item" to={`/ProductUser/${item.id}`}>
                          {item.tenLoai}
                        </NavLink>
                      </li>
                    ))
                  }
                </ul>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                  to="/otheruser"
                >
                  Giới thiệu
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                  to="/Payment"
                >
                  Liên hệ
                </NavLink>
              </li>
            </ul>
            <ul className="navbar-nav icon-btn">
              <li className="nav-item">
                <Link className="nav-link icon" to="/cart">
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </Link>
              </li>
              <li className="nav-item">                
                <Link className="nav-link icon" to="/User ">
                {userName}
                  <FontAwesomeIcon icon={faCircleUser} />
                
                </Link>
              </li>
              <li className="nav-item">
                <div id="cart" className="nav-link icon position-relative" onClick={toggleCart} ref={cartIconRef}>
                  <FontAwesomeIcon icon={faCartShopping} />
                  {
                    listCart.length > 0 &&
                    <span className="position-absolute top-1 start-100 translate-middle badge rounded-pill bg-danger">
                      {listCart.length}
                    </span>
                  }
                </div>
                {isCartVisible && (
                  <div className="shopping-cart" ref={cartRef}>
                    <ul className="shopping-cart-items">
                      {listCart && listCart.length > 0 ?
                        listCart.map((item, index) => {
                          return (
                            <React.Fragment key={index}>
                              <li className="product-mini-cart clearfix">
                                <FontAwesomeIcon className="delete-icon" icon={faXmark} onClick={(event) => handleDeleteItem(index, event)} />
                                <div className="col img-mini-cart">
                                  <img className="img-fluid" src={item.hinh} alt={"img product " + index} />
                                </div>
                                <div className="col content-mini-cart">
                                  <div className="item-name">{item.ten}</div>
                                  <div className="item-number d-flex justify-content-between">
                                    <span className="item-quantity">{item.quantity}</span>
                                    <span className="item-price">{item.loaiGiam ? (item.gia - ((item.gia * item.menhGia) / 100)).toLocaleString('vi-VN') + " đ" : (item.gia - item.menhGia).toLocaleString('vi-VN') + " đ"}</span>
                                  </div>
                                </div>
                              </li>
                            </React.Fragment>
                          )
                        }) :
                        <p>Chưa có sản phẩm</p>
                      }
                      <li className="shopping-cart-footer d-flex justify-content-between">
                        <div className="lighter-text">Tổng cộng: </div>
                        <div className="main-color-text">{total.toLocaleString('vi-VN')} đ</div>
                      </li>
                    </ul>
                    <div className="cart-btn">
                      <a href="#" className="grow_skew_forward">Xem giỏ hàng</a>
                      <a href="#" className="grow_skew_forward">Thanh toán</a>
                    </div>
                  </div>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavHome;