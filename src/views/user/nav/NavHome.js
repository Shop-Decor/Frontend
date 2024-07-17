import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../../../assets/images/shopdecor.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faCircleUser,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import "../../../styles/user/nav/Nav.scss";

class NavHome extends React.Component {
  render() {
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
                <li className="nav-item dropdown">
                  <NavLink
                    className={({ isActive }) =>
                      isActive
                        ? "nav-link active dropdown-toggle"
                        : "nav-link dropdown-toggle"
                    }
                    to="/ad"
                    role="button"
                    data-bs-toggle="dropdown"
                  >
                    Sản phẩm
                  </NavLink>
                  <ul className="dropdown-menu">
                    <li>
                      <NavLink className="dropdown-item" to="/ProductUser">
                        Link
                      </NavLink>
                    </li>
                    <li>
                      <NavLink className="dropdown-item" to="/ad/link2">
                        Another link
                      </NavLink>
                    </li>
                    <li>
                      <NavLink className="dropdown-item" to="/ad/link3">
                        A third link
                      </NavLink>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                    to="/ProductDetail"
                  >
                    Giới thiệu
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                    to="/User"
                  >
                    Liên hệ
                  </NavLink>
                </li>
              </ul>
              <ul className="navbar-nav icon-btn">
                <li className="nav-item">
                  <Link className="nav-link icon" to="/giohang">
                    <FontAwesomeIcon icon={faCartShopping} />
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link icon" to="/timkiem">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link icon" to="/dangnhap">
                    <FontAwesomeIcon icon={faCircleUser} />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </>
    );
  }
}

export default NavHome;
