import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { animeRoutes } from "./routes/anime";
import { seasonalRoutes } from "./routes/seasonal";
import { listRoutes } from "./routes/list";

const app = new Elysia()
  .use(
    cors({
      origin: ["http://localhost:5173", "http://localhost:3000"],
      methods: ["GET", "POST", "PATCH", "DELETE"],
    })
  )
  .use(animeRoutes)
  .use(seasonalRoutes)
  .use(listRoutes)
  .get("/api/health", () => ({ status: "ok", timestamp: new Date().toISOString() }))
  .listen(3000);

console.log(`Elysia server running at http://localhost:${app.server?.port}`);
