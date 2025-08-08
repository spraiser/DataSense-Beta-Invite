// DataSense Beta Landing Page JavaScript
(function() {
    'use strict';

    // Enhanced Analytics and tracking functions
    window.DataSenseTracking = {
        // Initialize tracking with user properties
        init: function() {
            this.sessionId = this.generateSessionId();
            this.startTime = Date.now();
            this.pageDepth = 0;
            this.engagementScore = 0;
            
            // Set user properties
            if (typeof gtag !== 'undefined') {
                gtag('config', 'GA_MEASUREMENT_ID', {
                    custom_map: {
                        'session_id': this.sessionId,
                        'page_type': 'landing_page',
                        'audience': 'small_business'
                    }
                });
            }
        },

        // Generate unique session ID
        generateSessionId: function() {
            return 'ds_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        },

        // Track page interactions with enhanced data
        trackInteraction: function(action, element, value, additionalData = {}) {
            this.engagementScore += (value || 1);
            
            const eventData = {
                event_category: 'engagement',
                event_label: element,
                value: value || 1,
                session_id: this.sessionId,
                engagement_score: this.engagementScore,
                time_on_page: Math.round((Date.now() - this.startTime) / 1000),
                ...additionalData
            };
            
            // Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', action, eventData);
            }
            
            // Facebook Pixel
            if (typeof fbq !== 'undefined') {
                fbq('trackCustom', action, {
                    element: element,
                    value: value,
                    session_id: this.sessionId
                });
            }
            
            console.log('Tracked:', action, eventData);
        },

        // Enhanced scroll depth tracking
        trackScrollDepth: function(percentage) {
            this.pageDepth = Math.max(this.pageDepth, percentage);
            
            const eventData = {
                event_category: 'engagement',
                event_label: percentage + '%',
                value: percentage,
                session_id: this.sessionId,
                max_scroll_depth: this.pageDepth
            };
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'scroll_depth', eventData);
            }
            
            // Track milestone scroll depths
            if ([25, 50, 75, 90].includes(percentage)) {
                this.trackInteraction('scroll_milestone', 'depth_' + percentage, percentage);
            }
        },

        // Enhanced form tracking
        trackFormEvent: function(action, formName, fieldName, additionalData = {}) {
            const eventData = {
                event_category: 'form',
                event_label: formName + '_' + fieldName,
                session_id: this.sessionId,
                form_name: formName,
                field_name: fieldName,
                ...additionalData
            };
            
            if (typeof gtag !== 'undefined') {
                gtag('event', action, eventData);
            }
            
            if (typeof fbq !== 'undefined') {
                fbq('trackCustom', 'FormInteraction', {
                    action: action,
                    form: formName,
                    field: fieldName
                });
            }
        },

        // Enhanced conversion tracking
        trackConversion: function(conversionType, value, userData = {}) {
            const conversionData = {
                event_category: 'conversion',
                event_label: conversionType,
                value: value || 1,
                currency: 'USD',
                session_id: this.sessionId,
                time_to_conversion: Math.round((Date.now() - this.startTime) / 1000),
                engagement_score: this.engagementScore,
                max_scroll_depth: this.pageDepth,
                ...userData
            };
            
            // Google Analytics conversion
            if (typeof gtag !== 'undefined') {
                gtag('event', 'conversion', conversionData);
                gtag('event', 'generate_lead', {
                    currency: 'USD',
                    value: value || 1
                });
            }
            
            // Facebook Pixel conversion
            if (typeof fbq !== 'undefined') {
                fbq('track', 'Lead', {
                    value: value || 1,
                    currency: 'USD',
                    content_name: 'DataSense Beta Signup'
                });
            }
            
            // Send conversion data to server for lead scoring
            this.sendConversionToServer(conversionData);
        },

        // Track user journey and behavior patterns
        trackUserJourney: function(step, data = {}) {
            const journeyData = {
                event_category: 'user_journey',
                event_label: step,
                session_id: this.sessionId,
                timestamp: Date.now(),
                ...data
            };
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'user_journey_step', journeyData);
            }
        },

        // Track section engagement time
        trackSectionEngagement: function(sectionId, timeSpent) {
            this.trackInteraction('section_engagement', sectionId, timeSpent, {
                engagement_type: 'time_spent',
                section_id: sectionId
            });
        },

        // Track CTA performance
        trackCTAPerformance: function(ctaLocation, ctaText, action = 'click') {
            this.trackInteraction('cta_' + action, ctaLocation, 1, {
                cta_text: ctaText,
                cta_location: ctaLocation
            });
        },

        // Send conversion data to server for lead management
        sendConversionToServer: function(conversionData) {
            // This would integrate with your lead management system
            fetch('/api/conversions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(conversionData)
            }).catch(error => {
                console.log('Conversion tracking error:', error);
            });
        },

        // Track campaign attribution
        trackCampaignAttribution: function() {
            const urlParams = new URLSearchParams(window.location.search);
            const attribution = {
                utm_source: urlParams.get('utm_source') || 'direct',
                utm_medium: urlParams.get('utm_medium') || 'none',
                utm_campaign: urlParams.get('utm_campaign') || 'none',
                utm_term: urlParams.get('utm_term') || '',
                utm_content: urlParams.get('utm_content') || '',
                referrer: document.referrer || 'direct',
                landing_page: window.location.pathname
            };
            
            // Store attribution data
            Object.keys(attribution).forEach(key => {
                sessionStorage.setItem(key, attribution[key]);
            });
            
            // Track attribution
            this.trackInteraction('campaign_attribution', 'page_view', 1, attribution);
            
            return attribution;
        },

        // Generate comprehensive analytics report
        generateAnalyticsReport: function() {
            return {
                session_id: this.sessionId,
                time_on_page: Math.round((Date.now() - this.startTime) / 1000),
                engagement_score: this.engagementScore,
                max_scroll_depth: this.pageDepth,
                attribution: this.trackCampaignAttribution(),
                user_agent: navigator.userAgent,
                screen_resolution: screen.width + 'x' + screen.height,
                viewport_size: window.innerWidth + 'x' + window.innerHeight,
                timestamp: new Date().toISOString()
            };
        }
    };

    // Scroll depth tracking
    let scrollDepthMarkers = [25, 50, 75, 90];
    let scrollDepthTracked = [];

    function trackScrollDepth() {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        
        scrollDepthMarkers.forEach(function(marker) {
            if (scrollPercent >= marker && scrollDepthTracked.indexOf(marker) === -1) {
                scrollDepthTracked.push(marker);
                window.DataSenseTracking.trackScrollDepth(marker);
            }
        });
    }

    // Throttled scroll handler
    let scrollTimeout;
    function handleScroll() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(trackScrollDepth, 100);
    }

    // Section visibility tracking
    function trackSectionViews() {
        const sections = document.querySelectorAll('section[id]');
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    window.DataSenseTracking.trackInteraction('section_view', entry.target.id, 1);
                }
            });
        }, {
            threshold: 0.5
        });

        sections.forEach(function(section) {
            observer.observe(section);
        });
    }

    // UTM parameter capture
    function captureUTMParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const utmParams = {};
        
        ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(function(param) {
            const value = urlParams.get(param);
            if (value) {
                utmParams[param] = value;
                // Store in sessionStorage for form submission
                sessionStorage.setItem(param, value);
            }
        });

        // Track referrer
        if (document.referrer) {
            sessionStorage.setItem('referrer', document.referrer);
        }

        return utmParams;
    }

    // Initialize comprehensive tracking on page load
    function initializeTracking() {
        // Initialize tracking system
        window.DataSenseTracking.init();
        
        // Track campaign attribution
        window.DataSenseTracking.trackCampaignAttribution();
        
        // Track initial page view
        window.DataSenseTracking.trackInteraction('page_view', 'landing_page', 1, {
            page_title: document.title,
            page_url: window.location.href
        });
        
        // Track user journey start
        window.DataSenseTracking.trackUserJourney('landing_page_view');
        
        // Set up enhanced scroll tracking
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Set up section visibility tracking with engagement time
        if ('IntersectionObserver' in window) {
            trackSectionViews();
            trackSectionEngagementTime();
        }
        
        // Track page abandonment and session data
        window.addEventListener('beforeunload', function() {
            const analyticsReport = window.DataSenseTracking.generateAnalyticsReport();
            
            // Send final analytics data
            navigator.sendBeacon('/api/analytics', JSON.stringify(analyticsReport));
            
            // Track session end
            window.DataSenseTracking.trackInteraction('session_end', 'page_unload', analyticsReport.time_on_page);
        });
        
        // Track page visibility changes
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                window.DataSenseTracking.trackInteraction('page_hidden', 'visibility_change', 1);
            } else {
                window.DataSenseTracking.trackInteraction('page_visible', 'visibility_change', 1);
            }
        });
        
        // Track clicks on all interactive elements
        document.addEventListener('click', function(e) {
            const element = e.target.closest('a, button, .btn, .proof-card, .team-card');
            if (element) {
                const elementType = element.tagName.toLowerCase();
                const elementClass = element.className;
                const elementText = element.textContent.trim().substring(0, 50);
                
                window.DataSenseTracking.trackInteraction('element_click', elementType, 1, {
                    element_class: elementClass,
                    element_text: elementText,
                    click_position: e.clientX + ',' + e.clientY
                });
            }
        });
    }

    // Form validation helpers (will be expanded in task 6)
    window.DataSenseForm = {
        validateEmail: function(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        validateRequired: function(value) {
            return value && value.trim().length > 0;
        },

        showError: function(field, message) {
            // Remove existing error
            const existingError = field.parentNode.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }

            // Add new error
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            errorDiv.style.color = '#dc2626';
            errorDiv.style.fontSize = '0.875rem';
            errorDiv.style.marginTop = '0.25rem';
            
            field.parentNode.appendChild(errorDiv);
            field.style.borderColor = '#dc2626';
        },

        clearError: function(field) {
            const existingError = field.parentNode.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
            field.style.borderColor = '#e5e7eb';
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeTracking);
    } else {
        initializeTracking();
    }

})();    // 
Form handling functionality
    window.DataSenseForm = window.DataSenseForm || {};
    
    // Enhanced form validation
    Object.assign(window.DataSenseForm, {
        validateForm: function(form) {
            let isValid = true;
            const formData = new FormData(form);
            
            // Clear previous errors
            form.querySelectorAll('.error-message').forEach(error => error.remove());
            form.querySelectorAll('.form-group').forEach(group => group.classList.remove('error'));
            
            // Validate required fields
            const requiredFields = [
                { name: 'email', label: 'Email Address' }
            ];
            
            requiredFields.forEach(field => {
                const value = formData.get(field.name);
                const input = form.querySelector(`[name="${field.name}"]`);
                
                if (!this.validateRequired(value)) {
                    this.showError(input, `${field.label} is required`);
                    isValid = false;
                }
            });
            
            // Validate email format
            const email = formData.get('email');
            const emailInput = form.querySelector('[name="email"]');
            if (email && !this.validateEmail(email)) {
                this.showError(emailInput, 'Please enter a valid email address');
                isValid = false;
            }
            
            return isValid;
        },
        
        showError: function(field, message) {
            // Remove existing error
            const existingError = field.parentNode.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
            
            // Add error class to form group
            field.parentNode.classList.add('error');
            
            // Add new error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            
            field.parentNode.appendChild(errorDiv);
        },
        
        clearError: function(field) {
            const existingError = field.parentNode.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
            field.parentNode.classList.remove('error');
        },
        
        submitForm: function(form) {
            const formData = new FormData(form);
            const submitButton = form.querySelector('.signup-btn');
            
            // Add loading state
            submitButton.classList.add('loading');
            submitButton.disabled = true;
            
            // Collect form data
            const data = {
                email: formData.get('email'),
                // Add tracking data
                utmSource: sessionStorage.getItem('utm_source') || '',
                utmMedium: sessionStorage.getItem('utm_medium') || '',
                utmCampaign: sessionStorage.getItem('utm_campaign') || '',
                referrer: sessionStorage.getItem('referrer') || '',
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                pageUrl: window.location.href
            };
            
            // Track form submission
            window.DataSenseTracking.trackFormEvent('form_submit', 'beta_signup', 'submit');
            
            // Simulate form submission (replace with actual endpoint)
            this.submitToServer(data)
                .then(response => {
                    // Remove loading state
                    submitButton.classList.remove('loading');
                    submitButton.disabled = false;
                    
                    // Track conversion
                    window.DataSenseTracking.trackConversion('beta_signup', 1);
                    
                    // Send confirmation email
                    this.sendConfirmationEmail(data);
                    
                    // Show success message
                    this.showSuccessMessage(form);
                    
                    console.log('Form submitted successfully:', response);
                })
                .catch(error => {
                    // Remove loading state
                    submitButton.classList.remove('loading');
                    submitButton.disabled = false;
                    
                    // Show error message
                    this.showErrorMessage(form, error);
                    
                    console.error('Form submission error:', error);
                });
        },
        
        showSuccessMessage: function(form) {
            // Replace form with success message
            form.innerHTML = `
                <div class="success-message">
                    <div class="success-icon">🎉</div>
                    <h3>You're in! Welcome to the DataSense beta.</h3>
                    <p>Check your email for a welcome message. We'll follow up within 24 hours to learn about your specific needs and get you set up.</p>
                </div>
            `;
            
            // Also show detailed confirmation modal
            this.showConfirmationModal();
        },
        
        showConfirmationModal: function() {
            // Create modal if it doesn't exist
            let modal = document.getElementById('confirmation-modal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'confirmation-modal';
                modal.className = 'confirmation-modal';
                modal.innerHTML = `
                    <div class="modal-content">
                        <div class="modal-icon">🚀</div>
                        <h3>Welcome to the DataSense Beta!</h3>
                        <p>You're now part of an exclusive group of forward-thinking business owners who are transforming how they use data.</p>
                        
                        <div class="modal-details">
                            <h4>What happens next:</h4>
                            <ul>
                                <li>You'll receive a welcome email within 10 minutes</li>
                                <li>Our team will contact you within 24 hours</li>
                                <li>We'll schedule a 15-minute setup call</li>
                                <li>You'll be analyzing your data within hours</li>
                            </ul>
                        </div>
                        
                        <button class="modal-close" onclick="DataSenseForm.closeConfirmationModal()">
                            Got it, thanks!
                        </button>
                    </div>
                `;
                document.body.appendChild(modal);
            }
            
            // Show modal with animation
            setTimeout(() => {
                modal.classList.add('show');
            }, 100);
            
            // Auto-close after 10 seconds
            setTimeout(() => {
                this.closeConfirmationModal();
            }, 10000);
        },
        
        closeConfirmationModal: function() {
            const modal = document.getElementById('confirmation-modal');
            if (modal) {
                modal.classList.remove('show');
                setTimeout(() => {
                    if (modal.parentNode) {
                        modal.parentNode.removeChild(modal);
                    }
                }, 300);
            }
        },
        
        sendConfirmationEmail: function(userData) {
            // Add to email marketing platform
            return window.DataSenseCRM.addToEmailList(userData)
                .then(response => {
                    // Calculate lead score and trigger appropriate sequence
                    const leadScore = window.DataSenseCRM.calculateLeadScore(userData);
                    
                    // Trigger email sequence based on lead score
                    window.DataSenseCRM.triggerEmailSequence(userData, 'beta-welcome');
                    
                    // Sync to CRM
                    window.DataSenseCRM.syncToCRM(userData);
                    
                    // Notify team for high-value leads
                    window.DataSenseCRM.notifyTeam(userData);
                    
                    // Track email integration success
                    window.DataSenseTracking.trackInteraction('email_integration', 'success', 1, {
                        lead_score: leadScore,
                        email_provider: 'mailchimp' // or your configured provider
                    });
                    
                    console.log('Email integration completed:', {
                        email_added: true,
                        lead_score: leadScore,
                        sequence_triggered: true
                    });
                    
                    return response;
                })
                .catch(error => {
                    // Fallback: still send basic confirmation
                    console.error('Email integration error:', error);
                    
                    // Track integration failure
                    window.DataSenseTracking.trackInteraction('email_integration', 'error', 1, {
                        error_message: error.message
                    });
                    
                    // Send basic confirmation email via backup method
                    return this.sendBasicConfirmationEmail(userData);
                });
        },
        
        sendBasicConfirmationEmail: function(userData) {
            // Fallback email sending via simple webhook
            const emailData = {
                to: userData.email,
                subject: 'Welcome to DataSense Beta - You\'re In!',
                html: window.DataSenseEmails.generateWelcomeEmail(userData),
                from: 'hello@datasense.com',
                reply_to: 'hello@datasense.com'
            };
            
            return fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(emailData)
            })
            .then(response => response.json())
            .then(data => {
                window.DataSenseTracking.trackInteraction('email_sent', 'fallback_confirmation', 1);
                return data;
            });
        }
    });
    
    // Initialize form when DOM is ready
    function initializeForm() {
        const form = document.getElementById('beta-signup-form');
        if (!form) return;
        
        // Track form interactions
        form.addEventListener('focusin', function(e) {
            if (e.target.matches('input, select, textarea')) {
                window.DataSenseTracking.trackFormEvent('field_focus', 'beta_signup', e.target.name);
            }
        });
        
        // Clear errors on input
        form.addEventListener('input', function(e) {
            if (e.target.matches('input, select, textarea')) {
                window.DataSenseForm.clearError(e.target);
            }
        });
        
        // Handle form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (window.DataSenseForm.validateForm(form)) {
                window.DataSenseForm.submitForm(form);
            } else {
                window.DataSenseTracking.trackFormEvent('validation_error', 'beta_signup', 'submit');
            }
        });
    }
    
    // Add form initialization to existing DOMContentLoaded handler
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initializeTracking();
            initializeForm();
        });
    } else {
        initializeTracking();
        initializeForm();
    }        

        submitToServer: function(data) {
            // This would be your actual API endpoint
            // For now, we'll simulate a server request
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    // Simulate 95% success rate
                    if (Math.random() > 0.05) {
                        resolve({
                            success: true,
                            message: 'Beta signup successful',
                            data: data
                        });
                    } else {
                        reject(new Error('Server temporarily unavailable. Please try again.'));
                    }
                }, 1500);
            });
        },
        
        showErrorMessage: function(form, error) {
            // Create error message element
            const errorDiv = document.createElement('div');
            errorDiv.className = 'form-error-message';
            errorDiv.innerHTML = `
                <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; text-align: center;">
                    <p style="color: #dc2626; margin: 0; font-weight: 500;">
                        ${error.message || 'Something went wrong. Please try again or contact us directly.'}
                    </p>
                    <p style="color: #6b7280; margin: 0.5rem 0 0 0; font-size: 0.875rem;">
                        Need help? Email us at <a href="mailto:beta@datasense.com" style="color: #2563eb;">beta@datasense.com</a>
                    </p>
                </div>
            `;
            
            // Insert error message at the top of the form
            form.insertBefore(errorDiv, form.firstChild);
            
            // Remove error message after 10 seconds
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.parentNode.removeChild(errorDiv);
                }
            }, 10000);
            
            // Track error
            window.DataSenseTracking.trackInteraction('form_error', 'beta_signup', 1);
        } 
   // Mobile-specific enhancements
    function initializeMobileOptimizations() {
        // Detect mobile device
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        if (isMobile || isTouch) {
            document.body.classList.add('mobile-device');
            
            // Optimize form inputs for mobile
            optimizeFormInputs();
            
            // Add touch-friendly interactions
            addTouchInteractions();
            
            // Optimize scrolling performance
            optimizeScrolling();
            
            // Handle orientation changes
            handleOrientationChange();
        }
    }
    
    function optimizeFormInputs() {
        const inputs = document.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            // Prevent zoom on iOS when focusing inputs
            if (input.type !== 'range' && input.type !== 'checkbox' && input.type !== 'radio') {
                input.style.fontSize = '16px';
            }
            
            // Add appropriate input modes for mobile keyboards
            if (input.type === 'email') {
                input.setAttribute('inputmode', 'email');
            } else if (input.name === 'companyName' || input.name === 'firstName' || input.name === 'lastName') {
                input.setAttribute('inputmode', 'text');
                input.setAttribute('autocapitalize', 'words');
            }
            
            // Improve autocomplete
            if (input.name === 'firstName') {
                input.setAttribute('autocomplete', 'given-name');
            } else if (input.name === 'lastName') {
                input.setAttribute('autocomplete', 'family-name');
            } else if (input.name === 'email') {
                input.setAttribute('autocomplete', 'email');
            } else if (input.name === 'companyName') {
                input.setAttribute('autocomplete', 'organization');
            }
        });
    }
    
    function addTouchInteractions() {
        // Add touch feedback to interactive elements
        const interactiveElements = document.querySelectorAll('button, .btn, a, .proof-card, .team-card');
        
        interactiveElements.forEach(element => {
            element.addEventListener('touchstart', function() {
                this.style.opacity = '0.8';
            }, { passive: true });
            
            element.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.style.opacity = '';
                }, 150);
            }, { passive: true });
            
            element.addEventListener('touchcancel', function() {
                this.style.opacity = '';
            }, { passive: true });
        });
        
        // Smooth scroll for anchor links
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    function optimizeScrolling() {
        // Use passive event listeners for better scroll performance
        let ticking = false;
        
        function updateScrollPosition() {
            // Update any scroll-dependent elements here
            ticking = false;
        }
        
        function requestScrollUpdate() {
            if (!ticking) {
                requestAnimationFrame(updateScrollPosition);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestScrollUpdate, { passive: true });
        
        // Optimize touch scrolling on iOS
        document.body.style.webkitOverflowScrolling = 'touch';
    }
    
    function handleOrientationChange() {
        window.addEventListener('orientationchange', function() {
            // Delay to allow for orientation change to complete
            setTimeout(() => {
                // Recalculate any layout-dependent elements
                const modal = document.getElementById('confirmation-modal');
                if (modal && modal.classList.contains('show')) {
                    // Adjust modal positioning if needed
                    modal.style.height = window.innerHeight + 'px';
                }
                
                // Force a repaint to fix any layout issues
                document.body.style.display = 'none';
                document.body.offsetHeight; // Trigger reflow
                document.body.style.display = '';
            }, 100);
        });
    }
    
    // Viewport height fix for mobile browsers
    function setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    // Update viewport height on resize and orientation change
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', () => {
        setTimeout(setViewportHeight, 100);
    });
    
    // Initialize all functionality
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initializeTracking();
            initializeForm();
            initializeMobileOptimizations();
            setViewportHeight();
            
            // Initialize A/B testing
            window.DataSenseABTest.init();
            
            // Initialize heat mapping
            initializeHeatMapping();
        });
    } else {
        initializeTracking();
        initializeForm();
        initializeMobileOptimizations();
        setViewportHeight();
        
        // Initialize A/B testing
        window.DataSenseABTest.init();
        
        // Initialize heat mapping
        initializeHeatMapping();
    }  
  // Enhanced section engagement tracking
    function trackSectionEngagementTime() {
        const sections = document.querySelectorAll('section[id]');
        const sectionTimes = {};
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                const sectionId = entry.target.id;
                
                if (entry.isIntersecting) {
                    // Section became visible
                    sectionTimes[sectionId] = Date.now();
                    window.DataSenseTracking.trackUserJourney('section_enter', { section: sectionId });
                } else if (sectionTimes[sectionId]) {
                    // Section became hidden, calculate time spent
                    const timeSpent = Math.round((Date.now() - sectionTimes[sectionId]) / 1000);
                    if (timeSpent > 2) { // Only track if spent more than 2 seconds
                        window.DataSenseTracking.trackSectionEngagement(sectionId, timeSpent);
                    }
                    window.DataSenseTracking.trackUserJourney('section_exit', { 
                        section: sectionId, 
                        time_spent: timeSpent 
                    });
                    delete sectionTimes[sectionId];
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '-50px'
        });

        sections.forEach(function(section) {
            observer.observe(section);
        });
    }
    
    // A/B Testing Framework
    window.DataSenseABTest = {
        // Initialize A/B tests
        init: function() {
            this.tests = {
                headline_test: {
                    variants: ['original', 'variant_a', 'variant_b'],
                    weights: [0.34, 0.33, 0.33]
                },
                cta_test: {
                    variants: ['get_early_access', 'join_beta', 'start_free_trial'],
                    weights: [0.34, 0.33, 0.33]
                }
            };
            
            this.assignVariants();
        },
        
        // Assign user to test variants
        assignVariants: function() {
            const userId = this.getUserId();
            this.userVariants = {};
            
            Object.keys(this.tests).forEach(testName => {
                const test = this.tests[testName];
                const variant = this.selectVariant(userId + testName, test.variants, test.weights);
                this.userVariants[testName] = variant;
                
                // Track variant assignment
                window.DataSenseTracking.trackInteraction('ab_test_assigned', testName, 1, {
                    variant: variant,
                    test_name: testName
                });
            });
            
            this.applyVariants();
        },
        
        // Select variant based on user ID and weights
        selectVariant: function(seed, variants, weights) {
            const hash = this.hashCode(seed);
            const random = Math.abs(hash) / 2147483647; // Normalize to 0-1
            
            let cumulative = 0;
            for (let i = 0; i < variants.length; i++) {
                cumulative += weights[i];
                if (random <= cumulative) {
                    return variants[i];
                }
            }
            return variants[variants.length - 1];
        },
        
        // Generate hash code from string
        hashCode: function(str) {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // Convert to 32-bit integer
            }
            return hash;
        },
        
        // Get or generate user ID
        getUserId: function() {
            let userId = localStorage.getItem('datasense_user_id');
            if (!userId) {
                userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                localStorage.setItem('datasense_user_id', userId);
            }
            return userId;
        },
        
        // Apply variants to page elements
        applyVariants: function() {
            // Example: Headline test
            if (this.userVariants.headline_test === 'variant_a') {
                const headline = document.querySelector('.hero-headline');
                if (headline) {
                    headline.textContent = 'Transform your business data into competitive advantage';
                }
            } else if (this.userVariants.headline_test === 'variant_b') {
                const headline = document.querySelector('.hero-headline');
                if (headline) {
                    headline.textContent = 'Stop drowning in data. Start dominating your market.';
                }
            }
            
            // Example: CTA test
            if (this.userVariants.cta_test === 'join_beta') {
                const ctaButtons = document.querySelectorAll('.signup-btn');
                ctaButtons.forEach(btn => {
                    btn.textContent = 'Join the Beta Program';
                });
            } else if (this.userVariants.cta_test === 'start_free_trial') {
                const ctaButtons = document.querySelectorAll('.signup-btn');
                ctaButtons.forEach(btn => {
                    btn.textContent = 'Start Free Trial';
                });
            }
        },
        
        // Track conversion for A/B test
        trackConversion: function(testName, conversionType) {
            const variant = this.userVariants[testName];
            if (variant) {
                window.DataSenseTracking.trackInteraction('ab_test_conversion', testName, 1, {
                    variant: variant,
                    conversion_type: conversionType,
                    test_name: testName
                });
            }
        }
    };
    
    // Heat mapping simulation (would integrate with Hotjar/FullStory)
    function initializeHeatMapping() {
        // Track mouse movements (sampled)
        let mouseTrackingEnabled = Math.random() < 0.1; // Track 10% of users
        
        if (mouseTrackingEnabled) {
            let mousePositions = [];
            let lastMouseTime = 0;
            
            document.addEventListener('mousemove', function(e) {
                const now = Date.now();
                if (now - lastMouseTime > 100) { // Sample every 100ms
                    mousePositions.push({
                        x: e.clientX,
                        y: e.clientY,
                        timestamp: now
                    });
                    lastMouseTime = now;
                    
                    // Send data when we have 50 points
                    if (mousePositions.length >= 50) {
                        sendMouseData(mousePositions);
                        mousePositions = [];
                    }
                }
            }, { passive: true });
            
            // Track clicks with coordinates
            document.addEventListener('click', function(e) {
                window.DataSenseTracking.trackInteraction('click_heatmap', 'click', 1, {
                    x: e.clientX,
                    y: e.clientY,
                    element: e.target.tagName.toLowerCase(),
                    viewport_width: window.innerWidth,
                    viewport_height: window.innerHeight
                });
            });
        }
    }
    
    function sendMouseData(positions) {
        // Would send to heatmap service
        console.log('Mouse tracking data:', positions.length, 'points');
    }    //
 Cross-browser compatibility and accessibility enhancements
    function initializeAccessibility() {
        // Add ARIA live regions for dynamic content
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-region';
        document.body.appendChild(liveRegion);
        
        // Enhance form accessibility
        enhanceFormAccessibility();
        
        // Add keyboard navigation support
        addKeyboardNavigation();
        
        // Detect and handle browser-specific issues
        handleBrowserCompatibility();
        
        // Add focus management
        manageFocus();
    }
    
    function enhanceFormAccessibility() {
        const form = document.getElementById('beta-signup-form');
        if (!form) return;
        
        // Add form validation announcements
        form.addEventListener('submit', function(e) {
            const liveRegion = document.getElementById('live-region');
            if (liveRegion) {
                liveRegion.textContent = 'Form submitted. Processing your beta signup...';
            }
        });
        
        // Announce validation errors
        const originalShowError = window.DataSenseForm.showError;
        window.DataSenseForm.showError = function(field, message) {
            originalShowError.call(this, field, message);
            
            // Announce error to screen readers
            const liveRegion = document.getElementById('live-region');
            if (liveRegion) {
                liveRegion.textContent = `Error in ${field.labels[0]?.textContent || field.name}: ${message}`;
            }
            
            // Set ARIA attributes
            field.setAttribute('aria-invalid', 'true');
            field.setAttribute('aria-describedby', field.name + '-error');
        };
        
        // Clear error announcements
        const originalClearError = window.DataSenseForm.clearError;
        window.DataSenseForm.clearError = function(field) {
            originalClearError.call(this, field);
            
            field.setAttribute('aria-invalid', 'false');
            field.removeAttribute('aria-describedby');
        };
    }
    
    function addKeyboardNavigation() {
        // Add keyboard support for custom interactive elements
        document.addEventListener('keydown', function(e) {
            // Handle Enter and Space for custom buttons
            if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('btn')) {
                e.preventDefault();
                e.target.click();
            }
            
            // Handle Escape key for modal
            if (e.key === 'Escape') {
                const modal = document.getElementById('confirmation-modal');
                if (modal && modal.classList.contains('show')) {
                    window.DataSenseForm.closeConfirmationModal();
                }
            }
            
            // Handle Tab navigation for skip link
            if (e.key === 'Tab' && !e.shiftKey) {
                const skipLink = document.querySelector('.skip-link');
                if (document.activeElement === skipLink) {
                    e.preventDefault();
                    document.getElementById('main-content').focus();
                }
            }
        });
        
        // Add focus indicators for mouse users
        document.addEventListener('mousedown', function() {
            document.body.classList.add('using-mouse');
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                document.body.classList.remove('using-mouse');
            }
        });
    }
    
    function handleBrowserCompatibility() {
        // Detect browser
        const isIE = /MSIE|Trident/.test(navigator.userAgent);
        const isEdge = /Edge/.test(navigator.userAgent);
        const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
        const isFirefox = /Firefox/.test(navigator.userAgent);
        
        // Add browser classes
        if (isIE) document.body.classList.add('browser-ie');
        if (isEdge) document.body.classList.add('browser-edge');
        if (isSafari) document.body.classList.add('browser-safari');
        if (isFirefox) document.body.classList.add('browser-firefox');
        
        // IE-specific fixes
        if (isIE) {
            // Polyfill for closest() method
            if (!Element.prototype.closest) {
                Element.prototype.closest = function(s) {
                    var el = this;
                    do {
                        if (el.matches(s)) return el;
                        el = el.parentElement || el.parentNode;
                    } while (el !== null && el.nodeType === 1);
                    return null;
                };
            }
            
            // Polyfill for matches() method
            if (!Element.prototype.matches) {
                Element.prototype.matches = Element.prototype.msMatchesSelector;
            }
        }
        
        // Safari-specific fixes
        if (isSafari) {
            // Fix date input support
            const dateInputs = document.querySelectorAll('input[type="date"]');
            dateInputs.forEach(input => {
                if (input.type !== 'date') {
                    input.type = 'text';
                    input.placeholder = 'MM/DD/YYYY';
                }
            });
        }
        
        // Feature detection and polyfills
        if (!window.fetch) {
            // Load fetch polyfill for older browsers
            console.warn('Fetch API not supported, form submission may not work');
        }
        
        if (!window.IntersectionObserver) {
            // Fallback for intersection observer
            console.warn('IntersectionObserver not supported, scroll tracking disabled');
        }
    }
    
    function manageFocus() {
        // Focus management for modal
        const originalShowModal = window.DataSenseForm.showConfirmationModal;
        window.DataSenseForm.showConfirmationModal = function() {
            originalShowModal.call(this);
            
            // Focus the modal when it opens
            setTimeout(() => {
                const modal = document.getElementById('confirmation-modal');
                const closeButton = modal?.querySelector('.modal-close');
                if (closeButton) {
                    closeButton.focus();
                }
            }, 100);
        };
        
        // Return focus when modal closes
        const originalCloseModal = window.DataSenseForm.closeConfirmationModal;
        window.DataSenseForm.closeConfirmationModal = function() {
            const submitButton = document.querySelector('.signup-btn');
            originalCloseModal.call(this);
            
            // Return focus to submit button
            if (submitButton) {
                submitButton.focus();
            }
        };
        
        // Focus management for form errors
        window.addEventListener('invalid', function(e) {
            // Focus first invalid field
            e.target.focus();
        }, true);
    }
    
    // Performance monitoring for older browsers
    function monitorPerformance() {
        if ('performance' in window) {
            window.addEventListener('load', function() {
                setTimeout(() => {
                    const perfData = performance.timing;
                    const loadTime = perfData.loadEventEnd - perfData.navigationStart;
                    
                    // Track performance for analytics
                    if (window.DataSenseTracking) {
                        window.DataSenseTracking.trackInteraction('performance', 'page_load_time', loadTime);
                    }
                    
                    // Warn if page is loading slowly
                    if (loadTime > 5000) {
                        console.warn('Page load time is slow:', loadTime + 'ms');
                    }
                }, 0);
            });
        }
    }
    
    // Initialize accessibility features
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initializeTracking();
            initializeForm();
            initializeMobileOptimizations();
            initializeAccessibility();
            setViewportHeight();
            monitorPerformance();
            
            // Initialize A/B testing
            window.DataSenseABTest.init();
            
            // Initialize heat mapping
            initializeHeatMapping();
        });
    } else {
        initializeTracking();
        initializeForm();
        initializeMobileOptimizations();
        initializeAccessibility();
        setViewportHeight();
        monitorPerformance();
        
        // Initialize A/B testing
        window.DataSenseABTest.init();
        
        // Initialize heat mapping
        initializeHeatMapping();
    }    // F
inal integration testing and validation
    function runFinalValidation() {
        console.log('🚀 DataSense Beta Landing Page - Final Validation');
        
        const validationResults = {
            analytics: false,
            form: false,
            email: false,
            accessibility: false,
            performance: false,
            mobile: false
        };
        
        // Test analytics integration
        if (typeof gtag !== 'undefined' && window.DataSenseTracking) {
            validationResults.analytics = true;
            console.log('✅ Analytics integration working');
        } else {
            console.warn('❌ Analytics integration needs configuration');
        }
        
        // Test form functionality
        const form = document.getElementById('beta-signup-form');
        if (form && window.DataSenseForm) {
            validationResults.form = true;
            console.log('✅ Form functionality ready');
        } else {
            console.warn('❌ Form functionality not working');
        }
        
        // Test email integration
        if (window.DataSenseCRM && window.DataSenseEmails) {
            validationResults.email = true;
            console.log('✅ Email integration ready (configure API keys)');
        } else {
            console.warn('❌ Email integration not loaded');
        }
        
        // Test accessibility features
        const skipLink = document.querySelector('.skip-link');
        const ariaLabels = document.querySelectorAll('[aria-label]');
        if (skipLink && ariaLabels.length > 0) {
            validationResults.accessibility = true;
            console.log('✅ Accessibility features implemented');
        } else {
            console.warn('❌ Accessibility features incomplete');
        }
        
        // Test mobile optimizations
        const isMobile = window.innerWidth <= 768;
        const touchTargets = document.querySelectorAll('.btn, input, select, textarea');
        let mobileFriendly = true;
        
        touchTargets.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.height < 44 || rect.width < 44) {
                mobileFriendly = false;
            }
        });
        
        if (mobileFriendly) {
            validationResults.mobile = true;
            console.log('✅ Mobile optimizations ready');
        } else {
            console.warn('❌ Some touch targets are too small');
        }
        
        // Test performance
        if ('performance' in window) {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            if (loadTime < 3000) {
                validationResults.performance = true;
                console.log('✅ Performance is good (' + loadTime + 'ms)');
            } else {
                console.warn('❌ Page load time is slow (' + loadTime + 'ms)');
            }
        }
        
        // Overall validation summary
        const passedTests = Object.values(validationResults).filter(Boolean).length;
        const totalTests = Object.keys(validationResults).length;
        
        console.log(`\n📊 Validation Summary: ${passedTests}/${totalTests} tests passed`);
        
        if (passedTests === totalTests) {
            console.log('🎉 All systems ready for launch!');
        } else {
            console.log('⚠️  Some items need attention before launch');
        }
        
        // Configuration reminders
        console.log('\n📋 Pre-launch Configuration Checklist:');
        console.log('1. Replace GA_MEASUREMENT_ID with your Google Analytics ID');
        console.log('2. Replace FB_PIXEL_ID with your Facebook Pixel ID');
        console.log('3. Configure email provider API keys in email-integration.js');
        console.log('4. Set up server endpoints for form submission and CRM sync');
        console.log('5. Test email delivery and automated sequences');
        console.log('6. Review launch-checklist.md for complete preparation');
        
        return validationResults;
    }
    
    // Run validation on page load (development only)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.addEventListener('load', function() {
            setTimeout(runFinalValidation, 1000);
        });
    }
    
    // Export validation function for manual testing
    window.DataSenseValidation = {
        runFinalValidation: runFinalValidation
    };

// Live Product Demo Iframe Handler
document.addEventListener('DOMContentLoaded', function() {
    const iframe = document.getElementById('snapclass-demo-iframe');
    const loadingDiv = document.querySelector('.iframe-loading');
    
    if (iframe) {
        // Hide loading spinner when iframe loads
        iframe.addEventListener('load', function() {
            if (loadingDiv) {
                loadingDiv.style.display = 'none';
            }
        });
        
        // Handle iframe error
        iframe.addEventListener('error', function() {
            if (loadingDiv) {
                loadingDiv.innerHTML = '<p>Unable to load demo. Please try again later.</p>';
            }
        });
    }
});
