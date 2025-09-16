/**
 * Sidebar Management - Quản lý menu sidebar chung
 */
class SidebarManager {
  constructor() {
    this.currentPage = this.getCurrentPage();
    this.menuItems = [
      {
        id: 'dashboard',
        title: 'Dashboard',
        icon: 'bx-home-smile',
        url: '/html/crawler-dashboard.html',
        active: false
      },
      {
        id: 'crawler-management',
        title: 'Quản lý Crawler',
        icon: 'bx-data',
        url: null,
        active: false,
        submenu: [
          {
            id: 'crawler-management',
            title: 'Thu thập dữ liệu',
            url: '/html/crawler-management.html'
          },
          {
            id: 'crawler-v2',
            title: 'Thu thập dữ liệu v2',
            url: '/html/crawler-v2.html'
          },
          {
            id: 'keyword-search',
            title: 'Tìm kiếm từ khóa',
            url: '/html/keyword-search.html'
          },
          {
            id: 'site-monitor',
            title: 'Giám sát website',
            url: '/html/site-monitor.html'
          }
        ]
      },
      {
        id: 'data-management',
        title: 'Quản lý dữ liệu',
        icon: 'bx-table',
        url: null,
        active: false,
        submenu: [
          {
            id: 'data-export',
            title: 'Xuất dữ liệu',
            url: '/html/data-export.html'
          },
          {
            id: 'bookmark-management',
            title: 'Quản lý bookmark',
            url: '/html/bookmark-management.html'
          },
          {
            id: 'keyword-history',
            title: 'Lịch sử từ khóa',
            url: '/html/keyword-history.html'
          }
        ]
      },
      {
        id: 'website-management',
        title: 'Quản lý Website',
        icon: 'bx-globe',
        url: '/html/website-management.html',
        active: false
      },
      {
        id: 'settings',
        title: 'Cài đặt',
        icon: 'bx-cog',
        url: '/html/settings.html',
        active: false
      },
      {
        id: 'documentation',
        title: 'Tài liệu hướng dẫn',
        icon: 'bx-book-open',
        url: '/html/documentation.html',
        active: false
      }
    ];
  }

  getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    return filename.replace('.html', '');
  }

  generateSidebarHTML() {
    let html = `
      <aside id="layout-menu" class="layout-menu menu-vertical menu bg-menu-theme">
        <div class="app-brand demo">
          <a href="/html/crawler-dashboard.html" class="app-brand-link">
            <span class="app-brand-logo demo">
              <span class="text-primary">
                <i class="bx bx-data icon-lg"></i>
              </span>
            </span>
            <span class="app-brand-text demo menu-text fw-bold ms-2">Crawler Tool</span>
          </a>

          <a href="javascript:void(0);" class="layout-menu-toggle menu-link text-large ms-auto">
            <i class="bx bx-chevron-left d-block d-xl-none align-middle"></i>
          </a>
        </div>

        <div class="menu-divider mt-0"></div>
        <div class="menu-inner-shadow"></div>

        <ul class="menu-inner py-1">
    `;

    this.menuItems.forEach(item => {
      const isActive = this.currentPage === item.id;
      const hasSubmenu = item.submenu && item.submenu.length > 0;

      if (hasSubmenu) {
        html += `
          <li class="menu-item ${isActive ? 'active' : ''}">
            <a href="javascript:void(0);" class="menu-link menu-toggle">
              <i class="menu-icon tf-icons bx ${item.icon}"></i>
              <div class="text-truncate">${item.title}</div>
            </a>
            <ul class="menu-sub">
        `;

        item.submenu.forEach(subItem => {
          const isSubActive = this.currentPage === subItem.id;
          html += `
            <li class="menu-item ${isSubActive ? 'active' : ''}">
              <a href="${subItem.url}" class="menu-link">
                <div class="text-truncate">${subItem.title}</div>
              </a>
            </li>
          `;
        });

        html += `
            </ul>
          </li>
        `;
      } else {
        html += `
          <li class="menu-item ${isActive ? 'active' : ''}">
            <a href="${item.url}" class="menu-link">
              <i class="menu-icon tf-icons bx ${item.icon}"></i>
              <div class="text-truncate">${item.title}</div>
            </a>
          </li>
        `;
      }
    });

    html += `
        </ul>
      </aside>
    `;

    return html;
  }

  generateNavbarHTML() {
    return `
      <nav class="layout-navbar container-xxl navbar-detached navbar navbar-expand-xl align-items-center bg-navbar-theme" id="layout-navbar">
        <div class="layout-menu-toggle navbar-nav align-items-xl-center me-4 me-xl-0 d-xl-none">
          <a class="nav-item nav-link px-0 me-xl-6" href="javascript:void(0)">
            <i class="icon-base bx bx-menu icon-md"></i>
          </a>
        </div>

        <div class="navbar-nav-right d-flex align-items-center justify-content-end" id="navbar-collapse">
          <!-- Search -->
          <div class="navbar-nav align-items-center me-auto">
            <div class="nav-item d-flex align-items-center position-relative">
              <span class="w-px-22 h-px-22"><i class="icon-base bx bx-search icon-md"></i></span>
              <input
                type="text"
                id="globalSearch"
                class="form-control border-0 shadow-none ps-1 ps-sm-2"
                placeholder="Tìm kiếm chức năng..."
                aria-label="Search..."
                autocomplete="off" />
              <div id="searchResults" class="search-results"></div>
            </div>
          </div>
          <!-- /Search -->

          <ul class="navbar-nav flex-row align-items-center ms-md-auto">
            <!-- User -->
            <li class="nav-item navbar-dropdown dropdown-user dropdown">
              <a
                class="nav-link dropdown-toggle hide-arrow p-0"
                href="javascript:void(0);"
                data-bs-toggle="dropdown">
                <div class="avatar avatar-online">
                  <img src="../assets/img/avatars/1.png" alt class="w-px-40 h-auto rounded-circle" />
                </div>
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <a class="dropdown-item" href="#">
                    <div class="d-flex">
                      <div class="flex-shrink-0 me-3">
                        <div class="avatar avatar-online">
                          <img src="../assets/img/avatars/1.png" alt class="w-px-40 h-auto rounded-circle" />
                        </div>
                      </div>
                      <div class="flex-grow-1">
                        <h6 class="mb-0">Admin</h6>
                        <small class="text-body-secondary">Quản trị viên</small>
                      </div>
                    </div>
                  </a>
                </li>
                <li>
                  <div class="dropdown-divider my-1"></div>
                </li>
                <li>
                  <a class="dropdown-item" href="#">
                    <i class="icon-base bx bx-user icon-md me-3"></i><span>Hồ sơ</span>
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#">
                    <i class="icon-base bx bx-cog icon-md me-3"></i><span>Cài đặt</span>
                  </a>
                </li>
                <li>
                  <div class="dropdown-divider my-1"></div>
                </li>
                <li>
                  <a class="dropdown-item" href="javascript:void(0);" onclick="CommonUtils.logout()">
                    <i class="icon-base bx bx-power-off icon-md me-3"></i><span>Đăng xuất</span>
                  </a>
                </li>
              </ul>
            </li>
            <!--/ User -->
          </ul>
        </div>
      </nav>
    `;
  }

  generateFooterHTML() {
    return `
      <footer class="content-footer footer bg-footer-theme">
        <div class="container-xxl">
          <div class="footer-container d-flex align-items-center justify-content-between py-4 flex-md-row flex-column">
            <div class="mb-2 mb-md-0">
              ©
              <script>
                document.write(new Date().getFullYear());
              </script>
              , made with ❤️ by
              <a href="https://facebook.com/vawnnnn" target="_blank" class="footer-link">dvcoder-trumpany</a>
            </div>
            <div class="d-none d-lg-inline-block">
              <a href="#" class="footer-link me-4">Hỗ trợ</a>
              <a href="#" class="footer-link me-4">Tài liệu</a>
              <a href="#" class="footer-link">Liên hệ</a>
            </div>
          </div>
        </div>
      </footer>
    `;
  }

  generateCoreScripts() {
    return `
      <!-- Search CSS -->
      <style>
        .menu-sub {
          display: none;
        }
        .menu-item.open .menu-sub {
          display: block;
        }
        .menu-toggle {
          cursor: pointer;
        }
        
        /* Search Results Styles */
        .search-results {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #d9dee3;
          border-radius: 0.5rem;
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
          max-height: 300px;
          overflow-y: auto;
          z-index: 1000;
          display: none;
          margin-top: 0.25rem;
        }
        
        .search-results.show {
          display: block;
        }
        
        .search-result-item {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #f5f5f9;
          cursor: pointer;
          transition: background-color 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .search-result-item:hover {
          background-color: #f8f9fa;
        }
        
        .search-result-item:last-child {
          border-bottom: none;
        }
        
        .search-result-icon {
          width: 2rem;
          height: 2rem;
          border-radius: 0.375rem;
          background-color: #696cff;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          flex-shrink: 0;
        }
        
        .search-result-content {
          flex: 1;
          min-width: 0;
        }
        
        .search-result-title {
          font-weight: 600;
          color: #566a7f;
          margin-bottom: 0.25rem;
          font-size: 0.875rem;
        }
        
        .search-result-description {
          color: #a1acb8;
          font-size: 0.75rem;
          line-height: 1.4;
        }
        
        .search-result-category {
          background-color: #e7e7ff;
          color: #696cff;
          padding: 0.125rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.625rem;
          font-weight: 500;
          margin-left: auto;
          flex-shrink: 0;
        }
        
        .no-results {
          padding: 1rem;
          text-align: center;
          color: #a1acb8;
          font-size: 0.875rem;
        }
        
        .search-highlight {
          background-color: #fff3cd;
          color: #856404;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-weight: 600;
        }
      </style>
      
      <!-- Core JS -->
      <script src="../assets/vendor/libs/jquery/jquery.js"></script>
      <script src="../assets/vendor/libs/popper/popper.js"></script>
      <script src="../assets/vendor/js/bootstrap.js"></script>
      <script src="../assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js"></script>
      <script src="../assets/vendor/js/menu.js"></script>
      <script src="../assets/js/main.js"></script>
      <script src="../assets/js/common.js"></script>
      <script src="../assets/js/searchManager.js"></script>
      
      <!-- Menu Toggle Script -->
      <script>
        // Initialize menu toggle functionality
        document.addEventListener('DOMContentLoaded', function() {
          // Handle menu toggle clicks
          document.addEventListener('click', function(e) {
            if (e.target.closest('.menu-toggle')) {
              e.preventDefault();
              const menuItem = e.target.closest('.menu-item');
              const menuSub = menuItem.querySelector('.menu-sub');
              
              if (menuSub) {
                // Toggle active class
                menuItem.classList.toggle('open');
                
                // Close other open menus
                const allMenuItems = document.querySelectorAll('.menu-item');
                allMenuItems.forEach(item => {
                  if (item !== menuItem && item.classList.contains('open')) {
                    item.classList.remove('open');
                  }
                });
              }
            }
          });
          
          // Search functionality is initialized in searchManager.js
        });
      </script>
    `;
  }

  generateHeadHTML(title, description) {
    return `
      <head>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0" />

        <title>${title}</title>

        <meta name="description" content="${description}" />

        <!-- Favicon -->
        <link rel="icon" type="image/x-icon" href="../assets/img/favicon/favicon.ico" />

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap"
          rel="stylesheet" />

        <link rel="stylesheet" href="../assets/vendor/fonts/iconify-icons.css" />

        <!-- Core CSS -->
        <link rel="stylesheet" href="../assets/vendor/css/core.css" />
        <link rel="stylesheet" href="../assets/css/demo.css" />

        <!-- Vendors CSS -->
        <link rel="stylesheet" href="../assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css" />
        <link rel="stylesheet" href="../assets/vendor/libs/apex-charts/apex-charts.css" />

        <!-- Helpers -->
        <script src="../assets/vendor/js/helpers.js"></script>
        <script src="../assets/js/config.js"></script>
        
        <!-- Menu Toggle CSS -->
        <style>
          .menu-sub {
            display: none;
          }
          .menu-item.open .menu-sub {
            display: block;
          }
          .menu-toggle {
            cursor: pointer;
          }
        </style>
      </head>
    `;
  }

  generatePageTemplate(title, description, content) {
    return `<!doctype html>

<html
  lang="vi"
  class="layout-menu-fixed layout-compact"
  data-assets-path="../assets/"
  data-template="vertical-menu-template-free">
  ${this.generateHeadHTML(title, description)}
  <body>
    <!-- Layout wrapper -->
    <div class="layout-wrapper layout-content-navbar">
      <div class="layout-container">
        <!-- Menu -->
        ${this.generateSidebarHTML()}
        <!-- / Menu -->

        <!-- Layout container -->
        <div class="layout-page">
          <!-- Navbar -->
          ${this.generateNavbarHTML()}
          <!-- / Navbar -->

          <!-- Content wrapper -->
          <div class="content-wrapper">
            <!-- Content -->
            <div class="container-xxl flex-grow-1 container-p-y">
              ${content}
            </div>
            <!-- / Content -->

            <!-- Footer -->
            ${this.generateFooterHTML()}
            <!-- / Footer -->

            <div class="content-backdrop fade"></div>
          </div>
          <!-- Content wrapper -->
        </div>
        <!-- / Layout page -->
      </div>

      <!-- Overlay -->
      <div class="layout-overlay layout-menu-toggle"></div>
    </div>
    <!-- / Layout wrapper -->

    ${this.generateCoreScripts()}

    <!-- Page JS -->
    <script>
      // Check login status on page load
      document.addEventListener('DOMContentLoaded', function() {
        CommonUtils.checkLoginStatus();
      });
    </script>
  </body>
</html>`;
  }
}

// Export for use in other files
window.SidebarManager = SidebarManager;
