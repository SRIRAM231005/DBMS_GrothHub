const apiKey = "QUCPPGZVMERJTMCC";
const symbol = "AAPL"; // Apple stock
const interval = "5min"; // Fetch data every 5 minutes
const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}&apikey=${apiKey}`;

fetch(url)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error("Error fetching stock data:", error));
