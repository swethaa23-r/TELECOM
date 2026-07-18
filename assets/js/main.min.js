document.addEventListener('DOMContentLoaded', () => {
    // 1. Loader
    const loader = document.querySelector('.loader-wrapper');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                initGSAPAnimations();
            }, 500);
        }, 800); // Simulate loading time
    } else {
        initGSAPAnimations();
    }

    // 2. Scroll Progress Bar
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            let scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }

    // 3. Navbar Sticky Effect & Mobile Menu Logic
    const navbar = document.querySelector('.navbar-custom');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        const navbarCollapse = document.getElementById('navbarNav');
        if (navbarCollapse) {
            // Prevent background scrolling when menu is open
            navbarCollapse.addEventListener('show.bs.collapse', () => {
                document.body.classList.add('no-scroll');
            });
            navbarCollapse.addEventListener('hide.bs.collapse', () => {
                document.body.classList.remove('no-scroll');
            });

            // Close mobile menu automatically after selecting a menu item
            const navLinks = navbarCollapse.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (navbarCollapse.classList.contains('show')) {
                        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                        if (bsCollapse) {
                            bsCollapse.hide();
                        } else {
                            document.querySelector('.navbar-toggler').click();
                        }
                    }
                });
            });
        }
    }

    // 4. Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 50
        });
    }

    // 5. Card Tilt Effect (Vanilla JS alternative to VanillaTilt)
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            card.style.transition = 'transform 0.5s ease';
        });
        
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });
    });

    // 6. Page Transitions
    document.body.classList.add('page-loaded');
    const links = document.querySelectorAll('a[href]:not([target="_blank"]):not([href^="#"]):not([href^="mailto:"]):not([href^="tel:"])');
    links.forEach(link => {
        link.addEventListener('click', e => {
            if (link.hostname === window.location.hostname && link.pathname !== window.location.pathname) {
                e.preventDefault();
                const targetUrl = link.href;
                let overlay = document.querySelector('.page-transition-overlay');
                if (!overlay) {
                    overlay = document.createElement('div');
                    overlay.className = 'page-transition-overlay';
                    document.body.appendChild(overlay);
                }
                setTimeout(() => { overlay.classList.add('active'); }, 10);
                setTimeout(() => { window.location.href = targetUrl; }, 400);
            }
        });
    });
});

// GSAP Animations Initialization
function initGSAPAnimations() {
    if (typeof gsap === 'undefined') return;
    if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

    // Hero Section Animations
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroBtns = document.querySelector('.hero-btns');
    const heroMockup = document.querySelector('.hero-mockup-wrapper');

    if (heroTitle) gsap.fromTo(heroTitle, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", clearProps: "all" });
    if (heroSubtitle) gsap.fromTo(heroSubtitle, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, delay: 0.1, ease: "power2.out", clearProps: "all" });
    if (heroBtns) gsap.fromTo(heroBtns, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: "power2.out", clearProps: "all" });
    if (heroMockup) gsap.fromTo(heroMockup, { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, delay: 0.3, ease: "back.out(1.2)", clearProps: "all" });

    // Animated Counters
    const counters = document.querySelectorAll('.counter-val');
    counters.forEach(counter => {
        const endVal = parseFloat(counter.getAttribute('data-target'));
        const isDecimal = counter.getAttribute('data-target').includes('.');
        gsap.to(counter, {
            scrollTrigger: { trigger: counter, start: "top 90%", once: true },
            innerHTML: endVal,
            duration: 1.5,
            snap: { innerHTML: isDecimal ? 0.1 : 1 },
            onUpdate: function() {
                counter.innerHTML = isDecimal ? Number(this.targets()[0].innerHTML).toFixed(1) : Math.floor(Number(this.targets()[0].innerHTML));
            }
        });
    });

    // Staggered Cards
    if (typeof ScrollTrigger !== 'undefined') {


        // Hero Parallax
        const parallaxBg = document.querySelector('.position-absolute[style*="background: url"]');
        if (parallaxBg && parallaxBg.parentElement) {
            gsap.to(parallaxBg, {
                scrollTrigger: { trigger: parallaxBg.parentElement, start: "top top", end: "bottom top", scrub: 1 },
                y: 100, ease: "none"
            });
        }
    }
}

// 7. Text Reveal Observer
document.addEventListener('DOMContentLoaded', () => {
    const revealTexts = document.querySelectorAll('.text-reveal');
    if (revealTexts.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealTexts.forEach(text => {
            revealObserver.observe(text);
        });
    }

    // 8. Mouse Parallax
    const parallaxElements = document.querySelectorAll('.mouse-parallax');
    if (parallaxElements.length > 0) {
        document.addEventListener('mousemove', (e) => {
            parallaxElements.forEach(el => {
                const speed = el.getAttribute('data-speed') || 5;
                const x = (window.innerWidth - e.pageX * speed) / 100;
                const y = (window.innerHeight - e.pageY * speed) / 100;
                el.style.transform = `translateX(${x}px) translateY(${y}px)`;
            });
        });
    }

    // 9. Button Magnetic Hover
    const magneticBtns = document.querySelectorAll('.btn-magnetic');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', function(e) {
            const position = btn.getBoundingClientRect();
            const x = e.pageX - position.left - position.width / 2;
            const y = e.pageY - position.top - position.height / 2;
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;
        });
        btn.addEventListener('mouseout', function(e) {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });
});

    // 10. Newsletter Form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btnText = this.querySelector('.btn-text');
            const btnSuccess = this.querySelector('.btn-success');
            
            btnText.classList.add('d-none');
            btnSuccess.classList.remove('d-none');
            
            const btn = this.querySelector('button');
            btn.classList.remove('btn-primary-custom');
            btn.classList.add('btn-success');
            
            setTimeout(() => {
                this.reset();
                btnText.classList.remove('d-none');
                btnSuccess.classList.add('d-none');
                btn.classList.add('btn-primary-custom');
                btn.classList.remove('btn-success');
            }, 3000);
        });
    }
document.addEventListener('DOMContentLoaded', function() {
    const mainHeader = document.querySelector('header:not(.dash-topbar)');
    if (mainHeader) {
        // Sticky Header Logic
        mainHeader.style.position = 'fixed';
        mainHeader.style.top = '0';
        mainHeader.style.width = '100%';
        mainHeader.style.zIndex = '1050';
        mainHeader.style.transition = 'all 0.3s ease';
        mainHeader.style.backgroundColor = '#ffffff';
        
        // Prevent layout shift
        const headerHeight = mainHeader.offsetHeight;
        document.body.style.paddingTop = headerHeight + 'px';
        
        const navbar = mainHeader.querySelector('.navbar-custom');
        if (navbar) {
            navbar.style.transition = 'all 0.3s ease';
        }
        
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                mainHeader.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.05)';
                if (navbar) {
                    navbar.style.paddingTop = '0.5rem';
                    navbar.style.paddingBottom = '0.5rem';
                }
            } else {
                mainHeader.style.boxShadow = 'none';
                if (navbar) {
                    navbar.style.paddingTop = '1rem';
                    navbar.style.paddingBottom = '1rem';
                }
            }
        });
        
        // Active Navigation Logic
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = mainHeader.querySelectorAll('.nav-link-custom');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === currentPath) {
                link.classList.add('active');
            }
        });
    }
});



// Premium Preloader Animation
document.addEventListener('DOMContentLoaded', function() {
    const preloader = document.querySelector('.premium-preloader');
    if (preloader && typeof gsap !== 'undefined') {
        // Prevent scrolling while preloader is active
        document.body.classList.add('no-scroll');
        
        // Hide header and page content initially
        gsap.set('header, main, footer', { opacity: 0 });
        
        const tl = gsap.timeline({
            onComplete: () => {
                // Remove preloader from DOM and allow scrolling
                preloader.style.display = 'none';
                document.body.classList.remove('no-scroll');
            }
        });

        // 1. Red Dot pulses slightly
        tl.fromTo('.preloader-dot', 
            { scale: 0 }, 
            { scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)' }
        );

        // 2. Signal Waves expand outward
        tl.fromTo('.signal-ring',
            { scale: 0, opacity: 1 },
            { scale: 5, opacity: 0, duration: 1.5, stagger: 0.3, ease: 'power2.out' },
            '-=0.5'
        );

        // 3. Dot fades out, Logo fades in
        tl.to('.preloader-dot', { scale: 0, opacity: 0, duration: 0.4, ease: 'power2.in' }, '-=0.2');


        // 4. Text animates in
        tl.to('.preloader-title', { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.2');
        tl.to('.preloader-subtitle', { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.4');

        // 5. Preloader fades out and sections reveal sequentially
        tl.to(preloader, { opacity: 0, duration: 0.8, ease: 'power2.inOut', delay: 0.5 })
          .to('header', { opacity: 1, duration: 0.6, ease: 'power2.out' }, "-=0.2")
          .to('.hero-section, main > section:first-child', { opacity: 1, duration: 0.8, ease: 'power3.out' }, "-=0.3")
          .to('main, footer', { opacity: 1, duration: 0.6, ease: 'power2.out' }, "-=0.2");
    }

    // Automatically set active navigation link
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinksList = document.querySelectorAll('.nav-link-custom');
    navLinksList.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
});


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

