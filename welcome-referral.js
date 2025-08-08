// Welcome Page Referral System - Dynamic Content and Tracking
(function() {
    'use strict';

    // Comprehensive referrer database
    const referrerDatabase = {
        'maria_rodriguez': {
            name: 'Maria Rodriguez',
            company: 'Rodriguez Consulting',
            industry: 'Professional Services',
            result: '47% revenue growth',
            testimonial: 'DataSense showed us that 73% of our revenue came from just 18% of customers. We doubled down on those segments and saw immediate growth.',
            use_case: 'client_reporting',
            avatar: 'https://ui-avatars.com/api/?name=Maria+Rodriguez&background=667eea&color=fff',
            role: 'CEO',
            metrics: {
                revenue_growth: '47%',
                decision_speed: '2.3x',
                cost_savings: '$50k',
                time_saved: '15 hours/week'
            },
            templates: ['client-profitability', 'project-performance', 'revenue-forecasting'],
            industry_features: [
                'Client profitability analysis',
                'Project performance tracking',
                'Utilization rate optimization',
                'Revenue forecasting'
            ]
        },
        'john_chen': {
            name: 'John Chen',
            company: 'Chen Manufacturing',
            industry: 'Manufacturing',
            result: '32% cost reduction',
            testimonial: 'We discovered inefficiencies in our supply chain that were costing us $200k annually. Fixed them in 30 days.',
            use_case: 'operations_optimization',
            avatar: 'https://ui-avatars.com/api/?name=John+Chen&background=764ba2&color=fff',
            role: 'Operations Director',
            metrics: {
                cost_reduction: '32%',
                efficiency_gain: '28%',
                downtime_reduction: '45%',
                roi: '380%'
            },
            templates: ['inventory-optimization', 'production-efficiency', 'quality-metrics'],
            industry_features: [
                'Inventory optimization',
                'Production efficiency tracking',
                'Quality control metrics',
                'Supply chain analytics'
            ]
        },
        'sarah_thompson': {
            name: 'Sarah Thompson',
            company: 'Thompson Retail Group',
            industry: 'Retail',
            result: '23% increase in sales',
            testimonial: 'DataSense helped us identify our best-selling product combinations. We reorganized our stores and sales jumped 23%.',
            use_case: 'sales_analytics',
            avatar: 'https://ui-avatars.com/api/?name=Sarah+Thompson&background=48bb78&color=fff',
            role: 'VP of Sales',
            metrics: {
                sales_increase: '23%',
                customer_retention: '+18%',
                average_order_value: '+$47',
                conversion_rate: '+12%'
            },
            templates: ['sales-performance', 'customer-segmentation', 'inventory-turnover'],
            industry_features: [
                'Sales trend analysis',
                'Customer segmentation',
                'Inventory turnover tracking',
                'Seasonal demand forecasting'
            ]
        },
        'michael_davis': {
            name: 'Michael Davis',
            company: 'Davis Digital Agency',
            industry: 'Marketing Agency',
            result: '2.8x ROI improvement',
            testimonial: 'We finally understood which campaigns actually drove revenue. Killed underperformers and tripled down on winners.',
            use_case: 'marketing_analytics',
            avatar: 'https://ui-avatars.com/api/?name=Michael+Davis&background=f56565&color=fff',
            role: 'Founder',
            metrics: {
                roi_improvement: '2.8x',
                client_retention: '94%',
                campaign_efficiency: '+67%',
                reporting_time: '-80%'
            },
            templates: ['campaign-roi', 'client-performance', 'channel-attribution'],
            industry_features: [
                'Campaign ROI tracking',
                'Client performance metrics',
                'Multi-channel attribution',
                'Automated reporting'
            ]
        },
        'emily_wilson': {
            name: 'Emily Wilson',
            company: 'Wilson Healthcare',
            industry: 'Healthcare',
            result: '35% reduction in wait times',
            testimonial: 'Patient flow analytics revealed bottlenecks we never knew existed. We fixed them and patient satisfaction soared.',
            use_case: 'operations_analytics',
            avatar: 'https://ui-avatars.com/api/?name=Emily+Wilson&background=38b2ac&color=fff',
            role: 'Administrator',
            metrics: {
                wait_time_reduction: '35%',
                patient_satisfaction: '+22%',
                staff_efficiency: '+28%',
                cost_per_patient: '-18%'
            },
            templates: ['patient-flow', 'resource-utilization', 'satisfaction-metrics'],
            industry_features: [
                'Patient flow analytics',
                'Resource utilization',
                'Satisfaction tracking',
                'Cost per patient analysis'
            ]
        }
    };

    // Fallback for unknown referrers
    const defaultReferrer = {
        name: 'Your trusted partner',
        company: 'a growing business',
        industry: 'Business',
        result: 'significant growth',
        testimonial: 'DataSense transformed how we make decisions. The insights we get in seconds used to take us days to compile.',
        use_case: 'business_intelligence',
        avatar: 'https://ui-avatars.com/api/?name=Partner&background=667eea&color=fff',
        role: 'Business Leader',
        metrics: {
            average_growth: '35%',
            time_saved: '20 hours/week',
            roi: '5x',
            decision_speed: '10x faster'
        },
        templates: ['executive-dashboard', 'financial-overview', 'performance-metrics'],
        industry_features: [
            'Real-time business insights',
            'Automated reporting',
            'Predictive analytics',
            'Custom dashboards'
        ]
    };

    // Parse URL and get referrer code
    function getReferrerCode() {
        const urlPath = window.location.pathname;
        const urlParams = new URLSearchParams(window.location.search);
        
        // Check for /welcome/[code] pattern
        const pathMatch = urlPath.match(/\/welcome\/([^\/\?]+)/);
        if (pathMatch) {
            return pathMatch[1];
        }
        
        // Fallback to query parameters
        return urlParams.get('ref') || urlParams.get('referrer') || urlParams.get('partner');
    }

    // Update all dynamic content
    function updatePageContent(referrer) {
        // Update referrer badge
        const referrerBadge = document.getElementById('referrer-badge');
        if (referrerBadge) {
            referrerBadge.querySelector('.referrer-text').textContent = 
                `${referrer.name} recommended DataSense`;
        }

        // Update hero title
        const heroTitle = document.getElementById('hero-title');
        if (heroTitle) {
            heroTitle.textContent = `See why ${referrer.name.split(' ')[0]} switched from Excel to DataSense`;
        }

        // Update hero subtitle
        const heroSubtitle = document.getElementById('hero-subtitle');
        if (heroSubtitle) {
            heroSubtitle.textContent = 
                `Get the same insights that grew ${referrer.company}'s revenue ${referrer.result}`;
        }

        // Update referrer spotlight
        updateReferrerSpotlight(referrer);

        // Update social proof section
        updateSocialProof(referrer);

        // Update industry context
        updateIndustryContext(referrer);

        // Update demo section
        updateDemoSection(referrer);

        // Update hidden form fields
        updateFormFields(referrer);

        // Start countdown timer
        startCountdownTimer();
    }

    function updateReferrerSpotlight(referrer) {
        const avatar = document.getElementById('referrer-avatar');
        if (avatar) {
            avatar.src = referrer.avatar;
            avatar.alt = referrer.name;
        }

        const quote = document.getElementById('referrer-quote');
        if (quote) {
            quote.textContent = `"${referrer.testimonial}"`;
        }

        const authorName = document.getElementById('author-name');
        if (authorName) {
            authorName.textContent = referrer.name;
        }

        const authorRole = document.getElementById('author-role');
        if (authorRole) {
            authorRole.textContent = `${referrer.role}, ${referrer.company}`;
        }
    }

    function updateSocialProof(referrer) {
        const title = document.getElementById('social-proof-title');
        if (title) {
            title.textContent = `Join ${referrer.name.split(' ')[0]} and 500+ growing businesses`;
        }

        // Update result cards with referrer's metrics
        const metrics = referrer.metrics;
        const cards = [
            { id: 'result-card-1', metric: metrics.revenue_growth || metrics.average_growth, label: 'Revenue Growth' },
            { id: 'result-card-2', metric: metrics.decision_speed || '10x', label: 'Faster Decisions' },
            { id: 'result-card-3', metric: metrics.cost_savings || metrics.roi || '$50k', label: 'Annual Savings' }
        ];

        cards.forEach(card => {
            const element = document.getElementById(card.id);
            if (element) {
                element.querySelector('.result-metric').textContent = card.metric;
                element.querySelector('.result-label').textContent = card.label;
                element.querySelector('.result-company').textContent = referrer.company;
            }
        });
    }

    function updateIndustryContext(referrer) {
        const context = document.getElementById('industry-context');
        if (context) {
            context.querySelector('h3').textContent = 
                `Popular with ${referrer.industry} companies like yours`;

            const featuresContainer = context.querySelector('.industry-features');
            featuresContainer.innerHTML = '';
            
            referrer.industry_features.forEach(feature => {
                const featureDiv = document.createElement('div');
                featureDiv.className = 'feature';
                featureDiv.innerHTML = `
                    <span class="feature-check">✓</span>
                    <span>${feature}</span>
                `;
                featuresContainer.appendChild(featureDiv);
            });
        }
    }

    function updateDemoSection(referrer) {
        const subtitle = document.getElementById('demo-subtitle');
        if (subtitle) {
            subtitle.textContent = 
                `We've pre-configured dashboards based on ${referrer.name.split(' ')[0]}'s recommendation`;
        }

        // Update demo tabs based on referrer's templates
        const demoTabs = document.querySelector('.demo-tabs');
        if (demoTabs && referrer.templates) {
            const tabNames = {
                'client-profitability': 'Client Analysis',
                'project-performance': 'Project Tracking',
                'revenue-forecasting': 'Revenue Forecast',
                'inventory-optimization': 'Inventory',
                'production-efficiency': 'Production',
                'quality-metrics': 'Quality',
                'sales-performance': 'Sales Analytics',
                'customer-segmentation': 'Customer Segments',
                'campaign-roi': 'Campaign ROI',
                'channel-attribution': 'Channel Performance'
            };

            demoTabs.innerHTML = '';
            referrer.templates.slice(0, 3).forEach((template, index) => {
                const button = document.createElement('button');
                button.className = index === 0 ? 'demo-tab active' : 'demo-tab';
                button.dataset.tab = template;
                button.textContent = tabNames[template] || template;
                demoTabs.appendChild(button);
            });
        }
    }

    function updateFormFields(referrer) {
        const referrerCode = document.getElementById('referrer-code');
        const referrerName = document.getElementById('referrer-name');
        const referrerCompany = document.getElementById('referrer-company');
        const industry = document.getElementById('industry');

        if (referrerCode) referrerCode.value = getReferrerCode() || 'direct';
        if (referrerName) referrerName.value = referrer.name;
        if (referrerCompany) referrerCompany.value = referrer.company;
        if (industry) industry.value = referrer.industry;
    }

    // Cookie management
    function setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i].trim();
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
        }
        return null;
    }

    // Tracking functions
    function trackPageView(referrer) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_title: 'Warm Referral Landing',
                page_location: window.location.href,
                page_path: window.location.pathname,
                referrer_code: getReferrerCode() || 'direct',
                referrer_name: referrer.name,
                referrer_industry: referrer.industry
            });
        }
    }

    function trackEvent(action, label, value) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: 'warm_referral',
                event_label: label,
                value: value
            });
        }
    }

    // A/B Testing
    function initializeABTest() {
        let variant = sessionStorage.getItem('ab_variant');
        
        if (!variant) {
            // Assign variant: 70% get warm referral version, 30% control
            variant = Math.random() < 0.7 ? 'warm_referral' : 'control';
            sessionStorage.setItem('ab_variant', variant);
        }

        document.body.classList.add(`variant-${variant}`);
        
        trackEvent('ab_test_impression', variant, 1);
        
        return variant;
    }

    // Countdown timer
    function startCountdownTimer() {
        const timerElement = document.querySelector('.timer-value');
        if (!timerElement) return;

        let hours = 48;
        let minutes = 0;
        let seconds = 0;

        function updateTimer() {
            if (seconds > 0) {
                seconds--;
            } else if (minutes > 0) {
                minutes--;
                seconds = 59;
            } else if (hours > 0) {
                hours--;
                minutes = 59;
                seconds = 59;
            }

            const display = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            timerElement.textContent = display;

            if (hours === 0 && minutes === 0 && seconds === 0) {
                clearInterval(timerInterval);
            }
        }

        const timerInterval = setInterval(updateTimer, 1000);
    }

    // Form handling
    function handleFormSubmission() {
        const form = document.getElementById('quick-start-form');
        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Add tracking data
            data.ab_variant = sessionStorage.getItem('ab_variant');
            data.timestamp = new Date().toISOString();
            data.page_url = window.location.href;
            
            // Track conversion
            trackEvent('form_submit', 'warm_referral_conversion', 1);
            
            // In production, send to backend
            console.log('Form submission:', data);
            
            // Show success state
            showSuccessMessage(form);
        });
    }

    function showSuccessMessage(form) {
        form.innerHTML = `
            <div class="success-message">
                <svg class="success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <h3>Perfect! Your demo is ready.</h3>
                <p>Check your email for instant access. We'll also call within 24 hours to help you get started.</p>
                <div class="success-details">
                    <div>✓ 25% partner discount applied</div>
                    <div>✓ Industry templates included</div>
                    <div>✓ Priority support activated</div>
                </div>
            </div>
        `;
    }

    // Demo tab switching
    function initializeDemoTabs() {
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('demo-tab')) {
                // Remove active class from all tabs and panels
                document.querySelectorAll('.demo-tab').forEach(tab => {
                    tab.classList.remove('active');
                });
                document.querySelectorAll('.demo-panel').forEach(panel => {
                    panel.classList.remove('active');
                });
                
                // Add active class to clicked tab
                e.target.classList.add('active');
                
                // Show corresponding panel
                const tabName = e.target.dataset.tab;
                const panel = document.getElementById(tabName);
                if (panel) {
                    panel.classList.add('active');
                }
                
                trackEvent('demo_tab_click', tabName, 1);
            }
        });
    }

    // Scroll to demo section
    window.scrollToDemo = function() {
        const demoSection = document.getElementById('demo-section');
        if (demoSection) {
            demoSection.scrollIntoView({ behavior: 'smooth' });
            trackEvent('cta_click', 'scroll_to_demo', 1);
        }
    };

    // Initialize everything
    function initialize() {
        const referrerCode = getReferrerCode();
        const referrer = referrerDatabase[referrerCode] || defaultReferrer;
        
        // Store referral in cookie for 30 days
        if (referrerCode) {
            setCookie('datasense_warm_referral', referrerCode, 30);
            setCookie('datasense_referrer_name', referrer.name, 30);
        }
        
        // Update page content
        updatePageContent(referrer);
        
        // Initialize features
        initializeABTest();
        handleFormSubmission();
        initializeDemoTabs();
        
        // Track page view
        trackPageView(referrer);
        
        // Log for debugging
        console.log('Warm referral page initialized:', {
            referrerCode,
            referrerName: referrer.name,
            variant: sessionStorage.getItem('ab_variant')
        });
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();