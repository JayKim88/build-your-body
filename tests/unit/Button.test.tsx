import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/app/component/Button";

describe("Button", () => {
  it("renders the title", () => {
    render(<Button title="Click me" onClick={() => {}} />);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const handleClick = jest.fn();
    render(<Button title="Click" onClick={handleClick} />);
    await userEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalled();
  });

  describe("when loading", () => {
    it("should be disabled and show a loader", async () => {
      const handleClick = jest.fn();
      render(<Button title="Loading" onClick={handleClick} loading />);

      const button = screen.getByRole("button", { name: /loading/i });

      expect(button).toBeDisabled();
      const spinLoader = screen.getByTestId("spin-loader");
      expect(spinLoader).toBeInTheDocument();
      expect(within(spinLoader).getByTestId("lottie-mock")).toBeVisible();

      await userEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button title="Disabled" onClick={() => {}} disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
