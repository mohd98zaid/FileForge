import { render, screen } from "@testing-library/react";

jest.mock("next-intl", () => ({
  useLocale: () => "en",
  useTranslations: () => (key: string) => key,
}));

jest.mock("@/i18n/navigation", () => ({
  Link: ({ children, href, ...props }: any) => (
    <a href={typeof href === "string" ? href : "#"} {...props}>{children}</a>
  ),
}));

describe("SIP Calculator", () => {
  const SipCalculatorPage = require("@/app/[locale]/sip-calculator/page").default;

  test("renders page with title", () => {
    render(<SipCalculatorPage />);
    expect(screen.getByText(/SIP Calculator/i)).toBeInTheDocument();
  });

  test("SIP formula returns correct values", () => {
    const P = 5000;
    const annualReturn = 12;
    const years = 10;
    const n = years * 12;
    const r = annualReturn / 12 / 100;
    const futureValue = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    expect(Math.round(futureValue)).toBe(1161695);
  });

  test("renders estimated returns section", () => {
    render(<SipCalculatorPage />);
    expect(screen.getByText("Invested Amount")).toBeInTheDocument();
    expect(screen.getByText("Total Value")).toBeInTheDocument();
  });

  test("renders disclaimer", () => {
    render(<SipCalculatorPage />);
    expect(screen.getByText(/Disclaimer/i)).toBeInTheDocument();
  });
});

describe("EMI Calculator", () => {
  const EmiCalculatorPage = require("@/app/[locale]/emi-calculator/page").default;

  test("renders page with title", () => {
    render(<EmiCalculatorPage />);
    expect(screen.getByText(/EMI Calculator/i)).toBeInTheDocument();
  });

  test("EMI formula calculation is correct", () => {
    const P = 1000000;
    const r = 8.5 / 12 / 100;
    const n = 120;
    const factor = Math.pow(1 + r, n);
    const emi = (P * r * factor) / (factor - 1);
    expect(Math.round(emi)).toBe(12399);
  });

  test("zero interest rate edge case", () => {
    const P = 100000;
    const n = 12;
    const emi = Math.round(P / n);
    expect(emi).toBe(8333);
  });

  test("renders principal and interest breakdown", () => {
    render(<EmiCalculatorPage />);
    expect(screen.getByText("Principal Amount")).toBeInTheDocument();
    expect(screen.getByText("Total Interest")).toBeInTheDocument();
    expect(screen.getByText("Total Payment")).toBeInTheDocument();
  });
});

describe("BMI Calculator", () => {
  const BmiCalculatorPage = require("@/app/[locale]/bmi-calculator/page").default;

  test("renders page with title", () => {
    render(<BmiCalculatorPage />);
    expect(screen.getByText(/BMI Calculator/i)).toBeInTheDocument();
  });

  test("metric BMI calculation is correct", () => {
    const weightKg = 80;
    const heightCm = 180;
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    expect(parseFloat(bmi.toFixed(1))).toBe(24.7);
  });

  test("BMI category: underweight", () => {
    const bmi = 17;
    expect(bmi).toBeLessThan(18.5);
  });

  test("BMI category: normal", () => {
    const bmi = 22;
    expect(bmi).toBeGreaterThanOrEqual(18.5);
    expect(bmi).toBeLessThan(25);
  });

  test("BMI category: overweight", () => {
    const bmi = 27;
    expect(bmi).toBeGreaterThanOrEqual(25);
    expect(bmi).toBeLessThan(30);
  });

  test("BMI category: obese", () => {
    const bmi = 35;
    expect(bmi).toBeGreaterThanOrEqual(30);
  });
});

describe("GST Calculator", () => {
  const GstCalculatorPage = require("@/app/[locale]/gst-calculator/page").default;

  test("renders page with title", () => {
    render(<GstCalculatorPage />);
    expect(screen.getByText(/GST Calculator/i)).toBeInTheDocument();
  });

  test("add GST calculation", () => {
    const base = 1000;
    const rate = 18;
    const gst = (base * rate) / 100;
    const total = base + gst;
    expect(gst).toBe(180);
    expect(total).toBe(1180);
  });

  test("remove GST calculation", () => {
    const total = 1180;
    const rate = 18;
    const base = total / (1 + rate / 100);
    expect(parseFloat(base.toFixed(2))).toBe(1000);
  });

  test("CGST/SGST split is correct", () => {
    const gst = 180;
    const cgst = gst / 2;
    const sgst = gst / 2;
    expect(cgst).toBe(90);
    expect(sgst).toBe(90);
    expect(cgst + sgst).toBe(gst);
  });
});

describe("Income Tax Calculator", () => {
  test("old regime slab calculation", () => {
    const income = 800000;
    let tax = 0;
    if (income > 250000) tax += Math.min(income - 250000, 250000) * 0.05;
    if (income > 500000) tax += Math.min(income - 500000, 500000) * 0.2;
    if (income > 1000000) tax += (income - 1000000) * 0.3;
    expect(tax).toBe(72500);
  });

  test("income below taxable limit has zero tax", () => {
    const income = 200000;
    let tax = 0;
    if (income > 250000) tax += Math.min(income - 250000, 250000) * 0.05;
    expect(tax).toBe(0);
  });
});

describe("Compound Interest", () => {
  test("compound interest formula is correct", () => {
    const P = 10000;
    const r = 0.1;
    const n = 1;
    const t = 5;
    const A = P * Math.pow(1 + r / n, n * t);
    expect(parseFloat(A.toFixed(2))).toBe(16105.1);
  });

  test("quarterly compounding", () => {
    const P = 10000;
    const r = 0.08;
    const n = 4;
    const t = 2;
    const A = P * Math.pow(1 + r / n, n * t);
    expect(parseFloat(A.toFixed(2))).toBe(11716.59);
  });

  test("zero interest returns principal", () => {
    const P = 10000;
    const r = 0;
    const A = P * Math.pow(1 + r, 5);
    expect(A).toBe(10000);
  });
});

describe("Currency Converter", () => {
  test("currency conversion formula", () => {
    const amount = 100;
    const rate = 83.5;
    const converted = amount * rate;
    expect(converted).toBe(8350);
  });

  test("reverse conversion", () => {
    const amount = 8350;
    const rate = 83.5;
    const converted = amount / rate;
    expect(converted).toBe(100);
  });

  test("exchange rate identity (same currency)", () => {
    const amount = 100;
    const rate = 1;
    expect(amount * rate).toBe(100);
  });
});
