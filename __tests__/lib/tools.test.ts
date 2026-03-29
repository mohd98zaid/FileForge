import { ALL_TOOLS, Tool } from "@/lib/tools";

const VALID_CATEGORIES = [
  "image", "pdf", "office", "ocr", "video", "audio", "dev", "design",
  "security", "productivity", "calculators", "generators", "archive",
  "time", "ai", "finance", "developer",
];

describe("Tools Registry (src/lib/tools.ts)", () => {
  test("ALL_TOOLS is a non-empty array", () => {
    expect(Array.isArray(ALL_TOOLS)).toBe(true);
    expect(ALL_TOOLS.length).toBeGreaterThan(0);
  });

  test("every tool has all required fields", () => {
    const requiredFields: (keyof Tool)[] = [
      "name", "nameHi", "href", "icon", "description", "descriptionHi", "category",
    ];

    ALL_TOOLS.forEach((tool, idx) => {
      requiredFields.forEach((field) => {
        expect(tool[field]).toBeDefined();
        expect(tool[field]).not.toBe("");
        expect(tool[field]).toBeTruthy();
      });
    });
  });

  test("all hrefs start with /", () => {
    ALL_TOOLS.forEach((tool) => {
      expect(tool.href).toMatch(/^\//);
    });
  });

  test("no duplicate hrefs", () => {
    const hrefs = ALL_TOOLS.map((t) => t.href);
    const uniqueHrefs = new Set(hrefs);
    expect(uniqueHrefs.size).toBe(hrefs.length);
  });

  test("no duplicate names", () => {
    const names = ALL_TOOLS.map((t) => t.name);
    const uniqueNames = new Set(names);
    expect(uniqueNames.size).toBe(names.length);
  });

  test("all categories are valid", () => {
    ALL_TOOLS.forEach((tool) => {
      expect(VALID_CATEGORIES).toContain(tool.category);
    });
  });

  test("disabled tools have disabled: true", () => {
    const disabledTools = ALL_TOOLS.filter((t) => t.disabled);
    disabledTools.forEach((tool) => {
      expect(tool.disabled).toBe(true);
    });
  });

  test("non-disabled tools either have undefined or false for disabled", () => {
    ALL_TOOLS.filter((t) => !t.disabled).forEach((tool) => {
      expect(tool.disabled).toBeFalsy();
    });
  });

  test("tool count matches expected minimum", () => {
    // This project has 100+ tools
    expect(ALL_TOOLS.length).toBeGreaterThanOrEqual(100);
  });

  test("all icons are non-empty strings", () => {
    ALL_TOOLS.forEach((tool) => {
      expect(typeof tool.icon).toBe("string");
      expect(tool.icon.length).toBeGreaterThan(0);
    });
  });

  test("all descriptions are at least 5 characters", () => {
    ALL_TOOLS.forEach((tool) => {
      expect(tool.description.length).toBeGreaterThanOrEqual(5);
      expect(tool.descriptionHi.length).toBeGreaterThanOrEqual(5);
    });
  });

  test("Translate PDF is disabled", () => {
    const translatePdf = ALL_TOOLS.find((t) => t.href === "/translate-pdf");
    expect(translatePdf).toBeDefined();
    expect(translatePdf!.disabled).toBe(true);
  });

  test("hrefs do not contain spaces", () => {
    ALL_TOOLS.forEach((tool) => {
      expect(tool.href).not.toContain(" ");
    });
  });

  test("hrefs contain only valid URL characters", () => {
    ALL_TOOLS.forEach((tool) => {
      expect(tool.href).toMatch(/^\/[a-z0-9\-\/]+$/);
    });
  });
});
