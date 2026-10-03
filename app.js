document.addEventListener("DOMContentLoaded", function () {

    // =====================================
    // SUPABASE
    // =====================================

    const SUPABASE_URL = "https://wdnpncgramzkvqcqeyur.supabase.co";
    const SUPABASE_KEY = "sb_publishable_e5gQ9HHadZ0V7bByXfSMUg_LuZHK--M";

    const supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


    // =====================================
    // PAGES
    // =====================================

    const homePage = document.querySelector(".hero");
    const whyUs = document.querySelector(".why-us");

    const sellPage = document.getElementById("sellPage");
    const loginPage = document.getElementById("loginPage");
    const signupPage = document.getElementById("signupPage");


    // =====================================
    // BUTTONS
    // =====================================

    const sellButton = document.getElementById("sellButton");
    const headerSellButton = document.getElementById("headerSellButton");
    const loginButton = document.getElementById("loginButton");

    const closeSellButton = document.getElementById("closeSellButton");
    const closeLoginButton = document.getElementById("closeLoginButton");
    const closeSignupButton = document.getElementById("closeSignupButton");

    const goToSignupButton = document.getElementById("goToSignupButton");
    const goToLoginButton = document.getElementById("goToLoginButton");


    // =====================================
    // SHOW HOME
    // =====================================

    function showHome() {

        if (homePage) {
            homePage.style.display = "flex";
        }

        if (whyUs) {
            whyUs.style.display = "block";
        }

        if (sellPage) {
            sellPage.style.display = "none";
        }

        if (loginPage) {
            loginPage.style.display = "none";
        }

        if (signupPage) {
            signupPage.style.display = "none";
        }

        window.scrollTo(0, 0);
    }


    // =====================================
    // SHOW LOGIN
    // =====================================

    function showLogin() {

        if (homePage) {
            homePage.style.display = "none";
        }

        if (whyUs) {
            whyUs.style.display = "none";
        }

        if (sellPage) {
            sellPage.style.display = "none";
        }

        if (signupPage) {
            signupPage.style.display = "none";
        }

        if (loginPage) {
            loginPage.style.display = "block";
        }

        window.scrollTo(0, 0);
    }


    // =====================================
    // SHOW SIGNUP
    // =====================================

    function showSignup() {

        if (homePage) {
            homePage.style.display = "none";
        }

        if (whyUs) {
            whyUs.style.display = "none";
        }

        if (sellPage) {
            sellPage.style.display = "none";
        }

        if (loginPage) {
            loginPage.style.display = "none";
        }

        if (signupPage) {
            signupPage.style.display = "block";
        }

        window.scrollTo(0, 0);
    }


    // =====================================
    // SHOW SELL PAGE
    // =====================================

    function showSell() {

        if (homePage) {
            homePage.style.display = "none";
        }

        if (whyUs) {
            whyUs.style.display = "none";
        }

        if (loginPage) {
            loginPage.style.display = "none";
        }

        if (signupPage) {
            signupPage.style.display = "none";
        }

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
    // LOGIN ↔ SIGNUP
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

        loginForm.addEventListener("submit", async function (event) {

            event.preventDefault();

            const email = document
                .getElementById("loginEmail")
                .value
                .trim();

            const password = document.getElementById("loginPassword").value;

            try {

                const { data, error } =
                    await supabaseClient.auth.signInWithPassword({
                        email: email,
                        password: password
                    });

                if (error) {
                    alert(error.message);
                    return;
                }

                alert("Welcome back to CLOSET!");

                loginForm.reset();

                showSell();

            } catch (error) {

                console.error(error);
                alert("Something went wrong. Please try again.");

            }

        });

    }


    // =====================================
    // SIGNUP FORM
    // =====================================

    const signupForm = document.getElementById("signupForm");

    if (signupForm) {

        signupForm.addEventListener("submit", async function (event) {

            event.preventDefault();

            const name = document
                .getElementById("signupName")
                .value
                .trim();

            const email = document
                .getElementById("signupEmail")
                .value
                .trim();

            const password =
                document.getElementById("signupPassword").value;

            const confirmPassword =
                document.getElementById("signupPasswordConfirm").value;


            // Check passwords match

            if (password !== confirmPassword) {
                alert("Passwords do not match.");
                return;
            }


            try {

                const { data, error } =
                    await supabaseClient.auth.signUp({
                        email: email,
                        password: password,

                        options: {
                            data: {
                                name: name
                            }
                        }
                    });


                if (error) {
                    alert(error.message);
                    return;
                }


                alert(
                    "Account created! Check your email to verify your CLOSET account."
                );

                signupForm.reset();

                showLogin();

            } catch (error) {

                console.error(error);
                alert("Something went wrong. Please try again.");

            }

        });

    }


    // =====================================
    // CHECK EXISTING SESSION
    // =====================================

    async function checkSession() {

        const {
            data: { session }
        } = await supabaseClient.auth.getSession();


        if (session) {

            console.log(
                "User is already logged in:",
                session.user.email
            );

        }

        showHome();
    }


    // =====================================
    // INITIAL PAGE
    // =====================================

    checkSession();

});
