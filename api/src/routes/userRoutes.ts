import { FastifyInstance } from "fastify";
import { UserController } from "../users/controllers/userController";
import {
  loginSchemaJson,
  registerUserJsonSchema,
  updateUserJsonSchema,
  userIdJsonSchema,
} from "../users/schema/userSchema";
import { authMiddleware } from "../middlewares/authMiddleware";

const userController = new UserController();

export async function userRoutes(fastify: FastifyInstance) {
  fastify.post("/users/login", {
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
    handler: userController.login,
  });

  fastify.post("/users", {
    schema: {
      description: "Create a new user",
      body: registerUserJsonSchema, // ✅ Correctly converted Zod schema for request body
      response: {
        201: {
          description: "User created successfully",
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
    handler: userController.registerUser,
  });

  fastify.put("/users/:id", {
    schema: {
      description: "Update a user",
      params: {
        type: "object",
        properties: {
          id: { type: "number" },
        },
      },
      body: updateUserJsonSchema, // ✅ Correctly converted Zod schema for request body
      response: {
        200: {
          description: "User updated successfully",
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
    handler: userController.updateUser,
  });

  fastify.get(
    "/users",
    { preHandler: authMiddleware },
    userController.getAllUsers
  );

  fastify.delete("/users/:id", {
    schema: {
      description: "Delete a user",
      params: userIdJsonSchema,
      response: {
        200: {
          description: "User deleted successfully",
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
    handler: userController.deleteUser,
  });
}
