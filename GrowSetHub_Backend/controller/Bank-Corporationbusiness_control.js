require("dotenv").config();
const mysql = require("mysql2");
const { connection, reconnectToDB } = require('../db');


async function bankMainBusiness(req, res) {
    const pool = await connection();
    try {
        const { username } = req.body;
        const sql = "SELECT * FROM BankBusiness WHERE Username = ?";
        
        const [results] = await pool.query(sql, [username]);

        if (results.length > 0) {
            return res.status(200).json(results);
        }
    } catch (err) {
        console.error("❌ Error getting bankManiBusiness:", err);
        if (err.code === 'ECONNRESET' || err.fatal) {
            await reconnectToDB();
            res.status(503).json({ success: false, retry: true });
        } else {
            res.status(500).json({ success: false });
        }
    }
}

async function InsertBankBusiness(req , res){
    const pool = await connection();
    try {
        const { username, businessname } = req.body;
        const sql = "INSERT INTO BankBusiness (Username, BusinessName) VALUES (?, ?)";
        // const sql1 = "UPDATE ItBusiness SET Wages = Wages+(SELECT Salary FROM ItEmployees WHERE Employeename = ?) WHERE Username = ?";

        const [results] = await pool.query(sql, [username,businessname]);
        // await pool.query(sql1, [businessname,username])
        //console.log(req.body);
        
        return res.status(200).json(results);

    } catch (err) {
        console.error("❌ Error getting InsertBankBusiness:", err);
        if (err.code === 'ECONNRESET' || err.fatal) {
            await reconnectToDB();
            res.status(503).json({ success: false, retry: true });
        } else {
            res.status(500).json({ success: false });
        }
    }
}

async function SettingInterestsRates(req , res){
    const pool = await connection();
    try {
        const { username, businessname, creditInterest, debitInterest } = req.body;
        let marketingInvestment = 50;

        const sql1 = "UPDATE BankBusiness SET CreditInt = ?, DebitInt = ?, IntSetTime = DATE_ADD(NOW(), INTERVAL 1 MINUTE) where Username= ? and BusinessName = ?";
        const [results1] = await pool.query(sql1, [creditInterest,debitInterest,username,businessname]);
        
        // await pool.query(sql1, [businessname,username])
        //console.log(req.body);
        
        return res.status(200).json(results1);

    } catch (err) {
        console.error("❌ Error getting SettingInterestsRates:", err);
        if (err.code === 'ECONNRESET' || err.fatal) {
            await reconnectToDB();
            res.status(503).json({ success: false, retry: true });
        } else {
            res.status(500).json({ success: false });
        }
    }
}

async function DisplayBankDetails(req , res){
    const pool = await connection();
    try {
        const { username, businessname } = req.body;

        const sql1 = "SELECT * FROM BankBusiness where Username = ? and BusinessName = ?";
        const [results1] = await pool.query(sql1, [username,businessname]);
        
        // await pool.query(sql1, [businessname,username])
        //console.log(req.body);
        
        return res.status(200).json(results1);

    } catch (err) {
        console.error("❌ Error getting DisplayBankDetails:", err);
        if (err.code === 'ECONNRESET' || err.fatal) {
            await reconnectToDB();
            res.status(503).json({ success: false, retry: true });
        } else {
            res.status(500).json({ success: false });
        }
    }
}

module.exports = { bankMainBusiness, InsertBankBusiness, SettingInterestsRates, DisplayBankDetails};
