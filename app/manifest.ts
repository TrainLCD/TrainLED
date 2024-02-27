import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TrainLED",
    short_name: "TrainLED",
    description: "A joking navigation app.",
    start_url: "/",
    theme_color: "#ffffff",
    background_color: "#212121",
    display: "standalone",
    orientation: "landscape",
    icons: [
      {
        src: "/icon.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
