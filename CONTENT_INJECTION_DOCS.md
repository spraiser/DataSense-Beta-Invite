# Dynamic Content Injection System Documentation

## Overview
The Dynamic Content Injection System is a JavaScript module that enables real-time text content replacement based on selected variations while preserving all HTML structure, classes, and styling. Only text nodes are modified, ensuring the integrity of the DOM structure.

## Key Features

### Core Functionality
- **Dynamic Text Replacement**: Swap text content based on variation selection
- **HTML Structure Preservation**: Maintains all HTML elements, attributes, and styling
- **Data Attribute System**: Uses `data-content-id` to mark editable content areas
- **Session Persistence**: Remembers selected variations across page reloads
- **Multiple Replacement Strategies**: Different modes for handling complex HTML structures

### Advanced Features
- **Visual Highlighting**: Mark editable areas with visual indicators
- **Animation Support**: Smooth content transitions with configurable timing
- **Batch Operations**: Apply multiple content changes efficiently
- **Content Extraction**: Extract current page content for new variations
- **Import/Export**: Transfer variations between environments

## Usage

### Basic Setup

```html
<!-- Include the module -->
<script src="content-injection.js"></script>

<!-- Mark content areas with data attributes -->
<h1 data-content-id="hero_title">Default Title</h1>
<p data-content-id="hero_subtitle">Default Subtitle</p>
<button data-content-id="cta_primary">Default CTA</button>
```

### JavaScript API

```javascript
// Load variations from JSON files
await contentInjection.loadVariations();

// Apply a specific variation
contentInjection.applyVariation('roi');

// Get current variation
const current = contentInjection.getCurrentVariation();

// Save custom variation
await contentInjection.saveVariation('custom', {
    hero_title: "Custom Title",
    hero_subtitle: "Custom Subtitle"
});
```

## Data Attributes

### Required Attributes
- `data-content-id`: Unique identifier for content area

### Optional Attributes
- `data-replace-mode`: Control replacement behavior
  - `text` (default): Replace text content only
  - `text-only`: Force simple text replacement
  - `html`: Replace innerHTML (use with caution)

- `data-multi-text-strategy`: Handle elements with multiple text nodes
  - `first` (default): Replace first text node only
  - `join`: Concatenate all text into first node
  - `all`: Distribute new text across all nodes

- `data-preserve-attributes`: Set to `true` to preserve special handling

## Methods

### Core Methods

#### `loadVariations()`
Loads variation data from JSON files.
```javascript
const variations = await contentInjection.loadVariations();
```

#### `applyVariation(variationId)`
Applies a specific variation to the page.
```javascript
contentInjection.applyVariation('trust');
```

#### `replaceTextContent(element, newContent)`
Advanced method for replacing text in complex HTML structures.
```javascript
const element = document.querySelector('[data-content-id="hero_title"]');
contentInjection.replaceTextContent(element, "New Title");
```

### Utility Methods

#### `markEditableContent(selector, options)`
Visually highlights editable content areas.
```javascript
contentInjection.markEditableContent('[data-content-id]', {
    highlightColor: 'rgba(102, 126, 234, 0.1)',
    borderColor: 'rgba(102, 126, 234, 0.3)',
    showLabels: true,
    interactive: true
});
```

#### `batchApplyContent(contentMap, options)`
Apply multiple content changes with optional animation.
```javascript
contentInjection.batchApplyContent({
    hero_title: "New Title",
    hero_subtitle: "New Subtitle"
}, {
    animate: true,
    stagger: 50
});
```

#### `extractCurrentContent()`
Extract all current content from marked areas.
```javascript
const content = contentInjection.extractCurrentContent();
// Returns: { hero_title: "Current Title", ... }
```

#### `getAllContentIds()`
Get all content IDs found on the page.
```javascript
const ids = contentInjection.getAllContentIds();
// Returns: ['hero_title', 'hero_subtitle', ...]
```

### Storage Methods

#### `getCurrentVariation()`
Get the currently applied variation.
```javascript
const current = contentInjection.getCurrentVariation();
```

#### `clearCurrentVariation()`
Clear the current variation and session storage.
```javascript
contentInjection.clearCurrentVariation();
```

### Import/Export Methods

#### `exportVariations()`
Export all variations as JSON string.
```javascript
const json = contentInjection.exportVariations();
```

#### `importVariations(jsonData)`
Import variations from JSON.
```javascript
contentInjection.importVariations(jsonData);
```

## JSON Data Structure

### variations-data.json
```json
{
  "variations": {
    "default": {
      "name": "Original",
      "content": {
        "hero_title": "Default Title",
        "hero_subtitle": "Default Subtitle",
        "cta_primary": "Get Started"
      }
    },
    "trust": {
      "name": "Trust & Simplicity",
      "content": {
        "hero_title": "Simple insights anyone can understand",
        "hero_subtitle": "No complicated dashboards",
        "cta_primary": "Try It Free"
      }
    }
  }
}
```

### content-blocks.json
```json
{
  "blocks": {
    "hero_title": {
      "id": "hero_title",
      "label": "Hero Title",
      "default": "Default Hero Title",
      "selector": ".hero-title",
      "type": "text"
    }
  }
}
```

## Complex HTML Handling

The system intelligently handles various HTML structures:

### Simple Text Element
```html
<p data-content-id="simple">Original text</p>
<!-- Becomes: <p data-content-id="simple">New text</p> -->
```

### Element with Nested HTML
```html
<p data-content-id="complex">
    Original <strong>bold</strong> text
</p>
<!-- Becomes: <p data-content-id="complex">
    New text <strong>bold</strong> text
</p> -->
```

### Multiple Text Nodes
```html
<div data-content-id="multi" data-multi-text-strategy="first">
    Text 1 <span>span content</span> Text 2
</div>
<!-- Only "Text 1" is replaced -->
```

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11+ with polyfills for async/await
- Mobile browsers supported

## Performance Considerations
- Efficient DOM traversal using TreeWalker API
- Batch operations to minimize reflows
- Session storage for instant variation switching
- Lazy loading of variation data

## Error Handling
- Graceful fallback to localStorage if server save fails
- Console warnings for missing variations
- Validation of content format before applying
- Safe handling of complex HTML structures

## Testing
Use the provided test files:
- `test-dynamic-content.html` - Interactive visual testing
- `test-content-injection-automated.js` - Automated unit tests

## Best Practices
1. Always use unique `data-content-id` values
2. Test variations thoroughly with complex HTML
3. Use appropriate replacement strategies for your content
4. Consider animation for better UX
5. Export variations regularly for backup
6. Use semantic HTML for better structure preservation