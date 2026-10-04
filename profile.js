const ClosetProfile = (() => {
const client = window.supabaseClient;
const signOutButton = document.getElementById("signOutButton");

async function handleSignOut() {
    if (!signOutButton) return;

    signOutButton.disabled = true;
    signOutButton.textContent = "Signing out...";

    const result = await ClosetAuth.signOut();

    if (!result.success) {
        signOutButton.disabled = false;
        signOutButton.textContent = "Sign out";
        return;
    }

    window.location.href = "index.html";
}

async function getMyProfile() {
    const user = ClosetAuth.getUser();

    if (!user) {
        return {
            success: false,
            message: "You need to sign in first.",
            profile: null
        };
    }

    try {
        const { data, error } =
            await client
                .from("profiles")
                .select(`
                    id,
                    display_name,
                    username,
                    bio,
                    location,
                    avatar_url,
                    created_at,
                    updated_at
                `)
                .eq("id", user.id)
                .maybeSingle();

        if (error) {
            throw error;
        }

        return {
            success: true,
            profile: data
        };

    } catch (error) {
        console.error(
            "CLOSET profile fetch error:",
            error
        );

        return {
            success: false,
            message: getProfileErrorMessage(error),
            profile: null
        };
    }
}

async function updateProfile({
    displayName,
    username,
    bio,
    location
}) {
    const user = ClosetAuth.getUser();

    if (!user) {
        return {
            success: false,
            message: "You need to sign in first."
        };
    }

    try {
        const cleanUsername =
            username?.trim().toLowerCase() || null;

        const { data, error } =
            await client
                .from("profiles")
                .update({
                    display_name:
                        displayName?.trim() || "",
                    username: cleanUsername,
                    bio:
                        bio?.trim() || "",
                    location:
                        location?.trim() || ""
                })
                .eq("id", user.id)
                .select()
                .single();

        if (error) {
            throw error;
        }

        return {
            success: true,
            profile: data
        };

    } catch (error) {
        console.error(
            "CLOSET profile update error:",
            error
        );

        return {
            success: false,
            message: getProfileErrorMessage(error)
        };
    }
}

async function uploadAvatar(file) {
    const user = ClosetAuth.getUser();

    if (!user) {
        return {
            success: false,
            message: "You need to sign in first."
        };
    }

    if (!file) {
        return {
            success: false,
            message: "Please select an image."
        };
    }

    if (!file.type.startsWith("image/")) {
        return {
            success: false,
            message: "Please select a valid image file."
        };
    }

    const extension =
        file.name.split(".").pop()?.toLowerCase() || "jpg";

    const path =
        `${user.id}/avatar-${crypto.randomUUID()}.${extension}`;

    try {
        const { error: uploadError } =
            await client.storage
                .from("listing-images")
                .upload(path, file, {
                    cacheControl: "3600",
                    upsert: false
                });

        if (uploadError) {
            throw uploadError;
        }

        const {
            data: { publicUrl }
        } =
            client.storage
                .from("listing-images")
                .getPublicUrl(path);

        const { data, error } =
            await client
                .from("profiles")
                .update({
                    avatar_url: publicUrl
                })
                .eq("id", user.id)
                .select()
                .single();

        if (error) {
            await client.storage
                .from("listing-images")
                .remove([path]);

            throw error;
        }

        return {
            success: true,
            profile: data
        };

    } catch (error) {
        console.error(
            "CLOSET avatar upload error:",
            error
        );

        return {
            success: false,
            message: getProfileErrorMessage(error)
        };
    }
}

async function getProfile(userId) {
    if (!userId) {
        return {
            success: false,
            message: "Profile not found.",
            profile: null
        };
    }

    try {
        const { data, error } =
            await client
                .from("profiles")
                .select(`
                    id,
                    display_name,
                    username,
                    bio,
                    location,
                    avatar_url,
                    created_at
                `)
                .eq("id", userId)
                .maybeSingle();

        if (error) {
            throw error;
        }

        if (!data) {
            return {
                success: false,
                message: "Profile not found.",
                profile: null
            };
        }

        return {
            success: true,
            profile: data
        };

    } catch (error) {
        console.error(
            "CLOSET public profile error:",
            error
        );

        return {
            success: false,
            message: getProfileErrorMessage(error),
            profile: null
        };
    }
}

async function getReviews(userId) {
    if (!userId) {
        return {
            success: false,
            message: "Profile not found.",
            reviews: []
        };
    }

    try {
        const { data, error } =
            await client
                .from("reviews")
                .select(`
                    id,
                    rating,
                    comment,
                    created_at,
                    reviewer_id,
                    profiles!reviews_reviewer_id_fkey (
                        display_name,
                        username,
                        avatar_url
                    )
                `)
                .eq("seller_id", userId)
                .order("created_at", {
                    ascending: false
                });

        if (error) {
            throw error;
        }

        return {
            success: true,
            reviews: data || []
        };

    } catch (error) {
        console.error(
            "CLOSET reviews error:",
            error
        );

        return {
            success: false,
            message: getProfileErrorMessage(error),
            reviews: []
        };
    }
}

async function createReview({
    sellerId,
    rating,
    comment
}) {
    const user = ClosetAuth.getUser();

    if (!user) {
        return {
            success: false,
            message: "You need to sign in first."
        };
    }

    if (user.id === sellerId) {
        return {
            success: false,
            message: "You can't review your own profile."
        };
    }

    try {
        const { data, error } =
            await client
                .from("reviews")
                .insert({
                    reviewer_id: user.id,
                    seller_id: sellerId,
                    rating: Number(rating),
                    comment:
                        comment?.trim() || ""
                })
                .select()
                .single();

        if (error) {
            throw error;
        }

        return {
            success: true,
            review: data
        };

    } catch (error) {
        console.error(
            "CLOSET review creation error:",
            error
        );

        return {
            success: false,
            message: getProfileErrorMessage(error)
        };
    }
}

function getProfileErrorMessage(error) {
    const message =
        String(error?.message || "").toLowerCase();

    if (message.includes("duplicate")) {
        return "That username is already taken.";
    }

    if (message.includes("row-level security")) {
        return "You don't have permission to perform that action.";
    }

    return (
        error?.message ||
        "We couldn't update the profile. Please try again."
    );
}

 signOutButton?.addEventListener("click", handleSignOut);

return {
    getMyProfile,
    updateProfile,
    uploadAvatar,
    getProfile,
    getReviews,
    createReview
};


})();
