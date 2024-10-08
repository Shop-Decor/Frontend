import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import logo from "../../../assets/images/shopdecor.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faCircleUser,
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

  const [isFocused, setIsFocused] = useState(false);
  const [searchList, setSearchList] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const navigate = useNavigate();

  const [user, setUser] = useState();
  const [token, setToken] = useState();

  const handleCheckout = () => {
    navigate('/Payment', { state: { listCart, total } });
  };

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

  const fetchProductSearch = async () => {
    try {
      const params = {};
      if (debouncedSearch) params.key = debouncedSearch;
      let res = await axios.get(`https://localhost:7078/api/Product/autosearch`, { params });
      setSearchList(res.data || []);
    } catch (error) {
      console.error('Lỗi lấy dữ liệu api tìm kiếm sản phẩm:', error);
    }
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 200);
    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  useEffect(() => {
    fetchProductSearch();
  }, [debouncedSearch]);

  const handleClickLink = (id) => {
    setIsFocused(false);
    setSearch("");
    navigate(`/ProductDetail/${id}`);
  }

  const handleSubmit = (event) => {
    if (event.key === "Enter") {
      setIsFocused(false);
      setSearch("");
      navigate(`/search/${search}`);
    }
  }

  const location = useLocation();

  useEffect(() => {
    if (categories && categories.some(item => location.pathname.includes(`/ProductUser/${item.id}`))) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [location, categories]);

  //get user 

  useEffect(() => {
    let token = localStorage.getItem('token');
    setToken(token);
    if (token) {
      setUser(jwtDecode(token));
    }
    else {
      setUser({});
    }
  }, []);

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
                  to="/contactus"
                >
                  Giới thiệu
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                  to="/About"
                >
                  Liên hệ
                </NavLink>
              </li>
            </ul>
            <ul className="navbar-nav icon-btn">
              <li className="nav-item d-flex search">
                <input className="form-control"
                  type="search"
                  placeholder="Tìm kiếm sản phẩm"
                  value={search}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                  onChange={(event) => setSearch(event.target.value)}
                  onKeyDown={(event) => handleSubmit(event)}
                />
                {isFocused && searchList && searchList.length > 0 && (
                  <div className="sub-search">
                    {searchList.slice(0, 5).map((item, index) => (
                      <div className="product-search" key={item.id}>
                        <div className="product-content-search">
                          <p className="name" onClick={() => handleClickLink(item.id)}>
                            {item.ten}
                          </p>
                          <span className="price">
                            {item.khuyenMai ? (item.khuyenMai.loaiGiam ? `${item.gia - (item.gia * item.khuyenMai.menhGia / 100)} đ` : `${item.gia - item.khuyenMai.menhGia} đ`) : ""}
                          </span>
                          <span className="priced">
                            {`${item.gia} đ`}
                          </span>
                        </div>
                        <div className="product-img-search">
                          <img className="img-fluid" src={item.hinh} />
                        </div>
                      </div>
                    ))}
                    <div className="more">
                      {searchList.length > 5 && (
                        <a className="btn-more" href="#">Xem thêm {searchList.length - 5} sản phẩm</a>
                      )}
                    </div>
                  </div>
                )}
              </li>
              <li className="nav-item user-menu">
                {token && user ?
                  <>
                    <Link className="menu-link" to="/User ">
                      <img src={user.Link} className="img-account" alt="img account" />
                    </Link>
                    <div className="sub-user-menu">
                      <ul>
                        <li className="sub-item">
                          <Link className="sub-link" to="/User">
                            Tài khoản của tôi
                          </Link>
                        </li>
                        <li className="sub-item">
                          <Link className="sub-link" to="/user/order">
                            Đơn mua
                          </Link>
                        </li>
                        <li className="sub-item">
                          <Link className="sub-link" to="/SignIn">
                            Đăng xuất
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </>
                  :
                  <Link className="nav-link icon" to="/User ">
                    <FontAwesomeIcon icon={faCircleUser} />
                  </Link>
                }
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
                      <Link className="grow_skew_forward" to="/cart">
                        Xem giỏ hàng
                      </Link>
                      <a className="grow_skew_forward" onClick={() => handleCheckout()}>
                        Thanh toán
                      </a>
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