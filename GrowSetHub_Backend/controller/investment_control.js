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
        const {username,companyname,shareprice,selectedshares} = req.body;
        /*const sql = "update UserInvestments set buyPrice = buyPrice + ? where Username = ? and CompanyName = ?";
        const sql2 = "update UserInvestments set sharesOwned = sharesOwned + ? where Username = ? and CompanyName = ?";
        
        const [results1] = await connection.promise().query(sql,[amount,username,companyname]);
        const [results2] = await connection.promise().query(sql2,[selectedshares,username,companyname]);*/

        const sql1 = "select COUNT(*) as total from UserInvestments"
        const [results1] = await connection.promise().query(sql1);
        const count = results1[0].total;

        const sql2 = "INSERT INTO UserInvestments (`index`, Username, CompanyName, buyPrice, sharesOwned, currentSharePrice) VALUES(?,?,?,?,?,?)";
        const [results2] = await connection.promise().query(sql1,[count,username,companyname,shareprice,selectedshares,shareprice]);

        console.log(results2);
        
        return res.status(200).json(results2);

    } catch (err) {
        console.error("❌ Error getting data3:", err);
        return res.status(500).json({ error: "Database error1" });
    }
}

async function SoldShares(req , res){
    try {
        const {username,companyname,shareprice,selectedshares} = req.body;

        const sql1 = "select * from UserInvestments where Username = ? and CompanyName = ?";
        const [results1] = await connection.promise().query(sql1,[username,companyname]);

        const sql2 = "SELECT Username, CompanyName, SUM(sharesOwned) AS TotalsharesOwned FROM UserInvestments WHERE Username = ? AND CompanyName = ? GROUP BY Username, CompanyName";

        const [results2] = await connection.promise().query(sql2, [username, companyname]);
        const totalAmount = (results2[0].TotalsharesOwned) * shareprice;
        let tempTotalAmount = totalAmount;
        let tempTotalAmount2 = 0;
        let IndexArray = [];
        let LastIndex = -1;
        let a=0;
        results1.some((row,index) =>{
            if(a===0){
                tempTotalAmount -= (row.buyPrice)*(row.sharesOwned);
                IndexArray.push(row.index);
                LastIndex = row.index;
                if(tempTotalAmount <= 0){
                    row.sharesOwned = row.sharesOwned - selectedshares;
                    a=1;
                }
            }
            tempTotalAmount2 = tempTotalAmount;
        })

        for (const row of IndexArray) {
            if(row !== LastIndex){
                const sql3 = "delete from UserInvestments where `index` = ?";
                const [results3] = await connection.promise().query(sql3,[row]);
            }   
        }
        
        if(tempTotalAmount2 === 0){
            const sql4 = "delete from UserInvestments where `index` = ?";
            const [results4] = await connection.promise().query(sql4,[LastIndex]);
        }else{
            const sql5 = "update UserInvestments set sharesOwned = sharesOwned - ? where `index` = ?";
            const [results5] = await connection.promise().query(sql5,[selectedshares,LastIndex]);
        }
        
        return res.status(200).json({message: "done sold"});

    } catch (err) {
        console.error("❌ Error getting data3:", err);
        return res.status(500).json({ error: "Database error1" });
    }
}

module.exports = { Stocks, CompaniesWithStocks, UserInvestments, BoughtShares, SoldShares };


//https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=summaryDetail,defaultKeyStatistics`;