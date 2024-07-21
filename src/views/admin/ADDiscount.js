import React from 'react';
import '../../styles/admin/ADDiscount.scss';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
class ADDiscount extends React.Component {
    state = {
        discounts: []

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

    render() {
        let { discounts } = this.state;
        return (

            <>
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
                            <button className='btn_add'>Thêm mới<FontAwesomeIcon className='icon-plus' icon={faPlus} /></button>

                        </div>

                    </div>
                    <br />
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>Mã giảm giá</th>
                                <th>Mô tả</th>
                                <th>Loại giảm</th>
                                <th>Mệnh giá</th>
                                <th>Ngày tạo</th>
                                <th>hạn sử dụng</th>
                                <th>Sửa</th>
                                <th>Xóa</th>
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
                                        <td></td>
                                        <td></td>
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