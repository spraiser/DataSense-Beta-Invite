// Comprehensive Analytics Tracking System with GA4 Events
(function(window) {
    'use strict';

    const AnalyticsTracker = {
        // Configuration
        config: {
            ga4MeasurementId: 'G-XXXXXXXXXX', // Replace with actual GA4 ID
            debugMode: false,
            trackingEnabled: true,
            sessionTimeout: 30 * 60 * 1000, // 30 minutes
            engagementThreshold: 10000, // 10 seconds for engaged session
            bounceThreshold: 15000 // 15 seconds to not count as bounce
        },

        // Conversion funnel stages
        funnelStages: {
            LANDING: 'landing_page_view',
            ENGAGED: 'engaged_session',
            SCROLL_25: 'scroll_25_percent',
            SCROLL_50: 'scroll_50_percent',
            SCROLL_75: 'scroll_75_percent',
            SCROLL_100: 'scroll_100_percent',
            CTA_VISIBLE: 'cta_visible',
            CTA_CLICK: 'cta_clicked',
            FORM_VIEW: 'form_viewed',
            FORM_START: 'form_started',
            FORM_FIELD_1: 'form_field_email_filled',
            FORM_FIELD_2: 'form_field_company_filled',
            FORM_SUBMIT: 'form_submitted',
            THANK_YOU: 'thank_you_page'
        },

        // User properties
        userProperties: {
            visitor_id: null,
            session_id: null,
            session_count: 0,
            first_visit: null,
            last_visit: null,
            traffic_source: null,
            traffic_medium: null,
            traffic_campaign: null,
            device_category: null,
            browser: null,
            operating_system: null,
            screen_resolution: null,
            language: null,
            timezone: null
        },

        // Session data
        sessionData: {
            startTime: null,
            pageViews: 0,
            events: [],
            interactions: 0,
            maxScrollDepth: 0,
            timeOnPage: 0,
            engaged: false,
            bounced: true,
            conversionPath: []
        },

        // Initialize analytics
        init: function() {
            if (!this.config.trackingEnabled) return;
            
            console.log('[Analytics] Initializing tracking system...');
            
            // Initialize user properties
            this.initUserProperties();
            
            // Initialize session
            this.initSession();
            
            // Setup automatic tracking
            this.setupAutomaticTracking();
            
            // Setup enhanced measurement
            this.setupEnhancedMeasurement();
            
            // Initialize GA4 if not already loaded
            this.initGA4();
            
            console.log('[Analytics] Tracking system initialized');
        },

        // Initialize GA4
        initGA4: function() {
            if (typeof gtag === 'undefined') {
                // Load GA4 script
                const script = document.createElement('script');
                script.async = true;
                script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.ga4MeasurementId}`;
                document.head.appendChild(script);
                
                // Initialize dataLayer and gtag
                window.dataLayer = window.dataLayer || [];
                window.gtag = function() {
                    window.dataLayer.push(arguments);
                };
                window.gtag('js', new Date());
                window.gtag('config', this.config.ga4MeasurementId, {
                    send_page_view: false,
                    custom_map: {
                        'dimension1': 'visitor_id',
                        'dimension2': 'session_id',
                        'dimension3': 'ab_experiments'
                    }
                });
            }
        },

        // Initialize user properties
        initUserProperties: function() {
            // Get or create visitor ID
            this.userProperties.visitor_id = this.getOrCreateVisitorId();
            
            // Get session count
            this.userProperties.session_count = parseInt(localStorage.getItem('session_count') || '0') + 1;
            localStorage.setItem('session_count', this.userProperties.session_count);
            
            // Get first visit time
            if (!localStorage.getItem('first_visit')) {
                this.userProperties.first_visit = new Date().toISOString();
                localStorage.setItem('first_visit', this.userProperties.first_visit);
            } else {
                this.userProperties.first_visit = localStorage.getItem('first_visit');
            }
            
            // Update last visit
            this.userProperties.last_visit = new Date().toISOString();
            localStorage.setItem('last_visit', this.userProperties.last_visit);
            
            // Get traffic source
            this.parseTrafficSource();
            
            // Get device information
            this.getDeviceInfo();
        },

        // Initialize session
        initSession: function() {
            // Create session ID
            this.userProperties.session_id = this.generateUUID();
            sessionStorage.setItem('session_id', this.userProperties.session_id);
            
            // Initialize session data
            this.sessionData.startTime = Date.now();
            this.sessionData.pageViews = 1;
            
            // Track landing page
            this.trackFunnelStage(this.funnelStages.LANDING);
            
            // Set up session timeout
            this.setupSessionTimeout();
        },

        // Setup automatic tracking
        setupAutomaticTracking: function() {
            // Page view tracking
            this.trackPageView();
            
            // Scroll tracking
            this.setupScrollTracking();
            
            // Click tracking
            this.setupClickTracking();
            
            // Form tracking
            this.setupFormTracking();
            
            // Time tracking
            this.setupTimeTracking();
            
            // Visibility tracking
            this.setupVisibilityTracking();
            
            // Error tracking
            this.setupErrorTracking();
            
            // Exit tracking
            this.setupExitTracking();
        },

        // Setup enhanced measurement
        setupEnhancedMeasurement: function() {
            // Video tracking
            this.setupVideoTracking();
            
            // Download tracking
            this.setupDownloadTracking();
            
            // Outbound link tracking
            this.setupOutboundTracking();
            
            // Site search tracking
            this.setupSearchTracking();
            
            // File engagement tracking
            this.setupFileEngagement();
        },

        // Track page view
        trackPageView: function() {
            const pageData = {
                page_title: document.title,
                page_location: window.location.href,
                page_path: window.location.pathname,
                page_referrer: document.referrer,
                visitor_id: this.userProperties.visitor_id,
                session_id: this.userProperties.session_id,
                session_count: this.userProperties.session_count,
                traffic_source: this.userProperties.traffic_source,
                traffic_medium: this.userProperties.traffic_medium,
                traffic_campaign: this.userProperties.traffic_campaign,
                experiments: window.activeVariants || {}
            };
            
            this.sendEvent('page_view', pageData);
            
            // Update funnel
            this.updateConversionFunnel('page_view', pageData);
        },

        // Setup scroll tracking
        setupScrollTracking: function() {
            const milestones = [25, 50, 75, 100];
            const tracked = new Set();
            let ticking = false;
            
            const checkScroll = () => {
                const scrollPercentage = Math.round(
                    (window.scrollY + window.innerHeight) / 
                    document.documentElement.scrollHeight * 100
                );
                
                // Update max scroll depth
                if (scrollPercentage > this.sessionData.maxScrollDepth) {
                    this.sessionData.maxScrollDepth = scrollPercentage;
                }
                
                // Track milestones
                milestones.forEach(milestone => {
                    if (scrollPercentage >= milestone && !tracked.has(milestone)) {
                        tracked.add(milestone);
                        
                        const stageName = `SCROLL_${milestone}`;
                        if (this.funnelStages[stageName]) {
                            this.trackFunnelStage(this.funnelStages[stageName]);
                        }
                        
                        this.sendEvent('scroll', {
                            percent_scrolled: milestone,
                            experiments: window.activeVariants || {}
                        });
                    }
                });
                
                ticking = false;
            };
            
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(checkScroll);
                    ticking = true;
                }
            });
        },

        // Setup click tracking
        setupClickTracking: function() {
            document.addEventListener('click', (e) => {
                const target = e.target;
                
                // Track CTA clicks
                if (target.matches('.cta-button, .btn-primary, [data-track="cta"]')) {
                    this.trackFunnelStage(this.funnelStages.CTA_CLICK);
                    this.sendEvent('cta_click', {
                        button_text: target.textContent.trim(),
                        button_class: target.className,
                        button_id: target.id,
                        button_location: this.getElementLocation(target),
                        page_section: this.getPageSection(target),
                        time_to_click: Date.now() - this.sessionData.startTime,
                        experiments: window.activeVariants || {}
                    });
                }
                
                // Track navigation clicks
                if (target.matches('nav a, .navbar a')) {
                    this.sendEvent('navigation_click', {
                        link_text: target.textContent.trim(),
                        link_url: target.href,
                        experiments: window.activeVariants || {}
                    });
                }
                
                // Track demo interactions
                if (target.closest('.demo-section, .query-example, .interactive-demo')) {
                    this.sendEvent('demo_interaction', {
                        element_type: target.tagName,
                        element_class: target.className,
                        interaction_type: 'click',
                        experiments: window.activeVariants || {}
                    });
                }
                
                // Track social proof interactions
                if (target.closest('.testimonial, .case-study, .customer-logo')) {
                    this.sendEvent('social_proof_interaction', {
                        proof_type: target.closest('[data-proof-type]')?.dataset.proofType || 'unknown',
                        experiments: window.activeVariants || {}
                    });
                }
                
                // Update engagement
                this.updateEngagement();
            });
        },

        // Setup form tracking
        setupFormTracking: function() {
            const forms = document.querySelectorAll('form');
            
            forms.forEach(form => {
                const formId = form.id || 'unnamed_form';
                let formStarted = false;
                let fieldsCompleted = new Set();
                
                // Track form view (when form is visible)
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting && !form.dataset.viewed) {
                            form.dataset.viewed = 'true';
                            this.trackFunnelStage(this.funnelStages.FORM_VIEW);
                            this.sendEvent('form_view', {
                                form_id: formId,
                                experiments: window.activeVariants || {}
                            });
                        }
                    });
                }, { threshold: 0.5 });
                
                observer.observe(form);
                
                // Track form field interactions
                form.addEventListener('focusin', (e) => {
                    if (!formStarted) {
                        formStarted = true;
                        this.trackFunnelStage(this.funnelStages.FORM_START);
                        this.sendEvent('form_start', {
                            form_id: formId,
                            first_field: e.target.name || e.target.id,
                            time_to_start: Date.now() - this.sessionData.startTime,
                            experiments: window.activeVariants || {}
                        });
                    }
                    
                    // Track field focus
                    this.sendEvent('form_field_focus', {
                        form_id: formId,
                        field_name: e.target.name || e.target.id,
                        field_type: e.target.type,
                        experiments: window.activeVariants || {}
                    });
                });
                
                // Track field completion
                form.addEventListener('change', (e) => {
                    const fieldName = e.target.name || e.target.id;
                    if (!fieldsCompleted.has(fieldName)) {
                        fieldsCompleted.add(fieldName);
                        
                        // Track specific field completion for funnel
                        if (fieldName.includes('email')) {
                            this.trackFunnelStage(this.funnelStages.FORM_FIELD_1);
                        } else if (fieldName.includes('company') || fieldName.includes('name')) {
                            this.trackFunnelStage(this.funnelStages.FORM_FIELD_2);
                        }
                        
                        this.sendEvent('form_field_complete', {
                            form_id: formId,
                            field_name: fieldName,
                            fields_completed: fieldsCompleted.size,
                            experiments: window.activeVariants || {}
                        });
                    }
                });
                
                // Track form submission
                form.addEventListener('submit', (e) => {
                    this.trackFunnelStage(this.funnelStages.FORM_SUBMIT);
                    this.sendEvent('form_submit', {
                        form_id: formId,
                        fields_completed: fieldsCompleted.size,
                        time_to_complete: Date.now() - this.sessionData.startTime,
                        experiments: window.activeVariants || {},
                        conversion: true
                    });
                    
                    // Mark as converted
                    this.markConversion('form_submit', formId);
                });
            });
        },

        // Setup time tracking
        setupTimeTracking: function() {
            const timeIntervals = [10, 30, 60, 120, 300, 600]; // seconds
            
            timeIntervals.forEach(interval => {
                setTimeout(() => {
                    this.sendEvent('time_on_page', {
                        duration_seconds: interval,
                        engaged: this.sessionData.engaged,
                        page_path: window.location.pathname,
                        experiments: window.activeVariants || {}
                    });
                    
                    // Mark as engaged after threshold
                    if (interval * 1000 >= this.config.engagementThreshold && !this.sessionData.engaged) {
                        this.sessionData.engaged = true;
                        this.trackFunnelStage(this.funnelStages.ENGAGED);
                        this.sendEvent('user_engagement', {
                            engagement_time_msec: interval * 1000,
                            experiments: window.activeVariants || {}
                        });
                    }
                }, interval * 1000);
            });
        },

        // Setup visibility tracking for CTA
        setupVisibilityTracking: function() {
            const ctaElements = document.querySelectorAll('.cta-button, .btn-primary, [data-track="cta"]');
            const trackedElements = new Set();
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !trackedElements.has(entry.target)) {
                        trackedElements.add(entry.target);
                        
                        if (!this.sessionData.conversionPath.includes(this.funnelStages.CTA_VISIBLE)) {
                            this.trackFunnelStage(this.funnelStages.CTA_VISIBLE);
                        }
                        
                        this.sendEvent('element_visibility', {
                            element_type: 'cta',
                            element_text: entry.target.textContent.trim(),
                            time_to_view: Date.now() - this.sessionData.startTime,
                            experiments: window.activeVariants || {}
                        });
                    }
                });
            }, { threshold: 0.5 });
            
            ctaElements.forEach(element => observer.observe(element));
        },

        // Setup video tracking
        setupVideoTracking: function() {
            const videos = document.querySelectorAll('video');
            
            videos.forEach(video => {
                let hasStarted = false;
                let lastProgress = 0;
                
                video.addEventListener('play', () => {
                    if (!hasStarted) {
                        hasStarted = true;
                        this.sendEvent('video_start', {
                            video_title: video.dataset.title || 'Demo Video',
                            video_duration: video.duration,
                            experiments: window.activeVariants || {}
                        });
                    }
                });
                
                video.addEventListener('timeupdate', () => {
                    const progress = Math.round((video.currentTime / video.duration) * 100);
                    const milestones = [25, 50, 75, 90];
                    
                    milestones.forEach(milestone => {
                        if (progress >= milestone && lastProgress < milestone) {
                            this.sendEvent('video_progress', {
                                video_title: video.dataset.title || 'Demo Video',
                                video_percent: milestone,
                                experiments: window.activeVariants || {}
                            });
                        }
                    });
                    
                    lastProgress = progress;
                });
                
                video.addEventListener('ended', () => {
                    this.sendEvent('video_complete', {
                        video_title: video.dataset.title || 'Demo Video',
                        experiments: window.activeVariants || {}
                    });
                });
            });
        },

        // Setup download tracking
        setupDownloadTracking: function() {
            document.addEventListener('click', (e) => {
                const link = e.target.closest('a[download], a[href$=".pdf"], a[href$=".doc"], a[href$=".xlsx"]');
                if (link) {
                    this.sendEvent('file_download', {
                        file_name: link.download || link.href.split('/').pop(),
                        file_extension: link.href.split('.').pop(),
                        link_text: link.textContent.trim(),
                        experiments: window.activeVariants || {}
                    });
                }
            });
        },

        // Setup outbound tracking
        setupOutboundTracking: function() {
            document.addEventListener('click', (e) => {
                const link = e.target.closest('a[href^="http"]');
                if (link && !link.href.includes(window.location.hostname)) {
                    this.sendEvent('outbound_click', {
                        link_url: link.href,
                        link_text: link.textContent.trim(),
                        link_domain: new URL(link.href).hostname,
                        experiments: window.activeVariants || {}
                    });
                }
            });
        },

        // Setup search tracking
        setupSearchTracking: function() {
            const searchInputs = document.querySelectorAll('input[type="search"], input[name*="search"], input[id*="search"]');
            
            searchInputs.forEach(input => {
                let searchTimer;
                
                input.addEventListener('input', () => {
                    clearTimeout(searchTimer);
                    searchTimer = setTimeout(() => {
                        if (input.value.length > 2) {
                            this.sendEvent('site_search', {
                                search_term: input.value,
                                search_location: input.id || input.name,
                                experiments: window.activeVariants || {}
                            });
                        }
                    }, 1000);
                });
            });
        },

        // Setup file engagement
        setupFileEngagement: function() {
            // Track ROI calculator usage
            if (window.ROICalculator) {
                window.ROICalculator.addEventListener('calculate', (data) => {
                    this.sendEvent('roi_calculator_use', {
                        inputs: data.inputs,
                        result: data.result,
                        experiments: window.activeVariants || {}
                    });
                });
            }
            
            // Track interactive demo usage
            document.addEventListener('demo-query-submitted', (e) => {
                this.sendEvent('demo_query_submitted', {
                    query: e.detail.query,
                    query_type: e.detail.type,
                    experiments: window.activeVariants || {}
                });
            });
        },

        // Setup error tracking
        setupErrorTracking: function() {
            window.addEventListener('error', (e) => {
                this.sendEvent('javascript_error', {
                    error_message: e.message,
                    error_source: e.filename,
                    error_line: e.lineno,
                    error_column: e.colno,
                    page_path: window.location.pathname
                });
            });
        },

        // Setup exit tracking
        setupExitTracking: function() {
            let exitIntentShown = false;
            
            // Track mouse leave (exit intent)
            document.addEventListener('mouseout', (e) => {
                if (e.clientY <= 0 && !exitIntentShown) {
                    exitIntentShown = true;
                    this.sendEvent('exit_intent', {
                        time_on_page: Date.now() - this.sessionData.startTime,
                        max_scroll_depth: this.sessionData.maxScrollDepth,
                        experiments: window.activeVariants || {}
                    });
                }
            });
            
            // Track page unload
            window.addEventListener('beforeunload', () => {
                const sessionDuration = Date.now() - this.sessionData.startTime;
                
                // Determine if bounced
                if (sessionDuration < this.config.bounceThreshold && this.sessionData.interactions < 2) {
                    this.sessionData.bounced = true;
                } else {
                    this.sessionData.bounced = false;
                }
                
                this.sendEvent('session_end', {
                    session_duration: sessionDuration,
                    page_views: this.sessionData.pageViews,
                    events_count: this.sessionData.events.length,
                    max_scroll_depth: this.sessionData.maxScrollDepth,
                    engaged: this.sessionData.engaged,
                    bounced: this.sessionData.bounced,
                    conversion_path: this.sessionData.conversionPath,
                    experiments: window.activeVariants || {}
                });
            });
        },

        // Track funnel stage
        trackFunnelStage: function(stage) {
            if (!this.sessionData.conversionPath.includes(stage)) {
                this.sessionData.conversionPath.push(stage);
                
                this.sendEvent('funnel_step', {
                    funnel_name: 'main_conversion',
                    step_name: stage,
                    step_number: this.sessionData.conversionPath.length,
                    time_since_start: Date.now() - this.sessionData.startTime,
                    experiments: window.activeVariants || {}
                });
            }
        },

        // Update conversion funnel
        updateConversionFunnel: function(eventName, data) {
            // Store in session for funnel analysis
            const funnelData = {
                event: eventName,
                timestamp: Date.now(),
                data: data
            };
            
            this.sessionData.events.push(funnelData);
            
            // Send to analytics backend for real-time funnel tracking
            if (window.location.hostname !== 'localhost') {
                fetch('/api/analytics/funnel', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        visitor_id: this.userProperties.visitor_id,
                        session_id: this.userProperties.session_id,
                        funnel_data: funnelData
                    })
                }).catch(() => {});
            }
        },

        // Mark conversion
        markConversion: function(conversionType, conversionValue) {
            this.setCookie('datasense_converted', 'true', 365);
            
            this.sendEvent('conversion', {
                conversion_type: conversionType,
                conversion_value: conversionValue,
                conversion_path: this.sessionData.conversionPath,
                time_to_convert: Date.now() - this.sessionData.startTime,
                session_count: this.userProperties.session_count,
                experiments: window.activeVariants || {}
            });
            
            // Track to thank you page
            if (conversionType === 'form_submit') {
                setTimeout(() => {
                    this.trackFunnelStage(this.funnelStages.THANK_YOU);
                }, 100);
            }
        },

        // Update engagement
        updateEngagement: function() {
            this.sessionData.interactions++;
            
            // Remove bounce flag after multiple interactions
            if (this.sessionData.interactions >= 2) {
                this.sessionData.bounced = false;
            }
        },

        // Send event to GA4
        sendEvent: function(eventName, parameters = {}) {
            // Add common parameters
            const eventData = {
                ...parameters,
                visitor_id: this.userProperties.visitor_id,
                session_id: this.userProperties.session_id,
                timestamp: new Date().toISOString()
            };
            
            // Send to GA4
            if (typeof gtag !== 'undefined') {
                gtag('event', eventName, eventData);
            }
            
            // Log in debug mode
            if (this.config.debugMode || window.location.hostname === 'localhost') {
                console.log('[Analytics Event]', eventName, eventData);
            }
            
            // Store event
            this.sessionData.events.push({
                name: eventName,
                data: eventData,
                timestamp: Date.now()
            });
        },

        // Parse traffic source
        parseTrafficSource: function() {
            const urlParams = new URLSearchParams(window.location.search);
            
            // UTM parameters
            this.userProperties.traffic_source = urlParams.get('utm_source') || 
                                                 urlParams.get('ref') || 
                                                 this.getReferrerSource();
            this.userProperties.traffic_medium = urlParams.get('utm_medium') || 'organic';
            this.userProperties.traffic_campaign = urlParams.get('utm_campaign') || 'none';
        },

        // Get referrer source
        getReferrerSource: function() {
            if (!document.referrer) return 'direct';
            
            const referrer = new URL(document.referrer);
            const hostname = referrer.hostname;
            
            // Social media
            if (hostname.includes('facebook.com') || hostname.includes('fb.com')) return 'facebook';
            if (hostname.includes('twitter.com') || hostname.includes('t.co')) return 'twitter';
            if (hostname.includes('linkedin.com')) return 'linkedin';
            if (hostname.includes('instagram.com')) return 'instagram';
            
            // Search engines
            if (hostname.includes('google.')) return 'google';
            if (hostname.includes('bing.com')) return 'bing';
            if (hostname.includes('yahoo.')) return 'yahoo';
            if (hostname.includes('duckduckgo.com')) return 'duckduckgo';
            
            return hostname;
        },

        // Get device info
        getDeviceInfo: function() {
            // Device category
            const width = window.innerWidth;
            if (width < 768) {
                this.userProperties.device_category = 'mobile';
            } else if (width < 1024) {
                this.userProperties.device_category = 'tablet';
            } else {
                this.userProperties.device_category = 'desktop';
            }
            
            // Browser
            const userAgent = navigator.userAgent;
            if (userAgent.includes('Chrome')) this.userProperties.browser = 'Chrome';
            else if (userAgent.includes('Safari')) this.userProperties.browser = 'Safari';
            else if (userAgent.includes('Firefox')) this.userProperties.browser = 'Firefox';
            else if (userAgent.includes('Edge')) this.userProperties.browser = 'Edge';
            else this.userProperties.browser = 'Other';
            
            // Operating system
            if (userAgent.includes('Windows')) this.userProperties.operating_system = 'Windows';
            else if (userAgent.includes('Mac')) this.userProperties.operating_system = 'macOS';
            else if (userAgent.includes('Linux')) this.userProperties.operating_system = 'Linux';
            else if (userAgent.includes('Android')) this.userProperties.operating_system = 'Android';
            else if (userAgent.includes('iOS')) this.userProperties.operating_system = 'iOS';
            else this.userProperties.operating_system = 'Other';
            
            // Screen resolution
            this.userProperties.screen_resolution = `${window.screen.width}x${window.screen.height}`;
            
            // Language
            this.userProperties.language = navigator.language || navigator.userLanguage;
            
            // Timezone
            this.userProperties.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        },

        // Setup session timeout
        setupSessionTimeout: function() {
            let timeout;
            
            const resetTimeout = () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    // Session expired, create new session on next interaction
                    this.initSession();
                }, this.config.sessionTimeout);
            };
            
            // Reset timeout on any interaction
            ['click', 'scroll', 'keypress', 'mousemove'].forEach(event => {
                document.addEventListener(event, resetTimeout);
            });
            
            resetTimeout();
        },

        // Get element location
        getElementLocation: function(element) {
            const rect = element.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (rect.top + scrollTop < window.innerHeight) {
                return 'above_fold';
            } else {
                return 'below_fold';
            }
        },

        // Get page section
        getPageSection: function(element) {
            const section = element.closest('section, [data-section]');
            if (section) {
                return section.dataset.section || section.className || 'unknown';
            }
            return 'unknown';
        },

        // Utility methods
        getOrCreateVisitorId: function() {
            let visitorId = this.getCookie('datasense_visitor_id');
            if (!visitorId) {
                visitorId = this.generateUUID();
                this.setCookie('datasense_visitor_id', visitorId, 365);
            }
            return visitorId;
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

        // Public API
        publicAPI: {
            // Track custom event
            track: (eventName, parameters) => {
                AnalyticsTracker.sendEvent(eventName, parameters);
            },
            
            // Get visitor ID
            getVisitorId: () => AnalyticsTracker.userProperties.visitor_id,
            
            // Get session ID
            getSessionId: () => AnalyticsTracker.userProperties.session_id,
            
            // Get funnel progress
            getFunnelProgress: () => AnalyticsTracker.sessionData.conversionPath,
            
            // Set user property
            setUserProperty: (name, value) => {
                AnalyticsTracker.userProperties[name] = value;
            },
            
            // Enable debug mode
            enableDebug: () => {
                AnalyticsTracker.config.debugMode = true;
                console.log('[Analytics] Debug mode enabled');
            }
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => AnalyticsTracker.init());
    } else {
        AnalyticsTracker.init();
    }

    // Expose public API
    window.Analytics = AnalyticsTracker.publicAPI;

})(window);