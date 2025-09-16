# Crawler Tool - Hệ thống thu thập dữ liệu sản phẩm tự động

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/boyisvan/crawler-tool)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node.js-16+-green.svg)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/python-3.8+-blue.svg)](https://python.org/)

## 💫 Câu chuyện ra đời

> **"Từ những đêm không ngủ, từ những dòng code đầu tiên viết trong căn phòng nhỏ, đến một hệ thống hoàn chỉnh phục vụ cộng đồng"**

Dự án **Crawler Tool** được sinh ra từ một ước mơ đơn giản nhưng đầy tham vọng của một lập trình viên trẻ - **Hoàng Đức Văn**. Trong những ngày đầu bước chân vào thế giới lập trình, anh đã nhận ra một vấn đề lớn mà nhiều doanh nghiệp và cá nhân đang gặp phải: **làm thế nào để thu thập dữ liệu sản phẩm một cách hiệu quả và tự động?**

Những đêm không ngủ, những dòng code đầu tiên được viết trong căn phòng nhỏ với chiếc máy tính , anh đã bắt đầu hành trình xây dựng một công cụ có thể giúp mọi người tiết kiệm thời gian và công sức trong việc thu thập dữ liệu. Từ những script Python đơn giản chạy trên terminal, đến một hệ thống web hoàn chỉnh với giao diện đẹp mắt và dễ sử dụng.

**Ước mơ của anh không chỉ dừng lại ở việc tạo ra một công cụ hữu ích**, mà còn muốn xây dựng một cộng đồng nơi mọi người có thể chia sẻ kiến thức, hỗ trợ lẫn nhau và cùng nhau phát triển. Mỗi dòng code được viết với tình yêu và sự tận tâm, mỗi tính năng được phát triển với hy vọng mang lại giá trị thực sự cho người dùng.

Hôm nay, **Crawler Tool** đã trở thành một hệ thống hoàn chỉnh với đầy đủ tính năng từ thu thập dữ liệu cơ bản đến web scraping nâng cao, từ giao diện console đơn giản đến web interface hiện đại. Nhưng điều quan trọng nhất, nó vẫn giữ nguyên tinh thần ban đầu: **mang lại giải pháp thực sự hữu ích cho cộng đồng**.

> **"Mỗi dòng code là một bước tiến, mỗi tính năng là một ước mơ được hiện thực hóa. Crawler Tool không chỉ là một công cụ, mà là hiện thân của đam mê và sự kiên trì."**

---

> **Crawler Tool** là hệ thống thu thập dữ liệu sản phẩm tự động từ các website thương mại điện tử với giao diện web hiện đại và dễ sử dụng.

## Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Tính năng](#-tính-năng)
- [Cài đặt](#-cài-đặt)
- [Sử dụng](#-sử-dụng)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [API Documentation](#-api-documentation)
- [Tài liệu hướng dẫn](#-tài-liệu-hướng-dẫn)
- [Troubleshooting](#-troubleshooting)
- [Đóng góp](#-đóng-góp)
- [Thông tin tác giả](#-thông-tin-tác-giả)

## Giới thiệu

Crawler Tool được phát triển với mục tiêu cung cấp giải pháp thu thập dữ liệu hiệu quả, dễ sử dụng và có thể mở rộng. Hệ thống hỗ trợ thu thập dữ liệu từ nhiều website khác nhau với giao diện web thân thiện, cho phép người dùng dễ dàng cấu hình, theo dõi và quản lý quá trình thu thập dữ liệu.

### 🎯 Lợi ích chính

- ⚡ **Tiết kiệm thời gian** thu thập dữ liệu
- 🤖 **Tự động hóa** quy trình thu thập
- 🌐 **Hỗ trợ nhiều website** cùng lúc
- 📊 **Dữ liệu được cấu trúc** và sạch
- 🎨 **Giao diện trực quan**, dễ sử dụng
- 🔧 **Có thể mở rộng** và tùy chỉnh

## ✨ Tính năng

### 🔄 Thu thập dữ liệu
- **Thu thập cơ bản**: Sử dụng API có sẵn của các website thương mại điện tử
- **Thu thập v2**: Web scraping với Python, hỗ trợ bất kỳ website nào
- **Real-time monitoring**: Theo dõi tiến trình thu thập theo thời gian thực
- **Bookmark link**: Tính năng đánh dấu và kiểm soát quá trình crawl

### Quản lý dữ liệu
- **Dashboard tổng quan** với thống kê chi tiết
- **Quản lý bookmark** và lịch sử thu thập
- **Tìm kiếm sản phẩm** theo từ khóa
- **Xuất dữ liệu** ra file CSV/JSON

### Giao diện người dùng
- **Responsive design** tương thích mọi thiết bị
- **Dark/Light theme** tùy chọn
- **Real-time updates** không cần refresh trang
- **Interactive charts** và biểu đồ thống kê

### 🔧 Tính năng nâng cao
- **Multi-threading** thu thập dữ liệu
- **Error handling** tự động và thông báo lỗi
- **Configuration management** linh hoạt
- **Export/Import** cấu hình

## Cài đặt

### Yêu cầu hệ thống

- **Node.js**: 16.0.0 trở lên
- **Python**: 3.8 trở lên
- **NPM**: 7.0.0 trở lên
- **RAM**: Tối thiểu 2GB
- **Disk**: Tối thiểu 1GB trống

### Cài đặt dependencies

```bash
# Clone repository
git clone https://github.com/boyisvan/crawler-tool.git
cd crawler-tool

# Cài đặt Node.js dependencies
npm install

# Cài đặt Python dependencies
pip install -r requirements.txt
```

### Khởi động hệ thống

#### Cách 1: Sử dụng file batch (Windows)
```bash
# Double-click vào file run-server.bat
# Hoặc chạy từ command line:
run-server.bat
```

#### Cách 2: Chạy thủ công
```bash
# Chạy server Node.js
npm start

# Hoặc với nodemon (auto-restart)
npm run dev
```

## Sử dụng

### Truy cập hệ thống

Sau khi chạy server, mở trình duyệt và truy cập:

- **Trang chủ (Login)**: http://localhost:3000/
- **Dashboard chính**: http://localhost:3000/html/crawler-dashboard.html
- **Thu thập dữ liệu v2**: http://localhost:3000/html/crawler-v2.html
- **Quản lý Website**: http://localhost:3000/html/website-management.html
- **Tài liệu hướng dẫn**: http://localhost:3000/html/documentation.html

### Thông tin đăng nhập mặc định
- **Tên đăng nhập**: `admin`
- **Mật khẩu**: `1`

### Hướng dẫn sử dụng cơ bản

1. **Đăng nhập** vào hệ thống
2. **Chọn website** từ danh sách có sẵn
3. **Cấu hình** tham số thu thập
4. **Bắt đầu** quá trình thu thập
5. **Theo dõi** tiến trình real-time
6. **Xuất dữ liệu** khi hoàn tất

## 📁 Cấu trúc dự án

```
admin/
├── 📄 index.html                    # Trang login chính
├── 📄 package.json                  # Dependencies và scripts
├── 📄 run-server.bat               # Script khởi động Windows
├── 📄 start.bat                    # Script khởi động thay thế
├── 📄 README.md                    # Tài liệu dự án
├── 📄 solution.md                  # Tài liệu giải pháp
├── 📁 js/                          # Backend Node.js
│   ├── 📄 server.js                # Express server chính
│   ├── 📄 config.js                # Cấu hình hệ thống
│   ├── 📄 productCrawler.js        # Class crawler cơ bản
│   ├── 📄 bookmarkManager.js       # Quản lý bookmark
│   ├── 📄 keywordBookmarkManager.js # Quản lý bookmark từ khóa
│   ├── 📄 csvExporter.js           # Xuất dữ liệu CSV
│   ├── 📄 crawlStateManager.js     # Quản lý trạng thái crawl
│   ├── 📄 keywordHistory.js        # Lịch sử từ khóa
│   ├── 📄 helpers.js               # Utility functions
│   └── 📁 data/                    # Dữ liệu JSON
├── 📁 html/                        # Frontend pages
│   ├── 📄 crawler-dashboard.html   # Dashboard chính
│   ├── 📄 crawler-v2.html          # Thu thập dữ liệu v2
│   ├── 📄 crawler-management.html  # Quản lý crawler
│   ├── 📄 website-management.html  # Quản lý website
│   ├── 📄 keyword-search.html      # Tìm kiếm từ khóa
│   ├── 📄 bookmark-management.html # Quản lý bookmark
│   ├── 📄 data-export.html         # Xuất dữ liệu
│   ├── 📄 site-monitor.html        # Giám sát website
│   ├── 📄 settings.html            # Cài đặt hệ thống
│   ├── 📄 documentation.html       # Tài liệu hướng dẫn
│   └── 📄 auth-login-basic.html    # Trang đăng nhập
├── 📁 assets/                      # Tài nguyên tĩnh
│   ├── 📁 js/                      # JavaScript modules
│   │   ├── 📄 common.js            # Utilities chung
│   │   ├── 📄 sidebar.js           # Quản lý sidebar
│   │   ├── 📄 config.js            # Cấu hình frontend
│   │   └── 📄 main.js              # Main JavaScript
│   ├── 📁 css/                     # Stylesheets
│   ├── 📁 img/                     # Hình ảnh
│   └── 📁 vendor/                  # Thư viện bên thứ 3
├── 📁 crawv2/                      # Python crawler v2
│   ├── 📄 crawlv2_simple.py        # Main crawler script
│   ├── 📄 websites_config.json     # Cấu hình website
│   ├── 📄 download_history.json    # Lịch sử tải xuống
│   └── 📁 downloads/               # File kết quả
├── 📁 data/                        # Dữ liệu crawl
├── 📁 exports/                     # Thư mục xuất CSV
├── 📁 scss/                        # SCSS source files
└── 📁 libs/                        # Thư viện JavaScript
```

## 🔌 API Documentation

### Authentication
- `POST /api/login` - Đăng nhập hệ thống
- `POST /api/logout` - Đăng xuất

### Website Management
- `GET /api/sites` - Lấy danh sách website
- `GET /api/current-site` - Thông tin website hiện tại
- `GET /api/test-connection` - Kiểm tra kết nối
- `POST /api/sites` - Thêm website mới
- `PUT /api/sites/:key` - Cập nhật website
- `DELETE /api/sites/:key` - Xóa website

### Crawling
- `POST /api/crawl` - Thu thập dữ liệu cơ bản
- `POST /api/crawl-keyword` - Thu thập theo từ khóa
- `GET /api/crawl-status` - Trạng thái crawl hiện tại
- `POST /api/stop-crawl` - Dừng crawl

### CrawlV2 (Advanced)
- `GET /api/crawlv2/configs` - Lấy danh sách cấu hình
- `POST /api/crawlv2/configs` - Tạo cấu hình mới
- `PUT /api/crawlv2/configs/:name` - Cập nhật cấu hình
- `DELETE /api/crawlv2/configs/:name` - Xóa cấu hình
- `POST /api/crawlv2/start` - Bắt đầu crawl v2
- `POST /api/crawlv2/stop/:crawlId` - Dừng crawl v2
- `GET /api/crawlv2/active` - Lấy danh sách crawl đang chạy
- `GET /api/crawlv2/downloads` - Lấy lịch sử tải xuống
- `POST /api/crawlv2/bookmark-request` - Xử lý bookmark request
- `POST /api/crawlv2/bookmark-response` - Phản hồi bookmark

### Data Management
- `GET /api/stats` - Thống kê tổng quan
- `GET /api/bookmarks` - Lấy danh sách bookmark
- `POST /api/export-csv` - Xuất dữ liệu CSV
- `GET /api/keyword-history` - Lịch sử từ khóa

## Tài liệu hướng dẫn

Hệ thống cung cấp trang tài liệu hướng dẫn chi tiết tại `/html/documentation.html` bao gồm:

### Nội dung tài liệu

1. **Tổng quan hệ thống**
   - Giới thiệu và mục tiêu
   - Tính năng chính và lợi ích
   - Công nghệ sử dụng

2. **Kiến trúc hệ thống**
   - Cấu trúc dự án chi tiết
   - Luồng dữ liệu
   - API endpoints

3. **Hướng dẫn thu thập dữ liệu**
   - Thu thập cơ bản vs Thu thập v2
   - Cấu hình và sử dụng
   - So sánh tính năng

4. **Quản lý dữ liệu**
   - Quản lý website và bookmark
   - Xuất dữ liệu
   - Lịch sử và thống kê

5. **Tính năng nâng cao**
   - Bookmark link
   - Real-time monitoring
   - Error handling

6. **Xử lý sự cố**
   - Lỗi thường gặp và giải pháp
   - Mẹo tối ưu hóa
   - Troubleshooting

## 🛠️ Troubleshooting

### Lỗi thường gặp

#### 1. Lỗi 404 - Không tìm thấy trang
**Nguyên nhân:**
- URL website không chính xác
- Website đã thay đổi cấu trúc
- Website tạm thời không khả dụng

**Giải pháp:**
- Kiểm tra lại URL trong cấu hình
- Thử truy cập website trực tiếp
- Cập nhật lại cấu hình nếu cần

#### 2. Lỗi Timeout - Hết thời gian chờ
**Nguyên nhân:**
- Website phản hồi chậm
- Kết nối mạng không ổn định
- Website có bảo vệ chống bot

**Giải pháp:**
- Kiểm tra kết nối mạng
- Thử thu thập ít trang hơn
- Thêm delay giữa các request

#### 3. Không tìm thấy dữ liệu
**Nguyên nhân:**
- CSS selector không chính xác
- Website sử dụng JavaScript để load nội dung
- Cấu trúc HTML đã thay đổi

**Giải pháp:**
- Kiểm tra lại CSS selector
- Sử dụng Developer Tools
- Cập nhật selector phù hợp

### Mẹo tối ưu hóa

#### Để tăng tốc độ thu thập:
- Giảm số trang thu thập mỗi lần
- Sử dụng thu thập cơ bản khi có thể
- Đảm bảo kết nối mạng ổn định
- Chọn thời gian ít người dùng

#### Để tăng độ chính xác:
- Kiểm tra CSS selector kỹ lưỡng
- Test cấu hình với ít trang trước
- Cập nhật cấu hình thường xuyên
- Sử dụng bookmark link để kiểm soát

## 🤝 Đóng góp

Chúng tôi hoan nghênh mọi đóng góp từ cộng đồng! Để đóng góp:

1. **Fork** repository này
2. **Tạo branch** mới cho feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. **Push** lên branch (`git push origin feature/AmazingFeature`)
5. **Mở Pull Request**

### Hướng dẫn đóng góp code

- Tuân thủ coding standards hiện tại
- Thêm comments cho code phức tạp
- Test kỹ lưỡng trước khi submit
- Cập nhật documentation nếu cần

## Thông tin tác giả

**Hoàng Đức Văn (boyisvan)**

- **Email**: ducvan05102002@gmail.com
- **Số điện thoại**: 0587282880
- **GitHub**: [@boyisvan](https://github.com/boyisvan)
- **Website**: [boyisvan.dev](https://boyisvan.dev)

### Về tác giả

Tôi là một Full-stack Developer với kinh nghiệm phát triển web applications, đặc biệt quan tâm đến việc tạo ra các giải pháp tự động hóa và công cụ hỗ trợ công việc hiệu quả. Crawler Tool là một trong những dự án tôi phát triển để giải quyết nhu cầu thu thập dữ liệu từ các website thương mại điện tử.

### Liên hệ hỗ trợ

Nếu bạn gặp bất kỳ vấn đề nào hoặc có câu hỏi về dự án, vui lòng liên hệ:

- **Email**: ducvan05102002@gmail.com
- **Zalo/Telegram**: 0587282880
- **GitHub Issues**: [Tạo issue mới](https://github.com/boyisvan/crawler-tool/issues)

---

## License

Dự án này được phân phối dưới giấy phép MIT. Xem file `LICENSE` để biết thêm thông tin.

## 🙏 Acknowledgments

- Cảm ơn tất cả các thư viện open source đã được sử dụng
- Cảm ơn cộng đồng developers đã đóng góp ý kiến
- Cảm ơn những người dùng đã test và feedback

---

<div align="center">

**Made with ❤️ by [boyisvan](https://github.com/boyisvan)**

[![GitHub stars](https://img.shields.io/github/stars/boyisvan/crawler-tool?style=social)](https://github.com/boyisvan/crawler-tool/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/boyisvan/crawler-tool?style=social)](https://github.com/boyisvan/crawler-tool/network)
[![GitHub watchers](https://img.shields.io/github/watchers/boyisvan/crawler-tool?style=social)](https://github.com/boyisvan/crawler-tool/watchers)

</div>