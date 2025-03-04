export class NotFoundError extends Error {
  status: number;
  constructor(message = "Resource not found") {
    super(message);
    this.name = "NotFoundError";
    this.status = 404;
  }
}

export class BadRequestError extends Error {
  status: number;
  constructor(message = "Invalid request") {
    super(message);
    this.name = "BadRequestError";
    this.status = 400;
  }
}

export class UnauthorizedError extends Error {
  status: number;
  constructor(message = "Unauthorized access") {
    super(message);
    this.name = "UnauthorizedError";
    this.status = 401;
  }
}

export class ForbiddenError extends Error {
  status: number;
  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
    this.status = 403;
  }
}
