import { useLenis } from "lenis/react";
import { ArrowDown } from "lucide-react";
import { benchmarks, methodSteps } from "@/data/portfolio";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { WhatsAppLink, hasWhatsApp } from "@/components/whatsapp-link";

export function MethodSection() {
  const lenis = useLenis();
  const chat = hasWhatsApp();

  const toContact = () => {
    const el = document.querySelector("#contact");
    if (!(el instanceof HTMLElement)) return;
    if (lenis) lenis.scrollTo(el, { duration: 1.15 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="method" className="bg-shade text-paper">
      <div className="mx-auto max-w-[1440px] px-5 py-28 lg:px-10">
        <SectionHeading
          index="05"
          kicker="The method"
          tone="shade"
          title={
            <>
              Send the footage.{" "}
              <em className="italic">I’ll send the cut.</em>
            </>
          }
        >
          <p className="mt-4 max-w-xl text-pretty text-paper/70">
            What to pack, how long it takes, and what comes back — so the
            inquiry isn’t a guessing game.
          </p>
        </SectionHeading>

        <ol className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-0">
          {methodSteps.map((step, i) => (
            <Reveal key={step.n} delay={0.04 * i} className="min-w-0">
              <li
                className={
                  i === 0
                    ? "border-l border-accent/70 pl-5 lg:border-l-0 lg:border-t lg:border-accent/70 lg:pl-0 lg:pt-6"
                    : "border-l border-paper/15 pl-5 lg:border-l-0 lg:border-t lg:border-paper/15 lg:pl-0 lg:pt-6"
                }
              >
                <p className="font-mono text-[11px] tracking-[0.22em] text-accent uppercase">
                  {step.n}
                </p>
                <h3 className="font-display mt-3 text-2xl text-paper italic md:text-[28px]">
                  {step.title}
                </h3>
                <p className="mt-3 text-pretty text-sm leading-relaxed text-paper/65">
                  {step.copy}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={0.12}>
          <dl className="mt-16 grid gap-px overflow-hidden rounded-2xl bg-paper/10 sm:grid-cols-3">
            {benchmarks.map((item) => (
              <div key={item.label} className="bg-shade px-6 py-5">
                <dt className="font-mono text-[10px] tracking-[0.18em] text-paper/45 uppercase">
                  {item.label}
                </dt>
                <dd className="font-display mt-2 text-2xl text-paper">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.16} className="mt-10 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={toContact}
            className="inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3.5 font-mono text-[11px] tracking-[0.18em] text-shade uppercase transition-transform duration-150 ease-out active:scale-[0.96]"
          >
            Start an inquiry
            <ArrowDown className="size-3.5" />
          </button>
          {chat ? (
            <WhatsAppLink className="inline-flex items-center gap-2 rounded-full border border-paper/20 px-6 py-3.5 font-mono text-[11px] tracking-[0.18em] text-paper uppercase transition-[border-color,background-color] duration-150 hover:border-paper/45 hover:bg-paper/5" />
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
