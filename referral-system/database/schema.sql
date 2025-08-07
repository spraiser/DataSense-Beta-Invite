-- Referral System Database Schema

-- Users/Customers table extension
CREATE TABLE IF NOT EXISTS referral_profiles (
    user_id UUID PRIMARY KEY,
    referral_code VARCHAR(20) UNIQUE NOT NULL,
    referral_status VARCHAR(50) DEFAULT 'active',
    total_referrals INT DEFAULT 0,
    successful_referrals INT DEFAULT 0,
    total_rewards_earned DECIMAL(10,2) DEFAULT 0,
    champion_status VARCHAR(50) DEFAULT NULL,
    leaderboard_opt_in BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Referral tracking table
CREATE TABLE IF NOT EXISTS referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID NOT NULL,
    referee_email VARCHAR(255) NOT NULL,
    referee_id UUID,
    referral_code VARCHAR(20) NOT NULL,
    source VARCHAR(100),
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending',
    conversion_date TIMESTAMP,
    referral_value DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (referrer_id) REFERENCES referral_profiles(user_id),
    INDEX idx_referral_code (referral_code),
    INDEX idx_status (status),
    INDEX idx_referrer (referrer_id)
);

-- Rewards table
CREATE TABLE IF NOT EXISTS rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    referral_id UUID,
    reward_type VARCHAR(50) NOT NULL,
    reward_value DECIMAL(10,2),
    reward_description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    redeemed_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES referral_profiles(user_id),
    FOREIGN KEY (referral_id) REFERENCES referrals(id),
    INDEX idx_user_rewards (user_id),
    INDEX idx_status (status)
);

-- Gamification badges
CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon_url VARCHAR(500),
    criteria JSONB,
    points INT DEFAULT 0,
    tier VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User badges (many-to-many)
CREATE TABLE IF NOT EXISTS user_badges (
    user_id UUID NOT NULL,
    badge_id UUID NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, badge_id),
    FOREIGN KEY (user_id) REFERENCES referral_profiles(user_id),
    FOREIGN KEY (badge_id) REFERENCES badges(id)
);

-- Referral analytics events
CREATE TABLE IF NOT EXISTS referral_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referral_id UUID,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (referral_id) REFERENCES referrals(id),
    INDEX idx_event_type (event_type),
    INDEX idx_created_at (created_at)
);

-- Email templates
CREATE TABLE IF NOT EXISTS email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_name VARCHAR(100) NOT NULL UNIQUE,
    subject VARCHAR(500),
    body_html TEXT,
    body_text TEXT,
    variables JSONB,
    category VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Social sharing templates
CREATE TABLE IF NOT EXISTS social_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform VARCHAR(50) NOT NULL,
    template_type VARCHAR(50),
    content TEXT,
    hashtags TEXT,
    media_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leaderboard view
CREATE VIEW referral_leaderboard AS
SELECT 
    rp.user_id,
    rp.referral_code,
    rp.successful_referrals,
    rp.total_rewards_earned,
    rp.champion_status,
    COUNT(DISTINCT ub.badge_id) as badges_earned,
    RANK() OVER (ORDER BY rp.successful_referrals DESC) as rank
FROM referral_profiles rp
LEFT JOIN user_badges ub ON rp.user_id = ub.user_id
WHERE rp.leaderboard_opt_in = true
GROUP BY rp.user_id, rp.referral_code, rp.successful_referrals, 
         rp.total_rewards_earned, rp.champion_status;

-- Insert default badges
INSERT INTO badges (name, description, criteria, points, tier) VALUES
('First Referral', 'Made your first successful referral', '{"successful_referrals": 1}', 100, 'bronze'),
('Industry Leader', 'Referred 5 businesses from the same industry', '{"industry_referrals": 5}', 500, 'silver'),
('Growth Champion', 'Successfully referred 10 customers', '{"successful_referrals": 10}', 1000, 'gold'),
('Viral Spreader', 'Your referrals made their own referrals', '{"second_degree_referrals": 3}', 750, 'silver'),
('Early Adopter', 'Among the first 100 referrers', '{"early_adopter": true}', 250, 'bronze'),
('DataSense Champion', 'Achieved champion status with 5+ referrals', '{"successful_referrals": 5}', 2000, 'platinum');