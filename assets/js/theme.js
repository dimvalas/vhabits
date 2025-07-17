class ThemeManager {
    constructor() {
        this.currentTheme = this.getStoredTheme() || 'light';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.setupThemeToggle();
        this.setupUserDropdown();
        this.updateThemeButton();
    }

    getStoredTheme() {
        return localStorage.getItem('theme');
    }

    setStoredTheme(theme) {
        localStorage.setItem('theme', theme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        this.setStoredTheme(theme);
        this.updateThemeButton();
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }

    updateThemeButton() {
        const themeButtons = document.querySelectorAll('.theme-toggle');
        themeButtons.forEach(themeButton => {
            if (themeButton) {
                themeButton.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
                themeButton.title = `Switch to ${this.currentTheme === 'light' ? 'dark' : 'light'} mode`;
            }
        });
    }

    setupThemeToggle() {
        const themeButtons = document.querySelectorAll('.theme-toggle');
        themeButtons.forEach(themeButton => {
            if (themeButton) {
                themeButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleTheme();
                });
            }
        });
    }

    setupUserDropdown() {
        const userDropdown = document.querySelector('.user-dropdown');
        const userToggle = document.querySelector('.user-menu-toggle');
        const userMenu = document.querySelector('.user-dropdown-menu');

        if (userDropdown && userToggle && userMenu) {
            userToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('active');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!userDropdown.contains(e.target)) {
                    userDropdown.classList.remove('active');
                }
            });

            // Close dropdown when pressing escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    userDropdown.classList.remove('active');
                }
            });
        }
    }
}

// Notification system
class NotificationManager {
    constructor() {
        this.container = this.createContainer();
    }

    createContainer() {
        const container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
        return container;
    }

    show(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;

        const icon = this.getIcon(type);
        notification.innerHTML = `
            <div class="notification-icon">${icon}</div>
            <div class="notification-message">${message}</div>
            <button class="notification-close" onclick="this.parentElement.remove()">×</button>
        `;

        this.container.appendChild(notification);

        // Auto remove after duration
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, duration);

        return notification;
    }

    getIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }

    success(message, duration) {
        return this.show(message, 'success', duration);
    }

    error(message, duration) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration) {
        return this.show(message, 'info', duration);
    }
}

// Loading system
class LoadingManager {
    constructor() {
        this.activeLoaders = new Set();
    }

    show(target = document.body, message = 'Loading...') {
        const loader = document.createElement('div');
        loader.className = 'loading-overlay';
        loader.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>${message}</p>
            </div>
        `;

        const loaderId = Math.random().toString(36).substr(2, 9);
        loader.setAttribute('data-loader-id', loaderId);

        if (target === document.body) {
            loader.classList.add('loading-fullscreen');
        }

        target.style.position = 'relative';
        target.appendChild(loader);

        this.activeLoaders.add(loaderId);
        return loaderId;
    }

    hide(loaderId) {
        const loader = document.querySelector(`[data-loader-id="${loaderId}"]`);
        if (loader) {
            loader.remove();
            this.activeLoaders.delete(loaderId);
        }
    }

    hideAll() {
        this.activeLoaders.forEach(loaderId => {
            this.hide(loaderId);
        });
    }
}

// Global instances
const themeManager = new ThemeManager();
const notificationManagerInstance = new NotificationManager();
const loadingManager = new LoadingManager();

// Global functions for compatibility
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    notificationManagerInstance.success('Logged out successfully');
    setTimeout(() => {
        window.location.href = window.location.href.includes('/pages/') ? 'login.html' : 'pages/login.html';
    }, 1000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Apply theme immediately to prevent flash
    const storedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', storedTheme);

    // Reinitialize theme manager if not already done
    if (!window.themeManager) {
        window.themeManager = new ThemeManager();
    }
});
