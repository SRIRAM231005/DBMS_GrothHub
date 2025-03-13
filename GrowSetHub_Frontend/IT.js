// Employee Data Array
const employees = [
    { name: "Junior Developers", salary: "57,606", count: 16, icon: "images/juniorDev.png", color: "green" },
    { name: "Middle Developers", salary: "316,005", count: 3, icon: "images/middleDev.png", color: "blue" },
    { name: "Senior Developers", salary: "0", count: 0, icon: "images/seniorDev.png", color: "gold" },
    { name: "Designers", salary: "71,861", count: 3, icon: "images/designer.png", color: "teal" },
    { name: "Team Leaders", salary: "415,075", count: 1, icon: "images/teamLeader.png", color: "dodgerblue" },
    { name: "Testers", salary: "525,293", count: 2, icon: "images/tester.png", color: "lightblue" }
];


function EmployeeListGeneration(){
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
        EmployeeDivFunction(count);
        count++;
    });
}



//let username = 'user';
//let ProjectsAndEmployees;

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

        const data = await response.json();
        console.log(data);
        ProjectsAndEmployees = data;
        EmployeeListGeneration();
        //return data;
    } catch (error) {
        console.error("❌ Error fetching IT projects employees:", error);
        return null;
    }
}

async function ITEmployeesFire(username,employeename){
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
        //return data;
    } catch (error) {
        console.error("❌ Error fetching IT projects employees:", error);
        return null;
    }
}

/*fetchITMainBusiness(username);
fetchITUserProjects(username);
fetchITUserEmployees(username);
fetchITProjectsEmployees(username);
fetchITEmployeesFire(username,employeename);
function UpdateNameAndRevenue(data){
    const businessName = document.querySelector('.logo h1');
    const Revenue = document.querySelector('.finance-card h2');
    const Wages = document.querySelector('.finance-card h3');
    Revenue.textContent = data[0].Revenue;
    Wages.textContent = data[0].Wages;
    businessName.textContent = data[0].BusinessName;
}*/
EmployeeListGeneration();

const ProjectsAndEmployees = {
    Projects: [
        { Projectname: "Interfaces layout", NoOfDev: 30, NoOfDesigner: 20, NoOfTeamLeader: 0, NoOfTester: 0, Cost: 240000 },
        { Projectname: "Corporate website development", NoOfDev: 100, NoOfDesigner: 60, NoOfTeamLeader: 0, NoOfTester: 0, Cost: 4300000 },
        { Projectname: "Development of the site online store", NoOfDev: 450, NoOfDesigner: 90, NoOfTeamLeader: 100, NoOfTester: 50, Cost: 14000000 }
    ],
    Employees: [
        {
            EmployeeName: "Andrew Hopkins",
            Role: "Junior Developers",
            Salary: 3750,
            Skill: 15
        },
        {
            EmployeeName: "Thomas Chang",
            Role: "Junior Developers",
            Salary: 3750,
            Skill: 15
        },
        {
            EmployeeName: "Brandon Elliott",
            Role: "Junior Developers",
            Salary: 3002,
            Skill: 15
        },
        {
            EmployeeName: "Reuben",
            Role: "Junior Developers",
            Salary: 2787,
            Skill: 16
        },
        {
            EmployeeName: "Sophia Martinez",
            Role: "Middle Developers",
            Salary: 6000,
            Skill: 20
        },
        {
            EmployeeName: "Liam Johnson",
            Role: "Middle Developers",
            Salary: 6200,
            Skill: 21
        },

        // Senior Developers
        {
            EmployeeName: "Olivia Brown",
            Role: "Senior Developers",
            Salary: 9000,
            Skill: 25
        },
        {
            EmployeeName: "Ethan Wilson",
            Role: "Senior Developers",
            Salary: 9500,
            Skill: 26
        }
    ]
};


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
        ProjectsBox.innerHTML = `<div class="project-card">
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
                        💰 $${element.Cost.toLocaleString()}
                    </div>
                </div>
            </div>`;
        document.querySelector('.ProjectsBody').appendChild(ProjectsBox);
    })
    dialog.showModal();
})

function dialogueClose() {
    const dialog = document.querySelector('.d1'); // Select the dialog element
    if (dialog) {
        dialog.close(); // Close the dialog
        dialog.remove(); // Remove the dialog from the DOM to clean up
    }
}


function EmployeeDivFunction(count){
    const EmployeeType = document.querySelector(`.employee${count}`);
    EmployeeType.addEventListener('click', ()=>{
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
                            <div class="EmployeesBody"></div>`;
        ProjectsAndEmployees.Employees.forEach(element =>{
            if(element.Role === employees[count-1].name){
                const EmployeeBox = document.createElement('div');
                EmployeeBox.classList.add('EmployeeBox');
                EmployeeBox.innerHTML = `<div class="employee-card">
                    <div class="employee-header" style="display: flex; align-items: center ; margin-bottom:10px; padding: 10px; border-top-left-radius: 8px; border-top-right-radius: 8px; font-size: 20px;">
                        <img src="${employees[count-1].icon}">
                        <span style="padding-left: 5px;">${element.EmployeeName}</span>
                    </div>
                    <div class="employee-details" style="font-size:20px;">
                        <div>
                            <span>Salary:</span> ${element.Salary}
                            <span>Skill:</span> ${element.Skill}
                        </div>
                        <div class="employee-fire" style="margin:10px; padding-bottom:10px;">
                            <button class="employee-fire-button${count} employeeFireButton">Fire</button>
                        </div>
                    </div>
                </div>`;
                document.querySelector('.EmployeesBody').appendChild(EmployeeBox);
            }
            
        })
        dialog.showModal();
    })
}

function dialogueClose1() {
    const dialog = document.querySelector('.d2'); // Select the dialog element
    if (dialog) {
        dialog.close(); // Close the dialog
        dialog.remove(); // Remove the dialog from the DOM to clean up
    }
}