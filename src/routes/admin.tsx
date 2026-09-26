import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  addCatalogVideo,
  listCatalog,
  removeCatalogVideo,
  type CatalogItem,
  type CatalogKind,
} from "@/lib/catalog";
import { AdminLoginForm } from "@/components/admin-login-form";
import { useCatalog } from "@/components/catalog-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import type { ProjectCategory } from "@/data/portfolio";

export const Route = createFileRoute("/admin")({ component: AdminPage });

function AdminPage() {
  const router = useRouter();
  const { user, isPending } = useCurrentUserState();

  if (isPending) {
    return (
      <main className="relative grid min-h-screen place-items-center bg-canvas px-5">
        <div className="absolute top-5 right-5">
          <ThemeToggle />
        </div>
        <div className="h-40 w-full max-w-sm animate-pulse rounded-3xl bg-surface" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="relative grid min-h-screen place-items-center bg-canvas px-5 py-16">
        <div className="absolute top-5 right-5">
          <ThemeToggle />
        </div>
        <AdminLoginForm onSignedIn={() => void router.invalidate()} />
      </main>
    );
  }

  return <AdminDesk />;
}

function AdminDesk() {
  const { refresh } = useCatalog();
  const [items, setItems] = useState<CatalogItem[] | null>(null);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<CatalogKind | "auto">("auto");
  const [category, setCategory] = useState<ProjectCategory>("Narrative");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    void listCatalog()
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  const onAdd = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    setPending(true);
    try {
      const result = await addCatalogVideo({
        data: {
          url,
          title: title || undefined,
          kind: kind === "auto" ? undefined : kind,
          category,
        },
      });
      if (!result.ok) {
        setMessage(result.error);
        return;
      }
      setUrl("");
      setTitle("");
      setMessage(
        `Added “${result.title}” to ${result.kind === "reel" ? "the feed" : "selected work"}.`,
      );
      const next = await listCatalog();
      setItems(next);
      await refresh();
    } catch {
      setMessage("Could not add that link. Sign in again if the session dropped.");
    } finally {
      setPending(false);
    }
  };

  const onRemove = async (id: number) => {
    setPending(true);
    try {
      await removeCatalogVideo({ data: { id } });
      const next = await listCatalog();
      setItems(next);
      await refresh();
    } catch {
      setMessage("Could not remove that clip.");
    } finally {
      setPending(false);
    }
  };

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <header className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-8">
        <div>
          <p className="font-mono text-[10px] tracking-[0.22em] text-stone uppercase">
            Rithul — Cut & Color
          </p>
          <h1 className="font-display mt-1 text-3xl italic">Desk</h1>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            to="/"
            className="font-mono text-[10px] tracking-[0.16em] text-stone uppercase hover:text-ink"
          >
            View site
          </Link>
          <UserButton />
        </div>
      </header>

      <div className="mx-auto grid max-w-3xl gap-10 px-5 pb-24">
        <form
          onSubmit={onAdd}
          className="cursor-native grid gap-5 rounded-3xl border border-line bg-surface p-6 sm:p-8"
        >
          <div>
            <p className="font-mono text-[10px] tracking-[0.18em] text-stone uppercase">
              Add a YouTube cut
            </p>
            <p className="mt-2 text-sm text-stone">
              Paste a YouTube or Shorts link. Shorts land in the feed; everything
              else in selected work — unless you place it by hand.
            </p>
          </div>
          <label className="grid gap-2">
            <span className="font-mono text-[10px] tracking-[0.16em] text-stone uppercase">
              YouTube link
            </span>
            <input
              required
              type="url"
              placeholder="https://youtu.be/… or Shorts"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="h-12 rounded-xl border border-line bg-canvas px-4 text-ink outline-none focus:border-accent"
            />
          </label>
          <label className="grid gap-2">
            <span className="font-mono text-[10px] tracking-[0.16em] text-stone uppercase">
              Title — optional
            </span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Leave blank to use the YouTube title"
              className="h-12 rounded-xl border border-line bg-canvas px-4 text-ink outline-none focus:border-accent"
            />
          </label>
          <fieldset>
            <legend className="font-mono text-[10px] tracking-[0.16em] text-stone uppercase">
              Place it
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {(
                [
                  ["auto", "Auto"],
                  ["work", "Selected work"],
                  ["reel", "Feed"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setKind(value)}
                  className={cn(
                    "min-h-11 rounded-full border px-4 py-2 font-mono text-[10px] tracking-[0.14em] uppercase",
                    kind === value
                      ? "border-accent bg-accent text-accent-fg"
                      : "border-line bg-canvas text-stone",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="font-mono text-[10px] tracking-[0.16em] text-stone uppercase">
              Category
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {(["Narrative", "Music Video", "Commercial"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={cn(
                    "min-h-11 rounded-full border px-4 py-2 font-mono text-[10px] tracking-[0.14em] uppercase",
                    category === item
                      ? "border-accent bg-accent text-accent-fg"
                      : "border-line bg-canvas text-stone",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </fieldset>
          {message ? <p className="text-sm text-accent">{message}</p> : null}
          <button
            type="submit"
            disabled={pending}
            className="min-h-11 rounded-full bg-ink px-6 py-3 font-mono text-[11px] tracking-[0.18em] text-accent-fg uppercase disabled:opacity-60"
          >
            {pending ? "Adding…" : "Add to the site"}
          </button>
        </form>

        <section>
          <h2 className="font-mono text-[10px] tracking-[0.18em] text-stone uppercase">
            On the site
          </h2>
          <ul className="mt-4 grid gap-3">
            {(items ?? []).length === 0 ? (
              <li className="rounded-2xl border border-line bg-surface px-5 py-6 text-sm text-stone">
                Nothing added from the desk yet. The original book stays as it is.
              </li>
            ) : (
              (items ?? []).map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-3"
                >
                  <img
                    src={item.poster}
                    alt=""
                    className="size-16 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-display truncate text-lg text-ink">
                      {item.title}
                    </p>
                    <p className="font-mono text-[10px] tracking-[0.14em] text-stone uppercase">
                      {item.kind === "reel" ? "Feed" : item.category}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => void onRemove(item.id)}
                    className="min-h-11 rounded-full border border-line px-4 py-2 font-mono text-[10px] tracking-[0.14em] text-stone uppercase hover:border-accent hover:text-ink"
                  >
                    Remove
                  </button>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </main>
  );
}
