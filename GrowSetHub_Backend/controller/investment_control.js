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

async function CompaniesWithStocks(req , res){
    try {
        const sql = "select * from CompaniesWithStocks";
        
        const [results] = await connection.promise().query(sql);
        
        return res.status(200).json(results);

    } catch (err) {
        console.error("❌ Error getting data3:", err);
        return res.status(500).json({ error: "Database error1" });
    }
}

async function UserInvestments(req , res){
    try {
        const {username} = req.body;
        const sql = "select * from UserInvestments where Username = ?";
        
        const [results] = await connection.promise().query(sql,[username]);
        
        return res.status(200).json(results);

    } catch (err) {
        console.error("❌ Error getting data3:", err);
        return res.status(500).json({ error: "Database error1" });
    }
}

async function BoughtShares(req , res){
    try {
        const {username,companyname,amount,selectedshares} = req.body;
        const sql = "update UserInvestments set buyPrice = buyPrice + ? where Username = ? and CompanyName = ?";
        const sql2 = "update UserInvestments set TotalShares = TotalShares + ? where Username = ? and CompanyName = ?";
        
        const [results1] = await connection.promise().query(sql,[amount,companyname,username]);
        const [results2] = await connection.promise().query(sql2,[selectedshares,companyname,username]);
        
        return res.status(200).json({message: "done bought"});

    } catch (err) {
        console.error("❌ Error getting data3:", err);
        return res.status(500).json({ error: "Database error1" });
    }
}

async function SoldShares(req , res){
    try {
        const {username,companyname,amount,selectedshares} = req.body;
        const sql = "update UserInvestments set buyPrice = buyPrice - ? where Username = ? and CompanyName = ?";
        const sql2 = "update UserInvestments set TotalShares = TotalShares - ? where Username = ? and CompanyName = ?";
        
        const [results1] = await connection.promise().query(sql,[amount,companyname,username]);
        const [results2] = await connection.promise().query(sql2,[selectedshares,companyname,username]);
        
        return res.status(200).json({message: "done sold"});

    } catch (err) {
        console.error("❌ Error getting data3:", err);
        return res.status(500).json({ error: "Database error1" });
    }
}

module.exports = { Stocks, CompaniesWithStocks, UserInvestments, BoughtShares, SoldShares };


//https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=summaryDetail,defaultKeyStatistics`;