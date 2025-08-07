class AnalyticsReporting {
    constructor(db) {
        this.db = db;
    }

    async generateComprehensiveReport(startDate, endDate) {
        const report = {
            overview: await this.getOverviewMetrics(startDate, endDate),
            funnel: await this.getFunnelAnalytics(startDate, endDate),
            performance: await this.getPerformanceMetrics(startDate, endDate),
            sources: await this.getSourceAnalytics(startDate, endDate),
            demographics: await this.getDemographicsAnalytics(startDate, endDate),
            rewards: await this.getRewardsAnalytics(startDate, endDate),
            viral: await this.getViralMetrics(startDate, endDate),
            trends: await this.getTrendAnalytics(startDate, endDate),
            predictions: await this.getPredictiveAnalytics(startDate, endDate),
            roi: await this.getROIAnalysis(startDate, endDate)
        };

        return report;
    }

    async getOverviewMetrics(startDate, endDate) {
        const dateFilter = this.getDateFilter(startDate, endDate);
        
        const result = await this.db.query(`
            WITH period_metrics AS (
                SELECT 
                    COUNT(DISTINCT r.id) as total_referrals,
                    COUNT(DISTINCT CASE WHEN r.status = 'converted' THEN r.id END) as conversions,
                    COUNT(DISTINCT r.referrer_id) as active_referrers,
                    AVG(CASE WHEN r.status = 'converted' 
                        THEN EXTRACT(EPOCH FROM (r.conversion_date - r.created_at))/86400 
                        END) as avg_conversion_time_days,
                    SUM(CASE WHEN r.status = 'converted' THEN r.referral_value ELSE 0 END) as total_revenue,
                    SUM(CASE WHEN rw.status = 'earned' THEN rw.reward_value ELSE 0 END) as total_rewards_cost
                FROM referrals r
                LEFT JOIN rewards rw ON r.id = rw.referral_id
                WHERE 1=1 ${dateFilter}
            ),
            previous_period AS (
                SELECT 
                    COUNT(DISTINCT r.id) as prev_referrals,
                    COUNT(DISTINCT CASE WHEN r.status = 'converted' THEN r.id END) as prev_conversions
                FROM referrals r
                WHERE r.created_at >= $1::date - INTERVAL '30 days' * 2
                AND r.created_at < $1::date - INTERVAL '30 days'
            )
            SELECT 
                pm.*,
                pp.prev_referrals,
                pp.prev_conversions,
                CASE WHEN pp.prev_referrals > 0 
                    THEN ROUND(((pm.total_referrals - pp.prev_referrals)::numeric / pp.prev_referrals) * 100, 2)
                    ELSE 0 
                END as referral_growth_rate,
                CASE WHEN pm.total_referrals > 0 
                    THEN ROUND((pm.conversions::numeric / pm.total_referrals) * 100, 2)
                    ELSE 0 
                END as conversion_rate,
                CASE WHEN pm.total_rewards_cost > 0 
                    THEN ROUND((pm.total_revenue - pm.total_rewards_cost) / pm.total_rewards_cost, 2)
                    ELSE 0 
                END as roi
            FROM period_metrics pm, previous_period pp
        `, [startDate, endDate]);

        return result.rows[0];
    }

    async getFunnelAnalytics(startDate, endDate) {
        const dateFilter = this.getDateFilter(startDate, endDate);
        
        const result = await this.db.query(`
            WITH funnel_stages AS (
                SELECT 
                    'Invited' as stage,
                    1 as stage_order,
                    COUNT(DISTINCT id) as count
                FROM referrals
                WHERE 1=1 ${dateFilter}
                
                UNION ALL
                
                SELECT 
                    'Clicked' as stage,
                    2 as stage_order,
                    COUNT(DISTINCT referral_id) as count
                FROM referral_events
                WHERE event_type = 'link_clicked' ${dateFilter}
                
                UNION ALL
                
                SELECT 
                    'Signed Up' as stage,
                    3 as stage_order,
                    COUNT(DISTINCT id) as count
                FROM referrals
                WHERE referee_id IS NOT NULL ${dateFilter}
                
                UNION ALL
                
                SELECT 
                    'Converted' as stage,
                    4 as stage_order,
                    COUNT(DISTINCT id) as count
                FROM referrals
                WHERE status = 'converted' ${dateFilter}
                
                UNION ALL
                
                SELECT 
                    'Retained' as stage,
                    5 as stage_order,
                    COUNT(DISTINCT referee_id) as count
                FROM referrals r
                JOIN users u ON r.referee_id = u.id
                WHERE r.status = 'converted' 
                AND u.last_active > u.created_at + INTERVAL '30 days'
                ${dateFilter}
            )
            SELECT 
                stage,
                count,
                LAG(count) OVER (ORDER BY stage_order) as previous_stage_count,
                CASE WHEN LAG(count) OVER (ORDER BY stage_order) > 0
                    THEN ROUND((count::numeric / LAG(count) OVER (ORDER BY stage_order)) * 100, 2)
                    ELSE 100
                END as conversion_from_previous
            FROM funnel_stages
            ORDER BY stage_order
        `, [startDate, endDate]);

        return result.rows;
    }

    async getPerformanceMetrics(startDate, endDate) {
        const dateFilter = this.getDateFilter(startDate, endDate);
        
        const result = await this.db.query(`
            SELECT 
                rp.user_id,
                rp.referral_code,
                u.name as referrer_name,
                COUNT(DISTINCT r.id) as total_referrals,
                COUNT(DISTINCT CASE WHEN r.status = 'converted' THEN r.id END) as conversions,
                ROUND(AVG(CASE WHEN r.status = 'converted' 
                    THEN EXTRACT(EPOCH FROM (r.conversion_date - r.created_at))/86400 
                    END), 2) as avg_conversion_days,
                SUM(CASE WHEN r.status = 'converted' THEN r.referral_value ELSE 0 END) as revenue_generated,
                SUM(rw.reward_value) as rewards_earned,
                COUNT(DISTINCT r.utm_source) as traffic_sources_used,
                MAX(r.created_at) as last_referral_date,
                CASE WHEN COUNT(DISTINCT r.id) > 0 
                    THEN ROUND((COUNT(DISTINCT CASE WHEN r.status = 'converted' THEN r.id END)::numeric / 
                               COUNT(DISTINCT r.id)) * 100, 2)
                    ELSE 0 
                END as personal_conversion_rate
            FROM referral_profiles rp
            JOIN users u ON rp.user_id = u.id
            LEFT JOIN referrals r ON rp.user_id = r.referrer_id ${dateFilter}
            LEFT JOIN rewards rw ON rp.user_id = rw.user_id AND rw.status = 'earned'
            GROUP BY rp.user_id, rp.referral_code, u.name
            HAVING COUNT(DISTINCT r.id) > 0
            ORDER BY conversions DESC, total_referrals DESC
            LIMIT 20
        `, [startDate, endDate]);

        return result.rows;
    }

    async getSourceAnalytics(startDate, endDate) {
        const dateFilter = this.getDateFilter(startDate, endDate);
        
        const result = await this.db.query(`
            WITH source_metrics AS (
                SELECT 
                    COALESCE(utm_source, source, 'direct') as traffic_source,
                    COALESCE(utm_medium, 'referral') as medium,
                    COUNT(DISTINCT id) as referrals,
                    COUNT(DISTINCT CASE WHEN status = 'converted' THEN id END) as conversions,
                    AVG(CASE WHEN status = 'converted' THEN referral_value END) as avg_value,
                    AVG(CASE WHEN status = 'converted' 
                        THEN EXTRACT(EPOCH FROM (conversion_date - created_at))/86400 
                        END) as avg_conversion_time
                FROM referrals
                WHERE 1=1 ${dateFilter}
                GROUP BY COALESCE(utm_source, source, 'direct'), COALESCE(utm_medium, 'referral')
            )
            SELECT 
                traffic_source,
                medium,
                referrals,
                conversions,
                ROUND(avg_value::numeric, 2) as avg_value,
                ROUND(avg_conversion_time::numeric, 2) as avg_conversion_days,
                CASE WHEN referrals > 0 
                    THEN ROUND((conversions::numeric / referrals) * 100, 2)
                    ELSE 0 
                END as conversion_rate,
                RANK() OVER (ORDER BY conversions DESC) as performance_rank
            FROM source_metrics
            ORDER BY conversions DESC, referrals DESC
        `, [startDate, endDate]);

        return result.rows;
    }

    async getDemographicsAnalytics(startDate, endDate) {
        const dateFilter = this.getDateFilter(startDate, endDate);
        
        const result = await this.db.query(`
            WITH demographics AS (
                SELECT 
                    u.industry,
                    u.company_size,
                    u.country,
                    COUNT(DISTINCT r.id) as referrals,
                    COUNT(DISTINCT CASE WHEN r.status = 'converted' THEN r.id END) as conversions,
                    AVG(CASE WHEN r.status = 'converted' THEN r.referral_value END) as avg_value
                FROM referrals r
                JOIN users u ON r.referee_id = u.id
                WHERE 1=1 ${dateFilter}
                GROUP BY u.industry, u.company_size, u.country
            )
            SELECT 
                industry,
                company_size,
                country,
                referrals,
                conversions,
                ROUND(avg_value::numeric, 2) as avg_value,
                CASE WHEN referrals > 0 
                    THEN ROUND((conversions::numeric / referrals) * 100, 2)
                    ELSE 0 
                END as conversion_rate
            FROM demographics
            ORDER BY conversions DESC
            LIMIT 50
        `, [startDate, endDate]);

        return result.rows;
    }

    async getRewardsAnalytics(startDate, endDate) {
        const dateFilter = this.getDateFilter(startDate, endDate, 'created_at');
        
        const result = await this.db.query(`
            SELECT 
                reward_type,
                COUNT(*) as total_rewards,
                COUNT(CASE WHEN status = 'earned' THEN 1 END) as earned,
                COUNT(CASE WHEN status = 'redeemed' THEN 1 END) as redeemed,
                COUNT(CASE WHEN status = 'expired' THEN 1 END) as expired,
                SUM(CASE WHEN reward_value IS NOT NULL THEN reward_value ELSE 0 END) as total_value,
                AVG(CASE WHEN reward_value IS NOT NULL THEN reward_value ELSE 0 END) as avg_value,
                ROUND(100.0 * COUNT(CASE WHEN status = 'redeemed' THEN 1 END) / 
                    NULLIF(COUNT(CASE WHEN status IN ('earned', 'redeemed') THEN 1 END), 0), 2) as redemption_rate
            FROM rewards
            WHERE 1=1 ${dateFilter}
            GROUP BY reward_type
            ORDER BY total_rewards DESC
        `, [startDate, endDate]);

        return result.rows;
    }

    async getViralMetrics(startDate, endDate) {
        const dateFilter = this.getDateFilter(startDate, endDate);
        
        const result = await this.db.query(`
            WITH viral_analysis AS (
                SELECT 
                    r1.referrer_id as original_referrer,
                    r1.referee_id as first_degree,
                    r2.referee_id as second_degree,
                    r3.referee_id as third_degree
                FROM referrals r1
                LEFT JOIN referrals r2 ON r1.referee_id = r2.referrer_id
                LEFT JOIN referrals r3 ON r2.referee_id = r3.referrer_id
                WHERE r1.status = 'converted' ${dateFilter}
            )
            SELECT 
                COUNT(DISTINCT original_referrer) as viral_referrers,
                COUNT(DISTINCT first_degree) as first_degree_referrals,
                COUNT(DISTINCT second_degree) as second_degree_referrals,
                COUNT(DISTINCT third_degree) as third_degree_referrals,
                CASE WHEN COUNT(DISTINCT first_degree) > 0
                    THEN ROUND(COUNT(DISTINCT second_degree)::numeric / COUNT(DISTINCT first_degree), 3)
                    ELSE 0
                END as viral_coefficient,
                CASE WHEN COUNT(DISTINCT original_referrer) > 0
                    THEN ROUND((COUNT(DISTINCT second_degree) + COUNT(DISTINCT third_degree))::numeric / 
                               COUNT(DISTINCT original_referrer), 2)
                    ELSE 0
                END as network_effect_multiplier
            FROM viral_analysis
        `, [startDate, endDate]);

        return result.rows[0];
    }

    async getTrendAnalytics(startDate, endDate) {
        const result = await this.db.query(`
            WITH daily_metrics AS (
                SELECT 
                    DATE(created_at) as date,
                    COUNT(*) as referrals,
                    COUNT(CASE WHEN status = 'converted' THEN 1 END) as conversions,
                    COUNT(DISTINCT referrer_id) as active_referrers,
                    SUM(CASE WHEN status = 'converted' THEN referral_value ELSE 0 END) as revenue
                FROM referrals
                WHERE created_at BETWEEN $1 AND $2
                GROUP BY DATE(created_at)
            ),
            moving_averages AS (
                SELECT 
                    date,
                    referrals,
                    conversions,
                    active_referrers,
                    revenue,
                    AVG(referrals) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) as ma7_referrals,
                    AVG(conversions) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) as ma7_conversions,
                    AVG(referrals) OVER (ORDER BY date ROWS BETWEEN 29 PRECEDING AND CURRENT ROW) as ma30_referrals
                FROM daily_metrics
            )
            SELECT 
                date,
                referrals,
                conversions,
                active_referrers,
                revenue,
                ROUND(ma7_referrals, 2) as weekly_avg_referrals,
                ROUND(ma7_conversions, 2) as weekly_avg_conversions,
                ROUND(ma30_referrals, 2) as monthly_avg_referrals,
                CASE WHEN LAG(referrals) OVER (ORDER BY date) > 0
                    THEN ROUND(((referrals - LAG(referrals) OVER (ORDER BY date))::numeric / 
                               LAG(referrals) OVER (ORDER BY date)) * 100, 2)
                    ELSE 0
                END as daily_growth_rate
            FROM moving_averages
            ORDER BY date DESC
        `, [startDate, endDate]);

        return result.rows;
    }

    async getPredictiveAnalytics(startDate, endDate) {
        const historicalData = await this.getTrendAnalytics(startDate, endDate);
        
        const avgDailyReferrals = historicalData.reduce((sum, day) => sum + day.referrals, 0) / historicalData.length;
        const avgConversionRate = historicalData.reduce((sum, day) => 
            sum + (day.referrals > 0 ? day.conversions / day.referrals : 0), 0) / historicalData.length;
        
        const growthTrend = this.calculateGrowthTrend(historicalData);
        
        const predictions = {
            next_30_days: {
                expected_referrals: Math.round(avgDailyReferrals * 30 * (1 + growthTrend)),
                expected_conversions: Math.round(avgDailyReferrals * 30 * avgConversionRate * (1 + growthTrend)),
                confidence: this.calculateConfidence(historicalData)
            },
            next_quarter: {
                expected_referrals: Math.round(avgDailyReferrals * 90 * Math.pow(1 + growthTrend, 3)),
                expected_conversions: Math.round(avgDailyReferrals * 90 * avgConversionRate * Math.pow(1 + growthTrend, 3)),
                confidence: this.calculateConfidence(historicalData) * 0.8
            },
            breakeven_analysis: await this.calculateBreakeven(startDate, endDate),
            churn_risk: await this.calculateChurnRisk()
        };

        return predictions;
    }

    async getROIAnalysis(startDate, endDate) {
        const dateFilter = this.getDateFilter(startDate, endDate);
        
        const result = await this.db.query(`
            WITH roi_metrics AS (
                SELECT 
                    SUM(CASE WHEN r.status = 'converted' THEN r.referral_value ELSE 0 END) as total_revenue,
                    SUM(CASE WHEN rw.status IN ('earned', 'redeemed') THEN rw.reward_value ELSE 0 END) as total_rewards_cost,
                    COUNT(DISTINCT r.referee_id) as customers_acquired,
                    AVG(CASE WHEN r.status = 'converted' THEN r.referral_value ELSE 0 END) as avg_customer_value
                FROM referrals r
                LEFT JOIN rewards rw ON r.id = rw.referral_id
                WHERE 1=1 ${dateFilter}
            ),
            lifetime_value AS (
                SELECT AVG(total_purchases) as avg_ltv
                FROM (
                    SELECT referee_id, SUM(referral_value) as total_purchases
                    FROM referrals
                    WHERE status = 'converted'
                    GROUP BY referee_id
                ) sub
            )
            SELECT 
                rm.total_revenue,
                rm.total_rewards_cost,
                rm.customers_acquired,
                ROUND(rm.avg_customer_value::numeric, 2) as avg_customer_value,
                ROUND(lv.avg_ltv::numeric, 2) as avg_lifetime_value,
                CASE WHEN rm.total_rewards_cost > 0
                    THEN ROUND((rm.total_revenue - rm.total_rewards_cost)::numeric, 2)
                    ELSE rm.total_revenue
                END as net_revenue,
                CASE WHEN rm.total_rewards_cost > 0
                    THEN ROUND(((rm.total_revenue - rm.total_rewards_cost) / rm.total_rewards_cost)::numeric * 100, 2)
                    ELSE 0
                END as roi_percentage,
                CASE WHEN rm.customers_acquired > 0
                    THEN ROUND((rm.total_rewards_cost / rm.customers_acquired)::numeric, 2)
                    ELSE 0
                END as cost_per_acquisition,
                CASE WHEN rm.customers_acquired > 0 AND lv.avg_ltv > 0
                    THEN ROUND((lv.avg_ltv / (rm.total_rewards_cost / rm.customers_acquired))::numeric, 2)
                    ELSE 0
                END as ltv_to_cac_ratio
            FROM roi_metrics rm, lifetime_value lv
        `, [startDate, endDate]);

        return result.rows[0];
    }

    async generateExecutiveSummary(startDate, endDate) {
        const metrics = await this.getOverviewMetrics(startDate, endDate);
        const roi = await this.getROIAnalysis(startDate, endDate);
        const viral = await this.getViralMetrics(startDate, endDate);
        const topPerformers = await this.getPerformanceMetrics(startDate, endDate);

        return {
            period: { start: startDate, end: endDate },
            highlights: {
                total_referrals: metrics.total_referrals,
                conversion_rate: `${metrics.conversion_rate}%`,
                revenue_generated: roi.total_revenue,
                roi: `${roi.roi_percentage}%`,
                viral_coefficient: viral.viral_coefficient,
                top_referrer: topPerformers[0]?.referrer_name || 'N/A'
            },
            insights: this.generateInsights(metrics, roi, viral),
            recommendations: this.generateRecommendations(metrics, roi, viral)
        };
    }

    generateInsights(metrics, roi, viral) {
        const insights = [];

        if (metrics.conversion_rate > 35) {
            insights.push('Excellent conversion rate indicates strong product-market fit');
        } else if (metrics.conversion_rate < 20) {
            insights.push('Low conversion rate suggests need for better qualification or incentives');
        }

        if (viral.viral_coefficient > 0.5) {
            insights.push('Strong viral growth potential with high secondary referral rate');
        }

        if (roi.ltv_to_cac_ratio > 3) {
            insights.push('Healthy LTV:CAC ratio indicates sustainable growth model');
        }

        if (metrics.avg_conversion_time_days < 7) {
            insights.push('Fast conversion cycle shows strong referral quality');
        }

        return insights;
    }

    generateRecommendations(metrics, roi, viral) {
        const recommendations = [];

        if (metrics.conversion_rate < 25) {
            recommendations.push('Improve referee onboarding to increase conversion');
        }

        if (viral.viral_coefficient < 0.3) {
            recommendations.push('Incentivize secondary referrals to boost viral growth');
        }

        if (roi.cost_per_acquisition > roi.avg_customer_value * 0.3) {
            recommendations.push('Optimize reward structure to improve unit economics');
        }

        if (metrics.active_referrers < metrics.total_referrals * 0.2) {
            recommendations.push('Re-engage inactive referrers with targeted campaigns');
        }

        return recommendations;
    }

    calculateGrowthTrend(historicalData) {
        if (historicalData.length < 7) return 0;

        const recentAvg = historicalData.slice(0, 7).reduce((sum, day) => sum + day.referrals, 0) / 7;
        const pastAvg = historicalData.slice(-7).reduce((sum, day) => sum + day.referrals, 0) / 7;

        return pastAvg > 0 ? (recentAvg - pastAvg) / pastAvg : 0;
    }

    calculateConfidence(historicalData) {
        const variance = this.calculateVariance(historicalData.map(d => d.referrals));
        const stdDev = Math.sqrt(variance);
        const mean = historicalData.reduce((sum, d) => sum + d.referrals, 0) / historicalData.length;
        
        const cv = mean > 0 ? stdDev / mean : 1;
        
        return Math.max(0, Math.min(1, 1 - cv));
    }

    calculateVariance(numbers) {
        const mean = numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
        return numbers.reduce((sum, n) => sum + Math.pow(n - mean, 2), 0) / numbers.length;
    }

    async calculateBreakeven(startDate, endDate) {
        const roi = await this.getROIAnalysis(startDate, endDate);
        
        if (roi.cost_per_acquisition === 0) return { months: 0, confidence: 1 };
        
        const monthlyRevenue = roi.avg_customer_value;
        const breakevenMonths = roi.cost_per_acquisition / monthlyRevenue;
        
        return {
            months: Math.ceil(breakevenMonths),
            confidence: 0.75
        };
    }

    async calculateChurnRisk() {
        const result = await this.db.query(`
            SELECT 
                COUNT(CASE WHEN last_referral_date < CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as inactive_30,
                COUNT(CASE WHEN last_referral_date < CURRENT_DATE - INTERVAL '60 days' THEN 1 END) as inactive_60,
                COUNT(*) as total
            FROM (
                SELECT referrer_id, MAX(created_at) as last_referral_date
                FROM referrals
                GROUP BY referrer_id
            ) sub
        `);

        const data = result.rows[0];
        return {
            high_risk: data.inactive_60,
            medium_risk: data.inactive_30 - data.inactive_60,
            low_risk: data.total - data.inactive_30,
            churn_rate: data.total > 0 ? (data.inactive_60 / data.total * 100).toFixed(2) : 0
        };
    }

    getDateFilter(startDate, endDate, column = 'r.created_at') {
        if (!startDate || !endDate) return '';
        return `AND ${column} BETWEEN '${startDate}'::date AND '${endDate}'::date`;
    }

    async exportReport(format, reportData) {
        switch (format) {
            case 'csv':
                return this.exportCSV(reportData);
            case 'pdf':
                return this.exportPDF(reportData);
            case 'json':
                return JSON.stringify(reportData, null, 2);
            default:
                throw new Error(`Unsupported format: ${format}`);
        }
    }

    exportCSV(data) {
        const csv = [];
        
        for (const [section, sectionData] of Object.entries(data)) {
            csv.push(`\n${section.toUpperCase()}`);
            
            if (Array.isArray(sectionData) && sectionData.length > 0) {
                const headers = Object.keys(sectionData[0]);
                csv.push(headers.join(','));
                
                for (const row of sectionData) {
                    csv.push(headers.map(h => row[h] || '').join(','));
                }
            } else if (typeof sectionData === 'object') {
                for (const [key, value] of Object.entries(sectionData)) {
                    csv.push(`${key},${value}`);
                }
            }
        }
        
        return csv.join('\n');
    }

    exportPDF(data) {
        console.log('PDF export would be implemented with a PDF library');
        return 'PDF export placeholder';
    }
}

module.exports = AnalyticsReporting;