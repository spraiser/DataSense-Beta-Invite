# Manual Cross-Browser Testing Checklist

## Quick Test Guide for Exit Intent Popup

### Setup
1. Open `test-exit-intent.html` in each browser
2. Open browser console (F12 or right-click → Inspect → Console)
3. Keep this checklist handy for reference

---

## Chrome Testing

### file:// Protocol
- [ ] Page loads without errors
- [ ] Debug console shows initialization logs
- [ ] Red "Test Exit Popup" button is visible (top-right)
- [ ] Clicking test button shows popup
- [ ] Popup has smooth fade-in animation
- [ ] Close button (×) works
- [ ] Pressing Escape key triggers popup
- [ ] Console shows appropriate debug messages

### https:// Protocol (if deployed)
- [ ] Mouse leave at top edge triggers popup
- [ ] Session storage prevents duplicate popups
- [ ] All fallback triggers work
- [ ] No console errors

**Chrome Result:** ⬜ PASS / ⬜ FAIL

---

## Firefox Testing

### file:// Protocol
- [ ] Page loads without errors
- [ ] Debug console shows initialization logs
- [ ] Red "Test Exit Popup" button is visible
- [ ] Escape key triggers popup
- [ ] Test button triggers popup
- [ ] Popup animations are smooth
- [ ] Close button works properly
- [ ] Console shows debug output

### https:// Protocol (if deployed)
- [ ] Mouse leave detection works
- [ ] Session storage functions correctly
- [ ] All triggers operational
- [ ] Clean console output

**Firefox Result:** ⬜ PASS / ⬜ FAIL

---

## Safari Testing

### file:// Protocol
- [ ] Page loads successfully
- [ ] May prompt for storage permissions
- [ ] Test button visible and functional
- [ ] Escape key trigger works
- [ ] Popup displays correctly
- [ ] WebKit animations smooth
- [ ] Close functionality works
- [ ] Developer console shows logs

### https:// Protocol (if deployed)
- [ ] Mouse leave works (may have slight delay)
- [ ] Storage permissions handled
- [ ] All fallback triggers functional
- [ ] No critical errors

**Safari Result:** ⬜ PASS / ⬜ FAIL

---

## Edge Testing

### file:// Protocol
- [ ] Behaves identically to Chrome
- [ ] Test button functional
- [ ] Escape key works
- [ ] Popup displays properly
- [ ] Animations smooth
- [ ] Console logging works

### https:// Protocol (if deployed)
- [ ] Full mouse leave detection
- [ ] Session storage works
- [ ] All features functional
- [ ] Performance comparable to Chrome

**Edge Result:** ⬜ PASS / ⬜ FAIL

---

## Mobile Browser Testing

### iOS Safari
- [ ] Page loads on mobile
- [ ] Touch swipe down from top triggers popup
- [ ] Popup is mobile-responsive
- [ ] Close button is easily tappable
- [ ] No viewport issues

### Chrome Android
- [ ] Page loads correctly
- [ ] Back button/gesture triggers popup
- [ ] Touch interactions work
- [ ] Popup scales properly
- [ ] Smooth animations

### Firefox Mobile
- [ ] Similar to Chrome Android
- [ ] All touch triggers work
- [ ] Responsive design intact

**Mobile Result:** ⬜ PASS / ⬜ FAIL

---

## Fallback Triggers Checklist

Test these on file:// protocol where mouse leave may not work:

### All Browsers Should Support:
- [ ] **Escape Key** - Press Escape to trigger popup
- [ ] **Test Button** - Red button in top-right corner
- [ ] **Tab Switch** - Switch to another tab and return
- [ ] **Inactivity** - Wait 30 seconds without interaction
- [ ] **Scroll Depth** - Scroll to 70% of page
- [ ] **Form Abandonment** - Click email field, then click away without typing

---

## Console Output Verification

### Expected Messages:
```
✅ "Exit intent init: {overlay: true, closeBtn: true, ...}"
✅ "Browser detected: [Browser], Protocol: file://"
✅ "Test button added to page" (file:// only)
✅ "Triggering exit popup" (when triggered)
✅ "Exit popup displayed - trigger: [type]"
```

### Acceptable Warnings (file:// protocol):
```
⚠️ "SessionStorage not available: SecurityError"
⚠️ "Could not save to sessionStorage"
```

### Critical Errors (should not appear):
```
❌ "Exit popup overlay element not found"
❌ "Failed to initialize exit intent"
```

---

## Performance Checklist

- [ ] Popup appears within 500ms of trigger
- [ ] Animations run at 60 FPS
- [ ] No janky scrolling or lag
- [ ] Page remains responsive
- [ ] Memory usage stable (no leaks)

---

## Final Verification

### Success Criteria:
- ✅ Works on 95%+ of tested browsers
- ✅ At least one trigger method works per browser
- ✅ No critical errors in console
- ✅ Popup displays and closes properly
- ✅ User experience is smooth

### Overall Test Result:
- ⬜ **PASS** - All criteria met
- ⬜ **PARTIAL** - Some issues but functional
- ⬜ **FAIL** - Critical issues found

---

## Notes Section

Use this space to document any browser-specific issues or observations:

```
Browser: ________________
Issue: __________________
________________________
________________________

Workaround: _____________
________________________
________________________
```

---

## Sign-off

**Tester Name:** _______________________
**Date:** _____________________________
**Test Environment:** __________________
**Overall Status:** ⬜ APPROVED / ⬜ NEEDS FIX

---

## Quick Reference Commands

### Open Console:
- **Windows/Linux:** `Ctrl + Shift + I` or `F12`
- **Mac:** `Cmd + Option + I`

### Clear Session Storage:
```javascript
sessionStorage.clear();
location.reload();
```

### Force Trigger Popup:
```javascript
document.getElementById('test-exit-popup-btn').click();
```

### Check Popup State:
```javascript
document.getElementById('exit-popup-overlay').style.display;
```