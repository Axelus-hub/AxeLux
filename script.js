// AXELUX STORE - CORE APPLICATION
class AxeLuxStore {
    constructor() {
        this.currentUser = null;
        this.isAdmin = false;
        this.theme = 'dark';
        this.visitorId = null;
        this.users = [];
        this.products = [];
        this.testimonials = [];
        this.visitors = [];
        this.logs = [];
        
        this.init();
    }
    
    init() {
        this.loadData();
        this.setupEventListeners();
        this.setTheme(this.getSavedTheme());
        this.checkAuth();
        this.trackVisitor();
        this.render();
    }
    
    // DATA MANAGEMENT
    loadData() {
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
                lastLogin: null
            });
            this.saveUsers();
        }
        
        // Load other data
        this.products = JSON.parse(localStorage.getItem('axelux_products') || '[]');
        this.testimonials = JSON.parse(localStorage.getItem('axelux_testimonials') || '[]');
        this.visitors = JSON.parse(localStorage.getItem('axelux_visitors') || '[]');
        this.logs = JSON.parse(localStorage.getItem('axelux_logs') || '[]');
        
        // Initialize sample products if empty
        if (this.products.length === 0) {
            this.products = [
                { id: 1, name: 'Premium Watch', price: '$299', category: 'Electronics', stock: 10 },
                { id: 2, name: 'Wireless Earbuds', price: '$199', category: 'Audio', stock: 25 },
                { id: 3, name: 'Smartphone X', price: '$999', category: 'Electronics', stock: 5 },
                { id: 4, name: 'Leather Wallet', price: '$89', category: 'Accessories', stock: 50 }
            ];
            this.saveProducts();
        }
    }
    
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
        } else {
            this.showLoginPage();
        }
    }
    
    register(username, email, password) {
        // Validation
        if (password.length < 6) {
            this.showError('Password must be at least 6 characters');
            return false;
        }
        
        // Check if user exists
        if (this.users.find(u => u.username === username || u.email === email)) {
            this.showError('Username or email already exists');
            return false;
        }
        
        // Create user
        const newUser = {
            id: 'user_' + Date.now(),
            username,
            email,
            password: btoa(password),
            role: 'user',
            created: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        };
        
        this.users.push(newUser);
        this.saveUsers();
        
        // Auto login
        this.login(username, password);
        
        this.logAction('USER_REGISTER', `New user: ${username}`);
        this.showSuccess(`Welcome ${username}! Account created successfully.`);
        
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
                role: user.role
            };
            
            this.isAdmin = user.role === 'owner';
            
            // Save session
            localStorage.setItem('axelux_current_user', JSON.stringify(this.currentUser));
            localStorage.setItem('axelux_role', user.role);
            
            if (this.isAdmin) {
                document.body.classList.add('show-admin');
            }
            
            this.showMainPage();
            this.updateUI();
            
            this.logAction('USER_LOGIN', `${user.username} logged in`);
            this.showSuccess(`Welcome back, ${user.username}!`);
            
            return true;
        } else {
            this.showError('Invalid username/email or password');
            return false;
        }
    }
    
    guestLogin() {
        this.currentUser = {
            id: 'guest_' + Date.now(),
            username: 'guest_' + Math.random().toString(36).substr(2, 6),
            displayName: 'Guest User',
            role: 'guest'
        };
        
        localStorage.setItem('axelux_current_user', JSON.stringify(this.currentUser));
        localStorage.setItem('axelux_role', 'guest');
        
        this.showMainPage();
        this.updateUI();
        
        this.logAction('GUEST_LOGIN', 'Guest user entered');
        this.showInfo('You are browsing as guest. Some features are limited.');
        
        return true;
    }
    
    logout() {
        this.logAction('USER_LOGOUT', `${this.currentUser.username} logged out`);
        
        this.currentUser = null;
        this.isAdmin = false;
        
        localStorage.removeItem('axelux_current_user');
        localStorage.removeItem('axelux_role');
        document.body.classList.remove('show-admin');
        
        this.showLoginPage();
        this.showSuccess('Logged out successfully');
    }
    
    // VISITOR TRACKING
    trackVisitor() {
        this.visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        const visitor = {
            id: this.visitorId,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            screen: `${window.screen.width}x${window.screen.height}`,
            user: this.currentUser ? this.currentUser.username : 'anonymous'
        };
        
        this.visitors.push(visitor);
        this.saveVisitors();
        
        // Keep only last 100 visitors
        if (this.visitors.length > 100) {
            this.visitors = this.visitors.slice(-100);
            this.saveVisitors();
        }
    }
    
    // TESTIMONIALS
    addTestimonial(text, isFake = false) {
        if (!this.currentUser || this.currentUser.role === 'guest') {
            this.showError('Please login to submit testimonials');
            return false;
        }
        
        const testimonial = {
            id: 'review_' + Date.now(),
            author: this.currentUser.displayName,
            text: text,
            rating: 5,
            date: new Date().toISOString(),
            fake: isFake,
            verified: !isFake
        };
        
        this.testimonials.push(testimonial);
        this.saveTestimonials();
        
        this.logAction('TESTIMONIAL_ADDED', `${isFake ? 'Fake' : 'Real'} testimonial added`);
        this.showSuccess(isFake ? 'Fake testimonial added!' : 'Thank you for your review!');
        
        return true;
    }
    
    addFakeTestimonials(count) {
        if (!this.isAdmin) {
            this.showError('Admin access required');
            return;
        }
        
        const fakeNames = ['Alex Johnson', 'Maria Garcia', 'James Smith', 'Lisa Wang', 'Robert Brown'];
        const fakeTexts = [
            'Amazing product! Exceeded all expectations.',
            'Best purchase ever. Highly recommended!',
            'Quality is outstanding. Worth every penny.',
            'Customer service was excellent.',
            'I would recommend this to everyone.'
        ];
        
        for (let i = 0; i < count; i++) {
            this.addTestimonial(
                fakeTexts[Math.floor(Math.random() * fakeTexts.length)],
                true
            );
        }
        
        this.showSuccess(`Added ${count} fake testimonials`);
    }
    
    // PRODUCTS
    addProduct(name, price, category, stock) {
        if (!this.isAdmin) {
            this.showError('Admin access required');
            return false;
        }
        
        const product = {
            id: 'prod_' + Date.now(),
            name,
            price,
            category,
            stock: parseInt(stock),
            added: new Date().toISOString()
        };
        
        this.products.push(product);
        this.saveProducts();
        
        this.logAction('PRODUCT_ADDED', `New product: ${name}`);
        return true;
    }
    
    // AI SUPPORT
    askAI(question) {
        const responses = {
            shipping: 'We offer worldwide shipping within 5-7 business days. Express shipping available for $25.',
            price: 'Our prices are competitive. Contact us at sales@axelux.store for bulk discounts.',
            refund: '30-day money back guarantee. No questions asked. Contact support for returns.',
            contact: 'Email: support@axelux.store | Phone: +1-800-AXELUX | Hours: 24/7',
            default: 'Thank you for your inquiry. Our team will respond within 24 hours. For immediate assistance, check our FAQ section.'
        };
        
        let response = responses.default;
        question = question.toLowerCase();
        
        if (question.includes('ship') || question.includes('delivery')) response = responses.shipping;
        else if (question.includes('price') || question.includes('cost')) response = responses.price;
        else if (question.includes('refund') || question.includes('return')) response = responses.refund;
        else if (question.includes('contact') || question.includes('support')) response = responses.contact;
        
        this.logAction('AI_QUERY', `Question: ${question.substring(0, 50)}...`);
        return response;
    }
    
    // DATABASE OPERATIONS
    viewDatabase(tab = 'users') {
        if (!this.isAdmin) {
            this.showError('Admin access required');
            return;
        }
        
        let output = '';
        
        switch(tab) {
            case 'users':
                output = JSON.stringify(this.users, null, 2);
                break;
            case 'products':
                output = JSON.stringify(this.products, null, 2);
                break;
            case 'reviews':
                output = JSON.stringify(this.testimonials, null, 2);
                break;
            case 'logs':
                output = JSON.stringify(this.logs.slice(-50), null, 2);
                break;
            default:
                output = 'Select a tab to view data';
        }
        
        document.getElementById('databaseOutput').textContent = output;
    }
    
    nukeDatabase() {
        if (!this.isAdmin) return;
        
        if (confirm('⚠️ NUKE DATABASE? This will delete ALL data except users. Cannot be undone!')) {
            this.products = [];
            this.testimonials = [];
            this.visitors = [];
            this.logs = [];
            
            this.saveProducts();
            this.saveTestimonials();
            this.saveVisitors();
            this.saveLogs();
            
            this.showSuccess('Database nuked. System reset.');
            this.logAction('DATABASE_NUKE', 'All data cleared');
            
            setTimeout(() => location.reload(), 2000);
        }
    }
    
    // THEME
    setTheme(theme) {
        this.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('axelux_theme', theme);
    }
    
    getSavedTheme() {
        return localStorage.getItem('axelux_theme') || 'dark';
    }
    
    // LOGGING
    logAction(action, details) {
        const log = {
            timestamp: new Date().toISOString(),
            action,
            details,
            user: this.currentUser ? this.currentUser.username : 'system',
            ip: this.visitorId
        };
        
        this.logs.push(log);
        
        // Keep only last 200 logs
        if (this.logs.length > 200) {
            this.logs = this.logs.slice(-200);
        }
        
        this.saveLogs();
    }
    
    // UI UPDATES
    updateUI() {
        if (this.currentUser) {
            document.getElementById('currentUsername').textContent = this.currentUser.displayName;
            document.getElementById('currentRole').textContent = this.currentUser.role;
            document.getElementById('userStatus').textContent = this.currentUser.role === 'owner' ? 'Owner Mode' : 'User Mode';
            
            document.getElementById('settingUsername').textContent = this.currentUser.username;
            document.getElementById('settingRole').textContent = this.currentUser.role;
            document.getElementById('settingJoinDate').textContent = new Date().toLocaleDateString();
        }
        
        // Update stats
        document.getElementById('statVisitors').textContent = this.visitors.length;
        document.getElementById('statProducts').textContent = this.products.length;
        document.getElementById('statReviews').textContent = this.testimonials.length;
        
        // Update live visitors
        this.updateLiveVisitors();
        
        // Render products and testimonials
        this.renderProducts();
        this.renderTestimonials();
    }
    
    updateLiveVisitors() {
        const container = document.getElementById('liveVisitors');
        if (!container) return;
        
        const recentVisitors = this.visitors.slice(-10).reverse();
        
        if (recentVisitors.length === 0) {
            container.innerHTML = '<p class="empty-state">No active visitors</p>';
            return;
        }
        
        container.innerHTML = recentVisitors.map(v => `
            <div class="visitor-item">
                <i class="fas fa-user-circle"></i>
                <span>${v.user}</span>
                <span class="time">${new Date(v.timestamp).toLocaleTimeString()}</span>
            </div>
        `).join('');
    }
    
    renderProducts() {
        const container = document.getElementById('productsGrid');
        if (!container) return;
        
        container.innerHTML = this.products.map(p => `
            <div class="product-card">
                <h3>${p.name}</h3>
                <p class="price">${p.price}</p>
                <p class="category">${p.category}</p>
                <p class="stock">Stock: ${p.stock}</p>
                ${this.isAdmin ? `
                    <button class="btn-secondary" onclick="axelux.deleteProduct('${p.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                ` : ''}
            </div>
        `).join('');
    }
    
    renderTestimonials() {
        const container = document.getElementById('testimonialsGrid');
        if (!container) return;
        
        const recentReviews = this.testimonials.slice(-20).reverse();
        
        container.innerHTML = recentReviews.map(t => `
            <div class="testimonial-card ${t.fake ? 'fake' : ''}">
                <div class="review-header">
                    <strong>${t.author}</strong>
                    <span class="review-date">${new Date(t.date).toLocaleDateString()}</span>
                    ${t.fake ? '<span class="badge fake-badge">FAKE</span>' : ''}
                </div>
                <div class="review-text">${t.text}</div>
                <div class="review-rating">
                    ${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}
                </div>
            </div>
        `).join('');
    }
    
    // PAGE NAVIGATION
    showLoginPage() {
        document.getElementById('loginPage').classList.add('active');
        document.getElementById('mainPage').classList.remove('active');
    }
    
    showMainPage() {
        document.getElementById('loginPage').classList.remove('active');
        document.getElementById('mainPage').classList.add('active');
        this.updateUI();
    }
    
    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(s => {
            s.classList.remove('active');
        });
        
        // Remove active from all menu items
        document.querySelectorAll('.menu-item').forEach(m => {
            m.classList.remove('active');
        });
        
        // Show selected section
        document.getElementById(sectionId).classList.add('active');
        
        // Add active to clicked menu item
        event.target.closest('.menu-item').classList.add('active');
        
        // If database section, load default tab
        if (sectionId === 'database' && this.isAdmin) {
            this.viewDatabase('users');
        }
    }
    
    showDatabaseTab(tab) {
        if (!this.isAdmin) return;
        
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        
        // Show tab content
        this.viewDatabase(tab);
    }
    
    // NOTIFICATIONS
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
                notification.style.animation = 'fadeOut 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
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
                this.showError('Passwords do not match');
                return;
            }
            
            this.register(username, email, password);
        });
        
        // AI Chat
        window.sendAIQuery = () => {
            const input = document.getElementById('userQuery');
            const question = input.value.trim();
            
            if (!question) return;
            
            // Add user message
            const chat = document.getElementById('chatMessages');
            chat.innerHTML += `
                <div class="message user">
                    <div class="message-avatar">You</div>
                    <div class="message-content">${question}</div>
                </div>
            `;
            
            // Get AI response
            const response = this.askAI(question);
            
            // Add AI response after delay
            setTimeout(() => {
                chat.innerHTML += `
                    <div class="message ai">
                        <div class="message-avatar">AI</div>
                        <div class="message-content">${response}</div>
                    </div>
                `;
                chat.scrollTop = chat.scrollHeight;
            }, 500);
            
            input.value = '';
        };
        
        // Quick questions
        window.askQuestion = (type) => {
            const questions = {
                shipping: 'What are the shipping options?',
                price: 'Are there any discounts?',
                refund: 'What is the return policy?',
                contact: 'How can I contact support?'
            };
            
            document.getElementById('userQuery').value = questions[type];
            sendAIQuery();
        };
        
        // Testimonial submission
        window.submitTestimonial = () => {
            const textarea = document.getElementById('newTestimonial');
            const text = textarea.value.trim();
            
            if (!text) {
                this.showError('Please enter review text');
                return;
            }
            
            if (this.addTestimonial(text, false)) {
                textarea.value = '';
                this.renderTestimonials();
                this.updateUI();
            }
        };
        
        // Admin functions
        window.addFakeTestimonials = (count) => this.addFakeTestimonials(count);
        window.wipeVisitorData = () => {
            if (!this.isAdmin) return;
            this.visitors = [];
            this.saveVisitors();
            this.updateUI();
            this.showSuccess('Visitor data cleared');
        };
        
        window.showAdminAccess = () => {
            document.getElementById('adminAccess').style.display = 'block';
        };
        
        window.verifyAdminCredentials = () => {
            const username = document.getElementById('adminUsername').value;
            const password = document.getElementById('adminPassword').value;
            
            if (username === 'Axm' && password === 'brandalz70') {
                this.login(username, password, true);
                this.hideAdminModal();
            } else {
                this.showError('Invalid admin credentials');
            }
        };
        
        window.hideAdminModal = () => {
            document.getElementById('adminModal').classList.remove('active');
        };
        
        window.showNukeConfirm = () => {
            if (confirm('⚠️ THIS WILL DELETE ALL DATA EXCEPT USERS!\n\nAre you absolutely sure?')) {
                this.nukeDatabase();
            }
        };
    }
    
    // RENDER INITIAL UI
    render() {
        this.updateUI();
        
        // Show admin quick access if URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('admin') === 'true') {
            document.getElementById('adminAccess').style.display = 'block';
        }
    }
}

// GLOBAL FUNCTIONS
function showLoginForm() {
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginFormContainer').style.display = 'block';
}

function showRegisterForm() {
    document.getElementById('loginFormContainer').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
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
    axelux.showInfo('Owner Mode: Use username "Axm" and password "brandalz70"');
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
window.showSection = (section) => axelux.showSection(section);
window.showDatabaseTab = (tab) => axelux.showDatabaseTab(tab);

// Add CSS for notifications if not exists
if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        #notificationArea {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .notification {
            padding: 16px 20px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 12px;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .notification.success {
            background: rgba(16, 185, 129, 0.15);
            border-left: 4px solid #10b981;
            color: #10b981;
        }
        
        .notification.error {
            background: rgba(239, 68, 68, 0.15);
            border-left: 4px solid #ef4444;
            color: #ef4444;
        }
        
        .notification.info {
            background: rgba(59, 130, 246, 0.15);
            border-left: 4px solid #3b82f6;
            color: #3b82f6;
        }
        
        .notification button {
            margin-left: auto;
            background: transparent;
            border: none;
            color: inherit;
            cursor: pointer;
            font-size: 20px;
            opacity: 0.7;
        }
        
        .notification button:hover {
            opacity: 1;
        }
        
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes fadeOut {
            to { opacity: 0; transform: translateY(-10px); }
        }
        
        .fake-badge {
            background: #f59e0b;
            color: white;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 600;
        }
        
        .role-badge {
            background: var(--primary);
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
        }
    `;
    document.head.appendChild(style);
}
