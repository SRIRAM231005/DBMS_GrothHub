const credentials= JSON.parse(localStorage.getItem('credentials'));
console.log(credentials);


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



const propertyList = document.querySelector('.property-list');
const filterButtons = document.querySelectorAll('.filter-btn');

fetchGetAllRealEstatesbelongingtoUser(credentials);
getNumPropUser(credentials);

// Function to create property card HTML
function createPropertyCard(property) {
    return `
        <div class="property-card">
            <img src="${property.image}" alt="House">
            <div class="property-info">
                <h2 class="price">$ ${property.price.toLocaleString()}</h2>
                <div class="info" style="display: flex; justify-content: space-between; align-items: center;">
                    <div class="location">
                        <span class="location-icon">📍</span>
                        <span>${property.location}</span>
                    </div>
                    <div><img src="images/info.png" alt="Property Info" style="width: 24px; height: 24px; object-fit: contain;"></div>
                </div>
                <button class="sell-btn sellbtn${property.idx}" onclick="showSellDialog(credentials,${property.idx})">Sell</button>
            </div>
        </div>
    `;
}

// Function to render property list
function renderProperties(sortedProperties) {
    propertyList.innerHTML = sortedProperties.map(property => 
        createPropertyCard(property)
    ).join('');
}


filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');

        // Sort properties based on button text
        const sortedProperties = [...properties1].sort((a, b) => {
            if (button.textContent === 'Expensive first') {
                return b.price - a.price;
            } else {
                return a.price - b.price;
            }
        });

        // Render sorted properties
        renderProperties(sortedProperties);
    });
});


let properties1;
async function fetchGetAllRealEstatesbelongingtoUser(username){
    try {
        const response = await fetch('http://localhost:8008/investment/getAllRealEstatesBought', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username
            }),
        });
        properties1 = await response.json();
        console.log("propertiesList:",properties1);
        renderProperties([...properties1].sort((a, b) => b.price - a.price));
        //return data;
    } catch (error) {
        console.error("❌ Error fetching properties List :", error);
        return null;
    }
}

async function sellProperty(username,idx) {
    try {
        const response = await fetch('http://localhost:8008/investment/sellProperty', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                idx: idx
            }),
        });
        const result = await response.json();
        console.log("Property sold successfully:", result);
        fetchGetAllRealEstatesbelongingtoUser(credentials);
        getNumPropUser(credentials);
    } catch (error) {
        console.error("❌ Error fetching properties List :", error);
        return null;
    }
}

async function getNumPropUser(username) {
    try {
        const response = await fetch('http://localhost:8008/investment/getCountofPropBought', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username
            }),
        });
        const result = await response.json();
        console.log("Properties fetched:", result);
        if(result[0].CountProp===1){
            document.querySelector(".total-properties").textContent = `${result[0].CountProp} Property Owned`;
        }else{
            document.querySelector(".total-properties").textContent = `${result[0].CountProp} Properties Owned`;
        }
        console.log(document.querySelector(".total-properties"));
        return result;
    } catch (error) {
        console.error("❌ Error fetching number of properties :", error);
        return null;
    }
}


let tempCredentials = null;
let tempIdx = null;

function showSellDialog(credentials, idx) {
  tempCredentials = credentials;
  tempIdx = idx;
  document.getElementById('confirmDialog').showModal();
}

function closeDialog() {
  document.getElementById('confirmDialog').close();
}

document.getElementById('yesBtn').addEventListener('click', () => {
  if (tempCredentials !== null && tempIdx !== null) {
    sellProperty(tempCredentials, tempIdx);
  }
  closeDialog();
});

