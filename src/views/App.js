import React from "react";
import "../styles/App.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import ADhome from "../views/admin/ADhome";
import ProductUser from "./user/ProductUser";
import GioHang from "./user/GioHang"
import Slider from "./user/slider/Slider";
import NavHome from "./user/nav/NavHome";
import Footer from "./user/footer/Footer";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./user/Home";
import ProductDetail from "./user/ProductDetail";
import Payment from "./user/payment";

class App extends React.Component {
  render() {
    return (
      <div className="container">
        <BrowserRouter>
          <NavHome />
          <Slider />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ProductDetail" element={<ProductDetail />} />
            <Route path="/Payment" element={<Payment />} />
            <Route path="/ProductUser" element={<ProductUser />} />
            <Route path="/GioHang" element={<GioHang />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
