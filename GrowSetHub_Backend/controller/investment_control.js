require("dotenv").config();
const mysql = require("mysql2");
const { connection, reconnectToDB } = require('../db');


const pool = connection();

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
    const pool = await connection();
    try {
        const sql = "select * from CompaniesWithStocks";
        
        const [results] = await pool.query(sql);
        
        return res.status(200).json(results);

    } catch (err) {
        console.error("❌ Error getting CompaniesWithStocks:", err);
        if (err.code === 'ECONNRESET' || err.fatal) {
            await reconnectToDB();
            res.status(503).json({ success: false, retry: true });
        } else {
            res.status(500).json({ success: false });
        }
    }
}

async function UserInvestments(req , res){
    const pool = await connection();
    try {
        const {username} = req.body;
        const sql = "select * from UserInvestments where Username = ?";
        
        const [results] = await pool.query(sql,[username]);
        
        return res.status(200).json(results);

    } catch (err) {
        console.error("❌ Error getting UserInvestments:", err);
        if (err.code === 'ECONNRESET' || err.fatal) {
            await reconnectToDB();
            res.status(503).json({ success: false, retry: true });
        } else {
            res.status(500).json({ success: false });
        }
    }
}

async function BoughtShares(req , res){
    const pool = await connection();
    try {
        const {username,companyname,shareprice,selectedshares} = req.body;
        /*const sql = "update UserInvestments set buyPrice = buyPrice + ? where Username = ? and CompanyName = ?";
        const sql2 = "update UserInvestments set sharesOwned = sharesOwned + ? where Username = ? and CompanyName = ?";
        
        const [results1] = await pool.query(sql,[amount,username,companyname]);
        const [results2] = await pool.query(sql2,[selectedshares,username,companyname]);*/

        // const sql1 = "select COUNT(*) as total from UserInvestments"
        // const [results1] = await pool.query(sql1);
        // const count = results1[0].total;

        const sql1 = "INSERT INTO UserInvestments (Username, CompanyName, buyPrice, sharesOwned, currentSharePrice) VALUES(?,?,?,?,?)";
        const [results2] = await pool.query(sql1,[username,companyname,shareprice,selectedshares,shareprice]);

        const sql2 = "update Balances set Balance = Balance - ? where Username = ?";
        await pool.query(sql2, [shareprice*selectedshares,username]);

        //console.log(results2);
        
        return res.status(200).json(results2);

    } catch (err) {
        console.error("❌ Error getting BoughtShares:", err);
        if (err.code === 'ECONNRESET' || err.fatal) {
            await reconnectToDB();
            res.status(503).json({ success: false, retry: true });
        } else {
            res.status(500).json({ success: false });
        }
    }
}

async function SoldShares(req , res){
    const pool = await connection();
    try {
        const {username,companyname,shareprice,selectedshares} = req.body;

        const sql1 = "select * from UserInvestments where Username = ? and CompanyName = ?";
        const [results1] = await pool.query(sql1,[username,companyname]);

        const sql2 = "SELECT Username, CompanyName, SUM(sharesOwned) AS TotalsharesOwned FROM UserInvestments WHERE Username = ? AND CompanyName = ? GROUP BY Username, CompanyName";

        const [results2] = await pool.query(sql2, [username, companyname]);
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

        /*console.log("updatedShares",updatedShares);
        console.log("LastIndex",LastIndex);
        console.log("IndexArray",IndexArray);
        console.log("TotalsharesOwned",TotalsharesOwned);*/
        for (const row of IndexArray) {
            if(row !== LastIndex){
                const sql3 = "delete from UserInvestments where `index` = ?";
                const [results3] = await pool.query(sql3,[row]);
            }   
        }
        
        if(updatedShares === 0){
            const sql4 = "delete from UserInvestments where `index` = ?";
            const [results4] = await pool.query(sql4,[LastIndex]);
        }else{
            const sql5 = "update UserInvestments set sharesOwned = ? where `index` = ?";
            const [results5] = await pool.query(sql5,[updatedShares,LastIndex]);
        }

        const sql6 = "update Balances set Balance = Balance + ? where Username = ?";
        await pool.query(sql6, [shareprice*selectedshares,username]);
        
        return res.status(200).json({message: "done sold"});

    } catch (err) {
        console.error("❌ Error getting SoldShares:", err);
        if (err.code === 'ECONNRESET' || err.fatal) {
            await reconnectToDB();
            res.status(503).json({ success: false, retry: true });
        } else {
            res.status(500).json({ success: false });
        }
    }
}



async function getAllRealEstatesNotBought(req , res){
    const pool = await connection();
    try {
        const {username} = req.body;
        const sql = "select * from RealEstateMain where idx not in (select idx from UserRealEstate where username = ?)";
        
        const [results] = await pool.query((sql),[username]);
        //console.log(results);

        
        return res.status(200).json(results);

    } catch (err) {
        console.error("❌ Error getting getAllRealEstateNotBought:", err);
        if (err.code === 'ECONNRESET' || err.fatal) {
            await reconnectToDB();
            res.status(503).json({ success: false, retry: true });
        } else {
            res.status(500).json({ success: false });
        }
    }
}

async function getAllRealEstatesBought(req , res){
    const pool = await connection();
    try {
        const {username} = req.body;
        const sql = "select * from RealEstateMain where idx in (select idx from UserRealEstate where username = ?)";
        
        const [results] = await pool.query((sql),[username]);
        //console.log(results);

        
        return res.status(200).json(results);

    } catch (err) {
        console.error("❌ Error getting getAllRealEstatesBought:", err);
        if (err.code === 'ECONNRESET' || err.fatal) {
            await reconnectToDB();
            res.status(503).json({ success: false, retry: true });
        } else {
            res.status(500).json({ success: false });
        }
    }
}

async function buyProperty(req , res){
    const pool = await connection();
    try {
        const {username,idx} = req.body;
        const sql = "insert into UserRealEstate (username,idx) values (?,?)";
        const sql2 = "update Balances set Balance = Balance-(select price from RealEstateMain where idx = ?) where Username = ?";
        
        const [results] = await pool.query((sql),[username,idx]);
        await pool.query((sql2),[idx,username]);

        //console.log(results);

        
        return res.status(200).json(results);

    } catch (err) {
        console.error("❌ Error getting buyProperty:", err);
        if (err.code === 'ECONNRESET' || err.fatal) {
            await reconnectToDB();
            res.status(503).json({ success: false, retry: true });
        } else {
            res.status(500).json({ success: false });
        }
    }
}

async function sellProperty(req , res){
    const pool = await connection();
    try {
        const {username,idx} = req.body;
        const sql = "delete from UserRealEstate where (username,idx) = (?,?)";
        const sql2 = "update Balances set Balance = Balance+(select price from RealEstateMain where idx = ?) where Username = ?";
        
        const [results] = await pool.query((sql),[username,idx]);
        await pool.query((sql2),[idx,username]);

        //console.log(results);
        
        return res.status(200).json(results);

    } catch (err) {
        console.error("❌ Error getting sellProperty:", err);
        if (err.code === 'ECONNRESET' || err.fatal) {
            await reconnectToDB();
            res.status(503).json({ success: false, retry: true });
        } else {
            res.status(500).json({ success: false });
        }
    }
}

async function getCountofPropBought(req , res){
    const pool = await connection();
    try {
        const {username} = req.body;
        const sql = "select count(*) as CountProp from UserRealEstate where username = ?";
        
        const [results] = await pool.query(sql,[username]);
        //console.log(results);

        
        return res.status(200).json(results);

    } catch (err) {
        console.error("❌ Error getting getCountOfPropBought:", err);
        if (err.code === 'ECONNRESET' || err.fatal) {
            await reconnectToDB();
            res.status(503).json({ success: false, retry: true });
        } else {
            res.status(500).json({ success: false });
        }
    }
}

async function getTotalIncomePerHourUser(req , res){
    const pool = await connection();
    try {
        const { username } = req.body;
        const sql = "select sum(incPerHr) as TotInc from RealEstateMain where idx in (select idx from UserRealEstate where Username = ?)";
        const [results] = await pool.query(sql, [username]);
        //console.log(req.body);
        //console.log("inc per hour",results);
        
        return res.status(200).json(results);

    } catch (err) {
        console.error("❌ Error getting getTotalIncomePerHrUser:", err);
        if (err.code === 'ECONNRESET' || err.fatal) {
            await reconnectToDB();
            res.status(503).json({ success: false, retry: true });
        } else {
            res.status(500).json({ success: false });
        }
    }
}

async function TotalBoughtPrice(req , res){
    const pool = await connection();
    try {
        const { username } = req.body;
        const sql = "select sum(Pro) as TotalBought from (select buyPrice * sharesOwned as Pro from UserInvestments where Username = ?) as t";
        const [results] = await pool.query(sql, [username]);
        //console.log(req.body);
        //console.log("Total Bought Price",results);
        
        return res.status(200).json(results);

    } catch (err) {
        console.error("❌ Error getting TotalBoughtPrice:", err);
        if (err.code === 'ECONNRESET' || err.fatal) {
            await reconnectToDB();
            res.status(503).json({ success: false, retry: true });
        } else {
            res.status(500).json({ success: false });
        }
    }
}




module.exports = { Stocks, CompaniesWithStocks, UserInvestments, BoughtShares, SoldShares, getAllRealEstatesNotBought, getAllRealEstatesBought, buyProperty, sellProperty,getTotalIncomePerHourUser,getCountofPropBought,TotalBoughtPrice };


//https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=summaryDetail,defaultKeyStatistics`;