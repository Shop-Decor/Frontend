import React from "react";
import "../styles/App.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import ADhome from "./admin/ADhome";
import ADtest from "./admin/ADtest";
import ADCategory from "./admin/ADCategory";
import ADOrder from "./admin/ADOrder";
import ProductUser from "./user/ProductUser";
import Cart from "./user/Cart"
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import Home from "./user/Home";
import ProductDetail from "./user/ProductDetail";
import Payment from "./user/payment";
import Navbar from "./user/nav/NavHome";
import Slider from "./user/slider/Slider";
import Footer from "./user/footer/Footer";
import AdminLayout from "./admin/AdminLayout";
import ADDiscount from "./admin/ADDiscount";
import ADAccount from './admin/Account/ADAccount';
import ADProduct from "./admin/ADProduct";
import SignIn from "./user/SignIn";

class App extends React.Component {
  renderSignIn = () => {
        return <SignIn />;
    };
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="" element={<LayoutWithNavbarFooterSlide />}>
            <Route index element={<Home />} />
            <Route path="ProductDetail/:id" element={<ProductDetail />} />
            <Route path="Payment" element={<Payment />} />
            <Route path="ProductUser" element={<ProductUser />} />
            <Route path="Cart" element={<Cart />} />
            <Route path="SignIn" element={<SignIn />} />
          </Route>

          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<ADhome />} />
            <Route path="test" element={<ADtest />} />
            <Route path="discount" element={<ADDiscount />} />
            <Route path="ADAccount" element={<ADAccount  render = {this.renderSignIn}/>} />
            <Route path="ADCategory" element={<ADCategory />} />
            <Route path="ADOrder" element={<ADOrder />} />
            <Route path="product" element={<ADProduct />} />
          </Route>
          <Route path="SignIn" >
            <Route index element={<SignIn />} />

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
