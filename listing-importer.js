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

        const user = window.ClosetAuth?.getUser?.();
        if (!user) {
            window.location.href = "login.html";
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
            const { data, error } =
                await window.supabaseClient.functions.invoke(
                    "fetch-999-meta",
                    { body: { url: url.href } }
                );

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

            showMessage(
                window.ClosetI18n?.translateValue?.(
                    "Couldn’t import that 999.md listing. Please check the link and try again."
                ) ||
                "Couldn’t import that 999.md listing. Please check the link and try again.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    });
})();
