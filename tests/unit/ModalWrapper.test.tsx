import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ModalWrapper } from "@/app/component/ModalWrapper";

describe("ModalWrapper", () => {
  const onCloseMock = jest.fn();

  beforeEach(() => onCloseMock.mockClear());

  it("renders title and children when open", async () => {
    render(
      <ModalWrapper
        isOpen={true}
        onClose={onCloseMock}
        Title={<h1>My Modal</h1>}
      >
        <div>Modal Content</div>
      </ModalWrapper>
    );

    // Using waitFor to handle the delay in becoming visible
    await waitFor(() => {
      expect(screen.getByText("My Modal")).toBeInTheDocument();
      expect(screen.getByText("Modal Content")).toBeInTheDocument();
    });
  });

  it("calls onClose when the close button is clicked", async () => {
    render(
      <ModalWrapper isOpen={true} onClose={onCloseMock} Title={<h1>T</h1>}>
        <p>content</p>
      </ModalWrapper>
    );

    const closeButton = screen.getByRole("button", { name: /close button/i });
    await userEvent.click(closeButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when the overlay is clicked", async () => {
    render(
      <ModalWrapper isOpen={true} onClose={onCloseMock} Title={<h1>T</h1>}>
        <p>content</p>
      </ModalWrapper>
    );

    // Use the data-testid for a robust selector
    const overlay = screen.getByTestId("modal-overlay");
    await userEvent.click(overlay);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("is hidden when isOpen is false", () => {
    const { container } = render(
      <ModalWrapper isOpen={false} onClose={onCloseMock}>
        <div>Content</div>
      </ModalWrapper>
    );

    expect(container.firstChild).toHaveClass("hidden");
  });
});
