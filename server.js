const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = 3050;

let browser;

// Khởi tạo Browser 1 lần duy nhất để tiết kiệm tài nguyên
async function initBrowser() {
    console.log("Đang khởi động trình duyệt Puppeteer...");
    try {
        browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage', // Rất quan trọng cho thiết bị ít RAM
                '--disable-gpu',
                '--disable-extensions'
            ]
        });
        console.log("Khởi động thành công! Trình duyệt đang chạy ngầm.");
    } catch (err) {
        console.error("Lỗi khi khởi động trình duyệt:", err);
    }
}

initBrowser();

// Endpoint để Node-RED gọi vào
app.get('/screenshot', async (req, res) => {
    const targetUrl = req.query.url;
    // Thời gian chờ để Dashboard load xong biểu đồ (mặc định 5s)
    const waitTime = parseInt(req.query.wait) || 5000;
    // Kích thước ảnh
    const width = parseInt(req.query.width) || 1280;
    const height = parseInt(req.query.height) || 800;

    if (!targetUrl) {
        return res.status(400).send("Lỗi: Thiếu tham số 'url'");
    }

    if (!browser) {
        return res.status(503).send("Lỗi: Trình duyệt chưa sẵn sàng.");
    }

    let page;
    try {
        console.log(`\n[+] Đang xử lý yêu cầu chụp: ${targetUrl}`);
        const startTime = Date.now();

        // Mở 1 tab mới (rất nhẹ và nhanh hơn mở cả trình duyệt)
        page = await browser.newPage();

        await page.setViewport({ width, height });

        console.log(`    - Đang tải trang...`);
        // Đi tới URL, đợi đến khi network rảnh rỗi
        await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 30000 });

        // Đợi thêm 1 khoảng thời gian thủ công để biểu đồ vẽ xong hiệu ứng (animation)
        if (waitTime > 0) {
            console.log(`    - Đang chờ thêm ${waitTime}ms để render biểu đồ...`);
            await new Promise(r => setTimeout(r, waitTime));
        }

        console.log(`    - Đang chụp ảnh...`);
        // Chụp ảnh trả về định dạng Buffer
        const imageBuffer = await page.screenshot({ type: 'png', fullPage: false });

        // Gửi ảnh về cho Node-RED
        res.set('Content-Type', 'image/png');
        res.send(imageBuffer);

        const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`[+] Hoàn thành sau ${timeTaken}s`);
    } catch (error) {
        console.error(`[-] Lỗi khi xử lý ${targetUrl}:`, error.message);
        res.status(500).send(`Lỗi chụp ảnh: ${error.message}`);
    } finally {
        // LUÔN LUÔN đóng tab sau khi xong để giải phóng RAM
        if (page) {
            await page.close().catch(e => console.error("Lỗi khi đóng tab", e));
            console.log(`    - Đã đóng tab để giải phóng bộ nhớ.`);
        }
    }
});

app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`DỊCH VỤ CHỤP ẢNH MÀN HÌNH (SCREENSHOT API)`);
    console.log(`Cổng hoạt động: ${PORT}`);
    console.log(`Cách dùng trong Node-RED:`);
    console.log(`Sử dụng node HTTP Request gọi Method GET đến:`);
    console.log(`http://localhost:${PORT}/screenshot?url=LINK_CUA_BAN&wait=5000`);
    console.log(`=========================================\n`);
});
