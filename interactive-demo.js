// Interactive Demo Module for DataSense
(function() {
    'use strict';

    // Demo query data with thinking process
    const demoQueries = {
        revenue: {
            question: "What were my top revenue sources last month?",
            thinking: {
                steps: [
                    "Analyzing revenue data from last 30 days...",
                    "Grouping by revenue source categories...",
                    "Calculating percentage contributions..."
                ],
                sql: `SELECT source_name, 
       SUM(revenue) as total_revenue,
       ROUND(SUM(revenue) * 100.0 / 
             (SELECT SUM(revenue) FROM transactions 
              WHERE date >= DATE_SUB(NOW(), INTERVAL 30 DAY)), 2) 
             as percentage
FROM transactions t
JOIN revenue_sources rs ON t.source_id = rs.id
WHERE date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY source_name
ORDER BY total_revenue DESC
LIMIT 5;`
            },
            chartData: {
                labels: ['Direct Sales', 'Online Store', 'Partnerships', 'Subscriptions', 'Affiliates'],
                data: [45000, 38000, 22000, 18000, 12000],
                percentages: [33.3, 28.1, 16.3, 13.3, 8.9]
            },
            insights: [
                { icon: '📈', text: 'Direct sales up 23% from previous month' },
                { icon: '🎯', text: 'Online store conversion rate: 4.2% (industry avg: 2.8%)' },
                { icon: '💡', text: 'Partnership revenue showing consistent 15% MoM growth' }
            ]
        },
        churn: {
            question: "Which customers are at risk of churning?",
            thinking: {
                steps: [
                    "Analyzing customer engagement patterns...",
                    "Identifying usage decline indicators...",
                    "Calculating churn probability scores..."
                ],
                sql: `SELECT customer_name,
       last_activity_date,
       DATEDIFF(NOW(), last_activity_date) as days_inactive,
       monthly_revenue,
       CASE 
         WHEN churn_score > 0.7 THEN 'High Risk'
         WHEN churn_score > 0.4 THEN 'Medium Risk'
         ELSE 'Low Risk'
       END as risk_level
FROM customer_analytics
WHERE churn_score > 0.4
ORDER BY churn_score DESC
LIMIT 10;`
            },
            chartData: {
                labels: ['High Risk', 'Medium Risk', 'Low Risk', 'Active', 'Highly Engaged'],
                data: [12, 28, 45, 180, 235],
                colors: ['#ef4444', '#f59e0b', '#eab308', '#22c55e', '#10b981']
            },
            insights: [
                { icon: '⚠️', text: '12 customers showing high churn risk signals' },
                { icon: '💰', text: 'Potential monthly revenue at risk: $8,400' },
                { icon: '✅', text: 'Recommendation: Reach out to top 5 at-risk accounts today' }
            ]
        },
        profit: {
            question: "Which products have the highest profit margins?",
            thinking: {
                steps: [
                    "Calculating cost vs. revenue for each product...",
                    "Computing profit margins and volume metrics...",
                    "Identifying optimization opportunities..."
                ],
                sql: `SELECT product_name,
       revenue - cost as profit,
       ROUND((revenue - cost) * 100.0 / revenue, 2) as margin_percent,
       units_sold,
       revenue
FROM product_performance
WHERE date >= DATE_SUB(NOW(), INTERVAL 90 DAY)
GROUP BY product_id
ORDER BY margin_percent DESC
LIMIT 8;`
            },
            chartData: {
                labels: ['Premium Package', 'Pro Service', 'Consulting', 'Standard Plan', 'Basic Setup'],
                data: [72, 65, 58, 45, 38],
                volumes: [120, 340, 85, 890, 1200]
            },
            insights: [
                { icon: '🏆', text: 'Premium Package: 72% margin but low volume' },
                { icon: '📊', text: 'Pro Service: Best balance of margin (65%) and volume' },
                { icon: '🎯', text: 'Opportunity: Upsell 10% of Standard to Pro = +$42K/mo' }
            ]
        },
        timing: {
            question: "What day and time generates most sales?",
            thinking: {
                steps: [
                    "Analyzing transaction timestamps...",
                    "Aggregating by day of week and hour...",
                    "Identifying peak performance patterns..."
                ],
                sql: `SELECT DAYNAME(transaction_date) as day_of_week,
       HOUR(transaction_time) as hour_of_day,
       COUNT(*) as transaction_count,
       AVG(transaction_value) as avg_value
FROM sales_data
WHERE transaction_date >= DATE_SUB(NOW(), INTERVAL 60 DAY)
GROUP BY day_of_week, hour_of_day
ORDER BY transaction_count DESC;`
            },
            chartData: {
                heatmap: {
                    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    hours: ['9AM', '12PM', '3PM', '6PM', '9PM'],
                    data: [
                        [45, 78, 92, 85, 42],
                        [88, 125, 110, 95, 38],
                        [72, 95, 88, 78, 35],
                        [80, 112, 105, 88, 40],
                        [65, 85, 78, 72, 32],
                        [35, 42, 38, 48, 28],
                        [28, 32, 30, 35, 22]
                    ]
                }
            },
            insights: [
                { icon: '⏰', text: 'Peak sales: Tuesday 12-2PM (125 transactions/hour)' },
                { icon: '📅', text: 'Weekdays outperform weekends by 3.2x' },
                { icon: '💡', text: 'Schedule marketing campaigns for Tuesday mornings' }
            ]
        },
        marketing: {
            question: "Compare CAC across marketing channels",
            thinking: {
                steps: [
                    "Calculating acquisition costs per channel...",
                    "Measuring conversion rates and LTV...",
                    "Computing ROI for each channel..."
                ],
                sql: `SELECT channel_name,
       marketing_spend / new_customers as CAC,
       avg_customer_ltv,
       (avg_customer_ltv / (marketing_spend / new_customers)) as LTV_CAC_ratio,
       conversion_rate
FROM marketing_analytics
WHERE month = MONTH(CURRENT_DATE - INTERVAL 1 MONTH)
ORDER BY LTV_CAC_ratio DESC;`
            },
            chartData: {
                labels: ['Referrals', 'Content Marketing', 'Google Ads', 'Facebook Ads', 'LinkedIn'],
                cac: [45, 120, 185, 210, 340],
                ltv: [2800, 2200, 1850, 1600, 2400],
                ratio: [62.2, 18.3, 10.0, 7.6, 7.1]
            },
            insights: [
                { icon: '🌟', text: 'Referrals: Lowest CAC ($45) with highest LTV ($2,800)' },
                { icon: '📈', text: 'Content marketing ROI: 18.3x (investing more could scale growth)' },
                { icon: '⚡', text: 'Quick win: Reduce LinkedIn spend by 50%, focus on referrals' }
            ]
        }
    };

    // Interactive Demo Class
    class InteractiveDemo {
        constructor(container) {
            this.container = container;
            this.currentQuery = null;
            this.chart = null;
            this.init();
        }

        init() {
            this.renderDemoInterface();
            this.attachEventListeners();
            this.runQuery('revenue'); // Start with revenue query
        }

        renderDemoInterface() {
            this.container.innerHTML = `
                <div class="demo-container">
                    <div class="demo-header">
                        <h3>Try DataSense Live</h3>
                        <p>Click any question below or select your industry for tailored examples</p>
                    </div>
                    
                    <div class="industry-selector">
                        <label class="industry-label">Select Your Industry:</label>
                        <select class="industry-dropdown" id="industry-select">
                            <option value="general">General Business</option>
                            <option value="ecommerce">E-commerce</option>
                            <option value="saas">SaaS / Software</option>
                            <option value="services">Professional Services</option>
                            <option value="restaurant">Restaurant / Food</option>
                            <option value="healthcare">Healthcare</option>
                        </select>
                    </div>
                    
                    <div class="query-selector">
                        <button class="query-btn active" data-query="revenue">
                            <span class="query-btn-icon">💰</span>
                            <span>Revenue Analysis</span>
                        </button>
                        <button class="query-btn" data-query="churn">
                            <span class="query-btn-icon">📉</span>
                            <span>Churn Insights</span>
                        </button>
                        <button class="query-btn" data-query="profit">
                            <span class="query-btn-icon">📊</span>
                            <span>Profit Margins</span>
                        </button>
                        <button class="query-btn" data-query="timing">
                            <span class="query-btn-icon">⏰</span>
                            <span>Best Sales Times</span>
                        </button>
                        <button class="query-btn" data-query="marketing">
                            <span class="query-btn-icon">🎯</span>
                            <span>Marketing ROI</span>
                        </button>
                    </div>
                    
                    <div class="query-input-container">
                        <div class="query-input">
                            <span class="query-icon">💬</span>
                            <span class="query-text typing-animation"></span>
                            <span class="query-cursor">|</span>
                        </div>
                    </div>
                    
                    <div class="thinking-process" style="display: none;">
                        <div class="thinking-header">
                            <div class="thinking-icon">
                                <div class="thinking-spinner"></div>
                            </div>
                            <h4>How DataSense thinks:</h4>
                        </div>
                        <div class="thinking-steps"></div>
                        <div class="sql-container">
                            <div class="sql-header">
                                <span class="sql-label">Generated SQL Query</span>
                                <button class="sql-toggle">Show Details</button>
                            </div>
                            <pre class="sql-display"><code></code></pre>
                        </div>
                    </div>
                    
                    <div class="results-display" style="display: none;">
                        <div class="results-header">
                            <h4>Analysis Results</h4>
                            <span class="results-time">Completed in 0.3s</span>
                        </div>
                        <div class="chart-container">
                            <canvas id="demo-chart"></canvas>
                        </div>
                        <div class="insights-container">
                            <h4>Key Insights</h4>
                            <div class="insights-list"></div>
                        </div>
                        <div class="action-prompt">
                            <p>Ready to see this with your own data?</p>
                            <a href="#beta-signup" class="btn btn-primary">
                                Start Free Analysis
                                <svg class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            `;
        }

        attachEventListeners() {
            // Query button clicks
            this.container.querySelectorAll('.query-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const query = btn.dataset.query;
                    this.runQuery(query);
                    
                    // Update active state
                    this.container.querySelectorAll('.query-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                });
            });

            // SQL toggle
            const sqlToggle = this.container.querySelector('.sql-toggle');
            if (sqlToggle) {
                sqlToggle.addEventListener('click', () => {
                    const sqlDisplay = this.container.querySelector('.sql-display');
                    sqlDisplay.classList.toggle('expanded');
                    sqlToggle.textContent = sqlDisplay.classList.contains('expanded') ? 'Hide Details' : 'Show Details';
                });
            }
        }

        async runQuery(queryType) {
            const queryData = demoQueries[queryType];
            if (!queryData) return;

            this.currentQuery = queryType;

            // Reset display
            this.hideResults();
            
            // Type the question
            await this.typeQuestion(queryData.question);
            
            // Show thinking process
            await this.showThinkingProcess(queryData.thinking);
            
            // Show results
            await this.showResults(queryData);
        }

        async typeQuestion(question) {
            const textElement = this.container.querySelector('.query-text');
            textElement.textContent = '';
            
            for (let i = 0; i < question.length; i++) {
                textElement.textContent += question[i];
                await this.delay(30);
            }
            
            await this.delay(300);
        }

        async showThinkingProcess(thinking) {
            const thinkingElement = this.container.querySelector('.thinking-process');
            const stepsContainer = this.container.querySelector('.thinking-steps');
            const sqlCode = this.container.querySelector('.sql-display code');
            const sqlDisplay = this.container.querySelector('.sql-display');
            const sqlToggle = this.container.querySelector('.sql-toggle');
            
            thinkingElement.style.display = 'block';
            stepsContainer.innerHTML = '';
            
            // Animate thinking steps
            for (const step of thinking.steps) {
                const stepElement = document.createElement('div');
                stepElement.className = 'thinking-step';
                stepElement.innerHTML = `
                    <svg class="step-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                    <span>${step}</span>
                `;
                stepsContainer.appendChild(stepElement);
                stepElement.style.opacity = '0';
                stepElement.style.transform = 'translateX(-20px)';
                
                await this.delay(100);
                stepElement.style.opacity = '1';
                stepElement.style.transform = 'translateX(0)';
                await this.delay(300);
            }
            
            // Automatically expand SQL display to show transparency
            sqlCode.textContent = thinking.sql;
            this.highlightSQL(sqlCode);
            
            // Auto-expand SQL after steps complete
            await this.delay(200);
            sqlDisplay.classList.add('expanded');
            sqlToggle.textContent = 'Hide Details';
            
            await this.delay(800);
        }

        async showResults(queryData) {
            const resultsElement = this.container.querySelector('.results-display');
            const insightsContainer = this.container.querySelector('.insights-list');
            
            resultsElement.style.display = 'block';
            resultsElement.style.opacity = '0';
            
            // Create chart
            this.createChart(queryData);
            
            // Add insights
            insightsContainer.innerHTML = '';
            for (const insight of queryData.insights) {
                const insightElement = document.createElement('div');
                insightElement.className = 'insight-item';
                insightElement.innerHTML = `
                    <span class="insight-icon">${insight.icon}</span>
                    <span class="insight-text">${insight.text}</span>
                `;
                insightsContainer.appendChild(insightElement);
            }
            
            // Fade in results
            await this.delay(100);
            resultsElement.style.opacity = '1';
            
            // Track interaction
            if (window.DataSenseTracking) {
                window.DataSenseTracking.trackEvent('demo_query_completed', {
                    query_type: this.currentQuery
                });
            }
        }

        createChart(queryData) {
            const canvas = document.getElementById('demo-chart');
            const ctx = canvas.getContext('2d');
            
            // Destroy existing chart
            if (this.chart) {
                this.chart.destroy();
            }
            
            // Create appropriate chart based on query type
            const chartConfig = this.getChartConfig(queryData);
            
            // Use Chart.js if available, otherwise create custom visualization
            if (typeof Chart !== 'undefined') {
                this.chart = new Chart(ctx, chartConfig);
            } else {
                this.createCustomChart(ctx, queryData);
            }
        }

        getChartConfig(queryData) {
            const chartData = queryData.chartData;
            
            switch (this.currentQuery) {
                case 'revenue':
                case 'profit':
                    return {
                        type: 'bar',
                        data: {
                            labels: chartData.labels,
                            datasets: [{
                                label: this.currentQuery === 'revenue' ? 'Revenue ($)' : 'Profit Margin (%)',
                                data: chartData.data,
                                backgroundColor: 'rgba(99, 102, 241, 0.8)',
                                borderColor: 'rgb(99, 102, 241)',
                                borderWidth: 1
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: false
                                }
                            },
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    };
                
                case 'churn':
                    return {
                        type: 'doughnut',
                        data: {
                            labels: chartData.labels,
                            datasets: [{
                                data: chartData.data,
                                backgroundColor: chartData.colors || [
                                    '#ef4444', '#f59e0b', '#eab308', '#22c55e', '#10b981'
                                ]
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'bottom'
                                }
                            }
                        }
                    };
                
                case 'marketing':
                    return {
                        type: 'bar',
                        data: {
                            labels: chartData.labels,
                            datasets: [
                                {
                                    label: 'CAC ($)',
                                    data: chartData.cac,
                                    backgroundColor: 'rgba(239, 68, 68, 0.8)',
                                    borderColor: 'rgb(239, 68, 68)',
                                    borderWidth: 1,
                                    yAxisID: 'y'
                                },
                                {
                                    label: 'LTV/CAC Ratio',
                                    data: chartData.ratio,
                                    type: 'line',
                                    borderColor: 'rgb(34, 197, 94)',
                                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                                    yAxisID: 'y1'
                                }
                            ]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    type: 'linear',
                                    display: true,
                                    position: 'left',
                                },
                                y1: {
                                    type: 'linear',
                                    display: true,
                                    position: 'right',
                                    grid: {
                                        drawOnChartArea: false,
                                    },
                                }
                            }
                        }
                    };
                
                default:
                    return this.getDefaultChartConfig(chartData);
            }
        }

        createCustomChart(ctx, queryData) {
            // Fallback visualization without Chart.js
            const canvas = ctx.canvas;
            const width = canvas.width;
            const height = canvas.height;
            
            // Clear canvas
            ctx.clearRect(0, 0, width, height);
            
            // Simple bar chart implementation
            const chartData = queryData.chartData;
            const barWidth = width / (chartData.labels.length * 1.5);
            const maxValue = Math.max(...chartData.data);
            const scale = (height - 40) / maxValue;
            
            chartData.labels.forEach((label, index) => {
                const value = chartData.data[index];
                const barHeight = value * scale;
                const x = (index * barWidth * 1.5) + barWidth / 2;
                const y = height - barHeight - 20;
                
                // Draw bar
                ctx.fillStyle = 'rgba(99, 102, 241, 0.8)';
                ctx.fillRect(x, y, barWidth, barHeight);
                
                // Draw label
                ctx.fillStyle = '#64748b';
                ctx.font = '12px Inter';
                ctx.textAlign = 'center';
                ctx.fillText(label, x + barWidth / 2, height - 5);
                
                // Draw value
                ctx.fillStyle = '#334155';
                ctx.font = '14px Inter';
                ctx.fillText(value.toLocaleString(), x + barWidth / 2, y - 5);
            });
        }

        highlightSQL(element) {
            // Simple SQL syntax highlighting
            let sql = element.textContent;
            
            // Keywords
            const keywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'ON', 'GROUP BY', 'ORDER BY', 'LIMIT', 'SUM', 'COUNT', 'AVG', 'ROUND', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'AS', 'AND', 'OR', 'DESC', 'ASC', 'INTERVAL', 'DAY', 'MONTH', 'NOW', 'DATE_SUB', 'DATEDIFF'];
            
            keywords.forEach(keyword => {
                const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
                sql = sql.replace(regex, `<span class="sql-keyword">${keyword}</span>`);
            });
            
            // Strings
            sql = sql.replace(/'([^']*)'/g, '<span class="sql-string">\'$1\'</span>');
            
            // Numbers
            sql = sql.replace(/\b(\d+)\b/g, '<span class="sql-number">$1</span>');
            
            element.innerHTML = sql;
        }

        hideResults() {
            const thinkingElement = this.container.querySelector('.thinking-process');
            const resultsElement = this.container.querySelector('.results-display');
            
            if (thinkingElement) thinkingElement.style.display = 'none';
            if (resultsElement) resultsElement.style.display = 'none';
        }

        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        getDefaultChartConfig(chartData) {
            return {
                type: 'bar',
                data: {
                    labels: chartData.labels,
                    datasets: [{
                        label: 'Value',
                        data: chartData.data,
                        backgroundColor: 'rgba(99, 102, 241, 0.8)',
                        borderColor: 'rgb(99, 102, 241)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            };
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeDemo);
    } else {
        initializeDemo();
    }

    function initializeDemo() {
        // Replace static mockup with interactive demo in hero
        const heroVisual = document.querySelector('.hero-visual');
        if (heroVisual) {
            const demoContainer = document.createElement('div');
            demoContainer.className = 'interactive-demo-wrapper';
            heroVisual.innerHTML = '';
            heroVisual.appendChild(demoContainer);
            
            // Initialize the interactive demo
            new InteractiveDemo(demoContainer);
        }
        
        // Also initialize demo in dedicated section if exists
        const mainDemoContainer = document.getElementById('main-interactive-demo');
        if (mainDemoContainer) {
            const demoWrapper = document.createElement('div');
            demoWrapper.className = 'interactive-demo-wrapper full-width';
            mainDemoContainer.appendChild(demoWrapper);
            
            // Initialize another instance for the dedicated section
            new InteractiveDemo(demoWrapper);
        }
    }

    // Export for use in other modules
    window.DataSenseDemo = InteractiveDemo;
})();