import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ManualButton } from "@/app/component/ManualButton";

// Mock window.open
const mockWindowOpen = jest.fn();
Object.defineProperty(window, "open", {
  value: mockWindowOpen,
});

describe("ManualButton", () => {
  beforeEach(() => mockWindowOpen.mockClear());

  it("renders the button with text and icon", () => {
    render(<ManualButton />);
    expect(screen.getByText("Manual")).toBeInTheDocument();
    // Check for the icon via its parent span, as the icon itself is harder to select
    expect(screen.getByText("Manual").previousSibling).toHaveClass(
      "svg-inline--fa"
    );
  });

  it("calls window.open with the correct URL when clicked", async () => {
    render(<ManualButton />);
    const button = screen.getByText("Manual").parentElement;
    if (button) {
      await userEvent.click(button);
    }
    const expectedUrl =
      "https://github.com/JayKim88/build-your-body?tab=readme-ov-file#overview-ui-and-manual";
    expect(mockWindowOpen).toHaveBeenCalledWith(expectedUrl, "_blank");
  });
});
