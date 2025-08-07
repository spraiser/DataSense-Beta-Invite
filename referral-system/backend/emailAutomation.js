const EmailTemplates = require('./emailTemplates');
const nodemailer = require('nodemailer');
const schedule = require('node-schedule');

class EmailAutomation {
    constructor(db, emailConfig) {
        this.db = db;
        this.templates = new EmailTemplates();
        this.transporter = nodemailer.createTransporter(emailConfig);
        this.setupAutomatedJobs();
    }

    setupAutomatedJobs() {
        schedule.scheduleJob('0 9 * * 1', () => this.sendWeeklyReports());
        
        schedule.scheduleJob('0 10 * * *', () => this.checkExpiringRewards());
        
        schedule.scheduleJob('0 14 * * *', () => this.sendInactiveReferrerReminders());
        
        schedule.scheduleJob('0 11 * * *', () => this.sendPendingReferralReminders());
    }

    async sendReferralInvite(referral, personalMessage = null) {
        try {
            const referrer = await this.getUserInfo(referral.referrer_id);
            const referralLink = this.generateReferralLink(referral.referral_code);
            
            const emailData = await this.templates.sendEmail('referralInvite', referral.referee_email, {
                referrerName: referrer.name,
                referralCode: referral.referral_code,
                referralLink,
                personalMessage,
                unsubscribeLink: `${process.env.BASE_URL}/unsubscribe`
            });
            
            await this.sendEmail(emailData);
            await this.logEmailSent('referral_invite', referral.id, referral.referee_email);
            
            return true;
        } catch (error) {
            console.error('Error sending referral invite:', error);
            return false;
        }
    }

    async sendReferralSuccess(referral) {
        try {
            const referrer = await this.getUserInfo(referral.referrer_id);
            const profile = await this.getReferralProfile(referral.referrer_id);
            const nextMilestone = this.getNextMilestone(profile.successful_referrals);
            
            const emailData = await this.templates.sendEmail('referralSuccess', referrer.email, {
                referrerName: referrer.name,
                refereeEmail: referral.referee_email,
                totalReferrals: profile.successful_referrals,
                totalRewards: profile.total_rewards_earned,
                referralCode: profile.referral_code,
                nextMilestone: nextMilestone ? true : false,
                referralsToNextMilestone: nextMilestone?.referralsNeeded,
                nextMilestoneReward: nextMilestone?.reward,
                dashboardLink: `${process.env.BASE_URL}/dashboard/referrals`
            });
            
            await this.sendEmail(emailData);
            await this.logEmailSent('referral_success', referral.id, referrer.email);
            
            return true;
        } catch (error) {
            console.error('Error sending referral success email:', error);
            return false;
        }
    }

    async sendMilestoneAchieved(userId, milestone) {
        try {
            const user = await this.getUserInfo(userId);
            const badges = await this.getUserBadges(userId);
            
            const emailData = await this.templates.sendEmail('milestoneAchieved', user.email, {
                userName: user.name,
                milestoneName: milestone.name,
                milestoneReward: milestone.reward,
                isChampion: milestone.name === 'DataSense Champion',
                badges: badges.slice(0, 5),
                dashboardLink: `${process.env.BASE_URL}/dashboard/rewards`
            });
            
            await this.sendEmail(emailData);
            await this.logEmailSent('milestone_achieved', userId, user.email);
            
            return true;
        } catch (error) {
            console.error('Error sending milestone email:', error);
            return false;
        }
    }

    async sendRefereeWelcome(referral) {
        try {
            const referee = await this.getUserInfo(referral.referee_id);
            const referrer = await this.getUserInfo(referral.referrer_id);
            
            const emailData = await this.templates.sendEmail('refereeWelcome', referee.email, {
                refereeName: referee.name,
                referrerName: referrer.name,
                setupLink: `${process.env.BASE_URL}/setup`,
                slackLink: process.env.SLACK_INVITE_LINK
            });
            
            await this.sendEmail(emailData);
            await this.logEmailSent('referee_welcome', referral.id, referee.email);
            
            return true;
        } catch (error) {
            console.error('Error sending referee welcome email:', error);
            return false;
        }
    }

    async sendWeeklyReports() {
        try {
            const activeReferrers = await this.getActiveReferrers();
            
            for (const referrer of activeReferrers) {
                const weeklyStats = await this.getWeeklyStats(referrer.user_id);
                const leaderboardPosition = await this.getLeaderboardPosition(referrer.user_id);
                
                const emailData = await this.templates.sendEmail('weeklyProgress', referrer.email, {
                    userName: referrer.name,
                    weeklyReferrals: weeklyStats.referrals,
                    weeklyConversions: weeklyStats.conversions,
                    weeklyRewards: weeklyStats.rewards,
                    conversionRate: weeklyStats.conversionRate,
                    topPerformer: leaderboardPosition <= 10,
                    topPerformerRank: Math.round((leaderboardPosition / activeReferrers.length) * 100),
                    dashboardLink: `${process.env.BASE_URL}/dashboard/analytics`
                });
                
                await this.sendEmail(emailData);
                await this.logEmailSent('weekly_report', referrer.user_id, referrer.email);
            }
            
            console.log(`Sent weekly reports to ${activeReferrers.length} referrers`);
        } catch (error) {
            console.error('Error sending weekly reports:', error);
        }
    }

    async checkExpiringRewards() {
        try {
            const expiringRewards = await this.db.query(`
                SELECT r.*, u.email, u.name
                FROM rewards r
                JOIN users u ON r.user_id = u.id
                WHERE r.status IN ('available', 'earned')
                AND r.expires_at IS NOT NULL
                AND r.expires_at BETWEEN CURRENT_TIMESTAMP AND CURRENT_TIMESTAMP + INTERVAL '7 days'
            `);
            
            for (const reward of expiringRewards.rows) {
                const daysUntilExpiry = Math.ceil(
                    (new Date(reward.expires_at) - new Date()) / (1000 * 60 * 60 * 24)
                );
                
                const emailData = await this.templates.sendEmail('rewardExpiring', reward.email, {
                    userName: reward.name,
                    rewardType: reward.reward_type,
                    rewardValue: reward.reward_value,
                    daysUntilExpiry,
                    redeemLink: `${process.env.BASE_URL}/dashboard/rewards/${reward.id}`
                });
                
                await this.sendEmail(emailData);
                await this.logEmailSent('reward_expiring', reward.id, reward.email);
            }
            
            console.log(`Sent expiry reminders for ${expiringRewards.rows.length} rewards`);
        } catch (error) {
            console.error('Error checking expiring rewards:', error);
        }
    }

    async sendInactiveReferrerReminders() {
        try {
            const inactiveReferrers = await this.db.query(`
                SELECT rp.*, u.email, u.name
                FROM referral_profiles rp
                JOIN users u ON rp.user_id = u.id
                WHERE rp.successful_referrals > 0
                AND NOT EXISTS (
                    SELECT 1 FROM referrals r 
                    WHERE r.referrer_id = rp.user_id 
                    AND r.created_at > CURRENT_TIMESTAMP - INTERVAL '30 days'
                )
            `);
            
            for (const referrer of inactiveReferrers.rows) {
                const subject = 'We miss you! Your referral network is waiting';
                const html = `
                    <p>Hi ${referrer.name},</p>
                    <p>It's been a while since your last referral. Your network is missing out on DataSense!</p>
                    <p>Remember, you earn $500 for each successful referral.</p>
                    <p>Share your code: <strong>${referrer.referral_code}</strong></p>
                `;
                
                await this.sendEmail({
                    to: referrer.email,
                    subject,
                    html,
                    text: this.htmlToText(html)
                });
                
                await this.logEmailSent('inactive_reminder', referrer.user_id, referrer.email);
            }
            
            console.log(`Sent reminders to ${inactiveReferrers.rows.length} inactive referrers`);
        } catch (error) {
            console.error('Error sending inactive reminders:', error);
        }
    }

    async sendPendingReferralReminders() {
        try {
            const pendingReferrals = await this.db.query(`
                SELECT r.*, rp.referral_code, u.email as referrer_email, u.name as referrer_name
                FROM referrals r
                JOIN referral_profiles rp ON r.referrer_id = rp.user_id
                JOIN users u ON rp.user_id = u.id
                WHERE r.status = 'pending'
                AND r.created_at BETWEEN CURRENT_TIMESTAMP - INTERVAL '7 days' 
                    AND CURRENT_TIMESTAMP - INTERVAL '6 days'
            `);
            
            for (const referral of pendingReferrals.rows) {
                const subject = 'Your friend hasn\'t signed up yet';
                const html = `
                    <p>Hi ${referral.referrer_name},</p>
                    <p>${referral.referee_email} hasn't completed their signup yet.</p>
                    <p>Why not send them a friendly reminder? Sometimes a personal touch makes all the difference!</p>
                    <p>Their referral link: ${this.generateReferralLink(referral.referral_code)}</p>
                `;
                
                await this.sendEmail({
                    to: referral.referrer_email,
                    subject,
                    html,
                    text: this.htmlToText(html)
                });
                
                await this.logEmailSent('pending_reminder', referral.id, referral.referrer_email);
            }
            
            console.log(`Sent reminders for ${pendingReferrals.rows.length} pending referrals`);
        } catch (error) {
            console.error('Error sending pending reminders:', error);
        }
    }

    async sendEmail(emailData) {
        try {
            const info = await this.transporter.sendMail({
                from: process.env.EMAIL_FROM || 'DataSense <referrals@datasense.ai>',
                to: emailData.to,
                subject: emailData.subject,
                html: emailData.html,
                text: emailData.text
            });
            
            console.log('Email sent:', info.messageId);
            return info;
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }

    async logEmailSent(type, referenceId, recipient) {
        try {
            await this.db.query(
                `INSERT INTO email_logs (type, reference_id, recipient, sent_at)
                 VALUES ($1, $2, $3, CURRENT_TIMESTAMP)`,
                [type, referenceId, recipient]
            );
        } catch (error) {
            console.error('Error logging email:', error);
        }
    }

    generateReferralLink(code) {
        return `${process.env.BASE_URL}/signup?ref=${code}&utm_source=email&utm_medium=referral&utm_campaign=referral_program`;
    }

    htmlToText(html) {
        return html.replace(/<[^>]*>/g, '').trim();
    }

    async getUserInfo(userId) {
        const result = await this.db.query(
            'SELECT id, email, name FROM users WHERE id = $1',
            [userId]
        );
        return result.rows[0];
    }

    async getReferralProfile(userId) {
        const result = await this.db.query(
            'SELECT * FROM referral_profiles WHERE user_id = $1',
            [userId]
        );
        return result.rows[0];
    }

    async getUserBadges(userId) {
        const result = await this.db.query(
            `SELECT b.name, b.description 
             FROM badges b
             JOIN user_badges ub ON b.id = ub.badge_id
             WHERE ub.user_id = $1
             ORDER BY ub.earned_at DESC`,
            [userId]
        );
        return result.rows;
    }

    async getActiveReferrers() {
        const result = await this.db.query(`
            SELECT DISTINCT rp.user_id, u.email, u.name
            FROM referral_profiles rp
            JOIN users u ON rp.user_id = u.id
            WHERE rp.successful_referrals > 0
            OR EXISTS (
                SELECT 1 FROM referrals r 
                WHERE r.referrer_id = rp.user_id 
                AND r.created_at > CURRENT_TIMESTAMP - INTERVAL '30 days'
            )
        `);
        return result.rows;
    }

    async getWeeklyStats(userId) {
        const result = await this.db.query(`
            SELECT 
                COUNT(*) FILTER (WHERE created_at > CURRENT_TIMESTAMP - INTERVAL '7 days') as referrals,
                COUNT(*) FILTER (WHERE status = 'converted' AND conversion_date > CURRENT_TIMESTAMP - INTERVAL '7 days') as conversions,
                SUM(CASE WHEN status = 'converted' AND conversion_date > CURRENT_TIMESTAMP - INTERVAL '7 days' 
                    THEN 500 ELSE 0 END) as rewards
            FROM referrals
            WHERE referrer_id = $1
        `, [userId]);
        
        const stats = result.rows[0];
        stats.conversionRate = stats.referrals > 0 
            ? Math.round((stats.conversions / stats.referrals) * 100) 
            : 0;
        
        return stats;
    }

    async getLeaderboardPosition(userId) {
        const result = await this.db.query(`
            WITH ranked AS (
                SELECT user_id, RANK() OVER (ORDER BY successful_referrals DESC) as rank
                FROM referral_profiles
                WHERE leaderboard_opt_in = true
            )
            SELECT rank FROM ranked WHERE user_id = $1
        `, [userId]);
        
        return result.rows[0]?.rank || 999;
    }

    getNextMilestone(currentReferrals) {
        const milestones = [
            { threshold: 3, reward: '1 Month Free', referralsNeeded: 3 - currentReferrals },
            { threshold: 5, reward: 'DataSense Champion Status', referralsNeeded: 5 - currentReferrals },
            { threshold: 10, reward: 'Conference Ticket + Case Study', referralsNeeded: 10 - currentReferrals }
        ];
        
        return milestones.find(m => m.threshold > currentReferrals && m.referralsNeeded > 0);
    }
}

module.exports = EmailAutomation;