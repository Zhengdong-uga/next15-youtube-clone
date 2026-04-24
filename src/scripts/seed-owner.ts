import "dotenv/config";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";

async function main() {
  const ownerId = process.env.OWNER_USER_ID;
  if (!ownerId) {
    console.error("OWNER_USER_ID is not set in .env");
    process.exit(1);
  }

  const name = process.env.OWNER_NAME ?? "Portfolio Owner";
  const description =
    process.env.OWNER_DESCRIPTION ??
    "Welcome to my portfolio channel! Here you'll find my projects, tutorials, and more.";
  const imageUrl =
    process.env.OWNER_IMAGE_URL ??
    "https://api.dicebear.com/7.x/initials/svg?seed=" + encodeURIComponent(name);

  console.log(`Seeding owner user with id=${ownerId} name="${name}"...`);

  try {
    const [existing] = await db.select().from(users).where(eq(users.id, ownerId));

    if (existing) {
      await db
        .update(users)
        .set({ name, description, imageUrl })
        .where(eq(users.id, ownerId));
      console.log("Owner user already existed — updated name/description/imageUrl.");
    } else {
      await db.insert(users).values({ id: ownerId, name, description, imageUrl });
      console.log("Owner user created.");
    }
  } catch (error) {
    console.error("Error seeding owner:", error);
    process.exit(1);
  }
}

main();
