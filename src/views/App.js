import React from "react";
import '../styles/App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import ADhome from "../views/admin/ADhome";
import SanPham from "./user/SanPham";
import NavHome from "./user/nav/NavHome";
import Footer from "./user/footer/Footer";
import { BrowserRouter, Route, Routes } from "react-router-dom";

class App extends React.Component {
    render() {
        return (
            <div className="container">
                <BrowserRouter>
                    <NavHome />
                    <Routes>
                        <Route path='/' element={<SanPham />} />
                        <Route path='/ad' element={<ADhome />} />
                    </Routes>
                    <Footer />
                </BrowserRouter>
            </div>
        )
    }
}

export default App;