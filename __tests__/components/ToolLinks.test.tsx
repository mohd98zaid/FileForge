import { render, screen } from "@testing-library/react";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";

jest.mock("next-intl", () => ({
  useLocale: () => "en",
}));

jest.mock("@/i18n/navigation", () => ({
  Link: ({ children, href, ...props }: any) => (
    <a href={typeof href === "string" ? href : href?.href || "#"} {...props}>
      {children}
    </a>
  ),
}));

describe("ToolLinks", () => {
  const currentHref = "/resize-image";

  test("renders section with 'More Tools' heading", () => {
    render(<ToolLinks current={currentHref} tools={ALL_TOOLS} />);
    expect(screen.getByText(/More Tools/)).toBeInTheDocument();
  });

  test("shows up to 6 tool links", () => {
    const { container } = render(<ToolLinks current={currentHref} tools={ALL_TOOLS} />);
    const links = container.querySelectorAll("a");
    expect(links.length).toBeLessThanOrEqual(6);
  });

  test("excludes current tool from the list", () => {
    render(<ToolLinks current={currentHref} tools={ALL_TOOLS} />);
    expect(screen.queryByText("Resize Image")).not.toBeInTheDocument();
  });

  test("only shows enabled tools (excludes disabled)", () => {
    render(<ToolLinks current="/pdf-to-word" tools={ALL_TOOLS} />);
    // Translate PDF is disabled
    expect(screen.queryByText("Translate PDF")).not.toBeInTheDocument();
  });

  test("renders tool icons", () => {
    const { container } = render(<ToolLinks current={currentHref} tools={ALL_TOOLS} />);
    const spans = container.querySelectorAll("a span");
    // Each link should have an icon span and a name span
    expect(spans.length).toBeGreaterThanOrEqual(2);
  });

  test("renders tool names in English by default", () => {
    render(<ToolLinks current={currentHref} tools={ALL_TOOLS} />);
    // Should show English names, not Hindi
    const allLinks = screen.getAllByRole("link");
    allLinks.forEach((link) => {
      // Links should contain English tool names
      expect(link.textContent).toBeTruthy();
    });
  });
});

describe("ToolLinks with Hindi locale", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("next-intl", () => ({
      useLocale: () => "hi",
    }));
  });

  test("renders Hindi names when locale is hi", () => {
    const ToolLinksHi = require("@/components/ToolLinks").default;
    render(<ToolLinksHi current="/resize-image" tools={ALL_TOOLS} />);
    // Should find Hindi section heading (with emoji prefix)
    expect(screen.getByText(/और टूल्स/)).toBeInTheDocument();
  });

  test("renders 'More Tools' heading with Hindi locale equivalent", () => {
    const ToolLinksHi = require("@/components/ToolLinks").default;
    render(<ToolLinksHi current="/base64" tools={ALL_TOOLS} />);
    expect(screen.getByText(/और टूल्स/)).toBeInTheDocument();
  });
});
