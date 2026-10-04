document.addEventListener("DOMContentLoaded", async () => {
    const client = window.supabaseClient;

    if (!client) {
        console.error("CLOSET: Supabase client is unavailable.");
        return;
    }

    const state = {
        selectedCategory: null,
        selectedSubcategory: null,
        currentListingId: null,
        selectedImages: [],
        draggedImageId: null
    };

    const elements = {
        statusMessage: document.getElementById("statusMessage"),

        logoButton: document.getElementById("logoButton"),
        headerProfileButton:
            document.getElementById("headerProfileButton"),
        headerSellButton:
            document.getElementById("headerSellButton"),

        homeListingsGrid:
            document.getElementById("homeListingsGrid"),

        browseListingsGrid:
            document.getElementById("browseListingsGrid"),

        browseSearch:
            document.getElementById("browseSearch"),

        categoryFilters:
            document.querySelectorAll(".category-filter"),

        homeHeaderSearch: document.getElementById("homeHeaderSearch"),
        headerSearchForm: document.getElementById("headerSearchForm"),
        headerSearchInput: document.getElementById("headerSearchInput"),
        headerCategoryButton: document.getElementById("headerCategoryButton"),
        headerCategoryMenu: document.getElementById("headerCategoryMenu"),
        browseCategoryMenu: document.getElementById("browseCategoryMenu"),
        homeCategoryStrip: document.getElementById("homeCategoryStrip"),

        browseSearch: document.getElementById("browseSearch"),
        browseFilterButton: document.getElementById("browseFilterButton"),
        browseFilterPanel: document.getElementById("browseFilterPanel"),
        clearBrowseFilters: document.getElementById("clearBrowseFilters"),
        browseCategoryButton: document.getElementById("browseCategoryButton"),
        browseLocation: document.getElementById("browseLocation"),
        browseCondition: document.getElementById("browseCondition"),
        browseMinPrice: document.getElementById("browseMinPrice"),
        browseMaxPrice: document.getElementById("browseMaxPrice"),
        browseSort: document.getElementById("browseSort"),

        listingForm: document.getElementById("listingForm"),
        itemImages: document.getElementById("itemImages"),
        imageUploadArea: document.getElementById("imageUploadArea"),
        imagePreviewGrid: document.getElementById("imagePreviewGrid"),
        imageCount: document.getElementById("imageCount"),

        publishListingButton:
            document.getElementById("publishListingButton"),

        listingDetailsContent:
            document.getElementById("listingDetailsContent"),

        profileAvatar:
            document.getElementById("profileAvatar"),

        profileDisplayName:
            document.getElementById("profileDisplayName"),

        profileUsername:
            document.getElementById("profileUsername"),

        profileBio:
            document.getElementById("profileBio"),

        profileLocation:
            document.getElementById("profileLocation"),

        profileEditButton:
            document.getElementById("editProfileButton"),

        profileSettingsButton:
            document.getElementById("settingsButton"),

        myListingsGrid:
            document.getElementById("myListingsGrid"),

        profileReviews:
            document.getElementById("profileReviews"),

        profileForm:
            document.getElementById("profileForm"),

        profileImage:
            document.getElementById("profileImage"),

        profileImagePreview:
            document.getElementById("profileImagePreview"),

        saveProfileButton:
            document.getElementById("saveProfileButton"),

        settingsEmail:
            document.getElementById("settingsEmail")
    };

    function showStatus(message, type = "success") {
        if (!elements.statusMessage) {
            return;
        }

        elements.statusMessage.textContent = message;
        elements.statusMessage.className =
            `status-message ${type}`;

        elements.statusMessage.hidden = false;

        window.clearTimeout(showStatus.timeout);

        showStatus.timeout = window.setTimeout(() => {
            elements.statusMessage.hidden = true;
        }, 4500);
    }

    function showFormMessage(element, message, type = "error") {
        if (!element) {
            return;
        }

        element.textContent = message;
        element.className = `form-message ${type}`;
        element.hidden = false;
    }

    function clearFormMessage(element) {
        if (!element) {
            return;
        }

        element.textContent = "";
        element.hidden = true;
    }

    function setButtonLoading(
        button,
        loading,
        loadingText = "Please wait…"
    ) {
        if (!button) {
            return;
        }

        if (loading) {
            button.dataset.originalText =
                button.textContent;

            button.textContent = loadingText;
            button.disabled = true;
        } else {
            button.textContent =
                button.dataset.originalText ||
                button.textContent;

            delete button.dataset.originalText;
            button.disabled = false;
        }
    }

    function formatPrice(price) {
        const amount = Number(price);

        if (!Number.isFinite(amount)) {
            return "Price unavailable";
        }

        return `${amount.toLocaleString("en-US")} MDL`;
    }

    function formatDate(date) {
        if (!date) {
            return "";
        }

        const parsed = new Date(date);

        if (Number.isNaN(parsed.getTime())) {
            return "";
        }

        return parsed.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    }

    function escapeHTML(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function getListingImage(listing) {
        const images =
            Array.isArray(listing?.listing_images)
                ? listing.listing_images
                : [];

        if (!images.length) {
            return null;
        }

        const sorted = [...images].sort(
            (a, b) =>
                Number(a.sort_order || 0) -
                Number(b.sort_order || 0)
        );

        return sorted[0]?.image_url || null;
    }

    function getProfileName(profile) {
        return (
            profile?.display_name ||
            profile?.username ||
            "CLOSET member"
        );
    }

    function getListingCategoryLabel(listing) {
        if (listing?.category?.name) {
            return listing.category.name;
        }

        if (listing?.category_name) {
            return listing.category_name;
        }

        if (listing?.subcategory?.name) {
            return listing.subcategory.name;
        }

        if (listing?.subcategory_name) {
            return listing.subcategory_name;
        }

        return "Marketplace";
    }

    function getListingSubcategoryLabel(listing) {
        if (listing?.subcategory?.name) {
            return listing.subcategory.name;
        }

        if (listing?.subcategory_name) {
            return listing.subcategory_name;
        }

        return "";
    }

    function createListingCard(listing) {
        const image = getListingImage(listing);

        const title =
            escapeHTML(listing?.title || "Untitled item");

        const category =
            escapeHTML(
                getListingCategoryLabel(listing)
            );

        const subcategory =
            escapeHTML(
                getListingSubcategoryLabel(listing)
            );

        const sellerName =
            escapeHTML(
                getProfileName(listing?.profiles)
            );

        const card =
            document.createElement("article");

        card.className = "listing-card";

        card.innerHTML = `
            <button
                type="button"
                class="listing-card-button"
                data-listing-id="${escapeHTML(listing.id)}"
                aria-label="View ${title}"
            >
                ${
                    image
                        ? `
                            <img
                                class="listing-image"
                                src="${escapeHTML(image)}"
                                alt="${title}"
                                loading="lazy"
                            >
                        `
                        : `
                            <div
                                class="listing-image"
                                aria-hidden="true"
                            ></div>
                        `
                }

                <div class="listing-card-body">

                    <h3 class="listing-card-title">
                        ${title}
                    </h3>

                    <div class="listing-card-meta">
                        <span>
                            ${category}
                            ${
                                subcategory
                                    ? ` · ${subcategory}`
                                    : ""
                            }
                        </span>

                        <span>
                            ${sellerName}
                        </span>
                    </div>

                    <div class="listing-card-price">
                        ${formatPrice(listing.price_mdl)}
                    </div>

                </div>
            </button>
        `;

        return card;
    }

    function renderListings(
        container,
        listings,
        emptyTitle,
        emptyText
    ) {
        if (!container) {
            return;
        }

        container.innerHTML = "";

        if (!listings.length) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>
                        ${escapeHTML(emptyTitle)}
                    </h3>

                    <p>
                        ${escapeHTML(emptyText)}
                    </p>
                </div>
            `;

            return;
        }

        listings.forEach((listing) => {
            container.appendChild(
                createListingCard(listing)
            );
        });
    }

    async function loadHomeListings() {
        if (!elements.homeListingsGrid) {
            return;
        }

        const result =
            await ClosetListings.getListings({
                limit: 8
            });

        if (!result.success) {
            renderListings(
                elements.homeListingsGrid,
                [],
                "Listings are unavailable",
                result.message
            );

            return;
        }

        renderListings(
            elements.homeListingsGrid,
            result.listings,
            "Nothing is listed yet",
            "Be the first person to give an item a new home."
        );
    }

    async function loadBrowseListings() {
        if (!elements.browseListingsGrid) {
            return;
        }

        const search =
            elements.browseSearch?.value || "";

        const result = await ClosetListings.getListings({
            categoryId: state.selectedCategory,
            search,
            location: elements.browseLocation?.value || "",
            condition: elements.browseCondition?.value || "",
            minPrice: elements.browseMinPrice?.value || "",
            maxPrice: elements.browseMaxPrice?.value || "",
            sort: elements.browseSort?.value || "newest",
            limit: 30
        });

        if (!result.success) {
            renderListings(
                elements.browseListingsGrid,
                [],
                "Listings are unavailable",
                result.message
            );

            return;
        }

        renderListings(
            elements.browseListingsGrid,
            result.listings,
            "No listings found",
            "Try another search or category."
        );
    }

    async function loadMyListings() {
        if (!elements.myListingsGrid) {
            return;
        }

        const user = ClosetAuth.getUser();

        if (!user) {
            renderListings(
                elements.myListingsGrid,
                [],
                "Sign in to see your listings",
                "Your published items will appear here."
            );

            return;
        }

        const result =
            await ClosetListings.getMyListings();

        if (!result.success) {
            renderListings(
                elements.myListingsGrid,
                [],
                "Your listings couldn't be loaded",
                result.message
            );

            return;
        }

        renderListings(
            elements.myListingsGrid,
            result.listings,
            "You haven't listed anything yet",
            "When you publish an item, it will appear here."
        );
    }

    async function openListing(id) {
        if (
            !id ||
            !elements.listingDetailsContent
        ) {
            return;
        }

        state.currentListingId = id;

        ClosetNavigation.show("listing");

        elements.listingDetailsContent.innerHTML = `
            <div class="empty-state">
                <h3>Loading listing…</h3>
                <p>
                    Please wait while we load the item.
                </p>
            </div>
        `;

        const result =
            await ClosetListings.getListing(id);

        if (!result.success) {
            elements.listingDetailsContent.innerHTML = `
                <div class="empty-state">
                    <h3>Listing unavailable</h3>
                    <p>
                        ${escapeHTML(result.message)}
                    </p>
                </div>
            `;

            return;
        }

        renderListingDetails(result.listing);
    }

    function renderListingDetails(listing) {
        const image =
            getListingImage(listing);

        const seller =
            listing?.profiles || {};

        const title =
            escapeHTML(listing?.title || "Untitled item");

        const description =
            escapeHTML(
                listing?.description ||
                "No description provided."
            );

        const sellerName =
            escapeHTML(
                getProfileName(seller)
            );

        const username =
            seller.username
                ? `@${escapeHTML(seller.username)}`
                : "";

        const category =
            escapeHTML(
                getListingCategoryLabel(listing)
            );

        const subcategory =
            getListingSubcategoryLabel(listing);

        const imageHTML = image
            ? `
                <img
                    class="listing-detail-image"
                    src="${escapeHTML(image)}"
                    alt="${title}"
                >
            `
            : `
                <div
                    class="listing-detail-image"
                    aria-hidden="true"
                ></div>
            `;

        const attributes =
            listing?.attributes &&
            typeof listing.attributes === "object"
                ? listing.attributes
                : {};

        const attributeEntries =
            Object.entries(attributes)
                .filter(
                    ([, value]) =>
                        value !== null &&
                        value !== undefined &&
                        String(value).trim() !== ""
                );

        const attributesHTML =
            attributeEntries.length
                ? `
                    <div class="detail-attributes">
                        ${attributeEntries
                            .map(
                                ([key, value]) => `
                                    <div class="detail-attribute">
                                        <span>
                                            ${escapeHTML(key)}
                                        </span>

                                        <strong>
                                            ${escapeHTML(
                                                value
                                            )}
                                        </strong>
                                    </div>
                                `
                            )
                            .join("")}
                    </div>
                `
                : "";

        elements.listingDetailsContent.innerHTML = `
            <div class="listing-detail">

                <div>
                    ${imageHTML}
                </div>

                <div class="listing-detail-info">

                    <p class="eyebrow">
                        ${category}
                        ${
                            subcategory
                                ? ` · ${escapeHTML(subcategory)}`
                                : ""
                        }
                    </p>

                    <h1>
                        ${title}
                    </h1>

                    <div class="detail-price">
                        ${formatPrice(listing.price_mdl)}
                    </div>

                    <div class="detail-meta">

                        ${
                            listing.condition
                                ? `
                                    <span class="detail-pill">
                                        ${escapeHTML(
                                            formatCondition(
                                                listing.condition
                                            )
                                        )}
                                    </span>
                                `
                                : ""
                        }

                        <span class="detail-pill">
                            Listed
                            ${formatDate(
                                listing.created_at
                            )}
                        </span>

                    </div>

                    ${attributesHTML}

                    <p class="detail-description">
                        ${description}
                    </p>

                    <div class="seller-card">

                        ${
                            seller.avatar_url
                                ? `
                                    <img
                                        class="avatar"
                                        src="${escapeHTML(
                                            seller.avatar_url
                                        )}"
                                        alt=""
                                    >
                                `
                                : `
                                    <div
                                        class="avatar"
                                        aria-hidden="true"
                                    ></div>
                                `
                        }

                        <div>
                            <strong>
                                ${sellerName}
                            </strong>

                            <span>
                                ${username}
                            </span>
                        </div>

                    </div>

                    <div class="protection-card">

                        <strong>
                            Buying Protection
                        </strong>

                        <p>
                            CLOSET is working on a
                            secure buying experience.
                        </p>

                    </div>

                </div>

            </div>
        `;
    }

    function formatCondition(condition) {
        const labels = {
            new: "New",
            like_new: "Like new",
            good: "Good",
            fair: "Fair",
            for_parts: "For parts"
        };

        return labels[condition] || condition;
    }

    async function loadProfile() {
        const user =
            ClosetAuth.getUser();

        if (!user) {
            window.location.href = "login.html";
            return;
        }

        const result =
            await ClosetProfile.getMyProfile();

        if (!result.success) {
            showStatus(
                result.message,
                "error"
            );

            return;
        }

        const profile =
            result.profile || {};

        if (elements.profileDisplayName) {
            elements.profileDisplayName.textContent =
                profile.display_name ||
                user.user_metadata?.name ||
                "CLOSET member";
        }

        if (elements.profileUsername) {
            elements.profileUsername.textContent =
                profile.username
                    ? `@${profile.username}`
                    : "";
        }

        if (elements.profileBio) {
            elements.profileBio.textContent =
                profile.bio || "";
        }

        if (elements.profileLocation) {
            elements.profileLocation.textContent =
                profile.location || "";
        }

        if (elements.profileAvatar) {
            if (profile.avatar_url) {
                elements.profileAvatar.innerHTML = `
                    <img
                        src="${escapeHTML(
                            profile.avatar_url
                        )}"
                        alt=""
                    >
                `;
            } else {
                elements.profileAvatar.innerHTML = `
                    <span>
                        ${escapeHTML(
                            (
                                profile.display_name ||
                                user.user_metadata?.name ||
                                "C"
                            )
                                .charAt(0)
                                .toUpperCase()
                        )}
                    </span>
                `;
            }
        }

        if (elements.settingsEmail) {
            elements.settingsEmail.textContent =
                user.email || "";
        }

        await Promise.all([
            loadMyListings(),
            loadReviews(user.id)
        ]);
    }

    async function loadReviews(userId) {
        if (!elements.profileReviews) {
            return;
        }

        const result =
            await ClosetProfile.getReviews(userId);

        elements.profileReviews.innerHTML = "";

        if (
            !result.success ||
            !result.reviews.length
        ) {
            elements.profileReviews.innerHTML = `
                <div class="empty-state">
                    <h3>No reviews yet</h3>
                    <p>
                        Reviews from other members
                        will appear here.
                    </p>
                </div>
            `;

            return;
        }

        result.reviews.forEach((review) => {
            const reviewer =
                review.profiles || {};

            const card =
                document.createElement("article");

            card.className = "review-card";

            const rating =
                Math.max(
                    0,
                    Math.min(
                        5,
                        Number(review.rating) || 0
                    )
                );

            const stars =
                "★".repeat(rating);

            card.innerHTML = `
                <div class="review-top">

                    <span class="review-author">
                        ${escapeHTML(
                            getProfileName(reviewer)
                        )}
                    </span>

                    <span class="review-date">
                        ${formatDate(
                            review.created_at
                        )}
                    </span>

                </div>

                <div class="review-stars">
                    ${stars}
                </div>

                ${
                    review.comment
                        ? `
                            <p class="review-comment">
                                ${escapeHTML(
                                    review.comment
                                )}
                            </p>
                        `
                        : ""
                }
            `;

            elements.profileReviews.appendChild(card);
        });
    }

    async function loadEditProfile() {
        const user =
            ClosetAuth.getUser();

        if (!user) {
            window.location.href =
                "login.html";
            return;
        }

        const result =
            await ClosetProfile.getMyProfile();

        if (!result.success) {
            showStatus(
                result.message,
                "error"
            );

            return;
        }

        const profile =
            result.profile || {};

        const nameInput =
            document.getElementById(
                "profileName"
            );

        const usernameInput =
            document.getElementById(
                "profileUsername"
            );

        const bioInput =
            document.getElementById(
                "profileBio"
            );

        const locationInput =
            document.getElementById(
                "profileLocation"
            );

        if (nameInput) {
            nameInput.value =
                profile.display_name ||
                user.user_metadata?.name ||
                "";
        }

        if (usernameInput) {
            usernameInput.value =
                profile.username || "";
        }

        if (bioInput) {
            bioInput.value =
                profile.bio || "";
        }

        if (locationInput) {
            locationInput.value =
                profile.location || "";
        }

        if (elements.profileImagePreview) {
            if (profile.avatar_url) {
                elements.profileImagePreview.src =
                    profile.avatar_url;

                elements.profileImagePreview.hidden =
                    false;
            } else {
                elements.profileImagePreview.hidden =
                    true;
            }
        }
    }

    async function saveProfile(event) {
        event.preventDefault();

        const user =
            ClosetAuth.getUser();

        if (!user) {
            window.location.href =
                "login.html";
            return;
        }

        const displayName =
            document.getElementById(
                "profileName"
            )?.value || "";

        const username =
            document.getElementById(
                "profileUsername"
            )?.value || "";

        const bio =
            document.getElementById(
                "profileBio"
            )?.value || "";

        const location =
            document.getElementById(
                "profileLocation"
            )?.value || "";

        setButtonLoading(
            elements.saveProfileButton,
            true,
            "Saving…"
        );

        const result =
            await ClosetProfile.updateProfile({
                displayName,
                username,
                bio,
                location
            });

        if (!result.success) {
            setButtonLoading(
                elements.saveProfileButton,
                false
            );

            showStatus(
                result.message,
                "error"
            );

            return;
        }

        const image =
            elements.profileImage?.files?.[0];

        if (image) {
            const imageResult =
                await ClosetProfile.uploadAvatar(
                    image
                );

            if (!imageResult.success) {
                setButtonLoading(
                    elements.saveProfileButton,
                    false
                );

                showStatus(
                    `Profile saved, but the profile photo could not be uploaded: ${imageResult.message}`,
                    "error"
                );

                await loadProfile();

                ClosetNavigation.show(
                    "profile"
                );

                return;
            }
        }

        setButtonLoading(
            elements.saveProfileButton,
            false
        );

        showStatus(
            "Your profile has been updated.",
            "success"
        );

        await loadProfile();

        ClosetNavigation.show(
            "profile"
        );
    }

    async function publishListing(event) {
        event.preventDefault();
        const messageElement = document.getElementById("listingFormMessage");
        clearFormMessage(messageElement);

        if (!ClosetAuth.isSignedIn()) {
            showFormMessage(messageElement, "Please sign in before publishing an item.");
            window.setTimeout(() => { window.location.href = "login.html"; }, 500);
            return;
        }

        const title = document.getElementById("itemName")?.value.trim() || "";
        const price = document.getElementById("itemPrice")?.value || "";
        const categoryId = document.getElementById("itemCategory")?.value || "";
        const subcategoryId = document.getElementById("itemSubcategory")?.value || "";
        const condition = document.getElementById("itemCondition")?.value || "";
        const location = document.getElementById("itemLocation")?.value.trim() || "";
        const description = document.getElementById("itemDescription")?.value.trim() || "";
        const images = [...(elements.itemImages?.files || [])];

        const safety = runListingSafetyCheck({ title, description, location });
        if (!safety.allowed) return showFormMessage(messageElement, safety.message);
        if (!title) return showFormMessage(messageElement, "Please add a title for your item.");
        if (!price || Number(price) <= 0) return showFormMessage(messageElement, "Please enter a valid price.");
        if (!categoryId) return showFormMessage(messageElement, "Please choose a category.");
        if (!condition) return showFormMessage(messageElement, "Please choose the item's condition.");
        if (!location) return showFormMessage(messageElement, "Please add a location.");
        if (!description) return showFormMessage(messageElement, "Please add a description.");
        if (!state.selectedImages.length) return showFormMessage(messageElement, "Please add at least one photo.");

        setButtonLoading(elements.publishListingButton, true, "Publishing…");
        const result = await ClosetListings.createListing({
            title, description, price, categoryId, subcategoryId, condition, location,
            images: state.selectedImages.map(item => item.file)
        });
        setButtonLoading(elements.publishListingButton, false);

        if (!result.success) return showFormMessage(messageElement, result.message);

        state.selectedImages.forEach(item => item.url && URL.revokeObjectURL(item.url));
        state.selectedImages = [];
        elements.listingForm?.reset();
        renderImagePreviews();
        resetCategoryPickers();

        showStatus("Your item has been published.", "success");
        await Promise.all([loadHomeListings(), loadBrowseListings(), loadMyListings()]);
        if (result.listing?.id) await openListing(result.listing.id);
    }

    function runListingSafetyCheck({ title, description, location }) {
        const text = [title, description, location].join(" ").toLowerCase();
        const blockedPatterns = [
            /\bdrugs?\b/, /\bcocaine\b/, /\bheroin\b/, /\bmeth\b/,
            /\bweapon(s)?\b/, /\bfirearm(s)?\b/, /\bguns?\b/, /\bammunition\b/,
            /\bexplosive(s)?\b/, /\bgrenade(s)?\b/
        ];
        if (blockedPatterns.some(pattern => pattern.test(text))) {
            return { allowed: false, message: "This listing contains content that CLOSET does not allow. Please only list ordinary items that can be legally sold on the marketplace." };
        }
        return { allowed: true };
    }

    function resetCategoryPickers() {
        const categoryValue = document.getElementById("categoryPickerValue");
        const subcategoryValue = document.getElementById("subcategoryPickerValue");
        const subcategoryField = document.getElementById("subcategoryField");
        if (categoryValue) categoryValue.textContent = "Choose a category";
        if (subcategoryValue) subcategoryValue.textContent = "Choose a subcategory";
        if (subcategoryField) subcategoryField.hidden = true;
        state.selectedCategory = null;
        state.selectedSubcategory = null;
    }

    function setupImagePreview() {
        if (!elements.itemImages) return;
        const addFiles = (fileList) => {
            const remaining = 20 - state.selectedImages.length;
            if (remaining <= 0) return showStatus("You can upload up to 20 photos.", "error");
            [...fileList].slice(0, remaining).forEach(file => {
                if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return showStatus("Only JPG, PNG and WebP photos are allowed.", "error");
                if (file.size > 10 * 1024 * 1024) return showStatus("Each photo must be 10 MB or smaller.", "error");
                state.selectedImages.push({ id: crypto.randomUUID(), file, url: URL.createObjectURL(file) });
            });
            renderImagePreviews();
            elements.itemImages.value = "";
        };
        elements.itemImages.addEventListener("change", event => addFiles(event.target.files));
        elements.imageUploadArea?.addEventListener("dragover", event => { event.preventDefault(); elements.imageUploadArea.classList.add("dragging"); });
        elements.imageUploadArea?.addEventListener("dragleave", () => elements.imageUploadArea.classList.remove("dragging"));
        elements.imageUploadArea?.addEventListener("drop", event => { event.preventDefault(); elements.imageUploadArea.classList.remove("dragging"); addFiles(event.dataTransfer.files); });
    }

    function renderImagePreviews() {
        if (!elements.imagePreviewGrid) return;
        elements.imagePreviewGrid.innerHTML = "";
        if (elements.imageCount) elements.imageCount.textContent = `${state.selectedImages.length} / 20`;
        state.selectedImages.forEach((item, index) => {
            const card = document.createElement("div");
            card.className = `image-preview-card${index === 0 ? " is-main" : ""}`;
            card.draggable = true;
            card.dataset.imageId = item.id;
            card.innerHTML = `
                <img src="${escapeHTML(item.url)}" alt="Photo ${index + 1}">
                <div class="image-preview-overlay">
                    ${index === 0 ? '<span class="main-photo-badge">Main photo</span>' : '<button type="button" class="make-main-button">Make main</button>'}
                    <button type="button" class="remove-photo-button" aria-label="Remove photo">×</button>
                </div>`;
            card.querySelector(".remove-photo-button").addEventListener("click", () => {
                const removed = state.selectedImages.splice(index, 1)[0];
                if (removed?.url) URL.revokeObjectURL(removed.url);
                renderImagePreviews();
            });
            card.querySelector(".make-main-button")?.addEventListener("click", () => {
                const [selected] = state.selectedImages.splice(index, 1);
                state.selectedImages.unshift(selected);
                renderImagePreviews();
            });
            card.addEventListener("dragstart", event => { state.draggedImageId = item.id; event.dataTransfer.effectAllowed = "move"; });
            card.addEventListener("dragover", event => event.preventDefault());
            card.addEventListener("drop", event => {
                event.preventDefault();
                const from = state.selectedImages.findIndex(image => image.id === state.draggedImageId);
                const to = state.selectedImages.findIndex(image => image.id === item.id);
                if (from < 0 || to < 0 || from === to) return;
                const [moved] = state.selectedImages.splice(from, 1);
                state.selectedImages.splice(to, 0, moved);
                renderImagePreviews();
            });
            elements.imagePreviewGrid.appendChild(card);
        });
    }

    async function loadHomeCategories() {
        if (!elements.homeCategoryStrip) return;
        try {
            const categories = await ClosetCategories.getTopLevelCategories();
            elements.homeCategoryStrip.innerHTML = categories.map(category => `
                <button type="button" class="category-filter" data-category="${escapeHTML(category.id)}">${escapeHTML(category.name)}</button>
            `).join("");
            elements.homeCategoryStrip.querySelectorAll(".category-filter").forEach(button => {
                button.addEventListener("click", () => {
                    state.selectedCategory = button.dataset.category || null;
                    if (elements.browseSearch) elements.browseSearch.value = "";
                    ClosetNavigation.show("browse");
                });
            });
        } catch (error) {
            console.error("CLOSET home categories error:", error);
            elements.homeCategoryStrip.innerHTML = '<div class="listing-empty"><p>Categories are temporarily unavailable.</p></div>';
        }
    }

    async function openBrowseCategoryMenu() {
        const menu = elements.browseCategoryMenu;
        if (!menu) return;

        if (!menu.hidden) {
            menu.hidden = true;
            elements.browseCategoryButton?.setAttribute("aria-expanded", "false");
            return;
        }

        const categories = await ClosetCategories.getTopLevelCategories();
        menu.innerHTML = categories.map(category => `
            <button type="button" class="browse-category-option" data-category-id="${escapeHTML(category.id)}">${escapeHTML(category.name)}</button>
        `).join("");

        menu.hidden = false;
        elements.browseCategoryButton?.setAttribute("aria-expanded", "true");

        menu.querySelectorAll("[data-category-id]").forEach(button => {
            button.addEventListener("click", () => {
                state.selectedCategory = button.dataset.categoryId || null;
                menu.hidden = true;
                elements.browseCategoryButton?.setAttribute("aria-expanded", "false");
                elements.browseCategoryButton.textContent = button.textContent.trim();
                loadBrowseListings();
            });
        });
    }

    async function openCategoryMenu() {
        const menu = elements.headerCategoryMenu;
        if (!menu) return;
        if (!menu.hidden) {
            menu.hidden = true;
            elements.headerCategoryButton?.setAttribute("aria-expanded", "false");
            return;
        }
        const categories = await ClosetCategories.getTopLevelCategories();
        menu.innerHTML = categories.map(category => `
            <button type="button" class="header-category-option" data-category-id="${escapeHTML(category.id)}">${escapeHTML(category.name)}</button>`).join("");
        menu.hidden = false;
        elements.headerCategoryButton?.setAttribute("aria-expanded", "true");
        menu.querySelectorAll("[data-category-id]").forEach(button => {
            button.addEventListener("click", () => {
                state.selectedCategory = button.dataset.categoryId || null;
                menu.hidden = true;
                elements.headerCategoryButton?.setAttribute("aria-expanded", "false");
                ClosetNavigation.show("browse");
            });
        });
    }

    function setupHomeHeaderSearch() {
        elements.headerCategoryButton?.addEventListener("click", openCategoryMenu);
        elements.headerSearchForm?.addEventListener("submit", event => {
            event.preventDefault();
            if (elements.browseSearch) elements.browseSearch.value = elements.headerSearchInput?.value.trim() || "";
            state.selectedCategory = null;
            ClosetNavigation.show("browse");
        });
        window.addEventListener("closet:navigate", event => {
            const isHome = event.detail?.view === "home";
            if (elements.homeHeaderSearch) elements.homeHeaderSearch.hidden = !isHome;
            if (!isHome && elements.headerCategoryMenu) {
                elements.headerCategoryMenu.hidden = true;
                elements.headerCategoryButton?.setAttribute("aria-expanded", "false");
            }
        });
    }

    function setupHeaderActions() {
        elements.logoButton?.addEventListener(
            "click",
            () => {
                ClosetNavigation.show("home");
            }
        );

        elements.headerProfileButton?.addEventListener(
            "click",
            () => {
                if (ClosetAuth.isSignedIn()) {
                    ClosetNavigation.show("profile");
                } else {
                    window.location.href =
                        "login.html";
                }
            }
        );

        elements.headerSellButton?.addEventListener(
            "click",
            () => {
                if (ClosetAuth.isSignedIn()) {
                    ClosetNavigation.show("sell");
                } else {
                    window.location.href =
                        "login.html";
                }
            }
        );
    }

    function setupListingClicks() {
        document.addEventListener(
            "click",
            (event) => {
                const button =
                    event.target.closest(
                        "[data-listing-id]"
                    );

                if (!button) {
                    return;
                }

                event.preventDefault();

                openListing(
                    button.dataset.listingId
                );
            }
        );
    }

    function setupBrowseControls() {
        const refresh = debounce(loadBrowseListings, 250);

        elements.browseSearch?.addEventListener("input", refresh);
        elements.browseLocation?.addEventListener("change", refresh);
        elements.browseCondition?.addEventListener("change", refresh);
        elements.browseMinPrice?.addEventListener("input", refresh);
        elements.browseMaxPrice?.addEventListener("input", refresh);
        elements.browseSort?.addEventListener("change", refresh);
        elements.browseCategoryButton?.addEventListener("click", openBrowseCategoryMenu);

        elements.browseFilterButton?.addEventListener("click", () => {
            const panel = elements.browseFilterPanel;
            if (!panel) return;

            const opening = panel.hidden;
            panel.hidden = !opening;
            elements.browseFilterButton.setAttribute("aria-expanded", String(opening));

            if (!opening && elements.browseCategoryMenu) {
                elements.browseCategoryMenu.hidden = true;
                elements.browseCategoryButton?.setAttribute("aria-expanded", "false");
            }
        });

        elements.clearBrowseFilters?.addEventListener("click", () => {
            state.selectedCategory = null;

            if (elements.browseLocation) elements.browseLocation.value = "";
            if (elements.browseCondition) elements.browseCondition.value = "";
            if (elements.browseMinPrice) elements.browseMinPrice.value = "";
            if (elements.browseMaxPrice) elements.browseMaxPrice.value = "";
            if (elements.browseSort) elements.browseSort.value = "newest";

            if (elements.browseCategoryButton) {
                elements.browseCategoryButton.textContent = "Category";
                elements.browseCategoryButton.setAttribute("aria-expanded", "false");
            }

            if (elements.browseCategoryMenu) {
                elements.browseCategoryMenu.hidden = true;
            }

            loadBrowseListings();
        });
    }

    function debounce(callback, delay) {
        let timeout;

        return (...args) => {
            window.clearTimeout(timeout);

            timeout = window.setTimeout(
                () => callback(...args),
                delay
            );
        };
    }

    function setupNavigationEvents() {
        window.addEventListener(
            "closet:navigate",
            async (event) => {
                const view =
                    event.detail?.view;

                if (view === "home") {
                    await loadHomeListings();
                }

                if (view === "browse") {
                    await loadBrowseListings();
                }

                if (view === "profile") {
                    await loadProfile();
                }

                if (view === "edit-profile") {
                    await loadEditProfile();
                }
            }
        );
    }

    function setupForms() {
        elements.listingForm?.addEventListener(
            "submit",
            publishListing
        );

        elements.profileForm?.addEventListener(
            "submit",
            saveProfile
        );
    }

    function setupProfileActions() {
        elements.profileEditButton?.addEventListener(
            "click",
            () => {
                if (!ClosetAuth.isSignedIn()) {
                    window.location.href =
                        "login.html";

                    return;
                }

                ClosetNavigation.show(
                    "edit-profile"
                );
            }
        );

        elements.profileSettingsButton?.addEventListener(
            "click",
            () => {
                if (!ClosetAuth.isSignedIn()) {
                    window.location.href =
                        "login.html";

                    return;
                }

                ClosetNavigation.show(
                    "settings"
                );
            }
        );
    }

    async function updateAuthenticatedUI() {
        const signedIn =
            ClosetAuth.isSignedIn();

        if (elements.headerProfileButton) {
            elements.headerProfileButton.textContent =
                signedIn
                    ? "Profile"
                    : "Sign in";
        }

        if (elements.headerSellButton) {
            elements.headerSellButton.textContent = "Sell an item";
        }

        if (
            elements.settingsEmail &&
            signedIn
        ) {
            elements.settingsEmail.textContent =
                ClosetAuth.getUser()?.email || "";
        }
    }

    function setupLanguageSettings() {
        if (!elements.settingsLanguage || typeof ClosetI18n === "undefined") {
            return;
        }

        elements.settingsLanguage.value = ClosetI18n.getLanguage();

        elements.settingsLanguage.addEventListener("change", () => {
            ClosetI18n.setLanguage(elements.settingsLanguage.value);
        });

        window.addEventListener("closet:language-changed", event => {
            const language = event.detail?.language;
            if (language && elements.settingsLanguage) {
                elements.settingsLanguage.value = language;
            }
        });
    }

    function setupAuthStateListener() {
        window.addEventListener(
            "closet:auth",
            async () => {
                await updateAuthenticatedUI();
            }
        );
    }

    async function initialize() {
        ClosetNavigation.initialize("home");
        if (elements.homeHeaderSearch) elements.homeHeaderSearch.hidden = false;

        setupHeaderActions();
        setupHomeHeaderSearch();
        setupListingClicks();
        setupBrowseControls();
        setupForms();
        setupProfileActions();
        setupImagePreview();
        setupNavigationEvents();
        setupAuthStateListener();
        setupLanguageSettings();

        const session =
            await ClosetAuth.initialize();

        await updateAuthenticatedUI();

        await Promise.all([loadHomeListings(), loadHomeCategories()]);

        if (session) {
            console.log(
                "CLOSET: Signed-in session restored."
            );
        }

        console.log(
            "CLOSET initialized."
        );
    }

    await initialize();
});

