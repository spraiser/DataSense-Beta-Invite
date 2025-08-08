const caseStudies = [
  {
    id: 'shopify-boutique',
    slug: 'bella-rose-boutique-28-percent-revenue-increase',
    industry: 'E-commerce',
    companyName: 'Bella Rose Boutique',
    logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200',
    heroImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200',
    featured: true,
    
    profile: {
      size: '12 employees',
      revenue: '$2.4M annual',
      platform: 'Shopify Plus',
      location: 'Austin, TX',
      yearFounded: 2018,
      techStack: ['Shopify', 'Klaviyo', 'Google Analytics', 'Facebook Ads', 'Instagram Shopping']
    },
    
    challenge: {
      summary: 'Struggling to understand which products and marketing channels were actually profitable',
      details: [
        'Spending $15K/month on ads with unclear ROI',
        'Inventory decisions based on gut feeling',
        'No visibility into customer lifetime value',
        'Manual reporting taking 20+ hours per month'
      ]
    },
    
    implementation: {
      week1: {
        title: 'Data Connection & Initial Insights',
        achievements: [
          'Connected Shopify, Google Ads, and Facebook in 45 minutes',
          'Discovered 23% of products generated 81% of profit',
          'Identified $3,200/month in wasted ad spend'
        ]
      },
      month1: {
        title: 'First Optimization Wave',
        achievements: [
          'Reduced ad spend by 18% while maintaining sales',
          'Increased email conversion rate by 34%',
          'Launched first data-driven product bundle'
        ]
      },
      month3: {
        title: 'Full Transformation',
        achievements: [
          'Revenue up 28% with same marketing budget',
          'Inventory turnover improved by 2.3x',
          'Customer retention increased by 41%'
        ]
      },
      today: {
        title: 'Ongoing Success',
        achievements: [
          'Automated weekly reports save 25 hours/month',
          'Predictive inventory prevents stockouts',
          'AI recommendations drive daily decisions'
        ]
      }
    },
    
    metrics: {
      roi: '580%',
      roiDetails: 'Return on DataSense investment in first year',
      revenueIncrease: '28%',
      revenueAmount: '$672,000',
      timeSaved: '25 hours/month',
      costSaved: '$8,400/month',
      beforeAfter: {
        adSpend: { before: '$15,000/mo', after: '$12,300/mo' },
        conversionRate: { before: '2.1%', after: '3.4%' },
        averageOrderValue: { before: '$67', after: '$89' },
        customerLifetimeValue: { before: '$134', after: '$243' }
      }
    },
    
    testimonial: {
      quote: "DataSense turned our data chaos into clarity. We went from guessing to knowing exactly what drives our growth. The 28% revenue increase speaks for itself.",
      author: 'Sarah Mitchell',
      title: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
      linkedin: 'https://linkedin.com/in/sarahmitchell',
      videoUrl: 'https://www.youtube.com/embed/demovideourl1'
    },
    
    dashboardScreenshots: [
      {
        title: 'Revenue Dashboard',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
        description: 'Real-time revenue tracking across all channels'
      },
      {
        title: 'Product Performance',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
        description: 'Profit margins and velocity by product category'
      }
    ],
    
    relatedStudies: ['saas-churn-reduction', 'restaurant-menu-optimization'],
    tags: ['e-commerce', 'shopify', 'retail', 'fashion', 'inventory-optimization', 'marketing-roi']
  },
  
  {
    id: 'saas-churn-reduction',
    slug: 'techflow-reduces-churn-43-percent',
    industry: 'B2B SaaS',
    companyName: 'TechFlow Solutions',
    logo: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=200',
    heroImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200',
    featured: true,
    
    profile: {
      size: '45 employees',
      revenue: '$8.2M ARR',
      platform: 'Subscription SaaS',
      location: 'San Francisco, CA',
      yearFounded: 2019,
      techStack: ['Stripe', 'Salesforce', 'Intercom', 'Mixpanel', 'HubSpot']
    },
    
    challenge: {
      summary: 'High churn rate threatening growth with no clear understanding of why customers were leaving',
      details: [
        'Monthly churn rate at 8.5% (industry avg 5%)',
        'No early warning system for at-risk accounts',
        'Customer success team working blind',
        'Disconnected data across 6+ tools'
      ]
    },
    
    implementation: {
      week1: {
        title: 'Churn Pattern Discovery',
        achievements: [
          'Integrated all customer touchpoint data',
          'Identified 5 key churn indicators',
          'Built first at-risk customer dashboard'
        ]
      },
      month1: {
        title: 'Proactive Intervention',
        achievements: [
          'Saved 18 at-risk accounts worth $124K ARR',
          'Reduced time to identify churn signals by 85%',
          'Implemented automated alert system'
        ]
      },
      month3: {
        title: 'Systematic Improvement',
        achievements: [
          'Churn reduced from 8.5% to 4.8%',
          'Customer health scores for all accounts',
          'Predictive model accuracy at 87%'
        ]
      },
      today: {
        title: 'Retention Excellence',
        achievements: [
          'Maintaining sub-5% churn rate',
          'NRR increased to 115%',
          'Customer Success efficiency up 3x'
        ]
      }
    },
    
    metrics: {
      roi: '1,240%',
      roiDetails: 'Annual return from retained revenue',
      churnReduction: '43%',
      revenueRetained: '$1.8M',
      timeSaved: '40 hours/month',
      ltv_cac: { before: '2.1:1', after: '4.3:1' },
      beforeAfter: {
        monthlyChurn: { before: '8.5%', after: '4.8%' },
        netRevenueRetention: { before: '92%', after: '115%' },
        averageCustomerLifetime: { before: '11.7 months', after: '20.8 months' },
        supportTicketResolution: { before: '48 hours', after: '12 hours' }
      }
    },
    
    testimonial: {
      quote: "DataSense didn't just reduce our churn - it transformed how we think about customer success. We now prevent problems instead of reacting to them.",
      author: 'Marcus Chen',
      title: 'VP of Customer Success',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      linkedin: 'https://linkedin.com/in/marcuschen',
      videoUrl: 'https://www.youtube.com/embed/demovideourl2'
    },
    
    dashboardScreenshots: [
      {
        title: 'Customer Health Dashboard',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
        description: 'Real-time health scores for every customer'
      },
      {
        title: 'Churn Prediction Model',
        image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800',
        description: 'AI-powered early warning system'
      }
    ],
    
    relatedStudies: ['shopify-boutique', 'professional-services-reporting'],
    tags: ['saas', 'b2b', 'churn-reduction', 'customer-success', 'predictive-analytics']
  },
  
  {
    id: 'professional-services-reporting',
    slug: 'summit-consulting-3x-faster-reporting',
    industry: 'Professional Services',
    companyName: 'Summit Consulting Group',
    logo: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200',
    heroImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200',
    featured: false,
    
    profile: {
      size: '28 employees',
      revenue: '$4.7M annual',
      platform: 'Management Consulting',
      location: 'Chicago, IL',
      yearFounded: 2015,
      techStack: ['QuickBooks', 'Asana', 'Harvest', 'Google Workspace', 'Tableau']
    },
    
    challenge: {
      summary: 'Client reporting consuming 30% of billable hours with inconsistent quality',
      details: [
        'Manual report creation taking 15-20 hours per client',
        'Data scattered across 5 different systems',
        'Inconsistent reporting formats',
        'No real-time project profitability visibility'
      ]
    },
    
    implementation: {
      week1: {
        title: 'System Integration',
        achievements: [
          'Connected all project and financial systems',
          'Created first automated client dashboard',
          'Standardized reporting templates'
        ]
      },
      month1: {
        title: 'Automation Rollout',
        achievements: [
          'Reduced report generation time by 75%',
          'Launched self-service client portals',
          'Real-time project margin tracking'
        ]
      },
      month3: {
        title: 'Full Deployment',
        achievements: [
          'All clients on automated reporting',
          'Billable hours increased by 22%',
          'Client satisfaction scores up 38%'
        ]
      },
      today: {
        title: 'Competitive Advantage',
        achievements: [
          'Reports generated in under 30 minutes',
          'Won 5 new clients citing reporting capabilities',
          'Expanded service offerings with data insights'
        ]
      }
    },
    
    metrics: {
      roi: '720%',
      roiDetails: 'From increased billable hours and new clients',
      reportingSpeed: '3x faster',
      revenueIncrease: '$940,000',
      timeSaved: '120 hours/month',
      clientRetention: '95%',
      beforeAfter: {
        reportCreationTime: { before: '15-20 hours', after: '30 minutes' },
        billableUtilization: { before: '68%', after: '83%' },
        clientSatisfaction: { before: '7.2/10', after: '9.1/10' },
        projectMargins: { before: '32%', after: '41%' }
      }
    },
    
    testimonial: {
      quote: "DataSense gave us back 30% of our time while delighting clients with real-time insights. It's not just a tool - it's our competitive edge.",
      author: 'Jennifer Park',
      title: 'Managing Partner',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
      linkedin: 'https://linkedin.com/in/jenniferpark',
      videoUrl: 'https://www.youtube.com/embed/demovideourl3'
    },
    
    dashboardScreenshots: [
      {
        title: 'Client Portal',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
        description: 'Self-service dashboards for every client'
      },
      {
        title: 'Project Profitability',
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
        description: 'Real-time margin tracking by project and client'
      }
    ],
    
    relatedStudies: ['saas-churn-reduction', 'healthcare-no-shows'],
    tags: ['consulting', 'professional-services', 'reporting', 'automation', 'client-satisfaction']
  },
  
  {
    id: 'restaurant-menu-optimization',
    slug: 'harvest-table-31-percent-profit-increase',
    industry: 'Restaurant Chain',
    companyName: 'Harvest Table Restaurants',
    logo: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200',
    heroImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200',
    featured: true,
    
    profile: {
      size: '8 locations, 150+ employees',
      revenue: '$12M annual',
      platform: 'Fast-casual dining',
      location: 'Pacific Northwest',
      yearFounded: 2016,
      techStack: ['Square POS', 'Toast', 'OpenTable', 'Uber Eats', 'DoorDash']
    },
    
    challenge: {
      summary: 'Menu pricing and mix leaving money on the table with rising food costs',
      details: [
        'Food costs up 18% but afraid to raise prices',
        'No data on dish profitability',
        '35% of menu items underperforming',
        'Seasonal menu changes based on intuition'
      ]
    },
    
    implementation: {
      week1: {
        title: 'Menu Analysis Deep Dive',
        achievements: [
          'Analyzed 18 months of transaction data',
          'Identified profit margin by dish',
          'Discovered hidden loss leaders'
        ]
      },
      month1: {
        title: 'Strategic Menu Engineering',
        achievements: [
          'Removed 8 unprofitable items',
          'Optimized pricing on top 20 sellers',
          'Introduced 3 high-margin specials'
        ]
      },
      month3: {
        title: 'Full Menu Transformation',
        achievements: [
          'Profit margins increased 31%',
          'Customer satisfaction maintained at 4.7★',
          'Reduced food waste by 22%'
        ]
      },
      today: {
        title: 'Data-Driven Operations',
        achievements: [
          'Dynamic pricing based on demand',
          'Predictive ordering reduces waste',
          'Location-specific menu optimization'
        ]
      }
    },
    
    metrics: {
      roi: '920%',
      roiDetails: 'From increased margins and reduced waste',
      profitIncrease: '31%',
      additionalProfit: '$3.7M',
      wasteReduction: '22%',
      costSavings: '$420,000/year',
      beforeAfter: {
        averageCheckSize: { before: '$28', after: '$34' },
        foodCostPercentage: { before: '38%', after: '29%' },
        tablesTurnover: { before: '2.3/night', after: '2.8/night' },
        customerRating: { before: '4.5★', after: '4.7★' }
      }
    },
    
    testimonial: {
      quote: "We were flying blind before DataSense. Now we know exactly which dishes drive profit and which times need promotion. Our margins improved 31% without losing a single customer.",
      author: 'Michael Torres',
      title: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200',
      linkedin: 'https://linkedin.com/in/michaeltorres',
      videoUrl: 'https://www.youtube.com/embed/demovideourl4'
    },
    
    dashboardScreenshots: [
      {
        title: 'Menu Performance Matrix',
        image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800',
        description: 'Profitability vs. popularity for every dish'
      },
      {
        title: 'Real-Time Operations',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
        description: 'Live dashboard for each location'
      }
    ],
    
    relatedStudies: ['shopify-boutique', 'healthcare-no-shows'],
    tags: ['restaurant', 'hospitality', 'menu-engineering', 'pricing-optimization', 'food-cost']
  },
  
  {
    id: 'healthcare-no-shows',
    slug: 'wellness-medical-group-52-percent-no-show-reduction',
    industry: 'Healthcare Practice',
    companyName: 'Wellness Medical Group',
    logo: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=200',
    heroImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200',
    featured: true,
    
    profile: {
      size: '3 clinics, 42 staff',
      revenue: '$6.8M annual',
      platform: 'Multi-specialty practice',
      location: 'Denver, CO',
      yearFounded: 2012,
      techStack: ['Epic EMR', 'Zocdoc', 'SimplePractice', 'Google Calendar', 'Twilio']
    },
    
    challenge: {
      summary: 'No-show rates at 18% causing $1.2M in annual lost revenue',
      details: [
        'No predictive system for high-risk appointments',
        'Generic reminder system ineffective',
        'Overbooking causing patient dissatisfaction',
        'No data on no-show patterns'
      ]
    },
    
    implementation: {
      week1: {
        title: 'Pattern Recognition',
        achievements: [
          'Analyzed 2 years of appointment data',
          'Identified 12 no-show risk factors',
          'Built predictive scoring model'
        ]
      },
      month1: {
        title: 'Smart Interventions',
        achievements: [
          'Personalized reminder campaigns',
          'High-risk patient outreach program',
          'Optimized appointment scheduling'
        ]
      },
      month3: {
        title: 'Dramatic Improvement',
        achievements: [
          'No-shows reduced from 18% to 8.6%',
          'Revenue recovered: $624K',
          'Patient satisfaction up 28%'
        ]
      },
      today: {
        title: 'Optimized Operations',
        achievements: [
          'Maintaining <9% no-show rate',
          'Smart overbooking algorithm',
          'Automated patient engagement'
        ]
      }
    },
    
    metrics: {
      roi: '1,450%',
      roiDetails: 'From recovered appointment revenue',
      noShowReduction: '52%',
      revenueRecovered: '$624,000/year',
      patientSatisfaction: '+28%',
      staffEfficiency: '+35%',
      beforeAfter: {
        noShowRate: { before: '18%', after: '8.6%' },
        dailyRevenue: { before: '$18,400', after: '$21,100' },
        patientWaitTime: { before: '34 min', after: '18 min' },
        providerUtilization: { before: '72%', after: '89%' }
      }
    },
    
    testimonial: {
      quote: "DataSense helped us understand our patients better than ever. Reducing no-shows by 52% didn't just improve revenue - it helped more patients get the care they need.",
      author: 'Dr. Amanda Foster',
      title: 'Medical Director',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200',
      linkedin: 'https://linkedin.com/in/dramandafoster',
      videoUrl: 'https://www.youtube.com/embed/demovideourl5'
    },
    
    dashboardScreenshots: [
      {
        title: 'Appointment Analytics',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
        description: 'No-show risk scoring for every appointment'
      },
      {
        title: 'Provider Dashboards',
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
        description: 'Real-time utilization and efficiency metrics'
      }
    ],
    
    relatedStudies: ['professional-services-reporting', 'restaurant-menu-optimization'],
    tags: ['healthcare', 'medical-practice', 'appointment-optimization', 'patient-engagement', 'revenue-recovery']
  }
];

const industries = [...new Set(caseStudies.map(cs => cs.industry))];
const companySizes = ['1-10 employees', '11-50 employees', '51-200 employees', '200+ employees'];
const roiRanges = ['100-500%', '500-1000%', '1000%+'];

export { caseStudies, industries, companySizes, roiRanges };