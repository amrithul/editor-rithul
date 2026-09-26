import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/reveal";

type SectionHeadingProps = {
  index: string;
  kicker: string;
  title: ReactNode;
  children?: ReactNode;
  tone?: "default" | "shade";
};

export function SectionHeading({
  index,
  kicker,
  title,
  children,
  tone = "default",
}: SectionHeadingProps) {
  const invert = tone === "shade";
  return (
    <Reveal>
      <p
        className={cn(
          "font-mono text-xs tracking-[0.22em] uppercase",
          invert ? "text-paper/55" : "text-stone",
        )}
      >
        {index} — {kicker}
      </p>
      <h2
        className={cn(
          "font-display mt-4 max-w-3xl text-4xl md:text-5xl lg:text-6xl",
          invert ? "text-paper" : "text-ink",
        )}
      >
        {title}
      </h2>
      {children}
    </Reveal>
  );
}
