import { render, screen } from "@testing-library/react";
import ProgressBar from "@/components/ProgressBar";

describe("ProgressBar", () => {
  test("renders with correct percentage text", () => {
    render(<ProgressBar progress={50} />);
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  test("renders the bar with correct width", () => {
    const { container } = render(<ProgressBar progress={75} />);
    const bar = container.querySelector('[style*="width: 75%"]');
    expect(bar).toBeInTheDocument();
  });

  test("caps progress at 100%", () => {
    const { container } = render(<ProgressBar progress={150} />);
    const bar = container.querySelector('[style*="width: 100%"]');
    expect(bar).toBeInTheDocument();
    expect(screen.getByText("150%")).toBeInTheDocument();
  });

  test("returns null when progress is 0", () => {
    const { container } = render(<ProgressBar progress={0} />);
    expect(container.innerHTML).toBe("");
  });

  test("returns null when progress is negative", () => {
    const { container } = render(<ProgressBar progress={-10} />);
    expect(container.innerHTML).toBe("");
  });

  test("renders label when provided", () => {
    render(<ProgressBar progress={30} label="Uploading..." />);
    expect(screen.getByText("Uploading...")).toBeInTheDocument();
  });

  test("does not render label when not provided", () => {
    const { container } = render(<ProgressBar progress={30} />);
    const labelEl = container.querySelector("p.mb-1");
    expect(labelEl).not.toBeInTheDocument();
  });

  test("rounds percentage for display", () => {
    render(<ProgressBar progress={33.7} />);
    expect(screen.getByText("34%")).toBeInTheDocument();
  });
});
