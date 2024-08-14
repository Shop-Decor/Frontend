import React, { useEffect } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import { imageDb } from "../../services/config";
import { v4 } from "uuid";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Swal from 'sweetalert2';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const getStatusColor = (status) => {
    return status === true ? 'green' : 'red';
};

const statusIndicatorStyle = {
    display: 'inline-block',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    margin: '0 auto'
};

const imageStyle = {
    width: '100px',
    height: 'auto',
    objectFit: 'cover'
};


class ADProduct extends React.Component {
    state = {
        products: [],
        imgFiles: [],
        imgUrl: [],
        imgPreviews: [],
        product: {
            ten: '',
            moTa: '',

            hinhs: [],
            chiTietSanPham: [
                {
                    gia: 0,
                    soLuong: 0,
                    mauSacId: 0,
                    kichThuocId: 0,
                }
            ],

        },
        productEdit: {
            id: '',
            ten: '',
            moTa: '',
            trangThai: '',

            Imgs: []
        },
        productDetails: [],
        errorMessage: '',
        errorMessageName: '',
        errorMessageDescription: '',
        colors: [],

        sizes: [],
        searchKeyword: "",

        paging: { index: 1, size: 5, totalPage: 0 },

    }

    handleChange = (e) => {
        const files = Array.from(e.target.files);
        const filePreviews = files.map(file => URL.createObjectURL(file));

        this.setState({
            imgFiles: files,
            imgPreviews: filePreviews
        });
    }

    uploadImages = async () => {
        const uploadPromises = this.state.imgFiles.map(file => {
            const imgRef = ref(imageDb, `files/${v4()}`);
            return uploadBytes(imgRef, file).then((snapshot) =>
                getDownloadURL(snapshot.ref)
            );
        });

        const urls = await Promise.all(uploadPromises);
        console.log('Uploaded image URLs:', urls); // Thêm nhật ký gỡ lỗi để kiểm tra URL hình ảnh đã tải lên
        return urls;
    }


    handleSubmit = async (event) => {
        event.preventDefault();

        // Kiểm tra lỗi
        let errorMessageName = '';
        let errorMessageDescription = '';
        let errorMessageImage = '';
        let errorMessagePrice = '';
        let errorMessageQuantity = '';
        let errorMessageColor = '';
        let errorMessageSize = '';

        if (!this.state.product.ten.trim()) {
            errorMessageName = 'Tên sản phẩm không được để trống.';
        }

        if (!this.state.product.moTa.trim()) {
            errorMessageDescription = 'Mô tả sản phẩm không được để trống.';
        }

        if (this.state.imgFiles.length === 0) {
            errorMessageImage = 'Vui lòng chọn ít nhất một ảnh.';
        }

        const price = Number(this.state.product.chiTietSanPham[0]?.gia);
        if (isNaN(price) || price <= 0) {
            errorMessagePrice = 'Giá sản phẩm phải là một số lớn hơn 0.';
        } else if (price < 20000) {
            errorMessagePrice = 'Giá sản phẩm phải từ 20,000 VNĐ trở lên.';
        }

        if (isNaN(this.state.product.chiTietSanPham[0]?.soLuong) || this.state.product.chiTietSanPham[0]?.soLuong <= 0) {
            errorMessageQuantity = 'Số lượng sản phẩm phải là một số không âm.';
        }

        if (!this.state.product.chiTietSanPham[0]?.mauSacId) {
            errorMessageColor = 'Vui lòng chọn màu sắc.';
        }

        if (!this.state.product.chiTietSanPham[0]?.kichThuocId) {
            errorMessageSize = 'Vui lòng chọn kích thước.';
        }

        if (errorMessageName || errorMessageDescription || errorMessageImage || errorMessagePrice || errorMessageQuantity || errorMessageColor || errorMessageSize) {
            this.setState({
                errorMessageName,
                errorMessageDescription,
                errorMessageImage,
                errorMessagePrice,
                errorMessageQuantity,
                errorMessageColor,
                errorMessageSize
            });

            setTimeout(() => {
                this.setState({
                    errorMessageName: '',
                    errorMessageDescription: '',
                    errorMessageImage: '',
                    errorMessagePrice: '',
                    errorMessageQuantity: '',
                    errorMessageColor: '',
                    errorMessageSize: ''
                });
            }, 2000);

            return;
        }

        // Gọi hàm handleClick
        await this.handleClick();
    }

    async componentDidMount() {
        try {
            let [resColors, resSizes] = await Promise.all([
                axios.get('https://localhost:7078/api/CategoryColor'),
                axios.get('https://localhost:7078/api/Category_Size'),
            ]);

            this.setState({
                colors: resColors && resColors.data ? resColors.data : [],
                sizes: resSizes && resSizes.data ? resSizes.data : [],
            });

            await this.handleLoadListProduct();

        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu:", error);
            this.setState({ errorMessage: 'Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại!' });
        }
    }

    async componentDidUpdate(prevProps, prevState) {
        if (
            prevState.paging.index !== this.state.paging.index ||
            prevState.paging.size !== this.state.paging.size ||
            prevState.paging.totalPage !== this.state.paging.totalPage
        ) {
            await this.handleLoadListProduct();
        }
    }


    handleClick = async () => {
        if (this.state.imgFiles.length > 0) {
            try {
                const urls = await this.uploadImages();
                console.log("URLs:", urls);

                this.setState(prevState => ({
                    imgUrl: urls,
                    product: {
                        ...prevState.product,
                        hinhs: urls,
                        chiTietSanPham: prevState.product.chiTietSanPham.map(detail => ({

                            gia: Number(detail.gia),
                            soLuong: Number(detail.soLuong),
                            mauSacId: Number(detail.mauSacId),
                            kichThuocId: Number(detail.kichThuocId),
                        }))
                    }
                }), async () => {
                    console.log('Product data before sending to API:', this.state.product); // Thêm nhật ký gỡ lỗi để kiểm tra dữ liệu sản phẩm trước khi gửi
                    try {
                        console.log("Product data before API call:", this.state.product);
                        const response = await axios.post('https://localhost:7078/api/Product', this.state.product);
                        console.log("Response:", response);

                        if (response.status === 200 || response.status === 201) {
                            Swal.fire({
                                title: 'Thêm sản phẩm thành công!',
                                icon: 'success',
                                timer: 2000,
                                timerProgressBar: true,
                                showConfirmButton: false
                            });
                            this.componentDidMount();
                            console.log("Updated products:", this.state.products);
                            this.setState({ errorMessage: '' });
                        } else {
                            console.error("Unexpected status code:", response.status);
                            throw new Error('Có lỗi xảy ra khi thêm sản phẩm.');
                        }
                    } catch (error) {
                        console.error("Lỗi khi thêm sản phẩm:", error.response?.data || error.message);
                        Swal.fire({
                            title: 'Có lỗi xảy ra!',
                            text: error.response?.data?.message || 'Có lỗi xảy ra khi thêm sản phẩm. Vui lòng thử lại!',
                            icon: 'error',
                            timer: 2000,
                            timerProgressBar: true,
                            showConfirmButton: false
                        });
                    }
                });
            } catch (error) {
                console.error("Lỗi khi tải ảnh:", error.message);
                Swal.fire({
                    title: 'Có lỗi xảy ra!',
                    text: 'Có lỗi xảy ra khi tải ảnh. Vui lòng thử lại!',
                    icon: 'error',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
            }
        } else {
            this.setState({ errorMessage: 'Vui lòng chọn ít nhất một ảnh.' });
        }
    }


    handleChangeName = (event) => {
        this.setState({
            product: {
                ...this.state.product,
                ten: event.target.value
            }
        });
    }

    handleChangeDescribe = (event) => {
        this.setState({
            product: {
                ...this.state.product,
                moTa: event.target.value
            }
        });
    }


    formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    }


    handleEdit = async (product) => {

        this.setState({ productEdit: { ...product }, imgFiles: [], imgPreviews: [] });
    }

    handleChangeUpdateName = (event) => {
        this.setState({
            productEdit: {
                ...this.state.productEdit,
                ten: event.target.value
            }
        });
    }

    handleChangeUpdateDescribe = (event) => {
        this.setState({
            productEdit: {
                ...this.state.productEdit,
                moTa: event.target.value
            }
        });
    }

    handleChangeStatus = (event) => {
        this.setState({
            productEdit: {
                ...this.state.productEdit,
                trangThai: event.target.value
            }
        });
    }

    handleChangeImage = (event) => {
        const files = Array.from(event.target.files);
        this.setState({
            imgFiles: files
        });

        const imgPreviews = files.map(file => URL.createObjectURL(file));
        this.setState({
            imgPreviews: imgPreviews
        });
    }


    handleUpdate = async (event) => {
        event.preventDefault();
        try {
            const urls = await this.uploadImages();

            const updatedProduct = {
                ten: this.state.productEdit.ten,
                moTa: this.state.productEdit.moTa,
                trangThai: this.state.productEdit.trangThai,

                imgs: urls
            };

            let res = await axios.put(`https://localhost:7078/api/Product/${this.state.productEdit.id}`, updatedProduct);

            if (res.status === 200 || res.status === 204) {
                Swal.fire({
                    title: 'Cập nhật sản phẩm thành công!',
                    icon: 'success',

                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
                this.componentDidMount();

            } else {
                throw new Error('Cập nhật không thành công');
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật:', error);
            Swal.fire({
                title: 'Có lỗi xảy ra!',
                text: 'Có lỗi xảy ra khi cập nhật sản phẩm. Vui lòng thử lại!',
                icon: 'error',

                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false
            });
            this.componentDidMount();

        }
    }


    handleDelete = (productId) => {
        const productToUpdate = this.state.products.find(product => product.id === productId);
        if (!productToUpdate) {
            Swal.fire({
                title: 'Sản phẩm không tồn tại',
                text: 'Vui lòng kiểm tra lại.',
                icon: 'error',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false
            });
            return;
        }

        Swal.fire({
            title: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
            text: 'Sản phẩm sẽ bị ẩn đi!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ẨN',
            cancelButtonText: 'Hủy'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const updatedProduct = {
                        ...productToUpdate,
                        trangThai: false
                    };

                    let res = await axios.put(`https://localhost:7078/api/Product/${productId}`, updatedProduct);
                    if (res.status === 200 || res.status === 204) {
                        Swal.fire({
                            title: 'Đã cập nhật!',
                            text: 'Trạng thái của sản phẩm đã được ẩn.',
                            icon: 'success',
                            timer: 2000,
                            timerProgressBar: true,
                            showConfirmButton: false
                        });
                        this.componentDidMount();
                    } else {
                        Swal.fire({
                            title: 'Cập nhật không thành công!',
                            text: 'Có lỗi xảy ra khi cập nhật trạng thái sản phẩm.',
                            icon: 'error',
                            timer: 2000,
                            timerProgressBar: true,
                            showConfirmButton: false
                        });
                    }
                } catch (error) {
                    console.error('Lỗi khi cập nhật trạng thái:', error);
                    Swal.fire({
                        title: 'Có lỗi xảy ra!',
                        text: 'Có lỗi xảy ra khi cập nhật trạng thái sản phẩm.',
                        icon: 'error',
                        timer: 2000,
                        timerProgressBar: true,
                        showConfirmButton: false
                    });
                }
            }
        });
    }

    handleChangePrice = (event) => {
        this.setState({
            product: {
                ...this.state.product,
                chiTietSanPham: this.state.product.chiTietSanPham.map(detail => ({
                    ...detail,
                    gia: event.target.value
                }))
            }
        });
    }

    handleChangeQuantity = (event) => {
        this.setState({
            product: {
                ...this.state.product,
                chiTietSanPham: this.state.product.chiTietSanPham.map(detail => ({
                    ...detail,
                    soLuong: event.target.value
                }))
            }
        });
    }

    handleSelectColor = (event) => {
        this.setState({
            product: {
                ...this.state.product,
                chiTietSanPham: this.state.product.chiTietSanPham.map(detail => ({
                    ...detail,
                    mauSacId: event.target.value
                }))
            }
        });
    }

    handleSelectSize = (event) => {
        this.setState({
            product: {
                ...this.state.product,
                chiTietSanPham: this.state.product.chiTietSanPham.map(detail => ({
                    ...detail,

                    kichThuocId: event.target.value
                }))
            }
        });
    }

    handleLoadListProduct = async () => {
        let resProducts = await axios.get(`https://localhost:7078/api/Product?keyword=${this.state.searchKeyword ?? ""}&index=${this.state.paging.index ?? 1}&size=${this.state.paging.size ?? 16}`);

        this.setState({
            products: resProducts && resProducts.data.list ? resProducts.data.list : [],
            paging: resProducts && resProducts.data.paging ? resProducts.data.paging : this.state.paging,
        });
    }

    getPaginationItems = () => {
        const paginationItems = [];
        const { index, totalPage } = this.state.paging;

        // Trang đầu tiên luôn được hiển thị
        paginationItems.push(1);

        // Nếu trang hiện tại lớn hơn 4, thêm dấu ba chấm sau trang đầu tiên
        if (index > 4) {
            paginationItems.push('...');
        }

        // Hiển thị các trang xung quanh trang hiện tại
        for (let i = Math.max(2, index - 2); i <= Math.min(totalPage - 1, index + 2); i++) {
            paginationItems.push(i);
        }

        // Nếu trang hiện tại nhỏ hơn `totalPage - 3`, thêm dấu ba chấm trước trang cuối cùng
        if (index < totalPage - 3) {
            paginationItems.push('...');
        }

        // Trang cuối cùng luôn được hiển thị
        if (totalPage > 1) {
            paginationItems.push(totalPage);
        }

        return paginationItems;
    };

    handlePageChange = (pageIndex) => {
        this.setState({
            paging: { ...this.state.paging, index: pageIndex }
        })
    };

    render() {
        const { products, product, imgPreviews, errorMessage, colors, sizes } = this.state;

        return (
            <>
                {/* //Thêm */}
                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Thêm Sản Phẩm</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={this.handleSubmit}>
                                    <div className="row mb-3">
                                        <label className="col-sm-4 col-form-label">Tên</label>
                                        <div className="col-sm-8">
                                            <input
                                                className="form-control"
                                                type="text"
                                                value={this.state.product.ten}
                                                onChange={this.handleChangeName}
                                            />
                                        </div>
                                    </div>
                                    {this.state.errorMessageName && <div className="alert alert-danger">{this.state.errorMessageName}</div>}

                                    <div className="row mb-3">
                                        <label className="col-sm-4 col-form-label">Mô tả</label>
                                        <div className="col-sm-8">
                                            <input
                                                className="form-control"
                                                type="text"
                                                value={this.state.product.moTa}
                                                onChange={this.handleChangeDescribe}
                                            />
                                        </div>
                                    </div>
                                    {this.state.errorMessageDescription && <div className="alert alert-danger">{this.state.errorMessageDescription}</div>}

                                    <div className="row mb-3">
                                        <label className="col-sm-4 col-form-label">Giá</label>
                                        <div className="col-sm-8">
                                            <input
                                                className="form-control"
                                                type="number"
                                                value={this.state.product.chiTietSanPham[0]?.gia || ''}
                                                onChange={this.handleChangePrice}
                                            />
                                        </div>
                                    </div>
                                    {this.state.errorMessagePrice && <div className="alert alert-danger">{this.state.errorMessagePrice}</div>}
                                    <div className="row mb-3">
                                        <label className="col-sm-4 col-form-label">Số lượng</label>
                                        <div className="col-sm-8">
                                            <input
                                                className="form-control"
                                                type="number"
                                                value={this.state.product.chiTietSanPham[0]?.soLuong || ''}
                                                onChange={this.handleChangeQuantity}
                                            />
                                        </div>
                                    </div>
                                    {this.state.errorMessageQuantity && <div className="alert alert-danger">{this.state.errorMessageQuantity}</div>}

                                    <div className="row mb-3">
                                        <label className="col-sm-4 col-form-label">Màu sắc</label>
                                        <div className="col-sm-8">
                                            <select
                                                className="form-control"
                                                id="color"
                                                value={this.state.product.chiTietSanPham[0]?.mauSacId || ''}
                                                onChange={this.handleSelectColor}
                                            >
                                                <option value="">Chọn màu sắc</option>
                                                {this.state.colors.map(color => (
                                                    <option key={color.id} value={color.id}>
                                                        {color.tenMauSac}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    {this.state.errorMessageColor && <div className="alert alert-danger">{this.state.errorMessageColor}</div>}

                                    <div className="row mb-3">
                                        <label className="col-sm-4 col-form-label">Kích thước</label>
                                        <div className="col-sm-8">
                                            <select
                                                className="form-control"
                                                id="size"
                                                value={this.state.product.chiTietSanPham[0]?.kichThuocId || ''}
                                                onChange={this.handleSelectSize}
                                            >
                                                <option value="">Chọn kích thước</option>
                                                {this.state.sizes.map(size => (
                                                    <option key={size.id} value={size.id}>
                                                        {size.tenKichThuoc}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    {this.state.errorMessageSize && <div className="alert alert-danger">{this.state.errorMessageSize}</div>}

                                    <div className="row mb-3">
                                        <label className="col-sm-4 col-form-label">Giá</label>
                                        <div className="col-sm-8">
                                            <input
                                                className="form-control"
                                                type="number"
                                                value={this.state.product.chiTietSanPham[0]?.gia || ''}
                                                onChange={this.handleChangePrice}
                                            />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-4 col-form-label">Số lượng</label>
                                        <div className="col-sm-8">
                                            <input
                                                className="form-control"
                                                type="number"
                                                value={this.state.product.chiTietSanPham[0]?.soLuong || ''}
                                                onChange={this.handleChangeQuantity}
                                            />
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <label className="col-sm-4 col-form-label">Màu sắc</label>
                                        <div className="col-sm-8">
                                            <select
                                                className="form-control"
                                                id="color"
                                                value={this.state.product.chiTietSanPham[0]?.idMauSac || ''}
                                                onChange={this.handleSelectColor}
                                            >
                                                <option value="">Chọn màu sắc</option>
                                                {this.state.colors.map(color => (
                                                    <option key={color.id} value={color.id}>
                                                        {color.tenMauSac}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <label className="col-sm-4 col-form-label">Kích thước</label>
                                        <div className="col-sm-8">
                                            <select
                                                className="form-control"
                                                id="size"
                                                value={this.state.product.chiTietSanPham[0]?.idKichThuoc || ''}
                                                onChange={this.handleSelectSize}
                                            >
                                                <option value="">Chọn kích thước</option>
                                                {this.state.sizes.map(size => (
                                                    <option key={size.id} value={size.id}>
                                                        {size.tenKichThuoc}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <label className="col-sm-4 col-form-label">Ảnh</label>
                                        <div className="col-sm-8">
                                            <input
                                                className="form-control"
                                                type="file"
                                                multiple
                                                onChange={this.handleChange}
                                            />
                                        </div>
                                    </div>
                                    {this.state.errorMessageImage && <div className="alert alert-danger">{this.state.errorMessageImage}</div>}
                                    <div className="img-preview">
                                        {imgPreviews.map((dataVal, index) => (
                                            <img key={index} src={dataVal} width="100px" alt="uploaded" />
                                        ))}
                                    </div>

                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                                        <button type="submit" className="btn btn-primary">Lưu</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>


                {/* //SỬA */}
                <div className="modal fade" id="exampleModal2" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Sửa Sản Phẩm</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={this.handleUpdate}>
                                    <div className="row mb-3">
                                        <label className="col-sm-4 col-form-label">Tên</label>
                                        <div className="col-sm-8">
                                            <input
                                                className="form-control"
                                                type="text"
                                                value={this.state.productEdit.ten}
                                                onChange={this.handleChangeUpdateName}
                                                required
                                            />
                                        </div>
                                    </div>
                                    {this.state.errorMessageName && <div className="alert alert-danger">{this.state.errorMessageName}</div>}

                                    <div className="row mb-3">
                                        <label className="col-sm-4 col-form-label">Mô tả</label>
                                        <div className="col-sm-8">
                                            <input
                                                className="form-control"
                                                type="text"
                                                value={this.state.productEdit.moTa}
                                                onChange={this.handleChangeUpdateDescribe}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <label className="col-sm-4 col-form-label">Trạng Thái</label>
                                        <div className="col-sm-8">
                                            <select
                                                className="form-control"
                                                value={this.state.productEdit.trangThai}
                                                onChange={this.handleChangeStatus}
                                                required
                                            >
                                                <option value="true">Có</option>
                                                <option value="false">Không</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <label className="col-sm-4 col-form-label">Ảnh</label>
                                        <div className="col-sm-8">
                                            <input
                                                className="form-control"
                                                type="file"
                                                multiple
                                                onChange={this.handleChangeImage}
                                            />

                                        </div>
                                    </div>
                                    {this.state.errorMessageImage && <div className="alert alert-danger">{this.state.errorMessageImage}</div>}
                                    <div className="img-preview">
                                        {this.state.imgPreviews.length > 0 && this.state.imgPreviews.map((dataVal, index) => (
                                            <img key={index} src={dataVal} width="100px" alt="uploaded" />
                                        ))}
                                    </div>

                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                                        <button type="submit" className="btn btn-primary">Lưu</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>


                <div className='container my-4'>
                    <h2 className='text-center mb-4'>Sản Phẩm</h2>
                    <div className='row mb-3'>
                        <div className='col'>
                            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">Thêm SP</button>
                        </div>
                        <div className='col'>
                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search..."
                                    value={this.state.searchKeyword}
                                    onChange={(e) => this.setState({ searchKeyword: e.target.value })}
                                />
                                <button className="btn btn-primary" onClick={this.handleLoadListProduct}>
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên</th>
                                <th>Hình</th>
                                <th>Mô tả</th>
                                <th>Ngày tạo</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>{product.ten}</td>
                                    <td>
                                        <img
                                            src={product.hinhs}
                                            style={imageStyle}
                                        />
                                    </td>
                                    <td>{product.moTa}</td>
                                    <td>{this.formatDate(product.ngayTao)}</td>
                                    <td className="text-center">
                                        <span
                                            style={{
                                                ...statusIndicatorStyle,
                                                backgroundColor: getStatusColor(product.trangThai),
                                            }}
                                        />
                                    </td>
                                    <td style={{ width: '280px' }}>
                                        <button className="btn btn-primary me-2" data-bs-toggle="modal" data-bs-target="#exampleModal2" onClick={() => this.handleEdit(product)}>Sửa</button>
                                        <button className="btn btn-danger me-2" onClick={() => this.handleDelete(product.id)}>Xóa</button>
                                        {/* <button className="btn btn-info" data-bs-toggle="modal" data-bs-target="#detailModal3" onClick={() => this.handleShowDetails(product)}>Chi tiết</button> */}
                                        <Link to={`/admin/product/ADProductDetails/${product.id}`}><button className="btn btn-info" >Chi tiết</button></Link>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <nav className='pb-5'>
                        <ul className="pagination">
                            <li className="page-item">
                                <a className="page-link" href="#" aria-label="Previous" onClick={() => this.handlePageChange(this.state.paging.index - 1)}>
                                    <span aria-hidden="true">&laquo;</span>
                                </a>
                            </li>
                            {this.getPaginationItems().map((page, index) =>
                                page === '...' ? (
                                    <li key={index} className="page-item disabled">
                                        <span className="page-link">...</span>
                                    </li>
                                ) : (
                                    <li
                                        key={index}
                                        className={`page-item ${this.state.paging.index === page ? 'active' : ''}`}
                                    >
                                        <a className="page-link" onClick={() => this.handlePageChange(page)}>
                                            {page}
                                        </a>
                                    </li>
                                )
                            )}
                            <li className="page-item">
                                <a className="page-link" href="#" aria-label="Next" onClick={() => this.handlePageChange(this.state.paging.index + 1)}>
                                    <span aria-hidden="true">&raquo;</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </>
        );
    }

}

export default ADProduct;


