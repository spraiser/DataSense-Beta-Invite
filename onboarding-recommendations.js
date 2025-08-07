(function() {
    'use strict';

    window.DataSenseRecommendations = {
        userBehavior: {},
        recommendations: [],
        
        behaviorPatterns: {
            'data-explorer': {
                indicators: ['multipleQueries', 'diverseDataSources', 'complexFilters'],
                recommendations: [
                    { type: 'feature', item: 'Advanced Query Builder', reason: 'You love exploring data' },
                    { type: 'integration', item: 'SQL Direct Access', reason: 'For deeper analysis' },
                    { type: 'template', item: 'Custom Analytics Framework', reason: 'Build your own metrics' }
                ]
            },
            'dashboard-builder': {
                indicators: ['multipleDashboards', 'customWidgets', 'frequentEdits'],
                recommendations: [
                    { type: 'feature', item: 'Dashboard Templates Gallery', reason: 'Save time with pre-built layouts' },
                    { type: 'feature', item: 'Widget Library Pro', reason: 'Access 50+ visualization types' },
                    { type: 'tutorial', item: 'Advanced Dashboard Design', reason: 'Create stunning reports' }
                ]
            },
            'automation-seeker': {
                indicators: ['scheduledReports', 'alerts', 'workflows'],
                recommendations: [
                    { type: 'feature', item: 'Workflow Automation', reason: 'Automate repetitive tasks' },
                    { type: 'integration', item: 'Zapier Connection', reason: 'Connect to 3000+ apps' },
                    { type: 'template', item: 'Alert Rules Library', reason: 'Pre-configured monitoring' }
                ]
            },
            'team-collaborator': {
                indicators: ['multipleInvites', 'sharedDashboards', 'comments'],
                recommendations: [
                    { type: 'feature', item: 'Team Workspace', reason: 'Centralize team analytics' },
                    { type: 'feature', item: 'Permission Templates', reason: 'Manage access easily' },
                    { type: 'tutorial', item: 'Team Analytics Best Practices', reason: 'Optimize collaboration' }
                ]
            },
            'performance-optimizer': {
                indicators: ['performanceMetrics', 'optimization', 'benchmarking'],
                recommendations: [
                    { type: 'feature', item: 'Performance Benchmarks', reason: 'Compare to industry standards' },
                    { type: 'query', item: 'Bottleneck Analysis', reason: 'Find improvement areas' },
                    { type: 'template', item: 'KPI Tracking Dashboard', reason: 'Monitor key metrics' }
                ]
            }
        },

        industryRecommendations: {
            'ecommerce': {
                queries: [
                    'Which products have the highest cart abandonment rate?',
                    'What\'s my customer lifetime value by acquisition channel?',
                    'Show me seasonal buying patterns for planning inventory',
                    'Which product bundles maximize average order value?',
                    'What times of day have the highest conversion rates?'
                ],
                integrations: [
                    { name: 'Shopify', priority: 'critical', value: 'Sync all sales data' },
                    { name: 'Klaviyo', priority: 'high', value: 'Email marketing metrics' },
                    { name: 'Google Analytics', priority: 'high', value: 'Traffic insights' },
                    { name: 'Facebook Ads', priority: 'medium', value: 'Ad performance' }
                ],
                features: [
                    'Inventory Forecasting',
                    'Customer Segmentation',
                    'Price Optimization',
                    'Abandoned Cart Recovery'
                ]
            },
            'saas': {
                queries: [
                    'What\'s my net revenue retention rate?',
                    'Which features correlate with lower churn?',
                    'Show me expansion revenue opportunities',
                    'What\'s the average time to value for new customers?',
                    'Which pricing tier has the best unit economics?'
                ],
                integrations: [
                    { name: 'Stripe', priority: 'critical', value: 'Billing and revenue' },
                    { name: 'Intercom', priority: 'high', value: 'Customer engagement' },
                    { name: 'Segment', priority: 'high', value: 'User behavior' },
                    { name: 'Salesforce', priority: 'medium', value: 'Sales pipeline' }
                ],
                features: [
                    'Churn Prediction',
                    'Customer Health Scoring',
                    'Usage Analytics',
                    'Revenue Forecasting'
                ]
            },
            'services': {
                queries: [
                    'Which clients generate the most profit per hour?',
                    'What\'s my team\'s billable utilization rate?',
                    'Show me project profitability trends',
                    'Which services have the highest margins?',
                    'Where is scope creep costing us money?'
                ],
                integrations: [
                    { name: 'QuickBooks', priority: 'critical', value: 'Financial data' },
                    { name: 'Harvest', priority: 'high', value: 'Time tracking' },
                    { name: 'Asana', priority: 'high', value: 'Project management' },
                    { name: 'HubSpot', priority: 'medium', value: 'CRM and pipeline' }
                ],
                features: [
                    'Resource Planning',
                    'Project Profitability',
                    'Client Scorecards',
                    'Capacity Forecasting'
                ]
            }
        },

        similarCompanyPatterns: {
            'small-ecommerce': {
                size: '1-10',
                industry: 'ecommerce',
                successMetrics: {
                    'conversionRate': 3.2,
                    'averageOrderValue': 85,
                    'customerRetention': 28
                },
                popularQueries: [
                    'Daily sales dashboard',
                    'Product performance matrix',
                    'Customer acquisition costs',
                    'Inventory turnover rates'
                ],
                commonIntegrations: ['Shopify', 'Mailchimp', 'Google Analytics'],
                timeToValue: 2
            },
            'growing-saas': {
                size: '11-50',
                industry: 'saas',
                successMetrics: {
                    'monthlyGrowth': 15,
                    'churnRate': 5,
                    'nps': 45
                },
                popularQueries: [
                    'MRR growth breakdown',
                    'Feature adoption rates',
                    'Customer health scores',
                    'Churn prediction model'
                ],
                commonIntegrations: ['Stripe', 'Intercom', 'Mixpanel', 'Segment'],
                timeToValue: 3
            },
            'established-services': {
                size: '20-100',
                industry: 'services',
                successMetrics: {
                    'utilization': 75,
                    'profitMargin': 35,
                    'clientRetention': 85
                },
                popularQueries: [
                    'Project profitability report',
                    'Resource utilization dashboard',
                    'Client lifetime value',
                    'Pipeline forecasting'
                ],
                commonIntegrations: ['QuickBooks', 'Salesforce', 'Monday.com'],
                timeToValue: 4
            }
        },

        init: function() {
            this.analyzeUserBehavior();
            this.generateRecommendations();
            this.trackRecommendations();
        },

        analyzeUserBehavior: function() {
            const progress = JSON.parse(localStorage.getItem('datasense_onboarding_progress') || '{}');
            const profile = JSON.parse(localStorage.getItem('datasense_onboarding_profile') || '{}');
            
            this.userBehavior = {
                queriesRun: progress.queriesRun || 0,
                dashboardsCreated: progress.dashboardsCreated || 0,
                integrationsConnected: progress.connectionsCreated || 0,
                teamInvites: progress.teamInvites || 0,
                timeSpent: Math.floor((Date.now() - progress.startTime) / 60000) || 0,
                lastActive: progress.lastLogin || Date.now(),
                industry: profile.industry,
                role: profile.role,
                teamSize: profile.teamSize,
                challenges: profile.challenges || [],
                desiredInsight: profile.desiredInsight
            };
            
            this.identifyBehaviorPattern();
        },

        identifyBehaviorPattern: function() {
            const patterns = [];
            
            if (this.userBehavior.queriesRun > 10) {
                patterns.push('data-explorer');
            }
            if (this.userBehavior.dashboardsCreated > 2) {
                patterns.push('dashboard-builder');
            }
            if (this.userBehavior.teamInvites > 3) {
                patterns.push('team-collaborator');
            }
            
            if (patterns.length === 0) {
                patterns.push(this.predictPattern());
            }
            
            this.userBehavior.patterns = patterns;
        },

        predictPattern: function() {
            const role = this.userBehavior.role;
            const challenges = this.userBehavior.challenges;
            
            if (role === 'operations' || challenges.includes('manual')) {
                return 'automation-seeker';
            } else if (role === 'marketing' || challenges.includes('insights')) {
                return 'data-explorer';
            } else if (challenges.includes('team')) {
                return 'team-collaborator';
            } else {
                return 'dashboard-builder';
            }
        },

        generateRecommendations: function() {
            this.recommendations = [];
            
            this.addBehaviorRecommendations();
            this.addIndustryRecommendations();
            this.addSimilarCompanyRecommendations();
            this.addPersonalizedRecommendations();
            this.addTimelyRecommendations();
            
            this.prioritizeRecommendations();
        },

        addBehaviorRecommendations: function() {
            const patterns = this.userBehavior.patterns || [];
            
            patterns.forEach(pattern => {
                const patternRecs = this.behaviorPatterns[pattern];
                if (patternRecs) {
                    patternRecs.recommendations.forEach(rec => {
                        this.recommendations.push({
                            ...rec,
                            source: 'behavior',
                            priority: 'high',
                            pattern: pattern
                        });
                    });
                }
            });
        },

        addIndustryRecommendations: function() {
            const industry = this.userBehavior.industry;
            const industryRecs = this.industryRecommendations[industry];
            
            if (!industryRecs) return;
            
            const queryRecs = industryRecs.queries.slice(0, 3).map(query => ({
                type: 'query',
                item: query,
                reason: 'Popular in your industry',
                source: 'industry',
                priority: 'medium'
            }));
            
            const integrationRecs = industryRecs.integrations
                .filter(int => int.priority === 'critical' || int.priority === 'high')
                .slice(0, 2)
                .map(int => ({
                    type: 'integration',
                    item: int.name,
                    reason: int.value,
                    source: 'industry',
                    priority: int.priority
                }));
            
            const featureRecs = industryRecs.features.slice(0, 2).map(feature => ({
                type: 'feature',
                item: feature,
                reason: `Essential for ${industry}`,
                source: 'industry',
                priority: 'medium'
            }));
            
            this.recommendations.push(...queryRecs, ...integrationRecs, ...featureRecs);
        },

        addSimilarCompanyRecommendations: function() {
            const companyProfile = this.findSimilarCompanyProfile();
            if (!companyProfile) return;
            
            const successRec = {
                type: 'insight',
                item: `Companies like yours see ${companyProfile.successMetrics.monthlyGrowth || 10}% growth`,
                reason: 'Based on similar businesses',
                source: 'peers',
                priority: 'low'
            };
            
            const queryRecs = companyProfile.popularQueries.slice(0, 2).map(query => ({
                type: 'query',
                item: query,
                reason: 'Popular with similar companies',
                source: 'peers',
                priority: 'medium'
            }));
            
            this.recommendations.push(successRec, ...queryRecs);
        },

        findSimilarCompanyProfile: function() {
            const size = this.userBehavior.teamSize;
            const industry = this.userBehavior.industry;
            
            for (const [key, profile] of Object.entries(this.similarCompanyPatterns)) {
                if (profile.industry === industry) {
                    const sizeRange = profile.size.split('-').map(Number);
                    if (size >= sizeRange[0] && size <= sizeRange[1]) {
                        return profile;
                    }
                }
            }
            
            return null;
        },

        addPersonalizedRecommendations: function() {
            const desiredInsight = this.userBehavior.desiredInsight;
            if (!desiredInsight) return;
            
            const personalizedRecs = [
                {
                    type: 'query',
                    item: this.generateSmartQuery(desiredInsight),
                    reason: 'Based on your goal',
                    source: 'personalized',
                    priority: 'critical'
                },
                {
                    type: 'tutorial',
                    item: this.suggestTutorial(desiredInsight),
                    reason: 'Learn to find these insights',
                    source: 'personalized',
                    priority: 'high'
                }
            ];
            
            this.recommendations.push(...personalizedRecs);
        },

        generateSmartQuery: function(insight) {
            const keywords = insight.toLowerCase().split(' ');
            
            if (keywords.includes('customer') || keywords.includes('churn')) {
                return 'Analyze customer retention by cohort and identify churn predictors';
            } else if (keywords.includes('profit') || keywords.includes('margin')) {
                return 'Calculate true profitability after all costs by product/service';
            } else if (keywords.includes('growth') || keywords.includes('revenue')) {
                return 'Identify top growth drivers and expansion opportunities';
            } else {
                return `Custom analysis: ${insight}`;
            }
        },

        suggestTutorial: function(insight) {
            const keywords = insight.toLowerCase().split(' ');
            
            if (keywords.includes('customer')) {
                return 'Customer Analytics Masterclass';
            } else if (keywords.includes('profit') || keywords.includes('cost')) {
                return 'Profitability Analysis Guide';
            } else if (keywords.includes('marketing') || keywords.includes('campaign')) {
                return 'Marketing Attribution Tutorial';
            } else {
                return 'Advanced Analytics Techniques';
            }
        },

        addTimelyRecommendations: function() {
            const now = new Date();
            const dayOfWeek = now.getDay();
            const hourOfDay = now.getHours();
            const dayOfMonth = now.getDate();
            
            if (dayOfWeek === 1) {
                this.recommendations.push({
                    type: 'query',
                    item: 'Weekly performance summary',
                    reason: 'Start your week with insights',
                    source: 'timely',
                    priority: 'medium'
                });
            }
            
            if (dayOfMonth === 1) {
                this.recommendations.push({
                    type: 'report',
                    item: 'Monthly business review',
                    reason: 'Track monthly progress',
                    source: 'timely',
                    priority: 'high'
                });
            }
            
            if (hourOfDay >= 8 && hourOfDay <= 10) {
                this.recommendations.push({
                    type: 'dashboard',
                    item: 'Morning metrics dashboard',
                    reason: 'Start your day informed',
                    source: 'timely',
                    priority: 'low'
                });
            }
        },

        prioritizeRecommendations: function() {
            const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
            
            this.recommendations.sort((a, b) => {
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            });
            
            this.recommendations = this.removeDuplicates(this.recommendations);
            
            this.recommendations = this.recommendations.slice(0, 10);
        },

        removeDuplicates: function(recommendations) {
            const seen = new Set();
            return recommendations.filter(rec => {
                const key = `${rec.type}-${rec.item}`;
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            });
        },

        renderRecommendations: function() {
            const container = document.getElementById('recommendations');
            if (!container) return;
            
            const html = `
                <div class="recommendations-container">
                    <h2>🎯 Recommended for You</h2>
                    <p class="recommendations-subtitle">Based on your usage and goals</p>
                    
                    <div class="recommendations-grid">
                        ${this.recommendations.map(rec => this.renderRecommendation(rec)).join('')}
                    </div>
                    
                    <div class="see-more">
                        <button onclick="DataSenseRecommendations.loadMore()">
                            See More Recommendations
                        </button>
                    </div>
                </div>
            `;
            
            container.innerHTML = html;
        },

        renderRecommendation: function(rec) {
            const icons = {
                'query': '🔍',
                'feature': '⚡',
                'integration': '🔗',
                'template': '📋',
                'tutorial': '📚',
                'dashboard': '📊',
                'report': '📈',
                'insight': '💡'
            };
            
            return `
                <div class="recommendation-card priority-${rec.priority}" data-type="${rec.type}">
                    <div class="rec-header">
                        <span class="rec-icon">${icons[rec.type] || '📌'}</span>
                        <span class="rec-type">${rec.type}</span>
                        ${rec.priority === 'critical' ? '<span class="rec-badge">Must Try</span>' : ''}
                    </div>
                    <h4 class="rec-title">${rec.item}</h4>
                    <p class="rec-reason">${rec.reason}</p>
                    <button class="rec-action" onclick="DataSenseRecommendations.takeAction('${rec.type}', '${rec.item}')">
                        ${this.getActionLabel(rec.type)}
                    </button>
                </div>
            `;
        },

        getActionLabel: function(type) {
            const labels = {
                'query': 'Run Query',
                'feature': 'Try Feature',
                'integration': 'Connect',
                'template': 'Use Template',
                'tutorial': 'Watch Now',
                'dashboard': 'Create',
                'report': 'Generate',
                'insight': 'Learn More'
            };
            
            return labels[type] || 'Explore';
        },

        takeAction: function(type, item) {
            console.log(`Taking action: ${type} - ${item}`);
            
            this.trackAction(type, item);
            
            switch(type) {
                case 'query':
                    this.runQuery(item);
                    break;
                case 'feature':
                    this.openFeature(item);
                    break;
                case 'integration':
                    this.startIntegration(item);
                    break;
                case 'template':
                    this.loadTemplate(item);
                    break;
                case 'tutorial':
                    this.watchTutorial(item);
                    break;
                case 'dashboard':
                    this.createDashboard(item);
                    break;
                case 'report':
                    this.generateReport(item);
                    break;
                case 'insight':
                    this.showInsight(item);
                    break;
            }
        },

        runQuery: function(query) {
            console.log('Running query:', query);
            
            const progress = JSON.parse(localStorage.getItem('datasense_onboarding_progress') || '{}');
            progress.queriesRun = (progress.queriesRun || 0) + 1;
            localStorage.setItem('datasense_onboarding_progress', JSON.stringify(progress));
        },

        openFeature: function(feature) {
            console.log('Opening feature:', feature);
            window.location.href = `/app/features/${feature.toLowerCase().replace(/ /g, '-')}`;
        },

        startIntegration: function(integration) {
            console.log('Starting integration:', integration);
            window.location.href = `/app/integrations/${integration.toLowerCase()}`;
        },

        loadTemplate: function(template) {
            console.log('Loading template:', template);
            window.location.href = `/app/templates/${template.toLowerCase().replace(/ /g, '-')}`;
        },

        watchTutorial: function(tutorial) {
            console.log('Opening tutorial:', tutorial);
            window.open(`/tutorials/${tutorial.toLowerCase().replace(/ /g, '-')}`, '_blank');
        },

        createDashboard: function(dashboard) {
            console.log('Creating dashboard:', dashboard);
            window.location.href = `/app/dashboards/new?template=${dashboard.toLowerCase().replace(/ /g, '-')}`;
        },

        generateReport: function(report) {
            console.log('Generating report:', report);
            window.location.href = `/app/reports/generate?type=${report.toLowerCase().replace(/ /g, '-')}`;
        },

        showInsight: function(insight) {
            console.log('Showing insight:', insight);
            
            const modal = document.createElement('div');
            modal.className = 'insight-modal';
            modal.innerHTML = `
                <div class="insight-content">
                    <h3>💡 Insight</h3>
                    <p>${insight}</p>
                    <button onclick="this.parentElement.parentElement.remove()">Got it!</button>
                </div>
            `;
            document.body.appendChild(modal);
        },

        loadMore: function() {
            console.log('Loading more recommendations...');
            
            this.recommendations.push(
                {
                    type: 'feature',
                    item: 'Advanced Filtering',
                    reason: 'Dive deeper into your data',
                    priority: 'medium'
                },
                {
                    type: 'template',
                    item: 'Executive Dashboard',
                    reason: 'Impress stakeholders',
                    priority: 'low'
                }
            );
            
            this.renderRecommendations();
        },

        trackAction: function(type, item) {
            if (window.DataSenseTracking) {
                window.DataSenseTracking.trackEvent('recommendation_action', {
                    type: type,
                    item: item,
                    source: this.recommendations.find(r => r.item === item)?.source
                });
            }
        },

        trackRecommendations: function() {
            if (window.DataSenseTracking) {
                window.DataSenseTracking.trackEvent('recommendations_generated', {
                    count: this.recommendations.length,
                    patterns: this.userBehavior.patterns,
                    industry: this.userBehavior.industry
                });
            }
        },

        getSmartSuggestion: function(context) {
            const suggestions = {
                'stuck': 'Try connecting your most important data source first',
                'exploring': 'Check out our pre-built dashboards for quick wins',
                'advanced': 'Unlock SQL access for custom queries',
                'team': 'Invite a colleague to collaborate on insights',
                'learning': 'Watch our 5-minute quickstart video'
            };
            
            return suggestions[context] || 'Explore our template gallery for inspiration';
        },

        suggestNextStep: function() {
            const progress = JSON.parse(localStorage.getItem('datasense_onboarding_progress') || '{}');
            
            if (!progress.connectionsCreated || progress.connectionsCreated === 0) {
                return {
                    action: 'Connect your first data source',
                    reason: 'Everything starts with data',
                    link: '/app/integrations'
                };
            } else if (!progress.dashboardsCreated || progress.dashboardsCreated === 0) {
                return {
                    action: 'Create your first dashboard',
                    reason: 'Visualize your insights',
                    link: '/app/dashboards/new'
                };
            } else if (!progress.teamInvites || progress.teamInvites === 0) {
                return {
                    action: 'Invite your team',
                    reason: 'Share insights and collaborate',
                    link: '/app/team/invite'
                };
            } else {
                return {
                    action: 'Explore advanced features',
                    reason: "You're ready for more",
                    link: '/app/features'
                };
            }
        }
    };

})();