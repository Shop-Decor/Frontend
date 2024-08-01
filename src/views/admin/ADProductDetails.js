import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Đảm bảo bạn đã cài đặt Bootstrap
import Swal from 'sweetalert2';


const ADProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [productDetails, setProductDetails] = useState([]);
    const [editableDetails, setEditableDetails] = useState({});
    const [newDetail, setNewDetail] = useState({
        SpId: id,
        gia: '',
        soLuong: '',
        tenMauSac: '',
        tenKichThuoc: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [errors, setErrors] = useState({
        gia: '',
        soLuong: '',
        tenMauSac: '',
        tenKichThuoc: ''
    });
    const [errorTimeout, setErrorTimeout] = useState(null);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
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

    const handleDelete = async (productDetailId) => {
        Swal.fire({
            title: 'Bạn có chắc chắn muốn xóa chi tiết sản phẩm này?',
            text: 'Chi tiết sản phẩm sẽ bị xóa vĩnh viễn!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(`https://localhost:7078/api/ProductDetails/${productDetailId}`);
                    if (response.status === 200) {
                        setProductDetails(prevDetails => prevDetails.filter(detail => detail.id !== productDetailId));
                        setSuccessMessage('Xóa chi tiết sản phẩm thành công!');
                        setTimeout(() => {
                            setSuccessMessage('');
                        }, 3000);
                    } else {
                        setErrorMessage('Có lỗi xảy ra khi xóa chi tiết sản phẩm. Vui lòng thử lại!');
                    }
                } catch (error) {
                    setErrorMessage(`Có lỗi xảy ra khi xóa chi tiết sản phẩm: ${error.message}`);
                }
            }
        });
    };


    const handleEdit = (productDetail) => {
        setEditableDetails(prevDetails => ({
            ...prevDetails,
            [productDetail.id]: productDetail
        }));
    };

    const handleChange = (e, id) => {
        const { name, value } = e.target;
    
        // Kiểm tra số dương và không cho phép nhập chữ cho giá và số lượng
        if (name === 'gia' || name === 'soLuong') {
            // Sử dụng regex để loại bỏ ký tự không phải số
            const numericValue = value.replace(/[^0-9.]/g, '');
            setEditableDetails(prevDetails => ({
                ...prevDetails,
                [id]: {
                    ...prevDetails[id],
                    [name]: numericValue
                }
            }));
        } else {
            setEditableDetails(prevDetails => ({
                ...prevDetails,
                [id]: {
                    ...prevDetails[id],
                    [name]: value
                }
            }));
        }
    };
    
    
    
    
    const handleSave = async (id) => {
        const updatedDetail = editableDetails[id];
        let errorMessages = {
            gia: '',
            soLuong: '',
            tenMauSac: '',
            tenKichThuoc: ''
        };
    
        // Kiểm tra các điều kiện
        if (!updatedDetail.gia || isNaN(updatedDetail.gia) || updatedDetail.gia < 0) errorMessages.gia = 'Giá phải là số dương và không được để trống.';
        if (!updatedDetail.soLuong || isNaN(updatedDetail.soLuong) || updatedDetail.soLuong < 0) errorMessages.soLuong = 'Số lượng phải là số dương và không được để trống.';
        if (!updatedDetail.tenMauSac) errorMessages.tenMauSac = 'Màu sắc không được để trống.';
        if (!updatedDetail.tenKichThuoc) errorMessages.tenKichThuoc = 'Kích thước không được để trống.';
    
        if (Object.values(errorMessages).some(msg => msg)) {
            setErrors(errorMessages);
            if (errorTimeout) {
                clearTimeout(errorTimeout);
            }
            setErrorTimeout(setTimeout(() => {
                setErrors({
                    gia: '',
                    soLuong: '',
                    tenMauSac: '',
                    tenKichThuoc: ''
                });
            }, 3000));
            setErrorMessage('');
            return;
        }
    
        try {
            const response = await axios.put(`https://localhost:7078/api/ProductDetails/${id}`, updatedDetail);
            if (response.status === 200) {
                setProductDetails(prevDetails =>
                    prevDetails.map(detail =>
                        detail.id === id ? updatedDetail : detail
                    )
                );
                setEditableDetails(prevDetails => {
                    const updatedDetails = { ...prevDetails };
                    delete updatedDetails[id];
                    return updatedDetails;
                });
                setSuccessMessage('Cập nhật chi tiết sản phẩm thành công!');
                setTimeout(() => {
                    setSuccessMessage('');
                }, 3000);
            } else {
                setErrorMessage('Có lỗi xảy ra khi cập nhật chi tiết sản phẩm. Vui lòng thử lại!');
            }
        } catch (error) {
            setErrorMessage(`Có lỗi xảy ra khi cập nhật chi tiết sản phẩm: ${error.message}`);
        }
    };
    


    const handleNewDetailChange = (e) => {
        const { name, value } = e.target;

        // Chỉ cho phép số dương và không cho phép nhập chữ
        const numericValue = parseFloat(value);
        if (!isNaN(numericValue) && numericValue >= 0) {
            setNewDetail(prevDetail => ({
                ...prevDetail,
                [name]: value
            }));
        }
    };



    const handleAddNewDetail = async () => {
        let errorMessages = {
            gia: '',
            soLuong: '',
            tenMauSac: '',
            tenKichThuoc: ''
        };

        // Kiểm tra các điều kiện
        if (!newDetail.gia || isNaN(newDetail.gia) || newDetail.gia < 0) errorMessages.gia = 'Giá phải là số dương.';
        if (!newDetail.soLuong || isNaN(newDetail.soLuong) || newDetail.soLuong < 0) errorMessages.soLuong = 'Số lượng phải là số dương.';
        if (!newDetail.tenMauSac) errorMessages.tenMauSac = 'Màu sắc không được để trống.';
        if (!newDetail.tenKichThuoc) errorMessages.tenKichThuoc = 'Kích thước không được để trống.';

        if (Object.values(errorMessages).some(msg => msg)) {
            setErrors(errorMessages);
            if (errorTimeout) {
                clearTimeout(errorTimeout);
            }
            setErrorTimeout(setTimeout(() => {
                setErrors({
                    gia: '',
                    soLuong: '',
                    tenMauSac: '',
                    tenKichThuoc: ''
                });
            }, 3000));
            setErrorMessage('');
            return;
        }
        try {
            const response = await axios.post('https://localhost:7078/api/ProductDetails', newDetail);
            if (response.status === 201) {
                setProductDetails(prevDetails => [...prevDetails, response.data]);
                setNewDetail({
                    SpId: id,
                    gia: '',
                    soLuong: '',
                    tenMauSac: '',
                    tenKichThuoc: '',
                });
                setShowModal(false);
                setSuccessMessage('Thêm chi tiết sản phẩm thành công!');
                setTimeout(() => {
                    setSuccessMessage('');
                }, 3000);
            } else {
                setErrorMessage('Có lỗi xảy ra khi thêm chi tiết sản phẩm. Vui lòng thử lại!');
            }
        } catch (error) {
            setErrorMessage(`Có lỗi xảy ra khi thêm chi tiết sản phẩm: ${error.message}`);
        }
    };


    if (loading) {
        return <div className="alert alert-info">Đang tải dữ liệu...</div>;
    }

    if (errorMessage) {
        return <div className="alert alert-danger">{errorMessage}</div>;
    }

    return (
        <div className="container my-4">
            {/* <h2>Chi Tiết Sản Phẩm</h2> */}


            <div className="d-flex justify-content-end">
                <button className="btn btn-success mb-3 " onClick={() => setShowModal(true)}>Thêm Chi Tiết</button>
            </div>

            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {productDetails.length === 0 ? (
                <div className="alert alert-warning">Không tìm thấy chi tiết sản phẩm</div>
            ) : (
                productDetails.map((detail) => (
                    <div key={detail.id} className="mb-3">
                        {editableDetails[detail.id] ? (
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="card-title">Chỉnh sửa chi tiết sản phẩm</h5>
                                </div>
                                <div className="card-body">
                                    <div className="container mt-4">
                                        <div className="row mb-3">
                                            <label className="col-md-4 col-form-label">ID</label>
                                            <div className="col-md-8">
                                                <input type="text" className="form-control" name="id" value={editableDetails[detail.id].id} readOnly />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <label className="col-md-4 col-form-label">Giá</label>
                                            <div className="col-md-8">
                                                <input type="number" className="form-control" name="gia" value={editableDetails[detail.id].gia} onChange={(e) => handleChange(e, detail.id)} />
                                                {errors.gia && <div className="text-danger">{errors.gia}</div>}
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <label className="col-md-4 col-form-label">Số Lượng</label>
                                            <div className="col-md-8">
                                                <input type="number" className="form-control" name="soLuong" value={editableDetails[detail.id].soLuong} onChange={(e) => handleChange(e, detail.id)} />
                                                {errors.soLuong && <div className="text-danger">{errors.soLuong}</div>}
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <label className="col-md-4 col-form-label">Màu Sắc</label>
                                            <div className="col-md-8">
                                                <input type="text" className="form-control" name="tenMauSac" value={editableDetails[detail.id].tenMauSac} onChange={(e) => handleChange(e, detail.id)} />
                                                {errors.tenMauSac && <div className="text-danger">{errors.tenMauSac}</div>}
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <label className="col-md-4 col-form-label">Kích Thước</label>
                                            <div className="col-md-8">
                                                <input type="text" className="form-control" name="tenKichThuoc" value={editableDetails[detail.id].tenKichThuoc} onChange={(e) => handleChange(e, detail.id)} />
                                                {errors.tenKichThuoc && <div className="text-danger">{errors.tenKichThuoc}</div>}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-12 text-end">
                                                <button className="btn btn-primary me-2" onClick={() => handleSave(detail.id)}>Lưu</button>
                                                <button className="btn btn-secondary" onClick={() => setEditableDetails(prevDetails => {
                                                    const updatedDetails = { ...prevDetails };
                                                    delete updatedDetails[detail.id];
                                                    return updatedDetails;
                                                })}>Hủy</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (

                            <div className="container mb-3">
                                <div className="card">
                                    <div className="card-header">
                                        <h5 className="card-title">Chi Tiết Sản Phẩm</h5>
                                    </div>
                                    <div className="card-body">

                                        <div className="row mb-3">
                                            <label className="col-sm-4 col-form-label fw-bold">Giá</label>
                                            <div className="col-sm-8">
                                                <p className="form-control-plaintext">{detail.gia}</p>
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <label className="col-sm-4 col-form-label fw-bold">Số Lượng</label>
                                            <div className="col-sm-8">
                                                <p className="form-control-plaintext">{detail.soLuong}</p>
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <label className="col-sm-4 col-form-label fw-bold">Màu Sắc</label>
                                            <div className="col-sm-8">
                                                <p className="form-control-plaintext">
                                                    {detail.tenMauSac}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <label className="col-sm-4 col-form-label fw-bold">Kích Thước</label>
                                            <div className="col-sm-8">
                                                <p className="form-control-plaintext">{detail.tenKichThuoc}</p>
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-sm-12 text-end">
                                                <button className="btn btn-primary me-2" onClick={() => handleEdit(detail)}>Sửa</button>
                                                <button className="btn btn-danger" onClick={() => handleDelete(detail.id)}>Xóa</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        )}
                    </div>
                ))
            )}


            {/* THÊM */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Thêm Chi Tiết Sản Phẩm</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Giá</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="gia"
                                        value={newDetail.gia}
                                        onChange={handleNewDetailChange}
                                        min="0"
                                    />
                                    {errors.gia && <div className="text-danger">{errors.gia}</div>}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Số Lượng</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="soLuong"
                                        value={newDetail.soLuong}
                                        onChange={handleNewDetailChange}
                                        min="0"
                                    />
                                    {errors.soLuong && <div className="text-danger">{errors.soLuong}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Màu Sắc</label>
                                    <input type="text" className="form-control" name="tenMauSac" value={newDetail.tenMauSac} onChange={handleNewDetailChange} />
                                    {errors.tenMauSac && <div className="text-danger">{errors.tenMauSac}</div>}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Kích Thước</label>
                                    <input type="text" className="form-control" name="tenKichThuoc" value={newDetail.tenKichThuoc} onChange={handleNewDetailChange} />
                                    {errors.tenKichThuoc && <div className="text-danger">{errors.tenKichThuoc}</div>}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Đóng</button>
                                <button type="button" className="btn btn-primary" onClick={handleAddNewDetail}>Lưu</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            <div className="modal-backdrop fade show" style={{ display: showModal ? 'block' : 'none' }}></div>

            <div className="modal-footer mt-4">
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>Quay lại</button>
            </div>
        </div>
    );
};

export default ADProductDetails;
