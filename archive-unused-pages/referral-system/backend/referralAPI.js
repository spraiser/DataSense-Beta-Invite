const express = require('express');
const router = express.Router();
const ReferralCodeManager = require('./referralCodeManager');
const ReferralTracker = require('./referralTracker');
const RewardEngine = require('./rewardEngine');

module.exports = (db) => {
    const codeManager = new ReferralCodeManager(db);
    const tracker = new ReferralTracker(db);
    const rewardEngine = new RewardEngine(db);

    router.post('/create-code', async (req, res) => {
        try {
            const { userId, customCode } = req.body;
            
            if (!userId) {
                return res.status(400).json({ error: 'User ID is required' });
            }

            const profile = await codeManager.createReferralCode(userId, customCode);
            const links = codeManager.generatePersonalizedLinks(
                profile.referral_code,
                req.body.userName || 'user'
            );

            res.json({
                success: true,
                profile,
                links
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    router.get('/profile/:userId', async (req, res) => {
        try {
            const profile = await codeManager.getReferralProfile(req.params.userId);
            
            if (!profile) {
                return res.status(404).json({ error: 'Referral profile not found' });
            }

            const referrals = await tracker.getUserReferrals(req.params.userId);
            const rewards = await rewardEngine.getUserRewards(req.params.userId);
            const badges = await tracker.getUserBadges(req.params.userId);

            res.json({
                profile,
                referrals,
                rewards,
                badges,
                links: codeManager.generatePersonalizedLinks(
                    profile.referral_code,
                    'user'
                )
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    router.post('/track', async (req, res) => {
        try {
            const {
                referralCode,
                refereeEmail,
                source,
                utm_source,
                utm_medium,
                utm_campaign,
                ipAddress,
                userAgent
            } = req.body;

            if (!referralCode || !refereeEmail) {
                return res.status(400).json({ 
                    error: 'Referral code and referee email are required' 
                });
            }

            const referral = await tracker.trackReferral({
                referralCode,
                refereeEmail,
                source: source || utm_source,
                utm_source,
                utm_medium,
                utm_campaign,
                ipAddress,
                userAgent
            });

            await tracker.logEvent(referral.id, 'referral_initiated', {
                source,
                utm_params: { utm_source, utm_medium, utm_campaign }
            });

            res.json({
                success: true,
                referralId: referral.id,
                message: 'Referral tracked successfully'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    router.post('/convert/:referralId', async (req, res) => {
        try {
            const { refereeId, conversionValue } = req.body;
            
            const referral = await tracker.convertReferral(
                req.params.referralId,
                refereeId,
                conversionValue
            );

            const rewards = await rewardEngine.calculateAndAwardRewards(referral);

            await tracker.logEvent(req.params.referralId, 'referral_converted', {
                refereeId,
                conversionValue,
                rewards
            });

            const referrerProfile = await codeManager.checkAndUpdateChampionStatus(
                referral.referrer_id
            );

            res.json({
                success: true,
                referral,
                rewards,
                championUpgrade: referrerProfile.upgraded
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    router.get('/leaderboard', async (req, res) => {
        try {
            const { limit = 10, offset = 0, period = 'all' } = req.query;
            
            const leaderboard = await tracker.getLeaderboard(
                parseInt(limit),
                parseInt(offset),
                period
            );

            res.json({
                leaderboard,
                period
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    router.get('/analytics/:userId', async (req, res) => {
        try {
            const { startDate, endDate } = req.query;
            
            const analytics = await tracker.getReferralAnalytics(
                req.params.userId,
                startDate,
                endDate
            );

            res.json(analytics);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    router.post('/reward/redeem/:rewardId', async (req, res) => {
        try {
            const { userId } = req.body;
            
            const reward = await rewardEngine.redeemReward(
                req.params.rewardId,
                userId
            );

            res.json({
                success: true,
                reward,
                message: 'Reward redeemed successfully'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    router.post('/share', async (req, res) => {
        try {
            const { userId, platform, content, referralCode } = req.body;
            
            const shareLink = await tracker.trackSocialShare(
                userId,
                platform,
                content,
                referralCode
            );

            res.json({
                success: true,
                shareLink,
                message: `Shared on ${platform} successfully`
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    router.get('/validate/:code', async (req, res) => {
        try {
            const referralProfile = await codeManager.getReferralByCode(
                req.params.code
            );

            if (!referralProfile) {
                return res.status(404).json({
                    valid: false,
                    error: 'Invalid referral code'
                });
            }

            res.json({
                valid: true,
                referrerId: referralProfile.user_id,
                code: req.params.code
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    router.post('/batch-invite', async (req, res) => {
        try {
            const { userId, emails, personalMessage } = req.body;
            
            if (!userId || !emails || !Array.isArray(emails)) {
                return res.status(400).json({
                    error: 'User ID and email list are required'
                });
            }

            const profile = await codeManager.getReferralProfile(userId);
            const results = [];

            for (const email of emails) {
                try {
                    const referral = await tracker.trackReferral({
                        referralCode: profile.referral_code,
                        refereeEmail: email,
                        source: 'batch_invite'
                    });

                    results.push({
                        email,
                        success: true,
                        referralId: referral.id
                    });
                } catch (error) {
                    results.push({
                        email,
                        success: false,
                        error: error.message
                    });
                }
            }

            res.json({
                success: true,
                invited: results.filter(r => r.success).length,
                failed: results.filter(r => !r.success).length,
                results
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    router.put('/settings/:userId', async (req, res) => {
        try {
            const { leaderboardOptIn, emailNotifications } = req.body;
            
            if (leaderboardOptIn !== undefined) {
                await codeManager.toggleLeaderboardOptIn(
                    req.params.userId,
                    leaderboardOptIn
                );
            }

            res.json({
                success: true,
                message: 'Settings updated successfully'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    return router;
};