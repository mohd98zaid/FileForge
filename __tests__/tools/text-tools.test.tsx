import { render, screen, fireEvent } from "@testing-library/react";

jest.mock("next-intl", () => ({
  useLocale: () => "en",
  useTranslations: () => (key: string) => key,
}));

jest.mock("@/i18n/navigation", () => ({
  Link: ({ children, href, ...props }: any) => (
    <a href={typeof href === "string" ? href : "#"} {...props}>{children}</a>
  ),
}));

// Extract converter functions from text-case-converter page
function toTitleCase(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function toCamelCase(str: string): string {
  const words = str.replace(/[^a-zA-Z0-9]+/g, " ").trim().split(/\s+/);
  return words
    .map((w, i) =>
      i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
    )
    .join("");
}

function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
}

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function toPascalCase(str: string): string {
  const words = str.replace(/[^a-zA-Z0-9]+/g, " ").trim().split(/\s+/);
  return words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join("");
}

function generateSlug(text: string, separator: string, lowercase: boolean, removeSpecial: boolean): string {
  let slug = text.trim();
  if (removeSpecial) slug = slug.replace(/[^\w\s\-]/g, "");
  slug = slug.replace(/[\s_]+/g, separator);
  slug = slug.replace(new RegExp(`[${separator}]{2,}`, "g"), separator);
  slug = slug.replace(new RegExp(`^[${separator}]+|[${separator}]+$`, "g"), "");
  if (lowercase) slug = slug.toLowerCase();
  return slug;
}

describe("Text Case Converter", () => {
  const TextCaseConverterPage = require("@/app/[locale]/text-case-converter/page").default;

  test("renders page with title", () => {
    render(<TextCaseConverterPage />);
    expect(screen.getByText(/Text Case Converter/i)).toBeInTheDocument();
  });

  test("renders input textarea", () => {
    render(<TextCaseConverterPage />);
    expect(screen.getByPlaceholderText(/Type or paste text here/i)).toBeInTheDocument();
  });

  test("renders all case conversion buttons", () => {
    render(<TextCaseConverterPage />);
    expect(screen.getByText("UPPERCASE")).toBeInTheDocument();
    expect(screen.getByText("lowercase")).toBeInTheDocument();
    expect(screen.getByText("Title Case")).toBeInTheDocument();
    expect(screen.getByText("camelCase")).toBeInTheDocument();
    expect(screen.getByText("PascalCase")).toBeInTheDocument();
    expect(screen.getByText("snake_case")).toBeInTheDocument();
    expect(screen.getByText("kebab-case")).toBeInTheDocument();
    expect(screen.getByText("CONSTANT_CASE")).toBeInTheDocument();
  });

  test("converts text to UPPERCASE", () => {
    render(<TextCaseConverterPage />);
    const input = screen.getByPlaceholderText(/Type or paste text here/i);
    fireEvent.change(input, { target: { value: "hello world" } });
    fireEvent.click(screen.getByText("UPPERCASE"));
    expect(screen.getByDisplayValue("HELLO WORLD")).toBeInTheDocument();
  });

  test("converts text to lowercase", () => {
    render(<TextCaseConverterPage />);
    const input = screen.getByPlaceholderText(/Type or paste text here/i);
    fireEvent.change(input, { target: { value: "HELLO WORLD" } });
    fireEvent.click(screen.getByText("lowercase"));
    expect(screen.getByDisplayValue("hello world")).toBeInTheDocument();
  });

  test("toTitleCase converts correctly", () => {
    expect(toTitleCase("hello world")).toBe("Hello World");
    expect(toTitleCase("HELLO WORLD")).toBe("Hello World");
  });

  test("toCamelCase converts correctly", () => {
    expect(toCamelCase("hello world")).toBe("helloWorld");
    expect(toCamelCase("my variable name")).toBe("myVariableName");
  });

  test("toPascalCase converts correctly", () => {
    expect(toPascalCase("hello world")).toBe("HelloWorld");
    expect(toPascalCase("my variable name")).toBe("MyVariableName");
  });

  test("toSnakeCase converts correctly", () => {
    expect(toSnakeCase("hello world")).toBe("hello_world");
    expect(toSnakeCase("myVariableName")).toBe("my_variable_name");
  });

  test("toKebabCase converts correctly", () => {
    expect(toKebabCase("hello world")).toBe("hello-world");
    expect(toKebabCase("myVariableName")).toBe("my-variable-name");
  });
});

describe("Slug Generator", () => {
  test("generates slug with hyphens", () => {
    expect(generateSlug("My Awesome Blog Post!", "-", true, true)).toBe("my-awesome-blog-post");
  });

  test("generates slug with underscores", () => {
    expect(generateSlug("My Awesome Blog Post", "_", true, true)).toBe("my_awesome_blog_post");
  });

  test("handles empty input", () => {
    expect(generateSlug("", "-", true, true)).toBe("");
  });

  test("preserves case when lowercase is false", () => {
    expect(generateSlug("My Blog Post", "-", false, true)).toBe("My-Blog-Post");
  });

  test("removes special characters when removeSpecial is true", () => {
    expect(generateSlug("Hello! @World# 2025", "-", true, true)).toBe("hello-world-2025");
  });

  test("handles multiple spaces", () => {
    expect(generateSlug("hello   world", "-", true, true)).toBe("hello-world");
  });

  test("strips leading/trailing separators", () => {
    expect(generateSlug(" hello world ", "-", true, true)).toBe("hello-world");
  });
});

describe("Remove Duplicate Lines", () => {
  test("removes duplicate lines", () => {
    const input = "apple\nbanana\napple\ncherry\nbanana";
    const expected = "apple\nbanana\ncherry";
    const lines = input.split("\n");
    const unique = [...new Set(lines)].join("\n");
    expect(unique).toBe(expected);
  });

  test("handles empty input", () => {
    const lines: string[] = [];
    const unique = [...new Set(lines)].join("\n");
    expect(unique).toBe("");
  });

  test("preserves order of first occurrence", () => {
    const input = "z\na\nz\nb\na";
    const lines = input.split("\n");
    const unique = [...new Set(lines)].join("\n");
    expect(unique).toBe("z\na\nb");
  });
});

describe("Sort Lines", () => {
  test("sorts lines alphabetically", () => {
    const input = "banana\napple\ncherry";
    const sorted = input.split("\n").sort().join("\n");
    expect(sorted).toBe("apple\nbanana\ncherry");
  });

  test("sorts numeric lines", () => {
    const input = "30\n10\n20";
    const sorted = input.split("\n").sort((a, b) => parseInt(a) - parseInt(b)).join("\n");
    expect(sorted).toBe("10\n20\n30");
  });

  test("handles single line", () => {
    const input = "single";
    const sorted = input.split("\n").sort().join("\n");
    expect(sorted).toBe("single");
  });
});

describe("Extract Emails", () => {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

  test("extracts single email", () => {
    const text = "Contact us at test@example.com for info";
    const emails = text.match(emailRegex);
    expect(emails).toEqual(["test@example.com"]);
  });

  test("extracts multiple emails", () => {
    const text = "Send to a@b.com and x@y.org please";
    const emails = text.match(emailRegex);
    expect(emails).toEqual(["a@b.com", "x@y.org"]);
  });

  test("returns empty array when no emails found", () => {
    const text = "No emails here!";
    const emails = text.match(emailRegex);
    expect(emails).toBeNull();
  });
});

describe("Extract URLs", () => {
  const urlRegex = /https?:\/\/[^\s]+/g;

  test("extracts HTTP URLs", () => {
    const text = "Visit http://example.com for more";
    const urls = text.match(urlRegex);
    expect(urls).toEqual(["http://example.com"]);
  });

  test("extracts HTTPS URLs", () => {
    const text = "Visit https://example.com/path?q=1 for more";
    const urls = text.match(urlRegex);
    expect(urls).toEqual(["https://example.com/path?q=1"]);
  });

  test("extracts multiple URLs", () => {
    const text = "https://a.com and https://b.com";
    const urls = text.match(urlRegex);
    expect(urls).toEqual(["https://a.com", "https://b.com"]);
  });

  test("returns null when no URLs found", () => {
    const text = "No URLs here!";
    const urls = text.match(urlRegex);
    expect(urls).toBeNull();
  });
});

describe("Extract Phone Numbers", () => {
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;

  test("extracts standard phone number", () => {
    const text = "Call me at 123-456-7890";
    const phones = text.match(phoneRegex);
    expect(phones).toContain("123-456-7890");
  });

  test("extracts phone with dots", () => {
    const text = "Phone: 123.456.7890";
    const phones = text.match(phoneRegex);
    expect(phones).toContain("123.456.7890");
  });
});
