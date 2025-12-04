import { Pool } from "pg";

let pool: Pool | null = null;
const RETRYABLE_PG_CODES = new Set([
  "ETIMEDOUT",
  "ECONNRESET",
  "ECONNREFUSED",
  "57P01", // admin shutdown
  "57P02", // crash
  "57P03", // cannot connect now
  "08006", // connection failure
]);

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl:
        process.env.NODE_ENV === "production"
          ? {
              rejectUnauthorized: false,
            }
          : undefined,
      connectionTimeoutMillis: 10_000,
      idleTimeoutMillis: 10_000,
      max: parseInt(process.env.PG_POOL_SIZE || "10", 10),
      keepAlive: true,
    });
  }
  return pool;
}

export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<{ rows: T[] }> {
  const p = getPool();
  let lastError: any = null;
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res = await p.query(text, params);
      return res as any;
    } catch (error: any) {
      lastError = error;
      const retryable =
        RETRYABLE_PG_CODES.has(error?.code) ||
        error?.message?.includes("Connection terminated");
      if (!retryable || attempt === 3) {
        error.message = `Database query failed after ${attempt} attempt(s): ${error.message}`;
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, attempt * 400));
    }
  }
  throw lastError;
}
