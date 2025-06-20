import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartTitleButton } from "@/app/component/CartTitleButton";

describe("CartTitleButton", () => {
  const onClickMock = jest.fn();

  beforeEach(() => onClickMock.mockClear());

  it("renders 'Add' button with green background when not in cart", () => {
    render(<CartTitleButton title="Add" onClick={onClickMock} />);
    const button = screen.getByRole("button", { name: /add/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-lightGreen");
  });

  it("renders disabled 'Add' button with gray background when in cart", () => {
    render(
      <CartTitleButton title="Add" onClick={onClickMock} isAleadyInCart />
    );
    const button = screen.getByRole("button", { name: /add/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-gray6");
    expect(button).toHaveClass("pointer-events-none");
  });

  it("renders 'Remove' button with red background", () => {
    render(<CartTitleButton title="Remove" onClick={onClickMock} />);
    const button = screen.getByRole("button", { name: /remove/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-red");
  });

  it("calls onClick when clicked", async () => {
    render(<CartTitleButton title="Add" onClick={onClickMock} />);
    const button = screen.getByRole("button", { name: /add/i });
    await userEvent.click(button);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});
 