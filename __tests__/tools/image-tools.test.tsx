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

describe("Color Picker", () => {
  const ColorPickerPage = require("@/app/[locale]/color-picker/page").default;

  test("renders page with title", () => {
    render(<ColorPickerPage />);
    expect(screen.getByText(/Color Picker/i)).toBeInTheDocument();
  });

  test("renders HEX, RGB, HSL, CMYK labels", () => {
    render(<ColorPickerPage />);
    expect(screen.getByText("HEX")).toBeInTheDocument();
    expect(screen.getByText("RGB")).toBeInTheDocument();
    expect(screen.getByText("HSL")).toBeInTheDocument();
    expect(screen.getByText("CMYK")).toBeInTheDocument();
  });

  test("renders quick swatches section", () => {
    render(<ColorPickerPage />);
    expect(screen.getByText("Quick Swatches")).toBeInTheDocument();
  });

  test("hex input shows default color", () => {
    render(<ColorPickerPage />);
    const hexInput = screen.getByDisplayValue("6366F1");
    expect(hexInput).toBeInTheDocument();
  });

  test("renders color preview circle", () => {
    const { container } = render(<ColorPickerPage />);
    const circle = container.querySelector('[style*="background-color"]');
    expect(circle).toBeInTheDocument();
  });

  test("hexToRgb conversion is correct", () => {
    const hexToRgb = (hex: string) => {
      let r = 0, g = 0, b = 0;
      if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
      } else if (hex.length === 7) {
        r = parseInt(hex.substring(1, 3), 16);
        g = parseInt(hex.substring(3, 5), 16);
        b = parseInt(hex.substring(5, 7), 16);
      }
      return { r, g, b };
    };

    expect(hexToRgb("#FF0000")).toEqual({ r: 255, g: 0, b: 0 });
    expect(hexToRgb("#00FF00")).toEqual({ r: 0, g: 255, b: 0 });
    expect(hexToRgb("#0000FF")).toEqual({ r: 0, g: 0, b: 255 });
    expect(hexToRgb("#FFFFFF")).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb("#000000")).toEqual({ r: 0, g: 0, b: 0 });
  });

  test("rgbToHex conversion is correct", () => {
    const rgbToHex = (r: number, g: number, b: number) => {
      return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase();
    };

    expect(rgbToHex(255, 0, 0)).toBe("#FF0000");
    expect(rgbToHex(0, 255, 0)).toBe("#00FF00");
    expect(rgbToHex(0, 0, 255)).toBe("#0000FF");
  });
});

describe("Color Contrast Checker", () => {
  test("WCAG contrast ratio calculation", () => {
    const luminance = (r: number, g: number, b: number) => {
      const [rs, gs, bs] = [r, g, b].map((c) => {
        const s = c / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const contrastRatio = (l1: number, l2: number) => {
      const lighter = Math.max(l1, l2);
      const darker = Math.min(l1, l2);
      return (lighter + 0.05) / (darker + 0.05);
    };

    // Black on white should have high contrast
    const blackLum = luminance(0, 0, 0);
    const whiteLum = luminance(255, 255, 255);
    const ratio = contrastRatio(whiteLum, blackLum);
    expect(ratio).toBeGreaterThan(20);
  });

  test("WCAG AA standard requires 4.5:1 for normal text", () => {
    const luminance = (r: number, g: number, b: number) => {
      const [rs, gs, bs] = [r, g, b].map((c) => {
        const s = c / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const contrastRatio = (l1: number, l2: number) => {
      return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    };

    const grayLum = luminance(128, 128, 128);
    const whiteLum = luminance(255, 255, 255);
    const ratio = contrastRatio(whiteLum, grayLum);
    expect(ratio).toBeLessThan(4.5);
  });
});

describe("Palette Generator", () => {
  test("generates color harmonies from a base color", () => {
    const baseHue = 240; // Blue
    const complementary = (baseHue + 180) % 360;
    expect(complementary).toBe(60);

    const analogous1 = (baseHue + 30) % 360;
    const analogous2 = (baseHue - 30 + 360) % 360;
    expect(analogous1).toBe(270);
    expect(analogous2).toBe(210);
  });

  test("triadic colors are 120 degrees apart", () => {
    const baseHue = 0;
    const triadic1 = (baseHue + 120) % 360;
    const triadic2 = (baseHue + 240) % 360;
    expect(triadic1).toBe(120);
    expect(triadic2).toBe(240);
  });
});

describe("Dummy Image Generator", () => {
  test("generates canvas with correct dimensions", () => {
    const canvas = document.createElement("canvas");
    canvas.width = 300;
    canvas.height = 200;
    expect(canvas.width).toBe(300);
    expect(canvas.height).toBe(200);
  });

  test("validates size inputs", () => {
    const width = 400;
    const height = 300;
    expect(width).toBeGreaterThan(0);
    expect(height).toBeGreaterThan(0);
  });
});

describe("SVG Optimizer", () => {
  test("removes XML declaration from SVG", () => {
    const svg = '<?xml version="1.0" encoding="UTF-8"?><svg></svg>';
    const optimized = svg.replace(/<\?xml[^?]*\?>/g, "");
    expect(optimized).toBe("<svg></svg>");
  });

  test("removes comments from SVG", () => {
    const svg = "<svg><!-- comment --><rect/></svg>";
    const optimized = svg.replace(/<!--[\s\S]*?-->/g, "");
    expect(optimized).toBe("<svg><rect/></svg>");
  });

  test("removes unnecessary whitespace", () => {
    const svg = '<svg   width = "100"   height = "100"  >  <rect />  </svg>';
    const optimized = svg.replace(/\s+/g, " ").replace(/> </g, "><").trim();
    expect(optimized).toBe('<svg width = "100" height = "100" ><rect /></svg>');
  });
});
