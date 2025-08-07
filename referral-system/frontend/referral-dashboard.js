class ReferralDashboard {
    constructor() {
        this.userId = this.getUserId();
        this.apiBase = '/api/referral';
        this.profile = null;
        this.referrals = [];
        this.rewards = [];
        this.badges = [];
        this.charts = {};
        
        this.init();
    }

    getUserId() {
        return localStorage.getItem('userId') || 'demo-user';
    }

    async init() {
        await this.loadDashboardData();
        this.setupEventListeners();
        this.initializeCharts();
        this.startAutoRefresh();
    }

    async loadDashboardData() {
        try {
            const response = await fetch(`${this.apiBase}/profile/${this.userId}`);
            const data = await response.json();
            
            this.profile = data.profile;
            this.referrals = data.referrals;
            this.rewards = data.rewards;
            this.badges = data.badges;
            
            this.updateUI();
            this.loadAnalytics();
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showNotification('Error loading dashboard data', 'error');
        }
    }

    updateUI() {
        document.getElementById('referralCode').textContent = this.profile.referral_code;
        document.getElementById('totalReferrals').textContent = this.profile.total_referrals || 0;
        document.getElementById('successfulReferrals').textContent = this.profile.successful_referrals || 0;
        document.getElementById('totalRewards').textContent = this.profile.total_rewards_earned || 0;
        
        const conversionRate = this.profile.total_referrals > 0 
            ? ((this.profile.successful_referrals / this.profile.total_referrals) * 100).toFixed(1)
            : 0;
        document.getElementById('conversionRate').textContent = `${conversionRate}%`;
        
        if (this.profile.champion_status === 'champion') {
            document.getElementById('championStatus').style.display = 'inline-block';
        }
        
        this.updateRewards();
        this.updateReferralTable();
        this.updateMilestones();
        this.updateBadges();
    }

    updateRewards() {
        const availableCredits = this.rewards.available
            ?.filter(r => r.reward_type === 'credit')
            .reduce((sum, r) => sum + parseFloat(r.reward_value || 0), 0) || 0;
        
        const freeMonths = this.rewards.available
            ?.filter(r => r.reward_type === 'free_month')
            .length || 0;
        
        document.getElementById('availableCredits').textContent = availableCredits;
        document.getElementById('freeMonths').textContent = freeMonths;
    }

    updateReferralTable() {
        const tbody = document.getElementById('referralTableBody');
        tbody.innerHTML = '';
        
        const filteredReferrals = this.getFilteredReferrals();
        
        filteredReferrals.forEach(referral => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${referral.referee_email}</td>
                <td>${new Date(referral.created_at).toLocaleDateString()}</td>
                <td><span class="status-badge status-${referral.status}">${referral.status}</span></td>
                <td>${referral.status === 'converted' ? '$500' : 'Pending'}</td>
            `;
        });
    }

    getFilteredReferrals() {
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        if (activeFilter === 'all') return this.referrals;
        return this.referrals.filter(r => r.status === activeFilter);
    }

    updateMilestones() {
        const successfulCount = this.profile.successful_referrals || 0;
        document.querySelectorAll('.milestone').forEach(milestone => {
            const threshold = parseInt(milestone.dataset.threshold);
            if (successfulCount >= threshold) {
                milestone.classList.add('achieved');
            } else {
                milestone.classList.remove('achieved');
            }
        });
    }

    updateBadges() {
        const badgeGrid = document.getElementById('badgeGrid');
        badgeGrid.innerHTML = '';
        
        this.badges.forEach(badge => {
            const badgeElement = document.createElement('div');
            badgeElement.className = 'badge-item';
            badgeElement.innerHTML = `
                <div class="badge-icon">${this.getBadgeIcon(badge.name)}</div>
                <div class="badge-name">${badge.name}</div>
                <div class="badge-date">${new Date(badge.earned_at).toLocaleDateString()}</div>
            `;
            badgeGrid.appendChild(badgeElement);
        });
    }

    getBadgeIcon(badgeName) {
        const icons = {
            'First Referral': '🎯',
            'Industry Leader': '🏢',
            'Growth Champion': '🚀',
            'Viral Spreader': '🔄',
            'Early Adopter': '⭐',
            'DataSense Champion': '🏆'
        };
        return icons[badgeName] || '🏅';
    }

    setupEventListeners() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.updateReferralTable();
            });
        });

        document.querySelectorAll('.period-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.loadLeaderboard(e.target.dataset.period);
            });
        });

        document.getElementById('leaderboardOptIn').addEventListener('change', (e) => {
            this.updateLeaderboardPreference(e.target.checked);
        });
    }

    async loadAnalytics() {
        try {
            const response = await fetch(`${this.apiBase}/analytics/${this.userId}`);
            const analytics = await response.json();
            
            this.updateCharts(analytics);
            document.getElementById('viralScore').textContent = 
                analytics.networkEffect?.[0]?.count || '0.0';
        } catch (error) {
            console.error('Error loading analytics:', error);
        }
    }

    initializeCharts() {
        const funnelCtx = document.getElementById('funnelChart').getContext('2d');
        this.charts.funnel = new Chart(funnelCtx, {
            type: 'bar',
            data: {
                labels: ['Referred', 'Pending', 'Converted'],
                datasets: [{
                    label: 'Referral Funnel',
                    data: [0, 0, 0],
                    backgroundColor: ['#3b82f6', '#f59e0b', '#10b981']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

        const sourcesCtx = document.getElementById('sourcesChart').getContext('2d');
        this.charts.sources = new Chart(sourcesCtx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

        const timelineCtx = document.getElementById('timelineChart').getContext('2d');
        this.charts.timeline = new Chart(timelineCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Referrals',
                    data: [],
                    borderColor: '#3b82f6',
                    tension: 0.1
                }, {
                    label: 'Conversions',
                    data: [],
                    borderColor: '#10b981',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    updateCharts(analytics) {
        if (analytics.funnel) {
            this.charts.funnel.data.datasets[0].data = [
                analytics.funnel.total_referrals,
                analytics.funnel.pending,
                analytics.funnel.converted
            ];
            this.charts.funnel.update();
        }

        if (analytics.sources) {
            this.charts.sources.data.labels = analytics.sources.map(s => s.source);
            this.charts.sources.data.datasets[0].data = analytics.sources.map(s => s.count);
            this.charts.sources.update();
        }

        if (analytics.timeline) {
            const dates = analytics.timeline.map(t => 
                new Date(t.date).toLocaleDateString()
            );
            this.charts.timeline.data.labels = dates;
            this.charts.timeline.data.datasets[0].data = analytics.timeline.map(t => t.referrals);
            this.charts.timeline.data.datasets[1].data = analytics.timeline.map(t => t.conversions);
            this.charts.timeline.update();
        }
    }

    async loadLeaderboard(period = 'all') {
        try {
            const response = await fetch(`${this.apiBase}/leaderboard?period=${period}`);
            const data = await response.json();
            
            const leaderboardList = document.getElementById('leaderboardList');
            leaderboardList.innerHTML = '';
            
            data.leaderboard.forEach((entry, index) => {
                const item = document.createElement('div');
                item.className = 'leaderboard-item';
                if (entry.user_id === this.userId) {
                    item.classList.add('current-user');
                }
                
                item.innerHTML = `
                    <div class="rank">#${index + 1}</div>
                    <div class="user-info">
                        <span class="user-code">${entry.referral_code}</span>
                        ${entry.champion_status ? '<span class="champion-indicator">🏆</span>' : ''}
                    </div>
                    <div class="referral-count">${entry.period_referrals} referrals</div>
                `;
                
                leaderboardList.appendChild(item);
            });
        } catch (error) {
            console.error('Error loading leaderboard:', error);
        }
    }

    async updateLeaderboardPreference(optIn) {
        try {
            await fetch(`${this.apiBase}/settings/${this.userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ leaderboardOptIn: optIn })
            });
            
            this.showNotification(
                optIn ? 'You are now visible on the leaderboard' : 'You are hidden from the leaderboard',
                'success'
            );
        } catch (error) {
            console.error('Error updating preference:', error);
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type} show`;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    startAutoRefresh() {
        setInterval(() => {
            this.loadDashboardData();
        }, 30000);
    }
}

function copyReferralCode() {
    const code = document.getElementById('referralCode').textContent;
    navigator.clipboard.writeText(code).then(() => {
        dashboard.showNotification('Referral code copied!', 'success');
    });
}

function shareViaEmail() {
    const code = document.getElementById('referralCode').textContent;
    const subject = 'Join me on DataSense!';
    const body = `I've been using DataSense to transform my business data into actionable insights. Use my referral code ${code} to get 20% off your first 3 months!`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function shareOnLinkedIn() {
    const code = document.getElementById('referralCode').textContent;
    const url = `https://datasense.ai/signup?ref=${code}`;
    const text = 'DataSense has transformed how I understand my business data. Join me and get exclusive benefits!';
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`, '_blank');
}

function shareOnTwitter() {
    const code = document.getElementById('referralCode').textContent;
    const url = `https://datasense.ai/signup?ref=${code}`;
    const text = 'Transform your business data with DataSense! Use my code for exclusive benefits:';
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
}

function shareOnWhatsApp() {
    const code = document.getElementById('referralCode').textContent;
    const url = `https://datasense.ai/signup?ref=${code}`;
    const text = `Check out DataSense - it's revolutionizing how I understand my business data! Use my referral code ${code} for exclusive benefits: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

async function sendBatchInvites() {
    const emailsText = document.getElementById('batchEmails').value;
    const personalMessage = document.getElementById('personalMessage').value;
    
    const emails = emailsText.split(/[\n,]/).map(e => e.trim()).filter(e => e);
    
    if (emails.length === 0) {
        dashboard.showNotification('Please enter at least one email address', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/referral/batch-invite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: dashboard.userId,
                emails,
                personalMessage
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            dashboard.showNotification(`Successfully invited ${result.invited} friends!`, 'success');
            document.getElementById('batchEmails').value = '';
            document.getElementById('personalMessage').value = '';
            dashboard.loadDashboardData();
        }
    } catch (error) {
        dashboard.showNotification('Error sending invitations', 'error');
    }
}

const dashboard = new ReferralDashboard();