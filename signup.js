(() => {
    const form = document.getElementById("signupForm");

    const nameInput =
        document.getElementById("signupName");

    const emailInput =
        document.getElementById("signupEmail");

    const passwordInput =
        document.getElementById("signupPassword");

    const confirmPasswordInput =
        document.getElementById("signupPasswordConfirm");

    const submitButton =
        document.getElementById("signupSubmitButton");

    const message =
        document.getElementById("signupFormMessage");

    const togglePassword =
        document.getElementById("toggleSignupPassword");

    const toggleConfirmPassword =
        document.getElementById(
            "toggleSignupPasswordConfirm"
        );

    const loginButton =
        document.getElementById("goToLoginButton");

    const backButton =
        document.getElementById("backButton");

    const logoButton =
        document.getElementById("logoButton");


    function showMessage(text, type = "error") {
        if (!message) {
            return;
        }

        message.textContent = text;
        message.className =
            `auth-form-message ${type}`;

        message.hidden = false;
    }


    function clearMessage() {
        if (!message) {
            return;
        }

        message.textContent = "";
        message.hidden = true;
        message.className =
            "auth-form-message";
    }


    function setLoading(isLoading) {
        if (!submitButton) {
            return;
        }

        submitButton.disabled = isLoading;

        submitButton.textContent =
            isLoading
                ? "Creating account..."
                : "Create account";
    }


    function goHome() {
        window.location.href = "index.html";
    }


    function goToLogin() {
        window.location.href = "login.html";
    }


    function setupPasswordToggle(
        button,
        input
    ) {
        if (!button || !input) {
            return;
        }

        button.addEventListener(
            "click",
            () => {
                const isPassword =
                    input.type === "password";

                input.type =
                    isPassword
                        ? "text"
                        : "password";

                button.textContent =
                    isPassword
                        ? "Hide"
                        : "Show";

                button.setAttribute(
                    "aria-label",
                    isPassword
                        ? "Hide password"
                        : "Show password"
                );
            }
        );
    }


    function validateForm(
        name,
        email,
        password,
        confirmPassword
    ) {
        if (!name) {
            return "Please enter your name.";
        }

        if (!email) {
            return "Please enter your email address.";
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return "Please enter a valid email address.";
        }

        if (!password) {
            return "Please choose a password.";
        }

        if (password.length < 6) {
            return "Your password must be at least 6 characters long.";
        }

        if (!confirmPassword) {
            return "Please confirm your password.";
        }

        if (password !== confirmPassword) {
            return "Your passwords do not match.";
        }

        return null;
    }


    async function handleSubmit(event) {
        event.preventDefault();

        clearMessage();

        const name =
            nameInput?.value.trim() || "";

        const email =
            emailInput?.value.trim() || "";

        const password =
            passwordInput?.value || "";

        const confirmPassword =
            confirmPasswordInput?.value || "";

        const validationError =
            validateForm(
                name,
                email,
                password,
                confirmPassword
            );

        if (validationError) {
            showMessage(validationError);
            return;
        }

        setLoading(true);

        try {
            const result =
                await ClosetAuth.signUp(
                    name,
                    email,
                    password
                );

            if (!result.success) {
                showMessage(result.message);
                return;
            }

            if (result.needsVerification) {
                showMessage(
                    "Your account has been created. Check your email to verify your address before signing in.",
                    "success"
                );

                form.reset();

                return;
            }

            window.location.href =
                "index.html";

        } catch (error) {
            console.error(
                "CLOSET signup page error:",
                error
            );

            showMessage(
                "We couldn't create your account. Please try again."
            );

        } finally {
            setLoading(false);
        }
    }


    async function initialize() {
        if (
            typeof ClosetAuth === "undefined" ||
            !window.supabaseClient
        ) {
            showMessage(
                "CLOSET could not connect to the account service."
            );

            return;
        }

        const session =
            await ClosetAuth.initialize();

        if (session) {
            window.location.href =
                "index.html";
        }
    }


    if (form) {
        form.addEventListener(
            "submit",
            handleSubmit
        );
    }


    if (loginButton) {
        loginButton.addEventListener(
            "click",
            goToLogin
        );
    }


    if (backButton) {
        backButton.addEventListener(
            "click",
            goHome
        );
    }


    if (logoButton) {
        logoButton.addEventListener(
            "click",
            goHome
        );
    }


    setupPasswordToggle(
        togglePassword,
        passwordInput
    );


    setupPasswordToggle(
        toggleConfirmPassword,
        confirmPasswordInput
    );


    initialize();
})();