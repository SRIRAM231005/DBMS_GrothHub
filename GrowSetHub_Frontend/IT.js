// Employee Data Array
const employees = [
    { name: "Junior Developers", salary: "57,606", count: 16, icon: "images/juniorDev.png", color: "green" },
    { name: "Middle Developers", salary: "316,005", count: 3, icon: "images/middleDev.png", color: "blue" },
    { name: "Senior Developers", salary: "0", count: 0, icon: "images/seniorDev.png", color: "gold" },
    { name: "Designers", salary: "71,861", count: 3, icon: "images/designer.png", color: "teal" },
    { name: "Team Leaders", salary: "415,075", count: 1, icon: "images/teamLeader.png", color: "dodgerblue" },
    { name: "Testers", salary: "525,293", count: 2, icon: "images/tester.png", color: "lightblue" }
];

// Get Employee List Container
const employeeList = document.getElementById("employeeList");

// Generate Employee Cards
employees.forEach(emp => {
    const employeeDiv = document.createElement("div");
    employeeDiv.classList.add("employee");
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
});



username = '';


async function fetchITMainBusiness(username) {
    try {
        const response = await fetch('/ITmainbusiness', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username }),
        });

        const data = await response.json();
        return data; // Return fetched data
        console.log(data);
    } catch (error) {
        console.error("❌ Error fetching IT main business:", error);
        return null;
    }
}

async function fetchITUserProjects(username) {
    try {
        const response = await fetch('/ITUserProjects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username }),
        });

        const data = await response.json();
        return data;
        console.log(data);
    } catch (error) {
        console.error("❌ Error fetching IT user projects:", error);
        return null;
    }
}

async function fetchITUserEmployees(username) {
    try {
        const response = await fetch('/ITUserEmployees', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username }),
        });

        const data = await response.json();
        return data;
        console.log(data);
    } catch (error) {
        console.error("❌ Error fetching IT user employees:", error);
        return null;
    }
}

async function fetchITProjectsEmployees() {
    try {
        const response = await fetch('/ITProjectsEmployees', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        return data;
        console.log(data);
    } catch (error) {
        console.error("❌ Error fetching IT projects employees:", error);
        return null;
    }
}

fetchITMainBusiness();
fetchITUserProjects();
fetchITUserEmployees();
fetchITProjectsEmployees();