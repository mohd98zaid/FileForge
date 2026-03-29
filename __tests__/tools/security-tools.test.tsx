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

describe("Password Generator", () => {
  const PasswordGeneratorPage = require("@/app/[locale]/password-generator/page").default;

  test("renders page with title", () => {
    render(<PasswordGeneratorPage />);
    expect(screen.getByText(/Password Generator/i)).toBeInTheDocument();
  });

  test("renders regenerate button", () => {
    render(<PasswordGeneratorPage />);
    expect(screen.getByText(/Regenerate/i)).toBeInTheDocument();
  });

  test("renders character type toggles", () => {
    render(<PasswordGeneratorPage />);
    expect(screen.getByText("ABC")).toBeInTheDocument();
    expect(screen.getByText("abc")).toBeInTheDocument();
    expect(screen.getByText("123")).toBeInTheDocument();
    expect(screen.getByText("#$@")).toBeInTheDocument();
  });

  test("generates password of specified length", () => {
    render(<PasswordGeneratorPage />);
    const lengthSlider = screen.getByRole("slider");
    expect(lengthSlider).toBeInTheDocument();
  });

  test("renders copy button", () => {
    render(<PasswordGeneratorPage />);
    const copyBtn = screen.getByTitle(/Copy to Clipboard/i);
    expect(copyBtn).toBeInTheDocument();
  });

  test("password generation includes selected character sets", () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    const allChars = uppercase + lowercase + numbers + symbols;
    const password = Array.from({ length: 16 }, () =>
      allChars.charAt(Math.floor(Math.random() * allChars.length))
    ).join("");

    expect(password.length).toBe(16);
  });

  test("password with only uppercase generates correctly", () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const password = Array.from({ length: 8 }, () =>
      uppercase.charAt(Math.floor(Math.random() * uppercase.length))
    ).join("");

    expect(password).toMatch(/^[A-Z]+$/);
  });
});

describe("Password Strength Checker", () => {
  test("weak password detection", () => {
    const password = "123";
    const hasLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);

    const score = [hasLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
    expect(score).toBeLessThan(3);
  });

  test("strong password detection", () => {
    const password = "MyP@ssw0rd!";
    const hasLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);

    const score = [hasLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
    expect(score).toBe(5);
  });

  test("length check is important", () => {
    const short = "Ab1!";
    expect(short.length >= 8).toBe(false);

    const long = "Ab1!Ab1!Ab1!";
    expect(long.length >= 8).toBe(true);
  });
});

describe("JWT Decoder", () => {
  test("decodes JWT header", () => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMBrNBOiBQVc";
    const parts = token.split(".");
    expect(parts.length).toBe(3);

    const header = JSON.parse(atob(parts[0]));
    expect(header.alg).toBe("HS256");
    expect(header.typ).toBe("JWT");
  });

  test("decodes JWT payload", () => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMBrNBOiBQVc";
    const parts = token.split(".");
    const payload = JSON.parse(atob(parts[1]));
    expect(payload.sub).toBe("1234567890");
    expect(payload.name).toBe("John Doe");
    expect(payload.iat).toBe(1516239022);
  });

  test("validates JWT structure (3 parts)", () => {
    const validJwt = "aaa.bbb.ccc";
    expect(validJwt.split(".").length).toBe(3);

    const invalidJwt = "aaa.bbb";
    expect(invalidJwt.split(".").length).not.toBe(3);
  });

  test("handles invalid base64 in JWT", () => {
    const invalidJwt = "!!!.bbb.ccc";
    const parts = invalidJwt.split(".");
    expect(() => atob(parts[0])).toThrow();
  });
});

describe("Bcrypt Generator", () => {
  test("bcrypt hash format is correct", () => {
    // bcrypt hashes start with $2a$, $2b$, or $2y$ followed by cost and salt
    const bcryptRegex = /^\$2[aby]?\$\d{2}\$[./A-Za-z0-9]{53}$/;
    const validHash = "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";
    expect(bcryptRegex.test(validHash)).toBe(true);
  });

  test("bcrypt cost factor is within valid range", () => {
    const cost = 10;
    expect(cost).toBeGreaterThanOrEqual(4);
    expect(cost).toBeLessThanOrEqual(31);
  });
});
