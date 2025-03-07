import { BadRequestError, NotFoundError } from "../../utils/errors.js";
import { UserRepository } from "../repositories/UserRepository.js";
import { compareSync, hashSync } from "bcrypt-ts";

export class AuthService {
  private userRepo = new UserRepository();

  async registerUser(
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

  async verifyUser(email: string, password: string) {
    const user = await this.userRepo.getUserByEmail(email);

    if (user.length === 0) {
      throw new NotFoundError("Invalid email or password");
    }
    const isMatch = compareSync(password, user[0].password);

    if (!isMatch) {
      throw new NotFoundError("Invalid email or password");
    }

    return user;
  }
}
