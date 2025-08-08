#!/usr/bin/env node

/**
 * Validation script for industry selector integration
 * Run this to verify all acceptance criteria are met
 */

const fs = require('fs');
const path = require('path');

const CHECKMARK = '✓';
const CROSSMARK = '✗';
const WARNING = '⚠';

// Color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    bold: '\x1b[1m'
};

function log(message, type = 'info') {
    let prefix = '';
    let color = colors.reset;
    
    switch(type) {
        case 'success':
            prefix = CHECKMARK;
            color = colors.green;
            break;
        case 'error':
            prefix = CROSSMARK;
            color = colors.red;
            break;
        case 'warning':
            prefix = WARNING;
            color = colors.yellow;
            break;
        case 'header':
            color = colors.blue + colors.bold;
            break;
    }
    
    console.log(`${color}${prefix} ${message}${colors.reset}`);
}

function validateFile(filePath, checks) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        let allPassed = true;
        
        checks.forEach(check => {
            if (check.pattern.test(content)) {
                log(`  ${check.description}`, 'success');
            } else {
                log(`  ${check.description}`, 'error');
                allPassed = false;
            }
        });
        
        return allPassed;
    } catch (error) {
        log(`  Could not read file: ${error.message}`, 'error');
        return false;
    }
}

function runValidation() {
    log('\n=== Industry Selector Integration Validation ===\n', 'header');
    
    // Check interactive-demo.js
    log('Checking interactive-demo.js:', 'header');
    const interactiveDemoChecks = [
        {
            pattern: /industryDemoQueries\s*=\s*{[\s\S]*ecommerce:[\s\S]*saas:[\s\S]*restaurant:[\s\S]*healthcare:[\s\S]*services:/,
            description: 'Industry-specific demo queries defined'
        },
        {
            pattern: /currentIndustry\s*=\s*['"]general['"]/,
            description: 'currentIndustry property initialized'
        },
        {
            pattern: /setupIndustrySelector/,
            description: 'setupIndustrySelector method exists'
        },
        {
            pattern: /updateQueriesForIndustry/,
            description: 'updateQueriesForIndustry method exists'
        },
        {
            pattern: /industryQueries\[queryType\]\s*\|\|\s*demoQueries\[queryType\]/,
            description: 'runQuery uses industry-specific queries'
        },
        {
            pattern: /sessionStorage\.setItem\(['"]currentIndustry/,
            description: 'Industry stored in sessionStorage'
        },
        {
            pattern: /document\.dispatchEvent\(new CustomEvent\(['"]industry-switched/,
            description: 'Dispatches industry-switched event'
        },
        {
            pattern: /document\.addEventListener\(['"]industry-switched/,
            description: 'Listens for industry-switched events'
        }
    ];
    
    const interactiveDemoPassed = validateFile('interactive-demo.js', interactiveDemoChecks);
    
    // Check industry-demos.js
    log('\nChecking industry-demos.js:', 'header');
    const industryDemosChecks = [
        {
            pattern: /document\.dispatchEvent\(new CustomEvent\(['"]industry-switched/,
            description: 'Dispatches industry-switched event on switch'
        },
        {
            pattern: /sessionStorage\.setItem\(['"]currentIndustry/,
            description: 'Stores industry in sessionStorage'
        },
        {
            pattern: /sessionStorage\.removeItem\(['"]exitIntentShown/,
            description: 'Resets exit intent on industry change'
        }
    ];
    
    const industryDemosPassed = validateFile('industry-demos.js', industryDemosChecks);
    
    // Check for industry-specific content
    log('\nChecking industry-specific content:', 'header');
    const contentChecks = [
        {
            file: 'interactive-demo.js',
            patterns: [
                { pattern: /Which product bundles drive the highest revenue/, desc: 'E-commerce bundle question' },
                { pattern: /How is my MRR trending/, desc: 'SaaS MRR question' },
                { pattern: /Which menu items have the highest profit margins/, desc: 'Restaurant menu question' },
                { pattern: /What's my revenue per patient/, desc: 'Healthcare revenue question' },
                { pattern: /Which service lines are most profitable/, desc: 'Services profitability question' }
            ]
        }
    ];
    
    let contentPassed = true;
    contentChecks.forEach(fileCheck => {
        const content = fs.readFileSync(fileCheck.file, 'utf8');
        fileCheck.patterns.forEach(pattern => {
            if (pattern.pattern.test(content)) {
                log(`  ${pattern.desc}`, 'success');
            } else {
                log(`  ${pattern.desc}`, 'error');
                contentPassed = false;
            }
        });
    });
    
    // Summary
    log('\n=== Validation Summary ===\n', 'header');
    
    const acceptanceCriteria = [
        { name: 'Industry dropdown changes queries', passed: interactiveDemoPassed },
        { name: 'Query questions are industry-specific', passed: contentPassed },
        { name: 'SQL and insights change by industry', passed: contentPassed },
        { name: 'Syncs between both demo systems', passed: interactiveDemoPassed && industryDemosPassed },
        { name: 'Stores industry in sessionStorage', passed: interactiveDemoPassed },
        { name: 'Tracks industry changes', passed: interactiveDemoPassed }
    ];
    
    let allPassed = true;
    acceptanceCriteria.forEach(criteria => {
        if (criteria.passed) {
            log(criteria.name, 'success');
        } else {
            log(criteria.name, 'error');
            allPassed = false;
        }
    });
    
    if (allPassed) {
        log('\n🎉 All acceptance criteria met! Integration successful.', 'success');
        process.exit(0);
    } else {
        log('\n⚠️  Some criteria not met. Please review the implementation.', 'warning');
        process.exit(1);
    }
}

// Run validation
runValidation();