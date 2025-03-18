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

function openDialog() {
    document.getElementById('interestDialog').classList.remove('hidden');
}
function closeDialog() {
    document.getElementById('interestDialog').classList.add('hidden');
}