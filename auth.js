const ClosetAuth = (() => {
const client = window.supabaseClient;


let currentSession = null;
let currentUser = null;
let initialized = false;

function getSession() {
    return currentSession;
}

function getUser() {
    return currentUser;
}

function isSignedIn() {
    return Boolean(currentUser);
}

function setAuthState(session) {
    currentSession = session || null;
    currentUser = session?.user || null;

    window.dispatchEvent(
        new CustomEvent("closet:auth", {
            detail: {
                session: currentSession,
                user: currentUser
            }
        })
    );
}

function getErrorMessage(error) {
    if (!error) {
        return "Something went wrong. Please try again.";
    }

    if (error.status === 429) {
        return "Too many attempts right now. Please wait a little before trying again.";
    }

    const message = String(
        error.message || ""
    ).toLowerCase();

    if (
        message.includes("invalid login credentials") ||
        message.includes("invalid credentials")
    ) {
        return "The email or password is incorrect.";
    }

    if (message.includes("email not confirmed")) {
        return "Please verify your email address before signing in.";
    }

    if (
        message.includes("already registered") ||
        message.includes("already exists")
    ) {
        return "An account with this email already exists. Try signing in instead.";
    }

    if (message.includes("password")) {
        return error.message;
    }

    if (message.includes("email")) {
        return error.message;
    }

    return "We couldn't complete that request. Please try again.";
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function signIn(email, password) {
    const cleanEmail = String(email || "")
        .trim()
        .toLowerCase();

    if (!cleanEmail || !password) {
        return {
            success: false,
            message: "Please enter your email and password."
        };
    }

    if (!validateEmail(cleanEmail)) {
        return {
            success: false,
            message: "Please enter a valid email address."
        };
    }

    try {
        const { data, error } =
            await client.auth.signInWithPassword({
                email: cleanEmail,
                password
            });

        if (error) {
            return {
                success: false,
                message: getErrorMessage(error)
            };
        }

        setAuthState(data.session);

        return {
            success: true,
            session: data.session,
            user: data.user
        };

    } catch (error) {
        console.error(
            "CLOSET sign-in error:",
            error
        );

        return {
            success: false,
            message: getErrorMessage(error)
        };
    }
}

async function signUp(name, email, password) {
    const cleanName = String(name || "").trim();
    const cleanEmail = String(email || "")
        .trim()
        .toLowerCase();

    if (!cleanName) {
        return {
            success: false,
            message: "Please enter your name."
        };
    }

    if (!cleanEmail || !validateEmail(cleanEmail)) {
        return {
            success: false,
            message: "Please enter a valid email address."
        };
    }

    if (!password) {
        return {
            success: false,
            message: "Please enter a password."
        };
    }

    if (password.length < 6) {
        return {
            success: false,
            message: "Your password must be at least 6 characters long."
        };
    }

    try {
        const { data, error } =
            await client.auth.signUp({
                email: cleanEmail,
                password,
                options: {
                    emailRedirectTo:
                        "https://dnl24x.github.io/Closet/",
                    data: {
                        name: cleanName
                    }
                }
            });

        if (error) {
            return {
                success: false,
                message: getErrorMessage(error)
            };
        }

        return {
            success: true,
            needsVerification: !data.session,
            session: data.session,
            user: data.user
        };

    } catch (error) {
        console.error(
            "CLOSET sign-up error:",
            error
        );

        return {
            success: false,
            message: getErrorMessage(error)
        };
    }
}

async function signOut() {
    try {
        const { error } =
            await client.auth.signOut();

        if (error) {
            return {
                success: false,
                message: getErrorMessage(error)
            };
        }

        setAuthState(null);

        return {
            success: true
        };

    } catch (error) {
        console.error(
            "CLOSET sign-out error:",
            error
        );

        return {
            success: false,
            message: getErrorMessage(error)
        };
    }
}

async function initialize() {
    if (initialized) {
        return currentSession;
    }

    initialized = true;

    try {
        const {
            data: { session },
            error
        } = await client.auth.getSession();

        if (error) {
            console.error(
                "CLOSET auth initialization error:",
                error
            );

            setAuthState(null);
            return null;
        }

        setAuthState(session);

        client.auth.onAuthStateChange(
            (_event, newSession) => {
                setAuthState(newSession);
            }
        );

        return session;

    } catch (error) {
        console.error(
            "CLOSET auth startup error:",
            error
        );

        setAuthState(null);
        return null;
    }
}

return {
    initialize,
    signIn,
    signUp,
    signOut,
    getSession,
    getUser,
    isSignedIn
};


})();

