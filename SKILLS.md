# Bitcoin Pulse - OpenClaw Skills Prompts

Use these prompts to configure OpenClaw for autonomous operation.

---

## Prompt A: The Setup Command

```
OpenClaw, set up a recurring task for the Bitcoin Pulse bot:

1. Create folder structure at ~/.openclaw/workspace/gemini-ai/btc-bot/
2. Create config/config.json with:
   - Gemini 3 Flash for text/reasoning
   - Gemini 2.5 Flash Image (Nano Banana) for visuals
   - X API credentials
3. Enable Yolo Mode for autonomous file writing
4. Set heartbeat to 60 minutes
5. Configure random posting intervals (2-5 minutes)
6. Create media/ and logs/ folders

Use ~/.openclaw/workspace/gemini-ai/btc-bot/config/config.json for API keys.
```

---

## Prompt B: The Master Instruction (Logic)

```
OpenClaw, run the Bitcoin Pulse loop continuously:

=== SCOUT PHASE ===
Every 60 minutes, request Gemini for top 10 BTC trending topics from the last hour.

=== ARCHITECT PHASE ===
Process trends into 4 unique X posts with:
- Viral text under 500 chars
- Emojis 🚀🔥💰
- 2-4 hashtags (#BTC, #Bitcoin, etc)
- Different angle than previous hour

Generate images using Gemini 2.5 Flash Image with:
- Style: photorealistic OR 3d_cyberpunk
- Save to media/ folder
- Use timestamp filenames

=== SCHEDULER PHASE ===
Post at 4 random intervals within each hour:
- T+12m, T+28m, T+41m, T+55m (example)
- Randomize these times each cycle
- Verify Bitcoin price within 1% margin

=== RULES ===
- Never repeat themes from previous cycle
- If trend is "Brazil", focus next on "Smart Cashtags"
- Yolo Mode enabled - write files autonomously
- Log all posts to btc-pulse-YYYY-MM-DD.log
```

---

## Prompt C: Quality Control (System Prompt)

```
When generating X posts for Bitcoin Pulse:

=== TONE ===
- Sharp and professional
- Slightly bullish but not shilling
- Confident, informed, authoritative

=== FORMAT ===
- Maximum 500 characters
- 2-4 relevant hashtags
- Include emojis (🚀🔥💰⭐💎)
- Call to action when appropriate

=== IMAGE STYLE ===
- Photorealistic OR 3d_cyberpunk
- Bitcoin/crypto themed
- High quality, detailed
- No text in images
- 1024x1024 minimum

=== PRICE VERIFICATION ===
Before any post:
1. Get real-time BTC price from Coinbase API
2. Verify post mentions price within 1% margin
3. If price changed >1%, regenerate or update

=== TOPIC VARIETY ===
Avoid repeating themes:
- Mining → Next: ETF flows
- ETF → Next: Regulation
- Price → Next: Adoption
- US → Next: Global (EM, Asia)

=== QUALITY CHECK ===
Before posting:
□ Price accurate within 1%?
□ No repeat themes from last cycle?
□ At least 2 hashtags?
□ Under 500 chars?
□ Image generated successfully?
```

---

## Quick Setup Commands

```bash
# Install dependencies
cd ~/.openclaw/workspace/gemini-ai/btc-bot
npm install

# Start the bot
npm start

# Check logs
tail -f logs/btc-pulse-*.log

# Monitor queue
cat queue.json
```

---

## API Keys Required

| Service | Key | Purpose |
|---------|-----|---------|
| Gemini | `GEMINI_API_KEY` | Text + Image generation |
| X (Twitter) | `X_API_KEY`, `X_API_SECRET`, `X_ACCESS_TOKEN`, `X_ACCESS_TOKEN_SECRET` | Posting |
| Coinbase | None needed | Free price API |

Add to `~/.openclaw/workspace/.env`:
```
GEMINI_API_KEY=your_gemini_key
X_API_KEY=your_x_key
X_API_SECRET=your_x_secret
X_ACCESS_TOKEN=your_access_token
X_ACCESS_TOKEN_SECRET=your_access_secret
```
