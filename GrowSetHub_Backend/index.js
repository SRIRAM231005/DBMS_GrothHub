require("dotenv").config();
const express = require("express");
const app = express();
const pool = require("./db");
const mysql = require("mysql2");
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.listen(8008,  ()=>{
    console.log('server started');
});