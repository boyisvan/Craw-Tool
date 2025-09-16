class SearchManager {
  constructor() {
    this.searchData = [
      // Quản lý Crawler
      {
        id: 'crawler-management',
        title: 'Quản lý Crawler',
        description: 'Thu thập dữ liệu sản phẩm từ website',
        keywords: ['crawler', 'crawl', 'thu thập', 'dữ liệu', 'sản phẩm', 'crawling', 'scraping'],
        url: '/html/crawler-management.html',
        category: 'Crawler',
        icon: 'bx-data'
      },
      {
        id: 'crawler-dashboard',
        title: 'Dashboard Crawler',
        description: 'Tổng quan hoạt động crawler',
        keywords: ['dashboard', 'tổng quan', 'thống kê', 'overview', 'báo cáo'],
        url: '/html/crawler-dashboard.html',
        category: 'Crawler',
        icon: 'bx-bar-chart-alt-2'
      },
      
      // Quản lý dữ liệu
      {
        id: 'data-export',
        title: 'Xuất dữ liệu',
        description: 'Xuất dữ liệu ra file CSV, Excel',
        keywords: ['export', 'xuất', 'csv', 'excel', 'file', 'download', 'tải'],
        url: '/html/data-export.html',
        category: 'Dữ liệu',
        icon: 'bx-download'
      },
      {
        id: 'bookmark-management',
        title: 'Quản lý Bookmark',
        description: 'Quản lý sản phẩm đã lưu',
        keywords: ['bookmark', 'lưu', 'saved', 'favorite', 'yêu thích', 'quản lý'],
        url: '/html/bookmark-management.html',
        category: 'Dữ liệu',
        icon: 'bx-bookmark'
      },
      
      // Tìm kiếm từ khóa
      {
        id: 'keyword-search',
        title: 'Tìm kiếm từ khóa',
        description: 'Tìm kiếm sản phẩm theo từ khóa',
        keywords: ['keyword', 'từ khóa', 'search', 'tìm kiếm', 'searching', 'query'],
        url: '/html/keyword-search.html',
        category: 'Tìm kiếm',
        icon: 'bx-search'
      },
      {
        id: 'keyword-history',
        title: 'Lịch sử từ khóa',
        description: 'Xem lịch sử tìm kiếm từ khóa',
        keywords: ['history', 'lịch sử', 'log', 'nhật ký', 'từ khóa', 'keyword'],
        url: '/html/keyword-history.html',
        category: 'Tìm kiếm',
        icon: 'bx-history'
      },
      
      // Giám sát
      {
        id: 'site-monitor',
        title: 'Giám sát Website',
        description: 'Theo dõi trạng thái website real-time',
        keywords: ['monitor', 'giám sát', 'theo dõi', 'status', 'trạng thái', 'real-time'],
        url: '/html/site-monitor.html',
        category: 'Giám sát',
        icon: 'bx-monitor'
      },
      
      // Quản lý hệ thống
      {
        id: 'website-management',
        title: 'Quản lý Website',
        description: 'Thêm, sửa, xóa website crawler',
        keywords: ['website', 'quản lý', 'management', 'thêm', 'sửa', 'xóa', 'add', 'edit', 'delete'],
        url: '/html/website-management.html',
        category: 'Hệ thống',
        icon: 'bx-globe'
      },
      {
        id: 'settings',
        title: 'Cài đặt',
        description: 'Cấu hình hệ thống',
        keywords: ['settings', 'cài đặt', 'config', 'cấu hình', 'preferences', 'tùy chọn'],
        url: '/html/settings.html',
        category: 'Hệ thống',
        icon: 'bx-cog'
      }
    ];
    
    this.searchResults = [];
    this.isSearchOpen = false;
  }

  // Tạo HTML cho search box
  generateSearchHTML() {
    return `
      <div class="search-container mb-3">
        <div class="search-box position-relative">
          <input 
            type="text" 
            id="globalSearch" 
            class="form-control" 
            placeholder="Tìm kiếm chức năng..."
            autocomplete="off"
          >
          <i class="bx bx-search search-icon"></i>
          <div id="searchResults" class="search-results"></div>
        </div>
      </div>
    `;
  }

  // Tạo CSS cho search
  generateSearchCSS() {
    return `
      <style>
        .search-container {
          padding: 0 1rem;
        }
        
        .search-box {
          position: relative;
        }
        
        .search-box input {
          padding-left: 2.5rem;
          border-radius: 0.5rem;
          border: 1px solid #d9dee3;
          transition: all 0.3s ease;
        }
        
        .search-box input:focus {
          border-color: #696cff;
          box-shadow: 0 0 0 0.2rem rgba(105, 108, 255, 0.25);
        }
        
        .search-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #a1acb8;
          font-size: 1.1rem;
        }
        
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
    `;
  }

  // Tìm kiếm fuzzy
  fuzzySearch(query, items) {
    if (!query || query.length < 2) return [];
    
    const results = [];
    const queryLower = query.toLowerCase();
    
    items.forEach(item => {
      let score = 0;
      let matchedKeywords = [];
      
      // Kiểm tra title
      if (item.title.toLowerCase().includes(queryLower)) {
        score += 10;
        matchedKeywords.push('title');
      }
      
      // Kiểm tra description
      if (item.description.toLowerCase().includes(queryLower)) {
        score += 5;
        matchedKeywords.push('description');
      }
      
      // Kiểm tra keywords
      item.keywords.forEach(keyword => {
        if (keyword.toLowerCase().includes(queryLower)) {
          score += 3;
          matchedKeywords.push(keyword);
        }
      });
      
      // Kiểm tra category
      if (item.category.toLowerCase().includes(queryLower)) {
        score += 2;
        matchedKeywords.push('category');
      }
      
      if (score > 0) {
        results.push({
          ...item,
          score,
          matchedKeywords
        });
      }
    });
    
    // Sắp xếp theo score giảm dần
    return results.sort((a, b) => b.score - a.score);
  }

  // Highlight text
  highlightText(text, query) {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="search-highlight">$1</span>');
  }

  // Hiển thị kết quả tìm kiếm
  displaySearchResults(results, query) {
    const container = document.getElementById('searchResults');
    console.log('SearchManager: displaySearchResults called with', results.length, 'results');
    
    if (results.length === 0) {
      console.log('SearchManager: No results found, showing no results message');
      container.innerHTML = `
        <div class="no-results">
          <i class="bx bx-search-alt-2 mb-2" style="font-size: 1.5rem;"></i>
          <div>Không tìm thấy kết quả nào</div>
          <small>Thử từ khóa khác</small>
        </div>
      `;
    } else {
      console.log('SearchManager: Displaying', results.length, 'results');
      const html = results.slice(0, 8).map(result => `
        <div class="search-result-item" onclick="searchManager.navigateToResult('${result.id}')">
          <div class="search-result-icon">
            <i class="bx ${result.icon}"></i>
          </div>
          <div class="search-result-content">
            <div class="search-result-title">
              ${this.highlightText(result.title, query)}
            </div>
            <div class="search-result-description">
              ${this.highlightText(result.description, query)}
            </div>
          </div>
          <div class="search-result-category">
            ${result.category}
          </div>
        </div>
      `).join('');
      
      container.innerHTML = html;
    }
    
    console.log('SearchManager: Showing results container');
    container.classList.add('show');
  }

  // Xử lý tìm kiếm
  handleSearch(event) {
    const query = event.target.value.trim();
    console.log('SearchManager: handleSearch called with query:', query);
    
    const resultsContainer = document.getElementById('searchResults');
    console.log('SearchManager: Found results container:', resultsContainer);
    
    if (query.length < 2) {
      console.log('SearchManager: Query too short, hiding results');
      resultsContainer.classList.remove('show');
      return;
    }
    
    console.log('SearchManager: Searching in data:', this.searchData.length, 'items');
    const results = this.fuzzySearch(query, this.searchData);
    console.log('SearchManager: Found results:', results.length);
    this.displaySearchResults(results, query);
  }

  // Điều hướng đến kết quả
  navigateToResult(resultId) {
    const result = this.searchData.find(item => item.id === resultId);
    if (result) {
      window.location.href = result.url;
    }
  }

  // Đóng kết quả tìm kiếm
  closeSearchResults() {
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.classList.remove('show');
  }

  // Khởi tạo search
  initialize() {
    console.log('SearchManager: Initializing...');
    
    // Thêm event listeners
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.navbar-nav')) {
        this.closeSearchResults();
      }
    });
    
    // Tìm search input trong navbar
    const searchInput = document.getElementById('globalSearch');
    console.log('SearchManager: Found search input:', searchInput);
    
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        console.log('SearchManager: Input event triggered:', e.target.value);
        this.handleSearch(e);
      });
      searchInput.addEventListener('focus', () => {
        console.log('SearchManager: Focus event triggered');
        if (searchInput.value.trim().length >= 2) {
          const results = this.fuzzySearch(searchInput.value.trim(), this.searchData);
          this.displaySearchResults(results, searchInput.value.trim());
        }
      });
      console.log('SearchManager: Event listeners added successfully');
    } else {
      console.error('SearchManager: Search input not found!');
    }
  }
}

// Khởi tạo global instance khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', function() {
  window.searchManager = new SearchManager();
  window.searchManager.initialize();
});
