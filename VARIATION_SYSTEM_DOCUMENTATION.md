# DataSense Beta Invite - Variation System Documentation

## Project Overview

The DataSense Beta Invite landing page features a sophisticated A/B testing variation system that allows for dynamic content switching to test different marketing messages and optimize conversion rates.

### Repository Information
- **Local Path**: `/Volumes/4tb/Dev/DataSense-Beta-Invite`
- **GitHub Repository**: https://github.com/spraiser/DataSense-Beta-Invite
- **Status**: Public repository, fully synchronized

## Technical Implementation

### Core Architecture

The variation system consists of three main components:

1. **variations-embedded.js**: Contains all variation data embedded directly in JavaScript to bypass CORS restrictions when running from `file://` protocol
2. **content-injection.js**: Handles the dynamic content replacement logic
3. **variation-analytics.js**: Tracks user interactions and variation performance

### Key Files

- `index.html` - Main landing page with data-content-id attributes
- `variations-embedded.js` - Embedded variation data (fallback for CORS issues)
- `variations-data.json` - External JSON data source for variations
- `content-injection.js` - Core content injection logic
- `content-editor.html` - Visual editor for modifying variations
- `variation-analytics.js` - Analytics tracking system

## Available Variations

The system includes 6 complete marketing variations:

1. **Original** - Default messaging focusing on AI-driven insights
2. **Trust** - Emphasizes simplicity and ease of use
3. **ROI Focus** - Highlights return on investment and revenue impact
4. **Empowerment** - Focuses on data democratization and team enablement
5. **Speed** - Emphasizes quick implementation and fast results
6. **Competition** - Positions against competitors and market alternatives

## How the System Works

### Content Injection Process

1. **Initialization**: On page load, `content-injection.js` initializes
2. **Data Loading**: System attempts to load `variations-data.json`
3. **Fallback**: If JSON fails (CORS), uses embedded data from `variations-embedded.js`
4. **Content Mapping**: Matches `data-content-id` attributes in HTML with variation content
5. **Dynamic Replacement**: Updates page content based on selected variation
6. **Session Persistence**: Stores selection in sessionStorage

### Content ID Mapping

HTML elements use `data-content-id` attributes to mark replaceable content:

```html
<h1 data-content-id="hero_title">Default Title</h1>
<span data-content-id="hero_highlight">Default Highlight</span>
```

Variation data provides corresponding content:

```javascript
"hero_title": "See what's really driving your business growth",
"hero_highlight": "with AI that speaks your language"
```

## Usage Instructions

### For End Users

1. **Access the Page**: Open `index.html` in any browser
2. **Variation Switcher**: Look for the switcher in the top-right corner
3. **Select Variation**: Click any variation button to switch content
4. **Persistence**: Your selection persists for the session

### For Developers

#### Testing Variations Locally

```bash
# Navigate to project directory
cd /Volumes/4tb/Dev/DataSense-Beta-Invite

# Open in browser (variation switcher will appear)
open index.html

# Or use a local server to avoid CORS issues
python3 -m http.server 8000
# Then visit http://localhost:8000
```

#### Modifying Variations

1. **Using the Content Editor**:
   - Open `content-editor.html`
   - Select variation to edit
   - Modify content fields
   - Changes save to sessionStorage

2. **Direct File Editing**:
   - Edit `variations-data.json` for persistent changes
   - Update `variations-embedded.js` for fallback data
   - Ensure both files stay synchronized

#### Adding New Variations

1. Add variation to `variations-data.json`:
```json
"new_variation": {
  "name": "New Variation Name",
  "content": {
    "hero_title": "New title text",
    "hero_highlight": "New highlight",
    // ... all other content IDs
  }
}
```

2. Update `variations-embedded.js` with same data
3. Test thoroughly across all browsers

## GitHub Integration Workflow

### Initial Setup (Completed)

```bash
# Repository already initialized and connected
git remote -v
# origin: https://github.com/spraiser/DataSense-Beta-Invite.git
```

### Daily Workflow

1. **Make Changes Locally**:
```bash
# Check current status
git status

# Stage changes
git add .

# Commit with descriptive message
git commit -m "Update variation content for ROI focus"

# Push to GitHub
git push origin main
```

2. **Sync Changes from GitHub**:
```bash
# Pull latest changes
git pull origin main
```

3. **View History**:
```bash
# See recent commits
git log --oneline -10
```

## Testing & Quality Assurance

### Automated Tests

- `test-all-variations.js` - Tests all variation switching
- `test-content-injection-automated.js` - Validates content injection
- `mobile-playwright-tests.js` - Mobile responsiveness tests

### Manual Testing Checklist

1. ✅ Variation switcher appears on page load
2. ✅ All 6 variations load correctly
3. ✅ Content updates dynamically without page refresh
4. ✅ Session persistence works
5. ✅ Mobile responsive design maintained
6. ✅ No console errors
7. ✅ Analytics tracking functional

## Troubleshooting

### Common Issues & Solutions

1. **Variation Switcher Not Appearing**
   - Check browser console for errors
   - Ensure `variations-embedded.js` is loaded before `content-injection.js`
   - Clear browser cache

2. **CORS Errors with JSON Files**
   - System automatically falls back to embedded data
   - Use local server for development: `python3 -m http.server`

3. **Content Not Updating**
   - Verify `data-content-id` attributes match variation keys
   - Check console for injection errors
   - Ensure variation data structure is correct

4. **Session Not Persisting**
   - Check if sessionStorage is enabled in browser
   - Verify no script errors preventing storage

## Performance Metrics

### Current Performance
- Page load time: < 2 seconds
- Variation switch time: < 100ms
- No layout shift during content swap
- Mobile performance score: 95+

### Analytics Integration
- Tracks variation views
- Monitors user interactions
- Records conversion events
- Exports data for analysis

## Future Enhancements

### Planned Features
- [ ] Server-side variation selection
- [ ] Advanced analytics dashboard
- [ ] Multivariate testing support
- [ ] Personalization based on user segments
- [ ] Integration with marketing automation tools

### Optimization Opportunities
- Implement lazy loading for variation data
- Add caching strategies for better performance
- Create variation preview mode
- Build variation performance reports

## Support & Maintenance

### Regular Maintenance Tasks

1. **Weekly**:
   - Review variation performance metrics
   - Check for console errors in production
   - Validate all variations still working

2. **Monthly**:
   - Analyze conversion data
   - Update underperforming variations
   - Test on new browser versions

3. **Quarterly**:
   - Full cross-browser testing
   - Performance audit
   - Security review

### Contact & Resources

- **GitHub Issues**: https://github.com/spraiser/DataSense-Beta-Invite/issues
- **Local Development**: `/Volumes/4tb/Dev/DataSense-Beta-Invite`
- **Documentation**: This file and inline code comments

## Version History

- **v1.0** - Initial variation system with 6 variations
- **v1.1** - Fixed CORS issues with embedded data fallback
- **v1.2** - Added content editor interface
- **v1.3** - Integrated GitHub repository
- **Current** - Fully functional with all features operational

---

*Last Updated: August 2025*
*Documentation maintained alongside codebase in vibe-kanban*