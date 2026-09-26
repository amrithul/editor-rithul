import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  instagramReels,
  projects,
  type InstagramReel,
  type Project,
} from "@/data/portfolio";
import { listCatalog, toProject, toReel } from "@/lib/catalog";

type CatalogContextValue = {
  work: Project[];
  reels: InstagramReel[];
  pending: boolean;
  refresh: () => Promise<void>;
};

const CatalogContext = createContext<CatalogContextValue>({
  work: projects,
  reels: instagramReels,
  pending: true,
  refresh: async () => {},
});

export function useCatalog() {
  return useContext(CatalogContext);
}

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [addedWork, setAddedWork] = useState<Project[]>([]);
  const [addedReels, setAddedReels] = useState<InstagramReel[]>([]);
  const [pending, setPending] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const items = await listCatalog();
      setAddedWork(items.filter((item) => item.kind === "work").map(toProject));
      setAddedReels(items.filter((item) => item.kind === "reel").map(toReel));
    } catch {
      /* keep static book if catalog is unavailable */
    } finally {
      setPending(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({
      work: [...addedWork, ...projects],
      reels: [...addedReels, ...instagramReels],
      pending,
      refresh,
    }),
    [addedWork, addedReels, pending, refresh],
  );

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
}
