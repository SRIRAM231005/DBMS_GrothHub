const credentials= JSON.parse(localStorage.getItem('credentials'));
console.log(credentials);


document.addEventListener("DOMContentLoaded", () => {
    const Investing = document.querySelector('.Investing');
    const Business = document.querySelector('.Business');
    const Earning = document.querySelector('.Earnings');
    const Profile = document.querySelector('.Profile');

    Investing.addEventListener('click', () => {
        console.log("Investing Clicked");
        window.location.href = 'stocksProfile.html';
    });
    Business.addEventListener('click', () => {
        console.log("Business Clicked");
        window.location.href = 'business.html';
    });
    Earning.addEventListener('click', () => {
        console.log("Earning Clicked");
        window.location.href = 'home.html';
    });
    Profile.addEventListener('click', () => {
        console.log("Profile Clicked");
        window.location.href = 'profile.html';
    });
});

lucide.createIcons();



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
        document.querySelector(".fortune h1").textContent = `$${formatNumber(Balance[0].Total)}`;
    
        // Update individual asset values
        document.querySelector(".card:nth-child(1) p").textContent = `$ ${formatNumber(Balance[0].Balance)}`;
        document.querySelector(".card:nth-child(2) p").textContent = `$ ${formatNumber(Balance[0].Business)}`;
        document.querySelector(".card:nth-child(3) p").textContent = `$ ${formatNumber(Balance[0].Stocks)}`;
        document.querySelector(".card:nth-child(4) p").textContent = `$ ${formatNumber(Balance[0].Real_Estate)}`;
    
        // Update progress bar widths
        const total = Balance[0].Total;
        document.querySelector(".bar.balance").style.width = (Balance[0].Balance / total * 100) + "%";
        document.querySelector(".bar.business").style.width = (Balance[0].Business / total * 100) + "%";
        document.querySelector(".bar.stocks").style.width = (Balance[0].Stocks / total * 100) + "%";
        document.querySelector(".bar.real-estate").style.width = (Balance[0].Real_Estate / total * 100) + "%";
    
}

function UpdateStatistics(){
    const values = document.querySelectorAll(".stats-card .section .value");

    values[0].textContent = `${Statistics.NoOfBusiness}`; 
    //values[1].textContent = `${realEstateOwned} of ${realEstateTotal}`; 
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
