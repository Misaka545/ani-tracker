import { Elysia, t } from "elysia";
import {
  getAllList,
  getListByStatus,
  getAnimeFromList,
  addToList,
  updateStatus,
  removeFromList,
  getStatusCounts,
} from "../db/database";

export const listRoutes = new Elysia({ prefix: "/api/list" })
  .get(
    "/",
    async ({ query }) => {
      const status = query.status || "all";
      const items = await getListByStatus(status);
      const parsed = items.map((item: any) => ({
        ...item,
        genres: JSON.parse(item.genres || "[]"),
        studios: JSON.parse(item.studios || "[]"),
        images: {
          jpg: {
            large_image_url: item.image_url,
            image_url: item.image_url,
          },
        },
      }));
      return { data: parsed, counts: await getStatusCounts() };
    },
    {
      query: t.Object({
        status: t.Optional(t.String()),
      }),
    }
  )

  .get(
    "/:id",
    async ({ params }) => {
      const item = await getAnimeFromList(Number(params.id));
      return { data: item, inList: !!item };
    },
    {
      params: t.Object({ id: t.String() }),
    }
  )

  .post(
    "/",
    async ({ body }) => {
      await addToList(body.anime, body.status);
      return { success: true, counts: await getStatusCounts() };
    },
    {
      body: t.Object({
        anime: t.Any(),
        status: t.String(),
      }),
    }
  )

  .patch(
    "/:id",
    async ({ params, body }) => {
      await updateStatus(Number(params.id), body.status);
      return { success: true, counts: await getStatusCounts() };
    },
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({ status: t.String() }),
    }
  )

  .delete(
    "/:id",
    async ({ params }) => {
      await removeFromList(Number(params.id));
      return { success: true, counts: await getStatusCounts() };
    },
    {
      params: t.Object({ id: t.String() }),
    }
  );
