import requests
from bs4 import BeautifulSoup
import sys
import time
import csv
import os
from datetime import datetime
import platform

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

class ConsoleUI:
    """Class quản lý giao diện console"""
    
    @staticmethod
    def clear_console():
        """Xóa màn hình console"""
        if platform.system() == "Windows":
            os.system('cls')
        else:
            os.system('clear')
    
    @staticmethod
    def animate_text(text, delay=0.05, color=Colors.WHITE):
        """Hiệu ứng chữ chạy hiện dần"""
        for char in text:
            print(f"{color}{char}{Colors.END}", end='', flush=True)
            time.sleep(delay)
        print()
    
    @staticmethod
    def print_banner(website_name="TRUMPANY", website_url="https://teleteeshirt.com"):
        """In banner đẹp với hiệu ứng chữ chạy"""
        ConsoleUI.clear_console()
        
        # Vẽ khung trên
        print(f"{Colors.CYAN}{'╔' + '═' * 78 + '╗'}{Colors.END}")
        
        # Dòng trống
        print(f"{Colors.CYAN}{'║' + ' ' * 78 + '║'}{Colors.END}")
        
        # Tên tool với hiệu ứng
        print(f"{Colors.CYAN}{'║'}{Colors.END}", end='')
        ConsoleUI.animate_text(f"{' ' * 25}{website_name} - Tool Crawl{' ' * 25}", 0.03, Colors.BOLD + Colors.WHITE)
        print(f"{Colors.CYAN}{'║'}{Colors.END}")
        
        # Dòng trống
        print(f"{Colors.CYAN}{'║' + ' ' * 78 + '║'}{Colors.END}")
        
        # Thông tin website
        print(f"{Colors.CYAN}{'║'}{Colors.END}", end='')
        ConsoleUI.animate_text(f"{' ' * 20}Website: {website_url}{' ' * 20}", 0.02, Colors.YELLOW)
        print(f"{Colors.CYAN}{'║'}{Colors.END}")
        
        # Dòng trống
        print(f"{Colors.CYAN}{'║' + ' ' * 78 + '║'}{Colors.END}")
        
        # Vẽ khung dưới
        print(f"{Colors.CYAN}{'╚' + '═' * 78 + '╝'}{Colors.END}")
        print()
    
    @staticmethod
    def print_header():
        """In header của ứng dụng (giữ lại cho tương thích)"""
        ConsoleUI.print_banner()
    
    @staticmethod
    def print_success(message):
        """In thông báo thành công"""
        print(f"{Colors.GREEN}[THANH CONG]{Colors.END} {message}")
    
    @staticmethod
    def print_error(message):
        """In thông báo lỗi"""
        print(f"{Colors.RED}[LOI]{Colors.END} {message}")
    
    @staticmethod
    def print_warning(message):
        """In thông báo cảnh báo"""
        print(f"{Colors.YELLOW}[CANH BAO]{Colors.END} {message}")
    
    @staticmethod
    def print_info(message):
        """In thông báo thông tin"""
        print(f"{Colors.BLUE}[THONG TIN]{Colors.END} {message}")
    
    @staticmethod
    def print_progress(current, total, message=""):
        """In thanh tiến trình"""
        percentage = (current / total) * 100
        bar_length = 30
        filled_length = int(bar_length * current // total)
        bar = '█' * filled_length + '-' * (bar_length - filled_length)
        print(f"\r{Colors.PURPLE}[TIEN TRINH]{Colors.END} |{bar}| {percentage:.1f}% {message}", end='', flush=True)
    
    @staticmethod
    def print_separator():
        """In đường phân cách"""
        print(f"{Colors.CYAN}{'-'*60}{Colors.END}")
    
    @staticmethod
    def get_user_input(prompt):
        """Lấy input từ người dùng với màu sắc"""
        return input(f"{Colors.BLUE}{prompt}{Colors.END}")
    
    @staticmethod
    def print_menu():
        """In menu lựa chọn"""
        print(f"{Colors.BOLD}{Colors.WHITE}MENU LUA CHON:{Colors.END}")
        print(f"{Colors.CYAN}1.{Colors.END} Chon so trang bat dau")
        print(f"{Colors.CYAN}2.{Colors.END} Chon so trang ket thuc")
        print(f"{Colors.CYAN}3.{Colors.END} Su dung cau hinh mac dinh (trang 1-10)")
        print(f"{Colors.CYAN}4.{Colors.END} Quan ly link danh dau")
        print(f"{Colors.CYAN}5.{Colors.END} Dat link danh dau trong crawled_links.csv")
        print(f"{Colors.CYAN}6.{Colors.END} Chon website de crawl")
        print(f"{Colors.CYAN}7.{Colors.END} Quan ly cau hinh website")
        print(f"{Colors.CYAN}8.{Colors.END} Thoat chuong trinh")
        print()

def load_bookmarked_links(filename="bookmarked_links.txt"):
    """Tải danh sách link đánh dấu từ file"""
    bookmarked_links = set()
    if os.path.exists(filename):
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                for line in f:
                    link = line.strip()
                    if link:
                        bookmarked_links.add(link)
            ConsoleUI.print_info(f"Da tai {len(bookmarked_links)} link danh dau tu file {filename}")
        except Exception as e:
            ConsoleUI.print_warning(f"Khong the tai file {filename}: {str(e)}")
    return bookmarked_links

def save_bookmarked_links(links, filename="bookmarked_links.txt"):
    """Lưu danh sách link đánh dấu vào file"""
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            for link in sorted(links):
                f.write(link + '\n')
        ConsoleUI.print_success(f"Da luu {len(links)} link danh dau vao file {filename}")
        return True
    except Exception as e:
        ConsoleUI.print_error(f"Loi khi luu link danh dau: {str(e)}")
        return False

def manage_bookmarked_links():
    """Quản lý link đánh dấu"""
    bookmarked_links = load_bookmarked_links()
    
    while True:
        ConsoleUI.print_separator()
        ConsoleUI.print_info(f"QUAN LY LINK DANH DAU (Hien tai co {len(bookmarked_links)} link)")
        ConsoleUI.print_separator()
        print(f"{Colors.CYAN}1.{Colors.END} Xem danh sach link danh dau")
        print(f"{Colors.CYAN}2.{Colors.END} Them link danh dau")
        print(f"{Colors.CYAN}3.{Colors.END} Xoa link danh dau")
        print(f"{Colors.CYAN}4.{Colors.END} Xoa tat ca link danh dau")
        print(f"{Colors.CYAN}5.{Colors.END} Quay lai menu chinh")
        print()
        
        choice = ConsoleUI.get_user_input("Nhap lua chon cua ban (1-5): ").strip()
        
        if choice == "1":
            # Xem danh sách
            if not bookmarked_links:
                ConsoleUI.print_warning("Chua co link danh dau nao")
            else:
                ConsoleUI.print_info("Danh sach link danh dau:")
                for i, link in enumerate(sorted(bookmarked_links), 1):
                    print(f"{Colors.WHITE}{i:3d}.{Colors.END} {link}")
        
        elif choice == "2":
            # Thêm link
            ConsoleUI.print_info("Nhap link danh dau (nhap 'done' de ket thuc):")
            while True:
                link = ConsoleUI.get_user_input("Link: ").strip()
                if link.lower() == 'done':
                    break
                if link:
                    if link in bookmarked_links:
                        ConsoleUI.print_warning(f"Link da ton tai: {link}")
                    else:
                        bookmarked_links.add(link)
                        ConsoleUI.print_success(f"Da them link: {link}")
                else:
                    ConsoleUI.print_error("Link khong duoc de trong")
            
            # Lưu file
            save_bookmarked_links(bookmarked_links)
        
        elif choice == "3":
            # Xóa link
            if not bookmarked_links:
                ConsoleUI.print_warning("Chua co link danh dau nao")
            else:
                ConsoleUI.print_info("Danh sach link danh dau:")
                links_list = sorted(list(bookmarked_links))
                for i, link in enumerate(links_list, 1):
                    print(f"{Colors.WHITE}{i:3d}.{Colors.END} {link}")
                
                try:
                    index = int(ConsoleUI.get_user_input("Nhap so thu tu link can xoa: ")) - 1
                    if 0 <= index < len(links_list):
                        removed_link = links_list[index]
                        bookmarked_links.remove(removed_link)
                        ConsoleUI.print_success(f"Da xoa link: {removed_link}")
                        save_bookmarked_links(bookmarked_links)
                    else:
                        ConsoleUI.print_error("So thu tu khong hop le")
                except ValueError:
                    ConsoleUI.print_error("Vui long nhap so nguyen hop le")
        
        elif choice == "4":
            # Xóa tất cả
            if not bookmarked_links:
                ConsoleUI.print_warning("Chua co link danh dau nao")
            else:
                confirm = ConsoleUI.get_user_input(f"Ban co chac chan muon xoa tat ca {len(bookmarked_links)} link danh dau? (y/n): ").lower().strip()
                if confirm in ['y', 'yes', 'có', 'co']:
                    bookmarked_links.clear()
                    save_bookmarked_links(bookmarked_links)
                    ConsoleUI.print_success("Da xoa tat ca link danh dau")
                else:
                    ConsoleUI.print_info("Da huy thao tac")
        
        elif choice == "5":
            # Quay lại
            break
        
        else:
            ConsoleUI.print_error("Lua chon khong hop le. Vui long chon 1-5")

def manage_bookmark_link():
    """Quản lý link đánh dấu trong crawled_links.csv"""
    bookmarked_link = load_crawled_links()
    
    while True:
        ConsoleUI.print_separator()
        ConsoleUI.print_info("QUAN LY LINK DANH DAU TRONG CRAWLED_LINKS.CSV")
        ConsoleUI.print_separator()
        
        if bookmarked_link:
            ConsoleUI.print_info(f"Link danh dau hien tai: {bookmarked_link}")
        else:
            ConsoleUI.print_warning("Chua co link danh dau nao")
        
        print(f"{Colors.CYAN}1.{Colors.END} Xem link danh dau hien tai")
        print(f"{Colors.CYAN}2.{Colors.END} Dat link danh dau moi")
        print(f"{Colors.CYAN}3.{Colors.END} Xoa link danh dau")
        print(f"{Colors.CYAN}4.{Colors.END} Quay lai menu chinh")
        print()
        
        choice = ConsoleUI.get_user_input("Nhap lua chon cua ban (1-4): ").strip()
        
        if choice == "1":
            # Xem link đánh dấu hiện tại
            if bookmarked_link:
                ConsoleUI.print_info(f"Link danh dau hien tai: {bookmarked_link}")
            else:
                ConsoleUI.print_warning("Chua co link danh dau nao")
        
        elif choice == "2":
            # Đặt link đánh dấu mới
            new_link = ConsoleUI.get_user_input("Nhap link danh dau moi: ").strip()
            if new_link:
                save_crawled_link(new_link)
                bookmarked_link = new_link
                ConsoleUI.print_success(f"Da dat link danh dau: {new_link}")
            else:
                ConsoleUI.print_error("Link khong duoc de trong")
        
        elif choice == "3":
            # Xóa link đánh dấu
            if bookmarked_link:
                confirm = ConsoleUI.get_user_input(f"Ban co chac chan muon xoa link danh dau '{bookmarked_link}'? (y/n): ").lower().strip()
                if confirm in ['y', 'yes', 'có', 'co']:
                    if os.path.exists("crawled_links.csv"):
                        os.remove("crawled_links.csv")
                    bookmarked_link = None
                    ConsoleUI.print_success("Da xoa link danh dau")
                else:
                    ConsoleUI.print_info("Da huy thao tac")
            else:
                ConsoleUI.print_warning("Chua co link danh dau nao de xoa")
        
        elif choice == "4":
            # Quay lại
            break
        
        else:
            ConsoleUI.print_error("Lua chon khong hop le. Vui long chon 1-4")

def select_website():
    """Chọn website để crawl"""
    websites = load_websites_config()
    
    while True:
        ConsoleUI.print_separator()
        ConsoleUI.print_info("CHON WEBSITE DE CRAWL")
        ConsoleUI.print_separator()
        
        if not websites:
            ConsoleUI.print_warning("Chua co website nao duoc cau hinh")
            return None
        
        # Hiển thị danh sách website
        website_list = list(websites.keys())
        for i, name in enumerate(website_list, 1):
            config = websites[name]
            print(f"{Colors.CYAN}{i:2d}.{Colors.END} {Colors.WHITE}{name}{Colors.END}")
            print(f"     URL: {config['url']}")
            print(f"     Base URL: {config['base_url']}")
            print()
        
        print(f"{Colors.CYAN}{len(website_list) + 1:2d}.{Colors.END} Quay lai menu chinh")
        print()
        
        try:
            choice = int(ConsoleUI.get_user_input("Nhap so thu tu website can chon: "))
            if 1 <= choice <= len(website_list):
                selected_name = website_list[choice - 1]
                selected_config = websites[selected_name]
                ConsoleUI.print_success(f"Da chon website: {selected_name}")
                return selected_config
            elif choice == len(website_list) + 1:
                return None
            else:
                ConsoleUI.print_error("So thu tu khong hop le")
        except ValueError:
            ConsoleUI.print_error("Vui long nhap so nguyen hop le")

def manage_website_config():
    """Quản lý cấu hình website mới"""
    websites = load_websites_config()
    
    while True:
        ConsoleUI.print_separator()
        ConsoleUI.print_info("QUAN LY CAU HINH WEBSITE")
        ConsoleUI.print_separator()
        
        print(f"{Colors.CYAN}1.{Colors.END} Xem danh sach website")
        print(f"{Colors.CYAN}2.{Colors.END} Them website moi")
        print(f"{Colors.CYAN}3.{Colors.END} Sua website")
        print(f"{Colors.CYAN}4.{Colors.END} Xoa website")
        print(f"{Colors.CYAN}5.{Colors.END} Quay lai menu chinh")
        print()
        
        choice = ConsoleUI.get_user_input("Nhap lua chon cua ban (1-5): ").strip()
        
        if choice == "1":
            # Xem danh sách website
            if not websites:
                ConsoleUI.print_warning("Chua co website nao duoc cau hinh")
            else:
                ConsoleUI.print_info(f"Danh sach website ({len(websites)} website):")
                for name, config in websites.items():
                    print(f"  - {Colors.WHITE}{name}{Colors.END}")
                    print(f"    URL: {config['url']}")
                    print(f"    Base URL: {config['base_url']}")
                    print(f"    Image Selector: {config['img_selector']}")
                    print()
        
        elif choice == "2":
            # Thêm website mới
            add_website(websites)
            save_websites_config(websites)
        
        elif choice == "3":
            # Sửa website
            edit_website(websites)
            save_websites_config(websites)
        
        elif choice == "4":
            # Xóa website
            delete_website(websites)
            save_websites_config(websites)
        
        elif choice == "5":
            # Quay lại
            break
        
        else:
            ConsoleUI.print_error("Lua chon khong hop le. Vui long chon 1-5")

def add_website(websites):
    """Thêm website mới"""
    ConsoleUI.print_info("Them website moi:")
    
    name = ConsoleUI.get_user_input("Ten website: ").strip()
    if not name:
        ConsoleUI.print_error("Ten website khong duoc de trong")
        return
    
    if name in websites:
        ConsoleUI.print_error(f"Website '{name}' da ton tai")
        return
    
    url = ConsoleUI.get_user_input("URL website: ").strip()
    if not url:
        ConsoleUI.print_error("URL website khong duoc de trong")
        return
    
    base_url = ConsoleUI.get_user_input("Base URL crawl: ").strip()
    if not base_url:
        ConsoleUI.print_error("Base URL khong duoc de trong")
        return
    
    page_template = ConsoleUI.get_user_input("Page URL template (chua {page}): ").strip()
    if not page_template or '{page}' not in page_template:
        ConsoleUI.print_error("Page URL template phai chua {page}")
        return
    
    img_selector = ConsoleUI.get_user_input("Image selector (VD: img.attachment-woocommerce_thumbnail): ").strip()
    if not img_selector:
        ConsoleUI.print_error("Image selector khong duoc de trong")
        return
    
    img_src_attr = ConsoleUI.get_user_input("Image src attribute (mac dinh: src): ").strip() or "src"
    img_alt_attr = ConsoleUI.get_user_input("Image alt attribute (mac dinh: alt): ").strip() or "alt"
    
    websites[name] = {
        'name': name,
        'url': url,
        'base_url': base_url,
        'page_url_template': page_template,
        'img_selector': img_selector,
        'img_src_attr': img_src_attr,
        'img_alt_attr': img_alt_attr
    }
    
    ConsoleUI.print_success(f"Da them website: {name}")

def edit_website(websites):
    """Sửa website"""
    if not websites:
        ConsoleUI.print_warning("Chua co website nao de sua")
        return
    
    website_list = list(websites.keys())
    ConsoleUI.print_info("Chon website can sua:")
    for i, name in enumerate(website_list, 1):
        print(f"{Colors.CYAN}{i:2d}.{Colors.END} {name}")
    
    try:
        choice = int(ConsoleUI.get_user_input("Nhap so thu tu: ")) - 1
        if 0 <= choice < len(website_list):
            name = website_list[choice]
            config = websites[name]
            
            ConsoleUI.print_info(f"Sua website: {name}")
            ConsoleUI.print_info("Nhan Enter de giu nguyen gia tri hien tai")
            
            new_name = ConsoleUI.get_user_input(f"Ten website (hien tai: {config['name']}): ").strip()
            if new_name:
                if new_name != name and new_name in websites:
                    ConsoleUI.print_error(f"Website '{new_name}' da ton tai")
                    return
                config['name'] = new_name
                if new_name != name:
                    websites[new_name] = websites.pop(name)
                    name = new_name
            
            new_url = ConsoleUI.get_user_input(f"URL website (hien tai: {config['url']}): ").strip()
            if new_url:
                config['url'] = new_url
            
            new_base_url = ConsoleUI.get_user_input(f"Base URL (hien tai: {config['base_url']}): ").strip()
            if new_base_url:
                config['base_url'] = new_base_url
            
            new_template = ConsoleUI.get_user_input(f"Page URL template (hien tai: {config['page_url_template']}): ").strip()
            if new_template and '{page}' in new_template:
                config['page_url_template'] = new_template
            
            new_selector = ConsoleUI.get_user_input(f"Image selector (hien tai: {config['img_selector']}): ").strip()
            if new_selector:
                config['img_selector'] = new_selector
            
            new_src_attr = ConsoleUI.get_user_input(f"Image src attribute (hien tai: {config['img_src_attr']}): ").strip()
            if new_src_attr:
                config['img_src_attr'] = new_src_attr
            
            new_alt_attr = ConsoleUI.get_user_input(f"Image alt attribute (hien tai: {config['img_alt_attr']}): ").strip()
            if new_alt_attr:
                config['img_alt_attr'] = new_alt_attr
            
            ConsoleUI.print_success(f"Da sua website: {name}")
        else:
            ConsoleUI.print_error("So thu tu khong hop le")
    except ValueError:
        ConsoleUI.print_error("Vui long nhap so nguyen hop le")

def delete_website(websites):
    """Xóa website"""
    if not websites:
        ConsoleUI.print_warning("Chua co website nao de xoa")
        return
    
    website_list = list(websites.keys())
    ConsoleUI.print_info("Chon website can xoa:")
    for i, name in enumerate(website_list, 1):
        print(f"{Colors.CYAN}{i:2d}.{Colors.END} {name}")
    
    try:
        choice = int(ConsoleUI.get_user_input("Nhap so thu tu: ")) - 1
        if 0 <= choice < len(website_list):
            name = website_list[choice]
            confirm = ConsoleUI.get_user_input(f"Ban co chac chan muon xoa website '{name}'? (y/n): ").lower().strip()
            if confirm in ['y', 'yes', 'có', 'co']:
                del websites[name]
                ConsoleUI.print_success(f"Da xoa website: {name}")
            else:
                ConsoleUI.print_info("Da huy thao tac")
        else:
            ConsoleUI.print_error("So thu tu khong hop le")
    except ValueError:
        ConsoleUI.print_error("Vui long nhap so nguyen hop le")

def scrape_product_links_mobile(base_url, start_page=1, max_pages=10, csv_filename=None, bookmarked_links=None, website_config=None):
    """Scrape link ảnh sản phẩm từ website với giao diện console đẹp và lưu real-time"""
    
    # Mobile User-Agent để giả lập trình duyệt di động (Android Chrome)
    mobile_headers = {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
    }
    
    # Tải link đánh dấu
    bookmarked_link = load_crawled_links()
    
    product_links = []
    session = requests.Session()
    session.headers.update(mobile_headers)
    
    ConsoleUI.print_info(f"Bat dau scrape tu trang {start_page} den trang {max_pages}")
    ConsoleUI.print_info(f"URL goc: {base_url}")
    if csv_filename:
        ConsoleUI.print_info(f"Luu real-time vao file: {csv_filename}")
    print()
    
    total_pages = max_pages - start_page + 1
    stt_counter = 1
    
    for page in range(start_page, max_pages + 1):
        # Xây dựng URL cho từng trang
        if page == 1:
            url = base_url
        else:
            if website_config and 'page_url_template' in website_config:
                url = website_config['page_url_template'].format(page=page)
            else:
                url = f"https://teleteeshirt.com/shop/page/{page}/?orderby=date"
        
        try:
            ConsoleUI.print_progress(page - start_page + 1, total_pages, f"Dang xu ly trang {page}")
            
            response = session.get(url, timeout=10)
            response.raise_for_status()
            
            # Kiểm tra nếu trang là HTML
            if 'text/html' not in response.headers.get('Content-Type', ''):
                ConsoleUI.print_warning(f"Trang {page} khong phai HTML: {response.headers.get('Content-Type')}")
                break
                
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Tìm tất cả thẻ img theo selector được cấu hình
            if website_config and 'img_selector' in website_config:
                try:
                    img_elements = soup.select(website_config['img_selector'])
                except Exception as e:
                    ConsoleUI.print_warning(f"Loi khi su dung selector '{website_config['img_selector']}': {str(e)}")
                    img_elements = soup.find_all('img', class_='attachment-woocommerce_thumbnail')
            else:
                img_elements = soup.find_all('img', class_='attachment-woocommerce_thumbnail')
            
            if not img_elements:
                ConsoleUI.print_warning(f"Khong tim thay anh san pham o trang {page}, dung scrape")
                break
                
            page_products = 0
            new_products = 0
            
            for img in img_elements:
                # Lấy thuộc tính src và alt theo cấu hình
                if website_config and 'img_src_attr' in website_config:
                    img_src = img.get(website_config['img_src_attr'])
                else:
                    img_src = img.get('src')
                
                if website_config and 'img_alt_attr' in website_config:
                    img_alt = img.get(website_config['img_alt_attr'], '')
                else:
                    img_alt = img.get('alt', '')
                
                if img_src:
                    # Tạo object sản phẩm và lưu ngay
                    product = {
                        'href': img_src,
                        'text': img_alt
                    }
                    
                    product_links.append(product)
                    page_products += 1
                    new_products += 1
                    
                    # Lưu real-time vào CSV ngay lập tức
                    if csv_filename:
                        if save_to_csv_realtime(product, csv_filename, stt_counter):
                            stt_counter += 1
                    
                    # Kiểm tra trùng lặp SAU KHI đã lưu sản phẩm
                    if bookmarked_link and img_src == bookmarked_link:
                        ConsoleUI.print_warning(f"Da gap anh trung voi link danh dau: {img_alt[:50]}...")
                        ConsoleUI.print_info("Anh nay trung voi link danh dau trong file crawled_links.csv")
                        ConsoleUI.print_success("San pham da duoc luu vao CSV truoc khi kiem tra trung lap")
                        
                        # Hỏi người dùng có muốn tiếp tục không
                        while True:
                            choice = ConsoleUI.get_user_input("Ban co muon tiep tuc crawl? (y/n): ").lower().strip()
                            if choice in ['y', 'yes', 'có', 'co']:
                                ConsoleUI.print_info("Tiep tuc crawl...")
                                break
                            elif choice in ['n', 'no', 'không', 'khong']:
                                ConsoleUI.print_info("Dung crawl theo yeu cau cua nguoi dung")
                                ConsoleUI.print_success("Du lieu da crawl truoc do da duoc luu vao CSV")
                                return product_links
                            else:
                                ConsoleUI.print_error("Vui long nhap y hoac n")
                        continue
                    
                    # Kiểm tra xem link ảnh có trong danh sách đánh dấu từ bookmarked_links.txt không
                    if bookmarked_links and img_src in bookmarked_links:
                        ConsoleUI.print_warning(f"Da gap anh trong danh sach danh dau: {img_alt[:50]}...")
                        ConsoleUI.print_info("Anh nay duoc danh dau trong danh sach")
                        ConsoleUI.print_success("San pham da duoc luu vao CSV truoc khi kiem tra trung lap")
                        
                        # Hỏi người dùng có muốn tiếp tục không
                        while True:
                            choice = ConsoleUI.get_user_input("Ban co muon tiep tuc crawl? (y/n): ").lower().strip()
                            if choice in ['y', 'yes', 'có', 'co']:
                                ConsoleUI.print_info("Tiep tuc crawl...")
                                break
                            elif choice in ['n', 'no', 'không', 'khong']:
                                ConsoleUI.print_info("Dung crawl theo yeu cau cua nguoi dung")
                                ConsoleUI.print_success("Du lieu da crawl truoc do da duoc luu vao CSV")
                                return product_links
                            else:
                                ConsoleUI.print_error("Vui long nhap y hoac n")
                        continue
                    
            ConsoleUI.print_success(f"Trang {page}: tim thay {page_products} anh san pham ({new_products} anh moi)")
            
        except requests.Timeout:
            ConsoleUI.print_error(f"Timeout khi truy cap trang {page}")
            break
        except requests.ConnectionError:
            ConsoleUI.print_error(f"Loi ket noi khi truy cap trang {page}")
            break
        except requests.RequestException as e:
            ConsoleUI.print_error(f"Loi khi truy cap trang {page}: {str(e)}")
            break
        except Exception as e:
            ConsoleUI.print_error(f"Loi khong xac dinh o trang {page}: {str(e)}")
            break
        
        # Delay nhỏ để tránh spam server
        time.sleep(0.5)
    
    print()  # Xuống dòng sau thanh tiến trình
    return product_links

def load_crawled_links(filename="crawled_links.csv"):
    """Tải link đánh dấu từ file CSV (chỉ 1 link duy nhất)"""
    bookmarked_link = None
    if os.path.exists(filename):
        try:
            with open(filename, 'r', newline='', encoding='utf-8') as csvfile:
                reader = csv.DictReader(csvfile)
                for row in reader:
                    if 'link_anh' in row and row['link_anh']:
                        bookmarked_link = row['link_anh']
                        break  # Chỉ lấy link đầu tiên
            if bookmarked_link:
                ConsoleUI.print_info(f"Da tai link danh dau tu file {filename}: {bookmarked_link}")
            else:
                ConsoleUI.print_info(f"File {filename} khong co link danh dau nao")
        except Exception as e:
            ConsoleUI.print_warning(f"Khong the tai file {filename}: {str(e)}")
    return bookmarked_link

def save_crawled_link(link, filename="crawled_links.csv"):
    """Lưu link đánh dấu vào file CSV (ghi đè file, chỉ 1 link duy nhất)"""
    try:
        with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
            fieldnames = ['link_anh', 'thoi_gian_crawl']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            
            writer.writeheader()
            writer.writerow({
                'link_anh': link,
                'thoi_gian_crawl': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            })
        ConsoleUI.print_success(f"Da luu link danh dau: {link}")
    except Exception as e:
        ConsoleUI.print_error(f"Loi khi luu link danh dau: {str(e)}")

def save_to_csv_realtime(product, filename, stt):
    """Lưu sản phẩm vào CSV real-time"""
    try:
        file_exists = os.path.exists(filename)
        with open(filename, 'a', newline='', encoding='utf-8') as csvfile:
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
        return True
    except Exception as e:
        ConsoleUI.print_error(f"Loi khi luu san pham vao CSV: {str(e)}")
        return False

def save_to_csv(products, filename=None):
    """Lưu kết quả scrape vào file CSV (backup function)"""
    if not products:
        ConsoleUI.print_warning("Khong co du lieu de luu vao CSV")
        return None
    
    if filename is None:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"teleteeshirt_products_{timestamp}.csv"
    
    try:
        with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
            fieldnames = ['stt', 'ten_san_pham', 'link_anh', 'thoi_gian_crawl']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            
            # Ghi header
            writer.writeheader()
            
            # Ghi dữ liệu
            for i, product in enumerate(products, 1):
                writer.writerow({
                    'stt': i,
                    'ten_san_pham': product['text'],
                    'link_anh': product['href'],
                    'thoi_gian_crawl': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                })
        
        ConsoleUI.print_success(f"Da luu {len(products)} san pham vao file: {filename}")
        return filename
        
    except Exception as e:
        ConsoleUI.print_error(f"Loi khi luu file CSV: {str(e)}")
        return None

def display_results(products, csv_filename=None):
    """Hiển thị kết quả scrape"""
    ConsoleUI.print_separator()
    ConsoleUI.print_success(f"Hoan thanh! Tong cong tim thay {len(products)} san pham")
    ConsoleUI.print_separator()
    
    if not products:
        ConsoleUI.print_warning("Khong co san pham nao duoc tim thay")
        return
    
    # Hiển thị một số sản phẩm đầu tiên
    display_count = min(5, len(products))
    ConsoleUI.print_info(f"Hien thi {display_count} san pham dau tien:")
    print()
    
    for i, product in enumerate(products[:display_count], 1):
        print(f"{Colors.BOLD}{Colors.WHITE}{i:3d}.{Colors.END} {product['text']}")
        print(f"     {Colors.CYAN}Link anh:{Colors.END} {product['href']}")
        print()
    
    if len(products) > display_count:
        ConsoleUI.print_info(f"... va {len(products) - display_count} san pham khac")
        print()
    
    if csv_filename and os.path.exists(csv_filename):
        ConsoleUI.print_info(f"Tat ca san pham da duoc luu real-time vao file: {csv_filename}")
    else:
        # Lưu vào CSV nếu chưa có file real-time
        csv_file = save_to_csv(products)
        if csv_file:
            ConsoleUI.print_info(f"Xem chi tiet tat ca san pham trong file: {csv_file}")

def get_user_config():
    """Lấy cấu hình từ người dùng"""
    while True:
        ConsoleUI.print_menu()
        choice = ConsoleUI.get_user_input("Nhap lua chon cua ban (1-8): ").strip()
        
        if choice == "1":
            while True:
                try:
                    start_page = int(ConsoleUI.get_user_input("Nhap so trang bat dau (>= 1): "))
                    if start_page >= 1:
                        break
                    else:
                        ConsoleUI.print_error("So trang phai >= 1")
                except ValueError:
                    ConsoleUI.print_error("Vui long nhap so nguyen hop le")
            
            while True:
                try:
                    max_pages = int(ConsoleUI.get_user_input("Nhap so trang ket thuc (>= trang bat dau): "))
                    if max_pages >= start_page:
                        break
                    else:
                        ConsoleUI.print_error("So trang ket thuc phai >= so trang bat dau")
                except ValueError:
                    ConsoleUI.print_error("Vui long nhap so nguyen hop le")
            
            return start_page, max_pages
            
        elif choice == "2":
            while True:
                try:
                    max_pages = int(ConsoleUI.get_user_input("Nhap so trang ket thuc (>= 1): "))
                    if max_pages >= 1:
                        return 1, max_pages
                    else:
                        ConsoleUI.print_error("So trang phai >= 1")
                except ValueError:
                    ConsoleUI.print_error("Vui long nhap so nguyen hop le")
                    
        elif choice == "3":
            ConsoleUI.print_info("Su dung cau hinh mac dinh: trang 1-10")
            return 1, 10
            
        elif choice == "4":
            # Quản lý link đánh dấu
            manage_bookmarked_links()
            continue
            
        elif choice == "5":
            # Đặt link đánh dấu trong crawled_links.csv
            manage_bookmark_link()
            continue
            
        elif choice == "6":
            # Chọn website để crawl
            selected_website = select_website()
            if selected_website:
                return selected_website
            continue
            
        elif choice == "7":
            # Quản lý cấu hình website
            manage_website_config()
            continue
            
        elif choice == "8":
            ConsoleUI.print_info("Tam biet!")
            sys.exit(0)
            
        else:
            ConsoleUI.print_error("Lua chon khong hop le. Vui long chon 1-8")

# Cấu hình website mặc định
DEFAULT_WEBSITE_CONFIG = {
    'name': 'TRUMPANY',
    'url': 'https://teleteeshirt.com',
    'base_url': 'https://teleteeshirt.com/shop/?orderby=date',
    'page_url_template': 'https://teleteeshirt.com/shop/page/{page}/?orderby=date',
    'img_selector': 'img.attachment-woocommerce_thumbnail',
    'img_src_attr': 'src',
    'img_alt_attr': 'alt'
}

def load_websites_config(filename="websites_config.json"):
    """Tải danh sách cấu hình website từ file JSON"""
    websites = {}
    if os.path.exists(filename):
        try:
            import json
            with open(filename, 'r', encoding='utf-8') as f:
                websites = json.load(f)
            ConsoleUI.print_info(f"Da tai {len(websites)} website tu file {filename}")
        except Exception as e:
            ConsoleUI.print_warning(f"Khong the tai file cau hinh: {str(e)}")
    
    # Nếu không có file hoặc file rỗng, tạo website mặc định
    if not websites:
        websites['TRUMPANY'] = DEFAULT_WEBSITE_CONFIG.copy()
        save_websites_config(websites)
    
    return websites

def save_websites_config(websites, filename="websites_config.json"):
    """Lưu danh sách cấu hình website vào file JSON"""
    try:
        import json
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(websites, f, indent=2, ensure_ascii=False)
        ConsoleUI.print_success(f"Da luu {len(websites)} website vao file {filename}")
        return True
    except Exception as e:
        ConsoleUI.print_error(f"Loi khi luu cau hinh website: {str(e)}")
        return False

def load_website_config(filename="website_config.txt"):
    """Tải cấu hình website từ file (backward compatibility)"""
    config = DEFAULT_WEBSITE_CONFIG.copy()
    if os.path.exists(filename):
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                for line in f:
                    if '=' in line:
                        key, value = line.strip().split('=', 1)
                        if key in config:
                            config[key] = value
            ConsoleUI.print_info(f"Da tai cau hinh website: {config['name']}")
        except Exception as e:
            ConsoleUI.print_warning(f"Khong the tai file cau hinh: {str(e)}")
    return config

def save_website_config(config, filename="website_config.txt"):
    """Lưu cấu hình website vào file"""
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            for key, value in config.items():
                f.write(f"{key}={value}\n")
        ConsoleUI.print_success(f"Da luu cau hinh website: {config['name']}")
        return True
    except Exception as e:
        ConsoleUI.print_error(f"Loi khi luu cau hinh website: {str(e)}")
        return False

def manage_website_config():
    """Quản lý cấu hình website"""
    config = load_website_config()
    
    while True:
        ConsoleUI.print_separator()
        ConsoleUI.print_info(f"QUAN LY CAU HINH WEBSITE")
        ConsoleUI.print_separator()
        print(f"{Colors.CYAN}1.{Colors.END} Xem cau hinh hien tai")
        print(f"{Colors.CYAN}2.{Colors.END} Sua ten website")
        print(f"{Colors.CYAN}3.{Colors.END} Sua URL website")
        print(f"{Colors.CYAN}4.{Colors.END} Sua base URL crawl")
        print(f"{Colors.CYAN}5.{Colors.END} Sua page URL template")
        print(f"{Colors.CYAN}6.{Colors.END} Reset ve cau hinh mac dinh")
        print(f"{Colors.CYAN}7.{Colors.END} Quay lai menu chinh")
        print()
        
        choice = ConsoleUI.get_user_input("Nhap lua chon cua ban (1-7): ").strip()
        
        if choice == "1":
            # Xem cấu hình
            ConsoleUI.print_info("Cau hinh website hien tai:")
            print(f"  - Ten website: {Colors.WHITE}{config['name']}{Colors.END}")
            print(f"  - URL website: {Colors.WHITE}{config['url']}{Colors.END}")
            print(f"  - Base URL crawl: {Colors.WHITE}{config['base_url']}{Colors.END}")
            print(f"  - Page URL template: {Colors.WHITE}{config['page_url_template']}{Colors.END}")
        
        elif choice == "2":
            # Sửa tên website
            new_name = ConsoleUI.get_user_input(f"Nhap ten website moi (hien tai: {config['name']}): ").strip()
            if new_name:
                config['name'] = new_name
                save_website_config(config)
                ConsoleUI.print_success(f"Da cap nhat ten website: {new_name}")
            else:
                ConsoleUI.print_error("Ten website khong duoc de trong")
        
        elif choice == "3":
            # Sửa URL website
            new_url = ConsoleUI.get_user_input(f"Nhap URL website moi (hien tai: {config['url']}): ").strip()
            if new_url:
                config['url'] = new_url
                save_website_config(config)
                ConsoleUI.print_success(f"Da cap nhat URL website: {new_url}")
            else:
                ConsoleUI.print_error("URL website khong duoc de trong")
        
        elif choice == "4":
            # Sửa base URL crawl
            new_base_url = ConsoleUI.get_user_input(f"Nhap base URL crawl moi (hien tai: {config['base_url']}): ").strip()
            if new_base_url:
                config['base_url'] = new_base_url
                save_website_config(config)
                ConsoleUI.print_success(f"Da cap nhat base URL crawl: {new_base_url}")
            else:
                ConsoleUI.print_error("Base URL crawl khong duoc de trong")
        
        elif choice == "5":
            # Sửa page URL template
            new_template = ConsoleUI.get_user_input(f"Nhap page URL template moi (hien tai: {config['page_url_template']}): ").strip()
            if new_template and '{page}' in new_template:
                config['page_url_template'] = new_template
                save_website_config(config)
                ConsoleUI.print_success(f"Da cap nhat page URL template: {new_template}")
            else:
                ConsoleUI.print_error("Page URL template phai chua {page} va khong duoc de trong")
        
        elif choice == "6":
            # Reset về cấu hình mặc định
            confirm = ConsoleUI.get_user_input("Ban co chac chan muon reset ve cau hinh mac dinh? (y/n): ").lower().strip()
            if confirm in ['y', 'yes', 'có', 'co']:
                config = DEFAULT_WEBSITE_CONFIG.copy()
                save_website_config(config)
                ConsoleUI.print_success("Da reset ve cau hinh mac dinh")
            else:
                ConsoleUI.print_info("Da huy thao tac")
        
        elif choice == "7":
            # Quay lại
            break
        
        else:
            ConsoleUI.print_error("Lua chon khong hop le. Vui long chon 1-7")

def main():
    """Hàm chính của ứng dụng"""
    try:
        # Tải danh sách website
        websites = load_websites_config()
        
        # Hiển thị banner mặc định
        ConsoleUI.print_banner()
        
        # Tải danh sách link đánh dấu
        bookmarked_links = load_bookmarked_links()
        if bookmarked_links:
            ConsoleUI.print_info(f"Da tai {len(bookmarked_links)} link danh dau tu bookmarked_links.txt")
        
        # Tải link đánh dấu từ crawled_links.csv
        bookmarked_link = load_crawled_links()
        if bookmarked_link:
            ConsoleUI.print_info(f"Da tai link danh dau tu crawled_links.csv: {bookmarked_link}")
        
        # Lấy cấu hình từ người dùng (có thể chọn website)
        config_result = get_user_config()
        
        # Kiểm tra nếu người dùng chọn website
        if isinstance(config_result, dict):
            # Người dùng chọn website
            website_config = config_result
            start_page, max_pages = 1, 10  # Mặc định
        else:
            # Người dùng chọn cấu hình trang
            start_page, max_pages = config_result
            # Sử dụng website đầu tiên làm mặc định
            website_config = list(websites.values())[0] if websites else DEFAULT_WEBSITE_CONFIG
        
        # Hiển thị banner với thông tin website đã chọn
        ConsoleUI.print_banner(website_config['name'], website_config['url'])
        
        ConsoleUI.print_separator()
        ConsoleUI.print_info("Cau hinh scrape:")
        ConsoleUI.print_info(f"  - Website: {website_config['name']}")
        ConsoleUI.print_info(f"  - URL: {website_config['url']}")
        ConsoleUI.print_info(f"  - Base URL: {website_config['base_url']}")
        ConsoleUI.print_info(f"  - Image Selector: {website_config.get('img_selector', 'img.attachment-woocommerce_thumbnail')}")
        ConsoleUI.print_info(f"  - Trang bat dau: {start_page}")
        ConsoleUI.print_info(f"  - Trang ket thuc: {max_pages}")
        ConsoleUI.print_info(f"  - Link danh dau (bookmarked_links.txt): {len(bookmarked_links)} link")
        ConsoleUI.print_info(f"  - Link danh dau (crawled_links.csv): {'Co' if bookmarked_link else 'Khong co'}")
        ConsoleUI.print_info(f"  - Thoi gian bat dau: {datetime.now().strftime('%H:%M:%S')}")
        ConsoleUI.print_separator()
        print()
        
        # Xác nhận trước khi chạy
        confirm = ConsoleUI.get_user_input("Ban co muon tiep tuc? (y/n): ").lower().strip()
        if confirm not in ['y', 'yes', 'có', 'co']:
            ConsoleUI.print_info("Da huy thao tac")
            return
        
        print()
        
        # Tạo tên file CSV cho real-time saving
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        csv_filename = f"{website_config['name'].lower()}_products_{timestamp}.csv"
        
        # Thực hiện scrape với lưu real-time và link đánh dấu
        products = scrape_product_links_mobile(website_config['base_url'], start_page, max_pages, csv_filename, bookmarked_links, website_config)
        
        # Hiển thị kết quả
        display_results(products, csv_filename)
        
        ConsoleUI.print_separator()
        ConsoleUI.print_success("Chuong trinh da chay xong!")
        
    except KeyboardInterrupt:
        print()
        ConsoleUI.print_warning("Chuong trinh bi dung boi nguoi dung")
        sys.exit(0)
    except Exception as e:
        ConsoleUI.print_error(f"Loi khong xac dinh: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()