import React from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCartPlus,
    faEye
} from "@fortawesome/free-solid-svg-icons";

import '../../styles/user/ProductUser.scss';
import "../../styles/user/hover/hover.scss";

class ProductUser extends React.Component {
    state = {
        products: [],
        prices: [
            { label: 'under500', value: false },
            { label: 'range500to1000', value: false },
            { label: 'range1000to2500', value: false },
            { label: 'range2500to3500', value: false },
            { label: 'over4500', value: false }
        ],
        colors: [
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
        ],
        selectFilter: 'ASC'
    }

    async componentDidMount() {
        let res = await axios.get('https://localhost:7078/api/Product/User');
        this.setState({
            products: res && res.data ? res.data : []
        })
    }

    handleChangeCheckBox = (event) => {
        const { name, checked } = event.target;

        if (name.startsWith('color')) {
            const updatedColors = this.state.colors.map(color =>
                color.label === name ? { ...color, value: checked } : color
            );
            this.setState({ colors: updatedColors });
        } else {
            const updatedPrices = this.state.prices.map(price =>
                price.label === name ? { ...price, value: checked } : price
            );
            this.setState({ prices: updatedPrices });
        }
    }

    getFilter = () => {

        let filteredProducts = [...this.state.products];

        if (this.state.selectFilter === "ASC") {
            filteredProducts.sort((a, b) => a.gia - b.gia);
        }

        if (this.state.selectFilter === "DESC") {
            filteredProducts.sort((a, b) => b.gia - a.gia);
        }

        const activePrices = this.state.prices.filter(price => price.value);
        const activeColors = this.state.colors.filter(color => color.value);

        if (activePrices.length === 0 && activeColors.length === 0) {
            return filteredProducts;
        }

        return filteredProducts.filter(product => {
            const priceMatch = activePrices.some(price => {
                if (price.label === 'under500' && product.gia < 500000) return true;
                if (price.label === 'range500to1000' && product.gia >= 500000 && product.gia < 1000000) return true;
                if (price.label === 'range1000to2500' && product.gia >= 1000000 && product.gia < 2500000) return true;
                if (price.label === 'range2500to3500' && product.gia >= 2500000 && product.gia < 3500000) return true;
                if (price.label === 'over4500' && product.gia >= 4500000) return true;
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
    }

    getPriceLabel(label) {
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
    }

    handleSelect = (event) => {
        this.setState({
            selectFilter: event.target.value
        }, () => {
            this.getFilter();
        });
    }

    render() {
        let filter = this.getFilter();
        return (
            <>
                <div className="product-user">
                    <div className='col-3 filter mt-5'>
                        <div className="col-9 m-0">
                            <h3>Lọc theo giá -</h3>
                            {this.state.prices.map(price => (
                                <div className="filler-item" key={price.label}>
                                    <input
                                        type="checkbox"
                                        name={price.label}
                                        checked={price.value}
                                        onChange={(event) => this.handleChangeCheckBox(event)}
                                    />
                                    <label className="m-1">{this.getPriceLabel(price.label)}</label>
                                </div>
                            ))}
                            <div className="filler-item mt-4 ">
                                <h3>Màu sắc -</h3>
                                <div className=" row color-Category">
                                    {this.state.colors.map(color => (
                                        <div className="form-check col-1" key={color.label}>
                                            <input
                                                type="checkbox"
                                                name={color.label}
                                                checked={color.value}
                                                onChange={this.handleChangeCheckBox}
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
                                <select value={this.state.selectFilter} onChange={(event) => this.handleSelect(event)} className="form-select" aria-label="Default select example">
                                    <option value="DESC">Giá giảm dần</option>
                                    <option value="ASC">Giá tăng dần</option>
                                </select>
                            </div>

                        </div>
                        <div className="row">
                            {filter.map((product, index) => (
                                <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 card" key={product.id}>
                                    <div className="product-main">
                                        <div class="hovereffect">
                                            <img class="img-fluid" src={product.hinh} alt={"img product " + index} />
                                            <div class="overlay">
                                                <div className="btn-product">
                                                    <a class="info" href="#"><FontAwesomeIcon className="icon" icon={faEye} /></a>
                                                    <a class="info" href="#"><FontAwesomeIcon className="icon" icon={faCartPlus} /></a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="product-content">
                                        <h5 className="card-title">{product.ten}</h5>
                                        <div className="product-price">
                                            <span className="price">{product.loaiGiam ? (product.gia - ((product.gia * product.menhGia) / 100)).toLocaleString('vi-VN') + " đ" : (product.gia - product.menhGia).toLocaleString('vi-VN') + " đ"}</span>
                                            <span className="priced">{product.gia.toLocaleString('vi-VN') + "đ"} </span>
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