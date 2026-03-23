import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://synapsy.vibecanyon.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/professionisti", "/p/"],
        disallow: ["/dashboard/", "/api/", "/verification/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
