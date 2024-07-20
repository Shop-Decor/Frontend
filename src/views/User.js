import React from "react";

class User extends React.Component {
    render() {
        return (
            <div className="container">
                <BrowserRouter>
                    <NavHome />
                    <Slider />
                    <Routes>
                        <Route path="/Home" element={<Home />} />
                        <Route path="/ProductDetail" element={<ProductDetail />} />
                        <Route path="/Payment" element={<Payment />} />
                        <Route path="/ProductUser" element={<ProductUser />} />
                        <Route path="/GioHang" element={<GioHang />} />
                    </Routes>
                    <Footer />
                </BrowserRouter>
            </div>
        )
    }
}