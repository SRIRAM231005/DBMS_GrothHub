const credentials= JSON.parse(localStorage.getItem('credentials'));
console.log(credentials);

BusinessDetails = JSON.parse(localStorage.getItem('UserBusinessInfo'));
console.log("check12",BusinessDetails);

const socket = io("http://localhost:8008");
socket.on('updateBanks', (bank) => {
    console.log('Received updated bank details:', bank);
});


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

function openDialog() {
    document.getElementById('interestDialog').classList.remove('hidden');
}
function closeDialog() {
    document.getElementById('interestDialog').classList.add('hidden');
}


async function SettingInterestsRates(){
    DebitInterestRate = document.getElementById('depositRate').value;
    CreditInterestRate = document.getElementById('loanRate').value;
    console.log('DebitInterestRate:',DebitInterestRate);

    try {
        const response = await fetch('http://localhost:8008/Bank-Corporationbusiness/SettingInterestsRates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: credentials,
                businessname: BusinessDetails.BusinessName,
                creditInterest: CreditInterestRate,
                debitInterest: DebitInterestRate,
            })
        });
    
        let SettingInterestsRates = await response.json();
        console.log('SettingInterestsRates:',SettingInterestsRates);
    } catch (error) {
        console.error("❌ Error Setting Interests Rates:", error);
        return null;
    }
    closeDialog();

    document.querySelector('.Depositsdiv').textContent = `$${DebitInterestRate}`;
    document.querySelector('.Creditsdiv').textContent = `$${CreditInterestRate}`;
}