require("dotenv").config();
const express = require("express");
const app = express();
const mysql = require("mysql2");

// const pool = require("./db");

// pool.getConnection((err, connection) => {
//   if (err) {
//     console.error("❌ Database connection failed:", err.message);
//     return;
//   }
//   console.log("✅ Connected to MySQL database!");
//   connection.release();
// });

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "07Adi@2005thya",
  database: "db",
  port: 3306,
});

connection.connect((err) => {
  if (err) {
    console.error("❌ MySQL direct connection failed:", err.message);
    return;
  }
  console.log("✅ MySQL direct connection successful!");
});

const userrouter = require('./routes/users');
const ITbusinessrouter = require('./routes/ITbusiness');
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/user',userrouter);
app.use('/ITbusiness',ITbusinessrouter);

app.listen(8008,  ()=>{
    console.log('server started');
});