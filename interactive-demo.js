// Interactive Demo Module for DataSense
(function() {
    'use strict';

    // Industry-specific demo queries
    const industryDemoQueries = {
        ecommerce: {
            revenue: {
                question: "Which product bundles drive the highest revenue?",
                thinking: {
                    steps: [
                        "Analyzing product bundle performance...",
                        "Calculating cross-sell effectiveness...",
                        "Identifying top revenue drivers..."
                    ],
                    sql: `SELECT bundle_name, COUNT(*) as sales, 
                          AVG(order_value) as avg_value,
                          SUM(revenue) as total_revenue
                          FROM bundles WHERE date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                          GROUP BY bundle_name ORDER BY total_revenue DESC;`
                },
                chartData: {
                    labels: ['Starter Kit', 'Premium Bundle', 'Essentials', 'Pro Package'],
                    data: [45000, 38000, 22000, 18000],
                    percentages: [36.6, 30.9, 17.9, 14.6]
                },
                insights: [
                    { icon: '📦', text: 'Bundle "Starter Kit" accounts for 34% of revenue' },
                    { icon: '💰', text: 'Customers who buy bundles have 2.3x higher LTV' },
                    { icon: '🎯', text: 'Cross-sell opportunity: Add accessories for +$45 AOV' }
                ]
            },
            churn: {
                question: "Which customers haven't purchased in 60+ days?",
                thinking: {
                    steps: [
                        "Analyzing purchase patterns...",
                        "Identifying dormant customers...",
                        "Calculating reactivation potential..."
                    ],
                    sql: `SELECT customer_email, last_purchase_date,
                          DATEDIFF(NOW(), last_purchase_date) as days_since,
                          total_lifetime_value, purchase_count
                          FROM customers WHERE last_purchase_date < DATE_SUB(NOW(), INTERVAL 60 DAY)
                          ORDER BY total_lifetime_value DESC LIMIT 20;`
                },
                chartData: {
                    labels: ['30-60 days', '60-90 days', '90-120 days', '120+ days'],
                    data: [234, 189, 156, 423],
                    colors: ['#eab308', '#f59e0b', '#ef4444', '#991b1b']
                },
                insights: [
                    { icon: '⚠️', text: '423 high-value customers dormant 120+ days' },
                    { icon: '💸', text: 'Potential revenue recovery: $127K' },
                    { icon: '✅', text: 'Win-back campaign typically recovers 18-22%' }
                ]
            },
            profit: {
                question: "What's my profit margin by product category?",
                thinking: {
                    steps: [
                        "Calculating category margins...",
                        "Analyzing volume vs profitability...",
                        "Finding optimization opportunities..."
                    ],
                    sql: `SELECT category, SUM(revenue - cost) as profit,
                          AVG((revenue - cost) / revenue * 100) as margin_pct,
                          COUNT(*) as items_sold
                          FROM product_sales WHERE date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                          GROUP BY category ORDER BY margin_pct DESC;`
                },
                chartData: {
                    labels: ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books'],
                    data: [42, 65, 38, 51, 72],
                    volumes: [1250, 3400, 890, 567, 234]
                },
                insights: [
                    { icon: '🏆', text: 'Books: Highest margin (72%) but lowest volume' },
                    { icon: '📊', text: 'Clothing: Best revenue driver with solid 65% margin' },
                    { icon: '💡', text: 'Focus: Increase Electronics margin by 5% = +$23K/mo' }
                ]
            },
            timing: {
                question: "When do customers buy the most?",
                thinking: {
                    steps: [
                        "Analyzing purchase timestamps...",
                        "Identifying peak shopping hours...",
                        "Calculating conversion by time..."
                    ],
                    sql: `SELECT DAYNAME(order_date) as day, HOUR(order_time) as hour,
                          COUNT(*) as orders, AVG(order_value) as avg_value
                          FROM orders WHERE order_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                          GROUP BY day, hour ORDER BY orders DESC;`
                },
                chartData: {
                    heatmap: {
                        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        hours: ['9AM', '12PM', '3PM', '6PM', '9PM'],
                        data: [
                            [65, 88, 72, 95, 82],
                            [78, 95, 85, 108, 92],
                            [70, 82, 78, 88, 75],
                            [82, 102, 95, 115, 98],
                            [88, 125, 110, 132, 105],
                            [95, 118, 102, 125, 88],
                            [102, 135, 118, 142, 95]
                        ]
                    }
                },
                insights: [
                    { icon: '⏰', text: 'Peak sales: Sunday 6PM (142 orders/hour)' },
                    { icon: '📅', text: 'Weekend sales 35% higher than weekdays' },
                    { icon: '🎯', text: 'Schedule flash sales for Sunday afternoon' }
                ]
            },
            marketing: {
                question: "Which marketing channels drive most revenue?",
                thinking: {
                    steps: [
                        "Analyzing channel attribution...",
                        "Calculating ROI by channel...",
                        "Identifying scaling opportunities..."
                    ],
                    sql: `SELECT channel, COUNT(DISTINCT customer_id) as customers,
                          SUM(revenue) as total_revenue, AVG(order_value) as avg_order,
                          SUM(revenue) / SUM(marketing_spend) as roi
                          FROM channel_attribution WHERE date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                          GROUP BY channel ORDER BY roi DESC;`
                },
                chartData: {
                    labels: ['Email', 'Instagram', 'Google Ads', 'Facebook', 'TikTok'],
                    cac: [12, 35, 58, 62, 28],
                    ltv: [185, 220, 195, 175, 165],
                    ratio: [15.4, 6.3, 3.4, 2.8, 5.9]
                },
                insights: [
                    { icon: '📧', text: 'Email: 15.4x ROI with lowest CAC ($12)' },
                    { icon: '📱', text: 'Instagram customers have highest LTV ($220)' },
                    { icon: '⚡', text: 'TikTok: Emerging channel with 5.9x ROI potential' }
                ]
            }
        },
        saas: {
            revenue: {
                question: "How is my MRR trending and what's driving growth?",
                thinking: {
                    steps: [
                        "Analyzing MRR components...",
                        "Breaking down new vs expansion revenue...",
                        "Calculating growth drivers..."
                    ],
                    sql: `SELECT month, new_mrr, expansion_mrr, churned_mrr, net_mrr
                          FROM mrr_movements WHERE date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
                          GROUP BY month ORDER BY month DESC;`
                },
                chartData: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    data: [125000, 142000, 168000, 195000, 228000, 267000],
                    percentages: [8, 12, 18, 16, 17, 17]
                },
                insights: [
                    { icon: '📈', text: 'MRR growing 18% MoM, driven by upsells' },
                    { icon: '🚀', text: 'Expansion revenue now 35% of new MRR' },
                    { icon: '✅', text: 'Churn decreased to 2.8% (industry avg: 5%)' }
                ]
            },
            churn: {
                question: "Which accounts are at risk of churning?",
                thinking: {
                    steps: [
                        "Analyzing usage patterns...",
                        "Identifying engagement decline...",
                        "Calculating churn probability scores..."
                    ],
                    sql: `SELECT company_name, last_login, monthly_value,
                          usage_trend, health_score
                          FROM account_health WHERE health_score < 60
                          ORDER BY monthly_value DESC LIMIT 10;`
                },
                chartData: {
                    labels: ['Critical', 'High Risk', 'Medium Risk', 'Healthy', 'Champions'],
                    data: [8, 15, 32, 145, 89],
                    colors: ['#991b1b', '#ef4444', '#f59e0b', '#22c55e', '#10b981']
                },
                insights: [
                    { icon: '🚨', text: '8 accounts critical - $42K MRR at risk' },
                    { icon: '📉', text: 'Usage declined 40% for high-risk accounts' },
                    { icon: '💡', text: 'Proactive outreach saves 65% of at-risk accounts' }
                ]
            },
            profit: {
                question: "Which pricing tiers are most profitable?",
                thinking: {
                    steps: [
                        "Analyzing tier distribution...",
                        "Calculating support costs per tier...",
                        "Finding upsell opportunities..."
                    ],
                    sql: `SELECT pricing_tier, COUNT(*) as customers,
                          AVG(mrr) as avg_mrr, AVG(support_cost) as avg_cost,
                          AVG(mrr - support_cost) as profit_per_customer
                          FROM customer_tiers GROUP BY pricing_tier
                          ORDER BY profit_per_customer DESC;`
                },
                chartData: {
                    labels: ['Enterprise', 'Business', 'Professional', 'Startup', 'Free'],
                    data: [8500, 2200, 450, 120, -15],
                    volumes: [45, 230, 890, 2100, 5600]
                },
                insights: [
                    { icon: '💎', text: 'Enterprise: $8.5K profit per customer' },
                    { icon: '📊', text: 'Business tier: Sweet spot for volume & profit' },
                    { icon: '🎯', text: 'Convert 5% of Pro to Business = +$183K ARR' }
                ]
            },
            timing: {
                question: "When do users engage most with the product?",
                thinking: {
                    steps: [
                        "Analyzing usage patterns...",
                        "Identifying peak activity times...",
                        "Correlating with feature adoption..."
                    ],
                    sql: `SELECT DAYNAME(activity_date) as day, HOUR(activity_time) as hour,
                          COUNT(DISTINCT user_id) as active_users,
                          AVG(session_duration_minutes) as avg_duration
                          FROM user_activity WHERE activity_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
                          GROUP BY day, hour ORDER BY active_users DESC;`
                },
                chartData: {
                    heatmap: {
                        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        hours: ['9AM', '12PM', '3PM', '6PM', '9PM'],
                        data: [
                            [850, 920, 780, 450, 120],
                            [980, 1050, 890, 520, 180],
                            [920, 980, 850, 480, 150],
                            [950, 1020, 880, 510, 170],
                            [780, 850, 720, 380, 100],
                            [220, 280, 250, 180, 80],
                            [180, 210, 190, 150, 60]
                        ]
                    }
                },
                insights: [
                    { icon: '⏰', text: 'Peak usage: Tuesday 12PM (1,050 active users)' },
                    { icon: '📅', text: 'Weekday usage 4.5x higher than weekends' },
                    { icon: '🔧', text: 'Schedule maintenance for Sunday morning' }
                ]
            },
            marketing: {
                question: "Which features drive the most upgrades?",
                thinking: {
                    steps: [
                        "Analyzing feature usage before upgrades...",
                        "Identifying conversion triggers...",
                        "Calculating feature ROI..."
                    ],
                    sql: `SELECT feature_name, COUNT(DISTINCT user_id) as users_before_upgrade,
                          AVG(days_to_upgrade) as avg_days, conversion_rate
                          FROM feature_upgrade_correlation WHERE upgraded = true
                          GROUP BY feature_name ORDER BY conversion_rate DESC;`
                },
                chartData: {
                    labels: ['API Access', 'Team Collab', 'Advanced Analytics', 'Integrations', 'Custom Reports'],
                    data: [42, 38, 31, 28, 22],
                    days: [8, 12, 15, 18, 24]
                },
                insights: [
                    { icon: '🔑', text: 'API Access: 42% upgrade rate in 8 days' },
                    { icon: '👥', text: 'Team features trigger fastest conversions' },
                    { icon: '💡', text: 'Focus onboarding on top 3 conversion features' }
                ]
            }
        },
        restaurant: {
            revenue: {
                question: "Which menu items have the highest profit margins?",
                thinking: {
                    steps: [
                        "Calculating item-level profitability...",
                        "Analyzing sales volume vs margin...",
                        "Identifying menu optimization opportunities..."
                    ],
                    sql: `SELECT item_name, category, units_sold,
                          (price - cost) as profit_per_item,
                          ((price - cost) / price * 100) as margin_pct
                          FROM menu_performance WHERE date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                          GROUP BY item_name ORDER BY margin_pct DESC;`
                },
                chartData: {
                    labels: ['Appetizers', 'Mains', 'Desserts', 'Beverages', 'Specials'],
                    data: [68, 42, 75, 85, 48],
                    volumes: [450, 890, 320, 1200, 180]
                },
                insights: [
                    { icon: '🍹', text: 'Beverages: 85% margin on highest volume' },
                    { icon: '🍰', text: 'Desserts: 75% margin, underordered' },
                    { icon: '💡', text: 'Server upselling desserts could add $8K/month' }
                ]
            },
            churn: {
                question: "Which regular customers haven't visited recently?",
                thinking: {
                    steps: [
                        "Identifying regular customer patterns...",
                        "Detecting visit frequency changes...",
                        "Calculating customer lifetime value at risk..."
                    ],
                    sql: `SELECT customer_name, last_visit, avg_spend,
                          visit_frequency, total_lifetime_spend
                          FROM regular_customers WHERE last_visit < DATE_SUB(NOW(), INTERVAL 30 DAY)
                          ORDER BY total_lifetime_spend DESC LIMIT 20;`
                },
                chartData: {
                    labels: ['Daily Regulars', 'Weekly', 'Bi-weekly', 'Monthly', 'Occasional'],
                    data: [12, 45, 78, 125, 234],
                    colors: ['#991b1b', '#ef4444', '#f59e0b', '#22c55e', '#10b981']
                },
                insights: [
                    { icon: '⚠️', text: '12 daily regulars missing 30+ days' },
                    { icon: '💰', text: 'Potential monthly revenue loss: $4,800' },
                    { icon: '📱', text: 'Personalized offers bring back 40% of lapsed' }
                ]
            },
            profit: {
                question: "What's my food cost percentage by category?",
                thinking: {
                    steps: [
                        "Calculating food costs by category...",
                        "Comparing to industry benchmarks...",
                        "Finding cost reduction opportunities..."
                    ],
                    sql: `SELECT category, SUM(food_cost) as total_cost,
                          SUM(revenue) as total_revenue,
                          (SUM(food_cost) / SUM(revenue) * 100) as food_cost_pct
                          FROM category_performance WHERE date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                          GROUP BY category ORDER BY food_cost_pct ASC;`
                },
                chartData: {
                    labels: ['Beverages', 'Appetizers', 'Desserts', 'Mains', 'Sides'],
                    data: [15, 28, 32, 38, 35],
                    benchmark: [20, 30, 35, 35, 30]
                },
                insights: [
                    { icon: '✅', text: 'Beverages: 15% cost (industry: 20%)' },
                    { icon: '⚠️', text: 'Mains: 38% cost exceeds 35% target' },
                    { icon: '💡', text: 'Reducing main costs by 3% saves $6K/month' }
                ]
            },
            timing: {
                question: "When should I schedule more staff?",
                thinking: {
                    steps: [
                        "Analyzing hourly order patterns...",
                        "Calculating staff-to-customer ratios...",
                        "Identifying understaffed periods..."
                    ],
                    sql: `SELECT DAYNAME(date) as day, HOUR(time) as hour,
                          AVG(orders_count) as avg_orders, AVG(wait_time) as avg_wait,
                          AVG(staff_count) as avg_staff
                          FROM restaurant_metrics GROUP BY day, hour
                          HAVING avg_wait > 15 ORDER BY avg_orders DESC;`
                },
                chartData: {
                    heatmap: {
                        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        hours: ['11AM', '12PM', '5PM', '6PM', '7PM'],
                        data: [
                            [25, 45, 38, 52, 48],
                            [28, 48, 42, 58, 55],
                            [30, 52, 45, 62, 58],
                            [32, 55, 48, 68, 65],
                            [45, 78, 72, 95, 88],
                            [52, 92, 85, 108, 98],
                            [48, 88, 78, 98, 85]
                        ]
                    }
                },
                insights: [
                    { icon: '🚨', text: 'Saturday 6-8PM needs 2 more servers' },
                    { icon: '⏰', text: 'Friday dinner understaffed - 25min wait times' },
                    { icon: '💰', text: 'Better staffing could capture $12K in walk-ins' }
                ]
            },
            marketing: {
                question: "Which promotions drive the most revenue?",
                thinking: {
                    steps: [
                        "Analyzing promotion performance...",
                        "Calculating incremental revenue...",
                        "Measuring customer acquisition impact..."
                    ],
                    sql: `SELECT promotion_name, type, participants,
                          incremental_revenue, new_customers_acquired,
                          roi FROM promotion_analysis WHERE date >= DATE_SUB(NOW(), INTERVAL 90 DAY)
                          ORDER BY roi DESC;`
                },
                chartData: {
                    labels: ['Happy Hour', 'Tuesday Special', 'Weekend Brunch', 'Date Night', 'Loyalty Program'],
                    revenue: [28000, 18000, 32000, 22000, 45000],
                    roi: [4.2, 3.1, 3.8, 2.9, 6.5]
                },
                insights: [
                    { icon: '🏆', text: 'Loyalty program: 6.5x ROI, highest retention' },
                    { icon: '🍻', text: 'Happy Hour drives 28% of weekly revenue' },
                    { icon: '💡', text: 'Expanding brunch hours could add $8K/month' }
                ]
            }
        },
        healthcare: {
            revenue: {
                question: "What's my revenue per patient by service type?",
                thinking: {
                    steps: [
                        "Analyzing service utilization...",
                        "Calculating revenue by service line...",
                        "Identifying growth opportunities..."
                    ],
                    sql: `SELECT service_type, COUNT(DISTINCT patient_id) as patients,
                          AVG(revenue_per_patient) as avg_revenue,
                          SUM(total_revenue) as total_revenue
                          FROM service_revenue WHERE date >= DATE_SUB(NOW(), INTERVAL 90 DAY)
                          GROUP BY service_type ORDER BY total_revenue DESC;`
                },
                chartData: {
                    labels: ['Primary Care', 'Specialist', 'Lab Services', 'Imaging', 'Procedures'],
                    data: [285, 450, 125, 380, 620],
                    volumes: [3200, 890, 2100, 450, 320]
                },
                insights: [
                    { icon: '💰', text: 'Procedures: Highest revenue per patient ($620)' },
                    { icon: '📊', text: 'Primary care drives 45% of downstream revenue' },
                    { icon: '🎯', text: 'Expanding lab services could add $125K/quarter' }
                ]
            },
            churn: {
                question: "Which patients haven't scheduled follow-ups?",
                thinking: {
                    steps: [
                        "Identifying patients needing follow-ups...",
                        "Analyzing appointment compliance...",
                        "Calculating health outcome risks..."
                    ],
                    sql: `SELECT patient_name, last_visit, condition,
                          recommended_followup, days_overdue
                          FROM patient_followups WHERE days_overdue > 0
                          ORDER BY risk_score DESC LIMIT 25;`
                },
                chartData: {
                    labels: ['0-30 days', '31-60 days', '61-90 days', '90+ days'],
                    data: [145, 89, 56, 34],
                    colors: ['#22c55e', '#f59e0b', '#ef4444', '#991b1b']
                },
                insights: [
                    { icon: '⚠️', text: '34 high-risk patients 90+ days overdue' },
                    { icon: '📞', text: 'Outreach recovers 68% of missed follow-ups' },
                    { icon: '💉', text: 'Automated reminders reduce no-shows by 43%' }
                ]
            },
            profit: {
                question: "Which insurance payers are most profitable?",
                thinking: {
                    steps: [
                        "Analyzing payer mix...",
                        "Calculating collection rates...",
                        "Identifying contract optimization opportunities..."
                    ],
                    sql: `SELECT payer_name, patient_count, avg_reimbursement,
                          collection_rate, days_to_payment,
                          (avg_reimbursement * collection_rate) as net_revenue
                          FROM payer_analysis GROUP BY payer_name
                          ORDER BY net_revenue DESC;`
                },
                chartData: {
                    labels: ['Medicare', 'Private Ins A', 'Private Ins B', 'Medicaid', 'Self-Pay'],
                    data: [92, 118, 105, 78, 45],
                    days: [45, 28, 32, 62, 90]
                },
                insights: [
                    { icon: '💎', text: 'Private Ins A: Best rates + fastest payment' },
                    { icon: '📊', text: 'Medicare: Reliable 92% collection rate' },
                    { icon: '💡', text: 'Renegotiating Ins B could add $85K/year' }
                ]
            },
            timing: {
                question: "When do most appointment no-shows occur?",
                thinking: {
                    steps: [
                        "Analyzing no-show patterns...",
                        "Identifying high-risk time slots...",
                        "Calculating revenue impact..."
                    ],
                    sql: `SELECT DAYNAME(appointment_date) as day,
                          HOUR(appointment_time) as hour,
                          COUNT(*) as total_appointments,
                          SUM(CASE WHEN no_show THEN 1 ELSE 0 END) as no_shows,
                          AVG(no_show_rate) as no_show_pct
                          FROM appointments GROUP BY day, hour
                          ORDER BY no_show_pct DESC;`
                },
                chartData: {
                    heatmap: {
                        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                        hours: ['8AM', '10AM', '12PM', '2PM', '4PM'],
                        data: [
                            [28, 15, 12, 18, 22],
                            [12, 8, 10, 14, 18],
                            [10, 7, 8, 12, 15],
                            [11, 9, 9, 13, 16],
                            [14, 10, 11, 15, 20]
                        ]
                    }
                },
                insights: [
                    { icon: '📅', text: 'Monday 8AM: 28% no-show rate' },
                    { icon: '⏰', text: 'Afternoon slots 40% less likely to no-show' },
                    { icon: '💰', text: 'Overbooking strategy could recover $18K/month' }
                ]
            },
            marketing: {
                question: "Which referral sources send the best patients?",
                thinking: {
                    steps: [
                        "Analyzing referral patterns...",
                        "Calculating patient value by source...",
                        "Identifying growth channels..."
                    ],
                    sql: `SELECT referral_source, COUNT(*) as patient_count,
                          AVG(lifetime_value) as avg_ltv,
                          AVG(visits_per_year) as avg_visits,
                          retention_rate FROM referral_analysis
                          GROUP BY referral_source ORDER BY avg_ltv DESC;`
                },
                chartData: {
                    labels: ['Physician Referral', 'Insurance', 'Online Search', 'Patient Referral', 'Walk-in'],
                    ltv: [4200, 2800, 2100, 3500, 1800],
                    retention: [88, 72, 65, 82, 58]
                },
                insights: [
                    { icon: '👨‍⚕️', text: 'Physician referrals: $4,200 LTV, 88% retention' },
                    { icon: '🌟', text: 'Patient referrals: High value + trust factor' },
                    { icon: '💡', text: 'Referral program could generate 50+ patients/month' }
                ]
            }
        },
        services: {
            revenue: {
                question: "Which service lines are most profitable?",
                thinking: {
                    steps: [
                        "Analyzing service line performance...",
                        "Calculating profit margins by type...",
                        "Identifying expansion opportunities..."
                    ],
                    sql: `SELECT service_line, project_count, total_revenue,
                          total_cost, (total_revenue - total_cost) as profit,
                          ((total_revenue - total_cost) / total_revenue * 100) as margin
                          FROM service_performance WHERE date >= DATE_SUB(NOW(), INTERVAL 90 DAY)
                          GROUP BY service_line ORDER BY margin DESC;`
                },
                chartData: {
                    labels: ['Consulting', 'Implementation', 'Support', 'Training', 'Managed Services'],
                    data: [68, 42, 35, 55, 48],
                    volumes: [45, 120, 280, 85, 95]
                },
                insights: [
                    { icon: '💎', text: 'Consulting: 68% margin on strategic work' },
                    { icon: '📊', text: 'Implementation: Volume driver at 42% margin' },
                    { icon: '🎯', text: 'Shifting 20% support to managed = +$45K/month' }
                ]
            },
            churn: {
                question: "Which clients are at risk of leaving?",
                thinking: {
                    steps: [
                        "Analyzing client engagement metrics...",
                        "Identifying satisfaction decline...",
                        "Calculating revenue at risk..."
                    ],
                    sql: `SELECT client_name, contract_value, last_project_date,
                          satisfaction_score, renewal_probability
                          FROM client_health WHERE renewal_probability < 0.6
                          ORDER BY contract_value DESC LIMIT 15;`
                },
                chartData: {
                    labels: ['Very High Risk', 'High Risk', 'Medium Risk', 'Low Risk', 'Secure'],
                    data: [5, 12, 28, 65, 140],
                    colors: ['#991b1b', '#ef4444', '#f59e0b', '#22c55e', '#10b981']
                },
                insights: [
                    { icon: '🚨', text: '5 key accounts at risk - $380K ARR' },
                    { icon: '📉', text: 'Satisfaction dropped 30% for at-risk clients' },
                    { icon: '✅', text: 'Executive outreach saves 70% of at-risk accounts' }
                ]
            },
            profit: {
                question: "What's my utilization rate by team?",
                thinking: {
                    steps: [
                        "Calculating billable vs non-billable hours...",
                        "Analyzing team productivity...",
                        "Finding optimization opportunities..."
                    ],
                    sql: `SELECT team_name, AVG(utilization_rate) as avg_utilization,
                          SUM(billable_hours) as total_billable,
                          SUM(billable_hours * hourly_rate) as revenue_generated
                          FROM team_utilization WHERE date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                          GROUP BY team_name ORDER BY avg_utilization DESC;`
                },
                chartData: {
                    labels: ['Senior Consultants', 'Consultants', 'Analysts', 'Project Managers', 'Support'],
                    data: [92, 85, 78, 68, 45],
                    target: [80, 85, 85, 70, 60]
                },
                insights: [
                    { icon: '⚠️', text: 'Seniors at 92% utilization (target: 80%)' },
                    { icon: '📊', text: 'Support team underutilized at 45%' },
                    { icon: '💡', text: 'Rebalancing work could improve margins by 15%' }
                ]
            },
            timing: {
                question: "When are my teams most productive?",
                thinking: {
                    steps: [
                        "Analyzing productivity patterns...",
                        "Measuring output by time period...",
                        "Optimizing work schedules..."
                    ],
                    sql: `SELECT DAYNAME(date) as day, HOUR(time) as hour,
                          AVG(tasks_completed) as avg_tasks,
                          AVG(billable_hours) as avg_billable
                          FROM productivity_metrics GROUP BY day, hour
                          ORDER BY avg_tasks DESC;`
                },
                chartData: {
                    heatmap: {
                        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                        hours: ['9AM', '11AM', '1PM', '3PM', '5PM'],
                        data: [
                            [6.2, 8.5, 7.1, 8.2, 5.8],
                            [7.8, 9.2, 8.5, 8.8, 6.2],
                            [7.5, 8.8, 8.2, 8.5, 6.0],
                            [7.2, 8.5, 7.8, 8.0, 5.5],
                            [6.5, 7.2, 6.8, 6.5, 4.2]
                        ]
                    }
                },
                insights: [
                    { icon: '⏰', text: 'Peak productivity: Tuesday 11AM-3PM' },
                    { icon: '📅', text: 'Friday afternoon 40% less productive' },
                    { icon: '💡', text: 'Schedule key meetings Tuesday-Thursday AM' }
                ]
            },
            marketing: {
                question: "Which lead sources convert best?",
                thinking: {
                    steps: [
                        "Analyzing lead source performance...",
                        "Calculating conversion rates and values...",
                        "Optimizing marketing spend..."
                    ],
                    sql: `SELECT lead_source, COUNT(*) as leads,
                          SUM(CASE WHEN converted THEN 1 ELSE 0 END) as conversions,
                          AVG(deal_size) as avg_deal, conversion_rate
                          FROM lead_analysis WHERE date >= DATE_SUB(NOW(), INTERVAL 90 DAY)
                          GROUP BY lead_source ORDER BY conversion_rate DESC;`
                },
                chartData: {
                    labels: ['Referrals', 'Website', 'LinkedIn', 'Events', 'Cold Outreach'],
                    conversion: [32, 12, 18, 24, 5],
                    dealSize: [125000, 65000, 85000, 95000, 45000]
                },
                insights: [
                    { icon: '🌟', text: 'Referrals: 32% conversion, $125K avg deal' },
                    { icon: '🎯', text: 'Events: 24% conversion worth investing more' },
                    { icon: '💡', text: 'Doubling referral program = +$2M pipeline' }
                ]
            }
        }
    };

    // Default queries for general business
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
            this.currentIndustry = 'general'; // Track current industry
            this.chart = null;
            this.init();
        }

        init() {
            this.renderDemoInterface();
            this.attachEventListeners();
            this.setupIndustrySelector(); // Setup industry-specific behavior
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

        setupIndustrySelector() {
            const industrySelect = document.getElementById('industry-select');
            if (industrySelect) {
                // Set initial industry from sessionStorage if available
                const savedIndustry = sessionStorage.getItem('currentIndustry');
                if (savedIndustry && industryDemoQueries[savedIndustry]) {
                    this.currentIndustry = savedIndustry;
                    industrySelect.value = savedIndustry;
                } else {
                    this.currentIndustry = 'general';
                }
                
                industrySelect.addEventListener('change', (e) => {
                    this.currentIndustry = e.target.value;
                    
                    // Store in sessionStorage for persistence
                    sessionStorage.setItem('currentIndustry', this.currentIndustry);
                    sessionStorage.setItem('industryChangeCount', 
                        (parseInt(sessionStorage.getItem('industryChangeCount') || 0) + 1).toString()
                    );
                    
                    // Update queries for new industry
                    this.updateQueriesForIndustry();
                    
                    // Re-run current query with new industry context
                    if (this.currentQuery) {
                        this.runQuery(this.currentQuery);
                    }
                    
                    // Dispatch custom event for syncing with other systems
                    document.dispatchEvent(new CustomEvent('industry-switched', {
                        detail: { industry: this.currentIndustry }
                    }));
                    
                    // Track industry change
                    if (window.DataSenseTracking) {
                        window.DataSenseTracking.trackEvent('industry_selected', {
                            industry: this.currentIndustry,
                            source: 'interactive_demo'
                        });
                    }
                    
                    // Reset exit intent for new journey
                    try {
                        sessionStorage.removeItem('exitIntentShown');
                        if (window.__exitIntentShown) {
                            window.__exitIntentShown = false;
                        }
                        console.log('Exit intent reset for industry:', this.currentIndustry);
                    } catch(e) {
                        console.warn('Could not reset exit intent:', e);
                    }
                });
            }
        }
        
        updateQueriesForIndustry() {
            // Update button labels based on industry
            const queryButtons = this.container.querySelectorAll('.query-btn');
            const industrySpecific = industryDemoQueries[this.currentIndustry];
            
            if (industrySpecific) {
                queryButtons.forEach(btn => {
                    const queryType = btn.dataset.query;
                    if (industrySpecific[queryType]) {
                        const span = btn.querySelector('span:last-child');
                        // Update button text to be more specific
                        const labelMap = {
                            revenue: this.currentIndustry === 'ecommerce' ? 'Bundle Analysis' :
                                    this.currentIndustry === 'saas' ? 'MRR Trends' :
                                    this.currentIndustry === 'restaurant' ? 'Menu Profits' :
                                    this.currentIndustry === 'healthcare' ? 'Service Revenue' :
                                    this.currentIndustry === 'services' ? 'Service Lines' :
                                    'Revenue Analysis',
                            churn: this.currentIndustry === 'ecommerce' ? 'Dormant Customers' :
                                  this.currentIndustry === 'saas' ? 'At-Risk Accounts' :
                                  this.currentIndustry === 'restaurant' ? 'Lost Regulars' :
                                  this.currentIndustry === 'healthcare' ? 'Missed Follow-ups' :
                                  this.currentIndustry === 'services' ? 'Client Risk' :
                                  'Churn Insights',
                            profit: this.currentIndustry === 'ecommerce' ? 'Category Margins' :
                                   this.currentIndustry === 'saas' ? 'Tier Analysis' :
                                   this.currentIndustry === 'restaurant' ? 'Food Costs' :
                                   this.currentIndustry === 'healthcare' ? 'Payer Mix' :
                                   this.currentIndustry === 'services' ? 'Utilization' :
                                   'Profit Margins',
                            timing: this.currentIndustry === 'ecommerce' ? 'Peak Shopping' :
                                   this.currentIndustry === 'saas' ? 'Usage Patterns' :
                                   this.currentIndustry === 'restaurant' ? 'Staff Schedule' :
                                   this.currentIndustry === 'healthcare' ? 'No-Show Times' :
                                   this.currentIndustry === 'services' ? 'Productivity' :
                                   'Best Times',
                            marketing: this.currentIndustry === 'ecommerce' ? 'Channel ROI' :
                                      this.currentIndustry === 'saas' ? 'Feature Upgrades' :
                                      this.currentIndustry === 'restaurant' ? 'Promotions' :
                                      this.currentIndustry === 'healthcare' ? 'Referrals' :
                                      this.currentIndustry === 'services' ? 'Lead Sources' :
                                      'Marketing ROI'
                        };
                        if (span && labelMap[queryType]) {
                            span.textContent = labelMap[queryType];
                        }
                    }
                });
            }
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
                    
                    // Track with UserEngagement if available
                    if (window.UserEngagement) {
                        window.UserEngagement.trackSignal('demoInteractions');
                        const queryText = btn.textContent || query;
                        window.UserEngagement.trackSignal('queriesViewed', queryText);
                    }
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
            // Get industry-specific or default queries
            const industryQueries = industryDemoQueries[this.currentIndustry] || {};
            const queryData = industryQueries[queryType] || demoQueries[queryType];
            
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

    // Listen for industry switch events from other modules
    document.addEventListener('industry-switched', (e) => {
        const industry = e.detail.industry;
        
        // Update all interactive demo instances
        const demoContainers = document.querySelectorAll('.interactive-demo-wrapper');
        demoContainers.forEach(container => {
            // Update dropdown if exists in this instance
            const industrySelect = container.querySelector('#industry-select');
            if (industrySelect && industrySelect.value !== industry) {
                industrySelect.value = industry;
                // Trigger change event to update the demo
                industrySelect.dispatchEvent(new Event('change'));
            }
        });
    });

    // Export for use in other modules
    window.DataSenseDemo = InteractiveDemo;
    window.industryDemoQueries = industryDemoQueries; // Export for external access
})();