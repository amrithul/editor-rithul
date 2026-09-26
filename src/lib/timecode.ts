/** Editorial timecode at 24 fps: HH:MM:SS:FF */
export function formatTimecode(seconds: number, fps = 24): string {
  if (!Number.isFinite(seconds) || seconds < 0) seconds = 0;
  const totalFrames = Math.floor(seconds * fps);
  const frames = totalFrames % fps;
  const totalSeconds = Math.floor(totalFrames / fps);
  const s = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const m = totalMinutes % 60;
  const h = Math.floor(totalMinutes / 60);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}:${pad(frames)}`;
}

export type Playback = {
  kind: "mp4" | "youtube" | "vimeo";
  src: string;
  id?: string;
  vertical?: boolean;
};

export function isShortUrl(url: string): boolean {
  return /youtube\.com\/shorts\//i.test(url);
}

function parsePlayback(url: string, vertical: boolean): Playback {
  const yt = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([A-Za-z0-9_-]{6,})/,
  );
  if (yt?.[1]) {
    const id = yt[1];
    const params = new URLSearchParams({
      autoplay: "1",
      rel: "0",
      modestbranding: "1",
      playsinline: "1",
    });
    if (vertical) {
      params.set("loop", "1");
      params.set("playlist", id);
    }
    return {
      kind: "youtube",
      id,
      vertical,
      src: `https://www.youtube.com/embed/${id}?${params.toString()}`,
    };
  }
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo?.[1]) {
    const id = vimeo[1];
    const params = new URLSearchParams({
      autoplay: "1",
      title: "0",
      byline: "0",
      portrait: "0",
      dnt: "1",
    });
    return {
      kind: "vimeo",
      id,
      vertical,
      src: `https://player.vimeo.com/video/${id}?${params.toString()}`,
    };
  }
  return { kind: "mp4", src: url, vertical };
}

export function getPlayback(
  url: string,
  opts?: { vertical?: boolean },
): Playback {
  const vertical = Boolean(opts?.vertical) || isShortUrl(url);
  return parsePlayback(url, vertical);
}

/** Muted, looping, chrome-less embed for hover previews. */
export function getHoverPreview(
  url: string,
  opts?: { vertical?: boolean },
): Playback {
  const parsed = getPlayback(url, opts);
  if (parsed.kind === "youtube" && parsed.id) {
    const params = new URLSearchParams({
      autoplay: "1",
      mute: "1",
      controls: "0",
      modestbranding: "1",
      rel: "0",
      playsinline: "1",
      loop: "1",
      playlist: parsed.id,
      disablekb: "1",
      fs: "0",
      vq: "small",
    });
    return {
      kind: "youtube",
      id: parsed.id,
      vertical: parsed.vertical,
      src: `https://www.youtube-nocookie.com/embed/${parsed.id}?${params.toString()}`,
    };
  }
  if (parsed.kind === "vimeo" && parsed.id) {
    return {
      kind: "vimeo",
      id: parsed.id,
      vertical: parsed.vertical,
      src: `https://player.vimeo.com/video/${parsed.id}?autoplay=1&muted=1&background=1&loop=1&autopause=0&quality=360p&dnt=1`,
    };
  }
  return parsed;
}
