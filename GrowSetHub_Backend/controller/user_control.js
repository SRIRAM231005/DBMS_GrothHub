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

// User Signup
const userSignup = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required!" });
  }

  const sql = "INSERT INTO Users (Username, Password) VALUES (?, ?)";
  connection.query(sql, [username, password], (err,result) => {
    if (err) {
      console.error("❌ Signup error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    const sql1 = "INSERT INTO Balances (Username, Level, Total, Balance) VALUES(?,?,?,?)";
    connection.query(sql1, [username, 0, 10000, 10000], (err,result)=>{
      if (err) {
        console.error("❌ Signup error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      const sql2 = "INSERT INTO Statistics (Username, NoOfBusiness, Real_estate) VALUES(?,?,?)";
      connection.query(sql2, [username, 0, 0], (err,result)=>{
        if (err) {
          console.error("❌ Signup error:", err);
          return res.status(500).json({ error: "Database error" });
        }

        res.status(201).json({ message: "User registered successfully!" });
      });
    });
  });
};

// User Uniqueness Check
const userUniquenessCheck = (req, res) => {
  const { username } = req.body;
  const sql = "SELECT * FROM Users WHERE Username = ?";
  connection.query(sql, [username], (err, results) => {
    if (err) {
      console.error("❌ Error checking uniqueness:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length > 0) {
      return res.status(400).json({ error: "Username already taken!" });
    }
    res.status(200).json({ message: "Username available!" });
  });
};

// User Login
const userLogin = (req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT * FROM Users WHERE Username = ? AND Password = ?";
  connection.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error("❌ Login error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    res.status(200).json({ message: "Login successful!" });
  });
};

module.exports = { userSignup, userUniquenessCheck, userLogin };
