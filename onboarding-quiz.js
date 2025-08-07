(function() {
    'use strict';

    window.DataSenseOnboardingQuiz = {
        currentStep: 0,
        responses: {},
        userProfile: {},
        startTime: null,
        
        questions: [
            {
                id: 'role',
                type: 'single-choice',
                question: "What's your role?",
                subtitle: "This helps us customize your experience",
                options: [
                    { value: 'owner', label: 'Business Owner', icon: '👔' },
                    { value: 'marketing', label: 'Marketing', icon: '📊' },
                    { value: 'operations', label: 'Operations', icon: '⚙️' },
                    { value: 'finance', label: 'Finance', icon: '💰' },
                    { value: 'sales', label: 'Sales', icon: '💼' },
                    { value: 'other', label: 'Other', icon: '👤' }
                ],
                required: true,
                weight: 1.5
            },
            {
                id: 'challenge',
                type: 'multi-choice',
                question: "What's your biggest data challenge?",
                subtitle: "Select all that apply",
                options: [
                    { value: 'scattered', label: 'Data scattered across multiple tools', priority: 'high' },
                    { value: 'manual', label: 'Too much manual reporting', priority: 'high' },
                    { value: 'insights', label: "Can't find actionable insights", priority: 'critical' },
                    { value: 'realtime', label: 'Need real-time visibility', priority: 'medium' },
                    { value: 'team', label: 'Team lacks data skills', priority: 'medium' },
                    { value: 'cost', label: 'Current tools too expensive', priority: 'low' },
                    { value: 'integration', label: "Tools don't talk to each other", priority: 'high' },
                    { value: 'trust', label: "Don't trust our data accuracy", priority: 'critical' }
                ],
                required: true,
                maxSelections: 3,
                weight: 2.0
            },
            {
                id: 'tools',
                type: 'tool-selector',
                question: "What tools are you currently using?",
                subtitle: "We'll prioritize these integrations",
                categories: {
                    'ecommerce': {
                        label: 'E-commerce',
                        tools: ['Shopify', 'WooCommerce', 'BigCommerce', 'Magento', 'Square']
                    },
                    'payment': {
                        label: 'Payment Processing',
                        tools: ['Stripe', 'PayPal', 'Square', 'Authorize.net']
                    },
                    'accounting': {
                        label: 'Accounting',
                        tools: ['QuickBooks', 'Xero', 'FreshBooks', 'Wave']
                    },
                    'crm': {
                        label: 'CRM',
                        tools: ['HubSpot', 'Salesforce', 'Pipedrive', 'Zoho']
                    },
                    'marketing': {
                        label: 'Marketing',
                        tools: ['Mailchimp', 'Klaviyo', 'ActiveCampaign', 'Google Ads', 'Facebook Ads']
                    },
                    'analytics': {
                        label: 'Analytics',
                        tools: ['Google Analytics', 'Mixpanel', 'Segment', 'Heap']
                    }
                },
                required: false,
                weight: 1.2
            },
            {
                id: 'insight',
                type: 'open-text',
                question: "What one insight would transform your business?",
                subtitle: "Be specific - we'll help you find it",
                placeholder: "e.g., 'Which products have the highest profit margin?', 'What causes customer churn?'",
                examples: [
                    "Customer lifetime value by acquisition channel",
                    "Product profitability after all costs",
                    "Peak conversion times and patterns",
                    "Hidden revenue opportunities"
                ],
                required: true,
                weight: 1.8,
                aiAnalysis: true
            },
            {
                id: 'team',
                type: 'slider',
                question: "How many people need access to data insights?",
                subtitle: "Including yourself",
                min: 1,
                max: 50,
                step: 1,
                defaultValue: 3,
                labels: {
                    1: 'Just me',
                    5: 'Small team',
                    15: 'Department',
                    50: 'Entire company'
                },
                required: true,
                weight: 1.0
            },
            {
                id: 'maturity',
                type: 'matrix',
                question: "Rate your current data capabilities",
                subtitle: "Be honest - we'll meet you where you are",
                dimensions: [
                    { id: 'collection', label: 'Data Collection', description: 'How well do you capture data?' },
                    { id: 'analysis', label: 'Data Analysis', description: 'How well do you analyze data?' },
                    { id: 'action', label: 'Data Action', description: 'How well do you act on insights?' },
                    { id: 'culture', label: 'Data Culture', description: 'How data-driven is your team?' }
                ],
                scale: [
                    { value: 1, label: 'Non-existent' },
                    { value: 2, label: 'Basic' },
                    { value: 3, label: 'Developing' },
                    { value: 4, label: 'Advanced' },
                    { value: 5, label: 'Expert' }
                ],
                required: false,
                weight: 1.3
            },
            {
                id: 'urgency',
                type: 'single-choice',
                question: "When do you need to see results?",
                subtitle: "We'll adjust your onboarding pace",
                options: [
                    { value: 'today', label: 'Today', urgency: 'critical' },
                    { value: 'week', label: 'This week', urgency: 'high' },
                    { value: 'month', label: 'This month', urgency: 'medium' },
                    { value: 'quarter', label: 'This quarter', urgency: 'low' },
                    { value: 'exploring', label: 'Just exploring', urgency: 'none' }
                ],
                required: true,
                weight: 1.4
            },
            {
                id: 'industry',
                type: 'smart-select',
                question: "What industry are you in?",
                subtitle: "We have specialized templates for you",
                searchable: true,
                options: [
                    { value: 'ecommerce', label: 'E-commerce', templates: 12 },
                    { value: 'saas', label: 'B2B SaaS', templates: 8 },
                    { value: 'services', label: 'Professional Services', templates: 10 },
                    { value: 'retail', label: 'Retail', templates: 9 },
                    { value: 'hospitality', label: 'Hospitality', templates: 7 },
                    { value: 'healthcare', label: 'Healthcare', templates: 6 },
                    { value: 'manufacturing', label: 'Manufacturing', templates: 8 },
                    { value: 'nonprofit', label: 'Non-profit', templates: 5 },
                    { value: 'education', label: 'Education', templates: 6 },
                    { value: 'realestate', label: 'Real Estate', templates: 7 },
                    { value: 'finance', label: 'Financial Services', templates: 9 },
                    { value: 'other', label: 'Other', templates: 3 }
                ],
                required: true,
                weight: 1.6
            }
        ],

        init: function() {
            this.startTime = Date.now();
            this.renderQuiz();
            this.attachEventListeners();
            this.trackQuizStart();
        },

        renderQuiz: function() {
            const container = document.getElementById('onboarding-quiz');
            if (!container) return;

            const question = this.questions[this.currentStep];
            let html = `
                <div class="quiz-container">
                    <div class="quiz-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${((this.currentStep + 1) / this.questions.length) * 100}%"></div>
                        </div>
                        <div class="progress-text">
                            Question ${this.currentStep + 1} of ${this.questions.length}
                            <span class="time-estimate">~${Math.max(1, this.questions.length - this.currentStep)} min remaining</span>
                        </div>
                    </div>
                    
                    <div class="quiz-question" data-question-id="${question.id}">
                        <h2 class="question-title">${question.question}</h2>
                        <p class="question-subtitle">${question.subtitle}</p>
                        
                        <div class="question-content">
                            ${this.renderQuestionType(question)}
                        </div>
                        
                        <div class="quiz-navigation">
                            ${this.currentStep > 0 ? '<button class="btn-secondary" onclick="DataSenseOnboardingQuiz.previousQuestion()">Back</button>' : ''}
                            <button class="btn-primary" onclick="DataSenseOnboardingQuiz.nextQuestion()" 
                                ${question.required ? 'disabled' : ''}>
                                ${this.currentStep === this.questions.length - 1 ? 'Complete Quiz' : 'Continue'}
                            </button>
                        </div>
                    </div>
                    
                    <div class="quiz-help">
                        <button class="help-trigger" onclick="DataSenseOnboardingQuiz.showHelp()">
                            Need help? <span class="help-icon">💬</span>
                        </button>
                    </div>
                </div>
            `;
            
            container.innerHTML = html;
            this.validateCurrentQuestion();
        },

        renderQuestionType: function(question) {
            switch(question.type) {
                case 'single-choice':
                    return this.renderSingleChoice(question);
                case 'multi-choice':
                    return this.renderMultiChoice(question);
                case 'tool-selector':
                    return this.renderToolSelector(question);
                case 'open-text':
                    return this.renderOpenText(question);
                case 'slider':
                    return this.renderSlider(question);
                case 'matrix':
                    return this.renderMatrix(question);
                case 'smart-select':
                    return this.renderSmartSelect(question);
                default:
                    return '';
            }
        },

        renderSingleChoice: function(question) {
            let html = '<div class="options-grid single-choice">';
            question.options.forEach(option => {
                const isSelected = this.responses[question.id] === option.value;
                html += `
                    <div class="option-card ${isSelected ? 'selected' : ''}" 
                         onclick="DataSenseOnboardingQuiz.selectSingleOption('${question.id}', '${option.value}')">
                        ${option.icon ? `<span class="option-icon">${option.icon}</span>` : ''}
                        <span class="option-label">${option.label}</span>
                        ${option.urgency ? `<span class="urgency-badge ${option.urgency}">${option.urgency}</span>` : ''}
                    </div>
                `;
            });
            html += '</div>';
            return html;
        },

        renderMultiChoice: function(question) {
            const selected = this.responses[question.id] || [];
            let html = `
                <div class="options-grid multi-choice">
                    <p class="selection-hint">Select up to ${question.maxSelections} options</p>
            `;
            
            question.options.forEach(option => {
                const isSelected = selected.includes(option.value);
                const isDisabled = !isSelected && selected.length >= question.maxSelections;
                html += `
                    <div class="option-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}" 
                         onclick="DataSenseOnboardingQuiz.selectMultiOption('${question.id}', '${option.value}', ${question.maxSelections})">
                        <span class="option-label">${option.label}</span>
                        ${option.priority ? `<span class="priority-indicator ${option.priority}"></span>` : ''}
                        <span class="checkbox ${isSelected ? 'checked' : ''}">✓</span>
                    </div>
                `;
            });
            html += '</div>';
            return html;
        },

        renderToolSelector: function(question) {
            const selected = this.responses[question.id] || [];
            let html = '<div class="tool-selector">';
            
            Object.entries(question.categories).forEach(([key, category]) => {
                html += `
                    <div class="tool-category">
                        <h4 class="category-label">${category.label}</h4>
                        <div class="tools-grid">
                `;
                
                category.tools.forEach(tool => {
                    const isSelected = selected.includes(tool);
                    html += `
                        <div class="tool-chip ${isSelected ? 'selected' : ''}" 
                             onclick="DataSenseOnboardingQuiz.toggleTool('${question.id}', '${tool}')">
                            ${tool}
                            ${isSelected ? '<span class="remove">×</span>' : '<span class="add">+</span>'}
                        </div>
                    `;
                });
                
                html += `
                        </div>
                    </div>
                `;
            });
            
            html += `
                <div class="custom-tool">
                    <input type="text" placeholder="Other tools (comma separated)" 
                           id="custom-tools" 
                           onblur="DataSenseOnboardingQuiz.addCustomTools('${question.id}')">
                </div>
            </div>`;
            
            return html;
        },

        renderOpenText: function(question) {
            const value = this.responses[question.id] || '';
            let html = `
                <div class="open-text-input">
                    <textarea 
                        id="open-text-${question.id}"
                        placeholder="${question.placeholder}"
                        onkeyup="DataSenseOnboardingQuiz.updateOpenText('${question.id}')"
                        rows="4">${value}</textarea>
                    
                    ${question.examples ? `
                        <div class="examples-section">
                            <p class="examples-label">Examples to inspire you:</p>
                            <div class="examples-list">
                                ${question.examples.map(ex => `<span class="example-chip" onclick="DataSenseOnboardingQuiz.useExample('${question.id}', '${ex}')">${ex}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    ${question.aiAnalysis ? `
                        <div class="ai-helper">
                            <button class="ai-suggest" onclick="DataSenseOnboardingQuiz.getAISuggestion('${question.id}')">
                                🤖 Get AI Suggestion
                            </button>
                        </div>
                    ` : ''}
                </div>
            `;
            return html;
        },

        renderSlider: function(question) {
            const value = this.responses[question.id] || question.defaultValue;
            let html = `
                <div class="slider-container">
                    <div class="slider-value-display">
                        <span class="value-number">${value}</span>
                        <span class="value-label">${this.getSliderLabel(question, value)}</span>
                    </div>
                    <input type="range" 
                           id="slider-${question.id}"
                           min="${question.min}" 
                           max="${question.max}" 
                           step="${question.step}"
                           value="${value}"
                           oninput="DataSenseOnboardingQuiz.updateSlider('${question.id}', this.value)">
                    <div class="slider-labels">
                        ${Object.entries(question.labels).map(([val, label]) => 
                            `<span class="slider-label" style="left: ${((val - question.min) / (question.max - question.min)) * 100}%">${label}</span>`
                        ).join('')}
                    </div>
                </div>
            `;
            return html;
        },

        renderMatrix: function(question) {
            let html = '<div class="matrix-container">';
            
            question.dimensions.forEach(dimension => {
                const value = this.responses[question.id]?.[dimension.id] || 3;
                html += `
                    <div class="matrix-row">
                        <div class="dimension-info">
                            <h4>${dimension.label}</h4>
                            <p>${dimension.description}</p>
                        </div>
                        <div class="scale-options">
                `;
                
                question.scale.forEach(scale => {
                    html += `
                        <label class="scale-option ${value === scale.value ? 'selected' : ''}">
                            <input type="radio" 
                                   name="matrix-${question.id}-${dimension.id}" 
                                   value="${scale.value}"
                                   ${value === scale.value ? 'checked' : ''}
                                   onchange="DataSenseOnboardingQuiz.updateMatrix('${question.id}', '${dimension.id}', ${scale.value})">
                            <span class="scale-label">${scale.label}</span>
                        </label>
                    `;
                });
                
                html += `
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
            return html;
        },

        renderSmartSelect: function(question) {
            const value = this.responses[question.id] || '';
            let html = `
                <div class="smart-select-container">
                    ${question.searchable ? `
                        <input type="text" 
                               class="search-input" 
                               placeholder="Type to search industries..."
                               onkeyup="DataSenseOnboardingQuiz.filterOptions('${question.id}', this.value)">
                    ` : ''}
                    <div class="smart-options" id="options-${question.id}">
            `;
            
            question.options.forEach(option => {
                const isSelected = value === option.value;
                html += `
                    <div class="smart-option ${isSelected ? 'selected' : ''}" 
                         data-value="${option.value}"
                         onclick="DataSenseOnboardingQuiz.selectSmartOption('${question.id}', '${option.value}')">
                        <span class="option-name">${option.label}</span>
                        ${option.templates ? `<span class="template-count">${option.templates} templates</span>` : ''}
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
            return html;
        },

        selectSingleOption: function(questionId, value) {
            this.responses[questionId] = value;
            this.renderQuiz();
            this.trackResponse(questionId, value);
        },

        selectMultiOption: function(questionId, value, maxSelections) {
            if (!this.responses[questionId]) {
                this.responses[questionId] = [];
            }
            
            const index = this.responses[questionId].indexOf(value);
            if (index > -1) {
                this.responses[questionId].splice(index, 1);
            } else if (this.responses[questionId].length < maxSelections) {
                this.responses[questionId].push(value);
            }
            
            this.renderQuiz();
            this.trackResponse(questionId, this.responses[questionId]);
        },

        toggleTool: function(questionId, tool) {
            if (!this.responses[questionId]) {
                this.responses[questionId] = [];
            }
            
            const index = this.responses[questionId].indexOf(tool);
            if (index > -1) {
                this.responses[questionId].splice(index, 1);
            } else {
                this.responses[questionId].push(tool);
            }
            
            this.renderQuiz();
        },

        addCustomTools: function(questionId) {
            const input = document.getElementById('custom-tools');
            if (input && input.value) {
                const tools = input.value.split(',').map(t => t.trim()).filter(t => t);
                if (!this.responses[questionId]) {
                    this.responses[questionId] = [];
                }
                this.responses[questionId] = [...new Set([...this.responses[questionId], ...tools])];
                this.renderQuiz();
            }
        },

        updateOpenText: function(questionId) {
            const textarea = document.getElementById(`open-text-${questionId}`);
            if (textarea) {
                this.responses[questionId] = textarea.value;
                this.validateCurrentQuestion();
            }
        },

        useExample: function(questionId, example) {
            this.responses[questionId] = example;
            this.renderQuiz();
        },

        getAISuggestion: function(questionId) {
            const suggestions = [
                "Identify which marketing channels bring the highest-value customers",
                "Predict which customers are likely to churn in the next 30 days",
                "Find the optimal pricing point for maximum profitability",
                "Discover hidden patterns in customer purchase behavior",
                "Analyze which product combinations drive the most revenue"
            ];
            
            const suggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
            this.responses[questionId] = suggestion;
            this.renderQuiz();
            
            this.showNotification('AI Suggestion Added', 'success');
        },

        updateSlider: function(questionId, value) {
            this.responses[questionId] = parseInt(value);
            const question = this.questions.find(q => q.id === questionId);
            document.querySelector('.value-number').textContent = value;
            document.querySelector('.value-label').textContent = this.getSliderLabel(question, value);
            this.validateCurrentQuestion();
        },

        getSliderLabel: function(question, value) {
            let closestLabel = '';
            let closestDiff = Infinity;
            
            Object.entries(question.labels).forEach(([val, label]) => {
                const diff = Math.abs(parseInt(val) - parseInt(value));
                if (diff < closestDiff) {
                    closestDiff = diff;
                    closestLabel = label;
                }
            });
            
            return closestLabel;
        },

        updateMatrix: function(questionId, dimensionId, value) {
            if (!this.responses[questionId]) {
                this.responses[questionId] = {};
            }
            this.responses[questionId][dimensionId] = value;
            this.renderQuiz();
        },

        selectSmartOption: function(questionId, value) {
            this.responses[questionId] = value;
            this.renderQuiz();
        },

        filterOptions: function(questionId, searchTerm) {
            const question = this.questions.find(q => q.id === questionId);
            const container = document.getElementById(`options-${questionId}`);
            
            question.options.forEach(option => {
                const element = container.querySelector(`[data-value="${option.value}"]`);
                if (element) {
                    const matches = option.label.toLowerCase().includes(searchTerm.toLowerCase());
                    element.style.display = matches ? 'flex' : 'none';
                }
            });
        },

        validateCurrentQuestion: function() {
            const question = this.questions[this.currentStep];
            const response = this.responses[question.id];
            const button = document.querySelector('.btn-primary');
            
            if (!button) return;
            
            let isValid = true;
            
            if (question.required) {
                switch(question.type) {
                    case 'single-choice':
                    case 'smart-select':
                        isValid = !!response;
                        break;
                    case 'multi-choice':
                        isValid = response && response.length > 0;
                        break;
                    case 'open-text':
                        isValid = response && response.trim().length > 10;
                        break;
                    case 'matrix':
                        isValid = response && Object.keys(response).length === question.dimensions.length;
                        break;
                    default:
                        isValid = !!response;
                }
            }
            
            button.disabled = !isValid;
        },

        nextQuestion: function() {
            if (this.currentStep < this.questions.length - 1) {
                this.currentStep++;
                this.renderQuiz();
                this.trackProgress();
            } else {
                this.completeQuiz();
            }
        },

        previousQuestion: function() {
            if (this.currentStep > 0) {
                this.currentStep--;
                this.renderQuiz();
            }
        },

        completeQuiz: function() {
            const completionTime = Math.round((Date.now() - this.startTime) / 1000);
            
            this.userProfile = this.analyzeResponses();
            this.userProfile.completionTime = completionTime;
            this.userProfile.timestamp = new Date().toISOString();
            
            this.saveProfile();
            this.trackCompletion();
            
            window.DataSenseOnboardingPath.generatePath(this.userProfile);
        },

        analyzeResponses: function() {
            const profile = {
                role: this.responses.role,
                challenges: this.responses.challenge || [],
                tools: this.responses.tools || [],
                desiredInsight: this.responses.insight,
                teamSize: this.responses.team || 1,
                maturityScore: this.calculateMaturityScore(),
                urgency: this.responses.urgency,
                industry: this.responses.industry,
                persona: this.determinePersona(),
                readiness: this.assessReadiness(),
                priorityFeatures: this.identifyPriorityFeatures(),
                recommendedTrack: this.recommendTrack(),
                estimatedTimeToValue: this.estimateTimeToValue()
            };
            
            return profile;
        },

        calculateMaturityScore: function() {
            const matrix = this.responses.maturity;
            if (!matrix) return 2;
            
            const scores = Object.values(matrix);
            const average = scores.reduce((a, b) => a + b, 0) / scores.length;
            
            return {
                overall: average,
                collection: matrix.collection || 2,
                analysis: matrix.analysis || 2,
                action: matrix.action || 2,
                culture: matrix.culture || 2,
                level: average < 2 ? 'beginner' : average < 3.5 ? 'intermediate' : 'advanced'
            };
        },

        determinePersona: function() {
            const role = this.responses.role;
            const challenges = this.responses.challenge || [];
            const urgency = this.responses.urgency;
            
            if (role === 'owner' && urgency === 'today') {
                return 'urgent-decision-maker';
            } else if (role === 'marketing' && challenges.includes('insights')) {
                return 'insight-seeker';
            } else if (challenges.includes('manual')) {
                return 'efficiency-optimizer';
            } else if (challenges.includes('scattered')) {
                return 'data-consolidator';
            } else if (role === 'finance') {
                return 'numbers-driven';
            } else {
                return 'explorer';
            }
        },

        assessReadiness: function() {
            const factors = {
                hasTools: (this.responses.tools?.length || 0) > 0,
                hasUrgency: ['today', 'week'].includes(this.responses.urgency),
                hasClearGoal: !!this.responses.insight,
                hasTeam: (this.responses.team || 1) > 1,
                hasMaturity: this.calculateMaturityScore().overall > 2
            };
            
            const score = Object.values(factors).filter(Boolean).length;
            
            return {
                score: score,
                level: score < 2 ? 'low' : score < 4 ? 'medium' : 'high',
                factors: factors
            };
        },

        identifyPriorityFeatures: function() {
            const priorities = [];
            const challenges = this.responses.challenge || [];
            
            if (challenges.includes('scattered')) {
                priorities.push({ feature: 'data-integration', priority: 'critical' });
            }
            if (challenges.includes('manual')) {
                priorities.push({ feature: 'automation', priority: 'high' });
            }
            if (challenges.includes('insights')) {
                priorities.push({ feature: 'ai-analysis', priority: 'critical' });
            }
            if (challenges.includes('realtime')) {
                priorities.push({ feature: 'live-dashboards', priority: 'medium' });
            }
            if (challenges.includes('team')) {
                priorities.push({ feature: 'collaboration', priority: 'medium' });
            }
            
            return priorities.sort((a, b) => {
                const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            });
        },

        recommendTrack: function() {
            const maturity = this.calculateMaturityScore().level;
            const urgency = this.responses.urgency;
            const teamSize = this.responses.team || 1;
            
            if (maturity === 'beginner' || urgency === 'today') {
                return 'white-glove';
            } else if (maturity === 'advanced' && urgency === 'exploring') {
                return 'self-serve';
            } else {
                return 'guided';
            }
        },

        estimateTimeToValue: function() {
            const track = this.recommendTrack();
            const readiness = this.assessReadiness().level;
            const toolCount = (this.responses.tools || []).length;
            
            let baseTime = 30;
            
            if (track === 'white-glove') baseTime = 15;
            if (track === 'self-serve') baseTime = 45;
            
            if (readiness === 'low') baseTime *= 1.5;
            if (readiness === 'high') baseTime *= 0.75;
            
            if (toolCount === 0) baseTime *= 1.25;
            if (toolCount > 3) baseTime *= 0.9;
            
            return Math.round(baseTime);
        },

        saveProfile: function() {
            localStorage.setItem('datasense_onboarding_profile', JSON.stringify(this.userProfile));
            localStorage.setItem('datasense_quiz_responses', JSON.stringify(this.responses));
            
            if (window.DataSenseCRM) {
                window.DataSenseCRM.updateProfile(this.userProfile);
            }
        },

        showHelp: function() {
            const helpModal = document.createElement('div');
            helpModal.className = 'help-modal';
            helpModal.innerHTML = `
                <div class="help-content">
                    <h3>Need assistance?</h3>
                    <p>Our onboarding specialist is ready to help!</p>
                    <button onclick="DataSenseOnboardingQuiz.startLiveChat()">Start Live Chat</button>
                    <button onclick="DataSenseOnboardingQuiz.scheduleCall()">Schedule a Call</button>
                    <button onclick="this.parentElement.parentElement.remove()">Continue Quiz</button>
                </div>
            `;
            document.body.appendChild(helpModal);
        },

        startLiveChat: function() {
            if (window.Intercom) {
                window.Intercom('show');
            } else {
                alert('Chat will open shortly...');
            }
        },

        scheduleCall: function() {
            window.open('https://calendly.com/datasense/onboarding', '_blank');
        },

        showNotification: function(message, type) {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => notification.remove(), 3000);
        },

        trackQuizStart: function() {
            if (window.DataSenseTracking) {
                window.DataSenseTracking.trackEvent('quiz_started', {
                    timestamp: new Date().toISOString()
                });
            }
        },

        trackResponse: function(questionId, value) {
            if (window.DataSenseTracking) {
                window.DataSenseTracking.trackEvent('quiz_response', {
                    question: questionId,
                    value: value,
                    step: this.currentStep + 1
                });
            }
        },

        trackProgress: function() {
            if (window.DataSenseTracking) {
                window.DataSenseTracking.trackEvent('quiz_progress', {
                    step: this.currentStep + 1,
                    total: this.questions.length,
                    percentage: Math.round(((this.currentStep + 1) / this.questions.length) * 100)
                });
            }
        },

        trackCompletion: function() {
            if (window.DataSenseTracking) {
                window.DataSenseTracking.trackEvent('quiz_completed', {
                    completionTime: this.userProfile.completionTime,
                    persona: this.userProfile.persona,
                    track: this.userProfile.recommendedTrack,
                    readiness: this.userProfile.readiness.level
                });
            }
        },

        attachEventListeners: function() {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    const button = document.querySelector('.btn-primary:not([disabled])');
                    if (button) button.click();
                }
            });
        }
    };

})();