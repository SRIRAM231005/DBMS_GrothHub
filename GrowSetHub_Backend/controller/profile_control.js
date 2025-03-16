const mysql = require("mysql2");

// Connect to the database
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "07Adi@2005thya",
  database: "db",
  port: 3306,
});

async function Balance(req , res){
    try {
        const { username } = req.body;
        const sql = "SELECT * FROM Balances WHERE Username = ?";
        
        const [results] = await connection.promise().query(sql, [username]);

        return res.status(200).json(results);

    } catch (err) {
        console.error("❌ Error getting data1:", err);
        return res.status(500).json({ error: "Database error1" });
    }
}

async function Statistics(req , res){
    try {
        const { username } = req.body;
        const sql = "UPDATE Statistics SET NoOfBusiness = (SELECT COUNT(Businessname) AS business_count FROM UserBusiness WHERE Username = ? ) WHERE Username = ?";
        /*const sql1 = "SELECT COUNT(Businessname) AS business_count FROM UserBusiness WHERE Username = ? "*/
        const sql1 = "UPDATE Statistics SET E_business = (SELECT Revenue FROM ItBusiness WHERE Username = ?) WHERE Username = ?";
        const sql2 = "SELECT * FROM Statistics WHERE Username = ?";
        
        await connection.promise().query(sql, [username,username]);
        await connection.promise().query(sql1, [username,username]);
        const [results] = await connection.promise().query(sql2, [username]);

        return res.status(200).json(results[0]);

    } catch (err) {
        console.error("❌ Error getting data1:", err);
        return res.status(500).json({ error: "Database error1" });
    }
}

module.exports = { Balance, Statistics };