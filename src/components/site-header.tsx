import { useEffect, useState } from "react";
import { Instagram, Menu, X } from "lucide-react";
import { useLenis } from "lenis/react";
import type Lenis from "lenis";
import { AnimatePresence, motion } from "motion/react";
import { editor, navItems } from "@/data/portfolio";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

function scrollToHash(hash: string, lenis?: Lenis) {
  const el = document.querySelector(hash);
  if (!(el instanceof HTMLElement)) return;
  if (lenis) {
    lenis.scrollTo(el, { offset: 0, duration: 1.15 });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function SiteHeader() {
  const lenis = useLenis();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!lenis) return;
    if (open) lenis.stop();
    else lenis.start();
  }, [open, lenis]);

  const go = (href: string) => {
    setOpen(false);
    scrollToHash(href, lenis);
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 border-b backdrop-blur-md transition-[background-color,border-color] duration-200",
          scrolled
            ? "border-line bg-canvas/85"
            : "border-transparent bg-canvas/70",
        )}
      >
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-4 px-5 lg:px-10">
          <a
            href="#reel"
            onClick={(e) => {
              e.preventDefault();
              go("#reel");
            }}
            className="flex min-w-0 items-baseline gap-2"
          >
            <span className="font-display text-xl tracking-tight text-ink italic sm:text-[22px]">
              {editor.mark}
            </span>
            <span className="font-mono hidden text-[10px] tracking-[0.22em] text-stone uppercase sm:inline">
              — {editor.studio}
            </span>
          </a>

          <nav className="hidden items-center gap-6 xl:gap-8 lg:flex" aria-label="Primary">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  go(item.href);
                }}
                className="font-sans text-[13px] font-medium tracking-wide text-stone transition-colors duration-150 hover:text-ink"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 xl:flex">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-live opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-live" />
              </span>
              <span className="font-mono text-[10px] tracking-[0.16em] text-ink uppercase">
                {editor.availability}
              </span>
            </div>
            <ThemeToggle />
            <a
              href={editor.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="inline-flex size-11 items-center justify-center rounded-full border border-line bg-surface text-ink transition-[background-color,border-color] duration-150 hover:border-accent hover:bg-subtle"
            >
              <Instagram className="size-4" strokeWidth={1.6} />
            </a>
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-full border border-line bg-surface text-ink lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            className="fixed inset-0 z-30 bg-canvas/96 px-6 pt-28 backdrop-blur-md lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav className="flex flex-col gap-2" aria-label="Mobile">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    go(item.href);
                  }}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.04 * i,
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                  }}
                  className="font-display border-b border-line py-4 text-4xl text-ink italic"
                >
                  {item.label}
                </motion.a>
              ))}
            </nav>
            <p className="font-mono mt-8 text-xs tracking-[0.18em] text-stone uppercase">
              {editor.availability}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
