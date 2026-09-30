import { editor, projects, featuredShowreel } from "@/data/portfolio";

export const SITE_URL = "https://rithul.mp4";

export const HOME_TITLE = "Rithul — Video Editor in Kerala | Cut & Color";

export const HOME_DESCRIPTION =
  "Rithul is a freelance video editor in Kerala. He cuts cinematic stories, music videos, and promotional films in DaVinci Resolve — color, pace, and finish from one chair.";

export const personJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: "Rithul",
      alternateName: ["Rithul — Cut & Color", "rithul.mp4"],
      description: HOME_DESCRIPTION,
      inLanguage: "en",
      publisher: { "@id": `${SITE_URL}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Rithul",
      alternateName: ["rithul.mp4"],
      url: `${SITE_URL}/`,
      image: `${SITE_URL}${editor.portrait}`,
      jobTitle: "Video Editor",
      description: editor.bio,
      email: editor.email,
      homeLocation: {
        "@type": "Place",
        name: "Kerala, India",
      },
      knowsAbout: [
        "Video editing",
        "Color grading",
        "DaVinci Resolve",
        "Music videos",
        "Commercial films",
      ],
      sameAs: [editor.instagram],
    },
    {
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/#profile`,
      url: `${SITE_URL}/`,
      name: HOME_TITLE,
      description: HOME_DESCRIPTION,
      mainEntity: { "@id": `${SITE_URL}/#person` },
    },
    ...[featuredShowreel, ...projects].map((item) => ({
      "@type": "VideoObject",
      name: `${item.title} — edited by Rithul`,
      description: `Video edit by Rithul, freelance video editor in Kerala.`,
      thumbnailUrl: `${SITE_URL}${item.poster}`,
      url: item.videoUrl,
      creator: { "@id": `${SITE_URL}/#person` },
    })),
  ],
};
