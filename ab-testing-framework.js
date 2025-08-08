// A/B Testing Framework for Exit Intent Popup
(function() {
    'use strict';

    // A/B Testing Framework
    window.ExitIntentAB = {
        // Test configurations
        tests: {
            timing: {
                control: 0,
                variant1: 3000,
                variant2: 5000,
                variant3: 20000
            },
            calculator: {
                control: { revenue: 50000, hours: 40 },
                variant1: { revenue: 100000, hours: 60 },
                variant2: { revenue: 25000, hours: 20 },
                variant3: 'dynamic'
            },
            design: {
                control: 'roi-calculator',
                variant1: 'simple-email',
                variant2: 'video-testimonial',
                variant3: 'discount-offer'
            }
        },
        
        // Session tracking
        sessionData: {},
        
        // Initialize the A/B testing framework
        init: function() {
            // Load existing session data if available
            this.loadSessionData();
            
            // Set up test variants for this session
            this.setupVariants();
            
            // Log initialization
            this.debugLog('A/B Testing Framework initialized', this.sessionData);
        },
        
        // Load session data from storage
        loadSessionData: function() {
            try {
                const stored = sessionStorage.getItem('ab_session_data');
                if (stored) {
                    this.sessionData = JSON.parse(stored);
                }
            } catch (e) {
                this.debugLog('Could not load session data:', e);
            }
        },
        
        // Save session data to storage
        saveSessionData: function() {
            try {
                sessionStorage.setItem('ab_session_data', JSON.stringify(this.sessionData));
            } catch (e) {
                this.debugLog('Could not save session data:', e);
            }
        },
        
        // Set up variants for all tests
        setupVariants: function() {
            Object.keys(this.tests).forEach(testName => {
                if (!this.sessionData[testName]) {
                    this.sessionData[testName] = {
                        variant: this.selectVariant(testName),
                        timestamp: Date.now(),
                        triggered: false,
                        converted: false
                    };
                }
            });
            this.saveSessionData();
        },
        
        // Select a random variant for a test
        selectVariant: function(testName) {
            const variants = Object.keys(this.tests[testName]);
            const randomIndex = Math.floor(Math.random() * variants.length);
            return variants[randomIndex];
        },
        
        // Get the variant for a specific test
        getVariant: function(testName) {
            if (!this.sessionData[testName]) {
                this.sessionData[testName] = {
                    variant: this.selectVariant(testName),
                    timestamp: Date.now(),
                    triggered: false,
                    converted: false
                };
                this.saveSessionData();
            }
            return this.sessionData[testName].variant;
        },
        
        // Get the variant value for a specific test
        getVariantValue: function(testName) {
            const variant = this.getVariant(testName);
            return this.tests[testName][variant];
        },
        
        // Track when a test is triggered (shown to user)
        trackTrigger: function(testName) {
            if (this.sessionData[testName]) {
                this.sessionData[testName].triggered = true;
                this.sessionData[testName].triggerTime = Date.now();
                this.saveSessionData();
                
                // Track event
                if (window.DataSenseTracking) {
                    window.DataSenseTracking.trackEvent('ab_test_triggered', {
                        test: testName,
                        variant: this.sessionData[testName].variant,
                        timestamp: Date.now()
                    });
                }
                
                this.debugLog(`Test triggered: ${testName}`, this.sessionData[testName]);
            }
        },
        
        // Track conversion for a test
        trackConversion: function(testName, conversionData = {}) {
            if (this.sessionData[testName] && this.sessionData[testName].triggered) {
                this.sessionData[testName].converted = true;
                this.sessionData[testName].conversionTime = Date.now();
                this.sessionData[testName].conversionData = conversionData;
                
                // Calculate time to conversion
                const timeToConversion = this.sessionData[testName].conversionTime - this.sessionData[testName].triggerTime;
                
                this.saveSessionData();
                
                // Track event
                if (window.DataSenseTracking) {
                    window.DataSenseTracking.trackEvent('ab_test_conversion', {
                        test: testName,
                        variant: this.sessionData[testName].variant,
                        timeToConversion: timeToConversion,
                        ...conversionData,
                        timestamp: Date.now()
                    });
                }
                
                this.debugLog(`Conversion tracked: ${testName}`, {
                    variant: this.sessionData[testName].variant,
                    timeToConversion: timeToConversion,
                    data: conversionData
                });
            }
        },
        
        // Track engagement metrics
        trackEngagement: function(testName, action, data = {}) {
            if (this.sessionData[testName]) {
                if (!this.sessionData[testName].engagements) {
                    this.sessionData[testName].engagements = [];
                }
                
                this.sessionData[testName].engagements.push({
                    action: action,
                    timestamp: Date.now(),
                    data: data
                });
                
                this.saveSessionData();
                
                // Track event
                if (window.DataSenseTracking) {
                    window.DataSenseTracking.trackEvent('ab_test_engagement', {
                        test: testName,
                        variant: this.sessionData[testName].variant,
                        action: action,
                        ...data,
                        timestamp: Date.now()
                    });
                }
            }
        },
        
        // Get timing delay based on variant
        getTimingDelay: function() {
            return this.getVariantValue('timing');
        },
        
        // Get calculator defaults based on variant
        getCalculatorDefaults: function() {
            const defaults = this.getVariantValue('calculator');
            
            if (defaults === 'dynamic') {
                // Dynamic defaults based on referrer source
                return this.getDynamicCalculatorDefaults();
            }
            
            return defaults;
        },
        
        // Get dynamic calculator defaults based on context
        getDynamicCalculatorDefaults: function() {
            // Check referrer and UTM parameters
            const urlParams = new URLSearchParams(window.location.search);
            const utmSource = urlParams.get('utm_source');
            const referrer = document.referrer;
            
            // Different defaults based on traffic source
            if (utmSource === 'enterprise' || referrer.includes('enterprise')) {
                return { revenue: 500000, hours: 100 };
            } else if (utmSource === 'startup' || referrer.includes('startup')) {
                return { revenue: 10000, hours: 15 };
            } else if (utmSource === 'agency' || referrer.includes('agency')) {
                return { revenue: 75000, hours: 50 };
            }
            
            // Default fallback
            return { revenue: 50000, hours: 40 };
        },
        
        // Get popup design variant
        getPopupDesign: function() {
            return this.getVariantValue('design');
        },
        
        // Apply the selected popup design variant
        applyPopupDesign: function(overlay) {
            const design = this.getPopupDesign();
            const popup = overlay.querySelector('.exit-popup');
            const content = overlay.querySelector('.exit-popup-content');
            
            if (!content) return;
            
            this.debugLog('Applying popup design:', design);
            
            switch (design) {
                case 'simple-email':
                    this.applySimpleEmailDesign(content);
                    break;
                case 'video-testimonial':
                    this.applyVideoTestimonialDesign(content);
                    break;
                case 'discount-offer':
                    this.applyDiscountOfferDesign(content);
                    break;
                case 'roi-calculator':
                default:
                    // Keep existing ROI calculator design
                    this.applyCalculatorDefaults(content);
                    break;
            }
            
            // Track which design was shown
            this.trackTrigger('design');
            
            // Re-setup CTA tracking after design change
            if (window.setupExitPopupCTATracking) {
                setTimeout(() => {
                    window.setupExitPopupCTATracking();
                }, 100);
            }
        },
        
        // Apply simple email capture design
        applySimpleEmailDesign: function(content) {
            content.innerHTML = `
                <h3 class="exit-popup-title">Don't Miss Out on 40% More Revenue</h3>
                <p class="exit-popup-subtitle">Join 500+ businesses already using DataSense to transform their data</p>
                
                <div class="simple-email-form">
                    <div class="value-props">
                        <div class="value-prop-item">
                            <span class="checkmark">✓</span> 30-second setup
                        </div>
                        <div class="value-prop-item">
                            <span class="checkmark">✓</span> No credit card required
                        </div>
                        <div class="value-prop-item">
                            <span class="checkmark">✓</span> 14-day free trial
                        </div>
                    </div>
                    
                    <form id="exit-popup-form" class="exit-form">
                        <input type="email" placeholder="Enter your email" required class="exit-email-input">
                        <button type="submit" class="btn btn-primary btn-large">
                            Get Instant Access
                        </button>
                    </form>
                    
                    <p class="exit-disclaimer">No spam, unsubscribe anytime</p>
                </div>
            `;
            
            // Add form submission handler
            const form = content.querySelector('#exit-popup-form');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handlePopupConversion('simple-email', {
                        email: form.querySelector('input').value
                    });
                });
            }
        },
        
        // Apply video testimonial design
        applyVideoTestimonialDesign: function(content) {
            content.innerHTML = `
                <h3 class="exit-popup-title">See How Sarah Increased Revenue by 47%</h3>
                <p class="exit-popup-subtitle">Watch this 2-minute case study</p>
                
                <div class="video-testimonial-container">
                    <div class="video-placeholder" style="background: #1a1a1a; border-radius: 12px; padding: 40px; text-align: center;">
                        <div style="font-size: 48px; margin-bottom: 16px;">▶️</div>
                        <p style="color: rgba(255,255,255,0.8);">Click to play video testimonial</p>
                    </div>
                    
                    <div class="testimonial-cta" style="margin-top: 24px;">
                        <button class="btn btn-primary btn-large" onclick="window.ExitIntentAB.handlePopupConversion('video-testimonial', {action: 'watch_video'})">
                            Get Similar Results
                        </button>
                        <p class="testimonial-quote" style="margin-top: 16px; font-style: italic; color: rgba(255,255,255,0.7);">
                            "DataSense transformed how we understand our customers. The ROI was immediate."
                            <br><strong>- Sarah Chen, CEO of TechStart</strong>
                        </p>
                    </div>
                </div>
            `;
        },
        
        // Apply discount offer design
        applyDiscountOfferDesign: function(content) {
            content.innerHTML = `
                <h3 class="exit-popup-title">🎉 Exclusive Offer: 20% Off Beta Access</h3>
                <p class="exit-popup-subtitle">Limited to the next 10 signups only!</p>
                
                <div class="discount-offer-container">
                    <div class="offer-box" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 24px; border-radius: 12px; margin: 20px 0;">
                        <div class="offer-price" style="font-size: 32px; font-weight: bold; margin-bottom: 8px;">
                            <span style="text-decoration: line-through; opacity: 0.7;">$299</span>
                            <span style="color: #10b981; margin-left: 12px;">$239/month</span>
                        </div>
                        <div class="offer-code" style="background: rgba(255,255,255,0.2); padding: 12px; border-radius: 8px; margin: 16px 0;">
                            <p style="font-size: 14px; opacity: 0.9;">Use code:</p>
                            <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px;">BETA20</p>
                        </div>
                    </div>
                    
                    <div class="offer-features">
                        <p style="font-weight: 600; margin-bottom: 12px;">Everything included:</p>
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin: 8px 0;">✅ Full platform access</li>
                            <li style="margin: 8px 0;">✅ Priority support</li>
                            <li style="margin: 8px 0;">✅ Custom integrations</li>
                            <li style="margin: 8px 0;">✅ Free onboarding session</li>
                        </ul>
                    </div>
                    
                    <button class="btn btn-primary btn-large" style="width: 100%; margin-top: 20px;" onclick="window.ExitIntentAB.handlePopupConversion('discount-offer', {code: 'BETA20'})">
                        Claim Your Discount Now
                    </button>
                    
                    <p class="offer-urgency" style="text-align: center; margin-top: 12px; color: #ef4444;">
                        ⏰ Offer expires in <span id="offer-timer">23:59:47</span>
                    </p>
                </div>
            `;
            
            // Start countdown timer for urgency
            this.startOfferTimer();
        },
        
        // Apply calculator defaults based on variant
        applyCalculatorDefaults: function(content) {
            const defaults = this.getCalculatorDefaults();
            const revenueInput = content.querySelector('#revenue-input');
            const hoursInput = content.querySelector('#hours-input');
            
            if (revenueInput) {
                revenueInput.value = defaults.revenue;
                revenueInput.placeholder = defaults.revenue.toLocaleString();
            }
            
            if (hoursInput) {
                hoursInput.value = defaults.hours;
                hoursInput.placeholder = defaults.hours;
            }
            
            // Track which defaults were shown
            this.trackEngagement('calculator', 'defaults_shown', defaults);
        },
        
        // Handle popup conversion
        handlePopupConversion: function(design, data = {}) {
            // Track conversion for design test
            this.trackConversion('design', {
                design: design,
                ...data
            });
            
            // Track conversions for other active tests
            if (this.sessionData.timing && this.sessionData.timing.triggered) {
                this.trackConversion('timing', { design: design });
            }
            
            if (this.sessionData.calculator && this.sessionData.calculator.triggered) {
                this.trackConversion('calculator', { design: design });
            }
            
            // Close popup and scroll to signup
            const overlay = document.getElementById('exit-popup-overlay');
            if (overlay) {
                overlay.style.display = 'none';
            }
            
            const signup = document.getElementById('beta-signup');
            if (signup) {
                signup.scrollIntoView({ behavior: 'smooth' });
            }
        },
        
        // Start offer countdown timer
        startOfferTimer: function() {
            const timerElement = document.getElementById('offer-timer');
            if (!timerElement) return;
            
            let timeLeft = 24 * 60 * 60; // 24 hours in seconds
            
            const updateTimer = () => {
                const hours = Math.floor(timeLeft / 3600);
                const minutes = Math.floor((timeLeft % 3600) / 60);
                const seconds = timeLeft % 60;
                
                timerElement.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                
                if (timeLeft > 0) {
                    timeLeft--;
                    setTimeout(updateTimer, 1000);
                }
            };
            
            updateTimer();
        },
        
        // Get all session data for reporting
        getSessionReport: function() {
            const report = {
                sessionId: window.DataSenseTracking ? window.DataSenseTracking.sessionId : 'unknown',
                timestamp: Date.now(),
                tests: {}
            };
            
            Object.keys(this.sessionData).forEach(testName => {
                const testData = this.sessionData[testName];
                report.tests[testName] = {
                    variant: testData.variant,
                    triggered: testData.triggered || false,
                    converted: testData.converted || false,
                    timeToConversion: testData.conversionTime ? testData.conversionTime - testData.triggerTime : null,
                    engagements: testData.engagements || []
                };
            });
            
            return report;
        },
        
        // Calculate statistical significance
        calculateSignificance: function(testName) {
            // This would typically connect to a backend to aggregate data
            // For now, return a placeholder
            return {
                test: testName,
                variants: this.tests[testName],
                message: 'Statistical significance calculation requires backend integration'
            };
        },
        
        // Debug logging
        debugLog: function(message, data) {
            const isDevelopment = window.location.hostname === 'localhost' || 
                                window.location.protocol === 'file:';
            
            if (isDevelopment) {
                console.log(`[A/B Testing] ${message}`, data || '');
            }
        }
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.ExitIntentAB.init();
        });
    } else {
        window.ExitIntentAB.init();
    }
})();