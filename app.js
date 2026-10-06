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
        draggedImageId: null,
        editingListingId: null,
        listingBackView: "browse",
        publicProfileUserId: null,
        publicProfileBackView: "browse",
        editReturnView: "browse",
        listingFormMode: "new",
        listingFormSnapshot: null,
        listingFormDirty: false
    };

    const elements = {
        statusMessage: document.getElementById("statusMessage"),
        offlineBanner: document.getElementById("offlineBanner"),

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
        saveListingDraftButton:
            document.getElementById("saveListingDraftButton"),
        cancelListingButton:
            document.getElementById("cancelListingButton"),

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

        savedListingsGrid:
            document.getElementById("savedListingsGrid"),

        profileReviews:
            document.getElementById("profileReviews"),

        profileForm:
            document.getElementById("profileForm"),

        profileImage:
            document.getElementById("profileImage"),

        editProfileAvatar:
            document.getElementById("editProfileAvatar"),

        profileAvatarColor:
            document.getElementById("profileAvatarColor"),

        removeProfilePhotoButton:
            document.getElementById("removeProfilePhotoButton"),

        saveProfileButton:
            document.getElementById("saveProfileButton"),

        settingsEmail:
            document.getElementById("settingsEmail"),

        settingsLanguage:
            document.getElementById("settingsLanguage"),

        settingsTheme:
            document.getElementById("settingsTheme"),

        settingsMessageDensity:
            document.getElementById("settingsMessageDensity"),

        settingsReduceMotion:
            document.getElementById("settingsReduceMotion"),

        settingsPendingNotice:
            document.getElementById("settingsPendingNotice"),

        saveSettingsButton:
            document.getElementById("saveSettingsButton"),

        logoutButton:
            document.getElementById("logoutButton"),

        publicProfileBackButton:
            document.getElementById("publicProfileBackButton"),
        publicProfileAvatar:
            document.getElementById("publicProfileAvatar"),
        publicProfileEyebrow:
            document.getElementById("publicProfileEyebrow"),
        publicProfileDisplayName:
            document.getElementById("publicProfileDisplayName"),
        publicProfileUsername:
            document.getElementById("publicProfileUsername"),
        publicProfileBio:
            document.getElementById("publicProfileBio"),
        publicProfileLocation:
            document.getElementById("publicProfileLocation"),
        publicProfileEditButton:
            document.getElementById("publicProfileEditButton"),
        publicProfileListingsGrid:
            document.getElementById("publicProfileListingsGrid"),
        publicProfileReviews:
            document.getElementById("publicProfileReviews")
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

    function setupOfflineIndicator() {
        const banner = elements.offlineBanner;
        let offline = navigator.onLine === false;
        let probeTimer = null;
        let probeInFlight = false;

        const setStatus = online => {
            offline = !online;

            if (banner) {
                banner.hidden = online;
            }

            document.body.classList.toggle("is-offline", !online);
        };

        const probeConnection = async () => {
            if (probeInFlight) return;
            probeInFlight = true;

            if (navigator.onLine === false) {
                setStatus(false);
                probeInFlight = false;
                return;
            }

            const config = window.CLOSET_SUPABASE_CONFIG;

            if (!config?.url || !config?.key) {
                setStatus(true);
                probeInFlight = false;
                return;
            }

            const controller = new AbortController();
            const timeout = window.setTimeout(() => controller.abort(), 5000);

            try {
                const response = await fetch(
                    config.url + "/auth/v1/settings?closet_probe=" + Date.now(),
                    {
                        method: "GET",
                        headers: {
                            apikey: config.key
                        },
                        cache: "no-store",
                        signal: controller.signal
                    }
                );

                // Any HTTP response means the device can reach Supabase.
                setStatus(true);
            } catch (error) {
                // Only expose the offline UI when the browser itself says it
                // has no network. A Supabase/API failure is not the same thing
                // as the user's Wi-Fi/mobile data being disconnected.
                setStatus(navigator.onLine !== false);
            } finally {
                window.clearTimeout(timeout);
                probeInFlight = false;
            }
        };

        setStatus(!offline);

        window.addEventListener("offline", () => {
            setStatus(false);
        });

        window.addEventListener("online", () => {
            void probeConnection();
        });

        window.addEventListener("closet:network", event => {
            if (event.detail?.online === false && navigator.onLine === false) {
                setStatus(false);
            } else if (event.detail?.online !== false) {
                setStatus(true);
            }
        });

        window.ClosetNetwork = {
            isOffline: () => navigator.onLine === false || offline,
            probe: probeConnection
        };

        void probeConnection();
        probeTimer = window.setInterval(probeConnection, 15000);

        window.addEventListener("pagehide", () => {
            if (probeTimer) {
                window.clearInterval(probeTimer);
                probeTimer = null;
            }
        }, { once: true });
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

    function getSavedKey() {
        const user = ClosetAuth.getUser();
        return user ? `closet-saved-listings-${user.id}` : "closet-saved-listings-guest";
    }

    function getSavedIds() {
        try {
            const value = JSON.parse(
                localStorage.getItem(getSavedKey()) || "[]"
            );
            return Array.isArray(value) ? value : [];
        } catch {
            return [];
        }
    }

    function isSavedListing(id) {
        return getSavedIds().includes(id);
    }

    async function toggleSavedListing(id) {
        if (!ClosetAuth.isSignedIn()) {
            showStatus("Sign in to save listings.", "error");
            return;
        }

        const ids = getSavedIds();
        const index = ids.indexOf(id);

        if (index >= 0) ids.splice(index, 1);
        else ids.push(id);

        try {
            localStorage.setItem(getSavedKey(), JSON.stringify(ids));
        } catch {
            showStatus("Your browser could not save this listing.", "error");
            return;
        }

        renderVisibleListingHearts();
        await loadSavedListings();
    }

    function renderVisibleListingHearts() {
        document.querySelectorAll("[data-save-listing-id]").forEach(button => {
            const saved = isSavedListing(button.dataset.saveListingId);
            button.classList.toggle("is-saved", saved);
            button.textContent = saved ? "♥" : "♡";
            button.setAttribute(
                "aria-label",
                saved ? "Remove from saved" : "Save listing"
            );
        });
    }

    function getListingStatusLabel(status) {
        const labels = { active: "Active", sold: "Sold", hidden: "Hidden" };
        return labels[status] || "Active";
    }

    async function setMyListingStatus(listing, status, card) {
        if (!listing?.id || !["active", "sold", "hidden"].includes(status)) return;
        const buttons = card?.querySelectorAll("[data-listing-status]") || [];
        buttons.forEach(button => { button.disabled = true; });
        try {
            const result = await ClosetListings.updateListing(listing.id, { status });
            if (!result.success) {
                showStatus(result.message || "We couldn't update this listing.", "error");
                return;
            }
            showStatus(
                status === "hidden" ? "Your listing is hidden." :
                status === "sold" ? "Your listing is marked as sold." :
                "Your listing is active again.",
                "success"
            );
            await Promise.all([
                loadMyListings(),
                loadHomeListings(),
                loadBrowseListings(),
                loadSavedListings()
            ]);
        } catch (error) {
            console.error("A doua șansă listing status error:", error);
            showStatus("We couldn't update this listing. Please try again.", "error");
        } finally {
            buttons.forEach(button => { button.disabled = false; });
        }
    }

    function createListingCard(listing) {
        const image = getListingImage(listing);
        const title = escapeHTML(listing?.title || "Untitled item");
        const category = escapeHTML(getListingCategoryLabel(listing));
        const subcategory = escapeHTML(getListingSubcategoryLabel(listing));
        const sellerName = escapeHTML(getProfileName(listing?.profiles));
        const ownListing = ClosetAuth.getUser()?.id === listing?.seller_id;
        const saved = isSavedListing(listing.id);

        const card = document.createElement("article");
        card.className = "listing-card";
        const status = listing?.status || "active";
        card.classList.toggle("is-listing-hidden", status === "hidden");

        card.innerHTML = `
            <div class="listing-card-shell">
                <button type="button" class="listing-card-button"
                    data-listing-id="${escapeHTML(listing.id)}"
                    aria-label="View ${title}">
                    ${image
                        ? `<img class="listing-image" src="${escapeHTML(image)}" alt="${title}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src=\'fallback-placeholder.svg\';">`
                        : `<div class="listing-image" aria-hidden="true"></div>`
                    }
                    <div class="listing-card-body">
                        <div class="listing-card-status-row">
                            ${ownListing ? `<span class="listing-status-badge status-${escapeHTML(status)}">${escapeHTML(getListingStatusLabel(status))}</span>` : ""}
                        </div>
                        <h3 class="listing-card-title">${title}</h3>
                        <div class="listing-card-meta">
                            <span>${category}${subcategory ? ` · ${subcategory}` : ""}</span>
                            <span>${sellerName}</span>
                        </div>
                        <div class="listing-card-price">${formatPrice(listing.price_mdl)}</div>
                    </div>
                </button>
                <div class="listing-card-actions">
                    <button type="button" class="listing-save-button${saved ? " is-saved" : ""}"
                        data-save-listing-id="${escapeHTML(listing.id)}"
                        aria-label="${saved ? "Remove from saved" : "Save listing"}">${saved ? "♥" : "♡"}</button>
                    ${ownListing ? `<button type="button" class="listing-edit-button"
                        data-edit-listing-id="${escapeHTML(listing.id)}">Edit</button>` : ""}
                </div>
                ${ownListing ? `
                    <div class="listing-card-management">
                        <span class="listing-card-management-label">Manage ad</span>
                        <div class="listing-card-status-actions">
                            <button type="button" class="status-action-button${status === "active" ? " is-current" : ""}" data-listing-status="active" ${status === "active" ? "disabled" : ""}>Make active</button>
                            <button type="button" class="status-action-button${status === "sold" ? " is-current" : ""}" data-listing-status="sold" ${status === "sold" ? "disabled" : ""}>Make sold</button>
                            <button type="button" class="status-action-button${status === "hidden" ? " is-current" : ""}" data-listing-status="hidden" ${status === "hidden" ? "disabled" : ""}>Hide ad</button>
                        </div>
                    </div>
                ` : ""}
            </div>
        `;

        card.querySelector("[data-save-listing-id]")?.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            void toggleSavedListing(listing.id);
        });

        card.querySelectorAll("[data-listing-status]").forEach(button => {
            button.addEventListener("click", event => {
                event.preventDefault();
                event.stopPropagation();
                void setMyListingStatus(listing, event.currentTarget.dataset.listingStatus, card);
            });
        });

        card.querySelector("[data-edit-listing-id]")?.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            void startEditingListing(listing);
        });

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
        if (!elements.homeListingsGrid) return;

        const result = await ClosetListings.getHomeListings({ limit: 8 });

        if (!result.success) {
            renderListings(
                elements.homeListingsGrid,
                [],
                "Listings are unavailable",
                result.message
            );
            return;
        }

        // Render immediately. Category labels are enrichment, not a
        // prerequisite for showing the marketplace.
        renderListings(
            elements.homeListingsGrid,
            result.listings,
            "Nothing is listed yet",
            "Be the first person to give an item a new home."
        );

        // Enrich cards in the background from the shared category cache.
        // A slow categories request can no longer block Latest Items.
        ClosetCategories.getCategories()
            .then(categories => {
                const categoryMap = new Map(
                    categories.map(category => [category.id, category])
                );

                result.listings.forEach(listing => {
                    const category = categoryMap.get(listing.category_id);
                    if (category) listing.category = category;
                });

                renderListings(
                    elements.homeListingsGrid,
                    result.listings,
                    "Nothing is listed yet",
                    "Be the first person to give an item a new home."
                );
            })
            .catch(() => {
                // Keep the already-rendered listings visible.
            });
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

    async function loadSavedListings() {
        if (!elements.savedListingsGrid) return;

        if (!ClosetAuth.isSignedIn()) {
            elements.savedListingsGrid.innerHTML = `
                <div class="empty-state">
                    <h3>Sign in to save items</h3>
                    <p>Your saved listings will appear here.</p>
                </div>`;
            return;
        }

        const ids = getSavedIds();

        if (!ids.length) {
            elements.savedListingsGrid.innerHTML = `
                <div class="empty-state">
                    <h3>No saved listings yet</h3>
                    <p>Tap the heart on any listing to save it here.</p>
                </div>`;
            return;
        }

        const results = await Promise.all(
            ids.map(id => ClosetListings.getListing(id))
        );

        const listings = results
            .filter(result => result.success && result.listing)
            .map(result => result.listing);

        try {
            localStorage.setItem(
                getSavedKey(),
                JSON.stringify(listings.map(listing => listing.id))
            );
        } catch {}

        renderListings(
            elements.savedListingsGrid,
            listings,
            "No saved listings yet",
            "Tap the heart on any listing to save it here."
        );

        renderVisibleListingHearts();
    }

    async function openListing(id, options = {}) {
        if (!id || !elements.listingDetailsContent) return;

        const currentView = ClosetNavigation.getCurrentView();
        if (!options.preserveBack && currentView && currentView !== "listing") {
            state.listingBackView = currentView;
        }

        state.currentListingId = id;
        ClosetNavigation.show("listing");

        elements.listingDetailsContent.innerHTML = `
            <div class="empty-state">
                <h3>Loading listing…</h3>
                <p>Please wait while we load the item.</p>
            </div>
        `;

        const result = await ClosetListings.getListing(id);

        if (!result.success) {
            elements.listingDetailsContent.innerHTML = `
                <div class="empty-state">
                    <h3>Listing unavailable</h3>
                    <p>${escapeHTML(result.message)}</p>
                </div>
            `;
            return;
        }

        renderListingDetails(result.listing);
        void loadRelatedListings(result.listing);
    }

    function renderListingDetails(listing) {
        const image = getListingImage(listing);
        const seller = listing?.profiles || {};
        const title = escapeHTML(listing?.title || "Untitled item");
        const description = escapeHTML(listing?.description || "No description provided.");
        const sellerName = escapeHTML(getProfileName(seller));
        const username = seller.username ? `@${escapeHTML(seller.username)}` : "";
        const category = escapeHTML(getListingCategoryLabel(listing));
        const subcategory = getListingSubcategoryLabel(listing);
        const ownListing = ClosetAuth.getUser()?.id === listing?.seller_id;
        const saved = isSavedListing(listing.id);

        const imageHTML = image
            ? `<img class="listing-detail-image" src="${escapeHTML(image)}" alt="${title}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src=\'fallback-placeholder.svg\';">`
            : `<div class="listing-detail-image" aria-hidden="true"></div>`;

        const attributes =
            listing?.attributes && typeof listing.attributes === "object"
                ? listing.attributes
                : {};

        const attributeEntries = Object.entries(attributes).filter(
            ([, value]) => value !== null && value !== undefined && String(value).trim() !== ""
        );

        const attributesHTML = attributeEntries.length
            ? `
                <div class="detail-attributes">
                    ${attributeEntries.map(([key, value]) => `
                        <div class="detail-attribute">
                            <span>${escapeHTML(key)}</span>
                            <strong>${escapeHTML(value)}</strong>
                        </div>
                    `).join("")}
                </div>
            `
            : "";

        const sellerAvatarHTML = seller.avatar_url
            ? `<img class="avatar" src="${escapeHTML(seller.avatar_url)}" alt="">`
            : `<span class="avatar avatar-initials" style="background-color: ${getAvatarColor(seller)}" aria-hidden="true"><span>${escapeHTML(getAvatarInitial(seller, sellerName))}</span></span>`;

        elements.listingDetailsContent.innerHTML = `
            <div class="listing-detail">
                <div>${imageHTML}</div>

                <div class="listing-detail-info">
                    <p class="eyebrow">
                        ${category}
                        ${subcategory ? ` · ${escapeHTML(subcategory)}` : ""}
                    </p>

                    <h1>${title}</h1>
                    <div class="detail-price">${formatPrice(listing.price_mdl)}</div>

                    <div class="detail-meta">
                        ${
                            listing.condition
                                ? `<span class="detail-pill">${escapeHTML(formatCondition(listing.condition))}</span>`
                                : ""
                        }
                        <span class="detail-pill">Listed ${formatDate(listing.created_at)}</span>
                    </div>

                    ${attributesHTML}

                    <div class="detail-description-section">
                        <h2 class="detail-section-title">Description</h2>
                        <p class="detail-description">${description}</p>
                    </div>

                    <button type="button" class="seller-profile-button"
                        data-detail-profile-id="${escapeHTML(seller.id || listing.seller_id || "")}">
                        ${sellerAvatarHTML}
                        <span class="seller-profile-copy">
                            <strong>${sellerName}</strong>
                            <span>${username}</span>
                        </span>
                    </button>

                    <div class="listing-detail-actions">
                        ${
                            ownListing
                                ? `<button type="button" class="secondary-button listing-buy-button" disabled aria-disabled="true">Your listing</button>`
                                : `
                                    <button
                                        type="button"
                                        class="listing-message-icon-button"
                                        data-detail-message-seller
                                        aria-label="Message seller"
                                        title="Message seller"
                                    >
                                        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                                            <path d="M5 5.5A2.5 2.5 0 0 1 7.5 3h9A2.5 2.5 0 0 1 19 5.5v6A2.5 2.5 0 0 1 16.5 14H11l-4.5 4V14.3A2.5 2.5 0 0 1 4 11.5v-6A2.5 2.5 0 0 1 5 5.5Z"></path>
                                        </svg>
                                    </button>
                                    <button type="button" class="primary-button listing-buy-button" data-i18n="Buy Now">Buy Now</button>
                                    <button type="button" class="secondary-button listing-offer-button">Give Offer</button>
                                `
                        }
                        <button
                            type="button"
                            class="listing-save-button${saved ? " is-saved" : ""}"
                            data-detail-save-listing-id="${escapeHTML(listing.id)}"
                            aria-label="${saved ? "Remove from saved" : "Save listing"}"
                        >${saved ? "♥" : "♡"}</button>
                        ${
                            ownListing
                                ? `<button type="button" class="secondary-button" data-detail-edit-listing-id="${escapeHTML(listing.id)}">Edit</button>`
                                : ""
                        }
                    </div>
                    ${
                        ownListing
                            ? '<div class="listing-owner-status">' +
                              '<span class="listing-owner-status-label">Listing status</span>' +
                              '<div class="listing-owner-status-actions">' +
                              '<button type="button" class="status-action-button" data-detail-status="active">Make active</button>' +
                              '<button type="button" class="status-action-button" data-detail-status="sold">Make sold</button>' +
                              '<button type="button" class="status-action-button" data-detail-status="hidden">Hide ad</button>' +
                              '</div></div>'
                            : ""
                    }

                    <div class="protection-card">
                        <strong>Buying Protection</strong>
                        <p>A future A doua șansă buying feature. We'll announce when it becomes available.</p>
                    </div>
                </div>
            </div>

            <section id="relatedListingsSection" class="related-listings-section" hidden>
                <div class="section-heading">
                    <div>
                        <p class="eyebrow">MORE TO EXPLORE</p>
                        <h2>More like this.</h2>
                    </div>
                </div>
                <div id="relatedListingsGrid" class="listing-grid"></div>
            </section>
        `;

        const buyButton = elements.listingDetailsContent.querySelector(".listing-buy-button");
        const saveButton = elements.listingDetailsContent.querySelector("[data-detail-save-listing-id]");
        const messageSellerButton =
            elements.listingDetailsContent.querySelector("[data-detail-message-seller]");

        messageSellerButton?.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();

            if (typeof ClosetMessages === "undefined" || !ClosetMessages.openConversationWithSeller) {
                showStatus("Messaging is temporarily unavailable. Please try again.", "error");
                return;
            }

            void ClosetMessages.openConversationWithSeller(
                seller.id || listing.seller_id,
                listing.id
            );
        });

        if (!ownListing) {
            buyButton?.addEventListener("click", event => {
                event.preventDefault();
                event.stopPropagation();

                if (!window.CLOSETOrders?.open) {
                    showStatus("Buying is temporarily unavailable. Please try again.", "error");
                    return;
                }

                void (async () => {
                    try {
                        const conversationResult =
                            await ClosetMessages?.findConversation?.(
                                seller.id || listing.seller_id,
                                listing.id
                            );

                        if (!conversationResult?.success || !conversationResult.conversation) {
                            await ClosetMessages?.openConversationWithSeller?.(
                                seller.id || listing.seller_id,
                                listing.id
                            );

                            showStatus(
                                "Start by messaging the seller before placing your purchase request.",
                                "success"
                            );
                            return;
                        }

                        window.CLOSETOrders.open(listing, seller);
                    } catch (error) {
                        console.error("A doua șansă Buy Now error:", error);
                        showStatus("Buy Now could not be opened. Please try again.", "error");
                    }
                })();
            });

            const offerButton =
                elements.listingDetailsContent.querySelector(".listing-offer-button");

            offerButton?.addEventListener("click", event => {
                event.preventDefault();
                event.stopPropagation();

                if (
                    typeof ClosetMessages === "undefined" ||
                    !window.CLOSETOffers?.open
                ) {
                    showStatus("Offers are temporarily unavailable. Please try again.", "error");
                    return;
                }

                void (async () => {
                    try {
                        const conversation =
                            await ClosetMessages.openConversationWithSeller(
                                seller.id || listing.seller_id,
                                listing.id
                            );

                        if (!conversation) return;

                        if (!window.CLOSETOffers?.open) {
                            showStatus("Offers are temporarily unavailable. Please try again.", "error");
                            return;
                        }

                        window.CLOSETOffers.open(
                            listing,
                            seller,
                            conversation.id
                        );
                    } catch (error) {
                        console.error("A doua шанса offer open error:", error);
                        showStatus("The offer form could not be opened. Please try again.", "error");
                    }
                })();
            });
        }
        saveButton?.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            void toggleSavedListing(listing.id).then(() => {
                const updated = isSavedListing(listing.id);
                saveButton.textContent = updated ? "♥" : "♡";
                saveButton.classList.toggle("is-saved", updated);
                saveButton.setAttribute("aria-label", updated ? "Remove from saved" : "Save listing");
            });
        });

        elements.listingDetailsContent.querySelector("[data-detail-edit-listing-id]")?.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            void startEditingListing(listing);
        });

        elements.listingDetailsContent.querySelectorAll("[data-detail-status]").forEach(button => {
            button.addEventListener("click", async event => {
                event.preventDefault();
                event.stopPropagation();

                const nextStatus = event.currentTarget.dataset.detailStatus;

                if (!["active", "sold", "hidden"].includes(nextStatus)) {
                    return;
                }

                const buttons =
                    elements.listingDetailsContent.querySelectorAll("[data-detail-status]");

                buttons.forEach(item => {
                    item.disabled = true;
                });

                try {
                    const result =
                        await ClosetListings.updateListing(
                            listing.id,
                            { status: nextStatus }
                        );

                    if (!result.success) {
                        window.alert(result.message);
                        return;
                    }

                    await openListing(
                        listing.id,
                        { preserveBack: true }
                    );
                } finally {
                    buttons.forEach(item => {
                        item.disabled = false;
                    });
                }
            });
        });
        elements.listingDetailsContent.querySelector("[data-detail-profile-id]")?.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            const profileId = event.currentTarget.dataset.detailProfileId;
            if (profileId) void openPublicProfile(profileId);
        });
    }

    async function loadRelatedListings(listing) {
        const section = document.getElementById("relatedListingsSection");
        const grid = document.getElementById("relatedListingsGrid");
        if (!section || !grid || !listing?.id) return;

        const result = await ClosetListings.getListings({
            categoryId: listing.category_id || null,
            limit: 5,
            lightweight: true
        });

        if (!result.success) {
            section.hidden = true;
            return;
        }

        const related = result.listings.filter(item => item.id !== listing.id).slice(0, 4);

        if (!related.length) {
            section.hidden = true;
            return;
        }

        renderListings(grid, related, "", "");
        section.hidden = false;
        renderVisibleListingHearts();
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

    function getAvatarInitial(profile, fallbackName = "") {
        return String(
            profile?.display_name ||
            profile?.username ||
            fallbackName ||
            "A doua șansă"
        ).trim().charAt(0).toUpperCase() || "A";
    }

    function getAvatarColor(profile) {
        const color = String(profile?.avatar_color || "#E8E0D6");
        return /^#[0-9A-Fa-f]{6}$/.test(color)
            ? color
            : "#E8E0D6";
    }

    function renderAvatar(container, profile, fallbackName = "") {
        if (!container) return;
        container.replaceChildren();

        if (profile?.avatar_url) {
            const image = document.createElement("img");
            image.src = profile.avatar_url;
            image.alt = "";
            container.appendChild(image);
            container.style.backgroundColor = "";
            return;
        }

        const initial = document.createElement("span");
        initial.textContent = getAvatarInitial(profile, fallbackName);
        container.appendChild(initial);
        container.style.backgroundColor = getAvatarColor(profile);
    }
    async function openPublicProfile(userId) {
        if (!userId) return;

        const currentView = ClosetNavigation.getCurrentView();
        if (currentView && currentView !== "public-profile") state.publicProfileBackView = currentView;

        state.publicProfileUserId = userId;
        ClosetNavigation.show("public-profile");
    }

    async function loadPublicProfile(userId) {
        if (!userId || !elements.publicProfileListingsGrid) return;

        elements.publicProfileListingsGrid.innerHTML = `
            <div class="empty-state">
                <h3>Loading profile…</h3>
                <p>Please wait while we load this profile.</p>
            </div>
        `;

        const [profileResult, listingsResult, reviewsResult] = await Promise.all([
            ClosetProfile.getProfile(userId),
            ClosetListings.getSellerListings(userId, { limit: 30 }),
            ClosetProfile.getReviews(userId)
        ]);

        if (!profileResult.success || !profileResult.profile) {
            elements.publicProfileListingsGrid.innerHTML = `
                <div class="empty-state">
                    <h3>Profile unavailable</h3>
                    <p>${escapeHTML(profileResult.message || "This profile could not be found.")}</p>
                </div>
            `;
            return;
        }

        const profile = profileResult.profile;
        const isSelf = ClosetAuth.getUser()?.id === profile.id;

        if (elements.publicProfileEyebrow) {
            elements.publicProfileEyebrow.textContent = isSelf ? "Your Profile" : "Seller Profile";
        }
        if (elements.publicProfileDisplayName) {
            elements.publicProfileDisplayName.textContent =
                profile.display_name || profile.username || "A doua șansă member";
        }
        if (elements.publicProfileUsername) {
            elements.publicProfileUsername.textContent =
                profile.username ? `@${profile.username}` : "";
        }
        if (elements.publicProfileBio) elements.publicProfileBio.textContent = profile.bio || "";
        if (elements.publicProfileLocation) elements.publicProfileLocation.textContent = profile.location || "";

        if (elements.publicProfileAvatar) {
            renderAvatar(elements.publicProfileAvatar, profile, profile.display_name || profile.username);
        }

        if (elements.publicProfileEditButton) {
            elements.publicProfileEditButton.hidden = !isSelf;
            elements.publicProfileEditButton.onclick = () => ClosetNavigation.show("edit-profile");
        }

        renderListings(
            elements.publicProfileListingsGrid,
            listingsResult.success ? listingsResult.listings : [],
            "No active listings",
            "This seller has no active listings right now."
        );

        if (elements.publicProfileReviews) {
            elements.publicProfileReviews.innerHTML = "";

            if (!reviewsResult.success || !reviewsResult.reviews.length) {
                elements.publicProfileReviews.innerHTML = `
                    <div class="empty-state">
                        <h3>No reviews yet</h3>
                        <p>Reviews from other members will appear here.</p>
                    </div>
                `;
            } else {
                reviewsResult.reviews.forEach(review => {
                    const reviewer = review.profiles || {};
                    const card = document.createElement("article");
                    card.className = "review-card";
                    const rating = Math.max(0, Math.min(5, Number(review.rating) || 0));

                    card.innerHTML = `
                        <div class="review-top">
                            <span class="review-author">${escapeHTML(getProfileName(reviewer))}</span>
                            <span class="review-date">${formatDate(review.created_at)}</span>
                        </div>
                        <div class="review-stars">${"★".repeat(rating)}</div>
                        ${review.comment ? `<p class="review-comment">${escapeHTML(review.comment)}</p>` : ""}
                    `;

                    elements.publicProfileReviews.appendChild(card);
                });
            }
        }

        renderVisibleListingHearts();
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
            renderAvatar(
                elements.profileAvatar,
                profile,
                user.user_metadata?.name
            );
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

        if (elements.removeProfilePhotoButton) {
            elements.removeProfilePhotoButton.dataset.useInitials =
                profile.avatar_url ? "false" : "true";
        }

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

        if (elements.editProfileAvatar) {
            renderAvatar(
                elements.editProfileAvatar,
                profile,
                user.user_metadata?.name
            );
        }

        if (elements.profileAvatarColor) {
            elements.profileAvatarColor.value =
                getAvatarColor(profile);
        }

        if (elements.profileImage) {
            elements.profileImage.value = "";
        }

        if (elements.removeProfilePhotoButton) {
            elements.removeProfilePhotoButton.dataset.useInitials =
                profile.avatar_url ? "false" : "true";
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

        const avatarColor =
            elements.profileAvatarColor?.value || "#E8E0D6";

        const useInitials =
            elements.removeProfilePhotoButton?.dataset.useInitials === "true";

        const result =
            await ClosetProfile.updateProfile({
                displayName,
                username,
                bio,
                location,
                avatarColor,
                useInitials
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

        if (image && !useInitials) {
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
            showFormMessage(
                messageElement,
                "Please sign in before publishing an item."
            );
            return;
        }

        const title = document.getElementById("itemName")?.value.trim() || "";
        const price = document.getElementById("itemPrice")?.value || "";
        const categoryId = document.getElementById("itemCategory")?.value || "";
        const subcategoryId = document.getElementById("itemSubcategory")?.value || "";
        const categorySelection = ClosetCategoryPicker.getSelection();
        const categoryName = categorySelection?.category?.name || "";
        const subcategoryName = categorySelection?.subcategory?.name || "";
        const condition = document.getElementById("itemCondition")?.value || "";
        const location = document.getElementById("itemLocation")?.value.trim() || "";
        const description = document.getElementById("itemDescription")?.value.trim() || "";

        const safety = runListingSafetyCheck({ title, description, location });
        if (!safety.allowed) {
            showFormMessage(messageElement, safety.message);
            return;
        }

        if (!title) return showFormMessage(messageElement, "Please add a title for your item.");
        if (!price || Number(price) <= 0) return showFormMessage(messageElement, "Please enter a valid price.");
        if (!categoryId) return showFormMessage(messageElement, "Please choose a category.");
        if (!condition) return showFormMessage(messageElement, "Please choose the item's condition.");
        if (!location) return showFormMessage(messageElement, "Please add a location.");
        if (!description) return showFormMessage(messageElement, "Please add a description.");
        if (!state.selectedImages.length) {
            return showFormMessage(messageElement, "Please keep at least one photo on the listing.");
        }

        setButtonLoading(
            elements.publishListingButton,
            true,
            state.editingListingId ? "Saving…" : "Publishing…"
        );

        let result;

        try {
            if (state.editingListingId) {
                result = await ClosetListings.updateListing(
                    state.editingListingId,
                    {
                        title,
                        description,
                        price_mdl: Number(price),
                        category_id: subcategoryId || categoryId,
                        condition,
                        location,
                        images: state.editingListingId ? state.selectedImages : undefined
                    }
                );
            } else {
                result = await ClosetListings.createListing({
                    title,
                    description,
                    price,
                    categoryId,
                    subcategoryId,
                    categoryName,
                    subcategoryName,
                    condition,
                    location,
                    images: state.selectedImages
                });
            }
        } catch (error) {
            console.error("CLOSET publish handler error:", error);
            result = {
                success: false,
                message: error?.message || "We couldn't complete that action. Please try again."
            };
        } finally {
            setButtonLoading(elements.publishListingButton, false);
        }

        if (!result.success) {
            showFormMessage(messageElement, result.message);
            return;
        }

        const editedId = state.editingListingId;
        if (editedId) {
            clearListingDraft(editedId);
            state.listingBackView = state.editReturnView || state.listingBackView || "browse";
            state.editReturnView = "browse";
        }
        state.editingListingId = null;
        state.listingFormMode = "new";
        state.listingFormDirty = false;
        state.listingFormSnapshot = null;

        state.selectedImages.forEach(
            item => item.url && URL.revokeObjectURL(item.url)
        );
        state.selectedImages = [];

        elements.listingForm?.reset();
        renderImagePreviews();
        resetCategoryPickers();

        if (elements.publishListingButton) {
            elements.publishListingButton.textContent = "Publish listing";
        }

        showStatus(
            editedId
                ? "Your listing has been updated."
                : "Your item has been published.",
            "success"
        );

        await Promise.all([
            loadHomeListings(),
            loadBrowseListings(),
            loadMyListings(),
            loadSavedListings()
        ]);

        if (editedId) {
            await openListing(editedId, { preserveBack: true });
        } else if (result.listing?.id) {
            await openListing(result.listing.id);
        }
    }

    async function startEditingListing(listing) {
        if (!listing?.id) return;

        if (ClosetAuth.getUser()?.id !== listing.seller_id) {
            showStatus("You can only edit your own listings.", "error");
            return;
        }

        state.editingListingId = listing.id;
        state.currentListingId = listing.id;

        const currentView = ClosetNavigation.getCurrentView();
        state.editReturnView =
            currentView === "listing"
                ? (state.listingBackView || "browse")
                : (currentView || "browse");

        const setValue = (id, value) => {
            const element = document.getElementById(id);
            if (element) element.value = value ?? "";
        };

        setValue("itemName", listing.title);
        setValue("itemPrice", listing.price_mdl);
        setValue("itemCondition", listing.condition);
        setValue("itemLocation", listing.location);
        setValue("itemDescription", listing.description);

        const allCategories = await ClosetCategories.getCategories();
        const selectedCategory = allCategories.find(item => item.id === listing.category_id);
        const parentCategory = selectedCategory?.parent_id
            ? allCategories.find(item => item.id === selectedCategory.parent_id)
            : selectedCategory;

        const categoryValue = document.getElementById("categoryPickerValue");
        const subcategoryValue = document.getElementById("subcategoryPickerValue");
        const categoryInput = document.getElementById("itemCategory");
        const subcategoryInput = document.getElementById("itemSubcategory");
        const subcategoryField = document.getElementById("subcategoryField");

        if (categoryValue) categoryValue.textContent = parentCategory?.name || "Choose a category";
        if (categoryInput) categoryInput.value = parentCategory?.id || listing.category_id || "";

        if (selectedCategory?.parent_id) {
            if (subcategoryField) subcategoryField.hidden = false;
            if (subcategoryValue) subcategoryValue.textContent = selectedCategory.name || "Choose a subcategory";
            if (subcategoryInput) subcategoryInput.value = selectedCategory.id;
        } else {
            if (subcategoryField) subcategoryField.hidden = true;
            if (subcategoryValue) subcategoryValue.textContent = "Choose a subcategory";
            if (subcategoryInput) subcategoryInput.value = "";
        }

        state.selectedImages.forEach(item => {
            if (!item.existing && item.url) URL.revokeObjectURL(item.url);
        });

        state.selectedImages = [...(listing.listing_images || [])]
            .sort((x, y) => Number(x.sort_order || 0) - Number(y.sort_order || 0))
            .map(image => ({
                id: image.id,
                imageId: image.id,
                existing: true,
                file: null,
                url: image.image_url
            }));

        renderImagePreviews();

        const savedDraft = loadSavedListingDraft(listing.id);
        if (savedDraft) {
            state._categoryCache = allCategories;
            applyListingDraft(savedDraft);
            showStatus("Draft changes restored for this listing.", "success");
        }

        state.listingFormMode = "edit";
        state.listingFormSnapshot = getListingFormSnapshot();
        state.listingFormDirty = false;
        if (elements.publishListingButton) elements.publishListingButton.textContent = "Save changes";
        if (elements.saveListingDraftButton) elements.saveListingDraftButton.textContent = "Save as draft";
        if (elements.cancelListingButton) elements.cancelListingButton.hidden = false;
        clearFormMessage(document.getElementById("listingFormMessage"));
        ClosetNavigation.show("sell");
    }

    const LISTING_DRAFT_PREFIX = "a-doua-sansa-listing-draft-";

    function getListingDraftKey(listingId = "new") {
        const userId = ClosetAuth.getUser()?.id || "guest";
        return LISTING_DRAFT_PREFIX + userId + "-" + (listingId || "new");
    }

    function getListingFormSnapshot() {
        return {
            title: document.getElementById("itemName")?.value || "",
            price: document.getElementById("itemPrice")?.value || "",
            categoryId: document.getElementById("itemCategory")?.value || "",
            subcategoryId: document.getElementById("itemSubcategory")?.value || "",
            condition: document.getElementById("itemCondition")?.value || "",
            location: document.getElementById("itemLocation")?.value || "",
            description: document.getElementById("itemDescription")?.value || "",
            images: state.selectedImages.map(image => ({ id:image.id, imageId:image.imageId || image.id, existing:Boolean(image.existing), url:(image.existing || image.imported) ? image.url : null }))
        };
    }

    function markListingFormDirty() { state.listingFormDirty = true; }
    function clearListingDraft(listingId = "new") { try { localStorage.removeItem(getListingDraftKey(listingId)); } catch {} }

    function saveListingDraft() {
        const listingId = state.editingListingId || "new";
        try {
            localStorage.setItem(getListingDraftKey(listingId), JSON.stringify({ savedAt:Date.now(), mode:state.listingFormMode, ...getListingFormSnapshot() }));
            state.listingFormDirty = false;
            showStatus("Draft saved. You can come back and finish it later.", "success");
            return true;
        } catch (error) {
            console.error("CLOSET draft save error:", error);
            showStatus("We couldn't save the draft on this device.", "error");
            return false;
        }
    }

    function resetListingForm({ clearDraft = false } = {}) {
        const draftId = state.editingListingId || "new";
        if (clearDraft) clearListingDraft(draftId);
        state.selectedImages.forEach(item => { if (item?.url && !item.existing && !item.imported) URL.revokeObjectURL(item.url); });
        state.selectedImages = [];
        state.editingListingId = null;
        state.currentListingId = null;
        state.listingFormMode = "new";
        state.listingFormSnapshot = null;
        state.listingFormDirty = false;
        state._categoryCache = null;
        elements.listingForm?.reset();
        resetCategoryPickers();
        renderImagePreviews();
        if (elements.publishListingButton) elements.publishListingButton.textContent = "Publish listing";
        if (elements.saveListingDraftButton) elements.saveListingDraftButton.textContent = "Save as draft";
        if (elements.cancelListingButton) elements.cancelListingButton.hidden = false;
        clearFormMessage(document.getElementById("listingFormMessage"));
    }

    function hasMeaningfulListingContent(snapshot = getListingFormSnapshot()) {
        if (!snapshot) return false;
        return Boolean(
            String(snapshot.title || "").trim() ||
            String(snapshot.price || "").trim() ||
            String(snapshot.categoryId || "").trim() ||
            String(snapshot.subcategoryId || "").trim() ||
            String(snapshot.condition || "").trim() ||
            String(snapshot.location || "").trim() ||
            String(snapshot.description || "").trim() ||
            (Array.isArray(snapshot.images) && snapshot.images.length)
        );
    }

    function hasListingChanges() {
        if (state.listingFormDirty) return true;
        const current = getListingFormSnapshot();
        if (!state.listingFormSnapshot) {
            return hasMeaningfulListingContent(current);
        }
        return JSON.stringify(current) !== JSON.stringify(state.listingFormSnapshot);
    }

    function leaveListingForm(nextView = "home") {
        if (!hasListingChanges()) { ClosetNavigation.show(nextView); return true; }
        const choice = window.confirm(state.editingListingId ? "You have unsaved changes. Press OK to save a draft and leave, or Cancel to stay here." : "You have an unfinished listing. Press OK to save it as a draft and leave, or Cancel to stay here.");
        if (!choice) return false;
        if (!saveListingDraft()) return false;
        ClosetNavigation.show(nextView);
        return true;
    }

    function startNewListing() {
        if (hasListingChanges()) {
            const choice = window.confirm("Start a new listing? Your current changes will be saved as a draft first.");
            if (!choice) return;
            if (!saveListingDraft()) return;
        }
        resetListingForm();
        ClosetNavigation.show("sell");
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

    function loadSavedListingDraft(listingId) {
        try {
            const raw = localStorage.getItem(getListingDraftKey(listingId));
            if (!raw) return null;
            const draft = JSON.parse(raw);
            if (!draft || typeof draft !== "object") return null;
            return draft;
        } catch { return null; }
    }

    function applyListingDraft(draft) {
        if (!draft) return false;
        const setValue = (id, value) => { const el = document.getElementById(id); if (el) el.value = value ?? ""; };
        setValue("itemName", draft.title);
        setValue("itemPrice", draft.price);
        setValue("itemCondition", draft.condition);
        setValue("itemLocation", draft.location);
        setValue("itemDescription", draft.description);
        setValue("itemCategory", draft.categoryId);
        setValue("itemSubcategory", draft.subcategoryId);

        const all = state._categoryCache || [];
        const category = all.find(item => item.id === draft.categoryId);
        const subcategory = all.find(item => item.id === draft.subcategoryId);
        const categoryValue = document.getElementById("categoryPickerValue");
        const subcategoryValue = document.getElementById("subcategoryPickerValue");
        const subcategoryField = document.getElementById("subcategoryField");
        if (categoryValue) categoryValue.textContent = category?.name || "Choose a category";
        if (subcategoryValue) subcategoryValue.textContent = subcategory?.name || "Choose a subcategory";
        if (subcategoryField) subcategoryField.hidden = !subcategory;
        state.selectedCategory = draft.categoryId || null;
        state.selectedSubcategory = draft.subcategoryId || null;

        const savedImages = Array.isArray(draft.images) ? draft.images.filter(image => image?.url) : [];
        if (savedImages.length) {
            const currentByUrl = new Map(state.selectedImages.map(image => [image.url, image]));
            const importedOrExisting = savedImages.map(image => currentByUrl.get(image.url) || ({ id:image.id || crypto.randomUUID(), imageId:image.imageId || image.id, existing:Boolean(image.existing), imported:Boolean(image.imported), file:null, url:image.url }));
            state.selectedImages = importedOrExisting;
            renderImagePreviews();
        }
        return true;
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

    async function detectImportedCategory(data) {
        try {
            if (typeof ClosetCategories === "undefined" || typeof ClosetCategoryPicker === "undefined") return;
            const categories = await ClosetCategories.getCategories();
            const topLevel = categories.filter(category => category.parent_id === null);
            const text = [data?.title || "", data?.description || ""].join(" ").toLowerCase();
            const keywordGroups = {
                clothing: ["clothing","fashion","shirt","t-shirt","tshirt","jeans","dress","jacket","coat","shoes","sneakers","hoodie","pants","одеж","обув","джинс","rochie","cămaș","haine","pantofi"],
                electronics: ["electronics","phone","smartphone","iphone","android","samsung","xiaomi","laptop","computer","tablet","monitor","keyboard","mouse","headphones","телефон","смартфон","ноутбук","компьютер","планшет","наушник","telefon","calculator","tabletă","căști"],
                vehicles: ["car","vehicle","auto","bmw","mercedes","audi","toyota","volkswagen","машин","авто","автомобил","mașină","automobil"],
                home: ["home","garden","kitchen","appliance","fridge","refrigerator","washing machine","microwave","сад","дом","кухн","холодильник","стиральн","casă","grădin","bucătărie","frigider"],
                furniture: ["furniture","sofa","couch","table","chair","wardrobe","bed","диван","стол","стул","кровать","мебел","canapea","masă","scaun","pat"],
                kids: ["baby","kid","kids","child","children","stroller","toy","детск","ребён","игруш","коляс","copil","copii","bebeluș","cărucior","jucărie"],
                games: ["game","gaming","playstation","xbox","nintendo","console","игр","консол","joc","consolă"],
                sports: ["sport","football","soccer","basketball","tennis","fitness","gym","велосипед","спорт","фитнес","fotbal","baschet","tenis"],
                books: ["book","books","textbook","education","school","учебник","книг","образован","școală","carte","cărți","educație"],
                tools: ["tool","tools","drill","saw","equipment","инструмент","оборудован","sculă","unelte","echipament"],
                beauty: ["beauty","cosmetic","cosmetics","makeup","perfume","skincare","космет","парфюм","красот","cosmetice","machiaj","parfum"],
                pets: ["pet","pets","dog","cat","animal","puppy","kitten","собак","кошк","животн","câine","pisică","animale"],
                jewelry: ["jewelry","jewellery","ring","necklace","bracelet","watch","ювелир","кольцо","ожерель","браслет","bijuter","inel","colier","brățară"],
                bikes: ["bike","bicycle","scooter","велосипед","самокат","biciclet","trotinet"],
                cameras: ["camera","photography","dslr","mirrorless","lens","фотоаппарат","камера","объектив","fotografie","aparat foto","obiectiv"],
                music: ["music","guitar","piano","keyboard","drum","microphone","instrument","музык","гитар","пиан","барабан","микрофон","instrument","chitară","pian"]
            };
            let best = null;
            for (const category of topLevel) {
                const haystack = (String(category.name || "") + " " + String(category.slug || "")).toLowerCase();
                let score = 0;
                if (haystack && text.includes(haystack)) score += 12;
                const groupKey = Object.keys(keywordGroups).find(key =>
                    haystack.includes(key) ||
                    (key === "home" && /home|garden|дом|casă|grădin/.test(haystack)) ||
                    (key === "bikes" && /bike|bicycle|scooter|велосип|biciclet|trotinet/.test(haystack)) ||
                    (key === "cameras" && /camera|photograph|фото|fotograf/.test(haystack))
                );
                const keywords = groupKey ? keywordGroups[groupKey] : [];
                keywords.forEach(keyword => { if (text.includes(keyword)) score += keyword.length >= 6 ? 3 : 2; });
                if (score > 0 && (!best || score > best.score)) best = { category, score };
            }
            if (best && best.score >= 3) {
                ClosetCategoryPicker.selectByIds(best.category.id);
                markListingFormDirty();
            }
        } catch (error) {
            console.warn("A doua șansă imported category detection skipped:", error);
        }
    }

    function setup999ImporterBridge() {
        window.addEventListener("closet:999-imported", async event => {
            const data = event.detail || {};

            if (state.editingListingId) {
                showFormMessage(
                    document.getElementById("listingFormMessage"),
                    "Finish or cancel the current listing edit before importing from 999.md.",
                    "error"
                );
                return;
            }

            const titleInput = document.getElementById("itemName");
            const priceInput = document.getElementById("itemPrice");
            const descriptionInput = document.getElementById("itemDescription");

            if (titleInput && data.title) {
                titleInput.value = String(data.title).slice(0, 100);
                titleInput.dispatchEvent(new Event("input", { bubbles: true }));
            }

            if (priceInput && Number.isFinite(Number(data.priceMdl)) && Number(data.priceMdl) > 0) {
                priceInput.value = String(Math.round(Number(data.priceMdl) * 100) / 100);
                priceInput.dispatchEvent(new Event("input", { bubbles: true }));
            }

            if (descriptionInput && data.description) {
                descriptionInput.value = String(data.description).slice(0, 2000);
                descriptionInput.dispatchEvent(new Event("input", { bubbles: true }));
            }

            if (data.imageUrl) {
                if (state.selectedImages.length >= 20) {
                    showStatus("The listing already has 20 photos. The imported photo was not added.", "error");
                } else {
                    state.selectedImages.unshift({
                        id: crypto.randomUUID(),
                        file: null,
                        url: String(data.imageUrl),
                        imported: true,
                        sourceUrl: data.sourceUrl || ""
                    });
                    renderImagePreviews();
                }
            }

            await detectImportedCategory(data);

            const locationInput = document.getElementById("itemLocation");
            if (locationInput && !locationInput.value.trim()) {
                locationInput.focus();
            }
        });
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
            markListingFormDirty();
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

        if (elements.imageCount) {
            elements.imageCount.textContent = state.selectedImages.length + " / 20";
        }

        state.selectedImages.forEach((item, index) => {
            const card = document.createElement("div");
            card.className = `image-preview-card${index === 0 ? " is-main" : ""}`;
            card.draggable = true;
            card.dataset.imageId = item.id;

            const mainLabel = index === 0
                ? `<span class="main-photo-badge">${item.existing ? "Current main photo" : "Main photo"}</span>`
                : `<button type="button" class="make-main-button">Make main</button>`;

            card.innerHTML = `
                <img src="${escapeHTML(item.url)}" alt="Photo ${index + 1}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src=\'fallback-placeholder.svg\';">
                <div class="image-preview-overlay">
                    ${mainLabel}
                    <button type="button" class="remove-photo-button" aria-label="Remove photo">×</button>
                </div>
            `;

            card.querySelector(".remove-photo-button").addEventListener("click", () => {
                const removed = state.selectedImages.splice(index, 1)[0];
                if (removed?.url && !removed.existing) URL.revokeObjectURL(removed.url);
                renderImagePreviews();
                markListingFormDirty();
            });

            card.querySelector(".make-main-button")?.addEventListener("click", () => {
                const [selected] = state.selectedImages.splice(index, 1);
                state.selectedImages.unshift(selected);
                renderImagePreviews();
                markListingFormDirty();
            });

            card.addEventListener("dragstart", event => {
                state.draggedImageId = item.id;
                event.dataTransfer.effectAllowed = "move";
            });

            card.addEventListener("dragover", event => event.preventDefault());

            card.addEventListener("drop", event => {
                event.preventDefault();

                const from = state.selectedImages.findIndex(image => image.id === state.draggedImageId);
                const to = state.selectedImages.findIndex(image => image.id === item.id);
                if (from < 0 || to < 0 || from === to) return;

                const [moved] = state.selectedImages.splice(from, 1);
                state.selectedImages.splice(to, 0, moved);
                renderImagePreviews();
                markListingFormDirty();
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
                    startNewListing();
                } else {
                    window.location.href =
                        "login.html";
                }
            }
        );
    }

    function setupListingDetailActions() {
        document.getElementById("listingBackButton")?.addEventListener("click", () => {
            ClosetNavigation.show(state.listingBackView || "browse");
        });

        elements.publicProfileBackButton?.addEventListener("click", () => {
            ClosetNavigation.show(state.publicProfileBackView || "browse");
        });
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
            "closet:open-listing",
            event => {
                const listingId = event.detail?.listingId;
                if (listingId) void openListing(listingId);
            }
        );

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
                    await loadSavedListings();
                }

                if (view === "edit-profile") {
                    await loadEditProfile();
                }

                if (view === "public-profile" && state.publicProfileUserId) {
                    await loadPublicProfile(state.publicProfileUserId);
                }
            }
        );
    }

    function setupForms() {
        elements.listingForm?.addEventListener("submit", publishListing);
        elements.saveListingDraftButton?.addEventListener("click", saveListingDraft);
        elements.cancelListingButton?.addEventListener("click", () => {
            const id = state.editingListingId;
            const backView = state.editReturnView || "browse";
            resetListingForm({ clearDraft: true });
            if (id) { showStatus("Changes discarded. The published listing was not changed.", "success"); void openListing(id, { preserveBack: true }); }
            else ClosetNavigation.show("home");
        });
        elements.listingForm?.querySelectorAll("input, textarea, select").forEach(input => {
            input.addEventListener("input", markListingFormDirty);
            input.addEventListener("change", markListingFormDirty);
        });
        elements.cancelListingButton?.addEventListener("click", () => {
            const hasChanges = hasListingChanges();
            if (hasChanges) {
                const confirmed = window.confirm(
                    state.editingListingId
                        ? "Discard your changes? The published listing will stay unchanged."
                        : "Cancel this listing? Your current changes will be discarded."
                );
                if (!confirmed) return;
            }
            resetListingForm({ clearDraft: true });
            ClosetNavigation.show("home");
        });

        elements.profileForm?.addEventListener("submit", saveProfile);
        document.querySelector('[data-view="home"]')?.addEventListener("click", event => {
            if (ClosetNavigation.getCurrentView() === "sell") { event.preventDefault(); leaveListingForm("home"); }
        });
    }

    function setupProfileAvatarEditor() {
        elements.profileAvatarColor?.addEventListener("input", () => {
            if (
                elements.editProfileAvatar &&
                !elements.profileImage?.files?.[0]
            ) {
                renderAvatar(
                    elements.editProfileAvatar,
                    {
                        display_name:
                            document.getElementById("profileName")?.value || "",
                        avatar_color:
                            elements.profileAvatarColor.value
                    }
                );
            }
        });

        elements.profileImage?.addEventListener("change", async event => {
            const file = event.target.files?.[0];
            if (!file || !elements.editProfileAvatar) return;

            if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
                showStatus("Please choose a JPG, PNG or WebP image.", "error");
                event.target.value = "";
                return;
            }

            let url = null;
            try {
                url = URL.createObjectURL(file);
                const image = new Image();
                image.src = url;
                await image.decode();

                if (image.naturalWidth !== 512 || image.naturalHeight !== 512) {
                    showStatus("Profile photos must be exactly 512 × 512 pixels.", "error");
                    event.target.value = "";
                    return;
                }

                const preview = document.createElement("img");
                preview.src = url;
                preview.alt = "";
                elements.editProfileAvatar.replaceChildren(preview);
                elements.editProfileAvatar.style.backgroundColor = "";

                if (elements.removeProfilePhotoButton) {
                    elements.removeProfilePhotoButton.dataset.useInitials = "false";
                }
            } catch {
                showStatus("We couldn't read that image. Please choose another one.", "error");
                event.target.value = "";
            }
        });

        elements.removeProfilePhotoButton?.addEventListener("click", () => {
            elements.removeProfilePhotoButton.dataset.useInitials = "true";
            if (elements.profileImage) elements.profileImage.value = "";

            renderAvatar(
                elements.editProfileAvatar,
                {
                    display_name:
                        document.getElementById("profileName")?.value || "",
                    avatar_color:
                        elements.profileAvatarColor?.value || "#E8E0D6"
                }
            );
        });
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
            markSettingsDirty();
        });

        window.addEventListener("closet:language-changed", event => {
            const language = event.detail?.language;
            if (language && elements.settingsLanguage) {
                elements.settingsLanguage.value = language;
            }
        });
    }

    function markSettingsDirty() {
        if (elements.settingsPendingNotice) {
            elements.settingsPendingNotice.hidden = false;
        }
        if (elements.saveSettingsButton) {
            elements.saveSettingsButton.disabled = false;
        }
    }

    function clearSettingsDirty() {
        if (elements.settingsPendingNotice) {
            elements.settingsPendingNotice.hidden = true;
        }
    }

    async function saveSettingsPreferences() {
        const language = elements.settingsLanguage?.value || ClosetI18n.getLanguage();
        const theme = elements.settingsTheme?.value || "system";
        const density = elements.settingsMessageDensity?.value || "comfortable";
        const reducedMotion = Boolean(elements.settingsReduceMotion?.checked);

        applyThemePreference(theme);
        applyMessageDensity(density);
        applyReducedMotion(reducedMotion);
        clearSettingsDirty();

        if (language !== ClosetI18n.getLanguage()) {
            await ClosetI18n.setLanguage(language);
            return;
        }

        ClosetI18n.apply();
    }

    function applyThemePreference(value) {
        const preference = ["system", "light", "dark"].includes(value)
            ? value
            : "system";

        const prefersDark =
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches;

        document.body.classList.toggle(
            "theme-dark",
            preference === "dark" || (preference === "system" && prefersDark)
        );

        localStorage.setItem("closet-theme", preference);

        if (elements.settingsTheme) {
            elements.settingsTheme.value = preference;
        }
    }

    function applyMessageDensity(value) {
        const density = value === "compact" ? "compact" : "comfortable";

        document.body.classList.toggle(
            "messages-compact",
            density === "compact"
        );

        localStorage.setItem("closet-message-density", density);

        if (elements.settingsMessageDensity) {
            elements.settingsMessageDensity.value = density;
        }
    }

    function applyReducedMotion(enabled) {
        const isEnabled = Boolean(enabled);

        document.body.classList.toggle("reduce-motion", isEnabled);
        localStorage.setItem(
            "closet-reduce-motion",
            isEnabled ? "1" : "0"
        );

        if (elements.settingsReduceMotion) {
            elements.settingsReduceMotion.checked = isEnabled;
        }
    }

    function setupSettingsPreferences() {
        const savedTheme = localStorage.getItem("closet-theme") || "system";
        const savedDensity =
            localStorage.getItem("closet-message-density") || "comfortable";
        const savedReducedMotion =
            localStorage.getItem("closet-reduce-motion") === "1";

        applyThemePreference(savedTheme);
        applyMessageDensity(savedDensity);
        applyReducedMotion(savedReducedMotion);

        elements.settingsTheme?.addEventListener("change", () => {
            markSettingsDirty();
        });

        elements.settingsMessageDensity?.addEventListener("change", () => {
            markSettingsDirty();
        });

        elements.settingsReduceMotion?.addEventListener("change", () => {
            markSettingsDirty();
        });

        elements.saveSettingsButton?.addEventListener("click", saveSettingsPreferences);

        clearSettingsDirty();

        const mediaQuery =
            window.matchMedia?.("(prefers-color-scheme: dark)");

        mediaQuery?.addEventListener?.("change", () => {
            if ((localStorage.getItem("closet-theme") || "system") === "system") {
                applyThemePreference("system");
            }
        });
    }

    function setupSettingsLogout() {
        elements.logoutButton?.addEventListener("click", async () => {
            if (!ClosetAuth.isSignedIn()) {
                window.location.href = "login.html";
                return;
            }

            elements.logoutButton.disabled = true;
            elements.logoutButton.textContent = "Signing out…";

            const result = await ClosetAuth.signOut();

            if (!result.success) {
                elements.logoutButton.disabled = false;
                elements.logoutButton.textContent = "Sign out";
                showStatus(
                    result.message || "We couldn't sign you out. Please try again.",
                    "error"
                );
                return;
            }

            window.location.href = "index.html";
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

    function setupEmailVerificationSuccess() {
        const modal = document.getElementById("verificationSuccessModal");
        const doneButton = document.getElementById("verificationSuccessDone");

        if (!modal) return;

        const hash = new URLSearchParams(
            window.location.hash.replace(/^#/, "")
        );
        const type = hash.get("type");

        const search = new URLSearchParams(window.location.search);
        const hasCode = search.has("code");

        if (type !== "signup" && !hasCode) return;

        modal.hidden = false;
        document.body.classList.add("verification-modal-open");

        doneButton?.addEventListener("click", () => {
            modal.hidden = true;
            document.body.classList.remove("verification-modal-open");

            if (window.history.replaceState) {
                window.history.replaceState(
                    {},
                    document.title,
                    window.location.pathname
                );
            }
        });

        modal.addEventListener("click", event => {
            if (event.target === modal) {
                doneButton?.click();
            }
        });
    }

    async function initialize() {
        if (typeof ClosetI18n !== "undefined") {
            ClosetI18n.initialize();
        }

        ClosetNavigation.initialize("home");
        if (elements.homeHeaderSearch) elements.homeHeaderSearch.hidden = false;

        setupOfflineIndicator();
        setupHeaderActions();
        setupHomeHeaderSearch();
        setupListingClicks();
        setupListingDetailActions();
        setupBrowseControls();
        setupForms();
        setupProfileActions();
        setupProfileAvatarEditor();
        setupImagePreview();
        setup999ImporterBridge();
        setupNavigationEvents();
        setupAuthStateListener();
        setupLanguageSettings();
        setupSettingsPreferences();
        setupSettingsLogout();
        setupEmailVerificationSuccess();
        if (typeof ClosetMessages !== "undefined") ClosetMessages.initialize();

        // Authentication can take a moment to reach Supabase. Start it in
        // parallel with the public homepage data so a slow auth request
        // never blocks Categories or Latest Items from loading.
        const authPromise = ClosetAuth.initialize();

        const homeDataPromise = Promise.all([
            loadHomeListings(),
            loadHomeCategories()
        ]);

        const session = await authPromise;

        const accountLanguage =
            session?.user?.user_metadata?.language;

        // Keep an explicitly selected device language as the source of truth.
        // Account metadata is only used when this device has no saved language.
        const savedLanguage = localStorage.getItem("closet-language");
        const hasSavedLanguage = ["en", "ro", "ru"].includes(savedLanguage);

        if (
            !hasSavedLanguage &&
            accountLanguage &&
            ["en", "ro", "ru"].includes(accountLanguage) &&
            typeof ClosetI18n !== "undefined"
        ) {
            await ClosetI18n.setLanguage(accountLanguage, false);
        }

        await updateAuthenticatedUI();
        await homeDataPromise;

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

