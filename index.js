#!/usr/bin/env node
/**
 * Bitcoin Pulse - Autonomous Bot (Text-Only)
 * 24/7 Bitcoin content generator with Telegram updates + Image Prompts
 */

require('dotenv').config({ path: './.env' });
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { TwitterApi } = require('twitter-api-v2');

const MEDIA_DIR = path.join(__dirname, 'media');
const QUEUE_FILE = path.join(__dirname, 'queue.json');
const LOG_DIR = path.join(__dirname, 'logs');
const LOG_FILE = path.join(LOG_DIR, 'btc-pulse-' + new Date().toISOString().split('T')[0] + '.log');

let postQueue = [];
let lastThemes = [];
let cycleCount = 0;

const twitterClient = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_TOKEN_SECRET
});

function log(message, type) {
  type = type || 'INFO';
  const timestamp = new Date().toISOString();
  console.log('[' + timestamp + '] [' + type + '] ' + message);
  fs.appendFileSync(LOG_FILE, '[' + timestamp + '] [' + type + '] ' + message + '\n');
}

async function getBTCPrice() {
  try {
    const res = await axios.get('https://api.coinbase.com/v2/prices/BTC-USD/spot', { timeout: 5000 });
    return parseFloat(res.data.data.amount);
  } catch { return null; }
}

async function sendTelegram(message, imagePrompt) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  
  console.log('[TELEGRAM DEBUG] Token:', token ? 'present' : 'missing', 'ChatID:', chatId ? 'present' : 'missing');
  
  if (!token || !chatId) {
    console.log('[TELEGRAM DEBUG] Missing credentials, skipping');
    return;
  }
  
  try {
    let text = '🔔 *Bitcoin Pulse Update*\n\n' + message;
    
    if (imagePrompt) {
      text += '\n\n🎨 *Image Prompt:* ' + imagePrompt;
    }
    
    console.log('[TELEGRAM DEBUG] Sending message...');
    await axios.post(
      'https://api.telegram.org/bot' + token + '/sendMessage',
      { chat_id: chatId, text: text, parse_mode: 'Markdown' },
      { timeout: 5000 }
    );
    console.log('[TELEGRAM DEBUG] Message sent successfully');
    log('Telegram notification sent');
  } catch (error) {
    console.log('[TELEGRAM ERROR]', error.message);
    log('Telegram error: ' + error.message, 'ERROR');
  }
}

async function generateImagePrompt(postContent, topic) {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) return null;

  try {
    const prompt = 'Create a detailed image prompt for: ' + topic + '. Post: ' + postContent.substring(0, 200) + '. Style: photorealistic, cyberpunk, Bitcoin symbols. Under 100 words. Return only the prompt.';
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + geminiKey,
      { contents: [{ parts: [{ text: prompt }] }] },
      { timeout: 15000 }
    );

    const content = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return content.replace(/\n/g, ' ').trim();
  } catch (error) {
    return null;
  }
}

async function scoutTrends() {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) return null;

  try {
    const btcPrice = await getBTCPrice();
    const btcStr = btcPrice ? btcPrice.toLocaleString() : 'N/A';
    const avoidClause = lastThemes.length > 0 
      ? '\n\nAVOID these recent themes: ' + lastThemes.join(', ') + '. Find different angles.'
      : '';

    const prompt = 'You are the SCOUT. Research top 10 Bitcoin/crypto trends from internet, X, social media. PRIORITY: Focus heavily on INDIAN market since India has the most Bitcoin holders globally. Include: Indian influencers, regulatory news from India (RBI, SEBI), Indian exchanges (WazirX, CoinDCX), Indian celebrities backing crypto, India-based institutional adoption, local Indian crypto communities, INR/BTC trading trends. Also cover: influential global statements, price action, on-chain data, ETF flows. Current BTC: $' + btcStr + avoidClause + '. Return JSON: [{"topic":"name","who":"person or N/A","statement":"what they said","impact":"why it matters"}]. Mix Indian and global topics (70% India-focused). Only JSON.';

    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + geminiKey,
      { contents: [{ parts: [{ text: prompt }] }] },
      { timeout: 30000 }
    );

    const content = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const jsonMatch = content.match(/\[.*\]/s);
    
    if (jsonMatch) {
      const trends = JSON.parse(jsonMatch[0]);
      log('Scout found ' + trends.length + ' trending topics');
      
      const topicsList = trends.map(t => '• ' + t.topic).join('\n');
      await sendTelegram('🔍 *New Trends Found (' + trends.length + ' topics)*\n\n' + topicsList + '\n\n💰 BTC: $' + btcStr);
      
      return trends;
    }
    return [];
  } catch (error) {
    log('Scout error: ' + error.message, 'ERROR');
    return [];
  }
}

async function architectWork(trends) {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) return [];

  try {
    const btcPrice = await getBTCPrice();
    const btcStr = btcPrice ? btcPrice.toLocaleString() : 'N/A';
    
    const prompt = 'You are the ARCHITECT. Create 15 viral X posts from these topics: ' + JSON.stringify(trends) + '. BTC: $' + btcStr + '. REQUIREMENTS: 1) 70% of posts should be India-focused (Indian regulations, exchanges, influencers, celebrities, adoption) 2) Mix influential quotes (8) and fresh trends (7) 3) Human conversational style with personal opinions and analogies 4) Randomize length 200-600 chars 5) Use emojis and 3-5 hashtags 6) Include India-specific hashtags like #IndiaCrypto #BitcoinIndia #INR #WazirX #CoinDCX when relevant 7) Vary post sizes naturally. Return JSON: [{"post":"text"}]. Only JSON.';

    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + geminiKey,
      { contents: [{ parts: [{ text: prompt }] }] },
      { timeout: 60000 }
    );

    const content = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const jsonMatch = content.match(/\[.*\]/s);
    
    if (jsonMatch) {
      const posts = JSON.parse(jsonMatch[0]);
      lastThemes = trends.slice(0, 5).map(t => t.topic);
      
      log('Generating image prompts for ' + posts.length + ' posts...');
      for (let i = 0; i < posts.length; i++) {
        const topic = trends[i]?.topic || 'Bitcoin';
        const postText = posts[i].post || posts[i].text || posts[i].content || '';
        const imagePrompt = await generateImagePrompt(postText, topic);
        posts[i].imagePrompt = imagePrompt;
        log('Image prompt for post ' + (i + 1) + ': ' + (imagePrompt ? 'generated' : 'failed'));
      }
      
      log('Architect created ' + posts.length + ' posts with image prompts');
      await sendTelegram('✨ *Generated ' + posts.length + ' new posts*\n\n🎨 Each with unique image prompt\n📤 Posting every 30 min\n\n💰 BTC: $' + btcStr);
      
      return posts;
    }
    return [];
  } catch (error) {
    log('Architect error: ' + error.message, 'ERROR');
    return [];
  }
}

async function postToX(content, imagePrompt, index) {
  try {
    const cleanContent = (content || '').replace(/\n/g, ' ').trim().substring(0, 600);
    const tweet = await twitterClient.v2.tweet(cleanContent);
    log('Posted: ' + tweet.data.id);
    
    await sendTelegram('🐦 *Post #' + index + ' Live!*\n\n"' + cleanContent.substring(0, 150) + '..."\n\n🔗 https://x.com/i/web/status/' + tweet.data.id, imagePrompt);
    
    return tweet.data.id;
  } catch (error) {
    log('Post failed: ' + error.message, 'ERROR');
    return null;
  }
}

function saveQueue() {
  fs.writeFileSync(QUEUE_FILE, JSON.stringify(postQueue, null, 2));
}

function loadQueue() {
  try {
    if (fs.existsSync(QUEUE_FILE)) {
      postQueue = JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf8'));
      log('Loaded ' + postQueue.length + ' posts from queue');
    }
  } catch {}
}

async function processQueue() {
  if (postQueue.length === 0) return;

  const item = postQueue.shift();
  saveQueue();

  const content = item.post || item.text || item.content || '';
  const imagePrompt = item.imagePrompt || null;
  const index = item.index || 1;
  
  await postToX(content, imagePrompt, index);
}

async function scoutAndArchitect() {
  cycleCount++;
  log('=== CYCLE #' + cycleCount + ' ===');
  
  const trends = await scoutTrends();
  if (!trends || trends.length === 0) {
    log('No trends found, skipping cycle');
    return false;
  }

  const posts = await architectWork(trends);
  if (posts.length === 0) {
    log('No posts generated');
    return false;
  }

  posts.forEach((p, i) => p.index = i + 1);
  
  postQueue.push(...posts);
  saveQueue();
  log('Queue: ' + postQueue.length + ' posts pending');
  return true;
}

async function heartbeat() {
  const btcPrice = await getBTCPrice();
  const btcStr = btcPrice ? '$' + btcPrice.toLocaleString() : 'N/A';
  const queueInfo = postQueue.length;
  
  log(`[HEARTBEAT] Bot alive - Queue: ${queueInfo} posts - BTC: ${btcStr}`, 'HEARTBEAT');
  
  // Hourly Telegram health check
  const hour = new Date().getHours();
  if (hour % 1 === 0) {
    try {
      await axios.post(
        'https://api.telegram.org/bot' + process.env.TELEGRAM_BOT_TOKEN + '/sendMessage',
        { 
          chat_id: process.env.TELEGRAM_CHAT_ID, 
          text: '💓 *Bitcoin Pulse Heartbeat*\n\n✅ Bot is running\n📤 Queue: ' + queueInfo + ' posts\n💰 BTC: ' + btcStr + '\n⏰ ' + new Date().toLocaleTimeString(),
          parse_mode: 'Markdown'
        },
        { timeout: 5000 }
      );
      log('Heartbeat Telegram sent');
    } catch (e) {
      log('Heartbeat Telegram failed: ' + e.message, 'ERROR');
    }
  }
}

async function main() {
  if (!fs.existsSync(MEDIA_DIR)) fs.mkdirSync(MEDIA_DIR, { recursive: true });
  if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

  console.clear();
  log('Bitcoin Pulse Bot Starting... (Telegram + Image Prompts Mode)');

  await sendTelegram('🚀 *Bitcoin Pulse Bot Started!*\n\n🔄 New content every 5 hours\n📤 3 posts per hour\n🔔 Updates for every new post\n💓 Hourly heartbeats');

  loadQueue();

  if (postQueue.length === 0) {
    await scoutAndArchitect();
  }

  // Heartbeat every 5 minutes
  setInterval(heartbeat, 5 * 60 * 1000);
  
  // Process queue every 20 minutes
  setInterval(async () => {
    if (postQueue.length > 0) await processQueue();
  }, 20 * 60 * 1000);

  // New content every 5 hours
  setInterval(async () => {
    await scoutAndArchitect();
  }, 5 * 60 * 60 * 1000);
}

main().catch(error => {
  log('Fatal error: ' + error.message, 'FATAL');
  process.exit(1);
});
