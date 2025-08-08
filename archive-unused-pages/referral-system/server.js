const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();

const referralAPI = require('./backend/referralAPI');
const EmailAutomation = require('./backend/emailAutomation');
const GamificationEngine = require('./backend/gamification');
const AnalyticsReporting = require('./backend/analyticsReporting');

const app = express();
const port = process.env.PORT || 3000;

const db = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'datasense_referrals',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password'
});

const emailConfig = {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
};

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));

const emailAutomation = new EmailAutomation(db, emailConfig);
const gamification = new GamificationEngine(db);
const analytics = new AnalyticsReporting(db);

app.use('/api/referral', referralAPI(db));

app.post('/api/analytics/report', async (req, res) => {
    try {
        const { startDate, endDate, format = 'json' } = req.body;
        const report = await analytics.generateComprehensiveReport(startDate, endDate);
        
        if (format !== 'json') {
            const exported = await analytics.exportReport(format, report);
            res.setHeader('Content-Type', format === 'csv' ? 'text/csv' : 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=referral-report.${format}`);
            res.send(exported);
        } else {
            res.json(report);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/analytics/summary', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const summary = await analytics.generateExecutiveSummary(
            startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            endDate || new Date().toISOString()
        );
        res.json(summary);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/gamification/check', async (req, res) => {
    try {
        const { userId } = req.body;
        const achievements = await gamification.checkAndAwardAchievements(userId);
        res.json({ achievements });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/gamification/leaderboard', async (req, res) => {
    try {
        const { limit = 10, period = 'all' } = req.query;
        const leaderboard = await gamification.getLeaderboardWithGamification(
            parseInt(limit),
            period
        );
        res.json({ leaderboard });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/email/send-invite', async (req, res) => {
    try {
        const { referral, personalMessage } = req.body;
        const success = await emailAutomation.sendReferralInvite(referral, personalMessage);
        res.json({ success });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/email/notify-success', async (req, res) => {
    try {
        const { referral } = req.body;
        const success = await emailAutomation.sendReferralSuccess(referral);
        res.json({ success });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'referral-dashboard.html'));
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

async function initializeDatabase() {
    try {
        const schemaSQL = require('fs').readFileSync(
            path.join(__dirname, 'database', 'schema.sql'),
            'utf8'
        );
        
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization error:', error);
    }
}

app.listen(port, async () => {
    console.log(`DataSense Referral System running on port ${port}`);
    console.log(`Dashboard: http://localhost:${port}`);
    console.log(`API: http://localhost:${port}/api/referral`);
    
    await initializeDatabase();
});