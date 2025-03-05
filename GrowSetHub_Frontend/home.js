// const Investing = document.querySelector('.Investing');
// const Business = document.querySelector('.Business');
// const Earning = document.querySelector('.Earnings');
// const Profile = document.querySelector('.Profile');

// Investing?.addEventListener('click',()=>{
//     window.location.href = 'home.html';
// })
// Business?.addEventListener('click',()=>{
//     window.location.href = 'home.html';
// })
// Earning?.addEventListener('click',()=>{
//     window.location.href = 'home.html';
// })
// Profile?.addEventListener('click',()=>{
//     window.location.href = 'profile.html';
// })

document.addEventListener("DOMContentLoaded", () => {
    const Investing = document.querySelector('.Investing');
    const Business = document.querySelector('.Business');
    const Earning = document.querySelector('.Earnings');
    const Profile = document.querySelector('.Profile');

    Investing?.addEventListener('click', () => {
        console.log("Investing Clicked");
        window.location.href = 'home.html';
    });
    Business?.addEventListener('click', () => {
        console.log("Business Clicked");
        window.location.href = 'home.html';
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

