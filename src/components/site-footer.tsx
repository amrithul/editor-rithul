import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUp } from "lucide-react";
import { useLenis } from "lenis/react";
import { editor } from "@/data/portfolio";
import { WhatsAppLink } from "@/components/whatsapp-link";

function useCityTime(timeZone: string) {
  const [label, setLabel] = useState("");

  useEffect(() => {
    const format = () => {
      const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(new Date());
      setLabel(parts);
    };
    format();
    const id = window.setInterval(format, 1000 * 30);
    return () => window.clearInterval(id);
  }, [timeZone]);

  return label;
}

function CityClock({ name, timeZone }: { name: string; timeZone: string }) {
  const time = useCityTime(timeZone);
  return (
    <p>
      {name} <span className="tabular-nums text-ink">{time || "--:--"}</span>
    </p>
  );
}

export function SiteFooter() {
  const lenis = useLenis();

  const toTop = () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-line bg-canvas">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-5 py-12 lg:flex-row lg:items-end lg:justify-between lg:px-10">
        <div>
          <p className="font-display text-3xl text-ink italic">{editor.mark}</p>
          <p className="font-mono mt-2 text-[10px] tracking-[0.22em] text-stone uppercase">
            {editor.studio}
          </p>
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[11px] tracking-[0.14em] text-stone uppercase">
            {editor.cities.map((city) => (
              <CityClock key={city.name} name={city.name} timeZone={city.timeZone} />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
          <a
            href={`mailto:${editor.email}`}
            className="text-ink underline decoration-line underline-offset-4"
          >
            {editor.email}
          </a>
          <WhatsAppLink className="text-ink hover:text-ink" />
          <a
            href={editor.instagram}
            target="_blank"
            rel="noreferrer"
            className="text-stone hover:text-ink"
          >
            {editor.instagramHandle}
          </a>
          <Link to="/admin" className="text-stone hover:text-ink">
            Desk
          </Link>
          <button
            type="button"
            onClick={toTop}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 font-mono text-[10px] tracking-[0.16em] text-ink uppercase transition-[border-color] duration-150 hover:border-accent"
          >
            Back to top
            <ArrowUp className="size-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
