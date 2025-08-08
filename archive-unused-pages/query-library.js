// Query Library Interactive Functionality
(function() {
    'use strict';

    // State management
    const state = {
        currentCategory: 'all',
        currentIndustry: 'all',
        searchTerm: '',
        displayedQueries: 12,
        savedQueries: JSON.parse(localStorage.getItem('savedQueries') || '[]'),
        queriesPerLoad: 12
    };

    // Initialize on DOM load
    document.addEventListener('DOMContentLoaded', function() {
        initializeQueryLibrary();
        setupEventListeners();
        renderQueries();
        updateSavedQueriesList();
    });

    // Initialize query library
    function initializeQueryLibrary() {
        // Track page view
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_title: 'Query Library',
                page_path: '/query-library'
            });
        }
    }

    // Setup all event listeners
    function setupEventListeners() {
        // Function filter tabs
        document.querySelectorAll('#function-filters .filter-tab').forEach(tab => {
            tab.addEventListener('click', handleFunctionFilter);
        });

        // Industry filter tabs
        document.querySelectorAll('#industry-filters .filter-tab').forEach(tab => {
            tab.addEventListener('click', handleIndustryFilter);
        });

        // Search functionality
        const searchInput = document.getElementById('query-search');
        if (searchInput) {
            searchInput.addEventListener('input', debounce(handleSearch, 300));
            searchInput.addEventListener('focus', showSearchSuggestions);
        }

        // Load more button
        const loadMoreBtn = document.getElementById('load-more-queries');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', loadMoreQueries);
        }

        // Custom query builder
        const customInput = document.getElementById('custom-query-input');
        if (customInput) {
            customInput.addEventListener('input', handleCustomQueryInput);
            customInput.addEventListener('focus', showQuerySuggestions);
        }

        // Submit custom query
        const submitBtn = document.getElementById('submit-custom-query');
        if (submitBtn) {
            submitBtn.addEventListener('click', submitCustomQuery);
        }

        // Suggestion pills
        document.querySelectorAll('.suggestion-pill').forEach(pill => {
            pill.addEventListener('click', handleSuggestionClick);
        });

        // Manage saved queries
        const manageBtn = document.getElementById('manage-saved');
        if (manageBtn) {
            manageBtn.addEventListener('click', manageSavedQueries);
        }
    }

    // Handle function filter selection
    function handleFunctionFilter(e) {
        const filter = e.target.dataset.filter;
        
        // Update active state
        document.querySelectorAll('#function-filters .filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        e.target.classList.add('active');
        
        // Update state and render
        state.currentCategory = filter;
        state.displayedQueries = state.queriesPerLoad;
        renderQueries();
        
        // Track interaction
        trackInteraction('filter_category', filter);
    }

    // Handle industry filter selection
    function handleIndustryFilter(e) {
        const industry = e.target.dataset.industry;
        
        // Update active state
        document.querySelectorAll('#industry-filters .filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        e.target.classList.add('active');
        
        // Update state and render
        state.currentIndustry = industry;
        state.displayedQueries = state.queriesPerLoad;
        renderQueries();
        
        // Track interaction
        trackInteraction('filter_industry', industry);
    }

    // Handle search input
    function handleSearch(e) {
        state.searchTerm = e.target.value;
        state.displayedQueries = state.queriesPerLoad;
        renderQueries();
        
        if (state.searchTerm) {
            showSearchSuggestions();
            trackInteraction('search_query', state.searchTerm);
        } else {
            hideSearchSuggestions();
        }
    }

    // Render queries to the grid
    function renderQueries() {
        const grid = document.getElementById('query-grid');
        if (!grid) return;
        
        // Get filtered queries
        const queries = filterQueries(
            state.currentCategory,
            state.currentIndustry,
            state.searchTerm
        );
        
        // Limit to displayed count
        const displayQueries = queries.slice(0, state.displayedQueries);
        
        // Clear grid
        grid.innerHTML = '';
        
        // Render query cards
        displayQueries.forEach((query, index) => {
            const card = createQueryCard(query, index);
            grid.appendChild(card);
        });
        
        // Update load more button visibility
        const loadMoreBtn = document.getElementById('load-more-queries');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = 
                queries.length > state.displayedQueries ? 'flex' : 'none';
        }
        
        // Add entrance animations
        animateQueryCards();
    }

    // Create a query card element
    function createQueryCard(query, index) {
        const card = document.createElement('div');
        card.className = 'query-card';
        card.dataset.category = query.category;
        card.dataset.queryId = query.id;
        card.style.animationDelay = `${index * 50}ms`;
        
        const isSaved = state.savedQueries.includes(query.id);
        
        card.innerHTML = `
            <div class="query-card-header">
                <span class="query-icon">${query.icon}</span>
                <button class="query-save-btn ${isSaved ? 'saved' : ''}" 
                        data-query-id="${query.id}"
                        title="${isSaved ? 'Remove from saved' : 'Save query'}">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"/>
                    </svg>
                </button>
            </div>
            
            <h4 class="query-title">${query.title}</h4>
            <p class="query-text">"${query.query}"</p>
            
            <div class="query-meta">
                <span class="query-complexity complexity-${query.complexity}">
                    ${query.complexity}
                </span>
                <span class="query-time">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                    </svg>
                    ${query.timeToValue}
                </span>
            </div>
            
            <div class="expected-insight">
                <span class="insight-icon">💡</span>
                <span class="insight-text">${query.expectedInsight}</span>
            </div>
            
            <div class="query-value">
                <strong>Business Value:</strong> ${query.businessValue}
            </div>
            
            <div class="query-tags">
                ${query.tags.map(tag => `<span class="query-tag">#${tag}</span>`).join('')}
            </div>
            
            <div class="query-actions">
                <button class="btn btn-primary btn-small try-query-btn" 
                        data-query="${encodeURIComponent(query.query)}">
                    Try This Query
                    <svg class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
                    </svg>
                </button>
                <button class="btn btn-ghost btn-small copy-query-btn" 
                        data-query="${query.query}">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"/>
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"/>
                    </svg>
                    Copy
                </button>
            </div>
        `;
        
        // Add event listeners
        const tryBtn = card.querySelector('.try-query-btn');
        tryBtn.addEventListener('click', () => tryQuery(query));
        
        const copyBtn = card.querySelector('.copy-query-btn');
        copyBtn.addEventListener('click', () => copyQuery(query.query));
        
        const saveBtn = card.querySelector('.query-save-btn');
        saveBtn.addEventListener('click', () => toggleSaveQuery(query.id));
        
        // Click on card for details
        card.addEventListener('click', (e) => {
            if (!e.target.closest('button')) {
                showQueryDetails(query);
            }
        });
        
        return card;
    }

    // Try a query (integrate with demo)
    function tryQuery(query) {
        trackInteraction('try_query', query.id, query.category);
        
        // Store query in session
        sessionStorage.setItem('demoQuery', JSON.stringify(query));
        
        // Redirect to demo or open in modal
        if (window.location.pathname.includes('query-library')) {
            // Open in modal
            showDemoModal(query);
        } else {
            // Redirect to main page demo section
            window.location.href = 'index.html#demo-section?query=' + encodeURIComponent(query.query);
        }
    }

    // Copy query to clipboard
    function copyQuery(queryText) {
        navigator.clipboard.writeText(queryText).then(() => {
            showToast('Query copied to clipboard!');
            trackInteraction('copy_query', queryText);
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    }

    // Toggle save query
    function toggleSaveQuery(queryId) {
        const index = state.savedQueries.indexOf(queryId);
        
        if (index > -1) {
            state.savedQueries.splice(index, 1);
            showToast('Query removed from saved');
        } else {
            state.savedQueries.push(queryId);
            showToast('Query saved for later');
        }
        
        // Update localStorage
        localStorage.setItem('savedQueries', JSON.stringify(state.savedQueries));
        
        // Update UI
        updateSavedQueriesList();
        renderQueries();
        
        trackInteraction('save_query', queryId, index > -1 ? 'remove' : 'add');
    }

    // Show query details modal
    function showQueryDetails(query) {
        const modal = document.getElementById('query-modal');
        const modalBody = document.getElementById('modal-body');
        
        if (!modal || !modalBody) return;
        
        modalBody.innerHTML = `
            <div class="query-detail">
                <div class="query-detail-header">
                    <span class="query-detail-icon">${query.icon}</span>
                    <h2 class="query-detail-title">${query.title}</h2>
                </div>
                
                <div class="query-detail-content">
                    <div class="detail-section">
                        <h3>The Query</h3>
                        <div class="query-box">
                            <p class="query-text-large">"${query.query}"</p>
                            <button class="btn btn-small copy-btn" onclick="copyQuery('${query.query}')">
                                Copy Query
                            </button>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h3>What This Tells You</h3>
                        <p>${query.description}</p>
                    </div>
                    
                    <div class="detail-section">
                        <h3>Expected Insights</h3>
                        <div class="insight-box">
                            <span class="insight-icon">💡</span>
                            <p>${query.expectedInsight}</p>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h3>Business Impact</h3>
                        <p class="business-value">${query.businessValue}</p>
                    </div>
                    
                    <div class="detail-metrics">
                        <div class="metric">
                            <span class="metric-label">Time to Answer</span>
                            <span class="metric-value">${query.timeToValue}</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Complexity</span>
                            <span class="metric-value complexity-${query.complexity}">${query.complexity}</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Category</span>
                            <span class="metric-value">${query.category}</span>
                        </div>
                    </div>
                    
                    <div class="detail-actions">
                        <button class="btn btn-primary btn-large" onclick="tryQuery(${JSON.stringify(query).replace(/"/g, '&quot;')})">
                            Try This Query Now
                            <svg class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        trackInteraction('view_query_details', query.id);
    }

    // Close query modal
    window.closeQueryModal = function() {
        const modal = document.getElementById('query-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    };

    // Load more queries
    function loadMoreQueries() {
        state.displayedQueries += state.queriesPerLoad;
        renderQueries();
        trackInteraction('load_more_queries', state.displayedQueries);
    }

    // Handle custom query input
    function handleCustomQueryInput(e) {
        const input = e.target.value;
        
        if (input.length > 10) {
            showAIPreview(input);
        } else {
            hideAIPreview();
        }
    }

    // Show AI preview for custom query
    function showAIPreview(query) {
        const preview = document.getElementById('ai-preview');
        const content = document.getElementById('ai-preview-content');
        
        if (!preview || !content) return;
        
        // Simulate AI understanding
        const understanding = analyzeQuery(query);
        
        content.innerHTML = `
            <div class="ai-understanding">
                <p><strong>I understand you want to:</strong></p>
                <p>${understanding.intent}</p>
                
                <div class="ai-requirements">
                    <p><strong>Data I'll need:</strong></p>
                    <ul>
                        ${understanding.dataNeeds.map(need => `<li>${need}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="ai-output">
                    <p><strong>What you'll get:</strong></p>
                    <p>${understanding.output}</p>
                </div>
                
                <div class="ai-confidence">
                    <span>Confidence: </span>
                    <div class="confidence-bar">
                        <div class="confidence-fill" style="width: ${understanding.confidence}%"></div>
                    </div>
                    <span>${understanding.confidence}%</span>
                </div>
            </div>
        `;
        
        preview.style.display = 'block';
    }

    // Hide AI preview
    function hideAIPreview() {
        const preview = document.getElementById('ai-preview');
        if (preview) {
            preview.style.display = 'none';
        }
    }

    // Analyze query (simulated)
    function analyzeQuery(query) {
        const queryLower = query.toLowerCase();
        
        // Simple keyword analysis
        const intents = {
            revenue: ['revenue', 'sales', 'income', 'profit'],
            customers: ['customer', 'user', 'client', 'churn'],
            marketing: ['marketing', 'campaign', 'roi', 'conversion'],
            operations: ['efficiency', 'cost', 'process', 'bottleneck']
        };
        
        let category = 'general';
        let confidence = 75;
        
        for (const [cat, keywords] of Object.entries(intents)) {
            if (keywords.some(keyword => queryLower.includes(keyword))) {
                category = cat;
                confidence = 85;
                break;
            }
        }
        
        return {
            intent: `Analyze ${category} metrics and provide actionable insights`,
            dataNeeds: [
                'Historical transaction data',
                'Customer interaction logs',
                'Operational metrics'
            ],
            output: 'Interactive dashboard with key metrics, trends, and recommendations',
            confidence: confidence
        };
    }

    // Submit custom query
    function submitCustomQuery() {
        const input = document.getElementById('custom-query-input');
        if (!input || !input.value) return;
        
        const query = {
            id: 'custom-' + Date.now(),
            category: 'custom',
            title: 'Custom Query',
            query: input.value,
            description: 'Your custom business question',
            expectedInsight: 'AI-powered analysis',
            timeToValue: '60 seconds',
            complexity: 'custom',
            businessValue: 'Custom insights',
            icon: '🎯',
            tags: ['custom']
        };
        
        tryQuery(query);
        trackInteraction('submit_custom_query', input.value);
    }

    // Handle suggestion click
    function handleSuggestionClick(e) {
        const query = e.target.dataset.query;
        const input = document.getElementById('custom-query-input');
        
        if (input && query) {
            input.value = query;
            handleCustomQueryInput({ target: input });
            trackInteraction('use_suggestion', query);
        }
    }

    // Show search suggestions
    function showSearchSuggestions() {
        const suggestions = document.getElementById('search-suggestions');
        if (!suggestions) return;
        
        const popularSearches = [
            'revenue growth',
            'customer churn',
            'marketing ROI',
            'profit margins',
            'inventory optimization'
        ];
        
        suggestions.innerHTML = `
            <div class="suggestions-list">
                <p class="suggestions-label">Popular searches:</p>
                ${popularSearches.map(search => `
                    <button class="suggestion-item" onclick="setSearchTerm('${search}')">
                        ${search}
                    </button>
                `).join('')}
            </div>
        `;
        
        suggestions.style.display = 'block';
    }

    // Hide search suggestions
    function hideSearchSuggestions() {
        const suggestions = document.getElementById('search-suggestions');
        if (suggestions) {
            setTimeout(() => {
                suggestions.style.display = 'none';
            }, 200);
        }
    }

    // Set search term
    window.setSearchTerm = function(term) {
        const input = document.getElementById('query-search');
        if (input) {
            input.value = term;
            handleSearch({ target: input });
        }
    };

    // Update saved queries list
    function updateSavedQueriesList() {
        const list = document.getElementById('saved-queries-list');
        if (!list) return;
        
        if (state.savedQueries.length === 0) {
            list.innerHTML = `
                <div class="empty-state">
                    <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                    </svg>
                    <p class="empty-text">No saved queries yet. Click the bookmark icon on any query to save it for later.</p>
                </div>
            `;
        } else {
            const allQueries = getAllQueries();
            const savedQueryObjects = state.savedQueries
                .map(id => allQueries.find(q => q.id === id))
                .filter(q => q);
            
            list.innerHTML = `
                <div class="saved-queries-grid">
                    ${savedQueryObjects.map(query => `
                        <div class="saved-query-item">
                            <span class="saved-query-icon">${query.icon}</span>
                            <div class="saved-query-content">
                                <h4>${query.title}</h4>
                                <p>${query.query}</p>
                            </div>
                            <button class="btn btn-small" onclick="tryQuery(${JSON.stringify(query).replace(/"/g, '&quot;')})">
                                Try
                            </button>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }

    // Manage saved queries
    function manageSavedQueries() {
        if (confirm('Clear all saved queries?')) {
            state.savedQueries = [];
            localStorage.setItem('savedQueries', JSON.stringify(state.savedQueries));
            updateSavedQueriesList();
            renderQueries();
            showToast('Saved queries cleared');
        }
    }

    // Show toast notification
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // Animate query cards
    function animateQueryCards() {
        const cards = document.querySelectorAll('.query-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }

    // Track interactions
    function trackInteraction(action, label, value) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: 'query_library',
                event_label: label,
                value: value
            });
        }
        
        console.log('Query Library Interaction:', action, label, value);
    }

    // Debounce helper
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Export for global access
    window.queryLibrary = {
        tryQuery,
        copyQuery,
        showQueryDetails,
        closeQueryModal
    };

})();