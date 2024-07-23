import React from 'react';
import '../../styles/admin/ADDiscount.scss';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { event } from 'jquery';
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
        test: {
            moTa: "Giảm 50,000 VND cho đơn hàng trên 500,000 VND",
            loaiGiam: true,
            menhGia: 50000,
            hsd: "2024-12-31",
            loaiKM: false
        }

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

    handleChangeType = (event) => {
        this.setState((x) => ({
            discountsCreate: {
                ...x.discountsCreate,
                loaiGiam: event.target.value
            }
        }))
    }

    handleChangeValue = (event) => {
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
        this.setState((x) => ({
            discountsCreate: {
                ...x.discountsCreate,
                loaiKM: event.target.value
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
        }))
    }

    handleChangeUpdateValue = (event) => {
        this.setState((x) => ({
            discountsEdit: {
                ...x.discountsEdit,
                menhGia: event.target.value
            }
        }))
    }

    handleChangeUpdateHSD = (event) => {
        this.setState((x) => ({
            discountsEdit: {
                ...x.discountsEdit,
                hsd: event.target.value
            }
        }))
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
        var x = await axios.post('https://localhost:7078/api/discount', this.state.discountsCreate);
        if (x.status === 200) {
            alert('OK');
            this.componentDidMount();
        }
    }

    handleEdit = async (discount) => {

        this.setState({ discountsEdit: { ...discount } });
    }

    handleUpdate = async (event) => {
        event.preventDefault();
        try {
            let res = await axios.put(`https://localhost:7078/api/discount?maGiamGia=${this.state.discountsEdit.maGiamGia}`, {
                moTa: this.state.discountsEdit.moTa,
                loaiGiam: this.state.discountsEdit.loaiGiam,
                menhGia: this.state.discountsEdit.menhGia,
                hsd: this.state.discountsEdit.hsd,
                loaiKM: this.state.discountsEdit.loaiKM
            });
            if (res.status === 200 || res.status === 204) {
                alert('Cập nhật thành công');
                this.componentDidMount(); // Cập nhật lại dữ liệu khi component được gắn vào
            } else {
                alert('Cập nhật không thành công');
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật khuyến mãi:', error);
            alert('Có lỗi xảy ra khi cập nhật', error);
        }

    }

    render() {
        let { discounts } = this.state;
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
                                <form>

                                    <div className="row mb-3">
                                        <label className="col-sm-2 col-form-label">Mã:</label>
                                        <div className="col-sm-10">
                                            <input value={this.state.discountsCreate.maGiamGia} onChange={(event) => this.handleChangeCode(event)} className="form-control" name="text" />
                                            <span className="text-danger"></span>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <label className="col-sm-2 col-form-label">Mô tả:</label>
                                        <div className="col-sm-10">
                                            <input value={this.state.discountsCreate.moTa} onChange={(event) => this.handleChangeDescribe(event)} className="form-control" name="text" />
                                            <span className="text-danger"></span>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <label className="col-sm-2 col-form-label">Loại giảm:</label>
                                        <div className="col-sm-10">
                                            <select value={this.state.discountsCreate.loaiGiam} className="form-select " aria-label="Default select example" onChange={(event) => this.handleChangeType(event)}>
                                                <option value={true}>%</option>
                                                <option value={false}>vnđ</option>
                                            </select >
                                            <span className="text-danger"></span>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <label className="col-sm-2 col-form-label">Mệnh giá:</label>
                                        <div className="col-sm-10">
                                            <input value={this.state.discountsCreate.menhGia} onChange={(event) => this.handleChangeValue(event)} className="form-control" name="text" />
                                            <span className="text-danger"></span>
                                        </div>
                                    </div>



                                    <div className="row mb-3">
                                        <label className="col-sm-2 col-form-label">HSD:</label>
                                        <div className="col-sm-10">
                                            <input type='date' value={this.state.discountsCreate.HSD} onChange={(event) => this.handleChangeHSD(event)} className="form-control" name="text" />
                                            <span className="text-danger"></span>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <label className="col-sm-2 col-form-label">loaiKM:</label>
                                        <div className="col-sm-10">
                                            <select value={this.state.discountsCreate.loaiKM} className="form-select " aria-label="Default select example" onChange={(event) => this.handleChangeLoaiKM(event)}>
                                                <option value={true}>Khách hàng</option>
                                                <option value={false}>Sản phẩm</option>
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
                                            <input value={this.state.discountsEdit.maGiamGia} onChange={(event) => this.handleChangeUpdateCode(event)} className="form-control" name="text" />
                                            <span className="text-danger"></span>
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
                                            <span className="text-danger"></span>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <label className="col-sm-2 col-form-label">HSD:</label>
                                        <div className="col-sm-10">
                                            <input type='date' value={this.state.discountsEdit.hsd} onChange={(event) => this.handleChangeUpdateHSD(event)} className="form-control" name="hsd" />
                                            <span className="text-danger"></span>
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
                                        <td>{item.loaiGiam == true ? '%' : 'vnđ'}</td>
                                        <td>{item.menhGia}</td>
                                        <td>{this.formatDate(item.ngayTao)}</td>
                                        <td>{this.formatDate(item.hsd)}</td>
                                        <td>{item.loaiKM == true ? 'Sản phẩm' : 'Khách hàng'}</td>
                                        <td>
                                            {
                                                item.loaiKM ? <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal2" className='btn btn-sm btn-primary me-2' onClick={() => this.handleEdit(item)}>Sửa</button> :
                                                    <button disabled type="button" data-bs-toggle="modal" data-bs-target="#exampleModal2" className='btn btn-sm btn-primary me-2' onClick={() => this.handleEdit(item)}>Sửa</button>
                                            }

                                            <button className='btn btn-sm btn-danger'>Xóa</button>
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