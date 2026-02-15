#!/bin/bash
# Bitcoin Pulse Bot - Auto-restart Setup Script

set -e

BOT_DIR="/Users/bitbybitmoney/.openclaw/workspace/gemini-ai/btc-bot"
PLIST="$BOT_DIR/ai.bitcoinpulse.bot.plist"

echo "🔶 Setting up Bitcoin Pulse Bot auto-restart..."

# Stop existing caffeinate process
echo "Stopping existing processes..."
pkill -f "node.*index.js" 2>/dev/null || true
pkill -f "caffeinate.*node" 2>/dev/null || true

# Wait a moment
sleep 2

# Unload existing plist if it exists
echo "Loading launchd plist..."
launchctl bootout gui/$UID/ai.bitcoinpulse.bot 2>/dev/null || true

# Copy plist to LaunchAgents
mkdir -p ~/Library/LaunchAgents
cp "$PLIST" ~/Library/LaunchAgents/

# Load and start
launchctl bootstrap gui/$UID ~/Library/LaunchAgents/ai.bitcoinpulse.bot.plist

echo "✅ Bot installed with auto-restart!"
echo ""
echo "Commands:"
echo "  Status:   launchctl list | grep bitcoinpulse"
echo "  Stop:     launchctl bootout gui/$UID/ai.bitcoinpulse.bot"
echo "  Start:    launchctl bootstrap gui/$UID ~/Library/LaunchAgents/ai.bitcoinpulse.bot.plist"
echo "  Logs:     tail -f $BOT_DIR/logs/btc-pulse-*.log"
echo ""
echo "Features enabled:"
echo "  💓 Heartbeat every 5 minutes"
echo "  📱 Hourly Telegram health check"
echo "  🔄 Auto-restart on crash"
echo "  ⏰ Auto-start on system boot"
