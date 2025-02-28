function switchTab(tab) {
    let loginForm = document.getElementById("loginForm");
    let signupForm = document.getElementById("signupForm");
    let loginTab = document.getElementById("loginTab");
    let signupTab = document.getElementById("signupTab");
    let formTitle = document.getElementById("formTitle");

    if (tab === "login") {
        loginForm.classList.remove("hidden");
        signupForm.classList.add("hidden");
        loginTab.classList.add("active");
        signupTab.classList.remove("active");
        formTitle.textContent = "Login Form";
    } else {
        loginForm.classList.add("hidden");
        signupForm.classList.remove("hidden");
        loginTab.classList.remove("active");
        signupTab.classList.add("active");
        formTitle.textContent = "Signup Form";
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            let username = document.getElementById("login-name").value;
            let password = document.getElementById("login-password").value;

            const userData = {
                username: username,
                password: password
            };

            console.log("Logging in with:", userData);
            const response = await loginUser(userData);
            console.log("Login Response:", response);
            username = "";
            password = "";
        });
    }

    if (signupForm) {
        signupForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const form = event.target;

            let username = document.getElementById("signup-name").value;
            let password = document.getElementById("signup-password").value;

            const isUnique = await checkUserExists(username);
            if (!isUnique) {
                errorMessage.textContent = "User with username already exist. Try another!";
                return; 
            }

            const userData = {
                username: username,
                password: password
            };

            console.log("Signing up with:", userData);
            const response = await signupUser(userData);
            console.log("Signup Response:", response);
            form.reset();
        });
    }
});


async function checkUserExists(username) {
    try {
        const response = await fetch("http://localhost:8008/user/usercheck", { 
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username })
        });
        const data = await response.json();
        return !data.exists;
    } catch (error) {
        console.error("Signup Error:", error);
        return null;
    }
}


async function signupUser(userData) {
    try {
        const response = await fetch("http://localhost:8008/user/signup", { 
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error(`Signup failed! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Signup Successful:", result);
        // window.location.href = "login.html";   // resirect to login page
        return result;
    } catch (error) {
        console.error("Signup Error:", error);
        return null;
    }
}


async function loginUser(credentials) {
    try {
        const response = await fetch("http://localhost:8008/user/login", { 
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credentials)
        });

        if (!response.ok) {
            throw new Error(`Login failed! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Login Successful:", result);
        window.location.href = 'home.html';
        return result;
    } catch (error) {
        console.error("Login Error:", error);
        return null;
    }
}
