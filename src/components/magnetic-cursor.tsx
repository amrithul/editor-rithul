import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { formatTimecode } from "@/lib/timecode";
import { cn } from "@/lib/utils";

export type CursorMode = "default" | "play" | "playhead" | "view-reel" | "native";

export type PlayheadRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type Magnet = {
  x: number;
  y: number;
  playhead?: PlayheadRect;
} | null;

type CursorContextValue = {
  mode: CursorMode;
  setMode: (mode: CursorMode) => void;
  magnet: Magnet;
  setMagnet: (magnet: Magnet) => void;
};

const CursorContext = createContext<CursorContextValue>({
  mode: "default",
  setMode: () => {},
  magnet: null,
  setMagnet: () => {},
});

export function useCursor() {
  return useContext(CursorContext);
}

export function CursorProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<CursorMode>("default");
  const [magnet, setMagnet] = useState<Magnet>(null);

  return (
    <CursorContext.Provider value={{ mode, setMode, magnet, setMagnet }}>
      {children}
    </CursorContext.Provider>
  );
}

const LABELS: Record<CursorMode, string | null> = {
  default: null,
  play: "PLAY",
  playhead: null,
  "view-reel": "VIEW REEL",
  native: null,
};

export function MagneticCursor() {
  const { mode, magnet } = useCursor();
  const reduced = useReducedMotion();
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [finePointer, setFinePointer] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const sync = () => setFinePointer(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!finePointer || reduced) {
      document.documentElement.classList.remove("has-custom-cursor");
      return;
    }
    document.documentElement.classList.add("has-custom-cursor");
    return () => document.documentElement.classList.remove("has-custom-cursor");
  }, [finePointer, reduced]);

  useEffect(() => {
    if (!finePointer || reduced) return;

    const onMove = (e: MouseEvent) => {
      const mx = e.clientX;
      const my = e.clientY;
      if (magnet?.playhead) {
        const { left, width } = magnet.playhead;
        setPos({
          x: Math.min(Math.max(mx, left), left + width),
          y: magnet.y,
        });
      } else if (magnet) {
        setPos({
          x: mx + (magnet.x - mx) * 0.14,
          y: my + (magnet.y - my) * 0.14,
        });
      } else {
        setPos({ x: mx, y: my });
      }
      setVisible(true);
    };
    const onLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [finePointer, reduced, magnet]);

  if (reduced || !finePointer) return null;

  const label = LABELS[mode];
  const hide = !visible || mode === "native";
  const pill = Boolean(label);
  const playhead = mode === "playhead" && magnet?.playhead;
  const progress = playhead
    ? Math.min(Math.max((pos.x - playhead.left) / playhead.width, 0), 1)
    : 0;

  if (playhead) {
    return (
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none fixed z-[80] will-change-transform",
          hide && "opacity-0",
        )}
        style={{
          left: pos.x,
          top: playhead.top,
          height: playhead.height,
          transform: "translate3d(-50%, 0, 0)",
        }}
      >
        <span className="absolute -top-7 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.16em] text-accent tabular-nums uppercase">
          {formatTimecode(progress * 60)}
        </span>
        <span
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[5px]"
          style={{
            width: 0,
            height: 0,
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            borderTop: "7px solid var(--accent)",
          }}
        />
        <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-accent" />
        <span className="absolute bottom-0 left-1/2 size-1.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-accent" />
      </div>
    );
  }

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[80] mix-blend-multiply dark:mix-blend-normal"
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
      }}
    >
      <motion.div
        className={cn(
          "flex items-center justify-center border font-mono text-[10px] tracking-[0.22em] uppercase",
          pill
            ? "h-9 rounded-full border-ink/15 bg-ink/70 px-4 text-accent-fg"
            : "size-10 rounded-full border-ink/25 bg-transparent",
        )}
        animate={{
          x: "-50%",
          y: "-50%",
          opacity: hide ? 0 : pill ? 0.92 : 0.85,
          scale: hide ? 0.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 280, damping: 24, mass: 0.4 }}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {label ? (
            <motion.span
              key={label}
              initial={{ opacity: 0, filter: "blur(4px)", scale: 0.25 }}
              animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
              exit={{ opacity: 0, filter: "blur(4px)", scale: 0.25 }}
              transition={{ type: "spring", duration: 0.3, bounce: 0 }}
            >
              {label}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
