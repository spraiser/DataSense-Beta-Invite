class SocialSharing {
    constructor(referralCode, userName) {
        this.referralCode = referralCode;
        this.userName = userName;
        this.baseUrl = 'https://datasense.ai';
        this.templates = this.initializeTemplates();
    }

    initializeTemplates() {
        return {
            linkedin: {
                posts: [
                    {
                        title: "Data-Driven Success Story",
                        content: `🚀 Exciting update! After implementing DataSense, we've seen a ${this.getRandomMetric()}% improvement in our decision-making speed.

The platform has transformed how we understand our business data, turning complex metrics into actionable insights that drive real results.

If you're struggling with data visibility or spending hours on manual reports, I highly recommend checking out DataSense.

🎁 Use my referral code ${this.referralCode} for exclusive benefits:
• 20% off your first 3 months
• 30-day extended trial
• Priority onboarding support

Ready to transform your data? ${this.getReferralLink('linkedin')}

#DataAnalytics #BusinessIntelligence #DataDriven #SmallBusiness`,
                        hashtags: ['DataAnalytics', 'BusinessIntelligence', 'DataDriven', 'SmallBusiness']
                    },
                    {
                        title: "Problem-Solution Post",
                        content: `Before DataSense: 
❌ 10+ hours weekly on manual reports
❌ Data scattered across multiple tools
❌ Decisions based on gut feeling
❌ Missing critical business insights

After DataSense:
✅ Automated real-time dashboards
✅ All data in one unified view
✅ Data-backed strategic decisions
✅ ${this.getRandomMetric()}% revenue increase

Want similar results? I can help you get started with exclusive benefits.

Use code: ${this.referralCode}
Link: ${this.getReferralLink('linkedin')}

#DataTransformation #BusinessGrowth #Analytics`,
                        hashtags: ['DataTransformation', 'BusinessGrowth', 'Analytics']
                    },
                    {
                        title: "Tips & Value Post",
                        content: `5 Signs Your Business Needs Better Data Analytics:

1️⃣ You're making decisions based on spreadsheets from last month
2️⃣ Different departments have conflicting numbers
3️⃣ You can't quickly answer "why" when metrics change
4️⃣ Preparing reports takes longer than analyzing them
5️⃣ You're reactive instead of proactive with trends

I found my solution with DataSense, and it's been a game-changer.

If you're experiencing any of these, let's connect! I can share my experience and get you exclusive access with my referral code: ${this.referralCode}

${this.getReferralLink('linkedin')}

#DataStrategy #BusinessOptimization #SMB`,
                        hashtags: ['DataStrategy', 'BusinessOptimization', 'SMB']
                    }
                ],
                messageTemplates: [
                    {
                        subject: "Quick question about your data challenges",
                        body: `Hi [Name],

I noticed your recent post about [specific challenge]. I faced similar issues until I started using DataSense.

It's completely transformed how we handle data - from scattered spreadsheets to unified dashboards that update in real-time.

If you're interested, I can get you exclusive benefits with my referral:
• 20% off first 3 months
• 30-day trial (vs 14-day standard)
• Priority onboarding

Here's my referral link: ${this.getReferralLink('linkedin')}

Happy to share more about my experience if you'd like!

Best,
${this.userName}`
                    }
                ]
            },
            twitter: {
                tweets: [
                    `Just hit ${this.getRandomMetric()}% growth after implementing @DataSenseAI 📈

Game-changer for understanding our business metrics.

Get 20% off with my code: ${this.referralCode}
${this.getReferralLink('twitter')}

#DataAnalytics #StartupGrowth`,
                    
                    `Thread 🧵

How DataSense transformed our business in 30 days:

1/ Before: 10+ hours weekly on manual reports
2/ Week 1: Connected all data sources in minutes
3/ Week 2: Automated dashboards replaced spreadsheets
4/ Week 3: Discovered hidden revenue opportunities
5/ Week 4: ${this.getRandomMetric()}% improvement in key metrics

Want in? Use code ${this.referralCode} for exclusive benefits
${this.getReferralLink('twitter')}`,
                    
                    `Hot take: If you're still using spreadsheets for business analytics in 2024, you're leaving money on the table.

@DataSenseAI changed everything for us.

Try it with my referral code ${this.referralCode} for 20% off
${this.getReferralLink('twitter')}`
                ]
            },
            facebook: {
                posts: [
                    {
                        content: `🎯 Small business owners! 

Are you drowning in data but starving for insights?

I was in the same boat until I discovered DataSense. In just 30 days, we:
✅ Reduced reporting time by 85%
✅ Increased revenue by ${this.getRandomMetric()}%
✅ Finally understood our customer behavior
✅ Made data-driven decisions with confidence

The best part? You can try it with exclusive benefits using my referral code: ${this.referralCode}

You'll get:
🎁 20% off your first 3 months
🎁 30-day extended trial
🎁 Priority support
🎁 Access to exclusive community

Don't let another month go by without proper data insights.

Start here: ${this.getReferralLink('facebook')}

#SmallBusiness #DataAnalytics #BusinessGrowth`,
                        image: 'dashboard-screenshot.png'
                    }
                ]
            },
            email: {
                signatures: [
                    `P.S. - Struggling with data visibility? I've been using DataSense and it's been incredible. Happy to share my experience and get you 20% off: ${this.getReferralLink('email')}`,
                    
                    `---
${this.userName}
DataSense Champion 🏆
Transform your data into insights: Use code ${this.referralCode} for exclusive benefits
${this.getReferralLink('email')}`,
                    
                    `---
BTW - If you're looking for better business analytics, check out DataSense. 
I can get you 20% off with my referral: ${this.getReferralLink('email')}`
                ],
                templates: [
                    {
                        subject: "The tool that transformed our data strategy",
                        body: `Hi [Name],

Hope you're doing well! 

I wanted to share something that's been a game-changer for our business. Remember when we discussed the challenges with data visibility and reporting?

We've been using DataSense for the past [timeframe], and the results have been incredible:
- Automated reporting saved us 10+ hours weekly
- Unified dashboard for all metrics
- ${this.getRandomMetric()}% improvement in [specific metric]

The platform connects to all our existing tools and creates beautiful, real-time dashboards that actually make sense.

If you're interested, I can get you some exclusive benefits with my referral:
- 20% off first 3 months
- 30-day trial instead of 14
- Priority onboarding support
- Access to private Slack community

Here's my referral link: ${this.getReferralLink('email')}
Referral code: ${this.referralCode}

Happy to jump on a call if you want to see our dashboards or discuss how it might work for your business.

Best regards,
${this.userName}`
                    }
                ]
            },
            whatsapp: {
                messages: [
                    `Hey! 👋

Quick share - remember when I mentioned we were drowning in spreadsheets?

Found an amazing solution: DataSense

It's transformed how we see our business data. Everything's automated now and we can actually see what's working.

I can get you 20% off if you're interested. My referral code is ${this.referralCode}

Check it out: ${this.getReferralLink('whatsapp')}

Let me know if you want to see our dashboards!`,
                    
                    `Hi [Name]! 

Saw your post about data challenges. Been there! 

DataSense solved it for us - worth checking out.

Use my code ${this.referralCode} for 20% off: ${this.getReferralLink('whatsapp')}

Happy to chat about our experience if helpful! 😊`
                ]
            }
        };
    }

    getReferralLink(platform) {
        const params = new URLSearchParams({
            ref: this.referralCode,
            utm_source: platform,
            utm_medium: platform === 'email' ? 'email' : 'social',
            utm_campaign: 'referral_program'
        });
        return `${this.baseUrl}/signup?${params.toString()}`;
    }

    getRandomMetric() {
        const metrics = [23, 31, 42, 37, 28, 45, 52, 38];
        return metrics[Math.floor(Math.random() * metrics.length)];
    }

    generateShareableGraphic(data) {
        const canvas = document.createElement('canvas');
        canvas.width = 1200;
        canvas.height = 630;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(0, 0, 1200, 630);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 72px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Transform Your Data', 600, 200);
        
        ctx.font = '48px Arial';
        ctx.fillText('Into Actionable Insights', 600, 280);
        
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(400, 350, 400, 100);
        
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 36px Arial';
        ctx.fillText(`Code: ${this.referralCode}`, 600, 410);
        
        ctx.fillStyle = 'white';
        ctx.font = '28px Arial';
        ctx.fillText('20% OFF + Extended Trial', 600, 500);
        
        ctx.font = '24px Arial';
        ctx.fillText('datasense.ai', 600, 570);
        
        return canvas.toDataURL('image/png');
    }

    copyToClipboard(platform, templateIndex = 0) {
        let content = '';
        
        switch(platform) {
            case 'linkedin':
                content = this.templates.linkedin.posts[templateIndex].content;
                break;
            case 'twitter':
                content = this.templates.twitter.tweets[templateIndex];
                break;
            case 'facebook':
                content = this.templates.facebook.posts[templateIndex].content;
                break;
            case 'email':
                content = this.templates.email.templates[templateIndex].body;
                break;
            case 'whatsapp':
                content = this.templates.whatsapp.messages[templateIndex];
                break;
        }
        
        navigator.clipboard.writeText(content).then(() => {
            this.showNotification('Content copied to clipboard!');
        });
        
        return content;
    }

    shareOnPlatform(platform, templateIndex = 0) {
        const urls = {
            linkedin: () => {
                const post = this.templates.linkedin.posts[templateIndex];
                const url = this.getReferralLink('linkedin');
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
            },
            twitter: () => {
                const tweet = this.templates.twitter.tweets[templateIndex];
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`, '_blank');
            },
            facebook: () => {
                const url = this.getReferralLink('facebook');
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
            },
            whatsapp: () => {
                const message = this.templates.whatsapp.messages[templateIndex];
                window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
            },
            email: () => {
                const template = this.templates.email.templates[templateIndex];
                const mailto = `mailto:?subject=${encodeURIComponent(template.subject)}&body=${encodeURIComponent(template.body)}`;
                window.location.href = mailto;
            }
        };
        
        if (urls[platform]) {
            urls[platform]();
            this.trackShare(platform, templateIndex);
        }
    }

    async trackShare(platform, templateIndex) {
        try {
            await fetch('/api/referral/share', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: localStorage.getItem('userId'),
                    platform,
                    content: `template_${templateIndex}`,
                    referralCode: this.referralCode
                })
            });
        } catch (error) {
            console.error('Error tracking share:', error);
        }
    }

    createScheduler() {
        return {
            linkedin: {
                bestTimes: ['Tuesday 10am', 'Wednesday 3pm', 'Thursday 9am'],
                frequency: 'weekly',
                nextPost: this.getNextScheduledTime('linkedin')
            },
            twitter: {
                bestTimes: ['Daily 9am', 'Daily 1pm', 'Daily 5pm'],
                frequency: 'daily',
                nextPost: this.getNextScheduledTime('twitter')
            },
            facebook: {
                bestTimes: ['Wednesday 1pm', 'Friday 3pm'],
                frequency: 'bi-weekly',
                nextPost: this.getNextScheduledTime('facebook')
            }
        };
    }

    getNextScheduledTime(platform) {
        const now = new Date();
        const schedules = {
            linkedin: 7,
            twitter: 1,
            facebook: 14
        };
        
        const nextDate = new Date(now.getTime() + schedules[platform] * 24 * 60 * 60 * 1000);
        return nextDate.toLocaleDateString();
    }

    generateQRCode() {
        const qrContainer = document.createElement('div');
        const referralUrl = this.getReferralLink('qr');
        
        new QRCode(qrContainer, {
            text: referralUrl,
            width: 256,
            height: 256,
            colorDark: '#3b82f6',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
        
        return qrContainer;
    }

    showNotification(message) {
        const notification = document.getElementById('notification');
        if (notification) {
            notification.textContent = message;
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }
    }
}

class SocialSharingUI {
    constructor(socialSharing) {
        this.socialSharing = socialSharing;
        this.currentPlatform = 'linkedin';
        this.currentTemplateIndex = 0;
    }

    render() {
        return `
            <div class="social-sharing-container">
                <div class="platform-selector">
                    <button class="platform-btn active" data-platform="linkedin">LinkedIn</button>
                    <button class="platform-btn" data-platform="twitter">Twitter</button>
                    <button class="platform-btn" data-platform="facebook">Facebook</button>
                    <button class="platform-btn" data-platform="email">Email</button>
                    <button class="platform-btn" data-platform="whatsapp">WhatsApp</button>
                </div>
                
                <div class="template-preview">
                    <div class="template-header">
                        <h3>Template Preview</h3>
                        <div class="template-navigation">
                            <button onclick="previousTemplate()">←</button>
                            <span id="templateCounter">1 / 3</span>
                            <button onclick="nextTemplate()">→</button>
                        </div>
                    </div>
                    
                    <div class="template-content" id="templateContent">
                    </div>
                    
                    <div class="template-actions">
                        <button class="action-btn" onclick="copyTemplate()">
                            📋 Copy to Clipboard
                        </button>
                        <button class="action-btn primary" onclick="shareNow()">
                            🚀 Share Now
                        </button>
                    </div>
                </div>
                
                <div class="sharing-tools">
                    <div class="tool-card">
                        <h4>Generate Graphic</h4>
                        <p>Create a shareable image with your referral code</p>
                        <button onclick="generateGraphic()">Create Graphic</button>
                    </div>
                    
                    <div class="tool-card">
                        <h4>QR Code</h4>
                        <p>Generate QR code for in-person sharing</p>
                        <button onclick="generateQR()">Generate QR</button>
                    </div>
                    
                    <div class="tool-card">
                        <h4>Email Signature</h4>
                        <p>Add referral to your email signature</p>
                        <button onclick="getSignature()">Get Signature</button>
                    </div>
                </div>
                
                <div class="best-practices">
                    <h3>Sharing Best Practices</h3>
                    <ul>
                        <li>Share authentic experiences and specific results</li>
                        <li>Focus on value provided, not just the discount</li>
                        <li>Personalize messages for different audiences</li>
                        <li>Use visuals and data to support your claims</li>
                        <li>Follow up with interested connections</li>
                    </ul>
                </div>
            </div>
        `;
    }
}

module.exports = { SocialSharing, SocialSharingUI };