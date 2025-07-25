const credentials= JSON.parse(localStorage.getItem('credentials'));
console.log(credentials);
let username = credentials;

// const socket = io('http://localhost:8008'); // Connect to backend
console.log(typeof io); 
const socket = io("http://localhost:8008");


/*socket.on("connect", () => {
    console.log("Connected with ID:", socket.id);
});

socket.on("disconnect", () => {
    console.log("Disconnected from server");
});*/


socket.on('updateProjects', (projects) => {
    console.log('Received updated projects:', projects);
    fetchPrjinProgress(credentials,BusinessDetails.BusinessName);
    fetchPrjComp(credentials,BusinessDetails.BusinessName);
    /*const list = document.getElementById('projectList');
    list.innerHTML = ''; // Clear existing list

    projects.forEach(project => {
        const li = document.createElement('li');
        li.textContent = `${project.name} - ${project.status}`;
        list.appendChild(li);
    });*/
});
        
        
let BusinessDetails;
document.addEventListener("DOMContentLoaded", function () {
    BusinessDetails = JSON.parse(localStorage.getItem('UserBusinessInfo'));
    console.log("1st log",BusinessDetails);
    fetchCompanyData(BusinessDetails); 
    if (BusinessDetails) {
        document.querySelector(".logo h1").textContent = BusinessDetails.BusinessName;
        document.querySelector(".finance-card h2").textContent = BusinessDetails.Wages;
        document.querySelector(".finance-card h3").textContent = BusinessDetails.Revenue;
    } else {
        console.error("❌ BusinessDetails is missing or does not contain enough elements.");
    }
});
BusinessDetails = JSON.parse(localStorage.getItem('UserBusinessInfo'));

//console.log("check12",BusinessDetails);

async function fetchCompanyData(BusinessData){
    try{
        const response = await fetch("http://localhost:8008/ITbusiness/GetITBusinessDetails",{
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: credentials,
                businessName: BusinessData.BusinessName,
            })
        });
        const data = await response.json();
        if(data.retry){
            setTimeout(() => fetchCompanyData(BusinessData), 1000);
        }else{
            console.log(data);
            document.querySelector(".finance-card h2").textContent = `$ ${data[0].Revenue}`;
            document.querySelector(".finance-card h3").textContent = `$ ${data[0].Wages}`;
        }
    }catch(error){
        console.error("Error fetching business data:", error);
    }
}
        
document.addEventListener("DOMContentLoaded", function () {
    const navItems = [
        { img: "chart-no-axes-combined", text: "Investing", badge: "1", link: "stocksProfile.html" },//images/Investing.png
        { img: "building-2", text: "Business", badge: "8", link: "business.html" },//images/Business.png
        { img: "circle-dollar-sign", text: "Earnings", badge: null, link: "home.html" },//images/Earnings.png
        { img: "circle-user-round", text: "Profile", badge: "1", link: "profile.html", active: true }//images/Profile.png
    ];

    const bottomNav = document.getElementById("bottomNav");

    navItems.forEach(item => {
        const navDiv = document.createElement("div");
        navDiv.classList.add("nav-item");
        if (item.active) navDiv.classList.add("active");

        navDiv.innerHTML = `
            <i data-lucide="${item.img}" class="icon"></i>
            <span class="text">${item.text}</span>
            ${item.badge ? `<span class="badge">${item.badge}</span>` : ""}
        `;//<img src="${item.img}">

        bottomNav.appendChild(navDiv);

        navDiv.addEventListener("click", () => {
            window.location.href = item.link;
        });
    });

    lucide.createIcons();
});


let employees = [
    { name: "Junior Developers", salary: "0", count: 16, icon: "images/juniorDev.png", color: "green" },
    { name: "Middle Developers", salary: "0", count: 3, icon: "images/middleDev.png", color: "blue" },
    { name: "Senior Developers", salary: "0", count: 0, icon: "images/seniorDev.png", color: "gold" },
    { name: "Designers", salary: "0", count: 3, icon: "images/designer.png", color: "teal" },
    { name: "Team Leaders", salary: "0", count: 1, icon: "images/teamLeader.png", color: "dodgerblue" },
    { name: "Testers", salary: "0", count: 2, icon: "images/tester.png", color: "lightblue" }
];


function EmployeeListGeneration(ProjectsAndEmployees){
    
    let roleCounts = {}; 

        ProjectsAndEmployees.Employees.forEach((emp) => {
            let role = emp.Role; 
            console.log('role:',emp.Role);
            if (roleCounts[role]) {
                roleCounts[role]++;
            } else {
                roleCounts[role] = 1;
            }
        });

        employees.forEach((emp) => {
            if (roleCounts[emp.name]) {
                emp.count = roleCounts[emp.name]; 
            } else {
                emp.count = 0; 
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
        if(data.retry){
            setTimeout(() => fetchITMainBusiness(username), 1000);
        }else{
            console.log(data);
        }
    } catch (error) {
        console.error("Error fetching IT main business:", error);
        return null;
    }
}

async function fetchITUserProjects(username,businessName) {
    try {
        const response = await fetch('http://localhost:8008/ITbusiness/ITUserProjects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                username:username,
                businessName:businessName
             }),
        });

        const data = await response.json();
        if(data.retry){
            setTimeout(() => fetchITUserProjects(username,businessName), 1000);
        }else{
            console.log(data);
            return data;
        }
    } catch (error) {
        console.error("❌ Error fetching IT user projects:", error);
        return null;
    }
}

async function fetchITUserEmployees(username,businessName) {
    try {
        const response = await fetch('http://localhost:8008/ITbusiness/ITUserEmployees', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username:username, businessName:businessName }),
        });

        const data = await response.json();
        if(data.retry){
            setTimeout(() => fetchITUserEmployees(username,businessName), 1000);
        }else{
            console.log(data);
            return data;
        }
    } catch (error) {
        console.error("❌ Error fetching IT user employees:", error);
        return null;
    }
}

async function fetchITProjectsEmployees(username,businessname) {
    try {
        const response = await fetch('http://localhost:8008/ITbusiness/ITProjectsEmployees', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username,businessname }),
        });

        ProjectsAndEmployees = await response.json();
        if(ProjectsAndEmployees.retry){
            setTimeout(() => fetchITProjectsEmployees(username,businessname), 1000);
        }else{
            console.log(ProjectsAndEmployees);
            if(Object.keys(ProjectsAndEmployees).length===0){
                return;
            }else{
                showPrjList();
                EmployeeListGeneration(ProjectsAndEmployees);       
            }
        }
    } catch (error) {
        console.error("❌ Error fetching IT projects employees:", error);
        return null;
    }
}

async function fetchITEmployeesFire(username,employeename,businessName) {
    try {
        const response = await fetch('http://localhost:8008/ITbusiness/ITEmployeesFire', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                employeename: employeename,
                businessName: businessName
            }),
        });
        const data = await response.json();
        if(data.retry){
            setTimeout(() => fetchITEmployeesFire(username,employeename,businessName), 1000);
        }else{
            console.log(data);
            dialogueClose1();
            location.reload();
            //return data;
        }
    } catch (error) {
        console.error("❌ Error fetching IT projects employees:", error);
        return null;
    }
}

async function fetchPrjinProgress(username,businessname) {
    try {
        const response = await fetch('http://localhost:8008/ITbusiness/getPrjProgressCount', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username:username, businessname:businessname }),
        });
        
        const data = await response.json();
        if(data.retry){
            setTimeout(() => fetchPrjinProgress(username,businessname), 1000);
        }else{
            console.log("progress",data);
            if(data.length > 0){
                document.querySelector(".in-progress h3").textContent = `${data[0].countPrj}`;
                console.log(document.querySelector(".in-progress h3"));
            }
            //return data;   
        }
    } catch (error) {
        console.error("❌ Error fetching IT user projects:", error);
        return null;
    }
}

async function fetchPrjComp(username,businessname) {
    try {
        const response = await fetch('http://localhost:8008/ITbusiness/getPrjCompCount', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username:username, businessname:businessname }),
        });
        
        const data = await response.json();
        if(data.retry){
            setTimeout(() => fetchPrjComp(username,businessname), 1000);
        }else{
            console.log("completed",data);
            if(data.length > 0){
                document.querySelector(".completed h3").textContent = `${data[0].countPrj}`;
                console.log(document.querySelector(".completed h3"))
                //return data;
            }
        }
    } catch (error) {
        console.error("❌ Error fetching IT user projects:", error);
        return null;
    }
}

let AllEmp;
let prjProgList;
let prjCompList;
fetchPrjComp(credentials,BusinessDetails.BusinessName);
fetchPrjinProgress(credentials,BusinessDetails.BusinessName);
fetchgetPrjinProgress(credentials,BusinessDetails.BusinessName);
fetchgetPrjCompleted(credentials,BusinessDetails.BusinessName);


async function fetchITEmployeesHire(username,businessname,empRole){
    console.log("de:",businessname);
    try {
        const response = await fetch('http://localhost:8008/ITbusiness/ITEmployeesHire', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                 username: username,
                 businessname: businessname,
                 role: empRole
            }),
        });
        AllEmp = await response.json();
        if(AllEmp.retry){
            setTimeout(() => fetchITEmployeesHire(username,businessname,empRole), 1000);
        }else{
            console.log("hire:",AllEmp);
            dialogueClose1();
            EmployeeHireDialog();
            //return data;
        }
    } catch (error) {
        console.error("❌ Error fetching IT projects employees:", error);
        return null;
    }
}

let HiredEmp;
async function fetchEmpSelHire(username,businessname,employeename){
    try {
        const response = await fetch('http://localhost:8008/ITbusiness/HireSelectedEmployees', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                 username: username,
                 businessname: businessname,
                 employeename: employeename
            }),
        });
        HiredEmp = await response.json();
        if(HiredEmp.retry){
            setTimeout(() => fetchEmpSelHire(username,businessname,employeename), 1000);
        }else{
            console.log(HiredEmp);
            //return data;
        }
    } catch (error) {
        console.error("❌ Error fetching IT projects employees:", error);
        return null;
    }
}

console.log("check123",BusinessDetails);
fetchITMainBusiness(username);
fetchITUserProjects(username,BusinessDetails.BusinessName);
fetchITUserEmployees(username,BusinessDetails.BusinessName);
fetchITProjectsEmployees(username,BusinessDetails.BusinessName);
//fetchITEmployeesFire(username,employeename);
//EmployeeListGeneration()


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
        ProjectsAndEmployees.Projects.forEach((element,index) =>{
            const ProjectsBox = document.createElement('div');
            ProjectsBox.classList.add('ProjectsBox');
            ProjectsBox.innerHTML = `<div class="project-card" onclick = "openInterfacePage(${index})">
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

        /*if((document.querySelector(".ProjectsBox"))){
            document.querySelector(".ProjectsBox").addEventListener("click", (event) => {
                if (event.target.classList.contains("project-card")) {
                    console.log(`Button inside Employee ${count},${event.target.dataset.number} clicked!`);
                    fetchITEmployeesFire(username,ProjectsAndEmployees.Employees[event.target.dataset.number].Employeename);
                }
            });
        }*/
        
        dialog.showModal();

        });
}

function dialogueClose() {
    const dialog = document.querySelector('.d1'); 
    if (dialog) {
        dialog.close(); 
        dialog.remove(); 
    }
}

function openInterfacePage(index){
    localStorage.setItem("PrjInfo", JSON.stringify(ProjectsAndEmployees.Projects[index]));
    
    window.location.href = "Interface_Layout.html";
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
                            <div class="Hire"><button class="HireButton${count} HireButtons">Hire</button></div>`;
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
                /*console.log("16");
                HireEmployeeBSR(count,element.Role);   //error here!! passing element.role is a problem. It is taking the last role from table...
                console.log("ele:",element.Role);*/
            }
            /*setTimeout(() => {
                FireEmployee(index,count);
            }, 100);*/
            //FireEmployee(index,count);
        })
        HireEmployeeBSR(count,employees[count-1].name);

        if((document.querySelector(".employee-fire"))){
            console.log("17");
            document.querySelector(".employee-fire").addEventListener("click", (event) => {
                console.log("18");
                if (event.target.classList.contains("FireButton")) {
                    console.log(`Button inside Employee ${count},${event.target.dataset.number} clicked!`);
                    fetchITEmployeesFire(username,ProjectsAndEmployees.Employees[event.target.dataset.number].Employeename,BusinessDetails.BusinessName);
                }
            });
        }

        dialog.showModal();
}

function dialogueClose1() {
    const dialog = document.querySelector('.d2'); 
    if (dialog) {
        dialog.close(); 
        dialog.remove(); 
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

function HireEmployeeBSR(count,empRole){
    console.log("55");
    document.querySelector(`.HireButton${count}`).addEventListener('click', ()=>{
        console.log("5");
        fetchITEmployeesHire(username,BusinessDetails.BusinessName,empRole);
    })
}



function EmployeeHireDialog(){
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
                            <div class="EmpListBody"></div>
                            <div class="dialog-footer">
                                <button class="confirm-btn">Confirm</button>
                            </div>
                            `;
                            
        AllEmp.forEach(element =>{
            const EmpBox = document.createElement('div');
            EmpBox.classList.add('EmpBox');
            EmpBox.innerHTML = `<div class="emp-card" style = "box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2); border-radius:10px;">
                    <div class="emp-header" style="display: flex; align-items: center; background: #5a0fb1; color:white ;margin-bottom:10px; padding: 10px; border-top-left-radius: 8px; border-top-right-radius: 8px; font-size: 20px;">
                        <input type="checkbox" class="emp-checkbox" data-name="${element.Employeename}">
                        <span style="padding-left: 5px;">${element.Employeename}</span>
                    </div>
                    <div class="emp-details" style="font-size:20px;">
                        <div>
                            <span>Role:${element.Role}</span><br>
                            <span>Salary:${element.Salary}</span><br>
                            <span>Skill:${element.Skill}</span>
                        </div>
                    </div>
                </div>`;
            document.querySelector('.EmpListBody').appendChild(EmpBox);
        });

        document.querySelector('.confirm-btn').addEventListener('click', () => {
            console.log('Confirm button clicked!');

            let selectedEmployees = [];
            document.querySelectorAll('.emp-checkbox:checked').forEach(checkbox => {
                selectedEmployees.push(checkbox.getAttribute('data-name'));
            });

            selectedEmployees.forEach(empName =>{
                fetchEmpSelHire(credentials,BusinessDetails.BusinessName,empName);
            })
            location.reload();
            dialog.close();
        });

        dialog.showModal();
}


let dialog = document.querySelector('.prj');
if (!dialog) {
  dialog = document.createElement('dialog');
  dialog.classList.add('prj');
  document.body.appendChild(dialog);
}
document.querySelectorAll(".project").forEach(item => {
    item.addEventListener("click", () => {
  
      dialog.innerHTML = `
        <div class="dialogPrjHead">
          <div class="tabHeaders">
            <button class="tabButton active" data-tab="ongoing" style="margin-left:60px; margin-right:25px">Ongoing Projects</button>
            <button class="tabButton" data-tab="completed">Completed Projects</button>
          </div>
          <div><img src="images/cross_close.png" class="closeBtn"></div>
        </div>
        <hr style="border: 2px solid #c6c5c5;">
        <div class="tabContent">
          <div id="ongoing" class="tabPanel"></div>
          <div id="completed" class="tabPanel" style="display: none;"></div>
        </div>
      `;
  
      dialog.querySelector('.closeBtn').addEventListener('click', () => {
        dialog.close();
        fetchPrjComp(credentials,BusinessDetails.BusinessName);
      });
  
      dialog.querySelectorAll(".tabButton").forEach(button => {
        button.addEventListener("click", () => {
          dialog.querySelectorAll(".tabButton").forEach(btn => btn.classList.remove("active"));
          dialog.querySelectorAll(".tabPanel").forEach(panel => panel.style.display = "none");
  
          button.classList.add("active");
          const tab = button.getAttribute("data-tab");
          dialog.querySelector(`#${tab}`).style.display = "block";
  
          if (tab === "ongoing") {
            loadOngoingProjects(dialog);
          } else {
            loadCompletedProjects(dialog);
          }
        });
      });
  
      loadOngoingProjects(dialog);
  
      if (!dialog.open) dialog.showModal();
  
    });
});

// completedContainer.querySelectorAll(`.rbtn${rec.Projectname}`).forEach(btn => {
//   btn.addEventListener("click", () => {
//     alert("Reward Collected!", `${rec.Projectname}`);
//   });\



//DEMO CODE
function loadOngoingProjects(dialog) {
    const ongoingContainer = dialog.querySelector("#ongoing");
    ongoingContainer.innerHTML = "Loading ongoing projects...";

    setTimeout(() => {
      ongoingContainer.innerHTML = ``;
      prjProgList.forEach(rec =>{
          const prjBox = document.createElement('div');
          prjBox.classList.add('prjBox');
          prjBox.innerHTML = `
            <div class="projectCard">
              <p><strong>${rec.Projectname}</strong> - Description of project A <br>Time Left: </p>
              <button class="stopBtn sBtn${rec.Projectname}" onclick="showStopDialog('${rec.Projectname}')">Stop Project</button>
            </div>
          `;
        //   ongoingContainer.querySelectorAll(".stopBtn").forEach(btn => {
        //     btn.addEventListener("click", () => {
        //       alert("Project stopped!");
        //     });
        //   });
        document.getElementById('ongoing').appendChild(prjBox);
      });
    }, 500);
  }


let tempPrjName = null;
function showStopDialog(prjName) {
    tempPrjName = prjName;
    document.getElementById('confirmDialog').showModal();
}

function closeDialogPrj() {
    document.getElementById('confirmDialog').close();
    fetchPrjinProgress(credentials,BusinessDetails.BusinessName);
}

document.getElementById('yesBtn').addEventListener('click', () => {
    if (tempPrjName !== null) {
        updateStatusPrjandEmp(credentials,BusinessDetails.BusinessName,tempPrjName);
    }
    closeDialogPrj();
    fetchPrjinProgress(credentials,BusinessDetails.BusinessName);
});

  
function loadCompletedProjects(dialog) {
    const completedContainer = dialog.querySelector("#completed");
    completedContainer.innerHTML = "Loading completed projects...";

    setTimeout(() => {
        completedContainer.innerHTML = ``;
        prjCompList.forEach(rec =>{
            const prjBox = document.createElement('div');
            prjBox.classList.add('prjBox');
            prjBox.innerHTML = `
              <div class="projectCard">
                <p><strong>${rec.Projectname}</strong> - Finished on ${rec.ProjectCompTime.slice(0,10)}</p>
                <button class="rewardBtn rbtn${rec.Projectname}" onclick="updateStatusPrjandEmp(credentials,'${BusinessDetails.BusinessName}','${rec.Projectname}')">Collect Reward</button>
              </div>
              `;
              document.getElementById('completed').appendChild(prjBox);
            });
    }, 500);
}
//DEMO CODE

async function fetchgetPrjinProgress(username,businessname) {
    try {
        const response = await fetch('http://localhost:8008/ITbusiness/getPrjProgress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username:username, businessname:businessname }),
        });

        prjProgList = await response.json();
        if(prjProgList.retry){
            setTimeout(() => fetchgetPrjinProgress(username,businessname), 1000);
        }else{
            console.log("prg list",prjProgList);
            return prjProgList;
        }
    } catch (error) {
        console.error("❌ Error fetching IT user projects:", error);
        return null;
    }
}

async function fetchgetPrjCompleted(username,businessname) {
    try {
        const response = await fetch('http://localhost:8008/ITbusiness/getPrjComp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username:username, businessname:businessname }),
        });

        prjCompList = await response.json();
        if(prjCompList.retry){
            setTimeout(() => fetchgetPrjCompleted(username,businessname), 1000);
        }else{
            console.log("comp list",prjCompList);
            return prjCompList;
        }
    } catch (error) {
        console.error("❌ Error fetching IT user projects:", error);
        return null;
    }
}

async function updateStatusPrjandEmp(username,businessname,projectname) {
    console.log("testname",projectname);
    console.log("bname: ",BusinessDetails.BusinessName);
    try {
        const response = await fetch('http://localhost:8008/ITbusiness/changeStatusCompProj', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username:username, businessname:BusinessDetails.BusinessName, projectname:projectname }),
        });

        const data = await response.json();
        if(data.retry){
            setTimeout(() => updateStatusPrjandEmp(username,businessname,projectname), 1000);
        }else{
            console.log("updateStatus",data);
            fetchgetPrjCompleted(username,BusinessDetails.BusinessName);
            fetchgetPrjinProgress(username,BusinessDetails.BusinessName);
            loadCompletedProjects(dialog);
            loadOngoingProjects(dialog);
            return data;
        }
    } catch (error) {
        console.error("❌ Error changing status:", error);
        return null;
    }
}
