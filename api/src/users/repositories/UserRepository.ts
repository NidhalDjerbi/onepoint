import { db } from "../../db/index";
import { usersTable } from "../../db/schema";
import { eq, like, and, asc, desc } from "drizzle-orm";

export class UserRepository {
  async createUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    birthdate: Date
  ) {
    return db
      .insert(usersTable)
      .values({ firstName, lastName, email, password, birthdate })
      .returning();
  }

  async getUserByEmail(email: string) {
    return db.select().from(usersTable).where(eq(usersTable.email, email));
  }

  async getUserById(id: number) {
    return db.select().from(usersTable).where(eq(usersTable.id, id));
  }

  async getAllUsers(
    page: number,
    limit: number,
    search?: string,
    sortBy?: "id" | "firstName" | "lastName" | "email" | "birthdate" | "createdAt",
    sortOrder?: string
  ) {
    const offset = (page - 1) * limit;

    let whereClause = and();

    if (search) {
      whereClause = and(
        whereClause,
        like(usersTable.email, `%${search}%`),
        like(usersTable.firstName, `%${search}%`),
        like(usersTable.lastName, `%${search}%`)
      );
    }
    const totalUsers = await db
      .select()
      .from(usersTable)
      .where(whereClause)
      .execute();
    const usersList = await db
      .select()
      .from(usersTable)
      .where(whereClause)
      .orderBy(
        sortOrder === "asc" ? asc(usersTable[sortBy || "id"]) : desc(usersTable[sortBy || "id"])
      )
      .limit(limit)
      .offset(offset)
      .execute();
    return {
      total: totalUsers.length,
      page,
      limit,
      users: usersList,
    };
  }

  async updateUser(
    id: number,
    data: Partial<{
      firstName: string;
      lastName: string;
      email: string;
      birthdate: Date;
    }>
  ) {
    return db
      .update(usersTable)
      .set(data)
      .where(eq(usersTable.id, id))
      .returning();
  }

  async deleteUser(id: number) {
    return db.delete(usersTable).where(eq(usersTable.id, id)).returning();
  }
}
