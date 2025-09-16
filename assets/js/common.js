/**
 * Common Utilities - Các function chung cho toàn bộ ứng dụng
 */
class CommonUtils {
  static sites = [];
  static currentSite = null;

  /**
   * Kiểm tra trạng thái đăng nhập
   */
  static checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      window.location.href = '/';
    }
  }

  /**
   * Đăng xuất
   */
  static logout() {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('username');
      window.location.href = '/';
    }
  }

  /**
   * Load danh sách sites từ API
   */
  static async loadSites() {
    try {
      const response = await fetch('/api/sites');
      const data = await response.json();
      
      if (data.success) {
        this.sites = data.data;
        return this.sites;
      }
      return [];
    } catch (error) {
      console.error('Error loading sites:', error);
      this.showAlert('Lỗi khi tải danh sách website', 'error');
      return [];
    }
  }

  /**
   * Populate site select dropdown
   */
  static populateSiteSelect(selectId, includeEmpty = true) {
    const select = document.getElementById(selectId);
    if (!select) return;

    select.innerHTML = includeEmpty ? '<option value="">Chọn website...</option>' : '';
    
    this.sites.forEach(site => {
      const option = document.createElement('option');
      option.value = site.key;
      option.textContent = `${site.name} (${site.baseUrl})`;
      select.appendChild(option);
    });
  }

  /**
   * Populate multiple site selects
   */
  static populateSiteSelects(selectIds, includeEmpty = true) {
    selectIds.forEach(selectId => {
      this.populateSiteSelect(selectId, includeEmpty);
    });
  }

  /**
   * Change site và test connection
   */
  static async changeSite(siteKey, statusElementId = null) {
    if (!siteKey) {
      this.currentSite = null;
      if (statusElementId) {
        this.updateConnectionStatus('Chưa chọn website', 'secondary', statusElementId);
      }
      return;
    }

    this.currentSite = this.sites.find(s => s.key === siteKey);
    if (statusElementId) {
      this.updateConnectionStatus('Đang kiểm tra...', 'warning', statusElementId);
    }
    
    try {
      const response = await fetch(`/api/test-connection?siteKey=${siteKey}`);
      const data = await response.json();
      
      if (data.success) {
        if (data.data.connected) {
          if (statusElementId) {
            this.updateConnectionStatus('Kết nối thành công', 'success', statusElementId);
          }
          return true;
        } else {
          if (statusElementId) {
            this.updateConnectionStatus('Không thể kết nối', 'danger', statusElementId);
          }
          return false;
        }
      } else {
        if (statusElementId) {
          this.updateConnectionStatus('Lỗi kết nối', 'danger', statusElementId);
        }
        return false;
      }
    } catch (error) {
      console.error('Error testing connection:', error);
      if (statusElementId) {
        this.updateConnectionStatus('Lỗi kết nối', 'danger', statusElementId);
      }
      return false;
    }
  }

  /**
   * Update connection status
   */
  static updateConnectionStatus(message, type, elementId) {
    const status = document.getElementById(elementId);
    if (status) {
      status.innerHTML = `<span class="badge bg-${type}">${message}</span>`;
    }
  }

  /**
   * Show alert message
   */
  static showAlert(message, type = 'info', duration = 5000) {
    const alertContainer = document.createElement('div');
    alertContainer.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertContainer.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    
    const iconMap = {
      'success': 'check-circle',
      'error': 'error-circle',
      'warning': 'error',
      'info': 'info-circle'
    };
    
    alertContainer.innerHTML = `
      <i class="bx bx-${iconMap[type] || 'info-circle'} me-2"></i>
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    document.body.appendChild(alertContainer);
    
    // Auto remove after specified duration
    setTimeout(() => {
      if (alertContainer.parentNode) {
        alertContainer.parentNode.removeChild(alertContainer);
      }
    }, duration);
  }

  /**
   * Show loading spinner
   */
  static showLoading(containerId, message = 'Đang tải...') {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = `
        <div class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">${message}</span>
          </div>
          <p class="mt-2 text-muted">${message}</p>
        </div>
      `;
    }
  }

  /**
   * Show empty state
   */
  static showEmptyState(containerId, icon = 'bx-file-blank', title = 'Không có dữ liệu', message = 'Chưa có dữ liệu để hiển thị') {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = `
        <div class="text-center py-4">
          <i class="bx ${icon} text-muted" style="font-size: 3rem;"></i>
          <p class="mt-2 text-muted">${title}</p>
          <small class="text-muted">${message}</small>
        </div>
      `;
    }
  }

  /**
   * Format date to Vietnamese locale
   */
  static formatDate(date) {
    return new Date(date).toLocaleString('vi-VN');
  }

  /**
   * Get time ago string
   */
  static getTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
    
    if (diffInSeconds < 60) return 'Vừa xong';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
  }

  /**
   * Format number with thousand separator
   */
  static formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  /**
   * Debounce function
   */
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Throttle function
   */
  static throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Copy text to clipboard
   */
  static async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      this.showAlert('Đã sao chép vào clipboard!', 'success');
    } catch (err) {
      console.error('Failed to copy: ', err);
      this.showAlert('Không thể sao chép', 'error');
    }
  }

  /**
   * Download file
   */
  static downloadFile(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Validate email
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate URL
   */
  static isValidURL(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  /**
   * Generate random ID
   */
  static generateId(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Local storage helpers
   */
  static setStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  static getStorage(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  }

  static removeStorage(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }
}

// Export for use in other files
window.CommonUtils = CommonUtils;

// Heart Click Effect - by ducvancoder - 0587282880
!function(e,t,a){function n(){c(".heart{width: 10px;height: 10px;position: fixed;background: #f00;transform: rotate(45deg);-webkit-transform: rotate(45deg);-moz-transform: rotate(45deg);}.heart:after,.heart:before{content: '';width: inherit;height: inherit;background: inherit;border-radius: 50%;-webkit-border-radius: 50%;-moz-border-radius: 50%;position: fixed;}.heart:after{top: -5px;}.heart:before{left: -5px;}"),o(),r()}function r(){for(var e=0;e<d.length;e++)d[e].alpha<=0?(t.body.removeChild(d[e].el),d.splice(e,1)):(d[e].y--,d[e].scale+=.004,d[e].alpha-=.013,d[e].el.style.cssText="left:"+d[e].x+"px;top:"+d[e].y+"px;opacity:"+d[e].alpha+";transform:scale("+d[e].scale+","+d[e].scale+") rotate(45deg);background:"+d[e].color+";z-index:99999");requestAnimationFrame(r)}function o(){var t="function"==typeof e.onclick&&e.onclick;e.onclick=function(e){t&&t(),i(e)}}function i(e){var a=t.createElement("div");a.className="heart",d.push({el:a,x:e.clientX-5,y:e.clientY-5,scale:1,alpha:1,color:s()}),t.body.appendChild(a)}function c(e){var a=t.createElement("style");a.type="text/css";try{a.appendChild(t.createTextNode(e))}catch(t){a.styleSheet.cssText=e}t.getElementsByTagName("head")[0].appendChild(a)}function s(){return"rgb("+~~(255*Math.random())+","+~~(255*Math.random())+","+~~(255*Math.random())+")"}var d=[];e.requestAnimationFrame=function(){return e.requestAnimationFrame||e.webkitRequestAnimationFrame||e.mozRequestAnimationFrame||e.oRequestAnimationFrame||e.msRequestAnimationFrame||function(e){setTimeout(e,1e3/60)}}(),n()}(window,document);