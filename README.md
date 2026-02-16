# 🔶 Bitcoin Pulse Bot

Autonomous Bitcoin content generator that posts to X (Twitter) with AI-generated content and Telegram notifications.

## Features

- 🤖 **AI-Powered Content**: Uses Gemini 2.5 Flash for trend research and post creation
- 📊 **Auto-Post**: 25 posts every 5 hours (5 posts/hour)
- 📱 **Telegram Updates**: Real-time notifications for trends, posts, and heartbeats
- 💓 **Heartbeat Monitoring**: 5-minute health checks + hourly Telegram status
- 🔄 **Auto-Restart**: Survives crashes and reboots via launchd
- 🎨 **Image Prompts**: AI-generated prompts for each post
- 😄 **Engaging Content**: Mix of short, long, humorous, and regular posts

## Architecture

```
SCOUT (Gemini) → Researches trends from monitored X accounts
    ↓
ARCHITECT (Gemini) → Creates 25 posts (short, long, humorous, engaging)
    ↓
Image Prompts (Gemini) → Generates unique prompts
    ↓
Queue System → Posts every 12 minutes
    ↓
Telegram → Notifications for everything
```

## Content Sources

### Monitored X Accounts
The bot researches these accounts for trending topics and content ideas:

| Account | Focus Area |
|---------|-------------|
| @CryptoRover | Bitcoin analysis & news |
| @MrCryptoWhale | Whale movements |
| @WatcherGuru | Market trends |
| @whale_guru | Whale activity |
| @whale_insider | Insider signals |
| @trendingbitcoin | Trending topics |

### How Content is Generated
1. **SCOUT** researches what these accounts are posting about today
2. **ARCHITECT** creates ORIGINAL takes inspired by their themes
3. **Posts** reflect your unique perspective (not copies!)
4. **Mix of sources**: 30% India-focused, 70% global crypto topics

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
| Posts per Cycle | **25 posts** |
| Posting Rate | 5 posts/hour (every 12 min) |
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

| Post Type | Length | Hashtags | Count | Description |
|-----------|---------|----------|-------|-------------|
| **Short** | 200-280 chars | ❌ No | 5-6 | Conversational, punchy, direct |
| **Long** | 500-600 chars | ✅ Yes | 5-6 | Detailed analysis, deep dives |
| **Humorous** | 200-400 chars | ✅ Yes | 5-6 | Witty, relatable crypto humor |
| **Regular** | 280-500 chars | ✅ Yes | 8-9 | Balanced, informative |

### Content Mix
- **30%** India-focused posts
- **70%** Global crypto topics (from monitored accounts)
- **Humor**: Crypto jokes, relatable moments, witty observations
- **Engagement**: Questions, conversation starters, community interaction
- **Original content** - never copied from monitored accounts

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
