// Inisialisasi ketika halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    console.log('Axelux Store Dashboard - Siap Digunakan!');
    
    // Inisialisasi toggle tema
    initThemeToggle();
    
    // Inisialisasi efek 3D pada elemen
    init3DEffects();
    
    // Inisialisasi animasi progress bar
    initProgressAnimation();
    
    // Inisialisasi interaksi navigasi
    initNavigation();
    
    // Inisialisasi efek hover pada kartu
    initCardHoverEffects();
    
    // Update status pengguna
    updateUserStatus();
    
    // Tambahkan efek kedalaman pada logo
    enhanceLogo3D();
});

// Fungsi toggle tema terang/gelap
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const container = document.querySelector('.container');
    
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            // Mode terang
            body.style.background = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
            container.style.backgroundColor = 'white';
            container.style.color = '#333';
            updateThemeLabel('Mode Terang');
        } else {
            // Mode gelap
            body.style.background = 'linear-gradient(135deg, #2c3e50 0%, #1a1a2e 100%)';
            container.style.backgroundColor = '#2d3436';
            container.style.color = '#f8f9fa';
            updateThemeLabel('Mode Gelap');
        }
        
        // Tambahkan efek transisi
        container.style.transition = 'background-color 0.5s ease, color 0.5s ease';
        
        // Tambahkan feedback visual
        const toggleSlider = document.querySelector('.toggle-slider');
        toggleSlider.style.transform = 'scale(1.05)';
        setTimeout(() => {
            toggleSlider.style.transform = 'scale(1)';
        }, 200);
    });
}

// Fungsi untuk memperbarui label tema
function updateThemeLabel(mode) {
    const label = document.querySelector('.toggle-label span');
    const icon = document.querySelector('.toggle-label i');
    
    label.textContent = mode;
    
    if (mode === 'Mode Terang') {
        icon.className = 'fas fa-sun';
        icon.style.color = '#fdcb6e';
    } else {
        icon.className = 'fas fa-moon';
        icon.style.color = '#6c5ce7';
    }
}

// Fungsi untuk efek 3D pada elemen
function init3DEffects() {
    const cards3D = document.querySelectorAll('.stat-card-3d, .content-3d');
    
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
    
    // Reset width untuk memulai animasi
    progressFill.style.width = '0%';
    
    // Jalankan animasi setelah sedikit delay
    setTimeout(() => {
        progressFill.style.width = '85%';
        progressFill.style.transition = 'width 1.5s cubic-bezier(0.22, 0.61, 0.36, 1)';
    }, 500);
}

// Fungsi untuk interaksi navigasi
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Hapus kelas aktif dari semua item
            navItems.forEach(nav => {
                nav.classList.remove('active');
            });
            
            // Tambahkan kelas aktif ke item yang diklik
            this.classList.add('active');
            
            // Efek klik
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Simulasi perubahan konten berdasarkan navigasi
            simulateContentChange(this.querySelector('.nav-link span').textContent);
        });
    });
}

// Fungsi simulasi perubahan konten
function simulateContentChange(section) {
    const dashboardTitle = document.querySelector('.title-3d');
    const originalTitle = dashboardTitle.textContent;
    
    // Efek transisi judul
    dashboardTitle.style.opacity = '0.5';
    dashboardTitle.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
        dashboardTitle.textContent = section;
        dashboardTitle.style.opacity = '1';
        dashboardTitle.style.transform = 'translateY(0)';
        
        // Kembalikan judul setelah 2 detik
        setTimeout(() => {
            dashboardTitle.style.opacity = '0.5';
            dashboardTitle.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                dashboardTitle.textContent = originalTitle;
                dashboardTitle.style.opacity = '1';
                dashboardTitle.style.transform = 'translateY(0)';
            }, 300);
        }, 2000);
    }, 300);
}

// Fungsi efek hover pada kartu
function initCardHoverEffects() {
    const cards = document.querySelectorAll('.stat-card, .content-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.stat-icon, .illustration-3d, .card-header i');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.stat-icon, .illustration-3d, .card-header i');
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
    
    // Simulasi perubahan status acak
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
            
            // Kembalikan ke online setelah 3 detik
            setTimeout(() => {
                statusIndicator.className = 'status-indicator active';
                statusIndicator.style.backgroundColor = '#00b894';
                statusText.textContent = 'Online';
            }, 3000);
        }
    }, 10000); // Update setiap 10 detik
}

// Fungsi untuk meningkatkan efek 3D pada logo
function enhanceLogo3D() {
    const logo = document.querySelector('.logo-3d');
    
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
}

// Fungsi untuk tombol login
document.querySelector('.btn-login')?.addEventListener('click', function() {
    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
    this.disabled = true;
    
    // Simulasi proses login
    setTimeout(() => {
        alert('Fitur login sedang dalam pengembangan. Terima kasih!');
        this.innerHTML = '<i class="fas fa-sign-in-alt"></i> Masuk ke Akun';
        this.disabled = false;
    }, 1500);
});
