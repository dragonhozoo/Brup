/**
 * ============================================================
 *  DGXEONHOZOOMD - TIKTOK MASS REPORT TOOL + TELEGRAM BOT
 *  Dev     : DGXEONHOZOOMD
 *  Rilis   : 27/10/2026
 *  SC      : Node.js (>=18)
 *  Metode  : Auto Report Akun / Live TikTok + Bot Telegram
 * ============================================================
 */

const https = require('https');
const crypto = require('crypto');

// ============================================================
// KONFIGURASI GLOBAL
// ============================================================
const CONFIG = {
    // Bot Telegram
    telegramBotToken: '8511322484:AAEOSszHG3CFQVJ4_V0tennNsrpducOIL1k',
    telegramChatId: '8530130542',

    baseHeaders: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Origin': 'https://www.tiktok.com',
        'Referer': 'https://www.tiktok.com/',
        'Sec-Ch-Ua': '"Not:A-Brand";v="8", "Chromium";v="156"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Linux"',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'Connection': 'keep-alive'
    },

    // ============================================================
    // 🔴 COOKIE LANGSUNG DI HARDCODE
    // ============================================================
    cookies: 'tt_csrf_token=dwjZE63M-H_DRdzJkhp6lCd0FMPSI6SFWCCU; s_v_web_id=verify_mvq6nxa8_kA8Z8P3r_J2wx_4Zkv_8eE1_Pakf0f3gN6rm; d_ticket=12f9ca0800e195f7b9e53d31f4ab28ca33902; multi_sids=7657198937929122817%3Ada1b7be7a49aec99d68ca9fae47bbb02; cmpl_token=AgQYAPOg_hfkTtK6fTt6xfFdOPCBvuK30z-EN2CrmF4; sid_guard=da1b7be7a49aec99d68ca9fae47bbb02%7C1793075209%7C15552000%7CSun%2C+25-Apr-2027+04%3A26%3A49+GMT; uid_tt=cfb62f9c06ca7c4d46c53f0a399756f051b0e5dbaf3cccdb10b68c4d5ad79d5d; uid_tt_ss=cfb62f9c06ca7c4d46c53f0a399756f051b0e5dbaf3cccdb10b68c4d5ad79d5d; sid_tt=da1b7be7a49aec99d68ca9fae47bbb02; sessionid=da1b7be7a49aec99d68ca9fae47bbb02; sessionid_ss=da1b7be7a49aec99d68ca9fae47bbb02; tt_session_tlb_tag=sttt%7C2%7C2ht756Sa7JnWjKn65Hu7Av_________q1Lfop7ydjRhKVtLaQlNVa_JE062KhPVx3cLI1lyicIY%3D; sid_ucp_v1=1.0.1-KGJiYmUwMDk5ZWFiNDA1ODViOThhOGU4ZWFlMjJjNTBhOGM3YWJlODUKIgiBiI7u1Lv1oWoQidCA1wYYswsgDDDyq4_SBjgHQPQHSAQQAxoCbXkiIGRhMWI3YmU3YTQ5YWVjOTlkNjhjYTlmYWU0N2JiYjAyMk4KIJC3ek4k9Bof8wjOpl54jfIHP-rvee6_ZRlJkFMJtJB8EiBRDbPWXLht4xP1cSYWnr5OaVJ25CfO-0qO65_FoVXpJRgBIgZ0aWt0b2s; ssid_ucp_v1=1.0.1-KGJiYmUwMDk5ZWFiNDA1ODViOThhOGU4ZWFlMjJjNTBhOGM3YWJlODUKIgiBiI7u1Lv1oWoQidCA1wYYswsgDDDyq4_SBjgHQPQHSAQQAxoCbXkiIGRhMWI3YmU3YTQ5YWVjOTlkNjhjYTlmYWU0N2JiYjAyMk4KIJC3ek4k9Bof8wjOpl54jfIHP-rvee6_ZRlJkFMJtJB8EiBRDbPWXLht4xP1cSYWnr5OaVJ25CfO-0qO65_FoVXpJRgBIgZ0aWt0b2s; store-idc=alisg; store-country-code=id; store-country-code-src=uid; tt-target-idc=alisg; tt-target-idc-sign=JwbieFmC2riw8_IpnJZP3lxVGIeXXsbnzM1x_zwLEQgg8x5oZVZEWP9JIbVRypcMgQOg4BIOVSw2ihynQwaGibRyybm8_uWEYZmECF6JX1SZPcZy2quETkufuL9VuB7h2yKalO4NW7Zpl7tqKfUARhfAerjp1m7VWxIJFm6yxMM8HbR7k4lu1muHuZtqtY7IKFMHYoaDc2IYsyQFYVnKq91TvujqTr5KWVCzpn00CPqJtXImibTeBZgDunzI9WaarDlsh5R8oj2B6sUFpgQUlQKp8D0z7x5URVf_LyS3gTA2QD4PnWNcEOCIQd6E6BIlNOftP8OL_28atA7JlOWUsuyU_wG-demvU0TYUuOOZnKKcoQdAtFHOsJLu6TNx0vP_E3Hucv0l_EbhJ0wxbxagLwJEnn-HxuyvBQOhlHWM4XzWOGiVEsQZWRyBWxBGZMaqdcdUeR47KKUqMP-kYAxAi1woppWT0X7dYSiPfDH7AIAGszGLBpLuqzOCvFkOM-z; tt_chain_token=w6URzbN5lmrAunx1mG7Yww==; ttwid=1%7CMvlr-NVx7QFigo7BckiXkpJ6NZP_In0IPw_xO4eGrpQ%7C1793075234%7C8e66d79121aea5e819bfcfe8457e9fab610485db557f0244827a713768468aef; store-country-sign=MEIEDGmdJ_CveoGSshleqwQgOBruWboA9RdccIxl6VvwD_IXEHovtycO8U-qMnb6rSMEENDWc1EhhZB4sZ5roC1KIeA; odin_tt=3cc3ecf43ba04fa94cc4144e12def506bd5427d86a538d3149f966264ed91ce3c5e1bb3e895f245b726aa9b9810032602417de283b941af6a6869761c4767bec; msToken=XzgVw7haawQGxswPKw8kisrmBQIrqxKX7rQJGhckf-OBsG6ZptQNXzL5AMwo-rMfqXwk97WmRKlFyIuTbY4NoU15JfVtTvkvOqiwVwZoeRJVQlvWtIUfcU167WWYGHN7FZrUp9dH2qOp-3xQx53nWEEPvKKJZ4dNjYmO4XrOMg==',

    reportEndpoints: {
        account: 'https://www.tiktok.com/api/report/user/',
        live: 'https://webcast.tiktok.com/webcast/report/'
    },

    reportReasons: {
        account: {
            '1001': 'Spam', '1002': 'Harassment/Bullying', '1003': 'Hate Speech',
            '1004': 'Violence', '1005': 'Nudity/Sexual Content', '1006': 'False Information',
            '1007': 'Impersonation', '1008': 'Drugs', '1009': 'Weapons', '1010': 'Self-Harm'
        },
        live: {
            '2001': 'Spam Live', '2002': 'Inappropriate Live', '2003': 'Violence Live',
            '2004': 'Nudity Live', '2005': 'Harassment Live', '2006': 'Drugs Live',
            '2007': 'Weapons Live', '2008': 'Self-Harm Live'
        }
    },

    reportDelay: 800,
    maxReportsPerTarget: 50,
    maxRetries: 3
};

// ============================================================
// UTILITAS
// ============================================================
function parseCookieString(cookieStr) {
    const cookies = {};
    cookieStr.split(';').forEach(pair => {
        const [key, ...val] = pair.trim().split('=');
        if (key && val.length) cookies[key.trim()] = val.join('=').trim();
    });
    return cookies;
}

function generateMsToken() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    let token = '';
    const length = 120 + Math.floor(Math.random() * 9);
    for (let i = 0; i < length; i++) token += chars.charAt(Math.floor(Math.random() * chars.length));
    return token;
}

function generateXGnarly() {
    const rand = crypto.randomBytes(24).toString('base64').replace(/[+/=]/g, '');
    return rand.substring(0, 32);
}

function httpRequest(options, postData = null) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve({ status: res.statusCode, headers: res.headers, body: parsed, raw: data });
                } catch {
                    resolve({ status: res.statusCode, headers: res.headers, body: null, raw: data });
                }
            });
        });
        req.on('error', reject);
        req.on('timeout', () => { req.destroy(); reject(new Error('Request timeout')); });
        if (postData) req.write(postData);
        req.end();
    });
}

function extractUsernameFromProfileUrl(url) {
    const match = url.match(/@([^/?]+)/);
    return match ? match[1] : null;
}

// ============================================================
// TELEGRAM API
// ============================================================
async function sendTelegramMessage(chatId, text) {
    const postData = JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML'
    });
    const options = {
        hostname: 'api.telegram.org',
        path: `/bot${CONFIG.telegramBotToken}/sendMessage`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postData) }
    };
    try {
        return await httpRequest(options, postData);
    } catch (err) {
        console.error('[!] Telegram send error:', err.message);
        return null;
    }
}

async function getTelegramUpdates(offset = 0) {
    const options = {
        hostname: 'api.telegram.org',
        path: `/bot${CONFIG.telegramBotToken}/getUpdates?offset=${offset}&timeout=30`,
        method: 'GET'
    };
    try {
        const res = await httpRequest(options);
        return res.body;
    } catch (err) {
        console.error('[!] Telegram getUpdates error:', err.message);
        return null;
    }
}

// ============================================================
// RESOLVE USERNAME -> USER ID
// ============================================================
async function resolveUsernameToUserId(username) {
    const msToken = generateMsToken();
    const path = `/api/user/detail/?uniqueId=${encodeURIComponent(username)}&aid=1988&app_language=en&app_name=tiktok_web&browser_language=en-US&browser_name=Mozilla&browser_online=true&browser_platform=Linux%20x86_64&browser_version=5.0%20%28X11%3B%20Linux%20x86_64%29%20AppleWebKit%2F537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome%2F156.0.0.0%20Safari%2F537.36&channel=tiktok_web&cookie_enabled=true&device_platform=web_pc&focus_state=true&from_page=search&history_len=2&is_fullscreen=false&is_page_visible=true&os=linux&priority_region=SG&referer=&region=SG&root_referer=&screen_height=724&screen_width=700&tz_name=UTC&user_is_login=true&msToken=${msToken}&X-Bogus=1&X-Gnarly=${generateXGnarly()}`;

    const options = {
        hostname: 'www.tiktok.com',
        path,
        method: 'GET',
        headers: { ...CONFIG.baseHeaders, 'Cookie': CONFIG.cookies, 'Referer': `https://www.tiktok.com/@${username}` }
    };

    try {
        const res = await httpRequest(options);
        if (res.body && res.body.userInfo && res.body.userInfo.user) return res.body.userInfo.user.id;
        return null;
    } catch { return null; }
}

// ============================================================
// REPORT ACCOUNT
// ============================================================
async function reportAccount(userId, reasonId, retryCount = 0) {
    const msToken = generateMsToken();
    const postData = JSON.stringify({
        reason: parseInt(reasonId), user_id: userId, object_id: userId,
        report_type: 'user', additional_info: '', aid: 1988, app_language: 'en',
        app_name: 'tiktok_web', browser_language: 'en-US', browser_name: 'Mozilla',
        browser_online: true, browser_platform: 'Linux x86_64',
        browser_version: '5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36',
        channel: 'tiktok_web', cookie_enabled: true, device_platform: 'web_pc',
        focus_state: true, from_page: 'user', history_len: 2, is_fullscreen: false,
        is_page_visible: true, os: 'linux', priority_region: 'SG', referer: '',
        region: 'SG', root_referer: '', screen_height: 724, screen_width: 700,
        tz_name: 'UTC', user_is_login: true, msToken, 'X-Bogus': '1', 'X-Gnarly': generateXGnarly()
    });

    const options = {
        hostname: 'www.tiktok.com', path: '/api/report/user/', method: 'POST',
        headers: {
            ...CONFIG.baseHeaders, 'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData), 'Cookie': CONFIG.cookies,
            'X-Secsdk-Csrf-Token': '00000000000000000000000000000000000000000000',
            'X-Tt-Passport-Csrf-Token': '', 'Referer': `https://www.tiktok.com/@user${userId}`
        }
    };

    try {
        const res = await httpRequest(options, postData);
        if (res.status === 200 && res.body) {
            const code = res.body.status_code || res.body.statusCode || 0;
            if (code === 0 || code === 200 || res.body.msg === 'success') return { success: true, message: 'Report sent' };
            return { success: false, message: res.body.msg || 'Unknown error', code };
        } else if (res.status === 429) {
            if (retryCount < CONFIG.maxRetries) {
                await new Promise(r => setTimeout(r, 2000 * (retryCount + 1)));
                return reportAccount(userId, reasonId, retryCount + 1);
            }
            return { success: false, message: 'Rate limited (429)' };
        }
        return { success: false, message: `HTTP ${res.status}` };
    } catch (err) {
        if (retryCount < CONFIG.maxRetries) {
            await new Promise(r => setTimeout(r, 1000 * (retryCount + 1)));
            return reportAccount(userId, reasonId, retryCount + 1);
        }
        return { success: false, message: err.message };
    }
}

// ============================================================
// REPORT LIVE
// ============================================================
async function reportLive(roomId, reasonId, retryCount = 0) {
    const msToken = generateMsToken();
    const postData = JSON.stringify({
        reason: parseInt(reasonId), room_id: roomId, report_type: 'live',
        additional_info: '', aid: 1988, app_language: 'en', app_name: 'tiktok_web',
        browser_language: 'en-US', browser_name: 'Mozilla', browser_online: true,
        browser_platform: 'Linux x86_64',
        browser_version: '5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36',
        channel: 'tiktok_web', cookie_enabled: true, device_platform: 'web_pc',
        focus_state: true, from_page: 'live', history_len: 2, is_fullscreen: false,
        is_page_visible: true, os: 'linux', priority_region: 'SG', referer: '',
        region: 'SG', root_referer: '', screen_height: 724, screen_width: 700,
        tz_name: 'UTC', user_is_login: true, msToken, 'X-Bogus': '1', 'X-Gnarly': generateXGnarly()
    });

    const options = {
        hostname: 'webcast.tiktok.com', path: '/webcast/report/', method: 'POST',
        headers: {
            ...CONFIG.baseHeaders, 'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData), 'Cookie': CONFIG.cookies,
            'Referer': `https://www.tiktok.com/@live/room/${roomId}`
        }
    };

    try {
        const res = await httpRequest(options, postData);
        if (res.status === 200 && res.body) {
            const code = res.body.status_code || res.body.statusCode || 0;
            if (code === 0 || code === 200 || res.body.msg === 'success') return { success: true, message: 'Live report sent' };
            return { success: false, message: res.body.msg || 'Unknown error' };
        } else if (res.status === 429) {
            if (retryCount < CONFIG.maxRetries) {
                await new Promise(r => setTimeout(r, 3000 * (retryCount + 1)));
                return reportLive(roomId, reasonId, retryCount + 1);
            }
            return { success: false, message: 'Rate limited (429)' };
        }
        return { success: false, message: `HTTP ${res.status}` };
    } catch (err) {
        if (retryCount < CONFIG.maxRetries) {
            await new Promise(r => setTimeout(r, 1000 * (retryCount + 1)));
            return reportLive(roomId, reasonId, retryCount + 1);
        }
        return { success: false, message: err.message };
    }
}

// ============================================================
// PROSES REPORT
// ============================================================
async function processAccountReport(userId, chatId) {
    const reasons = Object.keys(CONFIG.reportReasons.account);
    let total = 0, sukses = 0, gagal = 0;

    await sendTelegramMessage(chatId, `🔥 <b>Mulai report akun:</b>\n<code>${userId}</code>\nMaksimal: ${CONFIG.maxReportsPerTarget} laporan`);

    while (total < CONFIG.maxReportsPerTarget) {
        const reasonId = reasons[total % reasons.length];
        const result = await reportAccount(userId, reasonId);
        if (result.success) sukses++; else gagal++;
        total++;

        if (total % 5 === 0 || total === CONFIG.maxReportsPerTarget) {
            await sendTelegramMessage(chatId, `📊 <b>Progress:</b> ${total}/${CONFIG.maxReportsPerTarget}\n✅ Sukses: ${sukses}\n❌ Gagal: ${gagal}`);
        }
        await new Promise(r => setTimeout(r, CONFIG.reportDelay));
    }

    await sendTelegramMessage(chatId, `✅ <b>Selesai report akun!</b>\nTotal: ${total} | Sukses: ${sukses} | Gagal: ${gagal}`);
}

async function processLiveReport(roomId, chatId) {
    const reasons = Object.keys(CONFIG.reportReasons.live);
    let total = 0, sukses = 0, gagal = 0;

    await sendTelegramMessage(chatId, `🔥 <b>Mulai report live:</b>\n<code>${roomId}</code>\nMaksimal: ${CONFIG.maxReportsPerTarget} laporan`);

    while (total < CONFIG.maxReportsPerTarget) {
        const reasonId = reasons[total % reasons.length];
        const result = await reportLive(roomId, reasonId);
        if (result.success) sukses++; else gagal++;
        total++;

        if (total % 5 === 0 || total === CONFIG.maxReportsPerTarget) {
            await sendTelegramMessage(chatId, `📊 <b>Progress:</b> ${total}/${CONFIG.maxReportsPerTarget}\n✅ Sukses: ${sukses}\n❌ Gagal: ${gagal}`);
        }
        await new Promise(r => setTimeout(r, CONFIG.reportDelay));
    }

    await sendTelegramMessage(chatId, `✅ <b>Selesai report live!</b>\nTotal: ${total} | Sukses: ${sukses} | Gagal: ${gagal}`);
}

// ============================================================
// TELEGRAM BOT LOOP
// ============================================================
async function startTelegramBot() {
    console.log('[+] Telegram bot started...');
    let offset = 0;

    while (true) {
        try {
            const updates = await getTelegramUpdates(offset);

            if (updates && updates.ok && updates.result.length > 0) {
                for (const update of updates.result) {
                    offset = update.update_id + 1;

                    if (update.message && update.message.text) {
                        const chatId = update.message.chat.id;
                        const text = update.message.text.trim();

                        if (text === '/start') {
                            await sendTelegramMessage(chatId, `🖤 <b>DGXEONHOZOOMD BOT</b>\n\n/start - Menu\n/love &lt;link/id&gt; - Report akun TikTok\n/xlove &lt;link/id&gt; - Report live TikTok`);
                        } else if (text.startsWith('/love ')) {
                            const target = text.substring(6).trim();
                            if (!target) {
                                await sendTelegramMessage(chatId, '❌ Masukkan link profil atau ID akun TikTok.');
                                continue;
                            }
                            let userId = target;
                            if (target.startsWith('http')) {
                                const username = extractUsernameFromProfileUrl(target);
                                if (!username) {
                                    await sendTelegramMessage(chatId, '❌ Link tidak valid.');
                                    continue;
                                }
                                await sendTelegramMessage(chatId, `🔎 Resolve username: ${username}...`);
                                userId = await resolveUsernameToUserId(username);
                                if (!userId) {
                                    await sendTelegramMessage(chatId, '❌ Gagal resolve user ID. Coba pakai ID langsung.');
                                    continue;
                                }
                            }
                            processAccountReport(userId, chatId).catch(console.error);
                        } else if (text.startsWith('/xlove ')) {
                            const target = text.substring(7).trim();
                            if (!target) {
                                await sendTelegramMessage(chatId, '❌ Masukkan link live atau room ID TikTok.');
                                continue;
                            }
                            let roomId = target;
                            if (target.startsWith('http')) {
                                const match = target.match(/(?:live\/|room\/)(\d+)/);
                                if (match) roomId = match[1];
                                else {
                                    await sendTelegramMessage(chatId, '❌ Link live tidak valid.');
                                    continue;
                                }
                            }
                            processLiveReport(roomId, chatId).catch(console.error);
                        }
                    }
                }
            }
        } catch (err) {
            console.error('[!] Bot error:', err.message);
        }
        await new Promise(r => setTimeout(r, 1000));
    }
}

// ============================================================
// CLI FALLBACK (jika tanpa bot)
// ============================================================
async function runCli() {
    const readline = require('readline');
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const ask = (q) => new Promise(res => rl.question(q, res));

    console.log(`\n_______________________________`);
    console.log(`       [ DGXEONHOZOOMD]`);
    console.log(`DEV      :DGXEONHOZOOMD`);
    console.log(`DILIRIS  :27/10/2026`);
    console.log(`SC       : NODEJS`);
    console.log(`METODE   : BAN TIKTOK`);
    console.log(`______________________________\n`);
    console.log(`[01] ACCOUNT REPORT`);
    console.log(`[02] LIVE TIKTOK REPORT`);

    const choice = await ask('Pilih (01/02): ');
    if (choice === '01') {
        const target = await ask('Masukkan link profil atau ID akun TikTok: ');
        if (target) {
            let userId = target;
            if (target.startsWith('http')) {
                const username = extractUsernameFromProfileUrl(target);
                if (username) userId = await resolveUsernameToUserId(username);
                if (!userId) { console.log('❌ Gagal resolve user ID.'); rl.close(); return; }
            }
            console.log(`[+] User ID: ${userId}`);
            const reasons = Object.keys(CONFIG.reportReasons.account);
            let total = 0, sukses = 0, gagal = 0;
            while (total < CONFIG.maxReportsPerTarget) {
                const reasonId = reasons[total % reasons.length];
                const result = await reportAccount(userId, reasonId);
                if (result.success) sukses++; else gagal++;
                total++;
                process.stdout.write(`\r[${total}/${CONFIG.maxReportsPerTarget}] ✅ ${sukses} ❌ ${gagal}`);
                await new Promise(r => setTimeout(r, CONFIG.reportDelay));
            }
            console.log(`\n[+] Selesai! Sukses: ${sukses} | Gagal: ${gagal}`);
        }
    } else if (choice === '02') {
        const target = await ask('Masukkan link live atau room ID TikTok: ');
        if (target) {
            let roomId = target;
            if (target.startsWith('http')) {
                const match = target.match(/(?:live\/|room\/)(\d+)/);
                if (match) roomId = match[1];
                else { console.log('❌ Link live tidak valid.'); rl.close(); return; }
            }
            console.log(`[+] Room ID: ${roomId}`);
            const reasons = Object.keys(CONFIG.reportReasons.live);
            let total = 0, sukses = 0, gagal = 0;
            while (total < CONFIG.maxReportsPerTarget) {
                const reasonId = reasons[total % reasons.length];
                const result = await reportLive(roomId, reasonId);
                if (result.success) sukses++; else gagal++;
                total++;
                process.stdout.write(`\r[${total}/${CONFIG.maxReportsPerTarget}] ✅ ${sukses} ❌ ${gagal}`);
                await new Promise(r => setTimeout(r, CONFIG.reportDelay));
            }
            console.log(`\n[+] Selesai! Sukses: ${sukses} | Gagal: ${gagal}`);
        }
    }
    rl.close();
}

// ============================================================
// MAIN
// ============================================================
async function main() {
    // Jika token bot belum diisi, jalankan CLI
    if (CONFIG.telegramBotToken === 'ISI_BOT_TOKEN_LO' || CONFIG.telegramChatId === 'ISI_CHAT_ID_LO') {
        console.log('[!] Telegram token/chat ID belum diisi, fallback ke CLI.');
        await runCli();
    } else {
        console.log('[+] Bot Telegram aktif. Kirim /start di chat.');
        await startTelegramBot();
    }
}

main();zs
