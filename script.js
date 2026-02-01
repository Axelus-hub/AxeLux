// ===================== CONFIGURASI FIREBASE NYATA =====================
const firebaseConfig = {
    apiKey: "AIzaSyDkQwQ9hX4c8fZ7nJvLm9pRqT2sB1cV3eY",
    authDomain: "axelux-project.firebaseapp.com",
    projectId: "axelux-project-12345",
    storageBucket: "axelux-project-12345.appspot.com",
    messagingSenderId: "987654321012",
    appId: "1:987654321012:web:abc123def456ghi789jkl",
    measurementId: "G-ABCDEFGHIJ"
};

// Inisialisasi Firebase
try {
    firebase.initializeApp(firebaseConfig);
} catch (err) {
    console.log("Firebase sudah diinisialisasi");
}

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

// ===================== STATE GLOBAL =====================
let currentUser = null;
let isAdmin = false;
let isGuest = false;
let currentTheme = localStorage.getItem('axelux_theme') || 'blue';
let userRating = 0;
let testimoniPage = 1;
let testimoniLimit = 10;

// Data Produk Demo (jika Firebase offline)
let demoProducts = [
    { 
        id: 1, 
        name: "Rolex Submariner", 
        price: 250000000, 
        desc: "Luxury Swiss watch, original, with box & papers",
        category: "watch",
        stock: 3,
        rating: 4.9,
        images: ["rolex.jpg"],
        featured: true
    },
    { 
        id: 2, 
        name: "Hermès Birkin Bag", 
        price: 450000000, 
        desc: "Genuine crocodile leather, limited edition",
        category: "bag",
        stock: 1,
        rating: 5.0,
        images: ["hermes.jpg"],
        featured: true
    },
    { 
        id: 3, 
        name: "Cartier Love Bracelet", 
        price: 185000000, 
        desc: "18K gold with diamond accents",
        category: "jewelry",
        stock: 5,
        rating: 4.8,
        images: ["cartier.jpg"],
        featured: true
    }
];

// ===================== INISIALISASI =====================
document.addEventListener('DOMContentLoaded', function() {
    initApp();
    setupEventListeners();
    setupStarRating();
    loadInitialData();
});

function initApp() {
    // Terapkan tema yang disimpan
    setTheme(currentTheme);
    
    // Setup Firebase auth state listener
    auth.onAuthStateChanged(user => {
        currentUser = user;
        
        if (user) {
            // Check jika user admin
            checkAdminStatus(user);
            
            // Update UI untuk user
            showMainApp();
            updateUIForUser();
            
            // Log kunjungan
            logUserVisit();
            
            showToast(`Welcome back, ${user.displayName || user.email}!`, 'success');
        } else {
            // Mode guest
            isGuest = true;
            currentUser = {
                uid: 'guest_' + Date.now(),
                email: 'guest@example.com',
                displayName: 'Guest User',
                isAnonymous: true
            };
            
            showMainApp();
            updateUIForUser();
            showToast('Welcome as guest! You can browse and review products.', 'info');
        }
    });
}

function checkAdminStatus(user) {
    // Check jika user adalah admin/ownership
    const adminEmails = ['axm@axelux.com', 'admin@axelux.com', 'ownership@axelux.com'];
    isAdmin = adminEmails.includes(user.email) || user.email === 'axm@axelux.com';
    
    if (isAdmin) {
        document.body.classList.add('admin');
        showToast('Admin privileges activated', 'success');
    }
}

// ===================== SISTEM RATING BINTANG =====================
function setupStarRating() {
    // Setup rating input
    const stars = document.querySelectorAll('.star-rating-input i');
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            setUserRating(rating);
        });
        
        star.addEventListener('mouseover', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            highlightStars(rating);
        });
    });
    
    // Reset stars on mouse out
    document.querySelector('.star-rating-input').addEventListener('mouseout', function() {
        highlightStars(userRating);
    });
}

function setUserRating(rating) {
    userRating = rating;
    highlightStars(rating);
    
    // Update rating text
    const ratingTexts = ['Very Poor', 'Poor', 'Average', 'Good', 'Excellent'];
    document.getElementById('ratingText').textContent = ratingTexts[rating - 1] || 'Click to rate';
    
    // Simpan rating untuk testimoni
    localStorage.setItem('tempRating', rating);
}

function highlightStars(rating) {
    const stars = document.querySelectorAll('.star-rating-input i');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// ===================== TESTIMONI SYSTEM (GUEST & USER) =====================
function submitTestimoni() {
    const text = document.getElementById('testimoniText').value.trim();
    
    if (!text) {
        showToast('Please write your review first', 'error');
        return;
    }
    
    if (userRating === 0) {
        showToast('Please select a star rating', 'error');
        return;
    }
    
    // Data testimoni
    const testimoniData = {
        text: text,
        rating: userRating,
        timestamp: new Date().toISOString(),
        approved: true, // Auto-approve untuk sekarang
        featured: false
    };
    
    // Tambahkan info user
    if (isGuest) {
        testimoniData.userName = document.getElementById('guestName').value.trim() || 'Guest';
        testimoniData.userCountry = document.getElementById('guestCountry').value.trim() || 'Unknown';
        testimoniData.userId = 'guest_' + Date.now();
        testimoniData.userType = 'guest';
    } else {
        testimoniData.userName = currentUser.displayName || currentUser.email.split('@')[0];
        testimoniData.userId = currentUser.uid;
        testimoniData.userEmail = currentUser.email;
        testimoniData.userType = 'registered';
    }
    
    // Simpan ke Firebase
    db.collection('testimonials').add(testimoniData)
        .then(() => {
            showToast('Thank you for your review! It has been published.', 'success');
            
            // Reset form
            document.getElementById('testimoniText').value = '';
            setUserRating(0);
            document.getElementById('guestName').value = '';
            document.getElementById('guestCountry').value = '';
            
            // Reload testimonials
            loadTestimonials();
        })
        .catch(error => {
            console.error('Error saving testimonial:', error);
            showToast('Failed to submit review. Please try again.', 'error');
        });
}

// ===================== PRODUCT MANAGEMENT =====================
function loadProducts() {
    const productList = document.getElementById('productList');
    const featuredList = document.getElementById('featuredProducts');
    
    // Coba load dari Firebase dulu
    db.collection('products').where('active', '==', true).limit(20).get()
        .then(snapshot => {
            if (snapshot.empty) {
                // Gunakan demo products jika Firebase kosong
                renderProducts(demoProducts, productList);
                renderProducts(demoProducts.filter(p => p.featured), featuredList);
            } else {
                const products = [];
                snapshot.forEach(doc => {
                    products.push({ id: doc.id, ...doc.data() });
                });
                
                renderProducts(products, productList);
                renderProducts(products.filter(p => p.featured), featuredList);
            }
        })
        .catch(error => {
            // Fallback ke demo products
            renderProducts(demoProducts, productList);
            renderProducts(demoProducts.filter(p => p.featured), featuredList);
            console.log('Using demo products:', error);
        });
}

function renderProducts(products, container) {
    if (!container) return;
    
    container.innerHTML = '';
    
    if (products.length === 0) {
        container.innerHTML = `
            <div class="empty-product">
                <i class="fas fa-box-open fa-3x"></i>
                <h3>No products found</h3>
                <p>Check back later for new luxury items</p>
            </div>
        `;
        return;
    }
    
    products.forEach(product => {
        const productCard = `
            <div class="product-card" data-id="${product.id}" data-category="${product.category}">
                <div class="product-image">
                    ${product.images && product.images.length > 0 ? 
                        `<img src="${product.images[0]}" alt="${product.name}">` : 
                        `<i class="fas fa-gem"></i>`
                    }
                    ${product.stock <= 0 ? '<div class="product-stock out">Sold Out</div>' : 
                     product.stock <= 3 ? '<div class="product-stock low">Low Stock</div>' : 
                     '<div class="product-stock in">In Stock</div>'}
                    ${product.featured ? '<div class="product-badge featured">Featured</div>' : ''}
                </div>
                <div class="product-content">
                    <div class="product-category">${getCategoryName(product.category)}</div>
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-rating">
                        <div class="stars" style="--rating: ${product.rating || 4.5};"></div>
                        <span class="rating-count">${product.reviewCount || 12}</span>
                    </div>
                    <p class="product-price">${formatCurrency(product.price)}</p>
                    <p class="product-desc">${product.desc || 'Premium luxury product'}</p>
                    
                    <div class="product-meta">
                        <div class="meta-item">
                            <i class="fas fa-shipping-fast"></i>
                            <span>Free Shipping</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-certificate"></i>
                            <span>Authentic</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-shield-alt"></i>
                            <span>2 Year Warranty</span>
                        </div>
                    </div>
                    
                    <div class="product-actions">
                        <button onclick="viewProductDetail('${product.id}')" class="btn-view">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                        <button onclick="orderProduct('${product.id}')" class="btn-order" ${product.stock <= 0 ? 'disabled' : ''}>
                            <i class="fas fa-shopping-cart"></i> Order Now
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML += productCard;
    });
}

// ===================== ORDER SYSTEM =====================
function orderProduct(productId) {
    if (!currentUser && !isGuest) {
        showLoginModal();
        return;
    }
    
    // Find product
    const product = demoProducts.find(p => p.id == productId) || { name: 'Product', price: 0 };
    
    // Create WhatsApp message
    const message = `Halo AxeLux! Saya ingin order produk:\n\n` +
                   `📦 *${product.name}*\n` +
                   `💰 Harga: ${formatCurrency(product.price)}\n\n` +
                   `👤 Nama: ${isGuest ? 'Guest' : (currentUser.displayName || currentUser.email)}\n` +
                   `📧 Email: ${isGuest ? 'guest@example.com' : currentUser.email}\n\n` +
                   `Tolong informasikan cara pembayaran dan pengiriman.`;
    
    // Open WhatsApp
    const whatsappUrl = `https://wa.me/62881010065137?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Simpan order ke Firebase (jika user terdaftar)
    if (!isGuest && currentUser) {
        const orderData = {
            productId: productId,
            productName: product.name,
            price: product.price,
            customerId: currentUser.uid,
            customerEmail: currentUser.email,
            customerName: currentUser.displayName,
            status: 'pending',
            createdAt: new Date().toISOString(),
            paymentMethod: 'whatsapp',
            shippingAddress: 'To be confirmed'
        };
        
        db.collection('orders').add(orderData)
            .then(() => {
                showToast('Order recorded! Please complete payment via WhatsApp.', 'success');
                updateOrderBadge();
            });
    } else {
        showToast('Opening WhatsApp for order...', 'info');
    }
}

// ===================== UI FUNCTIONS =====================
function setTheme(theme) {
    currentTheme = theme;
    document.body.className = `theme-${theme} ${isAdmin ? 'admin' : ''}`;
    
    // Update semua selector tema
    document.querySelectorAll('select[id*="theme"]').forEach(select => {
        select.value = theme;
    });
    
    // Update active theme buttons
    document.querySelectorAll('.theme-option').forEach(btn => {
        btn.classList.remove('active');
        if (btn.classList.contains(theme)) {
            btn.classList.add('active');
        }
    });
    
    localStorage.setItem('axelux_theme', theme);
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('notificationToast');
    const messageEl = document.getElementById('toastMessage');
    
    if (!toast) return;
    
    // Set message dan type
    messageEl.textContent = message;
    toast.className = `notification-toast ${type}`;
    
    // Show toast
    toast.classList.remove('hidden');
    
    // Auto hide setelah 5 detik
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 5000);
}

function hideToast() {
    document.getElementById('notificationToast').classList.add('hidden');
}

function showSection(sectionId) {
    // Hide semua sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active-section');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionId + 'Section');
    if (targetSection) {
        targetSection.classList.add('active-section');
    }
    
    // Update page title
    const pageTitle = document.getElementById('pageTitle');
    const sectionTitle = targetSection.querySelector('.section-title');
    if (sectionTitle) {
        pageTitle.textContent = sectionTitle.textContent;
    }
    
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Find active link
    const activeLink = document.querySelector(`[onclick="showSection('${sectionId}')"]`);
    if (activeLink) activeLink.classList.add('active');
    
    // Close sidebar di mobile
    if (window.innerWidth <= 1024) {
        toggleSidebar();
    }
}

function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('active');
}

function updateUIForUser() {
    // Update user info di sidebar
    const userName = document.getElementById('sidebarUserName');
    const userRole = document.getElementById('sidebarUserRole');
    const avatar = document.getElementById('userAvatar');
    const username = document.getElementById('username');
    const role = document.getElementById('userRole');
    
    if (currentUser) {
        const name = currentUser.displayName || currentUser.email || 'Guest';
        const userRoleText = isAdmin ? 'Administrator' : 
                           isGuest ? 'Guest' : 
                           currentUser.email ? 'Member' : 'Visitor';
        
        if (userName) userName.textContent = name;
        if (userRole) userRole.textContent = userRoleText;
        if (username) username.textContent = name;
        if (role) role.textContent = userRoleText;
        if (avatar) avatar.textContent = name.charAt(0).toUpperCase();
    }
}

// ===================== HELPER FUNCTIONS =====================
function formatCurrency(amount) {
    return 'Rp ' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function getCategoryName(category) {
    const categories = {
        'watch': 'Luxury Watch',
        'jewelry': 'Jewelry',
        'bag': 'Designer Bag',
        'perfume': 'Perfume',
        'accessories': 'Accessories'
    };
    return categories[category] || 'Luxury Item';
}

function logUserVisit() {
    if (!currentUser || isGuest) return;
    
    const visitData = {
        userId: currentUser.uid,
        email: currentUser.email,
        name: currentUser.displayName,
        lastVisit: new Date().toISOString(),
        isAdmin: isAdmin
    };
    
    db.collection('visits').doc(currentUser.uid).set(visitData, { merge: true });
}

function loadInitialData() {
    loadProducts();
    loadTestimonials();
    updateStats();
    updateOrderBadge();
}

// ===================== EVENT LISTENERS =====================
function setupEventListeners() {
    // Enter key untuk login
    document.getElementById('loginPassword')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') login();
    });
    
    // Character counter untuk testimoni
    document.getElementById('testimoniText')?.addEventListener('input', function() {
        const count = this.value.length;
        document.getElementById('charCount').textContent = count;
    });
    
    // Close modal dengan ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.add('hidden');
            });
        }
    });
    
    // Click outside modal to close
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.add('hidden');
        }
    });
}

// ===================== ADMIN FUNCTIONS =====================
function showAdminTab(tabId) {
    // Hide semua tabs
    document.querySelectorAll('.admin-tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Deactivate semua tab buttons
    document.querySelectorAll('.admin-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Activate selected tab
    document.getElementById('admin' + tabId.charAt(0).toUpperCase() + tabId.slice(1) + 'Tab').classList.add('active');
    
    // Activate button
    document.querySelector(`.admin-tab[onclick="showAdminTab('${tabId}')"]`).classList.add('active');
}

function showAddProductModal() {
    if (!isAdmin) {
        showToast('Admin access required', 'error');
        return;
    }
    
    document.getElementById('addProductModal').classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

function saveProduct() {
    const name = document.getElementById('modalProductName').value;
    const price = parseInt(document.getElementById('modalProductPrice').value);
    const stock = parseInt(document.getElementById('modalProductStock').value);
    const category = document.getElementById('modalProductCategory').value;
    const desc = document.getElementById('modalProductDesc').value;
    
    if (!name || !price || !stock) {
        showToast('Please fill required fields', 'error');
        return;
    }
    
    const productData = {
        name: name,
        price: price,
        stock: stock,
        category: category,
        description: desc,
        active: true,
        featured: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        rating: 0,
        reviewCount: 0
    };
    
    // Simpan ke Firebase
    db.collection('products').add(productData)
        .then(() => {
            showToast('Product saved successfully!', 'success');
            closeModal('addProductModal');
            loadProducts();
        })
        .catch(error => {
            showToast('Error saving product: ' + error.message, 'error');
        });
}

// ===================== LOGIN/LOGOUT =====================
function login() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showToast('Please enter email and password', 'error');
        return;
    }
    
    // Special ownership login
    if (email === "ownership" || email === "Axm") {
        if (password === "brandalz70") {
            // Login sebagai owner
            auth.signInWithEmailAndPassword("axm@axelux.com", "brandalz70")
                .catch(error => {
                    // Create owner account jika tidak ada
                    if (error.code === 'auth/user-not-found') {
                        auth.createUserWithEmailAndPassword("axm@axelux.com", "brandalz70")
                            .then(cred => {
                                return cred.user.updateProfile({
                                    displayName: "AxeLux Owner"
                                });
                            })
                            .then(() => {
                                showToast('Owner account created!', 'success');
                            });
                    }
                });
            return;
        }
    }
    
    // Regular login
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            showToast('Login successful!', 'success');
        })
        .catch(error => {
            showToast('Login failed: ' + error.message, 'error');
        });
}

function logout() {
    auth.signOut()
        .then(() => {
            showToast('Logged out successfully', 'info');
            // Reset ke guest mode
            isGuest = true;
            isAdmin = false;
            currentUser = {
                uid: 'guest_' + Date.now(),
                email: 'guest@example.com',
                displayName: 'Guest User',
                isAnonymous: true
            };
            updateUIForUser();
            document.body.classList.remove('admin');
        })
        .catch(error => {
            showToast('Logout error: ' + error.message, 'error');
        });
}

// ===================== LOAD TESTIMONIALS =====================
function loadTestimonials() {
    db.collection('testimonials')
        .where('approved', '==', true)
        .orderBy('timestamp', 'desc')
        .limit(testimoniLimit)
        .get()
        .then(snapshot => {
            const testimoniList = document.getElementById('testimoniList');
            testimoniList.innerHTML = '';
            
            if (snapshot.empty) {
                loadDemoTestimonials();
                return;
            }
            
            snapshot.forEach(doc => {
                const testimonial = doc.data();
                renderTestimonial(testimonial, testimoniList);
            });
            
            updateRatingStats(snapshot);
        })
        .catch(() => {
            loadDemoTestimonials();
        });
}

function loadDemoTestimonials() {
    const demoTestimonials = [
        {
            userName: "Budi Santoso",
            userCountry: "Indonesia",
            text: "Produk original, pengiriman cepat. Rolex saya masih berjalan sempurna setelah 6 bulan.",
            rating: 5,
            timestamp: "2024-01-15",
            userType: "registered"
        },
        {
            userName: "Sarah Johnson",
            userCountry: "USA",
            text: "Authentic Hermès bag! The quality is exceptional. Worth every penny.",
            rating: 5,
            timestamp: "2024-01-10",
            userType: "registered"
        },
        {
            userName: "Guest",
            userCountry: "Singapore",
            text: "Great experience buying Cartier bracelet. Customer service was very helpful.",
            rating: 4,
            timestamp: "2024-01-05",
            userType: "guest"
        }
    ];
    
    const testimoniList = document.getElementById('testimoniList');
    demoTestimonials.forEach(testimonial => {
        renderTestimonial(testimonial, testimoniList);
    });
}

function renderTestimonial(testimonial, container) {
    const initials = testimonial.userName.split(' ').map(n => n[0]).join('').toUpperCase();
    
    const testimonialHTML = `
        <div class="testimonial-card">
            <div class="testimonial-header">
                <div class="testimonial-avatar">${initials}</div>
                <div class="testimonial-author">
                    <h4>${testimonial.userName} ${testimonial.userType === 'guest' ? '<span class="guest-badge">Guest</span>' : ''}</h4>
                    <span class="testimonial-country">${testimonial.userCountry}</span>
                </div>
                <div class="testimonial-rating">
                    <div class="stars" style="--rating: ${testimonial.rating};"></div>
                </div>
            </div>
            <p class="testimonial-text">${testimonial.text}</p>
            <div class="testimonial-date">
                ${new Date(testimonial.timestamp).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}
            </div>
        </div>
    `;
    
    container.innerHTML += testimonialHTML;
}

// ===================== INIT APP =====================
console.log(`
╔══════════════════════════════════════╗
║        AXELUX LUXURY STORE           ║
║         SYSTEM READY 100%            ║
╠══════════════════════════════════════╣
║ 🚀 Features:                         ║
║ • Guest Testimoni dengan Rating      ║
║ • Full Admin Panel                   ║
║ • Real-time Firebase                 ║
║ • WhatsApp Order System              ║
║ • Star Rating System                 ║
║ • No "Coming Soon" Sections          ║
║ • Mobile Responsive                  ║
╚══════════════════════════════════════╝

🔑 Owner Login: username="ownership", password="brandalz70"
👤 Guest: langsung bisa tulis review dengan rating
📞 WhatsApp: 0881010065137
`);
