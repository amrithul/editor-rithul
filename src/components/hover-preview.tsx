import { cn } from "@/lib/utils";
import { getHoverPreview } from "@/lib/timecode";

export function HoverPreview({
  url,
  poster,
  active,
  vertical = false,
}: {
  url: string;
  poster: string;
  active: boolean;
  vertical?: boolean;
}) {
  const preview = getHoverPreview(url, { vertical });
  const isFile = preview.kind === "mp4";

  return (
    <>
      {active && isFile ? (
        <video
          className="pointer-events-none absolute inset-0 size-full object-cover"
          src={preview.src}
          muted
          loop
          playsInline
          autoPlay
          preload="none"
        />
      ) : null}
      {active && !isFile ? (
        <iframe
          title=""
          src={preview.src}
          width={vertical ? 315 : 1280}
          height={vertical ? 560 : 720}
          className="pointer-events-none absolute inset-0 size-full"
          allow="autoplay; encrypted-media"
          loading="lazy"
          tabIndex={-1}
        />
      ) : null}
      <img
        src={poster}
        alt=""
        loading="lazy"
        decoding="async"
        className={cn(
          "absolute inset-0 size-full object-cover transition-opacity duration-500 ease-[var(--ease-out-soft)]",
          active ? "opacity-0" : "opacity-100",
        )}
      />
    </>
  );
}
