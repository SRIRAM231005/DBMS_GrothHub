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
    document.getElementById("stocksCard").classList.remove("active");
    document.getElementById("realEstateCard").classList.remove("active");
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
        if(CompaniesWithStocks.retry){
            setTimeout(() => fetchCompaniesWithStocks(), 1000);
        }else{
            console.log(CompaniesWithStocks);
        }
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
        if(TotalBoughtPrice.retry){
            setTimeout(() => fetchTotalBoughtPrice(), 1000);
        }else{
            console.log("totot",TotalBoughtPrice[0].TotalBought);
            //updateStocksBalanceinBalTable(JSON.stringify(/*Number(TotalProfit_Loss) +*/ Number(TotalBoughtPrice[0].TotalBought)));
        }
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
        if(resultBal.retry){
            setTimeout(() => updateStocksBalanceinBalTable(StockBalVal), 1000);
        }else{
            console.log(resultBal);
        }
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
        if(UserInvestmentCompanies.retry){
            setTimeout(() => fetchUserInvestments(username), 1000);
        }else{
            console.log(UserInvestmentCompanies);
            DispUserInvestedTotData();
            DisplayCompaniesNotInvested();
        }
    } catch (error) {
        console.error("❌ Error fetching data:", error);
        return null;
    }
}

fetchCompaniesWithStocks();
fetchTotalBoughtPrice();
fetchUserInvestments(credentials);

/*setTimeout(() => {
    console.log("TotalProfit_Loss112", TotalProfit_Loss);
    if(TotalProfit_Loss){
        document.getElementById("total-profit").textContent = "$ " + formatNumber(TotalProfit_Loss);
    }else{
        document.getElementById("total-profit").textContent = "$ 0";
    }
    console.log("we reached here");
    if(TotalBoughtPrice && TotalProfit_Loss){
        console.log("we reached here",TotalBoughtPrice[0].TotalBought);
        document.getElementById("total-invested").textContent = "$ " + formatNumber(TotalBoughtPrice[0].TotalBought);
        document.getElementById("total-profit").textContent = "$ " + formatNumber(TotalProfit_Loss);
        document.getElementById("total-value").textContent = "$ " + formatNumber(TotalProfit_Loss + TotalBoughtPrice[0].TotalBought);
    }else{
        document.getElementById("total-invested").textContent = "$ 0";
        document.getElementById("total-profit").textContent = "- -";
        document.getElementById("total-value").textContent = "$ 0";
    }
}, 1000);   Delay in milliseconds*/

function updateValuesInHeroSection(profitLoss){
    TotalProfit_Loss = profitLoss;
    console.log("we ach",TotalBoughtPrice);
    if(TotalBoughtPrice[0].TotalBought != null){
        document.getElementById("total-invested").textContent = "$ " + formatNumber(TotalBoughtPrice[0].TotalBought);
        document.getElementById("total-profit").textContent = "$ " + formatNumber(TotalProfit_Loss);
        document.getElementById("total-value").textContent = "$ " + formatNumber(Number(TotalProfit_Loss) + Number(TotalBoughtPrice[0].TotalBought));
    }else{
        console.log("we reached here");
        document.getElementById("total-invested").textContent = "$ 0";
        document.getElementById("total-profit").textContent = "- -";
        document.getElementById("total-value").textContent = "$ 0";
    }
}

let UserInvestedTotalData = [];
let UserNotInvestedTotalData = [];
let CurrentPrice;
function DispUserInvestedTotData(){
    let Profits; let flag = 0; let totalProfitsLoss = 0;
    UserInvestmentCompanies.forEach((element) =>{
        let Logo, symbol, valuation, closePrice, profitClass, totalPrice;
        let buyPrice = element.buyPrice;
        flag = 1;
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
            Profits = ((closePrice * element.sharesOwned) - (element.buyPrice * element.sharesOwned));
            Profits = Number(Profits.toFixed(3));
            console.log("closePrice",closePrice);
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
            totalProfitsLoss += Profits;
            console.log("TotalProfit_Losslakalaka",totalProfitsLoss);
            updateValuesInHeroSection(totalProfitsLoss);
            updateStocksBalanceinBalTable(JSON.stringify(Number(totalProfitsLoss) + Number(TotalBoughtPrice[0].TotalBought)));
    
            console.log("detailed info user",UserInvestedTotalData);
            loadInvestments();

        }).catch((error) => {
            console.error("❌ Error fetching stock data:", error);
        });
    });
    if(flag === 0){
        updateValuesInHeroSection(Profits);
        updateStocksBalanceinBalTable(JSON.stringify(Profits + Number(TotalBoughtPrice[0].TotalBought)));
    }
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

    } catch (error) {
        console.error("Error fetching stock data:", error);
    }

}

/*const investments = [
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
];*/

/*const companies = [
    { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
    { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
    { name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/Netflix_logo.svg" },
    { name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/8/89/Meta_Logo.svg" },
    { name: "Intel", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Intel_logo_%282020%2C_dark_blue%29.svg" }
];*/

function loadInvestments() {
    const investmentList = document.getElementById("investment-list");
    const startingDiv = document.querySelector(".startingDiv");
    investmentList.innerHTML = "";
    startingDiv.innerHTML = "";
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
    console.log("we have reached here");
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
  