class ReferralTracker {
    constructor(db) {
        this.db = db;
    }

    async trackReferral(data) {
        const {
            referralCode,
            refereeEmail,
            source,
            utm_source,
            utm_medium,
            utm_campaign,
            ipAddress,
            userAgent
        } = data;

        try {
            const referrerProfile = await this.db.query(
                'SELECT user_id FROM referral_profiles WHERE referral_code = $1',
                [referralCode]
            );

            if (!referrerProfile.rows.length) {
                throw new Error('Invalid referral code');
            }

            const existingReferral = await this.db.query(
                'SELECT id FROM referrals WHERE referee_email = $1 AND referrer_id = $2',
                [refereeEmail, referrerProfile.rows[0].user_id]
            );

            if (existingReferral.rows.length) {
                return existingReferral.rows[0];
            }

            const result = await this.db.query(
                `INSERT INTO referrals (
                    referrer_id, referee_email, referral_code, source,
                    utm_source, utm_medium, utm_campaign, status
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
                RETURNING *`,
                [
                    referrerProfile.rows[0].user_id,
                    refereeEmail,
                    referralCode,
                    source,
                    utm_source,
                    utm_medium,
                    utm_campaign
                ]
            );

            await this.db.query(
                `UPDATE referral_profiles 
                 SET total_referrals = total_referrals + 1 
                 WHERE user_id = $1`,
                [referrerProfile.rows[0].user_id]
            );

            if (ipAddress || userAgent) {
                await this.logEvent(result.rows[0].id, 'referral_created', {
                    ipAddress,
                    userAgent
                });
            }

            return result.rows[0];
        } catch (error) {
            console.error('Error tracking referral:', error);
            throw error;
        }
    }

    async convertReferral(referralId, refereeId, conversionValue) {
        try {
            const referral = await this.db.query(
                `UPDATE referrals 
                 SET referee_id = $2, 
                     status = 'converted',
                     conversion_date = CURRENT_TIMESTAMP,
                     referral_value = $3,
                     updated_at = CURRENT_TIMESTAMP
                 WHERE id = $1 AND status = 'pending'
                 RETURNING *`,
                [referralId, refereeId, conversionValue]
            );

            if (!referral.rows.length) {
                throw new Error('Referral not found or already converted');
            }

            await this.db.query(
                `UPDATE referral_profiles 
                 SET successful_referrals = successful_referrals + 1,
                     total_rewards_earned = total_rewards_earned + $2
                 WHERE user_id = $1`,
                [referral.rows[0].referrer_id, 500]
            );

            await this.checkMilestones(referral.rows[0].referrer_id);

            return referral.rows[0];
        } catch (error) {
            console.error('Error converting referral:', error);
            throw error;
        }
    }

    async getUserReferrals(userId, status = null) {
        let query = `
            SELECT r.*, 
                   CASE WHEN r.referee_id IS NOT NULL THEN 'converted' 
                        ELSE r.status END as display_status,
                   EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - r.created_at))/86400 as days_since_referral
            FROM referrals r
            WHERE r.referrer_id = $1
        `;
        
        const params = [userId];
        
        if (status) {
            query += ' AND r.status = $2';
            params.push(status);
        }
        
        query += ' ORDER BY r.created_at DESC';

        const result = await this.db.query(query, params);
        return result.rows;
    }

    async logEvent(referralId, eventType, eventData = {}) {
        try {
            await this.db.query(
                `INSERT INTO referral_events (referral_id, event_type, event_data, ip_address, user_agent)
                 VALUES ($1, $2, $3, $4, $5)`,
                [
                    referralId,
                    eventType,
                    JSON.stringify(eventData),
                    eventData.ipAddress || null,
                    eventData.userAgent || null
                ]
            );
        } catch (error) {
            console.error('Error logging event:', error);
        }
    }

    async checkMilestones(userId) {
        const profile = await this.db.query(
            'SELECT successful_referrals FROM referral_profiles WHERE user_id = $1',
            [userId]
        );

        if (!profile.rows.length) return;

        const referralCount = profile.rows[0].successful_referrals;
        const badges = [];

        if (referralCount === 1) {
            badges.push('First Referral');
        }
        if (referralCount === 5) {
            badges.push('DataSense Champion');
        }
        if (referralCount === 10) {
            badges.push('Growth Champion');
        }

        for (const badgeName of badges) {
            await this.awardBadge(userId, badgeName);
        }

        return badges;
    }

    async awardBadge(userId, badgeName) {
        try {
            const badge = await this.db.query(
                'SELECT id FROM badges WHERE name = $1',
                [badgeName]
            );

            if (badge.rows.length) {
                await this.db.query(
                    `INSERT INTO user_badges (user_id, badge_id) 
                     VALUES ($1, $2) 
                     ON CONFLICT DO NOTHING`,
                    [userId, badge.rows[0].id]
                );
            }
        } catch (error) {
            console.error('Error awarding badge:', error);
        }
    }

    async getUserBadges(userId) {
        const result = await this.db.query(
            `SELECT b.*, ub.earned_at
             FROM badges b
             JOIN user_badges ub ON b.id = ub.badge_id
             WHERE ub.user_id = $1
             ORDER BY ub.earned_at DESC`,
            [userId]
        );
        return result.rows;
    }

    async getLeaderboard(limit = 10, offset = 0, period = 'all') {
        let dateFilter = '';
        
        if (period === 'month') {
            dateFilter = "AND r.conversion_date >= DATE_TRUNC('month', CURRENT_DATE)";
        } else if (period === 'week') {
            dateFilter = "AND r.conversion_date >= DATE_TRUNC('week', CURRENT_DATE)";
        } else if (period === 'year') {
            dateFilter = "AND r.conversion_date >= DATE_TRUNC('year', CURRENT_DATE)";
        }

        const query = `
            SELECT 
                rp.user_id,
                rp.referral_code,
                rp.champion_status,
                COUNT(DISTINCT r.id) FILTER (WHERE r.status = 'converted' ${dateFilter}) as period_referrals,
                rp.successful_referrals as total_referrals,
                rp.total_rewards_earned,
                COUNT(DISTINCT ub.badge_id) as badge_count,
                RANK() OVER (ORDER BY COUNT(DISTINCT r.id) FILTER (WHERE r.status = 'converted' ${dateFilter}) DESC) as rank
            FROM referral_profiles rp
            LEFT JOIN referrals r ON rp.user_id = r.referrer_id
            LEFT JOIN user_badges ub ON rp.user_id = ub.user_id
            WHERE rp.leaderboard_opt_in = true
            GROUP BY rp.user_id, rp.referral_code, rp.champion_status, 
                     rp.successful_referrals, rp.total_rewards_earned
            ORDER BY period_referrals DESC
            LIMIT $1 OFFSET $2
        `;

        const result = await this.db.query(query, [limit, offset]);
        return result.rows;
    }

    async getReferralAnalytics(userId, startDate, endDate) {
        const dateFilter = startDate && endDate 
            ? 'AND r.created_at BETWEEN $2 AND $3'
            : '';
        
        const params = [userId];
        if (startDate && endDate) {
            params.push(startDate, endDate);
        }

        const funnel = await this.db.query(
            `SELECT 
                COUNT(*) as total_referrals,
                COUNT(DISTINCT CASE WHEN status = 'pending' THEN id END) as pending,
                COUNT(DISTINCT CASE WHEN status = 'converted' THEN id END) as converted,
                AVG(CASE WHEN status = 'converted' THEN referral_value END) as avg_value,
                SUM(CASE WHEN status = 'converted' THEN referral_value END) as total_value
             FROM referrals r
             WHERE referrer_id = $1 ${dateFilter}`,
            params
        );

        const sources = await this.db.query(
            `SELECT 
                COALESCE(utm_source, source, 'direct') as source,
                COUNT(*) as count,
                COUNT(CASE WHEN status = 'converted' THEN 1 END) as conversions,
                ROUND(100.0 * COUNT(CASE WHEN status = 'converted' THEN 1 END) / COUNT(*), 2) as conversion_rate
             FROM referrals r
             WHERE referrer_id = $1 ${dateFilter}
             GROUP BY COALESCE(utm_source, source, 'direct')
             ORDER BY count DESC`,
            params
        );

        const timeline = await this.db.query(
            `SELECT 
                DATE_TRUNC('day', created_at) as date,
                COUNT(*) as referrals,
                COUNT(CASE WHEN status = 'converted' THEN 1 END) as conversions
             FROM referrals r
             WHERE referrer_id = $1 ${dateFilter}
             GROUP BY DATE_TRUNC('day', created_at)
             ORDER BY date DESC
             LIMIT 30`,
            params
        );

        const networkEffect = await this.db.query(
            `WITH RECURSIVE referral_tree AS (
                SELECT r1.referee_id as user_id, 1 as level
                FROM referrals r1
                WHERE r1.referrer_id = $1 AND r1.status = 'converted'
                
                UNION ALL
                
                SELECT r2.referee_id, rt.level + 1
                FROM referrals r2
                JOIN referral_tree rt ON r2.referrer_id = rt.user_id
                WHERE r2.status = 'converted' AND rt.level < 3
            )
            SELECT level, COUNT(*) as count
            FROM referral_tree
            GROUP BY level
            ORDER BY level`,
            [userId]
        );

        return {
            funnel: funnel.rows[0],
            sources: sources.rows,
            timeline: timeline.rows,
            networkEffect: networkEffect.rows,
            conversionRate: funnel.rows[0].total_referrals > 0 
                ? (funnel.rows[0].converted / funnel.rows[0].total_referrals * 100).toFixed(2)
                : 0
        };
    }

    async trackSocialShare(userId, platform, content, referralCode) {
        try {
            await this.db.query(
                `INSERT INTO referral_events (event_type, event_data)
                 VALUES ('social_share', $1)`,
                [JSON.stringify({ userId, platform, referralCode })]
            );

            const baseUrl = process.env.BASE_URL || 'https://datasense.ai';
            const shareUrl = `${baseUrl}/signup?ref=${referralCode}&utm_source=${platform}&utm_medium=social&utm_campaign=referral_share`;

            return shareUrl;
        } catch (error) {
            console.error('Error tracking social share:', error);
            throw error;
        }
    }

    async getViralCoefficient(userId) {
        const result = await this.db.query(
            `WITH user_referrals AS (
                SELECT 
                    r1.referee_id,
                    COUNT(r2.id) as secondary_referrals
                FROM referrals r1
                LEFT JOIN referrals r2 ON r1.referee_id = r2.referrer_id AND r2.status = 'converted'
                WHERE r1.referrer_id = $1 AND r1.status = 'converted'
                GROUP BY r1.referee_id
            )
            SELECT 
                COUNT(*) as direct_referrals,
                SUM(secondary_referrals) as indirect_referrals,
                CASE WHEN COUNT(*) > 0 
                    THEN ROUND(SUM(secondary_referrals)::numeric / COUNT(*)::numeric, 2)
                    ELSE 0 
                END as viral_coefficient
            FROM user_referrals`,
            [userId]
        );

        return result.rows[0];
    }
}

module.exports = ReferralTracker;