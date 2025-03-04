import { pgTable, serial, text, varchar, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  birthdate: timestamp("birthdate", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
