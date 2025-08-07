(function() {
    'use strict';

    window.DataSenseOnboardingPath = {
        userProfile: null,
        currentPath: null,
        milestones: [],
        
        paths: {
            'ecommerce': {
                name: 'E-commerce Success Path',
                icon: '🛍️',
                duration: '7 days',
                steps: [
                    {
                        day: 1,
                        title: 'Connect & Discover',
                        tasks: [
                            { id: 'connect-shopify', title: 'Connect Shopify', time: '5 min', priority: 'critical' },
                            { id: 'view-bestsellers', title: 'View best selling products', time: '2 min', priority: 'high' },
                            { id: 'revenue-dashboard', title: 'See real-time revenue dashboard', time: '1 min', priority: 'high' }
                        ],
                        insight: 'Your top 20% of products generate 80% of revenue'
                    },
                    {
                        day: 2,
                        title: 'Customer Intelligence',
                        tasks: [
                            { id: 'segment-customers', title: 'Identify customer segments', time: '10 min', priority: 'high' },
                            { id: 'ltv-analysis', title: 'Calculate customer lifetime value', time: '5 min', priority: 'medium' },
                            { id: 'churn-risks', title: 'Find at-risk customers', time: '5 min', priority: 'high' }
                        ],
                        insight: 'VIP customers worth 5x average buyer'
                    },
                    {
                        day: 3,
                        title: 'Hidden Opportunities',
                        tasks: [
                            { id: 'cross-sell', title: 'Discover cross-sell opportunities', time: '10 min', priority: 'high' },
                            { id: 'abandoned-carts', title: 'Analyze abandoned cart patterns', time: '5 min', priority: 'medium' },
                            { id: 'pricing-optimization', title: 'Find pricing sweet spots', time: '15 min', priority: 'medium' }
                        ],
                        insight: 'Bundle these 3 products to increase AOV by 40%'
                    },
                    {
                        day: 7,
                        title: 'Full Automation',
                        tasks: [
                            { id: 'automated-reports', title: 'Set up daily reports', time: '10 min', priority: 'medium' },
                            { id: 'alert-rules', title: 'Configure smart alerts', time: '10 min', priority: 'high' },
                            { id: 'team-dashboards', title: 'Create team dashboards', time: '15 min', priority: 'low' }
                        ],
                        insight: 'Save 10 hours per week on reporting'
                    }
                ],
                templates: [
                    'Revenue Analytics Dashboard',
                    'Customer Segmentation Report',
                    'Product Performance Matrix',
                    'Marketing Attribution Model',
                    'Inventory Optimization Tool'
                ],
                integrations: ['Shopify', 'Klaviyo', 'Google Analytics', 'Facebook Ads', 'Stripe'],
                successMetrics: {
                    'timeToFirstInsight': 15,
                    'dashboardsCreated': 5,
                    'automationsEnabled': 3,
                    'teamMembersInvited': 2
                }
            },
            
            'saas': {
                name: 'B2B SaaS Growth Path',
                icon: '🚀',
                duration: '7 days',
                steps: [
                    {
                        day: 1,
                        title: 'Revenue Foundation',
                        tasks: [
                            { id: 'connect-stripe', title: 'Connect Stripe/billing system', time: '5 min', priority: 'critical' },
                            { id: 'mrr-analysis', title: 'Analyze MRR breakdown', time: '3 min', priority: 'critical' },
                            { id: 'growth-metrics', title: 'View growth metrics', time: '2 min', priority: 'high' }
                        ],
                        insight: 'Your MRR growth rate is 12% month-over-month'
                    },
                    {
                        day: 2,
                        title: 'Churn Prevention',
                        tasks: [
                            { id: 'churn-analysis', title: 'Identify churn patterns', time: '15 min', priority: 'critical' },
                            { id: 'health-scores', title: 'Set up customer health scores', time: '10 min', priority: 'high' },
                            { id: 'risk-alerts', title: 'Configure churn risk alerts', time: '5 min', priority: 'high' }
                        ],
                        insight: '30% of churn happens in first 30 days'
                    },
                    {
                        day: 3,
                        title: 'Expansion Revenue',
                        tasks: [
                            { id: 'upsell-opportunities', title: 'Find upsell candidates', time: '10 min', priority: 'high' },
                            { id: 'usage-analysis', title: 'Analyze feature usage', time: '10 min', priority: 'medium' },
                            { id: 'expansion-triggers', title: 'Identify expansion triggers', time: '10 min', priority: 'medium' }
                        ],
                        insight: '40% of users ready for plan upgrade'
                    },
                    {
                        day: 7,
                        title: 'Predictive Intelligence',
                        tasks: [
                            { id: 'ltv-prediction', title: 'Build LTV predictions', time: '20 min', priority: 'medium' },
                            { id: 'cohort-analysis', title: 'Set up cohort tracking', time: '15 min', priority: 'medium' },
                            { id: 'forecasting', title: 'Enable revenue forecasting', time: '10 min', priority: 'high' }
                        ],
                        insight: 'Projected to hit $1M ARR in 6 months'
                    }
                ],
                templates: [
                    'SaaS Metrics Dashboard',
                    'Churn Analysis Report',
                    'Customer Health Scorecard',
                    'Cohort Analysis Tool',
                    'Revenue Forecasting Model'
                ],
                integrations: ['Stripe', 'Intercom', 'Segment', 'Salesforce', 'Mixpanel'],
                successMetrics: {
                    'churnReduction': 15,
                    'expansionRevenue': 25,
                    'healthScoresCreated': 100,
                    'forecastAccuracy': 90
                }
            },
            
            'services': {
                name: 'Service Business Optimizer',
                icon: '💼',
                duration: '5 days',
                steps: [
                    {
                        day: 1,
                        title: 'Profitability Insights',
                        tasks: [
                            { id: 'connect-quickbooks', title: 'Connect QuickBooks', time: '5 min', priority: 'critical' },
                            { id: 'project-profitability', title: 'Analyze project margins', time: '10 min', priority: 'critical' },
                            { id: 'client-profitability', title: 'Rank clients by profitability', time: '5 min', priority: 'high' }
                        ],
                        insight: '20% of clients generate 75% of profit'
                    },
                    {
                        day: 2,
                        title: 'Resource Optimization',
                        tasks: [
                            { id: 'utilization-rates', title: 'Calculate team utilization', time: '10 min', priority: 'high' },
                            { id: 'capacity-planning', title: 'Build capacity model', time: '15 min', priority: 'medium' },
                            { id: 'bottleneck-analysis', title: 'Identify bottlenecks', time: '10 min', priority: 'high' }
                        ],
                        insight: 'Increase billable hours by 25% with better scheduling'
                    },
                    {
                        day: 3,
                        title: 'Scope Management',
                        tasks: [
                            { id: 'scope-creep', title: 'Track scope creep patterns', time: '10 min', priority: 'high' },
                            { id: 'project-timelines', title: 'Analyze project overruns', time: '10 min', priority: 'medium' },
                            { id: 'change-orders', title: 'Monitor change requests', time: '5 min', priority: 'medium' }
                        ],
                        insight: 'Scope creep costing $50K per quarter'
                    },
                    {
                        day: 5,
                        title: 'Growth Planning',
                        tasks: [
                            { id: 'pipeline-analysis', title: 'Build pipeline dashboard', time: '15 min', priority: 'high' },
                            { id: 'win-rate', title: 'Track win rates', time: '5 min', priority: 'medium' },
                            { id: 'forecasting', title: 'Create revenue forecast', time: '10 min', priority: 'high' }
                        ],
                        insight: 'Need 20% more leads to hit growth targets'
                    }
                ],
                templates: [
                    'Project Profitability Dashboard',
                    'Resource Utilization Report',
                    'Client Performance Scorecard',
                    'Pipeline Analytics Tool',
                    'Cash Flow Forecaster'
                ],
                integrations: ['QuickBooks', 'Harvest', 'Asana', 'HubSpot', 'Google Workspace'],
                successMetrics: {
                    'marginImprovement': 10,
                    'utilizationRate': 75,
                    'scopeCreepReduction': 50,
                    'forecastAccuracy': 85
                }
            }
        },

        tracks: {
            'guided': {
                name: 'Guided Journey',
                description: 'Step-by-step walkthrough with built-in best practices',
                icon: '🎯',
                features: [
                    'Interactive tutorials for each feature',
                    'Pre-built dashboard templates',
                    'Daily tip emails',
                    'Progress tracking',
                    'Suggested next actions'
                ],
                support: {
                    'chat': 'Priority support',
                    'resources': 'Curated learning path',
                    'checkIns': 'Weekly progress review'
                },
                pacing: 'moderate',
                handholding: 'medium'
            },
            
            'self-serve': {
                name: 'Explorer Mode',
                description: 'Full access to explore at your own pace',
                icon: '🔍',
                features: [
                    'All features unlocked immediately',
                    'Complete documentation library',
                    'Video tutorial collection',
                    'Community forum access',
                    'Advanced feature access'
                ],
                support: {
                    'chat': 'Standard support',
                    'resources': 'Full knowledge base',
                    'checkIns': 'None'
                },
                pacing: 'self-directed',
                handholding: 'minimal'
            },
            
            'white-glove': {
                name: 'White Glove Service',
                description: 'Personal onboarding specialist guides you to success',
                icon: '🤝',
                features: [
                    'Dedicated onboarding specialist',
                    'Custom dashboard creation',
                    'Data connection assistance',
                    'Team training sessions',
                    'Custom report building'
                ],
                support: {
                    'chat': 'Direct line to specialist',
                    'resources': 'Custom materials',
                    'checkIns': 'Daily for first week'
                },
                pacing: 'accelerated',
                handholding: 'maximum'
            }
        },

        generatePath: function(profile) {
            this.userProfile = profile;
            
            const industryPath = this.paths[profile.industry] || this.paths['services'];
            const track = this.tracks[profile.recommendedTrack];
            
            this.currentPath = {
                industry: industryPath,
                track: track,
                customizations: this.customizePathForUser(industryPath, profile),
                milestones: this.generateMilestones(profile),
                firstQueries: this.generateFirstQueries(profile),
                estimatedCompletion: this.calculateCompletionTime(profile)
            };
            
            this.renderOnboardingPath();
            this.initializeProgress();
            return this.currentPath;
        },

        customizePathForUser: function(basePath, profile) {
            const customPath = JSON.parse(JSON.stringify(basePath));
            
            if (profile.urgency === 'today') {
                customPath.steps = customPath.steps.slice(0, 1);
                customPath.duration = '30 minutes';
            }
            
            if (profile.tools && profile.tools.length > 0) {
                const primaryTool = profile.tools[0];
                customPath.steps[0].tasks[0] = {
                    id: 'connect-primary',
                    title: `Connect ${primaryTool}`,
                    time: '5 min',
                    priority: 'critical'
                };
            }
            
            if (profile.desiredInsight) {
                customPath.steps[0].insight = this.generateCustomInsight(profile.desiredInsight);
            }
            
            if (profile.maturityScore.level === 'beginner') {
                customPath.steps.forEach(step => {
                    step.tasks.forEach(task => {
                        task.time = `${parseInt(task.time) * 1.5} min`;
                    });
                });
            }
            
            if (profile.teamSize > 5) {
                customPath.steps.push({
                    day: customPath.steps.length + 1,
                    title: 'Team Enablement',
                    tasks: [
                        { id: 'team-training', title: 'Schedule team training', time: '30 min', priority: 'high' },
                        { id: 'permissions', title: 'Set up permissions', time: '15 min', priority: 'high' },
                        { id: 'team-dashboards', title: 'Create role-specific dashboards', time: '20 min', priority: 'medium' }
                    ],
                    insight: 'Empower your team with data-driven decisions'
                });
            }
            
            return customPath;
        },

        generateMilestones: function(profile) {
            const milestones = [
                {
                    id: 'first-insight',
                    name: 'First Insight',
                    description: 'Discover your first valuable insight',
                    target: 30,
                    unit: 'minutes',
                    reward: 'badge',
                    icon: '💡'
                },
                {
                    id: 'data-connected',
                    name: 'Data Connected',
                    description: 'Connect your first data source',
                    target: 1,
                    unit: 'connection',
                    reward: 'feature-unlock',
                    icon: '🔗'
                },
                {
                    id: 'dashboard-created',
                    name: 'Dashboard Master',
                    description: 'Create your first dashboard',
                    target: 1,
                    unit: 'dashboard',
                    reward: 'template-access',
                    icon: '📊'
                },
                {
                    id: 'team-onboarded',
                    name: 'Team Player',
                    description: 'Invite team members',
                    target: profile.teamSize > 1 ? 2 : 1,
                    unit: 'invites',
                    reward: 'collaboration-features',
                    icon: '👥'
                },
                {
                    id: 'automation-enabled',
                    name: 'Automation Pro',
                    description: 'Set up your first automation',
                    target: 1,
                    unit: 'automation',
                    reward: 'advanced-automations',
                    icon: '⚡'
                },
                {
                    id: 'roi-achieved',
                    name: 'ROI Champion',
                    description: 'Generate measurable value',
                    target: 1,
                    unit: 'success',
                    reward: 'case-study',
                    icon: '🏆'
                }
            ];
            
            if (profile.urgency === 'today') {
                return milestones.slice(0, 3);
            }
            
            return milestones;
        },

        generateFirstQueries: function(profile) {
            const queries = [];
            const industry = profile.industry;
            const challenges = profile.challenges || [];
            
            const queryTemplates = {
                'ecommerce': {
                    'scattered': 'Show me total revenue across all channels',
                    'manual': 'Automate my daily sales report',
                    'insights': 'What products should I promote this week?',
                    'default': 'Show me today\'s sales performance'
                },
                'saas': {
                    'scattered': 'Consolidate metrics from all tools',
                    'manual': 'Build automated MRR report',
                    'insights': 'Which customers are at risk of churning?',
                    'default': 'Show me current MRR and growth rate'
                },
                'services': {
                    'scattered': 'Combine project and financial data',
                    'manual': 'Automate project status reports',
                    'insights': 'Which projects are most profitable?',
                    'default': 'Show me project profitability ranking'
                }
            };
            
            const industryQueries = queryTemplates[industry] || queryTemplates['services'];
            
            challenges.forEach(challenge => {
                if (industryQueries[challenge]) {
                    queries.push({
                        query: industryQueries[challenge],
                        priority: 'high',
                        estimatedValue: 'High impact'
                    });
                }
            });
            
            if (queries.length === 0) {
                queries.push({
                    query: industryQueries['default'],
                    priority: 'medium',
                    estimatedValue: 'Quick win'
                });
            }
            
            if (profile.desiredInsight) {
                queries.unshift({
                    query: profile.desiredInsight,
                    priority: 'critical',
                    estimatedValue: 'User requested'
                });
            }
            
            return queries.slice(0, 3);
        },

        generateCustomInsight: function(desiredInsight) {
            const insights = {
                'customer': 'Your customer acquisition cost is 40% lower than industry average',
                'revenue': 'Tuesday afternoons drive 35% more revenue than other times',
                'product': 'Bundle these 3 products to increase order value by 45%',
                'churn': '3 warning signs appear 2 weeks before customer churn',
                'profit': 'Focusing on top 20% of clients would increase profit by 60%'
            };
            
            for (const [key, value] of Object.entries(insights)) {
                if (desiredInsight.toLowerCase().includes(key)) {
                    return value;
                }
            }
            
            return 'Your data reveals opportunities worth $50K+ annually';
        },

        calculateCompletionTime: function(profile) {
            let baseTime = 7;
            
            if (profile.recommendedTrack === 'white-glove') {
                baseTime = 3;
            } else if (profile.recommendedTrack === 'self-serve') {
                baseTime = 14;
            }
            
            if (profile.urgency === 'today') {
                baseTime = 0.5;
            } else if (profile.urgency === 'week') {
                baseTime = Math.min(baseTime, 7);
            }
            
            if (profile.maturityScore.level === 'beginner') {
                baseTime *= 1.5;
            } else if (profile.maturityScore.level === 'advanced') {
                baseTime *= 0.75;
            }
            
            return {
                days: Math.ceil(baseTime),
                hours: Math.round(baseTime * 2),
                firstValue: profile.estimatedTimeToValue || 30
            };
        },

        renderOnboardingPath: function() {
            const container = document.getElementById('onboarding-path');
            if (!container) {
                this.createPathContainer();
                return;
            }
            
            const path = this.currentPath;
            const html = `
                <div class="onboarding-container">
                    <div class="path-header">
                        <div class="path-title">
                            <h1>${path.industry.icon} Your Personalized ${path.industry.name}</h1>
                            <p class="path-subtitle">Estimated time to value: ${path.estimatedCompletion.firstValue} minutes</p>
                        </div>
                        
                        <div class="track-selector">
                            <h3>Your Onboarding Style: ${path.track.name}</h3>
                            <p>${path.track.description}</p>
                            <button onclick="DataSenseOnboardingPath.changeTrack()">Change Track</button>
                        </div>
                    </div>
                    
                    <div class="first-value-guarantee">
                        <div class="guarantee-badge">🎯 30-Minute Value Guarantee</div>
                        <p>See your first valuable insight in 30 minutes or we'll personally help you find it</p>
                    </div>
                    
                    <div class="quick-start-section">
                        <h2>🚀 Your First 3 Queries</h2>
                        <div class="query-cards">
                            ${path.firstQueries.map(q => `
                                <div class="query-card priority-${q.priority}">
                                    <div class="query-text">${q.query}</div>
                                    <div class="query-value">${q.estimatedValue}</div>
                                    <button onclick="DataSenseOnboardingPath.runQuery('${q.query}')">Run Query</button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="journey-timeline">
                        <h2>📅 Your Success Journey</h2>
                        ${this.renderTimeline(path.customizations)}
                    </div>
                    
                    <div class="milestones-section">
                        <h2>🏆 Achievements & Rewards</h2>
                        <div class="milestones-grid">
                            ${path.milestones.map(m => this.renderMilestone(m)).join('')}
                        </div>
                    </div>
                    
                    <div class="support-section">
                        <h2>💬 Your Support Options</h2>
                        <div class="support-cards">
                            <div class="support-card">
                                <h4>Live Chat</h4>
                                <p>${path.track.support.chat}</p>
                                <button onclick="DataSenseOnboardingPath.startChat()">Start Chat</button>
                            </div>
                            <div class="support-card">
                                <h4>Resources</h4>
                                <p>${path.track.support.resources}</p>
                                <button onclick="DataSenseOnboardingPath.viewResources()">Browse</button>
                            </div>
                            <div class="support-card">
                                <h4>Check-ins</h4>
                                <p>${path.track.support.checkIns}</p>
                                <button onclick="DataSenseOnboardingPath.scheduleCheckIn()">Schedule</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="action-buttons">
                        <button class="btn-primary btn-large" onclick="DataSenseOnboardingPath.startJourney()">
                            Start My Journey Now
                        </button>
                        <button class="btn-secondary" onclick="DataSenseOnboardingPath.savePath()">
                            Save for Later
                        </button>
                    </div>
                </div>
            `;
            
            container.innerHTML = html;
        },

        renderTimeline: function(path) {
            let html = '<div class="timeline">';
            
            path.steps.forEach((step, index) => {
                const isFirst = index === 0;
                html += `
                    <div class="timeline-step ${isFirst ? 'active' : ''}">
                        <div class="step-marker">
                            <span class="step-day">Day ${step.day}</span>
                            <span class="step-icon">${isFirst ? '🎯' : '📈'}</span>
                        </div>
                        <div class="step-content">
                            <h3>${step.title}</h3>
                            <div class="step-tasks">
                                ${step.tasks.map(task => `
                                    <div class="task-item priority-${task.priority}">
                                        <input type="checkbox" id="${task.id}" onchange="DataSenseOnboardingPath.completeTask('${task.id}')">
                                        <label for="${task.id}">
                                            ${task.title} 
                                            <span class="task-time">${task.time}</span>
                                        </label>
                                    </div>
                                `).join('')}
                            </div>
                            <div class="step-insight">
                                <span class="insight-icon">💡</span>
                                <span class="insight-text">${step.insight}</span>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
            return html;
        },

        renderMilestone: function(milestone) {
            return `
                <div class="milestone-card" id="milestone-${milestone.id}">
                    <div class="milestone-icon">${milestone.icon}</div>
                    <h4>${milestone.name}</h4>
                    <p>${milestone.description}</p>
                    <div class="milestone-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 0%"></div>
                        </div>
                        <span class="progress-text">0 / ${milestone.target} ${milestone.unit}</span>
                    </div>
                    <div class="milestone-reward">
                        🎁 ${milestone.reward}
                    </div>
                </div>
            `;
        },

        createPathContainer: function() {
            const container = document.createElement('div');
            container.id = 'onboarding-path';
            container.className = 'onboarding-path-container';
            document.body.appendChild(container);
            this.renderOnboardingPath();
        },

        initializeProgress: function() {
            const progress = {
                startTime: Date.now(),
                completedTasks: [],
                unlockedFeatures: [],
                achievements: [],
                currentStep: 0
            };
            
            localStorage.setItem('datasense_onboarding_progress', JSON.stringify(progress));
            this.startProgressTracking();
        },

        startProgressTracking: function() {
            setInterval(() => {
                this.checkMilestones();
                this.updateHealthScore();
            }, 30000);
        },

        checkMilestones: function() {
            const progress = JSON.parse(localStorage.getItem('datasense_onboarding_progress') || '{}');
            
            this.currentPath.milestones.forEach(milestone => {
                const element = document.getElementById(`milestone-${milestone.id}`);
                if (!element) return;
                
                let current = 0;
                
                switch(milestone.id) {
                    case 'first-insight':
                        current = progress.insightsViewed || 0;
                        break;
                    case 'data-connected':
                        current = progress.connectionsCreated || 0;
                        break;
                    case 'dashboard-created':
                        current = progress.dashboardsCreated || 0;
                        break;
                    case 'team-onboarded':
                        current = progress.teamInvites || 0;
                        break;
                    case 'automation-enabled':
                        current = progress.automationsCreated || 0;
                        break;
                }
                
                const percentage = Math.min(100, (current / milestone.target) * 100);
                element.querySelector('.progress-fill').style.width = `${percentage}%`;
                element.querySelector('.progress-text').textContent = `${current} / ${milestone.target} ${milestone.unit}`;
                
                if (percentage === 100 && !progress.achievements?.includes(milestone.id)) {
                    this.unlockAchievement(milestone);
                }
            });
        },

        unlockAchievement: function(milestone) {
            const notification = document.createElement('div');
            notification.className = 'achievement-notification';
            notification.innerHTML = `
                <div class="achievement-content">
                    <span class="achievement-icon">${milestone.icon}</span>
                    <div class="achievement-text">
                        <h3>Achievement Unlocked!</h3>
                        <p>${milestone.name}</p>
                        <p class="reward">Reward: ${milestone.reward}</p>
                    </div>
                </div>
            `;
            document.body.appendChild(notification);
            
            setTimeout(() => notification.remove(), 5000);
            
            const progress = JSON.parse(localStorage.getItem('datasense_onboarding_progress') || '{}');
            if (!progress.achievements) progress.achievements = [];
            progress.achievements.push(milestone.id);
            localStorage.setItem('datasense_onboarding_progress', JSON.stringify(progress));
            
            if (window.DataSenseTracking) {
                window.DataSenseTracking.trackEvent('achievement_unlocked', {
                    achievement: milestone.id,
                    name: milestone.name
                });
            }
        },

        updateHealthScore: function() {
            const progress = JSON.parse(localStorage.getItem('datasense_onboarding_progress') || '{}');
            const daysSinceStart = Math.floor((Date.now() - progress.startTime) / (1000 * 60 * 60 * 24));
            
            const healthFactors = {
                hasLoggedIn: daysSinceStart === 0 || progress.lastLogin > Date.now() - 86400000,
                hasConnectedData: (progress.connectionsCreated || 0) > 0,
                hasRunQueries: (progress.queriesRun || 0) > 4,
                hasInvitedTeam: (progress.teamInvites || 0) > 0,
                hasCreatedDashboard: (progress.dashboardsCreated || 0) > 0
            };
            
            const score = Object.values(healthFactors).filter(Boolean).length;
            
            if (score < 2 && daysSinceStart > 2) {
                this.triggerIntervention('low-engagement');
            } else if (score === 5) {
                this.triggerIntervention('high-achiever');
            }
            
            return {
                score: score,
                status: score < 2 ? 'at-risk' : score < 4 ? 'progressing' : 'thriving',
                factors: healthFactors
            };
        },

        triggerIntervention: function(type) {
            const interventions = {
                'low-engagement': {
                    title: 'Need Help Getting Started?',
                    message: 'We noticed you might be stuck. Let us help!',
                    actions: [
                        { label: 'Schedule 1-on-1 Call', action: 'scheduleCall' },
                        { label: 'Watch Quick Tutorial', action: 'watchTutorial' },
                        { label: 'Get Email Tips', action: 'emailTips' }
                    ]
                },
                'high-achiever': {
                    title: 'You\'re a DataSense Pro! 🌟',
                    message: 'You\'ve mastered the basics. Ready for advanced features?',
                    actions: [
                        { label: 'Unlock Advanced Features', action: 'unlockAdvanced' },
                        { label: 'Join Power Users Group', action: 'joinPowerUsers' },
                        { label: 'Become a Case Study', action: 'caseStudy' }
                    ]
                }
            };
            
            const intervention = interventions[type];
            if (!intervention) return;
            
            const modal = document.createElement('div');
            modal.className = 'intervention-modal';
            modal.innerHTML = `
                <div class="intervention-content">
                    <h3>${intervention.title}</h3>
                    <p>${intervention.message}</p>
                    <div class="intervention-actions">
                        ${intervention.actions.map(a => 
                            `<button onclick="DataSenseOnboardingPath.handleIntervention('${a.action}')">${a.label}</button>`
                        ).join('')}
                        <button class="dismiss" onclick="this.parentElement.parentElement.parentElement.remove()">Maybe Later</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        },

        handleIntervention: function(action) {
            const actions = {
                'scheduleCall': () => window.open('https://calendly.com/datasense/help', '_blank'),
                'watchTutorial': () => window.open('/tutorials/quickstart', '_blank'),
                'emailTips': () => this.subscribeToTips(),
                'unlockAdvanced': () => this.unlockAdvancedFeatures(),
                'joinPowerUsers': () => window.open('/community/power-users', '_blank'),
                'caseStudy': () => window.open('/case-study-form', '_blank')
            };
            
            if (actions[action]) {
                actions[action]();
            }
            
            document.querySelector('.intervention-modal')?.remove();
        },

        completeTask: function(taskId) {
            const progress = JSON.parse(localStorage.getItem('datasense_onboarding_progress') || '{}');
            if (!progress.completedTasks) progress.completedTasks = [];
            
            const checkbox = document.getElementById(taskId);
            if (checkbox.checked) {
                progress.completedTasks.push(taskId);
                this.celebrateCompletion(taskId);
            } else {
                const index = progress.completedTasks.indexOf(taskId);
                if (index > -1) progress.completedTasks.splice(index, 1);
            }
            
            localStorage.setItem('datasense_onboarding_progress', JSON.stringify(progress));
            this.checkMilestones();
        },

        celebrateCompletion: function(taskId) {
            const celebration = document.createElement('div');
            celebration.className = 'task-celebration';
            celebration.innerHTML = '✨ Nice work!';
            
            const task = document.getElementById(taskId).parentElement;
            task.appendChild(celebration);
            
            setTimeout(() => celebration.remove(), 2000);
        },

        runQuery: function(query) {
            console.log('Running query:', query);
            
            const progress = JSON.parse(localStorage.getItem('datasense_onboarding_progress') || '{}');
            progress.queriesRun = (progress.queriesRun || 0) + 1;
            progress.insightsViewed = (progress.insightsViewed || 0) + 1;
            localStorage.setItem('datasense_onboarding_progress', JSON.stringify(progress));
            
            this.checkMilestones();
            
            if (window.DataSenseTracking) {
                window.DataSenseTracking.trackEvent('query_run', {
                    query: query,
                    source: 'onboarding'
                });
            }
        },

        changeTrack: function() {
            const modal = document.createElement('div');
            modal.className = 'track-selector-modal';
            modal.innerHTML = `
                <div class="track-selector-content">
                    <h2>Choose Your Onboarding Style</h2>
                    <div class="tracks-grid">
                        ${Object.entries(this.tracks).map(([key, track]) => `
                            <div class="track-option" onclick="DataSenseOnboardingPath.selectTrack('${key}')">
                                <span class="track-icon">${track.icon}</span>
                                <h3>${track.name}</h3>
                                <p>${track.description}</p>
                                <ul class="track-features">
                                    ${track.features.slice(0, 3).map(f => `<li>${f}</li>`).join('')}
                                </ul>
                            </div>
                        `).join('')}
                    </div>
                    <button onclick="this.parentElement.parentElement.remove()">Cancel</button>
                </div>
            `;
            document.body.appendChild(modal);
        },

        selectTrack: function(trackId) {
            this.userProfile.recommendedTrack = trackId;
            this.generatePath(this.userProfile);
            document.querySelector('.track-selector-modal')?.remove();
            
            if (window.DataSenseTracking) {
                window.DataSenseTracking.trackEvent('track_changed', {
                    newTrack: trackId
                });
            }
        },

        startJourney: function() {
            const progress = JSON.parse(localStorage.getItem('datasense_onboarding_progress') || '{}');
            progress.journeyStarted = Date.now();
            localStorage.setItem('datasense_onboarding_progress', JSON.stringify(progress));
            
            window.location.href = '/app/onboarding';
        },

        savePath: function() {
            localStorage.setItem('datasense_saved_path', JSON.stringify(this.currentPath));
            alert('Your personalized path has been saved! We\'ll send you an email with next steps.');
        },

        startChat: function() {
            if (window.Intercom) {
                window.Intercom('show');
            } else {
                console.log('Opening chat...');
            }
        },

        viewResources: function() {
            window.open('/resources', '_blank');
        },

        scheduleCheckIn: function() {
            window.open('https://calendly.com/datasense/checkin', '_blank');
        },

        subscribeToTips: function() {
            console.log('Subscribing to email tips...');
        },

        unlockAdvancedFeatures: function() {
            console.log('Unlocking advanced features...');
        }
    };

})();