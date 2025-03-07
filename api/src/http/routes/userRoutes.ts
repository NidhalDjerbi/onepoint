import { FastifyInstance } from "fastify";
import { UserController } from "../../users/controllers/userController.js";
import {
  registerUserJsonSchema,
  updateUserJsonSchema,
  userIdJsonSchema,
} from "../../users/schema/userSchema.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const userController = new UserController();

export async function userRoutes(fastify: FastifyInstance) {
  fastify.post("/", {
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
    preHandler: authMiddleware,
    handler: userController.createUser,
  });

  fastify.put("/:id", {
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
    preHandler: authMiddleware,
    handler: userController.updateUser,
  });

  fastify.get("/", { preHandler: authMiddleware }, userController.getAllUsers);

  fastify.get("/:id", {
    schema: {
      description: "Get a user by ID",
      params: userIdJsonSchema,
      response: {
        200: {
          description: "User found",
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
    preHandler: authMiddleware,
    handler: userController.getUserById,
  });

  fastify.delete("/:id", {
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
    preHandler: authMiddleware,
    handler: userController.deleteUser,
  });
}
