import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { animeRoutes } from "./routes/anime";
import { seasonalRoutes } from "./routes/seasonal";
import { listRoutes } from "./routes/list";

const app = new Elysia()
  .use(
    cors({
      origin: process.env.CORS_ORIGIN || "*",
      methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    })
  )
  .use(animeRoutes)
  .use(seasonalRoutes)
  .use(listRoutes)
  .get("/api/health", () => ({ status: "ok", timestamp: new Date().toISOString() }))
  .listen(3000);

console.log(`Elysia server running at http://localhost:${app.server?.port}`);
