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


fetchGetTotalIncome(credentials);

document.querySelector('.card.market').addEventListener('click', function() {
    window.location.href = 'market.html';
});
document.querySelector('.card.property').addEventListener('click', function() {
    window.location.href = 'property.html';
});

async function fetchGetTotalIncome(username) {
    try {
        const response = await fetch('http://localhost:8008/investment/getTotalIncomePerHourUser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username }),
        });

        const data = await response.json();
        console.log('Fetched income:', data);

        if(`${data[0].TotInc}`=="null"){
            document.getElementById("total-income").textContent = `$ 0.00`;
        }else{
            document.getElementById("total-income").textContent = `$ ${formatNumber(data[0].TotInc)}`;
        }
        console.log(document.querySelector(".income-display h2"));
        return data;
    } catch (error) {
        console.error("❌ Error fetching total income:", error);
        return null;
    }
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