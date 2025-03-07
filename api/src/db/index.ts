import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { usersTable } from "./schema.js";
import { hashSync } from "bcrypt-ts";
import { migrate } from "drizzle-orm/node-postgres/migrator";

export const db = drizzle({
  connection: {
    connectionString: process.env.DATABASE_URL!,
    ssl: false,
  },
});

export const seed = async () => {
  try {
    migrate(db, { migrationsFolder: "./drizzle" });
    
    // Seed the database
    const hashedPassword = hashSync("password", 10);
    await db
      .insert(usersTable)
      .values({
        firstName: "admin",
        lastName: "admin",
        email: "admin@test.com",
        password: hashedPassword,
        birthdate: new Date(),
      })
      .onConflictDoNothing()
      .execute();

    console.log("Seed data inserted successfully.");
  } catch (error) {
    console.error("Error during seeding:", error);
  }
};
