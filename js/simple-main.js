/**
 * Santosh Shop Payment Website - Simple JavaScript
 * Clean and minimal functionality
 */

class SantoshShopPayment {
    constructor() {
        this.upiId = 'santoshpaul501@okhdfcbank';
        this.shopName = 'Santosh Shop';
        this.qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi%3A//pay%3Fpa%3Dsantoshpaul501%40okhdfcbank%26pn%3DSantosh%2520Shop%26am%3D%26cu%3DINR%26tn%3DSupport%2520Payment';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeTheme();
        
        console.log('Santosh Shop Payment Website loaded successfully!');
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        themeToggle?.addEventListener('click', () => this.toggleTheme());

        // Pay Now button
        const payNowBtn = document.getElementById('payNowBtn');
        payNowBtn?.addEventListener('click', () => this.handlePayment());

        // Download QR button
        const downloadQRBtn = document.getElementById('downloadQRBtn');
        downloadQRBtn?.addEventListener('click', () => this.downloadQRCode());

        // Close modal
        const closeModal = document.getElementById('closeModal');
        closeModal?.addEventListener('click', () => this.closeThankYouModal());

        // Close modal on overlay click
        const modalOverlay = document.getElementById('thankYouModal');
        modalOverlay?.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                this.closeThankYouModal();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeThankYouModal();
            }
            if (e.key === 't' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }

    /**
     * Theme Management
     */
    initializeTheme() {
        const savedTheme = localStorage.getItem('santosh-shop-theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('santosh-shop-theme', newTheme);
        
        this.showNotification(`Switched to ${newTheme} mode`, 'success');
    }

    /**
     * Payment Handling
     */
    handlePayment() {
        const payBtn = document.getElementById('payNowBtn');
        
        // Add loading state
        payBtn.classList.add('loading');
        payBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening...';
        
        // Create UPI payment URL
        const upiUrl = `upi://pay?pa=${this.upiId}&pn=${encodeURIComponent(this.shopName)}&am=&cu=INR&tn=${encodeURIComponent('Support Payment')}`;
        
        // Detect if mobile device
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        setTimeout(() => {
            if (isMobile) {
                // On mobile, try to open UPI app
                window.location.href = upiUrl;
            } else {
                // On desktop, show payment instructions
                this.showDesktopPaymentInfo();
            }
            
            // Remove loading state
            payBtn.classList.remove('loading');
            payBtn.innerHTML = '<i class="fas fa-credit-card"></i> Pay Now';
            
            // Show thank you modal
            this.showThankYouModal();
            
            // Track payment attempt
            this.trackPaymentAttempt();
        }, 1000);
    }

    showDesktopPaymentInfo() {
        console.log('Desktop payment info - UPI ID:', this.upiId);
        alert(`Please use mobile device to open UPI app directly, or manually enter UPI ID: ${this.upiId} in your payment app.`);
    }

    trackPaymentAttempt() {
        const attempts = parseInt(localStorage.getItem('santosh-payment-attempts') || '0') + 1;
        localStorage.setItem('santosh-payment-attempts', attempts.toString());
        console.log(`Payment attempt #${attempts} - Santosh Shop`);
    }

    /**
     * QR Code Download
     */
    downloadQRCode() {
        const downloadBtn = document.getElementById('downloadQRBtn');
        
        // Add loading state
        downloadBtn.classList.add('loading');
        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
        
        setTimeout(() => {
            // Create download link
            const link = document.createElement('a');
            link.href = this.qrCodeUrl;
            link.download = `santosh-shop-qr-code.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Remove loading state
            downloadBtn.classList.remove('loading');
            downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download QR';
            
            this.showNotification('QR Code download started!', 'success');
        }, 800);
    }

    /**
     * Thank You Modal
     */
    showThankYouModal() {
        const modal = document.getElementById('thankYouModal');
        if (modal) {
            modal.classList.add('active');
            
            // Auto-close after 5 seconds
            setTimeout(() => {
                this.closeThankYouModal();
            }, 5000);
        }
    }

    closeThankYouModal() {
        const modal = document.getElementById('thankYouModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    /**
     * Notification System (Simple)
     */
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelectorAll('.notification');
        existing.forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Add notification styles
        this.addNotificationStyles();

        document.body.appendChild(notification);

        // Auto-remove after 4 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 4000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    addNotificationStyles() {
        if (document.getElementById('notification-styles')) return;

        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 80px;
                right: 20px;
                z-index: 3000;
                background: var(--bg-primary);
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius);
                box-shadow: var(--shadow-medium);
                min-width: 280px;
                max-width: 350px;
                animation: slideInRight 0.3s ease-out;
                transition: all 0.3s ease;
            }

            .notification-content {
                display: flex;
                align-items: center;
                padding: 1rem;
                gap: 0.75rem;
            }

            .notification-success { border-left: 4px solid var(--accent-secondary); }
            .notification-error { border-left: 4px solid var(--accent-danger); }
            .notification-warning { border-left: 4px solid #f39c12; }
            .notification-info { border-left: 4px solid var(--accent-primary); }

            .notification i:first-child {
                font-size: 1.1rem;
                flex-shrink: 0;
            }

            .notification-success i:first-child { color: var(--accent-secondary); }
            .notification-error i:first-child { color: var(--accent-danger); }
            .notification-warning i:first-child { color: #f39c12; }
            .notification-info i:first-child { color: var(--accent-primary); }

            .notification span {
                flex: 1;
                color: var(--text-primary);
                font-size: 0.9rem;
            }

            .notification-close {
                background: none;
                border: none;
                color: var(--text-secondary);
                cursor: pointer;
                padding: 0.25rem;
                border-radius: 4px;
                flex-shrink: 0;
            }

            .notification-close:hover {
                background: var(--bg-secondary);
                color: var(--accent-danger);
            }

            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @media (max-width: 768px) {
                .notification {
                    right: 10px;
                    left: 10px;
                    min-width: unset;
                    max-width: unset;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Utility Methods
     */
    copyToClipboard(text) {
        return navigator.clipboard.writeText(text).then(() => {
            this.showNotification('Copied to clipboard!', 'success');
        }).catch(() => {
            this.showNotification('Failed to copy', 'error');
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.santoshShop = new SantoshShopPayment();
});

// Add copy UPI ID functionality
document.addEventListener('click', (e) => {
    if (e.target.matches('.upi-id span')) {
        window.santoshShop?.copyToClipboard('santoshpaul501@okhdfcbank');
    }
});