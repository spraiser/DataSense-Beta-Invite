class FeedbackSystem {
    constructor() {
        this.feedbackData = [];
        this.isOpen = false;
        this.currentVariation = null;
        this.loadStoredFeedback();
        this.init();
    }

    init() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('feedback') === 'true') {
            setTimeout(() => {
                this.openFeedbackForm();
            }, 1000);
        }

        document.addEventListener('DOMContentLoaded', () => {
            this.injectFeedbackButton();
        });
    }

    loadStoredFeedback() {
        const stored = localStorage.getItem('datasense_feedback');
        if (stored) {
            try {
                this.feedbackData = JSON.parse(stored);
            } catch (e) {
                console.error('Error loading stored feedback:', e);
                this.feedbackData = [];
            }
        }
    }

    saveFeedback() {
        localStorage.setItem('datasense_feedback', JSON.stringify(this.feedbackData));
    }

    injectFeedbackButton() {
        const button = document.createElement('button');
        button.id = 'feedback-trigger-btn';
        button.innerHTML = '💬 Give Feedback';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 50px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            z-index: 9998;
            transition: all 0.3s ease;
        `;
        button.addEventListener('click', () => this.openFeedbackForm());
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
        });
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
        });
        document.body.appendChild(button);
    }

    getCurrentVariationInfo() {
        if (typeof contentInjection !== 'undefined' && contentInjection.getCurrentVariation) {
            const variation = contentInjection.getCurrentVariation();
            if (typeof variation === 'object') {
                return {
                    id: variation.id,
                    name: variation.name || variation.id
                };
            } else {
                return {
                    id: variation,
                    name: variation
                };
            }
        }
        
        const storedVariation = sessionStorage.getItem('currentVariation');
        return {
            id: storedVariation || 'default',
            name: storedVariation || 'Default'
        };
    }

    openFeedbackForm() {
        if (this.isOpen) return;
        
        this.currentVariation = this.getCurrentVariationInfo();
        this.isOpen = true;

        const overlay = document.createElement('div');
        overlay.id = 'feedback-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        `;

        const form = document.createElement('div');
        form.id = 'feedback-form';
        form.innerHTML = `
            <div class="feedback-header">
                <h2>Focus Group Feedback</h2>
                <button class="close-btn" onclick="feedbackSystem.closeFeedbackForm()">×</button>
            </div>
            <div class="feedback-body">
                <div class="variation-info">
                    <label>Currently Viewing:</label>
                    <div class="variation-display">${this.currentVariation.name}</div>
                </div>
                
                <div class="form-group">
                    <label>Overall Rating</label>
                    <div class="star-rating" id="star-rating">
                        <span class="star" data-rating="1">★</span>
                        <span class="star" data-rating="2">★</span>
                        <span class="star" data-rating="3">★</span>
                        <span class="star" data-rating="4">★</span>
                        <span class="star" data-rating="5">★</span>
                    </div>
                </div>

                <div class="form-group">
                    <label for="messaging-feedback">Feedback on Messaging</label>
                    <textarea id="messaging-feedback" rows="3" placeholder="How clear and compelling is the messaging?"></textarea>
                </div>

                <div class="form-group">
                    <label for="resonates">What Resonates?</label>
                    <textarea id="resonates" rows="3" placeholder="What aspects of this variation work well for you?"></textarea>
                </div>

                <div class="form-group">
                    <label for="doesnt-resonate">What Doesn't Resonate?</label>
                    <textarea id="doesnt-resonate" rows="3" placeholder="What could be improved or doesn't connect with you?"></textarea>
                </div>

                <div class="form-group">
                    <label for="participant-name">Your Name (Optional)</label>
                    <input type="text" id="participant-name" placeholder="Anonymous">
                </div>

                <div class="form-actions">
                    <button class="submit-btn" onclick="feedbackSystem.submitFeedback()">Submit Feedback</button>
                    <button class="export-btn" onclick="feedbackSystem.exportToCSV()">Export All Feedback (CSV)</button>
                </div>
            </div>
        `;

        form.style.cssText = `
            background: white;
            border-radius: 12px;
            width: 90%;
            max-width: 600px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: slideUp 0.4s ease;
        `;

        overlay.appendChild(form);
        document.body.appendChild(overlay);

        this.addStyles();
        this.attachStarRatingHandlers();
    }

    addStyles() {
        if (document.getElementById('feedback-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'feedback-styles';
        styles.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slideUp {
                from {
                    transform: translateY(50px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }

            #feedback-form .feedback-header {
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 12px 12px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            #feedback-form .feedback-header h2 {
                margin: 0;
                font-size: 24px;
                font-weight: 600;
            }

            #feedback-form .close-btn {
                background: none;
                border: none;
                color: white;
                font-size: 32px;
                cursor: pointer;
                line-height: 1;
                padding: 0;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.2s;
            }

            #feedback-form .close-btn:hover {
                transform: rotate(90deg);
            }

            #feedback-form .feedback-body {
                padding: 30px;
            }

            #feedback-form .variation-info {
                background: #f7f9fc;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 25px;
            }

            #feedback-form .variation-info label {
                display: block;
                font-size: 12px;
                color: #64748b;
                margin-bottom: 5px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            #feedback-form .variation-display {
                font-size: 18px;
                font-weight: 600;
                color: #1e293b;
            }

            #feedback-form .form-group {
                margin-bottom: 20px;
            }

            #feedback-form .form-group label {
                display: block;
                margin-bottom: 8px;
                font-weight: 500;
                color: #334155;
            }

            #feedback-form .star-rating {
                display: flex;
                gap: 8px;
                font-size: 32px;
            }

            #feedback-form .star {
                color: #e2e8f0;
                cursor: pointer;
                transition: all 0.2s;
            }

            #feedback-form .star:hover,
            #feedback-form .star.active {
                color: #fbbf24;
                transform: scale(1.1);
            }

            #feedback-form textarea,
            #feedback-form input[type="text"] {
                width: 100%;
                padding: 12px;
                border: 2px solid #e2e8f0;
                border-radius: 8px;
                font-size: 14px;
                transition: border-color 0.3s;
                box-sizing: border-box;
                font-family: inherit;
            }

            #feedback-form textarea:focus,
            #feedback-form input[type="text"]:focus {
                outline: none;
                border-color: #667eea;
            }

            #feedback-form .form-actions {
                display: flex;
                gap: 12px;
                margin-top: 30px;
            }

            #feedback-form .submit-btn,
            #feedback-form .export-btn {
                padding: 12px 24px;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s;
            }

            #feedback-form .submit-btn {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                flex: 1;
            }

            #feedback-form .submit-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
            }

            #feedback-form .export-btn {
                background: #f1f5f9;
                color: #475569;
            }

            #feedback-form .export-btn:hover {
                background: #e2e8f0;
            }

            .feedback-success {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #10b981;
                color: white;
                padding: 16px 24px;
                border-radius: 8px;
                box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
                animation: slideIn 0.4s ease;
                z-index: 10000;
            }

            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                }
                to {
                    transform: translateX(0);
                }
            }
        `;
        document.head.appendChild(styles);
    }

    attachStarRatingHandlers() {
        const stars = document.querySelectorAll('#star-rating .star');
        let selectedRating = 0;

        stars.forEach(star => {
            star.addEventListener('click', () => {
                selectedRating = parseInt(star.dataset.rating);
                stars.forEach((s, index) => {
                    if (index < selectedRating) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            });

            star.addEventListener('mouseenter', () => {
                const hoverRating = parseInt(star.dataset.rating);
                stars.forEach((s, index) => {
                    if (index < hoverRating) {
                        s.style.color = '#fbbf24';
                    } else if (!s.classList.contains('active')) {
                        s.style.color = '#e2e8f0';
                    }
                });
            });
        });

        document.getElementById('star-rating').addEventListener('mouseleave', () => {
            stars.forEach((s, index) => {
                if (s.classList.contains('active')) {
                    s.style.color = '#fbbf24';
                } else {
                    s.style.color = '#e2e8f0';
                }
            });
        });
    }

    submitFeedback() {
        const rating = document.querySelectorAll('#star-rating .star.active').length;
        const messagingFeedback = document.getElementById('messaging-feedback').value;
        const resonates = document.getElementById('resonates').value;
        const doesntResonate = document.getElementById('doesnt-resonate').value;
        const participantName = document.getElementById('participant-name').value || 'Anonymous';

        if (rating === 0) {
            alert('Please provide a rating before submitting.');
            return;
        }

        const feedback = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            variationId: this.currentVariation.id,
            variationName: this.currentVariation.name,
            rating: rating,
            messagingFeedback: messagingFeedback,
            resonates: resonates,
            doesntResonate: doesntResonate,
            participantName: participantName,
            userAgent: navigator.userAgent,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            referrer: document.referrer || 'Direct'
        };

        this.feedbackData.push(feedback);
        this.saveFeedback();
        
        this.showSuccessMessage();
        this.closeFeedbackForm();
        
        console.log('Feedback submitted:', feedback);
    }

    showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'feedback-success';
        message.textContent = '✓ Thank you for your feedback!';
        document.body.appendChild(message);

        setTimeout(() => {
            message.style.animation = 'slideIn 0.4s ease reverse';
            setTimeout(() => message.remove(), 400);
        }, 3000);
    }

    closeFeedbackForm() {
        const overlay = document.getElementById('feedback-overlay');
        if (overlay) {
            overlay.style.animation = 'fadeIn 0.3s ease reverse';
            setTimeout(() => {
                overlay.remove();
                this.isOpen = false;
            }, 300);
        }
    }

    exportToCSV() {
        if (this.feedbackData.length === 0) {
            alert('No feedback data to export.');
            return;
        }

        const headers = [
            'ID',
            'Timestamp',
            'Variation ID',
            'Variation Name',
            'Rating',
            'Messaging Feedback',
            'What Resonates',
            'What Doesn\'t Resonate',
            'Participant Name',
            'User Agent',
            'Screen Resolution',
            'Referrer'
        ];

        const csvContent = [
            headers.join(','),
            ...this.feedbackData.map(row => {
                return [
                    row.id,
                    row.timestamp,
                    row.variationId,
                    this.escapeCSV(row.variationName),
                    row.rating,
                    this.escapeCSV(row.messagingFeedback),
                    this.escapeCSV(row.resonates),
                    this.escapeCSV(row.doesntResonate),
                    this.escapeCSV(row.participantName),
                    this.escapeCSV(row.userAgent),
                    row.screenResolution,
                    this.escapeCSV(row.referrer)
                ].join(',');
            })
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `datasense-feedback-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log(`Exported ${this.feedbackData.length} feedback entries to CSV`);
    }

    escapeCSV(str) {
        if (!str) return '""';
        str = String(str);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return '"' + str.replace(/"/g, '""') + '"';
        }
        return str;
    }

    getFeedbackSummary() {
        if (this.feedbackData.length === 0) {
            return { totalResponses: 0 };
        }

        const variationStats = {};
        let totalRating = 0;

        this.feedbackData.forEach(feedback => {
            if (!variationStats[feedback.variationId]) {
                variationStats[feedback.variationId] = {
                    name: feedback.variationName,
                    count: 0,
                    totalRating: 0,
                    ratings: []
                };
            }
            
            variationStats[feedback.variationId].count++;
            variationStats[feedback.variationId].totalRating += feedback.rating;
            variationStats[feedback.variationId].ratings.push(feedback.rating);
            totalRating += feedback.rating;
        });

        Object.keys(variationStats).forEach(variationId => {
            const stats = variationStats[variationId];
            stats.averageRating = (stats.totalRating / stats.count).toFixed(2);
        });

        return {
            totalResponses: this.feedbackData.length,
            averageRating: (totalRating / this.feedbackData.length).toFixed(2),
            variationStats: variationStats,
            latestFeedback: this.feedbackData[this.feedbackData.length - 1]
        };
    }

    clearAllFeedback() {
        if (confirm('Are you sure you want to clear all feedback data? This action cannot be undone.')) {
            this.feedbackData = [];
            localStorage.removeItem('datasense_feedback');
            console.log('All feedback data cleared');
        }
    }
}

const feedbackSystem = new FeedbackSystem();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = FeedbackSystem;
}