// Statistical Significance Calculator and Testing Utilities
(function(window) {
    'use strict';

    const ABTestStatistics = {
        // Configuration
        config: {
            confidenceLevel: 0.95, // 95% confidence
            minimumSampleSize: 100,
            minimumDetectableEffect: 0.05, // 5% minimum detectable effect
            testDuration: 7 * 24 * 60 * 60 * 1000, // 7 days minimum
            powerThreshold: 0.8 // 80% statistical power
        },

        // Z-scores for common confidence levels
        zScores: {
            0.90: 1.645,
            0.95: 1.96,
            0.99: 2.576
        },

        // Calculate sample size required for test
        calculateSampleSize: function(baselineConversion, minimumDetectableEffect, confidenceLevel = 0.95, power = 0.8) {
            const alpha = 1 - confidenceLevel;
            const beta = 1 - power;
            
            const zAlpha = this.getZScore(confidenceLevel);
            const zBeta = this.getZScore(power);
            
            const p1 = baselineConversion;
            const p2 = baselineConversion * (1 + minimumDetectableEffect);
            const pBar = (p1 + p2) / 2;
            
            const numerator = Math.pow(zAlpha * Math.sqrt(2 * pBar * (1 - pBar)) + 
                                      zBeta * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2)), 2);
            const denominator = Math.pow(p2 - p1, 2);
            
            return Math.ceil(numerator / denominator);
        },

        // Calculate statistical significance (two-tailed test)
        calculateSignificance: function(controlData, treatmentData) {
            // Input validation
            if (!this.validateData(controlData) || !this.validateData(treatmentData)) {
                return {
                    error: 'Invalid data provided',
                    isSignificant: false
                };
            }
            
            const n1 = controlData.visitors;
            const c1 = controlData.conversions;
            const n2 = treatmentData.visitors;
            const c2 = treatmentData.conversions;
            
            // Calculate conversion rates
            const p1 = c1 / n1;
            const p2 = c2 / n2;
            
            // Calculate pooled probability
            const pPooled = (c1 + c2) / (n1 + n2);
            
            // Calculate standard error
            const se = Math.sqrt(pPooled * (1 - pPooled) * (1/n1 + 1/n2));
            
            // Calculate z-score
            const z = (p2 - p1) / se;
            
            // Calculate p-value (two-tailed)
            const pValue = 2 * (1 - this.normalCDF(Math.abs(z)));
            
            // Calculate confidence interval
            const ci = this.calculateConfidenceInterval(p1, p2, n1, n2, this.config.confidenceLevel);
            
            // Calculate relative improvement
            const relativeImprovement = ((p2 - p1) / p1) * 100;
            
            // Calculate statistical power
            const power = this.calculatePower(n1, n2, p1, p2, this.config.confidenceLevel);
            
            return {
                control: {
                    visitors: n1,
                    conversions: c1,
                    conversionRate: p1,
                    conversionRatePercent: (p1 * 100).toFixed(2) + '%'
                },
                treatment: {
                    visitors: n2,
                    conversions: c2,
                    conversionRate: p2,
                    conversionRatePercent: (p2 * 100).toFixed(2) + '%'
                },
                statistics: {
                    zScore: z.toFixed(4),
                    pValue: pValue.toFixed(4),
                    isSignificant: pValue < (1 - this.config.confidenceLevel),
                    confidenceLevel: this.config.confidenceLevel,
                    confidenceInterval: {
                        lower: ci.lower.toFixed(4),
                        upper: ci.upper.toFixed(4),
                        lowerPercent: (ci.lower * 100).toFixed(2) + '%',
                        upperPercent: (ci.upper * 100).toFixed(2) + '%'
                    },
                    relativeImprovement: relativeImprovement.toFixed(2) + '%',
                    absoluteImprovement: ((p2 - p1) * 100).toFixed(2) + '%',
                    power: power.toFixed(2)
                },
                recommendations: this.generateRecommendations(n1, n2, pValue, power, relativeImprovement)
            };
        },

        // Calculate Bayesian probability of treatment being better
        calculateBayesianProbability: function(controlData, treatmentData) {
            const alpha1 = controlData.conversions + 1;
            const beta1 = controlData.visitors - controlData.conversions + 1;
            const alpha2 = treatmentData.conversions + 1;
            const beta2 = treatmentData.visitors - treatmentData.conversions + 1;
            
            // Monte Carlo simulation
            const simulations = 100000;
            let treatmentWins = 0;
            
            for (let i = 0; i < simulations; i++) {
                const sample1 = this.sampleBeta(alpha1, beta1);
                const sample2 = this.sampleBeta(alpha2, beta2);
                if (sample2 > sample1) treatmentWins++;
            }
            
            const probability = treatmentWins / simulations;
            
            return {
                probabilityTreatmentBetter: probability,
                probabilityControlBetter: 1 - probability,
                credibleInterval: this.calculateCredibleInterval(alpha2, beta2, 0.95),
                expectedLoss: this.calculateExpectedLoss(controlData, treatmentData)
            };
        },

        // Calculate confidence interval
        calculateConfidenceInterval: function(p1, p2, n1, n2, confidenceLevel) {
            const difference = p2 - p1;
            const se = Math.sqrt((p1 * (1 - p1) / n1) + (p2 * (1 - p2) / n2));
            const z = this.getZScore(confidenceLevel);
            
            return {
                lower: difference - z * se,
                upper: difference + z * se
            };
        },

        // Calculate statistical power
        calculatePower: function(n1, n2, p1, p2, confidenceLevel) {
            const alpha = 1 - confidenceLevel;
            const zAlpha = this.getZScore(confidenceLevel);
            
            const pPooled = (n1 * p1 + n2 * p2) / (n1 + n2);
            const se0 = Math.sqrt(pPooled * (1 - pPooled) * (1/n1 + 1/n2));
            const se1 = Math.sqrt(p1 * (1 - p1) / n1 + p2 * (1 - p2) / n2);
            
            const z = (Math.abs(p2 - p1) - zAlpha * se0) / se1;
            const power = this.normalCDF(z);
            
            return power;
        },

        // Check if test has reached statistical significance
        checkSignificance: function(experimentName, controlVariant, treatmentVariant) {
            // This would typically fetch data from your analytics backend
            // For now, returning mock data structure
            return {
                experimentName: experimentName,
                status: 'running',
                duration: this.getTestDuration(experimentName),
                controlData: {
                    variant: controlVariant,
                    visitors: 0,
                    conversions: 0
                },
                treatmentData: {
                    variant: treatmentVariant,
                    visitors: 0,
                    conversions: 0
                },
                isReady: false,
                message: 'Gathering data...'
            };
        },

        // Sequential testing with early stopping
        sequentialTest: function(controlData, treatmentData, spendingFunction = 'obrien-fleming') {
            const informationFraction = Math.min(
                (controlData.visitors + treatmentData.visitors) / 
                (2 * this.config.minimumSampleSize), 
                1
            );
            
            let boundary;
            switch(spendingFunction) {
                case 'obrien-fleming':
                    boundary = this.obrienFlemingBoundary(informationFraction);
                    break;
                case 'pocock':
                    boundary = this.pocockBoundary(informationFraction);
                    break;
                default:
                    boundary = this.getZScore(this.config.confidenceLevel);
            }
            
            const result = this.calculateSignificance(controlData, treatmentData);
            const z = parseFloat(result.statistics.zScore);
            
            return {
                canStop: Math.abs(z) > boundary,
                boundary: boundary,
                zScore: z,
                informationFraction: informationFraction,
                spendingFunction: spendingFunction
            };
        },

        // O'Brien-Fleming spending function
        obrienFlemingBoundary: function(informationFraction) {
            const z = this.getZScore(this.config.confidenceLevel);
            return z / Math.sqrt(informationFraction);
        },

        // Pocock spending function
        pocockBoundary: function(informationFraction) {
            // Simplified Pocock boundary
            return this.getZScore(this.config.confidenceLevel);
        },

        // Multi-armed bandit optimization (Thompson Sampling)
        thompsonSampling: function(variants) {
            const samples = {};
            let bestVariant = null;
            let bestSample = -1;
            
            Object.keys(variants).forEach(variantName => {
                const variant = variants[variantName];
                const alpha = variant.conversions + 1;
                const beta = variant.visitors - variant.conversions + 1;
                const sample = this.sampleBeta(alpha, beta);
                
                samples[variantName] = sample;
                
                if (sample > bestSample) {
                    bestSample = sample;
                    bestVariant = variantName;
                }
            });
            
            return {
                recommendedVariant: bestVariant,
                samples: samples,
                explorationRate: this.calculateExplorationRate(variants)
            };
        },

        // Calculate exploration rate for multi-armed bandit
        calculateExplorationRate: function(variants) {
            const totalVisitors = Object.values(variants).reduce((sum, v) => sum + v.visitors, 0);
            const numVariants = Object.keys(variants).length;
            
            // Decreasing exploration over time
            const explorationRate = Math.max(0.1, Math.min(1, numVariants / Math.sqrt(totalVisitors)));
            return explorationRate;
        },

        // Sample from Beta distribution
        sampleBeta: function(alpha, beta) {
            // Using Gamma distribution to sample Beta
            const x = this.sampleGamma(alpha);
            const y = this.sampleGamma(beta);
            return x / (x + y);
        },

        // Sample from Gamma distribution (simplified)
        sampleGamma: function(shape) {
            // Marsaglia and Tsang method (simplified)
            let x, v;
            const d = shape - 1/3;
            const c = 1 / Math.sqrt(9 * d);
            
            while (true) {
                do {
                    x = this.randomNormal();
                    v = 1 + c * x;
                } while (v <= 0);
                
                v = v * v * v;
                const u = Math.random();
                
                if (u < 1 - 0.0331 * x * x * x * x) {
                    return d * v;
                }
                
                if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) {
                    return d * v;
                }
            }
        },

        // Generate random normal distribution
        randomNormal: function() {
            // Box-Muller transform
            const u1 = Math.random();
            const u2 = Math.random();
            return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        },

        // Calculate credible interval (Bayesian)
        calculateCredibleInterval: function(alpha, beta, credibility) {
            const lower = this.betaInverse((1 - credibility) / 2, alpha, beta);
            const upper = this.betaInverse((1 + credibility) / 2, alpha, beta);
            
            return {
                lower: lower,
                upper: upper
            };
        },

        // Beta inverse (quantile function) - simplified
        betaInverse: function(p, alpha, beta) {
            // Using approximation for beta inverse
            const mean = alpha / (alpha + beta);
            const variance = (alpha * beta) / ((alpha + beta) * (alpha + beta) * (alpha + beta + 1));
            const skewness = 2 * (beta - alpha) * Math.sqrt(alpha + beta + 1) / 
                            ((alpha + beta + 2) * Math.sqrt(alpha * beta));
            
            // Wilson-Hilferty transformation
            const g = skewness / 6;
            const h = 2 / skewness;
            const w = h * (this.inverseNormalCDF(p) * Math.sqrt(h) + 1) - h;
            
            return mean + Math.sqrt(variance) * w;
        },

        // Calculate expected loss
        calculateExpectedLoss: function(controlData, treatmentData) {
            const p1 = controlData.conversions / controlData.visitors;
            const p2 = treatmentData.conversions / treatmentData.visitors;
            
            const expectedLossControl = Math.max(0, p2 - p1) * 100;
            const expectedLossTreatment = Math.max(0, p1 - p2) * 100;
            
            return {
                control: expectedLossControl.toFixed(2) + '%',
                treatment: expectedLossTreatment.toFixed(2) + '%'
            };
        },

        // Normal CDF
        normalCDF: function(z) {
            const a1 =  0.254829592;
            const a2 = -0.284496736;
            const a3 =  1.421413741;
            const a4 = -1.453152027;
            const a5 =  1.061405429;
            const p  =  0.3275911;
            
            const sign = z < 0 ? -1 : 1;
            z = Math.abs(z) / Math.sqrt(2.0);
            
            const t = 1.0 / (1.0 + p * z);
            const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);
            
            return 0.5 * (1.0 + sign * y);
        },

        // Inverse normal CDF
        inverseNormalCDF: function(p) {
            // Approximation using Acklam's algorithm
            const a = [-3.969683028665376e+01, 2.209460984245205e+02,
                      -2.759285104469687e+02, 1.383577518672690e+02,
                      -3.066479806614716e+01, 2.506628277459239e+00];
            const b = [-5.447609879822406e+01, 1.615858368580409e+02,
                      -1.556989798598866e+02, 6.680131188771972e+01,
                      -1.328068155288572e+01];
            const c = [-7.784894002430293e-03, -3.223964580411365e-01,
                      -2.400758277161838e+00, -2.549732539343734e+00,
                       4.374664141464968e+00,  2.938163982698783e+00];
            const d = [7.784695709041462e-03, 3.224671290700398e-01,
                       2.445134137142996e+00, 3.754408661907416e+00];
            
            const pLow = 0.02425;
            const pHigh = 1 - pLow;
            
            let q, r;
            
            if (p < pLow) {
                q = Math.sqrt(-2 * Math.log(p));
                return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
                       ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
            } else if (p <= pHigh) {
                q = p - 0.5;
                r = q * q;
                return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
                       (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
            } else {
                q = Math.sqrt(-2 * Math.log(1 - p));
                return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
                        ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
            }
        },

        // Get Z-score for confidence level
        getZScore: function(confidenceLevel) {
            return this.zScores[confidenceLevel] || this.inverseNormalCDF((1 + confidenceLevel) / 2);
        },

        // Validate input data
        validateData: function(data) {
            return data && 
                   typeof data.visitors === 'number' && 
                   typeof data.conversions === 'number' &&
                   data.visitors > 0 &&
                   data.conversions >= 0 &&
                   data.conversions <= data.visitors;
        },

        // Generate recommendations based on results
        generateRecommendations: function(n1, n2, pValue, power, improvement) {
            const recommendations = [];
            
            // Sample size check
            if (n1 < this.config.minimumSampleSize || n2 < this.config.minimumSampleSize) {
                recommendations.push({
                    type: 'warning',
                    message: `Sample size too small. Need at least ${this.config.minimumSampleSize} visitors per variant.`
                });
            }
            
            // Statistical significance check
            if (pValue < 0.05) {
                if (improvement > 0) {
                    recommendations.push({
                        type: 'success',
                        message: 'Treatment variant is statistically better. Consider implementing the change.'
                    });
                } else {
                    recommendations.push({
                        type: 'danger',
                        message: 'Control variant is statistically better. Do not implement the change.'
                    });
                }
            } else if (pValue < 0.10) {
                recommendations.push({
                    type: 'info',
                    message: 'Results are marginally significant. Consider running the test longer.'
                });
            } else {
                recommendations.push({
                    type: 'info',
                    message: 'No significant difference detected. May need more data or larger effect.'
                });
            }
            
            // Power check
            if (power < this.config.powerThreshold) {
                recommendations.push({
                    type: 'warning',
                    message: `Statistical power is low (${(power * 100).toFixed(0)}%). Results may be unreliable.`
                });
            }
            
            // Practical significance check
            if (Math.abs(improvement) < 5) {
                recommendations.push({
                    type: 'info',
                    message: 'Effect size is small. Consider if the change is worth implementing.'
                });
            }
            
            return recommendations;
        },

        // Get test duration
        getTestDuration: function(experimentName) {
            // This would typically fetch from your backend
            // For now, returning mock duration
            return 0;
        },

        // Create test report
        createTestReport: function(experimentData) {
            const report = {
                summary: {
                    experimentName: experimentData.name,
                    startDate: experimentData.startDate,
                    endDate: experimentData.endDate || 'Ongoing',
                    duration: this.formatDuration(experimentData.duration),
                    status: experimentData.status
                },
                variants: {},
                winner: null,
                confidence: null
            };
            
            // Process each variant
            Object.keys(experimentData.variants).forEach(variantName => {
                const variant = experimentData.variants[variantName];
                report.variants[variantName] = {
                    visitors: variant.visitors,
                    conversions: variant.conversions,
                    conversionRate: (variant.conversions / variant.visitors * 100).toFixed(2) + '%'
                };
            });
            
            // Determine winner if test is complete
            if (experimentData.status === 'complete') {
                const variants = Object.keys(experimentData.variants);
                if (variants.length === 2) {
                    const result = this.calculateSignificance(
                        experimentData.variants[variants[0]],
                        experimentData.variants[variants[1]]
                    );
                    
                    if (result.statistics.isSignificant) {
                        report.winner = result.statistics.relativeImprovement > 0 ? variants[1] : variants[0];
                        report.confidence = (this.config.confidenceLevel * 100).toFixed(0) + '%';
                    }
                }
            }
            
            return report;
        },

        // Format duration
        formatDuration: function(milliseconds) {
            const days = Math.floor(milliseconds / (24 * 60 * 60 * 1000));
            const hours = Math.floor((milliseconds % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
            
            if (days > 0) {
                return `${days} day${days > 1 ? 's' : ''}, ${hours} hour${hours > 1 ? 's' : ''}`;
            } else {
                return `${hours} hour${hours > 1 ? 's' : ''}`;
            }
        },

        // Public API
        publicAPI: {
            calculate: (controlData, treatmentData) => {
                return ABTestStatistics.calculateSignificance(controlData, treatmentData);
            },
            
            calculateBayesian: (controlData, treatmentData) => {
                return ABTestStatistics.calculateBayesianProbability(controlData, treatmentData);
            },
            
            calculateSampleSize: (baseline, mde, confidence, power) => {
                return ABTestStatistics.calculateSampleSize(baseline, mde, confidence, power);
            },
            
            sequentialTest: (controlData, treatmentData, spendingFunction) => {
                return ABTestStatistics.sequentialTest(controlData, treatmentData, spendingFunction);
            },
            
            thompsonSampling: (variants) => {
                return ABTestStatistics.thompsonSampling(variants);
            },
            
            createReport: (experimentData) => {
                return ABTestStatistics.createTestReport(experimentData);
            },
            
            setConfidenceLevel: (level) => {
                ABTestStatistics.config.confidenceLevel = level;
            },
            
            setMinimumSampleSize: (size) => {
                ABTestStatistics.config.minimumSampleSize = size;
            }
        }
    };

    // Expose public API
    window.ABTestStats = ABTestStatistics.publicAPI;

    // Auto-initialize if in debug mode
    if (window.location.hostname === 'localhost' || window.location.search.includes('debug=true')) {
        console.log('[A/B Test Statistics] Module loaded. Available at window.ABTestStats');
        console.log('Example usage: ABTestStats.calculate({visitors: 1000, conversions: 100}, {visitors: 1000, conversions: 120})');
    }

})(window);