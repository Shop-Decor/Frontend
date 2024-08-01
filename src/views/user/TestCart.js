import React from 'react';

class TestCart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cart: [],
        };
    }

    // Khôi phục giỏ hàng khi component được mount
    componentDidMount() {
        const savedCart = sessionStorage.getItem('cart');
        if (savedCart) {
            this.setState({ cart: JSON.parse(savedCart) });
        }
    }

    // Lưu giỏ hàng khi trạng thái giỏ hàng thay đổi
    componentDidUpdate(prevState) {
        if (prevState.cart !== this.state.cart) {
            sessionStorage.setItem('cart', JSON.stringify(this.state.cart));
        }
    }

    // Hàm cập nhật giỏ hàng
    updateCart = (newCart) => {
        this.setState({ cart: newCart });
    };

    render() {
        return (
            <div>
                {/* Hiển thị giỏ hàng */}
                {this.state.cart.map((item, index) => (
                    <div key={index}>{item.name}</div>
                ))}

                {/* Button để thêm sản phẩm vào giỏ hàng (ví dụ) */}
                <button onClick={() => this.updateCart([...this.state.cart, { name: 'New Item' }])}>
                    Add Item
                </button>
            </div>
        );
    }
}

export default TestCart;