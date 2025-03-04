import Fastify from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import jwt from "@fastify/jwt";
import { config } from "./config";
import { userRoutes } from "./routes/userRoutes";
import { errorHandler } from "./utils/errorHandler";

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

server.decorate("authenticate", async (request: any, reply: any) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

server.register(userRoutes);
server.setErrorHandler(errorHandler);

const start = async () => {
  try {
    await server.listen({ port: config.port, host: "0.0.0.0" });
    console.log(`🚀 Server running on http://localhost:${config.port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
