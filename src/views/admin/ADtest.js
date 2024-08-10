import React, { useRef, useState } from 'react';
import QRCode from 'qrcode.react';
import jsQR from 'jsqr';
import "../../styles/admin/ADTest.scss";

const ADtest = () => {
    const qrRef = useRef(null);
    const [decodedText, setDecodedText] = useState('');

    const order = {
        id: 1,
        ten: "Product 1",
        hinh: "url_to_image",
        gia: 100,
        loaiGiam: "none",
        menhGia: 100,
        size: "M",
        quantity: 1,
        color: "Red"
    };

    const formatOrderData = (order) => {
        return `Mã đơn hàng: ${order.id}\nTên sản phẩm: ${order.ten}\nGiá: ${order.gia} đ\nSố lượng: ${order.quantity}\nMàu sắc: ${order.color}\nKích thước: ${order.size}`;
    };

    const orderData = formatOrderData(order);

    const downloadQRCode = () => {
        const canvas = qrRef.current.querySelector('canvas');
        if (canvas) {
            const pngUrl = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = "qrcode.png";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        } else {
            console.error("Canvas không tìm thấy");
        }
    };

    const readQRCodeFromFile = (file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                context.drawImage(img, 0, 0, img.width, img.height);
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, canvas.width, canvas.height);
                if (code) {
                    setDecodedText(code.data);
                } else {
                    console.error("Không thể đọc mã QR");
                }
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            readQRCodeFromFile(file);
        }
    };

    return (
        <div className="ad-test-container">
            <div ref={qrRef}>
                <QRCode value={orderData} />
            </div>
            <button onClick={downloadQRCode} className="download-button">Lưu mã QR</button>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="upload-input" />
            {decodedText && <pre className="qr-data">{decodedText}</pre>}
        </div>
    );
};

export default ADtest;
