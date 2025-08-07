(function() {
    'use strict';

    window.DataSenseReferralOnboarding = {
        referralData: null,
        referrerProfile: null,
        advantages: [],
        
        init: function() {
            this.extractReferralData();
            if (this.referralData) {
                this.loadReferrerProfile();
                this.applyReferralAdvantages();
                this.personalizeExperience();
                this.trackReferralOnboarding();
            }
        },

        extractReferralData: function() {
            const urlParams = new URLSearchParams(window.location.search);
            const referralCode = urlParams.get('ref') || urlParams.get('referral');
            const referrerId = urlParams.get('referrer_id');
            const referralSource = urlParams.get('source');
            
            const savedReferral = localStorage.getItem('datasense_referral_data');
            
            if (referralCode || referrerId || savedReferral) {
                this.referralData = {
                    code: referralCode,
                    referrerId: referrerId,
                    source: referralSource || 'direct',
                    timestamp: new Date().toISOString(),
                    ...(savedReferral ? JSON.parse(savedReferral) : {})
                };
                
                localStorage.setItem('datasense_referral_data', JSON.stringify(this.referralData));
            }
        },

        loadReferrerProfile: function() {
            if (!this.referralData || !this.referralData.referrerId) return;
            
            this.referrerProfile = {
                id: this.referralData.referrerId,
                name: this.getReferrerName(),
                company: this.getReferrerCompany(),
                industry: this.getReferrerIndustry(),
                successMetrics: this.getReferrerSuccessMetrics(),
                favoriteFeatures: this.getReferrerFavoriteFeatures(),
                dashboards: this.getReferrerDashboards(),
                testimonial: this.getReferrerTestimonial()
            };
        },

        getReferrerName: function() {
            const names = {
                'ref123': 'Sarah Johnson',
                'ref456': 'Mike Chen',
                'ref789': 'Emily Rodriguez'
            };
            return names[this.referralData.referrerId] || 'Your colleague';
        },

        getReferrerCompany: function() {
            const companies = {
                'ref123': 'TechStart Inc.',
                'ref456': 'Growth Marketing Co.',
                'ref789': 'Digital Services LLC'
            };
            return companies[this.referralData.referrerId] || 'A successful company';
        },

        getReferrerIndustry: function() {
            const industries = {
                'ref123': 'saas',
                'ref456': 'ecommerce',
                'ref789': 'services'
            };
            return industries[this.referralData.referrerId] || 'services';
        },

        getReferrerSuccessMetrics: function() {
            return {
                timeToValue: 25,
                roiMultiple: 12,
                hoursSaved: 15,
                insightsDiscovered: 47,
                dashboardsCreated: 8,
                teamAdoption: 95
            };
        },

        getReferrerFavoriteFeatures: function() {
            return [
                { name: 'Automated Reports', usage: 'daily', value: 'Saves 2 hours per day' },
                { name: 'Customer Segmentation', usage: 'weekly', value: 'Increased LTV by 40%' },
                { name: 'Real-time Dashboards', usage: 'always on', value: 'Instant decision making' },
                { name: 'Smart Alerts', usage: 'critical', value: 'Never miss opportunities' },
                { name: 'Team Collaboration', usage: 'constant', value: 'Everyone aligned' }
            ];
        },

        getReferrerDashboards: function() {
            return [
                { name: 'Executive Overview', shared: true, template: true },
                { name: 'Sales Performance', shared: true, template: true },
                { name: 'Customer Analytics', shared: false, template: true },
                { name: 'Marketing Attribution', shared: true, template: false },
                { name: 'Financial Metrics', shared: false, template: true }
            ];
        },

        getReferrerTestimonial: function() {
            return {
                quote: "DataSense transformed how we make decisions. We went from guessing to knowing, and our revenue grew 3x in 6 months.",
                highlight: "3x revenue growth",
                recommendation: "Start with the automated reports - they're game-changing!"
            };
        },

        applyReferralAdvantages: function() {
            this.advantages = [
                {
                    type: 'fast-track',
                    title: 'Priority Onboarding',
                    description: 'Skip the wait - immediate access to all features',
                    icon: '⚡',
                    applied: true
                },
                {
                    type: 'templates',
                    title: `${this.referrerProfile.name}'s Templates`,
                    description: 'Access proven dashboards and reports',
                    icon: '📋',
                    applied: true
                },
                {
                    type: 'support',
                    title: 'VIP Support Channel',
                    description: 'Direct line to success team',
                    icon: '🎯',
                    applied: true
                },
                {
                    type: 'training',
                    title: 'Personalized Training',
                    description: '1-on-1 session with expert',
                    icon: '👨‍🏫',
                    applied: true
                },
                {
                    type: 'insights',
                    title: 'Industry Benchmarks',
                    description: 'Compare to top performers',
                    icon: '📊',
                    applied: true
                },
                {
                    type: 'bonus',
                    title: 'Extended Trial',
                    description: '60 days instead of 30',
                    icon: '🎁',
                    applied: true
                }
            ];
            
            this.saveAdvantages();
        },

        saveAdvantages: function() {
            localStorage.setItem('datasense_referral_advantages', JSON.stringify(this.advantages));
        },

        personalizeExperience: function() {
            this.showReferralWelcome();
            this.customizeOnboardingPath();
            this.preloadReferrerTemplates();
            this.setupDirectConnection();
        },

        showReferralWelcome: function() {
            const welcomeModal = document.createElement('div');
            welcomeModal.className = 'referral-welcome-modal';
            welcomeModal.innerHTML = `
                <div class="welcome-content">
                    <div class="welcome-header">
                        <h1>🎉 Welcome! ${this.referrerProfile.name} Referred You</h1>
                        <p class="welcome-subtitle">You're joining an exclusive group of data-driven leaders</p>
                    </div>
                    
                    <div class="referrer-success">
                        <div class="success-card">
                            <img src="/images/avatar-placeholder.png" alt="${this.referrerProfile.name}" class="referrer-avatar">
                            <div class="success-details">
                                <h3>${this.referrerProfile.name}</h3>
                                <p>${this.referrerProfile.company}</p>
                                <div class="success-metrics">
                                    <span class="metric">
                                        <strong>${this.referrerProfile.successMetrics.roiMultiple}x</strong> ROI
                                    </span>
                                    <span class="metric">
                                        <strong>${this.referrerProfile.successMetrics.hoursSaved}</strong> hrs/week saved
                                    </span>
                                    <span class="metric">
                                        <strong>${this.referrerProfile.successMetrics.insightsDiscovered}</strong> insights found
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <blockquote class="referrer-testimonial">
                            <p>"${this.referrerProfile.testimonial.quote}"</p>
                            <footer>- ${this.referrerProfile.name}</footer>
                        </blockquote>
                    </div>
                    
                    <div class="referral-advantages">
                        <h3>🎁 Your Exclusive Advantages</h3>
                        <div class="advantages-grid">
                            ${this.advantages.map(adv => `
                                <div class="advantage-item">
                                    <span class="advantage-icon">${adv.icon}</span>
                                    <div class="advantage-text">
                                        <h4>${adv.title}</h4>
                                        <p>${adv.description}</p>
                                    </div>
                                    <span class="advantage-badge">Activated</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="referrer-recommendation">
                        <h3>💡 ${this.referrerProfile.name}'s Pro Tip</h3>
                        <p class="pro-tip">"${this.referrerProfile.testimonial.recommendation}"</p>
                    </div>
                    
                    <div class="welcome-actions">
                        <button class="btn-primary" onclick="DataSenseReferralOnboarding.startWithReferrerPath()">
                            Follow ${this.referrerProfile.name}'s Path to Success
                        </button>
                        <button class="btn-secondary" onclick="DataSenseReferralOnboarding.customizePath()">
                            Create My Own Path
                        </button>
                    </div>
                    
                    <div class="direct-connection">
                        <p>Want to connect with ${this.referrerProfile.name}?</p>
                        <button onclick="DataSenseReferralOnboarding.requestIntroduction()">
                            Request Introduction
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(welcomeModal);
        },

        customizeOnboardingPath: function() {
            const referrerIndustry = this.referrerProfile.industry;
            const referrerFeatures = this.referrerProfile.favoriteFeatures;
            
            if (window.DataSenseOnboardingPath) {
                const customizations = {
                    referralBonus: true,
                    suggestedIndustry: referrerIndustry,
                    priorityFeatures: referrerFeatures.map(f => f.name),
                    acceleratedTimeline: true,
                    referrerTemplates: this.referrerProfile.dashboards.filter(d => d.shared)
                };
                
                localStorage.setItem('datasense_referral_customizations', JSON.stringify(customizations));
            }
        },

        preloadReferrerTemplates: function() {
            const sharedTemplates = this.referrerProfile.dashboards.filter(d => d.shared && d.template);
            
            const templates = sharedTemplates.map(template => ({
                id: `ref-${this.referrerProfile.id}-${template.name.toLowerCase().replace(/ /g, '-')}`,
                name: template.name,
                description: `Proven template from ${this.referrerProfile.name}`,
                category: 'referral',
                preview: this.generateTemplatePreview(template),
                metrics: this.getTemplateMetrics(template),
                lastUpdated: new Date().toISOString()
            }));
            
            localStorage.setItem('datasense_referrer_templates', JSON.stringify(templates));
        },

        generateTemplatePreview: function(template) {
            return {
                widgets: [
                    { type: 'kpi', title: 'Key Metric 1', position: { x: 0, y: 0 } },
                    { type: 'chart', title: 'Trend Analysis', position: { x: 1, y: 0 } },
                    { type: 'table', title: 'Detail View', position: { x: 0, y: 1 } }
                ],
                layout: 'grid',
                theme: 'professional'
            };
        },

        getTemplateMetrics: function(template) {
            const metrics = {
                'Executive Overview': ['Revenue', 'Costs', 'Profit', 'Growth'],
                'Sales Performance': ['Deals', 'Pipeline', 'Win Rate', 'Velocity'],
                'Customer Analytics': ['CAC', 'LTV', 'Churn', 'NPS'],
                'Marketing Attribution': ['Leads', 'Conversions', 'ROI', 'Channels'],
                'Financial Metrics': ['Cash Flow', 'Burn Rate', 'Runway', 'Margins']
            };
            
            return metrics[template.name] || ['Metric 1', 'Metric 2', 'Metric 3'];
        },

        setupDirectConnection: function() {
            const connection = {
                referrerId: this.referrerProfile.id,
                referrerName: this.referrerProfile.name,
                successManager: this.assignSuccessManager(),
                sharedResources: this.getSharedResources(),
                communicationChannel: 'priority',
                checkInSchedule: 'weekly'
            };
            
            localStorage.setItem('datasense_referral_connection', JSON.stringify(connection));
        },

        assignSuccessManager: function() {
            return {
                name: 'Alex Thompson',
                email: 'alex@datasense.ai',
                calendly: 'https://calendly.com/datasense-alex',
                expertise: this.referrerProfile.industry,
                previousWork: `Helped ${this.referrerProfile.company} achieve ${this.referrerProfile.successMetrics.roiMultiple}x ROI`
            };
        },

        getSharedResources: function() {
            return [
                { type: 'playbook', title: `${this.referrerProfile.industry} Success Playbook`, access: 'immediate' },
                { type: 'templates', title: 'Industry Best Practices', access: 'immediate' },
                { type: 'benchmarks', title: 'Performance Benchmarks', access: 'after-setup' },
                { type: 'community', title: 'Private Slack Channel', access: 'immediate' },
                { type: 'training', title: 'Video Library', access: 'immediate' }
            ];
        },

        startWithReferrerPath: function() {
            document.querySelector('.referral-welcome-modal')?.remove();
            
            const referrerPath = {
                based_on: this.referrerProfile.name,
                industry: this.referrerProfile.industry,
                priority_integrations: this.extractIntegrations(),
                first_dashboards: this.referrerProfile.dashboards.filter(d => d.shared).map(d => d.name),
                success_timeline: this.createAcceleratedTimeline(),
                mentorship: true
            };
            
            localStorage.setItem('datasense_chosen_path', JSON.stringify(referrerPath));
            
            if (window.DataSenseOnboardingPath) {
                const profile = JSON.parse(localStorage.getItem('datasense_onboarding_profile') || '{}');
                profile.industry = this.referrerProfile.industry;
                profile.referralPath = true;
                window.DataSenseOnboardingPath.generatePath(profile);
            }
            
            this.trackPathChoice('referrer');
        },

        customizePath: function() {
            document.querySelector('.referral-welcome-modal')?.remove();
            
            localStorage.setItem('datasense_path_choice', 'custom');
            
            if (window.DataSenseOnboardingQuiz) {
                window.DataSenseOnboardingQuiz.init();
            }
            
            this.trackPathChoice('custom');
        },

        requestIntroduction: function() {
            const introRequest = {
                requesterId: this.getCurrentUserId(),
                referrerId: this.referrerProfile.id,
                referrerName: this.referrerProfile.name,
                requestTime: new Date().toISOString(),
                message: `Hi ${this.referrerProfile.name}, I just joined DataSense based on your recommendation! Would love to connect and learn from your experience.`
            };
            
            this.sendIntroductionRequest(introRequest);
            
            this.showNotification(`Introduction request sent to ${this.referrerProfile.name}!`, 'success');
        },

        getCurrentUserId: function() {
            return localStorage.getItem('datasense_user_id') || 'new-user-' + Date.now();
        },

        sendIntroductionRequest: function(request) {
            console.log('Sending introduction request:', request);
            
            if (window.DataSenseCRM) {
                window.DataSenseCRM.sendIntroRequest(request);
            }
        },

        extractIntegrations: function() {
            const industryIntegrations = {
                'ecommerce': ['Shopify', 'Stripe', 'Google Analytics'],
                'saas': ['Stripe', 'Intercom', 'Mixpanel'],
                'services': ['QuickBooks', 'Asana', 'HubSpot']
            };
            
            return industryIntegrations[this.referrerProfile.industry] || [];
        },

        createAcceleratedTimeline: function() {
            return {
                day1: {
                    goals: ['Connect primary data source', 'View first insight', 'Meet success manager'],
                    support: 'Live guided session',
                    outcome: 'Immediate value'
                },
                week1: {
                    goals: ['All integrations connected', '3 dashboards created', 'Team invited'],
                    support: 'Daily check-ins',
                    outcome: 'Full visibility'
                },
                month1: {
                    goals: ['Automations running', 'Custom reports built', 'ROI demonstrated'],
                    support: 'Weekly optimization',
                    outcome: 'Measurable impact'
                }
            };
        },

        showReferrerInsights: function() {
            const insightsPanel = document.createElement('div');
            insightsPanel.className = 'referrer-insights-panel';
            insightsPanel.innerHTML = `
                <div class="insights-header">
                    <h3>How ${this.referrerProfile.name} Uses DataSense</h3>
                    <button class="close-btn" onclick="this.parentElement.parentElement.remove()">×</button>
                </div>
                
                <div class="favorite-features">
                    <h4>Top Features</h4>
                    ${this.referrerProfile.favoriteFeatures.map(feature => `
                        <div class="feature-item">
                            <div class="feature-name">${feature.name}</div>
                            <div class="feature-usage">${feature.usage}</div>
                            <div class="feature-value">${feature.value}</div>
                            <button onclick="DataSenseReferralOnboarding.tryFeature('${feature.name}')">
                                Try It
                            </button>
                        </div>
                    `).join('')}
                </div>
                
                <div class="success-timeline">
                    <h4>Their Journey</h4>
                    <div class="timeline-items">
                        <div class="timeline-item">
                            <span class="time">Day 1</span>
                            <span class="achievement">First insight discovered</span>
                        </div>
                        <div class="timeline-item">
                            <span class="time">Week 1</span>
                            <span class="achievement">Saved 10 hours on reporting</span>
                        </div>
                        <div class="timeline-item">
                            <span class="time">Month 1</span>
                            <span class="achievement">20% revenue increase identified</span>
                        </div>
                        <div class="timeline-item">
                            <span class="time">Month 3</span>
                            <span class="achievement">${this.referrerProfile.successMetrics.roiMultiple}x ROI achieved</span>
                        </div>
                    </div>
                </div>
                
                <div class="pro-tips">
                    <h4>Pro Tips from ${this.referrerProfile.name}</h4>
                    <ul>
                        <li>Start with automated daily reports - huge time saver</li>
                        <li>Connect all data sources in week 1 for full picture</li>
                        <li>Use the AI suggestions - they find hidden opportunities</li>
                        <li>Share dashboards with team for buy-in</li>
                        <li>Set up alerts for critical metrics immediately</li>
                    </ul>
                </div>
            `;
            
            document.body.appendChild(insightsPanel);
        },

        tryFeature: function(featureName) {
            console.log(`Trying feature: ${featureName}`);
            window.location.href = `/app/features/${featureName.toLowerCase().replace(/ /g, '-')}`;
        },

        compareProgress: function() {
            const userProgress = JSON.parse(localStorage.getItem('datasense_onboarding_progress') || '{}');
            const referrerMilestones = this.referrerProfile.successMetrics;
            
            const comparison = {
                timeToFirstInsight: {
                    user: userProgress.firstInsightTime || null,
                    referrer: referrerMilestones.timeToValue,
                    status: this.getComparisonStatus(userProgress.firstInsightTime, referrerMilestones.timeToValue)
                },
                dashboardsCreated: {
                    user: userProgress.dashboardsCreated || 0,
                    referrer: referrerMilestones.dashboardsCreated,
                    status: this.getComparisonStatus(userProgress.dashboardsCreated, referrerMilestones.dashboardsCreated)
                },
                insightsFound: {
                    user: userProgress.insightsViewed || 0,
                    referrer: referrerMilestones.insightsDiscovered,
                    status: this.getComparisonStatus(userProgress.insightsViewed, referrerMilestones.insightsDiscovered)
                }
            };
            
            return comparison;
        },

        getComparisonStatus: function(userValue, referrerValue) {
            if (!userValue) return 'not-started';
            const percentage = (userValue / referrerValue) * 100;
            if (percentage >= 100) return 'exceeded';
            if (percentage >= 75) return 'on-track';
            if (percentage >= 50) return 'progressing';
            return 'behind';
        },

        showProgressComparison: function() {
            const comparison = this.compareProgress();
            
            const comparisonModal = document.createElement('div');
            comparisonModal.className = 'progress-comparison-modal';
            comparisonModal.innerHTML = `
                <div class="comparison-content">
                    <h3>Your Progress vs ${this.referrerProfile.name}</h3>
                    
                    ${Object.entries(comparison).map(([metric, data]) => `
                        <div class="comparison-metric status-${data.status}">
                            <div class="metric-name">${this.formatMetricName(metric)}</div>
                            <div class="metric-values">
                                <span class="user-value">You: ${data.user || 0}</span>
                                <span class="vs">vs</span>
                                <span class="referrer-value">${this.referrerProfile.name}: ${data.referrer}</span>
                            </div>
                            <div class="status-indicator">${this.getStatusMessage(data.status)}</div>
                        </div>
                    `).join('')}
                    
                    <button onclick="this.parentElement.parentElement.remove()">Close</button>
                </div>
            `;
            
            document.body.appendChild(comparisonModal);
        },

        formatMetricName: function(metric) {
            const names = {
                'timeToFirstInsight': 'Time to First Insight',
                'dashboardsCreated': 'Dashboards Created',
                'insightsFound': 'Insights Discovered'
            };
            return names[metric] || metric;
        },

        getStatusMessage: function(status) {
            const messages = {
                'exceeded': '🌟 Crushing it!',
                'on-track': '✅ On track',
                'progressing': '📈 Making progress',
                'behind': '⚡ Pick up the pace',
                'not-started': '🎯 Get started'
            };
            return messages[status] || status;
        },

        trackReferralOnboarding: function() {
            if (window.DataSenseTracking) {
                window.DataSenseTracking.trackEvent('referral_onboarding_started', {
                    referrerId: this.referrerProfile?.id,
                    referrerName: this.referrerProfile?.name,
                    referralCode: this.referralData?.code,
                    advantages: this.advantages.length
                });
            }
        },

        trackPathChoice: function(choice) {
            if (window.DataSenseTracking) {
                window.DataSenseTracking.trackEvent('referral_path_chosen', {
                    choice: choice,
                    referrerId: this.referrerProfile?.id
                });
            }
        },

        showNotification: function(message, type) {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => notification.remove(), 3000);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.DataSenseReferralOnboarding.init();
        });
    } else {
        window.DataSenseReferralOnboarding.init();
    }

})();