const ClosetCategories = (() => {
    const client = window.supabaseClient;

    let categories = null;
    let categoriesRequest = null;

    // Versioned cache key so old category IDs cannot survive a category-data reset.
    const CACHE_KEY = "closet-categories-cache-v2";
    const CACHE_TTL = 60 * 60 * 1000;

    function readCachedCategories() {
        try {
            const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
            if (!cached || !Array.isArray(cached.data)) return null;
            if (Date.now() - Number(cached.timestamp || 0) > CACHE_TTL) return null;
            return cached.data;
        } catch {
            return null;
        }
    }

    function writeCachedCategories(data) {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                timestamp: Date.now(),
                data
            }));
        } catch {
            // Storage can be unavailable; the in-memory cache still works.
        }
    }

    async function getFreshCategories() {
        const { data, error } = await client
            .from("categories")
            .select("id, name, slug, parent_id, sort_order")
            .eq("is_active", true)
            .order("sort_order", { ascending: true });

        if (error) {
            console.error("CLOSET fresh categories error:", error);
            throw error;
        }

        categories = data || [];
        writeCachedCategories(categories);
        return categories;
    }

    async function getCategories() {
        if (categories) {
            return categories;
        }

        const cached = readCachedCategories();
        if (cached) {
            categories = cached;
            return categories;
        }

        // Share one request between the homepage, category picker and
        // any other component that asks for categories at the same time.
        if (categoriesRequest) {
            return categoriesRequest;
        }

        categoriesRequest = client
            .from("categories")
            .select("id, name, slug, parent_id, sort_order")
            .eq("is_active", true)
            .order("sort_order", { ascending: true })
            .then(({ data, error }) => {
                if (error) {
                    console.error("CLOSET categories error:", error);
                    throw error;
                }

                categories = data || [];
                writeCachedCategories(categories);
                return categories;
            })
            .finally(() => {
                categoriesRequest = null;
            });

        return categoriesRequest;
    }

    async function getTopLevelCategories() {
        const allCategories = await getCategories();

        return allCategories.filter(
            (category) => category.parent_id === null
        );
    }

    async function getSubcategories(parentId) {
        const allCategories = await getCategories();

        return allCategories.filter(
            (category) => category.parent_id === parentId
        );
    }

    function clearCache() {
        categories = null;
        categoriesRequest = null;
        try {
            localStorage.removeItem(CACHE_KEY);
        } catch {
            // Ignore unavailable storage.
        }
    }

    return {
        getCategories,
        getFreshCategories,
        getTopLevelCategories,
        getSubcategories,
        clearCache
    };
})();