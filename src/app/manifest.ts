import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Synapsy — La connessione giusta, al momento giusto",
    short_name: "Synapsy",
    description:
      "Piattaforma di matching intelligente tra chi cerca supporto psicologico e professionisti qualificati.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAFAF8",
    theme_color: "#5B8A72",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
