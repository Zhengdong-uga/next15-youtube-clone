import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

// Reuse a single postgres connection across hot reloads in dev.
const globalForDb = globalThis as unknown as {
  client?: ReturnType<typeof postgres>;
};

const client =
  globalForDb.client ??
  postgres(process.env.DATABASE_URL!, { prepare: false });

if (process.env.NODE_ENV !== "production") globalForDb.client = client;

export const db = drizzle(client);
