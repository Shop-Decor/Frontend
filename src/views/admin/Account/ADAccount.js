import React, { Component } from 'react';
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

class ADAccount extends Component {
    state = {
        accounts: [],
        error: null,
        newUser: {
            userName: '',
            password: '',
            confirmPassword: '',  // Thêm trường này
            fullName: '',
            email: '',
            phoneNumber: '',
            address: ''
        },
        showModal: false
    };

    async componentDidMount() {
        this.fetchAccounts();
    }

    fetchAccounts = async () => {
        try {
            let res = await axios.get('https://localhost:7078/api/Account/Get');
            const accounts = res.data || [];
            this.setState({ accounts });
        } catch (error) {
            console.error('Error fetching accounts:', error);
            this.setState({ error });
        }
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState(prevState => ({
            newUser: {
                ...prevState.newUser,
                [name]: value
            }
        }));
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        const { newUser } = this.state;

        console.log('Submitting data:', newUser); // Log dữ liệu

        try {
            await axios.post('https://localhost:7078/api/Account/Create', newUser);
            this.setState({ showModal: false });
            this.fetchAccounts();  // Refresh the list
        } catch (error) {
            console.error('Error adding user:', error.response ? error.response.data : error.message);
            this.setState({
                error: error.response ? JSON.stringify(error.response.data) : error.message
            });
        }
    }

    render() {
        const { accounts, error, newUser } = this.state;

        return (
            <div className="account-list container">
                <h1>Người Dùng <FontAwesomeIcon icon={faUser} /></h1>
                <button
                    type="button"
                    className="btn btn-primary mb-3"
                    data-bs-toggle="modal"
                    data-bs-target="#addUserModal"
                >
                    Thêm Người Dùng
                </button>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                <table className="table">
                    <thead>
                        <tr>
                            <th>Tên tài khoản</th>
                            <th>Tên người dùng</th>
                            <th>Email</th>
                            <th>Số điện thoại</th>
                            <th>Địa chỉ</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.map(account => (
                            <tr key={account.id}>
                                <td>{account.userName}</td>
                                <td>{account.fullName}</td>
                                <td>{account.email}</td>
                                <td>{account.phoneNumber}</td>
                                <td>{account.address}</td>
                                <td>
                                    <button className='btn btn-sm m-2 btn-primary'>Sửa</button>
                                    <button className='btn btn-sm btn-danger'>Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Modal thêm người dùng */}
                <div className="modal fade" id="addUserModal" aria-labelledby="addUserModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="addUserModalLabel">Thêm Người Dùng Mới</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={this.handleSubmit}>
                                    <div className="row mb-3">
                                        <label className="col-sm-3 col-form-label">Tên Tài Khoản:</label>
                                        <div className="col-sm-9">
                                            <input
                                                type="text"
                                                value={newUser.userName}
                                                onChange={this.handleChange}
                                                className="form-control"
                                                name="userName"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-3 col-form-label">Mật khẩu:</label>
                                        <div className="col-sm-9">
                                            <input
                                                type="password"
                                                value={newUser.password}
                                                onChange={this.handleChange}
                                                className="form-control"
                                                name="password"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-3 col-form-label">Xác nhận Mật khẩu:</label>
                                        <div className="col-sm-9">
                                            <input
                                                type="password"
                                                value={newUser.confirmPassword}
                                                onChange={this.handleChange}
                                                className="form-control"
                                                name="confirmPassword"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-3 col-form-label">Tên Người Dùng:</label>
                                        <div className="col-sm-9">
                                            <input
                                                type="text"
                                                value={newUser.fullName}
                                                onChange={this.handleChange}
                                                className="form-control"
                                                name="fullName"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-3 col-form-label">Email:</label>
                                        <div className="col-sm-9">
                                            <input
                                                type="email"
                                                value={newUser.email}
                                                onChange={this.handleChange}
                                                className="form-control"
                                                name="email"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-3 col-form-label">Số Điện Thoại:</label>
                                        <div className="col-sm-9">
                                            <input
                                                type="tel"
                                                value={newUser.phoneNumber}
                                                onChange={this.handleChange}
                                                className="form-control"
                                                name="phoneNumber"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-3 col-form-label">Địa Chỉ:</label>
                                        <div className="col-sm-9">
                                            <input
                                                type="text"
                                                value={newUser.address}
                                                onChange={this.handleChange}
                                                className="form-control"
                                                name="address"
                                                required
                                            />
                                        </div>
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
            </div>
        );
    }
}

export default ADAccount;
