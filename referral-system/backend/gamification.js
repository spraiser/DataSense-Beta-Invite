class GamificationEngine {
    constructor(db) {
        this.db = db;
        this.initializeChallenges();
        this.initializeAchievements();
    }

    initializeChallenges() {
        this.challenges = {
            daily: [
                {
                    id: 'daily_share',
                    name: 'Daily Sharer',
                    description: 'Share your referral link on any platform',
                    requirement: 1,
                    points: 10,
                    type: 'share'
                },
                {
                    id: 'daily_invite',
                    name: 'Daily Inviter',
                    description: 'Send at least one referral invitation',
                    requirement: 1,
                    points: 15,
                    type: 'invite'
                }
            ],
            weekly: [
                {
                    id: 'weekly_referrals',
                    name: 'Weekly Warrior',
                    description: 'Get 3 referrals this week',
                    requirement: 3,
                    points: 100,
                    type: 'referral'
                },
                {
                    id: 'weekly_conversion',
                    name: 'Conversion Master',
                    description: 'Convert at least 1 referral this week',
                    requirement: 1,
                    points: 200,
                    type: 'conversion'
                },
                {
                    id: 'social_butterfly',
                    name: 'Social Butterfly',
                    description: 'Share on 3 different platforms this week',
                    requirement: 3,
                    points: 75,
                    type: 'multi_platform'
                }
            ],
            monthly: [
                {
                    id: 'monthly_champion',
                    name: 'Monthly Champion',
                    description: 'Be in top 10 of leaderboard',
                    requirement: 10,
                    points: 500,
                    type: 'leaderboard'
                },
                {
                    id: 'consistency_king',
                    name: 'Consistency King',
                    description: 'Maintain referral activity for 30 days',
                    requirement: 30,
                    points: 300,
                    type: 'streak'
                }
            ],
            special: [
                {
                    id: 'viral_effect',
                    name: 'Viral Effect',
                    description: 'Your referrals make their own referrals',
                    requirement: 3,
                    points: 1000,
                    type: 'network'
                },
                {
                    id: 'industry_leader',
                    name: 'Industry Leader',
                    description: 'Refer 5 businesses from same industry',
                    requirement: 5,
                    points: 750,
                    type: 'industry'
                }
            ]
        };
    }

    initializeAchievements() {
        this.achievements = {
            referralMilestones: [
                { count: 1, badge: 'First Steps', points: 50, icon: '👶' },
                { count: 5, badge: 'Rising Star', points: 150, icon: '⭐' },
                { count: 10, badge: 'Referral Pro', points: 300, icon: '💫' },
                { count: 25, badge: 'Master Referrer', points: 750, icon: '🌟' },
                { count: 50, badge: 'Legendary', points: 2000, icon: '🏆' },
                { count: 100, badge: 'Hall of Fame', points: 5000, icon: '👑' }
            ],
            streaks: [
                { days: 7, badge: 'Week Warrior', points: 100, icon: '🔥' },
                { days: 30, badge: 'Monthly Master', points: 500, icon: '🎯' },
                { days: 90, badge: 'Quarter Champion', points: 1500, icon: '💪' },
                { days: 365, badge: 'Year Legend', points: 10000, icon: '🚀' }
            ],
            special: [
                { id: 'early_bird', name: 'Early Bird', condition: 'first_100_users', points: 250, icon: '🌅' },
                { id: 'comeback_kid', name: 'Comeback Kid', condition: 'reactivated_after_30_days', points: 200, icon: '🔄' },
                { id: 'helper', name: 'Community Helper', condition: 'helped_5_referrals', points: 300, icon: '🤝' },
                { id: 'influencer', name: 'Influencer', condition: '1000_clicks', points: 1000, icon: '📣' }
            ]
        };
    }

    async checkAndAwardAchievements(userId) {
        const achievements = [];
        
        const milestoneAchievements = await this.checkMilestoneAchievements(userId);
        achievements.push(...milestoneAchievements);
        
        const streakAchievements = await this.checkStreakAchievements(userId);
        achievements.push(...streakAchievements);
        
        const challengeCompletions = await this.checkChallenges(userId);
        achievements.push(...challengeCompletions);
        
        const specialAchievements = await this.checkSpecialAchievements(userId);
        achievements.push(...specialAchievements);
        
        if (achievements.length > 0) {
            await this.awardPoints(userId, achievements);
            await this.updateLevel(userId);
        }
        
        return achievements;
    }

    async checkMilestoneAchievements(userId) {
        const profile = await this.db.query(
            'SELECT successful_referrals FROM referral_profiles WHERE user_id = $1',
            [userId]
        );
        
        if (!profile.rows.length) return [];
        
        const referralCount = profile.rows[0].successful_referrals;
        const achievements = [];
        
        for (const milestone of this.achievements.referralMilestones) {
            if (referralCount >= milestone.count) {
                const exists = await this.achievementExists(userId, `milestone_${milestone.count}`);
                if (!exists) {
                    achievements.push({
                        type: 'milestone',
                        name: milestone.badge,
                        points: milestone.points,
                        icon: milestone.icon,
                        achievement_id: `milestone_${milestone.count}`
                    });
                }
            }
        }
        
        return achievements;
    }

    async checkStreakAchievements(userId) {
        const streak = await this.calculateStreak(userId);
        const achievements = [];
        
        for (const streakAchievement of this.achievements.streaks) {
            if (streak >= streakAchievement.days) {
                const exists = await this.achievementExists(userId, `streak_${streakAchievement.days}`);
                if (!exists) {
                    achievements.push({
                        type: 'streak',
                        name: streakAchievement.badge,
                        points: streakAchievement.points,
                        icon: streakAchievement.icon,
                        achievement_id: `streak_${streakAchievement.days}`
                    });
                }
            }
        }
        
        return achievements;
    }

    async calculateStreak(userId) {
        const result = await this.db.query(`
            WITH daily_activity AS (
                SELECT DATE(created_at) as activity_date
                FROM referral_events
                WHERE event_data->>'userId' = $1
                GROUP BY DATE(created_at)
                ORDER BY activity_date DESC
            ),
            streak_calc AS (
                SELECT 
                    activity_date,
                    activity_date - INTERVAL '1 day' * ROW_NUMBER() OVER (ORDER BY activity_date DESC) as streak_group
                FROM daily_activity
            )
            SELECT COUNT(*) as streak_length
            FROM streak_calc
            WHERE streak_group = (SELECT MAX(streak_group) FROM streak_calc)
        `, [userId]);
        
        return result.rows[0]?.streak_length || 0;
    }

    async checkChallenges(userId) {
        const achievements = [];
        const today = new Date();
        
        const dailyProgress = await this.getDailyChallengeProgress(userId);
        for (const challenge of this.challenges.daily) {
            if (dailyProgress[challenge.type] >= challenge.requirement) {
                const exists = await this.challengeCompletedToday(userId, challenge.id);
                if (!exists) {
                    achievements.push({
                        type: 'daily_challenge',
                        name: challenge.name,
                        points: challenge.points,
                        achievement_id: `${challenge.id}_${today.toISOString().split('T')[0]}`
                    });
                }
            }
        }
        
        const weeklyProgress = await this.getWeeklyChallengeProgress(userId);
        for (const challenge of this.challenges.weekly) {
            if (weeklyProgress[challenge.type] >= challenge.requirement) {
                const weekNumber = this.getWeekNumber(today);
                const exists = await this.challengeCompletedThisWeek(userId, challenge.id, weekNumber);
                if (!exists) {
                    achievements.push({
                        type: 'weekly_challenge',
                        name: challenge.name,
                        points: challenge.points,
                        achievement_id: `${challenge.id}_week_${weekNumber}`
                    });
                }
            }
        }
        
        return achievements;
    }

    async getDailyChallengeProgress(userId) {
        const result = await this.db.query(`
            SELECT 
                COUNT(CASE WHEN event_type = 'social_share' THEN 1 END) as share,
                COUNT(CASE WHEN event_type = 'referral_initiated' THEN 1 END) as invite
            FROM referral_events
            WHERE event_data->>'userId' = $1
            AND DATE(created_at) = CURRENT_DATE
        `, [userId]);
        
        return result.rows[0] || { share: 0, invite: 0 };
    }

    async getWeeklyChallengeProgress(userId) {
        const result = await this.db.query(`
            SELECT 
                COUNT(DISTINCT CASE WHEN r.created_at > CURRENT_DATE - INTERVAL '7 days' THEN r.id END) as referral,
                COUNT(DISTINCT CASE WHEN r.status = 'converted' AND r.conversion_date > CURRENT_DATE - INTERVAL '7 days' THEN r.id END) as conversion,
                COUNT(DISTINCT CASE WHEN re.event_type = 'social_share' THEN re.event_data->>'platform' END) as multi_platform
            FROM referral_profiles rp
            LEFT JOIN referrals r ON rp.user_id = r.referrer_id
            LEFT JOIN referral_events re ON re.event_data->>'userId' = $1::text
            WHERE rp.user_id = $1
        `, [userId]);
        
        return result.rows[0] || { referral: 0, conversion: 0, multi_platform: 0 };
    }

    async checkSpecialAchievements(userId) {
        const achievements = [];
        
        const networkEffect = await this.checkNetworkEffect(userId);
        if (networkEffect >= 3) {
            const exists = await this.achievementExists(userId, 'viral_effect');
            if (!exists) {
                achievements.push({
                    type: 'special',
                    name: 'Viral Effect',
                    points: 1000,
                    icon: '🔄',
                    achievement_id: 'viral_effect'
                });
            }
        }
        
        const industryLeader = await this.checkIndustryLeader(userId);
        if (industryLeader) {
            const exists = await this.achievementExists(userId, 'industry_leader');
            if (!exists) {
                achievements.push({
                    type: 'special',
                    name: 'Industry Leader',
                    points: 750,
                    icon: '🏢',
                    achievement_id: 'industry_leader'
                });
            }
        }
        
        return achievements;
    }

    async checkNetworkEffect(userId) {
        const result = await this.db.query(`
            WITH first_degree AS (
                SELECT referee_id 
                FROM referrals 
                WHERE referrer_id = $1 AND status = 'converted'
            )
            SELECT COUNT(DISTINCT r.id) as second_degree_count
            FROM referrals r
            JOIN first_degree fd ON r.referrer_id = fd.referee_id
            WHERE r.status = 'converted'
        `, [userId]);
        
        return result.rows[0]?.second_degree_count || 0;
    }

    async checkIndustryLeader(userId) {
        const result = await this.db.query(`
            SELECT industry, COUNT(*) as count
            FROM referrals r
            JOIN users u ON r.referee_id = u.id
            WHERE r.referrer_id = $1 AND r.status = 'converted'
            GROUP BY industry
            HAVING COUNT(*) >= 5
            LIMIT 1
        `, [userId]);
        
        return result.rows.length > 0;
    }

    async achievementExists(userId, achievementId) {
        const result = await this.db.query(
            'SELECT 1 FROM user_achievements WHERE user_id = $1 AND achievement_id = $2',
            [userId, achievementId]
        );
        return result.rows.length > 0;
    }

    async challengeCompletedToday(userId, challengeId) {
        const result = await this.db.query(
            `SELECT 1 FROM user_achievements 
             WHERE user_id = $1 AND achievement_id = $2 
             AND DATE(earned_at) = CURRENT_DATE`,
            [userId, `${challengeId}_${new Date().toISOString().split('T')[0]}`]
        );
        return result.rows.length > 0;
    }

    async challengeCompletedThisWeek(userId, challengeId, weekNumber) {
        const result = await this.db.query(
            `SELECT 1 FROM user_achievements 
             WHERE user_id = $1 AND achievement_id = $2`,
            [userId, `${challengeId}_week_${weekNumber}`]
        );
        return result.rows.length > 0;
    }

    async awardPoints(userId, achievements) {
        const totalPoints = achievements.reduce((sum, a) => sum + a.points, 0);
        
        await this.db.query(
            `UPDATE referral_profiles 
             SET gamification_points = COALESCE(gamification_points, 0) + $2,
                 updated_at = CURRENT_TIMESTAMP
             WHERE user_id = $1`,
            [userId, totalPoints]
        );
        
        for (const achievement of achievements) {
            await this.db.query(
                `INSERT INTO user_achievements (user_id, achievement_id, achievement_type, points, earned_at)
                 VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
                 ON CONFLICT DO NOTHING`,
                [userId, achievement.achievement_id, achievement.type, achievement.points]
            );
        }
        
        return totalPoints;
    }

    async updateLevel(userId) {
        const result = await this.db.query(
            'SELECT gamification_points FROM referral_profiles WHERE user_id = $1',
            [userId]
        );
        
        if (!result.rows.length) return;
        
        const points = result.rows[0].gamification_points || 0;
        const level = this.calculateLevel(points);
        
        await this.db.query(
            `UPDATE referral_profiles 
             SET gamification_level = $2, updated_at = CURRENT_TIMESTAMP
             WHERE user_id = $1`,
            [userId, level]
        );
        
        return level;
    }

    calculateLevel(points) {
        const levels = [
            { threshold: 0, level: 1, title: 'Beginner' },
            { threshold: 100, level: 2, title: 'Apprentice' },
            { threshold: 300, level: 3, title: 'Contributor' },
            { threshold: 600, level: 4, title: 'Advocate' },
            { threshold: 1000, level: 5, title: 'Expert' },
            { threshold: 1500, level: 6, title: 'Master' },
            { threshold: 2500, level: 7, title: 'Champion' },
            { threshold: 4000, level: 8, title: 'Legend' },
            { threshold: 6000, level: 9, title: 'Icon' },
            { threshold: 10000, level: 10, title: 'Hall of Fame' }
        ];
        
        for (let i = levels.length - 1; i >= 0; i--) {
            if (points >= levels[i].threshold) {
                return levels[i];
            }
        }
        
        return levels[0];
    }

    async getLeaderboardWithGamification(limit = 10, period = 'all') {
        let dateFilter = '';
        if (period === 'month') {
            dateFilter = "AND ua.earned_at >= DATE_TRUNC('month', CURRENT_DATE)";
        } else if (period === 'week') {
            dateFilter = "AND ua.earned_at >= DATE_TRUNC('week', CURRENT_DATE)";
        }
        
        const result = await this.db.query(`
            SELECT 
                rp.user_id,
                rp.referral_code,
                rp.successful_referrals,
                rp.gamification_points,
                rp.gamification_level,
                COUNT(DISTINCT ua.achievement_id) as achievement_count,
                COALESCE(SUM(CASE WHEN ua.earned_at IS NOT NULL ${dateFilter} THEN ua.points ELSE 0 END), 0) as period_points,
                RANK() OVER (ORDER BY COALESCE(SUM(CASE WHEN ua.earned_at IS NOT NULL ${dateFilter} THEN ua.points ELSE 0 END), 0) DESC) as rank
            FROM referral_profiles rp
            LEFT JOIN user_achievements ua ON rp.user_id = ua.user_id
            WHERE rp.leaderboard_opt_in = true
            GROUP BY rp.user_id, rp.referral_code, rp.successful_referrals, 
                     rp.gamification_points, rp.gamification_level
            ORDER BY period_points DESC
            LIMIT $1
        `, [limit]);
        
        return result.rows;
    }

    getWeekNumber(date) {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }

    async createCompetition(name, startDate, endDate, prizes) {
        const result = await this.db.query(
            `INSERT INTO competitions (name, start_date, end_date, prizes, status)
             VALUES ($1, $2, $3, $4, 'active')
             RETURNING *`,
            [name, startDate, endDate, JSON.stringify(prizes)]
        );
        
        return result.rows[0];
    }

    async getActiveCompetitions() {
        const result = await this.db.query(
            `SELECT * FROM competitions 
             WHERE status = 'active' 
             AND start_date <= CURRENT_DATE 
             AND end_date >= CURRENT_DATE`
        );
        
        return result.rows;
    }
}

module.exports = GamificationEngine;