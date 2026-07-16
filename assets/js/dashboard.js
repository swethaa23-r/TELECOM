document.addEventListener('DOMContentLoaded', function() {
    
    // Sidebar Mobile Toggle
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const sidebarToggle = document.getElementById('sidebarToggle');
    
    if(sidebar && sidebarOverlay && sidebarToggle) {
        function toggleSidebar() {
            sidebar.classList.toggle('show');
            sidebarOverlay.classList.toggle('show');
            document.body.classList.toggle('sidebar-open', sidebar.classList.contains('show'));
        }
        
        sidebarToggle.addEventListener('click', toggleSidebar);
        sidebarOverlay.addEventListener('click', toggleSidebar);
    }
    
    // Simulate Data Loading (Skeleton Removal)
    const dashboardContainer = document.getElementById('dashboardContainer');
    if(dashboardContainer) {
        setTimeout(() => {
            dashboardContainer.classList.add('dash-content-loaded');
            
            // Initialize charts after loading if functions exist
            if(typeof initCustomerCharts === 'function') initCustomerCharts();
            if(typeof initAdminCharts === 'function') initAdminCharts();
            
        }, 2000); // 2 second fake network delay
    }
    
    // Notification Dropdown animation
    const notifDropdown = document.getElementById('notificationDropdown');
    if(notifDropdown) {
        notifDropdown.addEventListener('show.bs.dropdown', function () {
            // Remove pulse badge when opened
            const badge = this.querySelector('.badge-pulse');
            if(badge) {
                badge.classList.remove('badge-pulse');
                badge.style.display = 'none';
            }
        });
    }
});
