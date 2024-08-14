import React from "react";
import { jwtDecode } from "jwt-decode";

class AccessTo extends React.Component {

    render() {
        const Accessback = () => {
            console.log("Quay lại");
            let token = localStorage.getItem('token');
            if (!token) {
                console.log("Quay lại user");
                window.location.href = '/';
            }
            let user = jwtDecode(token);
            const role = user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
            if (role === 'Admin') {
                console.log("Quay lại admin");
                window.location.href = '/admin';
            }
            if (role === 'User') {
                console.log("Quay lại user");
                window.location.href = '/';
            }
            console.log("Quay lại signin");
        }
        return (
            <>
                <div className="App">
                    <header className="App-header" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20vh' }}>
                        Không thể truy Cập
                    </header>
                    <div className="App-body" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img src='404.jpg' alt="Không thể truy cập" style={{ width: '50vw', height: '40vh' }} />
                    </div>
                    <div className="App-body" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                        <p>
                            Bạn không có quyền truy cập trang này
                        </p>
                    </div>
                    <div className="App-footer" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                        <button className="btn btn-primary" onClick={() => Accessback()}>Quay lại</button>
                    </div>
                </div>


            </>
        );
    }
}
export default AccessTo;