// Email Marketing and CRM Integration
(function() {
    'use strict';

    // Email marketing integration configuration
    const EMAIL_CONFIG = {
        // Mailchimp configuration
        mailchimp: {
            apiKey: 'YOUR_MAILCHIMP_API_KEY',
            listId: 'YOUR_BETA_LIST_ID',
            endpoint: 'https://us1.api.mailchimp.com/3.0' // Replace us1 with your data center
        },
        
        // ConvertKit configuration
        convertkit: {
            apiKey: 'YOUR_CONVERTKIT_API_KEY',
            formId: 'YOUR_BETA_FORM_ID',
            endpoint: 'https://api.convertkit.com/v3'
        },
        
        // HubSpot configuration
        hubspot: {
            portalId: 'YOUR_HUBSPOT_PORTAL_ID',
            formId: 'YOUR_BETA_FORM_ID',
            endpoint: 'https://api.hsforms.com/submissions/v3/integration/submit'
        },
        
        // Active provider
        provider: 'mailchimp' // Change to your preferred provider
    };

    // CRM Integration
    window.DataSenseCRM = {
        // Add contact to email marketing platform
        addToEmailList: function(userData) {
            const provider = EMAIL_CONFIG.provider;
            
            switch (provider) {
                case 'mailchimp':
                    return this.addToMailchimp(userData);
                case 'convertkit':
                    return this.addToConvertKit(userData);
                case 'hubspot':
                    return this.addToHubSpot(userData);
                default:
                    return this.addToGenericWebhook(userData);
            }
        },

        // Mailchimp integration
        addToMailchimp: function(userData) {
            const config = EMAIL_CONFIG.mailchimp;
            const subscriberData = {
                email_address: userData.email,
                status: 'subscribed',
                merge_fields: {
                    UTMSOURCE: userData.utmSource,
                    UTMMEDIUM: userData.utmMedium,
                    UTMCAMP: userData.utmCampaign,
                    REFERRER: userData.referrer,
                    SIGNUPDATE: userData.timestamp
                },
                tags: ['beta-signup', 'warm-lead', 'email-only']
            };

            return fetch(`${config.endpoint}/lists/${config.listId}/members`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${config.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(subscriberData)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Added to Mailchimp:', data);
                return data;
            });
        },

        // ConvertKit integration
        addToConvertKit: function(userData) {
            const config = EMAIL_CONFIG.convertkit;
            const subscriberData = {
                api_key: config.apiKey,
                email: userData.email,
                fields: {
                    utm_source: userData.utmSource,
                    utm_medium: userData.utmMedium,
                    utm_campaign: userData.utmCampaign,
                    referrer: userData.referrer,
                    signup_date: userData.timestamp
                },
                tags: ['beta-signup', 'warm-lead', 'email-only']
            };

            return fetch(`${config.endpoint}/forms/${config.formId}/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(subscriberData)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Added to ConvertKit:', data);
                return data;
            });
        },

        // HubSpot integration
        addToHubSpot: function(userData) {
            const config = EMAIL_CONFIG.hubspot;
            const submissionData = {
                fields: [
                    { name: 'email', value: userData.email },
                    { name: 'firstname', value: userData.firstName },
                    { name: 'lastname', value: userData.lastName },
                    { name: 'company', value: userData.companyName },
                    { name: 'jobtitle', value: userData.role },
                    { name: 'company_size', value: userData.companySize },
                    { name: 'biggest_challenge', value: userData.biggestChallenge },
                    { name: 'current_tools', value: userData.currentTools }
                ],
                context: {
                    hutk: this.getHubSpotCookie(),
                    pageUri: window.location.href,
                    pageName: document.title
                }
            };

            return fetch(`${config.endpoint}/${config.portalId}/${config.formId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(submissionData)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Added to HubSpot:', data);
                return data;
            });
        },

        // Generic webhook for custom integrations
        addToGenericWebhook: function(userData) {
            return fetch('/api/beta-signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Added via webhook:', data);
                return data;
            });
        },

        // Get HubSpot tracking cookie
        getHubSpotCookie: function() {
            const name = 'hubspotutk=';
            const decodedCookie = decodeURIComponent(document.cookie);
            const ca = decodedCookie.split(';');
            
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) === 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return '';
        },

        // Lead scoring based on available data (email-only signups)
        calculateLeadScore: function(userData) {
            let score = 30; // Base score for warm leads who gave email
            
            // Email domain scoring (business indicators)
            const email = userData.email.toLowerCase();
            const domain = email.split('@')[1];
            
            if (domain) {
                // Business domains get higher scores
                if (domain.includes('gmail') || domain.includes('yahoo') || domain.includes('hotmail')) {
                    score += 5; // Personal email
                } else {
                    score += 15; // Business email domain
                }
                
                // Company size indicators from domain
                if (domain.includes('corp') || domain.includes('inc') || domain.includes('llc')) {
                    score += 10; // Formal business structure
                }
            }
            
            // UTM source scoring (traffic quality)
            const sourceScores = {
                'google': 10,
                'linkedin': 20, // High-intent business platform
                'facebook': 8,
                'twitter': 5,
                'direct': 15, // Direct traffic = higher intent
                'referral': 25 // Referrals are highest quality
            };
            score += sourceScores[userData.utmSource] || 5;
            
            // Time-based scoring (when they signed up)
            const signupHour = new Date(userData.timestamp).getHours();
            if (signupHour >= 9 && signupHour <= 17) {
                score += 10; // Business hours signup
            }
            
            return Math.min(score, 100); // Cap at 100
        },

        // Trigger automated email sequences
        triggerEmailSequence: function(userData, sequenceType = 'beta-welcome') {
            const leadScore = this.calculateLeadScore(userData);
            
            // Determine email sequence based on lead score and profile
            let sequence = sequenceType;
            if (leadScore >= 70) {
                sequence = 'high-intent-beta';
            } else if (leadScore >= 40) {
                sequence = 'medium-intent-beta';
            } else {
                sequence = 'nurture-beta';
            }
            
            // Send sequence trigger to email platform
            return this.sendSequenceTrigger(userData.email, sequence, {
                lead_score: leadScore,
                company_size: userData.companySize,
                role: userData.role,
                challenge: userData.biggestChallenge
            });
        },

        // Send sequence trigger
        sendSequenceTrigger: function(email, sequenceName, customFields = {}) {
            // This would integrate with your email automation platform
            const sequenceData = {
                email: email,
                sequence: sequenceName,
                custom_fields: customFields,
                trigger_time: new Date().toISOString()
            };
            
            console.log('Triggering email sequence:', sequenceData);
            
            // Example: ConvertKit sequence trigger
            if (EMAIL_CONFIG.provider === 'convertkit') {
                return fetch(`${EMAIL_CONFIG.convertkit.endpoint}/sequences/YOUR_SEQUENCE_ID/subscribe`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        api_key: EMAIL_CONFIG.convertkit.apiKey,
                        email: email,
                        fields: customFields
                    })
                });
            }
            
            return Promise.resolve(sequenceData);
        },

        // Sync with CRM (Salesforce, Pipedrive, etc.)
        syncToCRM: function(userData) {
            const leadData = {
                ...userData,
                lead_score: this.calculateLeadScore(userData),
                source: 'DataSense Beta Landing Page',
                status: 'New Lead',
                created_at: new Date().toISOString()
            };
            
            // Send to CRM webhook
            return fetch('/api/crm-sync', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(leadData)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Synced to CRM:', data);
                return data;
            });
        },

        // Send Slack notification for high-value leads
        notifyTeam: function(userData) {
            const leadScore = this.calculateLeadScore(userData);
            
            // Only notify for high-value leads
            if (leadScore >= 60) {
                const slackMessage = {
                    text: `🚀 High-value beta signup!`,
                    attachments: [{
                        color: 'good',
                        fields: [
                            { title: 'Name', value: `${userData.firstName} ${userData.lastName}`, short: true },
                            { title: 'Company', value: userData.companyName, short: true },
                            { title: 'Role', value: userData.role, short: true },
                            { title: 'Company Size', value: userData.companySize, short: true },
                            { title: 'Lead Score', value: leadScore, short: true },
                            { title: 'Email', value: userData.email, short: true },
                            { title: 'Challenge', value: userData.biggestChallenge, short: false }
                        ]
                    }]
                };
                
                return fetch('/api/slack-notify', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(slackMessage)
                });
            }
            
            return Promise.resolve();
        }
    };

    // Email template system
    window.DataSenseEmails = {
        // Generate welcome email content
        generateWelcomeEmail: function(userData) {
            const template = `
                <h2>Welcome to DataSense Beta! 🎉</h2>
                
                <p>Thanks for joining our exclusive beta program. You're now part of a select group of business owners who are getting early access to enterprise-level data insights.</p>
                
                <h3>What happens next:</h3>
                <ul>
                    <li>✅ You'll receive this welcome email (you're reading it now!)</li>
                    <li>📞 Our team will email you within 24 hours</li>
                    <li>⚡ We'll schedule a quick 15-minute call to understand your needs</li>
                    <li>🚀 You'll be analyzing your data within hours of our call</li>
                </ul>
                
                <h3>What to expect from DataSense:</h3>
                <ol>
                    <li><strong>Instant answers</strong> - Get insights in 30 seconds, not 30 days</li>
                    <li><strong>No technical skills needed</strong> - Ask questions in plain English</li>
                    <li><strong>Real business impact</strong> - See which customers are most profitable, which marketing works, and where to focus your time</li>
                </ol>
                
                <p><strong>Quick question:</strong> What's your biggest challenge with business data right now? Just reply to this email and let us know - it helps us personalize your beta experience.</p>
                
                <p>Looking forward to showing you what your data can tell you!</p>
                
                <p>Mike & Sarah<br>
                DataSense Founders<br>
                <a href="mailto:hello@datasense.com">hello@datasense.com</a></p>
            `;
            
            return template;
        },

        // Generate follow-up email based on lead score
        generateFollowUpEmail: function(userData, leadScore) {
            if (leadScore >= 70) {
                return this.generateHighIntentEmail(userData);
            } else if (leadScore >= 40) {
                return this.generateMediumIntentEmail(userData);
            } else {
                return this.generateNurtureEmail(userData);
            }
        },

        generateHighIntentEmail: function(userData) {
            return `
                <h2>Hi ${userData.firstName}, let's get you set up today!</h2>
                
                <p>I noticed you're a ${userData.role} at ${userData.companyName} - exactly the type of business leader who gets massive value from DataSense.</p>
                
                <p>Since you mentioned: "${userData.biggestChallenge}" - I have some specific ideas on how we can solve this in your first week.</p>
                
                <p><strong>Can we jump on a quick 15-minute call today or tomorrow?</strong></p>
                
                <p>I'll show you exactly how DataSense can address your challenge and get you analyzing data by the end of the week.</p>
                
                <p>Best times for me are:</p>
                <ul>
                    <li>Today: 2pm-4pm EST</li>
                    <li>Tomorrow: 10am-12pm EST</li>
                </ul>
                
                <p>Just reply with what works for you!</p>
                
                <p>Mike Johnson<br>
                Founder, DataSense<br>
                mike@datasense.com</p>
            `;
        },

        generateMediumIntentEmail: function(userData) {
            return `
                <h2>Hi ${userData.firstName}, thanks for joining the beta!</h2>
                
                <p>I saw that you're dealing with: "${userData.biggestChallenge}"</p>
                
                <p>This is actually one of the most common challenges we solve. Here's a quick example of how another ${userData.role} solved this exact problem:</p>
                
                <blockquote>
                "I used to spend hours trying to figure out which marketing campaigns were actually working. DataSense showed me in 30 seconds that our LinkedIn ads were bringing in customers worth 40% more than Facebook. I shifted my budget and revenue jumped 25% that month." - Sarah, Marketing Director
                </blockquote>
                
                <p>I'd love to show you how this would work for ${userData.companyName}.</p>
                
                <p>Are you free for a quick 15-minute demo this week?</p>
                
                <p>Mike</p>
            `;
        },

        generateNurtureEmail: function(userData) {
            return `
                <h2>Hi ${userData.firstName}, welcome to the DataSense community!</h2>
                
                <p>Over the next few days, I'll be sharing some quick tips on how small businesses like ${userData.companyName} are using data to grow faster.</p>
                
                <p>Today's tip: <strong>The 3-Question Rule</strong></p>
                
                <p>Most business owners get overwhelmed by data because they try to analyze everything. Instead, start with these 3 questions:</p>
                <ol>
                    <li>Which customers are most profitable?</li>
                    <li>Which marketing efforts actually work?</li>
                    <li>What early warning signs predict problems?</li>
                </ol>
                
                <p>DataSense is built to answer exactly these types of questions in seconds, not hours.</p>
                
                <p>Tomorrow I'll share how one of our beta users discovered their most profitable customers and increased revenue by 30%.</p>
                
                <p>Talk soon!</p>
                <p>Mike</p>
            `;
        }
    };

})();