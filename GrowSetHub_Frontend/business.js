document.addEventListener("DOMContentLoaded", function () {
    const navItems = [
        { img: "images/Investing.png", text: "Investing", badge: "1", link: "investing.html" },
        { img: "images/Business.png", text: "Business", badge: "8", link: "business.html" },
        { img: "images/Earnings.png", text: "Earnings", badge: null, link: "home.html" },
        { img: "images/Profile.png", text: "Profile", badge: "1", link: "profile.html", active: true }
    ];

    const bottomNav = document.getElementById("bottomNav");

    navItems.forEach(item => {
        const navDiv = document.createElement("div");
        navDiv.classList.add("nav-item");
        if (item.active) navDiv.classList.add("active");

        navDiv.innerHTML = `
            <img src="${item.img}">
            <span class="text">${item.text}</span>
            ${item.badge ? `<span class="badge">${item.badge}</span>` : ""}
        `;

        bottomNav.appendChild(navDiv);

        navDiv.addEventListener("click", () => {
            window.location.href = item.link;
        });
    });
});

const credentials= localStorage.getItem('credentials');
//console.log(credentials);



document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.querySelector(".start");

    // Business Data
    const businesses = [
        { name: "IT Business", price: "$4,899", image: "images/ITimage.png" },
        { name: "Bank corporation", price: "$9,999", image: "images/ITimage.png" },
        { name: "Football Club", price: "$19,899", image: "images/ITimage.png" },
        //{ name: "Factory", price: "$24,999" }
    ];

    // Function to Create and Show Modal
    function openModal() {
        // Create modal elements
        const modal = document.createElement("div");
        modal.classList.add("modal");
        modal.style.display = "flex"; // Show modal

        const modalContent = document.createElement("div");
        modalContent.classList.add("modal-content");

        const closeButton = document.createElement("span");
        closeButton.classList.add("close");
        closeButton.innerHTML = "&times;";
        closeButton.addEventListener("click", () => {
            modal.remove();
        });

        const businessList = document.createElement("div");
        businessList.classList.add("business-list");

        // Create Business List
        businesses.forEach((business) => {
            const div = document.createElement("div");
            div.classList.add("business-item");
            div.innerHTML = `<div style="display: flex; align-items:center; justify-content:space-between;">
                                <div class="business-details" style="display: flex; align-items:center; gap:10px;">
                                <div><img src="${business.image}" style="height:40px; width:40px;"></div>  
                                <div style="font-size:20px;">${business.name}</div>
                            </div>
                            <div class="business-price">${business.price}</div>
                            </div>`;
            div.addEventListener("click", () => showBusinessDetails(business, modal, modalContent));
            businessList.appendChild(div);
        });

        modalContent.appendChild(closeButton);
        modalContent.appendChild(businessList);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
    }

    // Function to Show Business Details
    function showBusinessDetails(business, modal, modalContent) {
        modalContent.innerHTML = ""; // Clear content

        const closeButton = document.createElement("span");
        closeButton.classList.add("close");
        closeButton.innerHTML = "&times;";
        closeButton.addEventListener("click", () => {
            modal.remove();
        });

        const businessInfo = document.createElement("div");
        businessInfo.innerHTML = `<h2>${business.name}</h2>
                                    <div><input type="text" placeholder="Enter Business Name" class="business-name-input"></div>
                                    <p>Cost: ${business.price}</p>
                                    `;

        const buyButton = document.createElement("button");
        buyButton.classList.add("buy-btn");
        buyButton.innerText = "Start a Business";
        buyButton.addEventListener("click", () => {
            alert(`${business.name} Purchased!`);
            modal.remove();
        });

        modalContent.appendChild(closeButton);
        modalContent.appendChild(businessInfo);
        modalContent.appendChild(buyButton);
    }

    // Event Listener for Button Click
    startButton.addEventListener("click", openModal);
});

async function fetchITUserBusiness(username) {
    try {
        const response = await fetch('http://localhost:8008/user/SelectUserbusiness', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username }),
        });

        const data = await response.json();
        console.log(data);
        //return data; // Return fetched data
    } catch (error) {
        console.error("❌ Error fetching IT main business:", error);
        return null;
    }
}
//fetchITUserBusiness(credentials.username);

const businesses = [
    {
        name: "abc",
        category: "Shop",
        earnings: 137.78,
        icon: "images/ITimage.png", 
        progress: "2 of 10",
        notificationCount: 1
    },
    {
        name: "Porto Flamingos FC",
        category: "Football Club",
        earnings: 0.00,
        icon: "images/ITimage.png",
        progress: "0/3",
        notificationCount: 1
    }
];

function renderBusinesses() {
    const container = document.querySelector(".companies");
    container.innerHTML = ""; // Clear existing content

    businesses.forEach((business) => {
        const businessCard = document.createElement("div");
        businessCard.classList.add("business-card");
        businessCard.innerHTML = `
            <div class="icon" style="margin-right: 20px;"><img src="${business.icon}" style="height:60px; width:60px;"></div>
            <div class="details">
                <div style="font-size:24px;">${business.name}</div>
                <div style="margin-top:5px;margin-bottom:20px;">${business.category}</div>
                <div class="progress" style="margin-bottom:10px;">
                    📊 ${business.progress}
                </div>
                <div class="earnings">
                    <strong>$${business.earnings.toFixed(2)}</strong> per hour
                </div>
            </div>
            <span class="notification1">${business.notificationCount}</span>
        `;
        container.appendChild(businessCard);
    });
}

// Call function to display businesses
renderBusinesses();


