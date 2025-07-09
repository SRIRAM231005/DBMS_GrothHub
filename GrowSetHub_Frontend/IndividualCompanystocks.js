const StocksCompanyinfo= JSON.parse(localStorage.getItem('StocksCompanyinfo'));
console.log(StocksCompanyinfo);
const credentials= JSON.parse(localStorage.getItem('credentials'));
console.log("Cred:",credentials);
const symbol = StocksCompanyinfo.symbol;
console.log("Sym:",symbol);

document.getElementById('company-logo').src = StocksCompanyinfo.logo;
let CurrentSharePrice;


async function fetchStockData() {
    //const symbol = "AAPL";
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
        CurrentSharePrice = closePrices[closePrices.length-1];
        CurrentSharePrice = Number(CurrentSharePrice.toFixed(3));
        const highPrices = quotes.high;
        console.log("high",highPrices);
        const lowPrices = quotes.low;
        console.log("low",lowPrices);

        const labels = timestamps.map(ts => new Date(ts * 1000).toLocaleTimeString());
        
        const candlestickData = timestamps.map((ts, i) => ({
            x: ts * 1000, 
            o: openPrices[i],
            h: highPrices[i],
            l: lowPrices[i],
            c: closePrices[i]
        }));

        timestamps.forEach((ts, i) => {
            console.log(`Index ${i}: ${new Date(ts * 1000).toLocaleString()}`);
        });

        drawStockChart(candlestickData);
        displayDetails();
    } catch (error) {
        console.error("Error fetching stock data:", error);
    }
}

function drawStockChart(data) {
    const ctx = document.getElementById("stockChart").getContext("2d");
    
    if (window.myChart) {
        window.myChart.destroy();
    }

    //const prices = data.map(d => [d.o, d.h, d.l, d.c]).flat();
    //const filteredData = data.filter(entry => entry.value !== null);
    const prices = data
        .map(d => [d.o, d.h, d.l, d.c])
        .flat()
        .filter(price => price !== null && price !== undefined);
    console.log("updated:",prices); 
    let filteredData = data.filter(d => d.o !== null && d.c !== null);
    let filteredData1 = data.filter(d => d.o !== null && d.o !== undefined && d.c !== null && d.c !== undefined);
    console.log("updated1:",filteredData1);
    console.log("updata:",data);
    let filteredTimestamps = filteredData1.map(d => d.x);
    console.log("times:",filteredTimestamps);
    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    const processedData = filteredData1.map((entry, idx) => ({
        x: idx, // use index as x-axis
        o: entry.o,
        h: entry.h,
        l: entry.l,
        c: entry.c
    }));
    const labels = filteredData1.map(d => formatTime(new Date(d.x))); // eg. "12:31"
    console.log("processed:",processedData);
    console.log("hey:",filteredTimestamps.map(data => formatTime(data)));
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const buffer = (maxPrice - minPrice) * 0.1; // 10% buffer for better visibility
    console.log("Min Price:", minPrice, "Max Price:", maxPrice);

    window.myChart = new Chart(ctx, {
        type: "candlestick",
        data: {
            labels: labels,
            datasets: [{
                label: "Stock Price",
                data: processedData,
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
                    type: "category",
                    /*time: {
                        unit: "minute",
                        tooltipFormat: "HH:mm",
                        displayFormats: {
                            minute: "HH:mm"
                        }
                    },*/
                    ticks: {
                        source: "data",
                        autoSkip: true,
                        maxTicksLimit: 10,
                        font:{
                            size:14,
                        }
                    }
                    //type: "category", // Use categorical scale instead of time
                    //labels: filteredTimestamps.map(formatTime) // Convert timestamps to readable labels
                    //labels: filteredData1.map(d => new Date(d.x).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
                },
                y: {
                    beginAtZero: false,
                    suggestedMin: minPrice,
                    suggestedMax: maxPrice + buffer
                }
            },
            plugins: {
                legend: {
                    display: true
                }
            }
        }
    });

    console.log("Chart rendered successfully!");
}


fetchStockData();
//fetchCompanyData();

/*async function fetchCompanyData(){
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

function displayDetails(){
    const companyName = document.getElementById("company-name");
    const companyValuation = document.getElementById("company-valuation");
    const currentPrice = document.getElementById("current-price");
    const totalCost = document.getElementById("total-cost");
    const profit = document.getElementById("profit");

    companyName.textContent = StocksCompanyinfo.company;
    companyValuation.textContent = `Valuation: $${StocksCompanyinfo.valuation}`;
    currentPrice.textContent = `$${CurrentSharePrice}`;
    totalCost.textContent = `${StocksCompanyinfo.totalPrice}`;
    profit.textContent = `${StocksCompanyinfo.profit}`;  

    //const profitValue = parseFloat(profit.textContent.replace("$", ""));
    if (StocksCompanyinfo.profitClass === "profit") {
        profit.style.color = "green";
    } else if (StocksCompanyinfo.profitClass === "loss") {
        profit.style.color = "red";
    } else {
        profit.style.color = "black";
    }

}





let selectedShares = null;
let actionType = "";


function openDialog(type) {
    actionType = type;
    console.log(type);

    const existingDialog = document.getElementById("share-dialog");
    if (existingDialog) existingDialog.remove();

    const dialog = document.createElement("div");
    dialog.id = "share-dialog";
    dialog.className = "dialog";

    dialog.innerHTML = `
        <div class="dialog-content">
            <h2>${type === "buy" ? "Buy Shares" : "Sell Shares"}</h2>
            <div style="color: rgb(142, 140, 140); font-size: 16px;">Select Number of Shares</div>
            <div class="share-options">
                <span class="share-box" onclick="selectShares(this, 10)">10</span>
                <span class="share-box" onclick="selectShares(this, 20)">20</span>
                <span class="share-box" onclick="selectShares(this, 50)">50</span>
                <span class="share-box" onclick="selectShares(this, 100)">100</span>
                <span class="share-box" onclick="selectShares(this, 200)">200</span>
            </div>
            <div class="dialog-buttons">
                <button onclick="closeDialog()">Cancel</button>
                <button onclick="confirmAction('${type}')">Confirm</button>
            </div>
        </div>
    `;

    document.body.appendChild(dialog);
    dialog.style.display = "block";
}

function selectShares(element, shares) {
    document.querySelectorAll(".share-box").forEach(box => box.classList.remove("selected"));
    element.classList.add("selected");
    selectedShares = shares;
}

function closeDialog() {
    document.getElementById("share-dialog").remove();
}

function confirmAction(type) {
    if (selectedShares !== null) {
        /*let Amount = CurrentSharePrice * selectedShares;
        console.log("Amount:",Amount);*/
        if(type === "buy"){
            BoughtShares(CurrentSharePrice,selectedShares);
        }else{
            SoldShares(CurrentSharePrice,selectedShares);
        }
        alert(`${actionType.toUpperCase()} ${selectedShares} shares`);
        closeDialog();
        window.location.href = 'stocksProfile.html';
    } else {
        alert("Please select the number of shares.");
    }
}


async function BoughtShares(shareprice,selectedshares){
    try {
        const response = await fetch('http://localhost:8008/investment/BoughtShares', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: credentials,
                companyname: StocksCompanyinfo.company,
                shareprice: shareprice,
                selectedshares: selectedshares
            }),
        });

        const data = await response.json();
        if(data.retry){
            setTimeout(() => BoughtShares(shareprice,selectedshares),1000);
        }else{
            console.log(data);
            //return data;
        }
    } catch (error) {
        console.error("❌ Error not bought:", error);
        return null;
    }
}

async function SoldShares(shareprice,selectedshares){
    try {
        const response = await fetch('http://localhost:8008/investment/SoldShares', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: credentials,
                companyname: StocksCompanyinfo.company,
                shareprice: shareprice,
                selectedshares: selectedshares 
            }),
        });

        const data = await response.json();
        if(data.retry){
            setTimeout(() => SoldShares(shareprice,selectedshares),1000);
        }else{
            console.log(data);
            //return data;
        }
    } catch (error) {
        console.error("❌ Error not sold:", error);
        return null;
    }
}
