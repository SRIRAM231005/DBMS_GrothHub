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
    document.querySelector(".balance").textContent = `$${Balance[0].Balance}`;
}

fetchBalance(credentials);
