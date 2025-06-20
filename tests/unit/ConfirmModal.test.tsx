import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfirmModal } from "@/app/component/ConfirmModal";

describe("ConfirmModal", () => {
  const onClickMock = jest.fn();

  beforeEach(() => onClickMock.mockClear());

  it("calls onClick with false when 'Nope' is clicked", async () => {
    render(<ConfirmModal isOpen={true} onClick={onClickMock} />);
    const nopeButton = screen.getByRole("button", { name: /nope/i });
    await userEvent.click(nopeButton);
    expect(onClickMock).toHaveBeenCalledWith(false);
  });

  it("calls onClick with true when 'Yeah' is clicked", async () => {
    render(<ConfirmModal isOpen={true} onClick={onClickMock} />);
    const yeahButton = screen.getByRole("button", { name: /yeah/i });
    await userEvent.click(yeahButton);
    expect(onClickMock).toHaveBeenCalledWith(true);
  });

  it("is not visible when isOpen is false", () => {
    const { container } = render(
      <ConfirmModal isOpen={false} onClick={onClickMock} />
    );
    expect(container.firstChild).toHaveClass("hidden");
  });

  it("displays the custom content message", () => {
    const customMessage = "Delete this item?";
    render(
      <ConfirmModal
        isOpen={true}
        onClick={onClickMock}
        content={customMessage}
      />
    );
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });
});
