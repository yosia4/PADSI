export async function jsonFetcher<T = any>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { "x-requested-with": "fetch" } });
  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new Error(payload?.error || "Gagal memuat data.");
  }
  return res.json();
}
