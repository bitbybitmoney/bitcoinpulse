#!/bin/bash
# Bitcoin Pulse Bot Watchdog
# Checks if bot is running, restarts if dead

BOT_DIR="/Users/bitbybitmoney/.openclaw/workspace/gemini-ai/btc-bot"
BOT_SCRIPT="$BOT_DIR/index.js"
PLIST="$BOT_DIR/ai.bitcoinpulse.bot.plist"
LOG_FILE="$BOT_DIR/logs/watchdog.log"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

# Check if bot process exists
if ! pgrep -f "node.*index.js" > /dev/null 2>&1; then
    log "Bot not running, restarting..."
    
    # Stop any stale caffeinate processes
    pkill -f "caffeinate.*node" 2>/dev/null
    
    # Start bot with caffeinate
    cd "$BOT_DIR"
    caffeinate -s node index.js > /dev/null 2>&1 &
    
    log "Bot restarted successfully"
else
    log "Bot is alive (PID: $(pgrep -f 'node.*index.js'))"
fi
