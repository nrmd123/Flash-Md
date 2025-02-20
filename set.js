const fs = require('fs-extra');
const path = require("path");
const { Sequelize } = require('sequelize');

// Load environment variables if the .env file exists
if (fs.existsSync('set.env')) {
    require('dotenv').config({ path: __dirname + '/set.env' });
}

const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined ? databasePath : process.env.DATABASE_URL;

module.exports = {
    session: process.env.SESSION_ID || 'FLASH-MD-WA-BOT;;;=>eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoic0dpODREZmlDb2lWalhKcmNhRkNFK2FPTkpqWFdlM2NFUFNQalIvVUoxOD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoidXRPS2w1VlQ3MnJCZmhEeDZtNVVyRFJGSXRlWmsxcEhxREt6TTZZdkNtUT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJLQkoxZHFSa3pTZHI4M0R0M0hVeERxMk5yUForK0JKV2lxTEIxeWpBcUVVPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJaZkhXaWJFc1ErMHJIMndKaWJzaVJUOUxxWm1QaEpuNDRTQlIyRHk0dzJnPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImNIUkc2VENqaTVKekpEbXVSclBVMXdFVit1MnVnRjNFY05WR0dQVFBhVlk9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImZOdlVxWmhWd1MvNUxKYmxoeGR0d0JLQktaWGlBRFpuKy9wcmk5dXluMXM9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiU0pNTGYyRzl4R2s1SzVaQW1wZWQxL2RSZW52Z21FNlFnUE8yL1ZiaGFHVT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNzIrMmN5MmxjdHhvaUNnZDJXMjlYTC8yWHVPVm5xOHY5VUlhY1p3TFhsYz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ijh5dTByK3JNSkRUYWxGTi8wb3JjUmlZZkhxWk1FR3R1VDk3dFVuUWcxL25GVEx1bjVORnhCdWo1MjIxNXdxKzZOMmtsLzU2RUh2TUwzbWJ0SzhLMER3PT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTEwLCJhZHZTZWNyZXRLZXkiOiJLMVVBZFk3d3RJQkFzUUhwb3krcEpRczFCemdTQ2JLY2NDMGtzU0szMWpJPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiIzMFhyWExLTFE2T08xQ285OXRFUHp3IiwicGhvbmVJZCI6IjA3NTJjNjkzLWVmNWUtNGE2NS05NDlkLWU1NDIyN2FkODQyMiIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJublluY0FVczhkd0lqbkprRkZnTnJ3S0RXRGc9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoicTlaRmJBMlJiSUZUVUdMOUIwTERsWmZjakhZPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6Ik1KWlI5NThBIiwibWUiOnsiaWQiOiI5NDc2MjY5OTcxMjo1NUBzLndoYXRzYXBwLm5ldCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDS0xLKzhJQ0VJckwzYjBHR0FFZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiTE43NEpoY1ZmNzF6U0VCR0ZvUHFpK0xnSVQxS1hRUmNLN2lYbi9MMUR4az0iLCJhY2NvdW50U2lnbmF0dXJlIjoiODBmTUo3V0RPV2RSVGlQNTE4RW1TSklyM29Pc0FMY3d0RjVla1JTM3l1cVFXT3A1R1h0bVN5c21DOWorMHhYUEJvaHN6ZVhrNmE0RVVsa0dRVEFRRFE9PSIsImRldmljZVNpZ25hdHVyZSI6Ii9QeGZwUGdUR0N5SmNmTDkzNVVXNkhDNi9VZ1dIVUcyNzNSdUpWZlpmU2lpNnlaRldjc3ZCUm1uZml1RXpQR0NBQ3ovMGEyenlIUTVEN0VFMlZzNUJBPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiOTQ3NjI2OTk3MTI6NTVAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCU3plK0NZWEZYKzljMGhBUmhhRDZvdmk0Q0U5U2wwRVhDdTRsNS95OVE4WiJ9fV0sInBsYXRmb3JtIjoiYW5kcm9pZCIsImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTc0MDA3MjM0MywibXlBcHBTdGF0ZUtleUlkIjoiQUFBQUFQZDYifQ==',
    PREFIXES: (process.env.PREFIX || '.').split(',').map(prefix => prefix.trim()).filter(Boolean),
    OWNER_NAME: process.env.OWNER_NAME || "NR King",
    OWNER_NUMBER: process.env.OWNER_NUMBER || "94762699712",
    AUTO_LIKE: process.env.STATUS_LIKE || "off",
    AUTO_READ_STATUS: process.env.AUTO_VIEW_STATUS || "on",
    AUTOREAD_MESSAGES: process.env.AUTO_READ_MESSAGES || "on",
    CHATBOT: process.env.CHAT_BOT || "off",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_SAVE_STATUS || 'on',
    A_REACT: process.env.AUTO_REACTION || 'on',
    L_S: process.env.STATUS_LIKE || 'on',
    AUTO_BLOCK: process.env.BLOCK_ALL || 'off',
    URL: process.env.MENU_LINKS || 'https://telegra.ph/file/82186a2f0d2a8e4338e18-c23b0c1906a58fe223.jpg',
    MODE: process.env.BOT_MODE || "public",
    PM_PERMIT: process.env.PM_PERMIT || 'on',
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME,
    ANTIVIEW: process.env.VIEWONCE,
    HEROKU_API_KEY: process.env.HEROKU_API_KEY,
    WARN_COUNT: process.env.WARN_COUNT || '3',
    PRESENCE: process.env.PRESENCE || '',
    ADM: process.env.ANTI_DELETE || 'on',
    TZ: process.env.TIME_ZONE || 'Africa/Nairobi',
    DP: process.env.STARTING_MESSAGE || "on",
    ANTICALL: process.env.ANTICALL || 'on',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://flashmd_user:JlUe2Vs0UuBGh0sXz7rxONTeXSOra9XP@dpg-cqbd04tumphs73d2706g-a/flashmd"
        : "postgresql://flashmd_user:JlUe2Vs0UuBGh0sXz7rxONTeXSOra9XP@dpg-cqbd04tumphs73d2706g-a/flashmd",
    W_M: null, // Add this line
};

// Watch for changes in this file and reload it automatically
const fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`Updated ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
