import React from "react";
import '../../styles/admin/ADOrder.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheck,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import {


} from "@fortawesome/free-brands-svg-icons";
import axios from "axios";
import { Link } from "react-router-dom";
class ADOrder extends React.Component {

    state = {
        OrderP: [],
        OrderC: [],
        OrderD: [],
        OrderE: [],
        updatestatus: {
            id: '',
            ttDonHang: '',
            ttThanhToan: '',
            lyDoHuy: '',

        },



        orderdetail: [],
        errors: {}


    }
    async componentDidMount() {
        console.log("chạy vô đây");// kiểm tra xem có chạy vào hàm này không
        let resP = await axios.get('https://localhost:7078/api/Order?status=0');

        let resC = await axios.get('https://localhost:7078/api/Order?status=1');

        let resD = await axios.get('https://localhost:7078/api/Order?status=2');

        let resE = await axios.get('https://localhost:7078/api/Order?status=3');

        this.setState({
            OrderP: resP && resP.data ? resP.data : [],
            OrderC: resC && resC.data ? resC.data : [],
            OrderD: resD && resD.data ? resD.data : [],
            OrderE: resE && resE.data ? resE.data : [],
        })
    }

    formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    }

    formatDates = (dateString) => {
        const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'Asia/Ho_Chi_Minh'
        };
        return new Date(dateString).toLocaleString('vi-VN', options);
    }

    formatPrice = (price) => {
        return price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };
    //hamhf sửa trạng thái
    handleChangeupdatestatus = (event) => {
        this.setState((x) => ({
            updatestatus: {
                ...x.updatestatus,
                lyDoHuy: event.target.value
            }
        }));
    }

    handleEdit = async (status) => {

        this.setState({ updatestatus: { ...status } });
    }
    handleUpdate = async (status, event) => {
        event.preventDefault();

        const { lyDoHuy } = this.state.updatestatus;
        let errors = {};

        if (!lyDoHuy.trim()) errors.lyDoHuy = 'Vui lòng nhập lý do hủy.';


        if (Object.keys(errors).length > 0) {
            this.setState({ errors });
            return;
        }

        try {
            let res = await axios.put(`https://localhost:7078/api/Order/${this.state.updatestatus.id}?status=${status}&un=${this.state.updatestatus.lyDoHuy}`, {
                ttDonHang: this.state.updatestatus.ttDonHang
            });

            if (res.status === 200 || res.status === 204) {
                alert('Thành công');
                this.componentDidMount(); // Cập nhật lại dữ liệu khi component được gắn vào
            } else {
                alert('không thành công');
            }
        } catch (error) {
            console.error('Lỗi:', error);
            alert('Có lỗi xảy ra', error);
        }

    }

    handleUpdatee = async (status) => {
        try {
            let res = await axios.put(`https://localhost:7078/api/Order/${this.state.updatestatus.id}?status=${status}`, {
                ttDonHang: this.state.updatestatus.ttDonHang
            });
            if (res.status === 200 || res.status === 204) {
                alert('Thành công');
                this.componentDidMount(); // Cập nhật lại dữ liệu khi component được gắn vào
            } else {
                alert('không thành công');
            }
        } catch (error) {
            console.error('Lỗi:', error);
            alert('Có lỗi xảy ra', error);
        }

    }

    handleUpdates = async (status, statuspays) => {


        try {

            let res = await axios.put(`https://localhost:7078/api/Order?id=${this.state.updatestatus.id}&status=${status}&statuspay=${statuspays}`, {
                ttDonHang: this.state.updatestatus.ttDonHang,
                ttThanhToan: this.state.updatestatus.ttThanhToan
            });
            if (res.status === 200 || res.status === 204) {
                alert('Thành công');
                this.componentDidMount(); // Cập nhật lại dữ liệu khi component được gắn vào
            } else {
                alert('không thành công');
            }
        } catch (error) {
            console.error('Lỗi:', error);
            alert('Có lỗi xảy ra', error);
        }

    }

    handleUpdatedetail = async (iddetail) => {
        console.log(iddetail)
        try {
            let ress = await axios.get(`https://localhost:7078/api/OrderDetail?id=${iddetail}`)

            this.setState({
                orderdetail: ress && ress.data ? ress.data : []
            })

            console.log(ress)
        } catch (error) {
            console.error('Lỗi :', error);
            alert('Có lỗi xảy ra', error);

        }

    }
    checkDiscount = (loaiGiam) => {
      if(loaiGiam === true){
        return "%";
      }
      else if(loaiGiam === false){
        return "đ";
      }

    }

    render() {
        let { OrderP, OrderC, OrderD, OrderE, orderdetail } = this.state;
        const { errors } = this.state;
        return (

            <>
                <div className="containeOD">
                    <div className="Order">
                        <div className="mt-3 taborder">
                            <h4>Đơn hàng</h4>
                            <br />

                            <ul className="nav nav-tabs" role="tablist">
                                <li className="nav-item">
                                    <Link className="nav-link active" data-bs-toggle="tab" to="#home">Chờ xác nhận</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" data-bs-toggle="tab" to="#menu1">Đang giao</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" data-bs-toggle="tab" to="#menu2">Đã giao</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" data-bs-toggle="tab" to="#menu3">Đã hủy</Link>
                                </li>
                            </ul>


                            <div className="tab-content">
                                <div id="home" className="container tab-pane active"><br />
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Mã đơn hàng</th>
                                                <th>Tên Khách hàng</th>

                                                <th>Giảm giá</th>
                                                <th>Thành tiền</th>

                                                <th>Trạng thái thanh toán</th>
                                                <th>Trạng thái đơn hàng</th>
                                                <th></th>

                                            </tr>
                                        </thead>
                                        <tbody>

                                            {
                                                OrderP && OrderP.length > 0 &&
                                                OrderP.map((item) => {
                                                    return (
                                                        <>

                                                            <tr key={item.id}>
                                                                <td data-bs-toggle="collapse" data-bs-target={"#" + item.id} onClick={() => this.handleUpdatedetail(item.id)}>{item.id}</td>
                                                                <td data-bs-toggle="collapse" data-bs-target={"#" + item.id} onClick={() => this.handleUpdatedetail(item.id)}>{item.hoTen}</td>

                                                                <td data-bs-toggle="collapse" data-bs-target={"#" + item.id} onClick={() => this.handleUpdatedetail(item.id)}>
                                                                    {item.khuyenMai && item.khuyenMai.menhGia !== null ? this.formatPrice(item.khuyenMai.menhGia) + this.checkDiscount(item.khuyenMai.loaiGiam) : ""}
                                                                </td>
                                                                <td data-bs-toggle="collapse" data-bs-target={"#" + item.id} onClick={() => this.handleUpdatedetail(item.id)}>{this.formatPrice(item.thanhTien)} đ</td>


                                                                <td data-bs-toggle="collapse" data-bs-target={"#" + item.id} onClick={() => this.handleUpdatedetail(item.id)}>{item.ttThanhToan}
                                                                    {(() => {
                                                                       switch (item.ttThanhToan) {
                                                                            case true:
                                                                                return (
                                                                                    <span className="badge bg-success rounded-3 fw-semibold">
                                                                                        Đã thanh toán
                                                                                    </span>
                                                                                );
                                                                            case false:
                                                                                return (
                                                                                    <span className="badge bg-warning rounded-3 fw-semibold">
                                                                                        Chưa thanh toán
                                                                                    </span>
                                                                                );

                                                                            default:
                                                                                return <span>{item.ttThanhToan}</span>;
                                                                        }
                                                                    })()}
                                                                </td>

                                                                <td data-bs-toggle="collapse" data-bs-target={"#" + item.id} onClick={() => this.handleUpdatedetail(item.id)}>
                                                                    {(() => {
                                                                        switch (item.ttDonHang) {
                                                                            case 2:
                                                                                return (
                                                                                    <span className="badge bg-success rounded-3 fw-semibold">
                                                                                        Đã giao
                                                                                    </span>
                                                                                );
                                                                            case 0:
                                                                                return (
                                                                                    <span className="badge bg-warning rounded-3 fw-semibold">
                                                                                        Chờ duyệt
                                                                                    </span>
                                                                                );
                                                                            case 3:
                                                                                return (
                                                                                    <span className="badge bg-danger rounded-3 fw-semibold">
                                                                                        Đã hủy
                                                                                    </span>
                                                                                );
                                                                            case 1:
                                                                                return (
                                                                                    <span className="badge bg-success rounded-3 fw-semibold">
                                                                                        Đang giao
                                                                                    </span>
                                                                                );
                                                                            default:
                                                                                return <span>{item.ttDonHang}</span>;
                                                                        }
                                                                    })()}
                                                                </td>
                                                                <td>
                                                                    <Link to="" data-bs-toggle="modal" data-bs-target="#myModal-updatestatus0" className="edit"><FontAwesomeIcon icon={faCheck} className="iconedit" onClick={() => this.handleEdit(item)} /></Link>
                                                                    {(() => {
                                                                        switch (item.ttThanhToan) {
                                                                            case true:
                                                                                return (
                                                                                    <span>

                                                                                    </span>
                                                                                );
                                                                            case false:
                                                                                return (
                                                                                    <Link to="" className="delete" data-bs-toggle="modal" data-bs-target="#myModal-unupdatestatus"><FontAwesomeIcon icon={faXmark} className="icondelete" onClick={() => this.handleEdit(item)} /></Link>
                                                                                );

                                                                            default:
                                                                                return <span>{item.ttDonHang}</span>;
                                                                        }
                                                                    })()}
                                                                </td>

                                                            </tr>

                                                            <tr>
                                                                <td colSpan={7} className="order-detail">
                                                                    <div className="card">
                                                                        <div id={item.id} className="collapse" data-bs-parent="#accordion">
                                                                            <div className="card-body">
                                                                                <div>
                                                                                    Thời gian tạo đơn hàng: {this.formatDates(item.ngayTao)}
                                                                                    <h5>Sản phẩm trong đơn hàng</h5>
                                                                                </div>

                                                                                <table className="table table-hover ">
                                                                                    <thead>
                                                                                        <tr>
                                                                                            <th> Tên sản phẩm </th>
                                                                                            <th> số lượng </th>
                                                                                            <th> Giá </th>
                                                                                            <th> Mô tả </th>


                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                        {
                                                                                            orderdetail && orderdetail.length > 0 &&
                                                                                            orderdetail.map((items) => {

                                                                                                return (

                                                                                                    <tr key={items.id}>

                                                                                                        <td>{items.sanPham.ten}</td>
                                                                                                        <td>{items.soLuong}</td>
                                                                                                        <td>{this.formatPrice(items.giaSP)} đ</td>
                                                                                                        <td>{items.sanPham.moTa}</td>

                                                                                                    </tr>

                                                                                                )
                                                                                            })
                                                                                        }


                                                                                    </tbody>
                                                                                </table>
                                                                                
                                                                                <div className="row nn">
                                                                                    <div className="col-md-4">
                                                                                        <span>Tên người nhận hàng:</span><br />
                                                                                        <span>Số điện thoại:</span><br />
                                                                                        <span>địa chỉ:</span><br />
                                                                                        <span>Phương thức thanh toán:</span><br />
                                                                                        <span>Ghi chú:</span>

                                                                                    </div>
                                                                                    <div className="col-md-4">
                                                                                       
                                                                                        <span className="kh"> {item.hoTen}</span><br />
                                                                                        <span className="kh"> {item.sdt}</span><br />
                                                                                        <span className="kh"> {item.diaChi}</span><br />
                                                                                        {console.log(item.ptThanhToan)}
                                                                                        <span className="kh"> {item.ptThanhToan}
                                                                                            {(() => {
                                                                                                switch (item.ptThanhToan) {
                                                                                                    case true:
                                                                                                        return (
                                                                                                            <span>Thanh toán bằng ngân hàng</span>
                                                                                                        );
                                                                                                    case false:
                                                                                                        return (
                                                                                                            <span >
                                                                                                                COD (Trả tiền mặt khi nhận hàng)
                                                                                                            </span>
                                                                                                        );

                                                                                                    default:
                                                                                                        return <span>{item.ptThanhToan}</span>;
                                                                                                }
                                                                                            })()}

                                                                                        </span>

                                                                                    </div>
                                                                                    <div className="col-md-4">
                                                                                        Giảm giá:   <span className="kk">{item.khuyenMai && item.khuyenMai.menhGia !== null ? this.formatPrice(item.khuyenMai.menhGia) + this.checkDiscount(item.khuyenMai.loaiGiam) : ""}</span><br />
                                                                                        Tổng tiền:   <span className="kk">{this.formatPrice(item.thanhTien)} đ</span>

                                                                                    </div>

                                                                                </div>
                                                                                <hr />
                                                                            </div>

                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr >
                                                        </>
                                                    )
                                                })
                                            }

                                        </tbody>
                                    </table>
                                </div>
                                <div id="menu1" className="container tab-pane fade"><br />
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Mã đơn hàng</th>
                                                <th>Tên Khách hàng</th>

                                                <th>Giảm giá</th>
                                                <th>Thành tiền</th>

                                                <th>Trạng thái thanh toán</th>
                                                <th>Trạng thái đơn hàng</th>
                                                <th></th>

                                            </tr>
                                        </thead>
                                        <tbody>

                                            {
                                                OrderC && OrderC.length > 0 &&
                                                OrderC.map((item) => {

                                                    return (
                                                        <>

                                                            <tr key={item.id}>
                                                                <td data-bs-toggle="collapse" data-bs-target={"#" + item.id} onClick={() => this.handleUpdatedetail(item.id)}>{item.id}</td>
                                                                <td data-bs-toggle="collapse" data-bs-target={"#" + item.id} onClick={() => this.handleUpdatedetail(item.id)}>{item.hoTen}</td>

                                                                <td data-bs-toggle="collapse" data-bs-target={"#" + item.id} onClick={() => this.handleUpdatedetail(item.id)}>
                                                                    {item.khuyenMai && item.khuyenMai.menhGia !== null ? this.formatPrice(item.khuyenMai.menhGia) + this.checkDiscount(item.khuyenMai.loaiGiam) : ""}
                                                                </td>
                                                                <td data-bs-toggle="collapse" data-bs-target={"#" + item.id} onClick={() => this.handleUpdatedetail(item.id)}>{this.formatPrice(item.thanhTien)} đ</td>

                                                                <td data-bs-toggle="collapse" data-bs-target={"#" + item.id} onClick={() => this.handleUpdatedetail(item.id)}>{item.ttThanhToan}
                                                                    {(() => {
                                                                        switch (item.ttThanhToan) {
                                                                            case true:
                                                                                return (
                                                                                    <span className="badge bg-success rounded-3 fw-semibold">
                                                                                        Đã thanh toán
                                                                                    </span>
                                                                                );
                                                                            case false:
                                                                                return (
                                                                                    <span className="badge bg-warning rounded-3 fw-semibold">
                                                                                        Chưa thanh toán
                                                                                    </span>
                                                                                );

                                                                            default:
                                                                                return <span>{item.ttThanhToan}</span>;
                                                                        }
                                                                    })()}
                                                                </td>

                                                                <td data-bs-toggle="collapse" data-bs-target={"#" + item.id} onClick={() => this.handleUpdatedetail(item.id)}>
                                                                    {(() => {
                                                                        switch (item.ttDonHang) {
                                                                            case 2:
                                                                                return (
                                                                                    <span className="badge bg-success rounded-3 fw-semibold">
                                                                                        Đã giao
                                                                                    </span>
                                                                                );
                                                                            case 0:
                                                                                return (
                                                                                    <span className="badge bg-warning rounded-3 fw-semibold">
                                                                                        Chờ duyệt
                                                                                    </span>
                                                                                );
                                                                            case 3:
                                                                                return (
                                                                                    <span className="badge bg-danger rounded-3 fw-semibold">
                                                                                        Đã hủy
                                                                                    </span>
                                                                                );
                                                                            case 1:
                                                                                return (
                                                                                    <span className="badge bg-success rounded-3 fw-semibold">
                                                                                        Đang giao
                                                                                    </span>
                                                                                );
                                                                            default:
                                                                                return <span>{item.ttDonHang}</span>;
                                                                        }
                                                                    })()}
                                                                </td>
                                                                <td>

                                                                    <Link to="" className="edit" data-bs-toggle="modal" data-bs-target="#myModal-updatestatus1"><FontAwesomeIcon icon={faCheck} className="iconedit" onClick={() => this.handleEdit(item)} /></Link>
                                                                    {(() => {
                                                                        switch (item.ttThanhToan) {
                                                                            case true:
                                                                                return (
                                                                                    <span>
                                                                                        
                                                                                    </span>
                                                                                );
                                                                            case false:
                                                                                return (
                                                                                    <Link to="" className="delete" data-bs-toggle="modal" data-bs-target="#myModal-unupdatestatus"><FontAwesomeIcon icon={faXmark} className="icondelete" onClick={() => this.handleEdit(item)} /></Link>
                                                                                );

                                                                            default:
                                                                                return <span>{item.ttDonHang}</span>;
                                                                        }
                                                                    })()}
                                                                </td>

                                                            </tr>

                                                            <tr>
                                                                <td colSpan={7} className="order-detail">
                                                                    <div className="card">
                                                                        <div id={item.id} className="collapse" data-bs-parent="#accordion">
                                                                            <div className="card-body">
                                                                                <div>
                                                                                    Thời gian tạo đơn hàng: {this.formatDates(item.ngayTao)}
                                                                                    <h5>Sản phẩm trong đơn hàng</h5>
                                                                                </div>

                                                                                <table className="table table-hover ">
                                                                                    <thead>
                                                                                        <tr>
                                                                                            <th> Tên sản phẩm </th>
                                                                                            <th> số lượng </th>
                                                                                            <th> Giá </th>
                                                                                            <th> Mô tả </th>


                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                        {
                                                                                            orderdetail && orderdetail.length > 0 &&
                                                                                            orderdetail.map((items) => {

                                                                                                return (

                                                                                                    <tr key={items.id}>

                                                                                                        <td>{items.sanPham.ten}</td>
                                                                                                        <td>{items.soLuong}</td>
                                                                                                        <td>{this.formatPrice(items.giaSP)} đ</td>
                                                                                                        <td>{items.sanPham.moTa}</td>

                                                                                                    </tr>

                                                                                                )
                                                                                            })
                                                                                        }


                                                                                    </tbody>
                                                                                </table>

                                                                                <div className="row nn">
                                                                                    <div className="col-md-4">
                                                                                        <span>Tên người nhận hàng:</span><br />
                                                                                        <span>Số điện thoại:</span><br />
                                                                                        <span>địa chỉ:</span><br />
                                                                                        <span>Phương thức thanh toán:</span><br />
                                                                                        <span>Ghi chú:</span>
                                                                                    </div>
                                                                                    <div className="col-md-4">

                                                                                        <span className="kh"> {item.hoTen}</span><br />
                                                                                        <span className="kh"> {item.sdt}</span><br />
                                                                                        <span className="kh"> {item.diaChi}</span><br />
                                                                                        <span className="kh"> {item.ptThanhToan}
                                                                                            {(() => {
                                                                                                switch (item.ptThanhToan) {
                                                                                                    case true:
                                                                                                        return (
                                                                                                            <span>Thanh toán bằng ngân hàng</span>
                                                                                                        );
                                                                                                    case false:
                                                                                                        return (
                                                                                                            <span >
                                                                                                                COD (Trả tiền mặt khi nhận hàng)
                                                                                                            </span>
                                                                                                        );

                                                                                                    default:
                                                                                                        return <span>{item.ptThanhToan}</span>;
                                                                                                }
                                                                                            })()}

                                                                                        </span>

                                                                                    </div>
                                                                                    <div className="col-md-4">
                                                                                        Giảm giá:   <span className="kk">{item.khuyenMai && item.khuyenMai.menhGia !== null ? this.formatPrice(item.khuyenMai.menhGia) + this.checkDiscount(item.khuyenMai.loaiGiam) : ""}</span><br />
                                                                                        Tổng tiền:   <span className="kk">{this.formatPrice(item.thanhTien)} đ</span>

                                                                                    </div>

                                                                                </div>
                                                                                <hr />
                                                                            </div>

                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </>


                                                    )
                                                })
                                            }



                                        </tbody>
                                    </table>
                                </div>
                                <div id="menu2" className="container tab-pane fade"><br />

                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Mã đơn hàng</th>
                                                <th>Tên Khách hàng</th>

                                                <th>Giảm giá</th>
                                                <th>Thành tiền</th>

                                                <th>Trạng thái thanh toán</th>
                                                <th>Trạng thái đơn hàng</th>


                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                OrderD && OrderD.length > 0 &&
                                                OrderD.map((item) => {
                                                    return (

                                                        <>

                                                            <tr key={item.id}>
                                                                <td data-bs-toggle="collapse" data-bs-target={"#" + item.id} onClick={() => this.handleUpdatedetail(item.id)}>{item.id}</td>
                                                                <td data-bs-toggle="collapse" data-bs-target={"#" + item.id} onClick={() => this.handleUpdatedetail(item.id)}>{item.hoTen} </td>

                                                                <td data-bs-toggle="collapse" data-bs-target={"#" + item.id} onClick={() => this.handleUpdatedetail(item.id)}>
                                                                    {item.khuyenMai && item.khuyenMai.menhGia !== null ? this.formatPrice(item.khuyenMai.menhGia) + this.checkDiscount(item.khuyenMai.loaiGiam) : ""}
                                                                </td>
                                                                <td data-bs-toggle="collapse" data-bs-target={"#" + item.id} onClick={() => this.handleUpdatedetail(item.id)}>{this.formatPrice(item.thanhTien)} đ</td>

                                                                <td data-bs-toggle="collapse" data-bs-target={"#" + item.id} onClick={() => this.handleUpdatedetail(item.id)}>{item.ttThanhToan}
                                                                    {(() => {
                                                                       switch (item.ttThanhToan) {
                                                                            case true:
                                                                                return (
                                                                                    <span className="badge bg-success rounded-3 fw-semibold">
                                                                                        Đã thanh toán
                                                                                    </span>
                                                                                );
                                                                            case false:
                                                                                return (
                                                                                    <span className="badge bg-warning rounded-3 fw-semibold">
                                                                                        Chưa thanh toán
                                                                                    </span>
                                                                                );

                                                                            default:
                                                                                return <span>{item.ttThanhToan}</span>;
                                                                        }
                                                                    })()}
                                                                </td>

                                                                <td data-bs-toggle="collapse" data-bs-target={"#" + item.id} onClick={() => this.handleUpdatedetail(item.id)}>
                                                                    {(() => {
                                                                        switch (item.ttDonHang) {
                                                                            case 2:
                                                                                return (
                                                                                    <span className="badge bg-success rounded-3 fw-semibold">
                                                                                        Đã giao
                                                                                    </span>
                                                                                );
                                                                            case 0:
                                                                                return (
                                                                                    <span className="badge bg-warning rounded-3 fw-semibold">
                                                                                        Chờ duyệt
                                                                                    </span>
                                                                                );
                                                                            case 3:
                                                                                return (
                                                                                    <span className="badge bg-danger rounded-3 fw-semibold">
                                                                                        Đã hủy
                                                                                    </span>
                                                                                );
                                                                            case 1:
                                                                                return (
                                                                                    <span className="badge bg-success rounded-3 fw-semibold">
                                                                                        Đang giao
                                                                                    </span>
                                                                                );
                                                                            default:
                                                                                return <span>{item.ttDonHang}</span>;
                                                                        }
                                                                    })()}
                                                                </td>


                                                            </tr>

                                                            <tr>
                                                                <td colSpan={6} className="order-detail">
                                                                    <div className="card">
                                                                        <div id={item.id} className="collapse" data-bs-parent="#accordion">
                                                                            <div className="card-body">
                                                                                <div>
                                                                                    Thời gian tạo đơn hàng: {this.formatDates(item.ngayTao)}
                                                                                    <h5>Sản phẩm trong đơn hàng</h5>
                                                                                </div>

                                                                                <table className="table table-hover ">
                                                                                    <thead>
                                                                                        <tr>
                                                                                            <th> Tên sản phẩm </th>
                                                                                            <th> số lượng </th>
                                                                                            <th> Giá </th>
                                                                                            <th> Mô tả </th>


                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                        {
                                                                                            orderdetail && orderdetail.length > 0 &&
                                                                                            orderdetail.map((items) => {

                                                                                                return (

                                                                                                    <tr key={items.id}>

                                                                                                        <td>{items.sanPham.ten}</td>
                                                                                                        <td>{items.soLuong}</td>
                                                                                                        <td>{this.formatPrice(items.giaSP)}đ</td>
                                                                                                        <td>{items.sanPham.moTa}</td>

                                                                                                    </tr>

                                                                                                )
                                                                                            })
                                                                                        }


                                                                                    </tbody>
                                                                                </table>

                                                                                <div className="row nn">
                                                                                    <div className="col-md-4">
                                                                                        <span>Tên người nhận hàng:</span><br />
                                                                                        <span>Số điện thoại:</span><br />
                                                                                        <span>địa chỉ:</span><br />
                                                                                        <span>Phương thức thanh toán:</span><br />
                                                                                        <span>Ghi chú:</span>
                                                                                    </div>
                                                                                    <div className="col-md-4">

                                                                                        <span className="kh"> {item.hoTen}</span><br />
                                                                                        <span className="kh"> {item.sdt}</span><br />
                                                                                        <span className="kh"> {item.diaChi}</span><br />
                                                                                        <span className="kh"> {item.ptThanhToan}
                                                                                            {(() => {
                                                                                                switch (item.ptThanhToan) {
                                                                                                    case true:
                                                                                                        return (
                                                                                                            <span>Thanh toán bằng ngân hàng</span>
                                                                                                        );
                                                                                                    case false:
                                                                                                        return (
                                                                                                            <span >
                                                                                                                COD (Trả tiền mặt khi nhận hàng)
                                                                                                            </span>
                                                                                                        );

                                                                                                    default:
                                                                                                        return <span>{item.ptThanhToan}</span>;
                                                                                                }
                                                                                            })()}

                                                                                        </span>

                                                                                    </div>
                                                                                    <div className="col-md-4">
                                                                                        Giảm giá:   <span className="kk">{item.khuyenMai && item.khuyenMai.menhGia !== null ? this.formatPrice(item.khuyenMai.menhGia) + this.checkDiscount(item.khuyenMai.loaiGiam) : ""}</span><br />
                                                                                        Tổng tiền:   <span className="kk">{this.formatPrice(item.thanhTien)} đ</span>

                                                                                    </div>

                                                                                </div>
                                                                                <hr />

                                                                            </div>

                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </>


                                                    )
                                                })
                                            }

                                        </tbody>
                                    </table>

                                </div>

                                <div id="menu3" className="container tab-pane fade"><br />
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Mã đơn hàng</th>
                                                <th>Tên Khách hàng</th>
                                                <th>Giảm giá</th>
                                                <th>Thành tiền</th>
                                                <th>Ngày hủy</th>
                                                <th>Trạng thái thanh toán</th>
                                                <th>Trạng thái Đơn hàng</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                OrderE && OrderE.length > 0 &&
                                                OrderE.map((item) => {
                                                    return (
                                                        <>
                                                            <tr key={item.id}>
                                                                <td data-bs-toggle="collapse" data-bs-target={"#" + item.id} onClick={() => this.handleUpdatedetail(item.id)}>{item.id}</td>
                                                                <td data-bs-toggle="collapse" data-bs-target={"#" + item.id} onClick={() => this.handleUpdatedetail(item.id)}>{item.hoTen}</td>
                                                                <td data-bs-toggle="collapse" data-bs-target={"#" + item.id} onClick={() => this.handleUpdatedetail(item.id)}>
                                                                    {item.khuyenMai && item.khuyenMai.menhGia !== null ? this.formatPrice(item.khuyenMai.menhGia) +this.checkDiscount(item.khuyenMai.loaiGiam) : ""}
                                                                </td>
                                                                <td data-bs-toggle="collapse" data-bs-target={"#" + item.id} onClick={() => this.handleUpdatedetail(item.id)}>{this.formatPrice(item.thanhTien)} đ</td>
                                                                <td data-bs-toggle="collapse" data-bs-target={"#" + item.id} onClick={() => this.handleUpdatedetail(item.id)}>{this.formatDate(item.ngayHuy)}</td>
                                                                <td data-bs-toggle="collapse" data-bs-target={"#" + item.id} onClick={() => this.handleUpdatedetail(item.id)}>{item.ttThanhToan}
                                                                    {(() => {
                                                                       switch (item.ttThanhToan) {
                                                                            case true:
                                                                                return (
                                                                                    <span className="badge bg-success rounded-3 fw-semibold">
                                                                                        Đã thanh toán
                                                                                    </span>
                                                                                );
                                                                            case false:
                                                                                return (
                                                                                    <span className="badge bg-warning rounded-3 fw-semibold">
                                                                                        Chưa thanh toán
                                                                                    </span>
                                                                                );

                                                                            default:
                                                                                return <span>{item.ttThanhToan}</span>;
                                                                        }
                                                                    })()}
                                                                </td>

                                                                <td data-bs-toggle="collapse" data-bs-target={"#" + item.id}>
                                                                    {(() => {
                                                                        switch (item.ttDonHang) {
                                                                            case 2:
                                                                                return (
                                                                                    <span className="badge bg-success rounded-3 fw-semibold">
                                                                                        Đã giao
                                                                                    </span>
                                                                                );
                                                                            case 0:
                                                                                return (
                                                                                    <span className="badge bg-warning rounded-3 fw-semibold">
                                                                                        Chờ duyệt
                                                                                    </span>
                                                                                );
                                                                            case 3:
                                                                                return (
                                                                                    <span className="badge bg-danger rounded-3 fw-semibold">
                                                                                        Đã hủy
                                                                                    </span>
                                                                                );
                                                                            case 1:
                                                                                return (
                                                                                    <span className="badge bg-success rounded-3 fw-semibold">
                                                                                        Đang giao
                                                                                    </span>
                                                                                );
                                                                            default:
                                                                                return <span>{item.ttDonHang}</span>;
                                                                        }
                                                                    })()}
                                                                </td>

                                                            </tr>

                                                            <tr>
                                                                <td colSpan={7} className="order-detail">
                                                                    <div className="card">
                                                                        <div id={item.id} className="collapse" data-bs-parent="#accordion">
                                                                            <div className="card-body">
                                                                                <div>
                                                                                    Thời gian tạo đơn hàng: {this.formatDates(item.ngayTao)}
                                                                                    <h5>Sản phẩm trong đơn hàng</h5>
                                                                                </div>

                                                                                <table className="table table-hover ">
                                                                                    <thead>
                                                                                        <tr>
                                                                                            <th> Tên sản phẩm </th>
                                                                                            <th> số lượng </th>
                                                                                            <th> Giá </th>
                                                                                            <th> Mô tả </th>


                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                        {
                                                                                            orderdetail && orderdetail.length > 0 &&
                                                                                            orderdetail.map((items) => {

                                                                                                return (

                                                                                                    <tr key={items.id}>

                                                                                                        <td>{items.sanPham.ten}</td>
                                                                                                        <td>{items.soLuong}</td>
                                                                                                        <td>{this.formatPrice(items.giaSP)} đ</td>
                                                                                                        <td>{items.sanPham.moTa}</td>

                                                                                                    </tr>

                                                                                                )
                                                                                            })
                                                                                        }


                                                                                    </tbody>
                                                                                </table>

                                                                                <div className="row nn">
                                                                                    <div className="col-md-4">
                                                                                        <span>Tên người nhận hàng:</span><br />
                                                                                        <span>Số điện thoại:</span><br />
                                                                                        <span>địa chỉ:</span><br />
                                                                                        <span>Phương thức thanh toán:</span><br />

                                                                                        <span>Ghi chú:</span><br />
                                                                                        <span>Lý do hủy đơn:</span>

                                                                                    </div>
                                                                                    <div className="col-md-4">

                                                                                        <span className="kh"> {item.hoTen}</span><br />
                                                                                        <span className="kh"> {item.sdt}</span><br />
                                                                                        <span className="kh"> {item.diaChi}</span><br />
                                                                                        <span className="kh"> {item.ptThanhToan}
                                                                                            {(() => {
                                                                                                switch (item.ptThanhToan) {
                                                                                                    case true:
                                                                                                        return (
                                                                                                            <span>Thanh toán bằng ngân hàng</span>
                                                                                                        );
                                                                                                    case false:
                                                                                                        return (
                                                                                                            <span >
                                                                                                                COD (Trả tiền mặt khi nhận hàng)
                                                                                                            </span>
                                                                                                        );

                                                                                                    default:
                                                                                                        return <span>{item.ptThanhToan}</span>;
                                                                                                }
                                                                                            })()}

                                                                                        </span><br />
                                                                                        <span className="kh"> </span><br />
                                                                                        <span className="kh">{item.lyDoHuy}</span>




                                                                                    </div>
                                                                                    <div className="col-md-4">

                                                                                        Giảm giá:   <span className="kk">{item.khuyenMai && item.khuyenMai.menhGia !== null ? this.formatPrice(item.khuyenMai.menhGia) + this.checkDiscount(item.khuyenMai.loaiGiam) : ""}</span><br />
                                                                                        Tổng tiền:  <span className="kk">{this.formatPrice(item.thanhTien)} đ</span>


                                                                                    </div>

                                                                                </div>
                                                                                <hr />

                                                                            </div>

                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </>


                                                    )
                                                })
                                            }

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal" id="myModal-updatestatus0">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <form>
                                        <div className="mb-3 mt-3">
                                            <h4 className="modal-title">Xác nhận đơn hàng này</h4>

                                        </div>
                                        <div className="mb-3">
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Hủy</button>
                                    <button type="button" onClick={() => this.handleUpdatee(1)} className="btn btn-primary" data-bs-dismiss="modal">Xác nhận</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal" id="myModal-updatestatus1">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <form>
                                        <div className="mb-3 mt-3">
                                            <h4 className="modal-title">Xác nhận đơn hàng này</h4>

                                        </div>
                                        <div className="mb-3">
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Hủy</button>
                                    <button type="button" onClick={(event) => this.handleUpdates(2, true)} className="btn btn-primary" data-bs-dismiss="modal">Xác nhận</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal" id="myModal-unupdatestatus">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h4 className="modal-title">Hủy đơn hàng này </h4>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <div className="mb-3 mt-3">
                                            <label className="modal-title">Nhập lý do hủy đơn (đuôi admin)</label>
                                            <input value={this.state.updatestatus.lyDoHuy} onChange={(event) => this.handleChangeupdatestatus(event)} className="form-control" />
                                            {errors.lyDoHuy && <div className="text-danger">{errors.lyDoHuy}</div>}

                                        </div>
                                        <div className="mb-3">
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Hủy bỏ</button>
                                    <button type="button" onClick={(event) => this.handleUpdate(3, event)} className="btn btn-primary" data-bs-dismiss="modal">Xác nhận hủy</button>
                                </div>
                            </div>
                        </div>
                    </div>


                </div >
            </>
        )
    }
}
export default ADOrder;