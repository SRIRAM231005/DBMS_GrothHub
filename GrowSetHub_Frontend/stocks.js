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


function selectInvestment(type) {
    // Remove 'active' from both cards
    document.getElementById("stocksCard").classList.remove("active");
    document.getElementById("realEstateCard").classList.remove("active");

    // Add 'active' to the selected one
    if (type === "stocks") {
        document.getElementById("stocksCard").classList.add("active");
    } else {
        document.getElementById("realEstateCard").classList.add("active");
        // window.location.href = "estate.html";
    }
}

//const credentials= JSON.parse(localStorage.getItem('credentials'));
//console.log(credentials);


let CompaniesWithStocks;
let UserInvestmentCompanies;
async function fetchCompaniesWithStocks(){
    try {
        const response = await fetch('http://localhost:8008/investment/CompaniesWithStocks');
        CompaniesWithStocks = await response.json();
        console.log(CompaniesWithStocks);
    } catch (error) {
        console.error("❌ Error fetching data:", error);
        return null;
    }
}

let TotalBoughtPrice;
let TotalProfit_Loss = 0;
async function fetchTotalBoughtPrice(){
    try {
        const response = await fetch('http://localhost:8008/investment/TotalBoughtPrice', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                 username: credentials
            }),
        });
        TotalBoughtPrice = await response.json();
        console.log("totot",TotalBoughtPrice);
        document.getElementById("total-invested").textContent = "$ " + formatNumber(TotalBoughtPrice[0].TotalBought);
        console.log("data",JSON.stringify(Number(TotalProfit_Loss) + Number(TotalBoughtPrice[0].TotalBought)));
        console.log("TotalProfit_Lossooolloaloa",TotalProfit_Loss);
        updateStocksBalanceinBalTable(JSON.stringify(Number(TotalProfit_Loss) + Number(TotalBoughtPrice[0].TotalBought)));
    } catch (error) {
        console.error("❌ Error fetching data:", error);
        return null;
    }
}
// localStorage.setItem("TotalProfit_Loss", JSON.stringify(Number(TotalProfit_Loss) + Number(TotalBoughtPrice[0].TotalBought)));
async function updateStocksBalanceinBalTable(StockBalVal){
    try {
        const response = await fetch('http://localhost:8008/user/StockBalValUpdate',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                 username: credentials,
                 StockBalVal:StockBalVal
            }),
        });
        const resultBal = await response.json();
        console.log(resultBal);
    } catch (error) {
        console.error("❌ Error fetching data:", error);
        return null;
    }
}

async function fetchUserInvestments(username){
    try {
        const response = await fetch('http://localhost:8008/investment/UserInvestments',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                 username: username
            }),
        });
        UserInvestmentCompanies = await response.json();
        console.log(UserInvestmentCompanies);
        DispUserInvestedTotData();
        DisplayCompaniesNotInvested();
    } catch (error) {
        console.error("❌ Error fetching data:", error);
        return null;
    }
}

fetchCompaniesWithStocks();
fetchUserInvestments(credentials);

setTimeout(() => {
    console.log("TotalProfit_Loss112", TotalProfit_Loss);
    document.getElementById("total-profit").textContent = "$ " + formatNumber(TotalProfit_Loss);
    fetchTotalBoughtPrice();
}, 1000);  // Delay in milliseconds



let UserInvestedTotalData = [];
let UserNotInvestedTotalData = [];
let CurrentPrice;
function DispUserInvestedTotData(){
    UserInvestmentCompanies.forEach((element) =>{
        let Logo, symbol, valuation, Profits, closePrice, profitClass, totalPrice;
        let buyPrice = element.buyPrice;
        //console.log(buyPrice);
        CompaniesWithStocks.forEach((element1) =>{
            if(element.CompanyName === element1.CompanyName){
                Logo = element1.logo;
                valuation = element1.Valuation;
                symbol = element1.symbol;
            }
        })
        fetchStockData1(symbol).then((price) => {
            closePrice = price || 0; 
            closePrice = Number(closePrice.toFixed(3));
            CurrentPrice=closePrice;
            Profits = ((closePrice * element.sharesOwned) - element.buyPrice);
            Profits = Number(Profits.toFixed(3));
            //buyPrice = Number(buyPrice.toFixed(2));
            totalPrice = Number(buyPrice) + Number(Profits);
            console.log(totalPrice);
            profitClass = Profits >= 0 ? "profit" : "loss";
    
            UserInvestedTotalData.push({
                logo: Logo,
                symbol: symbol,
                company: element.CompanyName,
                valuation: valuation,
                sharePrice: `$${closePrice}`,
                totalPrice: `$${totalPrice}`,
                profit: `$${Profits}`,
                profitClass: profitClass
            });
            TotalProfit_Loss += Profits;
            console.log("TotalProfit_Losslakalaka",TotalProfit_Loss);
    
            console.log("detailed info user",UserInvestedTotalData);
            loadInvestments();

        }).catch((error) => {
            console.error("❌ Error fetching stock data:", error);
        });
    });
}

function DisplayCompaniesNotInvested(){
    CompaniesWithStocks.forEach((element) =>{
        let a=0;
        let Logo, symbol, valuation, Profits, closePrice, profitClass, totalPrice;
        let buyPrice = element.buyPrice;
        Logo = element.logo;
        valuation = element.Valuation;
        symbol = element.symbol;
        //console.log(buyPrice);
        UserInvestmentCompanies.forEach((element1) =>{
            if(element.CompanyName === element1.CompanyName){
                a=1;
            }
        })
        if(a==0){
            UserNotInvestedTotalData.push({
                logo: Logo,
                symbol: symbol,
                company: element.CompanyName,
                valuation: valuation,
                sharePrice: `$${CurrentPrice}`,
                totalPrice: `$0`,
                profit: `$0`,
                profitClass: "profit"
            });
        }
    });
    console.log("Check1",UserNotInvestedTotalData);

}


async function fetchStockData1(symbol){
    //const symbol = "AAPL"; // Example stock
    const url = `http://localhost:8008/investment/stocks`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ symbol }),
        });

        const data = await response.json();
        

        if (!data.chart || !data.chart.result) {
            console.error("Invalid Data:", data);
            return;
        }

        const chartData = data.chart.result[0];
            const quotes = chartData.indicators.quote[0];
            const closePrices = quotes.close;
            return closePrices[closePrices.length-1];
            //console.log("close",closePrices);

    } catch (error) {
        console.error("Error fetching stock data:", error);
    }

}

const investments = [
    {
        logo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg",
        company: "Tesla",
        valuation: "$8.5T",
        sharePrice: "₹1200",
        profit: "+₹5,000",
        profitClass: "profit"
    },
    {
        logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
        company: "Apple",
        valuation: "₹20T",
        sharePrice: "₹1800",
        profit: "-₹2,000",
        profitClass: "loss"
    },
    {
        logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
        company: "Google",
        valuation: "₹15T",
        sharePrice: "₹1500",
        profit: "+₹3,500",
        profitClass: "profit"
    }
];

const companies = [
    { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
    { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
    { name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/Netflix_logo.svg" },
    { name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/8/89/Meta_Logo.svg" },
    { name: "Intel", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Intel_logo_%282020%2C_dark_blue%29.svg" }
];

function loadInvestments() {
    const investmentList = document.getElementById("investment-list");
    investmentList.innerHTML = "";
    console.log("1st",UserInvestedTotalData[0]);
    UserInvestedTotalData.forEach((inv,index) => {
        console.log("420");
        const row = document.createElement("tr");
        row.classList.add('Companystock');
        row.innerHTML = `
            <td><img src="${inv.logo}" alt="${inv.company}"></td>
            <td>${inv.company}</td>
            <td>${inv.valuation}</td>
            <td>${inv.sharePrice}</td>
            <td class="${inv.profitClass}">${inv.profit}</td>
        `;
        investmentList.appendChild(row);
    });
    document.querySelectorAll('.Companystock').forEach((div,index) => {
        div.addEventListener('click', () => {
            localStorage.setItem("StocksCompanyinfo", JSON.stringify(UserInvestedTotalData[index]));
            window.location.href = "IndividualStocks.html";
        });
    });
}

function openDialog() {
    document.getElementById("company-dialog").style.display = "block";
    const companyList = document.getElementById("company-list");
    companyList.innerHTML = "";
    console.log("5");
    console.log("Check",UserNotInvestedTotalData);
    UserNotInvestedTotalData.forEach(company => {
        const div = document.createElement("div");
        div.className = "company-item";
        div.innerHTML = `
            <img src="${company.logo}" alt="${company.company}" class="company-logo">
            <span>${company.company}</span>
        `;
        //div.onclick = () => alert(`Navigating to ${company.name}`);
        companyList.appendChild(div);
    });
    document.querySelectorAll('.company-item').forEach((div,index) => {
        div.addEventListener('click', () => {
            localStorage.setItem("StocksCompanyinfo", JSON.stringify(UserNotInvestedTotalData[index]));
            window.location.href = "IndividualStocks.html";
        });
    });
}

function closeDialog() {
    document.getElementById("company-dialog").style.display = "none";
}



//window.onload = loadInvestments;

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
  