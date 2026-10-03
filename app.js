document.addEventListener("DOMContentLoaded", function () {

    // PAGES
    const homePage = document.querySelector(".hero");
    const whyUs = document.querySelector(".why-us");

    const sellPage = document.getElementById("sellPage");
    const loginPage = document.getElementById("loginPage");
    const signupPage = document.getElementById("signupPage");


    // BUTTONS
    const sellButton = document.getElementById("sellButton");
    const headerSellButton = document.getElementById("headerSellButton");
    const loginButton = document.getElementById("loginButton");

    const closeSellButton = document.getElementById("closeSellButton");
    const closeLoginButton = document.getElementById("closeLoginButton");
    const closeSignupButton = document.getElementById("closeSignupButton");

    const goToSignupButton = document.getElementById("goToSignupButton");
    const goToLoginButton = document.getElementById("goToLoginButton");


    // =====================================
    // HIDE EVERYTHING EXCEPT HOME
    // =====================================

    function showHome() {

        if (homePage) homePage.style.display = "flex";
        if (whyUs) whyUs.style.display = "block";

        if (sellPage) sellPage.style.display = "none";
        if (loginPage) loginPage.style.display = "none";
        if (signupPage) signupPage.style.display = "none";

        window.scrollTo(0, 0);
    }


    // =====================================
    // OPEN LOGIN
    // =====================================

    function showLogin() {

        if (homePage) homePage.style.display = "none";
        if (whyUs) whyUs.style.display = "none";

        if (sellPage) sellPage.style.display = "none";
        if (signupPage) signupPage.style.display = "none";

        if (loginPage) {
            loginPage.style.display = "block";
        }

        window.scrollTo(0, 0);
    }


    // =====================================
    // OPEN SIGNUP
    // =====================================

    function showSignup() {

        if (homePage) homePage.style.display = "none";
        if (whyUs) whyUs.style.display = "none";

        if (sellPage) sellPage.style.display = "none";
        if (loginPage) loginPage.style.display = "none";

        if (signupPage) {
            signupPage.style.display = "block";
        }

        window.scrollTo(0, 0);
    }


    // =====================================
    // OPEN SELL PAGE
    // =====================================

    function showSell() {

        if (homePage) homePage.style.display = "none";
        if (whyUs) whyUs.style.display = "none";

        if (loginPage) loginPage.style.display = "none";
        if (signupPage) signupPage.style.display = "none";

        if (sellPage) {
            sellPage.style.display = "block";
        }

        window.scrollTo(0, 0);
    }


    // =====================================
    // HOME → LOGIN
    // =====================================

    if (sellButton) {
        sellButton.addEventListener("click", showLogin);
    }

    if (headerSellButton) {
        headerSellButton.addEventListener("click", showLogin);
    }

    if (loginButton) {
        loginButton.addEventListener("click", showLogin);
    }


    // =====================================
    // BACK BUTTONS
    // =====================================

    if (closeLoginButton) {
        closeLoginButton.addEventListener("click", showHome);
    }

    if (closeSignupButton) {
        closeSignupButton.addEventListener("click", showHome);
    }

    if (closeSellButton) {
        closeSellButton.addEventListener("click", showHome);
    }


    // =====================================
    // LOGIN ↔ CREATE ACCOUNT
    // =====================================

    if (goToSignupButton) {
        goToSignupButton.addEventListener("click", showSignup);
    }

    if (goToLoginButton) {
        goToLoginButton.addEventListener("click", showLogin);
    }


    // =====================================
    // LOGIN FORM
    // =====================================

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {

        loginForm.addEventListener("submit", function (event) {

            event.preventDefault();

            alert("Real login will be connected next.");

        });

    }


    // =====================================
    // SIGNUP FORM
    // =====================================

    const signupForm = document.getElementById("signupForm");

    if (signupForm) {

        signupForm.addEventListener("submit", function (event) {

            event.preventDefault();

            alert("Real account creation and email verification will be connected next.");

        });

    }


    // =====================================
    // INITIAL PAGE
    // =====================================

    showHome();

});