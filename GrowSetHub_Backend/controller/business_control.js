require("dotenv").config();
const mysql = require("mysql2");
const { connection, reconnectToDB } = require('../db');


const pool = connection();

async function InsertUserbusiness(req, res){
    const pool = await connection();
    //await connection.beginTransaction();
    try {
        const { username, business, businessname, amount } = req.body;
        const sql = "INSERT INTO UserBusiness (Username, Business, Businessname) VALUES (?, ?, ?)";
        await pool.query(sql, [username, business, businessname]);
        
        const decreaseBalanceSql = "UPDATE Balances SET Balance = Balance - ? WHERE Username = ?";
        await pool.query(decreaseBalanceSql, [amount, username]);

        const increaseBusinessBalanceSql = "UPDATE Balances SET Business = Business + ? WHERE Username = ?";
        await pool.query(increaseBusinessBalanceSql, [amount, username]);

        const increaseBusinessCountSql = "UPDATE Statistics SET NoOfBusiness = NoOfBusiness + 1 WHERE Username = ?";
        await pool.query(increaseBusinessCountSql, [username]);

        //await connection.commit();

        res.status(200).json({ message: "Business Bought!" });
    } catch (err) {
        //await connection.rollback();
        console.error("❌ Error getting InsertUserbusiness:", err);
        if (err.code === 'ECONNRESET' || err.fatal) {
            await reconnectToDB();
            res.status(503).json({ success: false, retry: true });
        } else {
            res.status(500).json({ success: false });
        }
    }
}

async function SelectUserbusiness(req, res) {
    const pool = await connection();
    try {
        const { username } = req.body;
        const sql = "SELECT * FROM UserBusiness WHERE Username = ?";
        
        const [results] = await pool.query(sql, [username]);

        if (results.length > 0) {
            return res.status(200).json(results);
        }
    } catch (err) {
        console.error("❌ Error getting SelectUserbusiness:", err);
        if (err.code === 'ECONNRESET' || err.fatal) {
            await reconnectToDB();
            res.status(503).json({ success: false, retry: true });
        } else {
            res.status(500).json({ success: false });
        }
    }
}

module.exports = { InsertUserbusiness, SelectUserbusiness };