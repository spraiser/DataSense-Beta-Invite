# Focus Group Feedback Collection System

## Overview
A comprehensive feedback collection system designed for focus groups testing different content variations. The system captures ratings, qualitative feedback, and automatically associates responses with the current variation being viewed.

## Features

### Core Functionality
- **URL Parameter Triggering**: Add `?feedback=true` to any page URL to automatically open the feedback form
- **Floating Feedback Button**: Always-visible feedback button in the bottom-right corner
- **Variation Tracking**: Automatically captures which content variation is being viewed
- **5-Star Rating System**: Visual star rating for overall satisfaction
- **Qualitative Feedback Fields**:
  - Messaging feedback
  - What resonates with the user
  - What doesn't resonate
  - Optional participant name

### Data Management
- **Local Storage**: All feedback stored in browser's localStorage for persistence
- **CSV Export**: Export all collected feedback as CSV for analysis
- **Real-time Dashboard**: View and filter feedback responses
- **Automatic Metadata**: Captures timestamp, user agent, screen resolution, referrer

## Files

### Core Files
- `feedback-system.js` - Main feedback collection system
- `feedback-dashboard.html` - Analytics dashboard for viewing responses
- `test-feedback.html` - Test page for demonstrating the system

### Integration Points
- `index.html` - Main landing page with feedback system integrated
- `content-editor.html` - Content editor with feedback dashboard access
- `content-injection.js` - Variation management system

## Usage

### 1. Basic Setup
Include the feedback system script in any page:
```html
<script src="feedback-system.js"></script>
```

### 2. Triggering Feedback Form

#### Method A: URL Parameter
Add `?feedback=true` to any page URL:
```
http://yoursite.com/page.html?feedback=true
```

#### Method B: JavaScript
```javascript
feedbackSystem.openFeedbackForm();
```

#### Method C: Click Floating Button
Users can click the "💬 Give Feedback" button that appears in the bottom-right corner.

### 3. Viewing Collected Feedback

#### Dashboard
Open `feedback-dashboard.html` to view:
- Total responses and average rating
- Performance breakdown by variation
- Individual feedback responses with full details
- Filter and search capabilities

#### Export Data
Click "Export CSV" button in the dashboard or call:
```javascript
feedbackSystem.exportToCSV();
```

### 4. Data Structure

Each feedback entry contains:
```javascript
{
  id: "timestamp-based-id",
  timestamp: "ISO-8601-date",
  variationId: "variation-identifier",
  variationName: "Human-readable-name",
  rating: 1-5,
  messagingFeedback: "text",
  resonates: "text",
  doesntResonate: "text",
  participantName: "text-or-anonymous",
  userAgent: "browser-info",
  screenResolution: "widthxheight",
  referrer: "source-url-or-direct"
}
```

## Testing

### Test URLs (when running local server on port 8085)
```bash
# Start local server
python3 -m http.server 8085

# Access test pages
http://localhost:8085/test-feedback.html              # Test page
http://localhost:8085/test-feedback.html?feedback=true # Auto-open feedback
http://localhost:8085/feedback-dashboard.html          # Dashboard
http://localhost:8085/index.html?feedback=true         # Main site with feedback
```

### Test Workflow
1. Open test page
2. Select different content variations
3. Submit feedback for each variation
4. View aggregated results in dashboard
5. Export data as CSV for analysis

## API Reference

### FeedbackSystem Class

#### Methods
- `openFeedbackForm()` - Opens the feedback modal
- `closeFeedbackForm()` - Closes the feedback modal
- `submitFeedback()` - Submits current form data
- `exportToCSV()` - Exports all feedback as CSV file
- `getFeedbackSummary()` - Returns statistical summary
- `clearAllFeedback()` - Clears all stored feedback (with confirmation)

#### Properties
- `feedbackData` - Array of all feedback entries
- `currentVariation` - Currently selected variation info
- `isOpen` - Boolean indicating if form is open

## Best Practices

### For Focus Groups
1. **Pre-session Setup**:
   - Clear previous feedback data
   - Verify variation content is loaded
   - Test feedback form submission

2. **During Sessions**:
   - Use unique participant names or IDs
   - Encourage detailed qualitative feedback
   - Test multiple variations per participant

3. **Post-session**:
   - Export data immediately
   - Create backups of localStorage data
   - Clear data before next session

### For Development
1. **Integration**:
   - Ensure content-injection.js loads before feedback-system.js
   - Verify variation tracking is working
   - Test on multiple browsers

2. **Customization**:
   - Modify feedback fields in `openFeedbackForm()` method
   - Adjust CSV export columns in `exportToCSV()` method
   - Customize styling in `addStyles()` method

## Data Privacy
- All data stored locally in browser
- No server-side storage or transmission
- Data persists until manually cleared
- Export function creates local file download

## Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support with responsive design

## Troubleshooting

### Feedback form doesn't open
- Check browser console for errors
- Verify feedback-system.js is loaded
- Ensure no JavaScript errors on page

### Data not persisting
- Check localStorage is enabled
- Verify no browser extensions blocking storage
- Check available storage quota

### CSV export not working
- Ensure browser allows file downloads
- Check for popup blockers
- Verify data exists in localStorage

## Future Enhancements
- Server-side data storage option
- Advanced analytics and visualization
- A/B test statistical significance calculation
- Multi-language support
- Integration with analytics platforms