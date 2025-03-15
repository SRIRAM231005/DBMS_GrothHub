require("dotenv").config();
const express = require("express");
const app = express();
const mysql = require("mysql2");
const socketIo = require('socket.io');
const cron = require('node-cron');

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*', // Allow frontend connections
    }
});

// const pool = require("./db");

// pool.getConnection((err, connection) => {
//   if (err) {
//     console.error("❌ Database connection failed:", err.message);
//     return;
//   }
//   console.log("✅ Connected to MySQL database!");
//   connection.release();
// });

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "07Adi@2005thya",
  database: "db",
  port: 3306,
});

connection.connect((err) => {
  if (err) {
    console.error("❌ MySQL direct connection failed:", err.message);
    return;
  }
  console.log("✅ MySQL direct connection successful!");
});



let clients = [];

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    clients.push(socket);

    // Handle client disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        clients = clients.filter(client => client.id !== socket.id);
    });
});

// Function to update project status and notify frontend
function updateProjectStatus() {
    /*const query = `UPDATE projects SET status = 'Completed' WHERE status = 'In Progress' AND completion_time <= NOW()`;*/
    /*db.query(query, (err, result) => {
        if (err) {
            console.error('Error updating project status:', err);
        } else {
            console.log('Updated projects:', result.affectedRows);

            // Fetch updated projects and send to frontend
            db.query(`SELECT * FROM projects`, (err, projects) => {
                if (!err) {
                    io.emit('updateProjects', projects); // Send updated data to frontend
                }
            });
        }
    });*/
    let projects='hi';
    io.emit('message', projects);
}

// Run every 5 minutes to update project status
cron.schedule('*/10 * * * * *', () => {
    console.log('Checking and updating project status...');
    updateProjectStatus();
});




const userrouter = require('./routes/users');
const ITbusinessrouter = require('./routes/ITbusiness');
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/user',userrouter);
app.use('/ITbusiness',ITbusinessrouter);

app.listen(8008,  ()=>{
    console.log('server started');
});