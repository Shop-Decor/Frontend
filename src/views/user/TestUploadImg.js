import React from "react";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { v4 } from "uuid";
import { imageDb } from "../../services/config";
import axios from "axios";

class TestUploadImg extends React.Component {
    state = {
        imgFiles: [],
        imgUrl: [],
        imgPreviews: [],
        product: {
            ten: '',
            moTa: '',
            maGiamGia: '',
            img: []
        }
    }

    handleChange = (e) => {
        const files = Array.from(e.target.files);
        const filePreviews = files.map(file => URL.createObjectURL(file));

        this.setState({
            imgFiles: files,
            imgPreviews: filePreviews
        });
    }

    uploadImages = async () => {
        const uploadPromises = this.state.imgFiles.map(file => {
            const imgRef = ref(imageDb, `files/${v4()}`);
            return uploadBytes(imgRef, file).then((snapshot) =>
                getDownloadURL(snapshot.ref)
            );
        });

        const urls = await Promise.all(uploadPromises);
        return urls;
    }

    handleClick = async () => {
        if (this.state.imgFiles.length > 0) {
            const urls = await this.uploadImages();

            // Sử dụng callback để cập nhật trạng thái và sau đó gửi dữ liệu
            this.setState(prevState => ({
                imgUrl: urls,
                product: {
                    ...prevState.product,
                    img: urls
                }
            }), async () => {
                // Sau khi trạng thái đã được cập nhật, gửi dữ liệu
                console.log('Product before POST:', this.state.product);

                try {
                    const response = await axios.post('https://localhost:7078/api/product', this.state.product);
                    console.log("Product uploaded successfully:", response.data);
                } catch (error) {
                    console.error("There was an error uploading the product!", error);
                }
            });
        }
    }

    handleChangeName = (event) => {
        this.setState((x) => ({
            product: {
                ...x.product,
                ten: event.target.value
            }
        }));
    }

    handleChangeDescribe = (event) => {
        this.setState((x) => ({
            product: {
                ...x.product,
                moTa: event.target.value
            }
        }));
    }

    handleChangeDiscount = (event) => {
        this.setState((x) => ({
            product: {
                ...x.product,
                maGiamGia: event.target.value
            }
        }));
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        await this.handleClick();
    }

    render() {
        return (
            <div className="App">
                <input
                    type="file"
                    onChange={this.handleChange}
                    multiple
                />
                <button onClick={this.handleClick}>Upload</button>
                <br />
                <div className="img-preview">
                    {this.state.imgPreviews.map((dataVal, index) => (
                        <img key={index} src={dataVal} width="200px" alt="uploaded" />
                    ))}
                </div>
                <form>
                    <div className="mb-3 mt-3">
                        <label>Tên sản phẩm</label>
                        <input type="text" value={this.state.product.ten} onChange={(event) => this.handleChangeName(event)} className="form-control" />
                    </div>
                    <div className="mb-3">
                        <label>Hình ảnh</label>
                        <input
                            type="file"
                            onChange={this.handleChange}
                            multiple
                        />
                    </div>
                    <div className="mb-3 mt-3">
                        <label>Mã giảm giá</label>
                        <input type="text" value={this.state.product.maGiamGia} onChange={(event) => this.handleChangeDiscount(event)} className="form-control" />
                    </div>
                    <div className="mb-3 mt-3">
                        <label>Mô tả</label>
                        <input type="text" value={this.state.product.moTa} onChange={(event) => this.handleChangeDescribe(event)} className="form-control" />
                    </div>
                    <button onClick={(event) => this.handleSubmit(event)} type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        );
    }
}

export default TestUploadImg;