const mysql = require("mysql2");

// Connect to the database
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "07Adi@2005thya",
  database: "db",
  port: 3306,
});

async function InsertUserbusiness(req, res){
    //await connection.beginTransaction();
    try {
        const { username, business, businessname, amount } = req.body;
        const sql = "INSERT INTO Userbusiness (Username, Business, Businessname) VALUES (?, ?, ?)";
        await connection.promise().query(sql, [username, business, businessname]);
        
        const decreaseBalanceSql = "UPDATE Balances SET Balance = Balance - ? WHERE Username = ?";
        await connection.promise().query(decreaseBalanceSql, [amount, username]);

        const increaseBusinessBalanceSql = "UPDATE Balances SET Business = Business + ? WHERE Username = ?";
        await connection.promise().query(increaseBusinessBalanceSql, [amount, username]);

        const increaseBusinessCountSql = "UPDATE Statistics SET NoOfBusiness = NoOfBusiness + 1 WHERE Username = ?";
        await connection.promise().query(increaseBusinessCountSql, [username]);

        //await connection.commit();

        res.status(200).json({ message: "Business Bought!" });
    } catch (err) {
        //await connection.rollback();
        console.error("❌ Error getting data1:", err);
        return res.status(500).json({ error: "Database error1" });
    }
}

async function SelectUserbusiness(req, res) {
    try {
        const { username } = req.body;
        const sql = "SELECT * FROM Userbusiness WHERE Username = ?";
        
        const [results] = await connection.promise().query(sql, [username]);

        if (results.length > 0) {
            return res.status(200).json(results);
        }
    } catch (err) {
        console.error("❌ Error getting data1:", err);
        return res.status(500).json({ error: "Database error1" });
    }
}

module.exports = { InsertUserbusiness, SelectUserbusiness };