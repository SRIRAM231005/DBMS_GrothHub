const StocksCompanyinfo= JSON.parse(localStorage.getItem('StocksCompanyinfo'));
console.log(StocksCompanyinfo);
const credentials= JSON.parse(localStorage.getItem('credentials'));
console.log(credentials);
const symbol = StocksCompanyinfo.symbol;
let CurrentSharePrice;


async function fetchStockData() {
    //const symbol = "AAPL"; // Example stock
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
    // Fetch elements using their IDs
    const companyName = document.getElementById("company-name");
    const companyValuation = document.getElementById("company-valuation");
    const currentPrice = document.getElementById("current-price");
    const totalCost = document.getElementById("total-cost");
    const profit = document.getElementById("profit");

    // Update the content dynamically
    companyName.textContent = StocksCompanyinfo.company;
    companyValuation.textContent = `Valuation: $${StocksCompanyinfo.valuation}`;
    currentPrice.textContent = `$${CurrentSharePrice}`;
    totalCost.textContent = `${StocksCompanyinfo.totalPrice}`;
    profit.textContent = `${StocksCompanyinfo.profit}`;  // Assuming some profit calculation

    // Optionally, change profit text color based on positive or negative value
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

// Function to create and show dialog
function openDialog(type) {
    actionType = type;
    
    // Remove any existing dialog
    const existingDialog = document.getElementById("share-dialog");
    if (existingDialog) existingDialog.remove();

    // Create dialog container
    const dialog = document.createElement("div");
    dialog.id = "share-dialog";
    dialog.className = "dialog";

    // Dialog content
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
                <button onclick="confirmAction(${type})">Confirm</button>
            </div>
        </div>
    `;

    // Append dialog to body and display it
    document.body.appendChild(dialog);
    dialog.style.display = "block";
}

// Function to select shares
function selectShares(element, shares) {
    document.querySelectorAll(".share-box").forEach(box => box.classList.remove("selected"));
    element.classList.add("selected");
    selectedShares = shares;
}

// Function to close dialog
function closeDialog() {
    document.getElementById("share-dialog").remove();
}

// Function to confirm action
function confirmAction(type) {
    if (selectedShares !== null) {
        let Amount = CurrentSharePrice * selectedShares;
        if(type === "buy"){
            BoughtShares(Amount,selectedShares);
        }else{
            SoldShares(Amount,selectedShares);
        }
        alert(`${actionType.toUpperCase()} ${selectedShares} shares`);
        closeDialog();
    } else {
        alert("Please select the number of shares.");
    }
}


async function BoughtShares(amount,selectedshares){
    try {
        const response = await fetch('http://localhost:8008/investments/BoughtShares', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: credentials,
                companyname: StocksCompanyinfo.company,
                amount: amount,
                selectedshares: selectedshares
            }),
        });

        const data = await response.json();
        console.log(data);
        //return data;
    } catch (error) {
        console.error("❌ Error not bought:", error);
        return null;
    }
}

async function SoldShares(amount,selectedshares){
    try {
        const response = await fetch('http://localhost:8008/investment/SoldShares', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: credentials,
                companyname: StocksCompanyinfo.company,
                amount: amount,
                selectedshares: selectedshares 
            }),
        });

        const data = await response.json();
        console.log(data);
        //return data;
    } catch (error) {
        console.error("❌ Error not sold:", error);
        return null;
    }
}
