import { FastifyReply, FastifyRequest } from "fastify";
import { UnauthorizedError } from "../../utils/errors.js";

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    await request.jwtVerify();
  } catch (error) {
    throw new UnauthorizedError();
  }
}
