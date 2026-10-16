/**
 * ============================================================
 *  HOZOO MD - TELEGRAM BOT (ALL-IN-ONE)
 *  Features : /start /menu /help /scanurl /repost
 *  Token    : 8763413992:AAGHLdEkzr1d4F-JokJuuojP4B1SDwKTu7U
 *  Owner ID : 8530130542
 *  Version  : 2.0.0
 * ============================================================
 */

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const https = require('https');
const { URL } = require('url');
const moment = require('moment');

// ================== KONFIGURASI ==================
const BOT_TOKEN = '8763413992:AAGHLdEkzr1d4F-JokJuuojP4B1SDwKTu7U';
const OWNER_ID  = '8530130542';
const COOLDOWN  = 3000; // 3 detik anti spam

// ================== INIT BOT ==================
const bot = new TelegramBot(BOT_TOKEN, {
  polling: { interval: 1000, autoStart: true, params: { timeout: 10 } }
});

console.log(`\n╔══════════════════════════════════╗`);
console.log(`║        HOZOO MD BOT v2.0         ║`);
console.log(`║     All-In-One Edition 🔥        ║`);
console.log(`╚══════════════════════════════════╝`);
console.log(`[+] Bot started at ${moment().format('YYYY-MM-DD HH:mm:ss')}`);
console.log(`[+] Owner ID: ${OWNER_ID}\n`);

// ================== ANTI SPAM ==================
const spamStore = new Map();
function isSpam(userId) {
  const now = Date.now();
  if (spamStore.has(userId)) {
    if (now - spamStore.get(userId) < COOLDOWN) return true;
  }
  spamStore.set(userId, now);
  return false;
}

// ================== HTTP AGENT ==================
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
  keepAlive: true,
  timeout: 15000
});

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0'
];
const randomUA = () => USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

// ================== SCANNER FUNCTION ==================
async function scanUrl(target) {
  const start = Date.now();
  const parsed = new URL(target);

  const res = await axios({
    method: 'GET',
    url: target,
    timeout: 15000,
    httpsAgent,
    maxRedirects: 5,
    validateStatus: () => true,
    headers: {
      'User-Agent': randomUA(),
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Cache-Control': 'no-cache',
      'Referer': `${parsed.protocol}//${parsed.host}`
    }
  });

  const elapsed = Date.now() - start;
  const headersPreview = Object.entries(res.headers)
    .slice(0, 15)
    .map(([k, v]) => `${k}: ${String(v).slice(0, 100)}`)
    .join('\n');

  let body = '';
  if (typeof res.data === 'string') body = res.data;
  else if (Buffer.isBuffer(res.data)) body = res.data.toString('utf-8');
  else body = JSON.stringify(res.data);

  const bodyPreview = body.replace(/\s+/g, ' ').slice(0, 500) + (body.length > 500 ? '...' : '');
  const size = Buffer.byteLength(body, 'utf-8');

  return {
    status: res.status,
    time: elapsed,
    size,
    server: res.headers['server'] || 'N/A',
    protocol: parsed.protocol.replace(':', '').toUpperCase(),
    headersPreview,
    bodyPreview
  };
}

// ================== REPOST FUNCTION ==================
async function repostContent(channel, text) {
  let ch = channel.trim();
  if (!ch.startsWith('@') && !ch.startsWith('-')) ch = '@' + ch;
  return await bot.sendMessage(ch, text, {
    parse_mode: 'Markdown',
    disable_web_page_preview: false
  });
}

// ================== ESCAPE MARKDOWN ==================
function esc(str) {
  return String(str).replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&');
}

// ================== COMMAND: /start ==================
bot.onText(/^\/start$/, (msg) => {
  const chatId = msg.chat.id;
  const name = msg.from.first_name || 'Kawan';

  const menu =
`╔══════════════════════════════════╗
║        *HOZOO MD BOT v2.0*       ║
║      Private Tools & Scanner     ║
╚══════════════════════════════════╝

Halo *${name}* 👋
Selamat datang di *HOZOO MD BOT*

*📋 DAFTAR MENU:*
┌──────────────────────────────
│ /start    → Tampilkan menu
│ /menu     → List tools
│ /scanurl  → Scan URL + response
│ /repost   → Repost ke channel
│ /help     → Panduan
└──────────────────────────────

*Cara Pakai:*
• \`/scanurl https://example.com\`
• \`/repost @channelku Halo dunia\`

_HOZOO MD — No Filter, No Limit._ 🔥`;

  bot.sendMessage(chatId, menu, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [{ text: '🔍 Scan URL', callback_data: 'menu_scan' }],
        [{ text: '📢 Repost',   callback_data: 'menu_repost' }],
        [{ text: 'ℹ️ Help',     callback_data: 'menu_help' }]
      ]
    }
  });
});

// ================== COMMAND: /menu ==================
bot.onText(/^\/menu$/, (msg) => {
  bot.sendMessage(msg.chat.id,
`*📋 MENU HOZOO MD*

1. */scanurl* <url>
   → GET response, header, status, size, server

2. */repost* <channel> <text>
   → Kirim konten ke channel target

3. */help*
   → Panduan lengkap

4. */start*
   → Menu utama`,
    { parse_mode: 'Markdown' });
});

// ================== COMMAND: /help ==================
bot.onText(/^\/help$/, (msg) => {
  bot.sendMessage(msg.chat.id,
`*❓ HELP - HOZOO MD BOT*

*1. Scan URL*
\`/scanurl https://target.com\`
Output: status, headers, body preview, server

*2. Repost*
\`/repost @channelku Halo dunia\`
Bot harus admin di channel target.

*3. Cooldown*
3 detik per command. Jangan spam.

_Owner ID: \`${OWNER_ID}\`_`,
    { parse_mode: 'Markdown' });
});

// ================== COMMAND: /scanurl ==================
bot.onText(/^\/scanurl(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (isSpam(userId)) {
    return bot.sendMessage(chatId, '⏳ Sabar bray, cooldown 3 detik.');
  }

  const url = match[1];
  if (!url) {
    return bot.sendMessage(chatId, '❌ Format: `/scanurl https://target.com`', { parse_mode: 'Markdown' });
  }
  if (!/^https?:\/\//i.test(url)) {
    return bot.sendMessage(chatId, '❌ URL harus pakai http:// atau https://');
  }

  const loading = await bot.sendMessage(chatId, '🔍 Scanning URL...');

  try {
    const r = await scanUrl(url);
    const output =
`🔍 *SCAN RESULT*
━━━━━━━━━━━━━━━━━━
🌐 *URL:* \`${url}\`
📡 *Status:* \`${r.status}\`
⚡ *Time:* \`${r.time} ms\`
📦 *Size:* \`${r.size} bytes\`
🖥️ *Server:* \`${r.server}\`
🔒 *Protocol:* \`${r.protocol}\`
━━━━━━━━━━━━━━━━━━
*📑 Headers:*
\`\`\`
${r.headersPreview}
\`\`\`
━━━━━━━━━━━━━━━━━━
*📄 Body Preview:*
\`\`\`
${r.bodyPreview}
\`\`\``;

    await bot.editMessageText(output, {
      chat_id: chatId,
      message_id: loading.message_id,
      parse_mode: 'Markdown'
    });
  } catch (err) {
    await bot.editMessageText(`❌ *Error:* ${err.message}`, {
      chat_id: chatId,
      message_id: loading.message_id,
      parse_mode: 'Markdown'
    });
  }
});

// ================== COMMAND: /repost ==================
bot.onText(/^\/repost(?:\s+(\S+))?(?:\s+([\s\S]+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (isSpam(userId)) {
    return bot.sendMessage(chatId, '⏳ Sabar bray, cooldown 3 detik.');
  }

  const target = match[1];
  const content = match[2];

  if (!target || !content) {
    return bot.sendMessage(chatId, '❌ Format: `/repost @channel textnya`', { parse_mode: 'Markdown' });
  }

  try {
    const sent = await repostContent(target, content);
    bot.sendMessage(chatId, `✅ Berhasil repost ke \`${target}\`\nMessage ID: \`${sent.message_id}\``, {
      parse_mode: 'Markdown'
    });
  } catch (err) {
    bot.sendMessage(chatId, `❌ *Gagal repost:* ${err.message}`, { parse_mode: 'Markdown' });
  }
});

// ================== CALLBACK QUERY ==================
bot.on('callback_query', async (q) => {
  const chatId = q.message.chat.id;
  const data = q.data;

  if (data === 'menu_scan') {
    bot.sendMessage(chatId, '🔍 Ketik: `/scanurl https://target.com`', { parse_mode: 'Markdown' });
  } else if (data === 'menu_repost') {
    bot.sendMessage(chatId, '📢 Ketik: `/repost @channel text`', { parse_mode: 'Markdown' });
  } else if (data === 'menu_help') {
    bot.sendMessage(chatId, '❓ Ketik: `/help`', { parse_mode: 'Markdown' });
  }

  bot.answerCallbackQuery(q.id);
});

// ================== ERROR HANDLERS ==================
bot.on('polling_error', (err) => console.log(`[POLLING ERROR] ${err.message}`));
process.on('uncaughtException',  (err) => console.log(`[UNCAUGHT] ${err.message}`));
process.on('unhandledRejection', (err) => console.log(`[UNHANDLED] ${err}`));
