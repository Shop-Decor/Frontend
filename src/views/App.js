import React from "react";
import "../styles/App.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import ADhome from "../views/admin/ADhome";
import ProductUser from "./user/ProductUser";
import GioHang from "./user/GioHang"
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import Home from "./user/Home";
import ProductDetail from "./user/ProductDetail";
import Payment from "./user/payment";
import Navbar from "./user/nav/NavHome";
import Slider from "./user/slider/Slider";
import Footer from "./user/footer/Footer";

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>

          <Route path="/Admin" element={<ADhome />} />

          <Route path="/" element={<LayoutWithNavbarFooterSlide />}>
            <Route index element={<Home />} />
            <Route path="ProductDetail" element={<ProductDetail />} />
            <Route path="Payment" element={<Payment />} />
            <Route path="/ProductUser" element={<ProductUser />} />
            <Route path="/GioHang" element={<GioHang />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  }
}

const LayoutWithNavbarFooterSlide = () => (
  <>
    <Navbar />
    <Slider />
    <Outlet />
    <Footer />
  </>
);

export default App;
