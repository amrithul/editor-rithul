export const editor = {
  name: "Rithul",
  mark: "RITHUL",
  studio: "CUT & COLOR",
  email: "rithullmp4@gmail.com",
  instagram: "https://www.instagram.com/rithul.mp4/",
  instagramHandle: "@rithul.mp4",
  whatsapp: "917558811628",
  whatsappText: "Hi Rithul — I’d like to talk about a cut.",
  cities: [{ name: "Kerala", timeZone: "Asia/Kolkata" }],
  availability: "Open for freelance",
  availabilityLong:
    "Open to freelance projects, collaborations, and new creative opportunities.",
  bio: "I'm a versatile video editor passionate about turning ideas into visually engaging content. Whether it's a cinematic story, a fast-paced social media video, a promotional film, or something completely different, I focus on creating edits that capture attention and keep viewers watching.",
  portrait: "/media/rithul.jpg",
} as const;

export function whatsappHref() {
  const digits = editor.whatsapp.replace(/\D/g, "");
  if (digits.length < 10) return null;
  const text = encodeURIComponent(editor.whatsappText);
  return `https://wa.me/${digits}?text=${text}`;
}

export const featuredShowreel = {
  title: "Nebulakal",
  videoUrl: "https://youtu.be/B6cuHkqGGiw",
  poster: "/media/yt-B6cuHkqGGiw.jpg",
  duration: "01:43",
};

export type ProjectCategory = "Commercial" | "Music Video" | "Narrative";

export type Project = {
  id: string;
  title: string;
  client: string;
  year: string;
  category: ProjectCategory;
  role: string;
  poster: string;
  videoUrl: string;
  tools: string[];
};

export const projects: Project[] = [
  {
    id: "proj-college",
    title: "Last Day, College",
    client: "Personal",
    category: "Narrative",
    year: "2026",
    role: "Editor",
    poster: "/media/yt-iPPAH7iPyck.jpg",
    videoUrl: "https://youtu.be/iPPAH7iPyck",
    tools: ["DaVinci Resolve"],
  },
  {
    id: "proj-shall",
    title: "This Shall Too Pass",
    client: "Short Film",
    category: "Narrative",
    year: "2024",
    role: "Editor",
    poster: "/media/yt-EEeTctZUkWo.jpg",
    videoUrl: "https://youtu.be/EEeTctZUkWo",
    tools: ["DaVinci Resolve"],
  },
  {
    id: "proj-premam",
    title: "Premam Edit",
    client: "Ft. Radhima",
    category: "Music Video",
    year: "2026",
    role: "Editor",
    poster: "/media/yt-v3HNUxpVYkc.jpg",
    videoUrl: "https://youtu.be/v3HNUxpVYkc",
    tools: ["DaVinci Resolve"],
  },
  {
    id: "proj-spiderman",
    title: "They Call This Love",
    client: "The Amazing Spider-Man 2",
    category: "Music Video",
    year: "2026",
    role: "Editor",
    poster: "/media/yt-C3jr1ezT4uU.jpg",
    videoUrl: "https://youtu.be/C3jr1ezT4uU",
    tools: ["DaVinci Resolve"],
  },
  {
    id: "proj-infosys",
    title: "Vijayotsava",
    client: "Infosys Mysore",
    category: "Commercial",
    year: "2025",
    role: "Editor",
    poster: "/media/yt-gf7CVbeOGjI.jpg",
    videoUrl: "https://youtu.be/gf7CVbeOGjI",
    tools: ["DaVinci Resolve"],
  },
  {
    id: "proj-sayonara",
    title: "Sayonara ’24",
    client: "Rajagiri Engineering College",
    category: "Commercial",
    year: "2024",
    role: "Editor",
    poster: "/media/yt-G2fU3pZ904k.jpg",
    videoUrl: "https://youtu.be/G2fU3pZ904k",
    tools: ["DaVinci Resolve"],
  },
  {
    id: "proj-finalyear",
    title: "Final Year ’25",
    client: "Rajagiri Engineering College",
    category: "Narrative",
    year: "2025",
    role: "Editor",
    poster: "/media/yt-BFdgnj5S0Mg.jpg",
    videoUrl: "https://youtu.be/BFdgnj5S0Mg",
    tools: ["DaVinci Resolve"],
  },
  {
    id: "proj-minni",
    title: "Minni Maranjo",
    client: "Personal",
    category: "Music Video",
    year: "2026",
    role: "Editor",
    poster: "/media/yt-osGVX4yR1LM.jpg",
    videoUrl: "https://youtu.be/osGVX4yR1LM",
    tools: ["DaVinci Resolve"],
  },
  {
    id: "proj-eyes",
    title: "Eyes",
    client: "Personal",
    category: "Narrative",
    year: "2026",
    role: "Editor",
    poster: "/media/yt-kNSPmlrx-Sw.jpg",
    videoUrl: "https://youtu.be/kNSPmlrx-Sw",
    tools: ["DaVinci Resolve"],
  },
  {
    id: "proj-aise",
    title: "Aise Kaise",
    client: "Personal",
    category: "Music Video",
    year: "2026",
    role: "Editor",
    poster: "/media/yt-GZP6aUjmots.jpg",
    videoUrl: "https://youtu.be/GZP6aUjmots",
    tools: ["DaVinci Resolve"],
  },
];

export type ShowreelClip = {
  title: string;
  videoUrl: string;
  poster: string;
  duration?: string;
};

export const showreelClips: ShowreelClip[] = [
  featuredShowreel,
  ...projects.map((project) => ({
    title: project.title,
    videoUrl: project.videoUrl,
    poster: project.poster,
  })),
];

export function nextShowreel(currentUrl: string): ShowreelClip {
  const i = showreelClips.findIndex((clip) => clip.videoUrl === currentUrl);
  const next = showreelClips[(i + 1) % showreelClips.length];
  return next ?? featuredShowreel;
}

export const workFilters = ["All", "Commercial", "Music Video", "Narrative"] as const;
export type WorkFilter = (typeof workFilters)[number];

export type InstagramReel = {
  id: string;
  title: string;
  views: string;
  poster: string;
  videoUrl: string;
  instagramUrl: string;
  music: string;
};

export const instagramReels: InstagramReel[] = [
  {
    id: "reel-goa",
    title: "Goa",
    views: "01:10",
    poster: "/media/1224351490.jpg",
    videoUrl: "https://vimeo.com/1224351490",
    instagramUrl: "https://vimeo.com/1224351490",
    music: "",
  },
  {
    id: "reel-jhol",
    title: "Jhol",
    views: "00:18",
    poster: "/media/1224351493.jpg",
    videoUrl: "https://vimeo.com/1224351493",
    instagramUrl: "https://vimeo.com/1224351493",
    music: "",
  },
  {
    id: "reel-train",
    title: "Local Train Ride",
    views: "Short",
    poster: "/media/yt-OlVAi3qjqOA.jpg",
    videoUrl: "https://youtube.com/shorts/OlVAi3qjqOA",
    instagramUrl: "https://youtube.com/shorts/OlVAi3qjqOA",
    music: "",
  },
  {
    id: "reel-theyyam",
    title: "Theyyam",
    views: "Short",
    poster: "/media/yt-jIjOeWDvC9s.jpg",
    videoUrl: "https://youtube.com/shorts/jIjOeWDvC9s",
    instagramUrl: "https://youtube.com/shorts/jIjOeWDvC9s",
    music: "",
  },
  {
    id: "reel-orma",
    title: "ഒന്ന് കയറിയാതെ",
    views: "Short",
    poster: "/media/yt-eQmFRUj44qE.jpg",
    videoUrl: "https://youtube.com/shorts/eQmFRUj44qE",
    instagramUrl: "https://youtube.com/shorts/eQmFRUj44qE",
    music: "",
  },
  {
    id: "reel-kite",
    title: "Kozhikode Beach",
    views: "Short",
    poster: "/media/yt-l8lh12zhtq0.jpg",
    videoUrl: "https://youtube.com/shorts/l8lh12zhtq0",
    instagramUrl: "https://youtube.com/shorts/l8lh12zhtq0",
    music: "",
  },
];

export const toolkit = [
  {
    title: "DaVinci Resolve",
    copy: "The primary chair. Picture, color, and finish in one suite — from first assembly to the grade that ships.",
  },
  {
    title: "Sound Design",
    copy: "Dialogue first, then air, then the cut you feel. Beds, foley polish, and mix notes for the stage.",
  },
  {
    title: "Offline Assembly",
    copy: "Selects to structure in days, not weeks. Picture lock with room for the director to push.",
  },
  {
    title: "Visual Rhythm",
    copy: "Match cuts, retimes, and the social hold. Pacing written for the platform it lives on.",
  },
] as const;

export const benchmarks = [
  { label: "Social cuts", value: "48–72 hours" },
  { label: "Campaign films", value: "2–4 weeks" },
  { label: "Narrative shorts", value: "By schedule" },
] as const;

export const methodSteps = [
  {
    n: "01",
    title: "Brief",
    copy: "A short note, the platform it lives on, and two or three refs. The feeling matters more than a deck.",
  },
  {
    n: "02",
    title: "Selects",
    copy: "One folder — Drive, Frame.io, or Dropbox. Selects if you have them; rushes if you don’t.",
  },
  {
    n: "03",
    title: "The chair",
    copy: "Picture lock, then color, in DaVinci Resolve. One suite. XML / AAF only if you’re finishing somewhere else.",
  },
  {
    n: "04",
    title: "Handoff",
    copy: "Master plus the 9:16 and 1:1 crops. Or the Resolve project, if you want the grade in your timeline.",
  },
] as const;

export const navItems = [
  { href: "#reel", label: "Reel" },
  { href: "#work", label: "Work" },
  ...(instagramReels.length ? ([{ href: "#feed", label: "Feed" }] as const) : []),
  { href: "#about", label: "About" },
  { href: "#method", label: "Method" },
  { href: "#contact", label: "Contact" },
];
