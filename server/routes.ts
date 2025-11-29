import type { Express } from "express";
import { createServer } from "http";
import pinterestRoutes from "./routes/pinterest";

export function registerRoutes(app: Express) {
  // Pinterest automation routes
  app.use("/api/pinterest", pinterestRoutes);

  const httpServer = createServer(app);
  return httpServer;
}
