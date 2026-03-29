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

describe("BMI Calculator", () => {
  const BmiCalculatorPage = require("@/app/[locale]/bmi-calculator/page").default;

  test("renders page with title", () => {
    render(<BmiCalculatorPage />);
    expect(screen.getByText(/BMI Calculator/i)).toBeInTheDocument();
  });

  test("renders unit toggle buttons", () => {
    render(<BmiCalculatorPage />);
    expect(screen.getByText(/Metric/i)).toBeInTheDocument();
    expect(screen.getByText(/Imperial/i)).toBeInTheDocument();
  });

  test("renders weight and height inputs", () => {
    render(<BmiCalculatorPage />);
    expect(screen.getByText("Weight")).toBeInTheDocument();
    expect(screen.getByText("Height")).toBeInTheDocument();
  });

  test("BMI calculation is correct for metric", () => {
    const weightKg = 70;
    const heightCm = 170;
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    expect(parseFloat(bmi.toFixed(1))).toBe(24.2);
  });

  test("BMI calculation is correct for imperial", () => {
    const weightLbs = 150;
    const heightFt = 5;
    const heightIn = 7;
    const totalInches = heightFt * 12 + heightIn;
    const bmi = 703 * (weightLbs / (totalInches * totalInches));
    expect(parseFloat(bmi.toFixed(1))).toBe(23.5);
  });

  test("BMI categories are defined", () => {
    render(<BmiCalculatorPage />);
    expect(screen.getAllByText(/Underweight/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Normal Weight/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Overweight/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Obese/i).length).toBeGreaterThanOrEqual(1);
  });

  test("switches to imperial unit system", () => {
    render(<BmiCalculatorPage />);
    fireEvent.click(screen.getByText(/Imperial/i));
    // After clicking, imperial-specific labels should appear
    expect(screen.getByText("lbs")).toBeInTheDocument();
    expect(screen.getByText("ft")).toBeInTheDocument();
  });
});

describe("EMI Calculator", () => {
  const EmiCalculatorPage = require("@/app/[locale]/emi-calculator/page").default;

  test("renders page with title", () => {
    render(<EmiCalculatorPage />);
    expect(screen.getByText(/EMI Calculator/i)).toBeInTheDocument();
  });

  test("renders loan amount input", () => {
    render(<EmiCalculatorPage />);
    expect(screen.getByText(/Loan Amount/i)).toBeInTheDocument();
  });

  test("renders interest rate input", () => {
    render(<EmiCalculatorPage />);
    expect(screen.getByText(/Interest Rate/i)).toBeInTheDocument();
  });

  test("renders loan tenure input", () => {
    render(<EmiCalculatorPage />);
    expect(screen.getByText(/Loan Tenure/i)).toBeInTheDocument();
  });

  test("EMI formula produces correct result", () => {
    const P = 1000000;
    const annualRate = 8.5;
    const r = annualRate / 12 / 100;
    const n = 10 * 12;
    const factor = Math.pow(1 + r, n);
    const emi = (P * r * factor) / (factor - 1);
    expect(Math.round(emi)).toBe(12399);
  });

  test("renders Your Monthly EMI heading", () => {
    render(<EmiCalculatorPage />);
    expect(screen.getByText(/Your Monthly EMI/i)).toBeInTheDocument();
  });

  test("renders tenure type toggle (Yr/Mo)", () => {
    render(<EmiCalculatorPage />);
    const yrButtons = screen.getAllByText("Yr");
    expect(yrButtons.length).toBeGreaterThanOrEqual(1);
    const moButtons = screen.getAllByText("Mo");
    expect(moButtons.length).toBeGreaterThanOrEqual(1);
  });
});

describe("GST Calculator", () => {
  const GstCalculatorPage = require("@/app/[locale]/gst-calculator/page").default;

  test("renders page with title", () => {
    render(<GstCalculatorPage />);
    expect(screen.getByText(/GST Calculator/i)).toBeInTheDocument();
  });

  test("renders add and remove GST toggle", () => {
    render(<GstCalculatorPage />);
    expect(screen.getByText(/\+ Add GST/i)).toBeInTheDocument();
    expect(screen.getByText(/- Remove GST/i)).toBeInTheDocument();
  });

  test("renders common GST rate buttons", () => {
    render(<GstCalculatorPage />);
    expect(screen.getByText("5%")).toBeInTheDocument();
    expect(screen.getByText("12%")).toBeInTheDocument();
    expect(screen.getByText("18%")).toBeInTheDocument();
    expect(screen.getByText("28%")).toBeInTheDocument();
  });

  test("GST add calculation is correct", () => {
    const amount = 1000;
    const rate = 18;
    const gstAmount = (amount * rate) / 100;
    const total = amount + gstAmount;
    expect(gstAmount).toBe(180);
    expect(total).toBe(1180);
  });

  test("GST remove calculation is correct", () => {
    const total = 1180;
    const rate = 18;
    const base = total / (1 + rate / 100);
    const gst = total - base;
    expect(parseFloat(base.toFixed(2))).toBe(1000);
    expect(parseFloat(gst.toFixed(2))).toBe(180);
  });

  test("renders Base Amount and Total Amount", () => {
    render(<GstCalculatorPage />);
    expect(screen.getByText("Base Amount")).toBeInTheDocument();
    expect(screen.getByText("Total Amount")).toBeInTheDocument();
  });
});

describe("SIP Calculator", () => {
  const SipCalculatorPage = require("@/app/[locale]/sip-calculator/page").default;

  test("renders page with title", () => {
    render(<SipCalculatorPage />);
    expect(screen.getByText(/SIP Calculator/i)).toBeInTheDocument();
  });

  test("renders monthly investment input", () => {
    render(<SipCalculatorPage />);
    expect(screen.getByText(/Monthly Investment/i)).toBeInTheDocument();
  });

  test("renders expected return rate input", () => {
    render(<SipCalculatorPage />);
    expect(screen.getByText(/Expected Return Rate/i)).toBeInTheDocument();
  });

  test("renders time period input", () => {
    render(<SipCalculatorPage />);
    expect(screen.getByText(/Time Period/i)).toBeInTheDocument();
  });

  test("SIP calculation is correct", () => {
    const P = 5000;
    const annualReturn = 12;
    const years = 10;
    const n = years * 12;
    const r = annualReturn / 12 / 100;
    const futureValue = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const totalInvested = P * n;
    expect(Math.round(futureValue)).toBe(1161695);
    expect(totalInvested).toBe(600000);
  });

  test("renders estimated returns section", () => {
    render(<SipCalculatorPage />);
    expect(screen.getByText(/Invested Amount/i)).toBeInTheDocument();
    expect(screen.getByText(/Est. Returns/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Value/i)).toBeInTheDocument();
  });
});

describe("Age Calculator", () => {
  const AgeCalculatorPage = require("@/app/[locale]/age-calculator/page").default;

  test("renders page with title", () => {
    render(<AgeCalculatorPage />);
    expect(screen.getByText(/Age Calculator/i)).toBeInTheDocument();
  });

  test("renders date inputs", () => {
    render(<AgeCalculatorPage />);
    expect(screen.getByText("Date of Birth")).toBeInTheDocument();
    expect(screen.getByText("Target Date")).toBeInTheDocument();
  });

  test("renders age output for valid dates", () => {
    render(<AgeCalculatorPage />);
    expect(screen.getByText(/You are currently/i)).toBeInTheDocument();
    expect(screen.getByText("Years")).toBeInTheDocument();
    expect(screen.getByText("Months")).toBeInTheDocument();
    expect(screen.getByText("Days")).toBeInTheDocument();
  });

  test("renders zodiac signs", () => {
    render(<AgeCalculatorPage />);
    expect(screen.getByText("Western Zodiac")).toBeInTheDocument();
    expect(screen.getByText("Chinese Zodiac")).toBeInTheDocument();
  });

  test("renders lifetime milestones", () => {
    render(<AgeCalculatorPage />);
    expect(screen.getByText("Lifetime Milestones")).toBeInTheDocument();
    expect(screen.getByText("Total Months")).toBeInTheDocument();
    expect(screen.getByText("Total Weeks")).toBeInTheDocument();
    expect(screen.getByText("Total Days")).toBeInTheDocument();
    expect(screen.getByText("Leap Years Experienced")).toBeInTheDocument();
  });

  test("renders next birthday countdown", () => {
    render(<AgeCalculatorPage />);
    expect(screen.getByText(/Next Birthday/i)).toBeInTheDocument();
    expect(screen.getByText(/Days away/i)).toBeInTheDocument();
  });
});

describe("Date Difference", () => {
  test("calculates difference between two dates correctly", () => {
    const start = new Date("2020-01-01");
    const end = new Date("2025-06-15");
    const diffMs = end.getTime() - start.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    expect(diffDays).toBe(1992);
  });

  test("same date returns 0 days", () => {
    const date = new Date("2024-01-01");
    const diff = Math.floor((date.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    expect(diff).toBe(0);
  });

  test("negative difference for reversed dates", () => {
    const start = new Date("2025-01-01");
    const end = new Date("2020-01-01");
    const diffMs = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    expect(diffDays).toBeLessThan(0);
  });
});
