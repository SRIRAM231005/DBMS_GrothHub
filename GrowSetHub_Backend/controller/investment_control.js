const mysql = require("mysql2");

// Connect to the database
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "07Adi@2005thya",
  database: "db",
  port: 3306,
});

async function Stocks(req , res){
    const { symbol } = req.body;
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=5m&range=6h`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error fetching stock data:", error);
        res.status(500).json({ error: "Failed to fetch stock data" });
    }
}

module.exports = { Stocks };