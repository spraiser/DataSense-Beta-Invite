const crypto = require('crypto');

class ReferralCodeManager {
    constructor(db) {
        this.db = db;
        this.codeLength = 8;
        this.codePrefix = 'DS';
    }

    generateUniqueCode() {
        const randomBytes = crypto.randomBytes(4).toString('hex').toUpperCase();
        return `${this.codePrefix}${randomBytes}`;
    }

    async createReferralCode(userId, customCode = null) {
        try {
            let referralCode = customCode;
            let attempts = 0;
            const maxAttempts = 10;

            if (!customCode) {
                while (attempts < maxAttempts) {
                    referralCode = this.generateUniqueCode();
                    const exists = await this.codeExists(referralCode);
                    if (!exists) break;
                    attempts++;
                }

                if (attempts === maxAttempts) {
                    throw new Error('Failed to generate unique referral code');
                }
            } else {
                referralCode = this.sanitizeCustomCode(customCode);
                const exists = await this.codeExists(referralCode);
                if (exists) {
                    throw new Error('Custom referral code already exists');
                }
            }

            const result = await this.db.query(
                `INSERT INTO referral_profiles (user_id, referral_code) 
                 VALUES ($1, $2) 
                 ON CONFLICT (user_id) 
                 DO UPDATE SET referral_code = $2, updated_at = CURRENT_TIMESTAMP
                 RETURNING *`,
                [userId, referralCode]
            );

            return result.rows[0];
        } catch (error) {
            console.error('Error creating referral code:', error);
            throw error;
        }
    }

    async codeExists(code) {
        const result = await this.db.query(
            'SELECT 1 FROM referral_profiles WHERE referral_code = $1',
            [code]
        );
        return result.rows.length > 0;
    }

    sanitizeCustomCode(code) {
        return code.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 12);
    }

    async getReferralProfile(userId) {
        const result = await this.db.query(
            `SELECT rp.*, 
                    COUNT(DISTINCT r.id) as total_referral_count,
                    COUNT(DISTINCT CASE WHEN r.status = 'converted' THEN r.id END) as successful_count,
                    COALESCE(SUM(rw.reward_value), 0) as total_rewards
             FROM referral_profiles rp
             LEFT JOIN referrals r ON rp.user_id = r.referrer_id
             LEFT JOIN rewards rw ON rp.user_id = rw.user_id AND rw.status = 'earned'
             WHERE rp.user_id = $1
             GROUP BY rp.user_id, rp.referral_code, rp.referral_status, 
                      rp.total_referrals, rp.successful_referrals, 
                      rp.total_rewards_earned, rp.champion_status, 
                      rp.leaderboard_opt_in, rp.created_at, rp.updated_at`,
            [userId]
        );
        return result.rows[0];
    }

    async getReferralByCode(code) {
        const result = await this.db.query(
            'SELECT * FROM referral_profiles WHERE referral_code = $1 AND referral_status = $2',
            [code, 'active']
        );
        return result.rows[0];
    }

    async updateReferralStatus(userId, status) {
        const result = await this.db.query(
            `UPDATE referral_profiles 
             SET referral_status = $2, updated_at = CURRENT_TIMESTAMP 
             WHERE user_id = $1 
             RETURNING *`,
            [userId, status]
        );
        return result.rows[0];
    }

    generateReferralLink(code, source = 'direct', medium = 'referral') {
        const baseUrl = process.env.BASE_URL || 'https://datasense.ai';
        const params = new URLSearchParams({
            ref: code,
            utm_source: source,
            utm_medium: medium,
            utm_campaign: 'referral_program'
        });
        return `${baseUrl}/signup?${params.toString()}`;
    }

    generatePersonalizedLinks(code, userName) {
        return {
            email: this.generateReferralLink(code, 'email', 'referral'),
            linkedin: this.generateReferralLink(code, 'linkedin', 'social'),
            twitter: this.generateReferralLink(code, 'twitter', 'social'),
            facebook: this.generateReferralLink(code, 'facebook', 'social'),
            direct: this.generateReferralLink(code, `${userName.toLowerCase().replace(/\s+/g, '_')}`, 'direct'),
            whatsapp: this.generateReferralLink(code, 'whatsapp', 'instant_message')
        };
    }

    async incrementReferralCount(userId, successful = false) {
        const column = successful ? 'successful_referrals' : 'total_referrals';
        const result = await this.db.query(
            `UPDATE referral_profiles 
             SET ${column} = ${column} + 1, updated_at = CURRENT_TIMESTAMP 
             WHERE user_id = $1 
             RETURNING *`,
            [userId]
        );
        return result.rows[0];
    }

    async checkAndUpdateChampionStatus(userId) {
        const profile = await this.getReferralProfile(userId);
        
        if (profile.successful_count >= 5 && profile.champion_status !== 'champion') {
            const result = await this.db.query(
                `UPDATE referral_profiles 
                 SET champion_status = 'champion', updated_at = CURRENT_TIMESTAMP 
                 WHERE user_id = $1 
                 RETURNING *`,
                [userId]
            );
            
            await this.awardBadge(userId, 'DataSense Champion');
            
            return { upgraded: true, profile: result.rows[0] };
        }
        
        return { upgraded: false, profile };
    }

    async awardBadge(userId, badgeName) {
        const badge = await this.db.query(
            'SELECT id FROM badges WHERE name = $1',
            [badgeName]
        );
        
        if (badge.rows.length > 0) {
            await this.db.query(
                'INSERT INTO user_badges (user_id, badge_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
                [userId, badge.rows[0].id]
            );
        }
    }

    async toggleLeaderboardOptIn(userId, optIn) {
        const result = await this.db.query(
            `UPDATE referral_profiles 
             SET leaderboard_opt_in = $2, updated_at = CURRENT_TIMESTAMP 
             WHERE user_id = $1 
             RETURNING *`,
            [userId, optIn]
        );
        return result.rows[0];
    }
}

module.exports = ReferralCodeManager;