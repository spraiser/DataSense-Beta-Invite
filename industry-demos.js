// Industry-specific demo scenarios
(function() {
    'use strict';

    const industryDemos = {
        ecommerce: {
            name: 'E-commerce',
            icon: '🛍️',
            queries: [
                {
                    id: 'product-performance',
                    question: "Which product bundles drive the highest revenue?",
                    sql: `SELECT bundle_name, COUNT(*) as sales_count, 
       AVG(order_value) as avg_order_value,
       SUM(revenue) as total_revenue
FROM product_bundles pb
JOIN orders o ON pb.bundle_id = o.bundle_id
WHERE order_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY bundle_name
ORDER BY total_revenue DESC;`,
                    insights: [
                        'Bundle "Starter Kit" accounts for 34% of revenue',
                        'Customers who buy bundles have 2.3x higher LTV',
                        'Cross-sell opportunity: Add accessories to boost AOV by $45'
                    ]
                },
                {
                    id: 'customer-segments',
                    question: "What are my most valuable customer segments?",
                    sql: `SELECT segment_name, COUNT(DISTINCT customer_id) as customers,
       AVG(lifetime_value) as avg_ltv,
       AVG(purchase_frequency) as avg_purchases
FROM customer_segments
GROUP BY segment_name
ORDER BY avg_ltv DESC;`,
                    insights: [
                        'VIP customers (top 20%) generate 65% of revenue',
                        'New customers from Instagram convert 3x better',
                        'Weekend shoppers have 40% higher cart values'
                    ]
                }
            ]
        },
        saas: {
            name: 'SaaS',
            icon: '💻',
            queries: [
                {
                    id: 'mrr-analysis',
                    question: "How is my MRR trending and what's driving it?",
                    sql: `SELECT DATE_FORMAT(date, '%Y-%m') as month,
       SUM(new_mrr) as new_mrr,
       SUM(expansion_mrr) as expansion_mrr,
       SUM(churned_mrr) as churned_mrr,
       SUM(net_mrr) as net_mrr
FROM mrr_movements
WHERE date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
GROUP BY month;`,
                    insights: [
                        'MRR growing 18% MoM, driven by upsells',
                        'Expansion revenue now 35% of new MRR',
                        'Churn rate decreased to 2.8% (industry avg: 5%)'
                    ]
                },
                {
                    id: 'feature-adoption',
                    question: "Which features correlate with retention?",
                    sql: `SELECT feature_name,
       AVG(CASE WHEN retained THEN 1 ELSE 0 END) as retention_rate,
       COUNT(DISTINCT user_id) as users_count
FROM feature_usage fu
JOIN user_retention ur ON fu.user_id = ur.user_id
GROUP BY feature_name
ORDER BY retention_rate DESC;`,
                    insights: [
                        'Users of API integration retain 94% vs 67% average',
                        'Dashboard customization increases retention by 28%',
                        'Focus onboarding on top 3 sticky features'
                    ]
                }
            ]
        },
        services: {
            name: 'Professional Services',
            icon: '🏢',
            queries: [
                {
                    id: 'project-profitability',
                    question: "Which project types are most profitable?",
                    sql: `SELECT project_type,
       AVG(profit_margin) as avg_margin,
       SUM(revenue) as total_revenue,
       AVG(completion_days) as avg_duration
FROM projects
WHERE completion_date >= DATE_SUB(NOW(), INTERVAL 90 DAY)
GROUP BY project_type
ORDER BY avg_margin DESC;`,
                    insights: [
                        'Consulting projects: 68% margin vs 42% for implementation',
                        'Fixed-price projects 2x more profitable than hourly',
                        'Strategy engagements lead to 85% follow-on work'
                    ]
                },
                {
                    id: 'resource-optimization',
                    question: "How can I optimize team utilization?",
                    sql: `SELECT team_member,
       AVG(utilization_rate) as avg_utilization,
       SUM(billable_hours) as total_billable,
       AVG(hourly_rate * billable_hours) as revenue_generated
FROM resource_allocation
WHERE week >= DATE_SUB(NOW(), INTERVAL 4 WEEK)
GROUP BY team_member;`,
                    insights: [
                        'Senior consultants at 95% utilization (target: 80%)',
                        'Junior staff underutilized - opportunity for training',
                        'Shifting 10% work to juniors saves $18K/month'
                    ]
                }
            ]
        },
        restaurant: {
            name: 'Restaurant',
            icon: '🍔',
            queries: [
                {
                    id: 'menu-optimization',
                    question: "Which menu items should I promote or remove?",
                    sql: `SELECT item_name, category,
       SUM(quantity_sold) as units_sold,
       AVG(profit_margin) as margin,
       SUM(revenue) as total_revenue
FROM menu_sales
WHERE sale_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY item_name, category
ORDER BY margin * units_sold DESC;`,
                    insights: [
                        'Appetizers drive 45% of profit on 20% of sales',
                        'Tuesday special increases traffic by 35%',
                        'Removing 3 low performers saves $2K/month in waste'
                    ]
                },
                {
                    id: 'peak-analysis',
                    question: "When should I schedule more staff?",
                    sql: `SELECT DAYNAME(date) as day,
       HOUR(time) as hour,
       AVG(orders_count) as avg_orders,
       AVG(wait_time_minutes) as avg_wait
FROM restaurant_metrics
GROUP BY day, hour
HAVING avg_orders > 20;`,
                    insights: [
                        'Friday 6-8PM needs 2 more servers',
                        'Sunday brunch understaffed - losing $3K in walkouts',
                        'Optimal staff schedule saves 12% on labor costs'
                    ]
                }
            ]
        },
        healthcare: {
            name: 'Healthcare',
            icon: '🏥',
            queries: [
                {
                    id: 'appointment-optimization',
                    question: "How can I reduce no-shows and optimize scheduling?",
                    sql: `SELECT appointment_type,
       AVG(no_show_rate) as no_show_pct,
       AVG(CASE WHEN reminder_sent THEN no_show_rate ELSE NULL END) as with_reminder,
       COUNT(*) as total_appointments
FROM appointment_analytics
WHERE appointment_date >= DATE_SUB(NOW(), INTERVAL 60 DAY)
GROUP BY appointment_type;`,
                    insights: [
                        'SMS reminders reduce no-shows by 43%',
                        'Monday morning slots have 28% no-show rate',
                        'Overbooking algorithm could recover $12K/month'
                    ]
                },
                {
                    id: 'patient-satisfaction',
                    question: "What factors drive patient satisfaction?",
                    sql: `SELECT factor,
       AVG(satisfaction_score) as avg_score,
       CORR(factor_present, satisfaction_score) as correlation
FROM patient_feedback
GROUP BY factor
ORDER BY correlation DESC;`,
                    insights: [
                        'Wait time under 15min = 4.8/5 satisfaction',
                        'Online scheduling users 35% more likely to return',
                        'Evening hours would capture 200+ new patients'
                    ]
                }
            ]
        }
    };

    // Industry Demo Switcher Class
    class IndustryDemoSwitcher {
        constructor() {
            this.currentIndustry = 'ecommerce';
            this.init();
        }

        init() {
            this.createIndustrySwitcher();
            this.attachEventListeners();
        }

        createIndustrySwitcher() {
            // Find or create the demo section
            let demoSection = document.getElementById('industry-demo-section');
            if (!demoSection) {
                // Create new section after the main demo
                const mainDemo = document.querySelector('.demo-section');
                if (mainDemo) {
                    demoSection = document.createElement('section');
                    demoSection.id = 'industry-demo-section';
                    demoSection.className = 'industry-demo-section';
                    mainDemo.parentNode.insertBefore(demoSection, mainDemo.nextSibling);
                }
            }

            if (demoSection) {
                demoSection.innerHTML = `
                    <div class="container">
                        <div class="section-header">
                            <h2>See DataSense in action for your industry</h2>
                            <p>Explore real questions and insights tailored to your business</p>
                        </div>
                        
                        <div class="industry-switcher">
                            ${Object.entries(industryDemos).map(([key, industry]) => `
                                <button class="industry-btn ${key === this.currentIndustry ? 'active' : ''}" 
                                        data-industry="${key}">
                                    <span class="industry-icon">${industry.icon}</span>
                                    <span class="industry-name">${industry.name}</span>
                                </button>
                            `).join('')}
                        </div>
                        
                        <div class="industry-demo-content" id="industry-demo-content">
                            ${this.renderIndustryDemo(this.currentIndustry)}
                        </div>
                    </div>
                `;
            }
        }

        renderIndustryDemo(industryKey) {
            const industry = industryDemos[industryKey];
            if (!industry) return '';

            return `
                <div class="industry-queries">
                    ${industry.queries.map(query => `
                        <div class="industry-query-card">
                            <div class="query-question">
                                <span class="question-icon">💬</span>
                                <h3>${query.question}</h3>
                            </div>
                            
                            <div class="query-preview">
                                <div class="sql-preview">
                                    <span class="sql-label">AI-Generated Query</span>
                                    <pre><code>${this.formatSQL(query.sql)}</code></pre>
                                </div>
                                
                                <div class="insights-preview">
                                    <h4>Instant Insights</h4>
                                    <ul>
                                        ${query.insights.map(insight => `
                                            <li>
                                                <span class="insight-bullet">→</span>
                                                ${insight}
                                            </li>
                                        `).join('')}
                                    </ul>
                                </div>
                            </div>
                            
                            <button class="try-demo-btn" data-industry="${industryKey}" data-query="${query.id}">
                                Try This Query
                                <svg viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
                                </svg>
                            </button>
                        </div>
                    `).join('')}
                </div>
                
                <div class="industry-cta">
                    <div class="cta-content">
                        <h3>Ready to unlock insights in your ${industry.name.toLowerCase()} business?</h3>
                        <p>Join hundreds of ${industry.name.toLowerCase()} businesses already using DataSense</p>
                        <a href="#beta-signup" class="btn btn-primary btn-large">
                            Get Started Free
                            <svg viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
                            </svg>
                        </a>
                    </div>
                </div>
            `;
        }

        formatSQL(sql) {
            // Simple SQL formatting for display
            return sql
                .replace(/SELECT|FROM|WHERE|GROUP BY|ORDER BY|JOIN|ON|AND|OR/g, match => `<span class="sql-keyword">${match}</span>`)
                .replace(/AVG|SUM|COUNT|MAX|MIN|DATE_SUB|DATE_FORMAT|NOW|CASE|WHEN|THEN|ELSE|END/g, match => `<span class="sql-function">${match}</span>`)
                .replace(/\d+/g, match => `<span class="sql-number">${match}</span>`);
        }

        attachEventListeners() {
            // Industry switcher buttons
            document.addEventListener('click', (e) => {
                if (e.target.closest('.industry-btn')) {
                    const btn = e.target.closest('.industry-btn');
                    const industry = btn.dataset.industry;
                    this.switchIndustry(industry);
                }

                // Try demo buttons
                if (e.target.closest('.try-demo-btn')) {
                    const btn = e.target.closest('.try-demo-btn');
                    this.scrollToMainDemo();
                    
                    // Track interaction
                    if (window.DataSenseTracking) {
                        window.DataSenseTracking.trackEvent('industry_demo_click', {
                            industry: btn.dataset.industry,
                            query: btn.dataset.query
                        });
                    }
                }
            });
        }

        switchIndustry(industryKey) {
            this.currentIndustry = industryKey;
            
            // Reset exit intent for this new journey
            try {
                sessionStorage.removeItem('exitIntentShown');
                sessionStorage.setItem('currentIndustry', industryKey);
                sessionStorage.setItem('industryChangeCount', 
                    (parseInt(sessionStorage.getItem('industryChangeCount') || 0) + 1).toString()
                );
                
                // Reset the in-memory flag too
                if (window.__exitIntentShown) {
                    window.__exitIntentShown = false;
                }
                
                console.log('Exit intent reset for industry change:', industryKey);
            } catch(e) {
                console.warn('Could not reset exit intent:', e);
            }
            
            // Update active button
            document.querySelectorAll('.industry-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.industry === industryKey);
            });
            
            // Update content with animation
            const content = document.getElementById('industry-demo-content');
            if (content) {
                content.style.opacity = '0';
                setTimeout(() => {
                    content.innerHTML = this.renderIndustryDemo(industryKey);
                    content.style.opacity = '1';
                }, 300);
            }
            
            // Dispatch custom event to sync with interactive demo
            document.dispatchEvent(new CustomEvent('industry-switched', {
                detail: { industry: industryKey }
            }));

            // Track switch
            if (window.DataSenseTracking) {
                window.DataSenseTracking.trackEvent('industry_switch', {
                    industry: industryKey
                });
            }
            
            // Track with UserEngagement if available
            if (window.UserEngagement) {
                window.UserEngagement.trackSignal('industryChanges');
            }
        }

        scrollToMainDemo() {
            const heroSection = document.querySelector('.hero');
            if (heroSection) {
                heroSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new IndustryDemoSwitcher();
        });
    } else {
        new IndustryDemoSwitcher();
    }

    // Export for use in other modules
    window.IndustryDemoSwitcher = IndustryDemoSwitcher;
})();