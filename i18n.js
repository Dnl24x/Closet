(() => {
    const STORAGE_KEY = "closet-language";
    const SUPPORTED = ["en", "ro", "ru"];
    const BRAND = { en: "A doua șansă", ro: "A doua șansă", ru: "A doua șansă" };

    const translations = {
        en: {
            "Listing status": "Listing status",
            "Active": "Active",
            "Reserved": "Reserved",
            "Sold": "Sold",
            "Resend verification email": "Resend verification email",
            "Verify your email": "Verify your email",
            "For security purposes, open your Gmail and click the verification link from A doua șansă.": "For security purposes, open your Gmail and click the verification link from A doua șansă.",
            "Open Gmail": "Open Gmail",
            "Done": "Done",
            "Thank you for verifying.": "Thank you for verifying.",
            "You can now continue your experience. Your email has been verified successfully. You can now start selling.": "You can now continue your experience. Your email has been verified successfully. You can now start selling.",
            "Home":"Home","Browse":"Browse","About":"About","Profile":"Profile","Sell an item":"Sell an item",
            "Search the marketplace...":"Search the marketplace...","Search":"Search","Categories":"Categories",
            "Give your items a second life.":"Give your items a second life.","Save the planet. Earn.":"Save the planet. Earn.",
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
            "Listing status": "Starea anunțului",
            "Active": "Activ",
            "Reserved": "Rezervat",
            "Sold": "Vândut",
            "Resend verification email": "Retrimite emailul de verificare",
            "Verify your email": "Verifică-ți adresa de email",
            "For security purposes, open your Gmail and click the verification link from A doua șansă.": "Pentru securitate, deschide Gmail și apasă pe linkul de verificare trimis de A doua șansă.",
            "Open Gmail": "Deschide Gmail",
            "Done": "Gata",
            "Thank you for verifying.": "Îți mulțumim că ai verificat.",
            "You can now continue your experience. Your email has been successfully verified. You can now start selling.": "Poți continua. Adresa ta de email a fost verificată cu succes. Acum poți începe să vinzi.",
            "Home":"Acasă","Browse":"Explorează","About":"Despre","Profile":"Profil","Sell an item":"Vinde un articol",
            "Search the marketplace...":"Caută în marketplace...","Search":"Caută","Categories":"Categorii",
            "Give your items a second life.":"Dă-le articolelor tale o a doua viață.","Save the planet. Earn.":"Protejează planeta. Câștigă.",
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
            "Listing status": "Статус объявления",
            "Active": "Активно",
            "Reserved": "Зарезервировано",
            "Sold": "Продано",
            "Resend verification email": "Отправить письмо подтверждения снова",
            "Verify your email": "Подтвердите свою почту",
            "For security purposes, open your Gmail and click the verification link from A doua șansă.": "В целях безопасности откройте Gmail и нажмите ссылку подтверждения от A doua șansă.",
            "Open Gmail": "Открыть Gmail",
            "Done": "Готово",
            "Thank you for verifying.": "Спасибо за подтверждение.",
            "You can now continue your experience. Your email has been successfully verified. You can now start selling.": "Можно продолжить. Ваш email успешно подтверждён. Теперь вы можете начать продавать.",
            "Home":"Главная","Browse":"Обзор","About":"О нас","Profile":"Профиль","Sell an item":"Продать товар",
            "Search the marketplace...":"Поиск по маркетплейсу...","Search":"Поиск","Categories":"Категории",
            "Give your items a second life.":"Дай своим вещам вторую жизнь.","Save the planet. Earn.":"Береги планету. Зарабатывай.",
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

    Object.assign(translations.en, {
        "Use initials": "Use initials",
        "Avatar background": "Avatar background",
        "Used behind your initial when no photo is shown.": "Used behind your initial when no photo is shown.",
        "Photo must be exactly 512 × 512 pixels. JPG, PNG or WebP.": "Photo must be exactly 512 × 512 pixels. JPG, PNG or WebP.",
        "Profile photos must be exactly 512 × 512 pixels.": "Profile photos must be exactly 512 × 512 pixels.",
        "Please choose a JPG, PNG or WebP image.": "Please choose a JPG, PNG or WebP image.",
        "We couldn't read that image. Please choose another one.": "We couldn't read that image. Please choose another one.",
        "Description": "Description"
    });

    Object.assign(translations.ro, {
        "Use initials": "Folosește inițiale",
        "Avatar background": "Fundal avatar",
        "Used behind your initial when no photo is shown.": "Folosit în spatele inițialei tale atunci când nu este afișată nicio fotografie.",
        "Photo must be exactly 512 × 512 pixels. JPG, PNG or WebP.": "Fotografia trebuie să aibă exact 512 × 512 pixeli. JPG, PNG sau WebP.",
        "Profile photos must be exactly 512 × 512 pixels.": "Fotografiile de profil trebuie să aibă exact 512 × 512 pixeli.",
        "Please choose a JPG, PNG or WebP image.": "Alege o imagine JPG, PNG sau WebP.",
        "We couldn't read that image. Please choose another one.": "Imaginea nu a putut fi citită. Alege altă imagine.",
        "Description": "Descriere"
    });

    Object.assign(translations.ru, {
        "Use initials": "Использовать инициалы",
        "Avatar background": "Фон аватара",
        "Used behind your initial when no photo is shown.": "Используется за инициалом, когда фотография не отображается.",
        "Photo must be exactly 512 × 512 pixels. JPG, PNG or WebP.": "Фотография должна быть ровно 512 × 512 пикселей. JPG, PNG или WebP.",
        "Profile photos must be exactly 512 × 512 pixels.": "Фото профиля должно быть ровно 512 × 512 пикселей.",
        "Please choose a JPG, PNG or WebP image.": "Выбери изображение JPG, PNG или WebP.",
        "We couldn't read that image. Please choose another one.": "Не удалось прочитать изображение. Выбери другое.",
        "Description": "Описание"
    });



    Object.assign(translations.en, {
        "Back to marketplace": "Back to marketplace",
        "Still need help?": "Still need help?"
    });
    Object.assign(translations.ro, {
        "Back to marketplace": "Înapoi la marketplace",
        "Still need help?": "Încă ai nevoie de ajutor?"
    });
    Object.assign(translations.ru, {
        "Back to marketplace": "Вернуться на маркетплейс",
        "Still need help?": "Всё ещё нужна помощь?"
    });

    Object.assign(translations.en, {
    "Seller Profile": "Seller Profile",
    "Your Profile": "Your Profile",
    "Active listings": "Active listings",
    "LISTINGS": "LISTINGS",
    "No active listings": "No active listings",
    "This seller has no active listings right now.": "This seller has no active listings right now.",
    "Reviews": "Reviews",
    "Reviews from other members will appear here.": "Reviews from other members will appear here.",
    "Profile unavailable": "Profile unavailable",
    "This profile could not be found.": "This profile could not be found.",
    "Loading profile…": "Loading profile…",
    "Please wait while we load this profile.": "Please wait while we load this profile.",
    "Buy": "Buy",
    "Save listing": "Save listing",
    "Remove from saved": "Remove from saved",
    "MORE TO EXPLORE": "MORE TO EXPLORE",
    "More like this.": "More like this.",
    "A future A doua șansă buying feature. We'll announce when it becomes available.": "A future A doua șansă buying feature. We'll announce when it becomes available.",
    "Current main photo": "Current main photo",
    "Main photo": "Main photo",
    "Please keep at least one photo on the listing.": "Please keep at least one photo on the listing.",
    "Need something?": "Need something?",
    "NEED SOMETHING?": "NEED SOMETHING?",
    "Have a question or need help?": "Have a question or need help?",
    "Reach the A doua șansă team through the support and contact pages.": "Reach the A doua șansă team through the support and contact pages.",
    "Contact A doua șansă →": "Contact A doua șansă →",
    "Terms of Service": "Terms of Service",
    "Need Help": "Need Help",
    "Contact": "Contact",
    "Moldova marketplace": "Moldova marketplace",
    "© 2026 A doua șansă · Moldova": "© 2026 A doua șansă · Moldova",
    "Terms of Service — A doua șansă": "Terms of Service — A doua șansă",
    "Rules for using the A doua șansă marketplace.": "Rules for using the A doua șansă marketplace.",
    "Effective October 4, 2026": "Effective October 4, 2026",
    "1. About the service": "1. About the service",
    "A doua șansă is an online marketplace that helps people discover, list and discuss goods and services offered by independent users in Moldova. A doua șansă provides the platform; individual users are responsible for the items they list and the transactions they choose to make.": "A doua șansă is an online marketplace that helps people discover, list and discuss goods and services offered by independent users in Moldova. A doua șansă provides the platform; individual users are responsible for the items they list and the transactions they choose to make.",
    "2. Eligibility and accounts": "2. Eligibility and accounts",
    "You must provide accurate information when creating an account and keep your login details secure. You are responsible for activity carried out through your account. If you are under the age required to enter a binding agreement where you live, use the service with a parent or legal guardian and only in ways permitted by applicable rules.": "You must provide accurate information when creating an account and keep your login details secure. You are responsible for activity carried out through your account. If you are under the age required to enter a binding agreement where you live, use the service with a parent or legal guardian and only in ways permitted by applicable rules.",
    "3. Listings and truthful information": "3. Listings and truthful information",
    "Sellers must describe items honestly, use the correct category, show a realistic price and location, and upload photos that represent the item accurately. Do not impersonate another person, manipulate listings, or publish content intended to mislead buyers.": "Sellers must describe items honestly, use the correct category, show a realistic price and location, and upload photos that represent the item accurately. Do not impersonate another person, manipulate listings, or publish content intended to mislead buyers.",
    "4. Prohibited and unsafe content": "4. Prohibited and unsafe content",
    "Do not use A doua șansă to offer illegal goods, weapons or ammunition, explosives, controlled drugs, stolen property, counterfeit goods, or other items that are unlawful or unsafe to trade. Content that facilitates fraud, harassment, threats, exploitation, or other abuse is also prohibited.": "Do not use A doua șansă to offer illegal goods, weapons or ammunition, explosives, controlled drugs, stolen property, counterfeit goods, or other items that are unlawful or unsafe to trade. Content that facilitates fraud, harassment, threats, exploitation, or other abuse is also prohibited.",
    "5. Buying, selling and payments": "5. Buying, selling and payments",
    "A doua șansă does not currently process or guarantee payments, delivery, ownership transfer, item condition or the outcome of a transaction. Buyers and sellers must independently agree on price, payment method, collection or delivery, and any other transaction terms before exchanging an item or money.": "A doua șansă does not currently process or guarantee payments, delivery, ownership transfer, item condition or the outcome of a transaction. Buyers and sellers must independently agree on price, payment method, collection or delivery, and any other transaction terms before exchanging an item or money.",
    "6. User conduct": "6. User conduct",
    "Use the marketplace respectfully. Do not spam, scrape, attack, disrupt, reverse-engineer or attempt to bypass security controls. Do not use another user's personal information for unwanted contact or harassment.": "Use the marketplace respectfully. Do not spam, scrape, attack, disrupt, reverse-engineer or attempt to bypass security controls. Do not use another user's personal information for unwanted contact or harassment.",
    "7. Moderation and enforcement": "7. Moderation and enforcement",
    "A doua șansă may review, remove, hide or restrict content and accounts when reasonably necessary to protect the community, comply with rules, investigate abuse, or maintain the service. Repeated or serious violations may result in suspension or removal of an account or listing.": "A doua șansă may review, remove, hide or restrict content and accounts when reasonably necessary to protect the community, comply with rules, investigate abuse, or maintain the service. Repeated or serious violations may result in suspension or removal of an account or listing.",
    "8. Content and intellectual property": "8. Content and intellectual property",
    "You keep ownership of the photos, descriptions and other content you submit, while giving A doua șansă permission to host, display and format that content as needed to operate the marketplace. You must have the right to upload everything you publish. The A doua șansă name, design and platform materials may not be copied or reused without permission.": "You keep ownership of the photos, descriptions and other content you submit, while giving A doua șansă permission to host, display and format that content as needed to operate the marketplace. You must have the right to upload everything you publish. The A doua șansă name, design and platform materials may not be copied or reused without permission.",
    "9. Availability and limitations": "9. Availability and limitations",
    "The marketplace is provided on an evolving basis. Features may change, be interrupted or be removed. To the extent allowed by applicable law, A doua șansă does not promise that the service will always be available, error-free, secure, or suitable for a particular transaction or purpose.": "The marketplace is provided on an evolving basis. Features may change, be interrupted or be removed. To the extent allowed by applicable law, A doua șansă does not promise that the service will always be available, error-free, secure, or suitable for a particular transaction or purpose.",
    "10. Changes to these terms": "10. Changes to these terms",
    "We may update these Terms of Service as the marketplace grows. When material changes are made, the updated version will be posted on this page with a new effective date. Continued use of the service after an update means you accept the revised terms to the extent permitted by law.": "We may update these Terms of Service as the marketplace grows. When material changes are made, the updated version will be posted on this page with a new effective date. Continued use of the service after an update means you accept the revised terms to the extent permitted by law.",
    "Questions about these terms?": "Questions about these terms?",
    "See Need Help or contact A doua șansă using the details on our Contact page.": "See Need Help or contact A doua șansă using the details on our Contact page.",
    "Need Help — A doua șansă": "Need Help — A doua șansă",
    "Find a quick answer before you contact us.": "Find a quick answer before you contact us.",
    "Search questions...": "Search questions...",
    "What is A doua șansă?": "What is A doua șansă?",
    "A doua șansă is a Moldova-focused marketplace where people can list useful items and discover things offered by other users.": "A doua șansă is a Moldova-focused marketplace where people can list useful items and discover things offered by other users.",
    "How do I publish a listing?": "How do I publish a listing?",
    "Sign in, choose Sell an item, fill in the item details, add at least one photo, then publish the listing.": "Sign in, choose Sell an item, fill in the item details, add at least one photo, then publish the listing.",
    "How do I edit my listing?": "How do I edit my listing?",
    "Open your listing, press Edit, change the details you need, then press Save changes. Only the owner of a listing can edit it.": "Open your listing, press Edit, change the details you need, then press Save changes. Only the owner of a listing can edit it.",
    "Why isn't my listing visible?": "Why isn't my listing visible?",
    "Check that it was published successfully, the listing is still active, and your internet connection is working. Hidden, sold or deleted listings may not appear in public browsing.": "Check that it was published successfully, the listing is still active, and your internet connection is working. Hidden, sold or deleted listings may not appear in public browsing.",
    "How do saved listings work?": "How do saved listings work?",
    "Press the heart on a listing to save it. Your saved listings are shown in your profile on the same device and account.": "Press the heart on a listing to save it. Your saved listings are shown in your profile on the same device and account.",
    "How do I change my profile photo?": "How do I change my profile photo?",
    "Open Profile, choose Edit profile, select Change photo, and save. Profile photos must be exactly 512 × 512 pixels and use JPG, PNG or WebP.": "Open Profile, choose Edit profile, select Change photo, and save. Profile photos must be exactly 512 × 512 pixels and use JPG, PNG or WebP.",
    "Why must my profile photo be 512 × 512 pixels?": "Why must my profile photo be 512 × 512 pixels?",
    "A fixed square size keeps profile images consistent across listing cards and profile pages.": "A fixed square size keeps profile images consistent across listing cards and profile pages.",
    "When will Buy be available?": "When will Buy be available?",
    "The Buy button is currently a placeholder. The secure purchasing flow will be added later.": "The Buy button is currently a placeholder. The secure purchasing flow will be added later.",
    "What items are not allowed?": "What items are not allowed?",
    "Illegal goods, weapons or ammunition, explosives, controlled drugs, stolen or counterfeit goods, and content that facilitates abuse or fraud are not allowed.": "Illegal goods, weapons or ammunition, explosives, controlled drugs, stolen or counterfeit goods, and content that facilitates abuse or fraud are not allowed.",
    "How can I contact A doua șansă?": "How can I contact A doua șansă?",
    "Use the Contact page linked in the footer and on the About page.": "Use the Contact page linked in the footer and on the About page.",
    "Didn't find what you need?": "Didn't find what you need?",
    "Contact us and tell us what went wrong or what you need help with.": "Contact us and tell us what went wrong or what you need help with.",
    "Contact A doua șansă": "Contact A doua șansă",
    "We're here for questions, account problems and marketplace feedback.": "We're here for questions, account problems and marketplace feedback.",
    "Email": "Email",
    "Phone": "Phone",
    "Temporary contact details": "Temporary contact details",
    "These are temporary placeholders for now. Replace them in contact.html when your real support email and phone number are ready.": "These are temporary placeholders for now. Replace them in contact.html when your real support email and phone number are ready.",
    "Temporary support email": "Temporary support email",
    "Temporary phone number": "Temporary phone number"
});
    Object.assign(translations.ro, {
    "Seller Profile": "Profilul vânzătorului",
    "Your Profile": "Profilul tău",
    "Active listings": "Anunțuri active",
    "LISTINGS": "ANUNȚURI",
    "No active listings": "Niciun anunț activ",
    "This seller has no active listings right now.": "Acest vânzător nu are anunțuri active în acest moment.",
    "Reviews": "Recenzii",
    "Reviews from other members will appear here.": "Recenziile de la alți membri vor apărea aici.",
    "Profile unavailable": "Profil indisponibil",
    "This profile could not be found.": "Acest profil nu a putut fi găsit.",
    "Loading profile…": "Se încarcă profilul…",
    "Please wait while we load this profile.": "Așteaptă cât încărcăm acest profil.",
    "Buy": "Cumpără",
    "Save listing": "Salvează anunțul",
    "Remove from saved": "Elimină din salvate",
    "MORE TO EXPLORE": "MAI MULTE DE DESCOPERIT",
    "More like this.": "Mai multe ca acesta.",
    "A future A doua șansă buying feature. We'll announce when it becomes available.": "O funcție de cumpărare A doua șansă va fi disponibilă în viitor. Te vom anunța când apare.",
    "Current main photo": "Fotografia principală actuală",
    "Main photo": "Fotografie principală",
    "Please keep at least one photo on the listing.": "Păstrează cel puțin o fotografie în anunț.",
    "Need something?": "Ai nevoie de ceva?",
    "NEED SOMETHING?": "AI NEVOIE DE CEVA?",
    "Have a question or need help?": "Ai o întrebare sau ai nevoie de ajutor?",
    "Reach the A doua șansă team through the support and contact pages.": "Contactează echipa A doua șansă prin paginile de ajutor și contact.",
    "Contact A doua șansă →": "Contactează A doua șansă →",
    "Terms of Service": "Termeni și condiții",
    "Need Help": "Ai nevoie de ajutor",
    "Contact": "Contact",
    "Moldova marketplace": "Marketplace în Moldova",
    "© 2026 A doua șansă · Moldova": "© 2026 A doua șansă · Moldova",
    "Terms of Service — A doua șansă": "Termeni și condiții — A doua șansă",
    "Rules for using the A doua șansă marketplace.": "Regulile de utilizare a marketplace-ului A doua șansă.",
    "Effective October 4, 2026": "În vigoare din 4 octombrie 2026",
    "1. About the service": "1. Despre serviciu",
    "A doua șansă is an online marketplace that helps people discover, list and discuss goods and services offered by independent users in Moldova. A doua șansă provides the platform; individual users are responsible for the items they list and the transactions they choose to make.": "A doua șansă este un marketplace online care îi ajută pe oameni să descopere, să publice și să discute despre bunuri și servicii oferite de utilizatori independenți din Moldova. A doua șansă oferă platforma; fiecare utilizator este responsabil pentru articolele publicate și tranzacțiile pe care alege să le facă.",
    "2. Eligibility and accounts": "2. Eligibilitate și conturi",
    "You must provide accurate information when creating an account and keep your login details secure. You are responsible for activity carried out through your account. If you are under the age required to enter a binding agreement where you live, use the service with a parent or legal guardian and only in ways permitted by applicable rules.": "Trebuie să oferi informații corecte la crearea contului și să îți păstrezi datele de autentificare în siguranță. Ești responsabil pentru activitatea desfășurată prin contul tău. Dacă nu ai vârsta necesară pentru a încheia un acord obligatoriu în locul în care trăiești, folosește serviciul împreună cu un părinte sau tutore legal și numai în modurile permise de regulile aplicabile.",
    "3. Listings and truthful information": "3. Anunțuri și informații corecte",
    "Sellers must describe items honestly, use the correct category, show a realistic price and location, and upload photos that represent the item accurately. Do not impersonate another person, manipulate listings, or publish content intended to mislead buyers.": "Vânzătorii trebuie să descrie produsele sincer, să folosească categoria corectă, să afișeze un preț și o locație reale și să încarce fotografii care reprezintă corect produsul. Nu te da drept altă persoană, nu manipula anunțurile și nu publica informații menite să inducă în eroare cumpărătorii.",
    "4. Prohibited and unsafe content": "4. Conținut interzis și nesigur",
    "Do not use A doua șansă to offer illegal goods, weapons or ammunition, explosives, controlled drugs, stolen property, counterfeit goods, or other items that are unlawful or unsafe to trade. Content that facilitates fraud, harassment, threats, exploitation, or other abuse is also prohibited.": "Nu folosi A doua șansă pentru a oferi bunuri ilegale, arme sau muniție, explozibili, droguri controlate, bunuri furate, produse contrafăcute sau alte articole a căror tranzacționare este ilegală ori nesigură. Este interzis și conținutul care facilitează frauda, hărțuirea, amenințările, exploatarea sau alte abuzuri.",
    "5. Buying, selling and payments": "5. Cumpărare, vânzare și plăți",
    "A doua șansă does not currently process or guarantee payments, delivery, ownership transfer, item condition or the outcome of a transaction. Buyers and sellers must independently agree on price, payment method, collection or delivery, and any other transaction terms before exchanging an item or money.": "În prezent, A doua șansă nu procesează și nu garantează plăți, livrarea, transferul proprietății, starea produsului sau rezultatul unei tranzacții. Cumpărătorii și vânzătorii trebuie să stabilească independent prețul, metoda de plată, predarea sau livrarea și celelalte condiții înainte de a schimba un produs sau bani.",
    "6. User conduct": "6. Conduita utilizatorilor",
    "Use the marketplace respectfully. Do not spam, scrape, attack, disrupt, reverse-engineer or attempt to bypass security controls. Do not use another user's personal information for unwanted contact or harassment.": "Folosește marketplace-ul cu respect. Nu trimite spam, nu colecta automat date, nu ataca, nu perturba, nu face reverse engineering și nu încerca să ocolești măsurile de securitate. Nu folosi informațiile personale ale altui utilizator pentru contacte nedorite sau hărțuire.",
    "7. Moderation and enforcement": "7. Moderare și aplicarea regulilor",
    "A doua șansă may review, remove, hide or restrict content and accounts when reasonably necessary to protect the community, comply with rules, investigate abuse, or maintain the service. Repeated or serious violations may result in suspension or removal of an account or listing.": "A doua șansă poate verifica, elimina, ascunde sau restricționa conținutul și conturile atunci când este necesar în mod rezonabil pentru protejarea comunității, respectarea regulilor, investigarea abuzurilor sau menținerea serviciului. Încălcările repetate sau grave pot duce la suspendarea sau eliminarea unui cont ori anunț.",
    "8. Content and intellectual property": "8. Conținut și proprietate intelectuală",
    "You keep ownership of the photos, descriptions and other content you submit, while giving A doua șansă permission to host, display and format that content as needed to operate the marketplace. You must have the right to upload everything you publish. The A doua șansă name, design and platform materials may not be copied or reused without permission.": "Rămâi proprietarul fotografiilor, descrierilor și celorlalte materiale pe care le trimiți, dar oferi A doua șansă permisiunea de a găzdui, afișa și formata acel conținut în măsura necesară funcționării marketplace-ului. Trebuie să ai dreptul de a încărca tot ceea ce publici. Numele A doua șansă, designul și materialele platformei nu pot fi copiate sau reutilizate fără permisiune.",
    "9. Availability and limitations": "9. Disponibilitate și limitări",
    "The marketplace is provided on an evolving basis. Features may change, be interrupted or be removed. To the extent allowed by applicable law, A doua șansă does not promise that the service will always be available, error-free, secure, or suitable for a particular transaction or purpose.": "Marketplace-ul este oferit și dezvoltat în timp. Funcțiile se pot schimba, întrerupe sau elimina. În măsura permisă de legea aplicabilă, A doua șansă nu promite că serviciul va fi mereu disponibil, lipsit de erori, sigur sau potrivit pentru o anumită tranzacție ori utilizare.",
    "10. Changes to these terms": "10. Modificarea acestor termeni",
    "We may update these Terms of Service as the marketplace grows. When material changes are made, the updated version will be posted on this page with a new effective date. Continued use of the service after an update means you accept the revised terms to the extent permitted by law.": "Putem actualiza acești Termeni și condiții pe măsură ce marketplace-ul se dezvoltă. Atunci când apar modificări importante, versiunea actualizată va fi publicată pe această pagină cu o nouă dată de intrare în vigoare. Continuarea utilizării serviciului după o actualizare înseamnă acceptarea termenilor revizuiți, în măsura permisă de lege.",
    "Questions about these terms?": "Ai întrebări despre acești termeni?",
    "See Need Help or contact A doua șansă using the details on our Contact page.": "Vezi pagina Ai nevoie de ajutor sau contactează A doua șansă folosind datele de pe pagina Contact.",
    "Need Help — A doua șansă": "Ai nevoie de ajutor — A doua șansă",
    "Find a quick answer before you contact us.": "Găsește rapid un răspuns înainte să ne contactezi.",
    "Search questions...": "Caută întrebări...",
    "What is A doua șansă?": "Ce este A doua șansă?",
    "A doua șansă is a Moldova-focused marketplace where people can list useful items and discover things offered by other users.": "A doua șansă este un marketplace pentru Moldova unde oamenii pot publica articole utile și pot descoperi lucruri oferite de alți utilizatori.",
    "How do I publish a listing?": "Cum public un anunț?",
    "Sign in, choose Sell an item, fill in the item details, add at least one photo, then publish the listing.": "Conectează-te, alege Vinde un articol, completează detaliile, adaugă cel puțin o fotografie și apoi publică anunțul.",
    "How do I edit my listing?": "Cum îmi editez anunțul?",
    "Open your listing, press Edit, change the details you need, then press Save changes. Only the owner of a listing can edit it.": "Deschide anunțul, apasă Editează, modifică detaliile necesare și apoi apasă Salvează modificările. Doar proprietarul anunțului îl poate edita.",
    "Why isn't my listing visible?": "De ce nu este vizibil anunțul meu?",
    "Check that it was published successfully, the listing is still active, and your internet connection is working. Hidden, sold or deleted listings may not appear in public browsing.": "Verifică dacă a fost publicat cu succes, dacă anunțul este încă activ și dacă internetul funcționează. Anunțurile ascunse, vândute sau șterse pot să nu apară în explorarea publică.",
    "How do saved listings work?": "Cum funcționează anunțurile salvate?",
    "Press the heart on a listing to save it. Your saved listings are shown in your profile on the same device and account.": "Apasă inima unui anunț pentru a-l salva. Anunțurile salvate apar în profilul tău pe același dispozitiv și cont.",
    "How do I change my profile photo?": "Cum schimb fotografia de profil?",
    "Open Profile, choose Edit profile, select Change photo, and save. Profile photos must be exactly 512 × 512 pixels and use JPG, PNG or WebP.": "Deschide Profil, alege Editează profilul, selectează Schimbă fotografia și salvează. Fotografiile de profil trebuie să aibă exact 512 × 512 pixeli și să fie JPG, PNG sau WebP.",
    "Why must my profile photo be 512 × 512 pixels?": "De ce trebuie ca fotografia de profil să aibă 512 × 512 pixeli?",
    "A fixed square size keeps profile images consistent across listing cards and profile pages.": "O dimensiune pătrată fixă păstrează imaginile de profil consecvente în cardurile anunțurilor și pe paginile de profil.",
    "When will Buy be available?": "Când va fi disponibil Cumpără?",
    "The Buy button is currently a placeholder. The secure purchasing flow will be added later.": "Butonul Cumpără este momentan un placeholder. Fluxul sigur de cumpărare va fi adăugat ulterior.",
    "What items are not allowed?": "Ce articole nu sunt permise?",
    "Illegal goods, weapons or ammunition, explosives, controlled drugs, stolen or counterfeit goods, and content that facilitates abuse or fraud are not allowed.": "Nu sunt permise bunuri ilegale, arme sau muniție, explozibili, droguri controlate, bunuri furate sau contrafăcute și conținut care facilitează abuzul sau frauda.",
    "How can I contact A doua șansă?": "Cum pot contacta A doua șansă?",
    "Use the Contact page linked in the footer and on the About page.": "Folosește pagina Contact din subsol sau de pe pagina Despre.",
    "Didn't find what you need?": "Nu ai găsit ce ai nevoie?",
    "Contact us and tell us what went wrong or what you need help with.": "Contactează-ne și spune-ne ce nu a mers sau cu ce ai nevoie de ajutor.",
    "Contact A doua șansă": "Contactează A doua șansă",
    "We're here for questions, account problems and marketplace feedback.": "Suntem aici pentru întrebări, probleme cu contul și feedback despre marketplace.",
    "Email": "Email",
    "Phone": "Telefon",
    "Temporary contact details": "Date de contact temporare",
    "These are temporary placeholders for now. Replace them in contact.html when your real support email and phone number are ready.": "Acestea sunt momentan doar date temporare. Înlocuiește-le în contact.html când ai emailul și numărul real pentru suport.",
    "Temporary support email": "Email temporar pentru suport",
    "Temporary phone number": "Număr de telefon temporar"
});
    Object.assign(translations.ru, {
    "Seller Profile": "Профиль продавца",
    "Your Profile": "Ваш профиль",
    "Active listings": "Активные объявления",
    "LISTINGS": "ОБЪЯВЛЕНИЯ",
    "No active listings": "Нет активных объявлений",
    "This seller has no active listings right now.": "У этого продавца сейчас нет активных объявлений.",
    "Reviews": "Отзывы",
    "Reviews from other members will appear here.": "Здесь будут отображаться отзывы от других участников.",
    "Profile unavailable": "Профиль недоступен",
    "This profile could not be found.": "Этот профиль не удалось найти.",
    "Loading profile…": "Загрузка профиля…",
    "Please wait while we load this profile.": "Подождите, пока мы загрузим этот профиль.",
    "Buy": "Купить",
    "Save listing": "Сохранить объявление",
    "Remove from saved": "Удалить из сохранённых",
    "MORE TO EXPLORE": "ЕЩЁ МОЖНО ПОСМОТРЕТЬ",
    "More like this.": "Похожие объявления.",
    "A future A doua șansă buying feature. We'll announce when it becomes available.": "Функция покупки A doua șansă появится в будущем. Мы сообщим, когда она станет доступна.",
    "Current main photo": "Текущее главное фото",
    "Main photo": "Главное фото",
    "Please keep at least one photo on the listing.": "Оставьте хотя бы одну фотографию в объявлении.",
    "Need something?": "Нужна помощь?",
    "NEED SOMETHING?": "НУЖНА ПОМОЩЬ?",
    "Have a question or need help?": "Есть вопрос или нужна помощь?",
    "Reach the A doua șansă team through the support and contact pages.": "Свяжитесь с командой A doua șansă через страницы помощи и контактов.",
    "Contact A doua șansă →": "Связаться с A doua șansă →",
    "Terms of Service": "Условия использования",
    "Need Help": "Помощь",
    "Contact": "Контакты",
    "Moldova marketplace": "Маркетплейс Молдовы",
    "© 2026 DoaSanse · A doua șansă · Moldova": "© 2026 DoaSanse · A doua șansă · Молдова",
    "Terms of Service — A doua șansă": "Условия использования — A doua șansă",
    "Rules for using the A doua șansă marketplace.": "Правила использования маркетплейса A doua șansă.",
    "Effective October 4, 2026": "Действует с 4 октября 2026 года",
    "1. About the service": "1. О сервисе",
    "A doua șansă is an online marketplace that helps people discover, list and discuss goods and services offered by independent users in Moldova. A doua șansă provides the platform; individual users are responsible for the items they list and the transactions they choose to make.": "A doua șansă — это онлайн-маркетплейс, который помогает людям находить, размещать и обсуждать товары и услуги от независимых пользователей в Молдове. A doua șansă предоставляет платформу; каждый пользователь отвечает за свои объявления и выбранные им сделки.",
    "2. Eligibility and accounts": "2. Требования и аккаунты",
    "You must provide accurate information when creating an account and keep your login details secure. You are responsible for activity carried out through your account. If you are under the age required to enter a binding agreement where you live, use the service with a parent or legal guardian and only in ways permitted by applicable rules.": "При создании аккаунта указывайте точную информацию и храните данные для входа в безопасности. Вы отвечаете за действия, совершённые через ваш аккаунт. Если вы не достигли возраста, необходимого для заключения обязательного соглашения в вашей стране, используйте сервис вместе с родителем или законным опекуном и только в разрешённых законом пределах.",
    "3. Listings and truthful information": "3. Объявления и достоверная информация",
    "Sellers must describe items honestly, use the correct category, show a realistic price and location, and upload photos that represent the item accurately. Do not impersonate another person, manipulate listings, or publish content intended to mislead buyers.": "Продавцы должны честно описывать товары, выбирать правильную категорию, указывать реальную цену и местоположение и загружать фотографии, точно показывающие товар. Запрещено выдавать себя за другого человека, манипулировать объявлениями и публиковать информацию, вводящую покупателей в заблуждение.",
    "4. Prohibited and unsafe content": "4. Запрещённый и опасный контент",
    "Do not use A doua șansă to offer illegal goods, weapons or ammunition, explosives, controlled drugs, stolen property, counterfeit goods, or other items that are unlawful or unsafe to trade. Content that facilitates fraud, harassment, threats, exploitation, or other abuse is also prohibited.": "Не используйте A doua șansă для предложения незаконных товаров, оружия или боеприпасов, взрывчатых веществ, контролируемых наркотиков, краденого, контрафакта или других незаконных либо небезопасных предметов. Также запрещён контент, способствующий мошенничеству, домогательствам, угрозам, эксплуатации или другому злоупотреблению.",
    "5. Buying, selling and payments": "5. Покупка, продажа и платежи",
    "A doua șansă does not currently process or guarantee payments, delivery, ownership transfer, item condition or the outcome of a transaction. Buyers and sellers must independently agree on price, payment method, collection or delivery, and any other transaction terms before exchanging an item or money.": "Сейчас A doua șansă не обрабатывает и не гарантирует платежи, доставку, переход права собственности, состояние товара или результат сделки. Покупатель и продавец должны самостоятельно согласовать цену, способ оплаты, получение или доставку и другие условия до передачи товара или денег.",
    "6. User conduct": "6. Поведение пользователей",
    "Use the marketplace respectfully. Do not spam, scrape, attack, disrupt, reverse-engineer or attempt to bypass security controls. Do not use another user's personal information for unwanted contact or harassment.": "Используйте маркетплейс уважительно. Не отправляйте спам, не собирайте данные автоматически, не атакуйте и не нарушайте работу сервиса, не проводите reverse engineering и не пытайтесь обходить меры безопасности. Не используйте личные данные других пользователей для нежелательных контактов или преследования.",
    "7. Moderation and enforcement": "7. Модерация и применение правил",
    "A doua șansă may review, remove, hide or restrict content and accounts when reasonably necessary to protect the community, comply with rules, investigate abuse, or maintain the service. Repeated or serious violations may result in suspension or removal of an account or listing.": "A doua șansă может проверять, удалять, скрывать или ограничивать контент и аккаунты, когда это разумно необходимо для защиты сообщества, соблюдения правил, расследования злоупотреблений или поддержания сервиса. Повторные или серьёзные нарушения могут привести к блокировке или удалению аккаунта либо объявления.",
    "8. Content and intellectual property": "8. Контент и интеллектуальная собственность",
    "You keep ownership of the photos, descriptions and other content you submit, while giving A doua șansă permission to host, display and format that content as needed to operate the marketplace. You must have the right to upload everything you publish. The A doua șansă name, design and platform materials may not be copied or reused without permission.": "Вы сохраняете права на фотографии, описания и другой отправленный контент, но разрешаете A doua șansă хранить, показывать и форматировать его в объёме, необходимом для работы маркетплейса. Вы должны иметь право загружать всё, что публикуете. Название A doua șansă, дизайн и материалы платформы нельзя копировать или повторно использовать без разрешения.",
    "9. Availability and limitations": "9. Доступность и ограничения",
    "The marketplace is provided on an evolving basis. Features may change, be interrupted or be removed. To the extent allowed by applicable law, A doua șansă does not promise that the service will always be available, error-free, secure, or suitable for a particular transaction or purpose.": "Маркетплейс развивается, поэтому функции могут изменяться, временно прерываться или удаляться. В пределах, разрешённых применимым законодательством, A doua șansă не обещает, что сервис всегда будет доступен, работать без ошибок, быть безопасным или подходить для конкретной сделки или цели.",
    "10. Changes to these terms": "10. Изменения условий",
    "We may update these Terms of Service as the marketplace grows. When material changes are made, the updated version will be posted on this page with a new effective date. Continued use of the service after an update means you accept the revised terms to the extent permitted by law.": "Мы можем обновлять эти Условия использования по мере развития маркетплейса. При существенных изменениях обновлённая версия будет опубликована на этой странице с новой датой вступления в силу. Продолжение использования сервиса после обновления означает принятие изменённых условий в пределах, разрешённых законом.",
    "Questions about these terms?": "Есть вопросы об этих условиях?",
    "See Need Help or contact A doua șansă using the details on our Contact page.": "Откройте страницу Помощь или свяжитесь с A doua șansă по данным на странице Контакты.",
    "Need Help — A doua șansă": "Помощь — A doua șansă",
    "Find a quick answer before you contact us.": "Найдите быстрый ответ перед тем, как написать нам.",
    "Search questions...": "Поиск по вопросам...",
    "What is A doua șansă?": "Что такое A doua șansă?",
    "A doua șansă is a Moldova-focused marketplace where people can list useful items and discover things offered by other users.": "A doua șansă — это маркетплейс для Молдовы, где люди могут размещать полезные вещи и находить предложения других пользователей.",
    "How do I publish a listing?": "Как опубликовать объявление?",
    "Sign in, choose Sell an item, fill in the item details, add at least one photo, then publish the listing.": "Войдите, выберите Продать товар, заполните данные, добавьте хотя бы одну фотографию и опубликуйте объявление.",
    "How do I edit my listing?": "Как изменить моё объявление?",
    "Open your listing, press Edit, change the details you need, then press Save changes. Only the owner of a listing can edit it.": "Откройте объявление, нажмите Изменить, внесите нужные изменения и нажмите Сохранить изменения. Изменять объявление может только его владелец.",
    "Why isn't my listing visible?": "Почему моё объявление не видно?",
    "Check that it was published successfully, the listing is still active, and your internet connection is working. Hidden, sold or deleted listings may not appear in public browsing.": "Проверьте, что объявление успешно опубликовано, остаётся активным и интернет работает. Скрытые, проданные или удалённые объявления могут не отображаться в общем просмотре.",
    "How do saved listings work?": "Как работают сохранённые объявления?",
    "Press the heart on a listing to save it. Your saved listings are shown in your profile on the same device and account.": "Нажмите на сердце в объявлении, чтобы сохранить его. Сохранённые объявления показываются в вашем профиле на этом устройстве и аккаунте.",
    "How do I change my profile photo?": "Как изменить фото профиля?",
    "Open Profile, choose Edit profile, select Change photo, and save. Profile photos must be exactly 512 × 512 pixels and use JPG, PNG or WebP.": "Откройте Профиль, выберите Изменить профиль, нажмите Изменить фото и сохраните. Фото профиля должны быть ровно 512 × 512 пикселей в формате JPG, PNG или WebP.",
    "Why must my profile photo be 512 × 512 pixels?": "Почему фото профиля должно быть 512 × 512 пикселей?",
    "A fixed square size keeps profile images consistent across listing cards and profile pages.": "Фиксированный квадратный размер делает изображения профиля единообразными на карточках объявлений и страницах профиля.",
    "When will Buy be available?": "Когда появится функция Купить?",
    "The Buy button is currently a placeholder. The secure purchasing flow will be added later.": "Кнопка Купить пока является заполнителем. Безопасный процесс покупки будет добавлен позже.",
    "What items are not allowed?": "Какие товары запрещены?",
    "Illegal goods, weapons or ammunition, explosives, controlled drugs, stolen or counterfeit goods, and content that facilitates abuse or fraud are not allowed.": "Нельзя размещать незаконные товары, оружие или боеприпасы, взрывчатые вещества, контролируемые наркотики, краденое или контрафакт и контент, способствующий злоупотреблению или мошенничеству.",
    "How can I contact A doua șansă?": "Как связаться с A doua șansă?",
    "Use the Contact page linked in the footer and on the About page.": "Используйте страницу Контакты в подвале сайта или на странице О нас.",
    "Didn't find what you need?": "Не нашли нужного ответа?",
    "Contact us and tell us what went wrong or what you need help with.": "Свяжитесь с нами и расскажите, что произошло или какая помощь вам нужна.",
    "Contact A doua șansă": "Связаться с A doua șansă",
    "We're here for questions, account problems and marketplace feedback.": "Мы отвечаем на вопросы, помогаем с аккаунтом и принимаем отзывы о маркетплейсе.",
    "Email": "Email",
    "Phone": "Телефон",
    "Temporary contact details": "Временные контактные данные",
    "These are temporary placeholders for now. Replace them in contact.html when your real support email and phone number are ready.": "Сейчас это временные заполнители. Замените их в contact.html, когда будут готовы настоящие email и номер телефона поддержки.",
    "Temporary support email": "Временный email поддержки",
    "Temporary phone number": "Временный номер телефона"
});

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

        const i18nKey = element.getAttribute("data-i18n");
        if (i18nKey) {
            const translatedText = replaceBrand(translateValue(i18nKey));
            if (element.textContent !== translatedText) {
                element.textContent = translatedText;
            }
        }

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
            // The account preference has been updated before reloading,
            // so app.js cannot overwrite the new language with stale metadata.
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