import { createClient } from "@libsql/client";
import { join } from "path";
import { mkdirSync } from "fs";
try {
  mkdirSync(join(import.meta.dir, "../../data"), { recursive: true });
} catch {}

const dbUrl = process.env.TURSO_DATABASE_URL || `file:${join(import.meta.dir, "../../data/anitracker.db")}`;

const db = createClient({
  url: dbUrl,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export async function initDb() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS anime_list (
      mal_id INTEGER PRIMARY KEY,
      status TEXT NOT NULL DEFAULT 'plan_to_watch',
      title TEXT NOT NULL,
      title_english TEXT,
      title_japanese TEXT,
      image_url TEXT,
      type TEXT,
      episodes INTEGER,
      score REAL,
      synopsis TEXT,
      genres TEXT,
      season TEXT,
      year INTEGER,
      members INTEGER,
      popularity INTEGER,
      rank INTEGER,
      favorites INTEGER,
      scored_by INTEGER,
      status_anime TEXT,
      rating TEXT,
      duration TEXT,
      source TEXT,
      studios TEXT,
      trailer_youtube_id TEXT,
      added_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
}

initDb().catch(console.error);

export async function getAllList() {
  const result = await db.execute("SELECT * FROM anime_list ORDER BY updated_at DESC");
  return result.rows;
}

export async function getListByStatus(status: string) {
  if (status === "all") return getAllList();
  const result = await db.execute({
    sql: "SELECT * FROM anime_list WHERE status = ? ORDER BY updated_at DESC",
    args: [status]
  });
  return result.rows;
}

export async function getAnimeFromList(malId: number) {
  const result = await db.execute({
    sql: "SELECT * FROM anime_list WHERE mal_id = ?",
    args: [malId]
  });
  return result.rows[0];
}

export async function addToList(anime: any, status: string) {
  const args: any = {
    mal_id: anime.mal_id,
    status: status,
    title: anime.title || "",
    title_english: anime.title_english || null,
    title_japanese: anime.title_japanese || null,
    image_url: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || anime.image_url || "",
    type: anime.type || null,
    episodes: anime.episodes || null,
    score: anime.score || null,
    synopsis: anime.synopsis || null,
    genres: JSON.stringify(anime.genres || []),
    season: anime.season || null,
    year: anime.year || null,
    members: anime.members || null,
    popularity: anime.popularity || null,
    rank: anime.rank || null,
    favorites: anime.favorites || null,
    scored_by: anime.scored_by || null,
    status_anime: anime.status || null,
    rating: anime.rating || null,
    duration: anime.duration || null,
    source: anime.source || null,
    studios: JSON.stringify(anime.studios || []),
    trailer_youtube_id: anime.trailer?.youtube_id || null,
  };

  await db.execute({
    sql: `
      INSERT INTO anime_list (
        mal_id, status, title, title_english, title_japanese, image_url,
        type, episodes, score, synopsis, genres, season, year,
        members, popularity, rank, favorites, scored_by,
        status_anime, rating, duration, source, studios, trailer_youtube_id
      ) VALUES (
        :mal_id, :status, :title, :title_english, :title_japanese, :image_url,
        :type, :episodes, :score, :synopsis, :genres, :season, :year,
        :members, :popularity, :rank, :favorites, :scored_by,
        :status_anime, :rating, :duration, :source, :studios, :trailer_youtube_id
      )
      ON CONFLICT(mal_id) DO UPDATE SET
        status = excluded.status,
        title = excluded.title,
        title_english = excluded.title_english,
        title_japanese = excluded.title_japanese,
        image_url = excluded.image_url,
        type = excluded.type,
        episodes = excluded.episodes,
        score = excluded.score,
        synopsis = excluded.synopsis,
        genres = excluded.genres,
        season = excluded.season,
        year = excluded.year,
        members = excluded.members,
        popularity = excluded.popularity,
        rank = excluded.rank,
        favorites = excluded.favorites,
        scored_by = excluded.scored_by,
        status_anime = excluded.status_anime,
        rating = excluded.rating,
        duration = excluded.duration,
        source = excluded.source,
        studios = excluded.studios,
        trailer_youtube_id = excluded.trailer_youtube_id,
        updated_at = datetime('now')
    `,
    args,
  });
}

export async function updateStatus(malId: number, status: string) {
  await db.execute({
    sql: "UPDATE anime_list SET status = ?, updated_at = datetime('now') WHERE mal_id = ?",
    args: [status, malId]
  });
}

export async function removeFromList(malId: number) {
  await db.execute({
    sql: "DELETE FROM anime_list WHERE mal_id = ?",
    args: [malId]
  });
}

export async function getCount(status?: string) {
  if (!status || status === "all") {
    const result = await db.execute("SELECT COUNT(*) as count FROM anime_list");
    return result.rows[0]?.count || 0;
  }
  const result = await db.execute({
    sql: "SELECT COUNT(*) as count FROM anime_list WHERE status = ?",
    args: [status]
  });
  return result.rows[0]?.count || 0;
}

export async function getStatusCounts() {
  const result = await db.execute("SELECT status, COUNT(*) as count FROM anime_list GROUP BY status");
  const counts: Record<string, number> = { all: 0 };
  for (const row of result.rows) {
    const status = row.status as string;
    const count = Number(row.count);
    counts[status] = count;
    counts.all += count;
  }
  return counts;
}
