import React from "react";
import '../../styles/admin/ADCategory.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import {
    faPenToSquare,
    faPlus,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {


} from "@fortawesome/free-brands-svg-icons";
import axios from "axios";
import Swal from 'sweetalert2';
class ADCategory extends React.Component {
    state = {
        Category: [],
        Categorysize: [],
        Categorycolor: [],

        createcategorts: {
            tenLoai: ''
        },
        createcategorysizes: {
            tenKichThuoc: ''
        },
        createcategorycolors: {
            tenMauSac: ''
        },

        updateType: {
            tenLoai: '',
            id: ''
        },
        updateSize: {
            tenKichThuoc: '',
            id: ''
        },
        updateColor: {
            tenMauSac: '',
            id: ''
        },

        deleteType: {
            tenLoai: '',
            id: ''
        },

        deleteSize: {
            tenKichThuoc: '',
            id: ''
        },

        deleteColor: {
            tenMauSac: '',
            id: ''
        },
        errors: {}

    }
    // hiện thị dự liệu
    async componentDidMount() {
        let res = await axios.get('https://localhost:7078/api/Category');
        console.log("Data fetched", res.data);
        let resCsize = await axios.get('https://localhost:7078/api/Category_Size');
        console.log("Data fetched", resCsize.data);
        let rescolor = await axios.get('https://localhost:7078/api/CategoryColor');
        console.log("Data fetched", rescolor.data);
        this.setState({
            Category: res && res.data ? res.data : [],
            Categorysize: resCsize && resCsize.data ? resCsize.data : [],
            Categorycolor: rescolor && rescolor.data ? rescolor.data : [],

        })
    }

    //hàm thêm

    handleChangecatagory = (event) => {
        this.setState((x) => ({
            createcategorts: {
                ...x.createcategorts,
                tenLoai: event.target.value

            }

        }));
        console.log(event.target.value)
    }



    handleChangecatagorysize = (event) => {
        this.setState((x) => ({
            createcategorysizes: {
                ...x.createcategorysizes,
                tenKichThuoc: event.target.value

            }

        }));
        console.log(event.target.value)
    }

    handleSubmitcategory = async (event) => {
        event.preventDefault();
        const { tenLoai } = this.state.createcategorts;
        let errors = {};

        if (!tenLoai.trim()) errors.tenLoai = 'Tên loại sản phẩm không được để trống.';
        if (tenLoai.length > 30) errors.tenLoai = "Tên loại sản phẩm không được quá 30 ký tự.";


        // Sau khi trạng thái đã được cập nhật, gửi dữ liệu

        if (Object.keys(errors).length > 0) {
            this.setState({ errors });
            return;
        }
        try {
            const response = await axios.post('https://localhost:7078/api/Category', this.state.createcategorts);
            Swal.fire({
                title: 'Thành công!',
                text: 'Thêm mới loại sản phẩm thành công.',
                icon: 'success',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false
            });
            this.componentDidMount();
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
    handleSubmitcategorysize = async (event) => {
        event.preventDefault();
        const { tenKichThuoc } = this.state.createcategorysizes;
        let errors = {};

        if (!tenKichThuoc.trim()) errors.tenKichThuoc = 'Tên kích thước không được để trống.';
        if (tenKichThuoc.length > 30) errors.tenKichThuoc = "Tên kích thước không được quá 30 ký tự.";
        const specialCharPattern = /[^a-zA-Z0-9\s]/;
        if (specialCharPattern.test(tenKichThuoc)) errors.tenKichThuoc = 'Tên kích thước không được chứa ký tự đặc biệt.';

        if (Object.keys(errors).length > 0) {
            this.setState({ errors });
            return;
        }


        try {
            const response = await axios.post('https://localhost:7078/api/Category_Size', this.state.createcategorysizes);
            console.log("categorts uploaded successfully:", response.data);
            Swal.fire({
                title: 'Thành công!',
                text: 'Thêm mới kích thước thành công.',
                icon: 'success',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false
            });
            this.componentDidMount();
        } catch (error) {
            Swal.fire({
                title: 'Lỗi!',
                text: 'Có lỗi xảy ra khi thêm mới kích thước.',
                icon: 'error',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false
            });
        }

    }

    handleChangeType = (event) => {
        this.setState((x) => ({
            updateType: {
                ...x.updateType,
                tenLoai: event.target.value
            }
        }));
    }
    handleEdit = async (CategoryType) => {

        this.setState({ updateType: { ...CategoryType } });
    }
    handleUpdate = async (event) => {
        event.preventDefault();

        const { tenLoai } = this.state.updateType;
        let errors = {};

        if (!tenLoai.trim()) errors.tenLoai = 'Tên loại sản phẩm không được để trống.';
        if (tenLoai.length > 30) errors.tenLoai = "Tên loại sản phẩm không được quá 30 ký tự.";

        if (Object.keys(errors).length > 0) {
            this.setState({ errors });
            return;
        }

        try {
            let res = await axios.put(`https://localhost:7078/api/Category/${this.state.updateType.id}`, {
                tenLoai: this.state.updateType.tenLoai

            });
            if (res.status === 200 || res.status === 204) {
                Swal.fire({
                    title: 'Thành công!',
                    text: 'Thêm mới tên loại thành công.',
                    icon: 'success',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
                this.componentDidMount(); // Cập nhật lại dữ liệu khi component được gắn vào
            } else {
                Swal.fire({
                    title: 'Lỗi!',
                    text: 'Có lỗi xảy ra khi cập nhật tên loại.',
                    icon: 'error',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Lỗi!',
                text: 'Có lỗi xảy ra khi cập nhật tên loại.',
                icon: 'error',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false
            });
        }

    }

    handleChangeSize = (event) => {
        this.setState((x) => ({
            updateSize: {
                ...x.updateSize,
                tenKichThuoc: event.target.value
            }
        }));
    }
    handleEditSize = async (Categorysize) => {

        this.setState({ updateSize: { ...Categorysize } });
    }
    handleUpdateSize = async (event) => {
        event.preventDefault();

        const { tenKichThuoc } = this.state.updateSize;
        let errors = {};

        if (!tenKichThuoc.trim()) errors.tenKichThuoc = 'Tên kích thước không được để trống.';
        if (tenKichThuoc.length > 30) errors.tenKichThuoc = "Tên kích thước không được quá 30 ký tự";
        const specialCharPattern = /[^a-zA-Z0-9\s]/;
        if (specialCharPattern.test(tenKichThuoc)) errors.tenKichThuoc = 'Tên kích thước không được chứa ký tự đặc biệt.';

        if (Object.keys(errors).length > 0) {
            this.setState({ errors });
            return;
        }
        try {
            let res = await axios.put(`https://localhost:7078/api/Category_Size/${this.state.updateSize.id}`, {
                tenKichThuoc: this.state.updateSize.tenKichThuoc

            });
            if (res.status === 200 || res.status === 204) {
                Swal.fire({
                    title: 'Thành công!',
                    text: 'Cập nhật kích thước thành công.',
                    icon: 'success',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
                this.componentDidMount(); // Cập nhật lại dữ liệu khi component được gắn vào
            } else {
                Swal.fire({
                    title: 'Lỗi!',
                    text: 'Có lỗi xảy ra khi thêm mới kích thước.',
                    icon: 'error',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Lỗi!',
                text: 'Có lỗi xảy ra khi thêm mới kích thước.',
                icon: 'error',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false
            });
        }

    }

    handleChangeDelateType = (event) => {
        this.setState((x) => ({
            deleteType: {
                ...x.deleteType,
                tenLoai: event.target.value
            }
        }));
    }
    handleDatleteType = async (deletetype) => {

        this.setState({ deleteType: { ...deletetype } });
    }


    handleDeleteType = async (event) => {
        event.preventDefault();
        try {
            let res = await axios.delete(`https://localhost:7078/api/Category/${this.state.deleteType.id}`)
            if (res.status === 200 || res.status === 204) {
                Swal.fire({
                    title: 'Thành công!',
                    text: 'Thêm mới thành công.',
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

    handleChangeDelateSize = (event) => {
        this.setState((x) => ({
            deleteSize: {
                ...x.deleteSize,
                tenKichThuoc: event.target.value
            }
        }));
    }
    handleDatleteSize = async (deletesizes) => {

        this.setState({ deleteSize: { ...deletesizes } });
    }


    handleDeleteSize = async (event) => {
        event.preventDefault();
        try {
            let res = await axios.delete(`https://localhost:7078/api/Category_Size/${this.state.deleteSize.id}`)
            if (res.status === 200 || res.status === 204) {
                Swal.fire({
                    title: 'Thành công!',
                    text: 'Xóa thành công.',
                    icon: 'success',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
                this.componentDidMount(); // Cập nhật lại dữ liệu khi component được gắn vào
            } else {
                Swal.fire({
                    title: 'Lỗi!',
                    text: 'Có lỗi xảy ra khi xóa.',
                    icon: 'error',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Lỗi!',
                text: 'Có lỗi xảy ra khi xóa.',
                icon: 'error',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false
            });
        }

    }

    render() {
        let { Category, Categorysize, Categorycolor } = this.state;
        const { errors } = this.state;
        return (
            <>
                <div className="containers">
                    <div className="row contais">
                        <div className="col-md-4 o1">
                            <div className="PdType">
                                <div className="row pt">
                                    <div className="col-md-6">
                                        <h6>Loại </h6>
                                    </div>
                                    <div className="col-md-6">
                                        <Link to="" className="addpt" data-bs-toggle="modal" data-bs-target="#myModal-add"><FontAwesomeIcon icon={faPlus} /></Link>
                                    </div>
                                </div>

                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Mã loại</th>
                                            <th>Tên loại</th>
                                            <th></th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            Category && Category.length > 0 &&
                                            Category.map((item) => {
                                                return (
                                                    <tr key={item.id}>

                                                        <td>{item.id}</td>
                                                        <td>{item.tenLoai}</td>
                                                        <td>
                                                            <Link to="" className="editPT" data-bs-toggle="modal" data-bs-target="#myModal-update-Type"><FontAwesomeIcon icon={faPenToSquare} className="iconedit" onClick={() => this.handleEdit(item)} /></Link>
                                                            <Link to="" className="deletePT" data-bs-toggle="modal" data-bs-target="#myModal-delete-type" ><FontAwesomeIcon icon={faTrash} className="icondelete" onClick={() => this.handleDatleteType(item)} /></Link>
                                                        </td>

                                                    </tr>

                                                )
                                            })
                                        }

                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="col-md-4 o2">
                            <div className="Size">
                                <div className="row si">
                                    <div className="col-md-8">
                                        <h6>Kích thước</h6>
                                    </div>
                                    <div className="col-md-4">
                                        <Link to="" className="addsi" data-bs-toggle="modal" data-bs-target="#myModal-add-size"><FontAwesomeIcon icon={faPlus} /></Link>
                                    </div>
                                </div>
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Mã KT</th>
                                            <th>Tên KT</th>
                                            <th></th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            Categorysize && Categorysize.length > 0 &&
                                            Categorysize.map((item, index) => {
                                                return (
                                                    <tr key={item.id}>
                                                        <td>{item.id}</td>
                                                        <td>{item.tenKichThuoc}</td>
                                                        <td>
                                                            <Link className="editsize" data-bs-toggle="modal" data-bs-target="#myModal-update-size"> <FontAwesomeIcon icon={faPenToSquare} className="iconeditsize" onClick={() => this.handleEditSize(item)} /></Link>
                                                            <Link to="" className="deletesize" data-bs-toggle="modal" data-bs-target="#myModal-delete-size"> <FontAwesomeIcon icon={faTrash} className="icondeletesize" onClick={() => this.handleDatleteSize(item)} /></Link>
                                                        </td>

                                                    </tr>

                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="col-md-4 o3">
                            <div className="Color">
                                <div className="row co">
                                    <div className="col-md-6">
                                        <h6>Màu sắc</h6>
                                    </div>
                                    <div className="col-md-6">
                                    </div>
                                </div>
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Mã màu</th>
                                            <th>Tên màu</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {
                                            Categorycolor && Categorycolor.length > 0 &&
                                            Categorycolor.map((item, index) => {
                                                return (
                                                    <tr key={item.id}>
                                                        <td>{item.id}</td>
                                                        <td>{item.tenMauSac}</td>
                                                    </tr>

                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* form thêm */}
                    <div className="modal" id="myModal-add">
                        <div className="modal-dialog">
                            <div className="modal-content">


                                <div className="modal-header">
                                    <h4 className="modal-title">Thêm loại sản phẩm</h4>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                                </div>

                                <form onSubmit={this.handleSubmitcategory}>
                                    <div className="modal-body">

                                        <div className="mb-3 mt-3">
                                            <label>Tên Loại sản phẩm</label>
                                            <input type="text" value={this.state.createcategorts.tenLoai} onChange={(event) => this.handleChangecatagory(event)} className="form-control" />
                                            {errors.tenLoai && <div className="text-danger">{errors.tenLoai}</div>}
                                        </div>
                                        <div className="mb-3">

                                        </div>


                                    </div>


                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Hủy</button>
                                        <button onClick={(event) => this.handleSubmitcategory(event)} type="submit" className="btn btn-primary" >Thêm</button>

                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>

                    <div className="modal" id="myModal-add-size">
                        <div className="modal-dialog">
                            <div className="modal-content">


                                <div className="modal-header">
                                    <h4 className="modal-title">Thêm kích thước</h4>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                                </div>


                                <div className="modal-body">
                                    <form>
                                        <div className="mb-3 mt-3">
                                            <label>Tên kích thước</label>
                                            <input value={this.state.createcategorysizes.tenKichThuoc} onChange={(event) => this.handleChangecatagorysize(event)} className="form-control" />
                                            {errors.tenKichThuoc && <div className="text-danger">{errors.tenKichThuoc}</div>}
                                        </div>
                                        <div className="mb-3">

                                        </div>

                                    </form>
                                </div>


                                <div className="modal-footer">
                                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Hủy</button>
                                    <button type="button" onClick={(event) => this.handleSubmitcategorysize(event)} className="btn btn-primary">Thêm</button>

                                </div>

                            </div>
                        </div>
                    </div>

                    {/* form sửa */}

                    <div className="modal" id="myModal-update-Type">
                        <div className="modal-dialog">
                            <div className="modal-content">


                                <div className="modal-header">
                                    <h4 className="modal-title">Sửa loại</h4>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                                </div>


                                <div className="modal-body">
                                    <form>
                                        <div className="mb-3 mt-3">
                                            <label >Tên loại</label>
                                            <input value={this.state.updateType.tenLoai} onChange={(event) => this.handleChangeType(event)} className="form-control" />
                                            {errors.tenLoai && <div className="text-danger">{errors.tenLoai}</div>}
                                        </div>
                                        <div className="mb-3">

                                        </div>

                                    </form>
                                </div>


                                <div className="modal-footer">
                                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Hủy</button>
                                    <button type="button" onClick={(event) => this.handleUpdate(event)} className="btn btn-primary">Lưu</button>

                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="modal" id="myModal-update-size">
                        <div className="modal-dialog">
                            <div className="modal-content">


                                <div className="modal-header">
                                    <h4 className="modal-title">Sửa kích thước</h4>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                                </div>


                                <div className="modal-body">
                                    <form>
                                        <div className="mb-3 mt-3">
                                            <label >Tên kích thước</label>
                                            <input value={this.state.updateSize.tenKichThuoc} onChange={(event) => this.handleChangeSize(event)} className="form-control" />
                                            {errors.tenKichThuoc && <div className="text-danger">{errors.tenKichThuoc}</div>}
                                        </div>
                                        <div className="mb-3">

                                        </div>

                                    </form>
                                </div>


                                <div className="modal-footer">
                                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Hủy</button>
                                    <button type="button" onClick={(event) => this.handleUpdateSize(event)} className="btn btn-primary">Lưu</button>

                                </div>

                            </div>
                        </div>
                    </div>

                    {/* hàm xóa */}
                    <div className="modal" id="myModal-delete-type">
                        <div className="modal-dialog">
                            <div className="modal-content">



                                <div className="modal-body">
                                    <form>
                                        <div className="mb-3 mt-3">
                                            <h4 className="modal-title">Bạn có chắc muốn xóa loại này</h4>

                                        </div>
                                        <div className="mb-3">

                                        </div>

                                    </form>
                                </div>


                                <div className="modal-footer">
                                    <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Hủy</button>
                                    <button type="button" onClick={(event) => this.handleDeleteType(event)} className="btn btn-danger" data-bs-dismiss="modal">Xóa</button>

                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="modal" id="myModal-delete-size">
                        <div className="modal-dialog">
                            <div className="modal-content">



                                <div className="modal-body">
                                    <form>
                                        <div className="mb-3 mt-3">
                                            <h4 className="modal-title">Bạn có chắc muốn xóa kích thước này</h4>

                                        </div>
                                        <div className="mb-3">

                                        </div>

                                    </form>
                                </div>


                                <div className="modal-footer">
                                    <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Hủy</button>
                                    <button type="button" onClick={(event) => this.handleDeleteSize(event)} className="btn btn-danger" data-bs-dismiss="modal">Xóa</button>

                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </>
        )
    }
}
export default ADCategory;