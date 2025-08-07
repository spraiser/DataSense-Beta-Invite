// Automated Website Analysis Tool for Marketing AI
const { chromium } = require('playwright');
const fs = require('fs');

const SITES_TO_ANALYZE = [
    { name: 'steep.app', url: 'https://steep.app', category: 'direct_competitor' },
    { name: 'notion.so', url: 'https://www.notion.so', category: 'design_leader' },
    { name: 'figma.com', url: 'https://www.figma.com', category: 'visual_product' },
    { name: 'stripe.com', url: 'https://www.stripe.com', category: 'trust_leader' },
    { name: 'intercom.com', url: 'https://www.intercom.com', category: 'conversion_leader' },
    { name: 'airtable.com', url: 'https://www.airtable.com', category: 'smb_friendly' },
    { name: 'monday.com', url: 'https://www.monday.com', category: 'team_collaboration' },
    { name: 'hubspot.com', url: 'https://www.hubspot.com', category: 'smb_marketing' }
];

class WebsiteAnalyzer {
    constructor() {
        this.browser = null;
        this.results = {};
    }

    async init() {
        this.browser = await chromium.launch({ headless: true });
        console.log('🚀 Website analyzer initialized');
    }

    async analyzeSite(site) {
        console.log(`📊 Analyzing ${site.name}...`);
        
        const context = await this.browser.newContext({
            ignoreHTTPSErrors: true,
            viewport: { width: 1920, height: 1080 }
        });
        
        const page = await context.newPage();
        
        try {
            await page.goto(site.url, { waitUntil: 'networkidle', timeout: 30000 });
            
            const analysis = {
                site: site.name,
                url: site.url,
                category: site.category,
                timestamp: new Date().toISOString(),
                ...await this.extractSiteData(page)
            };
            
            // Take screenshot
            await page.screenshot({ 
                path: `screenshots/${site.name.replace('.', '_')}_desktop.png`,
                fullPage: true 
            });
            
            // Mobile screenshot
            await page.setViewportSize({ width: 375, height: 812 });
            await page.screenshot({ 
                path: `screenshots/${site.name.replace('.', '_')}_mobile.png`,
                fullPage: true 
            });
            
            this.results[site.name] = analysis;
            console.log(`✅ Completed analysis of ${site.name}`);
            
        } catch (error) {
            console.error(`❌ Error analyzing ${site.name}:`, error.message);
            this.results[site.name] = {
                site: site.name,
                url: site.url,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
        
        await context.close();
    }

    async extractSiteData(page) {
        return await page.evaluate(() => {
            // Helper functions
            const getText = (selector) => {
                const el = document.querySelector(selector);
                return el ? el.textContent.trim() : null;
            };

            const getTexts = (selector) => {
                const els = document.querySelectorAll(selector);
                return Array.from(els).map(el => el.textContent.trim()).filter(text => text);
            };

            const getAttributes = (selector, attribute) => {
                const els = document.querySelectorAll(selector);
                return Array.from(els).map(el => el.getAttribute(attribute)).filter(attr => attr);
            };

            // Extract key data
            return {
                // Basic page info
                title: document.title,
                description: getText('meta[name="description"]'),
                
                // Hero section analysis
                hero: {
                    headline: getText('h1') || getText('[class*="hero"] h1') || getText('[class*="title"]'),
                    subheadline: getText('h1 + p') || getText('[class*="hero"] p') || getText('[class*="subtitle"]'),
                    cta_primary: getText('a[class*="cta"], button[class*="cta"], a[class*="button"], .btn-primary') || 
                                getText('a:contains("Get started"), a:contains("Sign up"), a:contains("Try"), button:contains("Get started")'),
                    cta_secondary: getTexts('a[class*="secondary"], button[class*="secondary"], a[class*="outline"]')[0]
                },
                
                // Navigation analysis
                navigation: {
                    logo_text: getText('[class*="logo"], [class*="brand"]'),
                    nav_items: getTexts('nav a, header a').slice(0, 8),
                    cta_nav: getText('nav [class*="cta"], header [class*="cta"], nav [class*="button"]')
                },
                
                // Content structure
                content: {
                    section_count: document.querySelectorAll('section').length,
                    headings: getTexts('h2, h3').slice(0, 10),
                    features_mentioned: getTexts('[class*="feature"] h3, [class*="benefit"] h3').slice(0, 6)
                },
                
                // Form analysis
                forms: {
                    signup_form_present: !!document.querySelector('form'),
                    input_count: document.querySelectorAll('form input').length,
                    required_fields: document.querySelectorAll('form input[required]').length,
                    form_cta: getText('form button, form input[type="submit"]'),
                    email_only: document.querySelectorAll('form input').length === 1 && 
                               document.querySelector('form input[type="email"]')
                },
                
                // Trust signals
                trust_signals: {
                    testimonials: document.querySelectorAll('[class*="testimonial"], [class*="review"]').length,
                    logos: document.querySelectorAll('[class*="logo"], [class*="customer"], [class*="client"]').length,
                    security_badges: document.querySelectorAll('[class*="security"], [class*="ssl"], [class*="badge"]').length,
                    social_proof_text: getTexts('[class*="social"], [class*="proof"], [class*="customer"]').slice(0, 3)
                },
                
                // Visual design analysis
                design: {
                    color_scheme: this.extractColorScheme(),
                    font_families: this.extractFonts(),
                    button_styles: this.extractButtonStyles(),
                    spacing_approach: this.analyzeSpacing()
                },
                
                // Mobile responsiveness
                mobile: {
                    viewport_meta: !!document.querySelector('meta[name="viewport"]'),
                    responsive_images: document.querySelectorAll('img[srcset]').length,
                    mobile_menu: !!document.querySelector('[class*="mobile"], [class*="hamburger"]')
                },
                
                // Performance indicators
                performance: {
                    image_count: document.querySelectorAll('img').length,
                    external_scripts: document.querySelectorAll('script[src]').length,
                    css_files: document.querySelectorAll('link[rel="stylesheet"]').length
                }
            };
        });
    }

    async generateReport() {
        console.log('📝 Generating comprehensive analysis report...');
        
        const report = {
            analysis_date: new Date().toISOString(),
            sites_analyzed: Object.keys(this.results).length,
            results: this.results,
            insights: this.generateInsights(),
            recommendations: this.generateRecommendations()
        };
        
        // Save detailed JSON report
        fs.writeFileSync('website-analysis-results.json', JSON.stringify(report, null, 2));
        
        // Generate markdown report
        const markdownReport = this.generateMarkdownReport(report);
        fs.writeFileSync('competitive-analysis-findings.md', markdownReport);
        
        console.log('✅ Reports generated:');
        console.log('   - website-analysis-results.json (detailed data)');
        console.log('   - competitive-analysis-findings.md (formatted report)');
    }

    generateInsights() {
        const insights = {
            design_trends: [],
            messaging_patterns: [],
            conversion_strategies: [],
            mobile_approaches: []
        };
        
        // Analyze patterns across sites
        Object.values(this.results).forEach(site => {
            if (site.error) return;
            
            // Design trends
            if (site.design) {
                insights.design_trends.push({
                    site: site.site,
                    colors: site.design.color_scheme,
                    fonts: site.design.font_families
                });
            }
            
            // Messaging patterns
            if (site.hero) {
                insights.messaging_patterns.push({
                    site: site.site,
                    headline_approach: site.hero.headline,
                    cta_strategy: site.hero.cta_primary
                });
            }
            
            // Conversion strategies
            if (site.forms) {
                insights.conversion_strategies.push({
                    site: site.site,
                    form_approach: site.forms.email_only ? 'email_only' : 'multi_field',
                    input_count: site.forms.input_count,
                    cta_text: site.forms.form_cta
                });
            }
        });
        
        return insights;
    }

    generateRecommendations() {
        // Analyze our current site vs competitors
        const recommendations = {
            critical_fixes: [],
            important_improvements: [],
            optimization_opportunities: []
        };
        
        // This would contain logic to compare our site against competitors
        // and generate specific recommendations
        
        return recommendations;
    }

    generateMarkdownReport(report) {
        return `# Competitive Website Analysis Report

*Generated: ${new Date().toLocaleDateString()}*
*Sites Analyzed: ${report.sites_analyzed}*

## Executive Summary

### Key Findings
${this.formatInsights(report.insights)}

### Immediate Recommendations
${this.formatRecommendations(report.recommendations)}

## Detailed Site Analysis

${Object.values(report.results).map(site => this.formatSiteAnalysis(site)).join('\n\n')}

## Competitive Intelligence

### Design Trends Identified
${this.formatDesignTrends(report.insights.design_trends)}

### Messaging Patterns
${this.formatMessagingPatterns(report.insights.messaging_patterns)}

### Conversion Strategies
${this.formatConversionStrategies(report.insights.conversion_strategies)}

---

*This report was generated automatically. Review findings and adapt recommendations based on DataSense's specific context and goals.*
`;
    }

    formatSiteAnalysis(site) {
        if (site.error) {
            return `### ${site.site}
**Status**: Error - ${site.error}`;
        }

        return `### ${site.site}
**URL**: ${site.url}
**Category**: ${site.category}

**Hero Section**:
- Headline: "${site.hero?.headline || 'Not found'}"
- Primary CTA: "${site.hero?.cta_primary || 'Not found'}"

**Form Strategy**:
- Input Count: ${site.forms?.input_count || 0}
- Email Only: ${site.forms?.email_only ? 'Yes' : 'No'}
- Form CTA: "${site.forms?.form_cta || 'Not found'}"

**Trust Signals**:
- Testimonials: ${site.trust_signals?.testimonials || 0}
- Customer Logos: ${site.trust_signals?.logos || 0}`;
    }

    formatInsights(insights) {
        return `- **Design Trends**: ${insights.design_trends.length} sites analyzed
- **Messaging Patterns**: ${insights.messaging_patterns.length} approaches documented
- **Conversion Strategies**: ${insights.conversion_strategies.length} form strategies identified`;
    }

    formatRecommendations(recommendations) {
        return `- **Critical Fixes**: ${recommendations.critical_fixes.length} identified
- **Important Improvements**: ${recommendations.important_improvements.length} identified
- **Optimization Opportunities**: ${recommendations.optimization_opportunities.length} identified`;
    }

    formatDesignTrends(trends) {
        return trends.map(trend => `- **${trend.site}**: ${trend.fonts || 'Font info not available'}`).join('\n');
    }

    formatMessagingPatterns(patterns) {
        return patterns.map(pattern => `- **${pattern.site}**: "${pattern.headline_approach}"`).join('\n');
    }

    formatConversionStrategies(strategies) {
        return strategies.map(strategy => 
            `- **${strategy.site}**: ${strategy.form_approach} (${strategy.input_count} fields)`
        ).join('\n');
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
            console.log('🔒 Browser closed');
        }
    }
}

// Main execution function
async function runAnalysis() {
    // Create screenshots directory
    if (!fs.existsSync('screenshots')) {
        fs.mkdirSync('screenshots');
    }

    const analyzer = new WebsiteAnalyzer();
    
    try {
        await analyzer.init();
        
        // Analyze all sites
        for (const site of SITES_TO_ANALYZE) {
            await analyzer.analyzeSite(site);
            // Small delay between requests to be respectful
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        // Generate comprehensive report
        await analyzer.generateReport();
        
        console.log('\n🎉 Analysis complete! Check the generated files:');
        console.log('   - competitive-analysis-findings.md');
        console.log('   - website-analysis-results.json');
        console.log('   - screenshots/ directory');
        
    } catch (error) {
        console.error('❌ Analysis failed:', error);
    } finally {
        await analyzer.close();
    }
}

// Export for use as module or run directly
if (require.main === module) {
    runAnalysis();
}

module.exports = { WebsiteAnalyzer, runAnalysis };