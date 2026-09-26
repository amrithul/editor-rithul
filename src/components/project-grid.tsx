import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { workFilters, type Project, type WorkFilter } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { useCursor } from "@/components/magnetic-cursor";
import { useMedia } from "@/components/media-provider";
import { HoverPreview } from "@/components/hover-preview";
import { useCatalog } from "@/components/catalog-provider";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

export function ProjectGrid() {
  const { work } = useCatalog();
  const [filter, setFilter] = useState<WorkFilter>("All");
  const tabs = workFilters.filter(
    (item) => item === "All" || work.some((p) => p.category === item),
  );
  const filtered =
    filter === "All" ? work : work.filter((p) => p.category === filter);

  return (
    <section id="work" className="mx-auto max-w-[1440px] px-5 py-28 lg:px-10">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          index="02"
          kicker="Selected work"
          title={
            <>
              Cuts that hold. <em className="italic">Color that lasts.</em>
            </>
          }
        />
        <Reveal delay={0.08}>
          <div
            className="flex flex-wrap gap-2"
            role="tablist"
            aria-label="Filter projects"
          >
            {tabs.map((item) => {
              const active = item === filter;
              return (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(item)}
                  className={cn(
                    "relative rounded-full px-4 py-2.5 font-mono text-[10px] tracking-[0.16em] uppercase transition-colors duration-150",
                    active ? "text-accent-fg" : "text-stone hover:text-ink",
                  )}
                >
                  {active ? (
                    <motion.span
                      layoutId="work-filter-pill"
                      className="absolute inset-0 rounded-full bg-accent"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  ) : null}
                  <span className="relative z-10">{item}</span>
                </button>
              );
            })}
          </div>
        </Reveal>
      </div>

      <motion.div
        layout
        className="mt-14 grid gap-8 md:grid-cols-2"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { open, previewId, requestPreview, cancelPreview } = useMedia();
  const { setMode, setMagnet } = useCursor();
  const frameRef = useRef<HTMLDivElement>(null);
  const active = previewId === project.id;

  const startPreview = (pointer?: string) => {
    if (pointer && pointer !== "mouse") return;
    setMode("playhead");
    requestPreview(project.id);
  };

  const stopPreview = () => {
    setMode("default");
    setMagnet(null);
    cancelPreview(project.id);
  };

  const openProject = () =>
    open({
      title: project.title,
      client: project.client,
      videoUrl: project.videoUrl,
      poster: project.poster,
      aspect: "video",
    });

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay: index * 0.04 }}
      className="group"
    >
      <div
        className="cursor-pointer text-left"
        onPointerEnter={(e) => startPreview(e.pointerType)}
        onPointerLeave={stopPreview}
        onMouseMove={(e) => {
          const r = frameRef.current?.getBoundingClientRect();
          if (!r) return;
          setMagnet({
            x: Math.min(Math.max(e.clientX, r.left), r.right),
            y: r.top + r.height / 2,
            playhead: {
              left: r.left,
              top: r.top,
              width: r.width,
              height: r.height,
            },
          });
        }}
        onClick={openProject}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openProject();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`Play ${project.title}`}
      >
        <div
          ref={frameRef}
          className="bg-subtle media-frame relative aspect-video overflow-hidden rounded-2xl"
        >
          <HoverPreview
            url={project.videoUrl}
            poster={project.poster}
            active={active}
          />
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="font-mono text-[10px] tracking-[0.18em] text-accent uppercase">
            {project.category}
          </span>
          <span className="font-mono text-[10px] tracking-[0.18em] text-stone uppercase">
            {project.year}
          </span>
        </div>
        <h3 className="font-display mt-2 text-2xl text-ink md:text-[28px]">
          {project.title}
        </h3>
        <p className="mt-1 text-sm text-stone">
          {project.client}
          <span className="mx-2 text-line">·</span>
          {project.role}
        </p>
        {project.tools.length ? (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {project.tools.map((tool) => (
              <li
                key={tool}
                className="rounded-full border border-line bg-surface px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] text-stone uppercase"
              >
                {tool}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </motion.article>
  );
}
