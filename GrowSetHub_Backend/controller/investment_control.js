require("dotenv").config();
const mysql = require("mysql2");

// Connect to the database
/*const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "07Adi@2005thya",
  database: "db",
  port: 3306,
});*/

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
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

        // const sql1 = "select COUNT(*) as total from UserInvestments"
        // const [results1] = await connection.promise().query(sql1);
        // const count = results1[0].total;

        const sql2 = "INSERT INTO UserInvestments (Username, CompanyName, buyPrice, sharesOwned, currentSharePrice) VALUES(?,?,?,?,?)";
        const [results2] = await connection.promise().query(sql2,[username,companyname,shareprice,selectedshares,shareprice]);

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
        let TotalsharesOwned = results2[0].TotalsharesOwned;
        //let tempTotalsharesOwned = TotalsharesOwned;
        let tempTotalsharesSelected = selectedshares;
        //let tempTotalsharesOwned2 = 0;
        let IndexArray = [];
        let LastIndex = -1;
        let updatedShares = 0;
        let a=0;
        results1.some((row,index) =>{
            if(a===0){
                if(tempTotalsharesSelected <= row.sharesOwned){
                    a=1;
                    LastIndex = row.index;
                    updatedShares = row.sharesOwned - tempTotalsharesSelected;
                    return true;
                }
                tempTotalsharesSelected -= row.sharesOwned;
                IndexArray.push(row.index);
            }
            //tempTotalAmount2 = tempTotalAmount;
            //tempTotalsharesOwned2 = tempTotalsharesOwned;
        })

        console.log("updatedShares",updatedShares);
        console.log("LastIndex",LastIndex);
        console.log("IndexArray",IndexArray);
        console.log("TotalsharesOwned",TotalsharesOwned);
        for (const row of IndexArray) {
            if(row !== LastIndex){
                const sql3 = "delete from UserInvestments where `index` = ?";
                const [results3] = await connection.promise().query(sql3,[row]);
            }   
        }
        
        if(updatedShares === 0){
            const sql4 = "delete from UserInvestments where `index` = ?";
            const [results4] = await connection.promise().query(sql4,[LastIndex]);
        }else{
            const sql5 = "update UserInvestments set sharesOwned = ? where `index` = ?";
            const [results5] = await connection.promise().query(sql5,[updatedShares,LastIndex]);
        }
        
        return res.status(200).json({message: "done sold"});

    } catch (err) {
        console.error("❌ Error getting data3:", err);
        return res.status(500).json({ error: "Database error1" });
    }
}



async function getAllRealEstatesNotBought(req , res){
    try {
        const {username} = req.body;
        const sql = "select * from RealEstateMain where idx not in (select idx from UserRealEstate where username = ?)";
        
        const [results] = await connection.promise().query((sql),[username]);
        console.log(results);

        
        return res.status(200).json(results);

    } catch (err) {
        console.error("❌ Error getting data3:", err);
        return res.status(500).json({ error: "Database error1" });
    }
}

async function getAllRealEstatesBought(req , res){
    try {
        const {username} = req.body;
        const sql = "select * from RealEstateMain where idx in (select idx from UserRealEstate where username = ?)";
        
        const [results] = await connection.promise().query((sql),[username]);
        console.log(results);

        
        return res.status(200).json(results);

    } catch (err) {
        console.error("❌ Error getting data3:", err);
        return res.status(500).json({ error: "Database error1" });
    }
}

async function buyProperty(req , res){
    try {
        const {username,idx} = req.body;
        const sql = "insert into UserRealEstate (username,idx) values (?,?)";
        const sql2 = "update Balances set Balance = Balance-(select price from RealEstateMain where idx = ?) where Username = ?";
        
        const [results] = await connection.promise().query((sql),[username,idx]);
        await connection.promise().query((sql2),[idx,username]);

        console.log(results);

        
        return res.status(200).json(results);

    } catch (err) {
        console.error("❌ Error getting data3:", err);
        return res.status(500).json({ error: "Database error1" });
    }
}

async function sellProperty(req , res){
    try {
        const {username,idx} = req.body;
        const sql = "delete from UserRealEstate where (username,idx) = (?,?)";
        const sql2 = "update Balances set Balance = Balance+(select price from RealEstateMain where idx = ?) where Username = ?";
        
        const [results] = await connection.promise().query((sql),[username,idx]);
        await connection.promise().query((sql2),[idx,username]);

        console.log(results);
        
        return res.status(200).json(results);

    } catch (err) {
        console.error("❌ Error getting data3:", err);
        return res.status(500).json({ error: "Database error1" });
    }
}

async function getCountofPropBought(req , res){
    try {
        const {username} = req.body;
        const sql = "select count(*) as CountProp from UserRealEstate where username = ?";
        
        const [results] = await connection.promise().query(sql,[username]);
        console.log(results);

        
        return res.status(200).json(results);

    } catch (err) {
        console.error("❌ Error getting data3:", err);
        return res.status(500).json({ error: "Database error1" });
    }
}

async function getTotalIncomePerHourUser(req , res){
    try {
        const { username } = req.body;
        const sql = "select sum(incPerHr) as TotInc from RealEstateMain where idx in (select idx from UserRealEstate where Username = ?)";
        const [results] = await connection.promise().query(sql, [username]);
        console.log(req.body);
        console.log("inc per hour",results);
        
        return res.status(200).json(results);

    } catch (err) {
        console.error("❌ Error getting data2:", err);
    }
}

async function TotalBoughtPrice(req , res){
    try {
        const { username } = req.body;
        const sql = "select sum(Pro) as TotalBought from (select buyPrice * sharesOwned as Pro from UserInvestments where Username = ?) as t";
        const [results] = await connection.promise().query(sql, [username]);
        console.log(req.body);
        console.log("Total Bought Price",results);
        
        return res.status(200).json(results);

    } catch (err) {
        console.error("❌ Error getting data2:", err);
    }
}




module.exports = { Stocks, CompaniesWithStocks, UserInvestments, BoughtShares, SoldShares, getAllRealEstatesNotBought, getAllRealEstatesBought, buyProperty, sellProperty,getTotalIncomePerHourUser,getCountofPropBought,TotalBoughtPrice };


//https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=summaryDetail,defaultKeyStatistics`;