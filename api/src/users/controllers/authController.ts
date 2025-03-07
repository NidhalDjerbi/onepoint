import { FastifyReply, FastifyRequest } from "fastify";
import { AuthService } from "../services/authService.js";
import { registerUserSchema } from "../schema/userSchema.js";

const authService = new AuthService();

export class AuthController {
  async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { email, password } = request.body as any;
      const user = await authService.verifyUser(email, password);

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
  async register(request: FastifyRequest, reply: FastifyReply) {
    try {
      // Validate incoming request body using Zod schema
      const validatedBody = registerUserSchema.parse(request.body);

      // Call the service method after validation
      const { firstName, lastName, email, password, birthdate } = validatedBody;
      const user = await authService.registerUser(
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
}
