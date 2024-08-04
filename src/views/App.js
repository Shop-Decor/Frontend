import React from "react";
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
import OtherUser from "./user/accountUser/OrderUser";
import LayoutAccountManagement from "./user/accountUser/LayoutAccountManagement";
import SignUp from "./user/SignUp";

class App extends React.Component {
  renderSignIn = () => {
    return <SignIn />;
  };
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="" element={<LayoutUser />}>
            <Route index element={<Home />} />
            <Route path="ProductDetail/:id" element={<ProductDetail />} />
            <Route path="Payment" element={<Payment />} />
            <Route path="ProductUser" element={<ProductUser />} />
            <Route path="Cart" element={<Cart />} />
            <Route path="account" element={<LayoutAccountManagement />}>
              <Route index element={<OtherUser />} />
            </Route>
          </Route>

          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<ADhome />} />
            <Route path="test" element={<ADtest />} />
            <Route path="discount" element={<ADDiscount />} />
            <Route path="ADAccount" element={<ADAccount render={this.renderSignIn} />} />
            <Route path="ADCategory" element={<ADCategory />} />
            <Route path="ADOrder" element={<ADOrder />} />
            <Route path="product" element={<ADProduct />} />
            <Route path="product/ADProductDetails/:id" element={<ADProductDetails />} />
            <Route path="ADStatistics" element={<ADStatistics />} /> {/* Thêm route cho Statistics */}
          </Route>
          <Route path="SignIn" >
            <Route index element={<SignIn />} />
          </Route>
          <Route path="SignUp" >
            <Route index element={<SignUp />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;
