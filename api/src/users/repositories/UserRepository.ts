import { db } from "../../db/index.js";
import { usersTable } from "../../db/schema.js";
import { eq, asc, desc, getTableColumns, or, ilike } from "drizzle-orm";

export class UserRepository {
  async createUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    birthdate: Date
  ) {
    const user = await db
      .insert(usersTable)
      .values({ firstName, lastName, email, password, birthdate })
      .returning();
    return user;
  }

  async getUserByEmail(email: string) {
    return db.select().from(usersTable).where(eq(usersTable.email, email));
  }

  async getUserById(id: number) {
    const { password, ...rest } = getTableColumns(usersTable);
    const user = await db
      .select({ ...rest })
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .execute();
    return user;
  }

  async getAllUsers(
    page: number,
    limit: number,
    search?: string,
    sortBy?:
      | "id"
      | "firstName"
      | "lastName"
      | "email"
      | "birthdate"
      | "createdAt",
    sortOrder?: string
  ) {
    const safePage = Math.max(1, page);
    const offset = (safePage - 1) * limit;

    const validSortBy = [
      "id",
      "firstName",
      "lastName",
      "email",
      "birthdate",
      "createdAt",
    ].includes(sortBy!)
      ? sortBy
      : "id";

    const validSortOrder = sortOrder === "desc" ? "desc" : "asc";

    let whereClause = search
      ? or(
          ilike(usersTable.email, `%${search}%`),
          ilike(usersTable.firstName, `%${search}%`),
          ilike(usersTable.lastName, `%${search}%`)
        )
      : undefined;

    const totalUsers = await db.$count(usersTable, whereClause);

    const { password, ...rest } = getTableColumns(usersTable);
    const usersList = await db
      .select({ ...rest })
      .from(usersTable)
      .where(whereClause)
      .orderBy(
        validSortOrder === "asc"
          ? asc(usersTable[validSortBy || "id"])
          : desc(usersTable[validSortBy || "id"])
      )
      .limit(limit)
      .offset(offset)
      .execute();

    return {
      total: totalUsers,
      page: safePage,
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
