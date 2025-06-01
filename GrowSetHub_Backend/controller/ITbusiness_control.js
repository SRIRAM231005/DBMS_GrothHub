require("dotenv").config();
const mysql = require("mysql2");

// Connect to the database
/*const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "07Adi@2005thya",
  database: "db",
  port: 3306,
});*/

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
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
        const { username,businessName } = req.body;
        const sql = "SELECT * FROM ITUserProjects WHERE Username = ? and BusinessName = ? ";
        
        const [results] = await connection.promise().query(sql, [username,businessName]);

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
        const { username,businessName } = req.body;
        const sql = "SELECT * FROM ITUserEmployees WHERE Username = ? and BusinessName = ?";
        
        const [results] = await connection.promise().query(sql, [username,businessName]);
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
        const { username, businessname } = req.body;
        const [projects] = await connection.promise().execute("SELECT * FROM ITProjects");
        const sqlemployees = "SELECT e.* FROM ITEmployees e INNER JOIN ITUserEmployees ue ON e.EmployeeName = ue.EmployeeName WHERE ue.Username = ? and ue.BusinessName = ?";
        //SELECT e.* FROM ITEmployees e LEFT JOIN ITUserEmployees ue ON e.EmployeeName = ue.EmployeeName AND ue.Username = 'user' WHERE ue.EmployeeName IS NULL;

        const [employees] = await connection.promise().query(sqlemployees, [username,businessname]);

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
        const { username,employeename,businessName } = req.body;
        const sql = "DELETE FROM ITUserEmployees WHERE Username = ? AND Employeename = ? and BusinessName = ?";
        const sql1 = "UPDATE ItBusiness SET Wages = Wages-(SELECT Salary FROM ItEmployees WHERE Employeename = ?) WHERE Username = ? and BusinessName = ?";
        
        const [results] = await connection.promise().query(sql, [username,employeename,businessName]);
        await connection.promise().query(sql1, [employeename,username,businessName])
        console.log(req.body);
        
        return res.status(200).json(results);

    } catch (err) {
        console.error("❌ Error getting data1:", err);
        return res.status(500).json({ error: "Database error1" });
    }
}

async function ITEmployeesHire(req , res){
    try {
        const { username, businessname,role } = req.body;
        const sql = "select * from ITEmployees where Employeename not in (select e.Employeename from ITEmployees e inner join ITUserEmployees ee using(Employeename) where Username = ? and BusinessName = ?) and Role = ?";
        
        const [results] = await connection.promise().query(sql, [username, businessname, role]);
        console.log(req.body);
        
        return res.status(200).json(results);

    } catch (err) {
        console.error("❌ Error getting data2:", err);
        return res.status(500).json({ error: "Database error1" });
    }
}

async function ITEmployeesAfterHire(req , res){
    try {
        const { username,businessName,employeename } = req.body;
        const sql = "INSERT INTO ITUserEmployees (Username, BusinessName,Employeename) VALUES (?, ?, ?)";
        const sql1 = "UPDATE ItBusiness SET Wages = Wages+(SELECT Salary FROM ItEmployees WHERE Employeename = ?) WHERE Username = ? and BusinessName = ?";

        const [results] = await connection.promise().query(sql, [username,businessName,employeename]);
        await connection.promise().query(sql1, [employeename,username,businessName])
        console.log(req.body);
        
        return res.status(200).json(results);
    } catch (err) {
        console.error("❌ Error getting data2:", err);
    }
}

async function showDevList(req, res){
    try{
        const { username,businessName,role } = req.body;
        const sql = "select Employeename, Salary, Skill from ItEmployees where Employeename in (select Employeename from ItUserEmployees where Username = ? and BusinessName = ?) and Role like CONCAT('%', ?, '%')";
        const [results] = await connection.promise().query(sql, [username,businessName,role]);
        // console.log("demo:",req.body);
        console.log("demo:",results);
        return res.status(200).json(results);
    }catch (err) {
        console.error("❌ Error getting data1:", err);
        return res.status(500).json({ error: "Database error1" });
    }
}

async function InsertITBusiness(req , res){
    try {
        const { username, businessname } = req.body;
        const sql = "INSERT INTO ITBusiness (Username, BusinessName) VALUES (?, ?)";
        // const sql1 = "UPDATE ItBusiness SET Wages = Wages+(SELECT Salary FROM ItEmployees WHERE Employeename = ?) WHERE Username = ?";

        const [results] = await connection.promise().query(sql, [username,businessname]);
        // await connection.promise().query(sql1, [businessname,username])
        console.log(req.body);
        
        return res.status(200).json(results);

    } catch (err) {
        console.error("❌ Error getting data2:", err);
    }
}

async function HireSelectedEmployees(req , res){
    try {
        const { username, businessname, employeename } = req.body;
        const sql = "INSERT INTO ITUserEmployees(Username, BusinessName,Employeename) VALUES (?, ?, ?)";
        // const sql1 = "UPDATE ItBusiness SET Wages = Wages+(SELECT Salary FROM ItEmployees WHERE Employeename = ?) WHERE Username = ?";

        const [results] = await connection.promise().query(sql, [username,businessname,employeename]);
        // await connection.promise().query(sql1, [businessname,username])
        console.log(req.body);
        
        return res.status(200).json(results);

    } catch (err) {
        console.error("❌ Error getting data2:", err);
    }
}

async function BusEmpPrjStart(req , res){
    try {
        const { username, businessname, empName, prjname } = req.body;
        
        const sql = "update ItUserEmployees set EmpStatusPrj = 1 where EmpStatusPrj = 0 and Username = ? and BusinessName = ? and Employeename = ?";
        const sql1 = "update ItUserEmployees set PrjName = ? where EmpStatusPrj = 1 and Username = ? and BusinessName = ? and Employeename = ?";
        
        const [results] = await connection.promise().query(sql,[username,businessname,empName]);
        await connection.promise().query(sql1,[prjname,username,businessname,empName]);
        
        console.log("verify",results);
        return res.status(200).json(results);

    } catch (err) {
        console.error("❌ Error getting data2:", err);
    }
}

async function PrjCompTimeAddition(req , res){
    try {
        const { username, businessname, prjname } = req.body;
        const sql = "insert into ItUserProjects (Username, BusinessName, Projectname, ProjectCompTime) values (?,?,?,now()+ interval 60 second)";
        
        const [results] = await connection.promise().query(sql,[username,businessname,prjname]);

        console.log("verify",results);
        return res.status(200).json(results);

    } catch (err) {
        console.error("❌ Error getting data2:", err);
    }
}


async function getPrjProgressCount(req , res){
    try {
        const { username, businessname } = req.body;
        const sql = "select count(*) as countPrj from ItUserProjects where Username = ? and BusinessName = ? and ProjectStatus = 0 group by BusinessName";
        const [results] = await connection.promise().query(sql, [username,businessname]);
        console.log(req.body);
        console.log("hola",results);
        
        return res.status(200).json(results);

    } catch (err) {
        console.error("❌ Error getting data2:", err);
    }
}

async function getPrjCompCount(req , res){
    try {
        const { username, businessname } = req.body;
        const sql = "select count(*) as countPrj from ItUserProjects where Username = ? and BusinessName = ? and ProjectStatus = 1 group by BusinessName";
        const [results] = await connection.promise().query(sql, [username,businessname]);
        console.log(req.body);
        console.log("hi",results);
        
        return res.status(200).json(results);

    } catch (err) {
        console.error("❌ Error getting data2:", err);
    }
}

async function getPrjComp(req , res){
    try {
        const { username, businessname } = req.body;
        const sql = "select * from ItUserProjects where Username = ? and BusinessName = ? and ProjectStatus = 1";
        const [results] = await connection.promise().query(sql, [username,businessname]);
        console.log(req.body);
        console.log("compPrj",results);
        
        return res.status(200).json(results);

    } catch (err) {
        console.error("❌ Error getting data2:", err);
    }
}

async function getPrjProgress(req , res){
    try {
        const { username, businessname } = req.body;
        const sql = "select * from ItUserProjects where Username = ? and BusinessName = ? and ProjectStatus = 0";
        const [results] = await connection.promise().query(sql, [username,businessname]);
        console.log(req.body);
        console.log("prgPrj",results);
        
        return res.status(200).json(results);

    } catch (err) {
        console.error("❌ Error getting data2:", err);
    }
}

async function changeStatusCompProj(req , res){
    try {
        const { username,businessname,projectname } = req.body;
        const sql = "delete from ITUserProjects where Username = ? and BusinessName = ? and Projectname = ?";
        const sql1 = "update ItUserEmployees set EmpStatusPrj = 0 where Username = ? and BusinessName = ? and Prjname = ?";

        const [results] = await connection.promise().query(sql, [username,businessname,projectname]);
        await connection.promise().query(sql1, [username,businessname,projectname])
        console.log(req.body);
        
        return res.status(200).json(results);
    } catch (err) {
        console.error("❌ Error getting data2:", err);
    }
}

async function changeStatusStopProj(req , res){
    try {
        const { username,businessname,projectname } = req.body;
        const sql = "delete from ITUserProjects where Username = ? and BusinessName = ? and Projectname = ?";
        const sql1 = "update ItUserEmployees set EmpStatusPrj = 0 where Username = ? and BusinessName = ? and Prjname = ?";

        const [results] = await connection.promise().query(sql, [username,businessname,projectname]);
        await connection.promise().query(sql1, [username,businessname,projectname])
        console.log(req.body);
        
        return res.status(200).json(results);
    } catch (err) {
        console.error("❌ Error getting data2:", err);
    }
}


module.exports = {ITbusiness, ITUserProjects, ITUserEmployees, ITProjectsEmployees, ITEmployeesFire, ITEmployeesHire, ITEmployeesAfterHire, showDevList, InsertITBusiness, HireSelectedEmployees,BusEmpPrjStart,getPrjProgressCount,getPrjCompCount,PrjCompTimeAddition,getPrjComp,getPrjProgress,changeStatusCompProj,changeStatusStopProj};

 