import { Elysia, t } from "elysia";
import { fetchJikan } from "../utils/jikan";

export const seasonalRoutes = new Elysia({ prefix: "/api/seasonal" })
  .get(
    "/now",
    async ({ query }) => {
      return fetchJikan("/seasons/now", {
        page: query.page,
        limit: query.limit || 24,
      });
    },
    {
      query: t.Object({
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
      }),
    }
  )

  .get(
    "/:year/:season",
    async ({ params, query }) => {
      return fetchJikan(`/seasons/${params.year}/${params.season}`, {
        page: query.page,
        limit: query.limit || 24,
      });
    },
    {
      params: t.Object({
        year: t.String(),
        season: t.String(),
      }),
      query: t.Object({
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
      }),
    }
  );
