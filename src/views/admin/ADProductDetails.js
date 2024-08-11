import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Đảm bảo bạn đã cài đặt Bootstrap
import Swal from 'sweetalert2';


const ADProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [productDetails, setProductDetails] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);
    const [editableDetails, setEditableDetails] = useState({});
    const [newDetail, setNewDetail] = useState({
        sanPhamId: parseInt(id),
        gia: 0,
        soLuong: 0,
        kichThuocId: 0,
        mauSacId: 0,
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [errors, setErrors] = useState({
        gia: '',
        soLuong: '',
        kichThuocId: '',
        mauSacId: ''
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

    useEffect(() => {
        const LoadData = async () => {
            let [resColors, resSizes] = await Promise.all([
                axios.get('https://localhost:7078/api/CategoryColor'),
                axios.get('https://localhost:7078/api/Category_Size'),
            ]);

            setColors(resColors && resColors.data ? resColors.data : []);
            setSizes(resSizes && resSizes.data ? resSizes.data : []);
        }
        LoadData();
    })


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
    
        if (name === 'gia' || name === 'soLuong') {
            // Chỉ xử lý số nguyên và loại bỏ ký tự không phải số
            const numericValue = value.replace(/[^0-9.]/g, '');
            setEditableDetails(prevDetails => ({
                ...prevDetails,
                [id]: {
                    ...prevDetails[id],
                    [name]: numericValue
                }
            }));
        } else if (name === 'colorId') {
            // Cập nhật màu sắc dựa trên colorId
            const color = colors.find(color => color.id == value);
            setEditableDetails(prevDetails => ({
                ...prevDetails,
                [id]: {
                    ...prevDetails[id],
                    [name]: value,
                    ['color']: color ? color.tenMauSac : ''
                }
            }));
        } else if (name === 'sizeId') {
            // Cập nhật kích thước dựa trên sizeId
            const size = sizes.find(size => size.id == value);
            setEditableDetails(prevDetails => ({
                ...prevDetails,
                [id]: {
                    ...prevDetails[id],
                    [name]: value,
                    ['size']: size ? size.tenKichThuoc : ''
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
    



    const handleSave = async (productDetailId) => {
        const updatedDetail = editableDetails[productDetailId];
        let errorMessages = {
            gia: '',
            soLuong: '',
            tenMauSac: '',
            tenKichThuoc: ''
        };

        // Kiểm tra giá sản phẩm
        if (!updatedDetail.gia || isNaN(updatedDetail.gia) || updatedDetail.gia < 20000) errorMessages.gia = 'Giá phải từ 20,000 VNĐ trở lên.';
        if (!updatedDetail.soLuong || isNaN(updatedDetail.soLuong) || updatedDetail.soLuong < 0) errorMessages.soLuong = 'Số lượng phải là số dương và không được để trống.';
        if (!updatedDetail.colorId || updatedDetail.colorId == 0) errorMessages.tenMauSac = 'Màu sắc không được để trống.';
        if (!updatedDetail.sizeId || updatedDetail.sizeId == 0) errorMessages.tenKichThuoc = 'Kích thước không được để trống.';

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
            const response = await axios.put(`https://localhost:7078/api/ProductDetails`, {
                id: updatedDetail.id,
                gia: parseInt(updatedDetail.gia),
                soLuong: parseInt(updatedDetail.soLuong),
                mauSacId: parseInt(updatedDetail.colorId),
                kichThuocId: parseInt(updatedDetail.sizeId),
                sanPhamId: parseInt(id),
            });
            if (response.status === 200) {
                setProductDetails(prevDetails =>
                    prevDetails.map(detail =>
                        detail.id === productDetailId ? updatedDetail : detail
                    )
                );
                setEditableDetails(prevDetails => {
                    const updatedDetails = { ...prevDetails };
                    delete updatedDetails[productDetailId];
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
        const numericValue = parseFloat(value);
    
        if (name === 'gia') {
            if (!isNaN(numericValue) && numericValue >= 0) { 
                setNewDetail(prevDetail => ({
                    ...prevDetail,
                    [name]: numericValue
                }));
                setErrors(prevErrors => ({
                    ...prevErrors,
                    gia: ''
                }));
            } else {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    gia: 'Giá trị không hợp lệ.'
                }));
            }
        } else {
            if (!isNaN(numericValue) && numericValue >= 0) {
                setNewDetail(prevDetail => ({
                    ...prevDetail,
                    [name]: numericValue
                }));
                setErrors(prevErrors => ({
                    ...prevErrors,
                    [name]: ''
                }));
            } else {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    [name]: 'Giá trị không hợp lệ.'
                }));
            }
        }
    };
    
    



    const handleAddNewDetail = async () => {
        let errorMessages = {
            gia: '',
            soLuong: '',
            tenMauSac: '',
            tenKichThuoc: ''
        };
    
        if (!newDetail.gia || isNaN(newDetail.gia) || newDetail.gia < 0) errorMessages.gia = 'Giá không hợp lệ.'; // Loại bỏ kiểm tra giá nhập tối thiểu
        if(newDetail.gia < 20000) errorMessages.gia = 'Giá không được dưới 20000.';
        if (!newDetail.soLuong || isNaN(newDetail.soLuong) || newDetail.soLuong < 0) errorMessages.soLuong = 'Số lượng phải là số dương.';
        if (!newDetail.mauSacId || newDetail.mauSacId == 0) errorMessages.tenMauSac = 'Màu sắc không được để trống.';
        if (!newDetail.kichThuocId || newDetail.kichThuocId == 0) errorMessages.tenKichThuoc = 'Kích thước không được để trống.';
    
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
                    sanPhamId: id,
                    gia: 0,
                    soLuong: 0,
                    kichThuocId: 0,
                    mauSacId: 0,
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
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="gia"
                                                    value={editableDetails[detail.id]?.gia || ''}
                                                    onChange={(e) => handleChange(e, detail.id)}
                                                />

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
                                                <select
                                                    className="form-control"
                                                    name="colorId"
                                                    value={editableDetails[detail.id].colorId}
                                                    onChange={(e) => handleChange(e, detail.id)}
                                                >
                                                   
                                                    {colors.map(color => (
                                                        <option key={color.id} value={color.id}>
                                                            {color.tenMauSac}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.color && <div className="text-danger">{errors.color}</div>}
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <label className="col-md-4 col-form-label">Kích Thước</label>
                                            <div className="col-md-8">
                                                <select
                                                    className="form-control"
                                                    name="sizeId"
                                                    value={editableDetails[detail.id].sizeId}
                                                    onChange={(e) => handleChange(e, detail.id)}
                                                >
                                                   
                                                    {sizes.map(size => (
                                                        <option key={size.id} value={size.id}>
                                                            {size.tenKichThuoc}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.size && <div className="text-danger">{errors.size}</div>}
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
                                                    {detail.color}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <label className="col-sm-4 col-form-label fw-bold">Kích Thước</label>
                                            <div className="col-sm-8">
                                                <p className="form-control-plaintext">{detail.size}</p>
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
                                        type="text"
                                        className="form-control"
                                        name="gia"
                                        value={newDetail.gia || ''}
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
                                    <label className="form-label">Màu sắc</label>
                                    <div>
                                        <select
                                            className="form-control"
                                            name="mauSacId"
                                            onChange={handleNewDetailChange}
                                        >
                                            <option value="">Chọn màu sắc</option>
                                            {colors.map(color => (
                                                <option key={color.id} value={color.id}>
                                                    {color.tenMauSac}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                {errors.mauSacId && <div className="text-danger">{errors.mauSacId}</div>}

                                <div className="mb-3">
                                    <label className="form-label">Kích thước</label>
                                    <div>
                                        <select
                                            className="form-control"
                                            name="kichThuocId"
                                            onChange={handleNewDetailChange}
                                        >
                                            <option value="">Chọn kích thước</option>
                                            {sizes.map(size => (
                                                <option key={size.id} value={size.id}>
                                                    {size.tenKichThuoc}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                {errors.kichThuocId && <div className="text-danger">{errors.kichThuocId}</div>}


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
