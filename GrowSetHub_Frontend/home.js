const credentials= JSON.parse(localStorage.getItem('credentials'));
console.log(credentials);

document.addEventListener("DOMContentLoaded", () => {
    const Investing = document.querySelector('.Investing');
    const Business = document.querySelector('.Business');
    const Earning = document.querySelector('.Earnings');
    const Profile = document.querySelector('.Profile');

    Investing?.addEventListener('click', () => {
        console.log("Investing Clicked");
        window.location.href = 'stocksProfile.html';
    });
    Business?.addEventListener('click', () => {
        console.log("Business Clicked");
        window.location.href = 'business.html';
    });
    Earning?.addEventListener('click', () => {
        console.log("Earning Clicked");
        window.location.href = 'home.html';
    });
    Profile?.addEventListener('click', () => {
        console.log("Profile Clicked");
        window.location.href = 'profile.html';
    });
});

lucide.createIcons();

let Balance;
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

function UpdateBalance(){
    document.querySelector(".balance").textContent = `$${formatNumber(Balance[0].Balance)}`;
}

fetchBalance(credentials);

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
