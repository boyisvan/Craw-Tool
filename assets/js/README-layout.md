# Layout Module - Hướng dẫn sử dụng

## Tổng quan

Layout Module là một hệ thống quản lý layout chung cho toàn bộ ứng dụng, giúp tách biệt các phần chung (header, menu, footer) khỏi nội dung trang, giúp code dễ bảo trì và tái sử dụng.

## Cấu trúc

```
assets/js/
├── layout.js          # Layout Manager chính
├── common.js          # Common utilities
└── sidebar.js         # Sidebar Manager (legacy)
```

## Cách sử dụng

### 1. Sử dụng Layout Module (Khuyến nghị)

#### Bước 1: Tạo file HTML mới
```html
<!doctype html>
<html lang="vi" class="layout-menu-fixed layout-compact" data-assets-path="../assets/">
<head>
  <!-- Head content -->
</head>
<body>
  <!-- Layout sẽ được render vào đây -->
  <div id="app-layout"></div>
  
  <!-- Core JS -->
  <script src="../assets/vendor/libs/jquery/jquery.js"></script>
  <!-- ... other scripts ... -->
  <script src="../assets/js/layout.js"></script>
  
  <script>
    // Khởi tạo layout manager
    const layoutManager = new LayoutManager();
    
    // Nội dung trang
    const pageContent = `
      <div class="row">
        <div class="col-12">
          <div class="card">
            <h5>Nội dung trang của bạn</h5>
            <p>Chỉ cần tập trung vào nội dung chính!</p>
          </div>
        </div>
      </div>
    `;
    
    // Render layout khi trang load
    document.addEventListener('DOMContentLoaded', function() {
      CommonUtils.checkLoginStatus();
      layoutManager.renderLayout('app-layout', pageContent);
    });
  </script>
</body>
</html>
```

#### Bước 2: Tùy chỉnh menu (nếu cần)
```javascript
// Thêm menu item mới
layoutManager.menuItems.push({
  id: 'new-page',
  title: 'Trang mới',
  icon: 'bx-plus',
  url: '/html/new-page.html',
  active: false
});
```

### 2. Sử dụng từng component riêng lẻ

#### Render chỉ sidebar:
```javascript
layoutManager.renderSidebar('sidebar-container');
```

#### Render chỉ navbar:
```javascript
layoutManager.renderNavbar('navbar-container');
```

#### Render chỉ footer:
```javascript
layoutManager.renderFooter('footer-container');
```

### 3. Tạo page template hoàn chỉnh

```javascript
const title = "Trang mới";
const description = "Mô tả trang";
const content = `<div>Nội dung trang</div>`;
const additionalScripts = `
  // Script riêng của trang
  function myPageFunction() {
    console.log('Hello from my page!');
  }
`;

const fullHTML = layoutManager.generatePageTemplate(title, description, content, additionalScripts);
```

## API Reference

### LayoutManager Class

#### Constructor
```javascript
const layoutManager = new LayoutManager();
```

#### Methods

##### `renderLayout(containerId, content)`
Render toàn bộ layout vào container
- `containerId`: ID của element container
- `content`: HTML content của trang

##### `renderSidebar(containerId)`
Render sidebar menu
- `containerId`: ID của element container

##### `renderNavbar(containerId)`
Render navbar header
- `containerId`: ID của element container

##### `renderFooter(containerId)`
Render footer
- `containerId`: ID của element container

##### `generatePageTemplate(title, description, content, additionalScripts)`
Tạo HTML template hoàn chỉnh
- `title`: Tiêu đề trang
- `description`: Mô tả trang
- `content`: Nội dung chính
- `additionalScripts`: Script bổ sung (optional)

##### `generateHeadHTML(title, description)`
Tạo HTML head
- `title`: Tiêu đề trang
- `description`: Mô tả trang

##### `generateSidebarHTML()`
Tạo HTML sidebar menu

##### `generateNavbarHTML()`
Tạo HTML navbar header

##### `generateFooterHTML()`
Tạo HTML footer

##### `generateCoreScripts()`
Tạo HTML core scripts

## Lợi ích

### ✅ **Tái sử dụng code**
- Giảm 80% code trùng lặp
- Chỉ cần viết nội dung chính của trang

### ✅ **Dễ bảo trì**
- Sửa menu: chỉ cần sửa 1 file
- Thêm menu item: chỉ cần sửa layout.js
- Cập nhật header/footer: tự động áp dụng toàn bộ

### ✅ **Nhất quán**
- Giao diện đồng nhất trên tất cả trang
- Menu active state tự động
- Responsive design nhất quán

### ✅ **Mở rộng dễ dàng**
- Thêm trang mới: copy template + viết content
- Thêm menu: sửa menuItems array
- Tùy chỉnh: override methods

### ✅ **Performance**
- Load layout 1 lần, render nhiều lần
- Cache HTML templates
- Lazy load components

## Ví dụ thực tế

Xem các file demo:
- `html/template-example.html` - Ví dụ cơ bản
- `html/crawler-dashboard-modular.html` - Dashboard sử dụng layout module

## Migration từ code cũ

### Trước (code cũ):
```html
<!-- 200+ dòng HTML trùng lặp cho header, menu, footer -->
<div class="layout-wrapper">
  <div class="layout-container">
    <aside class="layout-menu">
      <!-- 50+ dòng menu HTML -->
    </aside>
    <div class="layout-page">
      <nav class="layout-navbar">
        <!-- 30+ dòng navbar HTML -->
      </nav>
      <div class="content-wrapper">
        <!-- Nội dung trang -->
      </div>
      <footer class="content-footer">
        <!-- 20+ dòng footer HTML -->
      </footer>
    </div>
  </div>
</div>
```

### Sau (sử dụng layout module):
```html
<!-- Chỉ cần 1 dòng -->
<div id="app-layout"></div>

<script>
const layoutManager = new LayoutManager();
const pageContent = `<!-- Chỉ nội dung chính -->`;
layoutManager.renderLayout('app-layout', pageContent);
</script>
```

## Kết luận

Layout Module giúp bạn:
- **Viết ít code hơn** (giảm 80% code trùng lặp)
- **Bảo trì dễ hơn** (sửa 1 chỗ, áp dụng toàn bộ)
- **Phát triển nhanh hơn** (tập trung vào logic, không phải UI)
- **Nhất quán hơn** (giao diện đồng nhất)

Hãy bắt đầu sử dụng Layout Module cho các trang mới và dần dần migrate các trang cũ!
