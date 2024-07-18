import React from "react";
import '../../styles/user/ProductUser.scss';
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap/dist/css/bootstrap.min.css";
import Image2 from "../../assets/images/sp2.png";
const products = [
    {
        id: 1,
        name: 'Tượng hy lạp phong cách cổ đại',
        description: 'Description of product 1',
        price: '2.800.000',
        image: 'https://jobsgo.vn/blog/wp-content/uploads/2024/03/Decor-la-gi-7-nguyen-tac-decor-trong-trang-tri-noi-that-1.png'
    },
    {
        id: 2,
        name: 'Product 2',
        description: 'Description of product 2',
        price: '1.200.300',
        image: 'https://jobsgo.vn/blog/wp-content/uploads/2024/03/Decor-la-gi-7-nguyen-tac-decor-trong-trang-tri-noi-that-1.png'
    },
    {
        id: 3,
        name: 'Product 3',
        description: 'Description of product 3',
        price: '$39.99',
        image: 'https://jobsgo.vn/blog/wp-content/uploads/2024/03/Decor-la-gi-Co-y-nghia-nhu-the-nao.png'
    },
    {
        id: 4,
        name: 'Product 3',
        description: 'Description of product 3',
        price: '$39.99',
        image: 'https://jobsgo.vn/blog/wp-content/uploads/2024/03/Decor-la-gi.png'
    },
    {
        id: 5,
        name: 'Product 3',
        description: 'Description of product 3',
        price: '$39.99',
        image: Image2,
    }
];
class ProductUser extends React.Component {
    render() {
        return (
            <>
                <div className="row">
                    <div className='col-3 filter mt-5'>
                        <div className="col-9 m-0">
                            <h3>Lọc theo giá -</h3>
                            <div className="filler-item">
                                <input type="checkbox"></input>
                                <label className="m-1"> Dưới 500.000đ</label>
                            </div>
                            <div className="filler-item">
                                <input type="checkbox"></input>
                                <label className="m-1">500.000đ - 1.000.000đ</label>
                            </div>
                            <div className="filler-item">
                                <input type="checkbox"></input>
                                <label className="m-1"> 1.000.000đ - 2.500.000đ</label>
                            </div>
                            <div className="filler-item">
                                <input type="checkbox"></input>
                                <label className="m-1"> 2.500.000đ - 3.500.000đ</label>
                            </div>
                            <div className="filler-item">
                                <input type="checkbox"></input>
                                <label className="m-1"> 4.500.000đ trở lên</label>
                            </div>
                            <div className="filler-item mt-4 ">
                                <h3>Màu sắc -</h3>
                                <div className=" row color-Category">

                                    <div className="form-check col-1">
                                        <input type="checkbox" className="form-check-input red" />
                                    </div>
                                    <div className="form-check col-1">
                                        <input type="checkbox" className="form-check-input blue" />
                                    </div>
                                    <div className="form-check col-1">
                                        <input type="checkbox" className="form-check-input orange" />
                                    </div>

                                    <div className="form-check col-1">
                                        <input type="checkbox" className="form-check-input green" />
                                    </div>
                                    <div className="form-check col-1">
                                        <input type="checkbox" className="form-check-input yellow" />
                                    </div>
                                    <div className="form-check col-1">
                                        <input type="checkbox" className="form-check-input purple" />
                                    </div>
                                    <div className="form-check col-1">
                                        <input type="checkbox" className="form-check-input pink" />
                                    </div>
                                    <div className="form-check col-1">
                                        <input type="checkbox" className="form-check-input brown" />
                                    </div>
                                    <div className="form-check col-1">
                                        <input type="checkbox" className="form-check-input black" />
                                    </div>
                                    <div className="form-check col-1">
                                        <input type="checkbox" className="form-check-input white" />
                                    </div>




                                </div>
                            </div>

                        </div>
                    </div>
                    <div className='col-9'>
                        <div className='row line pt-5 pb-5'>
                            <div className=" col-1 line-item"></div>
                            <div className="col-8 ">
                                <h1>Tất cả sản phẩm</h1>
                            </div>
                            <div className="col-3">
                                <p className="text-Under">Mới Nhất</p>

                            </div>

                        </div>
                        <div className='row '>
                            {products.map((product) => (
                                <div className='col-3' key={product.id}>
                                    <div className='card'>
                                        <img src={product.image} className='card-img-top' alt={product.name} />
                                        <div className='card-body'>
                                            <h5 className='card-title'>{product.name}</h5>

                                            <p className='card-text'>{product.price} đ</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className='row'>
                            <nav aria-label="Page navigation example">
                                <ul className="pagination">
                                    <li className="page-item"><a className="page-link" href="#"> &lt; </a></li>
                                    <li className="page-item"><a className="page-link" href="#">1</a></li>
                                    <li className="page-item"><a className="page-link" href="#">2</a></li>
                                    <li className="page-item"><a className="page-link" href="#">3</a></li>
                                    <li className="page-item"><a className="page-link" href="#">&gt;</a></li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>

            </>
        )
    }
}

export default ProductUser;