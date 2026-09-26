import { useEffect, useRef, useState } from "react";
import { Pause, Play, SkipForward, Volume2, VolumeX } from "lucide-react";
import {
  featuredShowreel,
  nextShowreel,
  type ShowreelClip,
} from "@/data/portfolio";
import { formatTimecode, getPlayback } from "@/lib/timecode";
import { useCursor } from "@/components/magnetic-cursor";

export function HeroShowreel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { setMode, setMagnet } = useCursor();
  const [clip, setClip] = useState<ShowreelClip>(featuredShowreel);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [started, setStarted] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const playback = getPlayback(clip.videoUrl);
  const isFile = playback.kind === "mp4";

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isFile) return;
    let raf = 0;
    const tick = () => {
      setTime(video.currentTime);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isFile, clip.videoUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = muted;
  }, [muted]);

  const loadClip = (next: ShowreelClip) => {
    setClip(next);
    setStarted(false);
    setPlaying(true);
    setTime(0);
    setDuration(0);
  };

  const onNextCut = () => {
    loadClip(nextShowreel(clip.videoUrl));
  };

  const togglePlay = () => {
    if (!isFile) {
      setStarted(true);
      setPlaying(true);
      return;
    }
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const progress = duration > 0 ? Math.min(time / duration, 1) : 0;
  const embedSrc = started
    ? `${playback.src}${playback.src.includes("?") ? "&" : "?"}muted=0`
    : playback.src;

  return (
    <section id="reel" className="relative">
      <div className="mx-auto max-w-[1440px] px-5 pt-28 pb-16 lg:px-10 lg:pt-36 lg:pb-20">
        <div className="flex items-end justify-between gap-4">
          <p className="font-mono text-xs tracking-[0.22em] text-stone uppercase">
            01 — Showreel · {clip.title}
          </p>
          <button
            type="button"
            onClick={onNextCut}
            aria-label={`Next cut, currently ${clip.title}`}
            className="inline-flex shrink-0 items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-stone uppercase transition-colors duration-150 hover:text-ink"
          >
            Next cut
            <SkipForward className="size-3.5" />
          </button>
        </div>
        <h1 className="font-display mt-5 max-w-4xl text-[42px] leading-[1.05] text-ink sm:text-6xl lg:text-7xl">
          Every Frame Has a Story.{" "}
          <em className="italic">I Make It Worth Watching.</em>
        </h1>
        <p className="mt-6 max-w-xl text-pretty text-base text-stone sm:text-lg">
          Cinematic stories, fast-paced social, and promotional films — cut
          in DaVinci Resolve.
        </p>

        <div
          className="bg-subtle media-frame relative mt-12 overflow-hidden rounded-3xl aspect-video"
          onMouseEnter={() => setMode("play")}
          onMouseLeave={() => {
            setMode("default");
            setMagnet(null);
          }}
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setMagnet({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
          }}
        >
          <img
            src={clip.poster}
            alt=""
            className="absolute inset-0 size-full object-cover"
            fetchPriority="high"
          />

          {isFile ? (
            <video
              key={clip.videoUrl}
              ref={videoRef}
              className="relative size-full object-cover"
              src={playback.src}
              poster={clip.poster}
              muted
              loop
              playsInline
              autoPlay
              preload="none"
              onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            />
          ) : started ? (
            <iframe
              key={clip.videoUrl}
              title={clip.title}
              src={embedSrc}
              className="absolute inset-0 size-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          ) : null}

          {isFile || !started ? (
            <button
              type="button"
              className="absolute inset-0 z-10"
              aria-label={isFile && playing ? "Pause showreel" : "Play showreel"}
              onClick={togglePlay}
            />
          ) : null}

          {isFile ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-shade/55 via-shade/10 to-transparent px-4 pt-16 pb-4 sm:px-6">
              <div className="pointer-events-auto flex items-end justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={togglePlay}
                    aria-label={playing ? "Pause" : "Play"}
                    className="inline-flex size-11 items-center justify-center rounded-full bg-canvas/90 text-ink"
                  >
                    {playing ? (
                      <Pause className="size-3.5 fill-current" />
                    ) : (
                      <Play className="ml-0.5 size-3.5 fill-current" />
                    )}
                  </button>
                  <span className="font-mono text-[11px] tracking-[0.18em] text-paper tabular-nums uppercase">
                    {formatTimecode(time)}
                    <span className="mx-2 text-paper/50">/</span>
                    {duration
                      ? formatTimecode(duration)
                      : clip.duration
                        ? `00:${clip.duration}:00`
                        : "00:00:00:00"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMuted((m) => !m)}
                  className="inline-flex items-center gap-2 rounded-full bg-canvas/90 px-3.5 py-2 font-mono text-[10px] tracking-[0.18em] text-ink uppercase"
                  aria-label={muted ? "Unmute" : "Mute"}
                >
                  {muted ? (
                    <VolumeX className="size-3.5" />
                  ) : (
                    <Volume2 className="size-3.5" />
                  )}
                  {muted ? "Unmute" : "Mute"}
                </button>
              </div>
              <div
                className="mt-3 h-[2px] overflow-hidden rounded-full bg-paper/25"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress * 100)}
                aria-label="Showreel progress"
              >
                <div
                  className="h-full bg-accent"
                  style={{
                    width: `${progress * 100}%`,
                    transform: "translate3d(0,0,0)",
                  }}
                />
              </div>
            </div>
          ) : !started ? (
            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-shade/20">
              <span className="inline-flex items-center gap-2 rounded-full bg-canvas/95 px-5 py-3 font-mono text-[11px] tracking-[0.18em] text-ink uppercase shadow-[var(--shadow-soft)]">
                <Play className="size-3.5 fill-current" />
                Play reel
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
