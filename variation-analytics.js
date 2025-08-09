class VariationAnalytics {
    constructor() {
        this.variationData = {
            currentVariation: null,
            variationName: null,
            startTime: null,
            sessionId: null,
            events: [],
            interactions: {
                clicks: [],
                formInteractions: [],
                ctaClicks: [],
                scrollDepth: 0,
                timeSpent: 0
            }
        };
        
        this.storage = {
            local: 'variation_analytics_data',
            session: 'variation_session_data'
        };
        
        this.config = {
            trackingEnabled: true,
            debugMode: window.location.hostname === 'localhost',
            storageLimit: 1000,
            flushInterval: 30000
        };
        
        this.init();
    }
    
    init() {
        this.loadStoredData();
        this.setupVariationTracking();
        this.setupEventListeners();
        this.setupPeriodicFlush();
        this.integrateWithExistingAnalytics();
        
        if (this.config.debugMode) {
            console.log('[Variation Analytics] Initialized');
        }
    }
    
    setupVariationTracking() {
        const storedVariation = sessionStorage.getItem('currentVariation');
        if (storedVariation) {
            this.startVariationSession(storedVariation);
        }
        
        const observer = new MutationObserver(() => {
            const currentVariation = sessionStorage.getItem('currentVariation');
            if (currentVariation && currentVariation !== this.variationData.currentVariation) {
                if (this.variationData.currentVariation) {
                    this.endVariationSession();
                }
                this.startVariationSession(currentVariation);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['data-content-id']
        });
    }
    
    startVariationSession(variationId) {
        const variationName = this.getVariationName(variationId);
        
        this.variationData = {
            currentVariation: variationId,
            variationName: variationName,
            startTime: Date.now(),
            sessionId: this.generateSessionId(),
            events: [],
            interactions: {
                clicks: [],
                formInteractions: [],
                ctaClicks: [],
                scrollDepth: 0,
                timeSpent: 0
            }
        };
        
        this.trackEvent('variation_view', {
            variation_id: variationId,
            variation_name: variationName,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            referrer: document.referrer,
            device_type: this.getDeviceType(),
            browser: this.getBrowserInfo()
        });
        
        if (this.config.debugMode) {
            console.log(`[Variation Analytics] Started session for variation: ${variationId}`);
        }
    }
    
    endVariationSession() {
        if (!this.variationData.currentVariation) return;
        
        const sessionDuration = Date.now() - this.variationData.startTime;
        this.variationData.interactions.timeSpent = sessionDuration;
        
        this.trackEvent('variation_session_end', {
            variation_id: this.variationData.currentVariation,
            variation_name: this.variationData.variationName,
            session_duration: sessionDuration,
            interactions_count: this.variationData.events.length,
            max_scroll_depth: this.variationData.interactions.scrollDepth,
            cta_clicks: this.variationData.interactions.ctaClicks.length,
            form_interactions: this.variationData.interactions.formInteractions.length
        });
        
        this.saveSessionData();
    }
    
    setupEventListeners() {
        this.trackScrollDepth();
        this.trackClicks();
        this.trackFormInteractions();
        this.trackTimeOnVariation();
        this.trackPageExit();
    }
    
    trackScrollDepth() {
        let maxScroll = 0;
        let ticking = false;
        
        const updateScrollDepth = () => {
            const scrollPercentage = Math.round(
                (window.scrollY + window.innerHeight) / 
                document.documentElement.scrollHeight * 100
            );
            
            if (scrollPercentage > maxScroll) {
                maxScroll = scrollPercentage;
                this.variationData.interactions.scrollDepth = maxScroll;
                
                const milestones = [25, 50, 75, 100];
                milestones.forEach(milestone => {
                    if (maxScroll >= milestone && !this.variationData.events.some(e => 
                        e.type === 'scroll_milestone' && e.data.depth === milestone)) {
                        this.trackEvent('scroll_milestone', {
                            variation_id: this.variationData.currentVariation,
                            depth: milestone,
                            time_to_scroll: Date.now() - this.variationData.startTime
                        });
                    }
                });
            }
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateScrollDepth);
                ticking = true;
            }
        });
    }
    
    trackClicks() {
        document.addEventListener('click', (e) => {
            if (!this.variationData.currentVariation) return;
            
            const target = e.target;
            const clickData = {
                variation_id: this.variationData.currentVariation,
                element_type: target.tagName,
                element_text: target.textContent?.substring(0, 100),
                element_class: target.className,
                element_id: target.id,
                timestamp: Date.now(),
                time_since_start: Date.now() - this.variationData.startTime,
                page_section: this.getPageSection(target)
            };
            
            if (target.matches('.cta-button, .btn-primary, [data-track="cta"], button[type="submit"]')) {
                clickData.is_cta = true;
                this.variationData.interactions.ctaClicks.push(clickData);
                
                this.trackEvent('cta_click', {
                    ...clickData,
                    button_variant: target.dataset.variant || 'default',
                    button_position: this.getElementPosition(target)
                });
            } else if (target.matches('a, button')) {
                this.variationData.interactions.clicks.push(clickData);
                
                this.trackEvent('element_click', clickData);
            }
            
            if (target.matches('[data-content-id]')) {
                const contentId = target.getAttribute('data-content-id');
                this.trackEvent('variation_content_click', {
                    ...clickData,
                    content_id: contentId,
                    content_value: target.textContent
                });
            }
        });
    }
    
    trackFormInteractions() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const formId = form.id || form.className || 'unnamed_form';
            let formStartTime = null;
            let fieldsInteracted = new Set();
            let lastFieldValue = {};
            
            form.addEventListener('focusin', (e) => {
                if (!this.variationData.currentVariation) return;
                
                if (!formStartTime) {
                    formStartTime = Date.now();
                    this.trackEvent('form_start', {
                        variation_id: this.variationData.currentVariation,
                        form_id: formId,
                        timestamp: Date.now()
                    });
                }
                
                const fieldName = e.target.name || e.target.id || 'unnamed_field';
                fieldsInteracted.add(fieldName);
                
                this.trackEvent('form_field_focus', {
                    variation_id: this.variationData.currentVariation,
                    form_id: formId,
                    field_name: fieldName,
                    field_type: e.target.type,
                    fields_touched: fieldsInteracted.size,
                    time_to_field: formStartTime ? Date.now() - formStartTime : 0
                });
            });
            
            form.addEventListener('change', (e) => {
                if (!this.variationData.currentVariation) return;
                
                const fieldName = e.target.name || e.target.id || 'unnamed_field';
                const fieldValue = e.target.value;
                
                if (lastFieldValue[fieldName] !== fieldValue) {
                    lastFieldValue[fieldName] = fieldValue;
                    
                    this.trackEvent('form_field_change', {
                        variation_id: this.variationData.currentVariation,
                        form_id: formId,
                        field_name: fieldName,
                        field_type: e.target.type,
                        field_filled: fieldValue.length > 0,
                        time_to_fill: formStartTime ? Date.now() - formStartTime : 0
                    });
                }
            });
            
            form.addEventListener('submit', (e) => {
                if (!this.variationData.currentVariation) return;
                
                const formData = {
                    variation_id: this.variationData.currentVariation,
                    form_id: formId,
                    fields_completed: fieldsInteracted.size,
                    time_to_submit: formStartTime ? Date.now() - formStartTime : 0,
                    total_session_time: Date.now() - this.variationData.startTime,
                    submission_successful: true
                };
                
                this.variationData.interactions.formInteractions.push(formData);
                
                this.trackEvent('form_submit', formData);
                
                this.trackConversion('form_submission', {
                    ...formData,
                    conversion_value: 1,
                    variation_path: this.getVariationPath()
                });
            });
            
            form.addEventListener('error', (e) => {
                this.trackEvent('form_error', {
                    variation_id: this.variationData.currentVariation,
                    form_id: formId,
                    error_type: 'submission_error',
                    timestamp: Date.now()
                });
            });
        });
    }
    
    trackTimeOnVariation() {
        const intervals = [5, 10, 15, 30, 60, 120, 180, 300];
        
        intervals.forEach(seconds => {
            setTimeout(() => {
                if (this.variationData.currentVariation) {
                    this.trackEvent('time_milestone', {
                        variation_id: this.variationData.currentVariation,
                        seconds_on_variation: seconds,
                        engagement_score: this.calculateEngagementScore()
                    });
                }
            }, seconds * 1000);
        });
        
        setInterval(() => {
            if (this.variationData.currentVariation) {
                this.variationData.interactions.timeSpent = Date.now() - this.variationData.startTime;
            }
        }, 1000);
    }
    
    trackPageExit() {
        let exitIntentTracked = false;
        
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 0 && !exitIntentTracked && this.variationData.currentVariation) {
                exitIntentTracked = true;
                this.trackEvent('exit_intent', {
                    variation_id: this.variationData.currentVariation,
                    time_on_page: Date.now() - this.variationData.startTime,
                    scroll_depth: this.variationData.interactions.scrollDepth,
                    interactions_count: this.variationData.events.length
                });
            }
        });
        
        window.addEventListener('beforeunload', () => {
            if (this.variationData.currentVariation) {
                this.endVariationSession();
            }
        });
        
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.variationData.currentVariation) {
                this.trackEvent('tab_hidden', {
                    variation_id: this.variationData.currentVariation,
                    time_visible: Date.now() - this.variationData.startTime
                });
            } else if (!document.hidden && this.variationData.currentVariation) {
                this.trackEvent('tab_visible', {
                    variation_id: this.variationData.currentVariation
                });
            }
        });
    }
    
    trackEvent(eventType, eventData) {
        const event = {
            type: eventType,
            data: {
                ...eventData,
                session_id: this.variationData.sessionId,
                timestamp: new Date().toISOString()
            }
        };
        
        this.variationData.events.push(event);
        
        if (window.Analytics && window.Analytics.track) {
            window.Analytics.track(`variation_${eventType}`, event.data);
        }
        
        if (typeof gtag !== 'undefined') {
            gtag('event', `variation_${eventType}`, {
                ...event.data,
                event_category: 'variation_tracking',
                event_label: this.variationData.currentVariation
            });
        }
        
        if (this.config.debugMode) {
            console.log(`[Variation Analytics] Event: ${eventType}`, event.data);
        }
        
        if (this.variationData.events.length >= 50) {
            this.flushEvents();
        }
    }
    
    trackConversion(conversionType, conversionData) {
        const conversion = {
            type: conversionType,
            variation_id: this.variationData.currentVariation,
            variation_name: this.variationData.variationName,
            timestamp: new Date().toISOString(),
            session_id: this.variationData.sessionId,
            time_to_conversion: Date.now() - this.variationData.startTime,
            ...conversionData
        };
        
        this.trackEvent('conversion', conversion);
        
        this.saveConversion(conversion);
    }
    
    calculateEngagementScore() {
        const timeWeight = 0.3;
        const scrollWeight = 0.2;
        const clickWeight = 0.25;
        const ctaWeight = 0.25;
        
        const timeScore = Math.min((Date.now() - this.variationData.startTime) / 60000, 10) * 10;
        const scrollScore = this.variationData.interactions.scrollDepth;
        const clickScore = Math.min(this.variationData.interactions.clicks.length * 10, 100);
        const ctaScore = this.variationData.interactions.ctaClicks.length * 50;
        
        return Math.round(
            timeScore * timeWeight +
            scrollScore * scrollWeight +
            clickScore * clickWeight +
            ctaScore * ctaWeight
        );
    }
    
    getVariationPath() {
        return this.variationData.events
            .filter(e => ['variation_view', 'cta_click', 'form_start', 'form_submit'].includes(e.type))
            .map(e => e.type);
    }
    
    integrateWithExistingAnalytics() {
        if (window.activeVariants === undefined) {
            window.activeVariants = {};
        }
        
        const updateActiveVariants = () => {
            if (this.variationData.currentVariation) {
                window.activeVariants = {
                    variation_id: this.variationData.currentVariation,
                    variation_name: this.variationData.variationName,
                    session_id: this.variationData.sessionId
                };
            }
        };
        
        updateActiveVariants();
        
        const originalApplyVariation = window.contentInjection?.applyVariation;
        if (originalApplyVariation) {
            window.contentInjection.applyVariation = (variationId) => {
                const result = originalApplyVariation.call(window.contentInjection, variationId);
                if (result) {
                    if (this.variationData.currentVariation) {
                        this.endVariationSession();
                    }
                    this.startVariationSession(variationId);
                    updateActiveVariants();
                }
                return result;
            };
        }
    }
    
    saveSessionData() {
        const sessionData = {
            ...this.variationData,
            endTime: Date.now()
        };
        
        let storedData = this.getStoredData();
        storedData.sessions.push(sessionData);
        
        if (storedData.sessions.length > this.config.storageLimit) {
            storedData.sessions = storedData.sessions.slice(-this.config.storageLimit);
        }
        
        localStorage.setItem(this.storage.local, JSON.stringify(storedData));
        
        if (window.location.hostname !== 'localhost') {
            this.sendToBackend(sessionData);
        }
    }
    
    saveConversion(conversionData) {
        let storedData = this.getStoredData();
        storedData.conversions.push(conversionData);
        
        localStorage.setItem(this.storage.local, JSON.stringify(storedData));
        
        if (window.location.hostname !== 'localhost') {
            fetch('/api/analytics/conversion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(conversionData)
            }).catch(() => {});
        }
    }
    
    flushEvents() {
        if (this.variationData.events.length === 0) return;
        
        const events = [...this.variationData.events];
        this.variationData.events = [];
        
        const payload = {
            variation_id: this.variationData.currentVariation,
            session_id: this.variationData.sessionId,
            events: events
        };
        
        if (window.location.hostname !== 'localhost') {
            fetch('/api/analytics/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).catch(() => {
                this.variationData.events.push(...events);
            });
        }
    }
    
    setupPeriodicFlush() {
        setInterval(() => {
            this.flushEvents();
        }, this.config.flushInterval);
    }
    
    sendToBackend(data) {
        fetch('/api/analytics/variation-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).catch(() => {
            console.warn('[Variation Analytics] Failed to send data to backend');
        });
    }
    
    loadStoredData() {
        const stored = localStorage.getItem(this.storage.local);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('[Variation Analytics] Failed to parse stored data');
            }
        }
        return this.getDefaultStorageStructure();
    }
    
    getStoredData() {
        return this.loadStoredData();
    }
    
    getDefaultStorageStructure() {
        return {
            sessions: [],
            conversions: [],
            metadata: {
                version: '1.0',
                created: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
            }
        };
    }
    
    exportAnalyticsData(format = 'json') {
        const data = this.getStoredData();
        
        const summary = {
            total_sessions: data.sessions.length,
            total_conversions: data.conversions.length,
            variations_tested: [...new Set(data.sessions.map(s => s.currentVariation))],
            date_range: {
                start: data.sessions[0]?.startTime ? new Date(data.sessions[0].startTime).toISOString() : null,
                end: new Date().toISOString()
            },
            conversion_rate_by_variation: this.calculateConversionRates(data),
            engagement_by_variation: this.calculateEngagementMetrics(data),
            user_flow_by_variation: this.analyzeUserFlows(data)
        };
        
        const exportData = {
            summary,
            raw_sessions: data.sessions,
            raw_conversions: data.conversions,
            export_date: new Date().toISOString(),
            export_version: '1.0'
        };
        
        if (format === 'csv') {
            return this.convertToCSV(exportData);
        }
        
        return JSON.stringify(exportData, null, 2);
    }
    
    calculateConversionRates(data) {
        const rates = {};
        const variations = [...new Set(data.sessions.map(s => s.currentVariation))];
        
        variations.forEach(variation => {
            const sessions = data.sessions.filter(s => s.currentVariation === variation);
            const conversions = data.conversions.filter(c => c.variation_id === variation);
            
            rates[variation] = {
                sessions_count: sessions.length,
                conversions_count: conversions.length,
                conversion_rate: sessions.length > 0 ? (conversions.length / sessions.length * 100).toFixed(2) + '%' : '0%',
                avg_time_to_conversion: conversions.length > 0 ? 
                    Math.round(conversions.reduce((sum, c) => sum + c.time_to_conversion, 0) / conversions.length / 1000) + 's' : 'N/A'
            };
        });
        
        return rates;
    }
    
    calculateEngagementMetrics(data) {
        const metrics = {};
        const variations = [...new Set(data.sessions.map(s => s.currentVariation))];
        
        variations.forEach(variation => {
            const sessions = data.sessions.filter(s => s.currentVariation === variation);
            
            if (sessions.length > 0) {
                const avgTimeSpent = sessions.reduce((sum, s) => sum + (s.interactions?.timeSpent || 0), 0) / sessions.length;
                const avgScrollDepth = sessions.reduce((sum, s) => sum + (s.interactions?.scrollDepth || 0), 0) / sessions.length;
                const avgCtaClicks = sessions.reduce((sum, s) => sum + (s.interactions?.ctaClicks?.length || 0), 0) / sessions.length;
                const avgFormInteractions = sessions.reduce((sum, s) => sum + (s.interactions?.formInteractions?.length || 0), 0) / sessions.length;
                
                metrics[variation] = {
                    avg_time_spent: Math.round(avgTimeSpent / 1000) + 's',
                    avg_scroll_depth: avgScrollDepth.toFixed(1) + '%',
                    avg_cta_clicks: avgCtaClicks.toFixed(2),
                    avg_form_interactions: avgFormInteractions.toFixed(2),
                    bounce_rate: (sessions.filter(s => (s.interactions?.timeSpent || 0) < 10000).length / sessions.length * 100).toFixed(1) + '%'
                };
            }
        });
        
        return metrics;
    }
    
    analyzeUserFlows(data) {
        const flows = {};
        const variations = [...new Set(data.sessions.map(s => s.currentVariation))];
        
        variations.forEach(variation => {
            const sessions = data.sessions.filter(s => s.currentVariation === variation);
            const pathCounts = {};
            
            sessions.forEach(session => {
                if (session.events) {
                    const keyEvents = session.events
                        .filter(e => ['variation_view', 'cta_click', 'form_start', 'form_submit', 'conversion'].includes(e.type))
                        .map(e => e.type);
                    
                    const pathKey = keyEvents.join(' → ');
                    pathCounts[pathKey] = (pathCounts[pathKey] || 0) + 1;
                }
            });
            
            flows[variation] = Object.entries(pathCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([path, count]) => ({
                    path,
                    count,
                    percentage: (count / sessions.length * 100).toFixed(1) + '%'
                }));
        });
        
        return flows;
    }
    
    convertToCSV(data) {
        const sessions = data.raw_sessions;
        const headers = [
            'Session ID',
            'Variation ID',
            'Variation Name',
            'Start Time',
            'End Time',
            'Duration (s)',
            'Scroll Depth (%)',
            'CTA Clicks',
            'Form Interactions',
            'Total Events',
            'Converted'
        ];
        
        const rows = sessions.map(session => [
            session.sessionId,
            session.currentVariation,
            session.variationName || '',
            new Date(session.startTime).toISOString(),
            session.endTime ? new Date(session.endTime).toISOString() : '',
            session.interactions?.timeSpent ? Math.round(session.interactions.timeSpent / 1000) : 0,
            session.interactions?.scrollDepth || 0,
            session.interactions?.ctaClicks?.length || 0,
            session.interactions?.formInteractions?.length || 0,
            session.events?.length || 0,
            data.raw_conversions.some(c => c.session_id === session.sessionId) ? 'Yes' : 'No'
        ]);
        
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');
        
        return csvContent;
    }
    
    downloadAnalyticsReport(format = 'json') {
        const data = this.exportAnalyticsData(format);
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `variation-analytics-${timestamp}.${format}`;
        
        const blob = new Blob([data], { 
            type: format === 'csv' ? 'text/csv' : 'application/json' 
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log(`[Variation Analytics] Downloaded report: ${filename}`);
    }
    
    getVariationName(variationId) {
        if (window.contentInjection && window.contentInjection.variations) {
            const variation = window.contentInjection.variations[variationId];
            return variation?.name || variationId;
        }
        return variationId;
    }
    
    getDeviceType() {
        const width = window.innerWidth;
        if (width < 768) return 'mobile';
        if (width < 1024) return 'tablet';
        return 'desktop';
    }
    
    getBrowserInfo() {
        const ua = navigator.userAgent;
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Safari')) return 'Safari';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Edge')) return 'Edge';
        return 'Other';
    }
    
    getPageSection(element) {
        const section = element.closest('section, [data-section]');
        return section?.dataset?.section || section?.className || 'unknown';
    }
    
    getElementPosition(element) {
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return rect.top + scrollTop < window.innerHeight ? 'above_fold' : 'below_fold';
    }
    
    generateSessionId() {
        return 'vs_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    }
    
    getPublicAPI() {
        return {
            getAnalyticsData: () => this.getStoredData(),
            exportData: (format) => this.exportAnalyticsData(format),
            downloadReport: (format) => this.downloadAnalyticsReport(format),
            getCurrentVariation: () => this.variationData.currentVariation,
            getEngagementScore: () => this.calculateEngagementScore(),
            trackCustomEvent: (eventType, data) => this.trackEvent(eventType, data),
            getConversionRates: () => this.calculateConversionRates(this.getStoredData()),
            getEngagementMetrics: () => this.calculateEngagementMetrics(this.getStoredData()),
            clearData: () => {
                localStorage.removeItem(this.storage.local);
                sessionStorage.removeItem(this.storage.session);
                console.log('[Variation Analytics] Data cleared');
            }
        };
    }
}

const variationAnalytics = new VariationAnalytics();

window.VariationAnalytics = variationAnalytics.getPublicAPI();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = VariationAnalytics;
}