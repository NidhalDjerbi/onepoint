import { FastifyReply, FastifyRequest } from "fastify";
import { UserService } from "../services/UserService";
import { registerUserSchema, updateUserSchema } from "../schema/userSchema";

const userService = new UserService();

export class UserController {
  async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { email, password } = request.body as any;
      const user = await userService.verifyUser(email, password);

      const token = request.server.jwt.sign({
        id: user[0].id,
        email: user[0].email,
      });

      return reply.send({ message: "Login successful", data: token });
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  }

  // Method to handle user registration
  async registerUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      // Validate incoming request body using Zod schema
      const validatedBody = registerUserSchema.parse(request.body);

      // Call the service method after validation
      const { firstName, lastName, email, password, birthdate } = validatedBody;
      const user = await userService.registerUser(
        firstName,
        lastName,
        email,
        password,
        new Date(birthdate)
      );

      return reply.status(201).send(user);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  }

  // Method to handle getting all users
  async getAllUsers(request: FastifyRequest, reply: FastifyReply) {
    const { page = 1, limit = 10, search, sortBy, sortOrder } = request.query as any;
    const users = await userService.getAllUsers({
      page: Number(page),
      limit: Number(limit),
      search,
      sortBy,
      sortOrder
    });
    return reply.send(users);
  }

  // Method to update user details
  async updateUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params;
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
      const { id } = request.params;

      await userService.deleteUser(Number(id));
      return reply.status(204).send();
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  }
}
