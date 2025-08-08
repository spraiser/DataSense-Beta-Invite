// A/B Testing Framework for Warm Referral Landing Pages
(function() {
    'use strict';

    class ReferralABTest {
        constructor() {
            this.testName = 'warm_referral_landing';
            this.variants = {
                control: {
                    name: 'control',
                    description: 'Standard landing page',
                    weight: 0.3, // 30% traffic
                    modifications: {}
                },
                warm_referral: {
                    name: 'warm_referral',
                    description: 'Personalized warm referral page',
                    weight: 0.7, // 70% traffic
                    modifications: {
                        showReferrerBadge: true,
                        showReferrerTestimonial: true,
                        showIndustryContext: true,
                        discountAmount: '25%',
                        urgencyTimer: true
                    }
                }
            };
            
            this.metrics = {
                pageView: 0,
                scrollDepth: {},
                timeOnPage: 0,
                formInteraction: 0,
                formSubmission: 0,
                ctaClicks: {},
                demoTabClicks: {}
            };
            
            this.startTime = Date.now();
            this.variant = null;
        }

        // Initialize the A/B test
        init() {
            this.variant = this.assignVariant();
            this.applyVariant();
            this.trackPageView();
            this.setupEventTracking();
            this.setupPerformanceTracking();
            
            console.log(`A/B Test initialized: ${this.variant.name}`);
        }

        // Assign user to a variant
        assignVariant() {
            let savedVariant = this.getSavedVariant();
            
            if (savedVariant && this.variants[savedVariant]) {
                return this.variants[savedVariant];
            }
            
            // Random assignment based on weights
            const random = Math.random();
            let cumulative = 0;
            
            for (const [key, variant] of Object.entries(this.variants)) {
                cumulative += variant.weight;
                if (random < cumulative) {
                    this.saveVariant(key);
                    return variant;
                }
            }
            
            // Fallback to control
            this.saveVariant('control');
            return this.variants.control;
        }

        // Apply variant modifications to the page
        applyVariant() {
            document.body.classList.add(`ab-variant-${this.variant.name}`);
            
            if (this.variant.name === 'control') {
                this.applyControlVariant();
            } else if (this.variant.name === 'warm_referral') {
                this.applyWarmReferralVariant();
            }
        }

        applyControlVariant() {
            // Hide referral-specific elements
            const elementsToHide = [
                '.referrer-badge',
                '.referrer-spotlight',
                '#referrer-testimonial',
                '.industry-context',
                '.urgency-timer'
            ];
            
            elementsToHide.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => el.style.display = 'none');
            });
            
            // Update discount amount
            const discountElements = document.querySelectorAll('[data-discount]');
            discountElements.forEach(el => {
                el.textContent = '15%'; // Standard discount
            });
            
            // Generic headlines
            const heroTitle = document.getElementById('hero-title');
            if (heroTitle) {
                heroTitle.textContent = 'Transform Your Business with AI-Powered Insights';
            }
            
            const heroSubtitle = document.getElementById('hero-subtitle');
            if (heroSubtitle) {
                heroSubtitle.textContent = 'Make data-driven decisions in seconds, not weeks';
            }
        }

        applyWarmReferralVariant() {
            // All personalization is handled by welcome-referral.js
            // This just ensures tracking is properly set up
        }

        // Save variant to storage
        saveVariant(variantName) {
            sessionStorage.setItem('ab_variant', variantName);
            
            // Also save with timestamp for longer persistence
            const data = {
                variant: variantName,
                timestamp: Date.now(),
                testName: this.testName
            };
            localStorage.setItem('ab_test_data', JSON.stringify(data));
        }

        // Get saved variant
        getSavedVariant() {
            // Check session first
            const sessionVariant = sessionStorage.getItem('ab_variant');
            if (sessionVariant) return sessionVariant;
            
            // Check localStorage
            try {
                const data = JSON.parse(localStorage.getItem('ab_test_data'));
                if (data && data.testName === this.testName) {
                    // Check if test data is less than 30 days old
                    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
                    if (Date.now() - data.timestamp < thirtyDays) {
                        return data.variant;
                    }
                }
            } catch (e) {
                console.error('Error reading A/B test data:', e);
            }
            
            return null;
        }

        // Track page view
        trackPageView() {
            this.metrics.pageView++;
            this.sendEvent('page_view', {
                variant: this.variant.name,
                referrer: this.getReferrerCode(),
                url: window.location.href
            });
        }

        // Setup event tracking
        setupEventTracking() {
            // Track form interactions
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                form.addEventListener('focus', () => {
                    if (this.metrics.formInteraction === 0) {
                        this.metrics.formInteraction++;
                        this.sendEvent('form_interaction', {
                            variant: this.variant.name,
                            formId: form.id
                        });
                    }
                }, true);
                
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.metrics.formSubmission++;
                    this.trackConversion();
                });
            });
            
            // Track CTA clicks
            const ctaButtons = document.querySelectorAll('.btn-primary, .btn-submit, .btn-urgent');
            ctaButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const label = button.textContent.trim();
                    this.metrics.ctaClicks[label] = (this.metrics.ctaClicks[label] || 0) + 1;
                    this.sendEvent('cta_click', {
                        variant: this.variant.name,
                        label: label
                    });
                });
            });
            
            // Track demo tab clicks
            const demoTabs = document.querySelectorAll('.demo-tab');
            demoTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const tabName = tab.dataset.tab;
                    this.metrics.demoTabClicks[tabName] = (this.metrics.demoTabClicks[tabName] || 0) + 1;
                    this.sendEvent('demo_tab_click', {
                        variant: this.variant.name,
                        tab: tabName
                    });
                });
            });
        }

        // Setup performance tracking
        setupPerformanceTracking() {
            // Track scroll depth
            let maxScroll = 0;
            window.addEventListener('scroll', () => {
                const scrollPercentage = Math.round(
                    (window.scrollY + window.innerHeight) / 
                    document.documentElement.scrollHeight * 100
                );
                
                if (scrollPercentage > maxScroll) {
                    maxScroll = scrollPercentage;
                    
                    // Track milestones
                    [25, 50, 75, 100].forEach(milestone => {
                        if (maxScroll >= milestone && !this.metrics.scrollDepth[milestone]) {
                            this.metrics.scrollDepth[milestone] = true;
                            this.sendEvent('scroll_depth', {
                                variant: this.variant.name,
                                depth: milestone
                            });
                        }
                    });
                }
            });
            
            // Track time on page
            window.addEventListener('beforeunload', () => {
                this.metrics.timeOnPage = Math.round((Date.now() - this.startTime) / 1000);
                this.sendEvent('time_on_page', {
                    variant: this.variant.name,
                    seconds: this.metrics.timeOnPage
                });
            });
            
            // Track page visibility
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.sendEvent('page_hidden', {
                        variant: this.variant.name,
                        timeVisible: Math.round((Date.now() - this.startTime) / 1000)
                    });
                }
            });
        }

        // Track conversion
        trackConversion() {
            const conversionData = {
                variant: this.variant.name,
                referrer: this.getReferrerCode(),
                timeToConversion: Math.round((Date.now() - this.startTime) / 1000),
                scrollDepth: Math.max(...Object.keys(this.metrics.scrollDepth).map(Number)),
                ctaClicks: Object.keys(this.metrics.ctaClicks).length,
                demoTabClicks: Object.keys(this.metrics.demoTabClicks).length
            };
            
            this.sendEvent('conversion', conversionData);
            
            // Calculate and log conversion rate
            this.calculateConversionRate();
        }

        // Calculate conversion rate
        calculateConversionRate() {
            const stats = this.getStoredStats();
            
            if (!stats[this.variant.name]) {
                stats[this.variant.name] = {
                    views: 0,
                    conversions: 0
                };
            }
            
            stats[this.variant.name].views++;
            stats[this.variant.name].conversions++;
            
            const rate = (stats[this.variant.name].conversions / stats[this.variant.name].views * 100).toFixed(2);
            
            console.log(`Conversion Rate for ${this.variant.name}: ${rate}%`);
            console.log('Overall Stats:', stats);
            
            this.saveStats(stats);
        }

        // Get stored statistics
        getStoredStats() {
            try {
                const stats = localStorage.getItem('ab_test_stats');
                return stats ? JSON.parse(stats) : {};
            } catch (e) {
                return {};
            }
        }

        // Save statistics
        saveStats(stats) {
            try {
                localStorage.setItem('ab_test_stats', JSON.stringify(stats));
            } catch (e) {
                console.error('Error saving stats:', e);
            }
        }

        // Get referrer code
        getReferrerCode() {
            const urlPath = window.location.pathname;
            const urlParams = new URLSearchParams(window.location.search);
            
            const pathMatch = urlPath.match(/\/welcome\/([^\/\?]+)/);
            if (pathMatch) return pathMatch[1];
            
            return urlParams.get('ref') || urlParams.get('referrer') || 'direct';
        }

        // Send event to analytics
        sendEvent(eventName, data) {
            // Send to Google Analytics if available
            if (typeof gtag !== 'undefined') {
                gtag('event', eventName, {
                    event_category: 'ab_test',
                    event_label: this.testName,
                    value: data.variant === 'warm_referral' ? 1 : 0,
                    custom_data: JSON.stringify(data)
                });
            }
            
            // Log to console in development
            console.log(`A/B Test Event: ${eventName}`, data);
            
            // In production, this would send to your analytics backend
            this.sendToBackend(eventName, data);
        }

        // Send data to backend
        sendToBackend(eventName, data) {
            // In production, implement actual API call
            const payload = {
                test_name: this.testName,
                event: eventName,
                variant: this.variant.name,
                timestamp: new Date().toISOString(),
                session_id: this.getSessionId(),
                ...data
            };
            
            // Example API call (uncomment in production)
            /*
            fetch('/api/ab-testing/track', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            }).catch(error => {
                console.error('Error sending A/B test data:', error);
            });
            */
        }

        // Get or create session ID
        getSessionId() {
            let sessionId = sessionStorage.getItem('session_id');
            if (!sessionId) {
                sessionId = this.generateId();
                sessionStorage.setItem('session_id', sessionId);
            }
            return sessionId;
        }

        // Generate unique ID
        generateId() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        }

        // Get test results (for debugging/monitoring)
        getResults() {
            const stats = this.getStoredStats();
            const results = {};
            
            Object.entries(this.variants).forEach(([key, variant]) => {
                const variantStats = stats[key] || { views: 0, conversions: 0 };
                results[key] = {
                    name: variant.name,
                    description: variant.description,
                    weight: variant.weight,
                    views: variantStats.views,
                    conversions: variantStats.conversions,
                    conversionRate: variantStats.views > 0 
                        ? (variantStats.conversions / variantStats.views * 100).toFixed(2) + '%'
                        : '0%'
                };
            });
            
            return results;
        }
    }

    // Initialize A/B test when DOM is ready
    function initializeABTest() {
        const abTest = new ReferralABTest();
        abTest.init();
        
        // Expose to global scope for debugging
        window.referralABTest = abTest;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeABTest);
    } else {
        initializeABTest();
    }
})();