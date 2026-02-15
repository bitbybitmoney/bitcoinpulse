# Bitcoin Pulse 🤖

> Autonomous 24/7 Bitcoin content generator and poster

## Overview

The Bitcoin Pulse Bot monitors Bitcoin trends, generates viral content using Gemini AI, and posts to X at optimized intervals.

## Features

- 🤖 **Autonomous Operation** - Runs 24/7 with no manual intervention
- 🧠 **Multi-Agent System**
  - **Scout**: Fetches trending Bitcoin topics
  - **Architect**: Creates posts + generates images
  - **Scheduler**: Posts at random intervals
- 🎨 **Gemini Image Gen** - Creates custom visuals per post
- 📊 **Real-Time Prices** - Coinbase API integration
- 📝 **Smart Content** - No theme repetition, price verification

## Quick Start

```bash
# Clone/setup
cd ~/.openclaw/workspace/gemini-ai/btc-bot

# Install dependencies
npm install

# Configure API keys
cp .env.example .env
# Edit .env with your keys

# Start the bot
npm start
```

## Configuration

Edit `config/config.json`:

```json
{
  "api_keys": {
    "gemini": {
      "model_text": "gemini-3-flash",
      "model_image": "gemini-2.5-flash-image"
    }
  },
  "settings": {
    "trends_per_hour": 10,
    "posts_per_cycle": 4,
    "post_interval_min": 2,
    "post_interval_max": 5,
    "heartbeat_minutes": 60
  }
}
```

## File Structure

```
btc-bot/
├── index.js          # Main bot
├── config/
│   └── config.json  # API keys & settings
├── media/            # Generated images
├── logs/            # Post history
├── scripts/         # Utility scripts
├── SKILLS.md        # OpenClaw prompts
├── package.json
└── .env.example
```

## OpenClaw Integration

Use the prompts in `SKILLS.md` to configure OpenClaw:

```markdown
=== Prompt A: Setup ===
"OpenClaw, set up Bitcoin Pulse bot..."

=== Prompt B: Master Loop ===
"OpenClaw, run the Bitcoin Pulse loop..."

=== Prompt C: Quality ===
"When generating posts, follow these guidelines..."
```

## Output

Posts appear on: **@Bitbybitmoney**

Sample output:
```
🚀 BTC breaking through $70K!
📊 Current: $69,546 (+4.2%)
💎 Diamond hands winning today
#Bitcoin #BTC #Crypto
```

## Logs

Check `logs/btc-pulse-YYYY-MM-DD.log` for:
- Trending topics found
- Posts generated
- Images created
- Tweet IDs
- Errors

## Requirements

- Node.js 22+
- Gemini 3 Flash API key
- X Developer API credentials
- Internet connection (VPS recommended)

## License

MIT - Build for Bitcoin 🚀
