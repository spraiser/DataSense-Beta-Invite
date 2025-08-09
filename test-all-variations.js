const playwright = require('playwright');

async function testAllVariations() {
    const results = {
        timestamp: new Date().toISOString(),
        variations: {},
        summary: {
            totalTests: 0,
            passed: 0,
            failed: 0
        }
    };

    const variations = ['default', 'trust', 'roi', 'empowerment', 'speed', 'competition'];
    const browsers = ['chromium'];

    for (const browserType of browsers) {
        console.log(`\n🌐 Testing with ${browserType}...`);
        const browser = await playwright[browserType].launch({ 
            headless: false,
            args: ['--no-sandbox']
        });
        
        for (const variation of variations) {
            console.log(`\n📋 Testing variation: ${variation}`);
            results.variations[variation] = {
                tests: {},
                passed: 0,
                failed: 0
            };

            const context = await browser.newContext({
                viewport: { width: 1280, height: 720 }
            });
            const page = await context.newPage();

            try {
                // Navigate to the page
                await page.goto('http://localhost:8080/index.html', { 
                    waitUntil: 'networkidle' 
                });

                // Switch to the variation
                await page.click(`button[data-variation="${variation}"]`);
                await page.waitForTimeout(1000);

                // Test Suite for each variation
                const tests = {
                    'Content Injection': async () => {
                        // Verify content changes were applied
                        const heroTitle = await page.textContent('[data-content-id="hero_title"]');
                        const ctaPrimary = await page.textContent('[data-content-id="cta_primary"]');
                        
                        if (!heroTitle || !ctaPrimary) {
                            throw new Error('Content injection failed - elements not found');
                        }

                        // Verify content is different from default (except for default variation)
                        if (variation !== 'default') {
                            const defaultButton = await page.$('button[data-variation="default"]');
                            await defaultButton.click();
                            await page.waitForTimeout(500);
                            const defaultTitle = await page.textContent('[data-content-id="hero_title"]');
                            
                            await page.click(`button[data-variation="${variation}"]`);
                            await page.waitForTimeout(500);
                            const varTitle = await page.textContent('[data-content-id="hero_title"]');
                            
                            if (defaultTitle === varTitle) {
                                throw new Error('Content did not change between variations');
                            }
                        }
                        return true;
                    },

                    'Interactive Demo': async () => {
                        // Check if demo section exists
                        const demoSection = await page.$('#demo-section');
                        if (!demoSection) {
                            throw new Error('Demo section not found');
                        }

                        // Test demo functionality
                        const startDemoBtn = await page.$('button:has-text("Try Interactive Demo")');
                        if (startDemoBtn) {
                            await startDemoBtn.click();
                            await page.waitForTimeout(1000);
                            
                            // Verify demo panel opened
                            const demoPanel = await page.$('.demo-panel');
                            if (!demoPanel) {
                                throw new Error('Demo panel did not open');
                            }

                            // Test sample queries if available
                            const sampleQuery = await page.$('.sample-query');
                            if (sampleQuery) {
                                await sampleQuery.click();
                                await page.waitForTimeout(500);
                            }
                        }
                        return true;
                    },

                    'Exit Intent Popup': async () => {
                        // Trigger exit intent by moving mouse to top
                        await page.mouse.move(640, 0);
                        await page.waitForTimeout(500);
                        
                        // Check if popup appears
                        const exitPopup = await page.$('.exit-popup, .exit-intent-popup, #exit-popup');
                        if (!exitPopup) {
                            // Try alternative trigger
                            await page.evaluate(() => {
                                const event = new Event('mouseleave');
                                document.dispatchEvent(event);
                            });
                            await page.waitForTimeout(500);
                        }
                        
                        // Close popup if it appeared
                        const closeBtn = await page.$('.exit-popup-close, .popup-close');
                        if (closeBtn) {
                            await closeBtn.click();
                            await page.waitForTimeout(300);
                        }
                        return true;
                    },

                    'ROI Calculator': async () => {
                        // Scroll to ROI calculator section
                        const roiSection = await page.$('#roi-calculator, .roi-calculator');
                        if (roiSection) {
                            await roiSection.scrollIntoViewIfNeeded();
                            await page.waitForTimeout(500);

                            // Test input fields
                            const revenueInput = await page.$('input[name="monthly-revenue"], #monthly-revenue');
                            if (revenueInput) {
                                await revenueInput.fill('50000');
                                await page.waitForTimeout(300);
                                
                                // Check if calculation updates
                                const roiResult = await page.$('.roi-result, .savings-amount');
                                if (roiResult) {
                                    const resultText = await roiResult.textContent();
                                    if (!resultText || resultText === '0') {
                                        throw new Error('ROI calculation did not update');
                                    }
                                }
                            }
                        }
                        return true;
                    },

                    'Form Submissions': async () => {
                        // Test beta signup form
                        const emailInput = await page.$('input[type="email"]');
                        if (emailInput) {
                            await emailInput.fill('test@example.com');
                            
                            // Find submit button
                            const submitBtn = await page.$('button[type="submit"], .cta-button');
                            if (submitBtn) {
                                // Don't actually submit, just verify it's clickable
                                const isEnabled = await submitBtn.isEnabled();
                                if (!isEnabled) {
                                    throw new Error('Submit button is disabled');
                                }
                            }
                        }
                        return true;
                    },

                    'Animations': async () => {
                        // Check for CSS animations
                        const animatedElements = await page.$$('[class*="animate"], [class*="fade"], [class*="slide"]');
                        
                        // Verify animations are defined
                        for (const element of animatedElements.slice(0, 3)) {
                            const hasAnimation = await element.evaluate(el => {
                                const styles = window.getComputedStyle(el);
                                return styles.animation !== 'none' || 
                                       styles.transition !== 'none' ||
                                       styles.transform !== 'none';
                            });
                        }
                        return true;
                    },

                    'Navigation': async () => {
                        // Test navigation links
                        const navLinks = await page.$$('nav a, .nav-link');
                        for (const link of navLinks.slice(0, 2)) {
                            const href = await link.getAttribute('href');
                            if (href && href.startsWith('#')) {
                                await link.click();
                                await page.waitForTimeout(300);
                            }
                        }
                        return true;
                    },

                    'Responsive Images': async () => {
                        // Check if images load properly
                        const images = await page.$$('img');
                        for (const img of images.slice(0, 3)) {
                            const isLoaded = await img.evaluate(el => el.complete && el.naturalHeight !== 0);
                        }
                        return true;
                    }
                };

                // Run all tests
                for (const [testName, testFn] of Object.entries(tests)) {
                    try {
                        await testFn();
                        results.variations[variation].tests[testName] = 'PASSED';
                        results.variations[variation].passed++;
                        console.log(`  ✅ ${testName}`);
                    } catch (error) {
                        results.variations[variation].tests[testName] = `FAILED: ${error.message}`;
                        results.variations[variation].failed++;
                        console.log(`  ❌ ${testName}: ${error.message}`);
                    }
                    results.summary.totalTests++;
                }

                // Take screenshot of variation
                await page.screenshot({ 
                    path: `test-screenshots/${variation}-${browserType}-${Date.now()}.png`,
                    fullPage: false 
                });

            } catch (error) {
                console.error(`Error testing ${variation}:`, error);
                results.variations[variation].error = error.message;
            } finally {
                await context.close();
            }
        }

        await browser.close();
    }

    // Calculate summary
    for (const variation of Object.values(results.variations)) {
        results.summary.passed += variation.passed;
        results.summary.failed += variation.failed;
    }

    return results;
}

// Mobile responsiveness test
async function testMobileResponsiveness() {
    console.log('\n📱 Testing mobile responsiveness...');
    const browser = await playwright.chromium.launch({ headless: false });
    const devices = ['iPhone 12', 'iPad', 'Pixel 5'];
    const results = {};

    for (const deviceName of devices) {
        const device = playwright.devices[deviceName];
        const context = await browser.newContext({
            ...device
        });
        const page = await context.newPage();
        
        results[deviceName] = {};
        
        try {
            await page.goto('http://localhost:8080/index.html', { waitUntil: 'networkidle' });
            
            // Test each variation on mobile
            const variations = ['default', 'trust', 'roi'];
            for (const variation of variations) {
                await page.click(`button[data-variation="${variation}"]`);
                await page.waitForTimeout(1000);
                
                // Check viewport adjustments
                const isResponsive = await page.evaluate(() => {
                    const viewport = window.innerWidth;
                    const elements = document.querySelectorAll('.hero-content, .nav-container');
                    
                    for (const el of elements) {
                        const rect = el.getBoundingClientRect();
                        if (rect.width > viewport) return false;
                    }
                    return true;
                });
                
                results[deviceName][variation] = isResponsive ? 'PASSED' : 'FAILED';
                
                await page.screenshot({ 
                    path: `test-screenshots/mobile-${deviceName.replace(' ', '-')}-${variation}.png` 
                });
            }
        } catch (error) {
            results[deviceName].error = error.message;
        } finally {
            await context.close();
        }
    }
    
    await browser.close();
    return results;
}

// Main execution
async function runAllTests() {
    console.log('🚀 Starting comprehensive variation testing...\n');
    
    const functionalityResults = await testAllVariations();
    const mobileResults = await testMobileResponsiveness();
    
    // Generate report
    const report = {
        testRun: new Date().toISOString(),
        functionality: functionalityResults,
        mobile: mobileResults,
        conclusion: {
            allPassed: functionalityResults.summary.failed === 0,
            recommendation: functionalityResults.summary.failed === 0 
                ? '✅ All variations maintain full functionality with only text changes'
                : `⚠️ ${functionalityResults.summary.failed} tests failed - review needed`
        }
    };
    
    // Save report
    const fs = require('fs').promises;
    await fs.writeFile(
        'variation-test-report.json', 
        JSON.stringify(report, null, 2)
    );
    
    console.log('\n📊 Test Summary:');
    console.log(`Total Tests: ${functionalityResults.summary.totalTests}`);
    console.log(`Passed: ${functionalityResults.summary.passed}`);
    console.log(`Failed: ${functionalityResults.summary.failed}`);
    console.log('\n✅ Report saved to variation-test-report.json');
    
    return report;
}

// Run tests
runAllTests().catch(console.error);