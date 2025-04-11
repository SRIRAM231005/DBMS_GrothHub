const mysql = require("mysql2");

// Connect to the database
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "07Adi@2005thya",
  database: "db",
  port: 3306,
});

async function bankMainBusiness(req, res) {
    try {
        const { username } = req.body;
        const sql = "SELECT * FROM BankBusiness WHERE Username = ?";
        
        const [results] = await connection.promise().query(sql, [username]);

        if (results.length > 0) {
            return res.status(200).json(results);
        }
    } catch (err) {
        console.error("❌ Error getting data1:", err);
        return res.status(500).json({ error: "Database error1" });
    }
}

async function InsertBankBusiness(req , res){
    try {
        const { username, businessname } = req.body;
        const sql = "INSERT INTO BankBusiness (Username, BusinessName) VALUES (?, ?)";
        // const sql1 = "UPDATE ItBusiness SET Wages = Wages+(SELECT Salary FROM ItEmployees WHERE Employeename = ?) WHERE Username = ?";

        const [results] = await connection.promise().query(sql, [username,businessname]);
        // await connection.promise().query(sql1, [businessname,username])
        console.log(req.body);
        
        return res.status(200).json(results);

    } catch (err) {
        console.error("❌ Error getting data2:", err);
    }
}

async function SettingInterestsRates(req , res){
    try {
        const { username, businessname, creditInterest, debitInterest } = req.body;
        let marketingInvestment = 50;

        const sql1 = "UPDATE BankBusiness SET CreditInt = ? and DebitInt = ? and IntSetTime = DATE_ADD(NOW(), INTERVAL 1 HOUR) where Username= ? and BankName = ?";
        const [results1] = await connection.promise().query(sql1, [creditInterest,debitInterest,username,businessname]);
        
        // await connection.promise().query(sql1, [businessname,username])
        console.log(req.body);
        
        return res.status(200).json(results1);

    } catch (err) {
        console.error("❌ Error getting data2:", err);
    }
}

module.exports = { bankMainBusiness, InsertBankBusiness, SettingInterestsRates};
