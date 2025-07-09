require("dotenv").config();
const mysql = require("mysql2");
const { connection, reconnectToDB } = require('../db');


const pool = connection();

async function ITbusiness(req, res) {
    const pool = await connection();
    try {
        const { username } = req.body;
        const sql = "SELECT * FROM ITbusiness WHERE Username = ?";
        
        const [results] = await pool.query(sql, [username]);

        if (results.length > 0) {
            return res.status(200).json(results);
        }
    } catch (err) {
        console.error("❌ Error getting ITbusiness:", err);
        if (err.code === 'ECONNRESET' || err.fatal) {
            await reconnectToDB();
            res.status(503).json({ success: false, retry: true });
        } else {
            res.status(500).json({ success: false });
        }
    }
}

async function GetITBusinessDetails(req, res){
    const pool = await connection();
    try{
        const { username,businessName } = req.body;
        const sql = "SELECT * FROM ITBusiness WHERE Username = ? and BusinessName = ?";

        const [results] = await pool.query(sql, [username,businessName]);

        return res.status(200).json(results);
    } catch (err) {
        console.error("❌ Error getting ITBusinessDetails:", err);
        if (err.code === 'ECONNRESET' || err.fatal) {
            await reconnectToDB();
            res.status(503).json({ success: false, retry: true });
        } else {
            res.status(500).json({ success: false });
        }
    }
}

async function ITUserProjects(req, res) {
    const pool = await connection();
    try {
        const { username,businessName } = req.body;
        const sql = "SELECT * FROM ITUserProjects WHERE Username = ? and BusinessName = ? ";
        
        const [results] = await pool.query(sql, [username,businessName]);

        if (results.length > 0) {
            return res.status(200).json(results);
        }else{
            return res.status(404).json({ error: "No projects found" });
        }
    } catch (err) {
        console.error("❌ Error getting ItUserProjects:", err);
        if (err.code === 'ECONNRESET' || err.fatal) {
            await reconnectToDB();
            res.status(503).json({ success: false, retry: true });
        } else {
            res.status(500).json({ success: false });
        }
    }
}

async function ITUserEmployees(req, res) {
    const pool = await connection();
    try {
        const { username,businessName } = req.body;
        const sql = "SELECT * FROM ITUserEmployees WHERE Username = ? and BusinessName = ?";
        
        const [results] = await pool.query(sql, [username,businessName]);
        /*console.log(results);
        console.log(username);
        console.log(req.body);*/
        if (results.length > 0) {
            return res.status(200).json(results);
        }else{
            return res.status(404).json({ error: "No employees found" });
        }
    } catch (err) {
        console.error("❌ Error getting ItUserEmployees:", err);
        if (err.code === 'ECONNRESET' || err.fatal) {
            await reconnectToDB();
            res.status(503).json({ success: false, retry: true });
        } else {
            res.status(500).json({ success: false });
        }
    }
}

// async function ITProjectsEmployees(req, res){
//     try {
//         const sql = "SELECT * FROM ITProjects; SELECT * FROM ITEmployees";
//         const [results] = await connection.query(sql);

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
    const pool = await connection();
    try {
        const { username, businessname } = req.body;
        const [projects] = await pool.execute("SELECT * FROM ITProjects");
        const sqlemployees = "SELECT e.* FROM ITEmployees e INNER JOIN ITUserEmployees ue ON e.EmployeeName = ue.EmployeeName WHERE ue.Username = ? and ue.BusinessName = ?";
        //SELECT e.* FROM ITEmployees e LEFT JOIN ITUserEmployees ue ON e.EmployeeName = ue.EmployeeName AND ue.Username = 'user' WHERE ue.EmployeeName IS NULL;

        const [employees] = await pool.query(sqlemployees, [username,businessname]);

        return res.status(200).json({
            Projects: projects,
            Employees: employees
        });

    } catch (err) {
        console.error("❌ Error getting ITProjectsEmployees:", err);
        if (err.code === 'ECONNRESET' || err.fatal) {
            await reconnectToDB();
            res.status(503).json({ success: false, retry: true });
        } else {
            res.status(500).json({ success: false });
        }
    }
}

async function ITEmployeesFire(req , res){
    const pool = await connection();
    try {
        const { username,employeename,businessName } = req.body;
        const sql = "DELETE FROM ITUserEmployees WHERE Username = ? AND Employeename = ? and BusinessName = ?";
        const sql1 = "UPDATE ItBusiness SET Wages = Wages-(SELECT Salary FROM ItEmployees WHERE Employeename = ?) WHERE Username = ? and BusinessName = ?";
        
        const [results] = await pool.query(sql, [username,employeename,businessName]);
        await pool.query(sql1, [employeename,username,businessName])
        //console.log(req.body);
        
        return res.status(200).json(results);

    } catch (err) {
        console.error("❌ Error getting ITEmployeesFire:", err);
        if (err.code === 'ECONNRESET' || err.fatal) {
            await reconnectToDB();
            res.status(503).json({ success: false, retry: true });
        } else {
            res.status(500).json({ success: false });
        }
    }
}

async function ITEmployeesHire(req , res){
    const pool = await connection();
    try {
        const { username, businessname,role } = req.body;
        const sql = "select * from ITEmployees where Employeename not in (select e.Employeename from ITEmployees e inner join ITUserEmployees ee using(Employeename) where Username = ? and BusinessName = ?) and Role = ?";
        
        const [results] = await pool.query(sql, [username, businessname, role]);
        //console.log(req.body);
        
        return res.status(200).json(results);

    } catch (err) {
        console.error("❌ Error getting ITEmployeesHire:", err);
        if (err.code === 'ECONNRESET' || err.fatal) {
            await reconnectToDB();
            res.status(503).json({ success: false, retry: true });
        } else {
            res.status(500).json({ success: false });
        }
    }
}

async function ITEmployeesAfterHire(req , res){
    const pool = await connection();
    try {
        const { username,businessName,employeename } = req.body;
        const sql = "INSERT INTO ITUserEmployees (Username, BusinessName,Employeename) VALUES (?, ?, ?)";
        const sql1 = "UPDATE ItBusiness SET Wages = Wages+(SELECT Salary FROM ItEmployees WHERE Employeename = ?) WHERE Username = ? and BusinessName = ?";

        const [results] = await pool.query(sql, [username,businessName,employeename]);
        await pool.query(sql1, [employeename,username,businessName])
        //console.log(req.body);
        
        return res.status(200).json(results);
    } catch (err) {
        console.error("❌ Error getting ITEmployeesAfterHire:", err);
        if (err.code === 'ECONNRESET' || err.fatal) {
            await reconnectToDB();
            res.status(503).json({ success: false, retry: true });
        } else {
            res.status(500).json({ success: false });
        }
    }
}

async function showDevList(req, res){
    const pool = await connection();
    try{
        const { username,businessName,role } = req.body;
        const sql = "select Employeename, Salary, Skill from ItEmployees where Employeename in (select Employeename from ItUserEmployees where Username = ? and BusinessName = ?) and Role like CONCAT('%', ?, '%')";
        const [results] = await pool.query(sql, [username,businessName,role]);
        // console.log("demo:",req.body);
        //console.log("demo:",results);
        return res.status(200).json(results);
    }catch (err) {
        console.error("❌ Error getting showDevList:", err);
        if (err.code === 'ECONNRESET' || err.fatal) {
            await reconnectToDB();
            res.status(503).json({ success: false, retry: true });
        } else {
            res.status(500).json({ success: false });
        }
    }
}

async function InsertITBusiness(req , res){
    const pool = await connection();
    try {
        const { username, businessname } = req.body;
        const sql = "INSERT INTO ItBusiness (Username, BusinessName) VALUES (?, ?)";
        // const sql1 = "UPDATE ItBusiness SET Wages = Wages+(SELECT Salary FROM ItEmployees WHERE Employeename = ?) WHERE Username = ?";

        const [results] = await pool.query(sql, [username,businessname]);
        // await pool.query(sql1, [businessname,username])
        //console.log(req.body);
        
        return res.status(200).json(results);

    } catch (err) {
        console.error("❌ Error getting InsertITBusiness:", err);
        if (err.code === 'ECONNRESET' || err.fatal) {
            await reconnectToDB();
            res.status(503).json({ success: false, retry: true });
        } else {
            res.status(500).json({ success: false });
        }
    }
}

async function HireSelectedEmployees(req , res){
    const pool = await connection();
    try {
        const { username, businessname, employeename } = req.body;
        const sql = "INSERT INTO ItUserEmployees(Username, BusinessName,Employeename) VALUES (?, ?, ?)";
        const sql1 = "UPDATE ItBusiness SET Wages = Wages+(SELECT Salary FROM ItEmployees WHERE Employeename = ?) WHERE Username = ?";

        const [results] = await pool.query(sql, [username,businessname,employeename]);
        await pool.query(sql1, [employeename,username])
        //console.log(req.body);
        
        return res.status(200).json(results);

    } catch (err) {
        console.error("❌ Error getting HireSelectedEmployees:", err);
        if (err.code === 'ECONNRESET' || err.fatal) {
            await reconnectToDB();
            res.status(503).json({ success: false, retry: true });
        } else {
            res.status(500).json({ success: false });
        }
    }
}

async function BusEmpPrjStart(req , res){
    const pool = await connection();
    try {
        const { username, businessname, empName, prjname } = req.body;
        
        const sql = "update ItUserEmployees set EmpStatusPrj = 1 where EmpStatusPrj = 0 and Username = ? and BusinessName = ? and Employeename = ?";
        const sql1 = "update ItUserEmployees set PrjName = ? where EmpStatusPrj = 1 and Username = ? and BusinessName = ? and Employeename = ?";
        
        const [results] = await pool.query(sql,[username,businessname,empName]);
        await pool.query(sql1,[prjname,username,businessname,empName]);
        
        //console.log("verify",results);
        return res.status(200).json(results);

    } catch (err) {
        console.error("❌ Error getting BusEmpPrjStart:", err);
        if (err.code === 'ECONNRESET' || err.fatal) {
            await reconnectToDB();
            res.status(503).json({ success: false, retry: true });
        } else {
            res.status(500).json({ success: false });
        }
    }
}

async function PrjCompTimeAddition(req , res){
    const pool = await connection();
    try {
        const { username, businessname, prjname } = req.body;
        const sql = "insert into ItUserProjects (Username, BusinessName, Projectname, ProjectCompTime) values (?,?,?,now()+ interval 60 second)";
        
        const [results] = await pool.query(sql,[username,businessname,prjname]);

        //console.log("verify",results);
        return res.status(200).json(results);

    } catch (err) {
        console.error("❌ Error getting PrjCompTimeAddition:", err);
        if (err.code === 'ECONNRESET' || err.fatal) {
            await reconnectToDB();
            res.status(503).json({ success: false, retry: true });
        } else {
            res.status(500).json({ success: false });
        }
    }
}


async function getPrjProgressCount(req , res){
    const pool = await connection();
    try {
        const { username, businessname } = req.body;
        const sql = "select count(*) as countPrj from ItUserProjects where Username = ? and BusinessName = ? and ProjectStatus = 0 group by BusinessName";
        const [results] = await pool.query(sql, [username,businessname]);
        //console.log(req.body);
        //console.log("hola",results);
        
        return res.status(200).json(results);

    } catch (err) {
        console.error("❌ Error getting getPrjProgressCount:", err);
        if (err.code === 'ECONNRESET' || err.fatal) {
            await reconnectToDB();
            res.status(503).json({ success: false, retry: true });
        } else {
            res.status(500).json({ success: false });
        }
    }
}

async function getPrjCompCount(req , res){
    const pool = await connection();
    try {
        const { username, businessname } = req.body;
        const sql = "select count(*) as countPrj from ItUserProjects where Username = ? and BusinessName = ? and ProjectStatus = 1 group by BusinessName";
        const [results] = await pool.query(sql, [username,businessname]);
        //console.log(req.body);
        //console.log("hi",results);
        
        return res.status(200).json(results);

    } catch (err) {
        console.error("❌ Error getting getPrjCompCount:", err);
        if (err.code === 'ECONNRESET' || err.fatal) {
            await reconnectToDB();
            res.status(503).json({ success: false, retry: true });
        } else {
            res.status(500).json({ success: false });
        }
    }
}

async function getPrjComp(req , res){
    const pool = await connection();
    try {
        const { username, businessname } = req.body;
        const sql = "select * from ItUserProjects where Username = ? and BusinessName = ? and ProjectStatus = 1";
        const [results] = await pool.query(sql, [username,businessname]);
        //console.log(req.body);
        //console.log("compPrj",results);
        
        return res.status(200).json(results);

    } catch (err) {
        console.error("❌ Error getting getPrjComp:", err);
        if (err.code === 'ECONNRESET' || err.fatal) {
            await reconnectToDB();
            res.status(503).json({ success: false, retry: true });
        } else {
            res.status(500).json({ success: false });
        }
    }
}

async function getPrjProgress(req , res){
    const pool = await connection();
    try {
        const { username, businessname } = req.body;
        const sql = "select * from ItUserProjects where Username = ? and BusinessName = ? and ProjectStatus = 0";
        const [results] = await pool.query(sql, [username,businessname]);
        //console.log(req.body);
        //console.log("prgPrj",results);
        
        return res.status(200).json(results);

    } catch (err) {
        console.error("❌ Error getting getPrjProgress:", err);
        if (err.code === 'ECONNRESET' || err.fatal) {
            await reconnectToDB();
            res.status(503).json({ success: false, retry: true });
        } else {
            res.status(500).json({ success: false });
        }
    }
}

async function changeStatusCompProj(req , res){
    const pool = await connection();
    try {
        const { username,businessname,projectname } = req.body;
        const sql = "delete from ITUserProjects where Username = ? and BusinessName = ? and Projectname = ?";
        const sql1 = "update ItUserEmployees set EmpStatusPrj = 0 where Username = ? and BusinessName = ? and Prjname = ?";
        const sql2 = "update Balances set Business = Business + (select Cost from ItProjects where Projectname = ?) where Username = ?";

        const [results] = await pool.query(sql, [username,businessname,projectname]);
        await pool.query(sql1, [username,businessname,projectname])
        //console.log(req.body);
        
        return res.status(200).json(results);
    } catch (err) {
        console.error("❌ Error getting changeStatusCompProj:", err);
        if (err.code === 'ECONNRESET' || err.fatal) {
            await reconnectToDB();
            res.status(503).json({ success: false, retry: true });
        } else {
            res.status(500).json({ success: false });
        }
    }
}

async function changeStatusStopProj(req , res){
    const pool = await connection();
    try {
        const { username,businessname,projectname } = req.body;
        const sql = "delete from ITUserProjects where Username = ? and BusinessName = ? and Projectname = ?";
        const sql1 = "update ItUserEmployees set EmpStatusPrj = 0 where Username = ? and BusinessName = ? and Prjname = ?";

        const [results] = await pool.query(sql, [username,businessname,projectname]);
        await pool.query(sql1, [username,businessname,projectname])
        //console.log(req.body);
        
        return res.status(200).json(results);
    } catch (err) {
        console.error("❌ Error getting changeStatusStopProject:", err);
        if (err.code === 'ECONNRESET' || err.fatal) {
            await reconnectToDB();
            res.status(503).json({ success: false, retry: true });
        } else {
            res.status(500).json({ success: false });
        }
    }
}


module.exports = {ITbusiness, GetITBusinessDetails, ITUserProjects, ITUserEmployees, ITProjectsEmployees, ITEmployeesFire, ITEmployeesHire, ITEmployeesAfterHire, showDevList, InsertITBusiness, HireSelectedEmployees,BusEmpPrjStart,getPrjProgressCount,getPrjCompCount,PrjCompTimeAddition,getPrjComp,getPrjProgress,changeStatusCompProj,changeStatusStopProj};

 