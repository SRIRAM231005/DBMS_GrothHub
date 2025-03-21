/*const apiKey = "QUCPPGZVMERJTMCC";
const symbol = "AAPL"; // Apple stock
const interval = "1min"; // Fetch data every 5 minutes
const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}&apikey=${apiKey}`;

fetch(url)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error("Error fetching stock data:", error));*/




    /*function fetchStockData() {
        const apiKey = "WJU7AOH8VG0EUAWV";
        const symbol = "AAPL"; // Example stock
        const interval = "200min"; // Get data for every 200 minutes
        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}&apikey=${apiKey}`;
        
        //const response = fetch(url);
        //const data = response.json();

        let data;

        fetch(url)
            .then(response => response.json())
            .then(data =>{
                console.log(data);
                const timeSeries = data["Time Series (200min)"];
                const labels = []; // Time labels
                const prices = []; // Closing prices
                const colors = []; // Colors for bars
            
                Object.keys(timeSeries).slice(0, 20).reverse().forEach(time => {
                    const closePrice = parseFloat(timeSeries[time]["4. close"]);
                    const openPrice = parseFloat(timeSeries[time]["1. open"]);
            
                    labels.push(time);
                    prices.push(closePrice);
            
                    // Green if price increased, red if decreased
                    colors.push(closePrice >= openPrice ? "green" : "red");
                });
            
                drawStockChart(labels, prices, colors);
            })
            .catch(error => console.error("Error fetching stock data:", error));
        
        /*if (!data["Time Series (1min)"]) {
            console.error("Invalid Data:", data);
            return;
        }
    
    }


    function drawStockChart(labels, prices, colors) {
        const ctx = document.getElementById("stockChart").getContext("2d");
        
        new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: "Stock Price",
                    data: prices,
                    backgroundColor: colors, // Dynamic green/red bars
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }
    
    // Fetch and display the stock chart
    fetchStockData();*/



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
    

    async function fetchStockData() {
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
    fetchCompanyData();

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
    