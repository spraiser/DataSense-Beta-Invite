# DataSense Variation System - Quick Start Usage Guide

## For Marketing Team

### Viewing Different Variations

1. **Open the Landing Page**
   - Navigate to `index.html` in your browser
   - The variation switcher appears in the top-right corner

2. **Switch Between Variations**
   - Click any button in the variation switcher:
     - **Original** - Standard messaging
     - **Trust** - Focus on simplicity
     - **ROI** - Emphasize returns
     - **Empowerment** - Team enablement
     - **Speed** - Quick implementation
     - **Competition** - Market positioning

3. **What Changes**
   - Hero headlines and subtitles
   - Call-to-action button text
   - Statistics and social proof
   - Exit popup messaging
   - Urgency indicators

### Testing Variations with Focus Groups

1. **Share Specific Variations**
   ```
   index.html?variation=trust     # Trust-focused messaging
   index.html?variation=roi       # ROI-focused messaging
   index.html?variation=speed     # Speed-focused messaging
   ```

2. **Track Performance**
   - Each variation automatically tracks:
     - Page views
     - Button clicks
     - Form submissions
     - Exit intent triggers
   - Data stored in browser for analysis

3. **Collect Feedback**
   - Use the feedback form on each variation
   - Results automatically tagged with variation name
   - Export feedback data from dashboard

## For Content Editors

### Using the Content Editor

1. **Access the Editor**
   ```bash
   # Open in browser
   open content-editor.html
   ```

2. **Edit Variation Content**
   - Select variation from dropdown
   - Modify text in input fields
   - Changes preview in real-time
   - Click "Save" to apply

3. **Content Fields Available**
   - Hero title and highlight
   - Subtitle text
   - Button labels
   - Statistics and labels
   - Badge and urgency text
   - Social proof statements
   - Exit popup content

### Best Practices for Content

1. **Keep Messaging Consistent**
   - Each variation should have a clear theme
   - All elements should support the main message
   - Don't mix messaging styles

2. **A/B Testing Guidelines**
   - Change one major element at a time
   - Test for at least 2 weeks
   - Minimum 100 visitors per variation
   - Document hypothesis before testing

## For Developers

### Local Development Setup

1. **Clone and Navigate**
   ```bash
   cd /Volumes/4tb/Dev/DataSense-Beta-Invite
   ```

2. **Run Local Server** (avoids CORS issues)
   ```bash
   # Python server
   python3 -m http.server 8000
   
   # Or Node.js server
   npx http-server -p 8000
   
   # Visit http://localhost:8000
   ```

3. **Make Changes**
   ```bash
   # Edit variation data
   code variations-data.json
   
   # Update embedded fallback
   code variations-embedded.js
   
   # Test changes
   open http://localhost:8000
   ```

### Git Workflow

1. **Daily Development**
   ```bash
   # Start your day - get latest changes
   git pull origin main
   
   # Make your changes
   # ... edit files ...
   
   # Check what changed
   git status
   
   # Stage and commit
   git add .
   git commit -m "Update trust variation CTA text"
   
   # Push to GitHub
   git push origin main
   ```

2. **Creating New Variations**
   ```bash
   # Create feature branch
   git checkout -b new-variation-enterprise
   
   # Add variation to variations-data.json
   # Update variations-embedded.js
   # Test thoroughly
   
   # Commit and push
   git add .
   git commit -m "Add enterprise-focused variation"
   git push origin new-variation-enterprise
   
   # Create pull request on GitHub
   ```

## Quick Testing Checklist

### Before Deploying Changes

- [ ] Test all 6 variations load correctly
- [ ] Verify variation switcher works
- [ ] Check mobile responsiveness
- [ ] Confirm no console errors
- [ ] Test exit popup on each variation
- [ ] Verify analytics tracking
- [ ] Check session persistence
- [ ] Test in Chrome, Firefox, Safari
- [ ] Validate on mobile devices

### Performance Checks

- [ ] Page loads in < 2 seconds
- [ ] Variation switch is instant
- [ ] No layout shift when switching
- [ ] Images optimized and loading
- [ ] Forms working on all variations

## Common Tasks

### View Current Variation Performance

1. Open browser console (F12)
2. Type: `localStorage.getItem('variation_analytics')`
3. Review interaction counts per variation

### Reset to Default

1. Clear browser storage:
   ```javascript
   sessionStorage.clear();
   localStorage.clear();
   location.reload();
   ```

### Force Specific Variation

1. In browser console:
   ```javascript
   sessionStorage.setItem('selectedVariation', 'roi');
   location.reload();
   ```

### Export Analytics Data

1. In browser console:
   ```javascript
   const data = localStorage.getItem('variation_analytics');
   console.log(JSON.parse(data));
   // Copy output for analysis
   ```

## Troubleshooting Quick Fixes

| Issue | Solution |
|-------|----------|
| Switcher not visible | Clear cache, reload page |
| Variation not loading | Check console for errors |
| Content not updating | Verify data-content-id matches |
| Changes not saving | Check sessionStorage enabled |
| CORS errors | Use local server or embedded data |
| Mobile issues | Test in responsive mode |

## Emergency Rollback

If something breaks:

```bash
# Revert to last working version
cd /Volumes/4tb/Dev/DataSense-Beta-Invite
git log --oneline -5  # Find last good commit
git checkout [commit-hash]  # Temporarily revert
# Test to confirm it works
git checkout main  # Return to main
git revert [bad-commit]  # Create revert commit
git push origin main  # Push the fix
```

## Getting Help

- **Technical Issues**: Check browser console first
- **Content Questions**: Review content-editor.html
- **Git Problems**: `git status` shows current state
- **Testing Help**: Use test-all-variations.js

---

*Quick Start Guide - For immediate use*
*Full documentation available in VARIATION_SYSTEM_DOCUMENTATION.md*