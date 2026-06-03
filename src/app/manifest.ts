import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dagdaad — elke dag een goede daad",
    short_name: "Dagdaad",
    description:
      "Noteer elke dag één goede daad die je voor iemand deed.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFF8E7",
    theme_color: "#FF8C42",
    icons: [
      { src: "/logo.png", sizes: "512x512", type: "image/png" },
      { src: "/logo.png", sizes: "192x192", type: "image/png" },
    ],
    lang: "nl",
  };
}
