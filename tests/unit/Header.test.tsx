import { render, screen } from "@testing-library/react";
import { Header } from "@/app/component/Header";

describe("Header", () => {
  it("renders the main title and navigation buttons", () => {
    render(<Header />);
    expect(screen.getByText("Build Your Body")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /join now|log out|loading!/i })
    ).toBeInTheDocument();
  });
});
