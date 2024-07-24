import React from 'react';
import axios from "axios";

class ADAddAccount extends React.Component {
    state = {
        newUser: {
            userName: '',
            password: '',
            fullName: '',
            email: '',
            phoneNumber: '',
            address: ''
        },
        error: null
    };

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState(prevState => ({
            newUser: {
                ...prevState.newUser,
                [name]: value
            }
        }));
    }

    handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Handle file upload here, if necessary
            console.log('Selected file:', file);
        }
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        const { newUser } = this.state;

        // Validate form data
        if (!newUser.userName || !newUser.password || !newUser.fullName || !newUser.email || !newUser.phoneNumber || !newUser.address) {
            this.setState({ error: { message: 'Vui lòng điền đầy đủ thông tin.' } });
            return;
        }

        try {
            
        console.log('Submitting data:', newUser);
            await axios.post('https://localhost:7078/api/Account/Create', newUser);
            this.setState({ error: null });
            // Close the modal after submission
            const modal = document.getElementById('exampleModal');
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();
            // Optionally, trigger a callback or refresh the parent component
            if (this.props.onAdd) this.props.onAdd();
        } catch (error) {
            console.error('Error adding user:', error);
            this.setState({ error });
        }
    }

    render() {
        const { newUser, error } = this.state;

        return (
            <>
                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Thêm Người Dùng Mới</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={this.handleSubmit}>
                                    <div className="row mb-3">
                                        <label className="col-sm-4 col-form-label">Tên Tài Khoản:</label>
                                        <div className="col-sm-8">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="userName"
                                                value={newUser.userName}
                                                onChange={this.handleChange}
                                                required
                                            />
                                            {error && !newUser.userName && <span className="text-danger">Vui lòng nhập tên tài khoản.</span>}
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <label className="col-sm-4 col-form-label">Mật Khẩu:</label>
                                        <div className="col-sm-8">
                                            <input
                                                type="password"
                                                className="form-control"
                                                name="password"
                                                value={newUser.password}
                                                onChange={this.handleChange}
                                                required
                                            />
                                            {error && !newUser.password && <span className="text-danger">Vui lòng nhập mật khẩu.</span>}
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <label className="col-sm-4 col-form-label">Tên Người Dùng:</label>
                                        <div className="col-sm-8">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="fullName"
                                                value={newUser.fullName}
                                                onChange={this.handleChange}
                                                required
                                            />
                                            {error && !newUser.fullName && <span className="text-danger">Vui lòng nhập tên người dùng.</span>}
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <label className="col-sm-4 col-form-label">Email:</label>
                                        <div className="col-sm-8">
                                            <input
                                                type="email"
                                                className="form-control"
                                                name="email"
                                                value={newUser.email}
                                                onChange={this.handleChange}
                                                required
                                            />
                                            {error && !newUser.email && <span className="text-danger">Vui lòng nhập email hợp lệ.</span>}
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <label className="col-sm-4 col-form-label">Số Điện Thoại:</label>
                                        <div className="col-sm-8">
                                            <input
                                                type="tel"
                                                className="form-control"
                                                name="phoneNumber"
                                                value={newUser.phoneNumber}
                                                onChange={this.handleChange}
                                                required
                                            />
                                            {error && !newUser.phoneNumber && <span className="text-danger">Vui lòng nhập số điện thoại.</span>}
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <label className="col-sm-4 col-form-label">Địa Chỉ:</label>
                                        <div className="col-sm-8">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="address"
                                                value={newUser.address}
                                                onChange={this.handleChange}
                                                required
                                            />
                                            {error && !newUser.address && <span className="text-danger">Vui lòng nhập địa chỉ.</span>}
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <label className="col-sm-4 col-form-label">Ảnh:</label>
                                        <div className="col-sm-8">
                                            <input
                                                type="file"
                                                className="form-control"
                                                name="file"
                                                onChange={this.handleFileChange}
                                            />
                                        </div>
                                    </div>

                                    {error && <div className="alert alert-danger">{error.message}</div>}
                                    
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                                        <button type="submit" className="btn btn-primary">Lưu</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default ADAddAccount;
