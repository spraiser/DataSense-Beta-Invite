# 🚨 CRITICAL FIX: ROI Banner Text Visibility Issue

## PROBLEM
The ROI banner stats text is **INVISIBLE** on the blue background. Users cannot see the important metrics:
- "Average ROI in 90 days"
- "Revenue increase for beta users" 
- "Avg. annual savings from insights"

## ROOT CAUSE
There are **TWO** `.roi-label` CSS rules in `styles-professional.css` that conflict with each other:

1. **Line ~1060**: `.roi-label { color: white; }` ✅ CORRECT
2. **Line ~1732**: `.roi-label { color: var(--secondary-text); }` ❌ WRONG - This overrides the first rule

The second rule makes the text gray (`var(--secondary-text)`) which is invisible on the blue gradient background.

## EXACT FIX REQUIRED

### Step 1: Open `styles-professional.css`

### Step 2: Find the SECOND `.roi-label` rule (around line 1732)
```css
.roi-label {
  font-size: 14px;
  color: var(--secondary-text);  ← THIS IS THE PROBLEM
}
```

### Step 3: Change ONLY the color property to white:
```css
.roi-label {
  font-size: 14px;
  color: white;  ← CHANGE THIS LINE ONLY
}
```

## CRITICAL INSTRUCTIONS

### ⚠️ DO NOT:
- Delete either `.roi-label` rule
- Change any other properties
- Modify the first `.roi-label` rule (around line 1060)
- Touch any other CSS

### ✅ DO:
- **ONLY** change `color: var(--secondary-text);` to `color: white;` in the SECOND rule
- Leave everything else exactly as is
- Test that the text is now visible on the blue background

## WHY THIS KEEPS HAPPENING
The duplicate `.roi-label` rules exist because:
1. One is for the ROI banner section (should be white)
2. One is for a different ROI calculator section (was using gray)

**Solution**: Both should be white for proper visibility.

## VERIFICATION
After the fix, the ROI banner should show:
- **3.2x** (white number)
- **Average ROI in 90 days** (white text) ← This should now be visible
- **47%** (white number)  
- **Revenue increase for beta users** (white text) ← This should now be visible
- **$52k** (white number)
- **Avg. annual savings from insights** (white text) ← This should now be visible

## FINAL CHECK
Search the CSS file for ALL instances of `.roi-label` and ensure BOTH have `color: white;`

**This is a simple one-line fix. Do not overcomplicate it.**