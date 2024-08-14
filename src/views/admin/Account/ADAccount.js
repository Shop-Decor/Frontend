import React, { useState, useEffect, useRef } from 'react';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { imageDb } from "../../../services/config";
import '../../../styles/admin/ADAccount.scss';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ADAccount = () => {

    const [imgFile, setImgFile] = useState();
    const [imgPreview, setImgPreview] = useState();
    const [newUser, setNewUser] = useState({
        fullName: '',
        userName: '',
        password: '',
        confirmPassword: '',
        email: '',
        phoneNumber: '',
        address: '',
        link: ''
    });

    const [editUser, setEditUser] = useState({
        id: '',
        fullName: '',
        userName: '',
        email: '',
        phoneNumber: '',
        address: '',
        link: ''
    });

    const [state, setState] = useState({
        accounts: [],
        paging: {
            index: 1,
            size: 4,
            totalPage: 1,
        },
        searchKeyword: "",
    });

    const navigate = useNavigate();
    const [accounts, setAccounts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(null);
    const [errorMessage, setErrorMessage] = useState({
        fullName: '',
        userName: '',
        password: '',
        confirmPassword: '',
        email: '',
        phoneNumber: '',
        address: '',
        link: ''

    });
    const [deleteUser, setDeleteUser] = useState(null);
    const modalRef = useRef(null);
    const modalRefAdd = useRef(null);
    const modalRefDelete = useRef(null);

    useEffect(() => {
        const fetchAccounts = async () => {
            const token = localStorage.getItem('token');
           // console.log(token);
            if (token) {
                const user = jwtDecode(token);
                if (((Date.now() / 1000) - user.exp) > 0) {
                    navigate('/SignIn');
                } else {

                    try {
                        const response = await axios.get('https://localhost:7078/api/Account/Get', {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });

                        if (response.status === 200) {
                            const data = response.data;
                            const div = Math.ceil(data.list.length / state.paging.size);
                            setState({
                                ...state,
                                accounts: [...data.list],
                                paging: { ...state.paging, totalPage: div },
                            });
                            const accounts = [];
                            // get size of accounts from state
                            for (let i = state.paging.index * state.paging.size - state.paging.size; i < state.paging.index * state.paging.size; i++) {
                                if (i >= data.list.length) {
                                    break;
                                }
                                accounts.push(data.list[i]);
                            }
                           // console.log(accounts);
                           // console.log(data.list);
                            setAccounts(accounts);
                        } else if (response.status === 401) {
                            // Handle unauthorized status
                        }
                    } catch (error) {
                        console.error('Error fetching accounts:', error);
                        if (error.response && error.response.status === 401) {
                            return;
                        }
                    }
                }
            } else {
                return;
            }
        };

        fetchAccounts();
    }, [showModal]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewUser((prevNewUser) => ({
            ...prevNewUser,
            [name]: value,
        }));
    };

    const handleEditChange = (event) => {
        const { name, value } = event.target;
        setEditUser((prevEditUser) => ({
            ...prevEditUser,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const newU = { ...newUser };
        // kiểm tra tên người dùng chỉ chứa kí tự chữ
        let errors = {};
        // kiểm tra tên người dùng ít nhất 6 kí tự
        if (newU.userName.length < 6) {
            errors.userName = 'Tên tài khoản phải ít nhất 6 kí tự';
        }
        else if (newU.userName.length > 20) {
            errors.userName = 'Tên tài khoản tối đa 20 kí tự';
        }
        // kiểm tra tên người dùng chỉ chứa kí tự chữ và dấu cách

        if (/\d/.test(newU.fullName) || /[!@#$&*]/.test(newU.fullName)) {
            errors.fullName = 'Tên người dùng chỉ chứa kí tự chữ';
        }

        if (newU.fullName.length < 6) {
            errors.fullName = 'Tên người dùng phải ít nhất 6 kí tự';
        }
        else if (newU.fullName.length > 30) {
            errors.fullName = 'Tên người dùng tối đa 30 kí tự';
        }
        // Check phone number 10 kí tự
        if (!/^\d{10}$/.test(newU.phoneNumber) && newU.phoneNumber !== '') {
            errors.phoneNumber = 'SĐT không hợp lệ. Vui lòng nhập 10 chữ số.';
        }
        // Check password chứa 1 in hoa, 1 in thường, 1 số, 1 kí tự đặc biệt
        if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/.test(newU.password)) {
            errors.password = 'Mật khẩu phải chứa ít nhất 1 chữ số, 1 chữ cái viết thường, 1 chữ cái viết hoa và 1 kí tự đặc biệt';
        }
        // Check confirm password
        if (newU.password !== newU.confirmPassword) {
            errors.confirmPassword = 'Mật khẩu không khớp';
        }
        if (!imgFile) {
            errors.link = "Hình ảnh không để trống";
        }
        if (Object.keys(errors).length > 0) {
            setErrorMessage(errors);
            return false;
        } else {
            setErrorMessage({}); // Clear error messages if validation passes
        }

        try {
            // console.log("vô nè");
            if (imgFile) {
                const url = await uploadImage(imgFile);
                newUser.link = url;
            }
            const token = localStorage.getItem('token');
            const response = await axios.post('https://localhost:7078/api/Account/Create', newUser,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }

            );
            // window.location.reload();
            // //load lại trang
            // console.log("vô load lại roồi");
            if (response.data === true) {
                Swal.fire({
                    icon: 'success',
                    title: 'Thêm người dùng thành công',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                });
                // if (modalRefAdd.current) {

                //     modalRefAdd.current.classList.remove('show');
                //     modalRefAdd.current.setAttribute('aria-hidden', 'true');
                //     modalRefAdd.current.style.display = 'none';

                //     // Remove the backdrop and 'modal-open' class from the body
                //     document.body.classList.remove('modal-open');
                //     const backdrop = document.querySelector('.modal-backdrop');
                //     if (backdrop) {
                //         backdrop.remove();
                //     }
                // }
                //clear form
                cleanFromAdd();
            }

            if (response.data === 2001) {

                Swal.fire({
                    icon: 'warning',
                    title: 'Ôi Không',
                    text: 'Tên tài khoản đã tồn tại',
                });
            }
            if (response.data === 2002) {

                Swal.fire({
                    icon: 'warning',
                    title: 'Ôi Không',
                    text: 'Email đã tồn tại',
                });
            }
            //hide modal
            setShowModal(!showModal);

        } catch (error) {
            setError('Error adding user');
        }
    };

    const handleEditSubmit = async (event) => {
        event.preventDefault();
        const updatedUser = { ...editUser };
        let errors = {};



        // kiểm tra tên người dùng chỉ chứa kí tự chữ

        if (/\d/.test(updatedUser.fullName) || /[!@#$&*]/.test(updatedUser.fullName)) {
            errors.fullName = 'Tên người dùng chỉ chứa kí tự chữ';
        }
        // kiểm tra tên người dùng ít nhất 6 kí tự
        if (updatedUser.fullName.length < 6) {
            errors.fullName = 'Tên người dùng phải ít nhất 6 kí tự';
        }

        else if (updatedUser.fullName.length > 30) {
            errors.fullName = 'Tên người dùng tối đa 30 kí tự';
        }

        // Check phone number có dữ liệu và chỉ chứa 10 kí tự 
        if (!/^\d{10}$/.test(updatedUser.phoneNumber) && updatedUser.phoneNumber !== '') {
            errors.phoneNumber = 'SĐT không hợp lệ. Vui lòng nhập 10 chữ số.';
        }


        if (Object.keys(errors).length > 0) {
            setErrorMessage(errors);
            return false;
        } else {
            setErrorMessage({}); // Clear error messages if validation passes
        }

        try {
            if (imgFile) {
                const url = await uploadImage(imgFile);
                updatedUser.link = url;
            }
            const token = localStorage.getItem('token');
            const response = await axios.put(`https://localhost:7078/api/Account/${editUser.id}`, updatedUser, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },

            });
            // Close the modal
            if (response.data === true) {
                Swal.fire({
                    icon: 'success',
                    title: 'Sửa người dùng thành công',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                });
                //load lại trang
                setShowModal(!showModal);

                // if (modalRef.current) {

                //     modalRef.current.classList.remove('show');
                //     modalRef.current.setAttribute('aria-hidden', 'true');
                //     modalRef.current.style.display = 'none';

                //     // Remove the backdrop and 'modal-open' class from the body
                //     document.body.classList.remove('modal-open');
                //     const backdrop = document.querySelector('.modal-backdrop');
                //     if (backdrop) {
                //         backdrop.remove();
                //     }
                //     console.log("vô nè");
                // }

                const modalElement = document.getElementById('editUserModal'); // Replace 'yourModalId' with the actual ID of your modal
                // const modalInstance = new bootstrap.Modal(modalElement);
                // modalInstance.hide();

            }

            if (response.data === 2001) {

                Swal.fire({
                    icon: 'warning',
                    title: 'Ôi Không',
                    text: 'Tên tài khoản đã tồn tại',
                });
            }
            if (response.data === 2002) {

                Swal.fire({
                    icon: 'warning',
                    title: 'Ôi Không',
                    text: 'Email đã tồn tại',
                });
            }
        }
        catch (error) {
            setError('Error updating user');
        }
    };

    const handleEditClick = (account) => {
        setEditUser({ ...account });
    };


    // xóa người dùng
    const handleDeleteClick = (user) => {
        setDeleteUser(user);
        setShowModal(true); // Show the confirmation modal
    };

    // xác nhận xóa người dùng
    const handleDeleteSubmit = async () => {
        try {
           // console.log("ID nè",localStorage.getItem('userID'));
            //console.log(deleteUser.id);
            const token = localStorage.getItem('token');
            //console.log(`token 2: ${token}`);
            const user = jwtDecode(token);
            let userRole = user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
            //console.log(userRole);
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            const response = await axios.put(
                `https://localhost:7078/api/Account/Delete/${deleteUser.id}`, '', config
            );
            if (response.data === true) {
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Xóa người dùng thành công',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false,

                });
                if (localStorage.getItem('userID') === deleteUser.id) {
                    localStorage.clear();
                    navigate('/SignIn');
                }
                // if (modalRefDelete.current) {

                //     modalRefDelete.current.classList.remove('show');
                //     modalRefDelete.current.setAttribute('aria-hidden', 'true');
                //     modalRefDelete.current.style.display = 'none';

                //     // Remove the backdrop and 'modal-open' class from the body
                //     document.body.classList.remove('modal-open');
                //     const backdrop = document.querySelector('.modal-backdrop');
                //     if (backdrop) {
                //         backdrop.remove();
                //     }
                // }
                //tải lại trang 
                setShowModal(!showModal);

            }
            if(response.data === 2003){
                Swal.fire({
                    icon: 'warning',
                    title: 'Ôi Không',
                    text: 'Không thể xóa tài khoản của bạn',
                });
            }
            if(response.data === 2004){
                Swal.fire({
                    icon: 'warning',
                    title: 'Ôi Không',
                    text: 'Không tìm thấy tài khoản',
                });
            }
        } catch (error) {
            setError('Error deleting user');
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Xóa người dùng thất bại',
            });
        }
    };

    const handleChangeLink = (e) => {
        const file = e.target.files[0];
        if (file) {
            const filePreview = URL.createObjectURL(file);
            setImgFile(file);
            setImgPreview(filePreview);
        }
    }

    const uploadImage = async (file) => {
        const imgRef = ref(imageDb, `account/${v4()}`);
        const snapshot = await uploadBytes(imgRef, file);
        return await getDownloadURL(snapshot.ref);
    };

    const cleanFromAdd = () => {
        setNewUser({
            fullName: '',
            userName: '',
            password: '',
            confirmPassword: '',
            email: '',
            phoneNumber: '',
            address: '',
            link: ''
        });
        setImgFile(null);
        setImgPreview("");
    }



    const handlePageChange = (pageIndex) => {
        // Update the state with the new page index
        setState((prevState) => {
            const newState = {
                ...prevState,
                paging: { ...prevState.paging, index: pageIndex }
            };

            // Calculate the new accounts based on the updated state
            const accounts = [];
            const startIndex = newState.paging.index * newState.paging.size - newState.paging.size;
            const endIndex = newState.paging.index * newState.paging.size;

            for (let i = startIndex; i < endIndex; i++) {
                if (i >= newState.accounts.length) {
                    break;
                }
                accounts.push(newState.accounts[i]);
            }

            // Update the accounts state
            setAccounts(accounts);

            return newState;
        });
    };




    const handleLoadListAccount = async () => {
        const token = localStorage.getItem('token');
        try {
            const resUser = await axios.get(`https://localhost:7078/api/Account/Get`, {
                params: {
                    keyword: state.searchKeyword || "",
                    index: state.paging.index || 1,
                    size: state.paging.size || 16
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            const newPaging = resUser.data?.paging || state.paging;
            const newAccounts = resUser.data?.list || [];

            setState({
                ...state,
                accounts: newAccounts,
                paging: newPaging,
            });
            const accounts = [];
            // get size of accounts from state
            for (let i = newPaging.index * newPaging.size - newPaging.size; i < newPaging.index * newPaging.size; i++) {
                if (i >= newAccounts.length) {
                    break;
                }
                accounts.push(newAccounts[i]);
            }
            setAccounts(accounts);
        } catch (error) {
            console.error("Error fetching accounts", error);
            // Optionally, handle the error (e.g., show a message to the user)
        }
    }

    const getPaginationItems = () => {
        const paginationItems = [];
        const { index, totalPage } = state.paging;

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





    return (
        <>
            <div className="account-list container">
                <div className="content-container">
                    <h2>Người Dùng <FontAwesomeIcon icon={faUser} /></h2>
                    <div className='row'>
                        <button
                            type="button"
                            className="btn btn-primary mb-3 col-3"
                            data-bs-toggle="modal"
                            data-bs-target="#addUserModal"
                            onClick={() => cleanFromAdd()}
                        >
                            Thêm Người Dùng
                        </button>
                        <div className='col-7 ms-auto'>
                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Tìm kiếm..."
                                    value={state.searchKeyword}
                                    onChange={(e) => setState({ ...state, searchKeyword: e.target.value })}
                                />
                                <button className="btn btn-primary" onClick={handleLoadListAccount}>
                                    Tìm kiếm
                                </button>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}

                    <table className="table">
                        <thead>
                            <tr>
                                <th>Hình ảnh</th>
                                <th>Tên tài khoản</th>
                                <th>Tên người dùng</th>
                                <th>Email</th>
                                <th>SĐT</th>
                                <th>Địa chỉ</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(accounts) && accounts.length > 0 ? (
                                accounts.map((account) => (
                                    <tr key={account.id}>
                                        <td>
                                            <img className="img-ad-account" src={account.link} alt={account.id} />
                                        </td>
                                        <td>{account.userName}</td>
                                        <td>{account.fullName}</td>
                                        <td>{account.email}</td>
                                        <td>{account.phoneNumber}</td>
                                        <td>{account.address}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm m-2 btn-primary"
                                                type="button"
                                                data-bs-toggle="modal"
                                                data-bs-target="#editUserModal"
                                                onClick={() => handleEditClick(account)}
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                type="button"
                                                data-bs-toggle="modal"
                                                data-bs-target="#deleteUserModal"
                                                onClick={() => handleDeleteClick(account)}
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center">No accounts available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <nav className='pb-5'>
                    <ul className="pagination">
                        <li className="page-item">
                            <a className="page-link" href="#" aria-label="Previous" onClick={() => handlePageChange(state.paging.index - 1)}>
                                <span aria-hidden="true">&laquo;</span>
                            </a>
                        </li>
                        {getPaginationItems().map((page, index) =>
                            page === '...' ? (
                                <li key={index} className="page-item disabled">
                                    <span className="page-link">...</span>
                                </li>
                            ) : (
                                <li
                                    key={index}
                                    className={`page-item ${state.paging.index === page ? 'active' : ''}`}
                                >
                                    <a className="page-link" onClick={() => handlePageChange(page)}>
                                        {page}
                                    </a>
                                </li>
                            )
                        )}
                        <li className="page-item">
                            <a className="page-link" href="#" aria-label="Next" onClick={() => handlePageChange(state.paging.index + 1)}>
                                <span aria-hidden="true">&raquo;</span>
                            </a>
                        </li>
                    </ul>
                </nav>

                {/* Modal thêm người dùng */}
                <div className="modal fade" id="addUserModal" aria-labelledby="addUserModalLabel" aria-hidden="true" ref={modalRefAdd}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="addUserModalLabel">Thêm Người Dùng Mới</h1>
                                <button className="btn-close" data-bs-dismiss="modal"  ></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row mb-3">
                                        <label className="col-sm-3 col-form-label">Tên Tài Khoản *:</label>
                                        <div className="col-sm-9">
                                            <input
                                                type="text"
                                                value={newUser.userName}
                                                onChange={handleChange}
                                                className={`form-control ${errorMessage.userName ? 'is-invalid' : ''}`}
                                                name="userName"
                                                required
                                            />
                                            {errorMessage.userName && (
                                                <div className="invalid-feedback">
                                                    {errorMessage.userName}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-3 col-form-label">Mật khẩu *:</label>
                                        <div className="col-sm-9">
                                            <input
                                                type="password"
                                                value={newUser.password}
                                                onChange={handleChange}
                                                className={`form-control ${errorMessage.password ? 'is-invalid' : ''}`}
                                                name="password"
                                                required
                                            />
                                            {errorMessage.password && (
                                                <div className="invalid-feedback">
                                                    {errorMessage.password}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-3 col-form-label">Xác Nhận MK *:</label>
                                        <div className="col-sm-9">
                                            <input
                                                type="password"
                                                value={newUser.confirmPassword}
                                                onChange={handleChange}
                                                className={`form-control ${errorMessage.confirmPassword ? 'is-invalid' : ''}`}
                                                name="confirmPassword"
                                                required
                                            />
                                            {errorMessage.confirmPassword && (
                                                <div className="invalid-feedback">
                                                    {errorMessage.confirmPassword}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-3 col-form-label">Tên Người Dùng *:</label>
                                        <div className="col-sm-9">
                                            <input
                                                type="text"
                                                value={newUser.fullName}
                                                onChange={handleChange}
                                                className={`form-control ${errorMessage.fullName ? 'is-invalid' : ''}`}
                                                name="fullName"
                                                required
                                            />
                                            {errorMessage.fullName && (
                                                <div className="invalid-feedback">
                                                    {errorMessage.fullName}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-3 col-form-label">Email *:</label>
                                        <div className="col-sm-9">
                                            <input
                                                type="email"
                                                value={newUser.email}
                                                onChange={handleChange}
                                                className="form-control"
                                                name="email"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-3 col-form-label">SĐT:</label>
                                        <div className="col-sm-9">
                                            <input
                                                type="tel"
                                                value={newUser.phoneNumber}
                                                onChange={handleChange}
                                                className={`form-control ${errorMessage.phoneNumber ? 'is-invalid' : ''}`}
                                                name="phoneNumber"
                                            // required
                                            />
                                            {errorMessage.phoneNumber && (
                                                <div className="invalid-feedback">
                                                    {errorMessage.phoneNumber}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-3 col-form-label">Địa chỉ:</label>
                                        <div className="col-sm-9">
                                            <input
                                                type="text"
                                                value={newUser.address}
                                                onChange={handleChange}
                                                className={`form-control ${errorMessage.address ? 'is-invalid' : ''}`}
                                                name="address"
                                            // required
                                            />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-3 col-form-label">Hình ảnh:</label>
                                        <div className="col-sm-9">
                                            <input type="file" className={`form-control ${errorMessage.link ? 'is-invalid' : ''}`} accept="image/*" onChange={handleChangeLink} />
                                            {errorMessage.link && (
                                                <div className="invalid-feedback">
                                                    {errorMessage.link}
                                                </div>
                                            )}
                                        </div>
                                        <div className="img-preview mt-3">
                                            {imgPreview && (
                                                <img src={imgPreview} width="200px" alt="uploaded" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                        <button type="submit" className="btn btn-primary">Thêm</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal sửa người dùng */}
                <div className="modal fade" id="editUserModal" aria-labelledby="editUserModalLabel" aria-hidden="true" ref={modalRef}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="editUserModalLabel">Sửa Người Dùng</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleEditSubmit}>
                                    <div className="row mb-3">
                                        <label className="col-sm-3 col-form-label">Tên Tài Khoản:</label>
                                        <div className="col-sm-9">
                                            <input
                                                type="text"
                                                value={editUser.userName}
                                                onChange={handleEditChange}
                                                className="form-control"
                                                name="userName"
                                                required
                                                disabled
                                            />

                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-3 col-form-label">Tên Người Dùng:</label>
                                        <div className="col-sm-9">
                                            <input
                                                type="text"
                                                value={editUser.fullName}
                                                onChange={handleEditChange}
                                                className={`form-control ${errorMessage.fullName ? 'is-invalid' : ''}`}
                                                name="fullName"
                                                required
                                            />
                                            {errorMessage.fullName && (
                                                <div className="invalid-feedback">
                                                    {errorMessage.fullName}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-3 col-form-label">Email:</label>
                                        <div className="col-sm-9">
                                            <input
                                                type="email"
                                                value={editUser.email}
                                                onChange={handleEditChange}
                                                className="form-control"
                                                name="email"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-3 col-form-label">SĐT:</label>
                                        <div className="col-sm-9">
                                            <input
                                                type="tel"
                                                value={editUser.phoneNumber}
                                                onChange={handleEditChange}
                                                className={`form-control ${errorMessage.phoneNumber ? 'is-invalid' : ''}`}
                                                name="phoneNumber"
                                            // required
                                            />
                                            {errorMessage.phoneNumber && (
                                                <div className="invalid-feedback">
                                                    {errorMessage.phoneNumber}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-3 col-form-label">Địa chỉ:</label>
                                        <div className="col-sm-9">
                                            <input
                                                type="text"
                                                value={editUser.address}
                                                onChange={handleEditChange}
                                                className="form-control"
                                                name="address"
                                            // required
                                            />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-3 col-form-label">Hình ảnh:</label>
                                        <div className="col-sm-9">
                                            <input type="file" className="form-control" accept="image/*" onChange={handleChangeLink} />
                                            {errorMessage.link && (
                                                <div className="invalid-feedback">
                                                    {errorMessage.link}
                                                </div>
                                            )}
                                        </div>
                                        <div className="img-preview mt-3">
                                            {imgPreview && (
                                                <img src={imgPreview} width="200px" alt="uploaded" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                        <button type="submit" className="btn btn-primary"  >Cập Nhật</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Modal xóa người dùng */}
                <div className="modal fade" id="deleteUserModal" aria-labelledby="deleteUserModalLabel" aria-hidden="true" ref={modalRefDelete}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="deleteUserModalLabel">Xóa Người Dùng</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <p>Bạn có chắc chắn muốn xóa người dùng này không?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={handleDeleteSubmit}>Xóa</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ADAccount;
