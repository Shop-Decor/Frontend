import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ADProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [productDetails, setProductDetails] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProductDetails = async () => {
            console.log(`Fetching details for product ID: ${id}`); // Log id
            try {
                // const response = await axios.get(`https://localhost:7078/api/ProductDetails/GetProductDetailsbyproduct?SpId=${id}`);
                const response = await axios.get(`https://localhost:7078/api/ProductDetails/GetProductDetailsbyproduct?SpId=${id}`);

                if (response.status === 200) {
                    setProductDetails(response.data);
                } else {
                    setErrorMessage('Có lỗi xảy ra khi tải chi tiết sản phẩm. Vui lòng thử lại!');
                }
            } catch (error) {
                setErrorMessage(`Có lỗi xảy ra khi tải chi tiết sản phẩm: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };
    
        fetchProductDetails();
    }, [id]);
    

    if (loading) {
        return <div className="alert alert-info">Đang tải dữ liệu...</div>;
    }

    if (errorMessage) {
        return <div className="alert alert-danger">{errorMessage}</div>;
    }

    if (!productDetails.length) {
        return <div className="alert alert-warning">Không tìm thấy chi tiết sản phẩm</div>;
    }

    return (
        <div className="container my-4">
            <h2>Chi Tiết Sản Phẩm</h2>
            {productDetails.map((detail, index) => (
                <div key={index} className="mb-3">
                    <div className="row mb-3">
                        <label className="col-sm-4 col-form-label">ID</label>
                        <div className="col-sm-8">
                            <p>{detail.id}</p>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label className="col-sm-4 col-form-label">Giá</label>
                        <div className="col-sm-8">
                            <p>{detail.gia}</p>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label className="col-sm-4 col-form-label">Số Lượng</label>
                        <div className="col-sm-8">
                            <p>{detail.soLuong}</p>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label className="col-sm-4 col-form-label">Màu Sắc</label>
                        <div className="col-sm-8">
                            <p>{detail.tenMauSac}</p>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label className="col-sm-4 col-form-label">Kích Thước</label>
                        <div className="col-sm-8">
                            <p>{detail.tenKichThuoc}</p>
                        </div>
                    </div>
                </div>
            ))}
            <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>Quay lại</button>
            </div>
        </div>
    );
};

export default ADProductDetails;
