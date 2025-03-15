document.addEventListener("DOMContentLoaded", function () {
    const developmentTeam = document.getElementById("developmentTeam");
    const developerMenu = document.getElementById("developerMenu");

    developmentTeam.addEventListener("click", function () {
        if (developerMenu.style.display === "none" || developerMenu.style.display === "") {
            developerMenu.style.display = "block";
        } else {
            developerMenu.style.display = "none";
        }
    });
});
