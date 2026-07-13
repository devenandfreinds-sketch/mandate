import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "node:path";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { apiRouter } from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp() {
  const app = express();
  // CLIENT_URL restricts CORS to the deployed client's origin when set (recommended in production,
  // e.g. a separate Railway service). Falls back to reflecting any origin for local/single-service use.
  app.use(cors({ origin: process.env.CLIENT_URL || true, credentials: true }));
  app.use(cookieParser());
  app.use(express.json());

  // Basic liveness check used by Railway's healthcheck. Must exist before other
  // routes so it never gets caught by the client fallback or notFoundHandler.
  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.use("/api/v1", apiRouter);
  app.use("/api", notFoundHandler);

  // Only serve a bundled client if one was actually built alongside the server (single-service
  // deployment). When the client is deployed as its own service, client/dist won't exist here and
  // this block is skipped entirely — the server then only ever serves /api/*.
  const clientDist = path.join(__dirname, "../../client/dist");
  if (existsSync(clientDist)) {
    app.use(express.static(clientDist));
    app.get(/^\/(?!api).*/, (_req, res) => {
      res.sendFile(path.join(clientDist, "index.html"));
    });
  }

  app.use(errorHandler);
  return app;
}
