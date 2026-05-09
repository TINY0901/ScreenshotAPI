# Screenshot API for Node-RED

Dịch vụ chụp ảnh màn hình website sử dụng Puppeteer, được tối ưu cho các hệ thống như Node-RED.

## 🚀 Tính năng
- Chụp ảnh màn hình từ URL bất kỳ.
- Hỗ trợ chờ (wait) để render biểu đồ hoặc nội dung động.
- Hỗ trợ cắt ảnh theo toạ độ (clip).
- Hai chế độ trả về:
    - Trả về file ảnh trực tiếp (PNG).
    - Lưu file và trả về link (JPEG) - tự động dọn dẹp để tiết kiệm dung lượng.
- Tự động quản lý bộ nhớ: Đóng tab ngay sau khi chụp.
- **Tự động dọn dẹp:** Xóa ảnh cũ sau 24 giờ.

## 🛠 Cài đặt

```bash
cd ScreenshotAPI
npm install
```

## 📈 Cách sử dụng

### 1. Lấy ảnh trực tiếp (Binary PNG)
Sử dụng khi muốn Node-RED nhận trực tiếp Buffer ảnh.
- **Endpoint:** `GET /screenshot`
- **Tham số:**
    - `url`: Địa chỉ trang web (bắt buộc).
    - `wait`: Thời gian chờ render (ms), mặc định 5000.
    - `width`/`height`: Kích thước trình duyệt.
    - `clipX`, `clipY`, `clipW`, `clipH`: Toạ độ và kích thước vùng cần cắt.

### 2. Lấy link ảnh (JSON JPEG)
Sử dụng khi muốn nhận link để gửi qua Telegram/Zalo...
- **Endpoint:** `GET /screenshot-link`
- **Tham số:** (Tương tự như trên)
- **Kết quả:** `{ "url": "http://.../screenshots/screenshot_123.jpg" }`

## 🧹 Cơ chế tự động dọn dẹp
Để tránh việc đầy ổ cứng, hệ thống đã tích hợp sẵn cơ chế dọn dẹp:
- **Thời gian lưu trữ:** 24 giờ (`MAX_SCREENSHOT_AGE`).
- **Tần suất quét:** 1 giờ một lần (`CLEANUP_INTERVAL`).
- Các file ảnh trong thư mục `screenshots/` sẽ tự động bị xóa nếu cũ hơn thời gian quy định.

## ⚙️ Quản lý với PM2
Dịch vụ được khuyến khích chạy bằng PM2 để đảm bảo tính ổn định.

- **Khởi động:** `pm2 start ecosystem.config.js`
- **Xem trạng thái:** `pm2 status`
- **Xem log:** `pm2 logs ScreenshotAPI`
- **Khởi động lại:** `pm2 restart ScreenshotAPI`
- **Dừng:** `pm2 stop ScreenshotAPI`

## 🐳 Docker (Tùy chọn)
Hệ thống cũng hỗ trợ chạy qua Docker:
```bash
docker-compose up -d
```
