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

    // Countdown Timer with Cookie Persistence
    function initCountdownTimer() {
        const timerElement = document.querySelector('#countdown-timer strong');
        if (!timerElement) return;

        // Get or set countdown end time in cookies
        function getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        }

        function setCookie(name, value, hours) {
            const date = new Date();
            date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
            document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
        }

        // Check for existing timer or create new one
        let endTime = getCookie('datasense_countdown');
        if (!endTime || endTime < new Date().getTime()) {
            // Set end time to end of week (Friday 11:59 PM)
            const now = new Date();
            const friday = new Date();
            friday.setDate(now.getDate() + (5 - now.getDay() + 7) % 7);
            friday.setHours(23, 59, 59, 999);
            endTime = friday.getTime();
            setCookie('datasense_countdown', endTime, 168); // Store for a week
        } else {
            endTime = parseInt(endTime);
        }
        
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
            
            // Format as "2d 14h 32m" for better urgency
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            if (days > 0) {
                timerElement.textContent = `${days}d ${hours}h ${minutes}m`;
            } else {
                timerElement.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            }
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

    // Enhanced Exit Intent Popup
    function initExitIntent() {
        const overlay = document.getElementById('exit-popup-overlay');
        const closeBtn = document.getElementById('exit-popup-close');
        let exitIntentShown = null;
        
        // Try to access sessionStorage (may fail on file:// protocol in some browsers)
        try {
            exitIntentShown = sessionStorage.getItem('exitIntentShown');
            console.log('SessionStorage access successful');
        } catch (e) {
            console.warn('SessionStorage not available:', e.message);
            // Fall back to a variable that will reset on page reload
            exitIntentShown = window.__exitIntentShown || null;
        }
        
        // Debug logging
        console.log('Exit intent init:', {
            overlay: !!overlay,
            closeBtn: !!closeBtn,
            exitIntentShown: exitIntentShown,
            protocol: window.location.protocol,
            url: window.location.href,
            overlayElement: overlay,
            closeBtnElement: closeBtn
        });
        
        if (!overlay) {
            console.error('Exit popup overlay element not found');
            return;
        }
        
        // Log if exit intent was previously shown but don't return early
        if (exitIntentShown) {
            console.log('Exit intent already shown in this session - listeners will still be attached');
        }
        
        // Close popup functionality
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                console.log('Exit popup close button clicked');
                overlay.style.display = 'none';
            });
        } else {
            console.warn('Exit popup close button not found');
        }
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                console.log('Exit popup overlay clicked');
                overlay.style.display = 'none';
            }
        });
        
        // Add mouse position tracking for debugging
        let lastMouseY = 0;
        document.addEventListener('mousemove', (e) => {
            lastMouseY = e.clientY;
            // Log when mouse is very close to top edge
            if (e.clientY <= 5 && e.clientY >= 0) {
                console.log(`Mouse near top edge: clientY=${e.clientY}`);
            }
        });
        
        // Desktop exit intent - mouse leave
        document.addEventListener('mouseleave', (e) => {
            // Enhanced logging for debugging
            console.log('Mouse leave detected:', { 
                clientY: e.clientY, 
                exitIntentShown: exitIntentShown,
                exitIntentShownType: typeof exitIntentShown,
                isAtTop: e.clientY <= 0,
                protocol: window.location.protocol,
                timestamp: new Date().toISOString()
            });
            
            // Check if exit intent was already shown (handle both string and boolean)
            const wasShown = exitIntentShown === 'true' || exitIntentShown === true;
            
            if (e.clientY <= 0 && !wasShown) {
                console.log('Triggering exit popup on mouse leave - conditions met');
                showExitPopup('mouse_leave');
            } else if (e.clientY <= 0 && wasShown) {
                console.log('Mouse left at top but exit intent already shown');
            } else if (e.clientY > 0) {
                console.log(`Mouse left but not at top (clientY: ${e.clientY})`);
            }
        });
        
        // Alternative method: mouseout event as fallback for file:// protocol
        document.addEventListener('mouseout', (e) => {
            // Check if mouse actually left the document
            if (e.relatedTarget === null || e.relatedTarget === undefined) {
                console.log('Mouseout detected (left document):', {
                    clientY: e.clientY,
                    lastMouseY: lastMouseY,
                    exitIntentShown: exitIntentShown,
                    relatedTarget: e.relatedTarget
                });
                
                const wasShown = exitIntentShown === 'true' || exitIntentShown === true;
                
                // Use lastMouseY if clientY is not reliable
                const effectiveY = e.clientY <= 0 ? e.clientY : lastMouseY;
                
                if (effectiveY <= 10 && !wasShown) {
                    console.log('Triggering exit popup via mouseout - conditions met');
                    showExitPopup('mouse_out');
                }
            }
        });
        
        // Mobile exit intent - detect back button or scroll up fast
        let lastScrollY = window.scrollY;
        let scrollVelocity = 0;
        let scrollTimer = null;
        
        // Enhanced scroll detection with proper velocity calculation
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            // Calculate velocity - positive value means scrolling up
            scrollVelocity = lastScrollY - currentScrollY;
            
            // Clear previous timer to debounce
            if (scrollTimer) clearTimeout(scrollTimer);
            
            scrollTimer = setTimeout(() => {
                // Check if exit intent was already shown (handle both string and boolean)
                const wasShown = exitIntentShown === 'true' || exitIntentShown === true;
                
                // Trigger on fast upward scroll near top of page on mobile devices
                if (scrollVelocity > 50 && currentScrollY < 200 && !wasShown && window.innerWidth <= 768) {
                    console.log('Mobile scroll trigger detected:', { 
                        scrollVelocity, 
                        currentScrollY, 
                        windowWidth: window.innerWidth 
                    });
                    showExitPopup('mobile_scroll');
                }
                scrollVelocity = 0; // Reset velocity after check
            }, 100); // Small debounce to avoid false positives
            
            lastScrollY = currentScrollY;
        }, { passive: true });
        
        // Enhanced mobile back button detection with popstate
        // Push initial state to enable back button detection
        if (window.innerWidth <= 768) {
            history.pushState({ page: 'initial' }, '', window.location.href);
        }
        
        window.addEventListener('popstate', (e) => {
            const wasShown = exitIntentShown === 'true' || exitIntentShown === true;
            
            if (!wasShown && window.innerWidth <= 768) {
                console.log('Mobile back button detected via popstate');
                showExitPopup('mobile_back_button');
                // Re-push state to prevent actual navigation
                setTimeout(() => {
                    history.pushState({ page: 'exit-shown' }, '', window.location.href);
                }, 100);
            }
        });
        
        // Add touch-based exit intent detection
        let touchStartY = 0;
        let touchStartTime = 0;
        
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) { // Single touch only
                touchStartY = e.touches[0].clientY;
                touchStartTime = Date.now();
            }
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            if (e.changedTouches.length === 1) { // Single touch only
                const touchEndY = e.changedTouches[0].clientY;
                const touchEndTime = Date.now();
                const swipeDistance = touchEndY - touchStartY;
                const swipeTime = touchEndTime - touchStartTime;
                const swipeVelocity = Math.abs(swipeDistance / swipeTime);
                
                const wasShown = exitIntentShown === 'true' || exitIntentShown === true;
                
                // Detect downward swipe from top of page (pull-to-refresh gesture)
                // This indicates user might want to leave
                if (swipeDistance > 100 && // Swipe down at least 100px
                    touchStartY < 50 && // Started near top
                    window.scrollY < 100 && // Page is near top
                    swipeVelocity > 0.3 && // Fast enough swipe
                    swipeTime < 500 && // Quick swipe
                    !wasShown && 
                    window.innerWidth <= 768) {
                    
                    console.log('Touch swipe exit intent detected:', {
                        swipeDistance,
                        swipeVelocity,
                        swipeTime,
                        startY: touchStartY,
                        scrollY: window.scrollY
                    });
                    showExitPopup('touch_swipe');
                }
            }
        }, { passive: true });
        
        function showExitPopup(triggerType = 'mouse_leave') {
            console.log('showExitPopup called - trigger:', triggerType);
            exitIntentShown = true;
            
            // Try to use sessionStorage, fall back to window variable
            try {
                sessionStorage.setItem('exitIntentShown', 'true');
            } catch (e) {
                console.warn('Could not save to sessionStorage:', e.message);
                window.__exitIntentShown = true;
            }
            
            overlay.style.display = 'block';
            console.log('Exit popup displayed - trigger:', triggerType);
            overlay.style.animation = 'fadeIn 0.3s ease-out';
            const popup = document.getElementById('exit-popup');
            if (popup) {
                popup.style.animation = 'slideUp 0.4s ease-out';
            }
            window.DataSenseTracking.trackEvent('exit_intent_shown', {
                trigger_type: triggerType
            });
        }
        
        // Add keyboard trigger for local testing (Escape key)
        document.addEventListener('keydown', (e) => {
            const wasShown = exitIntentShown === 'true' || exitIntentShown === true;
            
            if (e.key === 'Escape' && window.location.protocol === 'file:' && !wasShown) {
                console.log('Escape key trigger for exit popup (file:// protocol)');
                showExitPopup('escape_key');
            }
        });
        
        // Add visibility change trigger as fallback
        document.addEventListener('visibilitychange', () => {
            const wasShown = exitIntentShown === 'true' || exitIntentShown === true;
            
            if (document.visibilityState === 'hidden' && !wasShown) {
                // Store intent to show popup when user returns
                try {
                    sessionStorage.setItem('showOnReturn', 'true');
                } catch (e) {
                    window.__showOnReturn = true;
                }
                console.log('Tab hidden - will show popup on return');
            } else if (document.visibilityState === 'visible') {
                // Check if we should show popup on return
                let shouldShow = false;
                try {
                    shouldShow = sessionStorage.getItem('showOnReturn') === 'true';
                    if (shouldShow) {
                        sessionStorage.removeItem('showOnReturn');
                    }
                } catch (e) {
                    shouldShow = window.__showOnReturn === true;
                    if (shouldShow) {
                        window.__showOnReturn = false;
                    }
                }
                
                if (shouldShow && !wasShown) {
                    console.log('Tab visible again - showing exit popup');
                    showExitPopup('tab_visibility');
                }
            }
        });
        
        // FALLBACK TRIGGER 1: Time-based trigger (30 seconds of inactivity)
        let inactivityTimer;
        function resetInactivityTimer() {
            clearTimeout(inactivityTimer);
            const wasShown = exitIntentShown === 'true' || exitIntentShown === true;
            
            if (!wasShown && document.visibilityState === 'visible') {
                inactivityTimer = setTimeout(() => {
                    const stillNotShown = exitIntentShown !== 'true' && exitIntentShown !== true;
                    if (stillNotShown && document.visibilityState === 'visible') {
                        console.log('Inactivity trigger: 30 seconds of inactivity detected');
                        showExitPopup('inactivity_30s');
                    }
                }, 30000); // 30 seconds
            }
        }
        
        // Reset timer on user activity
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, resetInactivityTimer, true);
        });
        
        // Start the timer initially
        resetInactivityTimer();
        
        // FALLBACK TRIGGER 2: Scroll depth trigger (70% of page)
        let scrollDepthTriggered = false;
        window.addEventListener('scroll', () => {
            if (scrollDepthTriggered) return;
            
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            const wasShown = exitIntentShown === 'true' || exitIntentShown === true;
            
            if (scrollPercent > 70 && !wasShown) {
                scrollDepthTriggered = true;
                console.log('Scroll depth trigger: ' + scrollPercent.toFixed(1) + '% of page scrolled');
                showExitPopup('scroll_depth_70');
            }
        }, { passive: true });
        
        // FALLBACK TRIGGER 3: Form abandonment trigger (email field focus then blur)
        const emailInputs = document.querySelectorAll('input[type="email"]');
        emailInputs.forEach(emailInput => {
            let formInteracted = false;
            let blurTimeout = null;
            
            emailInput.addEventListener('focus', () => {
                formInteracted = true;
                // Clear any pending blur timeout
                if (blurTimeout) {
                    clearTimeout(blurTimeout);
                    blurTimeout = null;
                }
            });
            
            emailInput.addEventListener('blur', () => {
                const wasShown = exitIntentShown === 'true' || exitIntentShown === true;
                
                if (formInteracted && !emailInput.value && !wasShown) {
                    // Wait 3 seconds after blur to trigger
                    blurTimeout = setTimeout(() => {
                        const stillNotShown = exitIntentShown !== 'true' && exitIntentShown !== true;
                        if (stillNotShown && !emailInput.value) {
                            console.log('Form abandonment trigger: Email field abandoned');
                            showExitPopup('form_abandonment');
                        }
                    }, 3000);
                }
            });
            
            // If user starts typing, cancel the abandonment trigger
            emailInput.addEventListener('input', () => {
                if (blurTimeout) {
                    clearTimeout(blurTimeout);
                    blurTimeout = null;
                }
            });
        });
        
        // Add debug test button for file:// protocol only
        if (window.location.protocol === 'file:') {
            console.log('Adding test button for exit popup (file:// protocol detected)');
            const testButton = document.createElement('button');
            testButton.id = 'test-exit-popup-btn';
            testButton.textContent = 'Test Exit Popup';
            testButton.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                background-color: #dc2626;
                color: white;
                padding: 12px 24px;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 14px;
                cursor: pointer;
                box-shadow: 0 4px 6px rgba(220, 38, 38, 0.3);
                transition: all 0.3s ease;
            `;
            
            testButton.addEventListener('mouseover', () => {
                testButton.style.backgroundColor = '#b91c1c';
                testButton.style.transform = 'scale(1.05)';
            });
            
            testButton.addEventListener('mouseout', () => {
                testButton.style.backgroundColor = '#dc2626';
                testButton.style.transform = 'scale(1)';
            });
            
            testButton.addEventListener('click', () => {
                console.log('Test button clicked - triggering exit popup');
                exitIntentShown = false; // Reset flag to allow testing multiple times
                showExitPopup('test_button');
            });
            
            document.body.appendChild(testButton);
            console.log('Test button added to page');
            
            // Add helpful instructions for file:// protocol
            console.log('%c📋 Exit Intent Testing Instructions (file:// protocol)', 'color: #4CAF50; font-weight: bold; font-size: 14px');
            console.log('%c1. Press Escape key to trigger the exit popup', 'color: #2196F3');
            console.log('%c2. Switch tabs and return to trigger the popup', 'color: #2196F3');
            console.log('%c3. Click the red "Test Exit Popup" button', 'color: #2196F3');
            console.log('%c4. Try moving mouse to top of window (may not work on file://)', 'color: #FF9800');
        }
        
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

    // Enhanced Mobile Sticky CTA with Smart Scroll Trigger
    function initMobileStickyButton() {
        const stickyBtn = document.getElementById('mobile-sticky-cta');
        const heroSection = document.querySelector('.hero');
        const signupSection = document.getElementById('beta-signup');
        
        if (!stickyBtn || !heroSection) return;
        
        let isVisible = false;
        let lastScrollY = window.scrollY;
        
        // Hide initially
        stickyBtn.style.transform = 'translateY(100%)';
        stickyBtn.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // Use Intersection Observer for hero visibility
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const heroOut = !entry.isIntersecting;
                updateStickyButton(heroOut);
            });
        }, {
            threshold: 0.1,
            rootMargin: '-100px 0px 0px 0px'
        });
        
        // Hide when signup form is in view
        const signupObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    hideStickyButton();
                }
            });
        }, {
            threshold: 0.3
        });
        
        function updateStickyButton(shouldShow) {
            if (window.innerWidth > 768) {
                hideStickyButton();
                return;
            }
            
            if (shouldShow && !isVisible) {
                showStickyButton();
            } else if (!shouldShow && isVisible) {
                hideStickyButton();
            }
        }
        
        function showStickyButton() {
            isVisible = true;
            stickyBtn.style.transform = 'translateY(0)';
            stickyBtn.style.opacity = '1';
            
            // Add entrance animation
            const button = stickyBtn.querySelector('.btn');
            if (button) {
                button.style.animation = 'slideUp 0.5s ease-out';
            }
        }
        
        function hideStickyButton() {
            isVisible = false;
            stickyBtn.style.transform = 'translateY(100%)';
            stickyBtn.style.opacity = '0';
        }
        
        // Smart scroll detection - hide on scroll down, show on scroll up
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) clearTimeout(scrollTimeout);
            
            scrollTimeout = setTimeout(() => {
                const currentScrollY = window.scrollY;
                const scrollingUp = currentScrollY < lastScrollY;
                const scrollingDown = currentScrollY > lastScrollY;
                
                // Only apply smart scroll if not in hero or signup sections
                const heroRect = heroSection.getBoundingClientRect();
                const signupRect = signupSection ? signupSection.getBoundingClientRect() : null;
                const heroVisible = heroRect.bottom > 0;
                const signupVisible = signupRect && signupRect.top < window.innerHeight;
                
                if (!heroVisible && !signupVisible && window.innerWidth <= 768) {
                    if (scrollingUp && currentScrollY > 500) {
                        showStickyButton();
                    } else if (scrollingDown) {
                        hideStickyButton();
                    }
                }
                
                lastScrollY = currentScrollY;
            }, 50);
        }, { passive: true });
        
        // Start observing
        heroObserver.observe(heroSection);
        if (signupSection) {
            signupObserver.observe(signupSection);
        }
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                hideStickyButton();
            }
        });
    }

    // Enhanced Counting Animation
    function initCountingAnimation() {
        const statNumbers = document.querySelectorAll('.stat-number, .roi-number');
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };
        
        const countUp = (element, target, suffix = '', prefix = '', decimals = 0) => {
            let current = 0;
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 50);
            const startTime = Date.now();
            
            const timer = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function for smooth animation
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                current = target * easeOutQuart;
                
                if (progress >= 1) {
                    current = target;
                    clearInterval(timer);
                }
                
                const displayValue = decimals > 0 ? current.toFixed(decimals) : Math.round(current);
                element.textContent = prefix + displayValue + suffix;
                element.style.transform = 'scale(1.05)';
                element.style.transition = 'transform 0.3s ease';
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                }, 100);
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
                    } else if (text === '3.2x') {
                        countUp(entry.target, 3.2, 'x', '', 1);
                    } else if (text === '47%') {
                        countUp(entry.target, 47, '%');
                    } else if (text === '$52k') {
                        countUp(entry.target, 52, 'k', '$');
                    }
                }
            });
        }, observerOptions);
        
        statNumbers.forEach(stat => observer.observe(stat));
    }

    // Enhanced Parallax Effect
    function initParallaxEffect() {
        const heroVisual = document.querySelector('.hero-visual');
        const mockup = document.querySelector('.dashboard-mockup');
        const heroStats = document.querySelector('.hero-stats');
        const heroBadge = document.querySelector('.hero-badge');
        
        if (!heroVisual) return;
        
        let ticking = false;
        
        function updateParallax() {
            const scrolled = window.pageYOffset;
            const windowHeight = window.innerHeight;
            const heroHeight = document.querySelector('.hero').offsetHeight;
            
            // Only apply parallax when hero is in view
            if (scrolled < heroHeight) {
                // Different speeds for different elements
                const visualSpeed = 0.5;
                const mockupSpeed = 0.3;
                const statsSpeed = 0.2;
                const badgeSpeed = 0.1;
                
                // Apply transforms
                if (heroVisual) {
                    const yPos = -(scrolled * visualSpeed);
                    heroVisual.style.transform = `translateY(${yPos}px)`;
                }
                
                if (mockup) {
                    const rotation = scrolled * 0.02;
                    const scale = 1 - (scrolled * 0.0002);
                    mockup.style.transform = `translateY(${-(scrolled * mockupSpeed)}px) rotateX(${rotation}deg) scale(${scale})`;
                }
                
                if (heroStats) {
                    heroStats.style.transform = `translateY(${-(scrolled * statsSpeed)}px)`;
                    heroStats.style.opacity = 1 - (scrolled / heroHeight);
                }
                
                if (heroBadge) {
                    heroBadge.style.transform = `translateY(${-(scrolled * badgeSpeed)}px)`;
                }
            }
            
            ticking = false;
        }
        
        // Initial call
        updateParallax();
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
    }

    // Enhanced Form Submission with Progress Bar Animation
    function enhanceFormSubmission() {
        const form = document.getElementById('beta-form');
        if (!form) return;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = form.querySelector('input[name="email"]').value;
            
            // Validate email
            if (!window.DataSenseTracking.validateEmail(email)) {
                showFormError('Please enter a valid email address');
                return;
            }
            
            // Show progress indicator with animation
            const progressDiv = document.getElementById('form-progress');
            const progressBar = progressDiv?.querySelector('.progress-bar');
            const progressText = progressDiv?.querySelector('.progress-text');
            const submitButton = form.querySelector('button[type="submit"]');
            
            if (progressDiv) {
                progressDiv.style.display = 'block';
                progressDiv.style.opacity = '0';
                progressDiv.style.animation = 'fadeIn 0.3s ease-out forwards';
                
                // Animate progress bar
                if (progressBar) {
                    progressBar.style.width = '0%';
                    progressBar.style.transition = 'width 1.5s ease-out';
                    setTimeout(() => {
                        progressBar.style.width = '100%';
                    }, 100);
                }
                
                // Update progress text
                const messages = [
                    'Validating email...',
                    'Creating your account...',
                    'Setting up dashboard...',
                    'Almost ready...'
                ];
                
                let messageIndex = 0;
                const messageInterval = setInterval(() => {
                    if (messageIndex < messages.length && progressText) {
                        progressText.textContent = messages[messageIndex];
                        messageIndex++;
                    } else {
                        clearInterval(messageInterval);
                    }
                }, 400);
            }
            
            // Disable submit button
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = '<span>Processing...</span>';
            }
            
            // Simulate API call
            setTimeout(() => {
                showSuccessMessage(form);
                window.DataSenseTracking.trackEvent('conversion', {
                    conversion_type: 'beta_signup',
                    email: email
                });
            }, 2000);
        });
    }
    
    function showFormError(message) {
        const existingError = document.querySelector('.form-error');
        if (existingError) existingError.remove();
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.textContent = message;
        errorDiv.style.animation = 'shake 0.5s ease-out';
        
        const form = document.getElementById('beta-form');
        form.appendChild(errorDiv);
        
        setTimeout(() => errorDiv.remove(), 5000);
    }
    
    function showSuccessMessage(form) {
        form.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            form.innerHTML = `
                <div class="form-success" style="text-align: center; padding: 40px 20px; animation: fadeIn 0.5s ease-out;">
                    <div style="font-size: 48px; margin-bottom: 16px; animation: bounce 0.5s ease-out;">🎉</div>
                    <h3 style="font-size: 24px; font-weight: 600; margin-bottom: 12px; color: white;">
                        Welcome to DataSense Beta!
                    </h3>
                    <p style="font-size: 16px; color: rgba(255, 255, 255, 0.8); margin: 0;">
                        Check your email for next steps. We'll be in touch within 24 hours.
                    </p>
                </div>
            `;
        }, 300);
    }

    // Live Product Demo Iframe Handler
    function initLiveProductDemo() {
        const iframe = document.getElementById('snapclass-demo-iframe');
        const loadingDiv = document.querySelector('.iframe-loading');
        
        if (iframe) {
            let loadTimeout;
            
            // Set a timeout for loading
            loadTimeout = setTimeout(function() {
                if (loadingDiv) {
                    loadingDiv.innerHTML = `
                        <p style="color: #ef4444; font-size: 18px; font-weight: 600;">Demo Temporarily Unavailable</p>
                        <p style="color: #64748b; margin-top: 10px; font-size: 14px;">The live demo cannot be embedded at this time.</p>
                        <a href="https://app.snapclass.ai" target="_blank" class="btn btn-primary" style="margin-top: 20px; display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
                            Open SnapClass.ai in New Tab
                        </a>
                    `;
                }
            }, 10000); // 10 second timeout
            
            // Hide loading spinner when iframe loads successfully
            iframe.addEventListener('load', function() {
                clearTimeout(loadTimeout);
                if (loadingDiv) {
                    loadingDiv.style.display = 'none';
                }
                
                // Check if we got redirected to login
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    // This will fail due to cross-origin but that's OK
                } catch(e) {
                    console.log('Iframe loaded but cross-origin restrictions apply');
                }
                
                // Track successful demo load
                window.DataSenseTracking.trackEvent('demo_loaded', {
                    demo_type: 'live_product',
                    load_time: Date.now()
                });
            });
            
            // Handle iframe error
            iframe.addEventListener('error', function() {
                clearTimeout(loadTimeout);
                if (loadingDiv) {
                    loadingDiv.innerHTML = `
                        <p style="color: #ef4444; font-size: 18px; font-weight: 600;">Unable to Load Demo</p>
                        <p style="color: #64748b; margin-top: 10px; font-size: 14px;">Please try opening the demo directly.</p>
                        <a href="https://app.snapclass.ai" target="_blank" class="btn btn-secondary" style="margin-top: 20px; display: inline-block; padding: 12px 24px; background: #64748b; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
                            Open in New Tab
                        </a>
                    `;
                }
                
                // Track demo error
                window.DataSenseTracking.trackEvent('demo_error', {
                    demo_type: 'live_product',
                    error_time: Date.now()
                });
            });
        }
    }

    // Copy to clipboard functionality
    function copyToClipboard(elementId, buttonElement) {
        const input = document.getElementById(elementId);
        
        if (!input) return;
        
        // Select the text
        input.select();
        input.setSelectionRange(0, 99999); // For mobile devices
        
        // Copy the text
        try {
            navigator.clipboard.writeText(input.value).then(function() {
                // Success - update button
                buttonElement.classList.add('copied');
                
                // Track copy event
                window.DataSenseTracking.trackEvent('credential_copied', {
                    credential_type: elementId.includes('email') ? 'email' : 'password',
                    timestamp: Date.now()
                });
                
                // Reset button after 2 seconds
                setTimeout(function() {
                    buttonElement.classList.remove('copied');
                }, 2000);
            }).catch(function(err) {
                // Fallback for older browsers
                try {
                    document.execCommand('copy');
                    buttonElement.classList.add('copied');
                    setTimeout(function() {
                        buttonElement.classList.remove('copied');
                    }, 2000);
                } catch (e) {
                    console.error('Failed to copy:', e);
                }
            });
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }
    
    // Make copyToClipboard globally available
    window.copyToClipboard = copyToClipboard;
    
    // Initialize everything when DOM is ready
    function init() {
        console.log('Main init() function called');
        console.log('Current protocol:', window.location.protocol);
        console.log('Document readyState:', document.readyState);
        
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
        console.log('About to call initExitIntent()');
        initExitIntent();
        initMobileStickyButton();
        initCountingAnimation();
        initParallaxEffect();
        initLiveProductDemo(); // Added iframe handler
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();