(() => {
    const form = document.getElementById("loginForm");
    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");
    const submitButton = document.getElementById("loginSubmitButton");
    const message = document.getElementById("loginFormMessage");
    const togglePassword = document.getElementById("toggleLoginPassword");
    const signupButton = document.getElementById("goToSignupButton");
    const backButton = document.getElementById("backButton");
    const logoButton = document.getElementById("logoButton");

    function showMessage(text, type = "error") {
        if (!message) return;

        message.textContent = text;
        message.className = `auth-form-message ${type}`;
        message.hidden = false;
    }

    function clearMessage() {
        if (!message) return;

        message.textContent = "";
        message.hidden = true;
        message.className = "auth-form-message";
    }

    function setLoading(isLoading) {
        if (!submitButton) return;

        submitButton.disabled = isLoading;
        submitButton.textContent = isLoading
            ? "Signing in..."
            : "Sign in";
    }

    function goHome() {
        window.location.href = "index.html";
    }

    function goToSignup() {
        window.location.href = "signup.html";
    }

    function setupPasswordToggle() {
        if (!togglePassword || !passwordInput) return;

        togglePassword.addEventListener("click", () => {
            const isPassword = passwordInput.type === "password";

            passwordInput.type = isPassword ? "text" : "password";
            togglePassword.textContent = isPassword ? "Hide" : "Show";
            togglePassword.setAttribute(
                "aria-label",
                isPassword ? "Hide password" : "Show password"
            );
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        clearMessage();

        const email = emailInput?.value.trim() || "";
        const password = passwordInput?.value || "";

        if (!email) {
            showMessage("Please enter your email address.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showMessage("Please enter a valid email address.");
            return;
        }

        if (!password) {
            showMessage("Please enter your password.");
            return;
        }

        setLoading(true);

        try {
            const result = await ClosetAuth.signIn(email, password);

            if (!result.success) {
                showMessage(result.message);
                return;
            }

            window.location.href = "index.html";
        } catch (error) {
            console.error("CLOSET login page error:", error);
            showMessage("We couldn't sign you in. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    async function initialize() {
        if (typeof ClosetI18n !== "undefined") {
            ClosetI18n.initialize();
        }

        if (
            typeof ClosetAuth === "undefined" ||
            !window.supabaseClient
        ) {
            showMessage(
                "CLOSET could not connect to the account service."
            );
            return;
        }

        const session = await ClosetAuth.initialize();

        if (session) {
            window.location.href = "index.html";
        }
    }

    if (form) {
        form.addEventListener("submit", handleSubmit);
    }

    if (signupButton) {
        signupButton.addEventListener("click", goToSignup);
    }

    if (backButton) {
        backButton.addEventListener("click", goHome);
    }

    if (logoButton) {
        logoButton.addEventListener("click", goHome);
    }

    setupPasswordToggle();
    initialize();
})();