import { Elysia, t } from "elysia";
import { fetchJikan } from "../utils/jikan";

export const animeRoutes = new Elysia({ prefix: "/api/anime" })
  .get(
    "/search",
    async ({ query }) => {
      return fetchJikan("/anime", {
        q: query.q,
        page: query.page,
        limit: query.limit || 24,
        order_by: query.order_by,
        sort: query.sort,
        type: query.type,
        status: query.status,
        rating: query.rating,
        genres: query.genres,
      });
    },
    {
      query: t.Object({
        q: t.Optional(t.String()),
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
        order_by: t.Optional(t.String()),
        sort: t.Optional(t.String()),
        type: t.Optional(t.String()),
        status: t.Optional(t.String()),
        rating: t.Optional(t.String()),
        genres: t.Optional(t.String()),
      }),
    }
  )

  .get(
    "/top",
    async ({ query }) => {
      return fetchJikan("/top/anime", {
        filter: query.filter,
        page: query.page,
        limit: query.limit || 24,
        type: query.type,
      });
    },
    {
      query: t.Object({
        filter: t.Optional(t.String()),
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
        type: t.Optional(t.String()),
      }),
    }
  )

  .get(
    "/:id",
    async ({ params }) => {
      return fetchJikan(`/anime/${params.id}/full`);
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )

  .get(
    "/:id/characters",
    async ({ params }) => {
      return fetchJikan(`/anime/${params.id}/characters`);
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )

  .get(
    "/:id/recommendations",
    async ({ params }) => {
      return fetchJikan(`/anime/${params.id}/recommendations`);
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  );
