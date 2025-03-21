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

const credentials= JSON.parse(localStorage.getItem('credentials'));
console.log(credentials);



document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.querySelector(".start");

    // Business Data
    const businesses = [
        { name: "IT", price: "4899", image: "images/ITimage.png" },
        { name: "Bank corporation", price: "9999", image: "images/ITimage.png" },
        { name: "Football Club", price: "19899", image: "images/ITimage.png" },
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
                            <div class="business-price">$ ${business.price}</div>
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
            //alert(`${business.name} Purchased!`);
            const businessNameInput = modalContent.querySelector(".business-name-input").value.trim();
        
            if (businessNameInput) {
                fetchAddUserBusiness(credentials,business.name, businessNameInput, business.price);
                modal.remove();
            } else {
                alert("Please enter a business name!");
            }
        });

        modalContent.appendChild(closeButton);
        modalContent.appendChild(businessInfo);
        modalContent.appendChild(buyButton);
    }

    // Event Listener for Button Click
    startButton.addEventListener("click", openModal);
});


async function fetchAddUserBusiness(username,business,businessname,amount){
    try {
        const response = await fetch('http://localhost:8008/user/InsertUserbusiness', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                 username: username,
                 business: business,
                 businessname: businessname,
                 amount: amount
            }),
        });

        const data = await response.json();
        console.log('New Business:',data);
        // fetchUserBusiness(username);
        if(business = "IT"){
            fetchAddUserBusinessintoITTable(username, businessname);
            const container = document.querySelector(".companies");
            container.innerHTML="";
            fetchUserBusiness(credentials);

            // fetchITMainBusiness(credentials);
        }
        //return data; // Return fetched data
    } catch (error) {
        console.error("❌ Error fetching adding main business:", error);
        return null;
    }
}

async function fetchAddUserBusinessintoITTable(username,businessname){
    try {
        const response = await fetch('http://localhost:8008/user/InsertITBusiness', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                 username: username,
                 businessname: businessname
            }),
        });

        const data = await response.json();
        console.log('New Business:',data);
    } catch (error) {
        console.error("❌ Error fetching adding main business:", error);
        return null;
    }
}


/*async function fetchITMainBusiness(username) {
    try {
        const response = await fetch('http://localhost:8008/ITbusiness/ITmainbusiness', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username }),
        });

        const data = await response.json();
        console.log(data);
        //UpdateNameAndRevenue(data);
        //return data; // Return fetched data
    } catch (error) {
        console.error("❌ Error fetching IT main business:", error);
        return null;
    }
}*/


let UserBusinesses;
async function fetchUserBusiness(username) {
    try {
        const response = await fetch('http://localhost:8008/user/SelectUserbusiness', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username }),
        });

        UserBusinesses = await response.json();
        console.log('userBusiness:',UserBusinesses);
        
        const container = document.querySelector(".companies");
        container.innerHTML = ""; 
        ShowBusiness(username);
        //return data; // Return fetched data
    } catch (error) {
        console.error("❌ Error fetching IT main business:", error);
        return null;
    }
}
fetchUserBusiness(credentials);

let UserBusinessData;
let BusinessCatagory;

async function ShowBusiness(username){
    console.log("sample:",UserBusinesses);
    UserBusinesses.forEach(async(element,index)=>{
        try {
            const response = await fetch(`http://localhost:8008/${element.Business}business/${element.Business}mainbusiness`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username }),
            });
    
            UserBusinessData = await response.json();
            console.log("IT data:",UserBusinessData);
            BusinessCatagory = element.Business;
            //return data; // Return fetched data
            DisplayUserBusiness(index);
        } catch (error) {
            console.error("❌ Error fetching main businesses:", error);
            return null;
        }
    })
}

let a=0;
function DisplayUserBusiness(index){
    const container = document.querySelector(".companies");
    if(a===0){
        container.innerHTML = ""; 
        a++;
    }
    const businessCard = document.createElement("div");
        businessCard.classList.add("business-card");
        businessCard.innerHTML = `
            <div class="icon" style="margin-right: 20px;"><img src="${businesses2[0].icon}" style="height:60px; width:60px;"></div>
            <div class="details">
                <div style="font-size:24px;">${UserBusinessData[index].BusinessName}</div>
                <div style="margin-top:5px;margin-bottom:20px;">${BusinessCatagory} company</div>
                <div class="progress" style="margin-bottom:10px;">
                    📊 ${businesses2[0].progress}
                </div>
                <div class="earnings">
                    <strong>$${UserBusinessData[index].Revenue}</strong>
                </div>
            </div>
            <span class="notification1">${businesses2[0].notificationCount}</span>
        `;

        businessCard.addEventListener("click", () => {
            localStorage.setItem("UserBusinessInfo",JSON.stringify(UserBusinessData[index]));
            window.location.href = "IT.html";
        });
        container.appendChild(businessCard);
}


const businesses2 = [
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

/*function renderBusinesses() {
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
//renderBusinesses();
*/

