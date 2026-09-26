import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type LightboxMedia = {
  title: string;
  client?: string;
  videoUrl: string;
  poster: string;
  aspect?: "video" | "vertical";
};

type MediaContextValue = {
  item: LightboxMedia | null;
  open: (item: LightboxMedia) => void;
  close: () => void;
  previewId: string | null;
  requestPreview: (id: string) => void;
  cancelPreview: (id: string) => void;
};

const MediaContext = createContext<MediaContextValue | null>(null);

export function MediaProvider({ children }: { children: ReactNode }) {
  const [item, setItem] = useState<LightboxMedia | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const previewTimer = useRef(0);

  const open = useCallback((next: LightboxMedia) => {
    window.clearTimeout(previewTimer.current);
    setPreviewId(null);
    setItem(next);
  }, []);
  const close = useCallback(() => setItem(null), []);

  const requestPreview = useCallback((id: string) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    window.clearTimeout(previewTimer.current);
    previewTimer.current = window.setTimeout(() => setPreviewId(id), 180);
  }, []);

  const cancelPreview = useCallback((id: string) => {
    window.clearTimeout(previewTimer.current);
    setPreviewId((current) => (current === id ? null : current));
  }, []);

  const value = useMemo(
    () => ({ item, open, close, previewId, requestPreview, cancelPreview }),
    [item, open, close, previewId, requestPreview, cancelPreview],
  );
  return <MediaContext.Provider value={value}>{children}</MediaContext.Provider>;
}

export function useMedia() {
  const ctx = useContext(MediaContext);
  if (!ctx) {
    throw new Error("useMedia must be used within MediaProvider");
  }
  return ctx;
}
