import { FastifyInstance } from "fastify";
import {
  loginSchemaJson,
  registerUserJsonSchema,
} from "../../users/schema/userSchema.js";
import { AuthController } from "../../users/controllers/authController.js";

const authController = new AuthController();

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/login", {
    schema: {
      body: loginSchemaJson, // ✅ Validate request body
      response: {
        200: {
          type: "object",
          properties: {
            message: { type: "string" },
            data: { type: "string" },
          },
        },
        400: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
    handler: authController.login,
  });

  fastify.post("/register", {
    schema: {
      description: "Register a new user",
      body: registerUserJsonSchema,
      response: {
        201: {
          description: "User registred successfully",
          type: "object",
          properties: {
            id: { type: "number" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            email: { type: "string" },
            birthdate: { type: "string" },
          },
        },
        400: {
          description: "Validation error",
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
    handler: authController.register,
  });
}
