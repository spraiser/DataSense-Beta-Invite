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

    // Initialize everything when DOM is ready
    function init() {
        window.DataSenseTracking.init();
        initSmoothScrolling();
        initAnimations();
        initNavigationEffects();
        enhanceFormExperience();
        initMobileMenu();
        monitorPerformance();
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();