class RewardEngine {
    constructor(db) {
        this.db = db;
        this.rewardRules = {
            referrer: {
                perReferral: 500,
                milestones: {
                    3: { type: 'free_month', value: 1, description: '1 month free subscription' },
                    5: { type: 'champion_status', value: null, description: 'DataSense Champion status' },
                    10: { type: 'conference_ticket', value: 1000, description: 'Conference ticket + case study feature' }
                }
            },
            referee: {
                signup: { type: 'discount', value: 20, description: '20% off first 3 months' },
                trial: { type: 'extended_trial', value: 30, description: '30-day extended trial' },
                community: { type: 'community_access', value: null, description: 'Friends of DataSense Slack community' }
            }
        };
    }

    async calculateAndAwardRewards(referral) {
        const rewards = [];

        try {
            const referrerReward = await this.awardReferrerReward(
                referral.referrer_id,
                referral.id,
                referral.referral_value
            );
            rewards.push(referrerReward);

            const milestoneRewards = await this.checkAndAwardMilestones(
                referral.referrer_id
            );
            rewards.push(...milestoneRewards);

            if (referral.referee_id) {
                const refereeRewards = await this.awardRefereeRewards(
                    referral.referee_id,
                    referral.id
                );
                rewards.push(...refereeRewards);
            }

            return rewards;
        } catch (error) {
            console.error('Error calculating rewards:', error);
            throw error;
        }
    }

    async awardReferrerReward(userId, referralId, referralValue) {
        const rewardAmount = this.rewardRules.referrer.perReferral;
        
        const result = await this.db.query(
            `INSERT INTO rewards (
                user_id, referral_id, reward_type, reward_value,
                reward_description, status
            ) VALUES ($1, $2, 'credit', $3, $4, 'earned')
            RETURNING *`,
            [
                userId,
                referralId,
                rewardAmount,
                `$${rewardAmount} credit for successful referral`
            ]
        );

        await this.db.query(
            `UPDATE referral_profiles 
             SET total_rewards_earned = total_rewards_earned + $2
             WHERE user_id = $1`,
            [userId, rewardAmount]
        );

        return result.rows[0];
    }

    async checkAndAwardMilestones(userId) {
        const profile = await this.db.query(
            `SELECT successful_referrals 
             FROM referral_profiles 
             WHERE user_id = $1`,
            [userId]
        );

        if (!profile.rows.length) return [];

        const referralCount = profile.rows[0].successful_referrals;
        const milestones = this.rewardRules.referrer.milestones;
        const rewards = [];

        for (const [count, reward] of Object.entries(milestones)) {
            if (referralCount == count) {
                const existingReward = await this.db.query(
                    `SELECT id FROM rewards 
                     WHERE user_id = $1 AND reward_type = $2`,
                    [userId, reward.type]
                );

                if (!existingReward.rows.length) {
                    const result = await this.db.query(
                        `INSERT INTO rewards (
                            user_id, reward_type, reward_value,
                            reward_description, status
                        ) VALUES ($1, $2, $3, $4, 'earned')
                        RETURNING *`,
                        [
                            userId,
                            reward.type,
                            reward.value,
                            reward.description
                        ]
                    );
                    rewards.push(result.rows[0]);

                    if (reward.type === 'champion_status') {
                        await this.db.query(
                            `UPDATE referral_profiles 
                             SET champion_status = 'champion'
                             WHERE user_id = $1`,
                            [userId]
                        );
                    }
                }
            }
        }

        return rewards;
    }

    async awardRefereeRewards(refereeId, referralId) {
        const rewards = [];
        const refereeRewardRules = this.rewardRules.referee;

        for (const [key, reward] of Object.entries(refereeRewardRules)) {
            const result = await this.db.query(
                `INSERT INTO rewards (
                    user_id, referral_id, reward_type, reward_value,
                    reward_description, status, expires_at
                ) VALUES ($1, $2, $3, $4, $5, 'available', $6)
                RETURNING *`,
                [
                    refereeId,
                    referralId,
                    reward.type,
                    reward.value,
                    reward.description,
                    reward.type === 'discount' 
                        ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
                        : null
                ]
            );
            rewards.push(result.rows[0]);
        }

        return rewards;
    }

    async getUserRewards(userId) {
        const result = await this.db.query(
            `SELECT r.*, ref.referee_email, ref.conversion_date
             FROM rewards r
             LEFT JOIN referrals ref ON r.referral_id = ref.id
             WHERE r.user_id = $1
             ORDER BY r.created_at DESC`,
            [userId]
        );
        
        return this.categorizeRewards(result.rows);
    }

    categorizeRewards(rewards) {
        return {
            available: rewards.filter(r => r.status === 'available'),
            earned: rewards.filter(r => r.status === 'earned'),
            redeemed: rewards.filter(r => r.status === 'redeemed'),
            expired: rewards.filter(r => r.status === 'expired' || 
                (r.expires_at && new Date(r.expires_at) < new Date())),
            total: {
                credits: rewards
                    .filter(r => r.reward_type === 'credit' && r.status === 'earned')
                    .reduce((sum, r) => sum + parseFloat(r.reward_value || 0), 0),
                freeMonths: rewards
                    .filter(r => r.reward_type === 'free_month' && r.status !== 'redeemed')
                    .reduce((sum, r) => sum + parseFloat(r.reward_value || 0), 0)
            }
        };
    }

    async redeemReward(rewardId, userId) {
        try {
            const reward = await this.db.query(
                `SELECT * FROM rewards 
                 WHERE id = $1 AND user_id = $2 AND status IN ('available', 'earned')`,
                [rewardId, userId]
            );

            if (!reward.rows.length) {
                throw new Error('Reward not found or already redeemed');
            }

            if (reward.rows[0].expires_at && new Date(reward.rows[0].expires_at) < new Date()) {
                await this.db.query(
                    `UPDATE rewards SET status = 'expired' WHERE id = $1`,
                    [rewardId]
                );
                throw new Error('Reward has expired');
            }

            const result = await this.db.query(
                `UPDATE rewards 
                 SET status = 'redeemed', redeemed_at = CURRENT_TIMESTAMP
                 WHERE id = $1
                 RETURNING *`,
                [rewardId]
            );

            await this.processRedemption(result.rows[0]);

            return result.rows[0];
        } catch (error) {
            console.error('Error redeeming reward:', error);
            throw error;
        }
    }

    async processRedemption(reward) {
        switch (reward.reward_type) {
            case 'credit':
                console.log(`Apply $${reward.reward_value} credit to user account`);
                break;
            case 'free_month':
                console.log(`Extend subscription by ${reward.reward_value} month(s)`);
                break;
            case 'discount':
                console.log(`Apply ${reward.reward_value}% discount to subscription`);
                break;
            case 'extended_trial':
                console.log(`Extend trial period to ${reward.reward_value} days`);
                break;
            case 'conference_ticket':
                console.log(`Issue conference ticket worth $${reward.reward_value}`);
                break;
            case 'community_access':
                console.log(`Grant access to exclusive Slack community`);
                break;
        }
    }

    async getRewardsSummary(startDate, endDate) {
        const dateFilter = startDate && endDate
            ? 'WHERE created_at BETWEEN $1 AND $2'
            : '';
        
        const params = startDate && endDate ? [startDate, endDate] : [];

        const summary = await this.db.query(
            `SELECT 
                reward_type,
                COUNT(*) as count,
                SUM(CASE WHEN reward_value IS NOT NULL THEN reward_value ELSE 0 END) as total_value,
                COUNT(CASE WHEN status = 'redeemed' THEN 1 END) as redeemed_count,
                COUNT(CASE WHEN status = 'expired' THEN 1 END) as expired_count
             FROM rewards
             ${dateFilter}
             GROUP BY reward_type`,
            params
        );

        const totalCost = await this.db.query(
            `SELECT 
                SUM(CASE WHEN reward_type = 'credit' AND status = 'earned' 
                    THEN reward_value ELSE 0 END) as total_credits,
                COUNT(CASE WHEN reward_type = 'free_month' AND status = 'redeemed' 
                    THEN 1 END) as free_months_redeemed
             FROM rewards
             ${dateFilter}`,
            params
        );

        return {
            byType: summary.rows,
            totalCost: totalCost.rows[0],
            redemptionRate: await this.calculateRedemptionRate(params)
        };
    }

    async calculateRedemptionRate(params = []) {
        const result = await this.db.query(
            `SELECT 
                COUNT(*) as total_rewards,
                COUNT(CASE WHEN status = 'redeemed' THEN 1 END) as redeemed,
                ROUND(100.0 * COUNT(CASE WHEN status = 'redeemed' THEN 1 END) / 
                    NULLIF(COUNT(*), 0), 2) as redemption_rate
             FROM rewards
             WHERE status IN ('available', 'earned', 'redeemed')`,
            params
        );
        return result.rows[0];
    }

    async automatedRewardReminders() {
        const expiringRewards = await this.db.query(
            `SELECT r.*, rp.user_id as referrer_id
             FROM rewards r
             JOIN referral_profiles rp ON r.user_id = rp.user_id
             WHERE r.status IN ('available', 'earned')
             AND r.expires_at IS NOT NULL
             AND r.expires_at BETWEEN CURRENT_TIMESTAMP AND CURRENT_TIMESTAMP + INTERVAL '7 days'`
        );

        for (const reward of expiringRewards.rows) {
            console.log(`Send reminder email for expiring reward: ${reward.id}`);
        }

        return expiringRewards.rows;
    }

    async calculateROI(userId) {
        const result = await this.db.query(
            `WITH referral_metrics AS (
                SELECT 
                    COUNT(*) as total_referrals,
                    COUNT(CASE WHEN status = 'converted' THEN 1 END) as conversions,
                    SUM(CASE WHEN status = 'converted' THEN referral_value ELSE 0 END) as revenue
                FROM referrals
                WHERE referrer_id = $1
            ),
            reward_metrics AS (
                SELECT 
                    SUM(CASE WHEN reward_type = 'credit' THEN reward_value ELSE 0 END) as credits_earned,
                    COUNT(CASE WHEN reward_type = 'free_month' THEN 1 END) as free_months
                FROM rewards
                WHERE user_id = $1 AND status IN ('earned', 'redeemed')
            )
            SELECT 
                rm.total_referrals,
                rm.conversions,
                rm.revenue,
                rw.credits_earned,
                rw.free_months,
                CASE WHEN rw.credits_earned > 0 
                    THEN ROUND((rm.revenue - rw.credits_earned) / rw.credits_earned * 100, 2)
                    ELSE 0 
                END as roi_percentage
            FROM referral_metrics rm, reward_metrics rw`,
            [userId]
        );

        return result.rows[0];
    }
}

module.exports = RewardEngine;