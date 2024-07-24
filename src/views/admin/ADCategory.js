import React from "react";
import '../../styles/admin/ADCategory.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, Outlet } from "react-router-dom";
import {
    faPenToSquare,
    faPlus,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {

    faFacebook
} from "@fortawesome/free-brands-svg-icons";
import axios from "axios";
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
            id:''
        },
        updateSize: {
            tenKichThuoc: '',
            id:''
        },
        updateColor: {
            tenMauSac: '',
            id:''
        },

        deleteType:{
            tenLoai: '',
            id:''
        },

        deleteSize:{
            tenKichThuoc: '',
            id:''
        },

        deleteColor:{
            tenMauSac: '',
            id:''
        },

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
    handleChangecatagorycolor = (event) => {
        this.setState((x) => ({
            createcategorycolors: {
                ...x.createcategorycolors,
                tenMauSac: event.target.value

            }

        }));
        console.log(event.target.value)
    }
    handleClickcategory = async () => {

        this.setState(prevState => ({

            createcategorts: {
                ...prevState.createcategorts

            }
        }), async () => {
            // Sau khi trạng thái đã được cập nhật, gửi dữ liệu
            console.log('Product before POST:', this.state.createcategorts);

            try {
                const response = await axios.post('https://localhost:7078/api/Category', this.state.createcategorts);
                console.log("categorts uploaded successfully:", response.data);
                alert('Thêm loại sản phẩm thành công');
                this.componentDidMount();
            } catch (error) {
                console.error("There was an error uploading the categorts!", error);
            }
        });
    }
    handleClickcategorysize = async () => {

        this.setState(prevState => ({

            createcategorysizes: {
                ...prevState.createcategorysizes

            }
        }), async () => {
            // Sau khi trạng thái đã được cập nhật, gửi dữ liệu
            console.log('Product before POST:', this.state.createcategorysizes);

            try {
                const response = await axios.post('https://localhost:7078/api/Category_Size', this.state.createcategorysizes);
                console.log("categorts uploaded successfully:", response.data);
                alert('Thêm Kích thước thành công');
                this.componentDidMount();
            } catch (error) {
                console.error("There was an error uploading the categorts!", error);
            }
        });
    }
    handleClickcategorycolor = async () => {

        this.setState(prevState => ({

            createcategorycolors: {
                ...prevState.createcategorycolors

            }
        }), async () => {
            // Sau khi trạng thái đã được cập nhật, gửi dữ liệu
            console.log('Product before POST:', this.state.createcategorycolors);

            try {
                const response = await axios.post('https://localhost:7078/api/CategoryColor', this.state.createcategorycolors);
                console.log("categorts uploaded successfully:", response.data);
                alert('Thêm màu sắc thành công');
                this.componentDidMount();
            } catch (error) {
                console.error("There was an error uploading the categorts!", error);
            }
        });
    }

    handleSubmitcategory = async (event) => {
        event.preventDefault();
        await this.handleClickcategory();
    }
    handleSubmitcategorysize = async (event) => {
        event.preventDefault();
        await this.handleClickcategorysize();

    }
    handleSubmitcategorycolor = async (event) => {
        event.preventDefault();
        await this.handleClickcategorycolor();
    }


    //hàm sửa..

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
        try {
            let res = await axios.put(`https://localhost:7078/api/Category/${this.state.updateType.id}`, {
                tenLoai: this.state.updateType.tenLoai
               
            });
            if (res.status === 200 || res.status === 204) {
                alert('Cập nhật thành công');
                this.componentDidMount(); // Cập nhật lại dữ liệu khi component được gắn vào
            } else {
                alert('Cập nhật Loại sản phẩm không thành công');
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật Loại:', error);
            alert('Có lỗi xảy ra khi cập nhật', error);
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
        try {
            let res = await axios.put(`https://localhost:7078/api/Category_Size/${this.state.updateSize.id}`, {
                tenKichThuoc: this.state.updateSize.tenKichThuoc
               
            });
            if (res.status === 200 || res.status === 204) {
                alert('Cập nhật thành công');
                this.componentDidMount(); // Cập nhật lại dữ liệu khi component được gắn vào
            } else {
                alert('Cập nhật kích thước không thành công');
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật Loại:', error);
            alert('Có lỗi xảy ra khi cập nhật', error);
        }

    }

    handleChangeColor = (event) => {
        this.setState((x) => ({
            updateColor: {
                ...x.updateColor,
                tenMauSac: event.target.value
            }
        }));
    }
    handleEditColor = async (Categorycolor) => {

        this.setState({ updateColor: { ...Categorycolor } });
    }
    handleUpdateColor = async (event) => {
        event.preventDefault();
        try {
            let res = await axios.put(`https://localhost:7078/api/CategoryColor/${this.state.updateColor.id}`, {
                tenMauSac: this.state.updateColor.tenMauSac
               
            });
            if (res.status === 200 || res.status === 204) {
                alert('Cập nhật màu sắc thành công');
                this.componentDidMount(); // Cập nhật lại dữ liệu khi component được gắn vào
            } else {
                alert('Cập nhật không thành công');
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật Loại:', error);
            alert('Có lỗi xảy ra khi cập nhật', error);
        }

    }
 //hàm xóa
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
                alert('xóa thành công');
                this.componentDidMount(); // Cập nhật lại dữ liệu khi component được gắn vào
            } else {
                alert('Xóa không thành công');
            }
        } catch (error) {
            console.error('Lỗi khi xóa Loại:', error);
            alert('Có lỗi xảy ra khi xóa', error);
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
                alert('xóa thành công');
                this.componentDidMount(); // Cập nhật lại dữ liệu khi component được gắn vào
            } else {
                alert('Xóa không thành công');
            }
        } catch (error) {
            console.error('Lỗi khi xóa:', error);
            alert('Có lỗi xảy ra khi xóa', error);
        }

    }

    handleChangeDelateColor = (event) => {
        this.setState((x) => ({
            deleteColor: {
                ...x.deleteColor,
                tenMauSac: event.target.value
            }
        }));
    }
    handleDatleteColor = async (deletecolor) => {

        this.setState({ deleteColor: { ...deletecolor } });
    }

   
    handleDeleteColor = async (event) => {
        event.preventDefault();
        try {
            let res = await axios.delete(`https://localhost:7078/api/CategoryColor/${this.state.deleteColor.id}`)
            if (res.status === 200 || res.status === 204) {
                alert('xóa thành công');
                this.componentDidMount(); // Cập nhật lại dữ liệu khi component được gắn vào
            } else {
                alert('Xóa không thành công');
            }
        } catch (error) {
            console.error('Lỗi khi xóa :', error);
            alert('Có lỗi xảy ra khi xóa', error);
        }

    }

    render() {
        let { Category, Categorysize, Categorycolor } = this.state;
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
                                                            <Link to="" className="editPT" data-bs-toggle="modal" data-bs-target="#myModal-update-Type"><FontAwesomeIcon icon={faPenToSquare} className="iconedit" onClick={() => this.handleEdit(item)}/></Link>
                                                            <Link to="" className="deletePT" data-bs-toggle="modal" data-bs-target="#myModal-delete-type" ><FontAwesomeIcon icon={faTrash} className="icondelete" onClick={() => this.handleDatleteType(item)}/></Link>
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
                                                            <Link to="" className="deletesize" data-bs-toggle="modal" data-bs-target="#myModal-delete-size"> <FontAwesomeIcon icon={faTrash} className="icondeletesize" onClick={() => this.handleDatleteSize(item)}/></Link>
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
                                        {/* <Link to="" className="addcl" data-bs-toggle="modal" data-bs-target="#myModal-add-color"><FontAwesomeIcon icon={faPlus} /></Link> */}
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
                                                        <td>
                                                            {/* <Link className="editcolor" data-bs-toggle="modal" data-bs-target="#myModal-update-color"><FontAwesomeIcon icon={faPenToSquare} className="iconeditcolor" onClick={() => this.handleEditColor(item)}/></Link> */}
                                                            {/* <Link to="" className="deletecolor" data-bs-toggle="modal" data-bs-target="#myModal-delete-color"><FontAwesomeIcon icon={faTrash} className="icondeletecolor" onClick={() => this.handleDatleteColor(item)}/></Link> */}
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

                    {/* form thêm */}
                    <div className="modal" id="myModal-add">
                        <div className="modal-dialog">
                            <div className="modal-content">


                                <div className="modal-header">
                                    <h4 className="modal-title">Thêm loại sản phẩm</h4>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                                </div>


                                <div className="modal-body">
                                    <form>
                                        <div className="mb-3 mt-3">
                                            <label>Tên Loại sản phẩm</label>
                                            <input type="text" value={this.state.createcategorts.tenLoai} onChange={(event) => this.handleChangecatagory(event)} className="form-control" />
                                        </div>
                                        <div className="mb-3">

                                        </div>

                                    </form>
                                </div>


                                <div className="modal-footer">
                                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Hủy</button>
                                    <button onClick={(event) => this.handleSubmitcategory(event)} type="button" className="btn btn-primary" data-bs-dismiss="modal">Thêm</button>

                                </div>

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
                                        </div>
                                        <div className="mb-3">

                                        </div>

                                    </form>
                                </div>


                                <div className="modal-footer">
                                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Hủy</button>
                                    <button type="button" onClick={(event) => this.handleSubmitcategorysize(event)} className="btn btn-primary" data-bs-dismiss="modal">Thêm</button>

                                </div>

                            </div>
                        </div>
                    </div>

                    {/* <div className="modal" id="myModal-add-color">
                        <div className="modal-dialog">
                            <div className="modal-content">


                                <div className="modal-header">
                                    <h4 className="modal-title">Thêm màu sắc</h4>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                                </div>


                                <div className="modal-body">
                                    <form>
                                        <div className="mb-3 mt-3">
                                            <label >Tên màu sắc</label>
                                            <input value={this.state.createcategorycolors.tenMauSac} onChange={(event) => this.handleChangecatagorycolor(event)} className="form-control" />
                                        </div>
                                        <div className="mb-3">

                                        </div>

                                    </form>
                                </div>


                                <div className="modal-footer">
                                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Hủy</button>
                                    <button type="button" onClick={(event) => this.handleSubmitcategorycolor(event)} className="btn btn-primary" data-bs-dismiss="modal">Thêm</button>

                                </div>

                            </div>
                        </div>
                    </div> */}

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
                                        </div>
                                        <div className="mb-3">

                                        </div>

                                    </form>
                                </div>


                                <div className="modal-footer">
                                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Hủy</button>
                                    <button type="button" onClick={(event) => this.handleUpdate(event)} className="btn btn-primary" data-bs-dismiss="modal">Lưu</button>

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
                                        </div>
                                        <div className="mb-3">

                                        </div>

                                    </form>
                                </div>


                                <div className="modal-footer">
                                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Hủy</button>
                                    <button type="button" onClick={(event) => this.handleUpdateSize(event)} className="btn btn-primary" data-bs-dismiss="modal">Lưu</button>

                                </div>

                            </div>
                        </div>
                    </div>

                    {/* <div className="modal" id="myModal-update-color">
                        <div className="modal-dialog">
                            <div className="modal-content">


                                <div className="modal-header">
                                    <h4 className="modal-title">Sửa màu sắc</h4>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                                </div>


                                <div className="modal-body">
                                    <form>
                                        <div className="mb-3 mt-3">
                                            <label >Tên Màu sắc</label>
                                            <input value={this.state.updateColor.tenMauSac} onChange={(event) => this.handleChangeColor(event)} className="form-control" />
                                        </div>
                                        <div className="mb-3">

                                        </div>

                                    </form>
                                </div>


                                <div className="modal-footer">
                                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Hủy</button>
                                    <button type="button" onClick={(event) => this.handleUpdateColor(event)} className="btn btn-primary" data-bs-dismiss="modal">Lưu</button>

                                </div>

                            </div>
                        </div>
                    </div> */}

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

                    {/* <div className="modal" id="myModal-delete-color">
                        <div className="modal-dialog">
                            <div className="modal-content">



                                <div className="modal-body">
                                    <form>
                                        <div className="mb-3 mt-3">
                                            <h4 className="modal-title">Bạn có chắc muốn xóa màu sắc này:</h4>
                                            
                                        </div>
                                        <div className="mb-3">

                                        </div>

                                    </form>
                                </div>


                                <div className="modal-footer">
                                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Hủy</button>
                                    <button type="button" onClick={(event) => this.handleDeleteColor(event)} className="btn btn-primary" data-bs-dismiss="modal">Xóa</button>

                                </div>

                            </div>
                        </div>
                    </div> */}
                </div>
            </>
        )
    }
}
export default ADCategory;