// A/B Testing Framework for Landing Page Optimization
(function() {
    'use strict';

    // Configuration
    const config = {
        testName: 'warm_referral_vs_standard',
        variants: {
            control: {
                name: 'Standard Landing Page',
                url: '/index.html',
                weight: 0.5
            },
            treatment: {
                name: 'Warm Referral Landing Page',
                url: '/referral.html',
                weight: 0.5
            }
        },
        metrics: {
            primary: 'conversion_rate',
            secondary: ['time_on_page', 'bounce_rate', 'demo_bookings']
        },
        cookieName: 'datasense_ab_test',
        cookieDays: 30,
        minimumSampleSize: 100,
        confidenceLevel: 0.95
    };

    // Utility functions
    const utils = {
        // Set cookie
        setCookie: function(name, value, days) {
            const expires = new Date();
            expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
            document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
        },

        // Get cookie
        getCookie: function(name) {
            const nameEQ = name + "=";
            const ca = document.cookie.split(';');
            for(let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        },

        // Generate UUID for visitor tracking
        generateUUID: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },

        // Get or create visitor ID
        getVisitorId: function() {
            let visitorId = this.getCookie('datasense_visitor_id');
            if (!visitorId) {
                visitorId = this.generateUUID();
                this.setCookie('datasense_visitor_id', visitorId, 365);
            }
            return visitorId;
        },

        // Calculate hash for consistent assignment
        hashString: function(str) {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            return Math.abs(hash);
        }
    };

    // A/B Test Manager
    const ABTestManager = {
        // Initialize the test
        init: function() {
            // Check if user is part of warm referral traffic
            const urlParams = new URLSearchParams(window.location.search);
            const isWarmTraffic = urlParams.get('ref') || urlParams.get('partner') || urlParams.get('referrer');
            
            if (isWarmTraffic) {
                // For warm traffic, always show referral page
                this.assignVariant('treatment');
                this.trackWarmTraffic(urlParams);
            } else {
                // For cold traffic, run A/B test
                this.runTest();
            }
            
            // Set up event tracking
            this.setupTracking();
        },

        // Run the A/B test for cold traffic
        runTest: function() {
            const visitorId = utils.getVisitorId();
            let variant = utils.getCookie(config.cookieName);
            
            if (!variant) {
                // Assign variant based on visitor ID hash
                variant = this.assignVariantByHash(visitorId);
                utils.setCookie(config.cookieName, variant, config.cookieDays);
                
                // Track new assignment
                this.trackAssignment(variant, visitorId);
            }
            
            // Apply variant if needed
            this.applyVariant(variant);
        },

        // Assign variant based on hash
        assignVariantByHash: function(visitorId) {
            const hash = utils.hashString(visitorId);
            const threshold = hash % 100;
            
            if (threshold < config.variants.control.weight * 100) {
                return 'control';
            } else {
                return 'treatment';
            }
        },

        // Assign specific variant
        assignVariant: function(variant) {
            utils.setCookie(config.cookieName, variant, config.cookieDays);
            this.applyVariant(variant);
        },

        // Apply variant changes
        applyVariant: function(variant) {
            // Add variant class to body
            document.body.classList.add(`ab-variant-${variant}`);
            
            // Store variant in session for tracking
            if (typeof(Storage) !== "undefined") {
                sessionStorage.setItem('ab_variant', variant);
            }
            
            // Redirect if on wrong page (only for initial load)
            if (!sessionStorage.getItem('ab_redirected')) {
                const currentPath = window.location.pathname;
                const variantUrl = config.variants[variant].url;
                
                if (!currentPath.includes(variantUrl.replace('/', ''))) {
                    sessionStorage.setItem('ab_redirected', 'true');
                    window.location.href = variantUrl + window.location.search;
                }
            }
        },

        // Track assignment
        trackAssignment: function(variant, visitorId) {
            const data = {
                event: 'ab_test_assignment',
                test_name: config.testName,
                variant: variant,
                visitor_id: visitorId,
                timestamp: new Date().toISOString()
            };
            
            this.sendToAnalytics(data);
        },

        // Track warm traffic
        trackWarmTraffic: function(urlParams) {
            const data = {
                event: 'warm_traffic_arrival',
                referrer: urlParams.get('ref') || urlParams.get('partner') || 'unknown',
                utm_source: urlParams.get('utm_source'),
                utm_campaign: urlParams.get('utm_campaign'),
                timestamp: new Date().toISOString()
            };
            
            this.sendToAnalytics(data);
        },

        // Set up event tracking
        setupTracking: function() {
            const variant = utils.getCookie(config.cookieName) || 'unknown';
            const startTime = Date.now();
            
            // Track page view
            this.trackEvent('page_view', {
                variant: variant,
                page: window.location.pathname
            });
            
            // Track time on page
            window.addEventListener('beforeunload', () => {
                const timeOnPage = Math.round((Date.now() - startTime) / 1000);
                this.trackEvent('time_on_page', {
                    variant: variant,
                    duration: timeOnPage
                });
            });
            
            // Track form submissions
            this.trackFormSubmissions(variant);
            
            // Track click events
            this.trackClickEvents(variant);
            
            // Track scroll depth
            this.trackScrollDepth(variant);
        },

        // Track form submissions
        trackFormSubmissions: function(variant) {
            document.addEventListener('submit', (e) => {
                if (e.target.tagName === 'FORM') {
                    const formId = e.target.id || 'unknown';
                    this.trackEvent('form_submission', {
                        variant: variant,
                        form_id: formId,
                        conversion: true
                    });
                    
                    // Mark as converted
                    utils.setCookie('datasense_converted', 'true', 365);
                }
            });
        },

        // Track click events
        trackClickEvents: function(variant) {
            document.addEventListener('click', (e) => {
                const target = e.target.closest('a, button');
                if (!target) return;
                
                const isCtaButton = target.classList.contains('btn-primary') || 
                                   target.classList.contains('nav-cta');
                
                if (isCtaButton) {
                    this.trackEvent('cta_click', {
                        variant: variant,
                        button_text: target.textContent.trim(),
                        button_location: this.getElementLocation(target)
                    });
                }
            });
        },

        // Track scroll depth
        trackScrollDepth: function(variant) {
            let maxScroll = 0;
            const milestones = [25, 50, 75, 100];
            const tracked = new Set();
            
            window.addEventListener('scroll', () => {
                const scrollPercentage = Math.round(
                    (window.scrollY + window.innerHeight) / 
                    document.documentElement.scrollHeight * 100
                );
                
                if (scrollPercentage > maxScroll) {
                    maxScroll = scrollPercentage;
                    
                    milestones.forEach(milestone => {
                        if (maxScroll >= milestone && !tracked.has(milestone)) {
                            tracked.add(milestone);
                            this.trackEvent('scroll_depth', {
                                variant: variant,
                                depth: milestone
                            });
                        }
                    });
                }
            });
        },

        // Get element location in page
        getElementLocation: function(element) {
            const rect = element.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (rect.top + scrollTop < window.innerHeight) {
                return 'above_fold';
            } else {
                return 'below_fold';
            }
        },

        // Track custom event
        trackEvent: function(eventName, data) {
            const eventData = {
                event: eventName,
                test_name: config.testName,
                visitor_id: utils.getVisitorId(),
                timestamp: new Date().toISOString(),
                ...data
            };
            
            this.sendToAnalytics(eventData);
        },

        // Send data to analytics
        sendToAnalytics: function(data) {
            // Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', data.event, {
                    'event_category': 'ab_test',
                    'event_label': config.testName,
                    'custom_data': JSON.stringify(data)
                });
            }
            
            // Custom analytics endpoint (in production)
            if (window.location.hostname !== 'localhost') {
                fetch('/api/analytics', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }).catch(err => console.error('Analytics error:', err));
            }
            
            // Console log for debugging
            if (window.location.hostname === 'localhost' || 
                window.location.search.includes('debug=true')) {
                console.log('A/B Test Event:', data);
            }
        },

        // Get test results (for dashboard)
        getResults: function() {
            return {
                test_name: config.testName,
                variants: config.variants,
                current_variant: utils.getCookie(config.cookieName),
                visitor_id: utils.getVisitorId(),
                converted: utils.getCookie('datasense_converted') === 'true'
            };
        }
    };

    // Statistical analysis functions
    const Statistics = {
        // Calculate conversion rate
        calculateConversionRate: function(conversions, visitors) {
            return (conversions / visitors * 100).toFixed(2);
        },

        // Calculate statistical significance
        calculateSignificance: function(controlData, treatmentData) {
            const n1 = controlData.visitors;
            const n2 = treatmentData.visitors;
            const p1 = controlData.conversions / n1;
            const p2 = treatmentData.conversions / n2;
            
            const pooledP = (controlData.conversions + treatmentData.conversions) / (n1 + n2);
            const se = Math.sqrt(pooledP * (1 - pooledP) * (1/n1 + 1/n2));
            const z = (p2 - p1) / se;
            
            // Two-tailed test
            const pValue = 2 * (1 - this.normalCDF(Math.abs(z)));
            
            return {
                zScore: z,
                pValue: pValue,
                isSignificant: pValue < (1 - config.confidenceLevel),
                confidenceInterval: this.calculateConfidenceInterval(p2 - p1, se)
            };
        },

        // Normal CDF approximation
        normalCDF: function(z) {
            const a1 =  0.254829592;
            const a2 = -0.284496736;
            const a3 =  1.421413741;
            const a4 = -1.453152027;
            const a5 =  1.061405429;
            const p  =  0.3275911;
            
            const sign = z < 0 ? -1 : 1;
            z = Math.abs(z) / Math.sqrt(2.0);
            
            const t = 1.0 / (1.0 + p * z);
            const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);
            
            return 0.5 * (1.0 + sign * y);
        },

        // Calculate confidence interval
        calculateConfidenceInterval: function(difference, se) {
            const zScore = 1.96; // 95% confidence
            return {
                lower: difference - zScore * se,
                upper: difference + zScore * se
            };
        }
    };

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => ABTestManager.init());
    } else {
        ABTestManager.init();
    }

    // Expose for debugging and dashboard
    window.DataSenseABTest = {
        manager: ABTestManager,
        statistics: Statistics,
        getResults: () => ABTestManager.getResults()
    };
})();