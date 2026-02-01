// AXELUX STORE - ENHANCED VERSION
class AxeLuxStore {
    constructor() {
        this.currentUser = null;
        this.isAdmin = false;
        this.theme = 'dark';
        this.language = 'id';
        this.visitorId = null;
        
        // Data collections
        this.users = [];
        this.products = [];
        this.testimonials = [];
        this.visitors = [];
        this.logs = [];
        
        // Indonesian names database (prioritized)
        this.indonesianNames = [
            // Male
            'Ahmad', 'Budi', 'Cahya', 'Dedi', 'Eka', 'Fajar', 'Gunawan', 'Hadi', 'Irfan', 'Joko',
            'Kurniawan', 'Lukman', 'Mulyadi', 'Nugroho', 'Oka', 'Pratama', 'Rahmat', 'Surya', 'Teguh', 'Wahyu',
            'Yanto', 'Zainal', 'Agus', 'Bayu', 'Candra', 'Darma', 'Edi', 'Firmansyah', 'Galih', 'Hendra',
            'Iwan', 'Jaya', 'Kusuma', 'Laksana', 'Maman', 'Nur', 'Oki', 'Putra', 'Rizki', 'Saputra',
            'Taufik', 'Umar', 'Vino', 'Wira', 'Yuda', 'Zaki', 'Ade', 'Bagus', 'Cahyo', 'Dani',
            
            // Female
            'Ani', 'Bunga', 'Citra', 'Dewi', 'Eva', 'Fitri', 'Gita', 'Hani', 'Indah', 'Juli',
            'Kartika', 'Lestari', 'Maya', 'Nina', 'Olivia', 'Putri', 'Rani', 'Sari', 'Tika', 'Wulan',
            'Yuni', 'Zahra', 'Ayu', 'Bella', 'Cinta', 'Diah', 'Elisa', 'Fiona', 'Gita', 'Hilda',
            'Intan', 'Jessy', 'Kania', 'Linda', 'Mira', 'Nadia', 'Okta', 'Puspita', 'Queena', 'Rina',
            'Siska', 'Tuti', 'Umi', 'Vera', 'Widya', 'Xena', 'Yulia', 'Zara', 'Amelia', 'Bulan'
        ];
        
        // International names
        this.internationalNames = [
            'John', 'Michael', 'David', 'James', 'Robert', 'Maria', 'Sarah', 'Lisa', 'Jennifer', 'William',
            'Thomas', 'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Margaret', 'Susan', 'Karen', 'Nancy', 'Betty',
            'Emma', 'Olivia', 'Ava', 'Isabella', 'Sophia', 'Mia', 'Charlotte', 'Amelia', 'Harper', 'Evelyn',
            'Liam', 'Noah', 'Oliver', 'Elijah', 'William', 'James', 'Benjamin', 'Lucas', 'Henry', 'Alexander',
            'Sakura', 'Yuki', 'Hiroshi', 'Kenji', 'Yumi', 'Minato', 'Akari', 'Riko', 'Daichi', 'Haruto',
            'Jin', 'Min', 'Wei', 'Li', 'Chen', 'Wang', 'Zhang', 'Liu', 'Yang', 'Huang',
            'Mateo', 'Santiago', 'Sebastian', 'Leonardo', 'Diego', 'Valentina', 'Isabella', 'Camila', 'Sofia', 'Valeria',
            'Mohammed', 'Ahmed', 'Ali', 'Omar', 'Yusuf', 'Fatima', 'Aisha', 'Mariam', 'Zainab', 'Hafsa'
        ];
        
        this.init();
    }
    
    // INITIALIZATION
    init() {
        this.loadAllData();
        this.setTheme(this.getSavedTheme());
        this.setLanguage(this.getSavedLanguage());
        this.setupEventListeners();
        this.checkAuth();
        this.trackVisitor();
        this.renderUI();
        this.updateUI();
    }
    
    // DATA MANAGEMENT
    loadAllData() {
        // Load users
        this.users = JSON.parse(localStorage.getItem('axelux_users') || '[]');
        
        // Ensure master admin exists
        if (!this.users.find(u => u.username === 'Axm')) {
            this.users.push({
                id: 'admin_001',
                username: 'Axm',
                email: 'owner@axelux.store',
                password: btoa('brandalz70'),
                role: 'owner',
                created: new Date().toISOString(),
                lastLogin: null,
                language: 'id'
            });
            this.saveUsers();
        }
        
        // Load other data
        this.products = JSON.parse(localStorage.getItem('axelux_products') || '[]');
        this.testimonials = JSON.parse(localStorage.getItem('axelux_testimonials') || '[]');
        this.visitors = JSON.parse(localStorage.getItem('axelux_visitors') || '[]');
        this.logs = JSON.parse(localStorage.getItem('axelux_logs') || '[]');
        
        // Initialize sample data if empty
        this.initializeSampleData();
    }
    
    initializeSampleData() {
        // Sample products
        if (this.products.length === 0) {
            this.products = [
                { id: 1, name: 'Smart Watch Pro', price: '$299', category: 'Electronics', stock: 15, rating: 4.5 },
                { id: 2, name: 'Wireless Earbuds', price: '$159', category: 'Audio', stock: 42, rating: 4.8 },
                { id: 3, name: 'Gaming Laptop', price: '$1299', category: 'Computers', stock: 8, rating: 4.7 },
                { id: 4, name: 'Leather Backpack', price: '$89', category: 'Fashion', stock: 56, rating: 4.3 },
                { id: 5, name: 'Smartphone X', price: '$999', category: 'Electronics', stock: 12, rating: 4.9 },
                { id: 6, name: 'Coffee Maker', price: '$199', category: 'Home', stock: 23, rating: 4.4 }
            ];
            this.saveProducts();
        }
        
        // Sample testimonials
        if (this.testimonials.length === 0) {
            this.generateSampleTestimonials(8);
        }
    }
    
    // SAVE METHODS
    saveUsers() { localStorage.setItem('axelux_users', JSON.stringify(this.users)); }
    saveProducts() { localStorage.setItem('axelux_products', JSON.stringify(this.products)); }
    saveTestimonials() { localStorage.setItem('axelux_testimonials', JSON.stringify(this.testimonials)); }
    saveVisitors() { localStorage.setItem('axelux_visitors', JSON.stringify(this.visitors)); }
    saveLogs() { localStorage.setItem('axelux_logs', JSON.stringify(this.logs)); }
    
    // AUTHENTICATION
    checkAuth() {
        const savedUser = localStorage.getItem('axelux_current_user');
        const savedRole = localStorage.getItem('axelux_role');
        
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.isAdmin = savedRole === 'owner';
            
            if (this.isAdmin) {
                document.body.classList.add('show-admin');
            }
            
            this.showMainPage();
            return true;
        }
        
        this.showLoginPage();
        return false;
    }
    
    register(username, email, password) {
        // Validation
        if (password.length < 6) {
            this.showError(this.translate('error.passwordLength'));
            return false;
        }
        
        // Check if user exists
        if (this.users.find(u => u.username === username || u.email === email)) {
            this.showError(this.translate('error.userExists'));
            return false;
        }
        
        // Create user
        const newUser = {
            id: 'user_' + Date.now(),
            username,
            email,
            password: btoa(password),
            role: 'user',
            language: this.language,
            created: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        };
        
        this.users.push(newUser);
        this.saveUsers();
        
        // Auto login
        this.login(username, password);
        
        this.logAction('USER_REGISTER', `New user: ${username}`);
        this.showSuccess(this.translate('success.register'));
        
        return true;
    }
    
    login(usernameOrEmail, password, isAdminMode = false) {
        let user;
        
        if (isAdminMode && usernameOrEmail === 'Axm' && password === 'brandalz70') {
            // Master admin login
            user = {
                id: 'admin_001',
                username: 'Axm',
                email: 'owner@axelux.store',
                role: 'owner',
                displayName: 'Axm (Owner)'
            };
        } else {
            // Normal user login
            user = this.users.find(u => 
                (u.username === usernameOrEmail || u.email === usernameOrEmail) && 
                btoa(password) === u.password
            );
        }
        
        if (user) {
            // Update last login
            user.lastLogin = new Date().toISOString();
            this.saveUsers();
            
            this.currentUser = {
                id: user.id,
                username: user.username,
                email: user.email,
                displayName: user.username + (user.role === 'owner' ? ' (Owner)' : ''),
                role: user.role,
                language: user.language || this.language
            };
            
            this.isAdmin = user.role === 'owner';
            
            // Save session
            localStorage.setItem('axelux_current_user', JSON.stringify(this.currentUser));
            localStorage.setItem('axelux_role', user.role);
            
            if (this.isAdmin) {
                document.body.classList.add('show-admin');
            }
            
            // Set user language preference
            if (user.language) {
                this.setLanguage(user.language);
            }
            
            this.showMainPage();
            this.updateUI();
            
            this.logAction('USER_LOGIN', `${user.username} logged in`);
            this.showSuccess(this.translate('success.login', { name: user.username }));
            
            return true;
        } else {
            this.showError(this.translate('error.invalidLogin'));
            return false;
        }
    }
    
    guestLogin() {
        this.currentUser = {
            id: 'guest_' + Date.now(),
            username: 'guest_' + Math.random().toString(36).substr(2, 6),
            displayName: this.translate('user.guest'),
            role: 'guest',
            language: this.language
        };
        
        localStorage.setItem('axelux_current_user', JSON.stringify(this.currentUser));
        localStorage.setItem('axelux_role', 'guest');
        
        this.showMainPage();
        this.updateUI();
        
        this.logAction('GUEST_LOGIN', 'Guest user entered');
        this.showInfo(this.translate('info.guestMode'));
        
        return true;
    }
    
    logout() {
        this.logAction('USER_LOGOUT', `${this.currentUser?.username || 'Unknown'} logged out`);
        
        this.currentUser = null;
        this.isAdmin = false;
        
        localStorage.removeItem('axelux_current_user');
        localStorage.removeItem('axelux_role');
        document.body.classList.remove('show-admin');
        
        this.showLoginPage();
        this.showSuccess(this.translate('success.logout'));
    }
    
    // TESTIMONIALS SYSTEM
    generateRandomName() {
        // 70% chance for Indonesian name, 30% for international
        const isIndonesian = Math.random() < 0.7;
        const namePool = isIndonesian ? this.indonesianNames : this.internationalNames;
        return namePool[Math.floor(Math.random() * namePool.length)];
    }
    
    generateFakeTestimonial() {
        const texts = {
            id: [
                "Produknya luar biasa! Kualitas melebihi ekspektasi.",
                "Pelayanan customer service sangat memuaskan.",
                "Pengiriman cepat, barang sampai dengan baik.",
                "Harga sangat worth it untuk kualitas seperti ini.",
                "Sangat recommended! Akan belanja lagi di sini.",
                "Produk original, packing aman, seller ramah.",
                "Respon cepat, proses transaksi mudah.",
                "Barang sesuai gambar, kualitas premium.",
                "Pengalaman belanja terbaik!",
                "Sudah beli berkali-kali, selalu puas."
            ],
            en: [
                "Amazing product! Quality exceeds expectations.",
                "Customer service is very satisfying.",
                "Fast shipping, items arrived in good condition.",
                "Price is very worth it for this quality.",
                "Highly recommended! Will shop here again.",
                "Original product, safe packaging, friendly seller.",
                "Quick response, easy transaction process.",
                "Item matches pictures, premium quality.",
                "Best shopping experience!",
                "Have bought multiple times, always satisfied."
            ]
        };
        
        const ratings = [4, 4.5, 5, 5, 5, 5, 4.5, 5, 5, 4.5];
        const textPool = texts[this.language] || texts['en'];
        
        return {
            author: this.generateRandomName(),
            text: textPool[Math.floor(Math.random() * textPool.length)],
            rating: ratings[Math.floor(Math.random() * ratings.length)],
            fake: true,
            verified: false
        };
    }
    
    generateSampleTestimonials(count) {
        for (let i = 0; i < count; i++) {
            const testimonial = this.generateFakeTestimonial();
            testimonial.id = 'sample_' + Date.now() + '_' + i;
            testimonial.date = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString();
            this.testimonials.push(testimonial);
        }
        this.saveTestimonials();
    }
    
    addFakeTestimonials(count) {
        if (!this.isAdmin) {
            this.showError(this.translate('error.adminOnly'));
            return;
        }
        
        for (let i = 0; i < count; i++) {
            const testimonial = this.generateFakeTestimonial();
            testimonial.id = 'fake_' + Date.now() + '_' + i;
            testimonial.date = new Date().toISOString();
            testimonial.fake = true;
            testimonial.verified = false;
            
            this.testimonials.push(testimonial);
            this.logAction('FAKE_TESTIMONIAL', `Added fake testimonial: ${testimonial.author}`);
        }
        
        this.saveTestimonials();
        this.updateUI();
        this.showSuccess(this.translate('success.fakeTestimonials', { count: count }));
    }
    
    addTestimonial(text, isFake = false) {
        if (!this.currentUser || this.currentUser.role === 'guest') {
            this.showError(this.translate('error.loginRequired'));
            return false;
        }
        
        const testimonial = {
            id: 'review_' + Date.now(),
            author: this.currentUser.displayName,
            text: text,
            rating: 5,
            date: new Date().toISOString(),
            fake: isFake,
            verified: !isFake,
            userId: this.currentUser.id
        };
        
        this.testimonials.push(testimonial);
        this.saveTestimonials();
        
        const action = isFake ? 'FAKE_TESTIMONIAL' : 'TESTIMONIAL_ADDED';
        this.logAction(action, `${isFake ? 'Fake' : 'Real'} testimonial added by ${this.currentUser.username}`);
        
        this.showSuccess(isFake ? 
            this.translate('success.fakeAdded') : 
            this.translate('success.testimonialAdded')
        );
        
        return true;
    }
    
    // VISITOR TRACKING
    trackVisitor() {
        this.visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        const visitor = {
            id: this.visitorId,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent.substring(0, 100),
            screen: `${window.screen.width}x${window.screen.height}`,
            language: navigator.language,
            user: this.currentUser ? this.currentUser.username : 'anonymous',
            page: window.location.href
        };
        
        this.visitors.push(visitor);
        this.saveVisitors();
        
        // Keep only last 500 visitors
        if (this.visitors.length > 500) {
            this.visitors = this.visitors.slice(-500);
            this.saveVisitors();
        }
        
        this.logAction('VISITOR_TRACKED', `New visitor: ${visitor.user}`);
    }
    
    // THEME MANAGEMENT
    setTheme(theme) {
        this.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('axelux_theme', theme);
    }
    
    getSavedTheme() {
        return localStorage.getItem('axelux_theme') || 'dark';
    }
    
    // LANGUAGE MANAGEMENT
    setLanguage(lang) {
        this.language = lang;
        localStorage.setItem('axelux_language', lang);
        
        // Update language selector
        const selector = document.getElementById('languageSelect');
        if (selector) selector.value = lang;
        
        // Update all translatable elements
        this.updateTranslations();
    }
    
    getSavedLanguage() {
        return localStorage.getItem('axelux_language') || 'id';
    }
    
    translate(key, params = {}) {
        const translations = window.AxeLuxTranslations || {};
        const langData = translations[this.language] || translations['en'] || {};
        let text = langData[key] || key;
        
        // Replace parameters
        Object.keys(params).forEach(param => {
            text = text.replace(`{${param}}`, params[param]);
        });
        
        return text;
    }
    
    updateTranslations() {
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.textContent = this.translate(key);
        });
        
        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            el.placeholder = this.translate(key);
        });
    }
    
    // AI SUPPORT
    askAI(question) {
        const responses = {
            id: {
                shipping: 'Kami menawarkan pengiriman ke seluruh dunia dalam 5-7 hari kerja. Pengiriman ekspres tersedia dengan biaya tambahan $25.',
                price: 'Harga kami kompetitif. Hubungi sales@axelux.store untuk diskon pembelian dalam jumlah besar.',
                refund: 'Garansi uang kembali 30 hari. Tanpa pertanyaan. Hubungi dukungan untuk pengembalian.',
                contact: 'Email: support@axelux.store | Telepon: +1-800-AXELUX | Jam Operasional: 24/7',
                default: 'Terima kasih atas pertanyaan Anda. Tim kami akan merespons dalam 24 jam. Untuk bantuan segera, lihat bagian FAQ kami.'
            },
            en: {
                shipping: 'We offer worldwide shipping within 5-7 business days. Express shipping available for $25.',
                price: 'Our prices are competitive. Contact sales@axelux.store for bulk discounts.',
                refund: '30-day money back guarantee. No questions asked. Contact support for returns.',
                contact: 'Email: support@axelux.store | Phone: +1-800-AXELUX | Hours: 24/7',
                default: 'Thank you for your inquiry. Our team will respond within 24 hours. For immediate assistance, check our FAQ section.'
            }
        };
        
        const langResponses = responses[this.language] || responses['en'];
        let response = langResponses.default;
        question = question.toLowerCase();
        
        if (question.includes('ship') || question.includes('delivery') || question.includes('pengiriman')) {
            response = langResponses.shipping;
        } else if (question.includes('price') || question.includes('cost') || question.includes('harga')) {
            response = langResponses.price;
        } else if (question.includes('refund') || question.includes('return') || question.includes('garansi')) {
            response = langResponses.refund;
        } else if (question.includes('contact') || question.includes('support') || question.includes('hubung')) {
            response = langResponses.contact;
        }
        
        this.logAction('AI_QUERY', `Question: ${question.substring(0, 50)}...`);
        return response;
    }
    
    // UI UPDATES
    updateUI() {
        if (this.currentUser) {
            // Update user info
            document.getElementById('sidebarUsername').textContent = this.currentUser.displayName;
            document.getElementById('sidebarUserEmail').textContent = this.currentUser.email || 'guest@example.com';
            document.getElementById('userRoleDisplay').textContent = this.translate(`role.${this.currentUser.role}`);
            
            // Update avatar icon based on role
            const avatarIcon = document.getElementById('avatarIcon');
            if (avatarIcon) {
                avatarIcon.className = this.currentUser.role === 'owner' ? 'fas fa-crown' : 
                                     this.currentUser.role === 'guest' ? 'fas fa-user' : 'fas fa-user-circle';
            }
        }
        
        // Update stats
        document.getElementById('miniVisitors').textContent = this.visitors.length;
        document.getElementById('miniProducts').textContent = this.products.length;
        document.getElementById('miniReviews').textContent = this.testimonials.length;
        document.getElementById('reviewBadge').textContent = this.testimonials.length;
        
        // Update password strength
        this.updatePasswordStrength();
        
        // Update translations
        this.updateTranslations();
    }
    
    updatePasswordStrength() {
        const passwordInput = document.getElementById('regPassword');
        const strengthBar = document.getElementById('passwordStrength');
        
        if (!passwordInput || !strengthBar) return;
        
        passwordInput.addEventListener('input', () => {
            const password = passwordInput.value;
            let strength = 0;
            
            if (password.length >= 6) strength += 25;
            if (password.length >= 8) strength += 25;
            if (/[A-Z]/.test(password)) strength += 25;
            if (/[0-9]/.test(password)) strength += 25;
            
            strengthBar.style.width = `${strength}%`;
            strengthBar.style.background = strength < 50 ? 'var(--danger)' : 
                                          strength < 75 ? 'var(--warning)' : 'var(--success)';
        });
    }
    
    // PAGE NAVIGATION
    showLoginPage() {
        document.getElementById('loginPage').classList.add('active');
        document.getElementById('mainPage').classList.remove('active');
    }
    
    showMainPage() {
        document.getElementById('loginPage').classList.remove('active');
        document.getElementById('mainPage').classList.add('active');
        this.renderContentSections();
    }
    
    showSection(sectionId) {
        this.renderSection(sectionId);
    }
    
    // CONTENT RENDERING
    renderUI() {
        this.renderContentSections();
    }
    
    renderContentSections() {
        const container = document.getElementById('contentSections');
        if (!container) return;
        
        // This would render different sections based on current view
        // For now, we'll just show a welcome message
        container.innerHTML = `
            <div class="welcome-section">
                <h1>${this.translate('welcome.title', { name: this.currentUser?.displayName || 'Guest' })}</h1>
                <p>${this.translate('welcome.subtitle')}</p>
                
                <div class="quick-stats">
                    <div class="stat-card">
                        <i class="fas fa-users"></i>
                        <h3>${this.visitors.length}</h3>
                        <p>${this.translate('stats.visitors')}</p>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-box"></i>
                        <h3>${this.products.length}</h3>
                        <p>${this.translate('stats.products')}</p>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-star"></i>
                        <h3>${this.testimonials.length}</h3>
                        <p>${this.translate('stats.reviews')}</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderSection(sectionId) {
        // This would render different sections
        console.log('Rendering section:', sectionId);
    }
    
    // EVENT LISTENERS
    setupEventListeners() {
        // Login form
        document.getElementById('formLogin')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            const adminMode = document.getElementById('adminMode').checked;
            
            this.login(username, password, adminMode);
        });
        
        // Register form
        document.getElementById('formRegister')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('regUsername').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;
            const confirm = document.getElementById('regConfirmPassword').value;
            
            if (password !== confirm) {
                this.showError(this.translate('error.passwordMatch'));
                return;
            }
            
            this.register(username, email, password);
        });
        
        // Password strength
        this.updatePasswordStrength();
        
        // Language change
        window.changeLanguage = (lang) => {
            this.setLanguage(lang);
            if (this.currentUser) {
                // Update user language preference
                const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
                if (userIndex !== -1) {
                    this.users[userIndex].language = lang;
                    this.saveUsers();
                }
            }
        };
    }
    
    // LOGGING
    logAction(action, details) {
        const log = {
            timestamp: new Date().toISOString(),
            action,
            details,
            user: this.currentUser ? this.currentUser.username : 'system',
            ip: this.visitorId,
            language: this.language
        };
        
        this.logs.push(log);
        
        // Keep only last 200 logs
        if (this.logs.length > 200) {
            this.logs = this.logs.slice(-200);
        }
        
        this.saveLogs();
    }
    
    // NOTIFICATION SYSTEM
    showError(message) {
        this.showNotification(message, 'error');
        console.error('Error:', message);
    }
    
    showSuccess(message) {
        this.showNotification(message, 'success');
        console.log('Success:', message);
    }
    
    showInfo(message) {
        this.showNotification(message, 'info');
    }
    
    showNotification(message, type = 'info') {
        const container = document.getElementById('notificationArea');
        if (!container) return;
        
        // Remove existing notifications
        const existing = container.querySelectorAll('.notification');
        existing.forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 
                            type === 'error' ? 'exclamation-circle' : 
                            'info-circle'}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;
        
        container.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
}

// GLOBAL FUNCTIONS
function showLoginForm() {
    document.getElementById('registerForm').classList.remove('active');
    document.getElementById('loginFormContainer').classList.add('active');
}

function showRegisterForm() {
    document.getElementById('loginFormContainer').classList.remove('active');
    document.getElementById('registerForm').classList.add('active');
}

function enterAsGuest() {
    axelux.guestLogin();
}

function directAdminLogin() {
    axelux.login('Axm', 'brandalz70', true);
}

function logout() {
    axelux.logout();
}

function setTheme(theme) {
    axelux.setTheme(theme);
}

function showAdminHint() {
    axelux.showInfo(axelux.translate('info.adminHint'));
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    
    if (input.type === 'password') {
        input.type = 'text';
        button.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        input.type = 'password';
        button.innerHTML = '<i class="fas fa-eye"></i>';
    }
}

// Initialize application
const axelux = new AxeLuxStore();

// Make available globally
window.axelux = axelux;
window.showLoginForm = showLoginForm;
window.showRegisterForm = showRegisterForm;
window.enterAsGuest = enterAsGuest;
window.directAdminLogin = directAdminLogin;
window.logout = logout;
window.setTheme = setTheme;
window.showAdminHint = showAdminHint;
window.togglePassword = togglePassword;
window.showSection = (section) => axelux.showSection(section);
window.changeLanguage = (lang) => axelux.setLanguage(lang);

// Add notification styles
if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        #notificationArea {
            position: fixed;
            top: 100px;
            right: 30px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 15px;
            max-width: 400px;
        }
        
        .notification {
            padding: 20px 25px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            gap: 15px;
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
            animation: slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            transform-origin: right;
        }
        
        .notification i {
            font-size: 1.4rem;
            flex-shrink: 0;
        }
        
        .notification.success {
            background: rgba(16, 185, 129, 0.15);
            border-left: 6px solid #10b981;
            color: #10b981;
        }
        
        .notification.error {
            background: rgba(239, 68, 68, 0.15);
            border-left: 6px solid #ef4444;
            color: #ef4444;
        }
        
        .notification.info {
            background: rgba(59, 130, 246, 0.15);
            border-left: 6px solid #3b82f6;
            color: #3b82f6;
        }
        
        .notification button {
            margin-left: auto;
            background: transparent;
            border: none;
            color: inherit;
            cursor: pointer;
            font-size: 22px;
            opacity: 0.7;
            padding: 0 5px;
            transition: opacity 0.3s;
        }
        
        .notification button:hover {
            opacity: 1;
        }
        
        @keyframes slideInRight {
            0% {
                opacity: 0;
                transform: translateX(100%) scale(0.8);
            }
            100% {
                opacity: 1;
                transform: translateX(0) scale(1);
            }
        }
        
        @keyframes slideOutRight {
            0% {
                opacity: 1;
                transform: translateX(0) scale(1);
            }
            100% {
                opacity: 0;
                transform: translateX(100%) scale(0.8);
            }
        }
        
        .quick-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 40px;
        }
        
        .stat-card {
            background: var(--bg-card);
            border-radius: var(--radius);
            padding: 25px;
            border: 1px solid var(--border);
            text-align: center;
            transition: var(--transition);
        }
        
        .stat-card:hover {
            transform: translateY(-5px);
            border-color: var(--primary);
            box-shadow: 0 15px 40px var(--shadow);
        }
        
        .stat-card i {
            font-size: 2.5rem;
            color: var(--primary);
            margin-bottom: 15px;
        }
        
        .stat-card h3 {
            font-size: 2.8rem;
            font-weight: 800;
            margin: 10px 0;
            background: linear-gradient(135deg, var(--primary), var(--accent));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .stat-card p {
            color: var(--text-secondary);
            font-size: 0.95rem;
        }
        
        .welcome-section {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 0;
        }
        
        .welcome-section h1 {
            font-size: 3rem;
            margin-bottom: 20px;
            background: linear-gradient(135deg, var(--primary), var(--accent));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .welcome-section p {
            font-size: 1.2rem;
            color: var(--text-secondary);
            max-width: 800px;
            line-height: 1.8;
        }
    `;
    document.head.appendChild(style);
}
