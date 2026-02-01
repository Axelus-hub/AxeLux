// ===================== CONFIGURATION =====================
// Firebase Configuration (Replace with your own)
const firebaseConfig = {
    apiKey: "AIzaSyYourAPIKeyHere1234567890",
    authDomain: "axelux-project.firebaseapp.com",
    projectId: "axelux-project",
    storageBucket: "axelux-project.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890abcdef"
};

// Initialize Firebase
try {
    firebase.initializeApp(firebaseConfig);
} catch (err) {
    console.log("Firebase already initialized");
}

const db = firebase.firestore();
const auth = firebase.auth();

// ===================== GLOBAL STATE =====================
let currentUser = null;
let isAdmin = false;
let currentTheme = 'blue';
let currentLanguage = 'id';
let activeDbTab = 'users';

// Language Translations
const translations = {
    id: {
        // Login
        loginTitle: "Masuk ke Dashboard",
        btnLoginText: "Login",
        btnGuestText: "Masuk sebagai Guest",
        btnLogoutText: "Logout",
        
        // Navigation
        navHome: "Beranda",
        navProduct: "Produk",
        navCS: "Bantuan",
        navDB: "Database",
        navTesti: "Testimonial",
        navSettings: "Pengaturan",
        
        // Home
        homeTitle: "Dashboard Utama",
        homeDesc: "Pantau kinerja toko luxury Anda",
        statVisitors: "Total Pengunjung",
        statProducts: "Produk",
        statTesti: "Testimonial",
        statOnline: "Online Sekarang",
        
        // Products
        productTitle: "Produk Luxury",
        productDesc: "Koleksi eksklusif barang premium",
        
        // Customer Service
        csTitle: "Bantuan Pelanggan 24/7 AI",
        csDesc: "Respon otomatis bertenaga AI untuk pertanyaan Anda",
        
        // Database
        dbTitle: "Database Admin",
        dbDesc: "Kontrol penuh atas semua data dan pengguna",
        dbUsers: "Pengguna Terdaftar",
        dbAllTesti: "Semua Testimonial",
        
        // Testimonials
        testiTitle: "Testimonial Pelanggan",
        testiDesc: "Lihat apa kata pelanggan tentang kami",
        
        // Settings
        settingsTitle: "Pengaturan Akun",
        settingsDesc: "Sesuaikan pengalaman Anda",
        labelEmail: "Email",
        labelName: "Nama Tampilan",
        labelTheme: "Tema",
        labelLanguage: "Bahasa",
        btnSave: "Simpan Perubahan",
        
        // Footer
        footerText: "Toko Luxury Premium © 2023. Semua hak dilindungi.",
        
        // Messages
        loginError: "Email/password salah!",
        loginSuccess: "Login berhasil!",
        guestWelcome: "Selamat datang sebagai tamu!",
        adminWelcome: "Selamat datang, Admin!",
        testimonialAdded: "Testimonial berhasil ditambahkan!",
        productAdded: "Produk berhasil ditambahkan!",
        dataExported: "Data berhasil diexport!",
        confirmDelete: "Apakah Anda yakin? Tindakan ini tidak dapat dibatalkan!",
        featureDisabled: "Fitur ini hanya untuk pengguna terdaftar!"
    },
    en: {
        loginTitle: "Login to Dashboard",
        btnLoginText: "Login",
        btnGuestText: "Enter as Guest",
        btnLogoutText: "Logout",
        navHome: "Home",
        navProduct: "Products",
        navCS: "Support",
        navDB: "Database",
        navTesti: "Testimonials",
        navSettings: "Settings",
        homeTitle: "Main Dashboard",
        homeDesc: "Monitor your luxury store performance",
        statVisitors: "Total Visitors",
        statProducts: "Products",
        statTesti: "Testimonials",
        statOnline: "Online Now",
        productTitle: "Luxury Products",
        productDesc: "Exclusive collection of premium items",
        csTitle: "24/7 AI Customer Support",
        csDesc: "AI-powered automatic responses to your queries",
        dbTitle: "Admin Database",
        dbDesc: "Full control over all data and users",
        dbUsers: "Registered Users",
        dbAllTesti: "All Testimonials",
        testiTitle: "Customer Testimonials",
        testiDesc: "See what our customers say about us",
        settingsTitle: "Account Settings",
        settingsDesc: "Customize your experience",
        labelEmail: "Email",
        labelName: "Display Name",
        labelTheme: "Theme",
        labelLanguage: "Language",
        btnSave: "Save Changes",
        footerText: "Premium Luxury Store © 2023. All rights reserved.",
        loginError: "Wrong email/password!",
        loginSuccess: "Login successful!",
        guestWelcome: "Welcome as guest!",
        adminWelcome: "Welcome, Admin!",
        testimonialAdded: "Testimonial added successfully!",
        productAdded: "Product added successfully!",
        dataExported: "Data exported successfully!",
        confirmDelete: "Are you sure? This action cannot be undone!",
        featureDisabled: "This feature is for registered users only!"
    },
    jp: {
        loginTitle: "ダッシュボードにログイン",
        btnLoginText: "ログイン",
        btnGuestText: "ゲストとして入る",
        btnLogoutText: "ログアウト",
        navHome: "ホーム",
        navProduct: "製品",
        navCS: "サポート",
        navDB: "データベース",
        navTesti: "お客様の声",
        navSettings: "設定",
        homeTitle: "メインダッシュボード",
        homeDesc: "ラグジュアリーストアのパフォーマンスを監視",
        statVisitors: "総訪問者数",
        statProducts: "製品",
        statTesti: "お客様の声",
        statOnline: "現在オンライン",
        productTitle: "ラグジュアリー製品",
        productDesc: "プレミアムアイテムの限定コレクション",
        csTitle: "24/7 AIカスタマーサポート",
        csDesc: "AIによる自動応答",
        dbTitle: "管理者データベース",
        dbDesc: "すべてのデータとユーザーの完全な制御",
        dbUsers: "登録ユーザー",
        dbAllTesti: "すべてのお客様の声",
        testiTitle: "お客様の声",
        testiDesc: "お客様の声をご覧ください",
        settingsTitle: "アカウント設定",
        settingsDesc: "エクスペリエンスをカスタマイズ",
        labelEmail: "メール",
        labelName: "表示名",
        labelTheme: "テーマ",
        labelLanguage: "言語",
        btnSave: "変更を保存",
        footerText: "プレミアムラグジュアリーストア © 2023. 全著作権所有.",
        loginError: "メール/パスワードが間違っています！",
        loginSuccess: "ログイン成功！",
        guestWelcome: "ゲストとしてようこそ！",
        adminWelcome: "管理者、ようこそ！",
        testimonialAdded: "お客様の声が追加されました！",
        productAdded: "製品が追加されました！",
        dataExported: "データがエクスポートされました！",
        confirmDelete: "本当によろしいですか？この操作は元に戻せません！",
        featureDisabled: "この機能は登録ユーザーのみ利用可能です！"
    },
    es: {
        loginTitle: "Iniciar sesión en el Panel",
        btnLoginText: "Iniciar sesión",
        btnGuestText: "Entrar como Invitado",
        btnLogoutText: "Cerrar sesión",
        navHome: "Inicio",
        navProduct: "Productos",
        navCS: "Soporte",
        navDB: "Base de datos",
        navTesti: "Testimonios",
        navSettings: "Ajustes",
        homeTitle: "Panel Principal",
        homeDesc: "Monitorea el rendimiento de tu tienda de lujo",
        statVisitors: "Visitantes Totales",
        statProducts: "Productos",
        statTesti: "Testimonios",
        statOnline: "En Línea Ahora",
        productTitle: "Productos de Lujo",
        productDesc: "Colección exclusiva de artículos premium",
        csTitle: "Soporte AI 24/7",
        csDesc: "Respuestas automáticas con IA para tus consultas",
        dbTitle: "Base de Datos de Admin",
        dbDesc: "Control total sobre todos los datos y usuarios",
        dbUsers: "Usuarios Registrados",
        dbAllTesti: "Todos los Testimonios",
        testiTitle: "Testimonios de Clientes",
        testiDesc: "Mira lo que dicen nuestros clientes",
        settingsTitle: "Ajustes de Cuenta",
        settingsDesc: "Personaliza tu experiencia",
        labelEmail: "Correo",
        labelName: "Nombre para mostrar",
        labelTheme: "Tema",
        labelLanguage: "Idioma",
        btnSave: "Guardar Cambios",
        footerText: "Tienda de Lujo Premium © 2023. Todos los derechos reservados.",
        loginError: "¡Correo/contraseña incorrectos!",
        loginSuccess: "¡Inicio de sesión exitoso!",
        guestWelcome: "¡Bienvenido como invitado!",
        adminWelcome: "¡Bienvenido, Administrador!",
        testimonialAdded: "¡Testimonio agregado exitosamente!",
        productAdded: "¡Producto agregado exitosamente!",
        dataExported: "¡Datos exportados exitosamente!",
        confirmDelete: "¿Estás seguro? ¡Esta acción no se puede deshacer!",
        featureDisabled: "¡Esta función es solo para usuarios registrados!"
    }
};

// Random names for fake testimonials
const indonesianNames = ["Budi Santoso", "Sari Dewi", "Agus Setiawan", "Rina Wati", "Dian Permata", "Hendra Wijaya", "Maya Sari", "Fajar Nugroho", "Lina Hartati", "Rudi Prasetyo"];
const internationalNames = ["John Smith", "Emma Wilson", "Carlos Rodriguez", "Yuki Tanaka", "Mohammed Ali", "Sophie Martin", "Luca Rossi", "Anna Schmidt", "David Lee", "Maria Garcia"];
const countries = ["Indonesia", "USA", "Japan", "Germany", "UK", "France", "Italy", "Spain", "Singapore", "Australia"];

// ===================== INITIALIZATION =====================
document.addEventListener('DOMContentLoaded', function() {
    // Load saved preferences
    currentTheme = localStorage.getItem('axelux_theme') || 'blue';
    currentLanguage = localStorage.getItem('axelux_language') || 'id';
    
    // Apply saved settings
    setTheme(currentTheme);
    changeLanguage();
    
    // Initialize Firebase listeners
    initFirebase();
    
    // Set up event listeners
    setupEventListeners();
    
    // Check authentication state
    checkAuthState();
});

function initFirebase() {
    // Firebase listeners for real-time updates
    db.collection("products").onSnapshot(updateProductCount);
    db.collection("testimonials").onSnapshot(updateTestimonialCount);
    db.collection("visitors").onSnapshot(updateVisitorStats);
    
    // Update theme selectors
    document.getElementById('themeSelect').value = currentTheme;
    document.getElementById('themeSelectSettings').value = currentTheme;
    
    // Update language selectors
    document.getElementById('langSelect').value = currentLanguage;
    document.getElementById('langSelectMain').value = currentLanguage;
    document.getElementById('languageSelect').value = currentLanguage;
}

function setupEventListeners() {
    // Enter key support for login
    document.getElementById('loginPassword')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') login();
    });
    
    // Enter key for chat
    document.getElementById('userQuestion')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendQuestion();
    });
    
    // FAQ buttons
    document.querySelectorAll('.faq-item').forEach(btn => {
        btn.addEventListener('click', function() {
            document.getElementById('userQuestion').value = this.textContent;
        });
    });
}

// ===================== AUTHENTICATION =====================
function checkAuthState() {
    auth.onAuthStateChanged(user => {
        currentUser = user;
        
        if (user) {
            // Check if user is admin
            isAdmin = (user.email === "axm@axelux.com" || 
                      (user.displayName && user.displayName.includes("Axm")) ||
                      (user.email === "axm@axelux.com"));
            
            // Log user activity
            logUserVisit();
            
            // Update UI
            showMainApp();
            updateUIForUser();
            
            // Show welcome message
            showNotification(isAdmin ? translations[currentLanguage].adminWelcome : 
                                        translations[currentLanguage].guestWelcome, 'success');
        } else {
            showLoginPage();
        }
    });
}

function login() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Clear any previous messages
    document.getElementById('loginMsg').textContent = '';
    
    // Special owner login (hidden from public)
    if (email === "Axm" && password === "brandalz70") {
        // Try to sign in with owner credentials
        auth.signInWithEmailAndPassword("axm@axelux.com", "brandalz70")
            .catch(error => {
                // If owner account doesn't exist, create it
                if (error.code === 'auth/user-not-found') {
                    auth.createUserWithEmailAndPassword("axm@axelux.com", "brandalz70")
                        .then(cred => {
                            return cred.user.updateProfile({
                                displayName: "Axm (Owner)"
                            });
                        })
                        .then(() => {
                            showNotification("Owner account created successfully!", 'success');
                        });
                } else {
                    showNotification(translations[currentLanguage].loginError, 'error');
                }
            });
        return;
    }
    
    // Regular email/password login
    if (email.includes('@')) {
        auth.signInWithEmailAndPassword(email, password)
            .catch(error => {
                showNotification(translations[currentLanguage].loginError, 'error');
            });
    } else {
        // Username login (not implemented in Firebase, show error)
        showNotification("Please use email to login", 'error');
    }
}

function signInAsGuest() {
    auth.signInAnonymously()
        .then(() => {
            showNotification(translations[currentLanguage].guestWelcome, 'success');
        })
        .catch(error => {
            showNotification("Guest login failed", 'error');
        });
}

function logout() {
    auth.signOut()
        .then(() => {
            showNotification("Logged out successfully", 'info');
        });
}

// ===================== UI FUNCTIONS =====================
function showLoginPage() {
    document.getElementById('loginPage').classList.remove('hidden');
    document.getElementById('mainApp').classList.add('hidden');
    document.body.classList.remove('admin');
}

function showMainApp() {
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    
    if (isAdmin) {
        document.body.classList.add('admin');
    }
}

function updateUIForUser() {
    // Update welcome message
    const welcomeElement = document.getElementById('welcomeUser');
    const roleElement = document.getElementById('userRole');
    
    if (currentUser) {
        if (isAdmin) {
            welcomeElement.textContent = "Axm (Owner)";
            roleElement.textContent = "Administrator";
        } else if (currentUser.isAnonymous) {
            welcomeElement.textContent = "Guest User";
            roleElement.textContent = "Visitor";
        } else {
            welcomeElement.textContent = currentUser.email || "User";
            roleElement.textContent = "Member";
        }
    }
    
    // Show/hide testimonial submission based on login status
    const testimonialSection = document.getElementById('addTestimoniSection');
    if (currentUser && !currentUser.isAnonymous) {
        testimonialSection.style.display = 'block';
    } else {
        testimonialSection.style.display = 'none';
    }
    
    // Load data
    loadProducts();
    loadTestimonials();
    loadUserList();
    updateStats();
}

function setTheme(theme) {
    currentTheme = theme;
    document.body.className = `theme-${theme}`;
    
    // Update theme selectors
    document.getElementById('themeSelect').value = theme;
    document.getElementById('themeSelectSettings').value = theme;
    
    // Update active theme buttons
    document.querySelectorAll('.theme-option').forEach(btn => {
        btn.classList.remove('active');
        if (btn.classList.contains(theme)) {
            btn.classList.add('active');
        }
    });
    
    // Save preference
    localStorage.setItem('axelux_theme', theme);
}

function changeLanguage() {
    const langSelect = document.getElementById('langSelect') || 
                      document.getElementById('langSelectMain') || 
                      document.getElementById('languageSelect');
    
    if (langSelect) {
        currentLanguage = langSelect.value;
        
        // Update all language selectors
        document.querySelectorAll('.lang-dropdown, #languageSelect').forEach(select => {
            select.value = currentLanguage;
        });
        
        // Apply translations
        applyTranslations();
        
        // Save preference
        localStorage.setItem('axelux_language', currentLanguage);
    }
}

function applyTranslations() {
    const lang = currentLanguage;
    const texts = translations[lang];
    
    if (!texts) return;
    
    // Update all translatable elements
    Object.keys(texts).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            if (element.tagName === 'INPUT' && element.type !== 'submit') {
                element.placeholder = texts[key];
            } else {
                element.textContent = texts[key];
            }
        }
    });
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active-section');
    });
    
    // Show selected section
    document.getElementById(sectionId + 'Section').classList.add('active-section');
    
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Find and activate the corresponding nav link
    const activeLink = document.querySelector(`[onclick="showSection('${sectionId}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Special handling for database section (admin only)
    if (sectionId === 'database' && !isAdmin) {
        showSection('home');
        showNotification("Admin access required", 'error');
    }
}

function showDbTab(tabId) {
    activeDbTab = tabId;
    
    // Update tab buttons
    document.querySelectorAll('.db-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelector(`.db-tab[onclick="showDbTab('${tabId}')"]`).classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.db-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    document.getElementById('db' + tabId.charAt(0).toUpperCase() + tabId.slice(1) + 'Tab').classList.add('active');
}

// ===================== DATA FUNCTIONS =====================
function logUserVisit() {
    if (!currentUser) return;
    
    const userData = {
        email: currentUser.email || (currentUser.isAnonymous ? 'Anonymous' : 'Unknown'),
        displayName: currentUser.displayName || 'N/A',
        lastVisit: new Date().toISOString(),
        isAdmin: isAdmin,
        userId: currentUser.uid
    };
    
    db.collection("visitors").doc(currentUser.uid).set(userData, { merge: true });
    
    // Update global visitor count
    db.collection("stats").doc("visitors").set({
        count: firebase.firestore.FieldValue.increment(1),
        lastUpdated: new Date().toISOString()
    }, { merge: true });
}

function updateStats() {
    // Real-time listener for visitor count
    db.collection("stats").doc("visitors").onSnapshot(doc => {
        const data = doc.data();
        if (data) {
            document.getElementById('visitorCount').textContent = data.count.toLocaleString();
            document.getElementById('footerVisitorCount').textContent = data.count.toLocaleString();
            
            // Simulate live visitors
            const liveCount = Math.floor(data.count / 10) + Math.floor(Math.random() * 10) + 1;
            document.getElementById('liveVisitorCount').textContent = liveCount;
        }
    });
}

function updateProductCount(snapshot) {
    document.getElementById('productCount').textContent = snapshot.size;
    document.getElementById('footerProductCount').textContent = snapshot.size;
}

function updateTestimonialCount(snapshot) {
    document.getElementById('testiCount').textContent = snapshot.size;
}

function updateVisitorStats(snapshot) {
    // This function can be expanded to show detailed visitor analytics
}

// ===================== PRODUCT MANAGEMENT =====================
function loadProducts() {
    db.collection("products").orderBy("timestamp", "desc").onSnapshot(snapshot => {
        const productList = document.getElementById('productList');
        productList.innerHTML = '';
        
        snapshot.forEach(doc => {
            const product = doc.data();
            productList.innerHTML += `
                <div class="product-card">
                    <div class="product-image">
                        <i class="fas fa-gem"></i>
                    </div>
                    <div class="product-content">
                        <h3 class="product-title">${product.name}</h3>
                        <p class="product-price">$${product.price.toLocaleString()}</p>
                        <p class="product-desc">${product.description || 'Premium luxury product'}</p>
                        <div class="product-meta">
                            <small>Added: ${new Date(product.timestamp).toLocaleDateString()}</small>
                        </div>
                    </div>
                </div>
            `;
        });
        
        if (snapshot.empty) {
            productList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-box-open fa-3x"></i>
                    <p>No products yet. Add your first product!</p>
                </div>
            `;
        }
    });
}

function addProduct() {
    if (!isAdmin) {
        showNotification("Admin access required", 'error');
        return;
    }
    
    const name = document.getElementById('productName').value.trim();
    const price = parseFloat(document.getElementById('productPrice').value);
    const description = document.getElementById('productDesc').value.trim();
    
    if (!name || !price) {
        showNotification("Please fill in product name and price", 'error');
        return;
    }
    
    db.collection("products").add({
        name: name,
        price: price,
        description: description,
        timestamp: new Date().toISOString(),
        addedBy: currentUser.uid
    })
    .then(() => {
        showNotification(translations[currentLanguage].productAdded, 'success');
        
        // Clear form
        document.getElementById('productName').value = '';
        document.getElementById('productPrice').value = '';
        document.getElementById('productDesc').value = '';
    })
    .catch(error => {
        showNotification("Error adding product: " + error.message, 'error');
    });
}

function deleteAllProducts() {
    if (!isAdmin || !confirm(translations[currentLanguage].confirmDelete)) return;
    
    db.collection("products").get().then(snapshot => {
        const batch = db.batch();
        snapshot.forEach(doc => {
            batch.delete(doc.ref);
        });
        return batch.commit();
    })
    .then(() => {
        showNotification("All products deleted", 'info');
    })
    .catch(error => {
        showNotification("Error deleting products", 'error');
    });
}

// ===================== TESTIMONIAL MANAGEMENT =====================
function loadTestimonials() {
    db.collection("testimonials").orderBy("timestamp", "desc").limit(50).onSnapshot(snapshot => {
        const testimonialList = document.getElementById('testimoniList');
        testimonialList.innerHTML = '';
        
        snapshot.forEach(doc => {
            const testimonial = doc.data();
            const initials = testimonial.username.split(' ').map(n => n[0]).join('').toUpperCase();
            
            testimonialList.innerHTML += `
                <div class="testimonial-card">
                    <div class="testimonial-header">
                        <div class="testimonial-avatar">${initials}</div>
                        <div class="testimonial-author">
                            <h4>${testimonial.username}</h4>
                            <span class="testimonial-country">${testimonial.country || 'Unknown'}</span>
                        </div>
                    </div>
                    <p class="testimonial-text">${testimonial.text}</p>
                    <div class="testimonial-date">
                        ${new Date(testimonial.timestamp).toLocaleDateString()}
                        ${testimonial.fake ? ' • ⭐ Featured' : ''}
                    </div>
                </div>
            `;
        });
        
        // Update raw data in admin panel
        updateRawTestimonialData(snapshot);
    });
}

function updateRawTestimonialData(snapshot) {
    const rawData = [];
    snapshot.forEach(doc => {
        rawData.push(doc.data());
    });
    
    document.getElementById('rawTesti').textContent = JSON.stringify(rawData, null, 2);
}

function addTestimoni() {
    if (!currentUser || currentUser.isAnonymous) {
        showNotification(translations[currentLanguage].featureDisabled, 'error');
        return;
    }
    
    const text = document.getElementById('newTestimoni').value.trim();
    if (!text) {
        showNotification("Please write a testimonial", 'error');
        return;
    }
    
    const username = currentUser.displayName || 
                    currentUser.email?.split('@')[0] || 
                    'Anonymous User';
    
    db.collection("testimonials").add({
        text: text,
        username: username,
        country: "Indonesia",
        timestamp: new Date().toISOString(),
        userId: currentUser.uid,
        fake: false
    })
    .then(() => {
        showNotification(translations[currentLanguage].testimonialAdded, 'success');
        document.getElementById('newTestimoni').value = '';
    })
    .catch(error => {
        showNotification("Error adding testimonial", 'error');
    });
}

function generateFakeTestimonials() {
    if (!isAdmin) return;
    
    for (let i = 0; i < 10; i++) {
        const isIndonesian = Math.random() > 0.3;
        const name = isIndonesian ? 
            indonesianNames[Math.floor(Math.random() * indonesianNames.length)] :
            internationalNames[Math.floor(Math.random() * internationalNames.length)];
        
        const country = isIndonesian ? 'Indonesia' : 
                       countries[Math.floor(Math.random() * countries.length)];
        
        const texts = [
            "Produk yang luar biasa! Kualitas benar-benar premium.",
            "Pelayanan cepat dan profesional. Sangat recommended!",
            "Barang sesuai deskripsi, packing rapi, pengiriman cepat.",
            "Kualitas mewah dengan harga yang wajar. Will buy again!",
            "Pengalaman belanja terbaik! Customer service sangat membantu.",
            "Luxury items with authentic quality. Very satisfied!",
            "Fast shipping and excellent packaging. Highly recommended!",
            "Produk original, harga kompetitif, seller terpercaya.",
            "Koleksi luxury yang impressive. Sudah repeat order 3x!",
            "Worth every penny! The quality exceeds expectations."
        ];
        
        db.collection("testimonials").add({
            text: texts[Math.floor(Math.random() * texts.length)],
            username: name,
            country: country,
            timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
            fake: true
        });
    }
    
    showNotification("10 random testimonials generated", 'success');
}

function deleteAllTestimonials() {
    if (!isAdmin || !confirm(translations[currentLanguage].confirmDelete)) return;
    
    db.collection("testimonials").get().then(snapshot => {
        const batch = db.batch();
        snapshot.forEach(doc => {
            batch.delete(doc.ref);
        });
        return batch.commit();
    })
    .then(() => {
        showNotification("All testimonials deleted", 'info');
    });
}

// ===================== CUSTOMER SERVICE AI =====================
function sendQuestion() {
    const questionInput = document.getElementById('userQuestion');
    const question = questionInput.value.trim();
    
    if (!question) return;
    
    const chatBox = document.getElementById('chatBox');
    
    // Add user message
    chatBox.innerHTML += `
        <div class="message user-message">
            <div class="message-content">
                <strong>You:</strong> ${question}
            </div>
            <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
        </div>
    `;
    
    // Generate AI response
    const response = generateAIResponse(question);
    
    // Add AI response after a short delay (simulating thinking)
    setTimeout(() => {
        chatBox.innerHTML += `
            <div class="message ai-message">
                <div class="message-content">
                    <strong>AxeLux AI:</strong> ${response}
                </div>
                <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
            </div>
        `;
        
        // Scroll to bottom
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 800);
    
    // Clear input
    questionInput.value = '';
}

function generateAIResponse(question) {
    const q = question.toLowerCase();
    
    // Predefined responses based on keywords
    if (q.includes('harga') || q.includes('price') || q.includes('cost')) {
        return "Harga produk luxury kami bervariasi mulai dari $500 hingga $10,000 tergantung koleksi. Silakan cek halaman Products untuk detail.";
    } else if (q.includes('pengiriman') || q.includes('shipping') || q.includes('delivery')) {
        return "Kami kirim ke seluruh dunia via DHL Express. Waktu pengiriman: 3-5 hari domestik, 7-14 hari internasional. Gratis ongkir untuk order di atas $2,000.";
    } else if (q.includes('return') || q.includes('refund') || q.includes('kembali')) {
        return "Kebijakan return: 30 hari dengan kondisi barang baru. Hubungi customer service untuk authorization code sebelum mengembalikan.";
    } else if (q.includes('stok') || q.includes('stock') || q.includes('available')) {
        return "Stok produk luxury kami terbatas. Jika produk habis, pre-order membutuhkan waktu 2-3 minggu. Cek availability di halaman product.";
    } else if (q.includes('pembayaran') || q.includes('payment') || q.includes('credit card')) {
        return "Kami terima: Visa, MasterCard, Amex, PayPal, dan bank transfer. Pembayaran aman melalui sistem terenkripsi.";
    } else if (q.includes('garansi') || q.includes('warranty') || q.includes('guarantee')) {
        return "Semua produk luxury memiliki garansi 2 tahun. Sertifikat keaslian disertakan. Untuk klaim garansi, email ke support@axelux.com";
    } else if (q.includes('kontak') || q.includes('contact') || q.includes('customer service')) {
        return "Customer service 24/7: WhatsApp +1 (555) 123-4567, email support@axelux.com, atau live chat di website ini.";
    } else if (q.includes('material') || q.includes('bahan') || q.includes('kualitas')) {
        return "Produk kami menggunakan material premium: leather Italia, stainless steel surgical grade, diamond/jewel certified, dan craftsmanship artisan.";
    } else if (q.includes('diskon') || q.includes('discount') || q.includes('promo')) {
        return "Diskon khusus untuk member: 10% first purchase (kode: WELCOME10) dan seasonal sale. Ikuti Instagram @axelux_luxury untuk promo terbaru.";
    } else {
        return "Terima kasih atas pertanyaan Anda! Tim customer service kami akan membalas detail dalam 1-2 jam kerja. Untuk pertanyaan mendesak, hubungi +1 (555) 123-4567.";
    }
}

function insertFAQ(question) {
    document.getElementById('userQuestion').value = question;
    document.getElementById('userQuestion').focus();
}

// ===================== DATABASE ADMIN =====================
function loadUserList() {
    if (!isAdmin) return;
    
    db.collection("visitors").orderBy("lastVisit", "desc").limit(50).onSnapshot(snapshot => {
        const userList = document.getElementById('userList');
        userList.innerHTML = '';
        
        snapshot.forEach(doc => {
            const user = doc.data();
            userList.innerHTML += `
                <tr>
                    <td>${user.email}</td>
                    <td>${new Date(user.lastVisit).toLocaleString()}</td>
                    <td>${user.isAdmin ? 'Admin' : user.email === 'Anonymous' ? 'Guest' : 'User'}</td>
                </tr>
            `;
        });
        
        if (snapshot.empty) {
            userList.innerHTML = `
                <tr>
                    <td colspan="3" class="text-center">No users yet</td>
                </tr>
            `;
        }
    });
}

function exportData() {
    if (!isAdmin) return;
    
    Promise.all([
        db.collection("products").get(),
        db.collection("testimonials").get(),
        db.collection("visitors").get()
    ]).then(([products, testimonials, visitors]) => {
        const data = {
            exportedAt: new Date().toISOString(),
            products: products.docs.map(doc => ({id: doc.id, ...doc.data()})),
            testimonials: testimonials.docs.map(doc => ({id: doc.id, ...doc.data()})),
            visitors: visitors.docs.map(doc => ({id: doc.id, ...doc.data()}))
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `axelux-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification(translations[currentLanguage].dataExported, 'success');
    });
}

function resetVisitorCount() {
    if (!isAdmin || !confirm("Reset visitor counter to zero?")) return;
    
    db.collection("stats").doc("visitors").set({
        count: 0,
        lastUpdated: new Date().toISOString()
    });
    
    showNotification("Visitor counter reset", 'info');
}

// ===================== USER SETTINGS =====================
function updateProfile() {
    const displayName = document.getElementById('userName').value.trim();
    
    if (currentUser && displayName && !currentUser.isAnonymous) {
        currentUser.updateProfile({
            displayName: displayName
        }).then(() => {
            showNotification("Profile updated", 'success');
        });
    }
    
    // Save theme and language preferences
    localStorage.setItem('axelux_theme', currentTheme);
    localStorage.setItem('axelux_language', currentLanguage);
    
    showNotification("Preferences saved", 'success');
}

function deleteAccount() {
    if (!confirm("Delete your account permanently? This cannot be undone!")) return;
    
    if (currentUser && !currentUser.isAnonymous) {
        currentUser.delete().then(() => {
            showNotification("Account deleted", 'info');
        }).catch(error => {
            showNotification("Error deleting account: " + error.message, 'error');
        });
    }
}

// ===================== UTILITY FUNCTIONS =====================
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#4CAF50' : 
                     type === 'error' ? '#F44336' : 
                     type === 'info' ? '#2196F3' : '#FF9800'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .notification button {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        margin-left: 15px;
    }
    
    .empty-state {
        grid-column: 1 / -1;
        text-align: center;
        padding: 60px 20px;
        color: var(--text-secondary);
    }
    
    .empty-state i {
        margin-bottom: 20px;
        opacity: 0.5;
    }
`;
document.head.appendChild(style);

// ===================== FIREBASE SECURITY RULES (For reference) =====================
/*
// Firebase Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products - read for all, write for admin only
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && 
                   request.auth.token.email == "axm@axelux.com";
    }
    
    // Testimonials - read for all, create for authenticated users, delete for admin
    match /testimonials/{testimonialId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                           request.auth.token.email == "axm@axelux.com";
    }
    
    // Visitors tracking - write for all, read for admin only
    match /visitors/{userId} {
      allow read: if request.auth != null && 
                  request.auth.token.email == "axm@axelux.com";
      allow write: if request.auth != null;
    }
    
    // Stats - read for all, write for authenticated
    match /stats/{documentId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
*/

console.log("AxeLux Web Application initialized successfully!");
