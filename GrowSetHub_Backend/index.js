require("dotenv").config();
const express = require("express");
const app = express();
const pool = require("./db");

pool.getConnection((err, connection) => {
    if (err) {
      console.error("❌ Database connection failed:", err.message);
      return;
    }
    console.log("✅ Connected to MySQL database!");
    connection.release();
  });

const mysql = require("mysql2");
const userrouter = require('./routes/users');
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/user',userrouter);

app.listen(8008,  ()=>{
    console.log('server started');
});