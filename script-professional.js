// Professional DataSense Landing Page JavaScript
(function() {
    'use strict';

    // Professional analytics tracking
    window.DataSenseTracking = {
        init: function() {
            this.sessionId = this.generateSessionId();
            this.startTime = Date.now();
            
            // Track initial page view
            this.trackEvent('page_view', {
                page_title: document.title,
                page_url: window.location.href,
                session_id: this.sessionId
            });
            
            // Set up scroll tracking
            this.initScrollTracking();
            
            // Set up form tracking
            this.initFormTracking();
        },

        generateSessionId: function() {
            return 'ds_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        },

        trackEvent: function(eventName, properties = {}) {
            // Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', eventName, {
                    ...properties,
                    session_id: this.sessionId,
                    timestamp: Date.now()
                });
            }
            
            console.log('Event tracked:', eventName, properties);
        },

        initScrollTracking: function() {
            let scrollDepthMarkers = [25, 50, 75, 90];
            let scrollDepthTracked = [];
            
            const trackScrollDepth = () => {
                const scrollPercent = Math.round(
                    (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
                );
                
                scrollDepthMarkers.forEach(marker => {
                    if (scrollPercent >= marker && !scrollDepthTracked.includes(marker)) {
                        scrollDepthTracked.push(marker);
                        this.trackEvent('scroll_depth', {
                            depth_percentage: marker,
                            session_id: this.sessionId
                        });
                    }
                });
            };
            
            let scrollTimeout;
            window.addEventListener('scroll', () => {
                if (scrollTimeout) clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(trackScrollDepth, 100);
            }, { passive: true });
        },

        initFormTracking: function() {
            const form = document.getElementById('beta-form');
            if (!form) return;
            
            // Track form interactions
            form.addEventListener('focusin', (e) => {
                if (e.target.matches('input, select, textarea')) {
                    this.trackEvent('form_field_focus', {
                        field_name: e.target.name,
                        field_type: e.target.type,
                        session_id: this.sessionId
                    });
                }
            });
            
            // Track form submission
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(form);
            });
        },

        handleFormSubmission: function(form) {
            const formData = new FormData(form);
            const email = formData.get('email');
            
            // Validate email
            if (!this.validateEmail(email)) {
                this.showFormError('Please enter a valid email address');
                return;
            }
            
            // Show loading state
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<span>Processing...</span>';
            submitButton.disabled = true;
            
            // Track form submission
            this.trackEvent('form_submit', {
                email: email,
                session_id: this.sessionId,
                utm_source: this.getUTMParameter('utm_source'),
                utm_medium: this.getUTMParameter('utm_medium'),
                utm_campaign: this.getUTMParameter('utm_campaign')
            });
            
            // Simulate form submission
            setTimeout(() => {
                this.showSuccessMessage(form);
                this.trackEvent('conversion', {
                    conversion_type: 'beta_signup',
                    email: email,
                    session_id: this.sessionId
                });
            }, 1500);
        },

        validateEmail: function(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        showFormError: function(message) {
            // Remove existing error
            const existingError = document.querySelector('.form-error');
            if (existingError) existingError.remove();
            
            // Create error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'form-error';
            errorDiv.style.cssText = `
                color: #EF4444;
                font-size: 14px;
                text-align: center;
                margin-top: 12px;
                padding: 12px;
                background: rgba(239, 68, 68, 0.1);
                border-radius: 8px;
                border: 1px solid rgba(239, 68, 68, 0.2);
            `;
            errorDiv.textContent = message;
            
            const form = document.getElementById('beta-form');
            form.appendChild(errorDiv);
            
            // Remove error after 5 seconds
            setTimeout(() => errorDiv.remove(), 5000);
        },

        showSuccessMessage: function(form) {
            form.innerHTML = `
                <div style="text-align: center; padding: 40px 20px;">
                    <div style="font-size: 48px; margin-bottom: 16px;">🎉</div>
                    <h3 style="font-size: 24px; font-weight: 600; margin-bottom: 12px; color: white;">
                        Welcome to DataSense Beta!
                    </h3>
                    <p style="font-size: 16px; color: rgba(255, 255, 255, 0.8); margin: 0;">
                        Check your email for next steps. We'll be in touch within 24 hours.
                    </p>
                </div>
            `;
        },

        getUTMParameter: function(param) {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(param) || '';
        }
    };

    // Smooth scrolling for anchor links
    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed nav
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Intersection Observer for animations
    function initAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements that should animate in
        document.querySelectorAll('.feature-card, .testimonial-card, .comparison-side').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    // Navigation scroll effect
    function initNavigationEffects() {
        const nav = document.querySelector('.nav');
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                nav.style.background = 'rgba(255, 255, 255, 0.98)';
                nav.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
            } else {
                nav.style.background = 'rgba(255, 255, 255, 0.95)';
                nav.style.boxShadow = 'none';
            }
            
            lastScrollY = currentScrollY;
        }, { passive: true });
    }

    // Professional form enhancements
    function enhanceFormExperience() {
        const emailInput = document.querySelector('input[name="email"]');
        if (!emailInput) return;

        // Add real-time validation
        emailInput.addEventListener('blur', function() {
            const email = this.value.trim();
            if (email && !window.DataSenseTracking.validateEmail(email)) {
                this.style.borderColor = '#EF4444';
                this.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
            } else {
                this.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                this.style.boxShadow = 'none';
            }
        });

        // Clear validation on focus
        emailInput.addEventListener('focus', function() {
            this.style.borderColor = 'rgba(255, 255, 255, 0.4)';
            this.style.boxShadow = '0 0 0 3px rgba(255, 255, 255, 0.1)';
        });
    }

    // Mobile menu functionality (if needed)
    function initMobileMenu() {
        // Add mobile menu toggle if needed
        // This would be implemented based on the navigation design
    }

    // Performance monitoring
    function monitorPerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.timing;
                    const loadTime = perfData.loadEventEnd - perfData.navigationStart;
                    
                    window.DataSenseTracking.trackEvent('performance', {
                        page_load_time: loadTime,
                        dom_content_loaded: perfData.domContentLoadedEventEnd - perfData.navigationStart
                    });
                }, 0);
            });
        }
    }

    // Countdown Timer
    function initCountdownTimer() {
        const timerElement = document.querySelector('#countdown-timer strong');
        if (!timerElement) return;

        // Set end time to 72 hours from now
        const endTime = new Date().getTime() + (72 * 60 * 60 * 1000);
        
        function updateTimer() {
            const now = new Date().getTime();
            const distance = endTime - now;
            
            if (distance < 0) {
                timerElement.textContent = 'EXPIRED';
                return;
            }
            
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            timerElement.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
        
        updateTimer();
        setInterval(updateTimer, 1000);
    }

    // Dynamic Spots Remaining
    function initSpotsRemaining() {
        const spotsElement = document.getElementById('spots-remaining');
        if (!spotsElement) return;
        
        // Start with 12 spots and decrease randomly
        let spots = 12;
        
        function updateSpots() {
            if (spots > 3) {
                spots--;
                spotsElement.textContent = spots;
                spotsElement.style.animation = 'countPulse 0.3s ease-out';
                
                // Remove animation after it completes
                setTimeout(() => {
                    spotsElement.style.animation = '';
                }, 300);
            }
        }
        
        // Update spots randomly every 30-90 seconds
        setInterval(() => {
            if (Math.random() > 0.5) {
                updateSpots();
            }
        }, 45000);
    }

    // Exit Intent Popup
    function initExitIntent() {
        const overlay = document.getElementById('exit-popup-overlay');
        const closeBtn = document.getElementById('exit-popup-close');
        let exitIntentShown = false;
        
        if (!overlay) return;
        
        // Close popup functionality
        closeBtn.addEventListener('click', () => {
            overlay.style.display = 'none';
        });
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.style.display = 'none';
            }
        });
        
        // Exit intent detection
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 0 && !exitIntentShown) {
                exitIntentShown = true;
                overlay.style.display = 'block';
                window.DataSenseTracking.trackEvent('exit_intent_shown');
            }
        });
        
        // ROI Calculator
        const revenueInput = document.getElementById('revenue-input');
        const hoursInput = document.getElementById('hours-input');
        const savingsValue = document.getElementById('savings-value');
        const timeValue = document.getElementById('time-value');
        const roiValue = document.getElementById('roi-value');
        
        function calculateROI() {
            const revenue = parseFloat(revenueInput.value) || 50000;
            const hours = parseFloat(hoursInput.value) || 40;
            
            // Calculate savings (2% of revenue improvement + hourly rate savings)
            const revenueSavings = revenue * 0.02;
            const timeSavings = hours * 0.875; // Save 87.5% of time
            const hourlySavings = timeSavings * 75; // $75/hour average
            const totalSavings = revenueSavings + hourlySavings;
            
            // Calculate ROI (assuming $299/month cost)
            const monthlyROI = ((totalSavings - 299) / 299) * 100;
            
            savingsValue.textContent = `$${Math.round(totalSavings).toLocaleString()}`;
            timeValue.textContent = `${Math.round(timeSavings)} hours`;
            roiValue.textContent = `${Math.round(monthlyROI)}%`;
        }
        
        if (revenueInput && hoursInput) {
            revenueInput.addEventListener('input', calculateROI);
            hoursInput.addEventListener('input', calculateROI);
            calculateROI(); // Initial calculation
        }
    }

    // Mobile Sticky CTA
    function initMobileStickyButton() {
        const stickyBtn = document.getElementById('mobile-sticky-cta');
        const heroSection = document.querySelector('.hero');
        
        if (!stickyBtn || !heroSection) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting && window.innerWidth <= 768) {
                    stickyBtn.style.transform = 'translateY(0)';
                } else {
                    stickyBtn.style.transform = 'translateY(100%)';
                }
            });
        }, {
            threshold: 0.1
        });
        
        observer.observe(heroSection);
        
        // Add initial transform
        stickyBtn.style.transform = 'translateY(100%)';
        stickyBtn.style.transition = 'transform 0.3s ease-out';
    }

    // Counting Animation
    function initCountingAnimation() {
        const statNumbers = document.querySelectorAll('.stat-number');
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };
        
        const countUp = (element, target, suffix = '') => {
            let current = 0;
            const increment = target / 30;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                element.textContent = Math.round(current) + suffix;
                element.classList.add('counting');
                setTimeout(() => element.classList.remove('counting'), 300);
            }, 50);
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.counted) {
                    entry.target.dataset.counted = 'true';
                    const text = entry.target.textContent;
                    
                    if (text === '30s') {
                        countUp(entry.target, 30, 's');
                    } else if (text === '40%') {
                        countUp(entry.target, 40, '%');
                    } else if (text === '2hrs') {
                        countUp(entry.target, 2, 'hrs');
                    }
                }
            });
        }, observerOptions);
        
        statNumbers.forEach(stat => observer.observe(stat));
    }

    // Parallax Effect
    function initParallaxEffect() {
        const heroVisual = document.querySelector('.hero-visual');
        if (!heroVisual) return;
        
        let ticking = false;
        
        function updateParallax() {
            const scrolled = window.pageYOffset;
            const speed = 0.5;
            const yPos = -(scrolled * speed);
            
            heroVisual.style.transform = `translateY(${yPos}px)`;
            ticking = false;
        }
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
    }

    // Enhanced Form Submission with Progress
    function enhanceFormSubmission() {
        const form = document.getElementById('beta-form');
        if (!form) return;
        
        const originalHandler = form.onsubmit;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show progress indicator
            const progressDiv = document.getElementById('form-progress');
            if (progressDiv) {
                progressDiv.style.display = 'block';
            }
            
            // Call original handler
            window.DataSenseTracking.handleFormSubmission(form);
        });
    }

    // Initialize everything when DOM is ready
    function init() {
        window.DataSenseTracking.init();
        initSmoothScrolling();
        initAnimations();
        initNavigationEffects();
        enhanceFormExperience();
        enhanceFormSubmission();
        initMobileMenu();
        monitorPerformance();
        
        // New features
        initCountdownTimer();
        initSpotsRemaining();
        initExitIntent();
        initMobileStickyButton();
        initCountingAnimation();
        initParallaxEffect();
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();