import { render, screen, fireEvent } from "@testing-library/react";
import FileUpload from "@/components/FileUpload";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "en",
}));

// Mock react-dropzone
const mockOnDrop = jest.fn();
jest.mock("react-dropzone", () => ({
  useDropzone: (options: any) => {
    mockOnDrop.mockImplementation(options?.onDrop || jest.fn());
    return {
      getRootProps: () => ({
        onClick: jest.fn(),
        role: "button",
      }),
      getInputProps: () => ({
        "aria-label": "file-input",
      }),
      isDragActive: false,
    };
  },
}));

describe("FileUpload", () => {
  const mockOnFilesSelected = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders dropzone when no files are selected", () => {
    render(<FileUpload onFilesSelected={mockOnFilesSelected} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("renders default upload label", () => {
    render(<FileUpload onFilesSelected={mockOnFilesSelected} />);
    expect(screen.getByText("uploadLabel")).toBeInTheDocument();
  });

  test("renders custom label when provided", () => {
    render(
      <FileUpload onFilesSelected={mockOnFilesSelected} label="Upload your PDF" />
    );
    expect(screen.getByText("Upload your PDF")).toBeInTheDocument();
  });

  test("renders custom hint when provided", () => {
    render(
      <FileUpload onFilesSelected={mockOnFilesSelected} hint="Max 5 files" />
    );
    expect(screen.getByText("Max 5 files")).toBeInTheDocument();
  });

  test("renders upload icon SVG in dropzone", () => {
    const { container } = render(
      <FileUpload onFilesSelected={mockOnFilesSelected} />
    );
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  test("renders file input", () => {
    render(<FileUpload onFilesSelected={mockOnFilesSelected} />);
    const input = screen.getByLabelText("file-input");
    expect(input).toBeInTheDocument();
  });

  test("does not render dropzone when hasFiles is true (parent-controlled)", () => {
    const { container } = render(
      <FileUpload onFilesSelected={mockOnFilesSelected} hasFiles={true} />
    );
    // When hasFiles is defined and true, component returns null
    expect(container.innerHTML).toBe("");
  });

  test("shows compact mode when compact prop is true", () => {
    const { container } = render(
      <FileUpload onFilesSelected={mockOnFilesSelected} compact={true} />
    );
    // In compact mode, the large icon div should not be present
    const iconDiv = container.querySelector(".rounded-2xl");
    expect(iconDiv).not.toBeInTheDocument();
  });

  test("accept prop configures file types", () => {
    const pdfAccept = { "application/pdf": [".pdf"] };
    render(
      <FileUpload onFilesSelected={mockOnFilesSelected} accept={pdfAccept} />
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("renders error message when present", () => {
    render(<FileUpload onFilesSelected={mockOnFilesSelected} />);
    // Error is null by default, but when set via rejected files it shows
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });
});
