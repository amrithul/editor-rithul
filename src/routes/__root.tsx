import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { SmoothScroll } from "@/components/smooth-scroll";
import { CursorProvider, MagneticCursor } from "@/components/magnetic-cursor";
import { MediaProvider } from "@/components/media-provider";
import { CatalogProvider } from "@/components/catalog-provider";
import { VideoLightbox } from "@/components/video-lightbox";
import { ThemeSync } from "@/components/theme-toggle";
import { themeBootScript } from "@/lib/theme";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Rithul — Video Editor in Kerala | Cut & Color" },
      {
        name: "description",
        content:
          "Rithul is a freelance video editor in Kerala. He cuts cinematic stories, music videos, and promotional films in DaVinci Resolve.",
      },
      { name: "author", content: "Rithul" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "theme-color", content: "#F9F8F5" },
    ],
    links: [
      { rel: "canonical", href: "https://rithul.mp4/" },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com" },
      { rel: "preconnect", href: "https://player.vimeo.com" },
      { rel: "preconnect", href: "https://i.vimeocdn.com" },
      { rel: "preconnect", href: "https://www.youtube-nocookie.com" },
      { rel: "preconnect", href: "https://i.ytimg.com" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap",
      },
    ],
  }),
  component: RootDocument,
});

function RootDocument() {
  return (
    <html lang="en" suppressHydrationWarning className="antialiased">
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="bg-canvas text-ink">
        <PreviewHostBridge />
        <ThemeSync />
        <AuthProvider>
          <MediaProvider>
            <CatalogProvider>
              <CursorProvider>
                <SmoothScroll>
                  <Outlet />
                  <MagneticCursor />
                  <VideoLightbox />
                </SmoothScroll>
              </CursorProvider>
            </CatalogProvider>
          </MediaProvider>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
