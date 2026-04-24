import "dotenv/config";
import postgres from "postgres";

async function main() {
  const sql = postgres(process.env.DATABASE_URL!, { prepare: false });
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS description text`;
  console.log("description column added to users table");
  await sql.end();
}

main();
