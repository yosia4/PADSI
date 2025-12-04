module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/pg [external] (pg, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("pg", () => require("pg"));

module.exports = mod;
}),
"[project]/src/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "query",
    ()=>query
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/pg [external] (pg, cjs)");
;
let pool = null;
const RETRYABLE_PG_CODES = new Set([
    "ETIMEDOUT",
    "ECONNRESET",
    "ECONNREFUSED",
    "57P01",
    "57P02",
    "57P03",
    "08006"
]);
function getPool() {
    if (!pool) {
        pool = new __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__cjs$29$__["Pool"]({
            connectionString: process.env.DATABASE_URL,
            ssl: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : undefined,
            connectionTimeoutMillis: 10_000,
            idleTimeoutMillis: 10_000,
            max: parseInt(process.env.PG_POOL_SIZE || "10", 10),
            keepAlive: true
        });
    }
    return pool;
}
async function query(text, params) {
    const p = getPool();
    let lastError = null;
    for(let attempt = 1; attempt <= 4; attempt++){
        try {
            const res = await p.query(text, params);
            return res;
        } catch (error) {
            lastError = error;
            const retryable = RETRYABLE_PG_CODES.has(error?.code) || error?.message?.includes("Connection terminated");
            if (!retryable || attempt === 3) {
                error.message = `Database query failed after ${attempt} attempt(s): ${error.message}`;
                throw error;
            }
            await new Promise((resolve)=>setTimeout(resolve, attempt * 400));
        }
    }
    throw lastError;
}
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/src/lib/session.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ✅ Hanya untuk SERVER COMPONENT
__turbopack_context__.s([
    "createSession",
    ()=>createSession,
    "destroySession",
    ()=>destroySession,
    "getSessionUser",
    ()=>getSessionUser,
    "requireRole",
    ()=>requireRole
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/server-only/empty.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-route] (ecmascript)");
;
;
;
;
const COOKIE = process.env.SESSION_COOKIE_NAME || "padsi_session";
const SESSION_TTL_MS = 2 * 24 * 60 * 60 * 1000; // 2 hari
async function createSession(userId) {
    const sid = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomUUID"])();
    const exp = new Date(Date.now() + SESSION_TTL_MS);
    // hapus sesi lama supaya tidak ada token usang ketika role berubah
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])("DELETE FROM sessions WHERE user_id = $1", [
        userId
    ]);
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])("INSERT INTO sessions (session_id, user_id, expires_at) VALUES ($1, $2, $3)", [
        sid,
        userId,
        exp
    ]);
    // ✅ Sekarang cookies() harus di-await
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    const isProd = ("TURBOPACK compile-time value", "development") === "production";
    cookieStore.set(COOKIE, sid, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProd,
        expires: exp
    });
}
async function destroySession() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    const c = cookieStore.get(COOKIE);
    if (c?.value) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])("DELETE FROM sessions WHERE session_id = $1", [
            c.value
        ]);
        cookieStore.delete(COOKIE);
    }
}
async function getSessionUser() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    const c = cookieStore.get(COOKIE);
    if (!c?.value) return null;
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])("ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_data TEXT");
    const { rows } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`
    SELECT u.id, u.email, u.name, u.role, u.avatar_data
    FROM sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.session_id = $1
      AND s.expires_at > NOW()
  `, [
        c.value
    ]);
    return rows[0] || null;
}
async function requireRole(roles) {
    const user = await getSessionUser();
    if (!user) return {
        ok: false,
        user: null
    };
    if (!roles.includes(user.role)) return {
        ok: false,
        user
    };
    return {
        ok: true,
        user
    };
}
}),
"[project]/src/app/api/login/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/session.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
;
;
;
const attempts = new Map();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
function getClientKey(req) {
    const forwarded = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    return forwarded?.split(",")[0]?.trim() || realIp || req.headers.get("cf-connecting-ip") || "unknown";
}
function isBlocked(key) {
    const info = attempts.get(key);
    if (!info) return false;
    if (Date.now() > info.expiresAt) {
        attempts.delete(key);
        return false;
    }
    return info.count >= RATE_LIMIT_MAX;
}
function recordFailedAttempt(key) {
    const now = Date.now();
    const info = attempts.get(key);
    if (!info || now > info.expiresAt) {
        attempts.set(key, {
            count: 1,
            expiresAt: now + RATE_LIMIT_WINDOW_MS
        });
    } else {
        info.count += 1;
        attempts.set(key, info);
    }
}
function clearAttempts(key) {
    attempts.delete(key);
}
function hashPassword(password) {
    const salt = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomBytes"])(16).toString("hex");
    const hash = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["scryptSync"])(password, salt, 64).toString("hex");
    return `${salt}:${hash}`;
}
function verifyPassword(plain, stored) {
    if (!stored.includes(":")) {
        return plain === stored;
    }
    const [salt, originalHash] = stored.split(":");
    const hashedBuffer = Buffer.from(originalHash, "hex");
    const derived = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["scryptSync"])(plain, salt, 64);
    if (hashedBuffer.length !== derived.length) return false;
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["timingSafeEqual"])(derived, hashedBuffer);
}
async function POST(req) {
    const form = await req.formData();
    const rawEmail = String(form.get("email") || "").trim();
    const email = rawEmail.toLowerCase();
    const password = String(form.get("password") || "");
    const clientKey = getClientKey(req);
    if (!rawEmail) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/login?error=email_empty", req.url));
    }
    if (!password) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/login?error=password_empty", req.url));
    }
    if (isBlocked(clientKey)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/login?error=rate", req.url));
    }
    const { rows } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])("SELECT id, email, name, role, password FROM users WHERE LOWER(email)=$1", [
        email
    ]);
    const user = rows[0];
    if (!user || !verifyPassword(password, user.password)) {
        recordFailedAttempt(clientKey);
        const err = !user ? "email_invalid" : "password_invalid";
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL(`/login?error=${err}`, req.url));
    }
    // upgrade hash jika masih plaintext
    if (!user.password.includes(":")) {
        const newHash = hashPassword(password);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])("UPDATE users SET password=$1 WHERE id=$2", [
            newHash,
            user.id
        ]);
    }
    clearAttempts(clientKey);
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createSession"])(user.id);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/dashboard", req.url));
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__90a38b04._.js.map