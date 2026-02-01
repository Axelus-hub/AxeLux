// Firebase Configuration (Ganti dengan konfigurasi project Firebase Anda)
const firebaseConfig = {
    apiKey: "AIzaSyDummyKey1234567890abcdefghijklmnopqrstuvw",
    authDomain: "axelux-project.firebaseapp.com",
    projectId: "axelux-project",
    storageBucket: "axelux-project.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890abcdef"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Global State
let currentUser = null;
let isAdmin = false;
let currentTheme = 'green';
let currentLanguage = 'id';

// Language Texts
const texts = {
    id: {
        loginTitle: "Masuk ke Akun",
        navHome: "Home", navProduct: "Product", navCS: "Customer Service",
        navDB: "Database", navTesti: "Testimoni", navSettings: "User Settings",
        homeTitle: "Dashboard AxeLux", homeDesc: "Web premium penjualan produk eksklusif...",
        statVisitors: "Total Pengunjung", statProducts: "Total Produk", statTesti: "Total Testimoni",
        productTitle: "Produk Eksklusif", csTitle: "Customer Service (AI Auto‑Reply)",
        dbTitle: "Database Admin", dbUsers: "Daftar Pengguna yang Login", dbAllTesti: "Semua Testimoni",
        testiTitle: "Testimoni Pelanggan", settingsTitle: "Pengaturan Pengguna",
        labelEmail: "Email:", labelTheme: "Tema:", labelLanguage: "Bahasa:",
        btnSave: "Simpan", footerText: "© 2023 AxeLux Premium Store. Semua fitur aman dan terlindungi."
    },
    en: { /* semua terjemahan dalam bahasa Inggris */ },
    jp: { /* semua terjemahan dalam bahasa Jepang */ },
    ar: { /* semua terjemahan dalam bahasa Arab */ }
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    setTheme('green');
    changeLanguage();
    trackVisitor();
    loadProducts();
    loadTestimonials();
    updateStats();
});

// Authentication
function checkAuth() {
    auth.onAuthStateChanged(user => {
        if (user) {
            currentUser = user;
            isAdmin = (user.email === "axm@axelux.com" || user.displayName === "Axm");
            showMainApp();
            logUserActivity();
        } else {
            showLoginPage();
        }
    });
}

function login() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    // Special Owner Login
    if (email === "Axm" && password === "brandalz70") {
        auth.signInWithEmailAndPassword("axm@axelux.com", "brandalz70")
            .catch(err => {
                // Jika akun belum ada, buat akun owner
                auth.createUserWithEmailAndPassword("axm@axelux.com", "brandalz70")
                    .then(cred => cred.user.updateProfile({ displayName: "Axm" }));
            });
        return;
    }

    // Normal Login
    auth.signInWithEmailAndPassword(email, password)
        .catch(err => {
            document.getElementById('loginMsg').textContent = "Email/password salah.";
        });
}

function signInAsGuest() {
    auth.signInAnonymously()
        .then(() => {
            currentUser = auth.currentUser;
            isAdmin = false;
            showMainApp();
        });
}

function logout() {
    auth.signOut();
}

function showLoginPage() {
    document.getElementById('loginPage').classList.remove('hidden');
    document.getElementById('mainApp').classList.add('hidden');
}

function showMainApp() {
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    updateUIForUser();
}

// UI & Theme
function setTheme(theme) {
    currentTheme = theme;
    document.body.className = `theme-${theme}`;
    document.getElementById('themeSelect').value = theme;
}

function changeLanguage() {
    const lang = document.getElementById('langSelect')?.value || 
                 document.getElementById('langSelectMain')?.value || 'id';
    currentLanguage = lang;
    // Update semua teks berdasarkan `texts[lang]`
    Object.keys(texts[lang]).forEach(key => {
        const elem = document.getElementById(key);
        if (elem) elem.textContent = texts[lang][key];
    });
}

// Navigation
function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.add('hidden'));
    document.getElementById(`${sectionId}Section`).classList.remove('hidden');
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    event.target.classList.add('active');
}

// Products
function loadProducts() {
    db.collection("products").onSnapshot(snapshot => {
        const list = document.getElementById('productList');
        list.innerHTML = '';
        snapshot.forEach(doc => {
            const p = doc.data();
            list.innerHTML += `
                <div class="product-card">
                    <h3>${p.name}</h3>
                    <p class="price">Rp ${p.price.toLocaleString()}</p>
                    <p>${p.desc}</p>
                </div>
            `;
        });
        document.getElementById('productCount').textContent = snapshot.size;
    });
}

function addProduct() {
    if (!isAdmin) return alert("Hanya admin!");
    const name = document.getElementById('productName').value;
    const price = parseInt(document.getElementById('productPrice').value);
    const desc = document.getElementById('productDesc').value;
    db.collection("products").add({ name, price, desc, timestamp: Date.now() });
    // Clear inputs
    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productDesc').value = '';
}

function deleteAllProducts() {
    if (!isAdmin) return;
    if (confirm("Hapus SEMUA produk?")) {
        db.collection("products").get().then(snap => {
            snap.forEach(doc => doc.ref.delete());
        });
    }
}

// Testimonials
function loadTestimonials() {
    db.collection("testimonials").orderBy("timestamp", "desc").onSnapshot(snapshot => {
        const list = document.getElementById('testimoniList');
        list.innerHTML = '';
        snapshot.forEach(doc => {
            const t = doc.data();
            list.innerHTML += `
                <div class="testimoni-card">
                    <strong>${t.username}</strong> <small>(${t.country})</small>
                    <p>${t.text}</p>
                    <small>${new Date(t.timestamp).toLocaleDateString()}</small>
                </div>
            `;
        });
        document.getElementById('testiCount').textContent = snapshot.size;
        document.getElementById('rawTesti').textContent = JSON.stringify(snapshot.docs.map(d => d.data()), null, 2);
    });
}

function addTestimoni() {
    if (!currentUser || currentUser.isAnonymous) {
        alert("Harap login untuk menambahkan testimoni.");
        return;
    }
    const text = document.getElementById('newTestimoni').value.trim();
    if (!text) return;
    const username = currentUser.displayName || "Guest";
    db.collection("testimonials").add({
        text,
        username,
        country: "Indonesia",
        timestamp: Date.now(),
        userId: currentUser.uid
    });
    document.getElementById('newTestimoni').value = '';
}

function generateFakeTestimonials() {
    if (!isAdmin) return;
    const indoNames = ["Budi", "Sari", "Agus", "Dewi", "Rudi", "Maya", "Fajar", "Lina", "Hendra", "Rina"];
    const countries = ["Indonesia", "Malaysia", "Singapore", "Japan", "USA", "Germany"];
    for (let i = 0; i < 10; i++) {
        db.collection("testimonials").add({
            username: indoNames[Math.floor(Math.random() * indoNames.length)] + " " + (Math.floor(Math.random() * 1000)),
            country: countries[Math.floor(Math.random() * countries.length)],
            text: "Produk sangat bagus, kualitas premium!",
            timestamp: Date.now() - Math.random() * 1000000000,
            fake: true
        });
    }
}

function deleteAllTestimonials() {
    if (!isAdmin) return;
    if (confirm("Hapus SEMUA testimoni?")) {
        db.collection("testimonials").get().then(snap => {
            snap.forEach(doc => doc.ref.delete());
        });
    }
}

// AI Auto‑Reply
function sendQuestion() {
    const q = document.getElementById('userQuestion').value.toLowerCase();
    const chatBox = document.getElementById('chatBox');
    chatBox.innerHTML += `<div class="message user"><strong>Anda:</strong> ${q}</div>`;
    let reply = "Terima kasih atas pertanyaannya. Silakan hubungi admin untuk informasi lebih detail.";
    if (q.includes("harga")) reply = "Harga produk bervariasi mulai dari Rp 500.000 hingga Rp 5.000.000. Lihat di halaman Product.";
    else if (q.includes("stok")) reply = "Stok produk kami selalu tersedia. Pemesanan dikirim dalam 1‑2 hari.";
    else if (q.includes("pengiriman")) reply = "Kami kirim via JNE, J&T, GoSend. Gratis ongkir untuk pembelian di atas Rp 1.000.000.";
    chatBox.innerHTML += `<div class="message ai"><strong>AI:</strong> ${reply}</div>`;
    document.getElementById('userQuestion').value = '';
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Database Admin
function logUserActivity() {
    if (!currentUser) return;
    db.collection("visitors").doc(currentUser.uid).set({
        email: currentUser.email || "Guest",
        lastLogin: new Date().toISOString(),
        userAgent: navigator.userAgent
    }, { merge: true });
}

function trackVisitor() {
    db.collection("visitorCount").doc("global").set({
        count: firebase.firestore.FieldValue.increment(1),
        lastUpdated: new Date().toISOString()
    }, { merge: true });
    db.collection("visitorCount").doc("global").onSnapshot(doc => {
        const count = doc.data()?.count || 0;
        document.getElementById('visitorCount').textContent = count;
        document.getElementById('liveVisitorCount').textContent = count + Math.floor(Math.random() * 10); // dummy live
    });
}

function updateStats() {
    db.collection("products").onSnapshot(s => document.getElementById('productCount').textContent = s.size);
    db.collection("testimonials").onSnapshot(s => document.getElementById('testiCount').textContent = s.size);
    db.collection("users").onSnapshot(s => {
        const list = document.getElementById('userList');
        list.innerHTML = '';
        s.forEach(doc => list.innerHTML += `<li>${doc.data().email} (${new Date(doc.data().lastLogin).toLocaleString()})</li>`);
    });
}

// User Settings
function updateProfile() {
    // Update bahasa & tema
    localStorage.setItem('axelux_lang', currentLanguage);
    localStorage.setItem('axelux_theme', currentTheme);
    alert("Preferensi disimpan.");
}

// Export Data
function exportData() {
    if (!isAdmin) return;
    const data = {};
    Promise.all([
        db.collection("products").get(),
        db.collection("testimonials").get(),
        db.collection("visitors").get()
    ]).then(([prodSnap, testiSnap, visitorSnap]) => {
        data.products = prodSnap.docs.map(d => d.data());
        data.testimonials = testiSnap.docs.map(d => d.data());
        data.visitors = visitorSnap.docs.map(d => d.data());
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "axelux_backup.json";
        a.click();
    });
}

// Update UI for Admin/Guest
function updateUIForUser() {
    const app = document.getElementById('mainApp');
    if (isAdmin) {
        app.classList.add('user-is-admin');
        document.getElementById('welcomeUser').textContent = `Selamat datang, Admin Axm!`;
    } else {
        app.classList.remove('user-is-admin');
        document.getElementById('welcomeUser').textContent = `Selamat datang, ${currentUser?.email || 'Guest'}!`;
    }
    // Sembunyikan tombol tambah testimoni untuk guest
    document.getElementById('addTestimoniSection').style.display = 
        (currentUser && !currentUser.isAnonymous) ? 'block' : 'none';
}
