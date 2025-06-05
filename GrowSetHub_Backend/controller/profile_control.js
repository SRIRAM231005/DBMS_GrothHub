require("dotenv").config();
const mysql = require("mysql2");
const { connection, reconnectToDB } = require('../db');

// Connect to the database
/*const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "07Adi@2005thya",
  database: "db",
  port: 3306,
});

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306,
});*/

const pool = connection(); 

async function Balance(req , res){
    const pool = await connection();
    try {
        const { username } = req.body;
        //console.log(username);
        const sql = "SELECT * FROM Balances WHERE Username = ?";
        
        const [results] = await pool.query(sql, [username]);
        //console.log(results);
        return res.status(200).json(results);

    } catch (err) {
        console.error("❌ Error getting Balance:", err);
        if (err.code === 'ECONNRESET' || err.fatal) {
            await reconnectToDB();
            res.status(503).json({ success: false, retry: true });
        } else {
            res.status(500).json({ success: false });
        }
    }
}

async function Statistics(req , res){
    const pool = await connection();
    try {
        const { username } = req.body;
        const sql = "UPDATE Statistics SET NoOfBusiness = (SELECT COUNT(Businessname) AS business_count FROM UserBusiness WHERE Username = ? ) WHERE Username = ?";
        /*const sql1 = "SELECT COUNT(Businessname) AS business_count FROM UserBusiness WHERE Username = ? "*/
        /*const sql1 = "UPDATE Statistics SET E_business = (SELECT Sum(Revenue) FROM ItBusiness WHERE Username = ?) WHERE Username = ?";*/
        const sql3 = "update Statistics set Real_estate = (select count(*) from UserRealEstate where Username = ?) where Username = ?";
        // const sql4 = "update statistics set E_trading = (select ) where Username = ?";
        const sql2 = "SELECT * FROM Statistics WHERE Username = ?";
        
        await pool.query(sql, [username,username]);
        await pool.query(sql3, [username,username]);
        //await connection.promise().query(sql1, [username,username]);
        const [results] = await pool.query(sql2, [username]);

        return res.status(200).json(results[0]);

    } catch (err) {
        console.error("❌ Error getting data1:", err);
        if (err.code === 'ECONNRESET' || err.fatal) {
            await reconnectToDB();
            res.status(503).json({ success: false, retry: true });
        } else {
            res.status(500).json({ success: false });
        }
    }
}

async function LeaderBoardData(req , res){
    const pool = await connection();
    try {
        const { username } = req.body;

        const sql1_top10 = `
        SELECT Username AS name, Total AS value 
        FROM Balances 
        ORDER BY value DESC 
        LIMIT 10
        `;
        const [top10Results] = await pool.query(sql1_top10);
        const sql1_user = `
        SELECT Username AS name, Total AS value 
        FROM Balances 
        WHERE Username = ?
        `;
        const [userResult] = await pool.query(sql1_user, [username]);
        const results1 = [...top10Results, ...userResult];


        const sql2_top10 = `
        SELECT Username AS name, SUM(sharesOwned) AS value 
        FROM UserInvestments 
        GROUP BY Username 
        ORDER BY value DESC 
        LIMIT 10
        `;
        const [top10Investments] = await pool.query(sql2_top10);
        const sql2_user = `
        SELECT Username AS name, SUM(sharesOwned) AS value 
        FROM UserInvestments 
        WHERE Username = ?
        GROUP BY Username
        `;
        const [userInvestment] = await pool.query(sql2_user, [username]);
        const results2 = [...top10Investments, ...userInvestment];


        const sql3_top10 = `
        SELECT Username AS name, COUNT(Businessname) AS value 
        FROM UserBusiness 
        GROUP BY Username 
        ORDER BY value DESC 
        LIMIT 10
        `;
        const [top10Business] = await pool.query(sql3_top10);
        const sql3_user = `
        SELECT Username AS name, COUNT(Businessname) AS value 
        FROM UserBusiness 
        WHERE Username = ?
        GROUP BY Username
        `;
        const [userBusiness] = await pool.query(sql3_user, [username]);
        const results3 = [...top10Business, ...userBusiness];


        const sql4_top10 = `
        SELECT Username AS name, COUNT(idx) AS value 
        FROM UserRealEstate 
        GROUP BY Username 
        ORDER BY value DESC 
        LIMIT 10
        `;
        const [top10RealEstate] = await pool.query(sql4_top10);
        const sql4_user = `
        SELECT Username AS name, COUNT(idx) AS value 
        FROM UserRealEstate 
        WHERE Username = ?
        GROUP BY Username
        `;
        const [userRealEstate] = await pool.query(sql4_user, [username]);
        const results4 = [...top10RealEstate, ...userRealEstate];


        return res.status(200).json({
            balance: results1,
            shares: results2,
            realestate: results4,
            business: results3
        });

    } catch (err) {
        console.error("❌ Error getting LeaderBoardData:", err);
        if (err.code === 'ECONNRESET' || err.fatal) {
            await reconnectToDB();
            res.status(503).json({ success: false, retry: true });
        } else {
            res.status(500).json({ success: false });
        }
    }
}

async function PropValUpdate(req , res){
    const pool = await connection();
    try {
        const { username,NetPropValue } = req.body;
        const sql = "update Balances set Real_Estate = ? where Username = ?";
        
        const [results] = await pool.query(sql, [NetPropValue,username]);
        //console.log(results);
        return res.status(200).json(results);

    } catch (err) {
        console.error("❌ Error getting PropValUpdate:", err);
        if (err.code === 'ECONNRESET' || err.fatal) {
            await reconnectToDB();
            res.status(503).json({ success: false, retry: true });
        } else {
            res.status(500).json({ success: false });
        }
    }
}

async function StockBalValUpdate(req , res){
    const pool = await connection();
    try {
        const { username,StockBalVal } = req.body;
        const sql = "update Balances set Stocks = ? where Username = ?";
        
        const [results] = await pool.query(sql, [StockBalVal,username]);
        //console.log(results);
        return res.status(200).json(results);

    } catch (err) {
        console.error("❌ Error getting StockValUpdate:", err);
        if (err.code === 'ECONNRESET' || err.fatal) {
            await reconnectToDB();
            res.status(503).json({ success: false, retry: true });
        } else {
            res.status(500).json({ success: false });
        }
    }
}

module.exports = { Balance, Statistics , LeaderBoardData, PropValUpdate,StockBalValUpdate };