import { render, screen } from "@testing-library/react";
import { Menu } from "@/app/component/Menu";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

jest.mock("next-auth/react", () => ({
  __esModule: true,
  useSession: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  __esModule: true,
  usePathname: jest.fn(),
}));

describe("Menu", () => {
  beforeEach(() => {
    (useSession as jest.Mock).mockClear();
    (usePathname as jest.Mock).mockClear();
  });

  it("shows only public links when logged out", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: "unauthenticated",
    });
    (usePathname as jest.Mock).mockReturnValue("/");
    render(<Menu />);

    expect(screen.getByText("Exercises")).toBeInTheDocument();
    expect(screen.getByText("Communities")).toBeInTheDocument();
    expect(screen.queryByText("My Programs")).not.toBeInTheDocument();
    expect(screen.queryByText("My Stats")).not.toBeInTheDocument();
  });

  it("shows all links when logged in", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { name: "Test" } },
      status: "authenticated",
    });
    (usePathname as jest.Mock).mockReturnValue("/");
    render(<Menu />);

    expect(screen.getByText("Exercises")).toBeInTheDocument();
    expect(screen.getByText("Communities")).toBeInTheDocument();
    expect(screen.getByText("My Programs")).toBeInTheDocument();
    expect(screen.getByText("My Stats")).toBeInTheDocument();
  });

  it("highlights the active link", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: "unauthenticated",
    });
    (usePathname as jest.Mock).mockReturnValue("/exercises");
    render(<Menu />);

    const exercisesLink = screen.getByText("Exercises");
    // The class is on the parent `li` element
    expect(exercisesLink.closest("li")).toHaveClass("text-yellow");
  });
});
