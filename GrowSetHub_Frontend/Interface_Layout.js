const credentials= JSON.parse(localStorage.getItem('credentials'));
console.log(credentials);

const PrjInfo = JSON.parse(localStorage.getItem('PrjInfo'));
console.log(PrjInfo);

const BusinessDetails = JSON.parse(localStorage.getItem('UserBusinessInfo'));
console.log(BusinessDetails);



// document.addEventListener("DOMContentLoaded", function () {
//     const developmentTeam = document.getElementById("developmentTeam");
//     const developerMenu = document.getElementById("developerMenu");

//     developmentTeam.addEventListener("click", function () {
//         if (developerMenu.style.display === "none" || developerMenu.style.display === "") {
//         console.log("5");
//         developerMenu.style.display = "block";
//         } else {
//         console.log("6");
//         developerMenu.style.display = "none";
//         }
//     });
// });


let arr = ["Developers", "Designers", "Team Leaders", "Testers"];
for (let index = 0; index < arr.length; index++) {
    const element = arr[index];
    console.log(element);
    fetchShowDevList(credentials,element);
}

let developers;
async function fetchShowDevList(username,role){
    console.log(role);
    try {
        const response = await fetch('http://localhost:8008/ITbusiness/showDevList', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                 username: username,
                 role: role
            }),
        });
        developers = await response.json();
        console.log("Developers:",developers);
        showDevList(developers,role);
        //return data;
    } catch (error) {
        console.error("❌ Error fetching developers list:", error);
        return null;
    }
}

//fetchShowDevList(credentials);

function getIndex(role){
    for(let i=0;i<4;i++){
        if(arr[i] === role){
            return i;
        }
    }
}


document.addEventListener("DOMContentLoaded", function () {
    // Ensure PrjList exists and has enough values
    if (PrjInfo) {
        document.querySelector(".c1").textContent = `</> ${PrjInfo.NoOfDev}`;
        document.querySelector(".c2").textContent = `🎨 ${PrjInfo.NoOfDesigner}`;
        document.querySelector(".c3").textContent = `👥 ${PrjInfo.NoOfTeamLeader}`;
        document.querySelector(".c4").textContent = `🛠 ${PrjInfo.NoOfTester}`;

        document.querySelector(".header h2").textContent = PrjInfo.Projectname;
        document.querySelector(".header h1").textContent = "$"+PrjInfo.Cost;
    } else {
        console.error("❌ PrjList is missing or does not contain enough elements.");
    }
});

<<<<<<< Updated upstream

let selectedEmployees = [];

function showDevList(List,role){
    console.log("12",role);
    let index = getIndex(role);
    console.log(index);
    const ListBtn = document.querySelector(`.team${index+1}`);
    console.log(ListBtn);
    // const DevelopersListButton = document.getElementById('developmentTeam');
    // console.log(DevelopersListButton);
        ListBtn.addEventListener('click', ()=>{
            // Render the developers list in the UI
            let developersList = document.querySelector(`.developer-list${index+1}`); // Ensure this div exists in your HTML
            console.log("11:",developersList);
            developersList.innerHTML = ''; // Clear previous data

            // Ensure the developer list is visible
            // document.getElementById('developerMenu').style.display = 'block';

            // Create and append header row
            const header = document.createElement('div');
            header.classList.add('developer-header');
            header.innerHTML = `
                <span style="flex: 0.1;"></span> <!-- Empty space for checkbox -->
                <span style="flex: 1;">Employee Name</span>
                <span style="flex: 1;">Salary</span>
                <span style="flex: 1;">Skill</span>
            `;
            developersList.appendChild(header);
            //console.log("5",developers);
            List.forEach(dev => {
                const devElement = document.createElement('div');
                devElement.classList.add('developer-item');
                devElement.innerHTML = `
                    <input type="checkbox" class="emp-checkbox" data-name="${dev.Employeename}">
                    <span>${dev.Employeename}</span>
                    <span>$${dev.Salary}</span>
                    <span>${dev.Skill}</span>
                `;
                developersList.appendChild(devElement);
            });
    
            // Show the developers menu
            const ListDisplay = document.querySelector(`.developer-menu${index+1}`);
            if (!ListDisplay.classList.contains("expanded")) {
                ListDisplay.classList.add("expanded");
            } else {
                ListDisplay.classList.remove("expanded");
            }

            document.querySelector(`.btn${index}`).addEventListener('click', () => {
                console.log('Confirm button clicked!');
    
                document.querySelectorAll('.emp-checkbox:checked').forEach(checkbox => {
                    selectedEmployees.push(checkbox.getAttribute('data-name'));
                });
                console.log("1st check:",selectedEmployees);
    
            });
        });        
}



document.querySelector('.footer button').addEventListener('click', () => {
    console.log('Start Project button clicked!');
    console.log("Employees Selected:",selectedEmployees);

    if(selectedEmployees.length===0){
        alert("Select some Employees to start the project first!!");
    }
    else{
        console.log("55");
        selectedEmployees.forEach(empName =>{
            fetchChooseEmpforPrj(credentials,BusinessDetails.BusinessName,empName,PrjInfo.Projectname);
        });
        selectedEmployees.length=0;
    }

});

// document.addEventListener("DOMContentLoaded", function () {
//     const developmentTeam = document.getElementById("developmentTeam");
//     const developerMenu = document.getElementById("developerMenu");

//     developmentTeam.addEventListener("click", function () {
//         if (developerMenu.style.maxHeight) {
//             developerMenu.style.maxHeight = null; // Collapse
//         } else {
//             developerMenu.style.maxHeight = developerMenu.scrollHeight + "px"; // Expand
//         }
//     });
// });

// document.addEventListener("DOMContentLoaded", function () {
//     const developmentTeam = document.getElementById("developmentTeam");
//     const developerMenu = document.getElementById("developerMenu");
//     const container = document.querySelector(".container");

//     developmentTeam.addEventListener("click", function () {
//         if (!developerMenu.classList.contains("expanded")) {
//             developerMenu.classList.add("expanded");
//         } else {
//             developerMenu.classList.remove("expanded");
//         }
//     });
// });

let EmpDetails;

async function fetchChooseEmpforPrj(username,businessname,empName,prjname) {
    try {
        const response = await fetch('http://localhost:8008/ITbusiness/BusEmpPrjStart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                username: username,
                businessname: businessname,
                empName: empName,
                prjname: prjname
            }),
        });

        EmpDetails = await response.json();
        console.log(EmpDetails);
        //return data; // Return fetched data
    } catch (error) {
        console.error("❌ Error fetching IT main business:", error);
        return null;
    }
=======
let developers;
async function fetchShowDevList(username){
    console.log(username);
    try {
        const response = await fetch('http://localhost:8008/ITbusiness/showDevList', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                 username: username
            }),
        });
        developers = await response.json();
        console.log(developers);
        showDevList();
        //return data;
    } catch (error) {
        console.error("❌ Error fetching developers list:", error);
        return null;
    }
}

fetchShowDevList('user');



function showDevList(){
    const DevelopersListButton = document.getElementById('developmentTeam');
    console.log(DevelopersListButton);
        DevelopersListButton.addEventListener('click', ()=>{
            
                
                
                // Render the developers list in the UI
                const developersList = document.querySelector('.developer-list'); // Ensure this div exists in your HTML
                developersList.innerHTML = ''; // Clear previous data
                console.log(developers);
                
                developers.forEach(dev => {
                    const devElement = document.createElement('div');
                    devElement.classList.add('developer-item');
                    devElement.innerHTML = `
                        <span>${dev.Employeename}</span>
                        <span>$${dev.Salary}</span>
                        <span>${dev.Skill}</span>
                    `;
                    developersList.appendChild(devElement);
                });
        
                // Show the developers menu
                document.getElementById('developerMenu').style.display = 'block';
        
            
        
        // ProjectsAndEmployees.Projects.forEach(element =>{
        //     const ProjectsBox = document.createElement('div');
        //     ProjectsBox.classList.add('ProjectsBox');
        //     ProjectsBox.innerHTML = `<div class="project-card" onclick = "openInterfacePage()">
        //             <div class="project-header" style="display: flex; align-items: center; background: #5a0fb1; color:white ;margin-bottom:10px; padding: 10px; border-top-left-radius: 8px; border-top-right-radius: 8px; font-size: 20px;">
        //                 <img src="images/project_icon.png">
        //                 <span style="padding-left: 5px;">${element.Projectname}</span>
        //             </div>
        //             <div class="project-details" style="font-size:20px;">
        //                 <div>
        //                     <span><img src="${employees[0].icon}"></span> ${element.NoOfDev}
        //                     <span><img src="${employees[3].icon}"></span> ${element.NoOfDesigner}
        //                     <span><img src="${employees[4].icon}"></span> ${element.NoOfTeamLeader}
        //                     <span><img src="${employees[5].icon}"></span> ${element.NoOfTester}
        //                 </div>
        //                 <div class="project-cost" style="margin:10px; padding-bottom:10px;">
        //                     💰 $${element.Cost}
        //                 </div>
        //             </div>
        //         </div>`;
        //     document.querySelector('.ProjectsBody').appendChild(ProjectsBox);
        // })
        // dialog.showModal();

        });
>>>>>>> Stashed changes
}