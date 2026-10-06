const ClosetCategoryAttributes = (() => {
    const schemas = {
        clothing: [
            ["brand", "Brand", "text"],
            ["size", "Size", "text"],
            ["color", "Color", "text"],
            ["material", "Material", "text"],
            ["fit", "Fit", "text"]
        ],
        electronics: [
            ["brand", "Brand", "text"],
            ["model", "Model", "text"],
            ["storage", "Storage", "text"],
            ["ram", "RAM", "text"],
            ["color", "Color", "text"]
        ],
        vehicles: [
            ["make", "Make", "text"],
            ["model", "Model", "text"],
            ["year", "Year", "number"],
            ["mileage", "Mileage", "number"],
            ["fuel", "Fuel type", "text"],
            ["transmission", "Transmission", "text"]
        ],
        home: [
            ["type", "Type", "text"],
            ["brand", "Brand", "text"],
            ["material", "Material", "text"],
            ["color", "Color", "text"]
        ],
        furniture: [
            ["type", "Type", "text"],
            ["material", "Material", "text"],
            ["color", "Color", "text"],
            ["seats", "Seats", "number"],
            ["dimensions", "Dimensions", "text"]
        ],
        kids: [
            ["type", "Type", "text"],
            ["age", "Age", "text"],
            ["brand", "Brand", "text"],
            ["size", "Size", "text"]
        ],
        games: [
            ["platform", "Platform", "text"],
            ["title", "Game title", "text"],
            ["edition", "Edition", "text"]
        ],
        sports: [
            ["type", "Type", "text"],
            ["brand", "Brand", "text"],
            ["size", "Size", "text"],
            ["material", "Material", "text"]
        ],
        books: [
            ["author", "Author", "text"],
            ["language", "Language", "text"],
            ["genre", "Genre", "text"],
            ["isbn", "ISBN", "text"]
        ],
        tools: [
            ["type", "Type", "text"],
            ["brand", "Brand", "text"],
            ["power", "Power", "text"],
            ["voltage", "Voltage", "text"]
        ],
        beauty: [
            ["type", "Type", "text"],
            ["brand", "Brand", "text"],
            ["volume", "Volume", "text"],
            ["shade", "Shade", "text"]
        ],
        pets: [
            ["animal_type", "Animal", "text"],
            ["breed", "Breed", "text"],
            ["age", "Age", "text"],
            ["gender", "Gender", "text"]
        ],
        jewelry: [
            ["type", "Type", "text"],
            ["material", "Material", "text"],
            ["size", "Size", "text"],
            ["brand", "Brand", "text"]
        ],
        bikes: [
            ["type", "Type", "text"],
            ["brand", "Brand", "text"],
            ["wheel_size", "Wheel size", "text"],
            ["frame_size", "Frame size", "text"]
        ],
        cameras: [
            ["type", "Type", "text"],
            ["brand", "Brand", "text"],
            ["model", "Model", "text"],
            ["lens_mount", "Lens mount", "text"],
            ["megapixels", "Megapixels", "text"]
        ],
        music: [
            ["instrument", "Instrument", "text"],
            ["brand", "Brand", "text"],
            ["model", "Model", "text"],
            ["material", "Material", "text"]
        ],
        other: [
            ["brand", "Brand", "text"],
            ["color", "Color", "text"],
            ["material", "Material", "text"]
        ]
    };

    const translations = {
        ro: {
            "Item details": "Detalii produs",
            "Brand": "Marcă",
            "Size": "Mărime",
            "Color": "Culoare",
            "Material": "Material",
            "Fit": "Croială",
            "Model": "Model",
            "Storage": "Stocare",
            "RAM": "RAM",
            "Make": "Producător",
            "Year": "An",
            "Mileage": "Kilometraj",
            "Fuel type": "Tip combustibil",
            "Transmission": "Transmisie",
            "Type": "Tip",
            "Seats": "Locuri",
            "Dimensions": "Dimensiuni",
            "Age": "Vârstă",
            "Platform": "Platformă",
            "Game title": "Titlu joc",
            "Edition": "Ediție",
            "Author": "Autor",
            "Language": "Limbă",
            "Genre": "Gen",
            "ISBN": "ISBN",
            "Power": "Putere",
            "Voltage": "Tensiune",
            "Volume": "Volum",
            "Shade": "Nuanță",
            "Animal": "Animal",
            "Breed": "Rasă",
            "Gender": "Sex",
            "Wheel size": "Dimensiunea roții",
            "Frame size": "Dimensiunea cadrului",
            "Lens mount": "Montură obiectiv",
            "Megapixels": "Megapixeli",
            "Instrument": "Instrument",
            "Details": "Detalii"
        },
        ru: {
            "Item details": "Детали товара",
            "Brand": "Бренд",
            "Size": "Размер",
            "Color": "Цвет",
            "Material": "Материал",
            "Fit": "Посадка",
            "Model": "Модель",
            "Storage": "Память",
            "RAM": "ОЗУ",
            "Make": "Производитель",
            "Year": "Год",
            "Mileage": "Пробег",
            "Fuel type": "Тип топлива",
            "Transmission": "Коробка передач",
            "Type": "Тип",
            "Seats": "Мест",
            "Dimensions": "Размеры",
            "Age": "Возраст",
            "Platform": "Платформа",
            "Game title": "Название игры",
            "Edition": "Издание",
            "Author": "Автор",
            "Language": "Язык",
            "Genre": "Жанр",
            "ISBN": "ISBN",
            "Power": "Мощность",
            "Voltage": "Напряжение",
            "Volume": "Объём",
            "Shade": "Оттенок",
            "Animal": "Животное",
            "Breed": "Порода",
            "Gender": "Пол",
            "Wheel size": "Размер колеса",
            "Frame size": "Размер рамы",
            "Lens mount": "Крепление объектива",
            "Megapixels": "Мегапиксели",
            "Instrument": "Инструмент",
            "Details": "Детали"
        }
    };

    function getSlug(category) {
        const raw = String(category?.slug || category?.name || "").toLowerCase().trim();
        return raw
            .replace(/&/g, "and")
            .replace(/[’']/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
    }

    function resolveSchema(category) {
        const slug = getSlug(category);
        const aliases = {
            "clothing-fashion": "clothing",
            "clothing": "clothing",
            "electronics": "electronics",
            "vehicles": "vehicles",
            "home-garden": "home",
            "furniture": "furniture",
            "kids-baby": "kids",
            "games-entertainment": "games",
            "sports-hobbies": "sports",
            "books-education": "books",
            "tools-equipment": "tools",
            "beauty-personal-care": "beauty",
            "pets-animals": "pets",
            "jewelry-accessories": "jewelry",
            "bikes-scooters": "bikes",
            "cameras-photography": "cameras",
            "music-instruments": "music",
            "other": "other"
        };
        return schemas[aliases[slug] || slug] || schemas.other;
    }

    function translate(key) {
        const lang = typeof ClosetI18n !== "undefined" ? ClosetI18n.getLanguage() : "en";
        return translations[lang]?.[key] || key;
    }

    function getContainer() {
        return document.getElementById("categoryAttributesSection");
    }

    function escape(value) {
        const div = document.createElement("div");
        div.textContent = String(value ?? "");
        return div.innerHTML;
    }

    function render(category, existing = {}) {
        const section = getContainer();
        if (!section) return;

        const schema = resolveSchema(category);
        const values = existing && typeof existing === "object" ? existing : {};

        section.innerHTML = "";
        const heading = document.createElement("h3");
        heading.textContent = translate("Item details");
        section.appendChild(heading);

        const grid = document.createElement("div");
        grid.className = "category-attributes-grid";

        schema.forEach(([key, label, type]) => {
            const field = document.createElement("div");
            field.className = "form-group category-attribute-field";

            const labelElement = document.createElement("label");
            labelElement.htmlFor = "itemAttribute_" + key;
            labelElement.textContent = translate(label);

            const input = document.createElement("input");
            input.id = "itemAttribute_" + key;
            input.name = "attribute_" + key;
            input.type = type;
            input.value = values[key] ?? "";
            input.dataset.attributeKey = key;
            input.autocomplete = "off";
            input.addEventListener("input", () => {
                document.dispatchEvent(new CustomEvent("closet:listing-attribute-changed"));
            });

            field.append(labelElement, input);
            grid.appendChild(field);
        });

        section.appendChild(grid);
        section.hidden = false;
    }

    function clear() {
        const section = getContainer();
        if (!section) return;
        section.hidden = true;
        section.innerHTML = "";
    }

    function getValues() {
        const section = getContainer();
        if (!section || section.hidden) return {};

        const values = {};
        section.querySelectorAll("[data-attribute-key]").forEach(input => {
            const value = String(input.value || "").trim();
            if (value) values[input.dataset.attributeKey] = value;
        });
        return values;
    }

    function getCategoryForCurrentSelection() {
        if (typeof ClosetCategoryPicker === "undefined") return null;
        return ClosetCategoryPicker.getSelection()?.category || null;
    }

    function refresh(existing = {}) {
        const category = getCategoryForCurrentSelection();
        if (!category) {
            clear();
            return;
        }
        render(category, existing);
    }

    return { render, clear, getValues, refresh, resolveSchema };
})();
