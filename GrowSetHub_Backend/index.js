require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const mysql = require("mysql2");
const {Server} = require('socket.io');
const cron = require('node-cron');

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: '*', 
      methods: ["GET", "POST"]
    }
});
 
  
/*const pool = require("./db"); 

pool.query("SELECT 1")
  .then(() => {
    console.log("✅ MySQL pool connection successful!");
  })
  .catch((err) => {
    console.error("❌ MySQL pool connection failed:", err.message);
  });*/
  
  
// const pool = require("./db");

// pool.getConnection((err, connection) => {
//   if (err) {
//     console.error("❌ Database connection failed:", err.message);
//     return;
//   }
//   console.log("✅ Connected to MySQL database!");
//   connection.release();
// });

/*const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306,
});

connection.connect((err) => {
  if (err) {
    console.error("❌ MySQL direct connection failed:", err.message);
    return;
  }
  console.log("✅ MySQL direct connection successful!");
});*/


app.get("/", (req, res) => {
    res.send("Socket.io Server is Running! 🚀");
});

let clients = [];

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    let projects = 'hi';
    clients.push(socket);
    cron.schedule('*/600 * * * * *', () => {
        console.log('Checking and updating project status...');
        updateProjectStatus();
    });
    cron.schedule('* * * * *', () => {
        console.log('⏰ Running hourly job to update bank status...');
        updateBankStatus();
    });    

    // Handle client disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        clients = clients.filter(client => client.id !== socket.id);
    });
});

// Function to update project status and notify frontend
function updateProjectStatus() {
    const query = `UPDATE ITUserprojects SET ProjectStatus = 1 WHERE ProjectStatus = 0 AND ProjectCompTime <= NOW()`;
    //console.log("117");
    connection.query(query, (err, result) => {
        //console.log(result);
        if (err) {
            console.error('Error updating project status:', err);
        } else {
            //console.log('Updated projects:', result.affectedRows);

            // Fetch updated projects and send to frontend
            connection.query(`SELECT * FROM ITUserprojects`, (err, projects) => {
                if (!err) {
                    io.emit('updateProjects', projects); // Send updated data to frontend
                }
            });
        }
    });

    // let projects='hi';
    // io.emit('message', projects);
}

function updateBankStatus(){
    const fetchQuery = `SELECT * FROM BankBusiness WHERE IntSetTime <= NOW()`;
    
    connection.query(fetchQuery, async (err, users) => {
        if (err) {
            console.error('Error updating bank status:', err);
        } else {
            const query = `UPDATE BankBusiness SET IntSetTime = DATE_ADD(NOW(), INTERVAL 1 MINUTE) WHERE IntSetTime <= NOW()`;
            await connection.promise().query(query);
            let TotalDeposits;
            let TotalCredits;

            users.forEach(async (user) =>{
                let marketingInvestment = 50;
                const sql2 = "SELECT AVG(CreditInt) AS competitorCreditAvg from BankBusiness";
                const [results2] = await connection.promise().query(sql2);

                const sql3 = "SELECT Level from Balances where Username = ?";
                const [results3] = await connection.promise().query(sql3,[user.Username]);

                function calculateTotalDeposits(creditInterest, debitInterest, level, marketingInvestment, competitorCreditAvg) {
                    const baseDeposit = 10000;
                    const marketingBoost = Math.log10(marketingInvestment + 10) * 100;
                    const levelMultiplier = 1 + Math.pow(level, 1.5) * 0.1;
                    const interestGap = debitInterest - creditInterest;
                    const interestBoost = (creditInterest / (interestGap + 1)) * 100;
                    const competitiveness = Math.max(0.5, 1 + (creditInterest - competitorCreditAvg) * 0.1);
                    const totalDeposits = (baseDeposit + marketingBoost * levelMultiplier + interestBoost) * competitiveness;        
                    return Math.round(totalDeposits);
                }
                TotalDeposits = calculateTotalDeposits(user.CreditInt, user.DebitInt, results3[0].Level, marketingInvestment, results2[0].competitorCreditAvg);

                function calculateTotalCredits(debitInterest, creditInterest, level, marketingInvestment, totalDeposits, competitorCreditAvg) {
                    const baseCreditDemand = 8000;
                    const marketingBoost = Math.log10(marketingInvestment + 10) * 80;
                    const levelMultiplier = 1 + Math.pow(level, 1.3) * 0.08;
                    const interestAppeal = Math.max(1, (Number(competitorCreditAvg) / Number(creditInterest) + 0.5));
                    const riskCap = Number(totalDeposits) * 0.85; // can give loans upto 85% of deposits              
                    const rawLoanDemand = (baseCreditDemand + marketingBoost * levelMultiplier) * interestAppeal;                
                    const totalCredits = Math.min(riskCap, rawLoanDemand); // final amount bounded by deposit pool
                    /*console.log("creditInterest",creditInterest);
                    console.log("competitorCreditAvg",competitorCreditAvg);
                    console.log("interestAppeal",interestAppeal);
                    console.log("rawLoanDemand",rawLoanDemand);
                    console.log("riskCap",riskCap);
                    console.log("totalCredits",totalCredits);               
                    console.log("totalDeposits",totalDeposits);*/               
                    return Math.round(totalCredits);
                }
                TotalCredits = calculateTotalCredits(user.DebitInt, user.CreditInt, results3[0].Level, marketingInvestment, Number(user.TotalAmount) + Number(TotalDeposits), results2[0].competitorCreditAvg);
                /*console.log("totDep",TotalDeposits);
                console.log("totCred",TotalCredits);
                console.log("lvl",results3[0].Level);
                console.log("amount",user.TotalAmount);*/
                const sql4 = `UPDATE BankBusiness SET TotalAmount = TotalAmount + ?, TotalCredits = ?, TotalDeposits = ? WHERE Username = ? and BusinessName = ?`;
                await connection.promise().query(sql4,[TotalDeposits.toFixed(2) - TotalCredits.toFixed(2) , TotalCredits.toFixed(2), TotalDeposits.toFixed(2), user.Username, user.BusinessName]);                
            })

            connection.query(`SELECT * FROM BankBusiness`, (err, updatedUsers) => {
                if (!err) {
                    io.emit('updateBanks', updatedUsers);
                }
            });        
            //io.emit('updateBanks', user); // Send updated data to frontend
        }
    });
}

// Run every 5 minutes to update project status
//cron.schedule('*/10 * * * * *', () => {
/*    console.log('Checking and updating project status...');
    updateProjectStatus();
});*/




const userrouter = require('./routes/users');
const ITbusinessrouter = require('./routes/ITbusiness');
const investmentrouter = require('./routes/investment');
const BankCorporationRouter = require('./routes/Bank-Corporationbusiness');
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/user',userrouter);
app.use('/ITbusiness',ITbusinessrouter);
app.use('/investment',investmentrouter);
app.use('/Bank-Corporationbusiness',BankCorporationRouter);

/*app.listen(8008,  ()=>{
    console.log('server started');
});*/

server.listen(8008,  ()=>{
    console.log('socket started');
});