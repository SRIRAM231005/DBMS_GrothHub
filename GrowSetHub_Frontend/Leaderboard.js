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


let currentData = []; // to hold full data for search filtering

document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const type = btn.getAttribute("data-type");
    fetchAndDisplayLeaderboard(type);
  });
});

document.getElementById("search-input").addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filtered = currentData.filter(entry => entry.name.toLowerCase().includes(searchTerm));
  displayLeaderboard(filtered);
});

function fetchAndDisplayLeaderboard(type) {
  const container = document.getElementById("leaderboard-content");
  container.innerHTML = `<p style="text-align:center;">Loading ${type} leaderboard...</p>`;

  setTimeout(() => {
    currentData = fetchData(type); // Simulated fetch
    displayLeaderboard(currentData);
  }, 500);
}

function displayLeaderboard(data) {
  const container = document.getElementById("leaderboard-content");
  container.innerHTML = "";

  if (data.length === 0) {
    container.innerHTML = `<p style="text-align:center;">No users found.</p>`;
    return;
  }

  data.forEach((entry, idx) => {
    const div = document.createElement("div");
    div.classList.add("rank-entry");
    div.innerHTML = `
      <span class="rank">#${idx + 1}</span>
      <span>${entry.name}</span>
      <span>${entry.value}</span>
    `;
    container.appendChild(div);
  });
}

function fetchData(type) {
  const dummyData = {
    balance: [
      { name: "Alice", value: "$12,000" },
      { name: "Bob", value: "$11,500" },
      { name: "Charlie", value: "$9,800" },
      { name: "Diana", value: "$8,000" },
    ],
    shares: [
      { name: "Bob", value: "150 Shares" },
      { name: "Alice", value: "135 Shares" },
      { name: "Diana", value: "120 Shares" },
    ],
    realestate: [
      { name: "Charlie", value: "4 Properties" },
      { name: "Alice", value: "3 Properties" },
      { name: "Eve", value: "2 Properties" },
    ],
    business: [
      { name: "Diana", value: "3 Startups" },
      { name: "Bob", value: "2 Startups" },
      { name: "Alice", value: "1 Startup" },
    ],
  };

  return dummyData[type] || [];
}

// Load default tab on page load
fetchAndDisplayLeaderboard("balance");
