
// Dynamic Link Validator (404 Fallback)
document.addEventListener('DOMContentLoaded', () => {
    const validPages = [
        '404.html', 'about.html', 'broadband.html', 'business.html', 
        'contact.html', 'index.html', 'login.html', 'plans.html', 
        'recharge.html', 'signup.html', 'support.html'
    ];

    document.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');
        
        // If it's a completely empty link or just a placeholder #
        if (!href || href === '#') {
            link.setAttribute('href', '404.html');
            return;
        }

        // Ignore external links, emails, phones, JS, or valid ID anchors (e.g., #collapseOne)
        if (href.startsWith('http') || href.startsWith('mailto:') || 
            href.startsWith('tel:') || href.startsWith('javascript:') || 
            (href.startsWith('#') && href.length > 1)) {
            return;
        }

        // Get the base filename without hash or query params
        const basePath = href.split('?')[0].split('#')[0];
        
        // If the href is an HTML file and it's not in our list of valid pages, point to 404
        if (basePath && basePath.endsWith('.html') && !validPages.includes(basePath)) {
            link.setAttribute('href', '404.html');
        }
        
        // If it's a relative link to a non-file (like a folder) that isn't root
        if (basePath && !basePath.endsWith('.html') && !basePath.endsWith('/') && !basePath.includes('.')) {
            link.setAttribute('href', '404.html');
        }
    });
});
