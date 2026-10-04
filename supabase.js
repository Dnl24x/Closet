(() => {
const SUPABASE_URL =
"https://wdnpncgramzkvqcqeyur.supabase.co";


const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_e5gQ9HHadZ0V7bByXfSMUg_LuZHK--M";

if (!window.supabase) {
    console.error(
        "CLOSET: Supabase library was not loaded."
    );
    return;
}

window.supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


})();
