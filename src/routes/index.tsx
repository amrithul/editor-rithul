import { createFileRoute } from '@tanstack/react-router'
import { AboutSection } from "@/components/about-section";
import { ContactSection } from "@/components/contact-section";
import { HeroShowreel } from "@/components/hero-showreel";
import { MethodSection } from "@/components/method-section";
import { ProjectGrid } from "@/components/project-grid";
import { ReelHorizontalScrub } from "@/components/reel-horizontal-scrub";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useCatalog } from "@/components/catalog-provider";
import { HOME_DESCRIPTION, HOME_TITLE, personJsonLd, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: HOME_TITLE },
      { name: "description", content: HOME_DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(personJsonLd),
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { reels } = useCatalog();
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-accent-fg"
      >
        Skip to work
      </a>
      <SiteHeader />
      <main>
        <HeroShowreel />
        <ProjectGrid />
        {reels.length ? <ReelHorizontalScrub /> : null}
        <AboutSection />
        <MethodSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  );
}
