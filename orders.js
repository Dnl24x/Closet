(() => {
    const modal = document.getElementById("novaPostCheckoutModal");
    const form = document.getElementById("novaPostCheckoutForm");
    const formStep = document.getElementById("novaPostCheckoutFormStep");
    const paymentStep = document.getElementById("novaPostPaymentStep");
    const successStep = document.getElementById("novaPostCheckoutSuccessStep");
    const closeButtons = document.querySelectorAll("[data-close-nova-post]");
    const successMessages = document.getElementById("novaPostMessagesLink");
    const paymentConversationButton = document.getElementById("novaPostPaymentConversationButton");
    const paymentMessage = document.getElementById("novaPostPaymentMessage");
    const paymentCountdown = document.getElementById("novaPostPaymentCountdown");
    const payNowButton = document.getElementById("novaPostPayNowButton");
    const message = document.getElementById("novaPostCheckoutMessage");
    const submitButton = document.getElementById("novaPostCheckoutSubmit");

    const nameInput = document.getElementById("novaBuyerName");
    const phoneInput = document.getElementById("novaBuyerPhone");
    const cityInput = document.getElementById("novaBuyerCity");
    const pickupTypeInput = document.getElementById("novaPostPickupTypeValue");
    const pickupNumberInput = document.getElementById("novaBuyerPickupNumber");
    const listingTitle = document.getElementById("novaPostListingTitle");
    const listingPrice = document.getElementById("novaPostListingPrice");
    const paymentItem = document.getElementById("novaPostPaymentItem");
    const paymentAmount = document.getElementById("novaPostPaymentAmount");

    let activeListing = null;
    let activeSeller = null;
    let activeOffer = null;
    let activeOrderId = null;
    let paymentDeadline = null;
    let countdownTimer = null;

    if (!modal || !form) return;

    function showMessage(target, text, type = "error") {
        if (!target) return;
        target.textContent = text;
        target.className = "form-message " + type;
        target.hidden = false;
    }

    function clearMessage() {
        if (message) {
            message.textContent = "";
            message.hidden = true;
        }
    }

    function clearPaymentMessage() {
        if (paymentMessage) {
            paymentMessage.textContent = "";
            paymentMessage.hidden = true;
        }
    }

    function stopCountdown() {
        if (countdownTimer) {
            clearInterval(countdownTimer);
            countdownTimer = null;
        }
    }

    function close() {
        stopCountdown();
        modal.hidden = true;
        document.body.classList.remove("nova-post-modal-open");
    }

    async function getAuthenticatedUser() {
        const localUser = window.ClosetAuth?.getUser?.();

        if (localUser) return localUser;

        try {
            const client = window.supabaseClient;

            if (!client?.auth?.getSession) return null;

            const { data, error } = await client.auth.getSession();

            if (error) throw error;

            return data?.session?.user || null;
        } catch (error) {
            console.error("A doua șansă checkout auth check error:", error);
            return null;
        }
    }

    function reset() {
        stopCountdown();
        activeOrderId = null;
        paymentDeadline = null;

        form.reset();
        clearMessage();
        clearPaymentMessage();

        document
            .querySelectorAll("#novaPostPickupType button")
            .forEach((button, index) => {
                button.classList.toggle("is-active", index === 0);
                button.setAttribute("aria-pressed", index === 0 ? "true" : "false");
            });

        if (pickupTypeInput) pickupTypeInput.value = "locker";

        if (formStep) formStep.hidden = false;
        if (paymentStep) paymentStep.hidden = true;
        if (successStep) successStep.hidden = true;
        if (paymentCountdown) paymentCountdown.textContent = "24:00:00";
        if (payNowButton) payNowButton.disabled = false;
    }

    function selectedPickupType() {
        return pickupTypeInput?.value === "branch" ? "branch" : "locker";
    }

    function effectiveOfferAmount(offer) {
        if (
            Number.isFinite(Number(offer?.counter_amount_mdl)) &&
            offer?.status === "accepted"
        ) {
            return Number(offer.counter_amount_mdl);
        }

        return Number(offer?.amount_mdl) || 0;
    }

    async function open(listing, seller) {
        activeOffer = null;
        activeListing = listing || null;
        activeSeller = seller || null;

        if (!activeListing?.id || !activeSeller?.id) return false;

        const signedInUser = await getAuthenticatedUser();

        if (!signedInUser) {
            window.location.href = "login.html";
            return false;
        }

        if (
            activeListing.seller_id === signedInUser.id ||
            activeSeller.id === signedInUser.id
        ) {
            return false;
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

        return true;
    }

    async function loadExistingOfferOrder(offerId, buyerId) {
        const result = await window.supabaseClient
            .from("orders")
            .select("id,payment_deadline,status,payment_status")
            .eq("offer_id", offerId)
            .eq("buyer_id", buyerId)
            .eq("status", "awaiting_payment")
            .eq("payment_status", "pending")
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

        if (result.error) {
            throw result.error;
        }

        return result.data || null;
    }

    async function openAcceptedOffer(offer, listing, seller) {
        const signedInUser = await getAuthenticatedUser();

        if (
            !signedInUser ||
            !offer?.id ||
            offer.status !== "accepted" ||
            signedInUser.id !== offer.buyer_id
        ) {
            return false;
        }

        if (!listing?.id || !seller?.id) {
            return false;
        }

        activeOffer = offer;
        activeListing = listing;
        activeSeller = seller;

        const existingOrder = await loadExistingOfferOrder(
            offer.id,
            signedInUser.id
        );

        reset();

        const amount = effectiveOfferAmount(offer);

        if (existingOrder) {
            activeOrderId = existingOrder.id;

            if (formStep) formStep.hidden = true;
            if (paymentStep) paymentStep.hidden = false;

            if (paymentItem) {
                paymentItem.textContent = listing.title || "Item";
            }

            if (paymentAmount) {
                paymentAmount.textContent =
                    amount.toLocaleString("en-US") + " MDL";
            }

            startCountdown(existingOrder.payment_deadline);
        }

        if (listingTitle) {
            listingTitle.textContent = listing.title || "Item";
        }

        if (listingPrice) {
            listingPrice.textContent =
                amount.toLocaleString("en-US") + " MDL";
        }

        if (paymentItem) {
            paymentItem.textContent = listing.title || "Item";
        }

        if (paymentAmount) {
            paymentAmount.textContent =
                amount.toLocaleString("en-US") + " MDL";
        }

        if (formStep) {
            const eyebrow = formStep.querySelector(".eyebrow");
            const heading = formStep.querySelector("#novaPostCheckoutTitle");

            if (eyebrow) eyebrow.textContent = "PURCHASE";
            if (heading) heading.textContent = "Complete your purchase";
        }

        modal.hidden = false;
        document.body.classList.add("nova-post-modal-open");

        if (!existingOrder) {
            window.setTimeout(() => nameInput?.focus(), 60);
        }

        return true;
    }

    function renderCountdown() {
        if (!paymentDeadline || !paymentCountdown) return;

        const remaining = Math.max(
            0,
            new Date(paymentDeadline).getTime() - Date.now()
        );

        const totalSeconds = Math.floor(remaining / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        paymentCountdown.textContent =
            String(hours).padStart(2, "0") + ":" +
            String(minutes).padStart(2, "0") + ":" +
            String(seconds).padStart(2, "0");

        if (remaining <= 0) {
            stopCountdown();

            if (payNowButton) payNowButton.disabled = true;

            showMessage(
                paymentMessage,
                "This unpaid order has expired and can no longer be paid.",
                "error"
            );
        }
    }

    function startCountdown(deadline) {
        stopCountdown();
        paymentDeadline = deadline;
        renderCountdown();
        countdownTimer = window.setInterval(renderCountdown, 1000);
    }

    document
        .getElementById("novaPostPickupType")
        ?.addEventListener("click", event => {
            const button = event.target.closest("button[data-pickup-type]");

            if (!button) return;

            const type =
                button.dataset.pickupType === "branch"
                    ? "branch"
                    : "locker";

            if (pickupTypeInput) pickupTypeInput.value = type;

            document
                .querySelectorAll("#novaPostPickupType button")
                .forEach(item => {
                    const active = item.dataset.pickupType === type;
                    item.classList.toggle("is-active", active);
                    item.setAttribute("aria-pressed", active ? "true" : "false");
                });
        });

    closeButtons.forEach(button => button.addEventListener("click", close));

    modal.addEventListener("click", event => {
        if (event.target === modal) close();
    });

    paymentConversationButton?.addEventListener("click", () => {
        if (!activeSeller?.id || !activeListing?.id) return;

        close();

        void window.ClosetMessages?.openConversationWithSeller(
            activeSeller.id,
            activeListing.id
        );
    });

    successMessages?.addEventListener("click", () => {
        if (!activeSeller?.id || !activeListing?.id) return;

        close();

        void window.ClosetMessages?.openConversationWithSeller(
            activeSeller.id,
            activeListing.id
        );
    });

    payNowButton?.addEventListener("click", async () => {
        clearPaymentMessage();

        if (
            !activeOrderId ||
            !activeOffer ||
            !paymentDeadline ||
            new Date(paymentDeadline).getTime() <= Date.now()
        ) {
            showMessage(
                paymentMessage,
                "This payment window has expired.",
                "error"
            );
            return;
        }

        const payment = window.CLOSETPayment?.start;

        if (typeof payment !== "function") {
            showMessage(
                paymentMessage,
                "Secure payment is not connected yet. Your order is reserved until the deadline, but no payment has been taken.",
                "error"
            );
            return;
        }

        payNowButton.disabled = true;

        try {
            await payment({
                orderId: activeOrderId,
                offerId: activeOffer.id,
                amountMdl: effectiveOfferAmount(activeOffer)
            });
        } catch (error) {
            console.error("A doua șansă payment start error:", error);
            showMessage(
                paymentMessage,
                "Payment could not be started. Your order is still pending until the deadline.",
                "error"
            );
        } finally {
            payNowButton.disabled = false;
        }
    });

    form.addEventListener("submit", async event => {
        event.preventDefault();
        clearMessage();

        const user = await getAuthenticatedUser();

        if (!user) {
            window.location.href = "login.html";
            return;
        }

        if (!activeListing?.id || !activeSeller?.id) {
            showMessage(
                message,
                "This listing is no longer available."
            );
            return;
        }

        if (
            activeListing.seller_id === user.id ||
            activeSeller.id === user.id
        ) {
            showMessage(
                message,
                "You cannot buy your own listing."
            );
            return;
        }

        const fullName = nameInput?.value.trim() || "";
        const phone = (phoneInput?.value || "").replace(/\s+/g, "");
        const city = cityInput?.value.trim() || "";
        const pickup = selectedPickupType();
        const pickupNumber = pickupNumberInput?.value.trim() || "";

        if (fullName.length < 2) {
            showMessage(message, "Please enter your full name.");
            return;
        }

        if (!/^\+373\d{8}$/.test(phone)) {
            showMessage(
                message,
                "Please enter a valid Moldova phone number, for example +373 69 123 456."
            );
            return;
        }

        if (city.length < 2) {
            showMessage(message, "Please enter your city or sector.");
            return;
        }

        if (pickupNumber.length < 1) {
            showMessage(
                message,
                "Please enter the Nova Post locker or branch number."
            );
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent =
            activeOffer
                ? "Preparing payment…"
                : "Placing order…";

        try {
            let offerForOrder = activeOffer;

            if (activeOffer) {
                const latestOffer = await window.supabaseClient
                    .from("offers")
                    .select(
                        "id,listing_id,buyer_id,seller_id,amount_mdl,counter_amount_mdl,status,conversation_id"
                    )
                    .eq("id", activeOffer.id)
                    .single();

                if (latestOffer.error) throw latestOffer.error;

                offerForOrder = latestOffer.data;

                if (
                    offerForOrder.status !== "accepted" ||
                    offerForOrder.buyer_id !== user.id
                ) {
                    throw new Error("offer_no_longer_accepted");
                }
            }

            const isOfferPurchase = Boolean(offerForOrder?.id);

            if (isOfferPurchase) {
                const existingOrder = await loadExistingOfferOrder(
                    offerForOrder.id,
                    user.id
                );

                if (existingOrder) {
                    activeOrderId = existingOrder.id;
                    activeOffer = offerForOrder;

                    if (formStep) formStep.hidden = true;
                    if (paymentStep) paymentStep.hidden = false;

                    const existingAmount = effectiveOfferAmount(activeOffer);

                    if (paymentItem) {
                        paymentItem.textContent = activeListing.title || "Item";
                    }

                    if (paymentAmount) {
                        paymentAmount.textContent =
                            existingAmount.toLocaleString("en-US") + " MDL";
                    }

                    startCountdown(existingOrder.payment_deadline);
                    return;
                }
            }

            const deadline = isOfferPurchase
                ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
                : null;

            const insertData = {
                listing_id: activeListing.id,
                seller_id: activeSeller.id,
                buyer_id: user.id,
                buyer_full_name: fullName,
                buyer_phone: phone,
                delivery_city_sector: city,
                pickup_type: pickup,
                pickup_number: pickupNumber,
                status: isOfferPurchase
                    ? "awaiting_payment"
                    : "pending_locker_delivery",
                payment_status: isOfferPurchase
                    ? "pending"
                    : "pending",
                payment_deadline: deadline
            };

            if (isOfferPurchase) {
                insertData.offer_id = offerForOrder.id;
            }

            const result = await window.supabaseClient
                .from("orders")
                .insert(insertData)
                .select("id,payment_deadline,status,payment_status")
                .single();

            if (result.error) throw result.error;

            if (!isOfferPurchase) {
                if (formStep) formStep.hidden = true;
                if (successStep) successStep.hidden = false;
                return;
            }

            activeOrderId = result.data.id;
            activeOffer = offerForOrder;

            if (formStep) formStep.hidden = true;
            if (paymentStep) paymentStep.hidden = false;

            const effectiveAmount = effectiveOfferAmount(activeOffer);

            if (paymentItem) {
                paymentItem.textContent = activeListing.title || "Item";
            }

            if (paymentAmount) {
                paymentAmount.textContent =
                    effectiveAmount.toLocaleString("en-US") + " MDL";
            }

            startCountdown(result.data.payment_deadline);

        } catch (error) {
            console.error("A doua șansă Nova Post order error:", error);

            if (String(error?.message || "") === "offer_no_longer_accepted") {
                showMessage(
                    message,
                    "This offer is no longer available. Please return to the conversation."
                );
            } else {
                showMessage(
                    message,
                    "We couldn't start the purchase right now. Please try again."
                );
            }
        } finally {
            submitButton.disabled = false;
            submitButton.textContent =
                activeOffer
                    ? "Continue to payment"
                    : "Place order";
        }
    });

    window.CLOSETOrders = {
        open,
        openAcceptedOffer,
        close
    };
})();