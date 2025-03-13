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
        const sql = "SELECT * FROM ITUseremployees WHERE Username = ?";
        
        const [results] = await connection.promise().query(sql, [username]);
        console.log(results);
        console.log(username);
        console.log(req.body);
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

// async function ITProjectsEmployees(req, res){
//     try {
//         const sql = "SELECT * FROM ITProjects; SELECT * FROM ITEmployees";
//         const [results] = await connection.promise().query(sql);

//         return res.status(200).json({
//             Projects: results[0], 
//             Employees: results[1]
//         });

//     } catch (err) {
//         console.error("❌ Error getting data:", err);
//         return res.status(500).json({ error: "Database error" });
//     }
// }

async function ITProjectsEmployees(req, res) {
    try {
        const { username } = req.body;
        const [projects] = await connection.promise().execute("SELECT * FROM ITProjects");
        const sqlemployees = "SELECT e.* FROM ITEmployees e INNER JOIN ITUserEmployees ue ON e.EmployeeName = ue.EmployeeName WHERE ue.Username = ?";
        //SELECT e.* FROM ITEmployees e LEFT JOIN ITUserEmployees ue ON e.EmployeeName = ue.EmployeeName AND ue.Username = 'user' WHERE ue.EmployeeName IS NULL;

        const [employees] = await connection.promise().query(sqlemployees, [username]);

        return res.status(200).json({
            Projects: projects,
            Employees: employees
        });

    } catch (err) {
        console.error("❌ Error getting data:", err);
        return res.status(500).json({ error: "Database error" });
    }
}

async function ITEmployeesFire(req , res){
    try {
        const { username,employeename } = req.body;
        const sql = "DELETE FROM ITUseremployees WHERE Username = ? AND EmployeeName = ?";
        
        const [results] = await connection.promise().query(sql, [username,employeename]);
        console.log(req.body);
        
        return res.status(200).json(results);

    } catch (err) {
        console.error("❌ Error getting data1:", err);
        return res.status(500).json({ error: "Database error1" });
    }
}


module.exports = { ITbusiness, ITUserProjects, ITUserEmployees, ITProjectsEmployees, ITEmployeesFire };

