import { MetadataRoute } from "next";
import { ALL_TOOLS } from "@/lib/tools";

const BASE_URL = "https://forgetech.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
    const sitemapEntries: MetadataRoute.Sitemap = [];

    // Root (English) home
    sitemapEntries.push({
        url: BASE_URL,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1.0,
    });

    // Hindi home
    sitemapEntries.push({
        url: `${BASE_URL}/hi`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1.0,
    });

    // About Page — EN & HI
    sitemapEntries.push({
        url: `${BASE_URL}/about`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.5,
    });
    sitemapEntries.push({
        url: `${BASE_URL}/hi/about`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.5,
    });

    // Tool Pages — English = /slug, Hindi = /hi/slug
    ALL_TOOLS.forEach((tool) => {
        sitemapEntries.push({
            url: `${BASE_URL}${tool.href}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.8,
        });
        sitemapEntries.push({
            url: `${BASE_URL}/hi${tool.href}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.8,
        });
    });

    return sitemapEntries;
}
