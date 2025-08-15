# CLAUDE.md - AI Assistant Instructions

## Project Overview
You are working on the DataSense Beta Landing Page project, specifically the visual page builder system that allows real-time editing and reorganization of landing page sections.

## Current Working File
**Primary file**: `wireframe-builder-editable.html`
- This is the latest version with full editing capabilities
- Previous versions (wireframe-mobile-first.html, wireframe-builder.html) are superseded

## Key Project Files
```
/DataSense-Beta-Invite/
├── index.html                         # Original landing page (reference only)
├── wireframe-builder-editable.html    # CURRENT WORKING FILE - Visual page builder
├── WIREFRAME-BUILDER-STATUS.md        # Detailed project status and roadmap
├── variations-embedded.js             # Variation content system
├── content-injection.js               # Dynamic content updates  
├── ab-testing-framework.js            # A/B test tracking
└── styles-professional.css            # Original styles (reference)
```

## Current Capabilities
The visual page builder currently supports:
- Side-by-side layout (320px sidebar, rest for preview)
- Device switching (Mobile 375px, Tablet 768px, Desktop 1200px)
- 14 editable content panels
- Drag & drop reordering
- Show/hide panels
- Real-time content editing with modal editor
- Quick edit fields and HTML code editing
- 6 pre-configured variations
- Auto-save to localStorage

## Commands You Should Know

### Testing & Validation
Always test changes by:
```bash
# Open the builder in browser (Windows WSL)
cmd.exe /c start wireframe-builder-editable.html

# For other systems
open wireframe-builder-editable.html    # macOS
xdg-open wireframe-builder-editable.html # Linux
```

### Key Functions to Maintain
- `renderPreview()` - Updates the preview pane
- `saveConfig()` - Saves to localStorage
- `openEditor(panelId)` - Opens edit modal for a panel
- `panels.getContent()` - Returns HTML for each panel

## Priority Tasks (If Asked to Continue)

1. **Add Undo/Redo System**
   - Track state changes in history array
   - Add keyboard shortcuts (Ctrl+Z, Ctrl+Y)
   - Add UI buttons in preview header

2. **Image Editing**
   - Add image upload to edit modal
   - Support drag & drop images
   - Image URL input field

3. **Panel Templates**
   - Create "Add Panel" button
   - Build template library
   - Allow custom HTML panels

4. **Production Export**
   - Clean HTML generation
   - Inline critical CSS
   - Minification options
   - Download as zip with assets

5. **Mobile Gestures**
   - Touch-friendly drag handles
   - Swipe to reorder
   - Pinch to zoom preview

## Architecture Notes

### Data Structure
```javascript
panels = [
  {
    id: 'hero',
    name: 'Hero Section',
    order: 2,
    visible: true,
    fields: {
      title: "Text content",
      subtitle: "More text"
    },
    getContent: function() { return `<html>`; }
  }
]
```

### Storage
- Config saves to: `datasense-builder-editable-config`
- Includes: device, variation, panel states, custom content

### Variation System
```javascript
variations = {
  default: ['navigation', 'hero', 'urgency', ...],
  trust: ['navigation', 'hero', 'social-proof', ...]
}
```

## Design Principles
1. **Mobile-first**: Everything designed for 375px first
2. **Real-time**: All changes apply immediately
3. **Non-destructive**: Original content preserved, can reset
4. **User-friendly**: No coding required for basic edits
5. **Powerful**: Full HTML access for advanced users

## Common Issues & Solutions

### Issue: Changes not saving
- Check localStorage is not full
- Verify saveConfig() is called after changes
- Check browser console for errors

### Issue: Preview not updating
- Ensure renderPreview() is called
- Check panel.getContent() returns valid HTML
- Verify panel.visible is set correctly

### Issue: Drag & drop not working
- Event listeners might be detached
- Check draggable attribute is set
- Verify event handlers are bound

## Integration Points
The builder must maintain compatibility with:
- Original variation switching system
- A/B testing framework
- Analytics tracking
- Email signup functionality
- Exit intent popups

## Testing Checklist
- [ ] All 14 panels are editable
- [ ] Changes persist on page refresh
- [ ] Device switching updates preview size
- [ ] Drag & drop reorders panels
- [ ] Variations show/hide correct panels
- [ ] Export produces valid HTML
- [ ] Mobile view fits in viewport
- [ ] Edit modal displays properly

## User Feedback Focus Areas
When demonstrating to users, get feedback on:
- Is editing intuitive?
- Are the right fields editable?
- Should we add more device sizes?
- Is the preview accurate?
- What export formats are needed?

## Do NOT Change
- Panel IDs (breaks variation system)
- localStorage key names (loses user data)
- Basic HTML structure (breaks original page features)

## Always Remember
- This is a visual builder for non-technical users
- Must maintain all original page functionality
- Mobile experience is priority
- Changes should be reversible
- Keep original A/B testing intact

## When User Says "Open It"
Use: `cmd.exe /c start wireframe-builder-editable.html`
Do NOT suggest localhost URLs or manual navigation

## Project Goal
Create a Squarespace/Wix-like editor specifically for the DataSense landing page that maintains all sophisticated features while being dead simple for business owners to customize their messaging and layout.