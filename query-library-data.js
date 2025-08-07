// Query Library Data Structure
const queryLibraryData = {
    // Revenue & Sales Queries
    revenue: [
        {
            id: 'rev-001',
            category: 'revenue',
            industries: ['all'],
            title: 'Top Revenue Drivers',
            query: 'What are my top revenue drivers this quarter?',
            description: 'Identify which products, services, or customer segments generate the most revenue',
            expectedInsight: 'Discovers your hidden profit centers and growth opportunities',
            timeToValue: '30 seconds',
            complexity: 'beginner',
            businessValue: 'Focus resources on highest-value activities',
            icon: '💰',
            tags: ['revenue', 'growth', 'analysis']
        },
        {
            id: 'rev-002',
            category: 'revenue',
            industries: ['all'],
            title: 'Revenue Trend Analysis',
            query: 'Show me revenue trends over the last 12 months broken down by product category',
            description: 'Visualize revenue patterns and seasonal variations',
            expectedInsight: 'Understand growth trajectories and seasonal patterns',
            timeToValue: '45 seconds',
            complexity: 'beginner',
            businessValue: 'Better forecasting and inventory planning',
            icon: '📈',
            tags: ['revenue', 'trends', 'forecasting']
        },
        {
            id: 'rev-003',
            category: 'revenue',
            industries: ['ecommerce', 'retail'],
            title: 'Customer Lifetime Value',
            query: 'What\'s my customer lifetime value by acquisition source?',
            description: 'Calculate CLV for different customer acquisition channels',
            expectedInsight: 'Optimize marketing spend based on long-term value',
            timeToValue: '60 seconds',
            complexity: 'intermediate',
            businessValue: 'Improve ROI on customer acquisition',
            icon: '👥',
            tags: ['CLV', 'customers', 'acquisition']
        },
        {
            id: 'rev-004',
            category: 'revenue',
            industries: ['saas'],
            title: 'MRR Growth Decomposition',
            query: 'Break down my MRR growth into new, expansion, churned, and contraction',
            description: 'Understand the components driving monthly recurring revenue',
            expectedInsight: 'Identify growth levers and risk areas',
            timeToValue: '45 seconds',
            complexity: 'intermediate',
            businessValue: 'Focus on sustainable growth metrics',
            icon: '📊',
            tags: ['MRR', 'SaaS', 'growth']
        },
        {
            id: 'rev-005',
            category: 'revenue',
            industries: ['all'],
            title: 'Profit Margin Analysis',
            query: 'Which products have the highest and lowest profit margins?',
            description: 'Analyze profitability across your product portfolio',
            expectedInsight: 'Optimize product mix for maximum profitability',
            timeToValue: '30 seconds',
            complexity: 'beginner',
            businessValue: 'Increase overall margins by 10-20%',
            icon: '💵',
            tags: ['profit', 'margins', 'products']
        },
        {
            id: 'rev-006',
            category: 'revenue',
            industries: ['services'],
            title: 'Project Profitability',
            query: 'Which client projects are most and least profitable?',
            description: 'Analyze profitability by project or client engagement',
            expectedInsight: 'Focus on high-value clients and optimize pricing',
            timeToValue: '45 seconds',
            complexity: 'intermediate',
            businessValue: 'Improve project selection and pricing',
            icon: '📋',
            tags: ['projects', 'clients', 'profitability']
        },
        {
            id: 'rev-007',
            category: 'revenue',
            industries: ['all'],
            title: 'Sales Velocity',
            query: 'What\'s my average sales cycle length and how is it trending?',
            description: 'Track time from lead to close across different segments',
            expectedInsight: 'Identify bottlenecks in sales process',
            timeToValue: '30 seconds',
            complexity: 'intermediate',
            businessValue: 'Accelerate sales cycles by 20-30%',
            icon: '⚡',
            tags: ['sales', 'velocity', 'efficiency']
        },
        {
            id: 'rev-008',
            category: 'revenue',
            industries: ['all'],
            title: 'Cross-sell Opportunities',
            query: 'Which products are frequently bought together?',
            description: 'Discover product affinity and bundling opportunities',
            expectedInsight: 'Increase average order value through smart bundling',
            timeToValue: '45 seconds',
            complexity: 'intermediate',
            businessValue: 'Boost AOV by 15-25%',
            icon: '🎯',
            tags: ['cross-sell', 'bundling', 'AOV']
        }
    ],

    // Marketing Analytics Queries
    marketing: [
        {
            id: 'mkt-001',
            category: 'marketing',
            industries: ['all'],
            title: 'Marketing ROI by Channel',
            query: 'Calculate ROI for each marketing channel over the last quarter',
            description: 'Compare performance across paid, organic, and referral channels',
            expectedInsight: 'Optimize marketing budget allocation',
            timeToValue: '60 seconds',
            complexity: 'intermediate',
            businessValue: 'Improve marketing ROI by 30-40%',
            icon: '📱',
            tags: ['ROI', 'channels', 'performance']
        },
        {
            id: 'mkt-002',
            category: 'marketing',
            industries: ['all'],
            title: 'Campaign Performance',
            query: 'Which campaigns drove the most conversions and revenue?',
            description: 'Analyze campaign effectiveness across metrics',
            expectedInsight: 'Replicate successful campaign strategies',
            timeToValue: '45 seconds',
            complexity: 'beginner',
            businessValue: 'Increase conversion rates by 20%',
            icon: '🚀',
            tags: ['campaigns', 'conversions', 'performance']
        },
        {
            id: 'mkt-003',
            category: 'marketing',
            industries: ['all'],
            title: 'Customer Acquisition Cost',
            query: 'What\'s my CAC trend over time and by channel?',
            description: 'Track customer acquisition costs and efficiency',
            expectedInsight: 'Identify most cost-effective acquisition channels',
            timeToValue: '45 seconds',
            complexity: 'intermediate',
            businessValue: 'Reduce CAC by 25-35%',
            icon: '💸',
            tags: ['CAC', 'acquisition', 'costs']
        },
        {
            id: 'mkt-004',
            category: 'marketing',
            industries: ['ecommerce'],
            title: 'Attribution Analysis',
            query: 'Show attribution across all marketing touchpoints',
            description: 'Understand the customer journey and channel contribution',
            expectedInsight: 'Allocate credit accurately across channels',
            timeToValue: '90 seconds',
            complexity: 'advanced',
            businessValue: 'Optimize multi-channel strategy',
            icon: '🔄',
            tags: ['attribution', 'journey', 'touchpoints']
        },
        {
            id: 'mkt-005',
            category: 'marketing',
            industries: ['all'],
            title: 'Content Performance',
            query: 'Which content pieces generate the most engagement and conversions?',
            description: 'Analyze blog posts, videos, and other content ROI',
            expectedInsight: 'Focus content creation on high-performing topics',
            timeToValue: '30 seconds',
            complexity: 'beginner',
            businessValue: 'Improve content ROI by 40%',
            icon: '📝',
            tags: ['content', 'engagement', 'ROI']
        },
        {
            id: 'mkt-006',
            category: 'marketing',
            industries: ['all'],
            title: 'Email Campaign Analytics',
            query: 'What\'s my email open rate, CTR, and conversion rate by segment?',
            description: 'Deep dive into email marketing performance',
            expectedInsight: 'Optimize email targeting and content',
            timeToValue: '30 seconds',
            complexity: 'beginner',
            businessValue: 'Increase email revenue by 30%',
            icon: '📧',
            tags: ['email', 'engagement', 'segmentation']
        },
        {
            id: 'mkt-007',
            category: 'marketing',
            industries: ['all'],
            title: 'Lead Quality Score',
            query: 'Score and rank leads based on conversion probability',
            description: 'Predictive lead scoring using historical data',
            expectedInsight: 'Focus sales efforts on high-quality leads',
            timeToValue: '60 seconds',
            complexity: 'advanced',
            businessValue: 'Improve conversion rates by 40%',
            icon: '🎯',
            tags: ['leads', 'scoring', 'prediction']
        },
        {
            id: 'mkt-008',
            category: 'marketing',
            industries: ['saas', 'services'],
            title: 'Free Trial Conversion',
            query: 'What factors correlate with free trial to paid conversion?',
            description: 'Identify behaviors that predict conversion',
            expectedInsight: 'Optimize trial experience for conversion',
            timeToValue: '75 seconds',
            complexity: 'advanced',
            businessValue: 'Increase trial conversion by 25%',
            icon: '🔄',
            tags: ['trials', 'conversion', 'optimization']
        }
    ],

    // Customer Insights Queries
    customers: [
        {
            id: 'cust-001',
            category: 'customers',
            industries: ['all'],
            title: 'Churn Prediction',
            query: 'Which customers are at risk of churning in the next 30 days?',
            description: 'Identify at-risk customers before they leave',
            expectedInsight: 'Proactive retention strategies',
            timeToValue: '60 seconds',
            complexity: 'advanced',
            businessValue: 'Reduce churn by 20-30%',
            icon: '⚠️',
            tags: ['churn', 'retention', 'prediction']
        },
        {
            id: 'cust-002',
            category: 'customers',
            industries: ['all'],
            title: 'Customer Segmentation',
            query: 'Segment customers by behavior, value, and demographics',
            description: 'Create actionable customer segments',
            expectedInsight: 'Personalized marketing and service',
            timeToValue: '90 seconds',
            complexity: 'intermediate',
            businessValue: 'Increase engagement by 35%',
            icon: '👥',
            tags: ['segmentation', 'personalization', 'targeting']
        },
        {
            id: 'cust-003',
            category: 'customers',
            industries: ['all'],
            title: 'Best Customer Profile',
            query: 'What do my most valuable customers have in common?',
            description: 'Identify characteristics of high-value customers',
            expectedInsight: 'Target similar prospects',
            timeToValue: '45 seconds',
            complexity: 'intermediate',
            businessValue: 'Improve acquisition quality',
            icon: '⭐',
            tags: ['profiling', 'value', 'acquisition']
        },
        {
            id: 'cust-004',
            category: 'customers',
            industries: ['all'],
            title: 'NPS Analysis',
            query: 'What drives promoter vs detractor scores?',
            description: 'Understand factors affecting customer satisfaction',
            expectedInsight: 'Improve customer experience',
            timeToValue: '45 seconds',
            complexity: 'intermediate',
            businessValue: 'Increase NPS by 20 points',
            icon: '😊',
            tags: ['NPS', 'satisfaction', 'feedback']
        },
        {
            id: 'cust-005',
            category: 'customers',
            industries: ['ecommerce', 'retail'],
            title: 'Purchase Pattern Analysis',
            query: 'What are the typical purchase patterns and frequencies?',
            description: 'Understand buying behavior and cycles',
            expectedInsight: 'Optimize inventory and promotions',
            timeToValue: '60 seconds',
            complexity: 'intermediate',
            businessValue: 'Increase repeat purchases by 25%',
            icon: '🛒',
            tags: ['purchases', 'patterns', 'behavior']
        },
        {
            id: 'cust-006',
            category: 'customers',
            industries: ['saas'],
            title: 'Feature Adoption',
            query: 'Which features drive the most engagement and retention?',
            description: 'Analyze feature usage and impact',
            expectedInsight: 'Prioritize product development',
            timeToValue: '45 seconds',
            complexity: 'intermediate',
            businessValue: 'Improve product-market fit',
            icon: '🔧',
            tags: ['features', 'adoption', 'engagement']
        },
        {
            id: 'cust-007',
            category: 'customers',
            industries: ['all'],
            title: 'Customer Journey Mapping',
            query: 'Map the typical customer journey from awareness to purchase',
            description: 'Visualize touchpoints and drop-off points',
            expectedInsight: 'Optimize conversion funnel',
            timeToValue: '90 seconds',
            complexity: 'advanced',
            businessValue: 'Improve conversion by 30%',
            icon: '🗺️',
            tags: ['journey', 'funnel', 'conversion']
        },
        {
            id: 'cust-008',
            category: 'customers',
            industries: ['all'],
            title: 'Support Ticket Analysis',
            query: 'What are the most common customer support issues?',
            description: 'Identify patterns in support requests',
            expectedInsight: 'Proactively address common problems',
            timeToValue: '30 seconds',
            complexity: 'beginner',
            businessValue: 'Reduce support volume by 40%',
            icon: '🎫',
            tags: ['support', 'issues', 'satisfaction']
        }
    ],

    // Operations Queries
    operations: [
        {
            id: 'ops-001',
            category: 'operations',
            industries: ['all'],
            title: 'Cost Efficiency Analysis',
            query: 'Where are my biggest cost inefficiencies?',
            description: 'Identify areas of overspending and waste',
            expectedInsight: 'Reduce operational costs',
            timeToValue: '60 seconds',
            complexity: 'intermediate',
            businessValue: 'Cut costs by 15-20%',
            icon: '💡',
            tags: ['costs', 'efficiency', 'optimization']
        },
        {
            id: 'ops-002',
            category: 'operations',
            industries: ['ecommerce', 'retail'],
            title: 'Inventory Optimization',
            query: 'Optimize inventory levels based on demand patterns',
            description: 'Balance stock levels with demand forecasts',
            expectedInsight: 'Reduce carrying costs and stockouts',
            timeToValue: '75 seconds',
            complexity: 'advanced',
            businessValue: 'Reduce inventory costs by 25%',
            icon: '📦',
            tags: ['inventory', 'demand', 'forecasting']
        },
        {
            id: 'ops-003',
            category: 'operations',
            industries: ['all'],
            title: 'Process Bottlenecks',
            query: 'Identify bottlenecks in our operational processes',
            description: 'Find and eliminate workflow inefficiencies',
            expectedInsight: 'Streamline operations',
            timeToValue: '60 seconds',
            complexity: 'intermediate',
            businessValue: 'Improve throughput by 30%',
            icon: '🚧',
            tags: ['processes', 'bottlenecks', 'workflow']
        },
        {
            id: 'ops-004',
            category: 'operations',
            industries: ['all'],
            title: 'Resource Utilization',
            query: 'How efficiently are we using our resources?',
            description: 'Analyze capacity and utilization rates',
            expectedInsight: 'Optimize resource allocation',
            timeToValue: '45 seconds',
            complexity: 'intermediate',
            businessValue: 'Increase productivity by 20%',
            icon: '⚙️',
            tags: ['resources', 'utilization', 'capacity']
        },
        {
            id: 'ops-005',
            category: 'operations',
            industries: ['all'],
            title: 'Supplier Performance',
            query: 'Which suppliers deliver the best value and reliability?',
            description: 'Evaluate supplier metrics and performance',
            expectedInsight: 'Optimize supplier relationships',
            timeToValue: '45 seconds',
            complexity: 'intermediate',
            businessValue: 'Improve supply chain efficiency',
            icon: '🚚',
            tags: ['suppliers', 'performance', 'reliability']
        },
        {
            id: 'ops-006',
            category: 'operations',
            industries: ['all'],
            title: 'Quality Metrics',
            query: 'Track quality metrics and defect rates across products',
            description: 'Monitor and improve quality standards',
            expectedInsight: 'Reduce defects and returns',
            timeToValue: '30 seconds',
            complexity: 'beginner',
            businessValue: 'Reduce defects by 40%',
            icon: '✅',
            tags: ['quality', 'defects', 'standards']
        },
        {
            id: 'ops-007',
            category: 'operations',
            industries: ['services'],
            title: 'Service Delivery Time',
            query: 'What\'s our average service delivery time and how can we improve it?',
            description: 'Analyze delivery performance and delays',
            expectedInsight: 'Improve customer satisfaction',
            timeToValue: '45 seconds',
            complexity: 'intermediate',
            businessValue: 'Reduce delivery time by 25%',
            icon: '⏱️',
            tags: ['delivery', 'performance', 'speed']
        },
        {
            id: 'ops-008',
            category: 'operations',
            industries: ['all'],
            title: 'Seasonal Demand Forecast',
            query: 'Forecast demand for the next quarter based on seasonal patterns',
            description: 'Predict future demand using historical data',
            expectedInsight: 'Better planning and preparation',
            timeToValue: '60 seconds',
            complexity: 'advanced',
            businessValue: 'Improve forecast accuracy by 30%',
            icon: '📊',
            tags: ['forecasting', 'demand', 'planning']
        }
    ],

    // Finance Queries
    finance: [
        {
            id: 'fin-001',
            category: 'finance',
            industries: ['all'],
            title: 'Cash Flow Forecast',
            query: 'Forecast cash flow for the next 3 months',
            description: 'Predict incoming and outgoing cash',
            expectedInsight: 'Prevent cash flow issues',
            timeToValue: '60 seconds',
            complexity: 'intermediate',
            businessValue: 'Improve cash management',
            icon: '💵',
            tags: ['cashflow', 'forecast', 'liquidity']
        },
        {
            id: 'fin-002',
            category: 'finance',
            industries: ['all'],
            title: 'Budget Variance Analysis',
            query: 'Where are we over or under budget this quarter?',
            description: 'Compare actual vs planned spending',
            expectedInsight: 'Control spending and adjust budgets',
            timeToValue: '45 seconds',
            complexity: 'beginner',
            businessValue: 'Stay within budget targets',
            icon: '📊',
            tags: ['budget', 'variance', 'spending']
        },
        {
            id: 'fin-003',
            category: 'finance',
            industries: ['all'],
            title: 'Accounts Receivable Aging',
            query: 'Which invoices are overdue and by how much?',
            description: 'Track outstanding payments and collection',
            expectedInsight: 'Improve collections process',
            timeToValue: '30 seconds',
            complexity: 'beginner',
            businessValue: 'Reduce DSO by 20%',
            icon: '📄',
            tags: ['receivables', 'collections', 'aging']
        },
        {
            id: 'fin-004',
            category: 'finance',
            industries: ['all'],
            title: 'Expense Category Analysis',
            query: 'Break down expenses by category and identify trends',
            description: 'Understand spending patterns',
            expectedInsight: 'Find cost-saving opportunities',
            timeToValue: '45 seconds',
            complexity: 'beginner',
            businessValue: 'Reduce expenses by 15%',
            icon: '💳',
            tags: ['expenses', 'categories', 'trends']
        },
        {
            id: 'fin-005',
            category: 'finance',
            industries: ['all'],
            title: 'Financial Ratios Dashboard',
            query: 'Calculate key financial ratios and benchmarks',
            description: 'Monitor financial health metrics',
            expectedInsight: 'Track business performance',
            timeToValue: '60 seconds',
            complexity: 'intermediate',
            businessValue: 'Improve financial health',
            icon: '📈',
            tags: ['ratios', 'metrics', 'benchmarks']
        },
        {
            id: 'fin-006',
            category: 'finance',
            industries: ['saas'],
            title: 'Unit Economics',
            query: 'What are our unit economics and payback period?',
            description: 'Analyze CAC, LTV, and payback metrics',
            expectedInsight: 'Ensure sustainable growth',
            timeToValue: '60 seconds',
            complexity: 'advanced',
            businessValue: 'Optimize growth efficiency',
            icon: '🎯',
            tags: ['unit economics', 'CAC', 'LTV']
        },
        {
            id: 'fin-007',
            category: 'finance',
            industries: ['all'],
            title: 'Tax Optimization',
            query: 'Identify tax-saving opportunities and deductions',
            description: 'Analyze tax efficiency',
            expectedInsight: 'Reduce tax burden legally',
            timeToValue: '90 seconds',
            complexity: 'advanced',
            businessValue: 'Save on taxes',
            icon: '🏛️',
            tags: ['tax', 'deductions', 'optimization']
        },
        {
            id: 'fin-008',
            category: 'finance',
            industries: ['all'],
            title: 'Investment ROI',
            query: 'Calculate ROI on recent investments and initiatives',
            description: 'Measure investment performance',
            expectedInsight: 'Make better investment decisions',
            timeToValue: '45 seconds',
            complexity: 'intermediate',
            businessValue: 'Improve investment returns',
            icon: '📊',
            tags: ['ROI', 'investments', 'returns']
        }
    ],

    // Product Queries
    product: [
        {
            id: 'prod-001',
            category: 'product',
            industries: ['saas', 'ecommerce'],
            title: 'Feature Usage Analytics',
            query: 'Which features are most and least used?',
            description: 'Analyze feature adoption and engagement',
            expectedInsight: 'Prioritize development efforts',
            timeToValue: '45 seconds',
            complexity: 'intermediate',
            businessValue: 'Improve product-market fit',
            icon: '🔍',
            tags: ['features', 'usage', 'analytics']
        },
        {
            id: 'prod-002',
            category: 'product',
            industries: ['all'],
            title: 'User Behavior Flow',
            query: 'How do users navigate through our product?',
            description: 'Map user journeys and drop-off points',
            expectedInsight: 'Optimize user experience',
            timeToValue: '60 seconds',
            complexity: 'intermediate',
            businessValue: 'Increase user retention',
            icon: '🔀',
            tags: ['behavior', 'flow', 'UX']
        },
        {
            id: 'prod-003',
            category: 'product',
            industries: ['saas'],
            title: 'Time to Value',
            query: 'How long does it take users to reach their first success?',
            description: 'Measure onboarding effectiveness',
            expectedInsight: 'Reduce time to value',
            timeToValue: '45 seconds',
            complexity: 'intermediate',
            businessValue: 'Improve activation rates',
            icon: '⏰',
            tags: ['onboarding', 'activation', 'TTV']
        },
        {
            id: 'prod-004',
            category: 'product',
            industries: ['all'],
            title: 'A/B Test Results',
            query: 'Which product variations perform better?',
            description: 'Analyze experiment results',
            expectedInsight: 'Make data-driven decisions',
            timeToValue: '30 seconds',
            complexity: 'intermediate',
            businessValue: 'Optimize conversion rates',
            icon: '🔬',
            tags: ['testing', 'experiments', 'optimization']
        },
        {
            id: 'prod-005',
            category: 'product',
            industries: ['all'],
            title: 'Bug Impact Analysis',
            query: 'Which bugs affect the most users and revenue?',
            description: 'Prioritize bug fixes by impact',
            expectedInsight: 'Focus on high-impact issues',
            timeToValue: '30 seconds',
            complexity: 'beginner',
            businessValue: 'Improve product quality',
            icon: '🐛',
            tags: ['bugs', 'quality', 'prioritization']
        },
        {
            id: 'prod-006',
            category: 'product',
            industries: ['saas'],
            title: 'API Usage Patterns',
            query: 'How are customers using our API?',
            description: 'Track API endpoints and usage',
            expectedInsight: 'Optimize API performance',
            timeToValue: '45 seconds',
            complexity: 'intermediate',
            businessValue: 'Improve integration experience',
            icon: '🔌',
            tags: ['API', 'integration', 'usage']
        },
        {
            id: 'prod-007',
            category: 'product',
            industries: ['all'],
            title: 'Mobile vs Desktop Usage',
            query: 'Compare user behavior across mobile and desktop',
            description: 'Understand platform preferences',
            expectedInsight: 'Optimize for primary platform',
            timeToValue: '30 seconds',
            complexity: 'beginner',
            businessValue: 'Improve cross-platform experience',
            icon: '📱',
            tags: ['mobile', 'desktop', 'platforms']
        },
        {
            id: 'prod-008',
            category: 'product',
            industries: ['all'],
            title: 'Performance Metrics',
            query: 'Track page load times and performance metrics',
            description: 'Monitor application performance',
            expectedInsight: 'Identify performance bottlenecks',
            timeToValue: '30 seconds',
            complexity: 'intermediate',
            businessValue: 'Improve user experience',
            icon: '⚡',
            tags: ['performance', 'speed', 'metrics']
        }
    ]
};

// Helper function to get all queries
function getAllQueries() {
    return [
        ...queryLibraryData.revenue,
        ...queryLibraryData.marketing,
        ...queryLibraryData.customers,
        ...queryLibraryData.operations,
        ...queryLibraryData.finance,
        ...queryLibraryData.product
    ];
}

// Helper function to filter queries
function filterQueries(category = 'all', industry = 'all', searchTerm = '') {
    let queries = getAllQueries();
    
    if (category !== 'all') {
        queries = queries.filter(q => q.category === category);
    }
    
    if (industry !== 'all') {
        queries = queries.filter(q => 
            q.industries.includes('all') || q.industries.includes(industry)
        );
    }
    
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        queries = queries.filter(q => 
            q.title.toLowerCase().includes(term) ||
            q.query.toLowerCase().includes(term) ||
            q.description.toLowerCase().includes(term) ||
            q.tags.some(tag => tag.toLowerCase().includes(term))
        );
    }
    
    return queries;
}

// Industry-specific showcase queries
const industryShowcases = {
    ecommerce: {
        title: 'E-commerce Analytics',
        description: 'Drive online sales with data-driven insights',
        featured: ['rev-003', 'mkt-004', 'cust-005', 'ops-002'],
        useCases: [
            'Cart abandonment analysis',
            'Product recommendation optimization',
            'Seasonal trend predictions',
            'Customer lifetime value analysis',
            'Inventory optimization'
        ]
    },
    saas: {
        title: 'SaaS Metrics',
        description: 'Optimize recurring revenue and reduce churn',
        featured: ['rev-004', 'mkt-008', 'cust-006', 'fin-006'],
        useCases: [
            'MRR growth decomposition',
            'Feature adoption analysis',
            'Churn prediction models',
            'Pricing optimization',
            'Unit economics tracking'
        ]
    },
    services: {
        title: 'Professional Services',
        description: 'Maximize project profitability and utilization',
        featured: ['rev-006', 'ops-007', 'cust-003', 'fin-001'],
        useCases: [
            'Project profitability analysis',
            'Resource utilization optimization',
            'Client retention strategies',
            'Proposal win rate analysis',
            'Service delivery optimization'
        ]
    },
    retail: {
        title: 'Retail Analytics',
        description: 'Optimize inventory and maximize store performance',
        featured: ['rev-002', 'cust-005', 'ops-002', 'mkt-001'],
        useCases: [
            'Store performance comparison',
            'Inventory turnover analysis',
            'Customer foot traffic patterns',
            'Promotion effectiveness',
            'Supply chain optimization'
        ]
    },
    hospitality: {
        title: 'Hospitality Insights',
        description: 'Enhance guest experience and optimize operations',
        featured: ['cust-004', 'rev-001', 'ops-003', 'mkt-002'],
        useCases: [
            'Guest satisfaction analysis',
            'Occupancy rate optimization',
            'Revenue per available room',
            'Seasonal demand forecasting',
            'Service quality metrics'
        ]
    }
};