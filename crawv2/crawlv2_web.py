#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CrawlV2 Web Integration Script
Tích hợp với Node.js server để thu thập dữ liệu sản phẩm
"""

import requests
from bs4 import BeautifulSoup
import sys
import time
import csv
import os
import json
import argparse
from datetime import datetime
import platform
from pathlib import Path

# Fix encoding issues on Windows
if platform.system() == "Windows":
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.detach())
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.detach())

class Colors:
    """Màu sắc cho console output"""
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    PURPLE = '\033[95m'
    CYAN = '\033[96m'
    WHITE = '\033[97m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'
    END = '\033[0m'

class CrawlV2Web:
    """Class chính để thu thập dữ liệu sản phẩm"""
    
    def __init__(self, config_name, start_page=1, max_pages=10, crawl_id=None, real_time=True):
        self.config_name = config_name
        self.start_page = start_page
        self.max_pages = max_pages
        self.crawl_id = crawl_id or f"crawl_{int(time.time())}"
        self.real_time = real_time
        self.products_found = 0
        self.current_page = start_page
        
        # Load configuration
        self.config = self.load_config()
        if not self.config:
            raise ValueError(f"Không tìm thấy cấu hình: {config_name}")
        
        # Setup paths
        self.base_dir = Path(__file__).parent
        self.downloads_dir = self.base_dir / 'downloads'
        self.downloads_dir.mkdir(exist_ok=True)
        
        # Generate output filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.output_filename = f"{config_name.lower()}_products_{timestamp}.csv"
        self.output_path = self.downloads_dir / self.output_filename
        
        # Mobile User-Agent
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        }
        
        self.session = requests.Session()
        self.session.headers.update(self.headers)
        
        print(f"[CRAWL V2] Khoi tao thu thap du lieu")
        print(f"[CRAWL V2] Cau hinh: {self.config_name}")
        print(f"[CRAWL V2] Trang: {start_page} - {max_pages}")
        print(f"[CRAWL V2] Real-time: {'Co' if real_time else 'Khong'}")
        print(f"[CRAWL V2] File output: {self.output_filename}")
        print()
    
    def load_config(self):
        """Tải cấu hình từ file JSON"""
        config_file = self.base_dir / 'websites_config.json'
        
        if not config_file.exists():
            print(f"[ERROR] Khong tim thay file cau hinh: {config_file}")
            return None
        
        try:
            with open(config_file, 'r', encoding='utf-8') as f:
                configs = json.load(f)
            
            if self.config_name not in configs:
                print(f"[ERROR] Khong tim thay cau hinh: {self.config_name}")
                return None
            
            return configs[self.config_name]
        except Exception as e:
            print(f"[ERROR] Loi khi tai cau hinh: {e}")
            return None
    
    def update_progress(self, page, total_pages, products_count):
        """Cập nhật tiến trình"""
        self.current_page = page
        self.products_found = products_count
        
        # Update active crawls file
        self.update_active_crawls()
        
        # Print progress
        percentage = (page - self.start_page + 1) / (total_pages - self.start_page + 1) * 100
        bar_length = 30
        filled_length = int(bar_length * (page - self.start_page + 1) // (total_pages - self.start_page + 1))
        bar = '=' * filled_length + '-' * (bar_length - filled_length)
        
        print(f"\r[TIEN TRINH] |{bar}| {percentage:.1f}% Trang {page}/{total_pages} - {products_count} san pham", end='', flush=True)
    
    def update_active_crawls(self):
        """Cập nhật file active crawls"""
        try:
            active_file = self.base_dir / 'active_crawls.json'
            
            # Load existing active crawls
            if active_file.exists():
                with open(active_file, 'r', encoding='utf-8') as f:
                    active_crawls = json.load(f)
            else:
                active_crawls = []
            
            # Find and update current crawl
            for i, crawl in enumerate(active_crawls):
                if crawl.get('id') == self.crawl_id:
                    active_crawls[i]['current_page'] = self.current_page
                    active_crawls[i]['products_found'] = self.products_found
                    break
            
            # Save updated active crawls
            with open(active_file, 'w', encoding='utf-8') as f:
                json.dump(active_crawls, f, indent=2, ensure_ascii=False)
                
        except Exception as e:
            print(f"[WARNING] Khong the cap nhat tien trinh: {e}")
    
    def save_product_realtime(self, product, stt):
        """Lưu sản phẩm real-time vào CSV"""
        if not self.real_time:
            return
        
        try:
            file_exists = self.output_path.exists()
            with open(self.output_path, 'a', newline='', encoding='utf-8') as csvfile:
                fieldnames = ['stt', 'ten_san_pham', 'link_anh', 'thoi_gian_crawl']
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                
                if not file_exists:
                    writer.writeheader()
                
                writer.writerow({
                    'stt': stt,
                    'ten_san_pham': product['text'],
                    'link_anh': product['href'],
                    'thoi_gian_crawl': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                })
        except Exception as e:
            print(f"[ERROR] Loi khi luu san pham real-time: {e}")
    
    def crawl_products(self):
        """Thu thập dữ liệu sản phẩm"""
        print(f"[INFO] Bat dau thu thap du lieu tu {self.config['base_url']}")
        print()
        
        total_pages = self.max_pages - self.start_page + 1
        stt_counter = 1
        
        for page in range(self.start_page, self.max_pages + 1):
            try:
                # Build URL for current page
                if page == 1:
                    url = self.config['base_url']
                else:
                    url = self.config['page_url_template'].format(page=page)
                
                # Update progress
                self.update_progress(page, self.max_pages, self.products_found)
                
                # Make request
                response = self.session.get(url, timeout=10)
                response.raise_for_status()
                
                # Check if page is HTML
                if 'text/html' not in response.headers.get('Content-Type', ''):
                    print(f"\n{Colors.YELLOW}[WARNING]{Colors.END} Trang {page} không phải HTML: {response.headers.get('Content-Type')}")
                    break
                
                # Parse HTML
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Find product images
                try:
                    img_elements = soup.select(self.config['img_selector'])
                except Exception as e:
                    print(f"\n{Colors.YELLOW}[WARNING]{Colors.END} Lỗi khi sử dụng selector '{self.config['img_selector']}': {e}")
                    img_elements = soup.find_all('img', class_='attachment-woocommerce_thumbnail')
                
                if not img_elements:
                    print(f"\n{Colors.YELLOW}[WARNING]{Colors.END} Không tìm thấy ảnh sản phẩm ở trang {page}, dừng thu thập")
                    break
                
                page_products = 0
                
                for img in img_elements:
                    # Get image attributes
                    img_src = img.get(self.config.get('img_src_attr', 'src'))
                    img_alt = img.get(self.config.get('img_alt_attr', 'alt'), '')
                    
                    if img_src:
                        # Create product object
                        product = {
                            'href': img_src,
                            'text': img_alt
                        }
                        
                        # Save real-time if enabled
                        self.save_product_realtime(product, stt_counter)
                        
                        self.products_found += 1
                        page_products += 1
                        stt_counter += 1
                
                print(f"\n{Colors.GREEN}[SUCCESS]{Colors.END} Trang {page}: tìm thấy {page_products} sản phẩm")
                
            except requests.Timeout:
                print(f"\n{Colors.RED}[ERROR]{Colors.END} Timeout khi truy cập trang {page}")
                break
            except requests.ConnectionError:
                print(f"\n{Colors.RED}[ERROR]{Colors.END} Lỗi kết nối khi truy cập trang {page}")
                break
            except requests.RequestException as e:
                print(f"\n{Colors.RED}[ERROR]{Colors.END} Lỗi khi truy cập trang {page}: {e}")
                break
            except Exception as e:
                print(f"\n{Colors.RED}[ERROR]{Colors.END} Lỗi không xác định ở trang {page}: {e}")
                break
            
            # Small delay to avoid spamming server
            time.sleep(0.5)
        
        print(f"\n{Colors.CYAN}[CRAWL V2]{Colors.END} Hoàn thành thu thập dữ liệu!")
        print(f"{Colors.CYAN}[CRAWL V2]{Colors.END} Tổng sản phẩm: {self.products_found}")
        print(f"{Colors.CYAN}[CRAWL V2]{Colors.END} File output: {self.output_path}")
        
        # Add to download history
        self.add_to_download_history()
        
        return self.products_found
    
    def add_to_download_history(self):
        """Thêm vào lịch sử tải xuống"""
        try:
            history_file = self.base_dir / 'download_history.json'
            
            # Load existing history
            if history_file.exists():
                with open(history_file, 'r', encoding='utf-8') as f:
                    history = json.load(f)
            else:
                history = []
            
            # Get file size
            file_size = "N/A"
            if self.output_path.exists():
                size_bytes = self.output_path.stat().st_size
                if size_bytes < 1024:
                    file_size = f"{size_bytes} B"
                elif size_bytes < 1024 * 1024:
                    file_size = f"{size_bytes / 1024:.1f} KB"
                else:
                    file_size = f"{size_bytes / (1024 * 1024):.1f} MB"
            
            # Add new record
            record = {
                'filename': self.output_filename,
                'website': self.config_name,
                'product_count': self.products_found,
                'created_at': datetime.now().isoformat(),
                'size': file_size
            }
            
            history.insert(0, record)  # Add to beginning
            
            # Save history
            with open(history_file, 'w', encoding='utf-8') as f:
                json.dump(history, f, indent=2, ensure_ascii=False)
                
            print(f"{Colors.GREEN}[SUCCESS]{Colors.END} Đã thêm vào lịch sử tải xuống")
            
        except Exception as e:
            print(f"{Colors.YELLOW}[WARNING]{Colors.END} Không thể thêm vào lịch sử tải xuống: {e}")

def main():
    """Hàm chính"""
    parser = argparse.ArgumentParser(description='CrawlV2 Web Integration')
    parser.add_argument('--config-name', required=True, help='Tên cấu hình')
    parser.add_argument('--start-page', type=int, default=1, help='Trang bắt đầu')
    parser.add_argument('--max-pages', type=int, default=10, help='Trang kết thúc')
    parser.add_argument('--crawl-id', help='ID phiên crawl')
    parser.add_argument('--real-time', type=bool, default=True, help='Lưu real-time')
    
    args = parser.parse_args()
    
    try:
        # Create crawler instance
        crawler = CrawlV2Web(
            config_name=args.config_name,
            start_page=args.start_page,
            max_pages=args.max_pages,
            crawl_id=args.crawl_id,
            real_time=args.real_time
        )
        
        # Start crawling
        products_count = crawler.crawl_products()
        
        # Exit with success code
        sys.exit(0)
        
    except KeyboardInterrupt:
        print(f"\n{Colors.YELLOW}[WARNING]{Colors.END} Chương trình bị dừng bởi người dùng")
        sys.exit(1)
    except Exception as e:
        print(f"\n{Colors.RED}[ERROR]{Colors.END} Lỗi không xác định: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
