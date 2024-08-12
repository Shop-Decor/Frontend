import React, { useEffect, useState } from "react";
import axios from "axios";
import { useOutletContext, Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCartPlus,
    faEye
} from "@fortawesome/free-solid-svg-icons";

const Search = (props) => {
    const { handleAddCart } = useOutletContext();
    const { key, pageNumber } = useParams();
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState();
    const [totalPages, settoTalPages] = useState();
    const [totalCount, settoTalCount] = useState();

    const fetchListProducts = async (key, pageNumber) => {
        const params = {};
        if (key) params.Key = key;
        if (pageNumber) params.PageNumber = pageNumber;

        try {
            let res = await axios.get('https://localhost:7078/api/Product/search', { params });
            setProducts(res.data.items || []);
            setCurrentPage(res.data.currentPage);
            settoTalPages(res.data.totalPages);
            settoTalCount(res.data.totalCount);
        } catch (error) {
            console.error('Lỗi lấy dữ liệu api search:', error);
        }
    };

    useEffect(() => {
        fetchListProducts(key, pageNumber);
    }, [key, pageNumber]);

    const handlePageChange = (event, newPage) => {
        event.preventDefault();
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            fetchListProducts(key, newPage);
        }
    };

    return (
        <div className="search-container mt-2">
            <div className="search-title text-center">
                <h3 className="title">Tìm kiếm</h3>
                <p className="number-results">Có {totalCount} sản phẩm cho kết quả tìm kiếm</p>
            </div>
            <div className="key-search mb-3">
                <h5 className="content">Kết quả tìm kiếm cho: {key}</h5>
            </div>
            <div className="row">
                {products && products.length > 0 ? (
                    products.map((item, index) => (
                        <div className="col-md-2 product" key={item.id}>
                            <div className="product-main">
                                <div className="hovereffect">
                                    <img className="img-fluid" src={item.hinh} alt={`img product ${index}`} />
                                    <div className="overlay">
                                        <div className="btn-product">
                                            <Link to={`/ProductDetail/${item.id}`} className="info"><FontAwesomeIcon className="icon" icon={faEye} /></Link>
                                            <Link className="info" onClick={() => handleAddCart(item)}><FontAwesomeIcon className="icon" icon={faCartPlus} /></Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="product-content">
                                <h5 className="card-title">Ôi con sông quê</h5>
                                <div className="product-price">
                                    <span className="price">
                                        {item.loaiGiam
                                            ? (item.gia - ((item.gia * item.menhGia) / 100)).toLocaleString('vi-VN') + " đ"
                                            : (item.gia - item.menhGia).toLocaleString('vi-VN') + " đ"}
                                    </span>
                                    <span className="priced">{item.gia.toLocaleString('vi-VN') + "đ"} </span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Không có sản phẩm nào</p>
                )}
            </div>
            {totalPages && totalPages !== 1 ?
                <div className='row'>
                    <nav aria-label="Page navigation example">
                        <ul className="pagination">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <a className="page-link" href="#" onClick={(e) => handlePageChange(e, currentPage - 1)}> &lt; </a>
                            </li>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                    <a className="page-link" href="#" onClick={(e) => handlePageChange(e, page)}>
                                        {page}
                                    </a>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <a className="page-link" href="#" onClick={(e) => handlePageChange(e, currentPage + 1)}> &gt; </a>
                            </li>
                        </ul>
                    </nav>
                </div>
                : ""
            }
        </div>
    )
}

export default Search;