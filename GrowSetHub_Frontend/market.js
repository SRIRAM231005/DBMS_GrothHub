const credentials= JSON.parse(localStorage.getItem('credentials'));
console.log(credentials);
const BalanceMoney = JSON.parse(localStorage.getItem('BalanceMoney'));
console.log(BalanceMoney);

document.querySelector(".balance").textContent = "Balance: $" + BalanceMoney;


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

fetchGetAllRealEstatesNotbelongingtoUser(credentials);


function createPropertyCard(property) {
    console.log("here",property.price);
    return `
        <div class="property-card">
            <img src="${property.image}" alt="House">
            <div class="property-info">
                <h2 class="price">$ ${formatNumber(property.price)}</h2>
                <div class="info" style="display: flex; justify-content: space-between; align-items: center;">
                    <div class="location">
                        <span class="location-icon">📍</span>
                        <span>${property.location}</span>
                    </div>
                    <div><img src="images/info.png" alt="Property Info" style="width: 24px; height: 24px; object-fit: contain;"></div>
                </div>
                <button class="buy-btn buybtn${property.idx}" onclick="showBuyDialog(credentials,${property.idx},${property.price})">Buy</button>
            </div>
        </div>
    `;
}


function renderProperties(sortedProperties) {
    propertyList.innerHTML = sortedProperties.map(property => 
        createPropertyCard(property)
    ).join('');
}


filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const sortedProperties = [...properties1].sort((a, b) => {
            if (button.textContent === 'Expensive first') {
                return b.price - a.price;
            } else {
                return a.price - b.price;
            }
        });

        renderProperties(sortedProperties);
    });
});


let properties1;
async function fetchGetAllRealEstatesNotbelongingtoUser(username){
    try {
        const response = await fetch('http://localhost:8008/investment/getAllRealEstatesNotBought', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username
            }),
        });
        properties1 = await response.json();
        console.log("propertiesList:",properties1);
        localStorage.setItem('numOfPropertiesNotBought', JSON.stringify(properties1.length));
        
        renderProperties([...properties1].sort((a, b) => b.price - a.price));

    } catch (error) {
        console.error("❌ Error fetching properties List :", error);
        return null;
    }
}

async function buyProperty(username,idx) {
    try {
        const response = await fetch('http://localhost:8008/investment/buyProperty', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                idx: idx
            }),
        });
        const result = await response.json();
        console.log("Property bought successfully:", result);
        fetchGetAllRealEstatesNotbelongingtoUser(credentials);

    } catch (error) {
        console.error("❌ Error fetching properties List :", error);
        return null;
    }
}

let tempCredentials = null;
let tempIdx = null;
let tempPrice = null;

function showBuyDialog(credentials, idx, price) {
  tempCredentials = credentials;
  tempIdx = idx;
  tempPrice = price;
  document.getElementById('confirmDialog').showModal();
}

function closeDialog() {
  document.getElementById('confirmDialog').close();
}

document.getElementById('yesBtn').addEventListener('click', () => {
  if (tempCredentials !== null && tempIdx !== null && tempPrice !== null) {
    if (BalanceMoney < tempPrice) {
      alert("You don't have enough money to buy this property!!");
      closeDialog();
      return;
    }
    buyProperty(tempCredentials, tempIdx);
  }
  closeDialog();
});


function formatNumber(value) {
    let num = parseFloat(value); 
    if (isNaN(num)) return value; 
    if (Math.abs(num) >= 1e9) {
        return (num / 1e9).toFixed(2) + "B"; 
    } else if (Math.abs(num) >= 1e6) {
        return (num / 1e6).toFixed(2) + "M"; 
    } else {
        return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
}
    