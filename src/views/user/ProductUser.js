import React, { useEffect, useState } from "react";
import axios from "axios";
import { useOutletContext, Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus, faEye } from "@fortawesome/free-solid-svg-icons";
import Loading from "../loading/Loading";
import '../../styles/user/ProductUser.scss';

const ProductUser = (props) => {
    const { id, pageNumber, pageSize } = useParams();
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState();
    const [totalPages, settoTalPages] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [prices, setPrices] = useState([
        { label: 'under500', value: false },
        { label: 'range500to1000', value: false },
        { label: 'range1000to2500', value: false },
        { label: 'range2500to3500', value: false },
        { label: 'over4500', value: false }
    ]);
    const [colors, setColors] = useState([
        { label: 'colorRed', value: false },
        { label: 'colorBlue', value: false },
        { label: 'colorOrange', value: false },
        { label: 'colorGreen', value: false },
        { label: 'colorYellow', value: false },
        { label: 'colorPurple', value: false },
        { label: 'colorPink', value: false },
        { label: 'colorBrown', value: false },
        { label: 'colorBlack', value: false },
        { label: 'colorWhite', value: false }
    ]);
    const [selectFilter, setSelectFilter] = useState('ASC');

    const { handleAddCart } = useOutletContext();

    const fetchListProducts = async (loaiId, pageNumber, pageSize) => {
        const params = {};
        if (loaiId) params.LoaiId = loaiId;
        if (pageNumber) params.PageNumber = pageNumber;
        if (pageSize) params.PageSize = pageSize;

        try {
            let res = await axios.get('https://localhost:7078/api/Product/user/category', { params });
            setProducts(res.data.items || []);
            setCurrentPage(res.data.currentPage);
            settoTalPages(res.data.totalPages);
            setIsLoading(false);
        } catch (error) {
            console.error('Lỗi lấy dữ liệu api:', error);
        }
    };

    useEffect(() => {
        fetchListProducts(id, pageNumber, pageSize);
    }, [id, pageNumber, pageSize]);

    const handleChangeCheckBox = (event) => {
        const { name, checked } = event.target;

        if (name.startsWith('color')) {
            const updatedColors = colors.map(color =>
                color.label === name ? { ...color, value: checked } : color
            );
            setColors(updatedColors);
        } else {
            const updatedPrices = prices.map(price =>
                price.label === name ? { ...price, value: checked } : price
            );
            setPrices(updatedPrices);
        }
    };

    const calculateDiscountedPrice = (product) => {
        if (product.loaiGiam) {
            return product.gia - ((product.gia * product.menhGia) / 100);
        } else {
            return product.gia - product.menhGia;
        }
    };

    const getFilter = () => {
        let filteredProducts = products.map(product => ({
            ...product,
            discountedPrice: calculateDiscountedPrice(product)
        }));

        if (selectFilter === "ASC") {
            filteredProducts.sort((a, b) => a.discountedPrice - b.discountedPrice);
        }

        if (selectFilter === "DESC") {
            filteredProducts.sort((a, b) => b.discountedPrice - a.discountedPrice);
        }

        const activePrices = prices.filter(price => price.value);
        const activeColors = colors.filter(color => color.value);

        if (activePrices.length === 0 && activeColors.length === 0) {
            return filteredProducts;
        }

        return filteredProducts.filter(product => {
            const priceMatch = activePrices.some(price => {
                if (price.label === 'under500' && product.discountedPrice < 500000) return true;
                if (price.label === 'range500to1000' && product.discountedPrice >= 500000 && product.discountedPrice < 1000000) return true;
                if (price.label === 'range1000to2500' && product.discountedPrice >= 1000000 && product.discountedPrice < 2500000) return true;
                if (price.label === 'range2500to3500' && product.discountedPrice >= 2500000 && product.discountedPrice < 3500000) return true;
                if (price.label === 'over4500' && product.discountedPrice >= 4500000) return true;
                return false;
            });

            const colorMatch = activeColors.some(color => {
                if (color.label === 'colorRed' && product.colorName && product.colorName.includes('Đỏ')) return true;
                if (color.label === 'colorBlue' && product.colorName && product.colorName.includes('Xanh dương')) return true;
                if (color.label === 'colorOrange' && product.colorName && product.colorName.includes('Cam')) return true;
                if (color.label === 'colorGreen' && product.colorName && product.colorName.includes('Xanh lá')) return true;
                if (color.label === 'colorYellow' && product.colorName && product.colorName.includes('Vàng')) return true;
                if (color.label === 'colorPurple' && product.colorName && product.colorName.includes('Tím')) return true;
                if (color.label === 'colorPink' && product.colorName && product.colorName.includes('Hồng')) return true;
                if (color.label === 'colorBrown' && product.colorName && product.colorName.includes('Nâu')) return true;
                if (color.label === 'colorBlack' && product.colorName && product.colorName.includes('Đen')) return true;
                if (color.label === 'colorWhite' && product.colorName && product.colorName.includes('Trắng')) return true;
                return false;
            });

            if (activePrices.length > 0 && activeColors.length > 0) {
                return priceMatch && colorMatch;
            }
            return priceMatch || colorMatch;
        });
    };

    const getPriceLabel = (label) => {
        switch (label) {
            case 'under500':
                return 'Dưới 500.000đ';
            case 'range500to1000':
                return '500.000đ - 1.000.000đ';
            case 'range1000to2500':
                return '1.000.000đ - 2.500.000đ';
            case 'range2500to3500':
                return '2.500.000đ - 3.500.000đ';
            case 'over4500':
                return '4.500.000đ trở lên';
            default:
                return '';
        }
    };

    const handleSelect = (event) => {
        setSelectFilter(event.target.value);
        getFilter();
    };

    const handlePageChange = (event, newPage) => {
        event.preventDefault();
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            fetchListProducts(id, newPage, pageSize);
        }
    };

    if (isLoading) {
        return <Loading />
    }


    return (
        <>
            <div className="product-user">
                <div className='col-3 filter mt-5'>
                    <div className="col-9 m-0">
                        <h3>Lọc theo giá -</h3>
                        {prices.map(price => (
                            <div className="filler-item" key={price.label}>
                                <input
                                    type="checkbox"
                                    name={price.label}
                                    checked={price.value}
                                    onChange={(event) => handleChangeCheckBox(event)}
                                />
                                <label className="m-1">{getPriceLabel(price.label)}</label>
                            </div>
                        ))}
                        <div className="filler-item mt-4 ">
                            <h3>Màu sắc -</h3>
                            <div className=" row color-Category">
                                {colors.map(color => (
                                    <div className="form-check col-1" key={color.label}>
                                        <input
                                            type="checkbox"
                                            name={color.label}
                                            checked={color.value}
                                            onChange={handleChangeCheckBox}
                                            className={`form-check-input ${color.label.replace('color', '').toLowerCase()}`}
                                        />
                                    </div>
                                ))}
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
                            <select value={selectFilter} onChange={handleSelect} className="form-select" aria-label="Default select example">
                                <option value="DESC">Giá giảm dần</option>
                                <option value="ASC">Giá tăng dần</option>
                            </select>
                        </div>
                    </div>
                    <div className="row">
                        {getFilter().map((product, index) => (
                            <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 card" key={product.id}>
                                <div className="product-main">
                                    <div className={product.totalCount === 0 ? "hovereffect out-of-stock" : "hovereffect"}>
                                        <div className="img-product">
                                            <img className="img-fluid" src={product.hinh} alt={"img product " + index} />
                                        </div>
                                        <div className="overlay">
                                            <div className="btn-product">
                                                {product.totalCount === 0 ?
                                                    <Link to={"/ProductDetail/" + product.id} className="no-product">Hết hàng</Link>
                                                    :
                                                    <>
                                                        <Link to={"/ProductDetail/" + product.id} className="info"><FontAwesomeIcon className="icon" icon={faEye} /></Link>
                                                        <Link className="info" onClick={() => handleAddCart(product)}><FontAwesomeIcon className="icon" icon={faCartPlus} /></Link>
                                                    </>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="product-content">
                                    <h5 className="card-title">{product.ten}</h5>
                                    <div className="product-price">
                                        <span className="price">{product.loaiGiam ? (product.gia - ((product.gia * product.menhGia) / 100)).toLocaleString('vi-VN') + " đ" : (product.gia - product.menhGia).toLocaleString('vi-VN') + " đ"}</span>
                                        <span className="priced">{product.maGiamGia === null ? "" : product.gia.toLocaleString('vi-VN') + "đ"} </span>
                                    </div>
                                </div>
                            </div>
                        ))}
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
            </div>
        </>
    );
};

export default ProductUser;
