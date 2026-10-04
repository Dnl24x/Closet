const ClosetListings = (() => {
    const client = window.supabaseClient;
    const STORAGE_BUCKET = "listing-images";
    const MAX_IMAGES = 20;
    const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

    function getStoragePath(url) {
        if (!url) return null;
        const marker = \`/storage/v1/object/public/\${STORAGE_BUCKET}/\`;
        const index = String(url).indexOf(marker);
        if (index === -1) return null;
        return decodeURIComponent(String(url).substring(index + marker.length));
    }

    async function uploadImage(file, userId) {
        if (!file || !ALLOWED_IMAGE_TYPES.has(file.type)) {
            throw new Error("Please choose a JPG, PNG or WebP image.");
        }

        const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
        const path = \`\${userId}/\${crypto.randomUUID()}.\${extension}\`;

        const { error } = await client.storage.from(STORAGE_BUCKET).upload(path, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type
        });

        if (error) throw error;

        const { data } = client.storage.from(STORAGE_BUCKET).getPublicUrl(path);
        return { path, url: data.publicUrl };
    }

    function validateListingInput({ title, description, price, categoryId, condition, location, images }) {
        if (!title || String(title).trim().length < 2) return "Please add a title for your item.";
        if (String(title).trim().length > 100) return "Your title is too long.";
        if (!Number.isFinite(Number(price)) || Number(price) <= 0) return "Please enter a valid price.";
        if (!categoryId) return "Please choose a category.";
        if (!condition) return "Please choose the item's condition.";
        if (!location || String(location).trim().length < 2) return "Please add a location.";
        if (!description || String(description).trim().length < 5) return "Please add a description.";
        if (!Array.isArray(images) || images.length === 0) return "Please add at least one photo.";
        if (images.length > MAX_IMAGES) return \`You can upload up to \${MAX_IMAGES} photos.\`;
        return null;
    }

    async function createListing({
        title,
        description,
        price,
        categoryId,
        subcategoryId,
        condition,
        location = "",
        attributes = {},
        images = []
    }) {
        const user = ClosetAuth.getUser();
        if (!user) return { success: false, message: "You need to sign in before publishing an item." };

        const inputError = validateListingInput({ title, description, price, categoryId, condition, location, images });
        if (inputError) return { success: false, message: inputError };

        const uploaded = [];
        let listing = null;

        try {
            const finalCategoryId = subcategoryId || categoryId;

            const { data: listingData, error: listingError } = await client
                .from("listings")
                .insert({
                    seller_id: user.id,
                    category_id: finalCategoryId,
                    title: String(title).trim(),
                    description: String(description).trim(),
                    price_mdl: Number(price),
                    condition,
                    location: String(location).trim(),
                    attributes: attributes && typeof attributes === "object" ? attributes : {}
                })
                .select()
                .single();

            if (listingError) throw listingError;
            listing = listingData;

            for (let index = 0; index < images.length; index += 1) {
                const image = await uploadImage(images[index], user.id);
                uploaded.push(image);

                const { error: imageError } = await client.from("listing_images").insert({
                    listing_id: listing.id,
                    image_url: image.url,
                    sort_order: index
                });

                if (imageError) throw imageError;
            }

            return { success: true, listing };
        } catch (error) {
            console.error("CLOSET listing creation error:", error);

            if (listing?.id) {
                await client.from("listing_images").delete().eq("listing_id", listing.id);
                await client.from("listings").delete().eq("id", listing.id).eq("seller_id", user.id);
            }

            if (uploaded.length) {
                await client.storage.from(STORAGE_BUCKET).remove(uploaded.map(item => item.path));
            }

            return { success: false, message: getListingErrorMessage(error) };
        }
    }

    async function getListings({
        categoryId = null,
        search = "",
        location = "",
        condition = "",
        minPrice = null,
        maxPrice = null,
        sort = "newest",
        limit = 30
    } = {}) {
        try {
            let query = client.from("listings").select(\`
                id, seller_id, category_id, title, description, price_mdl, condition, status, location, attributes, created_at, updated_at,
                profiles (id, display_name, username, avatar_url),
                categories (id, name, slug, parent_id),
                listing_images (id, image_url, sort_order)
            \`).eq("status", "active");

            if (categoryId) {
                const children = typeof ClosetCategories !== "undefined"
                    ? await ClosetCategories.getSubcategories(categoryId)
                    : [];
                const categoryIds = [categoryId, ...children.map(item => item.id)];
                query = query.in("category_id", categoryIds);
            }

            const cleanSearch = String(search || "").trim();
            if (cleanSearch) {
                query = query.or(\`title.ilike.%\${cleanSearch}%,description.ilike.%\${cleanSearch}%\`);
            }

            if (location) query = query.ilike("location", \`%\${String(location).trim()}%\`);
            if (condition) query = query.eq("condition", condition);
            if (minPrice !== null && minPrice !== "" && Number.isFinite(Number(minPrice))) query = query.gte("price_mdl", Number(minPrice));
            if (maxPrice !== null && maxPrice !== "" && Number.isFinite(Number(maxPrice))) query = query.lte("price_mdl", Number(maxPrice));

            const sortMap = {
                newest: { column: "created_at", ascending: false },
                oldest: { column: "created_at", ascending: true },
                price_low: { column: "price_mdl", ascending: true },
                price_high: { column: "price_mdl", ascending: false }
            };
            const selectedSort = sortMap[sort] || sortMap.newest;
            query = query.order(selectedSort.column, { ascending: selectedSort.ascending }).limit(limit);

            const { data, error } = await query;
            if (error) throw error;

            return { success: true, listings: data || [] };
        } catch (error) {
            console.error("CLOSET listing fetch error:", error);
            return { success: false, message: getListingErrorMessage(error), listings: [] };
        }
    }

    async function getListing(id) {
        if (!id) return { success: false, message: "Listing not found." };

        try {
            const { data, error } = await client.from("listings").select(\`
                id, seller_id, category_id, title, description, price_mdl, condition, status, location, attributes, created_at, updated_at,
                profiles (id, display_name, username, bio, location, avatar_url, created_at),
                categories (id, name, slug, parent_id),
                listing_images (id, image_url, sort_order)
            \`).eq("id", id).maybeSingle();

            if (error) throw error;
            if (!data) return { success: false, message: "This listing could not be found." };
            return { success: true, listing: data };
        } catch (error) {
            console.error("CLOSET listing details error:", error);
            return { success: false, message: getListingErrorMessage(error) };
        }
    }

    async function getMyListings() {
        const user = ClosetAuth.getUser();
        if (!user) return { success: false, message: "You need to sign in first.", listings: [] };

        try {
            const { data, error } = await client.from("listings").select(\`
                id, seller_id, category_id, title, description, price_mdl, condition, status, location, attributes, created_at, updated_at,
                categories (id, name, slug, parent_id),
                listing_images (id, image_url, sort_order)
            \`).eq("seller_id", user.id).neq("status", "deleted").order("created_at", { ascending: false });

            if (error) throw error;
            return { success: true, listings: data || [] };
        } catch (error) {
            console.error("CLOSET my listings error:", error);
            return { success: false, message: getListingErrorMessage(error), listings: [] };
        }
    }

    async function updateListing(id, updates = {}) {
        const user = ClosetAuth.getUser();
        if (!user) return { success: false, message: "You need to sign in first." };
        if (!id) return { success: false, message: "Listing not found." };

        try {
            const allowedFields = ["category_id", "title", "description", "price_mdl", "condition", "status", "location", "attributes"];
            const allowedUpdates = {};
            allowedFields.forEach(field => {
                if (Object.prototype.hasOwnProperty.call(updates, field)) allowedUpdates[field] = updates[field];
            });

            if ("title" in allowedUpdates) allowedUpdates.title = String(allowedUpdates.title || "").trim();
            if ("description" in allowedUpdates) allowedUpdates.description = String(allowedUpdates.description || "").trim();
            if ("location" in allowedUpdates) allowedUpdates.location = String(allowedUpdates.location || "").trim();
            if ("price_mdl" in allowedUpdates) allowedUpdates.price_mdl = Number(allowedUpdates.price_mdl);

            const { data, error } = await client.from("listings").update(allowedUpdates)
                .eq("id", id).eq("seller_id", user.id).select().single();

            if (error) throw error;
            return { success: true, listing: data };
        } catch (error) {
            console.error("CLOSET listing update error:", error);
            return { success: false, message: getListingErrorMessage(error) };
        }
    }

    async function deleteListing(id) {
        const user = ClosetAuth.getUser();
        if (!user) return { success: false, message: "You need to sign in first." };
        if (!id) return { success: false, message: "Listing not found." };

        try {
            const { data: images, error: imageFetchError } = await client.from("listing_images").select("image_url").eq("listing_id", id);
            if (imageFetchError) throw imageFetchError;

            const { error: deleteError } = await client.from("listings").delete().eq("id", id).eq("seller_id", user.id);
            if (deleteError) throw deleteError;

            const paths = (images || []).map(image => getStoragePath(image.image_url)).filter(Boolean);
            if (paths.length) await client.storage.from(STORAGE_BUCKET).remove(paths);

            return { success: true };
        } catch (error) {
            console.error("CLOSET listing deletion error:", error);
            return { success: false, message: getListingErrorMessage(error) };
        }
    }

    function getListingErrorMessage(error) {
        const message = String(error?.message || "").toLowerCase();
        if (message.includes("row-level security")) return "You don't have permission to perform that action.";
        if (message.includes("bucket") || message.includes("storage")) return "The image could not be uploaded. Check that the listing image storage bucket and its policies are configured, then try again.";
        if (message.includes("foreign key")) return "The selected category is no longer available. Please choose another category.";
        if (message.includes("violates check constraint")) return "One of the listing details is invalid. Please check the information and try again.";
        if (message.includes("network") || message.includes("fetch")) return "Please check your internet connection and try again.";
        return error?.message || "We couldn't complete that action. Please try again.";
    }

    return { createListing, getListings, getListing, getMyListings, updateListing, deleteListing, MAX_IMAGES };
})();