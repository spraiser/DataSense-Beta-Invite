// Enhanced A/B Testing Controller with Multiple Experiments Support
(function(window) {
    'use strict';

    // Main A/B Test Controller
    const ABTestController = {
        // Active experiments configuration
        experiments: {
            heroHeadline: {
                enabled: true,
                variants: {
                    control: {
                        text: "See what's really driving your business growth",
                        weight: 0.5
                    },
                    variant_a: {
                        text: "Your AI data analyst that speaks plain English",
                        weight: 0.5
                    }
                },
                selector: '.hero-heading',
                cookieName: 'ab_hero_headline',
                minSampleSize: 500
            },
            
            ctaButton: {
                enabled: true,
                variants: {
                    control: {
                        text: "Start Free Analysis",
                        color: "#007bff",
                        weight: 0.33
                    },
                    variant_a: {
                        text: "See Your Data Come Alive",
                        color: "#007bff",
                        weight: 0.33
                    },
                    variant_b: {
                        text: "Get Started - It's Free",
                        color: "#28a745",
                        weight: 0.34
                    }
                },
                selector: '.cta-button',
                cookieName: 'ab_cta_button',
                minSampleSize: 500
            },
            
            urgencyBanner: {
                enabled: true,
                variants: {
                    control: {
                        show: true,
                        text: "Limited spots available for beta program",
                        weight: 0.5
                    },
                    variant_a: {
                        show: false,
                        text: null,
                        weight: 0.5
                    }
                },
                selector: '.urgency-banner',
                cookieName: 'ab_urgency',
                minSampleSize: 500
            },
            
            socialProof: {
                enabled: true,
                variants: {
                    control: {
                        position: "below-hero",
                        format: "logos",
                        weight: 0.33
                    },
                    variant_a: {
                        position: "above-fold",
                        format: "testimonials",
                        weight: 0.33
                    },
                    variant_b: {
                        position: "floating-widget",
                        format: "live-counter",
                        weight: 0.34
                    }
                },
                selector: '.social-proof',
                cookieName: 'ab_social_proof',
                minSampleSize: 500
            },
            
            demoFormat: {
                enabled: false, // Will enable in week 3-4
                variants: {
                    control: {
                        type: "static-image",
                        autoplay: false,
                        weight: 0.5
                    },
                    variant_a: {
                        type: "video",
                        autoplay: true,
                        weight: 0.5
                    }
                },
                selector: '.demo-section',
                cookieName: 'ab_demo_format',
                minSampleSize: 500
            },
            
            pricingDisplay: {
                enabled: false, // Will enable in week 3-4
                variants: {
                    control: {
                        show: true,
                        position: "dedicated-section",
                        weight: 0.5
                    },
                    variant_a: {
                        show: false,
                        position: null,
                        weight: 0.5
                    }
                },
                selector: '.pricing-section',
                cookieName: 'ab_pricing',
                minSampleSize: 500
            },
            
            formPosition: {
                enabled: true,
                variants: {
                    control: {
                        position: "current",
                        sticky: false,
                        weight: 0.5
                    },
                    variant_a: {
                        position: "above-fold",
                        sticky: true,
                        weight: 0.5
                    }
                },
                selector: '#signup-form',
                cookieName: 'ab_form_position',
                minSampleSize: 500
            },
            
            exitPopup: {
                enabled: false, // Will enable in week 5-6
                variants: {
                    control: {
                        show: false,
                        delay: null,
                        weight: 0.33
                    },
                    variant_a: {
                        show: true,
                        delay: 0,
                        message: "Wait! Get a free consultation",
                        weight: 0.33
                    },
                    variant_b: {
                        show: true,
                        delay: 3000,
                        message: "Before you go - 50% off for early adopters",
                        weight: 0.34
                    }
                },
                cookieName: 'ab_exit_popup',
                minSampleSize: 500
            }
        },

        // Initialize all active experiments
        init: function() {
            console.log('[A/B Testing] Initializing experiments...');
            
            // Get or create visitor ID
            this.visitorId = this.getVisitorId();
            
            // Initialize each active experiment
            Object.keys(this.experiments).forEach(experimentName => {
                const experiment = this.experiments[experimentName];
                if (experiment.enabled) {
                    this.initExperiment(experimentName, experiment);
                }
            });
            
            // Set up global tracking
            this.setupGlobalTracking();
            
            // Expose results interface
            this.exposeDebugInterface();
            
            console.log('[A/B Testing] Initialization complete');
        },

        // Initialize a single experiment
        initExperiment: function(name, config) {
            // Get or assign variant
            let variant = this.getCookie(config.cookieName);
            
            if (!variant) {
                variant = this.assignVariant(name, config);
                this.setCookie(config.cookieName, variant, 30);
                
                // Track new assignment
                this.trackEvent('experiment_assignment', {
                    experiment: name,
                    variant: variant,
                    visitor_id: this.visitorId
                });
            }
            
            // Apply variant
            this.applyVariant(name, variant, config);
            
            // Store active variant for tracking
            if (!window.activeVariants) {
                window.activeVariants = {};
            }
            window.activeVariants[name] = variant;
        },

        // Assign variant based on weights
        assignVariant: function(experimentName, config) {
            const random = Math.random();
            let cumulative = 0;
            
            for (const [variantName, variantConfig] of Object.entries(config.variants)) {
                cumulative += variantConfig.weight;
                if (random <= cumulative) {
                    return variantName;
                }
            }
            
            return 'control'; // Fallback
        },

        // Apply variant changes to the page
        applyVariant: function(experimentName, variant, config) {
            const variantConfig = config.variants[variant];
            if (!variantConfig) return;
            
            // Add data attribute for CSS targeting
            document.body.setAttribute(`data-experiment-${experimentName}`, variant);
            
            // Apply specific changes based on experiment type
            switch(experimentName) {
                case 'heroHeadline':
                    this.applyHeadlineVariant(variantConfig, config.selector);
                    break;
                case 'ctaButton':
                    this.applyCtaVariant(variantConfig, config.selector);
                    break;
                case 'urgencyBanner':
                    this.applyUrgencyVariant(variantConfig, config.selector);
                    break;
                case 'socialProof':
                    this.applySocialProofVariant(variantConfig, config.selector);
                    break;
                case 'formPosition':
                    this.applyFormPositionVariant(variantConfig, config.selector);
                    break;
                case 'demoFormat':
                    this.applyDemoFormatVariant(variantConfig, config.selector);
                    break;
                case 'pricingDisplay':
                    this.applyPricingVariant(variantConfig, config.selector);
                    break;
                case 'exitPopup':
                    this.setupExitPopup(variantConfig);
                    break;
            }
        },

        // Variant application methods
        applyHeadlineVariant: function(config, selector) {
            const element = document.querySelector(selector);
            if (element && config.text) {
                element.textContent = config.text;
            }
        },

        applyCtaVariant: function(config, selector) {
            const buttons = document.querySelectorAll(selector);
            buttons.forEach(button => {
                if (config.text) button.textContent = config.text;
                if (config.color) button.style.backgroundColor = config.color;
            });
        },

        applyUrgencyVariant: function(config, selector) {
            const element = document.querySelector(selector);
            if (element) {
                if (config.show) {
                    element.style.display = 'block';
                    if (config.text) {
                        element.textContent = config.text;
                    }
                } else {
                    element.style.display = 'none';
                }
            }
        },

        applySocialProofVariant: function(config, selector) {
            const element = document.querySelector(selector);
            if (!element) return;
            
            // Apply position changes
            element.setAttribute('data-position', config.position);
            element.setAttribute('data-format', config.format);
            
            // Trigger re-render if social proof component exists
            if (window.SocialProofComponent) {
                window.SocialProofComponent.render(config);
            }
        },

        applyFormPositionVariant: function(config, selector) {
            const form = document.querySelector(selector);
            if (!form) return;
            
            if (config.position === 'above-fold') {
                // Move form to hero section
                const hero = document.querySelector('.hero-section');
                if (hero) {
                    hero.appendChild(form);
                }
            }
            
            if (config.sticky) {
                form.style.position = 'sticky';
                form.style.top = '20px';
                form.style.zIndex = '100';
            }
        },

        applyDemoFormatVariant: function(config, selector) {
            const element = document.querySelector(selector);
            if (!element) return;
            
            if (config.type === 'video') {
                // Replace static image with video
                const video = document.createElement('video');
                video.src = '/assets/demo-video.mp4';
                video.autoplay = config.autoplay;
                video.loop = true;
                video.muted = true;
                video.classList.add('demo-video');
                element.innerHTML = '';
                element.appendChild(video);
            }
        },

        applyPricingVariant: function(config, selector) {
            const element = document.querySelector(selector);
            if (element) {
                element.style.display = config.show ? 'block' : 'none';
            }
        },

        setupExitPopup: function(config) {
            if (!config.show) return;
            
            let hasShown = false;
            
            document.addEventListener('mouseout', (e) => {
                if (hasShown) return;
                if (e.clientY <= 0) {
                    setTimeout(() => {
                        this.showExitPopup(config.message);
                        hasShown = true;
                    }, config.delay || 0);
                }
            });
        },

        showExitPopup: function(message) {
            // Create and show exit popup
            const popup = document.createElement('div');
            popup.className = 'exit-popup';
            popup.innerHTML = `
                <div class="exit-popup-content">
                    <button class="close-btn">&times;</button>
                    <h3>${message}</h3>
                    <button class="cta-button">Claim Offer</button>
                </div>
            `;
            document.body.appendChild(popup);
            
            // Track popup display
            this.trackEvent('exit_popup_shown', {
                message: message
            });
            
            // Setup close handlers
            popup.querySelector('.close-btn').addEventListener('click', () => {
                popup.remove();
                this.trackEvent('exit_popup_closed');
            });
            
            popup.querySelector('.cta-button').addEventListener('click', () => {
                this.trackEvent('exit_popup_converted');
            });
        },

        // Global tracking setup
        setupGlobalTracking: function() {
            // Track page view with all active experiments
            this.trackEvent('page_view', {
                experiments: window.activeVariants,
                url: window.location.href,
                referrer: document.referrer
            });
            
            // Track form interactions
            this.trackFormEvents();
            
            // Track CTA clicks
            this.trackCtaClicks();
            
            // Track scroll depth
            this.trackScrollDepth();
            
            // Track time on page
            this.trackTimeOnPage();
            
            // Track demo interactions
            this.trackDemoInteractions();
        },

        // Event tracking methods
        trackFormEvents: function() {
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                // Track form starts
                form.addEventListener('focusin', (e) => {
                    if (!form.dataset.tracked) {
                        form.dataset.tracked = 'true';
                        this.trackEvent('form_start', {
                            form_id: form.id,
                            experiments: window.activeVariants
                        });
                    }
                });
                
                // Track form submissions
                form.addEventListener('submit', (e) => {
                    this.trackEvent('form_submit', {
                        form_id: form.id,
                        experiments: window.activeVariants,
                        success: true
                    });
                });
            });
        },

        trackCtaClicks: function() {
            document.addEventListener('click', (e) => {
                const cta = e.target.closest('.cta-button, .btn-primary, [data-track="cta"]');
                if (cta) {
                    this.trackEvent('cta_click', {
                        button_text: cta.textContent.trim(),
                        button_location: this.getElementLocation(cta),
                        experiments: window.activeVariants
                    });
                }
            });
        },

        trackScrollDepth: function() {
            const milestones = [25, 50, 75, 100];
            const tracked = new Set();
            let maxScroll = 0;
            
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
                                depth: milestone,
                                experiments: window.activeVariants
                            });
                        }
                    });
                }
            });
        },

        trackTimeOnPage: function() {
            const startTime = Date.now();
            const intervals = [10, 30, 60, 120, 300]; // seconds
            
            intervals.forEach(interval => {
                setTimeout(() => {
                    this.trackEvent('time_on_page', {
                        duration: interval,
                        experiments: window.activeVariants
                    });
                }, interval * 1000);
            });
            
            // Track on page unload
            window.addEventListener('beforeunload', () => {
                const duration = Math.round((Date.now() - startTime) / 1000);
                this.trackEvent('page_exit', {
                    total_time: duration,
                    experiments: window.activeVariants
                });
            });
        },

        trackDemoInteractions: function() {
            // Track video plays
            document.addEventListener('play', (e) => {
                if (e.target.tagName === 'VIDEO') {
                    this.trackEvent('demo_video_play', {
                        experiments: window.activeVariants
                    });
                }
            }, true);
            
            // Track demo clicks
            document.addEventListener('click', (e) => {
                if (e.target.closest('.demo-section, .query-example')) {
                    this.trackEvent('demo_interaction', {
                        element: e.target.className,
                        experiments: window.activeVariants
                    });
                }
            });
        },

        // Main event tracking method
        trackEvent: function(eventName, data = {}) {
            const eventData = {
                event: eventName,
                timestamp: new Date().toISOString(),
                visitor_id: this.visitorId,
                session_id: this.getSessionId(),
                ...data
            };
            
            // Send to Google Analytics 4
            if (typeof gtag !== 'undefined') {
                gtag('event', eventName, {
                    event_category: 'ab_testing',
                    event_label: JSON.stringify(data.experiments || {}),
                    value: data.value || 0,
                    custom_data: eventData
                });
            }
            
            // Send to custom analytics endpoint
            if (window.location.hostname !== 'localhost') {
                this.sendToAnalytics(eventData);
            }
            
            // Console log in debug mode
            if (this.isDebugMode()) {
                console.log('[A/B Test Event]', eventName, eventData);
            }
        },

        // Send data to analytics endpoint
        sendToAnalytics: function(data) {
            fetch('/api/analytics/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).catch(err => {
                console.error('[A/B Testing] Analytics error:', err);
            });
        },

        // Utility methods
        getVisitorId: function() {
            let visitorId = this.getCookie('datasense_visitor_id');
            if (!visitorId) {
                visitorId = this.generateUUID();
                this.setCookie('datasense_visitor_id', visitorId, 365);
            }
            return visitorId;
        },

        getSessionId: function() {
            let sessionId = sessionStorage.getItem('datasense_session_id');
            if (!sessionId) {
                sessionId = this.generateUUID();
                sessionStorage.setItem('datasense_session_id', sessionId);
            }
            return sessionId;
        },

        generateUUID: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },

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

        setCookie: function(name, value, days) {
            const expires = new Date();
            expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
            document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
        },

        getElementLocation: function(element) {
            const rect = element.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (rect.top + scrollTop < window.innerHeight) {
                return 'above_fold';
            } else {
                return 'below_fold';
            }
        },

        isDebugMode: function() {
            return window.location.hostname === 'localhost' || 
                   window.location.search.includes('debug=true');
        },

        // Debug interface
        exposeDebugInterface: function() {
            window.ABTest = {
                getActiveExperiments: () => window.activeVariants,
                getVisitorId: () => this.visitorId,
                getSessionId: () => this.getSessionId(),
                forceVariant: (experiment, variant) => {
                    if (this.experiments[experiment]) {
                        this.setCookie(this.experiments[experiment].cookieName, variant, 30);
                        location.reload();
                    }
                },
                clearAllTests: () => {
                    Object.values(this.experiments).forEach(exp => {
                        this.setCookie(exp.cookieName, '', -1);
                    });
                    location.reload();
                },
                getResults: () => {
                    return {
                        visitor_id: this.visitorId,
                        session_id: this.getSessionId(),
                        active_experiments: window.activeVariants,
                        page_url: window.location.href
                    };
                }
            };
            
            if (this.isDebugMode()) {
                console.log('[A/B Testing] Debug interface available at window.ABTest');
                console.log('Active experiments:', window.activeVariants);
            }
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => ABTestController.init());
    } else {
        ABTestController.init();
    }

    // Expose controller globally
    window.ABTestController = ABTestController;

})(window);