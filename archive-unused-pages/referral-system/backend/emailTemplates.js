class EmailTemplates {
    constructor() {
        this.templates = {
            referralInvite: {
                subject: '{{referrerName}} thinks you\'d love DataSense',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #3b82f6;">You're Invited to DataSense!</h2>
                        
                        <p>Hi there,</p>
                        
                        <p>{{referrerName}} has been using DataSense to transform their business data into actionable insights, 
                        and they think you'd benefit from it too!</p>
                        
                        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="margin-top: 0;">Your Exclusive Benefits:</h3>
                            <ul>
                                <li><strong>20% off</strong> your first 3 months</li>
                                <li><strong>30-day extended trial</strong> (vs. 14-day standard)</li>
                                <li>Priority onboarding support</li>
                                <li>Access to exclusive "Friends of DataSense" community</li>
                            </ul>
                        </div>
                        
                        {{#if personalMessage}}
                        <div style="background: #eff6ff; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0;">
                            <p style="margin: 0;"><strong>Personal message from {{referrerName}}:</strong></p>
                            <p style="margin: 10px 0 0 0;">{{personalMessage}}</p>
                        </div>
                        {{/if}}
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="{{referralLink}}" style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                                Start Your Free Trial
                            </a>
                        </div>
                        
                        <p style="text-align: center; color: #6b7280;">
                            Your referral code: <strong style="color: #3b82f6; font-size: 20px;">{{referralCode}}</strong>
                        </p>
                        
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                        
                        <p style="color: #6b7280; font-size: 14px;">
                            This invitation was sent by {{referrerName}} through DataSense's referral program. 
                            If you don't want to receive these invitations, you can 
                            <a href="{{unsubscribeLink}}">unsubscribe here</a>.
                        </p>
                    </div>
                `
            },
            
            referralSuccess: {
                subject: '🎉 Your referral just signed up!',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #10b981;">Great News! Your Referral Converted!</h2>
                        
                        <p>Hi {{referrerName}},</p>
                        
                        <p>Fantastic news! <strong>{{refereeEmail}}</strong> just signed up for DataSense using your referral code!</p>
                        
                        <div style="background: #dcfce7; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                            <h3 style="color: #14532d; margin-top: 0;">You've Earned:</h3>
                            <p style="font-size: 36px; color: #14532d; font-weight: bold; margin: 10px 0;">$500 Credit</p>
                            <p style="color: #166534;">Applied to your account immediately</p>
                        </div>
                        
                        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <h4 style="margin-top: 0;">Your Progress:</h4>
                            <p>Total Successful Referrals: <strong>{{totalReferrals}}</strong></p>
                            <p>Total Rewards Earned: <strong>${{totalRewards}}</strong></p>
                            
                            {{#if nextMilestone}}
                            <p style="color: #6b7280; margin-top: 10px;">
                                Only <strong>{{referralsToNextMilestone}}</strong> more referral(s) to unlock: {{nextMilestoneReward}}
                            </p>
                            {{/if}}
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="{{dashboardLink}}" style="background: #3b82f6; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; display: inline-block;">
                                View Your Dashboard
                            </a>
                        </div>
                        
                        <p style="text-align: center; color: #6b7280;">
                            Keep the momentum going! Share your referral code: <strong>{{referralCode}}</strong>
                        </p>
                    </div>
                `
            },
            
            milestoneAchieved: {
                subject: '🏆 Milestone Achieved: {{milestoneName}}!',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); border-radius: 8px 8px 0 0;">
                            <h1 style="color: white; margin: 0;">🏆 Milestone Unlocked!</h1>
                        </div>
                        
                        <div style="padding: 20px;">
                            <p>Congratulations {{userName}}!</p>
                            
                            <p>You've just achieved an incredible milestone in our referral program!</p>
                            
                            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                                <h2 style="color: #92400e; margin-top: 0;">{{milestoneName}}</h2>
                                <p style="font-size: 24px; color: #92400e; margin: 10px 0;">{{milestoneReward}}</p>
                            </div>
                            
                            {{#if isChampion}}
                            <div style="background: linear-gradient(135deg, #e9d5ff 0%, #c084fc 100%); padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                                <h3 style="color: white; margin-top: 0;">Welcome to the Champions Club!</h3>
                                <p style="color: white;">You now have access to exclusive benefits and recognition</p>
                            </div>
                            {{/if}}
                            
                            <h3>Your Achievements:</h3>
                            <ul>
                                {{#each badges}}
                                <li>{{this.name}} - {{this.description}}</li>
                                {{/each}}
                            </ul>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="{{dashboardLink}}" style="background: #3b82f6; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; display: inline-block;">
                                    View All Rewards
                                </a>
                            </div>
                        </div>
                    </div>
                `
            },
            
            rewardExpiring: {
                subject: '⏰ Your reward expires soon!',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #f59e0b;">Don't Let Your Reward Expire!</h2>
                        
                        <p>Hi {{userName}},</p>
                        
                        <p>Just a friendly reminder that you have a reward expiring soon:</p>
                        
                        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #92400e; margin-top: 0;">{{rewardType}}</h3>
                            <p style="font-size: 20px; color: #92400e;">Value: {{rewardValue}}</p>
                            <p style="color: #b45309;">Expires in: <strong>{{daysUntilExpiry}} days</strong></p>
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="{{redeemLink}}" style="background: #f59e0b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                                Redeem Now
                            </a>
                        </div>
                        
                        <p style="color: #6b7280; font-size: 14px;">
                            Don't miss out on your hard-earned rewards! Visit your dashboard to redeem.
                        </p>
                    </div>
                `
            },
            
            weeklyProgress: {
                subject: '📊 Your Weekly Referral Report',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #3b82f6;">Your Weekly Referral Performance</h2>
                        
                        <p>Hi {{userName}},</p>
                        
                        <p>Here's how your referral network performed this week:</p>
                        
                        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="margin-top: 0;">This Week's Stats:</h3>
                            <table style="width: 100%;">
                                <tr>
                                    <td style="padding: 10px 0;">New Referrals:</td>
                                    <td style="text-align: right; font-weight: bold;">{{weeklyReferrals}}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0;">Conversions:</td>
                                    <td style="text-align: right; font-weight: bold;">{{weeklyConversions}}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0;">Rewards Earned:</td>
                                    <td style="text-align: right; font-weight: bold;">${{weeklyRewards}}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0;">Conversion Rate:</td>
                                    <td style="text-align: right; font-weight: bold;">{{conversionRate}}%</td>
                                </tr>
                            </table>
                        </div>
                        
                        {{#if topPerformer}}
                        <div style="background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <p style="margin: 0; text-align: center; color: #14532d;">
                                🌟 You're in the top {{topPerformerRank}}% of referrers this week!
                            </p>
                        </div>
                        {{/if}}
                        
                        <h3>Tips to Boost Your Referrals:</h3>
                        <ul>
                            <li>Share your success story on LinkedIn</li>
                            <li>Include your referral link in your email signature</li>
                            <li>Reach out to colleagues who mentioned data challenges</li>
                        </ul>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="{{dashboardLink}}" style="background: #3b82f6; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; display: inline-block;">
                                View Full Dashboard
                            </a>
                        </div>
                    </div>
                `
            },
            
            refereeWelcome: {
                subject: 'Welcome to DataSense - Your exclusive benefits await!',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #3b82f6;">Welcome to DataSense!</h2>
                        
                        <p>Hi {{refereeName}},</p>
                        
                        <p>Welcome aboard! We're thrilled that {{referrerName}} introduced you to DataSense.</p>
                        
                        <div style="background: #dcfce7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #14532d; margin-top: 0;">Your Exclusive Referral Benefits:</h3>
                            <ul style="color: #166534;">
                                <li><strong>20% discount</strong> on your first 3 months</li>
                                <li><strong>30-day extended trial</strong> to explore all features</li>
                                <li><strong>Priority onboarding</strong> with our success team</li>
                                <li><strong>Exclusive access</strong> to the Friends of DataSense community</li>
                            </ul>
                        </div>
                        
                        <h3>Getting Started:</h3>
                        <ol>
                            <li>Complete your profile setup</li>
                            <li>Connect your first data source</li>
                            <li>Schedule your onboarding call</li>
                            <li>Join our Slack community</li>
                        </ol>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="{{setupLink}}" style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                                Complete Setup
                            </a>
                        </div>
                        
                        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <p style="margin: 0;">
                                <strong>Did you know?</strong> You can also earn rewards by referring others! 
                                Share DataSense with your network and earn $500 for each successful referral.
                            </p>
                        </div>
                        
                        <p style="color: #6b7280; font-size: 14px;">
                            Questions? Reply to this email or chat with us at support@datasense.ai
                        </p>
                    </div>
                `
            }
        };
    }

    async sendEmail(templateName, recipient, variables) {
        const template = this.templates[templateName];
        if (!template) {
            throw new Error(`Template ${templateName} not found`);
        }

        const subject = this.replaceVariables(template.subject, variables);
        const html = this.replaceVariables(template.html, variables);

        return {
            to: recipient,
            subject,
            html,
            text: this.htmlToText(html)
        };
    }

    replaceVariables(text, variables) {
        let result = text;
        
        for (const [key, value] of Object.entries(variables)) {
            const regex = new RegExp(`{{${key}}}`, 'g');
            result = result.replace(regex, value);
        }
        
        result = result.replace(/{{#if (\w+)}}([\s\S]*?){{\/if}}/g, (match, variable, content) => {
            return variables[variable] ? content : '';
        });
        
        result = result.replace(/{{#each (\w+)}}([\s\S]*?){{\/each}}/g, (match, variable, content) => {
            if (!variables[variable] || !Array.isArray(variables[variable])) return '';
            return variables[variable].map(item => {
                let itemContent = content;
                for (const [key, value] of Object.entries(item)) {
                    itemContent = itemContent.replace(new RegExp(`{{this.${key}}}`, 'g'), value);
                }
                return itemContent;
            }).join('');
        });
        
        return result;
    }

    htmlToText(html) {
        return html
            .replace(/<style[\s\S]*?<\/style>/gi, '')
            .replace(/<script[\s\S]*?<\/script>/gi, '')
            .replace(/<[^>]+>/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    async saveTemplate(name, subject, htmlBody, category) {
        const query = `
            INSERT INTO email_templates (template_name, subject, body_html, body_text, category)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (template_name) 
            DO UPDATE SET 
                subject = $2,
                body_html = $3,
                body_text = $4,
                category = $5,
                updated_at = CURRENT_TIMESTAMP
            RETURNING *
        `;
        
        const values = [
            name,
            subject,
            htmlBody,
            this.htmlToText(htmlBody),
            category
        ];
        
        return query;
    }
}

module.exports = EmailTemplates;