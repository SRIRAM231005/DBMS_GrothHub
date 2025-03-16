const credentials= localStorage.getItem('credentials');
console.log(credentials);

document.addEventListener("DOMContentLoaded", function () {
    const developmentTeam = document.getElementById("developmentTeam");
    const developerMenu = document.getElementById("developerMenu");

    developmentTeam.addEventListener("click", function () {
        if (developerMenu.style.display === "none" || developerMenu.style.display === "") {
            developerMenu.style.display = "block";
        } else {
            developerMenu.style.display = "none";
        }
    });
});

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

fetchShowDevList(credentials);



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
}