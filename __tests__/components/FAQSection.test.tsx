import { render, screen, fireEvent } from "@testing-library/react";
import FAQSection from "@/components/FAQSection";

const mockFaqs = [
  {
    question: "What is this tool?",
    questionHi: "यह टूल क्या है?",
    answer: "It does amazing things.",
    answerHi: "यह अद्भुत काम करता है।",
  },
  {
    question: "Is it free?",
    questionHi: "क्या यह मुफ़्त है?",
    answer: "Yes, completely free.",
    answerHi: "हाँ, पूरी तरह से मुफ़्त।",
  },
  {
    question: "How to use?",
    answer: "Just type and click.",
  },
];

jest.mock("next-intl", () => ({
  useLocale: () => "en",
}));

describe("FAQSection", () => {
  test("renders FAQ items", () => {
    render(<FAQSection items={mockFaqs} />);
    expect(screen.getByText("What is this tool?")).toBeInTheDocument();
    expect(screen.getByText("Is it free?")).toBeInTheDocument();
    expect(screen.getByText("How to use?")).toBeInTheDocument();
  });

  test("renders FAQ heading", () => {
    render(<FAQSection items={mockFaqs} />);
    expect(screen.getByText(/Frequently Asked Questions/i)).toBeInTheDocument();
  });

  test("accordion is closed by default", () => {
    render(<FAQSection items={mockFaqs} />);
    expect(screen.queryByText("It does amazing things.")).not.toBeInTheDocument();
  });

  test("clicking a question opens the accordion", () => {
    render(<FAQSection items={mockFaqs} />);
    fireEvent.click(screen.getByText("What is this tool?"));
    expect(screen.getByText("It does amazing things.")).toBeInTheDocument();
  });

  test("clicking an open question closes the accordion", () => {
    render(<FAQSection items={mockFaqs} />);
    fireEvent.click(screen.getByText("What is this tool?"));
    expect(screen.getByText("It does amazing things.")).toBeInTheDocument();

    fireEvent.click(screen.getByText("What is this tool?"));
    expect(screen.queryByText("It does amazing things.")).not.toBeInTheDocument();
  });

  test("only one FAQ is open at a time", () => {
    render(<FAQSection items={mockFaqs} />);
    fireEvent.click(screen.getByText("What is this tool?"));
    expect(screen.getByText("It does amazing things.")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Is it free?"));
    expect(screen.queryByText("It does amazing things.")).not.toBeInTheDocument();
    expect(screen.getByText("Yes, completely free.")).toBeInTheDocument();
  });

  test("renders JSON-LD schema", () => {
    const { container } = render(<FAQSection items={mockFaqs} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();

    const json = JSON.parse(script!.textContent!);
    expect(json["@context"]).toBe("https://schema.org");
    expect(json["@type"]).toBe("FAQPage");
    expect(json.mainEntity).toHaveLength(3);
    expect(json.mainEntity[0]["@type"]).toBe("Question");
    expect(json.mainEntity[0].acceptedAnswer["@type"]).toBe("Answer");
  });

  test("JSON-LD contains correct question and answer text", () => {
    const { container } = render(<FAQSection items={mockFaqs} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    const json = JSON.parse(script!.textContent!);

    expect(json.mainEntity[0].name).toBe("What is this tool?");
    expect(json.mainEntity[0].acceptedAnswer.text).toBe("It does amazing things.");
  });

  test("supports questionHi and answerHi fields in interface", () => {
    const faqsWithHi = [
      { question: "English Q", questionHi: "Hindi Q", answer: "English A", answerHi: "Hindi A" },
    ];
    const { container } = render(<FAQSection items={faqsWithHi} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeTruthy();
  });
});
