import { MetadataRoute } from "next";
import { ALL_TOOLS } from "@/lib/tools";

const BASE_URL = "https://forgetech.vercel.app";

// Static last-modified date so Google doesn't think every page changes on every crawl
const LAST_MODIFIED = new Date("2026-03-26");

export default function sitemap(): MetadataRoute.Sitemap {
    const sitemapEntries: MetadataRoute.Sitemap = [];

    // Root home
    sitemapEntries.push({
        url: BASE_URL,
        lastModified: LAST_MODIFIED,
        changeFrequency: "daily",
        priority: 1.0,
        alternates: {
            languages: {
                en: `${BASE_URL}`,
                hi: `${BASE_URL}/hi`,
                "x-default": BASE_URL,
            },
        },
    });

    // Hindi home
    sitemapEntries.push({
        url: `${BASE_URL}/hi`,
        lastModified: LAST_MODIFIED,
        changeFrequency: "daily",
        priority: 0.9,
        alternates: {
            languages: {
                en: `${BASE_URL}`,
                hi: `${BASE_URL}/hi`,
                "x-default": BASE_URL,
            },
        },
    });

    // About Page — EN & HI
    sitemapEntries.push({
        url: `${BASE_URL}/about`,
        lastModified: LAST_MODIFIED,
        changeFrequency: "monthly",
        priority: 0.5,
        alternates: {
            languages: {
                en: `${BASE_URL}/about`,
                hi: `${BASE_URL}/hi/about`,
                "x-default": `${BASE_URL}/about`,
            },
        },
    });
    sitemapEntries.push({
        url: `${BASE_URL}/hi/about`,
        lastModified: LAST_MODIFIED,
        changeFrequency: "monthly",
        priority: 0.5,
        alternates: {
            languages: {
                en: `${BASE_URL}/about`,
                hi: `${BASE_URL}/hi/about`,
                "x-default": `${BASE_URL}/about`,
            },
        },
    });

    // Tool Pages — English = /slug, Hindi = /hi/slug
    ALL_TOOLS.forEach((tool) => {
        sitemapEntries.push({
            url: `${BASE_URL}${tool.href}`,
            lastModified: LAST_MODIFIED,
            changeFrequency: "weekly" as const,
            priority: 0.8,
            alternates: {
                languages: {
                    en: `${BASE_URL}${tool.href}`,
                    hi: `${BASE_URL}/hi${tool.href}`,
                    "x-default": `${BASE_URL}${tool.href}`,
                },
            },
        });
        sitemapEntries.push({
            url: `${BASE_URL}/hi${tool.href}`,
            lastModified: LAST_MODIFIED,
            changeFrequency: "weekly" as const,
            priority: 0.8,
            alternates: {
                languages: {
                    en: `${BASE_URL}${tool.href}`,
                    hi: `${BASE_URL}/hi${tool.href}`,
                    "x-default": `${BASE_URL}${tool.href}`,
                },
            },
        });
    });

    return sitemapEntries;
}
