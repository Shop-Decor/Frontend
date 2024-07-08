import '../../styles/admin/ADhome.scss';

function ADhome() {
    return (
        <div className="web-body">
            <div className="container-fluid admin-board">
                <div className="row">
                    <div className="col-sm-2 menu-bar p-0">
                        <div className="logo mb-3">
                            <img src="#" className="img-fluid" alt="Alternate Text" />
                        </div>
                        <ul className="menu">
                            <li className="small-cap">Trang chủ</li>
                            <li className="menu-item" id="statistical">Thống kê</li>
                            <li className="small-cap">Quản lý</li>
                            <li className="menu-item" id="song">Quản lý bài hát</li>
                            <li className="menu-item" id="account">Quản lý tài khoản</li>
                            <li className="menu-item" id="singer">Quản lý ca sĩ</li>
                            <li className="menu-item" id="category">Quản lý thể loại</li>
                        </ul>
                    </div>
                    <div className="col-sm-10 ad-display p-0">
                        <div className="ad-header">
                            <ul className="nav-menu">
                                <li className="nav-menu-item dropdown">
                                    <div className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    </div>
                                    <ul className="dropdown-menu">
                                        <li><a href="#" className="dropdown-item-ed" asp-area="">Đăng xuất</a></li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                        <div className="ad-content">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ADhome;