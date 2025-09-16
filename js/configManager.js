/**
 * Config Manager - Quản lý cấu hình website động
 */
const fs = require('fs');
const path = require('path');

class ConfigManager {
  constructor() {
    this.configFile = path.join(__dirname, '..', 'config.js');
    this.websitesFile = path.join(__dirname, '..', 'data', 'websites.json');
    this.defaultConfig = {
      baseUrl: 'https://torunstyle.com',
      productsEndpoint: '/?rest_route=/wc/store/v1/products',
      sites: [
        { key: 'keeptee', name: 'Keeptee', baseUrl: 'https://keeptee.com', banner: 'KEEPTEE CRAWLER' },
        { key: 'torunstyle', name: 'Torunstyle', baseUrl: 'https://torunstyle.com', banner: 'TORUNSTYLE CRAWLER' },
        { key: 'gotyourstyle', name: 'GotYourStyle', baseUrl: 'https://gotyourstyle.com', banner: 'GOTYOURSTYLE CRAWLER' },
        { key: 'midtintee', name: 'Midtintee', baseUrl: 'https://midtintee.com', banner: 'MIDTINTEE CRAWLER' },
        { key: 'growkoc', name: 'GrowKOC', baseUrl: 'https://growkoc.com', banner: 'GROWKOC CRAWLER' },
        { key: 'creativteeshop', name: 'CreativTeeShop', baseUrl: 'https://creativteeshop.com', banner: 'CREATIVTEESHOP CRAWLER' },
        { key: 'inspirdg', name: 'Inspirdg', baseUrl: 'https://inspirdg.com', banner: 'INSPIRDG CRAWLER' },
        { key: 'fanaticity', name: 'Fanaticity', baseUrl: 'https://fanaticity.com', banner: 'FANATICITY CRAWLER' },
        { key: 'brutifulstore', name: 'BrutifulStore', baseUrl: 'https://brutifulstore.com', banner: 'BRUTIFULSTORE CRAWLER' },
        { key: 'fashionssport', name: 'FashionsSport', baseUrl: 'https://fashionssport.com', banner: 'FASHIONSSPORT CRAWLER' },
        { key: 'merchsport', name: 'MerchSport', baseUrl: 'https://merchsport.net', banner: 'MERCHSPORT CRAWLER' },
        { key: 'teleteeshirt', name: 'Teleteeshirt', baseUrl: 'https://teleteeshirt.com/', banner: 'TELETEESHIRT CRAWLER' }
      ],
      defaultConfig: {
        perPage: 100,
        orderBy: 'date',
        order: 'desc',
        maxPages: 10,
        delay: 1000,
      },
      fields: [
        'id', 'name', 'slug', 'permalink', 'sku', 'short_description', 'description',
        'on_sale', 'prices', 'average_rating', 'review_count', 'images', 'categories',
        'tags', 'brands', 'is_purchasable', 'is_in_stock', 'stock_availability'
      ],
      bookmarkFile: './bookmarks.json',
      csvOutputFile: './products.csv',
      stateFile: './crawlState.json',
      dataDir: './data',
      duplicateMessage: 'Phat hien du lieu trung lap! Ban co muon tiep tuc khong?'
    };
  }

  // Lấy danh sách website từ file hoặc config mặc định
  getWebsites() {
    try {
      if (fs.existsSync(this.websitesFile)) {
        const websites = JSON.parse(fs.readFileSync(this.websitesFile, 'utf8'));
        return websites;
      } else {
        // Nếu file không tồn tại, tạo file từ config mặc định
        this.initializeWebsitesFile();
        return this.defaultConfig.sites;
      }
    } catch (error) {
      console.error('Lỗi khi đọc danh sách website:', error);
      return this.defaultConfig.sites;
    }
  }

  // Khởi tạo file websites.json từ config mặc định
  initializeWebsitesFile() {
    try {
      const dataDir = path.dirname(this.websitesFile);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      
      const websitesWithTimestamps = this.defaultConfig.sites.map(site => ({
        ...site,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
      
      fs.writeFileSync(this.websitesFile, JSON.stringify(websitesWithTimestamps, null, 2));
      console.log('✅ Đã khởi tạo file websites.json từ config mặc định');
    } catch (error) {
      console.error('❌ Lỗi khi khởi tạo file websites.json:', error);
    }
  }

  // Lấy cấu hình đầy đủ
  getConfig() {
    const websites = this.getWebsites();
    return {
      ...this.defaultConfig,
      sites: websites
    };
  }

  // Cập nhật danh sách website
  updateWebsites(websites) {
    try {
      const dataDir = path.dirname(this.websitesFile);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      
      fs.writeFileSync(this.websitesFile, JSON.stringify(websites, null, 2));
      console.log('✅ Đã cập nhật danh sách website');
      return true;
    } catch (error) {
      console.error('❌ Lỗi khi cập nhật danh sách website:', error);
      return false;
    }
  }

  // Thêm website mới
  addWebsite(websiteData) {
    try {
      const websites = this.getWebsites();
      
      // Kiểm tra key trùng lặp
      const existingWebsite = websites.find(w => w.key === websiteData.key);
      if (existingWebsite) {
        throw new Error('Website với key này đã tồn tại');
      }
      
      const newWebsite = {
        ...websiteData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      websites.push(newWebsite);
      this.updateWebsites(websites);
      
      return newWebsite;
    } catch (error) {
      throw error;
    }
  }

  // Cập nhật website
  updateWebsite(key, updateData) {
    try {
      const websites = this.getWebsites();
      const websiteIndex = websites.findIndex(w => w.key === key);
      
      if (websiteIndex === -1) {
        throw new Error('Website không tồn tại');
      }
      
      websites[websiteIndex] = {
        ...websites[websiteIndex],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      
      this.updateWebsites(websites);
      return websites[websiteIndex];
    } catch (error) {
      throw error;
    }
  }

  // Xóa website
  deleteWebsite(key) {
    try {
      const websites = this.getWebsites();
      const websiteIndex = websites.findIndex(w => w.key === key);
      
      if (websiteIndex === -1) {
        throw new Error('Website không tồn tại');
      }
      
      const deletedWebsite = websites.splice(websiteIndex, 1)[0];
      this.updateWebsites(websites);
      
      return deletedWebsite;
    } catch (error) {
      throw error;
    }
  }

  // Tìm website theo key
  findWebsite(key) {
    const websites = this.getWebsites();
    return websites.find(w => w.key === key);
  }
}

module.exports = ConfigManager;
