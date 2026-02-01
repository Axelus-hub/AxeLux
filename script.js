// FIREBASE CONFIGURATION
const firebaseConfig = {
    apiKey: "AIzaSyC-EXAMPLE-KEY-CHANGE-THIS",
    authDomain: "axelux-store.firebaseapp.com",
    projectId: "axelux-store",
    storageBucket: "axelux-store.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abc123def456"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const rtdb = firebase.database();

// STATE MANAGEMENT
let currentUser = null;
let isAdmin = false;
let visitorId = null;

// MASTER ADMIN CREDENTIALS (ENCRYPTED)
const MASTER_ADMIN = {
    username: "Axm",
    password: "brandalz70",
    encrypted: btoa("Axm:brandalz70:axelux:" + Date.now())
};

// INITIALIZE APP
document.addEventListener('DOMContentLoaded', function() {
    initApp();
    setupEventListeners();
    trackVisitor();
});

// INITIALIZE APPLICATION
function initApp() {
    // Check authentication state
    auth.onAuthStateChanged((user) => {
        if (user) {
            currentUser = user;
            checkIfAdmin(user);
            showMainPage();
        } else {
            showLoginPage();
        }
    });
    
    // Check URL for admin access
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true') {
        document.getElementById('adminAccess').style.display = 'block';
    }
}

// SETUP EVENT LISTENERS
function setupEventListeners() {
    // Login form
    document.getElementById('loginForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const adminMode = document.getElementById('adminMode').checked;
        
        if (adminMode && email === MASTER_ADMIN.username && password === MASTER_ADMIN.password) {
            masterAdminLogin();
        } else {
            firebaseLogin(email, password);
        }
    });
}

// MASTER ADMIN LOGIN
function masterAdminLogin() {
    localStorage.setItem('axelux_admin_token', MASTER_ADMIN.encrypted);
    localStorage.setItem('axelux_role', 'owner');
    localStorage.setItem('axelux_username', MASTER_ADMIN.username);
    
    // Create fake user object
    currentUser = {
        displayName: "Axm (OWNER)",
        email: "owner@axelux.store",
        uid: "admin-owner-001"
    };
    
    isAdmin = true;
    showMainPage();
    logAction("MASTER ADMIN LOGIN", "Full access granted");
    
    // Initialize admin features
    setTimeout(() => {
        document.querySelectorAll('.admin-only').forEach(el => {
            el.style.display = 'flex';
        });
        updateStats();
        loadAllData();
    }, 500);
}

// FIREBASE LOGIN
function firebaseLogin(email, password) {
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            logAction("USER_LOGIN", email);
        })
        .catch((error) => {
            showError("Login failed: " + error.message);
        });
}

// GOOGLE LOGIN
function loginGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            logAction("GOOGLE_LOGIN", result.user.email);
        })
        .catch((error) => {
            showError("Google login failed");
        });
}

// FACEBOOK LOGIN
function loginFacebook() {
    showError("Facebook login temporarily disabled");
}

// GUEST LOGIN
function enterAsGuest() {
    currentUser = {
        displayName: "Guest User",
        role: "guest"
    };
    localStorage.setItem('axelux_role', 'guest');
    showMainPage();
    logAction("GUEST_ACCESS", "Guest entered");
}

// CHECK IF USER IS ADMIN
function checkIfAdmin(user) {
    // Check Firebase custom claims
    user.getIdTokenResult()
        .then((idTokenResult) => {
            isAdmin = idTokenResult.claims.admin === true || 
                     idTokenResult.claims.owner === true;
            
            // Also check local storage for master admin
            if (localStorage.getItem('axelux_role') === 'owner') {
                isAdmin = true;
            }
            
            if (isAdmin) {
                document.querySelectorAll('.admin-only').forEach(el => {
                    el.style.display = 'flex';
                });
            }
        })
        .catch(() => {
            isAdmin = false;
        });
}

// VISITOR TRACKING
function trackVisitor() {
    visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    const visitorData = {
        id: visitorId,
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        screen: `${window.screen.width}x${window.screen.height}`,
        time: new Date().toISOString(),
        url: window.location.href,
        ip: 'detecting...'
    };
    
    // Save to Firebase Realtime Database
    rtdb.ref('visitors/' + visitorId).set(visitorData);
    
    // Update local storage
    let visitors = JSON.parse(localStorage.getItem('axelux_visitors') || '[]');
    visitors.push(visitorData);
    localStorage.setItem('axelux_visitors', JSON.stringify(visitors));
    
    // Update display
    updateVisitorStats();
}

// UPDATE VISITOR STATISTICS
function updateVisitorStats() {
    const visitors = JSON.parse(localStorage.getItem('axelux_visitors') || '[]');
    document.getElementById('totalVisitors').textContent = visitors.length;
    
    // Update live visitor list
    const visitorList = document.getElementById('visitorList');
    if (visitorList) {
        visitorList.innerHTML = visitors.slice(-10).reverse().map(v => `
            <div class="visitor-item">
                <i class="fas fa-user-circle"></i>
                <span>${v.time.split('T')[1].substring(0,8)}</span>
                <span>${v.platform}</span>
            </div>
        `).join('');
    }
}

// UPDATE ALL STATS
function updateStats() {
    updateVisitorStats();
    
    // Get products count
    const products = JSON.parse(localStorage.getItem('axelux_products') || '[]');
    document.getElementById('totalProducts').textContent = products.length;
    
    // Get testimonials count
    const testimonials = JSON.parse(localStorage.getItem('axelux_testimonials') || '[]');
    document.getElementById('totalTestimonials').textContent = testimonials.length;
}

// ADD FAKE TESTIMONIALS
function addFakeTestimonials(count) {
    if (!isAdmin) {
        showError("Admin access required");
        return;
    }
    
    const fakeNames = ["Alex Johnson", "Maria Garcia", "James Smith", "Lisa Wang", "Robert Brown"];
    const fakeTitles = ["Amazing Product!", "Life Changing", "Best Purchase Ever", "Highly Recommended", "5 Stars!"];
    const fakeTexts = [
        "This product exceeded all my expectations. Absolutely fantastic!",
        "I've been using this for a week and already see incredible results.",
        "The quality is outstanding. Worth every penny!",
        "Customer service was excellent and the product is even better.",
        "I would recommend this to everyone. Simply the best!"
    ];
    
    let testimonials = JSON.parse(localStorage.getItem('axelux_testimonials') || '[]');
    
    for (let i = 0; i < count; i++) {
        const testimonial = {
            id: 'fake_' + Date.now() + '_' + i,
            author: fakeNames[Math.floor(Math.random() * fakeNames.length)],
            title: fakeTitles[Math.floor(Math.random() * fakeTitles.length)],
            text: fakeTexts[Math.floor(Math.random() * fakeTexts.length)],
            rating: 5,
            date: new Date().toISOString(),
            fake: true
        };
        
        testimonials.push(testimonial);
        
        // Also save to Firebase if admin
        if (currentUser?.uid?.includes('admin')) {
            db.collection('testimonials').add(testimonial);
        }
    }
    
    localStorage.setItem('axelux_testimonials', JSON.stringify(testimonials));
    updateStats();
    loadTestimonials();
    
    showSuccess(`Added ${count} fake testimonials`);
    logAction("ADD_FAKE_TESTIMONIALS", `Count: ${count}`);
}

// DELETE ALL VISITORS
function deleteAllVisitors() {
    if (!isAdmin) {
        showError("Admin access required");
        return;
    }
    
    if (confirm("⚠️ WARNING: This will delete ALL visitor data. Continue?")) {
        localStorage.removeItem('axelux_visitors');
        
        // Also delete from Firebase
        rtdb.ref('visitors').remove();
        
        updateStats();
        showSuccess("All visitor data deleted");
        logAction("DELETE_ALL_VISITORS", "Complete wipe");
    }
}

// AI CUSTOMER SERVICE
function askAI() {
    const query = document.getElementById('customerQuery').value;
    if (!query.trim()) return;
    
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.innerHTML += `<div class="message user">You: ${query}</div>`;
    }
    
    // AI Responses based on keywords
    const responses = {
        shipping: "We offer worldwide shipping within 5-7 business days. Express shipping available.",
        price: "Our prices are competitive. Contact us for bulk discounts.",
        quality: "All products are premium quality with 2-year warranty.",
        refund: "30-day money back guarantee. No questions asked.",
        contact: "Email us at support@axelux.store or call +1-800-AXELUX",
        default: "Thank you for your inquiry. Our team will respond within 24 hours. For immediate assistance, check our FAQ section."
    };
    
    let response = responses.default;
    query.toLowerCase().split(' ').forEach(word => {
        if (responses[word]) {
            response = responses[word];
        }
    });
    
    // Add AI response
    setTimeout(() => {
        if (chatMessages) {
            chatMessages.innerHTML += `<div class="message ai">🤖 AI: ${response}</div>`;
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        document.getElementById('aiResponse').innerHTML = 
            `<i class="fas fa-robot"></i> AI Response: ${response}`;
    }, 1000);
    
    document.getElementById('customerQuery').value = '';
}

// LOAD ALL DATA
function loadAllData() {
    if (!isAdmin) return;
    
    loadProducts();
    loadTestimonials();
    loadUsers();
}

// LOAD PRODUCTS
function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    const products = JSON.parse(localStorage.getItem('axelux_products') || '[]');
    
    if (products.length === 0) {
        // Add sample products
        const sampleProducts = [
            { id: 1, name: "Premium Watch", price: "$299", desc: "Luxury timepiece", stock: 10 },
            { id: 2, name: "Wireless Earbuds", price: "$199", desc: "Noise cancelling", stock: 25 },
            { id: 3, name: "Smartphone X", price: "$999", desc: "Latest model", stock: 5 }
        ];
        
        localStorage.setItem('axelux_products', JSON.stringify(sampleProducts));
        productsGrid.innerHTML = sampleProducts.map(p => createProductCard(p)).join('');
    } else {
        productsGrid.innerHTML = products.map(p => createProductCard(p)).join('');
    }
}

function createProductCard(product) {
    return `
        <div class="product-card">
            <h3>${product.name}</h3>
            <p class="price">${product.price}</p>
            <p>${product.desc}</p>
            <p>Stock: ${product.stock}</p>
            ${isAdmin ? `<button onclick="editProduct(${product.id})" class="btn small">Edit</button>` : ''}
        </div>
    `;
}

// LOAD TESTIMONIALS
function loadTestimonials() {
    const testimonialsList = document.getElementById('testimonialsList');
    if (!testimonialsList) return;
    
    const testimonials = JSON.parse(localStorage.getItem('axelux_testimonials') || '[]');
    
    testimonialsList.innerHTML = testimonials.map(t => `
        <div class="testimonial-item ${t.fake ? 'fake' : ''}">
            <div class="testimonial-header">
                <strong>${t.author}</strong>
                <span>${new Date(t.date).toLocaleDateString()}</span>
                ${t.fake ? '<span class="badge">FAKE</span>' : ''}
            </div>
            <h4>${t.title}</h4>
            <p>${t.text}</p>
            <div class="rating">${'★'.repeat(t.rating)}${'☆'.repeat(5-t.rating)}</div>
        </div>
    `).join('');
}

// ADD TESTIMONIAL
function addTestimonial() {
    const text = document.getElementById('newTestimonial').value;
    if (!text.trim()) {
        showError("Please enter testimonial text");
        return;
    }
    
    const testimonial = {
        id: 'user_' + Date.now(),
        author: currentUser?.displayName || "Anonymous",
        title: "Great Experience!",
        text: text,
        rating: 5,
        date: new Date().toISOString(),
        fake: false
    };
    
    let testimonials = JSON.parse(localStorage.getItem('axelux_testimonials') || '[]');
    testimonials.push(testimonial);
    localStorage.setItem('axelux_testimonials', JSON.stringify(testimonials));
    
    // Save to Firebase
    if (currentUser?.uid) {
        db.collection('testimonials').add(testimonial);
    }
    
    document.getElementById('newTestimonial').value = '';
    loadTestimonials();
    updateStats();
    showSuccess("Testimonial added!");
}

// DATABASE FUNCTIONS
function viewAllData() {
    if (!isAdmin) {
        showError("Admin access required");
        return;
    }
    
    const allData = {
        visitors: JSON.parse(localStorage.getItem('axelux_visitors') || '[]'),
        products: JSON.parse(localStorage.getItem('axelux_products') || '[]'),
        testimonials: JSON.parse(localStorage.getItem('axelux_testimonials') || '[]'),
        users: JSON.parse(localStorage.getItem('axelux_users') || '[]'),
        logs: JSON.parse(localStorage.getItem('axelux_logs') || '[]')
    };
    
    document.getElementById('databaseOutput').textContent = 
        JSON.stringify(allData, null, 2);
}

function nukeDatabase() {
    if (!isAdmin) {
        showError("Admin access required");
        return;
    }
    
    if (confirm("☢️ NUCLEAR OPTION: Delete ALL data? This cannot be undone!")) {
        localStorage.clear();
        
        // Try to clear Firebase (requires admin permissions)
        rtdb.ref().remove().catch(e => console.log("Firebase clear failed"));
        
        showSuccess("All data nuked. System reset.");
        setTimeout(() => location.reload(), 2000);
    }
}

// PAGE NAVIGATION
function showLoginPage() {
    document.getElementById('loginPage').classList.add('active');
    document.getElementById('mainPage').classList.remove('active');
}

function showMainPage() {
    document.getElementById('loginPage').classList.remove('active');
    document.getElementById('mainPage').classList.add('active');
    
    // Update user display
    document.getElementById('currentUser').textContent = 
        currentUser?.displayName || "Guest User";
    
    document.getElementById('userRoleBadge').textContent = 
        isAdmin ? "OWNER" : (currentUser?.role || "GUEST");
    
    document.getElementById('welcomeUser').textContent = 
        currentUser?.displayName || "Guest";
    
    // Update stats
    updateStats();
    
    // Load data if admin
    if (isAdmin) {
        loadAllData();
    }
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Add active class to clicked nav link
    event.target.classList.add('active');
}

// LOGOUT
function logout() {
    auth.signOut();
    localStorage.removeItem('axelux_admin_token');
    localStorage.removeItem('axelux_role');
    currentUser = null;
    isAdmin = false;
    showLoginPage();
    logAction("USER_LOGOUT", "Session ended");
}

// LOGGING SYSTEM
function logAction(action, details) {
    const logEntry = {
        action: action,
        details: details,
        user: currentUser?.displayName || "system",
        timestamp: new Date().toISOString(),
        ip: visitorId
    };
    
    // Save to localStorage
    let logs = JSON.parse(localStorage.getItem('axelux_logs') || '[]');
    logs.push(logEntry);
    localStorage.setItem('axelux_logs', JSON.stringify(logs.slice(-100))); // Keep last 100
    
    // Save to Firebase if admin
    if (isAdmin) {
        db.collection('logs').add(logEntry);
    }
}

// UTILITY FUNCTIONS
function showError(message) {
    alert("❌ " + message);
}

function showSuccess(message) {
    alert("✅ " + message);
}

// DIRECT ADMIN ACCESS
function directAdminLogin() {
    masterAdminLogin();
}

// INITIALIZE SECURITY
function initSecurity() {
    // Prevent right-click
    document.addEventListener('contextmenu', e => e.preventDefault());
    
    // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J
    document.addEventListener('keydown', e => {
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && e.key === 'I') ||
            (e.ctrlKey && e.shiftKey && e.key === 'J') ||
            (e.ctrlKey && e.key === 'U')) {
            e.preventDefault();
            alert("Developer tools disabled for security.");
        }
    });
}

// Initialize security
initSecurity();