const StocksCompanyinfo= JSON.parse(localStorage.getItem('StocksCompanyinfo'));
console.log(StocksCompanyinfo);
const symbol = StocksCompanyinfo.symbol;


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
}