import { useLayoutEffect } from "react";
import { Moon, Sun } from "lucide-react";
import {
  THEME_KEY,
  applyTheme,
  getPreferredTheme,
  toggleTheme,
} from "@/lib/theme";
import { cn } from "@/lib/utils";

export function ThemeSync() {
  useLayoutEffect(() => {
    applyTheme(getPreferredTheme(), false);
    document.documentElement.classList.add("theme-ready");
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      try {
        if (localStorage.getItem(THEME_KEY)) return;
      } catch {
        return;
      }
      applyTheme(media.matches ? "dark" : "light", false);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);
  return null;
}

export function ThemeToggle({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => toggleTheme()}
      aria-label="Toggle light and dark"
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-full border border-line bg-surface text-ink transition-[background-color,border-color,color] duration-150 hover:border-accent hover:bg-subtle",
        className,
      )}
    >
      <Sun className="hidden size-4 dark:block" strokeWidth={1.6} />
      <Moon className="block size-4 dark:hidden" strokeWidth={1.6} />
    </button>
  );
}
