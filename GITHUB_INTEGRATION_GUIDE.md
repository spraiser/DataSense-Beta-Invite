# GitHub Integration Guide - DataSense Beta Invite

## Repository Overview

**GitHub URL**: https://github.com/spraiser/DataSense-Beta-Invite  
**Visibility**: Public  
**Default Branch**: main  
**Local Path**: `/Volumes/4tb/Dev/DataSense-Beta-Invite`

## Initial Setup (Already Completed)

The repository has been initialized and connected to GitHub:

```bash
# Repository initialized with
git init
git remote add origin https://github.com/spraiser/DataSense-Beta-Invite.git
git branch -M main
git push -u origin main
```

## Daily Development Workflow

### 1. Start Your Work Session

```bash
# Navigate to project
cd /Volumes/4tb/Dev/DataSense-Beta-Invite

# Check current status
git status

# Get latest changes from GitHub
git pull origin main

# See recent commit history
git log --oneline -10
```

### 2. Making Changes

```bash
# Work on your files
# Edit variations, update content, fix bugs, etc.

# Check what you've changed
git diff

# See which files were modified
git status
```

### 3. Saving Your Work

```bash
# Stage specific files
git add index.html
git add variations-data.json

# Or stage everything
git add .

# Commit with descriptive message
git commit -m "Update ROI variation with new conversion stats"

# Push to GitHub
git push origin main
```

### 4. Common Commit Messages

Follow this pattern for consistency:

- `Fix: [what was broken]` - Bug fixes
- `Update: [what changed]` - Content updates
- `Add: [what's new]` - New features
- `Remove: [what was deleted]` - Deletions
- `Refactor: [what was reorganized]` - Code improvements

Examples:
```bash
git commit -m "Fix: Variation switcher display issue on mobile"
git commit -m "Update: Trust variation headline for better clarity"
git commit -m "Add: New enterprise-focused variation"
git commit -m "Remove: Unused test files"
git commit -m "Refactor: Content injection for better performance"
```

## Branching Strategy

### For Minor Changes (Direct to Main)

```bash
# Make changes
git add .
git commit -m "Update: Homepage CTA button text"
git push origin main
```

### For Major Features (Feature Branch)

```bash
# Create and switch to new branch
git checkout -b feature/new-variation-name

# Make your changes
# ... edit files ...

# Commit changes
git add .
git commit -m "Add: New variation targeting enterprise users"

# Push feature branch
git push origin feature/new-variation-name

# Create Pull Request on GitHub
# Go to: https://github.com/spraiser/DataSense-Beta-Invite/pulls
# Click "New Pull Request"
# Select your branch and create PR

# After review, merge on GitHub

# Switch back to main and pull changes
git checkout main
git pull origin main
```

## Syncing with Vibe-Kanban

### Workflow Integration

1. **Vibe-Kanban for Task Management**
   - Continue using vibe-kanban for task tracking
   - Update task status as you work
   - Link commits to tasks in commit messages

2. **Git for Version Control**
   ```bash
   # Example: Link commit to vibe-kanban task
   git commit -m "Update: ROI variation copy (vibe-kanban task-id)"
   ```

3. **Keep Both Systems Updated**
   - Mark vibe-kanban task as "in progress" before starting
   - Commit changes to git as you work
   - Mark vibe-kanban task as "complete" when pushed

## Handling Conflicts

### If Pull Fails Due to Conflicts

```bash
# Pull and see conflicts
git pull origin main

# If conflicts exist, you'll see:
# CONFLICT (content): Merge conflict in [filename]

# Open conflicted files and resolve
# Look for <<<<<<< HEAD markers

# After resolving, add and commit
git add .
git commit -m "Resolve: Merge conflicts in variations-data.json"
git push origin main
```

### Safe Conflict Resolution

```bash
# Option 1: Stash your changes first
git stash
git pull origin main
git stash pop
# Resolve any conflicts

# Option 2: Create backup branch
git checkout -b backup-my-changes
git checkout main
git pull origin main
# Manually apply your changes
```

## Backup and Recovery

### Creating Backups

```bash
# Tag important versions
git tag -a v1.0 -m "Initial working variation system"
git push origin v1.0

# Create backup branch
git checkout -b backup-2024-01-15
git push origin backup-2024-01-15
git checkout main
```

### Recovering from Mistakes

```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Revert specific commit
git log --oneline  # Find commit hash
git revert [commit-hash]

# Recover deleted file
git checkout HEAD -- filename.txt

# Reset to GitHub version (CAUTION: loses local changes)
git fetch origin
git reset --hard origin/main
```

## Best Practices

### Do's ✅

1. **Commit Often**
   - Small, focused commits
   - Easier to track changes
   - Simpler to revert if needed

2. **Write Clear Messages**
   - Describe what and why
   - Reference task IDs
   - Keep under 72 characters

3. **Pull Before Push**
   ```bash
   git pull origin main
   git push origin main
   ```

4. **Test Before Committing**
   - Run the site locally
   - Test all variations
   - Check for console errors

### Don'ts ❌

1. **Don't Commit Sensitive Data**
   - No API keys
   - No passwords
   - No personal information

2. **Don't Force Push**
   ```bash
   # NEVER DO THIS on main branch
   git push --force  # ❌
   ```

3. **Don't Commit Large Files**
   - Images should be optimized
   - No videos in repository
   - Use .gitignore for build files

## Monitoring Repository

### View Repository Stats

```bash
# See all branches
git branch -a

# Check remote URL
git remote -v

# View file history
git log --follow filename.txt

# See who changed what
git blame index.html

# Find text in history
git log -S "search term" --source --all
```

### GitHub Web Interface

- **View Code**: https://github.com/spraiser/DataSense-Beta-Invite
- **Issues**: https://github.com/spraiser/DataSense-Beta-Invite/issues
- **Pull Requests**: https://github.com/spraiser/DataSense-Beta-Invite/pulls
- **Actions**: https://github.com/spraiser/DataSense-Beta-Invite/actions
- **Settings**: https://github.com/spraiser/DataSense-Beta-Invite/settings

## Automation Ideas

### Git Aliases for Common Tasks

Add to `~/.gitconfig`:

```bash
[alias]
    # Quick status
    st = status -s
    
    # Pretty log
    lg = log --oneline --graph --decorate
    
    # Quick commit and push
    save = !git add . && git commit -m "Update: Quick save" && git push origin main
    
    # Sync with remote
    sync = !git pull origin main && git push origin main
```

Usage:
```bash
git st          # Short status
git lg          # Pretty log
git save        # Quick save and push
git sync        # Pull and push
```

### Pre-commit Hooks

Create `.git/hooks/pre-commit`:

```bash
#!/bin/bash
# Run tests before commit
npm test

# Check for console.log statements
if grep -r "console.log" --include="*.js" .; then
    echo "Warning: console.log found"
    exit 1
fi
```

## Troubleshooting

### Common Issues

| Problem | Solution |
|---------|----------|
| "Permission denied" | Check GitHub authentication |
| "Repository not found" | Verify remote URL with `git remote -v` |
| "Branch is behind" | Pull before pushing: `git pull origin main` |
| "Merge conflicts" | Manually resolve in files, then commit |
| "Large file error" | Use .gitignore or Git LFS |

### Getting Help

```bash
# Git help
git help [command]
git help commit

# Check configuration
git config --list

# Verify connection to GitHub
ssh -T git@github.com
```

## Next Steps

1. **Set up branch protection** (on GitHub)
   - Require pull request reviews
   - Require status checks
   - Restrict who can push

2. **Add CI/CD** (GitHub Actions)
   - Automated testing
   - Deployment pipelines
   - Code quality checks

3. **Documentation**
   - Keep README.md updated
   - Document new variations
   - Maintain changelog

---

*Integration Guide - Connecting Vibe-Kanban with GitHub*
*Last Updated: August 2025*