const mysql = require("mysql2");

// Connect to the database
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "07Adi@2005thya",
  database: "db",
  port: 3306,
});

async function ITbusiness(req, res) {
    try {
        const { username } = req.body;
        const sql = "SELECT * FROM ITbusiness WHERE Username = ?";
        
        const [results] = await connection.promise().query(sql, [username]);

        if (results.length > 0) {
            return res.status(200).json(results);
        }
    } catch (err) {
        console.error("❌ Error getting data1:", err);
        return res.status(500).json({ error: "Database error1" });
    }
}

async function ITUserProjects(req, res) {
    try {
        const { username } = req.body;
        const sql = "SELECT * FROM ITUserProjects WHERE Username = ?";
        
        const [results] = await connection.promise().query(sql, [username]);

        if (results.length > 0) {
            return res.status(200).json(results);
        }else{
            return res.status(404).json({ error: "No projects found" });
        }
    } catch (err) {
        console.error("❌ Error getting data1:", err);
        return res.status(500).json({ error: "Database error1" });
    }
}

async function ITUserEmployees(req, res) {
    try {
        const { username } = req.body;
        const sql = "SELECT * FROM ITEmployees WHERE Username = ?";
        
        const [results] = await connection.promise().query(sql, [username]);

        if (results.length > 0) {
            return res.status(200).json(results);
        }else{
            return res.status(404).json({ error: "No employees found" });
        }
    } catch (err) {
        console.error("❌ Error getting data1:", err);
        return res.status(500).json({ error: "Database error1" });
    }
}

async function ITProjectsEmployees(req, res){
    try {
        const sql = "SELECT * FROM ITProjects; SELECT * FROM ITEmployees";
        const [results] = await connection.promise().query(sql);

        return res.status(200).json({
            Projects: results[0], 
            Employees: results[1]
        });

    } catch (err) {
        console.error("❌ Error getting data:", err);
        return res.status(500).json({ error: "Database error" });
    }
}

module.exports = { ITbusiness, ITUserProjects, ITUserEmployees, ITProjectsEmployees };

