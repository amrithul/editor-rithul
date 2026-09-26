import { useEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { useLenis } from "lenis/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Pause, Play, Volume2, VolumeX, X } from "lucide-react";
import { useCursor } from "@/components/magnetic-cursor";
import { useMedia } from "@/components/media-provider";
import { formatTimecode, getPlayback, type Playback } from "@/lib/timecode";

const WHIP = { duration: 6 / 24, ease: [0.18, 0, 1, 1] as const };
const FLASH = { duration: 2 / 24, ease: "linear" as const };

export function VideoLightbox() {
  const { item, close } = useMedia();
  const { setMode } = useCursor();
  const reduced = useReducedMotion();
  const lenis = useLenis();
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const vertical = item?.aspect === "vertical";
  const playback = item
    ? getPlayback(item.videoUrl, { vertical })
    : null;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!item) return;
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    lenis?.stop();
    setMode("native");
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
      if (e.key === " " || e.code === "Space") {
        const tag = (e.target as HTMLElement | null)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        e.preventDefault();
        const video = videoRef.current;
        if (!video) return;
        if (video.paused) void video.play();
        else video.pause();
      }
      if (e.key === "Tab" && overlayRef.current) {
        const focusable = overlayRef.current.querySelectorAll<HTMLElement>(
          'button, [href], video, iframe, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = original;
      lenis?.start();
      setMode("default");
      prev?.focus();
    };
  }, [item, close, lenis, setMode]);

  useEffect(() => {
    setMuted(false);
    setPlaying(true);
    setTime(0);
    setDuration(0);
  }, [item]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {item && playback ? (
        <motion.div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
          data-lenis-prevent
          className="cursor-native fixed inset-0 z-[70] flex items-center justify-center overflow-hidden bg-shade p-3 sm:p-8"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
          transition={reduced ? { duration: 0 } : WHIP}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          {!reduced ? (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-20 bg-canvas"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 1 }}
              transition={FLASH}
            />
          ) : null}

          {vertical ? (
            <motion.div
              className="relative aspect-[9/16] h-auto max-h-[88dvh] w-[min(100%,420px,calc(88dvh*9/16))] overflow-hidden rounded-2xl bg-shade shadow-[var(--shadow-soft)]"
              initial={reduced ? false : { x: "32%" }}
              animate={{ x: 0 }}
              exit={reduced ? { x: 0 } : { x: "-22%" }}
              transition={reduced ? { duration: 0 } : WHIP}
            >
              <MediaStage
                playback={playback}
                title={item.title}
                poster={item.poster}
                vertical
                videoRef={videoRef}
                muted={muted}
                setMuted={setMuted}
                playing={playing}
                time={time}
                duration={duration}
                setDuration={setDuration}
                setTime={setTime}
                setPlaying={setPlaying}
              />
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-3 bg-gradient-to-b from-shade/70 to-transparent p-3 pt-3 pb-10">
                <div className="min-w-0 pt-1">
                  <p className="font-mono text-[10px] tracking-[0.18em] text-paper/60 uppercase">
                    {item.client ?? "Feed"}
                  </p>
                  <h3 className="font-display truncate text-xl text-paper italic">
                    {item.title}
                  </h3>
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={close}
                  aria-label="Close playback"
                  className="pointer-events-auto inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-paper/15 text-paper"
                >
                  <X className="size-4" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="relative w-full max-w-6xl overflow-hidden rounded-2xl bg-shade shadow-[var(--shadow-soft)]"
              initial={reduced ? false : { x: "32%" }}
              animate={{ x: 0 }}
              exit={reduced ? { x: 0 } : { x: "-22%" }}
              transition={reduced ? { duration: 0 } : WHIP}
            >
              <div className="flex items-center justify-between gap-4 px-4 py-3">
                <div className="min-w-0">
                  <p className="font-mono text-[10px] tracking-[0.18em] text-paper/60 uppercase">
                    {item.client ?? "Playback"}
                  </p>
                  <h3 className="font-display truncate text-xl text-paper italic">
                    {item.title}
                  </h3>
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={close}
                  aria-label="Close playback"
                  className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-paper/10 text-paper"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="bg-subtle relative aspect-video">
                <MediaStage
                  playback={playback}
                  title={item.title}
                  poster={item.poster}
                  vertical={false}
                  videoRef={videoRef}
                  muted={muted}
                  setMuted={setMuted}
                  playing={playing}
                  time={time}
                  duration={duration}
                  setDuration={setDuration}
                  setTime={setTime}
                  setPlaying={setPlaying}
                />
              </div>
              <p className="font-mono px-4 py-3 text-[10px] tracking-[0.16em] text-paper/50 uppercase">
                {playback.kind === "mp4"
                  ? "Esc to exit · Space to pause"
                  : "Esc to exit"}
              </p>
            </motion.div>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

function MediaStage({
  playback,
  title,
  poster,
  vertical,
  videoRef,
  muted,
  setMuted,
  playing,
  time,
  duration,
  setDuration,
  setTime,
  setPlaying,
}: {
  playback: Playback;
  title: string;
  poster: string;
  vertical: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
  muted: boolean;
  setMuted: (value: boolean) => void;
  playing: boolean;
  time: number;
  duration: number;
  setDuration: (value: number) => void;
  setTime: (value: number) => void;
  setPlaying: (value: boolean) => void;
}) {
  if (playback.kind === "mp4") {
    return (
      <>
        <video
          ref={videoRef}
          className="absolute inset-0 size-full object-cover"
          src={playback.src}
          poster={poster}
          autoPlay
          controls={false}
          playsInline
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-shade/70 to-transparent px-4 pt-10 pb-4">
          <button
            type="button"
            onClick={() => {
              const video = videoRef.current;
              if (!video) return;
              if (video.paused) void video.play();
              else video.pause();
            }}
            className="inline-flex size-11 items-center justify-center rounded-full bg-canvas text-ink"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? (
              <Pause className="size-3.5 fill-current" />
            ) : (
              <Play className="ml-0.5 size-3.5 fill-current" />
            )}
          </button>
          <span className="font-mono flex-1 text-[11px] tracking-[0.16em] text-paper tabular-nums">
            {formatTimecode(time)} / {formatTimecode(duration)}
          </span>
          <button
            type="button"
            onClick={() => {
              const video = videoRef.current;
              const next = !muted;
              setMuted(next);
              if (video) video.muted = next;
            }}
            className="inline-flex size-11 items-center justify-center rounded-full bg-canvas/90 text-ink"
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? (
              <VolumeX className="size-4" />
            ) : (
              <Volume2 className="size-4" />
            )}
          </button>
        </div>
      </>
    );
  }

  return (
    <iframe
      key={playback.src}
      title={title}
      src={playback.src}
      width={vertical ? 315 : 1280}
      height={vertical ? 560 : 720}
      className="absolute inset-0 size-full"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
    />
  );
}
