# DataSense Referral Tracking and Rewards System

## Overview
A comprehensive referral system that tracks, rewards, and encourages warm referrals with gamification, analytics, and automated email campaigns.

## Features

### Core Components
- **Unique Referral Codes**: Personalized codes for each customer
- **Multi-touch Attribution**: Complete journey tracking
- **Real-time Dashboard**: Performance monitoring
- **Automated Rewards**: Two-sided reward structure
- **Email Automation**: Templates and campaigns
- **Social Sharing Tools**: Pre-written content for all platforms
- **Gamification**: Badges, leaderboards, and challenges
- **Analytics & Reporting**: Comprehensive metrics and predictions

### Reward Structure

#### For Referrers:
- $500 credit per successful referral
- 3 referrals = 1 month free
- 5 referrals = DataSense Champion status
- 10 referrals = Conference ticket + case study

#### For Referees:
- 20% off first 3 months
- 30-day extended trial
- Priority onboarding
- Exclusive community access

## Installation

```bash
# Clone the repository
git clone [repository-url]

# Navigate to referral system
cd referral-system

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Initialize database
psql -U postgres -d datasense_referrals -f database/schema.sql

# Start the server
npm start
```

## Configuration

Create a `.env` file with:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=datasense_referrals
DB_USER=postgres
DB_PASSWORD=your_password

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Application
PORT=3000
BASE_URL=https://datasense.ai
SLACK_INVITE_LINK=https://slack.datasense.ai/invite

# Environment
NODE_ENV=production
```

## API Endpoints

### Referral Management
- `POST /api/referral/create-code` - Generate referral code
- `GET /api/referral/profile/:userId` - Get user profile
- `POST /api/referral/track` - Track new referral
- `POST /api/referral/convert/:referralId` - Convert referral
- `GET /api/referral/validate/:code` - Validate code

### Analytics
- `GET /api/referral/analytics/:userId` - User analytics
- `GET /api/referral/leaderboard` - Leaderboard
- `POST /api/analytics/report` - Generate report
- `GET /api/analytics/summary` - Executive summary

### Rewards
- `POST /api/referral/reward/redeem/:rewardId` - Redeem reward
- `GET /api/referral/profile/:userId` - View rewards

### Gamification
- `POST /api/gamification/check` - Check achievements
- `GET /api/gamification/leaderboard` - Gamified leaderboard

## Dashboard Access

Navigate to `http://localhost:3000` to access the referral dashboard.

## Success Metrics

- 30% of customers make at least 1 referral
- 35% referral conversion rate
- 40% higher LTV for referred customers
- Viral coefficient > 0.5

## Implementation Phases

1. **Phase 1**: Basic tracking and manual rewards ✅
2. **Phase 2**: Automated rewards and email templates ✅
3. **Phase 3**: Full gamification and analytics ✅
4. **Phase 4**: API for partner integrations (Future)

## Testing

```bash
# Run tests
npm test

# Test specific component
npm test -- referralCodeManager

# Coverage report
npm run test:coverage
```

## Deployment

The system is designed to be deployed on:
- **Backend**: Node.js on AWS EC2/ECS or Heroku
- **Database**: PostgreSQL on AWS RDS
- **Frontend**: Static hosting on S3/CloudFront
- **Email**: SendGrid or AWS SES integration

## Support

For issues or questions, contact the DataSense team or create an issue in the repository.

## License

MIT License - DataSense 2024