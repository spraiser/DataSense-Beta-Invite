// Performance Optimization for Interactive Demo
(function() {
    'use strict';

    // Lazy loading for demo components
    const DemoPerformance = {
        init() {
            this.setupLazyLoading();
            this.optimizeAnimations();
            this.setupIntersectionObservers();
            this.preloadAssets();
        },

        setupLazyLoading() {
            // Only load Chart.js when demo is in viewport
            const loadChartJS = () => {
                if (!window.Chart && !document.querySelector('script[src*="chart.js"]')) {
                    const script = document.createElement('script');
                    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
                    script.async = true;
                    script.onload = () => {
                        console.log('Chart.js loaded');
                        // Reinitialize demo if needed
                        if (window.DataSenseDemo && !window.demoInitialized) {
                            initializeDemo();
                        }
                    };
                    document.head.appendChild(script);
                }
            };

            // Check if demo is visible
            const demoObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        loadChartJS();
                        demoObserver.disconnect();
                    }
                });
            }, { threshold: 0.1 });

            const demoSection = document.querySelector('.hero-visual, .demo-section');
            if (demoSection) {
                demoObserver.observe(demoSection);
            }
        },

        optimizeAnimations() {
            // Reduce animation complexity on low-end devices
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            
            if (prefersReducedMotion) {
                document.documentElement.style.setProperty('--animation-duration', '0.1s');
                document.documentElement.classList.add('reduced-motion');
            }

            // Throttle scroll animations
            let scrollTimeout;
            const throttledScroll = () => {
                if (scrollTimeout) return;
                
                scrollTimeout = setTimeout(() => {
                    scrollTimeout = null;
                    this.handleScroll();
                }, 100);
            };

            window.addEventListener('scroll', throttledScroll, { passive: true });
        },

        setupIntersectionObservers() {
            // Animate elements when they come into view
            const animateOnScroll = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        
                        // Track visibility for analytics
                        if (window.DataSenseTracking && entry.target.dataset.track) {
                            window.DataSenseTracking.trackEvent('element_visible', {
                                element: entry.target.dataset.track
                            });
                        }
                    }
                });
            }, {
                threshold: 0.2,
                rootMargin: '50px'
            });

            // Observe demo elements
            document.querySelectorAll('.industry-query-card, .feature-card, .use-case-card').forEach(el => {
                animateOnScroll.observe(el);
            });
        },

        preloadAssets() {
            // Preload critical fonts
            const fonts = [
                'https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2',
                'https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa25L7.woff2'
            ];

            fonts.forEach(font => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'font';
                link.type = 'font/woff2';
                link.crossOrigin = 'anonymous';
                link.href = font;
                document.head.appendChild(link);
            });
        },

        handleScroll() {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            
            // Parallax effect for hero section
            const hero = document.querySelector('.hero-visual');
            if (hero && scrollY < windowHeight) {
                hero.style.transform = `translateY(${scrollY * 0.3}px)`;
            }
        }
    };

    // Mobile Performance Optimizations
    const MobileOptimizations = {
        init() {
            if (this.isMobile()) {
                this.optimizeForMobile();
            }
        },

        isMobile() {
            return window.innerWidth <= 768 || 
                   /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        },

        optimizeForMobile() {
            // Simplify animations on mobile
            document.documentElement.classList.add('mobile-device');
            
            // Use simpler chart configurations
            if (window.Chart) {
                Chart.defaults.animation.duration = 500;
                Chart.defaults.elements.point.radius = 2;
            }

            // Reduce demo query animations
            const style = document.createElement('style');
            style.textContent = `
                .mobile-device .typing-animation {
                    animation: none !important;
                }
                .mobile-device .thinking-step {
                    animation-duration: 0.2s !important;
                }
                .mobile-device .demo-container {
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
                }
            `;
            document.head.appendChild(style);

            // Touch-friendly interactions
            this.setupTouchInteractions();
        },

        setupTouchInteractions() {
            // Add touch feedback
            document.querySelectorAll('.query-btn, .industry-btn, .try-demo-btn').forEach(btn => {
                btn.addEventListener('touchstart', function() {
                    this.classList.add('touch-active');
                }, { passive: true });
                
                btn.addEventListener('touchend', function() {
                    setTimeout(() => this.classList.remove('touch-active'), 200);
                }, { passive: true });
            });

            // Prevent double-tap zoom on buttons
            let lastTouchEnd = 0;
            document.addEventListener('touchend', function(e) {
                const now = Date.now();
                if (now - lastTouchEnd <= 300) {
                    e.preventDefault();
                }
                lastTouchEnd = now;
            }, false);
        }
    };

    // Request Idle Callback for non-critical updates
    const deferredUpdates = () => {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                // Load non-critical features
                if (window.IndustryDemoSwitcher) {
                    // Additional industry demo features
                }
            }, { timeout: 2000 });
        }
    };

    // Initialize performance optimizations
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            DemoPerformance.init();
            MobileOptimizations.init();
            deferredUpdates();
        });
    } else {
        DemoPerformance.init();
        MobileOptimizations.init();
        deferredUpdates();
    }

    // Export for debugging
    window.DemoPerformance = DemoPerformance;
    window.MobileOptimizations = MobileOptimizations;
})();