import { PAGE_SEO, getToolMetadata, getToolSchema } from "@/lib/seo";

describe("SEO Metadata (src/lib/seo.ts)", () => {
  test("PAGE_SEO is a non-empty object", () => {
    expect(typeof PAGE_SEO).toBe("object");
    expect(Object.keys(PAGE_SEO).length).toBeGreaterThan(0);
  });

  test("all SEO entries have title, description, and keywords", () => {
    Object.entries(PAGE_SEO).forEach(([slug, seo]) => {
      expect(seo.title).toBeDefined();
      expect(seo.title.length).toBeGreaterThan(0);
      expect(seo.description).toBeDefined();
      expect(seo.description.length).toBeGreaterThan(0);
      expect(seo.keywords).toBeDefined();
      expect(seo.keywords.length).toBeGreaterThan(0);
    });
  });

  test("getToolMetadata returns proper structure for known slug", () => {
    const metadata = getToolMetadata("resize-image");
    expect(metadata).toHaveProperty("title");
    expect(metadata).toHaveProperty("description");
    expect(metadata).toHaveProperty("keywords");
    expect(metadata).toHaveProperty("alternates");
    expect(metadata).toHaveProperty("openGraph");
    expect(metadata).toHaveProperty("twitter");
  });

  test("getToolMetadata returns empty object for unknown slug", () => {
    const metadata = getToolMetadata("non-existent-tool-xyz");
    expect(metadata).toEqual({});
  });

  test("getToolMetadata includes canonical URL with correct base", () => {
    const metadata = getToolMetadata("json-formatter");
    expect(metadata.alternates?.canonical).toContain("https://forgetech.vercel.app/json-formatter");
  });

  test("getToolMetadata includes Hindi language alternate", () => {
    const metadata = getToolMetadata("base64");
    const languages = metadata.alternates?.languages as Record<string, string>;
    expect(languages).toHaveProperty("hi");
    expect(languages.hi).toContain("/hi/base64");
  });

  test("getToolMetadata openGraph has siteName FileForge", () => {
    const metadata = getToolMetadata("password-generator");
    expect(metadata.openGraph?.siteName).toBe("FileForge");
  });

  test("getToolMetadata twitter card is summary_large_image", () => {
    const metadata = getToolMetadata("compress-image");
    expect((metadata.twitter as any)?.card).toBe("summary_large_image");
  });

  test("getToolSchema returns valid JSON-LD for known slug", () => {
    const schema = getToolSchema("pdf-merge");
    expect(schema).not.toBeNull();
    expect(schema!["@context"]).toBe("https://schema.org");
    expect(schema!["@type"]).toBe("SoftwareApplication");
    expect(schema!).toHaveProperty("name");
    expect(schema!).toHaveProperty("description");
    expect(schema!).toHaveProperty("url");
    expect(schema!["operatingSystem"]).toBe("Web");
  });

  test("getToolSchema returns null for unknown slug", () => {
    const schema = getToolSchema("non-existent-tool-xyz");
    expect(schema).toBeNull();
  });

  test("getToolSchema includes free offer", () => {
    const schema = getToolSchema("bmi-calculator");
    expect(schema!.offers["@type"]).toBe("Offer");
    expect(schema!.offers.price).toBe("0");
    expect(schema!.offers.priceCurrency).toBe("USD");
  });

  test("getToolSchema includes aggregateRating", () => {
    const schema = getToolSchema("color-picker");
    expect(schema!.aggregateRating["@type"]).toBe("AggregateRating");
    expect(schema!.aggregateRating.ratingValue).toBeDefined();
    expect(schema!.aggregateRating.ratingCount).toBeDefined();
  });

  test("getToolSchema URL matches base URL", () => {
    const schema = getToolSchema("uuid-generator");
    expect(schema!.url).toBe("https://forgetech.vercel.app/uuid-generator");
  });

  test("titles do not exceed 80 characters", () => {
    Object.entries(PAGE_SEO).forEach(([slug, seo]) => {
      expect(seo.title.length).toBeLessThanOrEqual(80);
    });
  });

  test("descriptions do not exceed 200 characters", () => {
    Object.entries(PAGE_SEO).forEach(([slug, seo]) => {
      expect(seo.description.length).toBeLessThanOrEqual(200);
    });
  });
});
