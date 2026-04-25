import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql } from "drizzle-orm";

async function main() {
  const client = postgres(process.env.DATABASE_URL!);
  const db = drizzle(client);

  console.log("Adding location and links columns to users table...");

  await db.execute(sql`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS location text;
  `);
  console.log("✓ Added location column");

  await db.execute(sql`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS links jsonb DEFAULT '[]'::jsonb;
  `);
  console.log("✓ Added links column");

  console.log("Done!");
  await client.end();
  process.exit(0);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
