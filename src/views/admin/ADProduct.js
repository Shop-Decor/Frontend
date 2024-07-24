import React from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import { imageDb } from "../../services/config";
import { v4 } from "uuid";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const getStatusColor = (status) => {
    // Giả sử trạng thái là true cho "Có" và false cho "Không"
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
    width: '100px', // Bạn có thể điều chỉnh kích thước hình ảnh theo nhu cầu
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
            img: []
        },
        productEdit: {
            id: '',
            ten: '',
            moTa: '',
            trangThai: '',
            img: []
        },
        errorMessage: '',  // Thêm state để lưu trữ thông báo lỗi
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
        return urls;
    }

    handleClick = async () => {
        if (this.state.imgFiles.length > 0) {
            try {
                const urls = await this.uploadImages();
                this.setState(prevState => ({
                    imgUrl: urls,
                    product: {
                        ...prevState.product,
                        img: urls
                    }
                }), async () => {
                    try {
                        const response = await axios.post('https://localhost:7078/api/product', this.state.product);
                        if (response.status === 200) {
                            alert('Thêm sản phẩm thành công!');
                            this.componentDidMount();  // Cập nhật danh sách sản phẩm sau khi thêm
                            this.setState({ errorMessage: '' });  // Xóa thông báo lỗi
                        } else {
                            throw new Error('Có lỗi xảy ra khi thêm sản phẩm.');
                        }
                    } catch (error) {
                        console.error("Lỗi khi thêm sản phẩm:", error);
                        this.setState({ errorMessage: 'Có lỗi xảy ra khi thêm sản phẩm. Vui lòng thử lại!' });
                    }
                });
            } catch (error) {
                console.error("Lỗi khi tải ảnh:", error);
                this.setState({ errorMessage: 'Có lỗi xảy ra khi tải ảnh. Vui lòng thử lại!' });
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

    handleSubmit = async (event) => {
        event.preventDefault();
    
        // Kiểm tra nếu tên và mô tả không được để trống
        if (!this.state.product.ten.trim()) {
            this.setState({ errorMessage: 'Tên sản phẩm không được để trống.' });
            return;
        }
        else if (!this.state.product.moTa.trim()) {
            this.setState({ errorMessage: 'Mô tả sản phẩm không được để trống.' });
            return;
        }
    
        await this.handleClick();
    }
    

    formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    }

    async componentDidMount() {
        try {
            let res = await axios.get('https://localhost:7078/api/Product');
            this.setState({
                products: res && res.data ? res.data : []
            });
        } catch (error) {
            console.error("Lỗi khi lấy sản phẩm:", error);
            this.setState({ errorMessage: 'Có lỗi xảy ra khi tải sản phẩm. Vui lòng thử lại!' });
        }
    }

    handleEdit = async (product) => {
        this.setState({ productEdit: { ...product } });
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
            let res = await axios.put(`https://localhost:7078/api/Product/${this.state.productEdit.id}`, {
                ten: this.state.productEdit.ten,
                moTa: this.state.productEdit.moTa,
                trangThai: this.state.productEdit.trangThai,
                img: this.state.productEdit.img
            });
            if (res.status === 200 || res.status === 204) {
                alert('Cập nhật thành công');
                this.componentDidMount();
            } else {
                alert('Cập nhật không thành công');
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật:', error);
            alert('Có lỗi xảy ra khi cập nhật');
        }
    }


    render() {
        const { products, product, imgPreviews, errorMessage } = this.state;
    
        return (
            <>
                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Thêm Sản Phẩm</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={this.handleSubmit}>
                                    {/* {errorMessage && <div className="alert alert-danger">{errorMessage}</div>} */}
                                    
                                    <div className="row mb-3">
                                        <label className="col-sm-4 col-form-label">Tên</label>
                                        <div className="col-sm-8">
                                            <input
                                                className="form-control"
                                                type="text"
                                                value={product.ten}
                                                onChange={this.handleChangeName}
                                            />
                                            {errorMessage && <span className="text-danger">{errorMessage}</span>}
                                        </div>
                                    </div>
    
                                    <div className="row mb-3">
                                        <label className="col-sm-4 col-form-label">Mô tả</label>
                                        <div className="col-sm-8">
                                            <input
                                                className="form-control"
                                                type="text"
                                                value={product.moTa}
                                                onChange={this.handleChangeDescribe}
                                            />
                                            {errorMessage && <div className="text-danger">{errorMessage}</div>}
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
                                    <td style={{ width: "10px", whiteSpace: "nowrap" }}>
                                        <button type="button" className="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#exampleModal2" onClick={() => this.handleEdit(product)}>Sửa</button>
                                        <button type="button" className="btn btn-danger btn-sm">Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
        );
    }
    
}

export default ADProduct;


