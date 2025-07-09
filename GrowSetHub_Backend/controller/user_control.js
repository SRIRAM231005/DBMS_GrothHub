require("dotenv").config();
const mysql = require("mysql2");
const { connection, reconnectToDB } = require('../db');


const pool = connection(); 

const userSignup = async (req, res) => {
    const pool = await connection();
    try{
        const { username, password } = req.body;
        if (!username || !password) {
          return res.status(400).json({ error: "Username and password are required!" });
        }

        const sql = "INSERT INTO Users (Username, Password) VALUES (?, ?)";
        const sql1 = "INSERT INTO Balances (Username, Level, Total, Balance) VALUES(?,?,?,?)";
        const sql2 = "INSERT INTO Statistics (Username, NoOfBusiness, Real_estate) VALUES(?,?,?)";

        await pool.query(sql, [username, password]);
        await pool.query(sql1, [username, 0, 10000, 10000]);
        await pool.query(sql2, [username, 0, 0]);

        res.status(201).json({ message: "User registered successfully!" });
    }catch(error){
        console.log(error);
    }
  /*pool.query(sql, [username, password], (err,result) => {
    if (err) {
      console.error("Signup error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    const sql1 = "INSERT INTO Balances (Username, Level, Total, Balance) VALUES(?,?,?,?)";
    pool.query(sql1, [username, 0, 10000, 10000], (err,result)=>{
      if (err) {
        console.error("Signup error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      const sql2 = "INSERT INTO Statistics (Username, NoOfBusiness, Real_estate) VALUES(?,?,?)";
      pool.query(sql2, [username, 0, 0], (err,result)=>{
        if (err) {
          console.error("Signup error:", err);
          return res.status(500).json({ error: "Database error" });
        }

        res.status(201).json({ message: "User registered successfully!" });
      });
    });
  });*/
};

// User Uniqueness Check
const userUniquenessCheck = async (req, res) => {
    const pool = await connection();
    try{
        const { username } = req.body;
        const sql = "SELECT * FROM Users WHERE Username = ?";
        const [rows] = await pool.query(sql, [username]);

        if (rows.length > 0) {
          return res.status(400).json({ error: "Username already taken!" });
        }

        res.status(200).json({ message: "Username available!" });
    }catch(error){
        console.log(error);
    }
    /*const { username } = req.body;
    const sql = "SELECT * FROM Users WHERE Username = ?";
    pool.query(sql, [username], (err, results) => {
      if (err) {
        console.error("Error checking uniqueness:", err);
        return res.status(500).json({ error: "Database error" });
      }
      if (results.length > 0) {
        return res.status(400).json({ error: "Username already taken!" });
      }
      res.status(200).json({ message: "Username available!" });
    });*/
};

// User Login
const userLogin = async (req, res) => {
    const pool = await connection();
    try{
        const { username, password } = req.body;
        const sql = "SELECT * FROM Users WHERE Username = ? AND Password = ?";
        const [rows] = await pool.query(sql, [username, password]);

        if (rows.length === 0) {
          return res.status(401).json({ error: "Invalid username or password" });
        }

        res.status(200).json({ message: "Login successful!" });
    }catch(error){
        console.log(error);
    }
    /*const { username, password } = req.body;
    const sql = "SELECT * FROM Users WHERE Username = ? AND Password = ?";
    pool.query(sql, [username, password], (err, results) => {
      if (err) {
        console.error("Login error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid username or password" });
      }
      res.status(200).json({ message: "Login successful!" });
    });*/
};

module.exports = { userSignup, userUniquenessCheck, userLogin };
