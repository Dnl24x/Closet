const ClosetListings = (() => {
    const client = window.supabaseClient;

    const STORAGE_BUCKET = "listing-images";

    async function uploadImage(file, userId) {
        if (!file) {
            throw new Error("Please select an image.");
        }

        if (!file.type.startsWith("image/")) {
            throw new Error("Please select a valid image file.");
        }

        const extension =
            file.name.split(".").pop()?.toLowerCase() || "jpg";

        const filePath =
            `${userId}/${crypto.randomUUID()}.${extension}`;

        const { error } =
            await client.storage
                .from(STORAGE_BUCKET)
                .upload(filePath, file, {
                    cacheControl: "3600",
                    upsert: false
                });

        if (error) {
            throw error;
        }

        const {
            data: { publicUrl }
        } =
            client.storage
                .from(STORAGE_BUCKET)
                .getPublicUrl(filePath);

        return {
            path: filePath,
            url: publicUrl
        };
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
        image
    }) {
        const user = ClosetAuth.getUser();

        if (!user) {
            return {
                success: false,
                message:
                    "You need to sign in before publishing an item."
            };
        }

        if (!categoryId) {
            return {
                success: false,
                message: "Please choose a category."
            };
        }

        try {
            const uploadedImage =
                await uploadImage(image, user.id);

            /*
             * A listing belongs to the most specific category selected.
             * If the user chose a subcategory, store that.
             * Otherwise store the main category.
             */
            const finalCategoryId =
                subcategoryId || categoryId;

            const { data: listing, error: listingError } =
                await client
                    .from("listings")
                    .insert({
                        seller_id: user.id,
                        category_id: finalCategoryId,
                        title: String(title || "").trim(),
                        description:
                            String(description || "").trim(),
                        price_mdl: Number(price),
                        condition,
                        location:
                            String(location || "").trim(),
                        attributes:
                            attributes &&
                            typeof attributes === "object"
                                ? attributes
                                : {}
                    })
                    .select()
                    .single();

            if (listingError) {
                throw listingError;
            }

            const { error: imageError } =
                await client
                    .from("listing_images")
                    .insert({
                        listing_id: listing.id,
                        image_url: uploadedImage.url,
                        sort_order: 0
                    });

            if (imageError) {
                await client
                    .from("listings")
                    .delete()
                    .eq("id", listing.id)
                    .eq("seller_id", user.id);

                await client.storage
                    .from(STORAGE_BUCKET)
                    .remove([uploadedImage.path]);

                throw imageError;
            }

            return {
                success: true,
                listing
            };
        } catch (error) {
            console.error(
                "CLOSET listing creation error:",
                error
            );

            return {
                success: false,
                message: getListingErrorMessage(error)
            };
        }
    }

    async function getListings({
        categoryId = null,
        search = "",
        limit = 30
    } = {}) {
        try {
            let query =
                client
                    .from("listings")
                    .select(`
                        id,
                        seller_id,
                        category_id,
                        title,
                        description,
                        price_mdl,
                        condition,
                        status,
                        location,
                        attributes,
                        created_at,
                        updated_at,
                        profiles (
                            id,
                            display_name,
                            username,
                            avatar_url
                        ),
                        categories (
                            id,
                            name,
                            slug,
                            parent_id
                        ),
                        listing_images (
                            id,
                            image_url,
                            sort_order
                        )
                    `)
                    .eq("status", "active")
                    .order("created_at", {
                        ascending: false
                    })
                    .limit(limit);

            if (categoryId) {
                query = query.eq(
                    "category_id",
                    categoryId
                );
            }

            const cleanSearch =
                String(search || "").trim();

            if (cleanSearch) {
                query = query.ilike(
                    "title",
                    `%${cleanSearch}%`
                );
            }

            const {
                data,
                error
            } = await query;

            if (error) {
                throw error;
            }

            return {
                success: true,
                listings: data || []
            };
        } catch (error) {
            console.error(
                "CLOSET listing fetch error:",
                error
            );

            return {
                success: false,
                message:
                    getListingErrorMessage(error),
                listings: []
            };
        }
    }

    async function getListing(id) {
        if (!id) {
            return {
                success: false,
                message: "Listing not found."
            };
        }

        try {
            const {
                data,
                error
            } =
                await client
                    .from("listings")
                    .select(`
                        id,
                        seller_id,
                        category_id,
                        title,
                        description,
                        price_mdl,
                        condition,
                        status,
                        location,
                        attributes,
                        created_at,
                        updated_at,
                        profiles (
                            id,
                            display_name,
                            username,
                            bio,
                            location,
                            avatar_url,
                            created_at
                        ),
                        categories (
                            id,
                            name,
                            slug,
                            parent_id
                        ),
                        listing_images (
                            id,
                            image_url,
                            sort_order
                        )
                    `)
                    .eq("id", id)
                    .maybeSingle();

            if (error) {
                throw error;
            }

            if (!data) {
                return {
                    success: false,
                    message:
                        "This listing could not be found."
                };
            }

            return {
                success: true,
                listing: data
            };
        } catch (error) {
            console.error(
                "CLOSET listing details error:",
                error
            );

            return {
                success: false,
                message:
                    getListingErrorMessage(error)
            };
        }
    }

    async function getMyListings() {
        const user =
            ClosetAuth.getUser();

        if (!user) {
            return {
                success: false,
                message:
                    "You need to sign in first.",
                listings: []
            };
        }

        try {
            const {
                data,
                error
            } =
                await client
                    .from("listings")
                    .select(`
                        id,
                        seller_id,
                        category_id,
                        title,
                        description,
                        price_mdl,
                        condition,
                        status,
                        location,
                        attributes,
                        created_at,
                        updated_at,
                        categories (
                            id,
                            name,
                            slug,
                            parent_id
                        ),
                        listing_images (
                            id,
                            image_url,
                            sort_order
                        )
                    `)
                    .eq("seller_id", user.id)
                    .neq("status", "deleted")
                    .order("created_at", {
                        ascending: false
                    });

            if (error) {
                throw error;
            }

            return {
                success: true,
                listings: data || []
            };
        } catch (error) {
            console.error(
                "CLOSET my listings error:",
                error
            );

            return {
                success: false,
                message:
                    getListingErrorMessage(error),
                listings: []
            };
        }
    }

    async function updateListing(
        id,
        updates = {}
    ) {
        const user =
            ClosetAuth.getUser();

        if (!user) {
            return {
                success: false,
                message:
                    "You need to sign in first."
            };
        }

        if (!id) {
            return {
                success: false,
                message:
                    "Listing not found."
            };
        }

        try {
            const allowedUpdates = {};

            const allowedFields = [
                "category_id",
                "title",
                "description",
                "price_mdl",
                "condition",
                "status",
                "location",
                "attributes"
            ];

            allowedFields.forEach((field) => {
                if (
                    Object.prototype.hasOwnProperty.call(
                        updates,
                        field
                    )
                ) {
                    allowedUpdates[field] =
                        updates[field];
                }
            });

            if (
                Object.prototype.hasOwnProperty.call(
                    allowedUpdates,
                    "title"
                )
            ) {
                allowedUpdates.title =
                    String(
                        allowedUpdates.title || ""
                    ).trim();
            }

            if (
                Object.prototype.hasOwnProperty.call(
                    allowedUpdates,
                    "description"
                )
            ) {
                allowedUpdates.description =
                    String(
                        allowedUpdates.description || ""
                    ).trim();
            }

            if (
                Object.prototype.hasOwnProperty.call(
                    allowedUpdates,
                    "location"
                )
            ) {
                allowedUpdates.location =
                    String(
                        allowedUpdates.location || ""
                    ).trim();
            }

            if (
                Object.prototype.hasOwnProperty.call(
                    allowedUpdates,
                    "price_mdl"
                )
            ) {
                allowedUpdates.price_mdl =
                    Number(
                        allowedUpdates.price_mdl
                    );
            }

            const {
                data,
                error
            } =
                await client
                    .from("listings")
                    .update(allowedUpdates)
                    .eq("id", id)
                    .eq("seller_id", user.id)
                    .select()
                    .single();

            if (error) {
                throw error;
            }

            return {
                success: true,
                listing: data
            };
        } catch (error) {
            console.error(
                "CLOSET listing update error:",
                error
            );

            return {
                success: false,
                message:
                    getListingErrorMessage(error)
            };
        }
    }

    async function deleteListing(id) {
        const user =
            ClosetAuth.getUser();

        if (!user) {
            return {
                success: false,
                message:
                    "You need to sign in first."
            };
        }

        if (!id) {
            return {
                success: false,
                message:
                    "Listing not found."
            };
        }

        try {
            const {
                data: images,
                error: imageFetchError
            } =
                await client
                    .from("listing_images")
                    .select("image_url")
                    .eq("listing_id", id);

            if (imageFetchError) {
                throw imageFetchError;
            }

            const {
                error: deleteError
            } =
                await client
                    .from("listings")
                    .delete()
                    .eq("id", id)
                    .eq("seller_id", user.id);

            if (deleteError) {
                throw deleteError;
            }

            const paths =
                (images || [])
                    .map((image) =>
                        getStoragePath(
                            image.image_url
                        )
                    )
                    .filter(Boolean);

            if (paths.length) {
                await client.storage
                    .from(STORAGE_BUCKET)
                    .remove(paths);
            }

            return {
                success: true
            };
        } catch (error) {
            console.error(
                "CLOSET listing deletion error:",
                error
            );

            return {
                success: false,
                message:
                    getListingErrorMessage(error)
            };
        }
    }

    function getStoragePath(url) {
        if (!url) {
            return null;
        }

        const marker =
            `/storage/v1/object/public/${STORAGE_BUCKET}/`;

        const index =
            url.indexOf(marker);

        if (index === -1) {
            return null;
        }

        return decodeURIComponent(
            url.substring(
                index + marker.length
            )
        );
    }

    function getListingErrorMessage(error) {
        const message =
            String(
                error?.message || ""
            ).toLowerCase();

        if (
            message.includes(
                "row-level security"
            )
        ) {
            return "You don't have permission to perform that action.";
        }

        if (
            message.includes("bucket") ||
            message.includes("storage")
        ) {
            return "The image could not be uploaded. Please try again.";
        }

        if (
            message.includes(
                "foreign key"
            )
        ) {
            return "The selected category is no longer available. Please choose another category.";
        }

        if (
            message.includes(
                "violates check constraint"
            )
        ) {
            return "One of the listing details is invalid. Please check the information and try again.";
        }

        if (
            message.includes("network") ||
            message.includes("fetch")
        ) {
            return "Please check your internet connection and try again.";
        }

        return (
            error?.message ||
            "We couldn't complete that action. Please try again."
        );
    }

    return {
        createListing,
        getListings,
        getListing,
        getMyListings,
        updateListing,
        deleteListing
    };
})();
