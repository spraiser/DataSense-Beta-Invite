// Referral Tracking and Dynamic Content System
(function() {
    'use strict';

    // Referrer data mapping (in production, this would come from a database)
    const referrerData = {
        'john_smith': {
            name: 'John Smith',
            company: 'TechFlow',
            isCustomer: true,
            testimonial: 'DataSense helped us identify that 73% of our revenue comes from just 18% of our customers. Game-changing insights!',
            title: 'CEO'
        },
        'sarah_chen': {
            name: 'Sarah Chen',
            company: 'MarketPro',
            isCustomer: true,
            testimonial: 'We reduced customer churn by 42% using DataSense predictions. It pays for itself every month.',
            title: 'Head of Operations'
        },
        'mike_johnson': {
            name: 'Mike Johnson',
            company: 'GrowthCo',
            isCustomer: true,
            testimonial: 'DataSense showed us our best customers come from LinkedIn, not Google Ads. Saved us $50k/year in wasted ad spend.',
            title: 'Marketing Director'
        },
        'default': {
            name: 'Your trusted colleague',
            company: '',
            isCustomer: false,
            testimonial: '',
            title: ''
        }
    };

    // Parse URL parameters
    function getUrlParameters() {
        const params = new URLSearchParams(window.location.search);
        return {
            ref: params.get('ref') || params.get('referrer'),
            utm_source: params.get('utm_source'),
            utm_medium: params.get('utm_medium'),
            utm_campaign: params.get('utm_campaign'),
            partner: params.get('partner')
        };
    }

    // Set cookie for multi-session tracking
    function setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }

    // Get cookie value
    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Store referral source for attribution
    function storeReferralSource(source) {
        // Store in cookie for 30 days
        setCookie('datasense_referral', source, 30);
        
        // Store in localStorage as backup
        if (typeof(Storage) !== "undefined") {
            localStorage.setItem('datasense_referral', source);
            localStorage.setItem('datasense_referral_date', new Date().toISOString());
        }
    }

    // Get stored referral source
    function getStoredReferral() {
        // Check cookie first
        let referral = getCookie('datasense_referral');
        
        // Fallback to localStorage
        if (!referral && typeof(Storage) !== "undefined") {
            referral = localStorage.getItem('datasense_referral');
        }
        
        return referral;
    }

    // Update page content with referrer information
    function updateDynamicContent(referrerInfo) {
        // Update greeting
        const greetingElement = document.getElementById('dynamic-greeting');
        if (greetingElement) {
            const referrerName = document.querySelector('.referrer-name');
            if (referrerName && referrerInfo.name !== 'Your trusted colleague') {
                referrerName.textContent = referrerInfo.name;
            }
        }

        // Show referrer testimonial if they're a customer
        if (referrerInfo.isCustomer && referrerInfo.testimonial) {
            const testimonialSection = document.getElementById('referrer-testimonial');
            if (testimonialSection) {
                testimonialSection.style.display = 'block';
                
                const testimonialText = testimonialSection.querySelector('.testimonial-text');
                if (testimonialText) {
                    testimonialText.textContent = referrerInfo.testimonial;
                }
                
                const authorName = document.getElementById('referrer-author');
                if (authorName) {
                    authorName.textContent = referrerInfo.name;
                }
                
                const authorCompany = document.getElementById('referrer-company');
                if (authorCompany && referrerInfo.company) {
                    authorCompany.textContent = `at ${referrerInfo.company}`;
                }
            }
        }

        // Update form hidden fields
        const referrerField = document.getElementById('referrer');
        if (referrerField) {
            referrerField.value = referrerInfo.name;
        }
    }

    // Track page performance metrics
    function trackPerformanceMetrics() {
        // Time on page tracking
        const startTime = Date.now();
        
        window.addEventListener('beforeunload', function() {
            const timeOnPage = Math.round((Date.now() - startTime) / 1000);
            
            // Send to analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'page_timing', {
                    'event_category': 'engagement',
                    'event_label': 'referral_page',
                    'value': timeOnPage
                });
            }
        });

        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', function() {
            const scrollPercentage = Math.round((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100);
            if (scrollPercentage > maxScroll) {
                maxScroll = scrollPercentage;
                
                // Track milestones
                if (maxScroll >= 25 && maxScroll < 50) {
                    trackEvent('scroll_depth', '25%');
                } else if (maxScroll >= 50 && maxScroll < 75) {
                    trackEvent('scroll_depth', '50%');
                } else if (maxScroll >= 75 && maxScroll < 100) {
                    trackEvent('scroll_depth', '75%');
                } else if (maxScroll >= 100) {
                    trackEvent('scroll_depth', '100%');
                }
            }
        });
    }

    // Track events to analytics
    function trackEvent(action, label, value) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': 'referral_engagement',
                'event_label': label,
                'value': value
            });
        }
    }

    // A/B testing setup
    function setupABTesting() {
        // Determine test variant (50/50 split)
        const variant = Math.random() < 0.5 ? 'control' : 'referral';
        
        // Store variant in session
        sessionStorage.setItem('ab_variant', variant);
        
        // Track variant in analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'experiment_impression', {
                'event_category': 'ab_test',
                'event_label': 'landing_page',
                'value': variant
            });
        }
        
        // Add variant class to body for CSS targeting
        document.body.classList.add(`variant-${variant}`);
        
        return variant;
    }

    // Form submission handler
    function handleFormSubmission() {
        const form = document.getElementById('referral-form');
        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Add referral tracking data
            data.referral_source = getStoredReferral() || 'direct';
            data.ab_variant = sessionStorage.getItem('ab_variant');
            data.timestamp = new Date().toISOString();
            
            // Get selected tools
            const tools = [];
            document.querySelectorAll('input[name="tools"]:checked').forEach(checkbox => {
                tools.push(checkbox.value);
            });
            data.tools = tools;
            
            // Track conversion
            trackEvent('form_submit', 'referral_demo_request', 1);
            
            // In production, this would send to your backend
            console.log('Form submission data:', data);
            
            // Show success message
            showSuccessMessage();
        });
    }

    // Show success message after form submission
    function showSuccessMessage() {
        const form = document.getElementById('referral-form');
        if (!form) return;
        
        form.innerHTML = `
            <div class="success-message">
                <svg class="success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <h3>Perfect! Your personalized demo is being prepared.</h3>
                <p>We'll call you within 24 hours to show you DataSense with your actual business data.</p>
                <div class="success-benefits">
                    <div class="benefit-item">
                        <span class="benefit-check">✓</span>
                        <span>20% lifetime discount secured</span>
                    </div>
                    <div class="benefit-item">
                        <span class="benefit-check">✓</span>
                        <span>Priority onboarding scheduled</span>
                    </div>
                    <div class="benefit-item">
                        <span class="benefit-check">✓</span>
                        <span>Welcome email sent with next steps</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Initialize on DOM ready
    function initialize() {
        // Get URL parameters
        const urlParams = getUrlParameters();
        
        // Determine referrer
        let referrerKey = urlParams.ref || urlParams.partner || getStoredReferral() || 'default';
        
        // Store referral source if new
        if (urlParams.ref || urlParams.partner) {
            storeReferralSource(referrerKey);
        }
        
        // Get referrer info
        const referrerInfo = referrerData[referrerKey] || referrerData['default'];
        
        // Update page content
        updateDynamicContent(referrerInfo);
        
        // Set up tracking
        trackPerformanceMetrics();
        
        // Set up A/B testing
        setupABTesting();
        
        // Handle form submission
        handleFormSubmission();
        
        // Track page view with referral source
        trackEvent('page_view', 'referral_landing', referrerKey);
        
        // Update UTM hidden fields
        const utmSource = document.getElementById('utm_source');
        const utmCampaign = document.getElementById('utm_campaign');
        if (utmSource) utmSource.value = urlParams.utm_source || 'referral';
        if (utmCampaign) utmCampaign.value = urlParams.utm_campaign || 'friends_of_datasense';
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();