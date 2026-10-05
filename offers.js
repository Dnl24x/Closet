(() => {
    const client = window.supabaseClient;

    const modal = document.getElementById("offerModal");
    const form = document.getElementById("offerForm");
    const listingTitle = document.getElementById("offerListingTitle");
    const askingPrice = document.getElementById("offerAskingPrice");
    const amountInput = document.getElementById("offerAmount");
    const percentageInput = document.getElementById("offerPercentage");
    const preview = document.getElementById("offerPreview");
    const message = document.getElementById("offerMessage");
    const submitButton = document.getElementById("offerSubmit");
    const closeButtons = document.querySelectorAll("[data-close-offer]");
    const percentageButtons = document.querySelectorAll("[data-offer-percent]");

    let activeListing = null;
    let activeSeller = null;
    let activeConversationId = null;
    let mode = "offer";
    let activeOffer = null;

    if (!modal || !form || !amountInput || !percentageInput) return;

    function t(value) {
        return typeof ClosetI18n !== "undefined"
            ? ClosetI18n.translateValue(value)
            : value;
    }

    function showMessage(text, type = "error") {
        if (!message) return;
        message.textContent = text;
        message.className = "form-message " + type;
        message.hidden = false;
    }

    function clearMessage() {
        if (!message) return;
        message.textContent = "";
        message.hidden = true;
    }

    function asking() {
        return Number(activeListing?.price_mdl) || 0;
    }

    function renderPreview(amount, percent) {
        if (!preview) return;

        preview.textContent =
            amount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }) +
            " MDL · " +
            percent +
            "% below asking price";
    }

    function updateFromPercentage() {
        const askingPriceNumber = asking();
        const percent = Number(percentageInput.value);

        if (
            !askingPriceNumber ||
            !Number.isFinite(percent) ||
            percent < 1 ||
            percent > 80
        ) {
            if (preview) preview.textContent = "";
            return;
        }

        const calculated =
            Math.round(
                askingPriceNumber * (1 - percent / 100) * 100
            ) / 100;

        amountInput.value = String(calculated);
        renderPreview(calculated, percent);
    }

    function updateFromAmount() {
        const askingPriceNumber = asking();
        const amount = Number(amountInput.value);

        if (
            !askingPriceNumber ||
            !Number.isFinite(amount) ||
            amount <= 0 ||
            amount >= askingPriceNumber
        ) {
            if (preview) preview.textContent = "";
            return;
        }

        const below = Math.round(
            (100 - (amount / askingPriceNumber) * 100) * 100
        ) / 100;

        percentageInput.value = String(below);
        renderPreview(amount, below);
    }

    function close() {
        modal.hidden = true;
        document.body.classList.remove("offer-modal-open");
        activeOffer = null;
        mode = "offer";
    }

    function reset() {
        form.reset();
        clearMessage();

        percentageInput.value = "10";

        percentageButtons.forEach(button => {
            button.classList.toggle(
                "is-active",
                button.dataset.offerPercent === "10"
            );
        });

        updateFromPercentage();
    }

    function setMode(nextMode) {
        mode = nextMode;
        const title = modal.querySelector("#offerModalTitle");
        const eyebrow = modal.querySelector(".offer-modal-card > .eyebrow");

        if (title) {
            title.textContent =
                nextMode === "counter"
                    ? t("Make a counter offer")
                    : t("Make an offer");
        }

        if (eyebrow) {
            eyebrow.textContent =
                nextMode === "counter"
                    ? t("COUNTER OFFER")
                    : t("OFFER");
        }

        if (submitButton) {
            submitButton.textContent =
                nextMode === "counter"
                    ? t("Send counter offer")
                    : t("Send offer");
        }
    }

    function open(listing, seller, conversationId) {
        if (!listing?.id || !seller?.id || !conversationId) return;

        const user = ClosetAuth.getUser();

        if (!user) {
            window.location.href = "login.html";
            return;
        }

        if (listing.seller_id === user.id || seller.id === user.id) {
            return;
        }

        activeListing = listing;
        activeSeller = seller;
        activeConversationId = conversationId;
        activeOffer = null;

        setMode("offer");
        reset();

        if (listingTitle) {
            listingTitle.textContent = listing.title || t("Listing");
        }

        if (askingPrice) {
            askingPrice.textContent =
                Number(listing.price_mdl).toLocaleString("en-US") + " MDL";
        }

        modal.hidden = false;
        document.body.classList.add("offer-modal-open");

        window.setTimeout(() => amountInput.focus(), 60);
    }

    function openCounter(offer, listing, seller) {
        const user = ClosetAuth.getUser();

        if (!user || !offer?.id || !listing?.id || !seller?.id) return;

        if (user.id !== offer.seller_id) return;

        activeListing = listing;
        activeSeller = seller;
        activeConversationId = offer.conversation_id;
        activeOffer = offer;

        setMode("counter");
        reset();

        const currentAmount = Number(offer.amount_mdl) || 0;
        const askingNumber = Number(listing.price_mdl) || 0;
        const suggested =
            Math.min(
                askingNumber,
                Math.round(Math.max(currentAmount + Math.max(1, currentAmount * 0.05), currentAmount) * 100) / 100
            );

        amountInput.value = String(suggested);
        updateFromAmount();

        if (listingTitle) {
            listingTitle.textContent = listing.title || t("Listing");
        }

        if (askingPrice) {
            askingPrice.textContent =
                askingNumber.toLocaleString("en-US") + " MDL";
        }

        modal.hidden = false;
        document.body.classList.add("offer-modal-open");

        window.setTimeout(() => amountInput.focus(), 60);
    }

    async function updateOfferStatus(offer, status) {
        const user = ClosetAuth.getUser();

        if (!user || !offer?.id) {
            return false;
        }

        const { error } = await client
            .from("offers")
            .update({ status })
            .eq("id", offer.id);

        if (error) {
            console.error("A doua șansă offer status error:", error);
            window.dispatchEvent(new CustomEvent("closet:offer-error", {
                detail: { message: t("We couldn't update this offer right now.") }
            }));
            return false;
        }

        window.dispatchEvent(new CustomEvent("closet:offer-updated", {
            detail: {
                conversationId: offer.conversation_id,
                offerId: offer.id
            }
        }));

        return true;
    }

    async function respondToOffer(offer, action) {
        const user = ClosetAuth.getUser();

        if (!user || !offer?.id) return false;

        if (action === "accept") {
            if (
                user.id !== offer.seller_id &&
                user.id !== offer.buyer_id
            ) {
                return false;
            }

            return updateOfferStatus(offer, "accepted");
        }

        if (action === "decline") {
            if (
                user.id !== offer.seller_id &&
                user.id !== offer.buyer_id
            ) {
                return false;
            }

            return updateOfferStatus(offer, "declined");
        }

        if (action === "counter") {
            if (user.id !== offer.seller_id) return false;

            const listingResult = await client
                .from("listings")
                .select("id,title,price_mdl,seller_id")
                .eq("id", offer.listing_id)
                .maybeSingle();

            if (listingResult.error || !listingResult.data) {
                window.dispatchEvent(new CustomEvent("closet:offer-error", {
                    detail: { message: t("The listing could not be loaded for the counter offer.") }
                }));
                return false;
            }

            openCounter(offer, listingResult.data, {
                id: offer.seller_id
            });

            return true;
        }

        return false;
    }

    percentageButtons.forEach(button => {
        button.addEventListener("click", () => {
            const percentage = Number(button.dataset.offerPercent);

            if (!Number.isFinite(percentage)) return;

            percentageInput.value = String(percentage);

            percentageButtons.forEach(item => {
                item.classList.toggle("is-active", item === button);
            });

            updateFromPercentage();
        });
    });

    percentageInput.addEventListener("input", () => {
        percentageButtons.forEach(button => {
            button.classList.toggle(
                "is-active",
                Number(button.dataset.offerPercent) ===
                Number(percentageInput.value)
            );
        });

        updateFromPercentage();
    });

    amountInput.addEventListener("input", () => {
        percentageButtons.forEach(button => button.classList.remove("is-active"));
        updateFromAmount();
    });

    closeButtons.forEach(button => button.addEventListener("click", close));
    modal.addEventListener("click", event => {
        if (event.target === modal) close();
    });

    form.addEventListener("submit", async event => {
        event.preventDefault();
        clearMessage();

        const user = ClosetAuth.getUser();
        const askingPriceNumber = asking();
        const amount = Number(amountInput.value);

        if (!user) {
            window.location.href = "login.html";
            return;
        }

        if (!activeListing?.id || !activeSeller?.id || !activeConversationId) {
            showMessage(t("This offer could not be started. Please open the seller conversation first."));
            return;
        }

        if (
            mode === "counter" &&
            (!activeOffer?.id || user.id !== activeOffer.seller_id)
        ) {
            showMessage(t("Only the seller can send a counter offer."));
            return;
        }

        if (
            !Number.isFinite(askingPriceNumber) ||
            askingPriceNumber <= 0
        ) {
            showMessage(t("This listing has an invalid asking price."));
            return;
        }

        if (
            !Number.isFinite(amount) ||
            amount <= 0 ||
            amount > askingPriceNumber
        ) {
            showMessage(
                t("The offer must be above 0 MDL and no more than the asking price.")
            );
            return;
        }

        const percentageBelow = Math.round(
            (100 - (amount / askingPriceNumber) * 100) * 100
        ) / 100;

        if (mode === "offer" && (percentageBelow < 1 || percentageBelow > 80)) {
            showMessage(
                t("Offers must be between 1% and 80% below the asking price.")
            );
            return;
        }

        if (mode === "counter" && percentageBelow < 0) {
            showMessage(t("Your counter offer cannot be above the asking price."));
            return;
        }

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent =
                mode === "counter"
                    ? t("Sending counter offer…")
                    : t("Sending offer…");
        }

        try {
            if (mode === "counter") {
                const result = await client
                    .from("offers")
                    .update({
                        status: "countered",
                        counter_amount_mdl: Math.round(amount * 100) / 100
                    })
                    .eq("id", activeOffer.id)
                    .select("id,status,counter_amount_mdl")
                    .single();

                if (result.error) throw result.error;
            } else {
                const result = await client
                    .from("offers")
                    .insert({
                        conversation_id: activeConversationId,
                        listing_id: activeListing.id,
                        buyer_id: user.id,
                        seller_id: activeSeller.id,
                        amount_mdl: Math.round(amount * 100) / 100,
                        percentage_below: percentageBelow,
                        status: "pending"
                    })
                    .select("id,status,amount_mdl,percentage_below")
                    .single();

                if (result.error) throw result.error;
            }

            close();

            window.dispatchEvent(
                new CustomEvent("closet:offer-sent", {
                    detail: {
                        listingId: activeListing.id,
                        conversationId: activeConversationId
                    }
                })
            );
        } catch (error) {
            console.error("A doua șansă offer error:", error);

            const errorText = String(error?.message || "").toLowerCase();

            if (
                errorText.includes("relation") ||
                (errorText.includes("offers") && errorText.includes("not exist"))
            ) {
                showMessage(
                    t("Offers are not enabled yet. Please run the latest messaging-offers SQL in Supabase first.")
                );
            } else {
                showMessage(
                    t("We couldn't save this offer right now. Please try again.")
                );
            }
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent =
                    mode === "counter"
                        ? t("Send counter offer")
                        : t("Send offer");
            }
        }
    });

    window.CLOSETOffers = {
        open,
        close,
        openCounter,
        updateOfferStatus,
        respondToOffer
    };
})();