(() => {
    const STORAGE_KEY = "closet-language";
    const SUPPORTED = ["en", "ro", "ru"];
    const BRAND = { en: "A doua șansă", ro: "A doua șansă", ru: "A doua șansă" };

    const translations = {
        en: {
            "Home":"Home","Browse":"Browse","About":"About","Profile":"Profile","Sell an item":"Sell an item",
            "Search the marketplace...":"Search the marketplace...","Search":"Search","Categories":"Categories",
            "Give your life a second life.":"Give your life a second life.","Save the planet. Earn.":"Save the planet. Earn.",
            "A simpler way to keep useful things moving. Find something nearby, give unused items a new home, and make a little money while you're at it.":"A simpler way to keep useful things moving. Find something nearby, give unused items a new home, and make a little money while you're at it.",
            "EXPLORE":"EXPLORE","Categories.":"Categories.","View all →":"View all →","JUST LISTED":"JUST LISTED","Latest items.":"Latest items.","Browse everything →":"Browse everything →",
            "Loading categories...":"Loading categories...","Loading listings...":"Loading listings...",
            "EXPLORE CLOSET":"EXPLORE CLOSET","Find something worth keeping.":"Find something worth keeping.","Search local listings from people across Moldova.":"Search local listings from people across Moldova.",
            "Search anything...":"Search anything...","Filters":"Filters","Filter listings":"Filter listings","Refine your search without changing the search bar.":"Refine your search without changing the search bar.","Clear all":"Clear all",
            "Category":"Category","All locations":"All locations","Any condition":"Any condition","New":"New","Like new":"Like new","Good":"Good","Fair":"Fair","For parts":"For parts",
            "Price: low to high":"Price: low to high","Price: high to low":"Price: high to low","Newest":"Newest","Oldest":"Oldest",
            "SELL ON CLOSET":"SELL ON CLOSET","Give your things a new home.":"Give your things a new home.","Add the details of your item, upload your photos and publish your listing for buyers across Moldova.":"Add the details of your item, upload your photos and publish your listing for buyers across Moldova.",
            "Your listing":"Your listing","Your item will appear in Browse once published. You can manage it later from your profile.":"Your item will appear in Browse once published. You can manage it later from your profile.",
            "Title":"Title","Price":"Price","Choose a category":"Choose a category","Search categories...":"Search categories...","Choose a subcategory":"Choose a subcategory","Search subcategories...":"Search subcategories...",
            "Choose condition":"Choose condition","Location":"Location","Description":"Description","Photos":"Photos","Add photos":"Add photos","Choose files or drag them here":"Choose files or drag them here","Up to 20 photos · JPG, PNG or WebP":"Up to 20 photos · JPG, PNG or WebP","Publish listing":"Publish listing",
            "Back":"Back","Loading listing…":"Loading listing…","Please wait while we load the item.":"Please wait while we load the item.",
            "Listing unavailable":"Listing unavailable","Profile":"Profile","Your profile":"Your profile","Edit profile":"Edit profile","Settings":"Settings","Sign out":"Sign out",
            "A doua șansă PROFILE":"A doua șansă PROFILE","YOUR CLOSET":"YOUR CLOSET","My listings":"My listings","Sell an item →":"Sell an item →",
            "ACCOUNT":"ACCOUNT","Settings.":"Settings.","Manage your CLOSET account and preferences.":"Manage your CLOSET account and preferences.","Account email":"Account email","Loading...":"Loading...",
            "Buying Protection":"Buying Protection","A future CLOSET feature. We'll announce when it becomes available.":"A future CLOSET feature. We'll announce when it becomes available.","Coming soon":"Coming soon","Sign out of this CLOSET account on this device.":"Sign out of this CLOSET account on this device.",
            "WElCOME BACK":"WELCOME BACK","WELCOME BACK":"WELCOME BACK","Sign in to":"Sign in to","Sign in":"Sign in","Create an account":"Create an account","Don't have an account?":"Don't have an account?",
            "Email":"Email","Email address":"Email address","Password":"Password","Enter your password":"Enter your password","Your password":"Your password","One more":"One more","step.":"step.","CHECK YOUR EMAIL":"CHECK YOUR EMAIL",
            "We've sent a verification link to your email address. Open it and verify your account before signing in.":"We've sent a verification link to your email address. Open it and verify your account before signing in.",
            "JOIN CLOSET":"JOIN CLOSET","Create your account.":"Create your account.","Create an account to buy and sell things across Moldova.":"Create an account to buy and sell things across Moldova.",
            "Your name":"Your name","Create a password":"Create a password","Confirm password":"Confirm password","Repeat your password":"Repeat your password","Already have an account?":"Already have an account?",
            "ABOUT CLOSET":"ABOUT CLOSET","Everything deserves another story.":"Everything deserves another story.","A doua șansă is a Moldova-focused marketplace for buying, selling and discovering useful things locally.":"A doua șansă is a Moldova-focused marketplace for buying, selling and discovering useful things locally.",
            "Built for second lives.":"Built for second lives.","A doua șansă keeps useful things moving instead of letting them sit unused.":"A doua șansă keeps useful things moving instead of letting them sit unused.",
            "Built for Moldova.":"Built for Moldova.","The marketplace is designed around people buying and selling locally across Moldova.":"The marketplace is designed around people buying and selling locally across Moldova.",
            "Built to grow.":"Built to grow.","Profiles, listings, reviews and future marketplace features can all grow with CLOSET.":"Profiles, listings, reviews and future marketplace features can all grow with CLOSET.",
            "Moldova marketplace":"Moldova marketplace","© 2026 CLOSET · Moldova":"© 2026 CLOSET · Moldova",
            "Pick any language you want.":"Pick any language you want.","Always can be changed in settings.":"Always can be changed in settings.",
            "Language":"Language","Choose the language used across the website.":"Choose the language used across the website.","English":"English","Romanian":"Romanian","Russian":"Russian","Save language":"Save language",
            "Electronics & Phones":"Electronics & Phones","Computers & PC Hardware":"Computers & PC Hardware","Cars & Auto Parts":"Cars & Auto Parts","Home & Garden":"Home & Garden","Clothing & Shoes":"Clothing & Shoes","Gaming":"Gaming","Books & Education":"Books & Education","Tools & Equipment":"Tools & Equipment","Kids & Baby":"Kids & Baby","Pets & Pet Supplies":"Pets & Pet Supplies","Music & Instruments":"Music & Instruments","Sports & Outdoors":"Sports & Outdoors","Collectibles & Vintage":"Collectibles & Vintage","Jewelry & Accessories":"Jewelry & Accessories","Property":"Property","Jobs & Services":"Jobs & Services","Other":"Other"
        },
        ro: {
            "Home":"Acasă","Browse":"Explorează","About":"Despre","Profile":"Profil","Sell an item":"Vinde un articol",
            "Search the marketplace...":"Caută în marketplace...","Search":"Caută","Categories":"Categorii",
            "Give your life a second life.":"Dă-le lucrurilor tale o a doua șansă.","Save the planet. Earn.":"Protejează planeta. Câștigă.",
            "A simpler way to keep useful things moving. Find something nearby, give unused items a new home, and make a little money while you're at it.":"O modalitate simplă de a păstra lucrurile utile în circulație. Găsește ceva în apropiere, oferă lucrurilor nefolosite o casă nouă și câștigă niște bani.",
            "EXPLORE":"EXPLOREAZĂ","Categories.":"Categorii.","View all →":"Vezi toate →","JUST LISTED":"RECENT ADĂUGATE","Latest items.":"Ultimele articole.","Browse everything →":"Explorează tot →",
            "Loading categories...":"Se încarcă categoriile...","Loading listings...":"Se încarcă anunțurile...",
            "EXPLORE CLOSET":"EXPLOREAZĂ","Find something worth keeping.":"Găsește ceva care merită păstrat.","Search local listings from people across Moldova.":"Caută anunțuri locale de la oameni din toată Moldova.",
            "Search anything...":"Caută orice...","Filters":"Filtre","Filter listings":"Filtrează anunțurile","Refine your search without changing the search bar.":"Rafinează căutarea fără să schimbi bara de căutare.","Clear all":"Șterge tot",
            "Category":"Categorie","All locations":"Toate locațiile","Any condition":"Orice stare","New":"Nou","Like new":"Ca nou","Good":"Bun","Fair":"Acceptabil","For parts":"Pentru piese",
            "Price: low to high":"Preț: crescător","Price: high to low":"Preț: descrescător","Newest":"Cele mai noi","Oldest":"Cele mai vechi",
            "SELL ON CLOSET":"VINDE PE CLOSET","Give your things a new home.":"Oferă lucrurilor tale o casă nouă.","Add the details of your item, upload your photos and publish your listing for buyers across Moldova.":"Adaugă detaliile articolului, încarcă fotografiile și publică anunțul pentru cumpărători din toată Moldova.",
            "Your listing":"Anunțul tău","Your item will appear in Browse once published. You can manage it later from your profile.":"Articolul tău va apărea în Explorează după publicare. Îl vei putea gestiona ulterior din profil.",
            "Title":"Titlu","Price":"Preț","Choose a category":"Alege o categorie","Search categories...":"Caută categorii...","Choose a subcategory":"Alege o subcategorie","Search subcategories...":"Caută subcategorii...",
            "Choose condition":"Alege starea","Location":"Locație","Description":"Descriere","Photos":"Fotografii","Add photos":"Adaugă fotografii","Choose files or drag them here":"Alege fișiere sau trage-le aici","Up to 20 photos · JPG, PNG or WebP":"Până la 20 de fotografii · JPG, PNG sau WebP","Publish listing":"Publică anunțul",
            "Back":"Înapoi","Loading listing…":"Se încarcă anunțul…","Please wait while we load the item.":"Așteaptă cât încărcăm articolul.",
            "Listing unavailable":"Anunț indisponibil","Your profile":"Profilul tău","Edit profile":"Editează profilul","Settings":"Setări","Sign out":"Deconectare",
            "A doua șansă PROFILE":"PROFIL","YOUR CLOSET":"ANUNȚURILE TALE","My listings":"Anunțurile mele","Sell an item →":"Vinde un articol →",
            "ACCOUNT":"CONT","Settings.":"Setări.","Manage your CLOSET account and preferences.":"Gestionează-ți contul și preferințele.","Account email":"Emailul contului","Loading...":"Se încarcă...",
            "Buying Protection":"Protecția cumpărătorului","A future CLOSET feature. We'll announce when it becomes available.":"O funcție CLOSET viitoare. Te vom anunța când va fi disponibilă.","Coming soon":"În curând","Sign out of this CLOSET account on this device.":"Deconectează acest cont CLOSET de pe acest dispozitiv.",
            "WELCOME BACK":"BINE AI REVENIT","Sign in to":"Conectează-te la","Sign in":"Conectare","Create an account":"Creează un cont","Don't have an account?":"Nu ai un cont?",
            "Email":"Email","Email address":"Adresă de email","Password":"Parolă","Enter your password":"Introdu parola","Your password":"Parola ta","One more":"Încă un","step.":"pas.","CHECK YOUR EMAIL":"VERIFICĂ EMAILUL",
            "We've sent a verification link to your email address. Open it and verify your account before signing in.":"Ți-am trimis un link de verificare. Deschide-l și verifică-ți contul înainte de conectare.",
            "JOIN CLOSET":"ALĂTURĂ-TE","Create your account.":"Creează-ți contul.","Create an account to buy and sell things across Moldova.":"Creează un cont pentru a cumpăra și vinde lucruri în Moldova.",
            "Your name":"Numele tău","Create a password":"Creează o parolă","Confirm password":"Confirmă parola","Repeat your password":"Repetă parola","Already have an account?":"Ai deja un cont?",
            "ABOUT CLOSET":"DESPRE CLOSET","Everything deserves another story.":"Totul merită o nouă poveste.","A doua șansă is a Moldova-focused marketplace for buying, selling and discovering useful things locally.":"Un marketplace din Moldova pentru a cumpăra, vinde și descoperi lucruri utile, local.",
            "Built for second lives.":"Creat pentru a doua șansă.","A doua șansă keeps useful things moving instead of letting them sit unused.":"Păstrăm lucrurile utile în circulație, în loc să rămână nefolosite.",
            "Built for Moldova.":"Creat pentru Moldova.","The marketplace is designed around people buying and selling locally across Moldova.":"Marketplace-ul este creat pentru oameni care cumpără și vând local în Moldova.",
            "Built to grow.":"Creat pentru a crește.","Profiles, listings, reviews and future marketplace features can all grow with CLOSET.":"Profilurile, anunțurile, recenziile și funcțiile viitoare pot crește împreună cu marketplace-ul.",
            "Moldova marketplace":"Marketplace din Moldova","© 2026 CLOSET · Moldova":"© 2026 A doua șansă · Moldova",
            "Pick any language you want.":"Alege orice limbă dorești.","Always can be changed in settings.":"Poate fi schimbată oricând din setări.",
            "Language":"Limbă","Choose the language used across the website.":"Alege limba folosită pe întregul site.","English":"Engleză","Romanian":"Română","Russian":"Rusă","Save language":"Salvează limba",
            "Electronics & Phones":"Electronice și telefoane","Computers & PC Hardware":"Calculatoare și componente","Cars & Auto Parts":"Mașini și piese auto","Home & Garden":"Casă și grădină","Clothing & Shoes":"Îmbrăcăminte și încălțăminte","Gaming":"Jocuri","Books & Education":"Cărți și educație","Tools & Equipment":"Unelte și echipamente","Kids & Baby":"Copii și bebeluși","Pets & Pet Supplies":"Animale și accesorii","Music & Instruments":"Muzică și instrumente","Sports & Outdoors":"Sport și activități în aer liber","Collectibles & Vintage":"Colecționabile și vintage","Jewelry & Accessories":"Bijuterii și accesorii","Property":"Imobiliare","Jobs & Services":"Locuri de muncă și servicii","Other":"Altele"
        },
        ru: {
            "Home":"Главная","Browse":"Обзор","About":"О нас","Profile":"Профиль","Sell an item":"Продать товар",
            "Search the marketplace...":"Поиск по маркетплейсу...","Search":"Поиск","Categories":"Категории",
            "Give your life a second life.":"Дай вещам вторую жизнь.","Save the planet. Earn.":"Береги планету. Зарабатывай.",
            "A simpler way to keep useful things moving. Find something nearby, give unused items a new home, and make a little money while you're at it.":"Простой способ дать полезным вещам новую жизнь. Найди что-нибудь рядом, передай ненужные вещи новому владельцу и заработай.",
            "EXPLORE":"ИССЛЕДУЙ","Categories.":"Категории.","View all →":"Смотреть все →","JUST LISTED":"ТОЛЬКО ЧТО ДОБАВЛЕНО","Latest items.":"Последние товары.","Browse everything →":"Смотреть всё →",
            "Loading categories...":"Загрузка категорий...","Loading listings...":"Загрузка объявлений...",
            "EXPLORE CLOSET":"ИССЛЕДУЙ","Find something worth keeping.":"Найди то, что стоит сохранить.","Search local listings from people across Moldova.":"Ищи местные объявления от людей по всей Молдове.",
            "Search anything...":"Ищи что угодно...","Filters":"Фильтры","Filter listings":"Фильтры объявлений","Refine your search without changing the search bar.":"Уточни поиск, не меняя поисковую строку.","Clear all":"Сбросить всё",
            "Category":"Категория","All locations":"Все места","Any condition":"Любое состояние","New":"Новое","Like new":"Как новое","Good":"Хорошее","Fair":"Удовлетворительное","For parts":"На запчасти",
            "Price: low to high":"Цена: по возрастанию","Price: high to low":"Цена: по убыванию","Newest":"Сначала новые","Oldest":"Сначала старые",
            "SELL ON CLOSET":"ПРОДАЖА","Give your things a new home.":"Дай своим вещам новый дом.","Add the details of your item, upload your photos and publish your listing for buyers across Moldova.":"Добавь информацию о товаре, загрузи фотографии и опубликуй объявление для покупателей по всей Молдове.",
            "Your listing":"Твоё объявление","Your item will appear in Browse once published. You can manage it later from your profile.":"Товар появится в разделе «Обзор» после публикации. Позже ты сможешь управлять им из профиля.",
            "Title":"Название","Price":"Цена","Choose a category":"Выбери категорию","Search categories...":"Поиск категорий...","Choose a subcategory":"Выбери подкатегорию","Search subcategories...":"Поиск подкатегорий...",
            "Choose condition":"Выбери состояние","Location":"Местоположение","Description":"Описание","Photos":"Фотографии","Add photos":"Добавить фото","Choose files or drag them here":"Выбери файлы или перетащи их сюда","Up to 20 photos · JPG, PNG or WebP":"До 20 фото · JPG, PNG или WebP","Publish listing":"Опубликовать объявление",
            "Back":"Назад","Loading listing…":"Загрузка объявления…","Please wait while we load the item.":"Подожди, пока мы загрузим товар.",
            "Listing unavailable":"Объявление недоступно","Your profile":"Твой профиль","Edit profile":"Изменить профиль","Settings":"Настройки","Sign out":"Выйти",
            "A doua șansă PROFILE":"ПРОФИЛЬ","YOUR CLOSET":"ТВОИ ОБЪЯВЛЕНИЯ","My listings":"Мои объявления","Sell an item →":"Продать товар →",
            "ACCOUNT":"АККАУНТ","Settings.":"Настройки.","Manage your CLOSET account and preferences.":"Управляй аккаунтом и настройками.","Account email":"Email аккаунта","Loading...":"Загрузка...",
            "Buying Protection":"Защита покупателя","A future CLOSET feature. We'll announce when it becomes available.":"Будущая функция CLOSET. Мы сообщим, когда она станет доступна.","Coming soon":"Скоро","Sign out of this CLOSET account on this device.":"Выйти из этого аккаунта CLOSET на этом устройстве.",
            "WELCOME BACK":"С ВОЗВРАЩЕНИЕМ","Sign in to":"Войди в","Sign in":"Войти","Create an account":"Создать аккаунт","Don't have an account?":"Нет аккаунта?",
            "Email":"Email","Email address":"Адрес электронной почты","Password":"Пароль","Enter your password":"Введи пароль","Your password":"Твой пароль","One more":"Ещё один","step.":"шаг.","CHECK YOUR EMAIL":"ПРОВЕРЬ ПОЧТУ",
            "We've sent a verification link to your email address. Open it and verify your account before signing in.":"Мы отправили ссылку для подтверждения на твою почту. Открой её и подтверди аккаунт перед входом.",
            "JOIN CLOSET":"ПРИСОЕДИНЯЙСЯ","Create your account.":"Создай аккаунт.","Create an account to buy and sell things across Moldova.":"Создай аккаунт, чтобы покупать и продавать товары по Молдове.",
            "Your name":"Твоё имя","Create a password":"Создай пароль","Confirm password":"Подтверди пароль","Repeat your password":"Повтори пароль","Already have an account?":"Уже есть аккаунт?",
            "ABOUT CLOSET":"О CLOSET","Everything deserves another story.":"Каждая вещь заслуживает новой истории.","A doua șansă is a Moldova-focused marketplace for buying, selling and discovering useful things locally.":"Маркетплейс для покупки, продажи и поиска полезных вещей по всей Молдове.",
            "Built for second lives.":"Создан для второй жизни вещей.","A doua șansă keeps useful things moving instead of letting them sit unused.":"Полезные вещи продолжают жить, а не лежат без дела.",
            "Built for Moldova.":"Создан для Молдовы.","The marketplace is designed around people buying and selling locally across Moldova.":"Маркетплейс создан для людей, которые покупают и продают товары по всей Молдове.",
            "Built to grow.":"Создан, чтобы расти.","Profiles, listings, reviews and future marketplace features can all grow with CLOSET.":"Профили, объявления, отзывы и будущие функции будут развиваться вместе с CLOSET.",
            "Moldova marketplace":"Маркетплейс Молдовы","© 2026 CLOSET · Moldova":"© 2026 CLOSET · Молдова",
            "Pick any language you want.":"Выбери любой язык.","Always can be changed in settings.":"Язык всегда можно изменить в настройках.",
            "Language":"Язык","Choose the language used across the website.":"Выбери язык, который будет использоваться на всём сайте.","English":"Английский","Romanian":"Румынский","Russian":"Русский","Save language":"Сохранить язык",
            "Electronics & Phones":"Электроника и телефоны","Computers & PC Hardware":"Компьютеры и комплектующие","Cars & Auto Parts":"Автомобили и автозапчасти","Home & Garden":"Дом и сад","Clothing & Shoes":"Одежда и обувь","Gaming":"Игры","Books & Education":"Книги и образование","Tools & Equipment":"Инструменты и оборудование","Kids & Baby":"Дети и товары для малышей","Pets & Pet Supplies":"Животные и товары для них","Music & Instruments":"Музыка и инструменты","Sports & Outdoors":"Спорт и отдых","Collectibles & Vintage":"Коллекционные и винтажные вещи","Jewelry & Accessories":"Украшения и аксессуары","Property":"Недвижимость","Jobs & Services":"Работа и услуги","Other":"Другое"
        }
    };

    function getLanguage() {
        const saved = localStorage.getItem(STORAGE_KEY);
        return SUPPORTED.includes(saved) ? saved : "en";
    }

    function brand() { return BRAND[getLanguage()] || BRAND.en; }

    function translateValue(value) {
        const lang = getLanguage();
        return translations[lang]?.[value] ?? value;
    }

    function replaceBrand(value) {
        return String(value).replace(/CLOSET/g, brand());
    }

    function translateElement(element) {
        if (element.nodeType === Node.TEXT_NODE) {
            const value = element.nodeValue;
            const trimmed = value.trim();
            if (!trimmed) return;
            const translated = translateValue(trimmed);
            const nextValue =
                translated !== trimmed
                    ? value.replace(trimmed, translated)
                    : value;

            element.nodeValue = replaceBrand(nextValue);
            return;
        }

        if (element.nodeType !== Node.ELEMENT_NODE) return;
        ["placeholder", "aria-label", "title"].forEach(attr => {
            const value = element.getAttribute(attr);
            if (value) {
                const translated = translateValue(value);
                element.setAttribute(attr, replaceBrand(translated));
            }
        });
        element.childNodes.forEach(translateElement);
    }

    function apply() {
        const lang = getLanguage();
        document.documentElement.lang = lang;
        document.title = "A doua șansă — Moldova Marketplace";
        translateElement(document.body);
        document.querySelectorAll(".logo, .site-footer strong").forEach(el => {
            el.textContent = brand();
        });
        window.dispatchEvent(new CustomEvent("closet:language-changed", { detail: { language: lang } }));
    }

    async function setLanguage(lang, saveToAccount = true) {
        if (!SUPPORTED.includes(lang)) return;

        const previous = getLanguage();
        localStorage.setItem(STORAGE_KEY, lang);
        apply();

        if (
            saveToAccount &&
            window.supabaseClient &&
            typeof ClosetAuth !== "undefined" &&
            ClosetAuth.isSignedIn()
        ) {
            try {
                await window.supabaseClient.auth.updateUser({
                    data: { language: lang }
                });
            } catch (error) {
                console.error("Language preference error:", error);
            }
        }

        if (previous !== lang) {
            window.location.reload();
        }
    }

    function openPicker(force = false) {
        const existing = document.getElementById("languageModal");
        if (!existing) return;
        existing.hidden = false;
        existing.classList.add("is-open");
        document.body.classList.add("language-modal-open");
        if (force) existing.dataset.force = "true";
    }

    function closePicker() {
        const modal = document.getElementById("languageModal");
        if (!modal) return;
        modal.hidden = true;
        modal.classList.remove("is-open");
        document.body.classList.remove("language-modal-open");
    }

    function initialize() {
        apply();
        const saved = localStorage.getItem(STORAGE_KEY);
        const modal = document.getElementById("languageModal");
        if (!modal) return;
        modal.querySelectorAll("[data-language]").forEach(button => {
            button.addEventListener("click", () => {
                setLanguage(button.dataset.language);
                closePicker();
            });
        });
        if (!SUPPORTED.includes(saved)) openPicker(true);
        const observer = new MutationObserver(mutations => {
            if (document.body.dataset.translating === "true") return;
            document.body.dataset.translating = "true";
            for (const mutation of mutations) {
                mutation.addedNodes?.forEach(node => translateElement(node));
            }
            document.body.dataset.translating = "false";
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    return { getLanguage, setLanguage, apply, openPicker, closePicker, translateValue, brand, initialize };
})();