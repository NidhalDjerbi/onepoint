import { FastifyError, FastifyReply, FastifyRequest } from "fastify";

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  console.error("🔥 Error:", error);

  // Default error response
  const statusCode = error.statusCode || 500;
  let message = "Internal Server Error";

  // Handle known Fastify validation errors
  if (error.validation) {
    return reply.status(400).send({
      error: "Validation Error",
      details: error.validation,
    });
  }

  // Handle custom application errors
  if ("status" in error && "message" in error) {
    const status = typeof error.status === "number" ? error.status : 500;
    return reply.status(status).send({
      error: error.message,
    });
  }

  // Generic error response
  reply.status(statusCode).send({ error: message });
}
