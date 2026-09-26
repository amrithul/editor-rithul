import { useRef } from "react";
import { ExternalLink, Music, Play } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { editor, type InstagramReel } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { useCursor } from "@/components/magnetic-cursor";
import { useMedia } from "@/components/media-provider";
import { HoverPreview } from "@/components/hover-preview";
import { useCatalog } from "@/components/catalog-provider";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

export function ReelHorizontalScrub() {
  const { reels } = useCatalog();
  const reduced = useReducedMotion();
  const compact = Boolean(reduced) || reels.length <= 8;

  return (
    <section id="feed" className="bg-surface">
      <div className={cn("mx-auto max-w-[1440px] px-5 pt-28 pb-28", compact ? "lg:px-10" : "lg:hidden")}>
        <FeedHeading />
        <div
          className={cn(
            "mt-10 flex gap-4 pb-4",
            compact
              ? "flex-wrap justify-start"
              : "snap-x snap-mandatory overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          )}
        >
          {reels.map((reel) => (
            <div
              key={reel.id}
              className={cn(
                "shrink-0",
                compact
                  ? "w-[min(46vw,280px)] sm:w-[240px]"
                  : "w-[min(78vw,320px)] snap-center",
              )}
            >
              <ReelCard reel={reel} />
            </div>
          ))}
        </div>
      </div>

      {compact ? null : <PinnedFeedScrub reels={reels} />}
    </section>
  );
}

function PinnedFeedScrub({ reels }: { reels: InstagramReel[] }) {
  const pinRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-58%"]);

  return (
    <section
      ref={pinRef}
      className="relative hidden h-[280vh] lg:block"
      aria-label="Vertical reel scrub"
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-[1440px] shrink-0 px-10 pt-20 pb-8">
          <FeedHeading />
        </div>
        <motion.div
          style={{ x }}
          className="flex gap-6 will-change-transform px-[8vw] pb-10"
        >
          {reels.map((reel) => (
            <div key={reel.id} className="w-[min(22vw,280px)] shrink-0">
              <ReelCard reel={reel} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FeedHeading() {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <SectionHeading
        index="03"
        kicker="From the Feed"
        title="High-impact vertical pacing and visual storytelling"
      />
      <Reveal delay={0.1}>
        <a
          href={editor.instagram}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-4 py-2.5 font-mono text-[10px] tracking-[0.16em] text-ink uppercase transition-[background-color,border-color] duration-150 hover:border-accent"
        >
          {editor.instagramHandle}
          <ExternalLink className="size-3.5" />
        </a>
      </Reveal>
    </div>
  );
}

function ReelCard({ reel }: { reel: InstagramReel }) {
  const { setMode, setMagnet } = useCursor();
  const { open, previewId, requestPreview, cancelPreview } = useMedia();
  const active = previewId === reel.id;

  const onEnter = (pointer?: string) => {
    if (pointer && pointer !== "mouse") return;
    setMode("view-reel");
    requestPreview(reel.id);
  };

  const onLeave = () => {
    setMode("default");
    setMagnet(null);
    cancelPreview(reel.id);
  };

  const play = () => {
    open({
      title: reel.title,
      videoUrl: reel.videoUrl,
      poster: reel.poster,
      aspect: "vertical",
    });
  };

  return (
    <article className="group">
      <div
        className="bg-subtle media-frame relative aspect-[9/16] overflow-hidden rounded-2xl"
        onPointerEnter={(e) => onEnter(e.pointerType)}
        onPointerLeave={onLeave}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setMagnet({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
        }}
      >
        <HoverPreview url={reel.videoUrl} poster={reel.poster} active={active} vertical />

        <button
          type="button"
          className="absolute inset-0 z-10"
          aria-label={`Play ${reel.title}`}
          onClick={play}
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between p-3">
          <span className="rounded-full bg-shade/55 px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] text-paper uppercase">
            {reel.views}
          </span>
          <a
            href={reel.instagramUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${reel.title}`}
            onClick={(e) => e.stopPropagation()}
            className="pointer-events-auto relative z-30 inline-flex size-10 items-center justify-center rounded-full bg-canvas/90 text-ink"
          >
            <ExternalLink className="size-3.5" />
          </a>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-shade/70 to-transparent p-3 pt-16">
          {reel.music ? (
            <p className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.12em] text-paper/80 uppercase">
              <Music className="size-3" />
              {reel.music}
            </p>
          ) : null}
          <h3 className="font-display mt-1 text-lg leading-snug text-paper">
            {reel.title}
          </h3>
          <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-canvas/90 px-3 py-2 font-mono text-[10px] tracking-[0.16em] text-ink uppercase">
            <Play className="size-3 fill-current" />
            Play
          </span>
        </div>
      </div>
    </article>
  );
}
