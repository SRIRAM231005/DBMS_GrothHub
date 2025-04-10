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
        console.log(username);
        const sql = "SELECT * FROM Balances WHERE Username = ?";
        
        const [results] = await connection.promise().query(sql, [username]);
        console.log(results);
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
        const sql1 = "UPDATE Statistics SET E_business = (SELECT Sum(Revenue) FROM ItBusiness WHERE Username = ?) WHERE Username = ?";
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

async function LeaderBoardData(req , res){
    try {
        const { username } = req.body;

        const sql1_top10 = `
        SELECT Username AS name, Total AS value 
        FROM Balances 
        ORDER BY value DESC 
        LIMIT 10
        `;
        const [top10Results] = await connection.promise().query(sql1_top10);
        const sql1_user = `
        SELECT Username AS name, Total AS value 
        FROM Balances 
        WHERE Username = ?
        `;
        const [userResult] = await connection.promise().query(sql1_user, [username]);
        const results1 = [...top10Results, ...userResult];


        const sql2_top10 = `
        SELECT Username AS name, SUM(sharesOwned) AS value 
        FROM UserInvestments 
        GROUP BY Username 
        ORDER BY value DESC 
        LIMIT 10
        `;
        const [top10Investments] = await connection.promise().query(sql2_top10);
        const sql2_user = `
        SELECT Username AS name, SUM(sharesOwned) AS value 
        FROM UserInvestments 
        WHERE Username = ?
        GROUP BY Username
        `;
        const [userInvestment] = await connection.promise().query(sql2_user, [username]);
        const results2 = [...top10Investments, ...userInvestment];


        const sql3_top10 = `
        SELECT Username AS name, COUNT(Businessname) AS value 
        FROM UserBusiness 
        GROUP BY Username 
        ORDER BY value DESC 
        LIMIT 10
        `;
        const [top10Business] = await connection.promise().query(sql3_top10);
        const sql3_user = `
        SELECT Username AS name, COUNT(Businessname) AS value 
        FROM UserBusiness 
        WHERE Username = ?
        GROUP BY Username
        `;
        const [userBusiness] = await connection.promise().query(sql3_user, [username]);
        const results3 = [...top10Business, ...userBusiness];


        const sql4_top10 = `
        SELECT Username AS name, COUNT(idx) AS value 
        FROM UserRealEstate 
        GROUP BY Username 
        ORDER BY value DESC 
        LIMIT 10
        `;
        const [top10RealEstate] = await connection.promise().query(sql4_top10);
        const sql4_user = `
        SELECT Username AS name, COUNT(idx) AS value 
        FROM UserRealEstate 
        WHERE Username = ?
        GROUP BY Username
        `;
        const [userRealEstate] = await connection.promise().query(sql4_user, [username]);
        const results4 = [...top10RealEstate, ...userRealEstate];


        return res.status(200).json({
            balance: results1,
            shares: results2,
            realEstate: results4,
            business: results3
        });

    } catch (err) {
        console.error("❌ Error getting data2:", err);
        return res.status(500).json({ error: "Database error2" });
    }
}

module.exports = { Balance, Statistics , LeaderBoardData };