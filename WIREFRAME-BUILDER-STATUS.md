# DataSense Wireframe Builder - Project Status & Direction

## Current Status (August 2025)

We've successfully created a mobile-first, visual page builder for the DataSense landing page that allows real-time editing and reorganization of content sections.

### What We've Built

#### Three Versions Created:
1. **wireframe-mobile-first.html** - Initial wireframe with gray boxes
2. **wireframe-builder.html** - Side-by-side layout with actual content
3. **wireframe-builder-editable.html** - Full editing capabilities (CURRENT VERSION)

### Current Features ✅

#### Layout & Design
- **Side-by-side layout**: 320px left sidebar for controls, remaining space for preview
- **Device switching**: Mobile (375px), Tablet (768px), Desktop (1200px) views
- **Responsive preview**: Content scales properly for each device size
- **Real content**: Actual landing page content, not just wireframes

#### Panel Management
- **14 content sections**: Navigation, Hero, Urgency Banner, ROI Stats, Social Proof, Problem/Solution, Features, Demo, Comparison, Use Cases, FAQ, Signup, Footer
- **Visibility toggles**: Show/hide any section with checkboxes
- **Drag & drop reordering**: Reorder sections by dragging in sidebar or using up/down arrows
- **Order numbers**: Visual indicators showing current position

#### Content Editing
- **Edit buttons**: Pencil icon in sidebar + hover edit button on preview panels
- **Modal editor** with two tabs:
  - **Quick Edit**: Form fields for all text content (headings, CTAs, stats, etc.)
  - **HTML Code**: Direct HTML editing for advanced customization
- **Real-time updates**: Changes apply instantly to preview
- **Persistent storage**: All edits saved to localStorage

#### Variation System
- **6 pre-configured variations**: Default, Trust, ROI, Empowerment, Speed, Competition
- **Each variation** shows/hides different panels for different messaging focus
- **Maintains compatibility** with original A/B testing system

### File Structure
```
/DataSense-Beta-Invite/
├── index.html                         # Original landing page
├── wireframe-mobile-first.html        # V1: Basic wireframe
├── wireframe-builder.html             # V2: With real content
├── wireframe-builder-editable.html    # V3: Full editing (CURRENT)
├── WIREFRAME-BUILDER-STATUS.md        # This file
└── CLAUDE.md                          # AI instructions
```

## Where We're Heading 🚀

### Immediate Next Steps

1. **Enhanced Edit Capabilities**
   - Rich text editor (bold, italic, links)
   - Color picker for backgrounds/text
   - Image upload/replacement
   - Font size controls

2. **Advanced Panel Features**
   - Duplicate panel functionality
   - Custom panel creation
   - Panel templates library
   - Nested components (e.g., multiple features in feature section)

3. **Mobile-First Improvements**
   - Touch-friendly drag handles
   - Swipe gestures for reordering
   - Mobile preview on actual device frames
   - Responsive breakpoint editor

4. **Export & Integration**
   - Export as production-ready HTML/CSS
   - Generate variation configs for A/B testing
   - CSS extraction and optimization
   - Integration with existing variation system

5. **Collaboration Features**
   - Share preview links
   - Comments on panels
   - Version history
   - Export/import configurations

### Technical Improvements Needed

1. **Code Organization**
   - Separate JS into modules
   - Use a proper state management system
   - Add TypeScript for better maintainability

2. **Performance**
   - Lazy loading for panels
   - Debounce save operations
   - Optimize re-renders

3. **Testing**
   - Unit tests for panel operations
   - E2E tests for editing flows
   - Cross-browser compatibility

### Integration Points

The builder needs to integrate with:
- **variations-embedded.js** - Variation content system
- **content-injection.js** - Dynamic content updates
- **ab-testing-framework.js** - A/B test tracking
- **analytics-tracker.js** - Event tracking

### Key Decisions Made

1. **Mobile-first approach**: All panels designed for mobile, scale up for larger screens
2. **Side-by-side layout**: Controls on left, preview on right (not top/bottom)
3. **Real content**: Using actual landing page content, not Lorem Ipsum
4. **Inline editing**: Edit buttons on panels, not just in sidebar
5. **Persistent state**: Everything saves to localStorage automatically

### Known Issues/Limitations

1. HTML edit mode doesn't parse back to quick edit fields
2. No undo/redo functionality yet
3. Can't create new panels from scratch
4. Image editing not implemented
5. No responsive preview for actual mobile devices

## For the Next AI

### Priority Tasks
1. **Add undo/redo system** - Critical for user confidence
2. **Implement image editing** - Users need to change hero images, logos
3. **Create panel templates** - Let users add pre-built sections
4. **Export production code** - Generate clean, optimized HTML/CSS
5. **Mobile gestures** - Swipe to reorder on touch devices

### Architecture Notes
- All panel data stored in `panels` array with `fields` object
- Each panel has `getContent()` method that returns HTML
- Variations are just arrays of panel IDs to show/hide
- Everything saves to localStorage under `datasense-builder-editable-config`

### Testing Checklist
- [ ] All panels editable
- [ ] Changes persist on refresh
- [ ] Device switching works
- [ ] Drag & drop reordering works
- [ ] Export produces valid HTML
- [ ] Variations switch properly

### User Feedback Needed On
- Is the side-by-side layout optimal?
- Should we add a full-screen preview mode?
- Do we need more granular editing (padding, margins)?
- Should panels be collapsible in sidebar?
- Is the current save system sufficient?

## Contact & Context

This builder is part of the DataSense beta landing page project, designed to allow non-technical users to customize their landing page while maintaining all the sophisticated A/B testing and analytics capabilities of the original implementation.

The goal is to make it as easy as Squarespace/Wix but with the power of custom code and full control over variations for testing.