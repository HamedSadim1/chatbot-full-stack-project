import type { NextFunction, Request, Response } from "express";
import { runWithCorrelationId } from "../lib/logger";

const CORRELATION_ID_HEADER = "x-correlation-id";

export const correlationIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const raw = req.headers[CORRELATION_ID_HEADER];
  const correlationId =
    (Array.isArray(raw) ? raw[0] : raw) ?? crypto.randomUUID();

  res.setHeader(CORRELATION_ID_HEADER, correlationId);

  runWithCorrelationId(correlationId, () => {
    next();
  });
};
