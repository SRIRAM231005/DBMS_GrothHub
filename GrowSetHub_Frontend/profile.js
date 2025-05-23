const credentials= JSON.parse(localStorage.getItem('credentials'));
console.log(credentials);

const propNotBought = JSON.parse(localStorage.getItem('numOfPropertiesNotBought'));
// console.log("Properties Not Bought: ",localStorage.getItem('numOfPropertiesNotBought'));
const propBought = JSON.parse(localStorage.getItem('numOfPropertiesBought'));
// console.log("Properties Bought: ",propBought);
const totalProp = Number(propNotBought) + Number(propBought);
// console.log("Total Properties: ",totalProp);
const stocks = JSON.parse(localStorage.getItem('TotalProfit_Loss'));
// console.log("Total Stocks: ",stocks);


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



let Balance;
let Statistics;
async function fetchBalance(username){
    try {
        const response = await fetch('http://localhost:8008/user/Balance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username }),
        });

        Balance = await response.json();
        console.log('Balance:',Balance);
        localStorage.setItem('BalanceMoney', JSON.stringify(formatNumber(Balance[0].Balance)));
        UpdateBalance();
        //return data; // Return fetched data
    } catch (error) {
        console.error("❌ Error fetching IT main business:", error);
        return null;
    }
}

async function fetchStatistics(username){
    try {
        const response = await fetch('http://localhost:8008/user/Statistics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username }),
        });

        Statistics = await response.json();
        console.log('Statistics:',Statistics);
        UpdateStatistics();
        //return data; // Return fetched data
    } catch (error) {
        console.error("❌ Error fetching IT main business:", error);
        return null;
    }
}

fetchBalance(credentials);
fetchStatistics(credentials);
function UpdateBalance(){
    
        // Update the total fortune
        //const totalFortune = balance + business + stocks + realEstate;
        let NetFortune = Number(Balance[0].Balance) + Number(Balance[0].Business) + Number(Balance[0].Stocks) + Number(Balance[0].Real_Estate);
        document.querySelector(".fortune h1").textContent = `$${formatNumber(NetFortune)}`;
    
        // Update individual asset values
        document.querySelector(".card:nth-child(1) p").textContent = `$ ${formatNumber(Balance[0].Balance)}`;
        document.querySelector(".card:nth-child(2) p").textContent = `$ ${formatNumber(Balance[0].Business)}`;
        document.querySelector(".card:nth-child(3) p").textContent = `$ ${formatNumber(Balance[0].Stocks)}`;
        document.querySelector(".card:nth-child(4) p").textContent = `$ ${formatNumber(Balance[0].Real_Estate)}`;
    
        // Update progress bar widths
        const total = NetFortune;
        document.querySelector(".bar.balance").style.width = (Balance[0].Balance / total * 100) + "%";
        document.querySelector(".bar.business").style.width = (Balance[0].Business / total * 100) + "%";
        document.querySelector(".bar.stocks").style.width = (Balance[0].Stocks / total * 100) + "%";
        document.querySelector(".bar.real-estate").style.width = (Balance[0].Real_Estate / total * 100) + "%";
    
}

function UpdateStatistics(){
    const values = document.querySelectorAll(".stats-card .section .value");
    console.log("check values",values[0]);

    values[0].textContent = `${Statistics.NoOfBusiness}`; 
    values[1].textContent = `${Statistics.Real_estate} of ${totalProp}`; 
    //values[2].textContent = `${boughtOut} of ${boughtOutTotal}`; 
    
    // Update Earned Section
    values[3].textContent = `$${formatNumber(Statistics.E_business)}`; 
    values[4].textContent = `$${formatNumber(Statistics.E_rent)}`; 
    values[5].textContent = `$${formatNumber(Statistics.E_trading)}`; 
    values[6].textContent = `$${formatNumber(Statistics.E_dividends)}`; 
}

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
