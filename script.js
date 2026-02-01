// Data aplikasi
const appData = {
    currentPage: 'home',
    isLoggedIn: false,
    currentUser: null,
    theme: 'light',
    products: [
        {
            id: 1,
            name: 'Axelux Pro X9',
            description: 'Produk premium dengan performa tinggi dan fitur lengkap untuk kebutuhan profesional.',
            price: 'Rp 2.499.000',
            rating: 4.9,
            stock: 45,
            category: 'Premium',
            image: '🚀'
        },
        {
            id: 2,
            name: 'Nexus Lite v3',
            description: 'Versi ringan dengan performa optimal untuk penggunaan sehari-hari.',
            price: 'Rp 1.299.000',
            rating: 4.5,
            stock: 120,
            category: 'Standar',
            image: '💎'
        },
        {
            id: 3,
            name: 'Quantum Z2',
            description: 'Teknologi terbaru dengan desain futuristik dan fitur canggih.',
            price: 'Rp 3.999.000',
            rating: 4.8,
            stock: 25,
            category: 'Premium',
            image: '⚡'
        },
        {
            id: 4,
            name: 'Spark Mini',
            description: 'Kompak dan portabel, cocok untuk mobilitas tinggi.',
            price: 'Rp 899.000',
            rating: 4.3,
            stock: 200,
            category: 'Basic',
            image: '✨'
        },
        {
            id: 5,
            name: 'Fusion Max',
            description: 'Kombinasi sempurna antara performa dan desain elegan.',
            price: 'Rp 1.899.000',
            rating: 4.7,
            stock: 65,
            category: 'Standar',
            image: '🔥'
        },
        {
            id: 6,
            name: 'Aero Pro',
            description: 'Desain aerodinamis dengan performa maksimal untuk gaming.',
            price: 'Rp 2.999.000',
            rating: 4.9,
            stock: 30,
            category: 'Gaming',
            image: '🎮'
        }
    ],
    testimonials: [
        {
            id: 1,
            name: 'Rizki Pratama',
            date: '15 Oktober 2023',
            rating: 5,
            content: 'Produk berkualitas tinggi! Axelux Pro X9 melebihi ekspektasi saya. Performa sangat smooth untuk pekerjaan desain.',
            product: 'Axelux Pro X9'
        },
        {
            id: 2,
            name: 'Sari Dewi',
            date: '10 Oktober 2023',
            rating: 4,
            content: 'Pengiriman cepat dan produk sesuai deskripsi. Nexus Lite v3 sangat cocok untuk pekerjaan kantor sehari-hari.',
            product: 'Nexus Lite v3'
        },
        {
            id: 3,
            name: 'Budi Santoso',
            date: '5 Oktober 2023',
            rating: 5,
            content: 'Quantum Z2 adalah revolusi! Fitur-fitur canggihnya membantu bisnis saya berkembang pesat.',
            product: 'Quantum Z2'
        },
        {
            id: 4,
            name: 'Maya Indah',
            date: '28 September 2023',
            rating: 4,
            content: 'Spark Mini sangat praktis untuk dibawa kemana-mana. Baterai tahan lama dan performa memuaskan.',
            product: 'Spark Mini'
        }
    ],
    settings: {
        profile: {
            name: 'Pengguna Tamu',
            email: 'tamu@axelux.store',
            phone: '+62 812-3456-7890',
            avatar: '👤'
        },
        notifications: {
            email: true,
            sms: false,
            push: true
        },
        privacy: {
            profilePublic: true,
            showEmail: false,
            showPhone: false
        }
    }
};

// Inisialisasi ketika halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    console.log('Axelux Store Dashboard - Siap Digunakan!');
    
    // Inisialisasi semua fungsi
    initThemeToggle();
    init3DEffects();
    initProgressAnimation();
    initNavigation();
    initCardHoverEffects();
    updateUserStatus();
    enhanceLogo3D();
    initLoginModal();
    initUserMenu();
    initProductsPage();
    initTestimonialsPage();
    initSettingsPage();
    initForms();
    
    // Tampilkan halaman awal
    showPage('home');
});

// Fungsi untuk menampilkan halaman
function showPage(pageName) {
    appData.currentPage = pageName;
    
    // Update indikator halaman di footer
    const pageIndicator = document.getElementById('page-indicator');
    if (pageIndicator) {
        const pageNames = {
            'home': 'Beranda',
            'products': 'Produk',
            'testimonials': 'Testimoni',
            'settings': 'Pengaturan'
        };
        pageIndicator.textContent = pageNames[pageName] || pageName;
    }
    
    // Sembunyikan semua konten halaman
    const pages = document.querySelectorAll('.page-content');
    pages.forEach(page => {
        page.style.display = 'none';
    });
    
    // Tampilkan halaman yang dipilih
    const targetPage = document.getElementById(`${pageName}-page`);
    if (targetPage) {
        targetPage.style.display = 'block';
        
        // Tambahkan efek animasi
        targetPage.style.animation = 'fadeIn 0.5s ease';
        
        // Update navigasi aktif
        updateActiveNav(pageName);
        
        // Inisialisasi ulang efek 3D untuk elemen baru
        setTimeout(init3DEffects, 100);
        
        // Scroll ke atas
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        // Jika halaman belum dibuat, buat secara dinamis
        createPageContent(pageName);
        showPage(pageName);
    }
}

// Fungsi untuk membuat konten halaman dinamis
function createPageContent(pageName) {
    const mainContent = document.getElementById('main-content');
    
    switch(pageName) {
        case 'products':
            mainContent.innerHTML += `
                <div class="page-content" id="products-page">
                    <div class="products-header">
                        <h1 class="dashboard-title">
                            <span class="title-3d">Produk Kami</span>
                            <span class="title-sub">Temukan produk terbaik untuk kebutuhan Anda</span>
                        </h1>
                        <div class="search-filter">
                            <div class="search-box">
                                <i class="fas fa-search"></i>
                                <input type="text" id="product-search" placeholder="Cari produk...">
                            </div>
                            <button class="filter-btn" id="filter-btn">
                                <i class="fas fa-filter"></i> Filter
                            </button>
                        </div>
                    </div>
                    <div class="products-grid" id="products-grid">
                        <!-- Produk akan diisi oleh JavaScript -->
                    </div>
                </div>
            `;
            break;
            
        case 'testimonials':
            mainContent.innerHTML += `
                <div class="page-content" id="testimonials-page">
                    <div class="dashboard-header">
                        <h1 class="dashboard-title">
                            <span class="title-3d">Testimoni</span>
                            <span class="title-sub">Apa kata pelanggan tentang Axelux Store</span>
                        </h1>
                    </div>
                    <div class="testimonials-container" id="testimonials-container">
                        <!-- Testimoni akan diisi oleh JavaScript -->
                    </div>
                    <div class="add-testimonial">
                        <button class="btn-add-testimonial" id="add-testimonial-btn">
                            <i class="fas fa-plus"></i> Tambah Testimoni
                        </button>
                    </div>
                </div>
            `;
            break;
            
        case 'settings':
            mainContent.innerHTML += `
                <div class="page-content" id="settings-page">
                    <div class="dashboard-header">
                        <h1 class="dashboard-title">
                            <span class="title-3d">Pengaturan</span>
                            <span class="title-sub">Kelola akun dan preferensi Anda</span>
                        </h1>
                    </div>
                    <div class="settings-grid">
                        <div class="settings-sidebar">
                            <ul class="settings-menu">
                                <li class="settings-menu-item active" data-section="profile">
                                    <i class="fas fa-user"></i> Profil
                                </li>
                                <li class="settings-menu-item" data-section="notifications">
                                    <i class="fas fa-bell"></i> Notifikasi
                                </li>
                                <li class="settings-menu-item" data-section="privacy">
                                    <i class="fas fa-shield-alt"></i> Privasi
                                </li>
                                <li class="settings-menu-item" data-section="security">
                                    <i class="fas fa-lock"></i> Keamanan
                                </li>
                            </ul>
                        </div>
                        <div class="settings-content">
                            <div class="settings-section active" id="profile-section">
                                <!-- Konten profil akan diisi oleh JavaScript -->
                            </div>
                            <div class="settings-section" id="notifications-section">
                                <!-- Konten notifikasi akan diisi oleh JavaScript -->
                            </div>
                            <div class="settings-section" id="privacy-section">
                                <!-- Konten privasi akan diisi oleh JavaScript -->
                            </div>
                            <div class="settings-section" id="security-section">
                                <!-- Konten keamanan akan diisi oleh JavaScript -->
                            </div>
                        </div>
                    </div>
                </div>
            `;
            break;
    }
}

// Fungsi untuk update navigasi aktif
function updateActiveNav(pageName) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === pageName) {
            item.classList.add('active');
        }
    });
}

// Fungsi toggle tema terang/gelap
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const container = document.querySelector('.container');
    
    if (themeToggle) {
        themeToggle.addEventListener('change', function() {
            if (this.checked) {
                setTheme('light');
            } else {
                setTheme('dark');
            }
            
            // Tambahkan feedback visual
            const toggleSlider = document.querySelector('.toggle-slider');
            toggleSlider.style.transform = 'scale(1.05)';
            setTimeout(() => {
                toggleSlider.style.transform = 'scale(1)';
            }, 200);
        });
    }
}

function setTheme(theme) {
    const body = document.body;
    const container = document.querySelector('.container');
    appData.theme = theme;
    
    if (theme === 'light') {
        body.style.background = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
        container.style.backgroundColor = 'white';
        container.style.color = '#333';
        updateThemeLabel('Mode Terang');
    } else {
        body.style.background = 'linear-gradient(135deg, #2c3e50 0%, #1a1a2e 100%)';
        container.style.backgroundColor = '#2d3436';
        container.style.color = '#f8f9fa';
        updateThemeLabel('Mode Gelap');
    }
    
    container.style.transition = 'background-color 0.5s ease, color 0.5s ease';
}

function updateThemeLabel(mode) {
    const label = document.querySelector('.toggle-label span');
    const icon = document.querySelector('.toggle-label i');
    
    if (label) label.textContent = mode;
    if (icon) {
        if (mode === 'Mode Terang') {
            icon.className = 'fas fa-sun';
            icon.style.color = '#fdcb6e';
        } else {
            icon.className = 'fas fa-moon';
            icon.style.color = '#6c5ce7';
        }
    }
}

// Fungsi untuk efek 3D pada elemen
function init3DEffects() {
    const cards3D = document.querySelectorAll('.stat-card-3d, .content-3d, .product-card, .testimonial-card');
    
    cards3D.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = (x - centerX) / 25;
            const rotateX = (centerY - y) / 25;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            setTimeout(() => {
                this.style.transition = 'transform 0.5s ease';
            }, 100);
        });
    });
}

// Fungsi animasi progress bar
function initProgressAnimation() {
    const progressFill = document.querySelector('.progress-fill');
    
    if (progressFill) {
        progressFill.style.width = '0%';
        
        setTimeout(() => {
            progressFill.style.width = '85%';
            progressFill.style.transition = 'width 1.5s cubic-bezier(0.22, 0.61, 0.36, 1)';
        }, 500);
    }
}

// Fungsi untuk interaksi navigasi
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const pageName = this.dataset.page;
            showPage(pageName);
            
            // Efek klik
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Fungsi efek hover pada kartu
function initCardHoverEffects() {
    const cards = document.querySelectorAll('.stat-card, .content-card, .product-card, .testimonial-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.stat-icon, .illustration-3d, .card-header i, .product-image');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.stat-icon, .illustration-3d, .card-header i, .product-image');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
}

// Fungsi untuk memperbarui status pengguna
function updateUserStatus() {
    const statusIndicator = document.querySelector('.status-indicator');
    const statusText = document.querySelector('.status-text');
    
    if (statusIndicator && statusText) {
        setInterval(() => {
            const isOnline = Math.random() > 0.1; // 90% online
            
            if (isOnline) {
                statusIndicator.className = 'status-indicator active';
                statusIndicator.style.backgroundColor = '#00b894';
                statusText.textContent = 'Online';
            } else {
                statusIndicator.className = 'status-indicator';
                statusIndicator.style.backgroundColor = '#e17055';
                statusText.textContent = 'Offline';
                
                setTimeout(() => {
                    statusIndicator.className = 'status-indicator active';
                    statusIndicator.style.backgroundColor = '#00b894';
                    statusText.textContent = 'Online';
                }, 3000);
            }
        }, 10000);
    }
}

// Fungsi untuk meningkatkan efek 3D pada logo
function enhanceLogo3D() {
    const logo = document.querySelector('.logo-3d');
    
    if (logo) {
        logo.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            
            const rotateY = (x / rect.width - 0.5) * 20;
            
            this.style.transform = `perspective(1000px) rotateY(${rotateY}deg) translateZ(20px)`;
            this.style.textShadow = `${-rotateY/2}px 3px 0 rgba(0, 0, 0, 0.2)`;
        });
        
        logo.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateY(0) translateZ(20px)';
            this.style.textShadow = '3px 3px 0 rgba(0, 0, 0, 0.2)';
            this.style.transition = 'transform 0.5s ease, text-shadow 0.5s ease';
        });
        
        // Klik logo untuk kembali ke beranda
        logo.addEventListener('click', function() {
            showPage('home');
        });
    }
}

// Fungsi untuk modal login
function initLoginModal() {
    const loginBtn = document.getElementById('login-btn-main');
    const loginModal = document.getElementById('login-modal');
    const closeLogin = document.getElementById('close-login');
    const loginForm = document.getElementById('login-form');
    const togglePassword = document.getElementById('toggle-password');
    
    // Tombol login di beranda
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showLoginModal();
        });
    }
    
    // Tombol tutup modal
    if (closeLogin) {
        closeLogin.addEventListener('click', function() {
            hideLoginModal();
        });
    }
    
    // Klik di luar modal untuk menutup
    if (loginModal) {
        loginModal.addEventListener('click', function(e) {
            if (e.target === this) {
                hideLoginModal();
            }
        });
    }
    
    // Toggle password visibility
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
    
    // Handle form login
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('remember-me').checked;
            
            // Simulasi proses login
            const submitBtn = this.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                if (username && password) {
                    // Login berhasil
                    appData.isLoggedIn = true;
                    appData.currentUser = {
                        name: username,
                        email: `${username.toLowerCase()}@axelux.store`
                    };
                    
                    // Update UI
                    updateUserInfo();
                    
                    // Tampilkan pesan sukses
                    showNotification('Login berhasil! Selamat datang di Axelux Store.', 'success');
                    
                    // Tutup modal
                    hideLoginModal();
                    
                    // Reset form
                    loginForm.reset();
                } else {
                    // Login gagal
                    showNotification('Username dan password harus diisi!', 'error');
                }
                
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
}

function showLoginModal() {
    const loginModal = document.getElementById('login-modal');
    if (loginModal) {
        loginModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function hideLoginModal() {
    const loginModal = document.getElementById('login-modal');
    if (loginModal) {
        loginModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Fungsi untuk menu pengguna
function initUserMenu() {
    const userInfo = document.querySelector('.user-info');
    
    if (userInfo) {
        userInfo.addEventListener('click', function() {
            if (appData.isLoggedIn) {
                showPage('settings');
            } else {
                showLoginModal();
            }
        });
    }
}

// Fungsi untuk halaman produk
function initProductsPage() {
    // Render produk ketika halaman produk ditampilkan
    document.addEventListener('pageChanged', function(e) {
        if (e.detail.page === 'products') {
            renderProducts();
            initProductSearch();
            initProductFilters();
        }
    });
}

function renderProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    appData.products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-badge">${product.category}</div>
            <div class="product-image">${product.image}</div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-meta">
                    <div class="product-price">${product.price}</div>
                    <div class="product-rating">
                        <i class="fas fa-star"></i>
                        <span>${product.rating}</span>
                    </div>
                </div>
                <div class="product-stock">
                    <i class="fas fa-box"></i>
                    <span>Tersedia: ${product.stock} unit</span>
                </div>
                <div class="product-actions">
                    <button class="btn-action btn-cart" data-id="${product.id}">
                        <i class="fas fa-cart-plus"></i> Tambah
                    </button>
                    <button class="btn-action btn-detail" data-id="${product.id}">
                        <i class="fas fa-info-circle"></i> Detail
                    </button>
                </div>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
    
    // Tambahkan event listener untuk tombol
    document.querySelectorAll('.btn-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.id;
            addToCart(productId);
        });
    });
    
    document.querySelectorAll('.btn-detail').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.id;
            showProductDetail(productId);
        });
    });
    
    // Inisialisasi ulang efek 3D
    init3DEffects();
}

function initProductSearch() {
    const searchInput = document.getElementById('product-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const filteredProducts = appData.products.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm)
            );
            
            // Render ulang produk yang difilter
            renderFilteredProducts(filteredProducts);
        });
    }
}

function renderFilteredProducts(products) {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 50px;">
                <i class="fas fa-search" style="font-size: 3rem; color: #ccc; margin-bottom: 20px;"></i>
                <h3 style="color: #777;">Produk tidak ditemukan</h3>
                <p>Coba kata kunci lain atau lihat semua produk.</p>
            </div>
        `;
        return;
    }
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-badge">${product.category}</div>
            <div class="product-image">${product.image}</div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-meta">
                    <div class="product-price">${product.price}</div>
                    <div class="product-rating">
                        <i class="fas fa-star"></i>
                        <span>${product.rating}</span>
                    </div>
                </div>
                <div class="product-stock">
                    <i class="fas fa-box"></i>
                    <span>Tersedia: ${product.stock} unit</span>
                </div>
                <div class="product-actions">
                    <button class="btn-action btn-cart" data-id="${product.id}">
                        <i class="fas fa-cart-plus"></i> Tambah
                    </button>
                    <button class="btn-action btn-detail" data-id="${product.id}">
                        <i class="fas fa-info-circle"></i> Detail
                    </button>
                </div>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
    
    // Tambahkan event listener untuk tombol
    document.querySelectorAll('.btn-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.id;
            addToCart(productId);
        });
    });
    
    document.querySelectorAll('.btn-detail').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.id;
            showProductDetail(productId);
        });
    });
    
    // Inisialisasi ulang efek 3D
    init3DEffects();
}

function initProductFilters() {
    const filterBtn = document.getElementById('filter-btn');
    if (filterBtn) {
        filterBtn.addEventListener('click', function() {
            showFilterModal();
        });
    }
}

function showFilterModal() {
    // Buat modal filter sederhana
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
        <div class="modal-content modal-3d">
            <div class="modal-header">
                <h2><i class="fas fa-filter"></i> Filter Produk</h2>
                <button class="modal-close" id="close-filter">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>Kategori</label>
                    <select id="filter-category">
                        <option value="all">Semua Kategori</option>
                        <option value="Premium">Premium</option>
                        <option value="Standar">Standar</option>
                        <option value="Basic">Basic</option>
                        <option value="Gaming">Gaming</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Harga Maksimum</label>
                    <input type="range" id="filter-price" min="0" max="5000000" step="500000" value="5000000">
                    <div id="price-value">Rp 5.000.000</div>
                </div>
                <div class="form-group">
                    <label>Rating Minimum</label>
                    <select id="filter-rating">
                        <option value="0">Semua Rating</option>
                        <option value="4">4+ Bintang</option>
                        <option value="4.5">4.5+ Bintang</option>
                        <option value="5">5 Bintang</option>
                    </select>
                </div>
                <button class="btn-submit" id="apply-filter">
                    <i class="fas fa-check"></i> Terapkan Filter
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Update nilai harga
    const priceSlider = document.getElementById('filter-price');
    const priceValue = document.getElementById('price-value');
    
    priceSlider.addEventListener('input', function() {
        const value = parseInt(this.value).toLocaleString('id-ID');
        priceValue.textContent = `Rp ${value}`;
    });
    
    // Tombol tutup
    document.getElementById('close-filter').addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    // Klik di luar modal
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            document.body.removeChild(modal);
        }
    });
    
    // Terapkan filter
    document.getElementById('apply-filter').addEventListener('click', function() {
        const category = document.getElementById('filter-category').value;
        const maxPrice = parseInt(document.getElementById('filter-price').value);
        const minRating = parseFloat(document.getElementById('filter-rating').value);
        
        let filteredProducts = appData.products;
        
        if (category !== 'all') {
            filteredProducts = filteredProducts.filter(p => p.category === category);
        }
        
        filteredProducts = filteredProducts.filter(p => {
            const price = parseInt(p.price.replace(/[^0-9]/g, ''));
            return price <= maxPrice && p.rating >= minRating;
        });
        
        renderFilteredProducts(filteredProducts);
        document.body.removeChild(modal);
        showNotification('Filter berhasil diterapkan!', 'success');
    });
}

function addToCart(productId) {
    if (!appData.isLoggedIn) {
        showNotification('Silakan login terlebih dahulu untuk menambahkan ke keranjang!', 'warning');
        showLoginModal();
        return;
    }
    
    const product = appData.products.find(p => p.id == productId);
    if (product) {
        showNotification(`${product.name} berhasil ditambahkan ke keranjang!`, 'success');
        
        // Animasi tombol
        const btn = document.querySelector(`.btn-cart[data-id="${productId}"]`);
        btn.innerHTML = '<i class="fas fa-check"></i> Ditambahkan';
        btn.style.background = 'linear-gradient(135deg, #00b894, #00cec9)';
        
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-cart-plus"></i> Tambah';
            btn.style.background = 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))';
        }, 2000);
    }
}

function showProductDetail(productId) {
    const product = appData.products.find(p => p.id == productId);
    if (!product) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
        <div class="modal-content modal-3d">
            <div class="modal-header">
                <h2><i class="fas fa-info-circle"></i> Detail Produk</h2>
                <button class="modal-close" id="close-detail">&times;</button>
            </div>
            <div class="modal-body">
                <div style="text-align: center; margin-bottom: 20px;">
                    <div style="font-size: 4rem; margin-bottom: 15px;">${product.image}</div>
                    <div class="product-badge" style="display: inline-block;">${product.category}</div>
                </div>
                <h3 style="font-size: 1.5rem; margin-bottom: 10px; color: var(--dark-color);">${product.name}</h3>
                <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">${product.description}</p>
                
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 25px;">
                    <div style="background: var(--light-color); padding: 15px; border-radius: 10px;">
                        <div style="font-size: 0.9rem; color: #777; margin-bottom: 5px;">Harga</div>
                        <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary-color);">${product.price}</div>
                    </div>
                    <div style="background: var(--light-color); padding: 15px; border-radius: 10px;">
                        <div style="font-size: 0.9rem; color: #777; margin-bottom: 5px;">Rating</div>
                        <div style="font-size: 1.5rem; font-weight: 700; color: var(--warning-color);">
                            <i class="fas fa-star"></i> ${product.rating}
                        </div>
                    </div>
                    <div style="background: var(--light-color); padding: 15px; border-radius: 10px;">
                        <div style="font-size: 0.9rem; color: #777; margin-bottom: 5px;">Stok</div>
                        <div style="font-size: 1.5rem; font-weight: 700; color: ${product.stock > 20 ? 'var(--success-color)' : 'var(--danger-color)'};">${product.stock} unit</div>
                    </div>
                    <div style="background: var(--light-color); padding: 15px; border-radius: 10px;">
                        <div style="font-size: 0.9rem; color: #777; margin-bottom: 5px;">Status</div>
                        <div style="font-size: 1.5rem; font-weight: 700; color: ${product.stock > 0 ? 'var(--success-color)' : 'var(--danger-color)'};">${product.stock > 0 ? 'Tersedia' : 'Habis'}</div>
                    </div>
                </div>
                
                <button class="btn-submit" id="buy-now-btn" style="width: 100%;">
                    <i class="fas fa-shopping-cart"></i> Beli Sekarang
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Tombol tutup
    document.getElementById('close-detail').addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    // Klik di luar modal
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            document.body.removeChild(modal);
        }
    });
    
    // Tombol beli sekarang
    document.getElementById('buy-now-btn').addEventListener('click', function() {
        if (!appData.isLoggedIn) {
            showNotification('Silakan login terlebih dahulu untuk membeli!', 'warning');
            showLoginModal();
            document.body.removeChild(modal);
            return;
        }
        
        showNotification(`Memproses pembelian ${product.name}...`, 'success');
        document.body.removeChild(modal);
        
        // Simulasi redirect ke halaman checkout
        setTimeout(() => {
            alert(`Terima kasih! Anda akan diarahkan ke halaman pembayaran untuk ${product.name}. Fitur checkout sedang dalam pengembangan.`);
        }, 1000);
    });
}

// Fungsi untuk halaman testimoni
function initTestimonialsPage() {
    document.addEventListener('pageChanged', function(e) {
        if (e.detail.page === 'testimonials') {
            renderTestimonials();
            initAddTestimonial();
        }
    });
}

function renderTestimonials() {
    const testimonialsContainer = document.getElementById('testimonials-container');
    if (!testimonialsContainer) return;
    
    testimonialsContainer.innerHTML = '';
    
    appData.testimonials.forEach(testimonial => {
        const stars = '★'.repeat(testimonial.rating) + '☆'.repeat(5 - testimonial.rating);
        
        const testimonialCard = document.createElement('div');
        testimonialCard.className = 'testimonial-card';
        testimonialCard.innerHTML = `
            <div class="testimonial-header">
                <div class="testimonial-avatar">${testimonial.name.charAt(0)}</div>
                <div class="testimonial-user">
                    <div class="testimonial-name">${testimonial.name}</div>
                    <div class="testimonial-date">${testimonial.date}</div>
                </div>
                <div class="testimonial-rating" title="${testimonial.rating} bintang">
                    ${stars}
                </div>
            </div>
            <div class="testimonial-content">
                "${testimonial.content}"
            </div>
            <div class="testimonial-product">${testimonial.product}</div>
        `;
        
        testimonialsContainer.appendChild(testimonialCard);
    });
    
    // Inisialisasi ulang efek 3D
    init3DEffects();
}

function initAddTestimonial() {
    const addBtn = document.getElementById('add-testimonial-btn');
    if (addBtn) {
        addBtn.addEventListener('click', function() {
            if (!appData.isLoggedIn) {
                showNotification('Silakan login terlebih dahulu untuk menambahkan testimoni!', 'warning');
                showLoginModal();
                return;
            }
            
            showAddTestimonialModal();
        });
    }
}

function showAddTestimonialModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
        <div class="modal-content modal-3d">
            <div class="modal-header">
                <h2><i class="fas fa-comment-alt"></i> Tambah Testimoni</h2>
                <button class="modal-close" id="close-testimonial">&times;</button>
            </div>
            <div class="modal-body">
                <form id="testimonial-form">
                    <div class="form-group">
                        <label><i class="fas fa-star"></i> Rating</label>
                        <select id="testimonial-rating" required>
                            <option value="">Pilih rating</option>
                            <option value="5">5 Bintang - Sangat Baik</option>
                            <option value="4">4 Bintang - Baik</option>
                            <option value="3">3 Bintang - Cukup</option>
                            <option value="2">2 Bintang - Kurang</option>
                            <option value="1">1 Bintang - Buruk</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-box"></i> Produk</label>
                        <select id="testimonial-product" required>
                            <option value="">Pilih produk</option>
                            ${appData.products.map(p => `<option value="${p.name}">${p.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-comment"></i> Ulasan Anda</label>
                        <textarea id="testimonial-content" rows="5" placeholder="Bagikan pengalaman Anda dengan produk ini..." required></textarea>
                    </div>
                    <button type="submit" class="btn-submit">
                        <i class="fas fa-paper-plane"></i> Kirim Testimoni
                    </button>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Tombol tutup
    document.getElementById('close-testimonial').addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    // Klik di luar modal
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            document.body.removeChild(modal);
        }
    });
    
    // Handle form testimonial
    document.getElementById('testimonial-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const rating = document.getElementById('testimonial-rating').value;
        const product = document.getElementById('testimonial-product').value;
        const content = document.getElementById('testimonial-content').value;
        
        if (!rating || !product || !content) {
            showNotification('Harap isi semua field!', 'error');
            return;
        }
        
        // Tambahkan testimoni baru
        const newTestimonial = {
            id: appData.testimonials.length + 1,
            name: appData.currentUser.name,
            date: new Date().toLocaleDateString('id-ID', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
            }),
            rating: parseInt(rating),
            content: content,
            product: product
        };
        
        appData.testimonials.unshift(newTestimonial);
        
        // Render ulang testimoni
        renderTestimonials();
        
        // Tutup modal
        document.body.removeChild(modal);
        
        // Tampilkan notifikasi
        showNotification('Testimoni berhasil ditambahkan! Terima kasih atas ulasannya.', 'success');
    });
}

// Fungsi untuk halaman pengaturan
function initSettingsPage() {
    document.addEventListener('pageChanged', function(e) {
        if (e.detail.page === 'settings') {
            renderSettingsSections();
            initSettingsMenu();
            initSettingsForms();
        }
    });
}

function renderSettingsSections() {
    // Render profil
    const profileSection = document.getElementById('profile-section');
    if (profileSection) {
        profileSection.innerHTML = `
            <h2 class="settings-title"><i class="fas fa-user"></i> Profil Pengguna</h2>
            <form class="settings-form" id="profile-form">
                <div class="form-group">
                    <label><i class="fas fa-user-circle"></i> Nama Lengkap</label>
                    <input type="text" id="profile-name" value="${appData.settings.profile.name}" ${!appData.isLoggedIn ? 'disabled' : ''}>
                </div>
                <div class="form-group">
                    <label><i class="fas fa-envelope"></i> Email</label>
                    <input type="email" id="profile-email" value="${appData.settings.profile.email}" ${!appData.isLoggedIn ? 'disabled' : ''}>
                </div>
                <div class="form-group">
                    <label><i class="fas fa-phone"></i> Nomor Telepon</label>
                    <input type="tel" id="profile-phone" value="${appData.settings.profile.phone}" ${!appData.isLoggedIn ? 'disabled' : ''}>
                </div>
                ${appData.isLoggedIn ? `
                    <button type="submit" class="btn-submit">
                        <i class="fas fa-save"></i> Simpan Perubahan
                    </button>
                ` : `
                    <p style="color: #777; text-align: center; padding: 20px;">
                        <i class="fas fa-info-circle"></i> Silakan login untuk mengubah profil
                    </p>
                `}
            </form>
        `;
    }
    
    // Render notifikasi
    const notificationsSection = document.getElementById('notifications-section');
    if (notificationsSection) {
        notificationsSection.innerHTML = `
            <h2 class="settings-title"><i class="fas fa-bell"></i> Pengaturan Notifikasi</h2>
            <form class="settings-form" id="notifications-form">
                <div class="form-group" style="display: flex; align-items: center; justify-content: space-between; padding: 15px; background: var(--light-color); border-radius: 10px;">
                    <div>
                        <label style="margin-bottom: 5px; font-weight: 600;">Notifikasi Email</label>
                        <p style="color: #777; font-size: 0.9rem;">Terima pemberitahuan via email</p>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="notif-email" ${appData.settings.notifications.email ? 'checked' : ''} ${!appData.isLoggedIn ? 'disabled' : ''}>
                        <label for="notif-email" class="toggle-slider">
                            <span class="toggle-knob"></span>
                        </label>
                    </label>
                </div>
                
                <div class="form-group" style="display: flex; align-items: center; justify-content: space-between; padding: 15px; background: var(--light-color); border-radius: 10px;">
                    <div>
                        <label style="margin-bottom: 5px; font-weight: 600;">Notifikasi SMS</label>
                        <p style="color: #777; font-size: 0.9rem;">Terima pemberitahuan via SMS</p>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="notif-sms" ${appData.settings.notifications.sms ? 'checked' : ''} ${!appData.isLoggedIn ? 'disabled' : ''}>
                        <label for="notif-sms" class="toggle-slider">
                            <span class="toggle-knob"></span>
                        </label>
                    </label>
                </div>
                
                <div class="form-group" style="display: flex; align-items: center; justify-content: space-between; padding: 15px; background: var(--light-color); border-radius: 10px;">
                    <div>
                        <label style="margin-bottom: 5px; font-weight: 600;">Notifikasi Push</label>
                        <p style="color: #777; font-size: 0.9rem;">Terima pemberitahuan di browser</p>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="notif-push" ${appData.settings.notifications.push ? 'checked' : ''} ${!appData.isLoggedIn ? 'disabled' : ''}>
                        <label for="notif-push" class="toggle-slider">
                            <span class="toggle-knob"></span>
                        </label>
                    </label>
                </div>
                
                ${appData.isLoggedIn ? `
                    <button type="submit" class="btn-submit">
                        <i class="fas fa-save"></i> Simpan Pengaturan
                    </button>
                ` : `
                    <p style="color: #777; text-align: center; padding: 20px;">
                        <i class="fas fa-info-circle"></i> Silakan login untuk mengatur notifikasi
                    </p>
                `}
            </form>
        `;
    }
    
    // Render privasi
    const privacySection = document.getElementById('privacy-section');
    if (privacySection) {
        privacySection.innerHTML = `
            <h2 class="settings-title"><i class="fas fa-shield-alt"></i> Pengaturan Privasi</h2>
            <form class="settings-form" id="privacy-form">
                <div class="form-group" style="display: flex; align-items: center; justify-content: space-between; padding: 15px; background: var(--light-color); border-radius: 10px;">
                    <div>
                        <label style="margin-bottom: 5px; font-weight: 600;">Profil Publik</label>
                        <p style="color: #777; font-size: 0.9rem;">Tampilkan profil Anda kepada pengguna lain</p>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="privacy-profile" ${appData.settings.privacy.profilePublic ? 'checked' : ''} ${!appData.isLoggedIn ? 'disabled' : ''}>
                        <label for="privacy-profile" class="toggle-slider">
                            <span class="toggle-knob"></span>
                        </label>
                    </label>
                </div>
                
                <div class="form-group" style="display: flex; align-items: center; justify-content: space-between; padding: 15px; background: var(--light-color); border-radius: 10px;">
                    <div>
                        <label style="margin-bottom: 5px; font-weight: 600;">Tampilkan Email</label>
                        <p style="color: #777; font-size: 0.9rem;">Izinkan pengguna lain melihat email Anda</p>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="privacy-email" ${appData.settings.privacy.showEmail ? 'checked' : ''} ${!appData.isLoggedIn ? 'disabled' : ''}>
                        <label for="privacy-email" class="toggle-slider">
                            <span class="toggle-knob"></span>
                        </label>
                    </label>
                </div>
                
                <div class="form-group" style="display: flex; align-items: center; justify-content: space-between; padding: 15px; background: var(--light-color); border-radius: 10px;">
                    <div>
                        <label style="margin-bottom: 5px; font-weight: 600;">Tampilkan Telepon</label>
                        <p style="color: #777; font-size: 0.9rem;">Izinkan pengguna lain melihat nomor telepon Anda</p>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="privacy-phone" ${appData.settings.privacy.showPhone ? 'checked' : ''} ${!appData.isLoggedIn ? 'disabled' : ''}>
                        <label for="privacy-phone" class="toggle-slider">
                            <span class="toggle-knob"></span>
                        </label>
                    </label>
                </div>
                
                ${appData.isLoggedIn ? `
                    <button type="submit" class="btn-submit">
                        <i class="fas fa-save"></i> Simpan Pengaturan
                    </button>
                ` : `
                    <p style="color: #777; text-align: center; padding: 20px;">
                        <i class="fas fa-info-circle"></i> Silakan login untuk mengatur privasi
                    </p>
                `}
            </form>
        `;
    }
    
    // Render keamanan
    const securitySection = document.getElementById('security-section');
    if (securitySection) {
        securitySection.innerHTML = `
            <h2 class="settings-title"><i class="fas fa-lock"></i> Keamanan Akun</h2>
            <form class="settings-form" id="security-form">
                <div class="form-group">
                    <label><i class="fas fa-lock"></i> Kata Sandi Saat Ini</label>
                    <input type="password" id="current-password" placeholder="Masukkan kata sandi saat ini" ${!appData.isLoggedIn ? 'disabled' : ''}>
                </div>
                <div class="form-group">
                    <label><i class="fas fa-key"></i> Kata Sandi Baru</label>
                    <input type="password" id="new-password" placeholder="Masukkan kata sandi baru" ${!appData.isLoggedIn ? 'disabled' : ''}>
                </div>
                <div class="form-group">
                    <label><i class="fas fa-key"></i> Konfirmasi Kata Sandi Baru</label>
                    <input type="password" id="confirm-password" placeholder="Konfirmasi kata sandi baru" ${!appData.isLoggedIn ? 'disabled' : ''}>
                </div>
                
                ${appData.isLoggedIn ? `
                    <button type="submit" class="btn-submit">
                        <i class="fas fa-sync-alt"></i> Perbarui Kata Sandi
                    </button>
                ` : `
                    <p style="color: #777; text-align: center; padding: 20px;">
                        <i class="fas fa-info-circle"></i> Silakan login untuk mengubah kata sandi
                    </p>
                `}
                
                <div class="danger-zone">
                    <h3 class="danger-title"><i class="fas fa-exclamation-triangle"></i> Zona Bahaya</h3>
                    <p style="color: #777; margin-bottom: 15px;">Tindakan ini tidak dapat dibatalkan. Semua data akun Anda akan dihapus permanen.</p>
                    <button type="button" class="btn-danger" id="delete-account-btn" ${!appData.isLoggedIn ? 'disabled' : ''}>
                        <i class="fas fa-trash-alt"></i> Hapus Akun Permanen
                    </button>
                </div>
            </form>
        `;
    }
}

function initSettingsMenu() {
    const menuItems = document.querySelectorAll('.settings-menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.dataset.section;
            
            // Update menu aktif
            menuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // Tampilkan section yang dipilih
            const sections = document.querySelectorAll('.settings-section');
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            const targetSection = document.getElementById(`${sectionId}-section`);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
}

function initSettingsForms() {
    // Form profil
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!appData.isLoggedIn) {
                showNotification('Silakan login terlebih dahulu!', 'warning');
                return;
            }
            
            // Simpan perubahan profil
            appData.settings.profile.name = document.getElementById('profile-name').value;
            appData.settings.profile.email = document.getElementById('profile-email').value;
            appData.settings.profile.phone = document.getElementById('profile-phone').value;
            
            // Update info pengguna di header
            updateUserInfo();
            
            showNotification('Profil berhasil diperbarui!', 'success');
        });
    }
    
    // Form notifikasi
    const notificationsForm = document.getElementById('notifications-form');
    if (notificationsForm) {
        notificationsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!appData.isLoggedIn) {
                showNotification('Silakan login terlebih dahulu!', 'warning');
                return;
            }
            
            // Simpan pengaturan notifikasi
            appData.settings.notifications.email = document.getElementById('notif-email').checked;
            appData.settings.notifications.sms = document.getElementById('notif-sms').checked;
            appData.settings.notifications.push = document.getElementById('notif-push').checked;
            
            showNotification('Pengaturan notifikasi berhasil disimpan!', 'success');
        });
    }
    
    // Form privasi
    const privacyForm = document.getElementById('privacy-form');
    if (privacyForm) {
        privacyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!appData.isLoggedIn) {
                showNotification('Silakan login terlebih dahulu!', 'warning');
                return;
            }
            
            // Simpan pengaturan privasi
            appData.settings.privacy.profilePublic = document.getElementById('privacy-profile').checked;
            appData.settings.privacy.showEmail = document.getElementById('privacy-email').checked;
            appData.settings.privacy.showPhone = document.getElementById('privacy-phone').checked;
            
            showNotification('Pengaturan privasi berhasil disimpan!', 'success');
        });
    }
    
    // Form keamanan
    const securityForm = document.getElementById('security-form');
    if (securityForm) {
        securityForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!appData.isLoggedIn) {
                showNotification('Silakan login terlebih dahulu!', 'warning');
                return;
            }
            
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            if (!currentPassword || !newPassword || !confirmPassword) {
                showNotification('Harap isi semua field!', 'error');
                return;
            }
            
            if (newPassword !== confirmPassword) {
                showNotification('Konfirmasi kata sandi tidak cocok!', 'error');
                return;
            }
            
            if (newPassword.length < 6) {
                showNotification('Kata sandi minimal 6 karakter!', 'error');
                return;
            }
            
            // Simulasi perubahan kata sandi
            showNotification('Kata sandi berhasil diperbarui!', 'success');
            securityForm.reset();
        });
    }
    
    // Tombol hapus akun
    const deleteAccountBtn = document.getElementById('delete-account-btn');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', function() {
            if (!appData.isLoggedIn) {
                showNotification('Silakan login terlebih dahulu!', 'warning');
                return;
            }
            
            if (confirm('Apakah Anda yakin ingin menghapus akun permanen? Tindakan ini tidak dapat dibatalkan!')) {
                // Simulasi penghapusan akun
                appData.isLoggedIn = false;
                appData.currentUser = null;
                
                // Kembali ke beranda
                showPage('home');
                
                // Reset form login
                const loginForm = document.getElementById('login-form');
                if (loginForm) loginForm.reset();
                
                // Update UI
                updateUserInfo();
                
                showNotification('Akun berhasil dihapus. Terima kasih telah menggunakan Axelux Store.', 'info');
            }
        });
    }
}

// Fungsi untuk update informasi pengguna
function updateUserInfo() {
    const userName = document.querySelector('.user-name');
    const userAvatar = document.querySelector('.user-avatar i');
    
    if (appData.isLoggedIn && appData.currentUser) {
        if (userName) userName.textContent = appData.currentUser.name;
        if (userAvatar) userAvatar.className = 'fas fa-user-check';
    } else {
        if (userName) userName.textContent = 'Pengguna Tamu';
        if (userAvatar) userAvatar.className = 'fas fa-user-circle';
    }
}

// Fungsi untuk inisialisasi form
function initForms() {
    // Form login sudah diinisialisasi di initLoginModal()
    
    // Form pencarian produk
    const productSearch = document.getElementById('product-search');
    if (productSearch) {
        productSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                // Logika pencarian sudah diinisialisasi di initProductSearch()
            }
        });
    }
}

// Fungsi untuk menampilkan notifikasi
function showNotification(message, type = 'info') {
    // Hapus notifikasi sebelumnya
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Buat notifikasi baru
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Tambahkan style
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#00b894' : type === 'error' ? '#e17055' : type === 'warning' ? '#fdcb6e' : '#6c5ce7'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        max-width: 400px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        transform-style: preserve-3d;
    `;
    
    // Style untuk konten
    const contentStyle = `
        display: flex;
        align-items: center;
        gap: 10px;
        flex: 1;
    `;
    
    notification.querySelector('.notification-content').style.cssText = contentStyle;
    
    // Tombol tutup
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        margin-left: 15px;
        line-height: 1;
    `;
    
    // Animasi masuk
    const slideIn = `
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(100%) translateZ(-50px);
            }
            to {
                opacity: 1;
                transform: translateX(0) translateZ(0);
            }
        }
    `;
    
    // Tambahkan style animasi
    const styleSheet = document.createElement('style');
    styleSheet.textContent = slideIn;
    document.head.appendChild(styleSheet);
    
    document.body.appendChild(notification);
    
    // Event untuk tombol tutup
    notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.style.animation = 'slideOut 0.3s ease';
        
        // Buat animasi keluar
        const slideOut = `
            @keyframes slideOut {
                from {
                    opacity: 1;
                    transform: translateX(0) translateZ(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(100%) translateZ(-50px);
                }
            }
        `;
        
        const styleSheet2 = document.createElement('style');
        styleSheet2.textContent = slideOut;
        document.head.appendChild(styleSheet2);
        
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Hapus otomatis setelah 5 detik
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            
            const slideOut = `
                @keyframes slideOut {
                    from {
                        opacity: 1;
                        transform: translateX(0) translateZ(0);
                    }
                    to {
                        opacity: 0;
                        transform: translateX(100%) translateZ(-50px);
                    }
                }
            `;
            
            const styleSheet2 = document.createElement('style');
            styleSheet2.textContent = slideOut;
            document.head.appendChild(styleSheet2);
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Custom event untuk perubahan halaman
document.addEventListener('pageChanged', function(e) {
    console.log(`Halaman berubah: ${e.detail.page}`);
});

// Fungsi untuk dispatch event perubahan halaman
function dispatchPageChange(page) {
    const event = new CustomEvent('pageChanged', { detail: { page } });
    document.dispatchEvent(event);
}

// Update showPage untuk dispatch event
const originalShowPage = showPage;
showPage = function(pageName) {
    originalShowPage(pageName);
    dispatchPageChange(pageName);
};

console.log('Axelux Store Dashboard - Semua fitur siap digunakan!');
