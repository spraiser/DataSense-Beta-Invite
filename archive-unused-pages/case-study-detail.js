import { caseStudies } from './case-studies-data.js';

class CaseStudyDetail {
    constructor() {
        this.currentStudy = null;
        this.init();
    }
    
    init() {
        const studyId = this.getStudyIdFromUrl();
        if (studyId) {
            this.currentStudy = caseStudies.find(s => s.id === studyId);
            if (this.currentStudy) {
                this.renderStudy();
                this.setupEventListeners();
            } else {
                this.showNotFound();
            }
        } else {
            window.location.href = 'case-studies-hub.html';
        }
    }
    
    getStudyIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }
    
    renderStudy() {
        document.title = `${this.currentStudy.companyName} Case Study - DataSense`;
        
        this.renderHero();
        this.renderChallenge();
        this.renderTimeline();
        this.renderResults();
        this.renderScreenshots();
        this.renderVideo();
        this.renderTestimonial();
        this.renderRelatedStudies();
        this.updateCTA();
    }
    
    renderHero() {
        const heroContent = document.getElementById('hero-content');
        if (!heroContent) return;
        
        heroContent.innerHTML = `
            <div class="hero-left">
                <img src="${this.currentStudy.logo}" alt="${this.currentStudy.companyName}" class="company-logo-large">
                <h2 class="company-name">${this.currentStudy.companyName}</h2>
                <div class="company-details">
                    ${this.currentStudy.profile.size} • ${this.currentStudy.profile.location}<br>
                    ${this.currentStudy.industry}
                </div>
                <div class="hero-metrics">
                    <div class="hero-metric">
                        <div class="hero-metric-value">${this.currentStudy.metrics.roi}</div>
                        <div class="hero-metric-label">ROI Achieved</div>
                    </div>
                    <div class="hero-metric">
                        <div class="hero-metric-value">30 days</div>
                        <div class="hero-metric-label">To First Results</div>
                    </div>
                </div>
            </div>
            
            <div class="hero-right">
                <h1>${this.getMainMetric()} ${this.getMainMetricLabel()}</h1>
                <p class="hero-summary">${this.currentStudy.challenge.summary}</p>
                <div class="hero-tags">
                    ${this.currentStudy.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
    }
    
    getMainMetric() {
        return this.currentStudy.metrics.revenueIncrease || 
               this.currentStudy.metrics.churnReduction || 
               this.currentStudy.metrics.profitIncrease || 
               this.currentStudy.metrics.reportingSpeed || 
               this.currentStudy.metrics.noShowReduction;
    }
    
    getMainMetricLabel() {
        if (this.currentStudy.metrics.revenueIncrease) return 'Revenue Increase';
        if (this.currentStudy.metrics.churnReduction) return 'Churn Reduction';
        if (this.currentStudy.metrics.profitIncrease) return 'Profit Increase';
        if (this.currentStudy.metrics.reportingSpeed) return 'Faster Reporting';
        if (this.currentStudy.metrics.noShowReduction) return 'No-Show Reduction';
        return 'Improvement';
    }
    
    renderChallenge() {
        const challengeContent = document.getElementById('challenge-content');
        if (!challengeContent) return;
        
        challengeContent.innerHTML = `
            <p class="challenge-summary">${this.currentStudy.challenge.summary}</p>
            <div class="challenge-details">
                ${this.currentStudy.challenge.details.map(detail => `
                    <div class="challenge-item">
                        <h4>Challenge</h4>
                        <p>${detail}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    renderTimeline() {
        const timelineContent = document.getElementById('timeline-content');
        if (!timelineContent) return;
        
        const timeline = [
            { period: 'Week 1', ...this.currentStudy.implementation.week1 },
            { period: 'Month 1', ...this.currentStudy.implementation.month1 },
            { period: 'Month 3', ...this.currentStudy.implementation.month3 },
            { period: 'Today', ...this.currentStudy.implementation.today }
        ];
        
        timelineContent.innerHTML = timeline.map((item, index) => `
            <div class="timeline-item">
                ${index % 2 === 0 ? `
                    <div class="timeline-left">
                        <div class="timeline-period">${item.period}</div>
                        <h3 class="timeline-title">${item.title}</h3>
                    </div>
                    <div class="timeline-right">
                        <div class="timeline-achievements">
                            ${item.achievements.map(achievement => `
                                <div class="achievement-item">
                                    <span class="achievement-icon">✓</span>
                                    <span>${achievement}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : `
                    <div class="timeline-left">
                        <div class="timeline-achievements">
                            ${item.achievements.map(achievement => `
                                <div class="achievement-item">
                                    <span class="achievement-icon">✓</span>
                                    <span>${achievement}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="timeline-right">
                        <div class="timeline-period">${item.period}</div>
                        <h3 class="timeline-title">${item.title}</h3>
                    </div>
                `}
            </div>
        `).join('');
    }
    
    renderResults() {
        const resultsContent = document.getElementById('results-content');
        const beforeAfter = document.getElementById('before-after');
        if (!resultsContent || !beforeAfter) return;
        
        const metrics = this.currentStudy.metrics;
        
        resultsContent.innerHTML = `
            <div class="result-card">
                <div class="result-value">${metrics.roi}</div>
                <div class="result-label">Return on Investment</div>
                <div class="result-detail">${metrics.roiDetails}</div>
            </div>
            
            ${metrics.revenueAmount ? `
                <div class="result-card">
                    <div class="result-value">${metrics.revenueAmount}</div>
                    <div class="result-label">Additional Revenue</div>
                    <div class="result-detail">Generated in first year</div>
                </div>
            ` : ''}
            
            ${metrics.revenueRetained ? `
                <div class="result-card">
                    <div class="result-value">${metrics.revenueRetained}</div>
                    <div class="result-label">Revenue Retained</div>
                    <div class="result-detail">From reduced churn</div>
                </div>
            ` : ''}
            
            ${metrics.additionalProfit ? `
                <div class="result-card">
                    <div class="result-value">${metrics.additionalProfit}</div>
                    <div class="result-label">Additional Profit</div>
                    <div class="result-detail">From optimization</div>
                </div>
            ` : ''}
            
            <div class="result-card">
                <div class="result-value">${metrics.timeSaved}</div>
                <div class="result-label">Time Saved</div>
                <div class="result-detail">Through automation</div>
            </div>
            
            ${metrics.costSaved ? `
                <div class="result-card">
                    <div class="result-value">${metrics.costSaved}</div>
                    <div class="result-label">Cost Savings</div>
                    <div class="result-detail">Annual reduction</div>
                </div>
            ` : ''}
        `;
        
        if (metrics.beforeAfter) {
            beforeAfter.innerHTML = `
                <h3 class="comparison-title">Before vs After DataSense</h3>
                <div class="comparison-grid">
                    ${Object.entries(metrics.beforeAfter).map(([key, values]) => `
                        <div class="comparison-item">
                            <div class="comparison-metric">${this.formatMetricName(key)}</div>
                            <div class="comparison-values">
                                <div class="before-value">
                                    <div>Before</div>
                                    <div>${values.before}</div>
                                </div>
                                <div class="comparison-arrow">→</div>
                                <div class="after-value">
                                    <div>After</div>
                                    <div>${values.after}</div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }
    
    formatMetricName(key) {
        const names = {
            adSpend: 'Ad Spend',
            conversionRate: 'Conversion Rate',
            averageOrderValue: 'Average Order Value',
            customerLifetimeValue: 'Customer Lifetime Value',
            monthlyChurn: 'Monthly Churn',
            netRevenueRetention: 'Net Revenue Retention',
            averageCustomerLifetime: 'Avg Customer Lifetime',
            supportTicketResolution: 'Ticket Resolution Time',
            reportCreationTime: 'Report Creation Time',
            billableUtilization: 'Billable Utilization',
            clientSatisfaction: 'Client Satisfaction',
            projectMargins: 'Project Margins',
            averageCheckSize: 'Average Check Size',
            foodCostPercentage: 'Food Cost %',
            tablesTurnover: 'Tables Turnover',
            customerRating: 'Customer Rating',
            noShowRate: 'No-Show Rate',
            dailyRevenue: 'Daily Revenue',
            patientWaitTime: 'Patient Wait Time',
            providerUtilization: 'Provider Utilization'
        };
        return names[key] || key;
    }
    
    renderScreenshots() {
        const screenshotsGrid = document.getElementById('screenshots-grid');
        if (!screenshotsGrid || !this.currentStudy.dashboardScreenshots) return;
        
        screenshotsGrid.innerHTML = this.currentStudy.dashboardScreenshots.map(screenshot => `
            <div class="screenshot-card">
                <img src="${screenshot.image}" alt="${screenshot.title}" class="screenshot-image">
                <div class="screenshot-info">
                    <h3 class="screenshot-title">${screenshot.title}</h3>
                    <p class="screenshot-description">${screenshot.description}</p>
                </div>
            </div>
        `).join('');
    }
    
    renderVideo() {
        const videoContainer = document.getElementById('video-container');
        if (!videoContainer || !this.currentStudy.testimonial.videoUrl) return;
        
        videoContainer.innerHTML = `
            <iframe 
                src="${this.currentStudy.testimonial.videoUrl}" 
                title="Customer Testimonial Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
            </iframe>
        `;
    }
    
    renderTestimonial() {
        const testimonialContent = document.getElementById('testimonial-content');
        if (!testimonialContent) return;
        
        const testimonial = this.currentStudy.testimonial;
        
        testimonialContent.innerHTML = `
            <p class="testimonial-quote">${testimonial.quote}</p>
            <div class="testimonial-author">
                <img src="${testimonial.image}" alt="${testimonial.author}" class="author-image">
                <div class="author-info">
                    <div class="author-name">${testimonial.author}</div>
                    <div class="author-title">${testimonial.title}</div>
                    <a href="${testimonial.linkedin}" target="_blank" class="author-linkedin">
                        Connect on LinkedIn →
                    </a>
                </div>
            </div>
        `;
    }
    
    renderRelatedStudies() {
        const relatedGrid = document.getElementById('related-studies');
        if (!relatedGrid || !this.currentStudy.relatedStudies) return;
        
        const relatedStudies = this.currentStudy.relatedStudies
            .map(id => caseStudies.find(s => s.id === id))
            .filter(s => s);
        
        relatedGrid.innerHTML = relatedStudies.map(study => `
            <div class="related-card" data-id="${study.id}">
                <div class="related-header">
                    <img src="${study.logo}" alt="${study.companyName}" class="related-logo">
                    <div>
                        <div class="related-company">${study.companyName}</div>
                        <div class="related-industry">${study.industry}</div>
                    </div>
                </div>
                <div class="related-metrics">
                    <div class="related-metric">
                        <div class="related-metric-value">${study.metrics.roi}</div>
                        <div class="related-metric-label">ROI</div>
                    </div>
                    <div class="related-metric">
                        <div class="related-metric-value">${this.getMainMetricForStudy(study)}</div>
                        <div class="related-metric-label">Key Result</div>
                    </div>
                </div>
            </div>
        `).join('');
        
        relatedGrid.querySelectorAll('.related-card').forEach(card => {
            card.addEventListener('click', () => {
                const studyId = card.dataset.id;
                window.location.href = `case-study-detail.html?id=${studyId}`;
            });
        });
    }
    
    getMainMetricForStudy(study) {
        return study.metrics.revenueIncrease || 
               study.metrics.churnReduction || 
               study.metrics.profitIncrease || 
               study.metrics.reportingSpeed || 
               study.metrics.noShowReduction || 
               'See Results';
    }
    
    updateCTA() {
        const ctaMessage = document.getElementById('cta-message');
        if (ctaMessage) {
            ctaMessage.textContent = `See ${this.getMainMetric()} ${this.getMainMetricLabel().toLowerCase()} like ${this.currentStudy.companyName}`;
        }
    }
    
    setupEventListeners() {
        const downloadBtn = document.getElementById('download-pdf');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadPDF());
        }
        
        const scheduleBtn = document.getElementById('schedule-call');
        if (scheduleBtn) {
            scheduleBtn.addEventListener('click', () => this.scheduleCall());
        }
    }
    
    downloadPDF() {
        alert(`PDF download for ${this.currentStudy.companyName} case study will be available soon!`);
    }
    
    scheduleCall() {
        alert(`Schedule a call with ${this.currentStudy.testimonial.author} from ${this.currentStudy.companyName}. Feature coming soon!`);
    }
    
    showNotFound() {
        document.body.innerHTML = `
            <div style="text-align: center; padding: 100px 20px;">
                <h1>Case Study Not Found</h1>
                <p>The case study you're looking for doesn't exist.</p>
                <a href="case-studies-hub.html" style="color: #667eea;">← Back to Case Studies</a>
            </div>
        `;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CaseStudyDetail();
});