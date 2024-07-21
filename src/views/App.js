import React from "react";
import "../styles/App.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import ADhome from "./admin/ADhome";
import ADtest from "./admin/ADtest";
import ProductUser from "./user/ProductUser";
import GioHang from "./user/GioHang"
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import Home from "./user/Home";
import ProductDetail from "./user/ProductDetail";
import Payment from "./user/payment";
import Navbar from "./user/nav/NavHome";
import Slider from "./user/slider/Slider";
import Footer from "./user/footer/Footer";
import AdminLayout from "./admin/AdminLayout";

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>

          <Route path="" element={<LayoutWithNavbarFooterSlide />}>
            <Route index element={<Home />} />
            <Route path="ProductDetail" element={<ProductDetail />} />
            <Route path="Payment" element={<Payment />} />
            <Route path="ProductUser" element={<ProductUser />} />
            <Route path="GioHang" element={<GioHang />} />
          </Route>

          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<ADhome />} />
            <Route path="test" element={<ADtest />} />
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
    <div className="container">
      <Outlet />
    </div>
    <Footer />
  </>
);

export default App;
