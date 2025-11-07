// ✅ Hanya untuk SERVER COMPONENT
import "server-only";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { query } from "./db";

const COOKIE = process.env.SESSION_COOKIE_NAME || "padsi_session";

/**
 * Membuat sesi login baru
 */
export async function createSession(userId: number) {
  const sid = randomUUID();
  const exp = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 hari

  await query(
    "INSERT INTO sessions (session_id, user_id, expires_at) VALUES ($1, $2, $3)",
    [sid, userId, exp]
  );

  // ✅ Sekarang cookies() harus di-await
  const cookieStore = await cookies();
  cookieStore.set(COOKIE, sid, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: true,
    expires: exp,
  });
}

/**
 * Menghapus sesi login (logout)
 */
export async function destroySession() {
  const cookieStore = await cookies();
  const c = cookieStore.get(COOKIE);
  if (c?.value) {
    await query("DELETE FROM sessions WHERE session_id = $1", [c.value]);
    cookieStore.delete(COOKIE);
  }
}

/**
 * Mendapatkan data user dari sesi aktif
 */
export async function getSessionUser() {
  const cookieStore = await cookies();
  const c = cookieStore.get(COOKIE);
  if (!c?.value) return null;

  const { rows } = await query(
    `
    SELECT u.id, u.email, u.name, u.role
    FROM sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.session_id = $1
      AND s.expires_at > NOW()
  `,
    [c.value]
  );

  return rows[0] || null;
}

/**
 * Mengecek apakah user punya role tertentu
 */
export async function requireRole(roles: ("OWNER" | "PEGAWAI")[]) {
  const user = await getSessionUser();
  if (!user) return { ok: false as const, user: null };
  if (!roles.includes(user.role)) return { ok: false as const, user };
  return { ok: true as const, user };
}
