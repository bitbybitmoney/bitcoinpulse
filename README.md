# 🔶 Bitcoin Pulse Bot

Autonomous Bitcoin content generator that posts to X (Twitter) with AI-generated content and Telegram notifications.

## Features

- 🤖 **AI-Powered Content**: Uses Gemini 2.5 Flash for trend research and post creation
- 📊 **Auto-Post**: 15 posts every 5 hours (3 posts/hour)
- 📱 **Telegram Updates**: Real-time notifications for trends, posts, and heartbeats
- 💓 **Heartbeat Monitoring**: 5-minute health checks + hourly Telegram status
- 🔄 **Auto-Restart**: Survives crashes and reboots via launchd
- 🎨 **Image Prompts**: AI-generated prompts for each post

## Architecture

```
SCOUT (Gemini) → Researches 10 Bitcoin trends
    ↓
ARCHITECT (Gemini) → Creates 15 posts (200-600 chars, varied)
    ↓
Image Prompts (Gemini) → Generates unique prompts
    ↓
Queue System → Posts every 20 minutes
    ↓
Telegram → Notifications for everything
```

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your API keys
```

### 3. Get API Keys

**Twitter/X API:**
- Create app at https://developer.twitter.com
- Get API Key, API Secret, Access Token, Access Token Secret

**Telegram Bot:**
- Message @BotFather on Telegram
- Create new bot, get bot token
- Get your Chat ID from @userinfobot

**Google Gemini API:**
- Get key at https://aistudio.google.com

### 4. Start Bot
```bash
# Manual (with sleep prevention)
caffeinate -s node index.js &

# Or use auto-restart (recommended)
./setup-auto-restart.sh
```

## Auto-Restart Setup

The bot is configured to run via macOS launchd for resilience:

```bash
# Check status
launchctl list | grep bitcoinpulse

# Stop
launchctl bootout gui/$UID/ai.bitcoinpulse.bot

# Start
launchctl bootstrap gui/$UID ~/Library/LaunchAgents/ai.bitcoinpulse.bot.plist

# View logs
tail -f logs/btc-pulse-*.log
```

## Commands

| Command | Description |
|---------|-------------|
| `tail -f logs/btc-pulse-*.log` | Watch live logs |
| `launchctl list \| grep bitcoinpulse` | Check bot status |
| `cat logs/queue.json` | View pending posts |

## Schedule

| Event | Frequency |
|-------|-----------|
| Content Generation | Every 5 hours |
| Posts per Cycle | 15 posts |
| Posting Rate | 3 posts/hour (every 20 min) |
| Heartbeat | Every 5 minutes |
| Telegram Status | Hourly |

## Files

| File | Purpose |
|------|---------|
| `index.js` | Main bot logic |
| `queue.json` | Pending posts queue |
| `logs/btc-pulse-*.log` | Activity logs |
| `ai.bitcoinpulse.bot.plist` | launchd config |
| `setup-auto-restart.sh` | Auto-restart setup script |

## Post Style

- **Length**: 200-600 characters (randomized)
- **Tone**: Conversational, human-like
- **Content**: Mix of influential quotes + fresh trends
- **Hashtags**: 3-5 per post
- **Emojis**: Used naturally

## Troubleshooting

**Bot not posting:**
- Check logs: `tail -f logs/btc-pulse-*.log`
- Verify API keys in `.env`
- Check queue: `cat queue.json`

**Telegram not receiving:**
- Verify bot token and chat ID
- Check internet connection
- Review launchd errors: `cat logs/launchd.err.log`

**Auto-restart not working:**
```bash
launchctl list | grep bitcoinpulse
# If not running, try:
launchctl bootstrap gui/$UID ~/Library/LaunchAgents/ai.bitcoinpulse.bot.plist
```

## License

MIT
