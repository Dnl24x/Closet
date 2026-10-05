(() => {
    const form = document.getElementById("listingImportForm");
    const urlInput = document.getElementById("listingImportUrl");
    const button = document.getElementById("listingImportButton");
    const consent = document.getElementById("listingImportConsent");
    const message = document.getElementById("listingImportMessage");
    const preview = document.getElementById("listingImportPreview");

    if (!form || !urlInput || !button) return;

    function showMessage(text, type = "info") {
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

    function setLoading(loading) {
        button.disabled = loading;
        button.textContent = loading
            ? "Fetching…"
            : (window.ClosetI18n?.translateValue?.("Fetch & Auto-Fill") || "Fetch & Auto-Fill");
    }

    function wait(milliseconds) {
        return new Promise(resolve => window.setTimeout(resolve, milliseconds));
    }

    function isFunctionFetchError(error) {
        const name = String(error?.name || "").toLowerCase();
        const message = String(error?.message || "").toLowerCase();

        return (
            name.includes("functionsfetcherror") ||
            message.includes("failed to send a request to the edge function") ||
            message.includes("edge function")
        );
    }

    async function invokeImporter(sourceUrl) {
        let lastError = null;

        for (let attempt = 0; attempt < 2; attempt += 1) {
            try {
                const result =
                    await window.supabaseClient.functions.invoke(
                        "fetch-999-meta",
                        { body: { url: sourceUrl } }
                    );

                if (!result?.error) {
                    return result;
                }

                lastError = result.error;

                if (attempt === 0 && isFunctionFetchError(result.error)) {
                    await wait(700);
                    continue;
                }

                return result;
            } catch (error) {
                lastError = error;

                if (attempt === 0 && isFunctionFetchError(error)) {
                    await wait(700);
                    continue;
                }

                throw error;
            }
        }

        throw lastError || new Error("The 999 importer could not be reached.");
    }

    function validate999Url(value) {
        let url;

        try {
            url = new URL(String(value || "").trim());
        } catch {
            return null;
        }

        const hostname = url.hostname.toLowerCase();

        if (hostname !== "999.md" && !hostname.endsWith(".999.md")) {
            return null;
        }

        return url;
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
            console.error("A doua șansă importer auth check error:", error);
            return null;
        }
    }

    function renderPreview(data) {
        if (!preview) return;

        preview.replaceChildren();

        const title = document.createElement("strong");
        title.textContent = data.title || "Imported listing";
        preview.appendChild(title);

        if (data.sourcePrice?.value && data.sourcePrice?.currency) {
            const priceNote = document.createElement("span");
            priceNote.textContent = data.priceMdl
                ? `Imported price: ${Number(data.priceMdl).toLocaleString("en-US")} MDL (from ${data.sourcePrice.value} ${data.sourcePrice.currency})`
                : `Original price: ${data.sourcePrice.value} ${data.sourcePrice.currency}`;
            preview.appendChild(priceNote);
        }

        if (data.imageUrl) {
            const image = document.createElement("img");
            image.src = data.imageUrl;
            image.alt = "";
            image.loading = "lazy";
            image.decoding = "async";
            image.onerror = () => {
                image.onerror = null;
                image.src = "fallback-placeholder.svg";
            };
            preview.appendChild(image);
        }

        const note = document.createElement("span");
        note.textContent =
            "Review the imported details before publishing. Only reuse content and photos you have permission to use.";
        preview.appendChild(note);

        preview.hidden = false;
    }

    form.addEventListener("submit", async event => {
        event.preventDefault();
        clearMessage();

        const user = await getAuthenticatedUser();
        if (!user) {
            showMessage(
                window.ClosetI18n?.translateValue?.("Please sign in before importing a 999.md listing.") ||
                "Please sign in before importing a 999.md listing.",
                "error"
            );
            return;
        }

        const rawUrl = String(urlInput.value || "").trim();

        if (!rawUrl) {
            showMessage(
                window.ClosetI18n?.translateValue?.("Please enter a 999.md listing URL.") ||
                "Please enter a 999.md listing URL.",
                "error"
            );
            urlInput.focus();
            return;
        }

        if (consent && !consent.checked) {
            showMessage(
                window.ClosetI18n?.translateValue?.(
                    "Please confirm that you own the listing or have permission to reuse its text and photos."
                ) ||
                "Please confirm that you own the listing or have permission to reuse its text and photos.",
                "error"
            );
            return;
        }

        const url = validate999Url(urlInput.value);
        if (!url) {
            showMessage(
                window.ClosetI18n?.translateValue?.("Please paste a valid 999.md listing URL.") ||
                "Please paste a valid 999.md listing URL.",
                "error"
            );
            return;
        }

        setLoading(true);
        if (preview) preview.hidden = true;

        try {
            const { data, error } = await invokeImporter(url.href);

            if (error) {
                throw error;
            }

            if (!data?.title) {
                throw new Error("No listing metadata was found.");
            }

            window.dispatchEvent(
                new CustomEvent("closet:999-imported", {
                    detail: {
                        ...data,
                        sourceUrl: url.href
                    }
                })
            );

            renderPreview(data);

            showMessage(
                window.ClosetI18n?.translateValue?.(
                    "Imported from 999.md. Review everything before publishing."
                ) ||
                "Imported from 999.md. Review everything before publishing.",
                "success"
            );
        } catch (error) {
            console.error("A doua șansă 999 importer error:", error);

            let serverMessage = "";

            try {
                if (error?.context?.json) {
                    const payload = await error.context.json();
                    serverMessage =
                        String(payload?.error || payload?.message || "").trim();
                }
            } catch {
                serverMessage = "";
            }

            const fallback =
                "Couldn’t import that 999.md listing. Please check the link and try again.";

            const friendlyFunctionError =
                isFunctionFetchError(error)
                    ? "The 999.md import service could not be reached. Please refresh and try again. If it keeps happening, the fetch-999-meta Edge Function needs to be redeployed in Supabase."
                    : "";

            showMessage(
                serverMessage || friendlyFunctionError || error?.message || fallback,
                "error"
            );        } finally {
            setLoading(false);
        }
    });
})();
