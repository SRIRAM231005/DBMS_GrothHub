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
    
            console.log(UserInvestedTotalData);
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





    
    // Fetch and display the stock chart
    //fetchStockData();



    /*async function fetchStockData() {
        const apiKey = "WXSR1ON3S178PBH3";  // Replace with your own API key 48GDL8ELMP8O88JM
        const symbol = "AAPL";
        const interval = "60min"; 
        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}&apikey=${apiKey}`;
    
        try {
            const response = await fetch(url);
            const data = await response.json();
    
            if (!data["Time Series (60min)"]) {
                console.error("Invalid Data:", data);
                return;
            }
    
            const timeSeries = data["Time Series (60min)"];
            const latestTime = new Date(Object.keys(timeSeries)[0]); // Latest timestamp
            const twelveHoursAgo = new Date(latestTime.getTime() - (12 * 60 * 60 * 1000)); // Subtract 12 hours
    
            const stockData = Object.keys(timeSeries)
                .map(time => new Date(time.replace(" ", "T"))) // Convert string to Date
                .filter(time => time >= twelveHoursAgo) // Keep only last 12 hours
                .map(time => {
                    const timeKey = time.toISOString().slice(0, 19).replace("T", " "); // Match AlphaVantage format
                    return {
                        x: time, // Time
                        o: parseFloat(timeSeries[timeKey]["1. open"]),
                        h: parseFloat(timeSeries[timeKey]["2. high"]),
                        l: parseFloat(timeSeries[timeKey]["3. low"]),
                        c: parseFloat(timeSeries[timeKey]["4. close"])
                    };
                })
                .reverse(); // Reverse for chronological order
    
            drawStockChart(stockData);
        } catch (error) {
            console.error("Error fetching stock data:", error);
        }
    }
    
    // Draw Candlestick Chart
    function drawStockChart(stockData) {
        const ctx = document.getElementById("stockChart").getContext("2d");
    
        new Chart(ctx, {
            type: "candlestick",
            data: {
                datasets: [{
                    label: "AAPL Stock Prices",
                    data: stockData,
                    borderColor: "black",
                    color: {
                        up: "green",
                        down: "red",
                        unchanged: "gray"
                    }
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: "time",
                        time: {
                            unit: "hour"
                        }
                    },
                    y: {
                        beginAtZero: false,
                        min: Math.min(...stockData.map(d => d.l)) - 5,
                        max: Math.max(...stockData.map(d => d.h)) + 5
                    }
                }
            }
        });
    }
    
    // Fetch and display stock chart
    fetchStockData();*/
    



    ////real function////




    /*async function fetchStockData() {
        const symbol = "AAPL"; // Example stock
        const url = `http://localhost:8008/investment/stocks`;
    
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symbol }),
            });
    
            const data = await response.json();
            console.log("data : ",data);
    
            if (!data.chart || !data.chart.result) {
                console.error("Invalid Data:", data);
                return;
            }
    
            const chartData = data.chart.result[0];
            console.log("hello",chartData);
            const timestamps = chartData.timestamp;
            const quotes = chartData.indicators.quote[0];

            const openPrices = quotes.open;
            console.log("open",openPrices);
            const closePrices = quotes.close;
            console.log("close",closePrices);
            const highPrices = quotes.high;
            console.log("high",highPrices);
            const lowPrices = quotes.low;
            console.log("low",lowPrices);

            // Convert timestamps to readable format
            const labels = timestamps.map(ts => new Date(ts * 1000).toLocaleTimeString());

            // Prepare candlestick data
            const candlestickData = timestamps.map((ts, i) => ({
                x: ts * 1000, // Convert to milliseconds for Chart.js
                o: openPrices[i],
                h: highPrices[i],
                l: lowPrices[i],
                c: closePrices[i]
            }));
    
            drawStockChart(candlestickData);
        } catch (error) {
            console.error("Error fetching stock data:", error);
        }
    }
    
    function drawStockChart(data) {
        const ctx = document.getElementById("stockChart").getContext("2d");
        
        if (window.myChart) {
            window.myChart.destroy();
        }
    
        window.myChart = new Chart(ctx, {
            type: "candlestick",
            data: {
                datasets: [{
                    label: "Stock Price",
                    data: data,
                    borderColor: "black",
                    color: {
                        up: "green",
                        down: "red",
                        unchanged: "grey"
                    }
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: "time",
                        time: {
                            unit: "minute",
                            tooltipFormat: "HH:mm",
                            displayFormats: {
                                minute: "HH:mm"
                            }
                        }
                    },
                    y: {
                        beginAtZero: false
                    }
                },
                plugins: {
                    legend: {
                        display: true
                    }
                }
            }
        });
    
        console.log("✅ Chart rendered successfully!");
    }
    
    // Fetch and display stock chart
    fetchStockData();
    //fetchCompanyData();

    async function fetchCompanyData(){
        const symbol = "AAPL"; // Example stock
        const url = `http://localhost:8008/investment/company`;
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symbol }),
            });
    
            const Companydata = await response.json();
            console.log("Companydata : ",Companydata);
        } catch (error) {
            console.error("Error fetching Company data:", error);
        }
    }*/
    