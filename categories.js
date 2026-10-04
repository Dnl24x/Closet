const ClosetCategories = (() => {
    const client = window.supabaseClient;

    let categories = null;

    async function getCategories() {
        if (categories) {
            return categories;
        }

        const { data, error } = await client
            .from("categories")
            .select("id, name, slug, parent_id, sort_order")
            .eq("is_active", true)
            .order("sort_order", { ascending: true });

        if (error) {
            console.error("CLOSET categories error:", error);
            throw error;
        }

        categories = data || [];
        return categories;
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
    }

    return {
        getCategories,
        getTopLevelCategories,
        getSubcategories,
        clearCache
    };
})();