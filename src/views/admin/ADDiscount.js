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
            loaiGiam: '',
            menhGia: '',
            HSD: '',
            ngayTao: '',
            loaiKM: ''

        }
    }


    async componentDidMount() {
        let res = await axios.get('https://localhost:7078/api/discount');

        this.setState({
            discounts: res && res.data ? res.data : []
        })
        console.log(this.state.discounts);
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

    handleSubmit = async (event) => {
        event.preventDefault();
        var x = await axios.post('https://localhost:7078/api/discount', this.state.discountsCreate);
        if (x.status === 200) {
            alert('OK');
        }
    }


    render() {
        let { discounts } = this.state;
        return (

            <>

                <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                                            <input value={this.state.discountsCreate.loaiGiam} onChange={(event) => this.handleChangeType(event)} className="form-control" name="text" />
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
                                            <input value={this.state.discountsCreate.HSD} onChange={(event) => this.handleChangeHSD(event)} className="form-control" name="text" />
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
                                <th>Thao tác</th>

                            </tr>
                        </thead>
                        <tbody>
                            {discounts && discounts.length > 0 && discounts.map((item, index) => {
                                return (
                                    <tr key={item.maGiamGia}>
                                        <td >
                                            {item.maGiamGia}
                                        </td>
                                        <td>{item.moTa}</td>
                                        <td>{item.loaiGiam == true ? '%' : 'vnđ'}</td>
                                        <td>{item.menhGia}</td>
                                        <td>{this.formatDate(item.ngayTao)}</td>
                                        <td>{this.formatDate(item.hsd)}</td>
                                        <td>
                                            <button className='btn btn-sm btn-info me-2'>Xem</button>
                                            <button className='btn btn-sm btn-primary me-2'>Sửa</button>
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