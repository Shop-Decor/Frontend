import React from 'react';
import '../../styles/admin/ADDiscount.scss';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

class ADDiscount extends React.Component {
    state = {
        discounts: [],
        discountsCreate: {
            maGiamGia: '',
            moTa: '',
            loaiGiam: true,
            menhGia: '',
            HSD: '',
            loaiKM: true
        },
        discountsEdit: {
            maGiamGia: '',
            moTa: '',
            loaiGiam: '',
            menhGia: '',
            hsd: '',
            loaiKM: ''
        },
        errors: {},
        errorsupdate: {}

    }


    async componentDidMount() {
        let res = await axios.get('https://localhost:7078/api/discount');
        const discounts = res && res.data ? res.data.map(discount => ({
            ...discount,
            hsd: discount.hsd.split('T')[0]
        })) : [];
        this.setState({
            discounts
        });
    }

    formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    }

    handleChangeCode = (event) => {
        this.setState((x) => ({
            discountsCreate: {
                ...x.discountsCreate,
                maGiamGia: event.target.value
            }
        }));
    }

    handleChangeDescribe = (event) => {
        this.setState((x) => ({
            discountsCreate: {
                ...x.discountsCreate,
                moTa: event.target.value
            }
        }));
    }

    handleChangeValue = (event) => {
        const value = event.target.value;
        if (isNaN(value)) {
            this.setState((prevState) => ({
                errors: {
                    ...prevState.errors,
                    menhGia: 'Mệnh giá phải là số'
                }
            }));
        } else {
            this.setState((prevState) => ({
                discountsCreate: {
                    ...prevState.discountsCreate,
                    menhGia: value
                },
                errors: {
                    ...prevState.errors,
                    menhGia: ''
                }
            }));
        }
    }

    handleChangeValue = (event) => {
        const value = event.target.value;
        let error = '';
        if (isNaN(value)) {
            error = 'Mệnh giá phải là số';
        }
        this.setState((x) => ({
            discountsCreate: {
                ...x.discountsCreate,
                menhGia: event.target.value
            }
        }))
    }

    handleChangeHSD = (event) => {
        this.setState((x) => ({
            discountsCreate: {
                ...x.discountsCreate,
                HSD: event.target.value
            }
        }))
    }

    handleChangeLoaiKM = (event) => {
        const value = event.target.value === 'true';
        this.setState((x) => ({
            discountsCreate: {
                ...x.discountsCreate,
                loaiKM: value
            }
        }))
    }

    handleChangeUpdateCode = (event) => {
        this.setState((x) => ({
            discountsEdit: {
                ...x.discountsEdit,
                maGiamGia: event.target.value
            }
        }));
    }

    handleChangeUpdateDescribe = (event) => {
        this.setState((x) => ({
            discountsEdit: {
                ...x.discountsEdit,
                moTa: event.target.value
            }
        }));
    }

    handleChangeUpdateType = (event) => {
        this.setState((x) => ({
            discountsEdit: {
                ...x.discountsEdit,
                loaiGiam: event.target.value
            }
        }));
    }

    handleChangeUpdateValue = (event) => {
        this.setState((x) => ({
            discountsEdit: {
                ...x.discountsEdit,
                menhGia: event.target.value
            }
        }));
    }

    handleChangeUpdateHSD = (event) => {
        this.setState((x) => ({
            discountsEdit: {
                ...x.discountsEdit,
                hsd: event.target.value
            }
        }));
    }

    handleChangeUpdateLoaiKM = (event) => {
        this.setState((x) => ({
            discountsEdit: {
                ...x.discountsEdit,
                loaiKM: event.target.value
            }
        }))
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        const { maGiamGia, menhGia, HSD } = this.state.discountsCreate;
        let errors = {};

        if (!maGiamGia.trim()) errors.maGiamGia = 'Mã khuyến mãi không được để trống.';
        const isDuplicate = await this.checkDuplicateCode(maGiamGia);
        if (isDuplicate) errors.maGiamGia = 'Mã giảm giá đã tồn tại.';
        const specialCharPattern = /[^a-zA-Z0-9]/;
        if (specialCharPattern.test(maGiamGia)) errors.maGiamGia = 'Mã giảm giá không được chứa ký tự đặc biệt hoặc chữ tiếng Việt.';
        if (!menhGia.trim()) errors.menhGia = 'Mệnh giá không được để trống.';
        if (!HSD.trim()) errors.HSD = 'HSD không được để trống.';
        if (Object.keys(errors).length > 0) {
            this.setState({ errors });
            return;
        }

        try {
            var x = await axios.post('https://localhost:7078/api/discount', this.state.discountsCreate);

            if (x.status === 200) {
                Swal.fire({
                    title: 'Thành công!',
                    text: 'Thêm mới thành công.',
                    icon: 'success',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
                this.componentDidMount();
                // window.$('#exampleModal').modal('hide');
                this.setState({
                    discountsCreate: {
                        maGiamGia: '',
                        moTa: '',
                        loaiGiam: true,
                        menhGia: '',
                        HSD: '',
                        loaiKM: true
                    }
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Lỗi!',
                text: 'Có lỗi xảy ra khi thêm mới.',
                icon: 'error',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false
            });
        }
    }

    handleEdit = async (discount) => {

        this.setState({ discountsEdit: { ...discount } });
    }

    checkDuplicateCode = async (code) => {
        try {
            let res = await axios.get(`https://localhost:7078/api/discount/discountExist?maGiamGia=${code}`);
            return res.data; // Giả sử API trả về true nếu mã giảm giá tồn tại, ngược lại là false
        } catch (error) {
            console.error("Error checking duplicate code", error);
            return false;
        }
    }

    checkDuplicateCodeUpdate = async (code, id = null) => {
        try {
            let url = `https://localhost:7078/api/discount/discountExist?maGiamGia=${code}`;
            if (id) {
                url += `&id=${id}`;
            }
            let res = await axios.get(url);
            return res.data; // Giả sử API trả về true nếu mã giảm giá tồn tại, ngược lại là false
        } catch (error) {
            console.error("Error checking duplicate code", error);
            return false;
        }
    }


    handleUpdate = async (event) => {
        event.preventDefault();
        const { maGiamGia } = this.state.discountsEdit;
        let errorsupdate = {};

        if (!maGiamGia.trim()) errorsupdate.maGiamGia = 'Mã khuyến mãi không được để trống.';
        const specialCharPattern = /[^a-zA-Z0-9]/;
        if (specialCharPattern.test(maGiamGia)) errorsupdate.maGiamGia = 'Mã giảm giá không được chứa ký tự đặc biệt hoặc chữ tiếng Việt.';
        if (Object.keys(errorsupdate).length > 0) {
            this.setState({ errorsupdate });
            return;
        }

        try {
            let res = await axios.put(`https://localhost:7078/api/discount?maGiamGia=${this.state.discountsEdit.maGiamGia}`, {
                moTa: this.state.discountsEdit.moTa,
                loaiGiam: this.state.discountsEdit.loaiGiam,
                menhGia: this.state.discountsEdit.menhGia,
                hsd: this.state.discountsEdit.hsd,
                loaiKM: this.state.discountsEdit.loaiKM
            });

            if (res.status === 200 || res.status === 204) {
                Swal.fire({
                    title: 'Thành công!',
                    text: 'Cập nhật thành công.',
                    icon: 'success',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
                this.componentDidMount(); // Cập nhật lại dữ liệu khi component được gắn vào


            } else {
                Swal.fire({
                    title: 'Lỗi!',
                    text: 'Có lỗi xảy ra khi thêm mới.',
                    icon: 'error',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Lỗi!',
                text: 'Có lỗi xảy ra khi thêm mới.',
                icon: 'error',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false
            });
        }

    }

    handleDelete = (maGiamGia) => {
        Swal.fire({
            title: 'Bạn có chắc chắn muốn xóa?',
            text: 'Sau khi xóa, bạn sẽ không thể khôi phục lại mục này!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    let res = await axios.delete(`https://localhost:7078/api/discount/${maGiamGia}`);
                    if (res.status === 200 || res.status === 204) {
                        Swal.fire({
                            title: 'Đã xóa!',
                            text: 'Mục đã được xóa.',
                            icon: 'success',
                            timer: 2000,
                            timerProgressBar: true,
                            showConfirmButton: false
                        });
                        this.componentDidMount();

                    } else {
                        Swal.fire({
                            title: 'Xóa không thành công!',
                            text: 'Có lỗi xảy ra khi xóa mục này.',
                            icon: 'error',
                            timer: 2000,
                            timerProgressBar: true,
                            showConfirmButton: false
                        });
                    }
                } catch (error) {
                    console.error('Lỗi khi xóa khuyến mãi:', error);
                    Swal.fire({
                        title: 'Có lỗi xảy ra!',
                        text: 'Có lỗi xảy ra khi xóa mục này.',
                        icon: 'error',
                        timer: 2000,
                        timerProgressBar: true,
                        showConfirmButton: false
                    });
                }
            }
        });
    }
    render() {
        let { discounts } = this.state;
        const { errors } = this.state;
        const { errorsupdate } = this.state;
        return (

            <>
                {/* thêm khuyến mãi */}
                <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Thêm mới khuyến mãi</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={this.handleSubmit}>

                                    <div className="row mb-3">
                                        <label className="col-sm-2 col-form-label">Mã:</label>
                                        <div className="col-sm-10">
                                            <input value={this.state.discountsCreate.maGiamGia} onChange={(event) => this.handleChangeCode(event)} className="form-control" name="text" />
                                            {errors.maGiamGia && <div className="text-danger">{errors.maGiamGia}</div>}
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <label className="col-sm-2 col-form-label">Mô tả:</label>
                                        <div className="col-sm-10">
                                            <input value={this.state.discountsCreate.moTa} onChange={(event) => this.handleChangeDescribe(event)} className="form-control" name="text" />
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <label className="col-sm-2 col-form-label">Loại giảm:</label>
                                        <div className="col-sm-10">
                                            <select value={this.state.discountsCreate.loaiGiam} className="form-select " aria-label="Default select example" onChange={(event) => this.handleChangeType(event)}>
                                                <option value={true}>%</option>
                                                <option value={false}>vnđ</option>
                                            </select>
                                            <span className="text-danger"></span>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <label className="col-sm-2 col-form-label">Mệnh giá:</label>
                                        <div className="col-sm-10">
                                            <input type='number' min={1} value={this.state.discountsCreate.menhGia} onChange={(event) => this.handleChangeValue(event)} className="form-control" name="text" />
                                            {errors.maGiamGia && <div className="text-danger">{errors.menhGia}</div>}
                                        </div>
                                    </div>



                                    <div className="row mb-3">
                                        <label className="col-sm-2 col-form-label">HSD:</label>
                                        <div className="col-sm-10">
                                            <input type='date' value={this.state.discountsCreate.HSD} onChange={(event) => this.handleChangeHSD(event)} className="form-control" name="text" />
                                            {errors.HSD && <div className="text-danger">{errors.HSD}</div>}
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <label className="col-sm-2 col-form-label">loaiKM:</label>
                                        <div className="col-sm-10">
                                            <select value={this.state.discountsCreate.loaiKM} className="form-select " aria-label="Default select example" onChange={(event) => this.handleChangeLoaiKM(event)}>
                                                <option value={true}>Sản phẩm</option>
                                                <option value={false}>Khách hàng</option>
                                            </select >
                                            <span className="text-danger"></span>
                                        </div>
                                    </div>

                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                                        <button onClick={(event) => this.handleSubmit(event)} type="submit" className="btn btn-primary">Lưu</button>
                                    </div>
                                </form>
                            </div>

                        </div>
                    </div>
                </div>

                {/* sửa khuyến mãi */}
                <div className="modal fade" id="exampleModal2" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Thêm mới khuyến mãi</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="row mb-3">
                                        <label className="col-sm-2 col-form-label">Mã:</label>
                                        <div className="col-sm-10">
                                            <input readOnly value={this.state.discountsEdit.maGiamGia} onChange={(event) => this.handleChangeUpdateCode(event)} className="form-control" name="text" />
                                            {errorsupdate.maGiamGia && <div className="text-danger">{errorsupdate.maGiamGia}</div>}
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <label className="col-sm-2 col-form-label">Mô tả:</label>
                                        <div className="col-sm-10">
                                            <input value={this.state.discountsEdit.moTa} onChange={(event) => this.handleChangeUpdateDescribe(event)} className="form-control" name="text" />
                                            <span className="text-danger"></span>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <label className="col-sm-2 col-form-label">Loại giảm:</label>
                                        <div className="col-sm-10">
                                            <select value={this.state.discountsEdit.loaiGiam} className="form-select" aria-label="Default select example" onChange={(event) => this.handleChangeUpdateType(event)}>
                                                <option value={true}>%</option>
                                                <option value={false}>vnđ</option>
                                            </select >
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <label className="col-sm-2 col-form-label">Mệnh giá:</label>
                                        <div className="col-sm-10">
                                            <input value={this.state.discountsEdit.menhGia} onChange={(event) => this.handleChangeUpdateValue(event)} className="form-control" name="text" />
                                            {errorsupdate.menhGia && <div className="text-danger">{errorsupdate.menhGia}</div>}
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <label className="col-sm-2 col-form-label">HSD:</label>
                                        <div className="col-sm-10">
                                            <input type='date' value={this.state.discountsEdit.hsd} onChange={(event) => this.handleChangeUpdateHSD(event)} className="form-control" name="hsd" />
                                            {errorsupdate.HSD && <div className="text-danger">{errorsupdate.HSD}</div>}
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <label className="col-sm-2 col-form-label">HSD:</label>
                                        <div className="col-sm-10">
                                            <select value={this.state.discountsEdit.loaiKM} className="form-select " aria-label="Default select example" onChange={(event) => this.handleChangeUpdateLoaiKM(event)}>
                                                <option value={true}>Sản phẩm</option>
                                                <option value={false}>Khách hàng</option>
                                            </select >
                                        </div>
                                    </div>

                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                                        <button onClick={(event) => this.handleUpdate(event)} type="submit" className="btn btn-primary">Lưu</button>
                                    </div>
                                </form>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="container p-3">
                    <div className="row">
                        <div className="col-12">
                            <h3>Quản lý sản phẩm</h3>
                        </div>
                    </div>
                    <div className="pt-4"></div>
                    <div className="row">
                        <div className="col-6">
                            <input type='search' className='input_search' />
                        </div>
                        <div className="col-6 text-end addIcon">
                            <button type="button" className="btn btn-primary btn_add" data-bs-toggle="modal" data-bs-target="#exampleModal">Thêm mới<FontAwesomeIcon className='icon-plus' icon={faPlus} /></button>

                        </div>

                    </div>
                    <br />
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Mã giảm giá</th>
                                <th>Mô tả</th>
                                <th>Loại giảm</th>
                                <th>Mệnh giá</th>
                                <th>Ngày tạo</th>
                                <th>hạn sử dụng</th>
                                <th>Loại KM</th>
                                <th>Thao tác</th>

                            </tr>
                        </thead>
                        <tbody>
                            {discounts && discounts.length > 0 && discounts.map((item, index) => {
                                return (
                                    <tr key={item.maGiamGia}>
                                        <td>
                                            {item.maGiamGia}
                                        </td>
                                        <td>{item.moTa}</td>
                                        <td>{item.loaiGiam === true ? '%' : 'vnđ'}</td>
                                        <td>{item.menhGia}</td>
                                        <td>{this.formatDate(item.ngayTao)}</td>
                                        <td>{this.formatDate(item.hsd)}</td>
                                        <td>{item.loaiKM === true ? 'Sản phẩm' : 'Khách hàng'}</td>
                                        <td>
                                            {
                                                item.loaiKM ? <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal2" className='btn btn-sm btn-primary me-2' onClick={() => this.handleEdit(item)}>Sửa</button> :
                                                    <button disabled type="button" data-bs-toggle="modal" data-bs-target="#exampleModal2" className='btn btn-sm btn-primary me-2' onClick={() => this.handleEdit(item)}>Sửa</button>
                                            }

                                            <button className='btn btn-sm btn-danger' onClick={() => this.handleDelete(item.maGiamGia)} >Xóa</button>
                                        </td>
                                    </tr>)
                            })}

                        </tbody>
                    </table>
                </div>

            </>
        )
    }
}
export default ADDiscount;