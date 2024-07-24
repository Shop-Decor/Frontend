import React from "react";
import '../../styles/admin/ADOrder.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircleInfo,
    faCircleCheck,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import {

    faFacebook
} from "@fortawesome/free-brands-svg-icons";
import axios from "axios";
import { Link } from "react-router-dom";
class ADOrder extends React.Component {

    state = {
        OrderP: [],
        OrderC: [],
        OrderD: [],
        OrderE: [],
    }
    async componentDidMount() {
        let resP = await axios.get('https://localhost:7078/api/Order?status=1');
        console.log("Data fetched", resP.data);
        let resC = await axios.get('https://localhost:7078/api/Order?status=2');
        console.log("Data fetched", resC.data);
        let resD = await axios.get('https://localhost:7078/api/Order?status=3');
        console.log("Data fetched", resD.data);
        let resE = await axios.get('https://localhost:7078/api/Order?status=4');
        console.log("Data fetched", resE.data);
        this.setState({
            OrderP: resP && resP.data ? resP.data : [],
            OrderC: resC && resC.data ? resC.data : [],
            OrderD: resD && resD.data ? resD.data : [],
            OrderE: resE && resE.data ? resE.data : [],
        })
    }
    render() {
        let { OrderP,OrderC,OrderD,OrderE } = this.state;
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
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Tên Khách hàng</th>
                                                <th>Thanh tiền</th>
                                                <th>Khuyến mãi</th>
                                                <th>Ngày tạo</th>
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
                                                        <tr key={item.id}>

                                                            <td>{item.thanhTien}</td>
                                                            <td>{item.ngayHuy}</td>
                                                            <td>{item.ngayHuy}</td>
                                                            <td>{item.lyDoHuy}</td>
                                                            <td>{item.ttThanhToan}</td>

                                                            <td>
                                                                {(() => {
                                                                    switch (item.ttDonHang) {
                                                                        case 3:
                                                                            return (
                                                                                <span className="badge bg-success rounded-3 fw-semibold">
                                                                                    Đã thành toán
                                                                                </span>
                                                                            );
                                                                        case 1:
                                                                            return (
                                                                                <span className="badge bg-warning rounded-3 fw-semibold">
                                                                                    Chờ duyệt
                                                                                </span>
                                                                            );
                                                                        case 4:
                                                                            return (
                                                                                <span className="badge bg-danger rounded-3 fw-semibold">
                                                                                    Đã hủy
                                                                                </span>
                                                                            );
                                                                        case 2:
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
                                                                <Link to="" href="" className="edit"><FontAwesomeIcon icon={faCircleCheck} className="iconedit" /></Link>
                                                                <Link to="" href="" className="delete"><FontAwesomeIcon icon={faXmark} className="icondelete" /></Link>
                                                                <Link to="" href="" className="detail"><FontAwesomeIcon icon={faCircleInfo} className="icondetail" /></Link>
                                                            </td>

                                                        </tr>



                                                    )
                                                })
                                            }




                                        </tbody>
                                    </table>
                                </div>
                                <div id="menu1" className="container tab-pane fade"><br />
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Tên Khách hàng</th>
                                                <th>Thanh tiền</th>
                                                <th>Khuyến mãi</th>
                                                <th>Ngày tạo</th>
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
                                                        <tr key={item.id}>

                                                            <td>{item.thanhTien}</td>
                                                            <td>{item.ngayHuy}</td>
                                                            <td>{item.ngayHuy}</td>
                                                            <td>{item.lyDoHuy}</td>
                                                            <td>{item.ttThanhToan}</td>

                                                            <td>
                                                                {(() => {
                                                                    switch (item.ttDonHang) {
                                                                        case 3:
                                                                            return (
                                                                                <span className="badge bg-success rounded-3 fw-semibold">
                                                                                    Đã thành toán
                                                                                </span>
                                                                            );
                                                                        case 1:
                                                                            return (
                                                                                <span className="badge bg-warning rounded-3 fw-semibold">
                                                                                    Chờ duyệt
                                                                                </span>
                                                                            );
                                                                        case 4:
                                                                            return (
                                                                                <span className="badge bg-danger rounded-3 fw-semibold">
                                                                                    Đã hủy
                                                                                </span>
                                                                            );
                                                                        case 2:
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
                                                                <Link to="" href="" className="edit"><FontAwesomeIcon icon={faCircleCheck} className="iconedit" /></Link>
                                                                <Link to="" href="" className="delete"><FontAwesomeIcon icon={faXmark} className="icondelete" /></Link>
                                                                <Link to="" href="" className="detail"><FontAwesomeIcon icon={faCircleInfo} className="icondetail" /></Link>
                                                            </td>

                                                        </tr>



                                                    )
                                                })
                                            }




                                        </tbody>
                                    </table>
                                </div>
                                <div id="menu2" className="container tab-pane fade"><br />

                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Tên Khách hàng</th>
                                                <th>Thanh tiền</th>
                                                <th>Khuyến mãi</th>
                                                <th>Ngày tạo</th>
                                                <th>Trạng thái thanh toán</th>
                                                <th>Trạng thái đơn hàng</th>
                                                <th></th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                OrderD && OrderD.length > 0 &&
                                                OrderD.map((item) => {
                                                    return (
                                                        <tr key={item.id}>

                                                            <td>{item.thanhTien}</td>
                                                            <td>{item.ngayHuy}</td>
                                                            <td>{item.ngayHuy}</td>
                                                            <td>{item.lyDoHuy}</td>
                                                            <td>{item.ttThanhToan}</td>

                                                            <td>
                                                                {(() => {
                                                                    switch (item.ttDonHang) {
                                                                        case 3:
                                                                            return (
                                                                                <span className="badge bg-success rounded-3 fw-semibold">
                                                                                    Đã thành toán
                                                                                </span>
                                                                            );
                                                                        case 1:
                                                                            return (
                                                                                <span className="badge bg-warning rounded-3 fw-semibold">
                                                                                    Chờ duyệt
                                                                                </span>
                                                                            );
                                                                        case 4:
                                                                            return (
                                                                                <span className="badge bg-danger rounded-3 fw-semibold">
                                                                                    Đã hủy
                                                                                </span>
                                                                            );
                                                                        case 2:
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
                                                                <Link to="" href="" className="edit"><FontAwesomeIcon icon={faCircleCheck} className="iconedit" /></Link>
                                                                <Link to="" href="" className="delete"><FontAwesomeIcon icon={faXmark} className="icondelete" /></Link>
                                                                <Link to="" href="" className="detail"><FontAwesomeIcon icon={faCircleInfo} className="icondetail" /></Link>
                                                            </td>

                                                        </tr>



                                                    )
                                                })
                                            }




                                        </tbody>
                                    </table>

                                </div>

                                <div id="menu3" className="container tab-pane fade"><br />
                                <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Tên Khách hàng</th>
                                                <th>Thanh tiền</th>
                                                <th>Khuyến mãi</th>
                                                <th>Ngày tạo</th>
                                                <th>Trạng thái thanh toán</th>
                                                <th>Trạng thái đơn hàng</th>
                                                <th></th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                OrderE && OrderE.length > 0 &&
                                                OrderE.map((item) => {
                                                    return (
                                                        <tr key={item.id}>

                                                            <td>{item.thanhTien}</td>
                                                            <td>{item.ngayHuy}</td>
                                                            <td>{item.ngayHuy}</td>
                                                            <td>{item.lyDoHuy}</td>
                                                            <td>{item.ttThanhToan}</td>

                                                            <td>
                                                                {(() => {
                                                                    switch (item.ttDonHang) {
                                                                        case 3:
                                                                            return (
                                                                                <span className="badge bg-success rounded-3 fw-semibold">
                                                                                    Đã thành toán
                                                                                </span>
                                                                            );
                                                                        case 1:
                                                                            return (
                                                                                <span className="badge bg-warning rounded-3 fw-semibold">
                                                                                    Chờ duyệt
                                                                                </span>
                                                                            );
                                                                        case 4:
                                                                            return (
                                                                                <span className="badge bg-danger rounded-3 fw-semibold">
                                                                                    Đã hủy
                                                                                </span>
                                                                            );
                                                                        case 2:
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
                                                                <Link to="" href="" className="edit"><FontAwesomeIcon icon={faCircleCheck} className="iconedit" /></Link>
                                                                <Link to="" href="" className="delete"><FontAwesomeIcon icon={faXmark} className="icondelete" /></Link>
                                                                <Link to="" href="" className="detail"><FontAwesomeIcon icon={faCircleInfo} className="icondetail" /></Link>
                                                            </td>

                                                        </tr>



                                                    )
                                                })
                                            }




                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>




                    </div>

                </div>
            </>
        )
    }
}
export default ADOrder;