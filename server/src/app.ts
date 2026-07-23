import express from "express";
import cors from "cors";
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
  // credentials: true is no longer required for auth (bearer token, not a cookie -- see
  // middleware/adminAuth.ts) but is harmless to leave for any future cookie-based use.
  app.use(cors({ origin: process.env.CLIENT_URL || true, credentials: true }));
  app.use(express.json());

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
