const ContentInjection = require('./content-injection.js');

console.log('Starting automated tests for Content Injection System...\n');

function runTests() {
    const ci = new ContentInjection();
    let passedTests = 0;
    let totalTests = 0;
    
    function test(name, fn) {
        totalTests++;
        try {
            const result = fn();
            if (result) {
                console.log(`✅ ${name}`);
                passedTests++;
            } else {
                console.log(`❌ ${name}`);
            }
        } catch (error) {
            console.log(`❌ ${name} - Error: ${error.message}`);
        }
    }
    
    test('ContentInjection class exists', () => {
        return typeof ContentInjection === 'function';
    });
    
    test('Instance has required methods', () => {
        return typeof ci.loadVariations === 'function' &&
               typeof ci.applyVariation === 'function' &&
               typeof ci.replaceTextContent === 'function' &&
               typeof ci.getAllTextNodes === 'function' &&
               typeof ci.markEditableContent === 'function' &&
               typeof ci.batchApplyContent === 'function' &&
               typeof ci.extractCurrentContent === 'function';
    });
    
    test('Can handle null variations gracefully', () => {
        const result = ci.applyVariation('nonexistent');
        return result === false;
    });
    
    test('Session storage methods exist', () => {
        return typeof ci.getCurrentVariation === 'function' &&
               typeof ci.clearCurrentVariation === 'function';
    });
    
    test('Export/Import methods exist', () => {
        return typeof ci.exportVariations === 'function' &&
               typeof ci.importVariations === 'function';
    });
    
    test('Can import variation data', () => {
        const testData = {
            variations: {
                test: {
                    name: "Test Variation",
                    content: {
                        test_content: "Test Value"
                    }
                }
            }
        };
        return ci.importVariations(testData) === true;
    });
    
    test('Can retrieve imported variations', () => {
        const variations = ci.getAllVariations();
        return variations && variations.test && variations.test.name === "Test Variation";
    });
    
    test('Can get variation content', () => {
        const content = ci.getVariationContent('test');
        return content && content.test_content === "Test Value";
    });
    
    test('Can export variations as JSON', () => {
        const exported = ci.exportVariations();
        const parsed = JSON.parse(exported);
        return parsed.variations && parsed.exportDate && parsed.version === '1.0';
    });
    
    test('Helper methods return expected types', () => {
        global.document = {
            querySelectorAll: () => [],
            createTreeWalker: () => ({ nextNode: () => null }),
            createTextNode: () => ({})
        };
        
        const contentIds = ci.getAllContentIds();
        const extracted = ci.extractCurrentContent();
        
        return Array.isArray(contentIds) && typeof extracted === 'object';
    });
    
    console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed`);
    console.log(passedTests === totalTests ? '✅ All tests passed!' : '⚠️ Some tests failed');
    
    return passedTests === totalTests;
}

const success = runTests();
process.exit(success ? 0 : 1);