document.addEventListener('DOMContentLoaded', function() {
    // 1. Initialize AOS Globally
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 50,
        });
    }

    // 2. Number Counter Animation (High Performance using IntersectionObserver)
    const counters = document.querySelectorAll('.counter-val');
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseFloat(entry.target.getAttribute('data-target'));
                    const duration = 2000; // 2 seconds
                    const start = performance.now();
                    
                    const updateCounter = (currentTime) => {
                        const elapsed = currentTime - start;
                        const progress = Math.min(elapsed / duration, 1);
                        
                        // Easing function (easeOutExpo)
                        const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                                                // Determine decimal places from the original string
                        const targetStr = entry.target.getAttribute('data-target');
                        const decimals = targetStr.includes('.') ? targetStr.split('.')[1].length : 0;
                        const currentVal = (target * easeOut).toFixed(decimals);
                        
                        entry.target.textContent = currentVal;
                        
                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            entry.target.textContent = target; // Ensure exact final value
                        }
                    };
                    requestAnimationFrame(updateCounter);
                    observer.unobserve(entry.target); // Only animate once
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => counterObserver.observe(counter));
    }

    // 3. GSAP Animations
    if (typeof gsap !== 'undefined') {
        // Register ScrollTrigger if available
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        // Animated Background Blobs (Optimized with ScrollTrigger to pause when off-screen)
        const blobs = document.querySelectorAll('.gsap-blob');
        if (blobs.length > 0) {
            const blob1Anim = gsap.to(".gsap-blob-1", {
                x: 100, y: 50, scale: 1.2, rotation: 10,
                duration: 15, repeat: -1, yoyo: true, ease: "sine.inOut"
            });
            const blob2Anim = gsap.to(".gsap-blob-2", {
                x: -80, y: -60, scale: 1.1,
                duration: 12, repeat: -1, yoyo: true, ease: "sine.inOut"
            });
            
            // Pause animations when hero section is not visible
            const heroSection = document.querySelector('.hero-section');
            if (heroSection && typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.create({
                    trigger: heroSection,
                    start: "top bottom",
                    end: "bottom top",
                    onEnter: () => { blob1Anim.play(); blob2Anim.play(); },
                    onLeave: () => { blob1Anim.pause(); blob2Anim.pause(); },
                    onEnterBack: () => { blob1Anim.play(); blob2Anim.play(); },
                    onLeaveBack: () => { blob1Anim.pause(); blob2Anim.pause(); }
                });
            }
        }

        // Float Phone Mockup
        if (document.querySelector('.hero-mockup-wrapper .float-anim')) {
            gsap.to(".hero-mockup-wrapper .float-anim", {
                y: -20, duration: 3, repeat: -1, yoyo: true, ease: "power1.inOut"
            });
        }

        // Float Glass Cards
        if (document.querySelector('.tilt-card')) {
            gsap.to(".tilt-card:nth-of-type(odd)", {
                y: -15, rotation: 2, duration: 4, repeat: -1, yoyo: true, ease: "power1.inOut", delay: 0.5
            });
            gsap.to(".tilt-card:nth-of-type(even)", {
                y: 15, rotation: -2, duration: 3.5, repeat: -1, yoyo: true, ease: "power1.inOut", delay: 1
            });
        }
        
        // 4. Timeline Animation (About Page)
        const timelineItems = document.querySelectorAll('.timeline-item');
        if (timelineItems.length > 0 && typeof ScrollTrigger !== 'undefined') {
            timelineItems.forEach((item, index) => {
                gsap.fromTo(item, 
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1, 
                        y: 0, 
                        duration: 0.8, 
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: item,
                            start: "top 85%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });
            
            // Timeline line draw
            const timelineLine = document.querySelector('.timeline-line');
            if (timelineLine) {
                gsap.fromTo(timelineLine,
                    { height: "0%" },
                    {
                        height: "100%",
                        ease: "none",
                        scrollTrigger: {
                            trigger: ".timeline-container",
                            start: "top 50%",
                            end: "bottom 50%",
                            scrub: true
                        }
                    }
                );
            }
        }
    }

    // 5. Vanilla JS Hover Tilt Effect
    const tiltElements = document.querySelectorAll('.hover-tilt');
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg
            const rotateY = ((x - centerX) / centerX) * 10;
            
            el.style.transform = "perspective(1000px) rotateX($rotateXdeg) rotateY($rotateYdeg) scale3d(1.02, 1.02, 1.02)";
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });

    // 6. Plans Page - Monthly/Yearly Toggle
    const planToggle = document.getElementById('planToggle');
    if (planToggle) {
        const priceElements = document.querySelectorAll('.premium-card h3');
        
        // Store original prices and calculate yearly
        priceElements.forEach(el => {
            const text = el.innerText;
            const num = parseInt(text.replace(/[^0-9]/g, ''));
            if (num && !isNaN(num)) {
                el.dataset.monthly = num;
                // Yearly is 12 months with 20% discount
                el.dataset.yearly = Math.round((num * 12) * 0.8);
            }
        });

        planToggle.addEventListener('change', function() {
            const isYearly = this.checked;
            
            priceElements.forEach(el => {
                if (el.dataset.monthly) {
                    // Fade out
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(10px)';
                    el.style.transition = 'all 0.3s ease';
                    
                    setTimeout(() => {
                        if (isYearly) {
                            el.innerHTML = "₹" + el.dataset.yearly + " <span class='fs-6 text-muted fw-normal'>/yr</span>";
                        } else {
                            el.innerHTML = "₹" + el.dataset.monthly;
                        }
                        
                        // Fade in
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    }, 300);
                }
            });
        });
    }

    // 7. Broadband Page - Speed Comparison & Coverage
    if (typeof ScrollTrigger !== 'undefined') {
        const speedSection = document.querySelector('.progress-standard');
        if (speedSection) {
            ScrollTrigger.create({
                trigger: speedSection,
                start: "top 80%",
                once: true,
                onEnter: () => {
                    gsap.to('.progress-standard', { width: "100%", duration: 8, ease: "power1.inOut" });
                    gsap.to('.progress-stackly', { width: "100%", duration: 1.5, ease: "power2.out" });
                }
            });
        }
    }
    
    const coverageForm = document.getElementById('coverageForm');
    if (coverageForm) {
        coverageForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const pinInput = document.getElementById('pincodeInput');
            const pin = pinInput.value.trim();
            const btn = document.getElementById('btnCoverage');
            
            if (!/^\d{6}$/.test(pin)) {
                pinInput.classList.add('is-invalid');
                pinInput.style.animation = 'shake 0.5s';
                setTimeout(() => pinInput.style.animation = '', 500);
                return;
            }
            
            pinInput.classList.remove('is-invalid');
            btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
            btn.classList.add('disabled');
            
            setTimeout(() => {
                btn.innerHTML = 'Check';
                btn.classList.remove('disabled');
                coverageForm.classList.add('d-none');
                
                const successDiv = document.getElementById('coverageSuccess');
                successDiv.classList.remove('d-none');
                successDiv.style.opacity = '0';
                setTimeout(() => successDiv.style.opacity = '1', 50);
            }, 1200);
        });
    }
});