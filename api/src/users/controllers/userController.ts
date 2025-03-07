import { FastifyReply, FastifyRequest } from "fastify";
import { UserService } from "../services/UserService.js";
import { registerUserSchema, updateUserSchema } from "../schema/userSchema.js";

const userService = new UserService();

export class UserController {
  // Method to handle user registration
  async createUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      // Validate incoming request body using Zod schema
      const validatedBody = registerUserSchema.parse(request.body);

      // Call the service method after validation
      const { firstName, lastName, email, password, birthdate } = validatedBody;
      const user = await userService.createUser(
        firstName,
        lastName,
        email,
        password,
        new Date(birthdate)
      );

      return reply.status(201).send(user[0]);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  }

  // Method to handle getting all users
  async getAllUsers(request: FastifyRequest, reply: FastifyReply) {
    const { page, limit, search, sortBy, sortOrder } = request.query as any;
    const users = await userService.getAllUsers({
      page: Number(page),
      limit: Number(limit),
      search,
      sortBy,
      sortOrder,
    });
    return reply.send(users);
  }

  // Method to handle getting a user by ID
  async getUserById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const user = await userService.getUserById(Number(id));

      return reply.send(user[0]);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  }

  // Method to update user details
  async updateUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      // Validate the incoming request body using Zod schema
      const validatedBody = updateUserSchema.parse(request.body);
      const user = await userService.updateUser(Number(id), {
        ...validatedBody,
        birthdate: validatedBody.birthdate
          ? new Date(validatedBody.birthdate)
          : undefined,
      });
      return reply.send(user);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  }

  // Method to handle user deletion
  async deleteUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };

      await userService.deleteUser(Number(id));
      return reply.status(204).send();
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  }
}
