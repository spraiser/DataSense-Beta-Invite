// Integration data
const integrations = {
    salesforce: {
        name: 'Salesforce',
        category: 'crm',
        description: 'Enterprise CRM Integration',
        setupTime: '5 minutes',
        syncFrequency: 'Real-time',
        features: [
            'Bi-directional data sync',
            'Custom field mapping',
            'Webhook support',
            'Bulk data operations',
            'Historical data import',
            'Real-time updates'
        ],
        useCases: [
            'Sync customer data across platforms',
            'Automate lead scoring and routing',
            'Generate sales analytics reports',
            'Track customer journey end-to-end'
        ]
    },
    hubspot: {
        name: 'HubSpot',
        category: 'crm',
        description: 'Complete CRM & Marketing Hub sync',
        setupTime: '3 minutes',
        syncFrequency: 'Real-time',
        features: [
            'Contact and company sync',
            'Deal pipeline integration',
            'Marketing campaign data',
            'Email tracking',
            'Custom properties',
            'Activity timeline sync'
        ],
        useCases: [
            'Unified customer view',
            'Marketing attribution analysis',
            'Sales funnel optimization',
            'Customer lifecycle tracking'
        ]
    },
    stripe: {
        name: 'Stripe',
        category: 'payment',
        description: 'Full payment & subscription data',
        setupTime: '2 minutes',
        syncFrequency: 'Real-time via webhooks',
        features: [
            'Payment processing data',
            'Subscription management',
            'Customer billing history',
            'Refund tracking',
            'Revenue analytics',
            'Fraud detection metrics'
        ],
        useCases: [
            'Revenue reporting',
            'Churn analysis',
            'Payment failure tracking',
            'Customer lifetime value calculation'
        ]
    },
    shopify: {
        name: 'Shopify',
        category: 'ecommerce',
        description: 'Complete e-commerce data sync',
        setupTime: '3 minutes',
        syncFrequency: 'Real-time',
        features: [
            'Order management',
            'Product catalog sync',
            'Customer data',
            'Inventory tracking',
            'Abandoned cart recovery',
            'Sales analytics'
        ],
        useCases: [
            'Inventory optimization',
            'Sales trend analysis',
            'Customer segmentation',
            'Product performance tracking'
        ]
    },
    mailchimp: {
        name: 'Mailchimp',
        category: 'marketing',
        description: 'Email marketing and automation',
        setupTime: '5 minutes',
        syncFrequency: 'Hourly',
        features: [
            'Campaign performance',
            'Audience segmentation',
            'Email engagement metrics',
            'A/B test results',
            'Automation workflows',
            'Revenue attribution'
        ],
        useCases: [
            'Email campaign optimization',
            'Subscriber behavior analysis',
            'Marketing ROI calculation',
            'Audience growth tracking'
        ]
    }
};

// All available tools for compatibility checker
const allTools = [
    // CRM
    'salesforce', 'hubspot', 'pipedrive', 'zoho', 'freshsales', 'copper', 'insightly', 'monday', 'clickup',
    // Payment
    'stripe', 'square', 'paypal', 'braintree', 'authorize.net', 'razorpay', 'mollie', 'adyen',
    // Marketing
    'mailchimp', 'klaviyo', 'sendgrid', 'activecampaign', 'convertkit', 'drip', 'constant-contact',
    // E-commerce
    'shopify', 'woocommerce', 'bigcommerce', 'magento', 'amazon', 'etsy', 'ebay', 'walmart',
    // Analytics
    'google-analytics', 'mixpanel', 'amplitude', 'segment', 'heap', 'hotjar', 'fullstory',
    // Accounting
    'quickbooks', 'xero', 'freshbooks', 'wave', 'sage', 'zoho-books',
    // Support
    'zendesk', 'intercom', 'freshdesk', 'helpscout', 'drift', 'crisp',
    // Productivity
    'slack', 'teams', 'asana', 'trello', 'notion', 'airtable', 'google-workspace', 'office365'
];

// Tab switching functionality
document.querySelectorAll('.method-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const tab = this.dataset.tab;
        
        // Update button states
        document.querySelectorAll('.method-tabs .tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // Update content visibility
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tab).classList.add('active');
    });
});

// Detail modal tabs
document.querySelectorAll('.detail-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const tab = this.dataset.tab;
        
        // Update button states
        document.querySelectorAll('.detail-tabs .tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // Update content visibility
        document.querySelectorAll('.integration-detail .tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tab).classList.add('active');
    });
});

// Tool selection for compatibility checker
let selectedTools = new Set();

document.querySelectorAll('.checkbox-item input').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            selectedTools.add(this.value);
        } else {
            selectedTools.delete(this.value);
        }
    });
});

// Manual entry autocomplete
const toolSearchInput = document.getElementById('tool-search');
const suggestionsDiv = document.getElementById('suggestions');
const selectedToolsDiv = document.getElementById('selected-tools');

if (toolSearchInput) {
    toolSearchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        if (query.length < 2) {
            suggestionsDiv.style.display = 'none';
            return;
        }
        
        const matches = allTools.filter(tool => 
            tool.toLowerCase().includes(query) && !selectedTools.has(tool)
        );
        
        if (matches.length > 0) {
            suggestionsDiv.innerHTML = matches.slice(0, 5).map(tool => 
                `<div class="suggestion-item" onclick="addTool('${tool}')">${formatToolName(tool)}</div>`
            ).join('');
            suggestionsDiv.style.display = 'block';
        } else {
            suggestionsDiv.style.display = 'none';
        }
    });
}

function formatToolName(tool) {
    return tool.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function addTool(tool) {
    selectedTools.add(tool);
    updateSelectedToolsDisplay();
    toolSearchInput.value = '';
    suggestionsDiv.style.display = 'none';
}

function updateSelectedToolsDisplay() {
    selectedToolsDiv.innerHTML = Array.from(selectedTools).map(tool => 
        `<div class="selected-tool">
            ${formatToolName(tool)}
            <button onclick="removeTool('${tool}')">&times;</button>
        </div>`
    ).join('');
}

function removeTool(tool) {
    selectedTools.delete(tool);
    updateSelectedToolsDisplay();
}

// Check compatibility function
function checkCompatibility() {
    // Simulate compatibility check
    const report = document.getElementById('compatibility-report');
    if (report) {
        report.style.display = 'block';
        report.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Animate the report appearance
        setTimeout(() => {
            animateNumbers();
        }, 500);
    }
}

// Animate numbers in compatibility report
function animateNumbers() {
    const numbers = document.querySelectorAll('.stat-number');
    numbers.forEach(num => {
        const target = parseInt(num.textContent);
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            num.textContent = Math.round(current) + '%';
        }, 20);
    });
}

// Download report
function downloadReport() {
    // Create a sample report content
    const reportContent = {
        date: new Date().toISOString(),
        compatibility: 85,
        tools: Array.from(selectedTools),
        recommendations: [
            'Direct integration available for 8 tools',
            'API integration recommended for 3 tools',
            'Consider consolidating 2 redundant tools'
        ]
    };
    
    const blob = new Blob([JSON.stringify(reportContent, null, 2)], 
        { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'datasense-compatibility-report.json';
    a.click();
    URL.revokeObjectURL(url);
}

// Share report
function shareReport() {
    if (navigator.share) {
        navigator.share({
            title: 'DataSense Compatibility Report',
            text: 'Check out my tech stack compatibility with DataSense',
            url: window.location.href
        });
    } else {
        // Fallback - copy to clipboard
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        alert('Report link copied to clipboard!');
    }
}

// Integration map filtering
document.querySelectorAll('.map-filters .filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Update active state
        document.querySelectorAll('.map-filters .filter-btn').forEach(b => 
            b.classList.remove('active'));
        this.classList.add('active');
        
        // Filter cards
        const filter = this.dataset.filter;
        document.querySelectorAll('.integration-card').forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Show integration detail modal
function showIntegrationDetail(integrationId) {
    const modal = document.getElementById('integration-detail-modal');
    const integration = integrations[integrationId];
    
    if (integration) {
        // Update modal content
        document.getElementById('detail-name').textContent = integration.name;
        document.getElementById('detail-description').textContent = integration.description;
        document.getElementById('detail-logo').alt = integration.name;
        
        // Show modal
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Close modal
function closeModal() {
    const modal = document.getElementById('integration-detail-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal on outside click
document.getElementById('integration-detail-modal')?.addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Vote for integration
function voteForIntegration(integrationId) {
    const voteCount = event.target.parentElement.querySelector('.vote-count');
    if (voteCount) {
        const current = parseInt(voteCount.textContent);
        voteCount.textContent = current + 1;
        event.target.textContent = 'Voted ✓';
        event.target.disabled = true;
    }
}

// Load more integrations
function loadMoreIntegrations() {
    // Simulate loading more integrations
    const grid = document.getElementById('integration-grid');
    const moreIntegrations = [
        { name: 'QuickBooks', category: 'accounting', status: 'live' },
        { name: 'Xero', category: 'accounting', status: 'live' },
        { name: 'Google Analytics', category: 'analytics', status: 'live' },
        { name: 'Mixpanel', category: 'analytics', status: 'live' },
        { name: 'Zendesk', category: 'support', status: 'live' },
        { name: 'Intercom', category: 'support', status: 'live' }
    ];
    
    moreIntegrations.forEach(integration => {
        const card = createIntegrationCard(integration);
        grid.appendChild(card);
    });
    
    // Hide the button after loading
    event.target.textContent = 'All Integrations Loaded';
    event.target.disabled = true;
}

function createIntegrationCard(integration) {
    const card = document.createElement('div');
    card.className = 'integration-card';
    card.dataset.category = integration.category;
    card.innerHTML = `
        <div class="card-status ${integration.status}"></div>
        <div class="card-icon">
            <img src="https://via.placeholder.com/48" alt="${integration.name}">
        </div>
        <h4>${integration.name}</h4>
        <p>Seamless integration with ${integration.name}</p>
        <div class="card-stats">
            <span>⚡ Quick setup</span>
            <span>🔄 Real-time</span>
        </div>
        <button class="btn-explore" onclick="showIntegrationDetail('${integration.name.toLowerCase()}')">
            Explore →
        </button>
    `;
    return card;
}

// Calculate migration
function calculateMigration() {
    const dataSources = document.getElementById('data-sources').value;
    const dataVolume = document.getElementById('data-volume').value;
    const numUsers = document.getElementById('num-users').value;
    const historicalYears = document.getElementById('historical-years').value;
    
    // Calculate estimated timeline
    const baseTime = 3;
    const sourceMultiplier = Math.ceil(dataSources / 5);
    const volumeMultiplier = Math.ceil(dataVolume / 100);
    const totalDays = baseTime + sourceMultiplier + volumeMultiplier;
    
    // Update timeline
    const timelineHeader = document.querySelector('.timeline-header h4');
    if (timelineHeader) {
        timelineHeader.textContent = `Total Timeline: ${totalDays}-${totalDays + 2} Days`;
    }
    
    // Show results
    const results = document.getElementById('migration-results');
    if (results) {
        results.style.display = 'block';
        results.scrollIntoView({ behavior: 'smooth' });
    }
}

// API endpoint switching
document.querySelectorAll('.endpoint-item').forEach(item => {
    item.addEventListener('click', function() {
        // Update active state
        document.querySelectorAll('.endpoint-item').forEach(i => 
            i.classList.remove('active'));
        this.classList.add('active');
        
        // Show corresponding detail
        const endpoint = this.dataset.endpoint;
        document.querySelectorAll('.endpoint-detail').forEach(detail => {
            detail.classList.remove('active');
        });
        const targetDetail = document.getElementById(endpoint + '-endpoint');
        if (targetDetail) {
            targetDetail.classList.add('active');
        }
    });
});

// Integration request form
document.getElementById('integration-request-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const toolName = document.getElementById('tool-name').value;
    const category = document.getElementById('tool-category').value;
    const useCase = document.getElementById('use-case').value;
    
    // Simulate form submission
    alert(`Thank you! Your request for ${toolName} integration has been submitted. We'll review it and update you soon.`);
    
    // Reset form
    this.reset();
});

// Smooth scrolling for anchor links
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if we have a referrer parameter
    const urlParams = new URLSearchParams(window.location.search);
    const referrer = urlParams.get('ref');
    
    if (referrer) {
        // Show referral banner
        const referralSection = document.querySelector('.referral-section');
        if (referralSection) {
            referralSection.style.display = 'block';
        }
        
        // Highlight referrer's integrations
        highlightReferrerIntegrations(referrer);
    }
    
    // Initialize tooltips
    initializeTooltips();
    
    // Start real-time status updates
    startStatusUpdates();
});

function highlightReferrerIntegrations(referrer) {
    // Simulate highlighting integrations used by referrer
    const referrerIntegrations = ['salesforce', 'stripe', 'mailchimp'];
    
    referrerIntegrations.forEach(integration => {
        const card = document.querySelector(`[data-integration="${integration}"]`);
        if (card) {
            card.classList.add('referrer-highlighted');
            const badge = document.createElement('div');
            badge.className = 'referrer-badge';
            badge.textContent = 'Used by your referrer';
            card.appendChild(badge);
        }
    });
}

function initializeTooltips() {
    // Add tooltips to status indicators
    document.querySelectorAll('.card-status').forEach(status => {
        status.title = status.classList.contains('live') ? 
            'Integration is live and operational' : 
            'Coming soon';
    });
}

function startStatusUpdates() {
    // Simulate real-time status updates
    setInterval(() => {
        const metrics = document.querySelectorAll('.metric-value');
        metrics.forEach(metric => {
            // Add slight variations to show real-time updates
            const current = metric.textContent;
            if (current.includes('ms')) {
                const value = parseInt(current);
                const variation = Math.floor(Math.random() * 10) - 5;
                metric.textContent = (value + variation) + 'ms';
            }
        });
    }, 5000);
}

// CSV file upload handling
document.getElementById('csv-file')?.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            // Parse CSV and extract tools
            const csvData = event.target.result;
            const tools = parseCSV(csvData);
            
            // Add tools to selected list
            tools.forEach(tool => selectedTools.add(tool.toLowerCase()));
            
            // Show compatibility report
            checkCompatibility();
        };
        reader.readAsText(file);
    }
});

function parseCSV(csvData) {
    // Simple CSV parser - in production, use a proper CSV library
    const lines = csvData.split('\n');
    const tools = [];
    
    lines.forEach(line => {
        const cells = line.split(',');
        if (cells.length > 0) {
            const tool = cells[0].trim().toLowerCase();
            if (allTools.includes(tool)) {
                tools.push(tool);
            }
        }
    });
    
    return tools;
}

// Language tab switching for API documentation
document.querySelectorAll('.language-tabs .lang-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        // Update active state
        document.querySelectorAll('.language-tabs .lang-tab').forEach(t => 
            t.classList.remove('active'));
        this.classList.add('active');
        
        // Update code example based on selected language
        const language = this.textContent.toLowerCase();
        updateCodeExample(language);
    });
});

function updateCodeExample(language) {
    const codeBlock = document.querySelector('.code-section pre code');
    if (!codeBlock) return;
    
    const examples = {
        curl: `curl -X POST https://api.datasense.io/v1/auth \\
  -H "Content-Type: application/json" \\
  -d '{
    "client_id": "your_client_id",
    "client_secret": "your_client_secret"
  }'`,
        python: `import requests

response = requests.post(
    'https://api.datasense.io/v1/auth',
    json={
        'client_id': 'your_client_id',
        'client_secret': 'your_client_secret'
    }
)

token = response.json()['access_token']`,
        javascript: `const response = await fetch('https://api.datasense.io/v1/auth', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        client_id: 'your_client_id',
        client_secret: 'your_client_secret'
    })
});

const { access_token } = await response.json();`
    };
    
    codeBlock.textContent = examples[language] || examples.curl;
}

// API Explorer functionality
document.querySelector('.api-explorer .btn-primary')?.addEventListener('click', function() {
    const apiKey = document.querySelector('.api-key-input').value;
    const endpoint = document.querySelector('.endpoint-select').value;
    const requestBody = document.querySelector('.request-body').value;
    
    if (!apiKey) {
        alert('Please enter your API key');
        return;
    }
    
    // Simulate API request
    const responseDiv = document.querySelector('.explorer-response pre code');
    responseDiv.textContent = 'Sending request...';
    
    setTimeout(() => {
        // Simulate response
        const response = {
            status: 200,
            data: {
                message: 'Request successful',
                endpoint: endpoint,
                timestamp: new Date().toISOString()
            }
        };
        
        responseDiv.textContent = JSON.stringify(response, null, 2);
    }, 1000);
});

// Add CSS for referrer highlighting
const style = document.createElement('style');
style.textContent = `
    .integration-card.referrer-highlighted {
        border: 2px solid #f59e0b;
        position: relative;
    }
    
    .referrer-badge {
        position: absolute;
        top: -10px;
        left: 50%;
        transform: translateX(-50%);
        background: #f59e0b;
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 1rem;
        font-size: 0.75rem;
        font-weight: 600;
        white-space: nowrap;
    }
    
    .selected-tool {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: #667eea;
        color: white;
        border-radius: 2rem;
        margin: 0.25rem;
    }
    
    .selected-tool button {
        background: transparent;
        border: none;
        color: white;
        font-size: 1.25rem;
        cursor: pointer;
        padding: 0;
        margin-left: 0.5rem;
    }
    
    .suggestion-item {
        padding: 0.75rem;
        cursor: pointer;
        transition: background 0.2s;
    }
    
    .suggestion-item:hover {
        background: #f7fafc;
    }
`;
document.head.appendChild(style);