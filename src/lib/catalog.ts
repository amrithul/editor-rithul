import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import type { InstagramReel, Project, ProjectCategory } from "@/data/portfolio";

export type CatalogKind = "work" | "reel";

export type CatalogItem = {
  id: number;
  videoUrl: string;
  title: string;
  poster: string;
  kind: CatalogKind;
  category: ProjectCategory;
  client: string;
  year: string;
};

const CATEGORIES = ["Commercial", "Music Video", "Narrative"] as const;

const AddSchema = z.object({
  url: z.string().trim().min(1).max(500),
  title: z.string().trim().max(200).optional(),
  kind: z.enum(["work", "reel"]).optional(),
  category: z.enum(CATEGORIES).optional(),
});

const RemoveSchema = z.object({
  id: z.number().int().positive(),
});

function asCategory(value: string): ProjectCategory {
  return CATEGORIES.includes(value as ProjectCategory)
    ? (value as ProjectCategory)
    : "Narrative";
}

export function youtubeId(url: string): string | null {
  const raw = url.trim();
  try {
    const parsed = new URL(raw);
    const host = parsed.hostname.replace(/^www\./, "").replace(/^m\./, "");
    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0] ?? "";
      return isVideoId(id) ? id : null;
    }
    if (host === "youtube.com" || host === "youtube-nocookie.com") {
      const v = parsed.searchParams.get("v") ?? "";
      if (isVideoId(v)) return v;
      const parts = parsed.pathname.split("/").filter(Boolean);
      if (
        parts[0] &&
        ["shorts", "embed", "live"].includes(parts[0]) &&
        isVideoId(parts[1] ?? "")
      ) {
        return parts[1] ?? null;
      }
    }
  } catch {
    /* fall through to regex */
  }
  const match = raw.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([A-Za-z0-9_-]{6,})/,
  );
  return match?.[1] ?? null;
}

function isVideoId(value: string): boolean {
  return /^[A-Za-z0-9_-]{6,}$/.test(value);
}

function isShort(url: string): boolean {
  return /youtube\.com\/shorts\//i.test(url) || /youtu\.be\/shorts\//i.test(url);
}

function mapRow(row: {
  id: number;
  video_url: string;
  title: string;
  poster: string;
  kind: string;
  category: string;
  client: string;
  year: string;
}): CatalogItem {
  return {
    id: row.id,
    videoUrl: row.video_url,
    title: row.title,
    poster: row.poster,
    kind: row.kind === "reel" ? "reel" : "work",
    category: asCategory(row.category),
    client: row.client,
    year: row.year,
  };
}

export function toProject(item: CatalogItem): Project {
  return {
    id: `cat-${item.id}`,
    title: item.title,
    client: item.client,
    category: item.category,
    year: item.year,
    role: "Editor",
    poster: item.poster,
    videoUrl: item.videoUrl,
    tools: ["DaVinci Resolve"],
  };
}

export function toReel(item: CatalogItem): InstagramReel {
  return {
    id: `cat-${item.id}`,
    title: item.title,
    views: "New",
    poster: item.poster,
    videoUrl: item.videoUrl,
    instagramUrl: item.videoUrl,
    music: "",
  };
}

async function fetchYouTubeMeta(url: string, id: string) {
  let title = "";
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`,
    );
    if (res.ok) {
      const body = (await res.json()) as { title?: string };
      title = (body.title ?? "").trim();
    }
  } catch {
    /* oEmbed is best-effort */
  }
  return {
    title: title || "Untitled cut",
    poster: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
  };
}

export const listCatalog = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql<{
    id: number;
    video_url: string;
    title: string;
    poster: string;
    kind: string;
    category: string;
    client: string;
    year: string;
  }>`select id, video_url, title, poster, kind, category, client, year
     from catalog_videos
     order by created_at desc`;
  return rows.map(mapRow);
});

export const addCatalogVideo = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => AddSchema.parse(input))
  .handler(async ({ data, context }) => {
    const id = youtubeId(data.url);
    if (!id) {
      return { ok: false as const, error: "Paste a YouTube or Shorts link." };
    }

    const meta = await fetchYouTubeMeta(data.url, id);
    const kind: CatalogKind =
      data.kind === "work" || data.kind === "reel"
        ? data.kind
        : isShort(data.url)
          ? "reel"
          : "work";
    const category = asCategory(
      data.category ?? (kind === "reel" ? "Music Video" : "Narrative"),
    );
    const title = (data.title ?? "").trim() || meta.title;
    const canonical =
      kind === "reel"
        ? `https://youtube.com/shorts/${id}`
        : `https://youtu.be/${id}`;
    const year = String(new Date().getFullYear());
    const client = "Personal";

    const sql = await getSql();
    try {
      const inserted = await sql<{ id: number }>`
        insert into catalog_videos (user_id, video_url, title, poster, kind, category, client, year)
        values (
          ${context.userId},
          ${canonical},
          ${title},
          ${meta.poster},
          ${kind},
          ${category},
          ${client},
          ${year}
        )
        returning id
      `;
      return { ok: true as const, id: inserted[0]?.id ?? 0, title, kind };
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (/unique|duplicate/i.test(message)) {
        return { ok: false as const, error: "That link is already on the site." };
      }
      return { ok: false as const, error: "Could not save the link. Try again." };
    }
  });

export const removeCatalogVideo = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => RemoveSchema.parse(input))
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    await sql`delete from catalog_videos where id = ${data.id} and user_id = ${context.userId}`;
    return { ok: true as const };
  });
