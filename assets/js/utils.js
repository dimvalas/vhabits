// Utility functions for GitHub Pages Demo
const utils = {
    // Check if user is authenticated and redirect if not
    requireAuth() {
        if (!authManager.isAuthenticated()) {
            window.location.href = '/github-pages-demo/pages/login.html';
            return false;
        }
        return true;
    },
    
    // Redirect to habits page if authenticated
    redirectIfAuthenticated() {
        if (authManager.isAuthenticated()) {
            window.location.href = '/github-pages-demo/pages/habit.html';
        }
    },
    
    // Format date for display
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    },
    
    // Get today's date in YYYY-MM-DD format
    getTodayString() {
        return new Date().toISOString().split('T')[0];
    },
    
    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'error' ? 'var(--danger-color)' : 'var(--success-color)'};
            color: white;
            border-radius: var(--radius);
            z-index: 1000;
            box-shadow: var(--shadow);
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
};

// Notification manager for better UX
const notificationManager = {
    success(message) {
        utils.showNotification(message, 'success');
    },
    
    error(message) {
        utils.showNotification(message, 'error');
    },
    
    info(message) {
        utils.showNotification(message, 'info');
    }
};

// Global logout function
function logout() {
    authManager.logout();
}

// Demo notification on page load
document.addEventListener('DOMContentLoaded', () => {
    // Show demo notification after a brief delay
    setTimeout(() => {
        if (window.location.pathname.includes('github-pages-demo')) {
            notificationManager.info('🎯 Demo Mode: All data is stored locally and will reset when you clear browser data');
        }
    }, 2000);
});
