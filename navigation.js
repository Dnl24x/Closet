const ClosetNavigation = (() => {
    const views = new Map();
    let currentView = null;

    function registerViews() {
        views.clear();

        document
            .querySelectorAll("[data-view-section]")
            .forEach((element) => {
                const name = element.dataset.viewSection;

                if (name) {
                    views.set(name, element);
                }
            });
    }

    function updateNavigation(name) {
        document
            .querySelectorAll("[data-view]")
            .forEach((button) => {
                button.classList.toggle(
                    "active",
                    button.dataset.view === name
                );
            });
    }

    function hideAll() {
        views.forEach((element) => {
            element.hidden = true;
        });
    }

    function show(name, options = {}) {
        const target = views.get(name);

        if (!target) {
            console.error(
                `CLOSET: View "${name}" was not found.`
            );

            return false;
        }

        const previousView = currentView;

        hideAll();

        target.hidden = false;
        currentView = name;

        updateNavigation(name);

        if (options.scroll !== false) {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }

        window.dispatchEvent(
            new CustomEvent("closet:navigate", {
                detail: {
                    view: name,
                    previousView
                }
            })
        );

        return true;
    }

    function getCurrentView() {
        return currentView;
    }

    function setupNavigation() {
        document.addEventListener("click", (event) => {
            const button =
                event.target.closest("[data-view]");

            if (!button) {
                return;
            }

            event.preventDefault();

            const view = button.dataset.view;

            if (view) {
                show(view);
            }
        });
    }

    function initialize(defaultView = "home") {
        registerViews();
        setupNavigation();

        if (views.has(defaultView)) {
            show(defaultView, {
                scroll: false
            });
        }
    }

    return {
        initialize,
        registerViews,
        show,
        getCurrentView
    };
})();


