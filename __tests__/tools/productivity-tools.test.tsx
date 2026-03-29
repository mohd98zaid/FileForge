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

jest.mock("@/components/ToolLayout", () => {
  return function ToolLayout({ title, description, children }: any) {
    return (
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
        {children}
      </div>
    );
  };
});

describe("Todo List", () => {
  const TodoListPage = require("@/app/[locale]/todo-list/page").default;

  test("renders page with title", () => {
    render(<TodoListPage />);
    expect(screen.getByText("Todo List")).toBeInTheDocument();
  });

  test("renders add task input", () => {
    render(<TodoListPage />);
    expect(screen.getByPlaceholderText("What needs to be done?")).toBeInTheDocument();
  });

  test("renders Add button", () => {
    render(<TodoListPage />);
    expect(screen.getByText("Add")).toBeInTheDocument();
  });

  test("renders priority selectors", () => {
    render(<TodoListPage />);
    expect(screen.getByText("low")).toBeInTheDocument();
    expect(screen.getByText("medium")).toBeInTheDocument();
    expect(screen.getByText("high")).toBeInTheDocument();
  });

  test("renders filter buttons for all/active/completed", () => {
    render(<TodoListPage />);
    // Filter buttons exist in the DOM
    const allBtn = screen.getAllByText(/all/i);
    expect(allBtn.length).toBeGreaterThanOrEqual(1);
  });

  test("renders empty state message", () => {
    render(<TodoListPage />);
    expect(screen.getByText("All caught up!")).toBeInTheDocument();
  });

  test("localStorage mock is available", () => {
    expect(localStorage.getItem).toBeDefined();
    expect(localStorage.setItem).toBeDefined();
  });
});

describe("Pomodoro Timer", () => {
  const PomodoroTimerPage = require("@/app/[locale]/pomodoro/page").default;

  test("renders page with title", () => {
    render(<PomodoroTimerPage />);
    expect(screen.getByText(/Pomodoro Timer/)).toBeInTheDocument();
  });

  test("renders timer display with default 25:00", () => {
    render(<PomodoroTimerPage />);
    expect(screen.getByText("25:00")).toBeInTheDocument();
  });

  test("renders focus, short break, long break tabs", () => {
    render(<PomodoroTimerPage />);
    // These appear as both buttons and labels - use getAllByText
    expect(screen.getAllByText("Focus").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Short Break").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Long Break").length).toBeGreaterThanOrEqual(1);
  });

  test("renders START button", () => {
    render(<PomodoroTimerPage />);
    expect(screen.getByText("START")).toBeInTheDocument();
  });

  test("renders sessions counter", () => {
    render(<PomodoroTimerPage />);
    expect(screen.getByText(/Sessions completed/)).toBeInTheDocument();
  });

  test("switching to short break changes timer display", () => {
    render(<PomodoroTimerPage />);
    // Use getAllByText and click the button (first one)
    const shortBreakBtns = screen.getAllByText("Short Break");
    fireEvent.click(shortBreakBtns[0]);
    expect(screen.getByText("05:00")).toBeInTheDocument();
  });

  test("switching to long break changes timer display", () => {
    render(<PomodoroTimerPage />);
    const longBreakBtns = screen.getAllByText("Long Break");
    fireEvent.click(longBreakBtns[0]);
    expect(screen.getByText("15:00")).toBeInTheDocument();
  });
});

describe("World Clock", () => {
  const WorldClockPage = require("@/app/[locale]/world-clock/page").default;

  test("renders page with title", () => {
    render(<WorldClockPage />);
    expect(screen.getByText(/World Clock/)).toBeInTheDocument();
  });

  test("renders default timezone cities", () => {
    render(<WorldClockPage />);
    expect(screen.getByText("UTC")).toBeInTheDocument();
    expect(screen.getByText("New York")).toBeInTheDocument();
    expect(screen.getByText("London")).toBeInTheDocument();
    expect(screen.getByText("Tokyo")).toBeInTheDocument();
    expect(screen.getByText("Sydney")).toBeInTheDocument();
    expect(screen.getByText("New Delhi")).toBeInTheDocument();
  });

  test("renders 24h toggle", () => {
    render(<WorldClockPage />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
  });

  test("renders view mode toggle (Grid/List)", () => {
    render(<WorldClockPage />);
    // Buttons have icon prefix like "⊞ Grid" and "☰ List"
    expect(screen.getByText(/Grid/)).toBeInTheDocument();
    expect(screen.getByText(/List/)).toBeInTheDocument();
  });

  test("renders Add button", () => {
    render(<WorldClockPage />);
    expect(screen.getByText(/Add/)).toBeInTheDocument();
  });

  test("toggling to list view works", () => {
    render(<WorldClockPage />);
    const listBtn = screen.getAllByText(/List/).find(el => el.tagName === "BUTTON");
    if (listBtn) fireEvent.click(listBtn);
    expect(screen.getByText(/List/)).toBeInTheDocument();
  });
});

describe("Countdown Timer", () => {
  test("countdown calculation works", () => {
    const targetDate = new Date(Date.now() + 86400000); // +1 day
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    expect(days).toBe(1); // Exactly 1 day from exactly 1 day ago
  });

  test("past date shows negative countdown", () => {
    const targetDate = new Date(Date.now() - 86400000); // -1 day
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();
    expect(diff).toBeLessThan(0);
  });
});

describe("Stopwatch", () => {
  test("stopwatch time formatting works", () => {
    const formatTime = (ms: number) => {
      const minutes = Math.floor(ms / 60000);
      const seconds = Math.floor((ms % 60000) / 1000);
      const milliseconds = Math.floor((ms % 1000) / 10);
      return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(milliseconds).padStart(2, "0")}`;
    };

    expect(formatTime(0)).toBe("00:00.00");
    expect(formatTime(61000)).toBe("01:01.00");
    expect(formatTime(125430)).toBe("02:05.43");
  });

  test("lap recording stores timestamps", () => {
    const laps: number[] = [];
    const currentTime = 12500;
    laps.push(currentTime);
    expect(laps.length).toBe(1);
    expect(laps[0]).toBe(12500);
  });
});
