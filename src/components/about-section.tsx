import { editor, toolkit, benchmarks } from "@/data/portfolio";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

export function AboutSection() {
  return (
    <section id="about" className="mx-auto max-w-[1440px] px-5 py-28 lg:px-10">
      <SectionHeading
        index="04"
        kicker="The chair"
        title={
          <>
            Cuts that capture attention{" "}
            <em className="italic">and keep them watching.</em>
          </>
        }
      />

      <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <figure className="relative">
            <div className="overflow-hidden rounded-3xl bg-[#F4E400]">
              <img
                src={editor.portrait}
                alt="Rithul — video editor, Kerala"
                className="aspect-square w-full object-cover object-top"
                loading="lazy"
              />
            </div>
            <blockquote className="absolute inset-x-5 bottom-5 rounded-2xl bg-canvas/90 p-5 shadow-[var(--shadow-soft)] backdrop-blur-sm">
              <p className="font-display text-2xl leading-snug text-ink italic">
                “Every frame has a story.”
              </p>
              <footer className="font-mono mt-3 text-[10px] tracking-[0.18em] text-stone uppercase">
                {editor.name} — on the cut
              </footer>
            </blockquote>
          </figure>
        </Reveal>

        <div className="lg:col-span-7">
          <Reveal>
            <p className="max-w-2xl text-lg leading-relaxed text-stone">
              {editor.bio}
            </p>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-stone">
              Based in {editor.cities[0].name}, India. DaVinci Resolve is the
              primary software — cut, color, and finish in one chair.{" "}
              {editor.availabilityLong}
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <dl className="mt-10 grid gap-4 sm:grid-cols-3">
              {benchmarks.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-line bg-surface p-5"
                >
                  <dt className="font-mono text-[10px] tracking-[0.18em] text-stone uppercase">
                    {item.label}
                  </dt>
                  <dd className="font-display mt-2 text-2xl text-ink">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.1}>
            <h3 className="font-mono mt-12 text-xs tracking-[0.22em] text-stone uppercase">
              Post-production toolkit
            </h3>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2">
              {toolkit.map((item) => (
                <li
                  key={item.title}
                  className="rounded-2xl border border-line bg-canvas p-5 shadow-[var(--shadow-soft)]"
                >
                  <p className="font-display text-xl text-ink">{item.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-stone">
                    {item.copy}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
