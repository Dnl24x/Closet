(() => {
    const client = window.supabaseClient;

    const state = {
        activeConversationId: null,
        activeSellerId: null,
        activeListingId: null,
        refreshTimer: null,
        initialized: false,
        lastThreadSignature: ""
    };

    const el = {
        list: () => document.getElementById("conversationList"),
        thread: () => document.getElementById("messageThread"),
        empty: () => document.getElementById("messageThreadEmpty"),
        header: () => document.getElementById("messageThreadHeader"),
        headerContent: () => document.getElementById("messageThreadHeaderContent"),
        mobileBack: () => document.getElementById("messagesMobileBack"),
        messages: () => document.getElementById("messageList"),
        composer: () => document.getElementById("messageComposer"),
        input: () => document.getElementById("messageInput")
    };

    function t(value) {
        return typeof ClosetI18n !== "undefined"
            ? ClosetI18n.translateValue(value)
            : value;
    }

    function esc(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function time(value) {
        const date = new Date(value);
        return Number.isNaN(date.getTime())
            ? ""
            : date.toLocaleString(undefined, {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit"
            });
    }

    function notifyNetwork(online) {
        window.dispatchEvent(
            new CustomEvent("closet:network", {
                detail: { online }
            })
        );
    }

    function isNetworkError(error) {
        const message = String(error?.message || error || "").toLowerCase();

        return error?.name === "TypeError" ||
            message.includes("failed to fetch") ||
            message.includes("networkerror") ||
            message.includes("network request failed") ||
            message.includes("load failed");
    }

    function isActuallyOffline(error = null) {
        if (window.ClosetNetwork?.isOffline) {
            return window.ClosetNetwork.isOffline();
        }

        if (navigator.onLine === false) {
            return true;
        }

        return isNetworkError(error) && navigator.onLine === false;
    }

    async function getAuthenticatedUser() {
        try {
            const sessionResult = await client.auth.getSession();
            const session = sessionResult?.data?.session || null;

            if (session?.user) {
                return { user: session.user, error: null };
            }

            const localUser = ClosetAuth.getUser();

            if (localUser) {
                return { user: localUser, error: null };
            }

            const refreshResult = await client.auth.refreshSession();

            if (refreshResult?.data?.session?.user) {
                return {
                    user: refreshResult.data.session.user,
                    error: null
                };
            }

            return {
                user: null,
                error: sessionResult?.error || refreshResult?.error || null
            };
        } catch (error) {
            console.error("A doua șansă: auth check crashed:", error);

            const localUser = ClosetAuth.getUser();

            return {
                user: localUser || null,
                error: localUser ? null : error
            };
        }
    }

    function describeSupabaseError(error) {
        const code = String(error?.code || "").toUpperCase();
        const status = Number(error?.status || error?.statusCode || 0);
        const message = String(error?.message || "").toLowerCase();

        if (code === "42501" || status === 401 || status === 403) {
            return t("Your session is not authorized to access messages. Please sign in again.");
        }

        if (code === "42P01" || message.includes("could not find the table")) {
            return t("The messaging table could not be found in Supabase.");
        }

        return t("There was a problem reaching your conversations. Please try again.");
    }

    function showRetry(container, heading, message) {
        if (!container) return;

        container.innerHTML =
            "<div class="empty-state">" +
            "<h3>" + esc(heading) + "</h3>" +
            "<p>" + esc(message) + "</p>" +
            "<button type="button" class="secondary-button message-retry-button">" +
            esc(t("Try again")) +
            "</button>" +
            "</div>";

        container.querySelector(".message-retry-button")?.addEventListener(
            "click",
            () => {
                if (state.activeConversationId) {
                    void loadThread(state.activeConversationId);
                }

                void loadConversations();
            },
            { once: true }
        );
    }

    function updateUnreadBadge(total) {
        const badge = document.getElementById("messagesUnreadBadge");

        if (!badge) return;

        const count = Number(total) || 0;
        badge.textContent = count > 99 ? "99+" : String(count);
        badge.hidden = count <= 0;
    }

    function stopRefresh() {
        if (state.refreshTimer) {
            clearInterval(state.refreshTimer);
            state.refreshTimer = null;
        }
    }

    function startRefresh() {
        stopRefresh();

        state.refreshTimer = setInterval(() => {
            if (
                state.activeConversationId &&
                navigator.onLine !== false
            ) {
                void loadThread(state.activeConversationId, false);
            }

            if (ClosetNavigation.getCurrentView() === "messages") {
                void loadConversations(false);
            }
        }, 5000);
    }

    async function getOrCreateConversation(otherUserId, listingId = null) {
        const auth = await getAuthenticatedUser();
        const user = auth.user;

        if (!user || !otherUserId || user.id === otherUserId) {
            return {
                success: false,
                message: t("You need to sign in first.")
            };
        }

        const buyerId = user.id;
        const sellerId = otherUserId;

        const pairs = [
            [buyerId, sellerId],
            [sellerId, buyerId]
        ];

        for (const [first, second] of pairs) {
            let query = client
                .from("conversations")
                .select("id,buyer_id,seller_id,listing_id")
                .eq("buyer_id", first)
                .eq("seller_id", second);

            query = listingId
                ? query.eq("listing_id", listingId)
                : query.is("listing_id", null);

            const found = await query.maybeSingle();

            if (found.error) {
                throw found.error;
            }

            if (found.data) {
                return {
                    success: true,
                    conversation: found.data
                };
            }
        }

        const created = await client
            .from("conversations")
            .insert({
                buyer_id: buyerId,
                seller_id: sellerId,
                listing_id: listingId || null
            })
            .select("id,buyer_id,seller_id,listing_id")
            .single();

        if (created.error) {
            const retryPairs = [
                [buyerId, sellerId],
                [sellerId, buyerId]
            ];

            for (const [first, second] of retryPairs) {
                let retryQuery = client
                    .from("conversations")
                    .select("id,buyer_id,seller_id,listing_id")
                    .eq("buyer_id", first)
                    .eq("seller_id", second);

                retryQuery = listingId
                    ? retryQuery.eq("listing_id", listingId)
                    : retryQuery.is("listing_id", null);

                const retry = await retryQuery.maybeSingle();

                if (retry.data) {
                    return {
                        success: true,
                        conversation: retry.data
                    };
                }
            }

            throw created.error;
        }

        return {
            success: true,
            conversation: created.data
        };
    }

    async function findConversation(otherUserId, listingId = null) {
        const auth = await getAuthenticatedUser();
        const user = auth.user;

        if (!user || !otherUserId || user.id === otherUserId) {
            return {
                success: false,
                conversation: null,
                message: t("You need to sign in first.")
            };
        }

        const pairs = [
            [user.id, otherUserId],
            [otherUserId, user.id]
        ];

        for (const [first, second] of pairs) {
            let query = client
                .from("conversations")
                .select("id,buyer_id,seller_id,listing_id")
                .eq("buyer_id", first)
                .eq("seller_id", second);

            query = listingId
                ? query.eq("listing_id", listingId)
                : query.is("listing_id", null);

            const result = await query.maybeSingle();

            if (result.error) {
                throw result.error;
            }

            if (result.data) {
                return {
                    success: true,
                    conversation: result.data
                };
            }
        }

        return {
            success: true,
            conversation: null
        };
    }

    async function fetchMessageRows(conversationId) {
        let result = await client
            .from("messages")
            .select("id,conversation_id,sender_id,body,created_at,read_at")
            .eq("conversation_id", conversationId)
            .order("created_at", { ascending: true });

        if (result.error) {
            const errorText = String(result.error.message || "").toLowerCase();

            if (
                errorText.includes("read_at") ||
                errorText.includes("column") && errorText.includes("messages")
            ) {
                result = await client
                    .from("messages")
                    .select("id,conversation_id,sender_id,body,created_at")
                    .eq("conversation_id", conversationId)
                    .order("created_at", { ascending: true });

                return {
                    ...result,
                    hasReadState: false
                };
            }
        }

        return {
            ...result,
            hasReadState: true
        };
    }

    async function loadConversations(showLoading = true) {
        const list = el.list();

        if (!list) return false;

        const auth = await getAuthenticatedUser();
        const user = auth.user;

        if (!user) {
            updateUnreadBadge(0);

            if (auth.error && !isActuallyOffline(auth.error)) {
                showRetry(
                    list,
                    t("We couldn't load your messages"),
                    describeSupabaseError(auth.error)
                );
                return false;
            }

            list.innerHTML =
                "<div class="empty-state"><h3>" +
                esc(t("Sign in to see your messages")) +
                "</h3><p>" +
                esc(t("Your conversations will appear here.")) +
                "</p></div>";

            return false;
        }

        if (showLoading) {
            list.innerHTML =
                "<div class="message-list-loading">" +
                esc(t("Loading messages…")) +
                "</div>";
        }

        const conversationFields =
            "id,buyer_id,seller_id,listing_id,updated_at";

        const [buyerResult, sellerResult] = await Promise.all([
            client
                .from("conversations")
                .select(conversationFields)
                .eq("buyer_id", user.id),
            client
                .from("conversations")
                .select(conversationFields)
                .eq("seller_id", user.id)
        ]);

        const firstError = buyerResult.error || sellerResult.error;

        if (firstError) {
            console.error(
                "A doua șansă: conversation load failed:",
                firstError
            );

            if (isActuallyOffline(firstError)) {
                notifyNetwork(false);

                list.innerHTML =
                    "<div class="empty-state"><h3>" +
                    esc(t("You are offline")) +
                    "</h3><p>" +
                    esc(t("Reconnect to Wi-Fi or mobile data to load your messages.")) +
                    "</p></div>";
            } else {
                showRetry(
                    list,
                    t("We couldn't load your messages"),
                    describeSupabaseError(firstError)
                );
            }

            return false;
        }

        notifyNetwork(true);

        const conversationMap = new Map();

        [
            ...(buyerResult.data || []),
            ...(sellerResult.data || [])
        ].forEach(conversation => {
            conversationMap.set(conversation.id, conversation);
        });

        const conversations = [...conversationMap.values()]
            .sort(
                (a, b) =>
                    new Date(b.updated_at).getTime() -
                    new Date(a.updated_at).getTime()
            );

        if (!conversations.length) {
            updateUnreadBadge(0);

            list.innerHTML =
                "<div class="empty-state"><h3>" +
                esc(t("No conversations yet")) +
                "</h3><p>" +
                esc(t("When you message a seller, your conversations will appear here.")) +
                "</p></div>";

            return true;
        }

        const otherIds = [
            ...new Set(
                conversations.map(conversation =>
                    conversation.buyer_id === user.id
                        ? conversation.seller_id
                        : conversation.buyer_id
                )
            )
        ];

        const listingIds = conversations
            .map(conversation => conversation.listing_id)
            .filter(Boolean);

        const [
            profilesResult,
            listingsResult,
            messageResult
        ] = await Promise.all([
            client
                .from("profiles")
                .select("id,display_name,username,avatar_url,avatar_color")
                .in("id", otherIds),
            listingIds.length
                ? client
                    .from("listings")
                    .select("id,title,price_mdl,seller_id")
                    .in("id", listingIds)
                : Promise.resolve({ data: [], error: null }),
            client
                .from("messages")
                .select("id,conversation_id,sender_id,body,created_at")
                .in(
                    "conversation_id",
                    conversations.map(conversation => conversation.id)
                )
                .order("created_at", { ascending: false })
                .limit(1000)
        ]);

        if (profilesResult.error || listingsResult.error || messageResult.error) {
            const error =
                profilesResult.error ||
                listingsResult.error ||
                messageResult.error;

            console.error(
                "A doua șansă: message list enrichment failed:",
                error
            );

            showRetry(
                list,
                t("We couldn't load your messages"),
                isActuallyOffline(error)
                    ? t("You are offline. Reconnect to Wi-Fi or mobile data to load your messages.")
                    : t("There was a problem loading your message list. Please try again.")
            );

            return false;
        }

        const profiles = profilesResult.data || [];
        const listings = listingsResult.data || [];
        const messages = messageResult.data || [];

        const profileMap = new Map(
            profiles.map(profile => [profile.id, profile])
        );

        const listingMap = new Map(
            listings.map(listing => [listing.id, listing])
        );

        const latestMessageMap = new Map();
        const unreadMap = new Map();

        messages.forEach(messageRow => {
            if (!latestMessageMap.has(messageRow.conversation_id)) {
                latestMessageMap.set(
                    messageRow.conversation_id,
                    messageRow
                );
            }

            if (messageRow.sender_id !== user.id && !messageRow.read_at) {
                unreadMap.set(
                    messageRow.conversation_id,
                    (unreadMap.get(messageRow.conversation_id) || 0) + 1
                );
            }
        });

        let totalUnread = 0;

        list.innerHTML = "";

        conversations.forEach(conversation => {
            const otherId =
                conversation.buyer_id === user.id
                    ? conversation.seller_id
                    : conversation.buyer_id;

            const profile = profileMap.get(otherId) || {};
            const listing = listingMap.get(conversation.listing_id) || {};
            const latest = latestMessageMap.get(conversation.id);
            const unread = unreadMap.get(conversation.id) || 0;

            totalUnread += unread;

            const isSeller =
                listing.seller_id
                    ? listing.seller_id === user.id
                    : conversation.seller_id === user.id;

            const role = isSeller ? t("Seller") : t("Buyer");

            let preview = latest?.body || t("No messages yet.");

            if (latest?.sender_id === user.id) {
                preview = t("You: ") + preview;
            }

            const avatar = profile.avatar_url
                ? "<img src="" + esc(profile.avatar_url) + "" alt="">"
                : esc(
                    (
                        profile.display_name ||
                        profile.username ||
                        "A"
                    ).charAt(0).toUpperCase()
                );

            const button = document.createElement("button");
            button.type = "button";
            button.className =
                "conversation-item" +
                (state.activeConversationId === conversation.id
                    ? " is-active"
                    : "") +
                (unread ? " has-unread" : "");

            button.innerHTML =
                "<span class="conversation-avatar">" +
                avatar +
                "</span>" +
                "<span class="conversation-copy">" +
                "<strong>" +
                esc(profile.display_name || profile.username || t("A doua șansă member")) +
                "</strong>" +
                "<span class="conversation-copy-listing">" +
                esc(listing.title || t("Marketplace")) +
                "</span>" +
                "<span class="conversation-copy-meta">" +
                esc(role) +
                " · " +
                esc(preview) +
                "</span>" +
                "</span>" +
                "<span class="conversation-side">" +
                "<time>" +
                esc(time(conversation.updated_at)) +
                "</time>" +
                (
                    unread
                        ? "<span class="conversation-unread-badge">" +
                          (unread > 99 ? "99+" : String(unread)) +
                          "</span>"
                        : ""
                ) +
                "</span>";

            button.addEventListener(
                "click",
                () => void openConversation(conversation.id)
            );

            list.appendChild(button);
        });

        updateUnreadBadge(totalUnread);

        return true;
    }

    async function loadThread(id, showLoading = true) {
        const auth = await getAuthenticatedUser();
        const user = auth.user;
        const box = el.messages();

        if (!user || !box) {
            if (box && auth.error && !isActuallyOffline(auth.error)) {
                showRetry(
                    box,
                    t("Messages could not be loaded"),
                    describeSupabaseError(auth.error)
                );
            }

            return;
        }

        if (showLoading) {
            box.innerHTML =
                "<div class="message-list-loading">" +
                esc(t("Loading messages…")) +
                "</div>";
        }

        const result = await fetchMessageRows(id);

        if (result.error) {
            console.error(
                "A doua șансă: thread load failed:",
                result.error
            );

            if (isActuallyOffline(result.error)) {
                notifyNetwork(false);

                box.innerHTML =
                    "<div class="empty-state"><p>" +
                    esc(
                        t(
                            "You are offline. Reconnect to Wi-Fi or mobile data to load this conversation."
                        )
                    ) +
                    "</p></div>";
            } else {
                showRetry(
                    box,
                    t("Messages could not be loaded"),
                    t("There was a problem loading this conversation. Please try again.")
                );
            }

            return;
        }

        notifyNetwork(true);

        const rows = result.data || [];

        if (result.hasReadState) {
            const unreadIds = rows
                .filter(
                    messageRow =>
                        messageRow.sender_id !== user.id &&
                        !messageRow.read_at
                )
                .map(messageRow => messageRow.id);

            if (unreadIds.length) {
                const { error: readError } = await client
                    .from("messages")
                    .update({
                        read_at: new Date().toISOString()
                    })
                    .in("id", unreadIds);

                if (readError) {
                    console.warn(
                        "A doua șанса: unable to mark messages read:",
                        readError
                    );
                } else {
                    void loadConversations(false);
                }
            }
        }

        const signature = rows
            .map(
                messageRow =>
                    [
                        messageRow.id,
                        messageRow.sender_id,
                        messageRow.body,
                        messageRow.created_at
                    ].join("|")
            )
            .join("||");

        const nearBottom =
            box.scrollHeight -
            box.scrollTop -
            box.clientHeight <
            120;

        if (!showLoading && signature === state.lastThreadSignature) {
            return;
        }

        state.lastThreadSignature = signature;

        box.innerHTML = "";

        if (!rows.length) {
            box.innerHTML =
                "<div class="message-thread-empty-inline">" +
                esc(t("No messages yet. Say hello!")) +
                "</div>";
        } else {
            rows.forEach(messageRow => {
                const bubble = document.createElement("div");

                bubble.className =
                    "message-bubble " +
                    (
                        messageRow.sender_id === user.id
                            ? "is-own"
                            : "is-other"
                    );

                const text = document.createElement("p");
                text.textContent = messageRow.body;

                const timestamp = document.createElement("time");
                timestamp.textContent = time(messageRow.created_at);

                bubble.append(text, timestamp);
                box.appendChild(bubble);
            });
        }

        if (nearBottom || showLoading) {
            box.scrollTop = box.scrollHeight;
        }
    }

    async function loadThreadHeader(conversation, user) {
        const content = el.headerContent();

        if (!content) return;

        const otherId =
            conversation.buyer_id === user.id
                ? conversation.seller_id
                : conversation.buyer_id;

        const profileResult = await client
            .from("profiles")
            .select("id,display_name,username,avatar_url,avatar_color")
            .eq("id", otherId)
            .maybeSingle();

        const profile = profileResult.data || {};

        let listing = null;
        let listingImage = "";

        if (conversation.listing_id) {
            const listingResult = await client
                .from("listings")
                .select("id,title,price_mdl,seller_id")
                .eq("id", conversation.listing_id)
                .maybeSingle();

            listing = listingResult.data || null;

            if (listing) {
                const imageResult = await client
                    .from("listing_images")
                    .select("image_url,sort_order")
                    .eq("listing_id", listing.id)
                    .order("sort_order", { ascending: true })
                    .limit(1)
                    .maybeSingle();

                listingImage = imageResult.data?.image_url || "";
            }
        }

        state.activeSellerId = listing?.seller_id || otherId;
        state.activeListingId = conversation.listing_id || null;

        const safetyHtml =
            "<div class="message-safety-notice">" +
                "<div>" +
                    "<strong>" + esc(t("Beware of scams")) + "</strong>" +
                    "<span>" +
                        esc(
                            t(
                                "Keep communication and purchase discussions on A doua șansă. Never share passwords, verification codes, or send money through external links."
                            )
                        ) +
                    "</span>" +
                "</div>" +
                "<a href="scam-policy.html">" +
                    esc(t("Read our scam policy")) +
                "</a>" +
            "</div>";

        const listingHtml = listing
            ? (
                "<button type="button" class="message-listing-card" data-message-listing-id="" +
                esc(listing.id) +
                "">" +
                    "<span class="message-listing-card-image">" +
                        (
                            listingImage
                                ? "<img src="" + esc(listingImage) + "" alt="" loading="lazy" decoding="async">"
                                : "<span aria-hidden="true"></span>"
                        ) +
                    "</span>" +
                    "<span class="message-listing-card-copy">" +
                        "<strong>" + esc(listing.title || t("Listing")) + "</strong>" +
                        "<span>" +
                            esc(
                                Number.isFinite(Number(listing.price_mdl))
                                    ? Number(listing.price_mdl).toLocaleString("en-US") + " MDL"
                                    : ""
                            ) +
                        "</span>" +
                        "<small>" + esc(t("Open listing")) + " →</small>" +
                    "</span>" +
                "</button>"
            )
            : "";

        const profileName =
            profile.display_name ||
            profile.username ||
            t("A doua șansă member");

        content.innerHTML =
            "<div class="message-thread-person">" +
                "<div class="conversation-avatar large">" +
                    (
                        profile.avatar_url
                            ? "<img src="" + esc(profile.avatar_url) + "" alt="">"
                            : esc(profileName.charAt(0).toUpperCase())
                    ) +
                "</div>" +
                "<div>" +
                    "<strong>" + esc(profileName) + "</strong>" +
                    "<span>" + esc(t("Private conversation")) + "</span>" +
                "</div>" +
            "</div>" +
            safetyHtml +
            listingHtml;

        content
            .querySelector("[data-message-listing-id]")
            ?.addEventListener("click", () => {
                window.dispatchEvent(
                    new CustomEvent("closet:open-listing", {
                        detail: {
                            listingId: conversation.listing_id
                        }
                    })
                );
            });
    }

    async function openConversation(id) {
        state.activeConversationId = id;
        state.lastThreadSignature = "";

        const thread = el.thread();
        const empty = el.empty();

        if (!thread || !empty) return;

        empty.hidden = true;
        thread.hidden = false;

        document
            .getElementById("messagesShell")
            ?.classList.add("is-thread-open");

        const auth = await getAuthenticatedUser();
        const user = auth.user;

        if (!user) {
            if (auth.error && !isActuallyOffline(auth.error)) {
                showRetry(
                    el.messages(),
                    t("Messages could not be loaded"),
                    describeSupabaseError(auth.error)
                );
            }

            return;
        }

        const conversationResult = await client
            .from("conversations")
            .select("id,buyer_id,seller_id,listing_id")
            .eq("id", id)
            .single();

        if (conversationResult.error) {
            console.error(
                "A doua șansă: conversation open failed:",
                conversationResult.error
            );

            showRetry(
                el.messages(),
                t("Messages could not be loaded"),
                isActuallyOffline(conversationResult.error)
                    ? t("You are offline. Reconnect to Wi-Fi or mobile data to load this conversation.")
                    : describeSupabaseError(conversationResult.error)
            );

            return;
        }

        const conversation = conversationResult.data;

        await loadThreadHeader(conversation, user);
        await loadThread(id);

        await loadConversations(false);
        startRefresh();
    }

    async function sendMessage(event) {
        event.preventDefault();

        const auth = await getAuthenticatedUser();
        const user = auth.user;
        const input = el.input();

        if (!user || !input || !state.activeConversationId) {
            return;
        }

        const body = input.value.trim();

        if (!body) return;

        const button =
            el.composer()?.querySelector("button[type=submit]");

        if (button) button.disabled = true;

        const result = await client
            .from("messages")
            .insert({
                conversation_id: state.activeConversationId,
                sender_id: user.id,
                body
            });

        if (button) button.disabled = false;

        if (result.error) {
            if (isActuallyOffline(result.error)) {
                notifyNetwork(false);

                window.dispatchEvent(
                    new CustomEvent("closet:message-error", {
                        detail: {
                            message: t("You are offline. Your message was not sent.")
                        }
                    })
                );
            } else {
                window.dispatchEvent(
                    new CustomEvent("closet:message-error", {
                        detail: {
                            message: t("Message could not be sent.")
                        }
                    })
                );
            }

            return;
        }

        notifyNetwork(true);

        input.value = "";
        state.lastThreadSignature = "";

        await client
            .from("conversations")
            .update({
                updated_at: new Date().toISOString()
            })
            .eq("id", state.activeConversationId);

        await loadThread(state.activeConversationId, false);
        await loadConversations(false);
    }

    async function openConversationWithSeller(sellerId, listingId = null) {
        const auth = await getAuthenticatedUser();

        if (!auth.user) {
            window.location.href = "login.html";
            return null;
        }

        if (sellerId === auth.user.id) {
            return null;
        }

        try {
            const result =
                await getOrCreateConversation(
                    sellerId,
                    listingId
                );

            if (!result.success) {
                throw new Error(result.message);
            }

            ClosetNavigation.show("messages");

            await openConversation(
                result.conversation.id
            );

            return result.conversation;
        } catch (error) {
            console.error(
                "A doua шансa messaging error:",
                error
            );

            window.dispatchEvent(
                new CustomEvent("closet:message-error", {
                    detail: {
                        message: t("Messages are unavailable right now.")
                    }
                })
            );

            return null;
        }
    }

    function initialize() {
        if (state.initialized) return;

        state.initialized = true;
        notifyNetwork(true);

        el.composer()?.addEventListener(
            "submit",
            sendMessage
        );

        el.mobileBack()?.addEventListener(
            "click",
            () => {
                state.activeConversationId = null;
                state.activeSellerId = null;
                state.activeListingId = null;
                state.lastThreadSignature = "";

                stopRefresh();

                if (el.thread()) el.thread().hidden = true;
                if (el.empty()) el.empty().hidden = false;

                document
                    .getElementById("messagesShell")
                    ?.classList.remove("is-thread-open");
            }
        );

        window.addEventListener(
            "closet:navigate",
            event => {
                if (event.detail?.view === "messages") {
                    void getAuthenticatedUser().then(auth => {
                        if (!auth.user) {
                            window.location.href = "login.html";
                            return;
                        }

                        void loadConversations();
                    });

                    return;
                }

                stopRefresh();
            }
        );

        window.addEventListener(
            "closet:auth",
            () => {
                if (
                    ClosetNavigation.getCurrentView() === "messages"
                ) {
                    void loadConversations();
                }
            }
        );
    }

    window.ClosetMessages = {
        initialize,
        openConversationWithSeller,
        openConversation,
        loadConversations,
        getOrCreateConversation,
        findConversation
    };
})();
