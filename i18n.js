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


    const extraTranslations = {
        en: {
            "ABOUT A doua șansă":"ABOUT A doua șansă",
            "JOIN A doua șansă":"JOIN A doua șansă",
            "Keep your A doua șansă profile up to date so buyers know who they're dealing with.":"Keep your A doua șansă profile up to date so buyers know who they're dealing with.",
            "Manage your A doua șansă account and preferences.":"Manage your A doua șansă account and preferences.",
            "A future A doua șansă feature. We'll announce when it becomes available.":"A future A doua șansă feature. We'll announce when it becomes available.",
            "Sign out of this A doua șansă account on this device.":"Sign out of this A doua șansă account on this device.",
            "Sign in to manage your profile, listings and A doua șansă activity.":"Sign in to manage your profile, listings and A doua șansă activity.",
            "Create your A doua șansă account and start giving your things a new home.":"Create your A doua șansă account and start giving your things a new home.",
            "Profiles, listings, reviews and future marketplace features can all grow with A doua șansă.":"Profiles, listings, reviews and future marketplace features can all grow with A doua șansă.",

            "Search the marketplace":"Search the marketplace",
            "Marketplace categories":"Marketplace categories",
            "Search listings":"Search listings",
            "Min MDL":"Min MDL",
            "Max MDL":"Max MDL",
            "Subcategory":"Subcategory",
            "SELL ON A doua șansă":"SELL ON A doua șansă",
            "EXPLORE A doua șansă":"EXPLORE A doua șansă",
            "CLOSET PROFILE":"A doua șansă PROFILE",
            "YOUR CLOSET":"YOUR LISTINGS",
            "SELLER REVIEWS":"SELLER REVIEWS",
            "Reviews":"Reviews",
            "No reviews yet.":"No reviews yet.",
            "You haven't listed anything yet.":"You haven't listed anything yet.",
            "Edit your":"Edit your",
            "profile.":"profile.",
            "Keep your CLOSET profile up to date so buyers know who they're dealing with.":"Keep your A doua șansă profile up to date so buyers know who they're dealing with.",
            "Change photo":"Change photo",
            "Display name":"Display name",
            "Username":"Username",
            "Bio":"Bio",
            "Tell people a little about yourself...":"Tell people a little about yourself...",
            "Save changes":"Save changes",
            "Manage your CLOSET account and preferences.":"Manage your A doua șansă account and preferences.",
            "A future CLOSET feature. We'll announce when it becomes available.":"A future A doua șansă feature. We'll announce when it becomes available.",
            "Sign out of this CLOSET account on this device.":"Sign out of this A doua șansă account on this device.",
            "Sign in to":"Sign in to",
            "CLOSET activity.":"A doua șansă activity.",
            "Sign in to manage your profile, listings and CLOSET activity.":"Sign in to manage your profile, listings and A doua șansă activity.",
            "Create your CLOSET account and start giving your clothes a new home.":"Create your A doua șansă account and start giving your things a new home.",
            "CLOSET is a Moldova-focused marketplace for buying, selling and discovering useful things locally.":"A doua șansă is a Moldova-focused marketplace for buying, selling and discovering useful things locally.",
            "CLOSET keeps useful things moving instead of letting them sit unused.":"A doua șansă keeps useful things moving instead of letting them sit unused.",
            "Profiles, listings, reviews and future marketplace features can all grow with CLOSET.":"Profiles, listings, reviews and future marketplace features can all grow with A doua șansă.",
            "CLOSET is a Moldova-focused marketplace for buying and selling almost anything locally.":"A doua șansă is a Moldova-focused marketplace for buying and selling almost anything locally.",
            "© 2026 CLOSET · Moldova":"© 2026 A doua șansă · Moldova",
            "Return to CLOSET home":"Return to A doua șansă home",
            "Go to CLOSET home":"Go to A doua șansă home",
            "Marketplace":"Marketplace",
            "Loading listing...":"Loading listing...",
            "Listings are unavailable":"Listings are unavailable",
            "Nothing is listed yet":"Nothing is listed yet",
            "Be the first person to give an item a new home.":"Be the first person to give an item a new home.",
            "No listings found":"No listings found",
            "Try another search or category.":"Try another search or category.",
            "Sign in to see your listings":"Sign in to see your listings",
            "Your published items will appear here.":"Your published items will appear here.",
            "Your listings couldn't be loaded":"Your listings couldn't be loaded",
            "You haven't listed anything yet":"You haven't listed anything yet",
            "When you publish an item, it will appear here.":"When you publish an item, it will appear here.",
            "Untitled item":"Untitled item",
            "No description provided.":"No description provided.",
            "Price unavailable":"Price unavailable",
            "New":"New","Like new":"Like new","Good":"Good","Fair":"Fair","For parts":"For parts",
            "Seller":"Seller",
            "Buying Protection":"Buying Protection",
            "A future CLOSET feature.":"A future A doua șansă feature.",
            "Your profile":"Your profile",
            "Profile saved, but the profile photo could not be uploaded:":"Profile saved, but the profile photo could not be uploaded:",
            "Your profile has been updated.":"Your profile has been updated.",
            "Please sign in before publishing an item.":"Please sign in before publishing an item.",
            "Please add a title for your item.":"Please add a title for your item.",
            "Please enter a valid price.":"Please enter a valid price.",
            "Please choose a category.":"Please choose a category.",
            "Please choose the item's condition.":"Please choose the item's condition.",
            "Please add a location.":"Please add a location.",
            "Please add a description.":"Please add a description.",
            "Please add at least one photo.":"Please add at least one photo.",
            "Publishing…":"Publishing…",
            "Your item has been published.":"Your item has been published.",
            "You can upload up to 20 photos.":"You can upload up to 20 photos.",
            "Only JPG, PNG and WebP photos are allowed.":"Only JPG, PNG and WebP photos are allowed.",
            "Each photo must be 10 MB or smaller.":"Each photo must be 10 MB or smaller.",
            "Please choose a JPG, PNG or WebP image.":"Please choose a JPG, PNG or WebP image.",
            "This listing contains content that CLOSET does not allow. Please only list ordinary items that can be legally sold on the marketplace.":"This listing contains content that A doua șansă does not allow. Please only list ordinary items that can be legally sold on the marketplace.",
            "Categories are temporarily unavailable.":"Categories are temporarily unavailable.",
            "Categories couldn't be loaded. Please try again.":"Categories couldn't be loaded. Please try again.",
            "Make main":"Make main",
            "Main photo":"Main photo",
            "Remove photo":"Remove photo",
            "View":"View",
            "Please wait…":"Please wait…",
            "Saving…":"Saving…",
            "Signing in...":"Signing in...",
            "Creating account...":"Creating account...",
            "Signing out...":"Signing out...",
            "Show":"Show","Hide":"Hide","Show password":"Show password","Hide password":"Hide password",
            "Please enter your email and password.":"Please enter your email and password.",
            "Please enter a valid email address.":"Please enter a valid email address.",
            "Please enter your password.":"Please enter your password.",
            "Please enter your name.":"Please enter your name.",
            "Please choose a password.":"Please choose a password.",
            "Please confirm your password.":"Please confirm your password.",
            "Your passwords do not match.":"Your passwords do not match.",
            "Your password must be at least 6 characters long.":"Your password must be at least 6 characters long.",
            "Your account has been created. Check your email to verify your address before signing in.":"Your account has been created. Check your email to verify your address before signing in.",
            "Something went wrong. Please try again.":"Something went wrong. Please try again.",
            "The email or password is incorrect.":"The email or password is incorrect.",
            "Please verify your email address before signing in.":"Please verify your email address before signing in.",
            "An account with this email already exists. Try signing in instead.":"An account with this email already exists. Try signing in instead.",
            "Too many attempts right now. Please wait a little before trying again.":"Too many attempts right now. Please wait a little before trying again.",
            "You need to sign in first.":"You need to sign in first.",
            "Please select an image.":"Please select an image.",
            "Please select a valid image file.":"Please select a valid image file.",
            "Profile not found.":"Profile not found.",
            "That username is already taken.":"That username is already taken.",
            "You don't have permission to perform that action.":"You don't have permission to perform that action.",
            "We couldn't update the profile. Please try again.":"We couldn't update the profile. Please try again.",
            "Your title is too long.":"Your title is too long.",
            "Please choose a category.":"Please choose a category.",
            "Please enter a valid price.":"Please enter a valid price.",
            "Please add a title for your item.":"Please add a title for your item.",
            "Please add a description.":"Please add a description.",
            "Please add a location.":"Please add a location.",
            "Please add at least one photo.":"Please add at least one photo.",
            "Please choose the item's condition.":"Please choose the item's condition.",
            "Please wait while we load the item.":"Please wait while we load the item.",
            "← Back":"← Back",
            "← Back to profile":"← Back to profile",
            "Back to sign in":"Back to sign in",
            "or":"or",
            "Create account.":"Create account.",
            "Sign in.":"Sign in.",
            "One more":"One more",
            "step.":"step.",
            "Create your":"Create your",
            "account.":"account.",
            "Everything deserves":"Everything deserves",
            "another story.":"another story.",
            "Built for second lives.":"Built for second lives.",
            "Built for Moldova.":"Built for Moldova.",
            "Built to grow.":"Built to grow."
        },
        ro: {
            "ABOUT A doua șansă":"DESPRE A doua șansă",
            "JOIN A doua șansă":"ALĂTURĂ-TE A doua șansă",
            "Keep your A doua șansă profile up to date so buyers know who they're dealing with.":"Păstrează-ți profilul A doua șansă actualizat, pentru ca cumpărătorii să știe cu cine discută.",
            "Manage your A doua șansă account and preferences.":"Gestionează-ți contul A doua șansă și preferințele.",
            "A future A doua șansă feature. We'll announce when it becomes available.":"O funcție viitoare A doua șansă. Te vom anunța când va fi disponibilă.",
            "Sign out of this A doua șansă account on this device.":"Deconectează acest cont A doua șansă de pe acest dispozitiv.",
            "Sign in to manage your profile, listings and A doua șansă activity.":"Conectează-te pentru a-ți gestiona profilul, anunțurile și activitatea A doua șansă.",
            "Create your A doua șansă account and start giving your things a new home.":"Creează-ți contul A doua șansă și începe să oferi lucrurilor tale o casă nouă.",
            "Profiles, listings, reviews and future marketplace features can all grow with A doua șansă.":"Profilurile, anunțurile, recenziile și funcțiile viitoare pot crește împreună cu A doua șansă.",

            "Search the marketplace":"Caută în marketplace",
            "Marketplace categories":"Categorii marketplace",
            "Search listings":"Caută anunțuri",
            "Min MDL":"Min MDL",
            "Max MDL":"Max MDL",
            "Subcategory":"Subcategorie",
            "SELL ON A doua șansă":"VINDE PE A doua șansă",
            "EXPLORE A doua șansă":"EXPLOREAZĂ A doua șansă",
            "CLOSET PROFILE":"PROFIL A doua șansă",
            "YOUR CLOSET":"ANUNȚURILE TALE",
            "SELLER REVIEWS":"RECENZIILE VÂNZĂTORULUI",
            "Reviews":"Recenzii",
            "No reviews yet.":"Încă nu există recenzii.",
            "You haven't listed anything yet.":"Încă nu ai publicat niciun anunț.",
            "Edit your":"Editează-ți",
            "profile.":"profilul.",
            "Keep your CLOSET profile up to date so buyers know who they're dealing with.":"Păstrează-ți profilul A doua șansă actualizat, pentru ca cumpărătorii să știe cu cine discută.",
            "Change photo":"Schimbă fotografia",
            "Display name":"Nume afișat",
            "Username":"Nume de utilizator",
            "Bio":"Descriere",
            "Tell people a little about yourself...":"Spune-le oamenilor câte ceva despre tine...",
            "Save changes":"Salvează modificările",
            "Manage your CLOSET account and preferences.":"Gestionează-ți contul A doua șansă și preferințele.",
            "A future CLOSET feature. We'll announce when it becomes available.":"O funcție viitoare A doua șansă. Te vom anunța când va fi disponibilă.",
            "Sign out of this CLOSET account on this device.":"Deconectează acest cont A doua șansă de pe acest dispozitiv.",
            "Sign in to":"Conectează-te la",
            "CLOSET activity.":"activitatea A doua șansă.",
            "Sign in to manage your profile, listings and CLOSET activity.":"Conectează-te pentru a-ți gestiona profilul, anunțurile și activitatea A doua șansă.",
            "Create your CLOSET account and start giving your clothes a new home.":"Creează-ți contul A doua șansă și începe să oferi lucrurilor tale o casă nouă.",
            "CLOSET is a Moldova-focused marketplace for buying, selling and discovering useful things locally.":"A doua șansă este un marketplace din Moldova pentru cumpărarea, vânzarea și descoperirea locală a lucrurilor utile.",
            "CLOSET keeps useful things moving instead of letting them sit unused.":"A doua șansă păstrează lucrurile utile în circulație, în loc să le lase nefolosite.",
            "Profiles, listings, reviews and future marketplace features can all grow with CLOSET.":"Profilurile, anunțurile, recenziile și funcțiile viitoare pot crește împreună cu A doua șansă.",
            "CLOSET is a Moldova-focused marketplace for buying and selling almost anything locally.":"A doua șansă este un marketplace din Moldova pentru cumpărarea și vânzarea locală a aproape oricărui lucru.",
            "© 2026 CLOSET · Moldova":"© 2026 A doua șansă · Moldova",
            "Return to CLOSET home":"Revino la pagina principală A doua șansă",
            "Go to CLOSET home":"Mergi la pagina principală A doua șansă",
            "Marketplace":"Marketplace",
            "Loading listing...":"Se încarcă anunțul...",
            "Listings are unavailable":"Anunțurile nu sunt disponibile",
            "Nothing is listed yet":"Încă nu există anunțuri",
            "Be the first person to give an item a new home.":"Fii prima persoană care oferă unui lucru o casă nouă.",
            "No listings found":"Nu au fost găsite anunțuri",
            "Try another search or category.":"Încearcă o altă căutare sau categorie.",
            "Sign in to see your listings":"Conectează-te pentru a vedea anunțurile tale",
            "Your published items will appear here.":"Anunțurile tale publicate vor apărea aici.",
            "Your listings couldn't be loaded":"Anunțurile tale nu au putut fi încărcate",
            "You haven't listed anything yet":"Încă nu ai publicat nimic",
            "When you publish an item, it will appear here.":"Când publici un articol, acesta va apărea aici.",
            "Untitled item":"Articol fără titlu",
            "No description provided.":"Nu a fost oferită nicio descriere.",
            "Price unavailable":"Preț indisponibil",
            "Seller":"Vânzător",
            "Buying Protection":"Protecția cumpărătorului",
            "A future CLOSET feature.":"O funcție viitoare A doua șansă.",
            "Your profile":"Profilul tău",
            "Profile saved, but the profile photo could not be uploaded:":"Profilul a fost salvat, dar fotografia de profil nu a putut fi încărcată:",
            "Your profile has been updated.":"Profilul tău a fost actualizat.",
            "Please sign in before publishing an item.":"Conectează-te înainte de a publica un articol.",
            "Please add a title for your item.":"Adaugă un titlu pentru articol.",
            "Please enter a valid price.":"Introdu un preț valid.",
            "Please choose a category.":"Alege o categorie.",
            "Please choose the item's condition.":"Alege starea articolului.",
            "Please add a location.":"Adaugă o locație.",
            "Please add a description.":"Adaugă o descriere.",
            "Please add at least one photo.":"Adaugă cel puțin o fotografie.",
            "Publishing…":"Se publică…",
            "Your item has been published.":"Articolul tău a fost publicat.",
            "You can upload up to 20 photos.":"Poți încărca până la 20 de fotografii.",
            "Only JPG, PNG and WebP photos are allowed.":"Sunt permise doar fotografii JPG, PNG și WebP.",
            "Each photo must be 10 MB or smaller.":"Fiecare fotografie trebuie să aibă cel mult 10 MB.",
            "Please choose a JPG, PNG or WebP image.":"Alege o imagine JPG, PNG sau WebP.",
            "This listing contains content that CLOSET does not allow. Please only list ordinary items that can be legally sold on the marketplace.":"Acest anunț conține conținut pe care A doua șansă nu îl permite. Publică doar articole obișnuite care pot fi vândute legal pe marketplace.",
            "Categories are temporarily unavailable.":"Categoriile nu sunt disponibile momentan.",
            "Categories couldn't be loaded. Please try again.":"Categoriile nu au putut fi încărcate. Încearcă din nou.",
            "Make main":"Setează ca principală",
            "Main photo":"Fotografie principală",
            "Remove photo":"Elimină fotografia",
            "View":"Vezi",
            "Please wait…":"Așteaptă…",
            "Saving…":"Se salvează…",
            "Signing in...":"Se conectează...",
            "Creating account...":"Se creează contul...",
            "Signing out...":"Se deconectează...",
            "Show":"Arată","Hide":"Ascunde","Show password":"Arată parola","Hide password":"Ascunde parola",
            "Please enter your email and password.":"Introdu adresa de email și parola.",
            "Please enter a valid email address.":"Introdu o adresă de email validă.",
            "Please enter your password.":"Introdu parola.",
            "Please enter your name.":"Introdu numele.",
            "Please choose a password.":"Alege o parolă.",
            "Please confirm your password.":"Confirmă parola.",
            "Your passwords do not match.":"Parolele nu coincid.",
            "Your password must be at least 6 characters long.":"Parola trebuie să aibă cel puțin 6 caractere.",
            "Your account has been created. Check your email to verify your address before signing in.":"Contul tău a fost creat. Verifică emailul pentru a-ți confirma adresa înainte de conectare.",
            "Something went wrong. Please try again.":"Ceva nu a funcționat. Încearcă din nou.",
            "The email or password is incorrect.":"Emailul sau parola sunt incorecte.",
            "Please verify your email address before signing in.":"Verifică adresa de email înainte de conectare.",
            "An account with this email already exists. Try signing in instead.":"Există deja un cont cu acest email. Încearcă să te conectezi.",
            "Too many attempts right now. Please wait a little before trying again.":"Sunt prea multe încercări acum. Așteaptă puțin și încearcă din nou.",
            "You need to sign in first.":"Trebuie mai întâi să te conectezi.",
            "Please select an image.":"Selectează o imagine.",
            "Please select a valid image file.":"Selectează un fișier imagine valid.",
            "Profile not found.":"Profilul nu a fost găsit.",
            "That username is already taken.":"Acest nume de utilizator este deja folosit.",
            "You don't have permission to perform that action.":"Nu ai permisiunea de a efectua această acțiune.",
            "We couldn't update the profile. Please try again.":"Profilul nu a putut fi actualizat. Încearcă din nou.",
            "Your title is too long.":"Titlul este prea lung.",
            "Please wait while we load the item.":"Așteaptă cât încărcăm articolul.",
            "← Back":"← Înapoi",
            "← Back to profile":"← Înapoi la profil",
            "Back to sign in":"Înapoi la conectare",
            "or":"sau",
            "Sign in.":"Conectare.",
            "Create account.":"Creează cont.",
            "One more":"Încă un",
            "step.":"pas.",
            "Create your":"Creează-ți",
            "account.":"contul.",
            "Everything deserves":"Totul merită",
            "another story.":"o nouă poveste.",
            "Built for second lives.":"Creat pentru a doua viață a lucrurilor.",
            "Built for Moldova.":"Creat pentru Moldova.",
            "Built to grow.":"Creat pentru a crește."
        },
        ru: {
            "ABOUT A doua șansă":"О A doua șansă",
            "JOIN A doua șansă":"ПРИСОЕДИНИСЬ К A doua șansă",
            "Keep your A doua șansă profile up to date so buyers know who they're dealing with.":"Поддерживай свой профиль A doua șansă в актуальном состоянии, чтобы покупатели знали, с кем имеют дело.",
            "Manage your A doua șansă account and preferences.":"Управляй аккаунтом A doua șansă и настройками.",
            "A future A doua șansă feature. We'll announce when it becomes available.":"Будущая функция A doua șansă. Мы сообщим, когда она станет доступна.",
            "Sign out of this A doua șansă account on this device.":"Выйти из этого аккаунта A doua șansă на этом устройстве.",
            "Sign in to manage your profile, listings and A doua șansă activity.":"Войди, чтобы управлять профилем, объявлениями и активностью A doua șansă.",
            "Create your A doua șansă account and start giving your things a new home.":"Создай аккаунт A doua șansă и начни давать своим вещам новый дом.",
            "Profiles, listings, reviews and future marketplace features can all grow with A doua șansă.":"Профили, объявления, отзывы и будущие функции будут развиваться вместе с A doua șansă.",

            "Search the marketplace":"Поиск по маркетплейсу",
            "Marketplace categories":"Категории маркетплейса",
            "Search listings":"Поиск объявлений",
            "Min MDL":"Мин. MDL",
            "Max MDL":"Макс. MDL",
            "Subcategory":"Подкатегория",
            "SELL ON A doua șansă":"ПРОДАВАЙ НА A doua șansă",
            "EXPLORE A doua șansă":"ИССЛЕДУЙ A doua șansă",
            "CLOSET PROFILE":"ПРОФИЛЬ A doua șansă",
            "YOUR CLOSET":"ТВОИ ОБЪЯВЛЕНИЯ",
            "SELLER REVIEWS":"ОТЗЫВЫ О ПРОДАВЦЕ",
            "Reviews":"Отзывы",
            "No reviews yet.":"Пока нет отзывов.",
            "You haven't listed anything yet.":"Ты ещё не опубликовал ни одного объявления.",
            "Edit your":"Измени свой",
            "profile.":"профиль.",
            "Keep your CLOSET profile up to date so buyers know who they're dealing with.":"Поддерживай свой профиль A doua șansă в актуальном состоянии, чтобы покупатели знали, с кем имеют дело.",
            "Change photo":"Изменить фото",
            "Display name":"Отображаемое имя",
            "Username":"Имя пользователя",
            "Bio":"О себе",
            "Tell people a little about yourself...":"Расскажи немного о себе...",
            "Save changes":"Сохранить изменения",
            "Manage your CLOSET account and preferences.":"Управляй аккаунтом A doua șansă и настройками.",
            "A future CLOSET feature. We'll announce when it becomes available.":"Будущая функция A doua șansă. Мы сообщим, когда она станет доступна.",
            "Sign out of this CLOSET account on this device.":"Выйти из этого аккаунта A doua șansă на этом устройстве.",
            "Sign in to":"Войди в",
            "CLOSET activity.":"активность A doua șansă.",
            "Sign in to manage your profile, listings and CLOSET activity.":"Войди, чтобы управлять профилем, объявлениями и активностью A doua șansă.",
            "Create your CLOSET account and start giving your clothes a new home.":"Создай аккаунт A doua șansă и начни давать своим вещам новый дом.",
            "CLOSET is a Moldova-focused marketplace for buying, selling and discovering useful things locally.":"A doua șansă — маркетплейс Молдовы для покупки, продажи и поиска полезных вещей.",
            "CLOSET keeps useful things moving instead of letting them sit unused.":"A doua șansă помогает полезным вещам оставаться в использовании, а не лежать без дела.",
            "Profiles, listings, reviews and future marketplace features can all grow with CLOSET.":"Профили, объявления, отзывы и будущие функции будут развиваться вместе с A doua șansă.",
            "CLOSET is a Moldova-focused marketplace for buying and selling almost anything locally.":"A doua șansă — маркетплейс Молдовы для местной покупки и продажи почти любых вещей.",
            "© 2026 CLOSET · Moldova":"© 2026 A doua șansă · Молдова",
            "Return to CLOSET home":"Вернуться на главную A doua șansă",
            "Go to CLOSET home":"Перейти на главную A doua șansă",
            "Marketplace":"Маркетплейс",
            "Loading listing...":"Загрузка объявления...",
            "Listings are unavailable":"Объявления недоступны",
            "Nothing is listed yet":"Пока нет объявлений",
            "Be the first person to give an item a new home.":"Стань первым, кто даст вещи новый дом.",
            "No listings found":"Объявления не найдены",
            "Try another search or category.":"Попробуй другой поиск или категорию.",
            "Sign in to see your listings":"Войди, чтобы увидеть свои объявления",
            "Your published items will appear here.":"Здесь появятся твои опубликованные объявления.",
            "Your listings couldn't be loaded":"Не удалось загрузить твои объявления",
            "You haven't listed anything yet":"Ты ещё ничего не опубликовал",
            "When you publish an item, it will appear here.":"После публикации товар появится здесь.",
            "Untitled item":"Товар без названия",
            "No description provided.":"Описание не указано.",
            "Price unavailable":"Цена недоступна",
            "Seller":"Продавец",
            "Buying Protection":"Защита покупателя",
            "A future CLOSET feature.":"Будущая функция A doua șansă.",
            "Your profile":"Твой профиль",
            "Profile saved, but the profile photo could not be uploaded:":"Профиль сохранён, но фото профиля не удалось загрузить:",
            "Your profile has been updated.":"Твой профиль обновлён.",
            "Please sign in before publishing an item.":"Войди перед публикацией товара.",
            "Please add a title for your item.":"Добавь название товара.",
            "Please enter a valid price.":"Введи корректную цену.",
            "Please choose a category.":"Выбери категорию.",
            "Please choose the item's condition.":"Выбери состояние товара.",
            "Please add a location.":"Добавь местоположение.",
            "Please add a description.":"Добавь описание.",
            "Please add at least one photo.":"Добавь хотя бы одну фотографию.",
            "Publishing…":"Публикация…",
            "Your item has been published.":"Твой товар опубликован.",
            "You can upload up to 20 photos.":"Можно загрузить до 20 фотографий.",
            "Only JPG, PNG and WebP photos are allowed.":"Разрешены только фотографии JPG, PNG и WebP.",
            "Each photo must be 10 MB or smaller.":"Размер каждой фотографии должен быть не более 10 МБ.",
            "Please choose a JPG, PNG or WebP image.":"Выбери изображение JPG, PNG или WebP.",
            "This listing contains content that CLOSET does not allow. Please only list ordinary items that can be legally sold on the marketplace.":"Это объявление содержит недопустимый для A doua șansă контент. Публикуй только обычные товары, которые можно законно продавать на маркетплейсе.",
            "Categories are temporarily unavailable.":"Категории временно недоступны.",
            "Categories couldn't be loaded. Please try again.":"Не удалось загрузить категории. Попробуй ещё раз.",
            "Make main":"Сделать главным",
            "Main photo":"Главное фото",
            "Remove photo":"Удалить фото",
            "View":"Просмотреть",
            "Please wait…":"Подожди…",
            "Saving…":"Сохранение…",
            "Signing in...":"Выполняется вход...",
            "Creating account...":"Создание аккаунта...",
            "Signing out...":"Выход...",
            "Show":"Показать","Hide":"Скрыть","Show password":"Показать пароль","Hide password":"Скрыть пароль",
            "Please enter your email and password.":"Введи адрес электронной почты и пароль.",
            "Please enter a valid email address.":"Введи корректный адрес электронной почты.",
            "Please enter your password.":"Введи пароль.",
            "Please enter your name.":"Введи имя.",
            "Please choose a password.":"Придумай пароль.",
            "Please confirm your password.":"Подтверди пароль.",
            "Your passwords do not match.":"Пароли не совпадают.",
            "Your password must be at least 6 characters long.":"Пароль должен содержать не менее 6 символов.",
            "Your account has been created. Check your email to verify your address before signing in.":"Аккаунт создан. Проверь почту и подтверди адрес перед входом.",
            "Something went wrong. Please try again.":"Что-то пошло не так. Попробуй ещё раз.",
            "The email or password is incorrect.":"Неверный email или пароль.",
            "Please verify your email address before signing in.":"Подтверди адрес электронной почты перед входом.",
            "An account with this email already exists. Try signing in instead.":"Аккаунт с таким email уже существует. Попробуй войти.",
            "Too many attempts right now. Please wait a little before trying again.":"Сейчас слишком много попыток. Подожди немного и попробуй снова.",
            "You need to sign in first.":"Сначала нужно войти в аккаунт.",
            "Please select an image.":"Выбери изображение.",
            "Please select a valid image file.":"Выбери корректный файл изображения.",
            "Profile not found.":"Профиль не найден.",
            "That username is already taken.":"Это имя пользователя уже занято.",
            "You don't have permission to perform that action.":"У тебя нет разрешения на это действие.",
            "We couldn't update the profile. Please try again.":"Не удалось обновить профиль. Попробуй ещё раз.",
            "Your title is too long.":"Название слишком длинное.",
            "Please wait while we load the item.":"Подожди, пока мы загрузим товар.",
            "← Back":"← Назад",
            "← Back to profile":"← Назад к профилю",
            "Back to sign in":"Назад ко входу",
            "or":"или",
            "Sign in.":"Войти.",
            "Create account.":"Создать аккаунт.",
            "One more":"Ещё один",
            "step.":"шаг.",
            "Create your":"Создай свой",
            "account.":"аккаунт.",
            "Everything deserves":"Каждая вещь заслуживает",
            "another story.":"новой истории.",
            "Built for second lives.":"Создано для второй жизни вещей.",
            "Built for Moldova.":"Создано для Молдовы.",
            "Built to grow.":"Создано для роста."
        }
    };

    Object.assign(translations.en, extraTranslations.en);
    Object.assign(translations.ro, extraTranslations.ro);
    Object.assign(translations.ru, extraTranslations.ru);

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

            const finalValue = replaceBrand(nextValue);
            if (finalValue !== value) {
                element.nodeValue = finalValue;
            }
            return;
        }

        if (element.nodeType !== Node.ELEMENT_NODE) return;
        ["placeholder", "aria-label", "title"].forEach(attr => {
            const value = element.getAttribute(attr);
            if (value) {
                const translated = translateValue(value);
                const finalValue = replaceBrand(translated);
                if (finalValue !== value) {
                    element.setAttribute(attr, finalValue);
                }
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
                if (mutation.type === "characterData") {
                    translateElement(mutation.target);
                } else if (mutation.type === "attributes") {
                    translateElement(mutation.target);
                } else {
                    mutation.addedNodes?.forEach(node => translateElement(node));
                }
            }
            document.body.dataset.translating = "false";
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true,
            attributeFilter: ["placeholder", "aria-label", "title"]
        });
    }

    window.ClosetI18n = {
        getLanguage,
        setLanguage,
        apply,
        openPicker,
        closePicker,
        translateValue,
        brand,
        initialize
    };
})();