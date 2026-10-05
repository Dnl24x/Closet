(() => {
    const client = window.supabaseClient;
    const state = { activeConversationId: null, activeSellerId: null, activeListingId: null, refreshTimer: null, initialized: false };
    const el = {
        list: () => document.getElementById("conversationList"),
        thread: () => document.getElementById("messageThread"),
        empty: () => document.getElementById("messageThreadEmpty"),
        header: () => document.getElementById("messageThreadHeader"),
        headerContent: () => document.getElementById("messageThreadHeaderContent"),
        mobileBack: () => document.getElementById("messagesMobileBack"),
        messages: () => document.getElementById("messageList"),
        composer: () => document.getElementById("messageComposer"),
        input: () => document.getElementById("messageInput")
    };
    function t(v){ return typeof ClosetI18n !== "undefined" ? ClosetI18n.translateValue(v) : v; }
    function notifyNetwork(online) {
        window.dispatchEvent(new CustomEvent("closet:network", { detail: { online } }));
    }
    function isNetworkError(error) {
        const message = String(error?.message || error || "").toLowerCase();
        return error?.name === "TypeError" ||
            message.includes("failed to fetch") ||
            message.includes("networkerror") ||
            message.includes("network request failed") ||
            message.includes("load failed");
    }

    function isActuallyOffline(error = null) {
        if (window.ClosetNetwork?.isOffline) {
            return window.ClosetNetwork.isOffline();
        }

        if (navigator.onLine === false) {
            return true;
        }

        return isNetworkError(error) && navigator.onLine === false;
    }

    async function getAuthenticatedUser() {
        try {
            const { data, error } = await client.auth.getUser();

            if (error) {
                console.error("A doua șansă: auth check failed:", error);
                return { user: null, error };
            }

            return {
                user: data?.user || ClosetAuth.getUser() || null,
                error: null
            };
        } catch (error) {
            console.error("A doua șansă: auth check crashed:", error);
            return { user: null, error };
        }
    }

    function describeSupabaseError(error) {
        const code = String(error?.code || "").toUpperCase();
        const status = Number(error?.status || error?.statusCode || 0);
        const message = String(error?.message || "").toLowerCase();

        if (code === "42501" || status === 401 || status === 403) {
            return t("Your session is not authorized to access messages. Please sign in again.");
        }

        if (code === "42P01" || message.includes("could not find the table")) {
            return t("The messaging table could not be found in Supabase.");
        }

        return t("There was a problem reaching your conversations. Please try again.");
    }

    function showRetry(container, heading, message) {
        if (!container) return;

        const buttonLabel = t("Try again");
        container.innerHTML =
            "<div class=\"empty-state\">" +
            "<h3>" + esc(heading) + "</h3>" +
            "<p>" + esc(message) + "</p>" +
            "<button type=\"button\" class=\"secondary-button message-retry-button\">" +
            esc(buttonLabel) +
            "</button>" +
            "</div>";

        container.querySelector(".message-retry-button")?.addEventListener(
            "click",
            () => {
                if (state.activeConversationId) {
                    void loadThread(state.activeConversationId);
                }
                void loadConversations();
            },
            { once: true }
        );
    }


    function esc(v){ return String(v ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;"); }
    function time(v){ const d=new Date(v); return Number.isNaN(d.getTime()) ? "" : d.toLocaleString(undefined,{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}); }
    function stopRefresh(){ if(state.refreshTimer){clearInterval(state.refreshTimer);state.refreshTimer=null;} }
    function startRefresh(){ stopRefresh(); state.refreshTimer=setInterval(()=>{ if(state.activeConversationId && navigator.onLine!==false){ void loadThread(state.activeConversationId,false); void loadConversations(false); } },5000); }
    async function getOrCreateConversation(otherUserId, listingId=null){
        const user=ClosetAuth.getUser();
        if(!user || !otherUserId || user.id===otherUserId) return {success:false,message:t("You need to sign in first.")};
        const first=user.id<otherUserId?user.id:otherUserId, second=user.id<otherUserId?otherUserId:user.id;
        let q=client.from("conversations").select("id,buyer_id,seller_id,listing_id").eq("buyer_id",first).eq("seller_id",second);
        q=listingId?q.eq("listing_id",listingId):q.is("listing_id",null);
        const found=await q.maybeSingle();
        if(found.data) return {success:true,conversation:found.data};
        const created=await client.from("conversations").insert({buyer_id:first,seller_id:second,listing_id:listingId||null}).select("id,buyer_id,seller_id,listing_id").single();
        if(created.error){
            const retry=await client.from("conversations").select("id,buyer_id,seller_id,listing_id").eq("buyer_id",first).eq("seller_id",second).eq("listing_id",listingId).maybeSingle();
            if(retry.data) return {success:true,conversation:retry.data};
            throw created.error;
        }
        return {success:true,conversation:created.data};
    }
    async function loadConversations(showLoading=true){
        const list=el.list(); if(!list)return false;
        const auth = await getAuthenticatedUser();
        const user = auth.user;

        if(!user){
            if (auth.error && !isActuallyOffline(auth.error)) {
                showRetry(
                    list,
                    t("We couldn't load your messages"),
                    describeSupabaseError(auth.error)
                );
                return false;
            }

            list.innerHTML="<div class=\"empty-state\"><h3>"+esc(t("Sign in to see your messages"))+"</h3><p>"+esc(t("Your conversations will appear here."))+"</p></div>";
            return false;
        }
        if(showLoading)list.innerHTML="<div class=\"message-list-loading\">"+esc(t("Loading messages…"))+"</div>";
        const conversationFields = "id,buyer_id,seller_id,listing_id,updated_at";

        const [buyerResult, sellerResult] = await Promise.all([
            client
                .from("conversations")
                .select(conversationFields)
                .eq("buyer_id", user.id),
            client
                .from("conversations")
                .select(conversationFields)
                .eq("seller_id", user.id)
        ]);

        const firstError = buyerResult.error || sellerResult.error;

        if(firstError){
            console.error("A doua șansă: conversation load failed:", firstError);

            if(isActuallyOffline(firstError)){
                notifyNetwork(false);
                list.innerHTML="<div class=\"empty-state\"><h3>"+esc(t("You are offline"))+"</h3><p>"+esc(t("Reconnect to Wi-Fi or mobile data to load your messages."))+"</p></div>";
            } else {
                showRetry(
                    list,
                    t("We couldn't load your messages"),
                    describeSupabaseError(firstError)
                );
            }
            return false;
        }

        notifyNetwork(true);

        const conversationMap = new Map();
        [...(buyerResult.data || []), ...(sellerResult.data || [])]
            .forEach(conversation => conversationMap.set(conversation.id, conversation));

        const conversations = [...conversationMap.values()]
            .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

        if(!conversations.length){
            list.innerHTML="<div class=\"empty-state\"><h3>"+esc(t("No conversations yet"))+"</h3><p>"+esc(t("When you message a seller, your conversations will appear here."))+"</p></div>";
            return true;
        }

        const ids=[...new Set(conversations.map(c=>c.buyer_id===user.id?c.seller_id:c.buyer_id))];
        const profiles=(await client.from("profiles").select("id,display_name,username,avatar_url,avatar_color").in("id",ids)).data||[];
        const pm=new Map(profiles.map(p=>[p.id,p]));
        const lids=result.data.map(c=>c.listing_id).filter(Boolean);
        const listings=lids.length?((await client.from("listings").select("id,title").in("id",lids)).data||[]):[];
        const lm=new Map(listings.map(l=>[l.id,l]));
        list.innerHTML="";
        conversations.forEach(c=>{
            const oid=c.buyer_id===user.id?c.seller_id:c.buyer_id,p=pm.get(oid)||{},l=lm.get(c.listing_id)||{};
            const b=document.createElement("button");b.type="button";b.className="conversation-item"+(state.activeConversationId===c.id?" is-active":"");
            b.innerHTML="<span class=\"conversation-avatar\">"+(p.avatar_url?"<img src=\""+esc(p.avatar_url)+"\" alt=\"\">":esc((p.display_name||p.username||"A").charAt(0).toUpperCase()))+"</span><span class=\"conversation-copy\"><strong>"+esc(p.display_name||p.username||t("A doua șansă member"))+"</strong><span>"+esc(l.title||t("Marketplace"))+"</span></span><time>"+esc(time(c.updated_at))+"</time>";
            b.addEventListener("click",()=>void openConversation(c.id));list.appendChild(b);
        });
        return true;
    }
    async function loadThread(id,showLoading=true){
        const auth = await getAuthenticatedUser();
        const user = auth.user;
        const box = el.messages();

        if(!user||!box){
            if (box && auth.error && !isActuallyOffline(auth.error)) {
                showRetry(
                    box,
                    t("Messages could not be loaded"),
                    describeSupabaseError(auth.error)
                );
            }
            return;
        }
        if(showLoading)box.innerHTML="<div class=\"message-list-loading\">"+esc(t("Loading messages…"))+"</div>";
        const result=await client.from("messages").select("id,sender_id,body,created_at").eq("conversation_id",id).order("created_at",{ascending:true});
        if(result.error){
            console.error("A doua șansă: thread load failed:", result.error);

            if(isActuallyOffline(result.error)){
                notifyNetwork(false);
                box.innerHTML="<div class=\"empty-state\"><p>"+esc(t("You are offline. Reconnect to Wi-Fi or mobile data to load this conversation."))+"</p></div>";
            } else {
                showRetry(
                    box,
                    t("Messages could not be loaded"),
                    t("There was a problem loading this conversation. Please try again.")
                );
            }
            return;
        }
        notifyNetwork(true);
        const near=box.scrollHeight-box.scrollTop-box.clientHeight<120;box.innerHTML="";
        if(!result.data?.length)box.innerHTML="<div class=\"message-thread-empty-inline\">"+esc(t("No messages yet. Say hello!"))+"</div>";
        else result.data.forEach(m=>{const b=document.createElement("div");b.className="message-bubble "+(m.sender_id===user.id?"is-own":"is-other");b.innerHTML="<p>"+esc(m.body)+"</p><time>"+esc(time(m.created_at))+"</time>";box.appendChild(b);});
        if(near||showLoading)box.scrollTop=box.scrollHeight;
    }
    async function openConversation(id){
        state.activeConversationId=id;const thread=el.thread(),empty=el.empty();if(!thread||!empty)return;empty.hidden=true;thread.hidden=false;document.getElementById("messagesShell")?.classList.add("is-thread-open");
        const auth = await getAuthenticatedUser();
        const user = auth.user;

        if (!user) {
            if (auth.error && !isActuallyOffline(auth.error)) {
                showRetry(
                    el.messages(),
                    t("Messages could not be loaded"),
                    describeSupabaseError(auth.error)
                );
            }
            return;
        }

        const conversationResult = await client
            .from("conversations")
            .select("id,buyer_id,seller_id,listing_id")
            .eq("id",id)
            .single();

        if (conversationResult.error) {
            console.error("A doua șансă: conversation open failed:", conversationResult.error);

            showRetry(
                el.messages(),
                t("Messages could not be loaded"),
                isActuallyOffline(conversationResult.error)
                    ? t("You are offline. Reconnect to Wi-Fi or mobile data to load this conversation.")
                    : describeSupabaseError(conversationResult.error)
            );
            return;
        }

        const c = conversationResult.data;
        const oid=c.buyer_id===user.id?c.seller_id:c.buyer_id;
        const profile=(await client.from("profiles").select("id,display_name,username,avatar_url").eq("id",oid).maybeSingle()).data;
        const listing=c.listing_id?(await client.from("listings").select("id,title,price_mdl").eq("id",c.listing_id).maybeSingle()).data:null;
        state.activeSellerId=oid;state.activeListingId=c.listing_id;
        el.headerContent().innerHTML="<strong>"+esc(profile?.display_name||profile?.username||t("A doua șansă member"))+"</strong>"+(listing?.title?"<span>"+esc(listing.title)+" · "+esc(String(listing.price_mdl))+" MDL</span>":"");
        await loadThread(id);await loadConversations(false);startRefresh();
    }
    async function sendMessage(event){
        event.preventDefault();const user=ClosetAuth.getUser(),input=el.input();if(!user||!input||!state.activeConversationId)return;
        // Do not block on navigator.onLine; mobile browsers can report it incorrectly.
        const body=input.value.trim();if(!body)return;
        const button=el.composer()?.querySelector("button[type=submit]");if(button)button.disabled=true;
        const result=await client.from("messages").insert({conversation_id:state.activeConversationId,sender_id:user.id,body});if(button)button.disabled=false;
        if(result.error){
            if(isActuallyOffline(result.error)){
                notifyNetwork(false);
                window.dispatchEvent(new CustomEvent("closet:message-error",{detail:{message:t("You are offline. Your message was not sent.")}}));
            } else {
                window.dispatchEvent(new CustomEvent("closet:message-error",{detail:{message:t("Message could not be sent.")}}));
            }
            return;
        }
        notifyNetwork(true);
        input.value="";
        await client.from("conversations").update({updated_at:new Date().toISOString()}).eq("id",state.activeConversationId);
        await loadThread(state.activeConversationId,false);await loadConversations(false);
    }
    async function openConversationWithSeller(sellerId,listingId=null){
        if(!ClosetAuth.isSignedIn()){window.location.href="login.html";return;}
        if(sellerId===ClosetAuth.getUser()?.id)return;
        try{const result=await getOrCreateConversation(sellerId,listingId);if(!result.success)throw new Error(result.message);ClosetNavigation.show("messages");await openConversation(result.conversation.id);}
        catch(error){console.error("A doua șansă messaging error:",error);window.dispatchEvent(new CustomEvent("closet:message-error",{detail:{message:t("Messages are unavailable right now.")}}));}
    }
    function initialize(){
        if(state.initialized) return;
        state.initialized = true;
        notifyNetwork(true);
        el.composer()?.addEventListener("submit",sendMessage);
        el.mobileBack()?.addEventListener("click",()=>{
            state.activeConversationId=null;
            stopRefresh();
            el.thread().hidden=true;
            el.empty().hidden=false;
            document.getElementById("messagesShell")?.classList.remove("is-thread-open");
        });
        window.addEventListener("closet:navigate",event=>{if(event.detail?.view==="messages"){if(!ClosetAuth.isSignedIn()){window.location.href="login.html";return;}void loadConversations();}else stopRefresh();});
        window.addEventListener("closet:auth",()=>{if(ClosetAuth.isSignedIn()&&ClosetNavigation.getCurrentView()==="messages")void loadConversations();});
    }
    window.ClosetMessages={initialize,openConversationWithSeller,openConversation,loadConversations};
})();