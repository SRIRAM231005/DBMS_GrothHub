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

function openDialog() {
    document.getElementById('interestDialog').classList.remove('hidden');
}
function closeDialog() {
    document.getElementById('interestDialog').classList.add('hidden');
}