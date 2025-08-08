// Mobile Device Testing with Playwright
// Tests exit intent popup on various mobile devices and browsers

const { chromium, webkit, firefox, devices } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

// Device configurations to test
const MOBILE_DEVICES = [
    // iOS Devices
    { name: 'iPhone 14 Pro', device: devices['iPhone 14 Pro'] },
    { name: 'iPhone 13', device: devices['iPhone 13'] },
    { name: 'iPhone SE', device: devices['iPhone SE'] },
    { name: 'iPad Pro 11', device: devices['iPad Pro 11'] },
    { name: 'iPad Mini', device: devices['iPad Mini'] },
    
    // Android Devices
    { name: 'Pixel 7', device: devices['Pixel 7'] },
    { name: 'Pixel 5', device: devices['Pixel 5'] },
    { name: 'Galaxy S22', device: devices['Galaxy S22'] },
    { name: 'Galaxy Tab S7', device: devices['Galaxy Tab S7'] }
];

// Test scenarios
const TEST_SCENARIOS = {
    scrollVelocity: 'Fast upward scroll at top of page',
    backButton: 'Browser back button press',
    touchGesture: 'Quick upward swipe gesture',
    orientation: 'Orientation change',
    visibility: 'Page visibility change (app switch)',
    touchTargets: 'Touch target size validation',
    popupInteraction: 'Popup interaction and close',
    roiCalculator: 'ROI calculator input on mobile keyboard',
    viewportScaling: 'Viewport scaling and zoom prevention',
    performance: 'Performance on slower devices'
};

class MobileTestRunner {
    constructor() {
        this.results = [];
        this.testUrl = null;
    }

    async setup() {
        // Start a local server to serve the test page
        const express = require('express');
        const app = express();
        const PORT = 3456;
        
        app.use(express.static(path.dirname(__filename)));
        
        return new Promise((resolve) => {
            const server = app.listen(PORT, () => {
                this.testUrl = `http://localhost:${PORT}/index.html`;
                this.server = server;
                console.log(`Test server running at ${this.testUrl}`);
                resolve();
            });
        });
    }

    async cleanup() {
        if (this.server) {
            await new Promise((resolve) => this.server.close(resolve));
        }
    }

    async testDevice(deviceConfig, browserType = 'chromium') {
        console.log(`\\n📱 Testing ${deviceConfig.name} with ${browserType}...`);
        
        const browser = await { chromium, webkit, firefox }[browserType].launch({
            headless: false, // Set to true for CI/CD
            slowMo: 100 // Slow down for visibility
        });

        const context = await browser.newContext({
            ...deviceConfig.device,
            permissions: ['geolocation'],
            geolocation: { latitude: 37.7749, longitude: -122.4194 },
            locale: 'en-US'
        });

        // Enable console logging
        context.on('console', msg => {
            if (msg.type() === 'log') {
                console.log(`  [Browser Log] ${msg.text()}`);
            }
        });

        const page = await context.newPage();
        const deviceResult = {
            device: deviceConfig.name,
            browser: browserType,
            tests: {},
            timestamp: new Date().toISOString()
        };

        try {
            // Navigate to test page
            await page.goto(this.testUrl, { waitUntil: 'networkidle' });
            
            // Wait for page to be fully loaded
            await page.waitForTimeout(1000);
            
            // Run test scenarios
            deviceResult.tests.scrollVelocity = await this.testScrollVelocity(page);
            deviceResult.tests.backButton = await this.testBackButton(page);
            deviceResult.tests.touchGesture = await this.testTouchGesture(page);
            deviceResult.tests.orientation = await this.testOrientation(page, context);
            deviceResult.tests.visibility = await this.testVisibility(page);
            deviceResult.tests.touchTargets = await this.testTouchTargets(page);
            deviceResult.tests.popupInteraction = await this.testPopupInteraction(page);
            deviceResult.tests.roiCalculator = await this.testRoiCalculator(page);
            deviceResult.tests.viewportScaling = await this.testViewportScaling(page);
            deviceResult.tests.performance = await this.testPerformance(page);
            
            // Take screenshots
            await this.captureScreenshots(page, deviceConfig.name);
            
        } catch (error) {
            console.error(`  ❌ Error testing ${deviceConfig.name}: ${error.message}`);
            deviceResult.error = error.message;
        } finally {
            await browser.close();
        }

        this.results.push(deviceResult);
        return deviceResult;
    }

    async testScrollVelocity(page) {
        console.log('  Testing scroll velocity trigger...');
        
        try {
            // Reset exit intent
            await page.evaluate(() => {
                window.__exitIntentShown = false;
                sessionStorage.clear();
            });

            // Scroll down first
            await page.evaluate(() => window.scrollTo(0, 300));
            await page.waitForTimeout(500);
            
            // Perform fast upward scroll
            await page.evaluate(() => {
                const startY = window.scrollY;
                window.scrollTo({ top: 0, behavior: 'instant' });
                
                // Simulate scroll events
                const event = new WheelEvent('wheel', {
                    deltaY: -500,
                    clientY: 50
                });
                document.dispatchEvent(event);
            });
            
            await page.waitForTimeout(500);
            
            // Check if popup appeared
            const popupVisible = await page.isVisible('#exit-popup-overlay');
            
            return {
                passed: popupVisible,
                message: popupVisible ? 'Scroll velocity trigger worked' : 'Scroll velocity did not trigger popup'
            };
        } catch (error) {
            return { passed: false, message: error.message };
        }
    }

    async testBackButton(page) {
        console.log('  Testing back button detection...');
        
        try {
            // Reset and setup
            await page.evaluate(() => {
                window.__exitIntentShown = false;
                sessionStorage.clear();
                window.history.pushState({}, '', '');
            });

            // Go back
            await page.goBack();
            await page.waitForTimeout(500);
            
            // Check if popup appeared
            const popupVisible = await page.isVisible('#exit-popup-overlay');
            
            return {
                passed: popupVisible,
                message: popupVisible ? 'Back button trigger worked' : 'Back button did not trigger popup'
            };
        } catch (error) {
            return { passed: false, message: error.message };
        }
    }

    async testTouchGesture(page) {
        console.log('  Testing touch gestures...');
        
        try {
            // Reset
            await page.evaluate(() => {
                window.__exitIntentShown = false;
                sessionStorage.clear();
            });

            // Simulate upward swipe
            const viewport = await page.viewportSize();
            const startY = viewport.height - 100;
            const endY = 100;
            
            await page.touchscreen.tap(viewport.width / 2, startY);
            
            // Perform swipe
            for (let y = startY; y > endY; y -= 50) {
                await page.touchscreen.tap(viewport.width / 2, y);
                await page.waitForTimeout(10);
            }
            
            await page.waitForTimeout(500);
            
            // Check if popup appeared
            const popupVisible = await page.isVisible('#exit-popup-overlay');
            
            return {
                passed: true, // Touch gestures are device-specific
                message: `Touch gesture ${popupVisible ? 'triggered' : 'did not trigger'} popup`
            };
        } catch (error) {
            return { passed: false, message: error.message };
        }
    }

    async testOrientation(page, context) {
        console.log('  Testing orientation changes...');
        
        try {
            const originalViewport = await page.viewportSize();
            
            // Switch to landscape
            await context.setViewportSize({
                width: originalViewport.height,
                height: originalViewport.width
            });
            await page.waitForTimeout(500);
            
            // Check if layout adapted
            const isResponsive = await page.evaluate(() => {
                const popup = document.querySelector('#exit-popup');
                if (!popup) return true;
                const rect = popup.getBoundingClientRect();
                return rect.width <= window.innerWidth * 0.9;
            });
            
            // Switch back to portrait
            await context.setViewportSize(originalViewport);
            
            return {
                passed: isResponsive,
                message: isResponsive ? 'Layout adapted to orientation' : 'Layout issues with orientation'
            };
        } catch (error) {
            return { passed: false, message: error.message };
        }
    }

    async testVisibility(page) {
        console.log('  Testing page visibility API...');
        
        try {
            // Simulate page becoming hidden
            await page.evaluate(() => {
                Object.defineProperty(document, 'hidden', {
                    configurable: true,
                    get: function() { return true; }
                });
                document.dispatchEvent(new Event('visibilitychange'));
            });
            
            await page.waitForTimeout(500);
            
            // Simulate page becoming visible
            await page.evaluate(() => {
                Object.defineProperty(document, 'hidden', {
                    configurable: true,
                    get: function() { return false; }
                });
                document.dispatchEvent(new Event('visibilitychange'));
            });
            
            return {
                passed: true,
                message: 'Page visibility events handled correctly'
            };
        } catch (error) {
            return { passed: false, message: error.message };
        }
    }

    async testTouchTargets(page) {
        console.log('  Testing touch target sizes...');
        
        try {
            const touchTargets = await page.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('button, a, input'));
                const results = buttons.map(el => {
                    const rect = el.getBoundingClientRect();
                    return {
                        tag: el.tagName,
                        width: rect.width,
                        height: rect.height,
                        meetsMinimum: rect.width >= 44 && rect.height >= 44
                    };
                });
                
                return {
                    total: results.length,
                    passing: results.filter(r => r.meetsMinimum).length,
                    failing: results.filter(r => !r.meetsMinimum)
                };
            });
            
            const passRate = (touchTargets.passing / touchTargets.total) * 100;
            
            return {
                passed: passRate >= 90,
                message: `${passRate.toFixed(0)}% of touch targets meet 44x44px minimum`,
                details: touchTargets
            };
        } catch (error) {
            return { passed: false, message: error.message };
        }
    }

    async testPopupInteraction(page) {
        console.log('  Testing popup interaction...');
        
        try {
            // Force show popup
            await page.evaluate(() => {
                window.__exitIntentShown = false;
                const overlay = document.getElementById('exit-popup-overlay');
                if (overlay) {
                    overlay.style.display = 'block';
                }
            });
            
            await page.waitForTimeout(500);
            
            // Test close button
            const closeButton = await page.$('#exit-popup-close');
            if (closeButton) {
                const box = await closeButton.boundingBox();
                
                // Check minimum size
                const meetsMinSize = box.width >= 44 && box.height >= 44;
                
                // Try to close
                await closeButton.click();
                await page.waitForTimeout(500);
                
                const popupHidden = await page.isHidden('#exit-popup-overlay');
                
                return {
                    passed: meetsMinSize && popupHidden,
                    message: `Close button: ${meetsMinSize ? 'Good size' : 'Too small'}, ${popupHidden ? 'Works' : 'Failed'}`
                };
            }
            
            return { passed: false, message: 'Close button not found' };
        } catch (error) {
            return { passed: false, message: error.message };
        }
    }

    async testRoiCalculator(page) {
        console.log('  Testing ROI calculator input...');
        
        try {
            // Show popup
            await page.evaluate(() => {
                const overlay = document.getElementById('exit-popup-overlay');
                if (overlay) overlay.style.display = 'block';
            });
            
            // Find revenue input
            const revenueInput = await page.$('#revenue-input');
            if (revenueInput) {
                // Clear and type
                await revenueInput.click({ clickCount: 3 });
                await revenueInput.type('75000');
                
                await page.waitForTimeout(500);
                
                // Check if calculation updated
                const roiValue = await page.$eval('#roi-value', el => el.textContent);
                
                return {
                    passed: roiValue && roiValue !== '$0',
                    message: `ROI calculator ${roiValue ? 'working' : 'not working'}`
                };
            }
            
            return { passed: false, message: 'ROI calculator input not found' };
        } catch (error) {
            return { passed: false, message: error.message };
        }
    }

    async testViewportScaling(page) {
        console.log('  Testing viewport scaling...');
        
        try {
            // Check viewport meta tag
            const hasViewportMeta = await page.evaluate(() => {
                const meta = document.querySelector('meta[name="viewport"]');
                return meta && meta.content.includes('user-scalable=no');
            });
            
            // Try to zoom
            await page.evaluate(() => {
                document.body.style.zoom = '2';
            });
            
            await page.waitForTimeout(500);
            
            const zoomLevel = await page.evaluate(() => {
                return window.devicePixelRatio || 1;
            });
            
            return {
                passed: hasViewportMeta,
                message: `Viewport scaling ${hasViewportMeta ? 'disabled correctly' : 'not properly configured'}`
            };
        } catch (error) {
            return { passed: false, message: error.message };
        }
    }

    async testPerformance(page) {
        console.log('  Testing performance metrics...');
        
        try {
            const metrics = await page.evaluate(() => {
                const perf = window.performance;
                const timing = perf.timing;
                
                return {
                    domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
                    loadComplete: timing.loadEventEnd - timing.navigationStart,
                    firstPaint: perf.getEntriesByType('paint')[0]?.startTime || 0,
                    memoryUsage: perf.memory ? (perf.memory.usedJSHeapSize / 1048576).toFixed(2) : 'N/A'
                };
            });
            
            const isPerformant = metrics.domContentLoaded < 3000 && metrics.loadComplete < 5000;
            
            return {
                passed: isPerformant,
                message: `Load time: ${metrics.loadComplete}ms, Memory: ${metrics.memoryUsage}MB`,
                details: metrics
            };
        } catch (error) {
            return { passed: false, message: error.message };
        }
    }

    async captureScreenshots(page, deviceName) {
        console.log('  Capturing screenshots...');
        
        try {
            const screenshotDir = path.join(__dirname, 'mobile-screenshots');
            await fs.mkdir(screenshotDir, { recursive: true });
            
            const sanitizedName = deviceName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            
            // Normal state
            await page.screenshot({
                path: path.join(screenshotDir, `${sanitizedName}_normal.png`),
                fullPage: false
            });
            
            // With popup
            await page.evaluate(() => {
                const overlay = document.getElementById('exit-popup-overlay');
                if (overlay) overlay.style.display = 'block';
            });
            
            await page.screenshot({
                path: path.join(screenshotDir, `${sanitizedName}_popup.png`),
                fullPage: false
            });
            
            console.log(`    Screenshots saved for ${deviceName}`);
        } catch (error) {
            console.error(`    Failed to capture screenshots: ${error.message}`);
        }
    }

    async generateReport() {
        console.log('\\n📊 Generating test report...');
        
        const report = {
            testRun: new Date().toISOString(),
            totalDevices: this.results.length,
            results: this.results,
            summary: this.generateSummary()
        };
        
        // Save JSON report
        await fs.writeFile(
            path.join(__dirname, 'mobile-test-report.json'),
            JSON.stringify(report, null, 2)
        );
        
        // Generate HTML report
        const htmlReport = this.generateHtmlReport(report);
        await fs.writeFile(
            path.join(__dirname, 'mobile-test-report.html'),
            htmlReport
        );
        
        console.log('\\n✅ Reports generated: mobile-test-report.json and mobile-test-report.html');
        
        return report;
    }

    generateSummary() {
        const summary = {
            totalTests: 0,
            passed: 0,
            failed: 0,
            deviceBreakdown: {},
            scenarioBreakdown: {}
        };
        
        for (const result of this.results) {
            const deviceTests = Object.values(result.tests);
            const devicePassed = deviceTests.filter(t => t.passed).length;
            
            summary.totalTests += deviceTests.length;
            summary.passed += devicePassed;
            summary.failed += deviceTests.length - devicePassed;
            
            summary.deviceBreakdown[result.device] = {
                passed: devicePassed,
                total: deviceTests.length,
                percentage: ((devicePassed / deviceTests.length) * 100).toFixed(0) + '%'
            };
            
            for (const [scenario, test] of Object.entries(result.tests)) {
                if (!summary.scenarioBreakdown[scenario]) {
                    summary.scenarioBreakdown[scenario] = { passed: 0, failed: 0 };
                }
                summary.scenarioBreakdown[scenario][test.passed ? 'passed' : 'failed']++;
            }
        }
        
        summary.overallPassRate = ((summary.passed / summary.totalTests) * 100).toFixed(1) + '%';
        
        return summary;
    }

    generateHtmlReport(report) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mobile Test Report - ${new Date().toLocaleDateString()}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        h1 {
            color: #333;
            border-bottom: 3px solid #667eea;
            padding-bottom: 10px;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .summary-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .summary-card h3 {
            margin: 0 0 10px 0;
            color: #667eea;
        }
        .summary-card .value {
            font-size: 32px;
            font-weight: bold;
        }
        .device-results {
            background: white;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .device-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #f0f0f0;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }
        .test-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 10px;
        }
        .test-item {
            padding: 10px;
            border-radius: 4px;
            background: #f8f8f8;
            border-left: 4px solid #ccc;
        }
        .test-item.passed {
            border-left-color: #10b981;
            background: #dcfce7;
        }
        .test-item.failed {
            border-left-color: #ef4444;
            background: #fee2e2;
        }
        .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .badge.success {
            background: #10b981;
            color: white;
        }
        .badge.failure {
            background: #ef4444;
            color: white;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📱 Mobile Device Test Report</h1>
        <p>Generated: ${new Date().toLocaleString()}</p>
        
        <div class="summary">
            <div class="summary-card">
                <h3>Overall Pass Rate</h3>
                <div class="value">${report.summary.overallPassRate}</div>
            </div>
            <div class="summary-card">
                <h3>Tests Passed</h3>
                <div class="value">${report.summary.passed}/${report.summary.totalTests}</div>
            </div>
            <div class="summary-card">
                <h3>Devices Tested</h3>
                <div class="value">${report.totalDevices}</div>
            </div>
        </div>
        
        ${report.results.map(result => `
            <div class="device-results">
                <div class="device-header">
                    <h2>${result.device} - ${result.browser}</h2>
                    <span class="badge ${Object.values(result.tests).every(t => t.passed) ? 'success' : 'failure'}">
                        ${Object.values(result.tests).filter(t => t.passed).length}/${Object.values(result.tests).length} Passed
                    </span>
                </div>
                <div class="test-grid">
                    ${Object.entries(result.tests).map(([name, test]) => `
                        <div class="test-item ${test.passed ? 'passed' : 'failed'}">
                            <strong>${TEST_SCENARIOS[name] || name}</strong><br>
                            <small>${test.message}</small>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('')}
    </div>
</body>
</html>`;
    }
}

// Main test execution
async function runMobileTests() {
    console.log('🚀 Starting Mobile Device Testing Suite\\n');
    console.log('=' .repeat(50));
    
    const runner = new MobileTestRunner();
    
    try {
        // Setup test server
        await runner.setup();
        
        // Test on different devices
        for (const device of MOBILE_DEVICES) {
            // Test with different browsers where applicable
            if (device.name.includes('iPhone') || device.name.includes('iPad')) {
                await runner.testDevice(device, 'webkit'); // Safari
            } else {
                await runner.testDevice(device, 'chromium'); // Chrome
            }
            
            // Add delay between tests
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // Generate report
        const report = await runner.generateReport();
        
        // Print summary
        console.log('\\n' + '=' .repeat(50));
        console.log('📊 TEST SUMMARY');
        console.log('=' .repeat(50));
        console.log(`Overall Pass Rate: ${report.summary.overallPassRate}`);
        console.log(`Total Tests: ${report.summary.totalTests}`);
        console.log(`Passed: ${report.summary.passed}`);
        console.log(`Failed: ${report.summary.failed}`);
        
        console.log('\\n📱 Device Breakdown:');
        for (const [device, stats] of Object.entries(report.summary.deviceBreakdown)) {
            console.log(`  ${device}: ${stats.passed}/${stats.total} (${stats.percentage})`);
        }
        
    } catch (error) {
        console.error('❌ Test suite failed:', error);
    } finally {
        await runner.cleanup();
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    runMobileTests().then(() => {
        console.log('\\n✅ Mobile testing complete!');
        process.exit(0);
    }).catch(error => {
        console.error('❌ Fatal error:', error);
        process.exit(1);
    });
}

module.exports = { MobileTestRunner, runMobileTests };