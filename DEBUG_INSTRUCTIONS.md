# Exit Intent Debug Instructions

## Overview
Debug logs have been added to help diagnose why the exit intent popup is not triggering on file:// protocol.

## Test Steps

1. **Open the page in your browser:**
   ```
   file:///Volumes/4tb/Dev/DataSense-Beta-Invite/index.html
   ```

2. **Open Developer Console:**
   - Press F12 or right-click → Inspect → Console tab
   - Clear the console for a fresh start

3. **Refresh the page (Cmd+R or Ctrl+R)**

4. **Check for these console messages in order:**

### Expected Console Output:
```javascript
// 1. Main initialization
"Main init() function called"
"Current protocol: file:"
"Document readyState: interactive" // or "complete"

// 2. Exit intent initialization
"About to call initExitIntent()"
"SessionStorage access successful" // or warning about sessionStorage
"Exit intent init: {
    overlay: true,
    closeBtn: true,  
    exitIntentShown: null,  // Should be null on first visit
    protocol: "file:",
    url: "file:///...",
    overlayElement: div#exit-popup-overlay,
    closeBtnElement: button#exit-popup-close
}"

// 3. Event listeners registered (when you move mouse out of window)
"Mouse leave detected: {clientY: -1, exitIntentShown: null}"
"Triggering exit popup on mouse leave"
"showExitPopup called"
"Exit popup displayed"
```

## Testing Exit Intent Triggers

### Desktop (Mouse Leave):
1. Move your mouse to the top of the browser window
2. Move it outside the window (above the browser)
3. Check console for "Mouse leave detected" and "Triggering exit popup"

### Mobile Simulation:
1. Open DevTools → Toggle device toolbar (mobile view)
2. Scroll down the page a bit
3. Quickly scroll up (swipe up fast)
4. Check console for "Triggering exit popup on mobile scroll"

## Troubleshooting

### If you see "Exit popup overlay element not found":
- The HTML elements are not loading properly
- Check if index.html has the exit-popup-overlay div

### If you see "Exit intent already shown in this session":
- Clear sessionStorage: In console, run: `sessionStorage.clear()`
- Or open in Incognito/Private window

### If you see "SessionStorage not available":
- This is expected on file:// protocol in some browsers
- The fallback mechanism using window.__exitIntentShown should work

### If no console logs appear at all:
- The script might not be loading
- Check Network tab for script-professional.js loading
- Check for any JavaScript errors in console

## Manual Testing
You can manually trigger the popup from console:
```javascript
// Show the popup directly
document.getElementById('exit-popup-overlay').style.display = 'block';

// Hide the popup
document.getElementById('exit-popup-overlay').style.display = 'none';
```

## Report Findings
Document which console messages you see and any errors that appear. This will help identify where the initialization is failing.