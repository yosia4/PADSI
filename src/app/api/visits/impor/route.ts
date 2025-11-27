import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { ensureVisitsImportedAtColumn } from "@/lib/schema";

const expectsJson = (req: NextRequest) =>
  req.headers.get("x-requested-with") === "fetch";

async function updateCustomerEmail(
  customerId: number,
  currentEmail: string | null,
  nextEmail: string | null
) {
  if (!nextEmail) return;
  const normalizedCurrent = currentEmail?.toLowerCase() ?? null;
  const normalizedNext = nextEmail.toLowerCase();
  if (normalizedCurrent === normalizedNext) return;
  await query("UPDATE customers SET email = $1 WHERE id = $2", [
    nextEmail,
    customerId,
  ]);
}

function normalizeKey(key: string) {
  return key
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function withNormalizedKeys(record: Record<string, any>) {
  if (!record || typeof record !== "object") return record;
  const merged: Record<string, any> = {};
  for (const [key, value] of Object.entries(record)) {
    if (typeof key !== "string") continue;
    merged[key] = value;
    const normalized = normalizeKey(key);
    if (normalized && !(normalized in merged)) {
      merged[normalized] = value;
    }
  }
  return merged;
}

// helper simple buat parse CSV
function parseCsv(text: string) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length <= 1) return [];
  const headers = lines[0].split(",").map((h) => h.trim());
  const rows: any[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const cols = line.split(","); // sederhana, cukup untuk format basic
    const row: any = {};
    headers.forEach((h, idx) => {
      row[h] = (cols[idx] || "").replace(/^"|"$/g, "").trim();
    });
    rows.push(row);
  }

  return rows;
}

export async function POST(req: NextRequest) {
  await ensureVisitsImportedAtColumn();
  const form = await req.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "File tidak ditemukan" },
      { status: 400 }
    );
  }

  const text = await file.text();
  let records: any[] = [];

  // Cek JSON vs CSV
  const trimmed = text.trim();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    // JSON mode → sesuai spesifikasi yang kamu tulis
    const json = JSON.parse(trimmed);

    if (Array.isArray(json)) {
      records = json;
    } else if (Array.isArray(json.data)) {
      records = json.data;
    } else {
      return NextResponse.json(
        { error: "Struktur JSON tidak dikenali" },
        { status: 400 }
      );
    }
  } else {
    // CSV mode
    records = parseCsv(text);
  }

  records = records
    .map((rec) => withNormalizedKeys(rec))
    .filter((rec) => rec && typeof rec === "object");

  if (records.length === 0) {
    return NextResponse.json(
      { error: "Tidak ada data yang bisa diproses dari file tersebut." },
      { status: 400 }
    );
  }

  let importedCount = 0;
  let skippedCount = 0;

  // Proses tiap baris transaksi
  for (const row of records) {
    // Sesuaikan nama field dengan spesifikasi kamu
    const nama =
      row.nama_pelanggan || row.customer_name || row.nama || null;
    const rawEmail =
      row.email ||
      row.email_pelanggan ||
      row.mail ||
      null;
    const email =
      typeof rawEmail === "string" ? rawEmail.trim() || null : null;
    const emailNormalized = email ? email.toLowerCase() : null;
    const phone =
      row.nomor_telepon || row.phone || row.no_hp || null;
    const tanggalRaw =
      row.tanggal_transaksi || row.visited_at || row.tanggal || null;
    const total =
      Number(row.total_transaksi ?? row.total_spend ?? 0) || 0;
    const poin =
      Number(row.poin_didapat ?? row.earned_pts ?? 0) || 0;

    if (!nama && !phone && !email) {
      // kalau nggak ada identitas dasar, skip
      skippedCount++;
      continue;
    }

    // --- Cari / buat customer ---
    let customerId: number | null = null;

    if (phone) {
      const { rows } = await query(
        "SELECT id, email FROM customers WHERE phone = $1",
        [phone]
      );
      if (rows[0]) {
        customerId = rows[0].id;
        await updateCustomerEmail(customerId, rows[0].email, email);
      }
    }

    if (!customerId && emailNormalized) {
      const { rows } = await query(
        "SELECT id, email FROM customers WHERE LOWER(email) = $1",
        [emailNormalized]
      );
      if (rows[0]) {
        customerId = rows[0].id;
        await updateCustomerEmail(customerId, rows[0].email, email);
      }
    }

    if (!customerId && nama) {
      // coba cari berdasarkan nama kalau belum ketemu
      const { rows } = await query(
        "SELECT id, email FROM customers WHERE name = $1",
        [nama]
      );
      if (rows[0]) {
        customerId = rows[0].id;
        await updateCustomerEmail(customerId, rows[0].email, email);
      }
    }

    if (!customerId) {
      // buat pelanggan baru
      const { rows } = await query(
        "INSERT INTO customers (name, email, phone, total_visits, points) VALUES ($1,$2,$3,0,0) RETURNING id",
        [nama || email || "Tanpa Nama", email, phone]
      );
      customerId = rows[0].id;
    }

    // --- Insert ke visits ---
    const visitedAt = tanggalRaw
      ? new Date(tanggalRaw)
      : new Date();

    await query(
      "INSERT INTO visits (customer_id, visited_at, total_spend, earned_pts, is_active) VALUES ($1,$2,$3,$4,true)",
      [customerId, visitedAt, total, poin]
    );

    // --- Update summary pelanggan ---
    await query(
      "UPDATE customers SET total_visits = total_visits + 1, points = points + $1 WHERE id = $2",
      [poin, customerId]
    );

    importedCount++;
  }

  if (importedCount === 0) {
    return NextResponse.json(
      {
        error:
          "Tidak ada baris valid yang diimpor. Pastikan kolom nama, email, atau nomor telepon terisi.",
        skipped: skippedCount,
      },
      { status: 400 }
    );
  }

  if (expectsJson(req)) {
    return NextResponse.json({
      success: true,
      imported: importedCount,
      skipped: skippedCount,
    });
  }

  // Setelah impor selesai balik ke /riwayat
  return NextResponse.redirect(new URL("/riwayat", req.url));
}
