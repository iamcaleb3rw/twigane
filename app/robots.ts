import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "Googlebot",
        allow: [
          "/",
          "/course",
          "/dashboard",
          "/dashboard/textbooks",
          "/dashboard/courses",
        ],
      },
      {
        userAgent: ["Applebot", "Bingbot"],
        allow: [
          "/",
          "/course",
          "/dashboard",
          "/dashboard/textbooks",
          "/dashboard/courses",
        ],
      },
      {
        userAgent: "*",
        allow: [
          "/",
          "/course",
          "/dashboard",
          "/dashboard/textbooks",
          "/dashboard/courses",
        ],
      },
    ],
    sitemap: "https://twigane.vercel.app/sitemap.xml",
  };
}
