import React, { useEffect } from "react";
import "../styles/App.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import ADhome from "./admin/ADhome";
import ADtest from "./admin/ADtest";
import ADCategory from "./admin/ADCategory";
import ADOrder from "./admin/ADOrder";
import ProductUser from "./user/ProductUser";
import Cart from "./user/Cart";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./user/Home";
import LayoutUser from "./user/LayoutUser";
import ProductDetail from "./user/ProductDetail";
import Payment from "./user/payment";
import AdminLayout from "./admin/AdminLayout";
import ADDiscount from "./admin/ADDiscount";
import ADAccount from './admin/Account/ADAccount';
import ADProduct from "./admin/ADProduct";
import SignIn from "./user/SignIn";
import ADProductDetails from "./admin/ADProductDetails";
import ADStatistics from "./admin/ADStatistics"; // Import ADStatistics component
import OrderUser from "./user/accountUser/OrderUser";
import OrderUserDetail from "./user/accountUser/OrderUserDetail";
import LayoutAccountManagement from "./user/accountUser/LayoutAccountManagement";
import SignUp from "./user/SignUp";
import ADDetailAccount from "./admin/Account/ADDetailAccount";
import UserDetail from "./user/accountUser/DetailAccount";
import Search from "./user/Search";
import About from "./user/about";
import ContactUs from "./user/contactus";
import AccessTo from "./loading/AccessTo";
import { jwtDecode } from "jwt-decode";

const App = () => {

  const isAdmin = () => {
    let token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
    let user = jwtDecode(token);
    const role = user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    if (role === 'Admin') {
      return true;
    }
    return false;

  };

  // AdminRoute component to protect admin routes
  const AdminRoute = ({ children }) => {
    return isAdmin() ? children : <AccessTo />;
  };

  //userRoute component to protect user routes
  const isUser = () => {
    let token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
    let user = jwtDecode(token);
    const role = user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    if (role === 'User') {
      return true;
    }
    if (role === 'Admin') {
      return false;
    }
    return false;
  };
  const UserRoute = ({ children }) => {
    return isUser() ? children : <AccessTo />;
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<UserRoute><LayoutUser /></UserRoute>}>
          <Route index element={<Home />} />
          <Route path="ProductDetail/:id" element={<ProductDetail />} />
          <Route path="Payment" element={<Payment />} />
          <Route path="ProductUser" element={<ProductUser />} />
          <Route path="ProductUser/:id" element={<ProductUser />} />
          <Route path="Cart" element={<Cart />} />
          <Route path="search/:key" element={<Search />} />
          <Route path="About" element={<About />} />
          <Route path="Contactus" element={<ContactUs />} />
          <Route path="user" element={<LayoutAccountManagement />}>
            <Route index element={<UserDetail />} />
            <Route path="order" element={<OrderUser />} />
            <Route path="order/orderdetail/:id" element={<OrderUserDetail />} />
          </Route>
        </Route>
          <Route path="admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<ADStatistics />} />
            <Route path="test" element={<ADtest />} />
            <Route path="discount" element={<ADDiscount />} />
            <Route path="ADAccount" element={<ADAccount  />} />
            <Route path="ADCategory" element={<ADCategory />} />
            <Route path="ADOrder" element={<ADOrder />} />
            <Route path="product" element={<ADProduct />} />
            <Route path="product/ADProductDetails/:id" element={<ADProductDetails />} />
            <Route path="ADStatistics" element={<ADStatistics />} /> {/* Thêm route cho Statistics */}
            <Route path="ADDetailAccount" element={<ADDetailAccount />} />
        </Route>
        <Route path="SignIn" >
          <Route index element={<SignIn />} />
        </Route>
        <Route path="SignUp" >
          <Route index element={<SignUp />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
