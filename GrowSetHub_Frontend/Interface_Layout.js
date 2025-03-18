const credentials= JSON.parse(localStorage.getItem('credentials'));
console.log(credentials);

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
                
                developers.forEach(dev => {
                    const devElement = document.createElement('div');
                    devElement.classList.add('developer-item');
                    devElement.innerHTML = `
                        <input type="checkbox">
                        <span>${dev.Employeename}</span>
                        <span>$${dev.Salary}</span>
                        <span>${dev.Skill}</span>
                    `;
                    developersList.appendChild(devElement);
                });
        
                // Show the developers menu
                document.getElementById('developerMenu').style.display = 'block';
        });
}

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

document.addEventListener("DOMContentLoaded", function () {
    const developmentTeam = document.getElementById("developmentTeam");
    const developerMenu = document.getElementById("developerMenu");
    const container = document.querySelector(".container");

    developmentTeam.addEventListener("click", function () {
        if (!developerMenu.classList.contains("expanded")) {
            developerMenu.classList.add("expanded");
        } else {
            developerMenu.classList.remove("expanded");
        }
    });
});
