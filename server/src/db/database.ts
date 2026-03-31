import { Database } from "bun:sqlite";
import { join } from "path";

const dbPath = join(import.meta.dir, "../../data/anitracker.db");

import { mkdirSync } from "fs";
try {
  mkdirSync(join(import.meta.dir, "../../data"), { recursive: true });
} catch {}

const db = new Database(dbPath);

db.run("PRAGMA journal_mode = WAL");

db.run(`
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

export function getAllList() {
  return db.query("SELECT * FROM anime_list ORDER BY updated_at DESC").all();
}

export function getListByStatus(status: string) {
  if (status === "all") return getAllList();
  return db
    .query("SELECT * FROM anime_list WHERE status = ? ORDER BY updated_at DESC")
    .all(status);
}

export function getAnimeFromList(malId: number) {
  return db.query("SELECT * FROM anime_list WHERE mal_id = ?").get(malId);
}

export function addToList(anime: any, status: string) {
  const stmt = db.query(`
    INSERT INTO anime_list (
      mal_id, status, title, title_english, title_japanese, image_url,
      type, episodes, score, synopsis, genres, season, year,
      members, popularity, rank, favorites, scored_by,
      status_anime, rating, duration, source, studios, trailer_youtube_id
    ) VALUES (
      $mal_id, $status, $title, $title_english, $title_japanese, $image_url,
      $type, $episodes, $score, $synopsis, $genres, $season, $year,
      $members, $popularity, $rank, $favorites, $scored_by,
      $status_anime, $rating, $duration, $source, $studios, $trailer_youtube_id
    )
    ON CONFLICT(mal_id) DO UPDATE SET
      status = $status,
      title = $title,
      title_english = $title_english,
      title_japanese = $title_japanese,
      image_url = $image_url,
      type = $type,
      episodes = $episodes,
      score = $score,
      synopsis = $synopsis,
      genres = $genres,
      season = $season,
      year = $year,
      members = $members,
      popularity = $popularity,
      rank = $rank,
      favorites = $favorites,
      scored_by = $scored_by,
      status_anime = $status_anime,
      rating = $rating,
      duration = $duration,
      source = $source,
      studios = $studios,
      trailer_youtube_id = $trailer_youtube_id,
      updated_at = datetime('now')
  `);

  stmt.run({
    $mal_id: anime.mal_id,
    $status: status,
    $title: anime.title || "",
    $title_english: anime.title_english || null,
    $title_japanese: anime.title_japanese || null,
    $image_url: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || anime.image_url || "",
    $type: anime.type || null,
    $episodes: anime.episodes || null,
    $score: anime.score || null,
    $synopsis: anime.synopsis || null,
    $genres: JSON.stringify(anime.genres || []),
    $season: anime.season || null,
    $year: anime.year || null,
    $members: anime.members || null,
    $popularity: anime.popularity || null,
    $rank: anime.rank || null,
    $favorites: anime.favorites || null,
    $scored_by: anime.scored_by || null,
    $status_anime: anime.status || null,
    $rating: anime.rating || null,
    $duration: anime.duration || null,
    $source: anime.source || null,
    $studios: JSON.stringify(anime.studios || []),
    $trailer_youtube_id: anime.trailer?.youtube_id || null,
  });
}

export function updateStatus(malId: number, status: string) {
  db.query(
    "UPDATE anime_list SET status = ?, updated_at = datetime('now') WHERE mal_id = ?"
  ).run(status, malId);
}

export function removeFromList(malId: number) {
  db.query("DELETE FROM anime_list WHERE mal_id = ?").run(malId);
}

export function getCount(status?: string) {
  if (!status || status === "all") {
    return (db.query("SELECT COUNT(*) as count FROM anime_list").get() as any)?.count || 0;
  }
  return (
    db.query("SELECT COUNT(*) as count FROM anime_list WHERE status = ?").get(status) as any
  )?.count || 0;
}

export function getStatusCounts() {
  const rows = db
    .query("SELECT status, COUNT(*) as count FROM anime_list GROUP BY status")
    .all() as any[];
  const counts: Record<string, number> = { all: 0 };
  for (const row of rows) {
    counts[row.status] = row.count;
    counts.all += row.count;
  }
  return counts;
}
