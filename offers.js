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

    if (!modal || !form || !amountInput || !percentageInput) return;

    function t(value) {
        return typeof ClosetI18n !== "undefined"
            ? ClosetI18n.translateValue(value)
            : value;
    }

    function showMessage(text, type) {
        if (!message) return;
        message.textContent = text;
        message.className = "form-message " + (type || "error");
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

    function updatePreview() {
        const askingPriceNumber = asking();
        const amount = Number(amountInput.value);
        const percent = Number(percentageInput.value);

        if (!askingPriceNumber) {
            if (preview) preview.textContent = "";
            return;
        }

        if (
            Number.isFinite(amount) &&
            amount > 0 &&
            amount < askingPriceNumber
        ) {
            const below = Math.round(
                (100 - (amount / askingPriceNumber) * 100) * 100
            ) / 100;

            percentageInput.value = String(below);

            if (preview) {
                preview.textContent =
                    amount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }) +
                    " MDL · " +
                    below +
                    "% below asking price";
            }

            return;
        }

        if (
            Number.isFinite(percent) &&
            percent >= 1 &&
            percent <= 80
        ) {
            const calculated =
                Math.round(
                    askingPriceNumber * (1 - percent / 100) * 100
                ) / 100;

            amountInput.value = String(calculated);

            if (preview) {
                preview.textContent =
                    calculated.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }) +
                    " MDL · " +
                    percent +
                    "% below asking price";
            }

            return;
        }

        if (preview) preview.textContent = "";
    }

    function close() {
        modal.hidden = true;
        document.body.classList.remove("offer-modal-open");
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

        amountInput.value =
            Math.round(asking() * 0.9 * 100) / 100;

        updatePreview();
    }

    function open(listing, seller, conversationId) {
        if (!listing?.id || !seller?.id || !conversationId) return;

        const user = ClosetAuth.getUser();

        if (!user) {
            window.location.href = "login.html";
            return;
        }

        if (
            listing.seller_id === user.id ||
            seller.id === user.id
        ) {
            return;
        }

        activeListing = listing;
        activeSeller = seller;
        activeConversationId = conversationId;

        reset();

        if (listingTitle) {
            listingTitle.textContent = listing.title || t("Listing");
        }

        if (askingPrice) {
            askingPrice.textContent =
                Number(listing.price_mdl).toLocaleString("en-US") +
                " MDL";
        }

        modal.hidden = false;
        document.body.classList.add("offer-modal-open");

        window.setTimeout(() => amountInput.focus(), 60);
    }

    percentageButtons.forEach(button => {
        button.addEventListener("click", () => {
            const percentage = Number(button.dataset.offerPercent);

            if (!Number.isFinite(percentage)) return;

            percentageInput.value = String(percentage);
            amountInput.value =
                Math.round(
                    asking() * (1 - percentage / 100) * 100
                ) / 100;

            percentageButtons.forEach(item => {
                item.classList.toggle("is-active", item === button);
            });

            updatePreview();
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

        updatePreview();
    });

    amountInput.addEventListener("input", () => {
        percentageButtons.forEach(button => {
            button.classList.remove("is-active");
        });

        updatePreview();
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

        const user = ClosetAuth.getUser();
        const askingPriceNumber = asking();
        const amount = Number(amountInput.value);

        if (!user) {
            window.location.href = "login.html";
            return;
        }

        if (
            !activeListing?.id ||
            !activeSeller?.id ||
            !activeConversationId
        ) {
            showMessage(
                t("This offer could not be started. Please open the seller conversation first.")
            );
            return;
        }

        if (
            activeListing.seller_id === user.id ||
            activeSeller.id === user.id
        ) {
            showMessage(
                t("You cannot make an offer on your own listing.")
            );
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
            amount >= askingPriceNumber
        ) {
            showMessage(
                t("Your offer must be above 0 MDL and below the asking price.")
            );
            return;
        }

        const percentageBelow = Math.round(
            (100 - (amount / askingPriceNumber) * 100) * 100
        ) / 100;

        if (percentageBelow < 1 || percentageBelow > 80) {
            showMessage(
                t("Offers must be between 1% and 80% below the asking price.")
            );
            return;
        }

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = t("Sending offer…");
        }

        try {
            const offerResult = await client
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
                .select("id,amount_mdl,percentage_below,status")
                .single();

            if (offerResult.error) throw offerResult.error;

            const body =
                "Offer sent for \"" +
                (activeListing.title || "this listing") +
                "\": " +
                Number(offerResult.data.amount_mdl).toLocaleString("en-US") +
                " MDL (" +
                Number(offerResult.data.percentage_below) +
                "% below the " +
                askingPriceNumber.toLocaleString("en-US") +
                " MDL asking price).";

            const messageResult = await client
                .from("messages")
                .insert({
                    conversation_id: activeConversationId,
                    sender_id: user.id,
                    body
                });

            if (messageResult.error) throw messageResult.error;

            await client
                .from("conversations")
                .update({
                    updated_at: new Date().toISOString()
                })
                .eq("id", activeConversationId);

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

            const errorText =
                String(error?.message || "").toLowerCase();

            if (
                errorText.includes("relation") ||
                (
                    errorText.includes("offers") &&
                    errorText.includes("not exist")
                )
            ) {
                showMessage(
                    t("Offers are not enabled yet. Please run the messaging-offers SQL in Supabase first.")
                );
            } else {
                showMessage(
                    t("We couldn't send the offer right now. Please try again.")
                );
            }
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = t("Send offer");
            }
        }
    });

    window.CLOSETOffers = {
        open,
        close
    };
})();
