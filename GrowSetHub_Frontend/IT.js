document.addEventListener("DOMContentLoaded", function () {
    const navItems = [
        { img: "images/Investing.png", text: "Investing", badge: "1", link: "investing.html" },
        { img: "images/Business.png", text: "Business", badge: "8", link: "business.html" },
        { img: "images/Earnings.png", text: "Earnings", badge: null, link: "home.html" },
        { img: "images/Profile.png", text: "Profile", badge: "1", link: "profile.html", active: true }
    ];

    const bottomNav = document.getElementById("bottomNav");

    navItems.forEach(item => {
        const navDiv = document.createElement("div");
        navDiv.classList.add("nav-item");
        if (item.active) navDiv.classList.add("active");

        navDiv.innerHTML = `
            <img src="${item.img}">
            <span class="text">${item.text}</span>
            ${item.badge ? `<span class="badge">${item.badge}</span>` : ""}
        `;

        bottomNav.appendChild(navDiv);

        navDiv.addEventListener("click", () => {
            window.location.href = item.link;
        });
    });
});


// Employee Data Array
let employees = [
    { name: "Junior Developers", salary: "57,606", count: 16, icon: "images/juniorDev.png", color: "green" },
    { name: "Middle Developers", salary: "316,005", count: 3, icon: "images/middleDev.png", color: "blue" },
    { name: "Senior Developers", salary: "0", count: 0, icon: "images/seniorDev.png", color: "gold" },
    { name: "Designers", salary: "71,861", count: 3, icon: "images/designer.png", color: "teal" },
    { name: "Team Leaders", salary: "415,075", count: 1, icon: "images/teamLeader.png", color: "dodgerblue" },
    { name: "Testers", salary: "525,293", count: 2, icon: "images/tester.png", color: "lightblue" }
];


function EmployeeListGeneration(ProjectsAndEmployees){


    let roleCounts = {}; // Object to store role counts

        ProjectsAndEmployees.Employees.forEach((emp) => {
            let role = emp.Role; // Assuming `role` is the key storing employee role
            console.log('role:',emp.Role);
            if (roleCounts[role]) {
                roleCounts[role]++;
            } else {
                roleCounts[role] = 1;
            }
        });

        // Step 2: Update the `employees` array with these counts
        employees.forEach((emp) => {
            if (roleCounts[emp.name]) {
                emp.count = roleCounts[emp.name]; // Update count
            } else {
                emp.count = 0; // If no employees in this role, set count to 0
            }
        });

        console.log("roleCount:",roleCounts);



    const employeeList = document.getElementById("employeeList");
    let count = 1;
    employees.forEach(emp => {
        const employeeDiv = document.createElement("div");
        employeeDiv.classList.add(`employee${count}`);
        employeeDiv.classList.add('employee');
        employeeDiv.innerHTML = `
            <img src="${emp.icon}">
            <div class="info">
                <h3>${emp.name}</h3>
                <p>$ ${emp.salary} / hour</p>
            </div>
            <span class="count">${emp.count}</span>
            <span class="line" style="background-color: ${emp.color};"></span>
        `;
        employeeList.appendChild(employeeDiv);
        //EmployeeDivFunction(count);
        //const EmployeeType = document.querySelector(`.employee${count}`);
        //EmployeeType.addEventListener('click', ()=>{
        //    console.log(count);
        //});
        count++;
    });
    //EmployeeDivFunction(count);
    document.querySelectorAll('.employee').forEach((div,index) => {
        div.addEventListener('click', () => {
            // Extract number from class name (e.g., "emp3" → 3)
            //let number = div.className.match(/employee(\d+)/);
            //alert(`You clicked on ${div.className} - Number: ${number}`);
            /*if (number) {
                EmployeeDivFunction(number[1]); // Calls function with extracted number
            }*/
            EmployeeDivFunction(index+1);
        });
    });
}



const credentials= JSON.parse(localStorage.getItem('credentials'));
console.log(credentials);
let username = credentials;
let ProjectsAndEmployees;

/*const ProjectsListButton = document.querySelector('.start-project');
    ProjectsListButton.addEventListener('click', ()=>{
        console.log(1);
        fetchITProjectsEmployees(username);
    })*/

async function fetchITMainBusiness(username) {
    try {
        const response = await fetch('http://localhost:8008/ITbusiness/ITmainbusiness', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username }),
        });

        const data = await response.json();
        console.log(data);
        UpdateNameAndRevenue(data);
        //return data; // Return fetched data
    } catch (error) {
        console.error("❌ Error fetching IT main business:", error);
        return null;
    }
}

async function fetchITUserProjects(username) {
    try {
        const response = await fetch('http://localhost:8008/ITbusiness/ITUserProjects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username }),
        });

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("❌ Error fetching IT user projects:", error);
        return null;
    }
}

async function fetchITUserEmployees(username) {
    try {
        const response = await fetch('http://localhost:8008/ITbusiness/ITUserEmployees', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username }),
        });

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("❌ Error fetching IT user employees:", error);
        return null;
    }
}

async function fetchITProjectsEmployees(username) {
    try {
        const response = await fetch('http://localhost:8008/ITbusiness/ITProjectsEmployees', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username }),
        });

        ProjectsAndEmployees = await response.json();
        console.log(ProjectsAndEmployees);
        if(Object.keys(ProjectsAndEmployees).length===0){
            return;
        }else{
            showPrjList();
            EmployeeListGeneration(ProjectsAndEmployees);       
        }
    } catch (error) {
        console.error("❌ Error fetching IT projects employees:", error);
        return null;
    }
}

async function fetchITEmployeesFire(username,employeename){
    try {
        const response = await fetch('http://localhost:8008/ITbusiness/ITEmployeesFire', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                 username: username,
                 employeename: employeename
            }),
        });
        const data = await response.json();
        console.log(data);
        dialogueClose1();
        location.reload();
        //return data;
    } catch (error) {
        console.error("❌ Error fetching IT projects employees:", error);
        return null;
    }
}

let AllEmp;

async function fetchITEmployeesHire(username){
    console.log(username);
    try {
        const response = await fetch('http://localhost:8008/ITbusiness/ITEmployeesHire', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                 username: username
            }),
        });
        AllEmp = await response.json();
        console.log("hire:",AllEmp);
        dialogueClose1();
        EmployeeHireDialog();
        //return data;
    } catch (error) {
        console.error("❌ Error fetching IT projects employees:", error);
        return null;
    }
}


fetchITMainBusiness(username);
fetchITUserProjects(username);
fetchITUserEmployees(username);
fetchITProjectsEmployees(username);
//fetchITEmployeesFire(username,employeename);
//EmployeeListGeneration()
function UpdateNameAndRevenue(data){
    const businessName = document.querySelector('.logo h1');
    const Revenue = document.querySelector('.finance-card h2');
    const Wages = document.querySelector('.finance-card h3');
    Revenue.textContent = data[0].Revenue;
    Wages.textContent = data[0].Wages;
    businessName.textContent = data[0].BusinessName;
}
//EmployeeListGeneration();

// const ProjectsAndEmployees = {
//     Projects: [
//         { Projectname: "Interfaces layout", NoOfDev: 30, NoOfDesigner: 20, NoOfTeamLeader: 0, NoOfTester: 0, Cost: 240000 },
//         { Projectname: "Corporate website development", NoOfDev: 100, NoOfDesigner: 60, NoOfTeamLeader: 0, NoOfTester: 0, Cost: 4300000 },
//         { Projectname: "Development of the site online store", NoOfDev: 450, NoOfDesigner: 90, NoOfTeamLeader: 100, NoOfTester: 50, Cost: 14000000 }
//     ],
//     Employees: [
//         {
//             EmployeeName: "Andrew Hopkins",
//             Role: "Junior Developers",
//             Salary: 3750,
//             Skill: 15
//         },
//         {
//             EmployeeName: "Thomas Chang",
//             Role: "Junior Developers",
//             Salary: 3750,
//             Skill: 15
//         },
//         {
//             EmployeeName: "Brandon Elliott",
//             Role: "Junior Developers",
//             Salary: 3002,
//             Skill: 15
//         },
//         {
//             EmployeeName: "Reuben",
//             Role: "Junior Developers",
//             Salary: 2787,
//             Skill: 16
//         },
//         {
//             EmployeeName: "Sophia Martinez",
//             Role: "Middle Developers",
//             Salary: 6000,
//             Skill: 20
//         },
//         {
//             EmployeeName: "Liam Johnson",
//             Role: "Middle Developers",
//             Salary: 6200,
//             Skill: 21
//         },

//         // Senior Developers
//         {
//             EmployeeName: "Olivia Brown",
//             Role: "Senior Developers",
//             Salary: 9000,
//             Skill: 25
//         },
//         {
//             EmployeeName: "Ethan Wilson",
//             Role: "Senior Developers",
//             Salary: 9500,
//             Skill: 26
//         }
//     ]
// };


function showPrjList(){
    const ProjectsListButton = document.querySelector('.start-project');
        ProjectsListButton.addEventListener('click', ()=>{
        let dialog = document.querySelector('.d1');
        if(!dialog){
            const body = document.body;
            dialog = document.createElement('dialog');
            dialog.classList.add('d1');
            body.appendChild(dialog);
        }
        dialog.innerHTML = `<div class="dialogHead">
                                <div>New Projects</div>
                                <div><img src="images/cross_close.png" onclick="dialogueClose();"></div>
                            </div>
                            <div class="ProjectsBody"></div>`;
        ProjectsAndEmployees.Projects.forEach(element =>{
            const ProjectsBox = document.createElement('div');
            ProjectsBox.classList.add('ProjectsBox');
            ProjectsBox.innerHTML = `<div class="project-card" onclick = "openInterfacePage()">
                    <div class="project-header" style="display: flex; align-items: center; background: #5a0fb1; color:white ;margin-bottom:10px; padding: 10px; border-top-left-radius: 8px; border-top-right-radius: 8px; font-size: 20px;">
                        <img src="images/project_icon.png">
                        <span style="padding-left: 5px;">${element.Projectname}</span>
                    </div>
                    <div class="project-details" style="font-size:20px;">
                        <div>
                            <span><img src="${employees[0].icon}"></span> ${element.NoOfDev}
                            <span><img src="${employees[3].icon}"></span> ${element.NoOfDesigner}
                            <span><img src="${employees[4].icon}"></span> ${element.NoOfTeamLeader}
                            <span><img src="${employees[5].icon}"></span> ${element.NoOfTester}
                        </div>
                        <div class="project-cost" style="margin:10px; padding-bottom:10px;">
                            💰 $${element.Cost}
                        </div>
                    </div>
                </div>`;
            document.querySelector('.ProjectsBody').appendChild(ProjectsBox);
        })
        dialog.showModal();

        });
}

function dialogueClose() {
    const dialog = document.querySelector('.d1'); // Select the dialog element
    if (dialog) {
        dialog.close(); // Close the dialog
        dialog.remove(); // Remove the dialog from the DOM to clean up
    }
}

function openInterfacePage(){
    window.location.href = "interface_layout.html";
}


function EmployeeDivFunction(count){
    //const EmployeeType = document.querySelector(`.employee${count}`);
    //console.log(3);
    //EmployeeType.addEventListener('click', ()=>{
        console.log("1st:",count);
        let dialog = document.querySelector('.d2');
        if(!dialog){
            const body = document.body;
            dialog = document.createElement('dialog');
            dialog.classList.add('d2');
            body.appendChild(dialog);
        }
        dialog.innerHTML = `<div class="dialogHead">
                                <div>${employees[count-1].name}</div>
                                <div><img src="images/cross_close.png" onclick="dialogueClose1();"></div>
                            </div>
                            <div class="EmployeesBody"></div>
                            <div><button class="HireButton${count} HireButtons">Hire</button></div>`;
        ProjectsAndEmployees.Employees.forEach((element, index) =>{
            console.log("element:",element);
            if(element.Role === employees[count-1].name){
                console.log(4);
                const EmployeeBox = document.createElement('div');
                EmployeeBox.classList.add('EmployeeBox');
                EmployeeBox.innerHTML = `<div class="employee-card">
                    <div class="employee-header" style="display: flex; align-items: center ; margin-bottom:10px; padding: 10px; border-top-left-radius: 8px; border-top-right-radius: 8px; font-size: 20px;">
                        <img src="${employees[count-1].icon}">
                        <span style="padding-left: 5px;">${element.Employeename}</span>
                    </div>
                    <div class="employee-details" style="font-size:20px;">
                        <div>
                            <span>Salary:</span> ${element.Salary}
                            <span>Skill:</span> ${element.Skill}
                        </div>
                        <div class="employee-fire" style="margin:10px; padding-bottom:10px;">
                            <button class="employee-fire-button${count}${index} FireButton" data-number="${index}">Fire</button>   
                        </div>
                    </div>
                </div>`;
                document.querySelector('.EmployeesBody').appendChild(EmployeeBox);
            }
            /*setTimeout(() => {
                FireEmployee(index,count);
            }, 100);*/
            //FireEmployee(index,count);
            HireEmployeeBSR(count);
        })
        if((document.querySelector(".employee-fire"))){
            document.querySelector(".employee-fire").addEventListener("click", (event) => {
                if (event.target.classList.contains("FireButton")) {
                    console.log(`Button inside Employee ${count},${event.target.dataset.number} clicked!`);
                    fetchITEmployeesFire(username,ProjectsAndEmployees.Employees[event.target.dataset.number].Employeename);
                }
            });
        }

        dialog.showModal();
    //})//employeeFireButton
}

function dialogueClose1() {
    const dialog = document.querySelector('.d2'); // Select the dialog element
    if (dialog) {
        dialog.close(); // Close the dialog
        dialog.remove(); // Remove the dialog from the DOM to clean up
    }
}

function FireEmployee(index,count){
    console.log("2nd:",count);
    console.log("4th:",index);
    console.log("3rd:",document.querySelector(`.employee-fire-button${count}${index}`))
    /*document.querySelector(`.employee-fire-button${count}`).addEventListener('click', ()=>{
        fetchITEmployeesFire(username,ProjectsAndEmployees.Employees[index].Employeename);
    })*/
}

function HireEmployeeBSR(count){
    console.log("55");
    document.querySelector(`.HireButton${count}`).addEventListener('click', ()=>{
        console.log("5");
        fetchITEmployeesHire(username);
    })
}

function EmployeeHireDialog(){
    // const ProjectsListButton = document.querySelector('.start-project');
    //     ProjectsListButton.addEventListener('click', ()=>{
        let dialog = document.querySelector('.d2');
        if(!dialog){
            const body = document.body;
            dialog = document.createElement('dialog');
            dialog.classList.add('d2');
            body.appendChild(dialog);
        }
        dialog.innerHTML = `<div class="dialogHead">
                                <div>Emp List</div>
                                <div><img src="images/cross_close.png" onclick="dialogueClose1();"></div>
                            </div>
                            <div class="EmpListBody"></div>`;
        AllEmp.forEach(element =>{
            const EmpBox = document.createElement('div');
            EmpBox.classList.add('EmpBox');
            EmpBox.innerHTML = `<div class="emp-card">
                    <div class="emp-header" style="display: flex; align-items: center; background: #5a0fb1; color:white ;margin-bottom:10px; padding: 10px; border-top-left-radius: 8px; border-top-right-radius: 8px; font-size: 20px;">
                        <input type="checkbox">
                        <span style="padding-left: 5px;">${element.Employeename}</span>
                    </div>
                    <div class="emp-details" style="font-size:20px;">
                        <div>
                            <span>Role:${element.Role}</span>
                            <span>Salary:${element.Salary}</span>
                            <span>Skill:${element.Skill}</span>
                        </div>
                    </div>
                </div>`;
            document.querySelector('.EmpListBody').appendChild(EmpBox);
        })
        dialog.showModal();

        // });
}