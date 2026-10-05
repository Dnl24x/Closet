import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
};

function json(data: Record<string, unknown>, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
        }
    });
}

function decodeEntities(value: string) {
    return String(value || "")
        .replace(/&amp;/gi, "&")
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
        .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));
}

function stripTags(value: string) {
    return decodeEntities(String(value || "").replace(/<[^>]*>/g, " "))
        .replace(/\s+/g, " ")
        .trim();
}

function getTagAttributes(tag: string) {
    const attrs: Record<string, string> = {};
    const attrPattern = /([a-zA-Z_:][a-zA-Z0-9_:.-]*)\s*=\s*(["'])(.*?)\2/g;
    let match: RegExpExecArray | null;

    while ((match = attrPattern.exec(tag)) !== null) {
        attrs[match[1].toLowerCase()] = decodeEntities(match[3]);
    }

    return attrs;
}

function pageTitle(html: string) {
    const match = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
    return match?.[1] ? decodeEntities(stripTags(match[1])) : "";
}

function firstHeading(html: string) {
    const match = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
    return match?.[1] ? stripTags(match[1]) : "";
}

function firstParagraph(html: string) {
    const matches = html.match(/<p\b[^>]*>([\s\S]*?)<\/p>/gi) || [];

    for (const value of matches) {
        const text = stripTags(value);
        if (text.length >= 20) {
            return text;
        }
    }

    return "";
}

function meta(html: string, name: string) {
    const wanted = String(name || "").toLowerCase();
    const tags = html.match(/<meta\b[^>]*>/gi) || [];

    for (const tag of tags) {
        const attrs = getTagAttributes(tag);
        const key =
            String(attrs.property || attrs.name || "").toLowerCase();

        if (key === wanted && attrs.content) {
            return attrs.content;
        }
    }

    return "";
}

function firstImage(html: string, pageUrl: URL) {
    const tags = html.match(/<img\b[^>]*>/gi) || [];

    for (const tag of tags) {
        const attrs = getTagAttributes(tag);

        const candidates = [
            attrs.src,
            attrs["data-src"],
            attrs["data-lazy-src"],
            attrs["data-original"]
        ].filter(Boolean);

        for (const candidate of candidates) {
            const absolute = absoluteUrl(candidate, pageUrl);

            if (
                absolute &&
                /i\.simpalsmedia\.com\/999\.md\//i.test(absolute)
            ) {
                return absolute;
            }
        }
    }

    return "";
}

function absoluteUrl(value: string, pageUrl: URL) {
    try {
        return new URL(value, pageUrl).href;
    } catch {
        return "";
    }
}

function parseNumeric(value: string) {
    const clean = String(value || "")
        .replace(/\s/g, "")
        .replace(",", ".")
        .replace(/[^0-9.]/g, "");

    const number = Number(clean);
    return Number.isFinite(number) ? number : null;
}

function detectPrice(html: string) {
    const amountMeta =
        meta(html, "product:price:amount") ||
        meta(html, "og:price:amount");

    const currencyMeta =
        meta(html, "product:price:currency") ||
        meta(html, "og:price:currency");

    const amount = parseNumeric(amountMeta);

    if (amount !== null && currencyMeta) {
        return {
            value: amount,
            currency: currencyMeta.toUpperCase()
        };
    }

    const visibleText = stripTags(html).slice(0, 250000);

    const patterns = [
        /(\d[\d\s.,]*)\s*(EUR|EURO|€)/i,
        /(€|EUR|EURO)\s*(\d[\d\s.,]*)/i,
        /(\d[\d\s.,]*)\s*(MDL|LEI|L)/i
    ];

    for (const pattern of patterns) {
        const match = visibleText.match(pattern);
        if (!match) continue;

        const first = parseNumeric(match[1]);
        const second = parseNumeric(match[2]);

        if (first !== null && /EUR|EURO|€/i.test(match[2] || "")) {
            return { value: first, currency: "EUR" };
        }

        if (second !== null && /EUR|EURO|€/i.test(match[1] || "")) {
            return { value: second, currency: "EUR" };
        }

        if (first !== null && /MDL|LEI/i.test(match[2] || "")) {
            return { value: first, currency: "MDL" };
        }

        if (second !== null && /MDL|LEI/i.test(match[1] || "")) {
            return { value: second, currency: "MDL" };
        }
    }

    return null;
}

async function getEurMdlRate() {
    const now = new Date();
    const date = [
        String(now.getUTCDate()).padStart(2, "0"),
        String(now.getUTCMonth() + 1).padStart(2, "0"),
        now.getUTCFullYear()
    ].join(".");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    let response;

    try {
        response = await fetch(
            `https://www.bnm.md/en/official_exchange_rates?get_xml=1&date=${date}`,
            {
                headers: {
                    "User-Agent": "A doua sansa importer/1.0"
                },
                signal: controller.signal
            }
        );
    } finally {
        clearTimeout(timeout);
    }

    if (!response.ok) {
        throw new Error("BNM exchange-rate request failed.");
    }

    const xml = await response.text();
    const match = xml.match(
        /<CharCode>\s*EUR\s*<\/CharCode>[\s\S]*?<Value>\s*([0-9.,]+)\s*<\/Value>/i
    );

    const rate = parseNumeric(match?.[1] || "");

    if (!rate || rate <= 0) {
        throw new Error("EUR/MDL rate was not found.");
    }

    return rate;
}

async function requireUser(request: Request) {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !anonKey) return null;

    const authorization = request.headers.get("Authorization") || "";
    const token = authorization.replace(/^Bearer\s+/i, "").trim();

    if (!token) return null;

    const client = createClient(supabaseUrl, anonKey);
    const { data, error } = await client.auth.getUser(token);

    if (error || !data.user) return null;

    return data.user;
}

Deno.serve(async request => {
    if (request.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    if (request.method !== "POST") {
        return json({ error: "Method not allowed." }, 405);
    }

    const user = await requireUser(request);
    if (!user) {
        return json({ error: "Authentication required." }, 401);
    }

    let body: { url?: string };

    try {
        body = await request.json();
    } catch {
        return json({ error: "Invalid request body." }, 400);
    }

    let sourceUrl: URL;

    try {
        sourceUrl = new URL(String(body.url || ""));
    } catch {
        return json({ error: "Invalid URL." }, 400);
    }

    const hostname = sourceUrl.hostname.toLowerCase();

    if (hostname !== "999.md" && !hostname.endsWith(".999.md")) {
        return json({ error: "Only 999.md URLs are supported." }, 400);
    }

    sourceUrl.hash = "";

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
        const response = await fetch(sourceUrl.href, {
            headers: {
                "Accept": "text/html,application/xhtml+xml",
                "Accept-Language": "ro-RO,ro;q=0.9,en-US;q=0.8,en;q=0.7",
                "Cache-Control": "no-cache",
                "Pragma": "no-cache",
                "Referer": "https://999.md/",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/138.0.0.0 Safari/537.36"
            },
            signal: controller.signal,
            redirect: "follow"
        });

        if (!response.ok) {
            if (response.status === 403 || response.status === 429) {
                return json({
                    error: "999.md temporarily refused this request. Please try again in a moment.",
                    status: response.status
                }, 429);
            }

            return json({
                error: "999.md did not return a readable listing page.",
                status: response.status
            }, 400);
        }

        const contentType = response.headers.get("content-type") || "";

        if (!contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) {
            return json({ error: "That 999.md link is not a web listing page." }, 400);
        }

        const html = (await response.text()).slice(0, 3_000_000);

        if (!html.trim()) {
            return json({
                error: "999.md returned an empty listing page."
            }, 502);
        }

        const title =
            meta(html, "og:title") ||
            meta(html, "twitter:title") ||
            pageTitle(html) ||
            firstHeading(html);

        const description =
            meta(html, "og:description") ||
            meta(html, "description") ||
            firstParagraph(html);

        const imageMeta =
            meta(html, "og:image") ||
            meta(html, "twitter:image") ||
            "";

        const imageUrl =
            absoluteUrl(imageMeta, sourceUrl) ||
            firstImage(html, sourceUrl);

        const sourcePrice = detectPrice(html);

        let priceMdl: number | null = null;
        let exchangeRate: number | null = null;

        if (sourcePrice?.currency === "MDL") {
            priceMdl = Math.round(sourcePrice.value * 100) / 100;
        } else if (sourcePrice?.currency === "EUR") {
            try {
                exchangeRate = await getEurMdlRate();
                priceMdl = Math.round(sourcePrice.value * exchangeRate * 100) / 100;
            } catch (error) {
                console.warn("A doua sansa EUR conversion unavailable:", error);
            }
        }

        return json({
            sourceUrl: sourceUrl.href,
            title: stripTags(title),
            description: stripTags(description),
            imageUrl,
            sourcePrice,
            priceMdl,
            exchangeRate
        });
    } catch (error) {
        console.error("fetch-999-meta error:", error);

        return json({
            error: "We could not reach that 999.md listing. Please try again."
        }, 502);
    } finally {
        clearTimeout(timeout);
    }
});
