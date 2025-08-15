#!/bin/bash

# GitHub MCP Setup Script
# This configures the GitHub MCP server for Claude Code

echo "GitHub MCP Setup for Claude Code"
echo "================================"
echo ""
echo "Please paste your GitHub Personal Access Token"
echo "(It should start with 'ghp_')"
echo ""
read -sp "Token: " GITHUB_TOKEN
echo ""

if [[ ! "$GITHUB_TOKEN" =~ ^ghp_ ]]; then
    echo "Error: Token should start with 'ghp_'"
    exit 1
fi

echo "Setting up GitHub MCP server..."

# Add the MCP server with authentication
claude mcp add --scope local \
  -e "GITHUB_PERSONAL_ACCESS_TOKEN=$GITHUB_TOKEN" \
  github npx -- -y @modelcontextprotocol/server-github

echo ""
echo "GitHub MCP server configured!"
echo ""
echo "Testing connection..."

# The MCP server should now be available
claude mcp list | grep github

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ GitHub MCP successfully configured!"
    echo ""
    echo "You can now use GitHub commands in Claude Code:"
    echo "  - List repos"
    echo "  - Create issues"
    echo "  - Manage PRs"
    echo "  - Push commits"
    echo ""
else
    echo "❌ Configuration may have failed. Check the output above."
fi