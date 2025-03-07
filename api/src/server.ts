import Fastify from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import jwt from "@fastify/jwt";
import { config } from "./config.js";
import { userRoutes } from "./http/routes/userRoutes.js";
import { errorHandler } from "./utils/errorHandler.js";
import cors from "@fastify/cors";
import { authRoutes } from "./http/routes/authRoutes.js";
import { seed } from "./db/index.js";
const server = Fastify({ logger: false });

server.register(swagger, {
  swagger: {
    info: {
      title: "User API",
      version: "1.0.0",
    },
    securityDefinitions: {
      BearerAuth: {
        type: "apiKey",
        name: "Authorization",
        in: "header",
      },
    },
    security: [{ BearerAuth: [] }],
  },
  openapi: {
    info: {
      title: "User API",
      description: "API documentation for user management",
      version: "1.0.0",
    },
  },
});
server.register(swaggerUi, { routePrefix: "/docs" });

server.register(jwt, { secret: config.jwtSecret });

server.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
});

server.register(authRoutes, { prefix: "/auth" });
server.register(userRoutes, { prefix: "/users" });
server.setErrorHandler(errorHandler);

const start = async () => {
  try {
    await seed();
    await server.listen({ port: config.port, host: "0.0.0.0" });
    console.log(`🚀 Server running on http://localhost:${config.port}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
