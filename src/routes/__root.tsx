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

const APP_NAME = "Rithul — Cut & Color";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content:
          "Every frame has a story. I make it worth watching. Cinematic, social, and promotional films by Rithul — Kerala.",
      },
      { name: "theme-color", content: "#F9F8F5" },
    ],
    links: [
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
