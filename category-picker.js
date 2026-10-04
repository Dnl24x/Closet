const ClosetCategoryPicker = (() => {
    let allCategories = [];
    let topLevelCategories = [];
    let selectedCategory = null;
    let selectedSubcategory = null;

    const elements = {};

    function cacheElements() {
        elements.categoryPicker = document.getElementById("categoryPicker");
        elements.categoryTrigger = document.getElementById("categoryPickerTrigger");
        elements.categoryPanel = document.getElementById("categoryPickerPanel");
        elements.categoryValue = document.getElementById("categoryPickerValue");
        elements.categorySearch = document.getElementById("categorySearch");
        elements.categoryResults = document.getElementById("categoryResults");
        elements.categoryInput = document.getElementById("itemCategory");

        elements.subcategoryField = document.getElementById("subcategoryField");
        elements.subcategoryPicker = document.getElementById("subcategoryPicker");
        elements.subcategoryTrigger = document.getElementById("subcategoryPickerTrigger");
        elements.subcategoryPanel = document.getElementById("subcategoryPickerPanel");
        elements.subcategoryValue = document.getElementById("subcategoryPickerValue");
        elements.subcategorySearch = document.getElementById("subcategorySearch");
        elements.subcategoryResults = document.getElementById("subcategoryResults");
        elements.subcategoryInput = document.getElementById("itemSubcategory");
    }

    function escapeText(value) {
        return String(value || "");
    }

    function getSubcategories(parentId) {
        return allCategories.filter(
            (category) => category.parent_id === parentId
        );
    }

    function getCategoryPath(category) {
        if (!category.parent_id) {
            return category.name;
        }

        const parent = allCategories.find(
            (item) => item.id === category.parent_id
        );

        return parent
            ? `${parent.name} → ${category.name}`
            : category.name;
    }

    function openPanel(panel, trigger) {
        if (!panel || !trigger) return;

        panel.hidden = false;
        trigger.setAttribute("aria-expanded", "true");
    }

    function closePanel(panel, trigger) {
        if (!panel || !trigger) return;

        panel.hidden = true;
        trigger.setAttribute("aria-expanded", "false");
    }

    function renderCategoryResults(searchTerm = "") {
        if (!elements.categoryResults) return;

        const query = searchTerm.trim().toLowerCase();

        let results = [];

        if (!query) {
            results = topLevelCategories.map((category) => ({
                category,
                subcategory: null
            }));
        } else {
            results = allCategories
                .filter((category) =>
                    category.name.toLowerCase().includes(query)
                )
                .map((category) => {
                    if (!category.parent_id) {
                        return {
                            category,
                            subcategory: null
                        };
                    }

                    const parent = allCategories.find(
                        (item) => item.id === category.parent_id
                    );

                    return {
                        category: parent || category,
                        subcategory: parent ? category : null
                    };
                });
        }

        const uniqueResults = [];
        const seen = new Set();

        results.forEach((result) => {
            const key = result.subcategory
                ? `subcategory-${result.subcategory.id}`
                : `category-${result.category.id}`;

            if (!seen.has(key)) {
                seen.add(key);
                uniqueResults.push(result);
            }
        });

        if (!uniqueResults.length) {
            elements.categoryResults.innerHTML = `
                <div class="category-empty">
                    No categories found.
                </div>
            `;
            return;
        }

        elements.categoryResults.innerHTML = uniqueResults
            .map(({ category, subcategory }) => {
                if (subcategory) {
                    return `
                        <button
                            class="category-result category-result-subcategory"
                            type="button"
                            data-category-id="${category.id}"
                            data-subcategory-id="${subcategory.id}"
                        >
                            <span class="category-result-main">
                                ${escapeText(category.name)}
                            </span>
                            <span class="category-result-sub">
                                → ${escapeText(subcategory.name)}
                            </span>
                        </button>
                    `;
                }

                return `
                    <button
                        class="category-result"
                        type="button"
                        data-category-id="${category.id}"
                    >
                        <span class="category-result-main">
                            ${escapeText(category.name)}
                        </span>
                    </button>
                `;
            })
            .join("");
    }

    function renderSubcategoryResults(searchTerm = "") {
        if (!elements.subcategoryResults || !selectedCategory) return;

        const query = searchTerm.trim().toLowerCase();

        let results = getSubcategories(selectedCategory.id);

        if (query) {
            results = results.filter((subcategory) =>
                subcategory.name.toLowerCase().includes(query)
            );
        }

        if (!results.length) {
            elements.subcategoryResults.innerHTML = `
                <div class="category-empty">
                    No subcategories found.
                </div>
            `;
            return;
        }

        elements.subcategoryResults.innerHTML = results
            .map(
                (subcategory) => `
                    <button
                        class="category-result"
                        type="button"
                        data-subcategory-id="${subcategory.id}"
                    >
                        <span class="category-result-main">
                            ${escapeText(subcategory.name)}
                        </span>
                    </button>
                `
            )
            .join("");
    }

    function selectCategory(category) {
        selectedCategory = category;
        selectedSubcategory = null;

        elements.categoryValue.textContent = category.name;
        elements.categoryInput.value = category.id;

        elements.subcategoryInput.value = "";
        elements.subcategoryValue.textContent = "Choose a subcategory";

        elements.subcategorySearch.value = "";

        closePanel(
            elements.categoryPanel,
            elements.categoryTrigger
        );

        const subcategories = getSubcategories(category.id);

        if (subcategories.length) {
            elements.subcategoryField.hidden = false;
            renderSubcategoryResults();
        } else {
            elements.subcategoryField.hidden = true;
        }

        window.dispatchEvent(
            new CustomEvent("closet:category-selected", {
                detail: {
                    category,
                    subcategories
                }
            })
        );
    }

    function selectSubcategory(subcategory) {
        selectedSubcategory = subcategory;

        elements.subcategoryValue.textContent = subcategory.name;
        elements.subcategoryInput.value = subcategory.id;

        closePanel(
            elements.subcategoryPanel,
            elements.subcategoryTrigger
        );

        window.dispatchEvent(
            new CustomEvent("closet:subcategory-selected", {
                detail: {
                    category: selectedCategory,
                    subcategory
                }
            })
        );
    }

    function setupEvents() {
        elements.categoryTrigger?.addEventListener("click", () => {
            const isOpen = !elements.categoryPanel.hidden;

            if (isOpen) {
                closePanel(
                    elements.categoryPanel,
                    elements.categoryTrigger
                );
            } else {
                renderCategoryResults(elements.categorySearch.value);
                openPanel(
                    elements.categoryPanel,
                    elements.categoryTrigger
                );
                elements.categorySearch.focus();
            }
        });

        elements.subcategoryTrigger?.addEventListener("click", () => {
            const isOpen = !elements.subcategoryPanel.hidden;

            if (isOpen) {
                closePanel(
                    elements.subcategoryPanel,
                    elements.subcategoryTrigger
                );
            } else {
                renderSubcategoryResults(
                    elements.subcategorySearch.value
                );

                openPanel(
                    elements.subcategoryPanel,
                    elements.subcategoryTrigger
                );

                elements.subcategorySearch.focus();
            }
        });

        elements.categorySearch?.addEventListener("input", (event) => {
            renderCategoryResults(event.target.value);
        });

        elements.subcategorySearch?.addEventListener("input", (event) => {
            renderSubcategoryResults(event.target.value);
        });

        elements.categoryResults?.addEventListener("click", (event) => {
            const result = event.target.closest(".category-result");
            if (!result) return;

            const categoryId = result.dataset.categoryId;
            const subcategoryId = result.dataset.subcategoryId;

            const category = allCategories.find(
                (item) => item.id === categoryId
            );

            if (!category) return;

            selectCategory(category);

            if (subcategoryId) {
                const subcategory = allCategories.find(
                    (item) => item.id === subcategoryId
                );

                if (subcategory) {
                    selectSubcategory(subcategory);
                }
            }
        });

        elements.subcategoryResults?.addEventListener(
            "click",
            (event) => {
                const result = event.target.closest(".category-result");
                if (!result) return;

                const subcategory = allCategories.find(
                    (item) => item.id === result.dataset.subcategoryId
                );

                if (subcategory) {
                    selectSubcategory(subcategory);
                }
            }
        );

        document.addEventListener("click", (event) => {
            if (
                elements.categoryPicker &&
                !elements.categoryPicker.contains(event.target)
            ) {
                closePanel(
                    elements.categoryPanel,
                    elements.categoryTrigger
                );
            }

            if (
                elements.subcategoryPicker &&
                !elements.subcategoryPicker.contains(event.target)
            ) {
                closePanel(
                    elements.subcategoryPanel,
                    elements.subcategoryTrigger
                );
            }
        });
    }

    async function initialize() {
        cacheElements();

        if (
            !elements.categoryPicker ||
            typeof ClosetCategories === "undefined"
        ) {
            return;
        }

        try {
            allCategories = await ClosetCategories.getFreshCategories();

            topLevelCategories = allCategories.filter(
                (category) => category.parent_id === null
            );

            renderCategoryResults();
            setupEvents();
        } catch (error) {
            console.error(
                "CLOSET category picker error:",
                error
            );

            if (elements.categoryResults) {
                elements.categoryResults.innerHTML = `
                    <div class="category-empty">
                        Categories couldn't be loaded. Please try again.
                    </div>
                `;
            }
        }
    }

    async function refresh() {
        if (typeof ClosetCategories === "undefined") return;

        const previousCategoryName = selectedCategory?.name || "";
        const previousSubcategoryName = selectedSubcategory?.name || "";

        allCategories = await ClosetCategories.getFreshCategories();
        topLevelCategories = allCategories.filter(
            (category) => category.parent_id === null
        );

        // If the database IDs were regenerated, recover the user's selection
        // by its stable category name instead of submitting a dead UUID.
        if (previousCategoryName) {
            const freshCategory = allCategories.find(
                category => !category.parent_id && category.name === previousCategoryName
            );

            if (freshCategory) {
                selectedCategory = freshCategory;
                if (elements.categoryInput) elements.categoryInput.value = freshCategory.id;
                if (elements.categoryValue) elements.categoryValue.textContent = freshCategory.name;

                const freshSubcategory = previousSubcategoryName
                    ? allCategories.find(
                        category =>
                            category.parent_id === freshCategory.id &&
                            category.name === previousSubcategoryName
                    )
                    : null;

                selectedSubcategory = freshSubcategory || null;
                if (elements.subcategoryInput) elements.subcategoryInput.value = freshSubcategory?.id || "";
                if (elements.subcategoryValue) {
                    elements.subcategoryValue.textContent = freshSubcategory?.name || "Choose a subcategory";
                }
                if (elements.subcategoryField) {
                    elements.subcategoryField.hidden = !getSubcategories(freshCategory.id).length;
                }
            }
        }

        renderCategoryResults(elements.categorySearch?.value || "");
    }

    function getSelection() {
        return {
            category: selectedCategory,
            subcategory: selectedSubcategory
        };
    }

    return {
        initialize,
        refresh,
        getSelection
    };
})();

document.addEventListener("DOMContentLoaded", () => {
    ClosetCategoryPicker.initialize();
});