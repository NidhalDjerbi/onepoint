import { BadRequestError, NotFoundError } from "../../utils/errors.js";

import { UserRepository } from "../repositories/UserRepository.js";
import { hashSync } from "bcrypt-ts";
interface GetUsersParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?:
    | "id"
    | "firstName"
    | "lastName"
    | "email"
    | "birthdate"
    | "createdAt";
  sortOrder?: "asc" | "desc";
}

export class UserService {
  private userRepo = new UserRepository();

  async createUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    birthdate: Date
  ) {
    // Vérifier si l'email existe déjà
    const existingUser = await this.userRepo.getUserByEmail(email);
    if (existingUser.length > 0) {
      throw new BadRequestError("Email already registered");
    }

    // Hasher le mot de passe (on ajoutera bcrypt après)
    const hashedPassword = hashSync(password, 10);

    return this.userRepo.createUser(
      firstName,
      lastName,
      email,
      hashedPassword,
      birthdate
    );
  }

  async getAllUsers({
    page,
    limit,
    search,
    sortBy,
    sortOrder,
  }: GetUsersParams) {
    return this.userRepo.getAllUsers(page, limit, search, sortBy, sortOrder);
  }

  async getUserById(id: number) {
    const user = await this.userRepo.getUserById(id);

    if (user.length === 0) {
      throw new NotFoundError("User not found");
    }

    return user;
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
    // Vérifier si l'utilisateur existe
    const existingUser = await this.userRepo.getUserById(id);
    if (existingUser.length === 0) {
      throw new NotFoundError("User not found");
    }

    return this.userRepo.updateUser(id, data);
  }

  async deleteUser(id: number) {
    // Vérifier si l'utilisateur existe
    const existingUser = await this.userRepo.getUserById(id);
    if (existingUser.length === 0) {
      throw new NotFoundError("User not found");
    }
    return this.userRepo.deleteUser(id);
  }
}
