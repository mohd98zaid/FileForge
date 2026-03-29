import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/api/", "/private/", "/_next/", "/_vercel/"],
            },
        ],
        sitemap: "https://forgetech.vercel.app/sitemap.xml",
    };
}
