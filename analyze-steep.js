const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ 
    ignoreHTTPSErrors: true 
  });
  const page = await context.newPage();
  
  try {
    console.log('Navigating to steep.com...');
    await page.goto('https://steep.app', { waitUntil: 'networkidle' });
    
    // Get page title and meta description
    const title = await page.title();
    const description = await page.$eval('meta[name="description"]', el => el.content).catch(() => 'No description');
    
    console.log('Title:', title);
    console.log('Description:', description);
    
    // Get the main HTML structure
    const bodyHTML = await page.$eval('body', el => el.outerHTML);
    
    // Extract key sections
    const sections = await page.$$eval('section, div[class*="section"], div[class*="hero"], div[class*="landing"]', 
      elements => elements.map(el => ({
        tagName: el.tagName,
        className: el.className,
        id: el.id,
        textContent: el.textContent.substring(0, 200) + '...'
      }))
    );
    
    console.log('\n=== PAGE SECTIONS ===');
    sections.forEach((section, i) => {
      console.log(`${i + 1}. ${section.tagName} - Class: "${section.className}" - ID: "${section.id}"`);
      console.log(`   Content: ${section.textContent.trim()}\n`);
    });
    
    // Get CSS classes used
    const allClasses = await page.$$eval('*[class]', 
      elements => [...new Set(elements.flatMap(el => {
        const className = el.className;
        if (typeof className === 'string') {
          return className.split(' ').filter(c => c);
        }
        return [];
      }))]
    );
    
    console.log('\n=== CSS CLASSES USED ===');
    console.log(allClasses.slice(0, 50).join(', '));
    
    // Get form elements
    const forms = await page.$$eval('form', 
      forms => forms.map(form => ({
        action: form.action,
        method: form.method,
        inputs: [...form.querySelectorAll('input, select, textarea')].map(input => ({
          type: input.type,
          name: input.name,
          placeholder: input.placeholder,
          required: input.required
        }))
      }))
    );
    
    console.log('\n=== FORMS ===');
    console.log(JSON.stringify(forms, null, 2));
    
    // Take a screenshot
    await page.screenshot({ path: 'steep-homepage.png', fullPage: true });
    console.log('\nScreenshot saved as steep-homepage.png');
    
    // Get the full page HTML
    const fullHTML = await page.content();
    require('fs').writeFileSync('steep-full-page.html', fullHTML);
    console.log('Full HTML saved as steep-full-page.html');
    
  } catch (error) {
    console.error('Error analyzing steep.com:', error.message);
  }
  
  await browser.close();
})();