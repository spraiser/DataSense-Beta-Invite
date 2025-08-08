import { caseStudies, industries, companySizes, roiRanges } from './case-studies-data.js';

class CaseStudiesHub {
    constructor() {
        this.currentFilter = 'all';
        this.sizeFilter = '';
        this.roiFilter = '';
        this.filteredStudies = [...caseStudies];
        this.referralSource = null;
        
        this.init();
    }
    
    init() {
        this.checkReferralSource();
        this.renderStudies();
        this.renderComparisonTable();
        this.setupEventListeners();
        this.setupMatcher();
    }
    
    checkReferralSource() {
        const urlParams = new URLSearchParams(window.location.search);
        const ref = urlParams.get('ref');
        const source = urlParams.get('source');
        
        if (ref || source) {
            this.referralSource = ref || source;
            this.showReferralBanner();
        }
    }
    
    showReferralBanner() {
        const banner = document.getElementById('referral-banner');
        const message = document.getElementById('referral-message');
        
        if (banner && message) {
            const referralMessages = [
                `Your colleague achieved 580% ROI with DataSense`,
                `Companies referred by ${this.referralSource} see average 40% revenue increase`,
                `${this.referralSource} recommended you see these success stories`,
                `Join 500+ businesses transforming with DataSense`
            ];
            
            message.textContent = referralMessages[Math.floor(Math.random() * referralMessages.length)];
            banner.style.display = 'block';
        }
    }
    
    renderStudies() {
        const grid = document.getElementById('studies-grid');
        if (!grid) return;
        
        grid.innerHTML = this.filteredStudies.map(study => this.createStudyCard(study)).join('');
        
        const count = document.getElementById('results-count');
        if (count) {
            count.textContent = this.filteredStudies.length;
        }
    }
    
    createStudyCard(study) {
        const featuredClass = study.featured ? 'featured' : '';
        const truncatedQuote = study.testimonial.quote.length > 120 
            ? study.testimonial.quote.substring(0, 120) + '...' 
            : study.testimonial.quote;
        
        return `
            <div class="case-study-card ${featuredClass}" data-id="${study.id}">
                <div class="card-image" style="background-image: url('${study.heroImage}')">
                    <span class="card-badge">${study.industry}</span>
                </div>
                
                <div class="card-content">
                    <div class="card-header">
                        <img src="${study.logo}" alt="${study.companyName}" class="company-logo">
                        <div class="company-info">
                            <h3>${study.companyName}</h3>
                            <div class="company-industry">${study.profile.size} • ${study.profile.location}</div>
                        </div>
                    </div>
                    
                    <div class="card-metrics">
                        <div class="metric-item">
                            <div class="value">${study.metrics.roi}</div>
                            <div class="label">ROI</div>
                        </div>
                        <div class="metric-item">
                            <div class="value">${study.metrics.revenueIncrease || study.metrics.churnReduction || study.metrics.profitIncrease}</div>
                            <div class="label">Key Metric</div>
                        </div>
                        <div class="metric-item">
                            <div class="value">${study.metrics.timeSaved}</div>
                            <div class="label">Time Saved</div>
                        </div>
                    </div>
                    
                    <p class="card-quote">"${truncatedQuote}"</p>
                    
                    <div class="card-actions">
                        <a href="case-study-detail.html?id=${study.id}" class="card-link card-link-primary">
                            Read Full Story
                        </a>
                        <a href="${study.testimonial.linkedin}" target="_blank" class="card-link card-link-secondary">
                            Connect on LinkedIn
                        </a>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderComparisonTable() {
        const tbody = document.getElementById('comparison-tbody');
        if (!tbody) return;
        
        const tableRows = caseStudies.slice(0, 5).map(study => `
            <tr>
                <td>
                    <div class="company-cell">
                        <img src="${study.logo}" alt="${study.companyName}">
                        <span>${study.companyName}</span>
                    </div>
                </td>
                <td>${study.industry}</td>
                <td>${study.profile.size}</td>
                <td>30 days</td>
                <td>
                    <span class="roi-badge">${study.metrics.roi}</span>
                </td>
                <td>${study.metrics.revenueIncrease || study.metrics.churnReduction || study.metrics.profitIncrease}</td>
                <td>
                    <button class="view-study-btn" data-id="${study.id}">
                        View Study
                    </button>
                </td>
            </tr>
        `).join('');
        
        tbody.innerHTML = tableRows;
        
        tbody.querySelectorAll('.view-study-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const studyId = e.target.dataset.id;
                window.location.href = `case-study-detail.html?id=${studyId}`;
            });
        });
    }
    
    setupEventListeners() {
        // Industry filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                this.currentFilter = e.target.dataset.filter;
                this.applyFilters();
            });
        });
        
        // Size filter dropdown
        const sizeFilter = document.getElementById('size-filter');
        if (sizeFilter) {
            sizeFilter.addEventListener('change', (e) => {
                this.sizeFilter = e.target.value;
                this.applyFilters();
            });
        }
        
        // ROI filter dropdown
        const roiFilter = document.getElementById('roi-filter');
        if (roiFilter) {
            roiFilter.addEventListener('change', (e) => {
                this.roiFilter = e.target.value;
                this.applyFilters();
            });
        }
        
        // Schedule similar customer button
        const schedulebtn = document.getElementById('schedule-similar-customer');
        if (schedulebtn) {
            schedulebtn.addEventListener('click', () => {
                this.openSchedulingModal();
            });
        }
        
        // Case study cards click
        document.addEventListener('click', (e) => {
            const card = e.target.closest('.case-study-card');
            if (card && !e.target.closest('.card-actions')) {
                const studyId = card.dataset.id;
                window.location.href = `case-study-detail.html?id=${studyId}`;
            }
        });
    }
    
    applyFilters() {
        this.filteredStudies = caseStudies.filter(study => {
            let passesFilter = true;
            
            // Industry filter
            if (this.currentFilter !== 'all') {
                passesFilter = passesFilter && study.industry === this.currentFilter;
            }
            
            // Size filter
            if (this.sizeFilter) {
                const employeeCount = parseInt(study.profile.size);
                switch(this.sizeFilter) {
                    case 'small':
                        passesFilter = passesFilter && employeeCount <= 50;
                        break;
                    case 'medium':
                        passesFilter = passesFilter && employeeCount > 50 && employeeCount <= 200;
                        break;
                    case 'large':
                        passesFilter = passesFilter && employeeCount > 200;
                        break;
                }
            }
            
            // ROI filter
            if (this.roiFilter) {
                const roiValue = parseInt(study.metrics.roi);
                switch(this.roiFilter) {
                    case '100-500':
                        passesFilter = passesFilter && roiValue >= 100 && roiValue < 500;
                        break;
                    case '500-1000':
                        passesFilter = passesFilter && roiValue >= 500 && roiValue < 1000;
                        break;
                    case '1000+':
                        passesFilter = passesFilter && roiValue >= 1000;
                        break;
                }
            }
            
            return passesFilter;
        });
        
        this.renderStudies();
    }
    
    setupMatcher() {
        const matcherSubmit = document.getElementById('matcher-submit');
        if (!matcherSubmit) return;
        
        matcherSubmit.addEventListener('click', () => {
            const industry = document.getElementById('matcher-industry').value;
            const size = document.getElementById('matcher-size').value;
            const goal = document.getElementById('matcher-goal').value;
            
            if (!industry || !size || !goal) {
                alert('Please answer all questions to see matching case studies');
                return;
            }
            
            this.showMatchingStudies(industry, size, goal);
        });
    }
    
    showMatchingStudies(industry, size, goal) {
        const matchingStudies = caseStudies.filter(study => {
            let score = 0;
            
            if (study.industry === industry) score += 3;
            
            const employeeCount = parseInt(study.profile.size);
            if (size === '1-10' && employeeCount <= 10) score += 2;
            else if (size === '11-50' && employeeCount > 10 && employeeCount <= 50) score += 2;
            else if (size === '51-200' && employeeCount > 50 && employeeCount <= 200) score += 2;
            else if (size === '200+' && employeeCount > 200) score += 2;
            
            if (goal === 'revenue' && (study.metrics.revenueIncrease || study.metrics.profitIncrease)) score += 2;
            else if (goal === 'costs' && study.metrics.costSaved) score += 2;
            else if (goal === 'efficiency' && study.metrics.timeSaved) score += 2;
            else if (goal === 'retention' && study.metrics.churnReduction) score += 2;
            
            return score > 3;
        }).slice(0, 3);
        
        const resultsDiv = document.getElementById('matcher-results');
        const recommendationsDiv = document.getElementById('matcher-recommendations');
        
        if (resultsDiv && recommendationsDiv) {
            recommendationsDiv.innerHTML = matchingStudies.map(study => `
                <div class="matcher-recommendation">
                    <h4>${study.companyName}</h4>
                    <p>${study.industry} • ${study.profile.size}</p>
                    <p><strong>${study.metrics.roi} ROI</strong> - ${study.challenge.summary}</p>
                    <a href="case-study-detail.html?id=${study.id}" class="btn btn-primary">
                        View Their Story
                    </a>
                </div>
            `).join('');
            
            resultsDiv.style.display = 'block';
            resultsDiv.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    openSchedulingModal() {
        alert('Scheduling feature will connect you with a customer in your industry. Coming soon!');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CaseStudiesHub();
});