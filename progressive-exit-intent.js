// Progressive Exit Intent System with Engagement Tracking
(function() {
    'use strict';

    // User Engagement Tracking Module
    window.UserEngagement = {
        score: 0,
        signals: {
            pageViews: 0,
            demoInteractions: 0,
            industryChanges: 0,
            timeOnPage: 0,
            scrollDepth: 0,
            credentialsCopied: false,
            iframeInteracted: false,
            queriesViewed: [],
            formInteractions: 0,
            ctaClicks: 0,
            videoPlays: 0,
            faqExpanded: 0
        },
        
        // Initialize engagement tracking
        init: function() {
            // Load existing signals from sessionStorage
            this.loadSignals();
            
            // Start tracking time on page
            this.startTimeTracking();
            
            // Initialize scroll depth tracking
            this.initScrollDepthTracking();
            
            // Track page view
            this.trackSignal('pageViews');
            
            console.log('[UserEngagement] Initialized with score:', this.score);
        },
        
        // Load saved signals from sessionStorage
        loadSignals: function() {
            try {
                const savedSignals = sessionStorage.getItem('engagementSignals');
                const savedScore = sessionStorage.getItem('engagementScore');
                
                if (savedSignals) {
                    this.signals = JSON.parse(savedSignals);
                }
                if (savedScore) {
                    this.score = parseInt(savedScore);
                }
            } catch (e) {
                console.log('[UserEngagement] Could not load saved signals:', e);
            }
        },
        
        // Track an engagement signal
        trackSignal: function(signal, value = 1) {
            if (signal === 'queriesViewed' && typeof value === 'string') {
                // Handle array signals
                if (!this.signals.queriesViewed.includes(value)) {
                    this.signals.queriesViewed.push(value);
                }
            } else if (typeof this.signals[signal] === 'boolean') {
                // Handle boolean signals
                this.signals[signal] = value;
            } else {
                // Handle numeric signals
                this.signals[signal] = (this.signals[signal] || 0) + value;
            }
            
            this.calculateScore();
            this.saveSignals();
            
            console.log(`[UserEngagement] Signal tracked: ${signal} = ${value}, New score: ${this.score}`);
        },
        
        // Calculate engagement score based on weighted signals
        calculateScore: function() {
            // Weighted scoring based on intent signals
            this.score = 
                (this.signals.pageViews * 2) +
                (this.signals.demoInteractions * 5) +
                (this.signals.industryChanges * 10) +
                (this.signals.credentialsCopied ? 20 : 0) +
                (this.signals.iframeInteracted ? 15 : 0) +
                (this.signals.scrollDepth > 70 ? 10 : 0) +
                (this.signals.scrollDepth > 50 ? 5 : 0) +
                (Math.min(this.signals.timeOnPage / 30, 10) * 3) + // Max 10 points for time
                (this.signals.queriesViewed.length * 3) +
                (this.signals.formInteractions * 8) +
                (this.signals.ctaClicks * 7) +
                (this.signals.videoPlays * 12) +
                (this.signals.faqExpanded * 2);
            
            return this.score;
        },
        
        // Save signals to sessionStorage
        saveSignals: function() {
            try {
                sessionStorage.setItem('engagementSignals', JSON.stringify(this.signals));
                sessionStorage.setItem('engagementScore', this.score.toString());
            } catch (e) {
                console.log('[UserEngagement] Could not save signals:', e);
            }
        },
        
        // Get engagement level based on score
        getEngagementLevel: function() {
            if (this.score >= 50) return 'hot';
            if (this.score >= 25) return 'warm';
            return 'cold';
        },
        
        // Start tracking time on page
        startTimeTracking: function() {
            // Track time in 30-second increments
            setInterval(() => {
                this.trackSignal('timeOnPage', 30);
            }, 30000);
        },
        
        // Initialize scroll depth tracking
        initScrollDepthTracking: function() {
            let maxScrollDepth = 0;
            let scrollTimeout;
            
            const trackScrollDepth = () => {
                const scrollPercent = Math.round(
                    (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
                );
                
                if (scrollPercent > maxScrollDepth) {
                    maxScrollDepth = scrollPercent;
                    this.signals.scrollDepth = maxScrollDepth;
                    this.calculateScore();
                    this.saveSignals();
                }
            };
            
            window.addEventListener('scroll', () => {
                if (scrollTimeout) clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(trackScrollDepth, 200);
            }, { passive: true });
        },
        
        // Reset engagement tracking (for new sessions)
        reset: function() {
            this.score = 0;
            this.signals = {
                pageViews: 0,
                demoInteractions: 0,
                industryChanges: 0,
                timeOnPage: 0,
                scrollDepth: 0,
                credentialsCopied: false,
                iframeInteracted: false,
                queriesViewed: [],
                formInteractions: 0,
                ctaClicks: 0,
                videoPlays: 0,
                faqExpanded: 0
            };
            this.saveSignals();
            console.log('[UserEngagement] Reset complete');
        }
    };

    // Progressive Exit Content Strategy
    window.ProgressiveExitContent = {
        // Get progressive exit content based on engagement and view count
        getContent: function() {
            const engagementLevel = UserEngagement.getEngagementLevel();
            const viewCount = parseInt(sessionStorage.getItem('exitPopupViewCount') || 0);
            const currentIndustry = sessionStorage.getItem('currentIndustry') || 'general';
            
            console.log(`[ProgressiveExitContent] Level: ${engagementLevel}, Views: ${viewCount}, Industry: ${currentIndustry}`);
            
            // Progressive content based on engagement AND view count
            const progressiveContent = {
                cold: {
                    0: 'roi_calculator',      // First exit: ROI calculator
                    1: 'value_proposition',    // Second: Strong value prop
                    2: 'free_trial'           // Third: Free trial offer
                },
                warm: {
                    0: 'industry_case_study',  // First: Industry-specific case study
                    1: 'demo_video',           // Second: Demo video
                    2: 'calendar_booking'      // Third: Book a call
                },
                hot: {
                    0: 'limited_offer',        // First: Limited time discount
                    1: 'calendar_urgent',      // Second: Urgent calendar booking
                    2: 'direct_contact'        // Third: Direct contact form
                }
            };
            
            const contentType = progressiveContent[engagementLevel][Math.min(viewCount, 2)];
            return this.getContentByType(contentType, currentIndustry);
        },
        
        // Get specific content configuration by type
        getContentByType: function(type, industry) {
            const contentMap = {
                roi_calculator: {
                    type: 'roi_calculator',
                    showCalculator: true,
                    title: "Calculate Your ROI Before You Go",
                    subtitle: "See exactly how much DataSense could save your business",
                    hideTestimonial: false,
                    ctaText: "Claim Your ROI Now"
                },
                value_proposition: {
                    type: 'value_proposition',
                    showCalculator: false,
                    title: "Wait! You're Leaving Money on the Table",
                    subtitle: "Businesses like yours increased revenue by 47% in 30 days",
                    hideTestimonial: false,
                    showBulletPoints: true,
                    bullets: [
                        "Get insights in 30 seconds, not 30 days",
                        "No technical skills required",
                        "Setup in under 2 hours"
                    ],
                    ctaText: "Get My Free Analysis"
                },
                free_trial: {
                    type: 'free_trial',
                    showCalculator: false,
                    title: "Start Your Free 14-Day Trial",
                    subtitle: "No credit card • Full access • Cancel anytime",
                    hideTestimonial: false,
                    showGuarantee: true,
                    guaranteeText: "100% money-back guarantee if you don't see results",
                    ctaText: "Start Free Trial Now"
                },
                industry_case_study: {
                    type: 'industry_case_study',
                    showCalculator: false,
                    showTestimonial: true,
                    title: `See How ${this.getIndustryName(industry)} Businesses Increased Revenue 47%`,
                    subtitle: "Real results from businesses just like yours",
                    testimonialFocus: true,
                    ctaText: `Get ${this.getIndustryName(industry)} Insights`
                },
                demo_video: {
                    type: 'demo_video',
                    showCalculator: false,
                    showVideo: true,
                    title: "Watch a 2-Minute Demo First",
                    subtitle: "See DataSense in action for your industry",
                    videoUrl: `/demos/${industry}-demo.mp4`,
                    ctaText: "Watch Demo Now"
                },
                calendar_booking: {
                    type: 'calendar_booking',
                    showCalculator: false,
                    showCalendar: true,
                    title: "Let's Show You How It Works",
                    subtitle: "Book a personalized 15-minute demo",
                    calendlyUrl: `https://calendly.com/datasense/demo?industry=${industry}`,
                    urgency: "Only 3 slots left this week",
                    ctaText: "Book My Demo"
                },
                limited_offer: {
                    type: 'limited_offer',
                    showCalculator: false,
                    showOffer: true,
                    title: "🔥 You Qualify for 30% Off Beta Pricing",
                    subtitle: "Based on your engagement, you're a perfect fit",
                    offerDetails: "Limited to next 48 hours • No credit card required",
                    originalPrice: "$499",
                    discountedPrice: "$349",
                    ctaText: "Claim My Discount"
                },
                calendar_urgent: {
                    type: 'calendar_urgent',
                    showCalculator: false,
                    showCalendar: true,
                    title: "⚡ Last Chance: Book Your Strategy Call",
                    subtitle: "I've reserved a spot just for you",
                    personalizedMessage: "Hi, I'm Sarah from DataSense. I noticed you've been exploring our platform. I'd love to show you exactly how we can help your business.",
                    calendlyUrl: `https://calendly.com/datasense/priority-demo?industry=${industry}`,
                    ctaText: "Reserve My Spot"
                },
                direct_contact: {
                    type: 'direct_contact',
                    showCalculator: false,
                    showContactForm: true,
                    title: "Let's Talk About Your Specific Needs",
                    subtitle: "You've shown strong interest. Let's discuss a custom solution.",
                    formFields: ['name', 'email', 'phone', 'company'],
                    ctaText: "Get Custom Proposal"
                }
            };
            
            return contentMap[type] || contentMap.roi_calculator;
        },
        
        // Get industry display name
        getIndustryName: function(industry) {
            const industryNames = {
                ecommerce: 'E-commerce',
                saas: 'SaaS',
                services: 'Service',
                restaurant: 'Restaurant',
                healthcare: 'Healthcare',
                general: 'Business'
            };
            return industryNames[industry] || 'Business';
        },
        
        // Apply content to popup
        applyContent: function(content) {
            const popup = document.getElementById('exit-popup');
            if (!popup) return;
            
            // Update title and subtitle
            const titleEl = popup.querySelector('.exit-popup-title');
            const subtitleEl = popup.querySelector('.exit-popup-subtitle');
            
            if (titleEl) titleEl.textContent = content.title;
            if (subtitleEl) subtitleEl.textContent = content.subtitle;
            
            // Show/hide calculator
            const calculator = popup.querySelector('.roi-calculator');
            if (calculator) {
                calculator.style.display = content.showCalculator ? 'block' : 'none';
            }
            
            // Update CTA button
            const ctaBtn = popup.querySelector('.btn-primary');
            if (ctaBtn) {
                ctaBtn.textContent = content.ctaText;
            }
            
            // Add any additional content elements based on type
            this.addDynamicContent(popup, content);
            
            // Track content shown
            if (window.DataSenseTracking) {
                window.DataSenseTracking.trackEvent('progressive_exit_content_shown', {
                    content_type: content.type,
                    engagement_level: UserEngagement.getEngagementLevel(),
                    engagement_score: UserEngagement.score,
                    view_count: parseInt(sessionStorage.getItem('exitPopupViewCount') || 0)
                });
            }
        },
        
        // Add dynamic content elements based on content type
        addDynamicContent: function(popup, content) {
            const contentArea = popup.querySelector('.exit-popup-content');
            if (!contentArea) return;
            
            // Remove any existing dynamic content
            const existingDynamic = contentArea.querySelector('.dynamic-content');
            if (existingDynamic) {
                existingDynamic.remove();
            }
            
            // Create new dynamic content container
            const dynamicDiv = document.createElement('div');
            dynamicDiv.className = 'dynamic-content';
            
            // Add content based on type
            if (content.showBulletPoints && content.bullets) {
                const bulletsHtml = content.bullets.map(bullet => 
                    `<li style="margin: 8px 0; color: rgba(255,255,255,0.9);">✓ ${bullet}</li>`
                ).join('');
                dynamicDiv.innerHTML = `<ul style="list-style: none; padding: 20px 0; margin: 0;">${bulletsHtml}</ul>`;
            }
            
            if (content.showGuarantee && content.guaranteeText) {
                dynamicDiv.innerHTML = `
                    <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); 
                                border-radius: 8px; padding: 12px; margin: 20px 0; text-align: center;">
                        <span style="color: #10b981; font-weight: 600;">✓ ${content.guaranteeText}</span>
                    </div>
                `;
            }
            
            if (content.showOffer && content.offerDetails) {
                dynamicDiv.innerHTML = `
                    <div style="text-align: center; margin: 20px 0;">
                        <div style="display: inline-block; position: relative;">
                            <span style="text-decoration: line-through; color: rgba(255,255,255,0.5); font-size: 20px;">
                                ${content.originalPrice}
                            </span>
                            <span style="color: #10b981; font-size: 32px; font-weight: bold; margin-left: 10px;">
                                ${content.discountedPrice}
                            </span>
                            <span style="background: #ef4444; color: white; padding: 4px 8px; border-radius: 4px; 
                                       font-size: 12px; position: absolute; top: -10px; right: -40px;">
                                SAVE 30%
                            </span>
                        </div>
                        <p style="color: rgba(255,255,255,0.7); font-size: 14px; margin-top: 10px;">
                            ${content.offerDetails}
                        </p>
                    </div>
                `;
            }
            
            if (content.personalizedMessage) {
                dynamicDiv.innerHTML = `
                    <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 16px; margin: 20px 0;">
                        <p style="color: rgba(255,255,255,0.9); font-style: italic; margin: 0;">
                            "${content.personalizedMessage}"
                        </p>
                    </div>
                `;
            }
            
            // Insert dynamic content before the calculator or CTA
            const calculator = contentArea.querySelector('.roi-calculator');
            if (calculator) {
                contentArea.insertBefore(dynamicDiv, calculator);
            } else {
                const ctaBtn = contentArea.querySelector('.btn-primary');
                if (ctaBtn && ctaBtn.parentElement) {
                    ctaBtn.parentElement.insertBefore(dynamicDiv, ctaBtn);
                }
            }
        }
    };

    // Smart Reset Logic
    window.SmartExitReset = {
        // Check if we should reset the exit popup counter
        shouldReset: function() {
            const viewCount = parseInt(sessionStorage.getItem('exitPopupViewCount') || 0);
            const lastShownTime = parseInt(sessionStorage.getItem('lastExitPopupTime') || 0);
            const timeSinceLastPopup = Date.now() - lastShownTime;
            
            // Reset conditions
            const resetConditions = {
                industryChanged: UserEngagement.signals.industryChanges > 0,
                timeElapsed: timeSinceLastPopup > 300000, // 5 minutes
                highEngagement: UserEngagement.score > 50,
                firstTime: viewCount === 0,
                maxViewsReached: viewCount >= 3
            };
            
            // Log reset conditions for debugging
            console.log('[SmartExitReset] Conditions:', resetConditions);
            
            // Reset if any condition is met (except maxViewsReached which prevents showing)
            const shouldReset = resetConditions.industryChanged || 
                              resetConditions.timeElapsed || 
                              resetConditions.highEngagement || 
                              resetConditions.firstTime;
            
            // Don't show if max views reached and no reset condition met
            if (resetConditions.maxViewsReached && !shouldReset) {
                console.log('[SmartExitReset] Max views reached, not showing popup');
                return false;
            }
            
            return shouldReset;
        },
        
        // Reset the popup counter if conditions are met
        resetIfNeeded: function() {
            if (this.shouldReset()) {
                const currentCount = parseInt(sessionStorage.getItem('exitPopupViewCount') || 0);
                if (currentCount >= 3) {
                    sessionStorage.setItem('exitPopupViewCount', '0');
                    console.log('[SmartExitReset] Counter reset due to smart conditions');
                }
            }
        }
    };

    // Enhanced Exit Popup Manager
    window.EnhancedExitPopup = {
        // Show exit popup with progressive content
        show: function(triggerType = 'mouse_leave') {
            // Check smart reset conditions
            SmartExitReset.resetIfNeeded();
            
            const viewCount = parseInt(sessionStorage.getItem('exitPopupViewCount') || 0);
            const lastShownTime = parseInt(sessionStorage.getItem('lastExitPopupTime') || 0);
            const timeSinceLastPopup = Date.now() - lastShownTime;
            
            // Check if we should show the popup
            if (viewCount >= 3 && !SmartExitReset.shouldReset()) {
                console.log('[EnhancedExitPopup] Max popups reached for this session');
                return false;
            }
            
            // Get and apply progressive content
            const content = ProgressiveExitContent.getContent();
            ProgressiveExitContent.applyContent(content);
            
            // Update counters
            sessionStorage.setItem('exitPopupViewCount', (viewCount + 1).toString());
            sessionStorage.setItem('lastExitPopupTime', Date.now().toString());
            
            // Show popup
            const overlay = document.getElementById('exit-popup-overlay');
            if (overlay) {
                overlay.style.display = 'block';
                
                // Track with full context
                if (window.DataSenseTracking) {
                    window.DataSenseTracking.trackEvent('progressive_exit_shown', {
                        trigger_type: triggerType,
                        view_count: viewCount + 1,
                        engagement_level: UserEngagement.getEngagementLevel(),
                        engagement_score: UserEngagement.score,
                        content_type: content.type,
                        industry: sessionStorage.getItem('currentIndustry'),
                        time_since_last: timeSinceLastPopup
                    });
                }
            }
            
            return true;
        }
    };

    // Initialize engagement tracking when DOM is ready
    function init() {
        console.log('[ProgressiveExitIntent] Initializing...');
        
        // Initialize UserEngagement
        UserEngagement.init();
        
        // Set up engagement signal tracking throughout the page
        setupEngagementTracking();
        
        // Integrate with existing exit intent system
        integrateWithExistingSystem();
        
        console.log('[ProgressiveExitIntent] Initialization complete');
    }

    // Set up comprehensive engagement tracking
    function setupEngagementTracking() {
        // Track demo interactions
        document.addEventListener('click', (e) => {
            // Query buttons in demo
            if (e.target.closest('.query-btn')) {
                UserEngagement.trackSignal('demoInteractions');
                const queryText = e.target.textContent;
                if (queryText) {
                    UserEngagement.trackSignal('queriesViewed', queryText);
                }
            }
            
            // Copy credentials button
            if (e.target.closest('.copy-btn')) {
                UserEngagement.trackSignal('credentialsCopied', true);
            }
            
            // CTA buttons
            if (e.target.closest('.btn-primary, .btn-secondary')) {
                UserEngagement.trackSignal('ctaClicks');
            }
            
            // FAQ items
            if (e.target.closest('.faq-item')) {
                UserEngagement.trackSignal('faqExpanded');
            }
        });
        
        // Track form interactions
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('focusin', (e) => {
                if (e.target.matches('input, select, textarea')) {
                    UserEngagement.trackSignal('formInteractions');
                }
            }, { once: true }); // Only track first interaction
        });
        
        // Track iframe interactions
        const iframe = document.getElementById('snapclass-demo-iframe');
        if (iframe) {
            // Track when iframe is clicked/focused
            let iframeInteracted = false;
            
            const trackIframeInteraction = () => {
                if (!iframeInteracted) {
                    UserEngagement.trackSignal('iframeInteracted', true);
                    iframeInteracted = true;
                }
            };
            
            // Use a transparent overlay to detect clicks
            const iframeContainer = iframe.parentElement;
            if (iframeContainer) {
                iframeContainer.addEventListener('click', trackIframeInteraction);
                iframeContainer.addEventListener('mouseenter', () => {
                    // Track hover as light engagement
                    if (!iframeInteracted) {
                        UserEngagement.trackSignal('demoInteractions', 0.5);
                    }
                });
            }
        }
        
        // Track video plays
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            video.addEventListener('play', () => {
                UserEngagement.trackSignal('videoPlays');
            }, { once: true });
        });
        
        // Track industry changes (integrate with existing industry switcher)
        const industrySelectors = document.querySelectorAll('[data-industry]');
        industrySelectors.forEach(selector => {
            selector.addEventListener('click', () => {
                UserEngagement.trackSignal('industryChanges');
            });
        });
        
        // Listen for custom industry change events
        document.addEventListener('industryChanged', (e) => {
            UserEngagement.trackSignal('industryChanges');
            console.log('[EngagementTracking] Industry changed to:', e.detail);
        });
    }

    // Integrate with existing exit intent system
    function integrateWithExistingSystem() {
        // Override the existing showExitPopup function if it exists
        if (window.showExitPopup) {
            const originalShowExitPopup = window.showExitPopup;
            window.showExitPopup = function(triggerType) {
                // Use our enhanced system
                return EnhancedExitPopup.show(triggerType);
            };
        }
        
        // Make our system available globally
        window.UserEngagement = UserEngagement;
        window.ProgressiveExitContent = ProgressiveExitContent;
        window.SmartExitReset = SmartExitReset;
        window.EnhancedExitPopup = EnhancedExitPopup;
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();