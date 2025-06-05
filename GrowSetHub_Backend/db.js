require("dotenv").config();
const mysql = require("mysql2/promise");

let pool;
let isReconnecting = false;
let waitingResolvers = [];

async function createPool() {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  console.log("✅ MySQL pool created");

  // Notify all waiters
  waitingResolvers.forEach(resolve => resolve());
  waitingResolvers = [];
  isReconnecting = false;
}

async function waitForReconnect() {
  return new Promise(resolve => {
    waitingResolvers.push(resolve);
  });
}

async function reconnectToDB() {
  if (isReconnecting) {
    console.log("⏳ Waiting for existing reconnection...");
    await waitForReconnect();
    return;
  }

  isReconnecting = true;
  try {
    console.log("♻️ Reconnecting to MySQL...");
    if (pool) await pool.end();
    await createPool();
    console.log("✅ Reconnected to MySQL");
  } catch (err) {
    console.error("❌ Reconnection failed:", err.message);
    isReconnecting = false;
    setTimeout(reconnectToDB, 5000);
  }
}

// Initial pool creation
createPool();

// Keep-alive ping
setInterval(async () => {
  try {
    await pool.query('SELECT 1');
    console.log('✅ Keep-alive ping sent to MySQL');
  } catch (err) {
    console.error('❌ Keep-alive ping failed:', err.message);
    if (err.code === 'ECONNRESET' || err.fatal) {
      await reconnectToDB();
    }
  }
}, 60 * 1000);

// Export
module.exports = {
  connection: async () => {
    if (isReconnecting || !pool) {
      console.log("⏳ Waiting for pool to be ready...");
      await waitForReconnect();
    }
    return pool;
  },
  reconnectToDB
};
