(() => {
    const modal = document.getElementById("novaPostCheckoutModal");
    const form = document.getElementById("novaPostCheckoutForm");
    const formStep = document.getElementById("novaPostCheckoutFormStep");
    const successStep = document.getElementById("novaPostCheckoutSuccessStep");
    const closeButtons = document.querySelectorAll("[data-close-nova-post]");
    const successTelegram = document.getElementById("novaPostTelegramLink");
    const message = document.getElementById("novaPostCheckoutMessage");
    const submitButton = document.getElementById("novaPostCheckoutSubmit");

    const nameInput = document.getElementById("novaBuyerName");
    const phoneInput = document.getElementById("novaBuyerPhone");
    const cityInput = document.getElementById("novaBuyerCity");
    const pickupInput = document.getElementById("novaBuyerPickup");
    const listingTitle = document.getElementById("novaPostListingTitle");
    const listingPrice = document.getElementById("novaPostListingPrice");

    let activeListing = null;
    let activeSeller = null;

    if (!modal || !form) return;

    function showMessage(text, type = "error") {
        if (!message) return;
        message.textContent = text;
        message.className = `form-message ${type}`;
        message.hidden = false;
    }

    function clearMessage() {
        if (!message) return;
        message.textContent = "";
        message.hidden = true;
    }

    function close() {
        modal.hidden = true;
        document.body.classList.remove("nova-post-modal-open");
    }

    function reset() {
        form.reset();
        clearMessage();

        document
            .querySelectorAll("#novaPostPickupType button")
            .forEach((button, index) => {
                button.classList.toggle("is-active", index === 0);
                button.setAttribute("aria-pressed", index === 0 ? "true" : "false");
            });

        if (pickupInput) pickupInput.value = "locker";

        if (formStep) formStep.hidden = false;
        if (successStep) successStep.hidden = true;
    }

    function selectedPickupType() {
        return pickupInput?.value === "branch" ? "branch" : "locker";
    }

    function open(listing, seller) {
        activeListing = listing || null;
        activeSeller = seller || null;

        if (!activeListing?.id || !activeSeller?.id) {
            return;
        }

        if (!window.ClosetAuth?.isSignedIn?.()) {
            window.location.href = "login.html";
            return;
        }

        reset();

        if (listingTitle) {
            listingTitle.textContent = activeListing.title || "Item";
        }

        if (listingPrice) {
            const price = Number(activeListing.price_mdl);
            listingPrice.textContent = Number.isFinite(price)
                ? price.toLocaleString("en-US") + " MDL"
                : "";
        }

        modal.hidden = false;
        document.body.classList.add("nova-post-modal-open");
        window.setTimeout(() => nameInput?.focus(), 60);
    }

    document
        .getElementById("novaPostPickupType")
        ?.addEventListener("click", event => {
            const button = event.target.closest("button[data-pickup-type]");
            if (!button) return;

            const type = button.dataset.pickupType === "branch"
                ? "branch"
                : "locker";

            if (pickupInput) pickupInput.value = type;

            document
                .querySelectorAll("#novaPostPickupType button")
                .forEach(item => {
                    const active = item.dataset.pickupType === type;
                    item.classList.toggle("is-active", active);
                    item.setAttribute("aria-pressed", active ? "true" : "false");
                });
        });

    closeButtons.forEach(button => {
        button.addEventListener("click", close);
    });

    modal.addEventListener("click", event => {
        if (event.target === modal) close();
    });

    form.addEventListener("submit", async event => {
        event.preventDefault();
        clearMessage();

        const user = window.ClosetAuth?.getUser?.();

        if (!user) {
            window.location.href = "login.html";
            return;
        }

        if (!activeListing?.id || !activeSeller?.id) {
            showMessage("This listing is no longer available.");
            return;
        }

        const fullName = nameInput?.value.trim() || "";
        const phone = (phoneInput?.value || "").replace(/\s+/g, "");
        const city = cityInput?.value.trim() || "";
        const pickup = pickupInput?.value || "locker";
        const pickupNumber = pickupInput
            ? (document.getElementById("novaBuyerPickup")?.value || "").trim()
            : "";

        if (fullName.length < 2) {
            showMessage("Please enter your full name.");
            return;
        }

        if (!/^\+373\d{8}$/.test(phone)) {
            showMessage("Please enter a valid Moldova phone number, for example +373 69 123 456.");
            return;
        }

        if (city.length < 2) {
            showMessage("Please enter your city or sector.");
            return;
        }

        if (pickupNumber.length < 1) {
            showMessage("Please enter the Nova Post locker or branch number.");
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = "Placing order…";

        try {
            const { data, error } =
                await window.supabaseClient
                    .from("orders")
                    .insert({
                        listing_id: activeListing.id,
                        seller_id: activeSeller.id,
                        buyer_id: user.id,
                        buyer_full_name: fullName,
                        buyer_phone: phone,
                        delivery_city_sector: city,
                        pickup_type: pickup,
                        pickup_number: pickupNumber,
                        status: "pending_locker_delivery"
                    })
                    .select("id")
                    .single();

            if (error) throw error;

            if (formStep) formStep.hidden = true;
            if (successStep) successStep.hidden = false;

            const sellerName =
                activeSeller.display_name ||
                activeSeller.username ||
                "the seller";

            const text =
                `Hi ${sellerName}! I just placed an A doua șansă order for "${activeListing.title || "your item"}" with Nova Post. Please confirm the delivery details. Order: ${data?.id || "pending"}`;

            const shareUrl =
                "https://t.me/share/url?url=" +
                encodeURIComponent(window.location.href) +
                "&text=" +
                encodeURIComponent(text);

            if (successTelegram) {
                successTelegram.href = shareUrl;
            }
        } catch (error) {
            console.error("A doua șansă Nova Post order error:", error);
            showMessage(
                "We couldn't place the order right now. Please try again.",
                "error"
            );
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Place order";
        }
    });

    window.CLOSETOrders = { open, close };
})();
